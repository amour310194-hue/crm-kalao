-- V40 : brouillon, lignes, échéancier, numéro FAC-KALAO-AAAA-xxxx.
-- Les numéros actuels sont copiés avant d'être remplacés.

create table if not exists public._backup_20261007_invoice_numbers (
  id uuid primary key,
  number text,
  created_at timestamptz,
  backed_up_at timestamptz not null default now()
);
insert into public._backup_20261007_invoice_numbers (id, number, created_at)
select i.id, i.number, i.created_at
from public.invoices i
where not exists (
  select 1 from public._backup_20261007_invoice_numbers b where b.id = i.id
);
revoke all on public._backup_20261007_invoice_numbers from anon, authenticated, public;

alter table public.invoices add column if not exists legacy_ref text;
alter table public.invoices add column if not exists issued_at timestamptz;
alter table public.invoices add column if not exists document_date date;
alter table public.invoices add column if not exists condition_text text;
alter table public.invoices add column if not exists billing_group_id uuid;
alter table public.invoices alter column number drop not null;

alter table public.invoices drop constraint if exists invoices_status_check;
alter table public.invoices
  add constraint invoices_status_check
  check (status in ('draft', 'paid', 'partially_paid', 'unpaid', 'overdue', 'cancelled'));

create table if not exists public.invoice_lines (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  catalog_item_id uuid references public.catalog_items(id) on delete set null,
  label text not null,
  quantity numeric not null check (quantity > 0),
  unit_price numeric not null check (unit_price >= 0),
  discount numeric not null default 0 check (discount >= 0),
  tax_rate numeric not null default 0 check (tax_rate >= 0),
  position integer not null default 1,
  created_at timestamptz not null default now()
);

create or replace function public.refresh_invoice_amount()
returns trigger
language plpgsql
as $$
declare
  inv uuid;
  cnt integer;
  total numeric;
  current_status text;
begin
  inv := coalesce(new.invoice_id, old.invoice_id);
  select count(*),
         coalesce(sum(round((quantity * unit_price - discount) * (1 + tax_rate / 100))), 0)
    into cnt, total
  from public.invoice_lines
  where invoice_id = inv;
  select status into current_status from public.invoices where id = inv;
  if cnt > 0 or current_status = 'draft' then
    update public.invoices
    set amount = total, updated_at = now()
    where id = inv;
  end if;
  return coalesce(new, old);
end;
$$;

drop trigger if exists invoice_lines_amount on public.invoice_lines;
create trigger invoice_lines_amount
  after insert or update or delete on public.invoice_lines
  for each row execute function public.refresh_invoice_amount();

create or replace function public.invoice_lines_draft_only()
returns trigger
language plpgsql
as $$
declare
  inv uuid;
  current_status text;
begin
  inv := coalesce(new.invoice_id, old.invoice_id);
  select status into current_status from public.invoices where id = inv;
  if current_status is distinct from 'draft' then
    raise exception 'facture_figee'
      using errcode = '42501',
            hint = 'Les lignes d''une facture émise ne se modifient plus.';
  end if;
  return coalesce(new, old);
end;
$$;

drop trigger if exists invoice_lines_draft_only_trg on public.invoice_lines;
create trigger invoice_lines_draft_only_trg
  before insert or update or delete on public.invoice_lines
  for each row execute function public.invoice_lines_draft_only();

-- Renumérotation des factures déjà émises, dans l'ordre de création.
with ordered as (
  select id,
         number as old_number,
         row_number() over (order by created_at, id) as n,
         extract(year from (created_at at time zone 'Africa/Douala'))::int as y
  from public.invoices
)
update public.invoices i
set legacy_ref = coalesce(i.legacy_ref, o.old_number),
    number = 'FAC-KALAO-' || o.y || '-' || lpad(o.n::text, 4, '0'),
    issued_at = coalesce(i.issued_at, i.created_at),
    document_date = coalesce(i.document_date, (i.created_at at time zone 'Africa/Douala')::date)
from ordered o
where i.id = o.id;

create sequence if not exists public.invoice_number_seq;
select setval(
  'public.invoice_number_seq',
  greatest((select count(*) from public.invoices), 1),
  (select count(*) from public.invoices) > 0
);

create unique index if not exists invoices_number_uidx
  on public.invoices (number)
  where number is not null;

create or replace function public.invoices_guard_number()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    new.status := 'draft';
    new.number := null;
    new.issued_at := null;
    new.paid_amount := 0;
    return new;
  end if;
  if current_setting('kalao.emitting', true) is distinct from '1' then
    if old.status = 'draft' and new.status is distinct from 'draft' then
      raise exception 'emission_reservee' using errcode = '42501';
    end if;
    if new.number is distinct from old.number then
      raise exception 'emission_reservee' using errcode = '42501';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists invoices_guard_number_trg on public.invoices;
create trigger invoices_guard_number_trg
  before insert or update on public.invoices
  for each row execute function public.invoices_guard_number();

create or replace function public.create_invoice_drafts(payload jsonb)
returns uuid[]
language plpgsql
security definer
set search_path = public
as $$
declare
  contact uuid;
  company uuid;
  dossier uuid;
  doc_date date;
  group_id uuid;
  line jsonb;
  inst jsonb;
  lines_total numeric := 0;
  inst_total numeric := 0;
  inv uuid;
  ids uuid[] := '{}';
  inst_count integer;
begin
  if not public.is_finance() then
    raise exception 'reserve_finance' using errcode = '42501';
  end if;
  contact := nullif(payload->>'contact_id', '')::uuid;
  dossier := nullif(payload->>'dossier_id', '')::uuid;
  if contact is null or dossier is null then
    raise exception 'client_dossier_requis';
  end if;
  select c.company_id into company from public.contacts c where c.id = contact;
  if not exists (
    select 1 from public.dossiers d
    where d.id = dossier
      and (
        d.contact_id = contact
        or (company is not null and d.company_id = company)
      )
  ) then
    raise exception 'dossier_client';
  end if;
  doc_date := coalesce(
    nullif(payload->>'document_date', '')::date,
    (now() at time zone 'Africa/Douala')::date
  );
  if jsonb_typeof(payload->'lines') is distinct from 'array'
     or jsonb_array_length(payload->'lines') = 0 then
    raise exception 'lignes_requises';
  end if;
  if jsonb_typeof(payload->'installments') is distinct from 'array'
     or jsonb_array_length(payload->'installments') = 0 then
    raise exception 'echeances_requises';
  end if;

  for line in select value from jsonb_array_elements(payload->'lines') loop
    if coalesce(line->>'label', '') = '' then
      raise exception 'ligne_libelle';
    end if;
    if coalesce((line->>'quantity')::numeric, 0) <= 0 then
      raise exception 'ligne_quantite';
    end if;
    if coalesce((line->>'unit_price')::numeric, -1) < 0 then
      raise exception 'ligne_prix';
    end if;
    if coalesce((line->>'discount')::numeric, 0) < 0
       or coalesce((line->>'discount')::numeric, 0)
          > (line->>'quantity')::numeric * (line->>'unit_price')::numeric then
      raise exception 'remise_trop_forte';
    end if;
    lines_total := lines_total + round(
      ((line->>'quantity')::numeric * (line->>'unit_price')::numeric
        - coalesce((line->>'discount')::numeric, 0))
      * (1 + coalesce((line->>'tax_rate')::numeric, 0) / 100)
    );
  end loop;

  for inst in select value from jsonb_array_elements(payload->'installments') loop
    if coalesce((inst->>'amount')::numeric, 0) <= 0 then
      raise exception 'echeance_montant';
    end if;
    if coalesce((inst->>'conditional')::boolean, false) then
      if coalesce(inst->>'condition', '') = '' then
        raise exception 'echeance_condition';
      end if;
    elsif coalesce(inst->>'due_date', '') = '' then
      raise exception 'echeance_date';
    end if;
    inst_total := inst_total + round((inst->>'amount')::numeric);
  end loop;

  if lines_total <> inst_total then
    raise exception 'echeances_total';
  end if;

  group_id := gen_random_uuid();
  inst_count := jsonb_array_length(payload->'installments');

  for inst in select value from jsonb_array_elements(payload->'installments') loop
    insert into public.invoices (
      company_id, contact_id, dossier_id, project, amount, paid_amount, status,
      due_date, is_conditional, condition_text, document_date, billing_group_id
    ) values (
      company,
      contact,
      dossier,
      coalesce(nullif(inst->>'label', ''), 'Échéance'),
      0,
      0,
      'draft',
      case
        when coalesce((inst->>'conditional')::boolean, false) then null
        else nullif(inst->>'due_date', '')::date
      end,
      coalesce((inst->>'conditional')::boolean, false),
      nullif(inst->>'condition', ''),
      doc_date,
      group_id
    )
    returning id into inv;

    if inst_count = 1 then
      insert into public.invoice_lines (
        invoice_id, catalog_item_id, label, quantity, unit_price, discount, tax_rate, position
      )
      select
        inv,
        nullif(elem->>'catalog_item_id', '')::uuid,
        elem->>'label',
        (elem->>'quantity')::numeric,
        (elem->>'unit_price')::numeric,
        coalesce((elem->>'discount')::numeric, 0),
        coalesce((elem->>'tax_rate')::numeric, 0),
        ord::int
      from jsonb_array_elements(payload->'lines') with ordinality as t(elem, ord);
    else
      insert into public.invoice_lines (
        invoice_id, label, quantity, unit_price, discount, tax_rate, position
      ) values (
        inv,
        coalesce(nullif(inst->>'label', ''), 'Échéance'),
        1,
        round((inst->>'amount')::numeric),
        0,
        0,
        1
      );
    end if;
    ids := ids || inv;
  end loop;
  return ids;
end;
$$;

create or replace function public.emit_invoice(p_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  current_status text;
  issued timestamptz;
  seq bigint;
  year_n integer;
  new_number text;
  total numeric;
  has_dossier uuid;
  conditional boolean;
  due date;
begin
  if not public.is_finance() then
    raise exception 'reserve_finance' using errcode = '42501';
  end if;
  select status, amount, dossier_id, is_conditional, due_date
    into current_status, total, has_dossier, conditional, due
  from public.invoices
  where id = p_id
  for update;
  if current_status is null then
    raise exception 'facture_introuvable';
  end if;
  if current_status is distinct from 'draft' then
    raise exception 'deja_emise';
  end if;
  if has_dossier is null then
    raise exception 'client_dossier_requis';
  end if;
  if not conditional and due is null then
    raise exception 'echeance_date';
  end if;
  if coalesce(total, 0) <= 0 then
    raise exception 'lignes_requises';
  end if;
  issued := now();
  year_n := extract(year from (issued at time zone 'Africa/Douala'))::int;
  seq := nextval('public.invoice_number_seq');
  new_number := 'FAC-KALAO-' || year_n || '-' || lpad(seq::text, 4, '0');
  perform set_config('kalao.emitting', '1', true);
  update public.invoices
  set number = new_number,
      status = 'unpaid',
      issued_at = issued,
      updated_at = now()
  where id = p_id;
  return new_number;
end;
$$;

create or replace function public.payments_block_draft()
returns trigger
language plpgsql
as $$
declare
  current_status text;
begin
  select status into current_status from public.invoices where id = new.invoice_id;
  if current_status = 'draft' then
    raise exception 'brouillon_non_encaisse' using errcode = '42501';
  end if;
  return new;
end;
$$;

drop trigger if exists payments_block_draft_trg on public.payments;
create trigger payments_block_draft_trg
  before insert on public.payments
  for each row execute function public.payments_block_draft();

-- Un brouillon sans encaissement peut être supprimé. Toute autre facture, non.
create or replace function public.forbid_finance_delete()
returns trigger
language plpgsql
as $$
begin
  if tg_table_name = 'invoices'
     and old.status = 'draft'
     and not exists (
       select 1 from public.payments p
       where p.invoice_id = old.id
         and coalesce(p.status, 'valide') = 'valide'
     ) then
    return old;
  end if;
  raise exception 'suppression_interdite'
    using errcode = '42501',
          hint = 'Une facture émise ou un encaissement s''annule, il ne se supprime pas.';
end;
$$;

revoke all on function public.create_invoice_drafts(jsonb) from public, anon;
revoke all on function public.emit_invoice(uuid) from public, anon;
grant execute on function public.create_invoice_drafts(jsonb) to authenticated;
grant execute on function public.emit_invoice(uuid) to authenticated;

alter table public.invoice_lines enable row level security;
drop policy if exists invoice_lines_select on public.invoice_lines;
drop policy if exists invoice_lines_write on public.invoice_lines;
create policy invoice_lines_select on public.invoice_lines
  for select to authenticated
  using (
    exists (
      select 1 from public.invoices i
      where i.id = invoice_lines.invoice_id
        and public.can_see_invoice(i.dossier_id)
    )
  );
create policy invoice_lines_write on public.invoice_lines
  for all to authenticated
  using (public.is_finance())
  with check (public.is_finance());
