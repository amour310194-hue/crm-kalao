-- Super-admin / RH peuvent créer un compte employé.
-- Réinitialisation de mot de passe stockée côté serveur (service_role only).

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check
  check (role in ('super_admin', 'admin', 'manager', 'rh', 'staff'));

update public.profiles
  set role = 'super_admin'
  where id = 'a1000000-0000-4000-8000-000000000001';

create or replace function public.is_crm_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_profile_role() in ('super_admin', 'admin', 'manager'), false)
$$;

create or replace function public.is_staff_manager()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    public.current_profile_role() in ('super_admin', 'admin', 'manager', 'rh'),
    false
  )
$$;

revoke all on function public.is_staff_manager() from public;
grant execute on function public.is_staff_manager() to authenticated;
grant execute on function public.is_crm_admin() to authenticated;

drop policy if exists employees_select on public.employees;
create policy employees_select on public.employees
  for select to authenticated
  using (public.is_staff_manager() or profile_id = auth.uid());

drop policy if exists employees_insert on public.employees;
create policy employees_insert on public.employees
  for insert to authenticated
  with check (public.is_staff_manager());

drop policy if exists employees_update on public.employees;
create policy employees_update on public.employees
  for update to authenticated
  using (public.is_staff_manager())
  with check (public.is_staff_manager());

create table if not exists public.password_resets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  code_hash text not null,
  token_hash text not null,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists password_resets_email_idx
  on public.password_resets (email, expires_at desc);

alter table public.password_resets enable row level security;
revoke all on public.password_resets from anon, authenticated, public;
