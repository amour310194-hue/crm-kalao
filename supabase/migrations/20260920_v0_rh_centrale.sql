-- V0 RH centrale : un salarié, plusieurs pôles. Ne remplace pas departments existants.

insert into public.departments (code, name, status)
values
  ('DEP-COM', 'Commerce', 'active'),
  ('DEP-BTP', 'BTP', 'active'),
  ('DEP-AGR', 'Agriculture', 'active'),
  ('DEP-EVE', 'Événementiel', 'active'),
  ('DEP-VOY', 'Voyages', 'active')
on conflict (code) do nothing;

create table if not exists public.employees (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid unique references public.profiles(id) on delete set null,
  full_name text not null,
  email text,
  phone text,
  job_title text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists employees_updated_at on public.employees;
create trigger employees_updated_at
  before update on public.employees
  for each row execute function public.set_updated_at();

create table if not exists public.employee_assignments (
  employee_id uuid not null references public.employees(id) on delete cascade,
  department_id uuid not null references public.departments(id) on delete cascade,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (employee_id, department_id)
);

create index if not exists employee_assignments_department_id_idx
  on public.employee_assignments (department_id);

alter table public.employees enable row level security;
alter table public.employee_assignments enable row level security;

drop policy if exists authenticated_all on public.employees;
create policy authenticated_all on public.employees
  for all to authenticated using (true) with check (true);

drop policy if exists authenticated_all on public.employee_assignments;
create policy authenticated_all on public.employee_assignments
  for all to authenticated using (true) with check (true);
