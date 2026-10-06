-- V37 : sauvegarde + bannissement du compte démo, journal de connexion, date de mot de passe.
-- Rollback (après OK) :
--   update auth.users set banned_until = null where id = '0126c15d-f34c-4ed9-9d15-6e3dda178e99';
--   update public.employees set status = 'active' where id = '394e0ba4-7d98-4fda-afad-dc146cd47432';
--   alter table public.profiles drop column if exists password_changed_at;
--   drop table if exists public.login_events;
--   drop table if exists public._backup_20261006_demo_admin;

create table if not exists public._backup_20261006_demo_admin (
  kind text not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

insert into public._backup_20261006_demo_admin (kind, payload)
select 'auth.users', to_jsonb(u)
from auth.users u
where u.id = '0126c15d-f34c-4ed9-9d15-6e3dda178e99';

insert into public._backup_20261006_demo_admin (kind, payload)
select 'public.profiles', to_jsonb(p)
from public.profiles p
where p.id = '0126c15d-f34c-4ed9-9d15-6e3dda178e99';

insert into public._backup_20261006_demo_admin (kind, payload)
select 'public.employees', to_jsonb(e)
from public.employees e
where e.id = '394e0ba4-7d98-4fda-afad-dc146cd47432';

insert into public._backup_20261006_demo_admin (kind, payload)
select 'public.employee_assignments', to_jsonb(a)
from public.employee_assignments a
where a.employee_id = '394e0ba4-7d98-4fda-afad-dc146cd47432';

update auth.users
set banned_until = timestamptz '2099-12-31 23:59:59+00'
where id = '0126c15d-f34c-4ed9-9d15-6e3dda178e99'
  and banned_until is null;

delete from auth.sessions
where user_id = '0126c15d-f34c-4ed9-9d15-6e3dda178e99';

update public.employees
set status = 'inactive', updated_at = now()
where id = '394e0ba4-7d98-4fda-afad-dc146cd47432'
  and status is distinct from 'inactive';

alter table public.profiles
  add column if not exists password_changed_at timestamptz;

create table if not exists public.login_events (
  id uuid primary key default gen_random_uuid(),
  email text,
  user_id uuid,
  success boolean not null,
  ip text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists login_events_user_id_idx on public.login_events (user_id, created_at desc);
create index if not exists login_events_email_idx on public.login_events (email, created_at desc);

alter table public.login_events enable row level security;
revoke all on table public.login_events from anon, public;
grant select on table public.login_events to authenticated;

drop policy if exists login_events_select_own on public.login_events;
create policy login_events_select_own on public.login_events
  for select to authenticated
  using (user_id = auth.uid());
