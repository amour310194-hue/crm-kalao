-- V35 : paramètres d'organisation et clés d'intégration (jamais exposées au client).

create table if not exists public.org_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id) on delete set null
);

create table if not exists public.integration_credentials (
  provider text not null,
  field_key text not null,
  is_secret boolean not null default true,
  public_value text,
  ciphertext text,
  last4 text,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id) on delete set null,
  primary key (provider, field_key)
);

alter table public.org_settings enable row level security;
alter table public.integration_credentials enable row level security;

drop policy if exists org_settings_select on public.org_settings;
create policy org_settings_select on public.org_settings
  for select to authenticated
  using (public.is_crm_admin());

drop policy if exists org_settings_write on public.org_settings;
create policy org_settings_write on public.org_settings
  for all to authenticated
  using (
    public.current_profile_role() in ('super_admin', 'admin', 'direction')
  )
  with check (
    public.current_profile_role() in ('super_admin', 'admin', 'direction')
  );

-- Aucune politique SELECT/INSERT pour authenticated : lecture et écriture
-- uniquement via le service_role (Route Handlers). Le client ne voit jamais ciphertext.
revoke all on public.integration_credentials from public, anon, authenticated;
grant all on public.integration_credentials to service_role;

revoke all on public.org_settings from public, anon;
grant select, insert, update, delete on public.org_settings to authenticated;
grant all on public.org_settings to service_role;
