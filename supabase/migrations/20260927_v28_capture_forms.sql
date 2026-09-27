-- V28 : formulaires de capture de leads (public) + statut prospect/client sur les contacts.

create table if not exists public.capture_forms (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  fields jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'published')),
  success_message text,
  default_source text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger capture_forms_updated_at
  before update on public.capture_forms
  for each row execute procedure public.set_updated_at();

alter table public.capture_forms enable row level security;

drop policy if exists capture_forms_select on public.capture_forms;
drop policy if exists capture_forms_insert on public.capture_forms;
drop policy if exists capture_forms_update on public.capture_forms;
drop policy if exists capture_forms_delete on public.capture_forms;

create policy capture_forms_select on public.capture_forms
  for select to authenticated
  using (public.is_staff());
create policy capture_forms_insert on public.capture_forms
  for insert to authenticated
  with check (public.is_staff());
create policy capture_forms_update on public.capture_forms
  for update to authenticated
  using (public.is_staff())
  with check (public.is_staff());
create policy capture_forms_delete on public.capture_forms
  for delete to authenticated
  using (public.is_staff());

alter table public.leads
  add column if not exists capture_form_id uuid references public.capture_forms(id) on delete set null;
alter table public.leads add column if not exists utm_source text;
alter table public.leads add column if not exists utm_medium text;
alter table public.leads add column if not exists utm_campaign text;
alter table public.leads add column if not exists utm_content text;

-- Idempotent : le prompt "conversion lead -> client" ajoute la meme colonne de son cote,
-- peu importe lequel des deux tourne en premier.
alter table public.contacts add column if not exists status text not null default 'client';
alter table public.contacts drop constraint if exists contacts_status_check;
alter table public.contacts add constraint contacts_status_check check (status in ('prospect', 'client'));

-- Ecriture publique (soumission anonyme d'un formulaire) : jamais de policy anon,
-- toujours via le client service-role cote serveur (voir src/lib/capture-submit.ts).
