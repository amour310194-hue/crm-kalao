-- Module BTP : chantiers enrichis, matériel, affectations, avancement

alter table public.construction_sites
  add column if not exists number text,
  add column if not exists manager text,
  add column if not exists start_date date,
  add column if not exists end_date date,
  add column if not exists phase text,
  add column if not exists team_size integer;

create unique index if not exists construction_sites_number_uidx
  on public.construction_sites (number)
  where number is not null;

create table if not exists public.site_equipment (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  kind text not null check (kind in ('Engin', 'Outil', 'Stock')),
  site_name text,
  quantity text not null default '1',
  condition text,
  status text not null default 'Disponible',
  created_at timestamptz not null default now()
);

create table if not exists public.site_assignments (
  id uuid primary key default gen_random_uuid(),
  employee text not null,
  role text not null,
  site_name text not null,
  start_date date,
  end_date date,
  attendance text,
  status text not null default 'Affecté',
  created_at timestamptz not null default now()
);

create table if not exists public.site_milestones (
  id uuid primary key default gen_random_uuid(),
  site_name text not null,
  phase text not null,
  progress integer not null default 0,
  recorded_at date,
  note text,
  status text not null default 'En cours',
  created_at timestamptz not null default now()
);

alter table public.site_equipment enable row level security;
alter table public.site_assignments enable row level security;
alter table public.site_milestones enable row level security;

do $$
declare
  tbl text;
begin
  foreach tbl in array array['site_equipment', 'site_assignments', 'site_milestones']
  loop
    execute format('drop policy if exists authenticated_all on public.%I', tbl);
    execute format(
      'create policy authenticated_all on public.%I for all to authenticated using (true) with check (true)',
      tbl
    );
  end loop;
end;
$$;
