-- V28 : permissions de modules (pages/menus) par rôle.
-- Par défaut ouvert : seule une ligne allowed=false restreint l'accès.

create table if not exists public.module_permissions (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  module_key text not null,
  allowed boolean not null default true,
  updated_at timestamptz not null default now(),
  unique (role, module_key)
);

alter table public.module_permissions
  drop constraint if exists module_permissions_role_check;

alter table public.module_permissions
  add constraint module_permissions_role_check
  check (role in (
    'super_admin', 'admin', 'manager', 'direction',
    'finance', 'commercial', 'rh', 'staff', 'agent'
  ));

drop trigger if exists module_permissions_set_updated_at on public.module_permissions;
create trigger module_permissions_set_updated_at
  before update on public.module_permissions
  for each row execute procedure public.set_updated_at();

alter table public.module_permissions enable row level security;

revoke all on table public.module_permissions from anon, public;
grant select, insert, update, delete on table public.module_permissions to authenticated;

drop policy if exists module_permissions_select on public.module_permissions;
drop policy if exists module_permissions_insert on public.module_permissions;
drop policy if exists module_permissions_update on public.module_permissions;
drop policy if exists module_permissions_delete on public.module_permissions;

create policy module_permissions_select on public.module_permissions
  for select to authenticated
  using (true);

create policy module_permissions_insert on public.module_permissions
  for insert to authenticated
  with check (public.is_crm_admin());

create policy module_permissions_update on public.module_permissions
  for update to authenticated
  using (public.is_crm_admin())
  with check (public.is_crm_admin());

create policy module_permissions_delete on public.module_permissions
  for delete to authenticated
  using (public.is_crm_admin());

insert into public.module_permissions (role, module_key, allowed) values
  ('staff', 'hrm-payroll', false),
  ('agent', 'hrm-payroll', false),
  ('commercial', 'hrm-payroll', false),
  ('staff', 'user-management', false),
  ('agent', 'user-management', false),
  ('commercial', 'user-management', false)
on conflict (role, module_key) do nothing;
