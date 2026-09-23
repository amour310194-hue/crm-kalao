-- Boîtes partagées (contact / no-reply) visibles par tout le personnel.
-- Boîte personnelle visible uniquement par le propriétaire.

create table if not exists public.crm_emails (
  id uuid primary key default gen_random_uuid(),
  mailbox text not null check (mailbox in ('noreply', 'contact', 'personal')),
  owner_id uuid references public.profiles(id) on delete set null,
  direction text not null check (direction in ('in', 'out')),
  from_email text not null,
  to_email text not null,
  subject text not null,
  body text not null,
  company_id uuid references public.companies(id) on delete set null,
  contact_id uuid references public.contacts(id) on delete set null,
  invoice_id uuid references public.invoices(id) on delete set null,
  resend_id text,
  status text not null default 'stored' check (status in ('stored', 'sent', 'failed')),
  created_at timestamptz not null default now()
);

create index if not exists crm_emails_mailbox_created_idx on public.crm_emails (mailbox, created_at desc);
create index if not exists crm_emails_owner_created_idx on public.crm_emails (owner_id, created_at desc);
create index if not exists crm_emails_party_idx on public.crm_emails (company_id, contact_id);

alter table public.crm_emails enable row level security;

drop policy if exists crm_emails_select on public.crm_emails;
create policy crm_emails_select on public.crm_emails
  for select to authenticated
  using (
    mailbox in ('noreply', 'contact')
    or owner_id = auth.uid()
  );

drop policy if exists crm_emails_insert on public.crm_emails;
create policy crm_emails_insert on public.crm_emails
  for insert to authenticated
  with check (
    (mailbox in ('noreply', 'contact') and (owner_id is null or owner_id = auth.uid()))
    or (mailbox = 'personal' and owner_id = auth.uid())
  );

drop policy if exists crm_emails_update on public.crm_emails;
create policy crm_emails_update on public.crm_emails
  for update to authenticated
  using (
    mailbox in ('noreply', 'contact')
    or owner_id = auth.uid()
  )
  with check (
    mailbox in ('noreply', 'contact')
    or owner_id = auth.uid()
  );

drop policy if exists crm_emails_delete on public.crm_emails;
create policy crm_emails_delete on public.crm_emails
  for delete to authenticated
  using (public.is_crm_admin());
