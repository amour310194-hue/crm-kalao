-- V24 : matrice RLS (phase 2). Aucune donnee metier n'est modifiee.
-- Revoke anon, coupe authenticated_all / using(true) sur le coeur finance,
-- protege profiles.role, interdit DELETE factures/paiements.

create or replace function public.current_profile_role()
returns text
language sql stable security definer set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_crm_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce(
    public.current_profile_role() in ('super_admin', 'admin', 'manager', 'direction'),
    false
  )
$$;

create or replace function public.is_direction()
returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce(
    public.current_profile_role() in ('super_admin', 'admin', 'manager', 'direction'),
    false
  )
$$;

create or replace function public.is_finance()
returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce(
    public.current_profile_role() in ('super_admin', 'admin', 'manager', 'direction', 'finance'),
    false
  )
$$;

create or replace function public.is_staff()
returns boolean
language sql stable security definer set search_path = public
as $$
  select public.current_profile_role() is not null
$$;

create or replace function public.is_dossier_member(p_dossier_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select
    p_dossier_id is not null
    and (
      public.is_direction()
      or exists (
        select 1
        from public.dossier_members m
        join public.employees e on e.id = m.employee_id
        where m.dossier_id = p_dossier_id
          and e.profile_id = auth.uid()
      )
    )
$$;

create or replace function public.can_see_invoice(p_dossier_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select public.is_finance() or public.is_dossier_member(p_dossier_id)
$$;

revoke all on function public.current_profile_role() from public, anon;
revoke all on function public.is_crm_admin() from public, anon;
revoke all on function public.is_direction() from public, anon;
revoke all on function public.is_finance() from public, anon;
revoke all on function public.is_staff() from public, anon;
revoke all on function public.is_dossier_member(uuid) from public, anon;
revoke all on function public.can_see_invoice(uuid) from public, anon;
grant execute on function public.current_profile_role() to authenticated;
grant execute on function public.is_crm_admin() to authenticated;
grant execute on function public.is_direction() to authenticated;
grant execute on function public.is_finance() to authenticated;
grant execute on function public.is_staff() to authenticated;
grant execute on function public.is_dossier_member(uuid) to authenticated;
grant execute on function public.can_see_invoice(uuid) to authenticated;

do $$
declare r record;
begin
  for r in
    select tablename
    from pg_tables
    where schemaname = 'public'
  loop
    execute format('revoke all on table public.%I from anon, public', r.tablename);
  end loop;
end $$;

alter default privileges in schema public revoke all on tables from anon, public;

-- profiles : soi-meme + direction en lecture ; role non modifiable hors service_role
drop policy if exists authenticated_all on public.profiles;
drop policy if exists profiles_select on public.profiles;
drop policy if exists profiles_update on public.profiles;
create policy profiles_select on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_direction());
create policy profiles_update on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create or replace function public.protect_profile_role()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if tg_op = 'UPDATE' and new.role is distinct from old.role then
    if auth.role() is distinct from 'service_role' then
      raise exception 'role_interdit';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_protect_profile_role on public.profiles;
create trigger trg_protect_profile_role
  before update on public.profiles
  for each row execute function public.protect_profile_role();

-- factures / paiements / avoirs
drop policy if exists invoices_select on public.invoices;
drop policy if exists invoices_insert on public.invoices;
drop policy if exists invoices_update on public.invoices;
drop policy if exists invoices_delete on public.invoices;
create policy invoices_select on public.invoices
  for select to authenticated
  using (public.can_see_invoice(dossier_id));
create policy invoices_insert on public.invoices
  for insert to authenticated
  with check (public.is_finance());
create policy invoices_update on public.invoices
  for update to authenticated
  using (public.is_finance())
  with check (public.is_finance());

drop policy if exists authenticated_all on public.payments;
drop policy if exists payments_select on public.payments;
drop policy if exists payments_insert on public.payments;
drop policy if exists payments_update on public.payments;
drop policy if exists payments_delete on public.payments;
create policy payments_select on public.payments
  for select to authenticated
  using (
    exists (
      select 1 from public.invoices i
      where i.id = payments.invoice_id
        and public.can_see_invoice(i.dossier_id)
    )
  );
create policy payments_insert on public.payments
  for insert to authenticated
  with check (public.is_finance());
create policy payments_update on public.payments
  for update to authenticated
  using (public.is_finance())
  with check (public.is_finance());

drop policy if exists credit_notes_authenticated on public.credit_notes;
drop policy if exists credit_notes_select on public.credit_notes;
drop policy if exists credit_notes_write on public.credit_notes;
create policy credit_notes_select on public.credit_notes
  for select to authenticated
  using (
    invoice_id is null
    or exists (
      select 1 from public.invoices i
      where i.id = credit_notes.invoice_id
        and public.can_see_invoice(i.dossier_id)
    )
  );
create policy credit_notes_write on public.credit_notes
  for insert to authenticated
  with check (public.is_finance());
create policy credit_notes_update on public.credit_notes
  for update to authenticated
  using (public.is_finance())
  with check (public.is_finance());

-- dossiers / contacts / companies
drop policy if exists dossiers_select on public.dossiers;
drop policy if exists dossiers_insert on public.dossiers;
drop policy if exists dossiers_update on public.dossiers;
drop policy if exists dossiers_delete on public.dossiers;
create policy dossiers_select on public.dossiers
  for select to authenticated
  using (public.is_staff());
create policy dossiers_insert on public.dossiers
  for insert to authenticated
  with check (public.is_staff());
create policy dossiers_update on public.dossiers
  for update to authenticated
  using (public.is_staff())
  with check (public.is_staff());
create policy dossiers_delete on public.dossiers
  for delete to authenticated
  using (public.is_direction());

drop policy if exists companies_select on public.companies;
drop policy if exists companies_insert on public.companies;
drop policy if exists companies_update on public.companies;
drop policy if exists companies_delete on public.companies;
create policy companies_select on public.companies
  for select to authenticated
  using (public.is_staff());
create policy companies_insert on public.companies
  for insert to authenticated
  with check (public.is_staff());
create policy companies_update on public.companies
  for update to authenticated
  using (public.is_staff())
  with check (public.is_staff());
create policy companies_delete on public.companies
  for delete to authenticated
  using (public.is_direction());

drop policy if exists authenticated_all on public.contacts;
drop policy if exists contacts_select on public.contacts;
drop policy if exists contacts_insert on public.contacts;
drop policy if exists contacts_update on public.contacts;
drop policy if exists contacts_delete on public.contacts;
create policy contacts_select on public.contacts
  for select to authenticated
  using (public.is_staff());
create policy contacts_insert on public.contacts
  for insert to authenticated
  with check (public.is_staff());
create policy contacts_update on public.contacts
  for update to authenticated
  using (public.is_staff())
  with check (public.is_staff());
create policy contacts_delete on public.contacts
  for delete to authenticated
  using (public.is_direction());

drop policy if exists authenticated_all on public.dossier_members;
drop policy if exists dossier_members_select on public.dossier_members;
drop policy if exists dossier_members_write on public.dossier_members;
create policy dossier_members_select on public.dossier_members
  for select to authenticated
  using (public.is_staff());
create policy dossier_members_write on public.dossier_members
  for all to authenticated
  using (public.is_direction())
  with check (public.is_direction());

-- journal : lecture direction, ecriture interdite au client
drop policy if exists audit_logs_authenticated on public.audit_logs;
drop policy if exists audit_logs_select on public.audit_logs;
create policy audit_logs_select on public.audit_logs
  for select to authenticated
  using (public.is_direction());

-- tables encore ouvertes en authenticated_all : staff lecture/ecriture, delete direction
do $$
declare t text;
begin
  foreach t in array array[
    'activities', 'attachments', 'catalog_items', 'construction_sites',
    'conversations', 'deal_lines', 'deals', 'departments', 'dossier_assets',
    'dossier_checklist', 'dossier_milestones', 'dossier_purchases',
    'employee_assignments', 'event_job_lines', 'event_jobs',
    'immigration_dossiers', 'lead_affiliations', 'leads', 'messages',
    'plantations', 'properties', 'quote_lines', 'quotes', 'rent_receipts',
    'site_assignments', 'site_equipment', 'site_milestones', 'social_posts',
    'stock_locations', 'stock_movements', 'travel_dossiers'
  ]
  loop
    if exists (
      select 1 from pg_tables where schemaname = 'public' and tablename = t
    ) then
      execute format('drop policy if exists authenticated_all on public.%I', t);
      execute format('drop policy if exists staff_select on public.%I', t);
      execute format(
        'create policy staff_select on public.%I for select to authenticated using (public.is_staff())',
        t
      );
      execute format('drop policy if exists staff_insert on public.%I', t);
      execute format(
        'create policy staff_insert on public.%I for insert to authenticated with check (public.is_staff())',
        t
      );
      execute format('drop policy if exists staff_update on public.%I', t);
      execute format(
        'create policy staff_update on public.%I for update to authenticated using (public.is_staff()) with check (public.is_staff())',
        t
      );
      execute format('drop policy if exists admin_delete on public.%I', t);
      execute format(
        'create policy admin_delete on public.%I for delete to authenticated using (public.is_direction())',
        t
      );
    end if;
  end loop;
end $$;
