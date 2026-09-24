-- L'admin choisit qui voit Contact / No-reply.
-- Sans ligne ACL pour une boîte, tout le personnel y a encore accès.

create table if not exists public.crm_mailbox_settings (
  mailbox text primary key check (mailbox in ('contact', 'noreply')),
  restricted boolean not null default false
);

insert into public.crm_mailbox_settings (mailbox, restricted)
values ('contact', false), ('noreply', false)
on conflict (mailbox) do nothing;

create table if not exists public.crm_mailbox_acl (
  mailbox text not null check (mailbox in ('contact', 'noreply')),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (mailbox, profile_id)
);

create index if not exists crm_mailbox_acl_profile_idx on public.crm_mailbox_acl (profile_id);

alter table public.crm_mailbox_settings enable row level security;
alter table public.crm_mailbox_acl enable row level security;

create or replace function public.can_use_shared_mailbox(box text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    public.is_crm_admin()
    or not exists (
      select 1 from public.crm_mailbox_settings s
      where s.mailbox = box and s.restricted
    )
    or exists (
      select 1 from public.crm_mailbox_acl a
      where a.mailbox = box and a.profile_id = auth.uid()
    )
$$;

create or replace function public.shared_mailboxes_for_me()
returns text[]
language sql
stable
security definer
set search_path = public
as $$
  select array_remove(array[
    case when public.can_use_shared_mailbox('contact') then 'contact' end,
    case when public.can_use_shared_mailbox('noreply') then 'noreply' end
  ], null)
$$;

revoke all on function public.can_use_shared_mailbox(text) from public;
revoke all on function public.shared_mailboxes_for_me() from public;
grant execute on function public.can_use_shared_mailbox(text) to authenticated;
grant execute on function public.shared_mailboxes_for_me() to authenticated;

drop policy if exists crm_mailbox_settings_select on public.crm_mailbox_settings;
create policy crm_mailbox_settings_select on public.crm_mailbox_settings
  for select to authenticated
  using (true);

drop policy if exists crm_mailbox_settings_write on public.crm_mailbox_settings;
create policy crm_mailbox_settings_write on public.crm_mailbox_settings
  for all to authenticated
  using (public.is_staff_manager())
  with check (public.is_staff_manager());

drop policy if exists crm_mailbox_acl_select on public.crm_mailbox_acl;
create policy crm_mailbox_acl_select on public.crm_mailbox_acl
  for select to authenticated
  using (true);

drop policy if exists crm_mailbox_acl_write on public.crm_mailbox_acl;
create policy crm_mailbox_acl_write on public.crm_mailbox_acl
  for all to authenticated
  using (public.is_staff_manager())
  with check (public.is_staff_manager());

drop policy if exists crm_emails_select on public.crm_emails;
create policy crm_emails_select on public.crm_emails
  for select to authenticated
  using (
    (mailbox = 'personal' and owner_id = auth.uid())
    or (mailbox in ('contact', 'noreply') and public.can_use_shared_mailbox(mailbox))
  );

drop policy if exists crm_emails_insert on public.crm_emails;
create policy crm_emails_insert on public.crm_emails
  for insert to authenticated
  with check (
    (mailbox = 'personal' and owner_id = auth.uid())
    or (
      mailbox in ('contact', 'noreply')
      and public.can_use_shared_mailbox(mailbox)
      and (owner_id is null or owner_id = auth.uid())
    )
  );

drop policy if exists crm_emails_update on public.crm_emails;
create policy crm_emails_update on public.crm_emails
  for update to authenticated
  using (
    (mailbox = 'personal' and owner_id = auth.uid())
    or (mailbox in ('contact', 'noreply') and public.can_use_shared_mailbox(mailbox))
  )
  with check (
    (mailbox = 'personal' and owner_id = auth.uid())
    or (mailbox in ('contact', 'noreply') and public.can_use_shared_mailbox(mailbox))
  );
