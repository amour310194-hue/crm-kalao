-- Dossiers Inbox / Sent / Drafts / Deleted / Spam + drapeaux Starred / Important, par boîte.

alter table public.crm_emails
  add column if not exists folder text not null default 'inbox',
  add column if not exists starred boolean not null default false,
  add column if not exists important boolean not null default false;

alter table public.crm_emails
  drop constraint if exists crm_emails_folder_check;

alter table public.crm_emails
  add constraint crm_emails_folder_check
  check (folder in ('inbox', 'sent', 'drafts', 'deleted', 'spam'));

update public.crm_emails
  set folder = 'sent'
  where direction = 'out' and folder = 'inbox';

create index if not exists crm_emails_mailbox_folder_idx
  on public.crm_emails (mailbox, folder, created_at desc);
