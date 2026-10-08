-- V45 : qualité des clients, corbeille commerciale, vues enregistrées.
-- Aucune coordonnée existante n'est modifiée.

alter table public.contacts add column if not exists source text;
alter table public.contacts add column if not exists city text;
alter table public.contacts add column if not exists merged_into uuid references public.contacts(id);
alter table public.contacts add column if not exists tags text[] not null default '{}';

alter table public.leads add column if not exists archived_at timestamptz;
alter table public.leads add column if not exists tags text[] not null default '{}';
alter table public.leads add column if not exists assignee_id uuid references public.profiles(id);

alter table public.deals add column if not exists archived_at timestamptz;
alter table public.deals add column if not exists tags text[] not null default '{}';
alter table public.deals add column if not exists assignee_id uuid references public.profiles(id);

alter table public.activities add column if not exists archived_at timestamptz;
alter table public.activities add column if not exists tags text[] not null default '{}';
alter table public.activities add column if not exists assignee_id uuid references public.profiles(id);

create table if not exists public.saved_views (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  list_key text not null,
  name text not null,
  filters jsonb not null default '{}'::jsonb,
  columns jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  unique (user_id, list_key, name)
);

alter table public.saved_views enable row level security;
drop policy if exists saved_views_own on public.saved_views;
create policy saved_views_own on public.saved_views
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
grant select, insert, update, delete on public.saved_views to authenticated;

create or replace function public.audit_contact_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.audit_log (table_name, row_id, action, actor, before_data, after_data)
  values (
    'contacts',
    coalesce(new.id, old.id),
    lower(tg_op),
    auth.uid(),
    case when tg_op = 'INSERT' then null else to_jsonb(old) end,
    case when tg_op = 'DELETE' then null else to_jsonb(new) end
  );
  return coalesce(new, old);
end;
$$;

drop trigger if exists contacts_audit_trg on public.contacts;
create trigger contacts_audit_trg
  after insert or update or delete on public.contacts
  for each row execute function public.audit_contact_change();

drop policy if exists audit_log_select_contacts on public.audit_log;
create policy audit_log_select_contacts on public.audit_log
  for select to authenticated
  using (table_name = 'contacts');

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
     or new.company_id is distinct from old.company_id
     or (
       new.contact_id is distinct from old.contact_id
       and current_setting('kalao.merging', true) is distinct from '1'
     ) then
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

create or replace function public.merge_contacts(p_keep uuid, p_drop uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_keep = p_drop then
    raise exception 'meme_fiche';
  end if;
  if not exists (select 1 from public.contacts where id = p_keep and merged_into is null) then
    raise exception 'fiche_introuvable';
  end if;
  if not exists (select 1 from public.contacts where id = p_drop and merged_into is null) then
    raise exception 'fiche_introuvable';
  end if;
  perform set_config('kalao.merging', '1', true);
  update public.dossiers set contact_id = p_keep where contact_id = p_drop;
  update public.invoices set contact_id = p_keep where contact_id = p_drop;
  update public.leads set contact_id = p_keep where contact_id = p_drop;
  update public.deals set contact_id = p_keep where contact_id = p_drop;
  update public.quotes set contact_id = p_keep where contact_id = p_drop;
  update public.activities set contact_id = p_keep where contact_id = p_drop;
  update public.contacts keep
  set phone = coalesce(nullif(keep.phone, ''), drop_row.phone),
      email = coalesce(nullif(keep.email, ''), drop_row.email),
      city = coalesce(nullif(keep.city, ''), drop_row.city),
      source = coalesce(nullif(keep.source, ''), drop_row.source),
      nationality = coalesce(nullif(keep.nationality, ''), drop_row.nationality),
      birth_date = coalesce(keep.birth_date, drop_row.birth_date),
      job_title = coalesce(nullif(keep.job_title, ''), drop_row.job_title)
  from public.contacts drop_row
  where keep.id = p_keep and drop_row.id = p_drop;
  update public.contacts set merged_into = p_keep where id = p_drop;
  insert into public.audit_log (table_name, row_id, action, actor, reason)
  values ('contacts', p_keep, 'fusion', auth.uid(), p_drop::text);
end;
$$;

create or replace function public.archive_commercial(p_table text, p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_table not in ('leads', 'deals', 'activities') then
    raise exception 'archive_interdite';
  end if;
  execute format('update public.%I set archived_at = now() where id = $1', p_table) using p_id;
end;
$$;

create or replace function public.restore_commercial(p_table text, p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  stamp timestamptz;
begin
  if p_table not in ('leads', 'deals', 'activities') then
    raise exception 'archive_interdite';
  end if;
  execute format('select archived_at from public.%I where id = $1', p_table) into stamp using p_id;
  if stamp is null then
    return;
  end if;
  if stamp < now() - interval '30 days' then
    raise exception 'restauration_expiree';
  end if;
  execute format('update public.%I set archived_at = null where id = $1', p_table) using p_id;
end;
$$;

revoke all on function public.merge_contacts(uuid, uuid) from public, anon;
revoke all on function public.archive_commercial(text, uuid) from public, anon;
revoke all on function public.restore_commercial(text, uuid) from public, anon;
grant execute on function public.merge_contacts(uuid, uuid) to authenticated;
grant execute on function public.archive_commercial(text, uuid) to authenticated;
grant execute on function public.restore_commercial(text, uuid) to authenticated;

-- Rollback :
-- drop trigger if exists contacts_audit_trg on public.contacts;
-- drop function if exists public.restore_commercial(text, uuid);
-- drop function if exists public.archive_commercial(text, uuid);
-- drop function if exists public.merge_contacts(uuid, uuid);
-- drop function if exists public.audit_contact_change();
-- drop table if exists public.saved_views;
-- alter table public.contacts drop column if exists tags, drop column if exists merged_into, drop column if exists city, drop column if exists source;
-- alter table public.leads drop column if exists assignee_id, drop column if exists tags, drop column if exists archived_at;
-- alter table public.deals drop column if exists assignee_id, drop column if exists tags, drop column if exists archived_at;
-- alter table public.activities drop column if exists assignee_id, drop column if exists tags, drop column if exists archived_at;
