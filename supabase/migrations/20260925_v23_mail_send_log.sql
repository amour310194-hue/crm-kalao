create table if not exists public.mail_send_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null,
  mailbox text not null,
  from_email text not null,
  to_email text not null,
  subject text,
  resend_id text,
  ok boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists mail_send_log_actor_idx
  on public.mail_send_log (actor_id, created_at desc);

alter table public.mail_send_log enable row level security;
revoke all on public.mail_send_log from anon, authenticated, public;
