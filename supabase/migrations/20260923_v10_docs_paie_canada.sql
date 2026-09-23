-- V10 : papier en-tête, paie salarié, barème Canada en 3 échéances.

alter table public.employees
  add column if not exists salary_base numeric not null default 0,
  add column if not exists bonus_performance numeric not null default 0,
  add column if not exists bonus_responsibility numeric not null default 0,
  add column if not exists transport_allowance numeric not null default 0,
  add column if not exists birth_date date,
  add column if not exists birth_place text,
  add column if not exists nationality text,
  add column if not exists passport_no text,
  add column if not exists address text,
  add column if not exists contract_type text not null default 'CDI',
  add column if not exists hired_at date,
  add column if not exists weekly_hours numeric not null default 40,
  add column if not exists cnps_number text,
  add column if not exists contract_ref text;

alter table public.contacts
  add column if not exists nationality text,
  add column if not exists birth_date date,
  add column if not exists birth_place text,
  add column if not exists passport_no text;

alter table public.dossiers
  add column if not exists bassin_drawn boolean not null default false;

update public.catalog_items
set description = 'Procedure Canada 4 500 000 FCFA. Paiement en 3 fois : 1 100 000 a l ouverture, 1 500 000 si tire du bassin, solde au retrait du visa.'
where sku = 'IMM-CAN';

update public.catalog_items
set name = 'Procedure immigration Canada - deuxieme formule',
    description = 'Procedure Canada 3 500 000 FCFA. Paiement en 3 fois : 1 100 000 a l ouverture, 1 500 000 si tire du bassin, solde au retrait du visa.'
where sku = 'IMM-CAN-2';
