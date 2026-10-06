-- V38 : jeton de connexion (CXN-…) par tentative / session.
-- Rollback : alter table public.login_events drop column if exists token;
--            alter table public.login_events drop column if exists session_id;

alter table public.login_events
  add column if not exists token text;

alter table public.login_events
  add column if not exists session_id uuid;

update public.login_events
set token = 'CXN-LEGACY-' || replace(id::text, '-', '')
where token is null;

alter table public.login_events
  alter column token set not null;

create unique index if not exists login_events_token_idx on public.login_events (token);
