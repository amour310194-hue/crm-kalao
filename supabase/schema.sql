-- CRM ventes produits + services
-- À coller dans Supabase → SQL Editor → Run
-- Puis Authentication → Providers : Email activé

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Profil lié au compte Auth
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'admin' check (role in ('admin', 'manager', 'staff')),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Clients B2B
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text,
  website text,
  phone text,
  email text,
  address text,
  city text,
  country text default 'France',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger companies_updated_at
  before update on public.companies
  for each row execute procedure public.set_updated_at();

-- Contacts
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete set null,
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  job_title text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger contacts_updated_at
  before update on public.contacts
  for each row execute procedure public.set_updated_at();

-- Prospects
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete set null,
  contact_id uuid references public.contacts(id) on delete set null,
  title text not null,
  source text,
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'unqualified', 'converted')),
  estimated_value numeric(12,2) default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger leads_updated_at
  before update on public.leads
  for each row execute procedure public.set_updated_at();

-- Catalogue unique : produits ET services
create table if not exists public.catalog_items (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('product', 'service')),
  name text not null,
  sku text unique,
  description text,
  category text,
  unit_price numeric(12,2) not null default 0,
  tax_rate numeric(5,2) not null default 20,
  status text not null default 'active' check (status in ('active', 'inactive')),
  unit text,
  track_stock boolean not null default false,
  stock_qty numeric(12,2),
  duration_minutes integer,
  billing_type text check (billing_type in ('one_time', 'hourly', 'daily', 'monthly', 'yearly')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger catalog_items_updated_at
  before update on public.catalog_items
  for each row execute procedure public.set_updated_at();

-- Opportunités / deals
create table if not exists public.deals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company_id uuid references public.companies(id) on delete set null,
  contact_id uuid references public.contacts(id) on delete set null,
  lead_id uuid references public.leads(id) on delete set null,
  stage text not null default 'qualification' check (stage in (
    'qualification', 'proposal', 'negotiation', 'won', 'lost'
  )),
  amount numeric(12,2) not null default 0,
  probability integer not null default 10,
  expected_close_date date,
  lost_reason text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger deals_updated_at
  before update on public.deals
  for each row execute procedure public.set_updated_at();

create table if not exists public.deal_lines (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references public.deals(id) on delete cascade,
  catalog_item_id uuid references public.catalog_items(id) on delete set null,
  kind text not null check (kind in ('product', 'service')),
  label text not null,
  quantity numeric(12,2) not null default 1,
  unit_price numeric(12,2) not null default 0,
  tax_rate numeric(5,2) not null default 20
);

-- Devis
create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  number text unique,
  deal_id uuid references public.deals(id) on delete set null,
  company_id uuid references public.companies(id) on delete set null,
  contact_id uuid references public.contacts(id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'sent', 'accepted', 'rejected', 'expired')),
  valid_until date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger quotes_updated_at
  before update on public.quotes
  for each row execute procedure public.set_updated_at();

create table if not exists public.quote_lines (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes(id) on delete cascade,
  catalog_item_id uuid references public.catalog_items(id) on delete set null,
  kind text not null check (kind in ('product', 'service')),
  label text not null,
  quantity numeric(12,2) not null default 1,
  unit_price numeric(12,2) not null default 0,
  tax_rate numeric(5,2) not null default 20
);

-- Activités
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('call', 'email', 'meeting', 'task', 'note')),
  subject text not null,
  company_id uuid references public.companies(id) on delete set null,
  contact_id uuid references public.contacts(id) on delete set null,
  deal_id uuid references public.deals(id) on delete set null,
  due_at timestamptz,
  done_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.companies enable row level security;
alter table public.contacts enable row level security;
alter table public.leads enable row level security;
alter table public.catalog_items enable row level security;
alter table public.deals enable row level security;
alter table public.deal_lines enable row level security;
alter table public.quotes enable row level security;
alter table public.quote_lines enable row level security;
alter table public.activities enable row level security;

-- Entreprise unique : tout utilisateur connecté peut lire/écrire
do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'profiles', 'companies', 'contacts', 'leads', 'catalog_items',
    'deals', 'deal_lines', 'quotes', 'quote_lines', 'activities'
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

-- Exemples (optionnel)
insert into public.catalog_items (kind, name, sku, category, unit_price, tax_rate, status, unit, billing_type)
values
  ('product', 'Produit exemple', 'PRD-001', 'Catalogue', 199.00, 20, 'active', 'pièce', null),
  ('service', 'Prestation exemple', 'SRV-001', 'Prestations', 450.00, 20, 'active', 'forfait', 'one_time')
on conflict (sku) do nothing;
