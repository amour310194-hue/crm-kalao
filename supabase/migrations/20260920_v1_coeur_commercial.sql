-- V1 cœur commercial : affiliations, stock, paiements, pièces jointes

alter table public.invoices
  add column if not exists quote_id uuid references public.quotes(id) on delete set null;

create unique index if not exists invoices_quote_id_uidx
  on public.invoices (quote_id)
  where quote_id is not null;

create table if not exists public.lead_affiliations (
  lead_id uuid not null references public.leads(id) on delete cascade,
  department_id uuid not null references public.departments(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (lead_id, department_id)
);

create table if not exists public.stock_locations (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  kind text not null default 'other',
  created_at timestamptz not null default now()
);

insert into public.stock_locations (code, name, kind)
values
  ('LOC-BOUT', 'Boutique', 'boutique'),
  ('LOC-CHAN', 'Chantier', 'chantier'),
  ('LOC-PLANT', 'Plantation', 'plantation'),
  ('LOC-EVEN', 'Événement', 'evenement')
on conflict (code) do nothing;

create table if not exists public.stock_movements (
  id uuid primary key default gen_random_uuid(),
  catalog_item_id uuid not null references public.catalog_items(id) on delete cascade,
  location_id uuid references public.stock_locations(id) on delete set null,
  qty numeric(12,2) not null,
  reason text,
  created_at timestamptz not null default now()
);

create or replace function public.refresh_catalog_stock()
returns trigger
language plpgsql
as $$
declare
  item uuid;
begin
  item := coalesce(new.catalog_item_id, old.catalog_item_id);
  update public.catalog_items
  set stock_qty = coalesce((
    select sum(qty) from public.stock_movements where catalog_item_id = item
  ), 0)
  where id = item;
  return coalesce(new, old);
end;
$$;

drop trigger if exists stock_movements_refresh on public.stock_movements;
create trigger stock_movements_refresh
  after insert or update or delete on public.stock_movements
  for each row execute procedure public.refresh_catalog_stock();

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  amount numeric(12,2) not null,
  paid_at date not null default current_date,
  method text not null default 'cash',
  transaction_id text,
  notes text,
  created_at timestamptz not null default now()
);

create or replace function public.refresh_invoice_paid()
returns trigger
language plpgsql
as $$
declare
  inv uuid;
  paid numeric;
  total numeric;
begin
  inv := coalesce(new.invoice_id, old.invoice_id);
  select coalesce(sum(amount), 0) into paid from public.payments where invoice_id = inv;
  select amount into total from public.invoices where id = inv;
  update public.invoices
  set paid_amount = paid,
      status = case
        when paid <= 0 then 'unpaid'
        when paid >= coalesce(total, 0) then 'paid'
        else 'partially_paid'
      end
  where id = inv;
  return coalesce(new, old);
end;
$$;

drop trigger if exists payments_refresh on public.payments;
create trigger payments_refresh
  after insert or update or delete on public.payments
  for each row execute procedure public.refresh_invoice_paid();

create table if not exists public.attachments (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in (
    'company', 'contact', 'quote', 'invoice', 'employee', 'lead', 'misc'
  )),
  entity_id uuid not null,
  bucket_path text not null,
  file_name text not null,
  mime_type text,
  size_bytes integer,
  created_at timestamptz not null default now()
);

alter table public.lead_affiliations enable row level security;
alter table public.stock_locations enable row level security;
alter table public.stock_movements enable row level security;
alter table public.payments enable row level security;
alter table public.attachments enable row level security;

do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'lead_affiliations', 'stock_locations', 'stock_movements',
    'payments', 'attachments', 'invoices'
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

insert into storage.buckets (id, name, public)
values ('attachments', 'attachments', false)
on conflict (id) do nothing;

drop policy if exists authenticated_attachments_select on storage.objects;
drop policy if exists authenticated_attachments_insert on storage.objects;
drop policy if exists authenticated_attachments_update on storage.objects;
drop policy if exists authenticated_attachments_delete on storage.objects;

create policy authenticated_attachments_select
  on storage.objects for select to authenticated
  using (bucket_id = 'attachments');
create policy authenticated_attachments_insert
  on storage.objects for insert to authenticated
  with check (bucket_id = 'attachments');
create policy authenticated_attachments_update
  on storage.objects for update to authenticated
  using (bucket_id = 'attachments');
create policy authenticated_attachments_delete
  on storage.objects for delete to authenticated
  using (bucket_id = 'attachments');

insert into public.employees (full_name, email, phone, job_title, status)
select 'Amadou Koffi', 'amadou.koffi@groupe-kalao.com', '+225 07 00 00 00', 'Commercial', 'active'
where not exists (
  select 1 from public.employees where email = 'amadou.koffi@groupe-kalao.com'
);

insert into public.employee_assignments (employee_id, department_id, is_primary)
select e.id, d.id, (d.code = 'DEP-VOY')
from public.employees e
join public.departments d on d.code in ('DEP-VOY', 'DEP-BTP')
where e.email = 'amadou.koffi@groupe-kalao.com'
on conflict do nothing;

update public.catalog_items
set track_stock = true
where sku = 'PRD-001' and coalesce(track_stock, false) = false;

insert into public.stock_movements (catalog_item_id, location_id, qty, reason)
select c.id, l.id, 100, 'stock initial'
from public.catalog_items c
join public.stock_locations l on l.code = 'LOC-BOUT'
where c.sku = 'PRD-001'
and not exists (
  select 1 from public.stock_movements m where m.catalog_item_id = c.id
);
