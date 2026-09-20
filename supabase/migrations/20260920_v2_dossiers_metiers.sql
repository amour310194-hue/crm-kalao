-- V2 dossiers métiers : chantier, plantation, événement, voyage, visa, bien / bail, paie simple.

alter table public.attachments drop constraint if exists attachments_entity_type_check;
alter table public.attachments
  add constraint attachments_entity_type_check
  check (entity_type in (
    'company', 'contact', 'quote', 'invoice', 'employee', 'lead', 'misc', 'dossier'
  ));

create table if not exists public.dossiers (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in (
    'chantier', 'plantation', 'evenement', 'voyage', 'visa', 'bien'
  )),
  company_id uuid references public.companies(id) on delete set null,
  contact_id uuid references public.contacts(id) on delete set null,
  title text not null,
  status text not null default 'plan',
  start_at date,
  end_at date,
  notes text,
  quote_id uuid references public.quotes(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists dossiers_updated_at on public.dossiers;
create trigger dossiers_updated_at
  before update on public.dossiers
  for each row execute procedure public.set_updated_at();

create table if not exists public.dossier_members (
  dossier_id uuid not null references public.dossiers(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (dossier_id, employee_id)
);

create table if not exists public.dossier_assets (
  id uuid primary key default gen_random_uuid(),
  dossier_id uuid not null references public.dossiers(id) on delete cascade,
  catalog_item_id uuid not null references public.catalog_items(id) on delete cascade,
  qty numeric(12,2) not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists public.pay_runs (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id) on delete cascade,
  period text not null,
  amount numeric(12,2) not null default 0,
  bonus numeric(12,2) not null default 0,
  status text not null default 'due' check (status in ('due', 'paid')),
  paid_at date,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.dossiers enable row level security;
alter table public.dossier_members enable row level security;
alter table public.dossier_assets enable row level security;
alter table public.pay_runs enable row level security;

do $$
declare
  tbl text;
begin
  foreach tbl in array array['dossiers', 'dossier_members', 'dossier_assets', 'pay_runs']
  loop
    execute format('drop policy if exists authenticated_all on public.%I', tbl);
    execute format(
      'create policy authenticated_all on public.%I for all to authenticated using (true) with check (true)',
      tbl
    );
  end loop;
end;
$$;

insert into public.dossiers (kind, company_id, title, status, start_at, end_at, notes)
select 'chantier', c.id, 'Chantier Bonabéri — Bâtir Ensemble', 'plan', '2026-09-01', '2026-12-15', 'Gros œuvre, équipe terrain'
from public.companies c where c.name = 'Bâtir Ensemble SARL'
and not exists (select 1 from public.dossiers d where d.title = 'Chantier Bonabéri — Bâtir Ensemble');

insert into public.dossiers (kind, company_id, title, status, start_at, end_at, notes)
select 'plantation', c.id, 'Plantation cacao Bafoussam — saison 2026', 'design', '2026-03-01', '2026-11-30', 'Parcelle / récolte'
from public.companies c where c.name = 'Plantation N''Zi'
and not exists (select 1 from public.dossiers d where d.title like 'Plantation cacao%');

insert into public.dossiers (kind, company_id, title, status, start_at, end_at, notes)
select 'voyage', c.id, 'Circuit Douala–Kribi — 4 pax', 'develop', '2026-10-12', '2026-10-18', 'Itinéraire + hébergement, pas de GDS'
from public.companies c where c.name = 'TransAfrique Logistique'
and not exists (select 1 from public.dossiers d where d.title like 'Circuit Douala%');

insert into public.dossiers (kind, company_id, title, status, start_at, end_at, notes)
select 'visa', c.id, 'Dossier visa Schengen — pièce CNI', 'plan', '2026-09-20', '2026-11-01', 'Checklist pièces + échéance consulat'
from public.companies c where c.name = 'Atlantic Services CI'
and not exists (select 1 from public.dossiers d where d.title like 'Dossier visa Schengen%');

insert into public.dossiers (kind, company_id, title, status, start_at, end_at, notes)
select 'evenement', c.id, 'Mariage Kribi — chapiteau et sono', 'plan', '2026-10-25', '2026-10-26', 'Location chaises, photo, DJ'
from public.companies c where c.name = 'Hôtel Baobab'
and not exists (select 1 from public.dossiers d where d.title like 'Mariage Kribi%');

insert into public.dossiers (kind, company_id, title, status, start_at, end_at, notes)
select 'bien', c.id, 'Bail Bastos — Foncier Lagune', 'plan', '2026-09-01', '2027-08-31', 'Bail commercial Yaoundé'
from public.companies c where c.name = 'Foncier Lagune'
and not exists (select 1 from public.dossiers d where d.title like 'Bail Bastos%');

insert into public.dossier_members (dossier_id, employee_id)
select d.id, e.id
from public.dossiers d
join public.employees e on e.email = 'amadou.koffi@groupe-kalao.com'
where d.kind in ('chantier', 'plantation', 'voyage')
on conflict do nothing;

insert into public.pay_runs (employee_id, period, amount, bonus, status, paid_at, notes)
select e.id, '2026-09', 350000, 25000, 'paid', '2026-09-05', 'Salaire septembre + prime'
from public.employees e
where e.email = 'amadou.koffi@groupe-kalao.com'
and not exists (
  select 1 from public.pay_runs p where p.employee_id = e.id and p.period = '2026-09'
);

insert into public.activities (type, subject, company_id, due_at, notes)
select 'task', 'Échéance visa Schengen — pièces', c.id, '2026-11-01', 'Dossier visa V2'
from public.companies c
where c.name = 'Atlantic Services CI'
and not exists (
  select 1 from public.activities a where a.subject = 'Échéance visa Schengen — pièces'
);
