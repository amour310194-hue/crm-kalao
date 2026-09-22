-- V6 dossiers : suivi opérationnel d'un dossier métier (jalons, achats, pièces à fournir)
-- et quittances de loyer pour les dossiers de type « bien ».
-- Migration additive uniquement : aucune table ni colonne existante n'est modifiée.

create table if not exists public.dossier_milestones (
  id uuid primary key default gen_random_uuid(),
  dossier_id uuid not null references public.dossiers(id) on delete cascade,
  label text not null,
  due_at date,
  done_at date,
  status text not null default 'todo' check (status in ('todo', 'doing', 'done')),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.dossier_purchases (
  id uuid primary key default gen_random_uuid(),
  dossier_id uuid not null references public.dossiers(id) on delete cascade,
  label text not null,
  amount numeric(12,2) not null default 0,
  spent_at date,
  supplier text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.dossier_checklist (
  id uuid primary key default gen_random_uuid(),
  dossier_id uuid not null references public.dossiers(id) on delete cascade,
  label text not null,
  provided boolean not null default false,
  attachment_id uuid references public.attachments(id) on delete set null,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.rent_receipts (
  id uuid primary key default gen_random_uuid(),
  dossier_id uuid not null references public.dossiers(id) on delete cascade,
  period text not null,
  amount numeric(12,2) not null default 0,
  paid_at date,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists dossier_milestones_dossier_idx on public.dossier_milestones (dossier_id);
create index if not exists dossier_milestones_due_at_idx on public.dossier_milestones (due_at);
create index if not exists dossier_purchases_dossier_idx on public.dossier_purchases (dossier_id);
create index if not exists dossier_checklist_dossier_idx on public.dossier_checklist (dossier_id);
create index if not exists rent_receipts_dossier_idx on public.rent_receipts (dossier_id);

alter table public.dossier_milestones enable row level security;
alter table public.dossier_purchases enable row level security;
alter table public.dossier_checklist enable row level security;
alter table public.rent_receipts enable row level security;

do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'dossier_milestones', 'dossier_purchases', 'dossier_checklist', 'rent_receipts'
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

-- Pièces attendues du dossier visa existant : la checklist visa n'a de sens que remplie.
insert into public.dossier_checklist (dossier_id, label)
select d.id, v.label
from public.dossiers d
cross join (values
  ('Passeport en cours de validité'),
  ('CNI recto / verso'),
  ('Photos d''identité aux normes'),
  ('Justificatif d''hébergement'),
  ('Relevés bancaires 3 mois'),
  ('Assurance voyage')
) as v(label)
where d.kind = 'visa'
and not exists (
  select 1 from public.dossier_checklist c
  where c.dossier_id = d.id and c.label = v.label
);
