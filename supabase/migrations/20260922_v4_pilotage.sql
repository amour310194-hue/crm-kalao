-- V4 pilotage : To Do a besoin d'un état coché distinct du reste des activités.
-- Migration additive uniquement : aucune colonne existante n'est modifiée.

alter table public.activities
  add column if not exists done boolean not null default false;

create index if not exists activities_due_at_idx on public.activities (due_at);
create index if not exists activities_type_done_idx on public.activities (type, done);
