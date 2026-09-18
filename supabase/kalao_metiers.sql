-- Modules métiers Groupe Kalao + clients particuliers / sociétés

alter table public.contacts
  add column if not exists account_type text;

update public.contacts
set account_type = case
  when company_id is null then 'individual'
  else 'company'
end
where account_type is null;

alter table public.invoices
  add column if not exists contact_id uuid references public.contacts(id) on delete set null;

create table if not exists public.departments (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  head_name text,
  head_image text,
  members_count text,
  location text default 'Abidjan',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.travel_dossiers (
  id uuid primary key default gen_random_uuid(),
  number text unique not null,
  company_id uuid references public.companies(id) on delete set null,
  contact_id uuid references public.contacts(id) on delete set null,
  account_name text not null,
  account_type text not null check (account_type in ('individual', 'company')),
  destination text not null,
  departure_date date,
  return_date date,
  status text not null default 'Devis',
  amount numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.immigration_dossiers (
  id uuid primary key default gen_random_uuid(),
  number text unique not null,
  company_id uuid references public.companies(id) on delete set null,
  contact_id uuid references public.contacts(id) on delete set null,
  account_name text not null,
  account_type text not null check (account_type in ('individual', 'company')),
  procedure text not null,
  country text not null,
  status text not null default 'Ouvert',
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.event_jobs (
  id uuid primary key default gen_random_uuid(),
  number text unique not null,
  title text not null,
  company_id uuid references public.companies(id) on delete set null,
  contact_id uuid references public.contacts(id) on delete set null,
  account_name text not null,
  account_type text not null check (account_type in ('individual', 'company')),
  event_date date,
  services text,
  status text not null default 'Devis',
  amount numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.event_job_lines (
  id uuid primary key default gen_random_uuid(),
  event_job_id uuid not null references public.event_jobs(id) on delete cascade,
  catalog_item_id uuid references public.catalog_items(id) on delete set null,
  label text not null,
  quantity numeric(12,2) not null default 1,
  unit_price numeric(12,2) not null default 0
);

create table if not exists public.plantations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company_id uuid references public.companies(id) on delete set null,
  crop text not null,
  location text,
  hectares numeric(12,2),
  season text,
  status text not null default 'En production',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.construction_sites (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company_id uuid references public.companies(id) on delete set null,
  contact_id uuid references public.contacts(id) on delete set null,
  account_name text not null,
  account_type text not null check (account_type in ('individual', 'company')),
  location text,
  progress text,
  status text not null default 'En cours',
  amount numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  kind text not null,
  location text,
  company_id uuid references public.companies(id) on delete set null,
  contact_id uuid references public.contacts(id) on delete set null,
  account_name text not null,
  account_type text not null check (account_type in ('individual', 'company')),
  rent numeric(12,2) not null default 0,
  status text not null default 'Libre',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payroll_entries (
  id uuid primary key default gen_random_uuid(),
  employee text not null,
  department text not null,
  period text not null,
  salary numeric(12,2) not null default 0,
  bonus numeric(12,2) not null default 0,
  status text not null default 'À verser',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace view public.accounts
with (security_invoker = true) as
select
  c.id,
  trim(c.first_name || ' ' || c.last_name) as name,
  'individual'::text as account_type,
  c.email,
  c.phone,
  null::text as city,
  c.created_at
from public.contacts c
where c.company_id is null
union all
select
  co.id,
  co.name,
  'company'::text as account_type,
  co.email,
  co.phone,
  co.city,
  co.created_at
from public.companies co;

alter table public.departments enable row level security;
alter table public.travel_dossiers enable row level security;
alter table public.immigration_dossiers enable row level security;
alter table public.event_jobs enable row level security;
alter table public.event_job_lines enable row level security;
alter table public.plantations enable row level security;
alter table public.construction_sites enable row level security;
alter table public.properties enable row level security;
alter table public.payroll_entries enable row level security;

do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'departments', 'travel_dossiers', 'immigration_dossiers',
    'event_jobs', 'event_job_lines', 'plantations',
    'construction_sites', 'properties', 'payroll_entries'
  ]
  loop
    execute format('drop policy if exists authenticated_all on public.%I', tbl);
    execute format(
      'create policy authenticated_all on public.%I for all to authenticated using (true) with check (true)',
      tbl
    );
  end loop;
end;
$$;
