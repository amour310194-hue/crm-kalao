-- V20 : socle RLS (v19) + backup + corrections de caisse validées.

-- 1. Sauvegarde avant mutation
create table if not exists public._backup_20260925_invoices as table public.invoices;
create table if not exists public._backup_20260925_payments as table public.payments;
create table if not exists public._backup_20260925_activities as table public.activities;
revoke all on public._backup_20260925_invoices from anon, authenticated, public;
revoke all on public._backup_20260925_payments from anon, authenticated, public;
revoke all on public._backup_20260925_activities from anon, authenticated, public;

-- 2. Rôles élargis
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check
  check (role in (
    'super_admin', 'admin', 'manager', 'direction',
    'finance', 'commercial', 'rh', 'staff', 'agent'
  ));

create or replace function public.is_direction()
returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce(
    public.current_profile_role() in ('super_admin', 'admin', 'manager', 'direction'),
    false
  )
$$;

create or replace function public.is_hr()
returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce(
    public.current_profile_role() in ('super_admin', 'admin', 'direction', 'rh'),
    false
  )
$$;

revoke all on function public.is_direction() from public;
revoke all on function public.is_hr() from public;
grant execute on function public.is_direction() to authenticated;
grant execute on function public.is_hr() to authenticated;

drop policy if exists crm_app_all on public.travel_dossiers;
drop policy if exists crm_app_all on public.audit_logs;
drop policy if exists audit_logs_authenticated on public.audit_logs;
create policy audit_logs_authenticated on public.audit_logs
  for all to authenticated
  using (true)
  with check (true);

drop policy if exists authenticated_all on public.payroll_entries;
drop policy if exists payroll_entries_hr on public.payroll_entries;
create policy payroll_entries_hr on public.payroll_entries
  for all to authenticated
  using (public.is_hr())
  with check (public.is_hr());

drop policy if exists pay_runs_admin on public.pay_runs;
drop policy if exists pay_runs_hr on public.pay_runs;
create policy pay_runs_hr on public.pay_runs
  for all to authenticated
  using (public.is_hr())
  with check (public.is_hr());

-- 3. Factures : statut annulée + échéance conditionnelle
alter table public.invoices drop constraint if exists invoices_status_check;
alter table public.invoices
  add constraint invoices_status_check
  check (status in ('paid', 'partially_paid', 'unpaid', 'overdue', 'cancelled'));
alter table public.invoices
  add column if not exists is_conditional boolean not null default false;

create table if not exists public.credit_notes (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid references public.invoices(id) on delete set null,
  number text unique not null,
  amount numeric not null,
  reason text,
  created_at timestamptz not null default now()
);
alter table public.credit_notes enable row level security;
drop policy if exists credit_notes_authenticated on public.credit_notes;
create policy credit_notes_authenticated on public.credit_notes
  for all to authenticated
  using (true)
  with check (true);

-- 4. Caisse C14 : 900 000 FCFA de SO vers AV
update public.payments
set
  invoice_id = '18ae0d76-6c8d-44b1-885a-52a3822ee8dc',
  notes = 'Réaffecté de INV-C14-SO vers INV-C14-AV (caisse 25 sept. 2026).'
where id = '8453ea88-2398-4917-b716-be7f191592c5'
  and invoice_id = 'cc1976ae-1d34-46d5-a64e-be48b7beba31';

update public.invoices
set paid_amount = 900000, status = 'partially_paid', updated_at = now()
where id = '18ae0d76-6c8d-44b1-885a-52a3822ee8dc';

update public.invoices
set paid_amount = 0, status = 'unpaid', updated_at = now()
where id = 'cc1976ae-1d34-46d5-a64e-be48b7beba31';

-- 5. C06 : annulation, avoir, suppression de la paire avance/remboursement
insert into public.credit_notes (invoice_id, number, amount, reason)
values (
  '8f5702c5-1bca-4c4b-a1b7-0d9f57d7398b',
  'AVOIR-C06-AV',
  1100000,
  'Dossier annulé — remboursement intégral de l''avance.'
)
on conflict (number) do nothing;

delete from public.payments
where invoice_id = '8f5702c5-1bca-4c4b-a1b7-0d9f57d7398b';

update public.invoices
set status = 'cancelled', paid_amount = 0, updated_at = now()
where id = '8f5702c5-1bca-4c4b-a1b7-0d9f57d7398b';

-- 6. C14-BA : échéance conditionnelle hors impayé
update public.invoices
set is_conditional = true, updated_at = now()
where id = '62429af0-ce78-4735-bb3d-757aaddc9b7e';

-- 7. Soldes sans échéance : date de fin du dossier
update public.invoices i
set due_date = d.end_at::date, updated_at = now()
from public.dossiers d
where i.dossier_id = d.id
  and i.due_date is null
  and i.number like '%-SO'
  and d.end_at is not null;

-- 8. Activité seed
delete from public.activities
where id = '2d21a0d5-f220-4978-9eef-3f8afa8cb8c1'
   or subject ilike '%V7 TEST visa seed%';
