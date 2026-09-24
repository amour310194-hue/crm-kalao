-- Lecture / fil de réponse type boîte mail.

alter table public.crm_emails
  add column if not exists unread boolean not null default false;

alter table public.crm_emails
  add column if not exists in_reply_to uuid references public.crm_emails(id) on delete set null;

update public.crm_emails
set unread = true
where direction = 'in'
  and folder = 'inbox'
  and unread = false;

create index if not exists crm_emails_unread_idx
  on public.crm_emails (mailbox, unread)
  where unread = true;
