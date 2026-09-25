-- V19 : rôles élargis + coupure des fuites anon / paie.
-- Pas de modification des factures ni des clients (scripts séparés, après OK).

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check
  check (role in (
    'super_admin', 'admin', 'manager', 'direction',
    'finance', 'commercial', 'rh', 'staff', 'agent'
  ));

create or replace function public.is_direction()
returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce(
    public.current_profile_role() in ('super_admin', 'admin', 'manager', 'direction'),
    false
  )
$$;

create or replace function public.is_hr()
returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce(
    public.current_profile_role() in ('super_admin', 'admin', 'direction', 'rh'),
    false
  )
$$;

revoke all on function public.is_direction() from public;
revoke all on function public.is_hr() from public;
grant execute on function public.is_direction() to authenticated;
grant execute on function public.is_hr() to authenticated;

drop policy if exists crm_app_all on public.travel_dossiers;
drop policy if exists crm_app_all on public.audit_logs;

drop policy if exists authenticated_all on public.payroll_entries;
create policy payroll_entries_hr on public.payroll_entries
  for all to authenticated
  using (public.is_hr())
  with check (public.is_hr());

drop policy if exists pay_runs_admin on public.pay_runs;
create policy pay_runs_hr on public.pay_runs
  for all to authenticated
  using (public.is_hr())
  with check (public.is_hr());
