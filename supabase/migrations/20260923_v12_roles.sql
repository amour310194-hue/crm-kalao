-- V12 : rôles honnêtes. Staff sans paie / sans delete masse.
-- SELECT/INSERT/UPDATE restent ouverts sur le commercial (12 visas).
-- Seul DELETE et la paie sont restreints.

create or replace function public.current_profile_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_crm_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_profile_role() in ('admin', 'manager'), false)
$$;

revoke all on function public.current_profile_role() from public;
revoke all on function public.is_crm_admin() from public;
grant execute on function public.current_profile_role() to authenticated;
grant execute on function public.is_crm_admin() to authenticated;

drop policy if exists authenticated_all on public.employees;
drop policy if exists employees_select on public.employees;
drop policy if exists employees_write on public.employees;
drop policy if exists employees_update on public.employees;
drop policy if exists employees_delete on public.employees;
create policy employees_select on public.employees
  for select to authenticated
  using (public.is_crm_admin() or profile_id = auth.uid());
create policy employees_insert on public.employees
  for insert to authenticated
  with check (public.is_crm_admin());
create policy employees_update on public.employees
  for update to authenticated
  using (public.is_crm_admin())
  with check (public.is_crm_admin());
create policy employees_delete on public.employees
  for delete to authenticated
  using (public.is_crm_admin());

drop policy if exists authenticated_all on public.pay_runs;
drop policy if exists pay_runs_admin on public.pay_runs;
create policy pay_runs_admin on public.pay_runs
  for all to authenticated
  using (public.is_crm_admin())
  with check (public.is_crm_admin());

drop policy if exists authenticated_all on public.invoices;
drop policy if exists invoices_select on public.invoices;
drop policy if exists invoices_insert on public.invoices;
drop policy if exists invoices_update on public.invoices;
drop policy if exists invoices_delete on public.invoices;
create policy invoices_select on public.invoices
  for select to authenticated using (true);
create policy invoices_insert on public.invoices
  for insert to authenticated with check (true);
create policy invoices_update on public.invoices
  for update to authenticated using (true) with check (true);
create policy invoices_delete on public.invoices
  for delete to authenticated using (public.is_crm_admin());

drop policy if exists authenticated_all on public.companies;
drop policy if exists companies_select on public.companies;
drop policy if exists companies_insert on public.companies;
drop policy if exists companies_update on public.companies;
drop policy if exists companies_delete on public.companies;
create policy companies_select on public.companies
  for select to authenticated using (true);
create policy companies_insert on public.companies
  for insert to authenticated with check (true);
create policy companies_update on public.companies
  for update to authenticated using (true) with check (true);
create policy companies_delete on public.companies
  for delete to authenticated using (public.is_crm_admin());

drop policy if exists authenticated_all on public.dossiers;
drop policy if exists dossiers_select on public.dossiers;
drop policy if exists dossiers_insert on public.dossiers;
drop policy if exists dossiers_update on public.dossiers;
drop policy if exists dossiers_delete on public.dossiers;
create policy dossiers_select on public.dossiers
  for select to authenticated using (true);
create policy dossiers_insert on public.dossiers
  for insert to authenticated with check (true);
create policy dossiers_update on public.dossiers
  for update to authenticated using (true) with check (true);
create policy dossiers_delete on public.dossiers
  for delete to authenticated using (public.is_crm_admin());
