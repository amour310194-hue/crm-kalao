-- Communication, rapports, portail, paiements en mode test. Pas de signature électronique.
-- Rollback : drop des tables créées ici, drop des vues v_aged_receivables, v_cash_forecast, v_lead_conversion, employees_staff.
-- Ne pas réouvrir les tables de sauvegarde au rôle authenticated.

revoke all on table public._backup_20260926_crm_emails from anon, authenticated;
revoke all on table public._backup_20261006_demo_admin from anon, authenticated;
revoke all on table public._backup_20261009_dossier_status from anon, authenticated;
revoke all on table public._bak_20260926_v27_companies from anon, authenticated;
revoke all on table public._bak_20260926_v27_contacts from anon, authenticated;
alter table public._backup_20260926_crm_emails enable row level security;
alter table public._backup_20261006_demo_admin enable row level security;
alter table public._backup_20261009_dossier_status enable row level security;
alter table public._bak_20260926_v27_companies enable row level security;
alter table public._bak_20260926_v27_contacts enable row level security;

alter table public.project_stages enable row level security;
alter table public.dossier_piece_templates enable row level security;
revoke all on table public.project_stages from anon, authenticated;
revoke all on table public.dossier_piece_templates from anon, authenticated;
grant select on table public.project_stages to authenticated;
grant select on table public.dossier_piece_templates to authenticated;
drop policy if exists project_stages_select on public.project_stages;
create policy project_stages_select on public.project_stages for select to authenticated using (public.is_staff());
drop policy if exists dossier_piece_templates_select on public.dossier_piece_templates;
create policy dossier_piece_templates_select on public.dossier_piece_templates for select to authenticated using (public.is_staff());

alter table public.attachments add column if not exists retain_until date;
alter table public.attachments add column if not exists notice_sent_at timestamptz;
update public.attachments
set retain_until = (created_at + interval '5 years')::date
where retain_until is null and created_at is not null;

create or replace function public.protect_employee_pay()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.current_profile_role() not in ('super_admin', 'admin', 'direction', 'rh', 'finance') then
    new.salary_base := old.salary_base;
    new.bonus_performance := old.bonus_performance;
    new.bonus_responsibility := old.bonus_responsibility;
    new.transport_allowance := old.transport_allowance;
    new.passport_no := old.passport_no;
    new.cnps_number := old.cnps_number;
  end if;
  return new;
end $$;

drop trigger if exists employees_protect_pay on public.employees;
create trigger employees_protect_pay
before update on public.employees
for each row execute function public.protect_employee_pay();

create or replace view public.employees_staff
with (security_invoker = false) as
select
  id, profile_id, full_name, email, phone, job_title, status, created_at, updated_at,
  birth_date, birth_place, nationality, address, contract_type, hired_at, weekly_hours, contract_ref,
  case when public.current_profile_role() in ('super_admin', 'admin', 'direction', 'rh', 'finance') then salary_base else null end as salary_base,
  case when public.current_profile_role() in ('super_admin', 'admin', 'direction', 'rh', 'finance') then bonus_performance else null end as bonus_performance,
  case when public.current_profile_role() in ('super_admin', 'admin', 'direction', 'rh', 'finance') then bonus_responsibility else null end as bonus_responsibility,
  case when public.current_profile_role() in ('super_admin', 'admin', 'direction', 'rh', 'finance') then transport_allowance else null end as transport_allowance,
  case when public.current_profile_role() in ('super_admin', 'admin', 'direction', 'rh', 'finance') then passport_no else null end as passport_no,
  case when public.current_profile_role() in ('super_admin', 'admin', 'direction', 'rh', 'finance') then cnps_number else null end as cnps_number
from public.employees
where public.is_staff();

grant select on public.employees_staff to authenticated;

create table if not exists public.channel_conversations (
  id uuid primary key default gen_random_uuid(),
  channel text not null,
  external_id text,
  contact_id uuid references public.contacts(id),
  lead_id uuid references public.leads(id),
  assignee_id uuid references public.profiles(id),
  status text not null default 'new' check (status in ('new', 'open', 'waiting', 'resolved')),
  window_expires_at timestamptz,
  unread boolean not null default true,
  created_at timestamptz not null default now()
);
create unique index if not exists channel_conversations_external on public.channel_conversations (channel, external_id) where external_id is not null;

create table if not exists public.channel_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.channel_conversations(id) on delete cascade,
  external_message_id text,
  direction text not null check (direction in ('in', 'out', 'note')),
  body text,
  created_at timestamptz not null default now()
);
create unique index if not exists channel_messages_external on public.channel_messages (external_message_id) where external_message_id is not null;

create table if not exists public.contact_identities (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid references public.contacts(id),
  channel text not null,
  external_id text not null,
  unique (channel, external_id)
);

create table if not exists public.quick_replies (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  body text not null
);

create table if not exists public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  external_id text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (provider, external_id)
);

create table if not exists public.whatsapp_templates (
  key text primary key,
  label text not null,
  submitted boolean not null default false
);
insert into public.whatsapp_templates (key, label) values
  ('echeance', 'Rappel d''échéance'),
  ('paiement_recu', 'Paiement reçu'),
  ('ambassade', 'Rendez-vous ambassade'),
  ('piece_manquante', 'Document manquant'),
  ('relance_prospect', 'Relance de prospect')
on conflict (key) do nothing;

create table if not exists public.payment_links (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id),
  amount numeric(12,2) not null,
  provider text not null check (provider in ('orange_money', 'mtn_momo')),
  mode text not null default 'test' check (mode in ('test', 'live')),
  created_at timestamptz not null default now()
);

create table if not exists public.provider_payments (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  external_id text not null,
  invoice_id uuid references public.invoices(id),
  amount numeric(12,2) not null,
  matched boolean not null default false,
  created_at timestamptz not null default now(),
  unique (provider, external_id)
);

create table if not exists public.sales_targets (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id),
  month date not null,
  amount numeric(12,2) not null,
  unique (profile_id, month)
);

create table if not exists public.saved_reports (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  module text not null,
  filters jsonb not null default '{}'::jsonb,
  owner_id uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.portal_access (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  contact_id uuid not null references public.contacts(id),
  email text not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.api_keys (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  key_hash text not null unique,
  scopes text[] not null default '{}',
  created_at timestamptz not null default now(),
  revoked_at timestamptz
);

create table if not exists public.outbound_subscriptions (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  event_key text not null,
  secret text not null,
  active boolean not null default false
);

create table if not exists public.outbound_deliveries (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid references public.outbound_subscriptions(id) on delete cascade,
  event_key text not null,
  status text not null,
  attempt integer not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists public.custom_field_defs (
  id uuid primary key default gen_random_uuid(),
  module text not null,
  label text not null,
  field_type text not null check (field_type in ('text', 'number', 'date', 'list')),
  unique (module, label)
);

create table if not exists public.custom_field_values (
  id uuid primary key default gen_random_uuid(),
  def_id uuid not null references public.custom_field_defs(id) on delete cascade,
  entity_id uuid not null,
  value text,
  unique (def_id, entity_id)
);

create table if not exists public.ai_preferences (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  enabled boolean not null default true
);

create table if not exists public.privacy_requests (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid references public.contacts(id),
  kind text not null check (kind in ('export', 'delete')),
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

alter table public.channel_conversations enable row level security;
alter table public.channel_messages enable row level security;
alter table public.contact_identities enable row level security;
alter table public.quick_replies enable row level security;
alter table public.webhook_events enable row level security;
alter table public.whatsapp_templates enable row level security;
alter table public.payment_links enable row level security;
alter table public.provider_payments enable row level security;
alter table public.sales_targets enable row level security;
alter table public.saved_reports enable row level security;
alter table public.portal_access enable row level security;
alter table public.api_keys enable row level security;
alter table public.outbound_subscriptions enable row level security;
alter table public.outbound_deliveries enable row level security;
alter table public.custom_field_defs enable row level security;
alter table public.custom_field_values enable row level security;
alter table public.ai_preferences enable row level security;
alter table public.privacy_requests enable row level security;

drop policy if exists channel_conversations_staff on public.channel_conversations;
create policy channel_conversations_staff on public.channel_conversations for select to authenticated using (public.is_staff());
drop policy if exists channel_messages_staff on public.channel_messages;
create policy channel_messages_staff on public.channel_messages for select to authenticated using (public.is_staff());
drop policy if exists whatsapp_templates_staff on public.whatsapp_templates;
create policy whatsapp_templates_staff on public.whatsapp_templates for select to authenticated using (public.is_staff());
drop policy if exists payment_links_staff on public.payment_links;
create policy payment_links_staff on public.payment_links for select to authenticated using (public.is_finance());
drop policy if exists provider_payments_staff on public.provider_payments;
create policy provider_payments_staff on public.provider_payments for select to authenticated using (public.is_finance());
drop policy if exists sales_targets_staff on public.sales_targets;
create policy sales_targets_staff on public.sales_targets for all to authenticated using (public.is_direction()) with check (public.is_direction());
drop policy if exists saved_reports_staff on public.saved_reports;
create policy saved_reports_staff on public.saved_reports for select to authenticated using (public.is_staff());
drop policy if exists portal_access_own on public.portal_access;
create policy portal_access_own on public.portal_access for select to authenticated using (user_id = auth.uid() or public.is_direction());
drop policy if exists ai_preferences_own on public.ai_preferences;
create policy ai_preferences_own on public.ai_preferences for all to authenticated using (profile_id = auth.uid()) with check (profile_id = auth.uid());
drop policy if exists privacy_requests_direction on public.privacy_requests;
create policy privacy_requests_direction on public.privacy_requests for select to authenticated using (public.is_direction());
drop policy if exists custom_field_defs_staff on public.custom_field_defs;
create policy custom_field_defs_staff on public.custom_field_defs for select to authenticated using (public.is_staff());
drop policy if exists custom_field_values_staff on public.custom_field_values;
create policy custom_field_values_staff on public.custom_field_values for select to authenticated using (public.is_staff());
drop policy if exists webhook_events_direction on public.webhook_events;
create policy webhook_events_direction on public.webhook_events for select to authenticated using (public.is_direction());
drop policy if exists quick_replies_staff on public.quick_replies;
create policy quick_replies_staff on public.quick_replies for select to authenticated using (public.is_staff());
drop policy if exists contact_identities_staff on public.contact_identities;
create policy contact_identities_staff on public.contact_identities for select to authenticated using (public.is_staff());
drop policy if exists api_keys_direction on public.api_keys;
create policy api_keys_direction on public.api_keys for select to authenticated using (public.is_direction());
drop policy if exists outbound_subscriptions_direction on public.outbound_subscriptions;
create policy outbound_subscriptions_direction on public.outbound_subscriptions for select to authenticated using (public.is_direction());
drop policy if exists outbound_deliveries_direction on public.outbound_deliveries;
create policy outbound_deliveries_direction on public.outbound_deliveries for select to authenticated using (public.is_direction());

drop policy if exists dossiers_portal_select on public.dossiers;
create policy dossiers_portal_select on public.dossiers for select to authenticated using (
  exists (
    select 1 from public.portal_access a
    where a.user_id = auth.uid() and a.revoked_at is null and a.contact_id = dossiers.contact_id
  )
);
drop policy if exists invoices_portal_select on public.invoices;
create policy invoices_portal_select on public.invoices for select to authenticated using (
  exists (
    select 1 from public.portal_access a
    where a.user_id = auth.uid() and a.revoked_at is null and a.contact_id = invoices.contact_id
  )
);

create or replace view public.v_aged_receivables
with (security_invoker = true) as
select
  case
    when due_date is null then 'sans_echeance'
    when ((now() at time zone 'Africa/Douala')::date - due_date) <= 30 then '0_30'
    when ((now() at time zone 'Africa/Douala')::date - due_date) <= 60 then '31_60'
    when ((now() at time zone 'Africa/Douala')::date - due_date) <= 90 then '61_90'
    else 'plus_90'
  end as bucket,
  count(*)::int as n,
  coalesce(sum(amount - paid_amount), 0) as remaining
from public.invoices
where status not in ('draft', 'cancelled', 'paid')
  and coalesce(is_conditional, false) = false
group by 1;

create or replace view public.v_cash_forecast
with (security_invoker = true) as
select
  coalesce(is_conditional, false) as conditional,
  coalesce(sum(greatest(amount - paid_amount, 0)), 0) as remaining
from public.invoices
where status not in ('draft', 'cancelled', 'paid')
  and due_date is not null
  and due_date <= ((now() at time zone 'Africa/Douala')::date + 180)
group by 1;

create or replace view public.v_lead_conversion
with (security_invoker = true) as
select
  coalesce(source, 'inconnue') as source,
  count(*)::int as leads,
  count(*) filter (where status = 'converted')::int as converted
from public.leads
where archived_at is null
group by 1;

grant select on public.v_aged_receivables, public.v_cash_forecast, public.v_lead_conversion to authenticated;
grant select on public.channel_conversations, public.channel_messages, public.whatsapp_templates, public.payment_links, public.provider_payments, public.saved_reports, public.portal_access, public.ai_preferences, public.privacy_requests, public.custom_field_defs, public.custom_field_values, public.quick_replies to authenticated;
grant select, insert, update, delete on public.sales_targets to authenticated;
grant insert on public.payment_links to authenticated;
grant insert, update on public.ai_preferences to authenticated;
grant insert on public.privacy_requests to authenticated;
drop policy if exists payment_links_insert on public.payment_links;
create policy payment_links_insert on public.payment_links for insert to authenticated with check (public.is_finance() and mode = 'test');
drop policy if exists privacy_requests_insert on public.privacy_requests;
create policy privacy_requests_insert on public.privacy_requests for insert to authenticated with check (public.is_direction());
