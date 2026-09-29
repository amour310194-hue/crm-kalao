-- V34 : notifications CRM (mails reçus, activités, rappels, prospects, affaires gagnées).

create table if not exists public.crm_notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null check (kind in (
    'mail', 'activity', 'reminder', 'appointment', 'lead', 'deal', 'system'
  )),
  title text not null,
  body text,
  href text,
  ref_table text,
  ref_id uuid,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists crm_notifications_inbox_idx
  on public.crm_notifications (recipient_id, created_at desc);

create unique index if not exists crm_notifications_dedup_idx
  on public.crm_notifications (recipient_id, kind, ref_id)
  where ref_id is not null;

alter table public.crm_notifications enable row level security;

drop policy if exists crm_notifications_select on public.crm_notifications;
create policy crm_notifications_select on public.crm_notifications
  for select to authenticated
  using (recipient_id = auth.uid());

drop policy if exists crm_notifications_update on public.crm_notifications;
create policy crm_notifications_update on public.crm_notifications
  for update to authenticated
  using (recipient_id = auth.uid())
  with check (recipient_id = auth.uid());

drop policy if exists crm_notifications_delete on public.crm_notifications;
create policy crm_notifications_delete on public.crm_notifications
  for delete to authenticated
  using (recipient_id = auth.uid());

revoke all on public.crm_notifications from public, anon;
grant select, update, delete on public.crm_notifications to authenticated;

create or replace function public.notify_profiles(
  p_ids uuid[],
  p_kind text,
  p_title text,
  p_body text,
  p_href text,
  p_ref_table text,
  p_ref_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_ids is null or cardinality(p_ids) = 0 then
    return;
  end if;
  insert into public.crm_notifications (
    recipient_id, kind, title, body, href, ref_table, ref_id
  )
  select distinct uid, p_kind, p_title, p_body, p_href, p_ref_table, p_ref_id
  from unnest(p_ids) as uid
  where uid is not null
    and not exists (
      select 1
      from public.crm_notifications n
      where n.recipient_id = uid
        and n.kind = p_kind
        and n.ref_id is not distinct from p_ref_id
    );
end;
$$;

create or replace function public.notify_all_staff(
  p_kind text,
  p_title text,
  p_body text,
  p_href text,
  p_ref_table text,
  p_ref_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.notify_profiles(
    array(select id from public.profiles),
    p_kind, p_title, p_body, p_href, p_ref_table, p_ref_id
  );
end;
$$;

create or replace function public.mailbox_notify_ids(box text, owner uuid)
returns uuid[]
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(array_agg(distinct p.id), '{}'::uuid[])
  from public.profiles p
  where
    (box = 'personal' and owner is not null and p.id = owner)
    or (box = 'triage' and p.role in ('super_admin', 'admin', 'manager', 'direction'))
    or (
      box = 'contact'
      and (
        p.role in ('super_admin', 'admin', 'manager', 'direction')
        or not exists (
          select 1 from public.crm_mailbox_settings s
          where s.mailbox = 'contact' and s.restricted
        )
        or exists (
          select 1 from public.crm_mailbox_acl a
          where a.mailbox = 'contact' and a.profile_id = p.id
        )
      )
    );
$$;

create or replace function public.trg_notify_mail()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  who text;
begin
  if new.direction is distinct from 'in' then
    return new;
  end if;
  if coalesce(new.folder, '') <> 'inbox' then
    return new;
  end if;
  if coalesce(new.mailbox, '') = 'noreply' then
    return new;
  end if;
  who := nullif(btrim(coalesce(new.from_name, '')), '');
  if who is null then
    who := coalesce(new.from_email, 'Expéditeur');
  end if;
  begin
    perform public.notify_profiles(
      public.mailbox_notify_ids(new.mailbox, new.owner_id),
      'mail',
      'Mail reçu',
      who || ' — ' || coalesce(nullif(btrim(new.subject), ''), 'Sans objet'),
      '/application/email',
      'crm_emails',
      new.id
    );
  exception when others then
    raise warning 'notify mail: %', sqlerrm;
  end;
  return new;
end;
$$;

drop trigger if exists crm_emails_notify on public.crm_emails;
create trigger crm_emails_notify
  after insert on public.crm_emails
  for each row execute procedure public.trg_notify_mail();

create or replace function public.trg_notify_lead()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  begin
    perform public.notify_all_staff(
      'lead',
      'Nouveau prospect',
      coalesce(nullif(btrim(new.title), ''), 'Prospect'),
      '/leads-details?id=' || new.id::text,
      'leads',
      new.id
    );
  exception when others then
    raise warning 'notify lead: %', sqlerrm;
  end;
  return new;
end;
$$;

drop trigger if exists leads_notify on public.leads;
create trigger leads_notify
  after insert on public.leads
  for each row execute procedure public.trg_notify_lead();

create or replace function public.trg_notify_deal()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'UPDATE' and not (new.stage = 'won' and coalesce(old.stage, '') is distinct from 'won') then
    return new;
  end if;
  if tg_op = 'INSERT' and new.stage is distinct from 'won' then
    return new;
  end if;
  begin
    perform public.notify_all_staff(
      'deal',
      'Affaire gagnée',
      coalesce(nullif(btrim(new.title), ''), 'Affaire'),
      '/crm/deals-details?id=' || new.id::text,
      'deals',
      new.id
    );
  exception when others then
    raise warning 'notify deal: %', sqlerrm;
  end;
  return new;
end;
$$;

drop trigger if exists deals_notify on public.deals;
create trigger deals_notify
  after insert or update of stage on public.deals
  for each row execute procedure public.trg_notify_deal();

create or replace function public.trg_notify_activity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  kind text;
  title text;
  when_label text;
begin
  if new.type not in ('meeting', 'task', 'call') then
    return new;
  end if;
  kind := case when new.type = 'meeting' then 'appointment' else 'activity' end;
  title := case
    when new.type = 'meeting' then 'Rendez-vous'
    when new.type = 'call' then 'Appel'
    else 'Tâche'
  end;
  when_label := '';
  if new.due_at is not null then
    when_label := ' — ' || to_char(new.due_at at time zone 'Africa/Douala', 'DD/MM/YYYY HH24:MI');
  end if;
  begin
    perform public.notify_all_staff(
      kind,
      title,
      coalesce(nullif(btrim(new.subject), ''), title) || when_label,
      '/calendar',
      'activities',
      new.id
    );
  exception when others then
    raise warning 'notify activity: %', sqlerrm;
  end;
  return new;
end;
$$;

drop trigger if exists activities_notify on public.activities;
create trigger activities_notify
  after insert on public.activities
  for each row execute procedure public.trg_notify_activity();

create or replace function public.refresh_due_reminders()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  n int := 0;
  a record;
begin
  for a in
    select id, type, subject, due_at
    from public.activities
    where due_at is not null
      and due_at >= now()
      and due_at <= now() + interval '2 hours'
      and coalesce(done, false) = false
      and done_at is null
  loop
    perform public.notify_all_staff(
      'reminder',
      'Rappel rendez-vous',
      coalesce(nullif(btrim(a.subject), ''), 'Échéance')
        || ' — ' || to_char(a.due_at at time zone 'Africa/Douala', 'HH24:MI'),
      '/calendar',
      'activities',
      a.id
    );
    n := n + 1;
  end loop;
  return n;
end;
$$;

revoke all on function public.notify_profiles(uuid[], text, text, text, text, text, uuid) from public, anon;
revoke all on function public.notify_all_staff(text, text, text, text, text, uuid) from public, anon;
revoke all on function public.mailbox_notify_ids(text, uuid) from public, anon;
revoke all on function public.trg_notify_mail() from public, anon;
revoke all on function public.trg_notify_lead() from public, anon;
revoke all on function public.trg_notify_deal() from public, anon;
revoke all on function public.trg_notify_activity() from public, anon;
revoke all on function public.refresh_due_reminders() from public, anon;

grant execute on function public.refresh_due_reminders() to authenticated;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'crm_notifications'
    ) then
      alter publication supabase_realtime add table public.crm_notifications;
    end if;
  end if;
end;
$$;

alter table public.crm_notifications replica identity full;
