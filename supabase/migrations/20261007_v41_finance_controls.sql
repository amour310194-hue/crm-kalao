-- V41 : modification et annulation contrôlées.
-- Additif. Aucune table ni colonne existante n'est renommée ni supprimée.
-- Rollback commenté en bas de fichier : ne pas l'exécuter avec les migrations.

alter table public.invoices add column if not exists cancel_reason text;
alter table public.invoices add column if not exists cancelled_at timestamptz;
alter table public.invoices add column if not exists cancelled_by uuid;

alter table public.payments add column if not exists collected_by uuid;
alter table public.payments add column if not exists attachment_url text;

alter table public.credit_notes add column if not exists created_by uuid;
alter table public.credit_notes add column if not exists document_date date;

alter table public.cash_operations
  add column if not exists credit_note_id uuid references public.credit_notes(id);

create sequence if not exists public.credit_note_number_seq;

create table if not exists public.finance_approvals (
  id uuid primary key default gen_random_uuid(),
  entity text not null check (entity in ('invoice', 'payment', 'credit_note')),
  entity_id uuid not null,
  action text not null check (action in ('update', 'cancel', 'refund')),
  payload jsonb not null default '{}'::jsonb,
  reason text not null,
  requested_by uuid not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  decided_by uuid,
  decided_at timestamptz,
  decision_note text,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  table_name text not null,
  row_id uuid,
  action text not null,
  actor uuid,
  reason text,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_log_row_idx on public.audit_log (table_name, row_id, created_at desc);
create index if not exists finance_approvals_status_idx on public.finance_approvals (status, created_at desc);

create or replace function public.can_approve_finance()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_profile_role() in ('super_admin', 'admin', 'direction'), false)
$$;

create or replace function public.finance_period_closed(p_day date)
returns boolean
language sql
stable
as $$
  select false
$$;

create or replace function public.audit_finance_row()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.audit_log (table_name, row_id, action, actor, reason, before_data, after_data)
  values (
    tg_table_name,
    coalesce(new.id, old.id),
    lower(tg_op),
    auth.uid(),
    nullif(current_setting('kalao.finance_reason', true), ''),
    case when tg_op = 'INSERT' then null else to_jsonb(old) end,
    case when tg_op = 'DELETE' then null else to_jsonb(new) end
  );
  return coalesce(new, old);
end;
$$;

drop trigger if exists invoices_audit on public.invoices;
create trigger invoices_audit
  after insert or update or delete on public.invoices
  for each row execute function public.audit_finance_row();

drop trigger if exists payments_audit on public.payments;
create trigger payments_audit
  after insert or update or delete on public.payments
  for each row execute function public.audit_finance_row();

drop trigger if exists credit_notes_audit on public.credit_notes;
create trigger credit_notes_audit
  after insert or update or delete on public.credit_notes
  for each row execute function public.audit_finance_row();

create or replace function public.invoices_lock_issued()
returns trigger
language plpgsql
as $$
declare
  business_changed boolean;
  payment_refresh boolean;
  doc_day date;
begin
  if tg_op <> 'UPDATE' then
    return new;
  end if;

  doc_day := coalesce(
    old.document_date,
    (old.issued_at at time zone 'Africa/Douala')::date,
    (old.created_at at time zone 'Africa/Douala')::date
  );

  payment_refresh :=
    old.status is distinct from 'draft'
    and new.amount is not distinct from old.amount
    and new.contact_id is not distinct from old.contact_id
    and new.company_id is not distinct from old.company_id
    and new.project is not distinct from old.project
    and new.due_date is not distinct from old.due_date
    and new.dossier_id is not distinct from old.dossier_id
    and new.is_conditional is not distinct from old.is_conditional
    and new.condition_text is not distinct from old.condition_text
    and new.number is not distinct from old.number
    and new.status in ('unpaid', 'partially_paid', 'paid', 'overdue')
    and old.status is distinct from 'cancelled';

  if payment_refresh then
    return new;
  end if;

  if public.finance_period_closed(doc_day) then
    raise exception 'mois_cloture' using errcode = '42501';
  end if;

  if old.status = 'draft' then
    return new;
  end if;

  if new.amount is distinct from old.amount
     or new.contact_id is distinct from old.contact_id
     or new.company_id is distinct from old.company_id then
    raise exception 'montant_fige' using errcode = '42501';
  end if;

  business_changed :=
    new.project is distinct from old.project
    or new.due_date is distinct from old.due_date
    or new.dossier_id is distinct from old.dossier_id
    or new.is_conditional is distinct from old.is_conditional
    or new.condition_text is distinct from old.condition_text
    or new.status is distinct from old.status;

  if business_changed and current_setting('kalao.approved', true) is distinct from '1' then
    raise exception 'validation_requise' using errcode = '42501';
  end if;

  if business_changed and coalesce(current_setting('kalao.finance_reason', true), '') = '' then
    raise exception 'motif_obligatoire' using errcode = '42501';
  end if;

  if new.status = 'cancelled' and old.status is distinct from 'cancelled' then
    if exists (
      select 1 from public.payments p
      where p.invoice_id = old.id
        and coalesce(p.status, 'valide') = 'valide'
    ) then
      raise exception 'paiements_ouverts' using errcode = '42501';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists invoices_lock_issued_trg on public.invoices;
create trigger invoices_lock_issued_trg
  before update on public.invoices
  for each row execute function public.invoices_lock_issued();

create or replace function public.payments_block_draft()
returns trigger
language plpgsql
as $$
declare
  current_status text;
  rest numeric;
begin
  if public.finance_period_closed(new.paid_at) then
    raise exception 'mois_cloture' using errcode = '42501';
  end if;

  select status, coalesce(amount, 0) - coalesce(paid_amount, 0)
    into current_status, rest
  from public.invoices
  where id = new.invoice_id;

  if current_status = 'draft' then
    raise exception 'brouillon_non_encaisse' using errcode = '42501';
  end if;
  if current_status = 'cancelled' then
    raise exception 'facture_annulee' using errcode = '42501';
  end if;
  if new.method not in ('cash', 'mtn_momo', 'orange_money', 'bank_transfer', 'cheque', 'card') then
    raise exception 'mode_invalide' using errcode = '42501';
  end if;
  if new.method <> 'cash' and coalesce(new.transaction_id, '') = '' then
    raise exception 'reference_requise' using errcode = '42501';
  end if;
  if new.amount > coalesce(rest, 0) then
    raise exception 'trop_percu' using errcode = '42501';
  end if;
  if new.collected_by is null then
    new.collected_by := auth.uid();
  end if;
  return new;
end;
$$;

create or replace function public.payments_lock_update()
returns trigger
language plpgsql
as $$
declare
  changed boolean;
begin
  if public.finance_period_closed(old.paid_at) or public.finance_period_closed(new.paid_at) then
    raise exception 'mois_cloture' using errcode = '42501';
  end if;
  if new.amount is distinct from old.amount then
    raise exception 'montant_fige' using errcode = '42501';
  end if;
  changed :=
    new.paid_at is distinct from old.paid_at
    or new.method is distinct from old.method
    or new.transaction_id is distinct from old.transaction_id
    or new.notes is distinct from old.notes
    or new.status is distinct from old.status;
  if not changed then
    return new;
  end if;
  if current_setting('kalao.approved', true) is distinct from '1' then
    raise exception 'validation_requise' using errcode = '42501';
  end if;
  if coalesce(current_setting('kalao.finance_reason', true), '') = '' then
    raise exception 'motif_obligatoire' using errcode = '42501';
  end if;
  if new.status = 'annule' and old.status is distinct from 'annule' then
    if old.collected_by is not null and old.collected_by = auth.uid() then
      raise exception 'auteur_interdit' using errcode = '42501';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists payments_lock_update_trg on public.payments;
create trigger payments_lock_update_trg
  before update on public.payments
  for each row execute function public.payments_lock_update();

create or replace function public.request_finance_change(
  p_entity text,
  p_id uuid,
  p_action text,
  p_payload jsonb,
  p_reason text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  role text;
  author uuid;
  approval uuid;
begin
  if not public.is_finance() then
    raise exception 'reserve_finance' using errcode = '42501';
  end if;
  if coalesce(trim(p_reason), '') = '' then
    raise exception 'motif_obligatoire' using errcode = '42501';
  end if;
  role := public.current_profile_role();
  if p_action = 'cancel' and role not in ('super_admin', 'admin', 'direction', 'finance') then
    raise exception 'annulation_reservee' using errcode = '42501';
  end if;
  if p_entity = 'payment' and p_action = 'cancel' then
    select collected_by into author from public.payments where id = p_id;
    if author is not null and author = auth.uid() then
      raise exception 'auteur_interdit' using errcode = '42501';
    end if;
  end if;
  insert into public.finance_approvals (entity, entity_id, action, payload, reason, requested_by)
  values (p_entity, p_id, p_action, coalesce(p_payload, '{}'::jsonb), trim(p_reason), auth.uid())
  returning id into approval;
  insert into public.audit_log (table_name, row_id, action, actor, reason, after_data)
  values (p_entity, p_id, 'demande', auth.uid(), trim(p_reason), jsonb_build_object('approval', approval, 'action', p_action));
  return approval;
end;
$$;

create or replace function public.decide_finance_change(
  p_id uuid,
  p_approve boolean,
  p_note text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  row public.finance_approvals%rowtype;
  note text;
  year_n integer;
  seq bigint;
  avoir text;
  inv public.invoices%rowtype;
  pay public.payments%rowtype;
begin
  if not public.can_approve_finance() then
    raise exception 'validation_reservee' using errcode = '42501';
  end if;
  select * into row from public.finance_approvals where id = p_id for update;
  if row.id is null then
    raise exception 'demande_introuvable';
  end if;
  if row.status <> 'pending' then
    raise exception 'deja_decidee';
  end if;
  if row.requested_by = auth.uid() then
    raise exception 'auteur_interdit' using errcode = '42501';
  end if;

  if not p_approve then
    update public.finance_approvals
    set status = 'rejected', decided_by = auth.uid(), decided_at = now(), decision_note = nullif(trim(coalesce(p_note, '')), '')
    where id = p_id;
    return jsonb_build_object('ok', true, 'status', 'rejected');
  end if;

  note := row.reason;
  perform set_config('kalao.approved', '1', true);
  perform set_config('kalao.finance_reason', note, true);

  if row.entity = 'invoice' and row.action = 'update' then
    update public.invoices
    set
      project = case when row.payload ? 'project' then nullif(row.payload->>'project', '') else project end,
      due_date = case when row.payload ? 'due_date' then nullif(row.payload->>'due_date', '')::date else due_date end,
      dossier_id = case when row.payload ? 'dossier_id' then nullif(row.payload->>'dossier_id', '')::uuid else dossier_id end,
      is_conditional = case when row.payload ? 'is_conditional' then (row.payload->>'is_conditional')::boolean else is_conditional end,
      condition_text = case when row.payload ? 'condition_text' then nullif(row.payload->>'condition_text', '') else condition_text end,
      updated_at = now()
    where id = row.entity_id
      and status <> 'draft';
  elsif row.entity = 'invoice' and row.action = 'cancel' then
    select * into inv from public.invoices where id = row.entity_id for update;
    if inv.status = 'cancelled' then
      raise exception 'deja_annulee';
    end if;
    if exists (
      select 1 from public.payments p
      where p.invoice_id = inv.id and coalesce(p.status, 'valide') = 'valide'
    ) then
      raise exception 'paiements_ouverts' using errcode = '42501';
    end if;
    year_n := extract(year from (now() at time zone 'Africa/Douala'))::int;
    seq := nextval('public.credit_note_number_seq');
    avoir := 'AVOIR-KALAO-' || year_n || '-' || lpad(seq::text, 4, '0');
    insert into public.credit_notes (invoice_id, number, amount, reason, created_by, document_date)
    values (inv.id, avoir, inv.amount, note, row.requested_by, (now() at time zone 'Africa/Douala')::date);
    update public.invoices
    set status = 'cancelled',
        cancel_reason = note,
        cancelled_at = now(),
        cancelled_by = row.requested_by,
        updated_at = now()
    where id = inv.id;
  elsif row.entity = 'payment' and row.action = 'update' then
    update public.payments
    set
      paid_at = case when row.payload ? 'paid_at' then (row.payload->>'paid_at')::date else paid_at end,
      method = case when row.payload ? 'method' then row.payload->>'method' else method end,
      transaction_id = case when row.payload ? 'transaction_id' then nullif(row.payload->>'transaction_id', '') else transaction_id end,
      notes = case when row.payload ? 'notes' then nullif(row.payload->>'notes', '') else notes end
    where id = row.entity_id
      and coalesce(status, 'valide') = 'valide';
  elsif row.entity = 'payment' and row.action = 'cancel' then
    select * into pay from public.payments where id = row.entity_id for update;
    if pay.collected_by is not null and pay.collected_by = row.requested_by then
      raise exception 'auteur_interdit' using errcode = '42501';
    end if;
    update public.payments
    set status = 'annule',
        cancelled_at = now(),
        cancelled_by = row.requested_by,
        cancel_reason = note
    where id = row.entity_id
      and coalesce(status, 'valide') = 'valide';
  elsif row.action = 'refund' then
    if exists (
      select 1 from public.cash_operations c
      where c.credit_note_id = (row.payload->>'credit_note_id')::uuid
    ) then
      raise exception 'deja_rembourse';
    end if;
    insert into public.cash_operations (kind, direction, label, amount, occurred_at, method, notes, credit_note_id)
    select
      'retrait',
      'sortie',
      'Remboursement ' || cn.number,
      cn.amount,
      (now() at time zone 'Africa/Douala')::date,
      'cash',
      note,
      cn.id
    from public.credit_notes cn
    where cn.id = (row.payload->>'credit_note_id')::uuid;
  else
    raise exception 'action_inconnue';
  end if;

  update public.finance_approvals
  set status = 'approved', decided_by = auth.uid(), decided_at = now(), decision_note = nullif(trim(coalesce(p_note, '')), '')
  where id = p_id;

  return jsonb_build_object('ok', true, 'status', 'approved', 'credit_note', avoir);
end;
$$;

create or replace function public.append_audit(
  p_table text,
  p_row uuid,
  p_action text,
  p_reason text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_finance() then
    raise exception 'reserve_finance' using errcode = '42501';
  end if;
  insert into public.audit_log (table_name, row_id, action, actor, reason)
  values (p_table, p_row, p_action, auth.uid(), nullif(trim(p_reason), ''));
end;
$$;

grant delete on table public.invoices to authenticated;
drop policy if exists invoices_delete_draft on public.invoices;
create policy invoices_delete_draft on public.invoices
  for delete to authenticated
  using (
    public.is_finance()
    and status = 'draft'
    and not exists (
      select 1 from public.payments p
      where p.invoice_id = invoices.id
        and coalesce(p.status, 'valide') = 'valide'
    )
  );

alter table public.finance_approvals enable row level security;
alter table public.audit_log enable row level security;
drop policy if exists finance_approvals_select on public.finance_approvals;
create policy finance_approvals_select on public.finance_approvals
  for select to authenticated
  using (public.is_finance());
drop policy if exists audit_log_select on public.audit_log;
create policy audit_log_select on public.audit_log
  for select to authenticated
  using (public.is_finance());

revoke all on function public.request_finance_change(text, uuid, text, jsonb, text) from public, anon;
revoke all on function public.decide_finance_change(uuid, boolean, text) from public, anon;
revoke all on function public.append_audit(text, uuid, text, text) from public, anon;
revoke all on function public.can_approve_finance() from public, anon;
grant execute on function public.request_finance_change(text, uuid, text, jsonb, text) to authenticated;
grant execute on function public.decide_finance_change(uuid, boolean, text) to authenticated;
grant execute on function public.append_audit(text, uuid, text, text) to authenticated;
grant execute on function public.can_approve_finance() to authenticated;

-- Reprise de la date de INV-C14-AV, si le paiement du 23 septembre existe encore.
insert into public.audit_log (table_name, row_id, action, reason, before_data, after_data)
select
  'payments',
  p.id,
  'reprise',
  'Modification volontaire du 24 au 23 septembre 2026, reprise dans le journal.',
  jsonb_build_object('paid_at', '2026-09-24'),
  jsonb_build_object('paid_at', p.paid_at)
from public.payments p
join public.invoices i on i.id = p.invoice_id
where (i.number = 'INV-C14-AV' or i.legacy_ref = 'INV-C14-AV')
  and p.paid_at = date '2026-09-23'
  and not exists (
    select 1 from public.audit_log a
    where a.row_id = p.id and a.action = 'reprise'
  );

-- Rollback (à lancer à la main, pas par le dossier migrations) :
-- drop trigger if exists invoices_lock_issued_trg on public.invoices;
-- drop trigger if exists payments_lock_update_trg on public.payments;
-- drop trigger if exists invoices_audit on public.invoices;
-- drop trigger if exists payments_audit on public.payments;
-- drop trigger if exists credit_notes_audit on public.credit_notes;
-- drop function if exists public.decide_finance_change(uuid, boolean, text);
-- drop function if exists public.request_finance_change(text, uuid, text, jsonb, text);
-- drop function if exists public.append_audit(text, uuid, text, text);
-- drop function if exists public.invoices_lock_issued();
-- drop function if exists public.payments_lock_update();
-- drop table if exists public.finance_approvals;
-- drop table if exists public.audit_log;
-- Les colonnes ajoutées restent : les retirer casserait un historique déjà écrit.
