-- V26 : messagerie type Gmail / Outlook.
-- DDL + nouvelles tables. Aucune ligne existante de crm_emails n'est modifiée ni supprimée :
-- les anciens mails restent lisibles via coalesce(thread_id, id), coalesce(état perso, drapeau commun).
-- Idempotent : peut être rejouée.

-- ---------------------------------------------------------------------------
-- 1. crm_emails : destinataires multiples, HTML, fils, livraison, attribution
-- ---------------------------------------------------------------------------

alter table public.crm_emails
  add column if not exists from_name text,
  add column if not exists to_emails text[] not null default '{}',
  add column if not exists cc_emails text[] not null default '{}',
  add column if not exists bcc_emails text[] not null default '{}',
  add column if not exists html text,
  add column if not exists snippet text,
  add column if not exists message_id text,
  add column if not exists in_reply_to_header text,
  add column if not exists references_header text[] not null default '{}',
  add column if not exists thread_id uuid,
  add column if not exists has_attachments boolean not null default false,
  add column if not exists delivery_status text,
  add column if not exists delivery_detail text,
  add column if not exists delivery_updated_at timestamptz,
  add column if not exists scheduled_at timestamptz,
  add column if not exists sent_at timestamptz,
  add column if not exists assigned_to uuid references public.profiles(id) on delete set null,
  add column if not exists created_by uuid references public.profiles(id) on delete set null,
  add column if not exists dossier_id uuid references public.dossiers(id) on delete set null,
  add column if not exists auth_spf text,
  add column if not exists auth_dkim text,
  add column if not exists auth_dmarc text;

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'crm_emails' and column_name = 'search'
  ) then
    alter table public.crm_emails
      add column search tsvector generated always as (
        setweight(to_tsvector('french'::regconfig, coalesce(subject, '')), 'A')
        || setweight(to_tsvector('simple'::regconfig, coalesce(from_name, '') || ' ' || coalesce(from_email, '') || ' ' || coalesce(to_email, '')), 'B')
        || setweight(to_tsvector('french'::regconfig, coalesce(body, '')), 'C')
      ) stored;
  end if;
end $$;

alter table public.crm_emails drop constraint if exists crm_emails_mailbox_check;
alter table public.crm_emails
  add constraint crm_emails_mailbox_check
  check (mailbox in ('noreply', 'contact', 'personal', 'triage'));

alter table public.crm_emails drop constraint if exists crm_emails_folder_check;
alter table public.crm_emails
  add constraint crm_emails_folder_check
  check (folder in ('inbox', 'sent', 'drafts', 'deleted', 'spam', 'archive', 'scheduled'));

alter table public.crm_emails drop constraint if exists crm_emails_status_check;
alter table public.crm_emails
  add constraint crm_emails_status_check
  check (status in ('stored', 'queued', 'scheduled', 'sent', 'failed', 'cancelled'));

alter table public.crm_emails drop constraint if exists crm_emails_delivery_status_check;
alter table public.crm_emails
  add constraint crm_emails_delivery_status_check
  check (delivery_status is null or delivery_status in (
    'queued', 'scheduled', 'sent', 'delivered', 'delayed', 'bounced',
    'complained', 'failed', 'cancelled', 'suppressed', 'opened'
  ));

create index if not exists crm_emails_thread_idx on public.crm_emails (thread_id, created_at);
create index if not exists crm_emails_message_id_idx on public.crm_emails (message_id) where message_id is not null;
create index if not exists crm_emails_resend_id_idx on public.crm_emails (resend_id) where resend_id is not null;
create index if not exists crm_emails_search_idx on public.crm_emails using gin (search);
create index if not exists crm_emails_assigned_idx on public.crm_emails (assigned_to) where assigned_to is not null;
create index if not exists crm_emails_box_folder_idx on public.crm_emails (mailbox, folder, created_at desc);
create index if not exists crm_emails_contact_idx on public.crm_emails (contact_id, created_at desc);
create index if not exists crm_emails_company_idx on public.crm_emails (company_id, created_at desc);

-- ---------------------------------------------------------------------------
-- 2. État personnel (lu, suivi, important, en attente) : une personne qui lit
--    un mail d'une boîte partagée ne le marque pas lu pour les autres.
-- ---------------------------------------------------------------------------

create table if not exists public.crm_email_user_state (
  email_id uuid not null references public.crm_emails(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  read boolean,
  starred boolean,
  important boolean,
  snoozed_until timestamptz,
  updated_at timestamptz not null default now(),
  primary key (email_id, user_id)
);
create index if not exists crm_email_user_state_user_idx on public.crm_email_user_state (user_id);

-- ---------------------------------------------------------------------------
-- 3. Libellés, pièces jointes, modèles, signatures, adresses rejetées, relances
-- ---------------------------------------------------------------------------

create table if not exists public.crm_email_labels (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) between 1 and 60),
  color text not null default '#6c757d',
  owner_id uuid references public.profiles(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.crm_email_label_links (
  email_id uuid not null references public.crm_emails(id) on delete cascade,
  label_id uuid not null references public.crm_email_labels(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (email_id, label_id)
);
create index if not exists crm_email_label_links_label_idx on public.crm_email_label_links (label_id);

create table if not exists public.crm_email_attachments (
  id uuid primary key default gen_random_uuid(),
  email_id uuid not null references public.crm_emails(id) on delete cascade,
  filename text not null,
  content_type text,
  size_bytes bigint not null default 0,
  storage_path text not null,
  content_id text,
  inline boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists crm_email_attachments_email_idx on public.crm_email_attachments (email_id);

create table if not exists public.crm_mail_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subject text not null default '',
  body_html text not null default '',
  owner_id uuid references public.profiles(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table if not exists public.crm_mail_signatures (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  html text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.crm_mail_suppressions (
  email text primary key,
  reason text not null,
  detail text,
  source_email_id uuid references public.crm_emails(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.crm_mail_reminders (
  id uuid primary key default gen_random_uuid(),
  kind text not null,
  ref_id uuid not null,
  email_id uuid references public.crm_emails(id) on delete set null,
  sent_to text,
  created_at timestamptz not null default now(),
  unique (kind, ref_id)
);

-- ---------------------------------------------------------------------------
-- 4. RLS : lecture par la base, écriture uniquement par l'API serveur
-- ---------------------------------------------------------------------------

alter table public.crm_email_user_state enable row level security;
alter table public.crm_email_labels enable row level security;
alter table public.crm_email_label_links enable row level security;
alter table public.crm_email_attachments enable row level security;
alter table public.crm_mail_templates enable row level security;
alter table public.crm_mail_signatures enable row level security;
alter table public.crm_mail_suppressions enable row level security;
alter table public.crm_mail_reminders enable row level security;

-- crm_emails : on garde la lecture (boîtes partagées selon ACL, boîte perso au propriétaire,
-- file « À trier » aux admins). Plus aucune écriture directe depuis le navigateur :
-- l'historique ne peut plus être inventé ni retouché.
drop policy if exists crm_emails_select on public.crm_emails;
create policy crm_emails_select on public.crm_emails
  for select to authenticated
  using (
    (mailbox = 'personal' and owner_id = auth.uid())
    or (mailbox in ('contact', 'noreply') and public.can_use_shared_mailbox(mailbox))
    or (mailbox = 'triage' and public.is_crm_admin())
  );
drop policy if exists crm_emails_insert on public.crm_emails;
drop policy if exists crm_emails_update on public.crm_emails;
drop policy if exists crm_emails_delete on public.crm_emails;
revoke insert, update, delete on public.crm_emails from anon, authenticated;
grant select on public.crm_emails to authenticated;

drop policy if exists crm_email_user_state_select on public.crm_email_user_state;
create policy crm_email_user_state_select on public.crm_email_user_state
  for select to authenticated using (user_id = auth.uid());

drop policy if exists crm_email_labels_select on public.crm_email_labels;
create policy crm_email_labels_select on public.crm_email_labels
  for select to authenticated
  using (public.is_staff() and (owner_id is null or owner_id = auth.uid()));

drop policy if exists crm_email_label_links_select on public.crm_email_label_links;
create policy crm_email_label_links_select on public.crm_email_label_links
  for select to authenticated
  using (exists (select 1 from public.crm_emails e where e.id = email_id));

drop policy if exists crm_email_attachments_select on public.crm_email_attachments;
create policy crm_email_attachments_select on public.crm_email_attachments
  for select to authenticated
  using (exists (select 1 from public.crm_emails e where e.id = email_id));

drop policy if exists crm_mail_templates_select on public.crm_mail_templates;
create policy crm_mail_templates_select on public.crm_mail_templates
  for select to authenticated
  using (public.is_staff() and (owner_id is null or owner_id = auth.uid()));

drop policy if exists crm_mail_signatures_select on public.crm_mail_signatures;
create policy crm_mail_signatures_select on public.crm_mail_signatures
  for select to authenticated using (user_id = auth.uid());

drop policy if exists crm_mail_suppressions_select on public.crm_mail_suppressions;
create policy crm_mail_suppressions_select on public.crm_mail_suppressions
  for select to authenticated using (public.is_staff());

drop policy if exists crm_mail_reminders_select on public.crm_mail_reminders;
create policy crm_mail_reminders_select on public.crm_mail_reminders
  for select to authenticated using (public.is_direction());

do $$
declare t text;
begin
  foreach t in array array[
    'crm_email_user_state', 'crm_email_labels', 'crm_email_label_links',
    'crm_email_attachments', 'crm_mail_templates', 'crm_mail_signatures',
    'crm_mail_suppressions', 'crm_mail_reminders'
  ]
  loop
    execute format('revoke all on public.%I from anon, public', t);
    execute format('revoke insert, update, delete on public.%I from authenticated', t);
    execute format('grant select on public.%I to authenticated', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- 5. Annuaire pour l'attribution et l'autocomplétion (nom + e-mail pro seulement)
-- ---------------------------------------------------------------------------

create or replace function public.mail_directory()
returns table (profile_id uuid, full_name text, email text, role text)
language sql stable security definer set search_path = public
as $$
  select p.id, coalesce(e.full_name, p.full_name, split_part(coalesce(e.email, ''), '@', 1)), lower(e.email), p.role
  from public.profiles p
  left join public.employees e on e.profile_id = p.id
  where public.is_staff() and p.role is not null
  order by 2
$$;
revoke all on function public.mail_directory() from public, anon;
grant execute on function public.mail_directory() to authenticated;

-- ---------------------------------------------------------------------------
-- 6. Liste des conversations (une ligne par fil), filtrée et paginée côté base.
--    security invoker : la RLS de crm_emails s'applique.
-- ---------------------------------------------------------------------------

drop function if exists public.mail_threads(text, text, uuid, text, text, text, text, boolean, boolean, timestamptz, timestamptz, uuid, uuid, text, integer, integer);
create or replace function public.mail_threads(
  p_mailbox text default null,
  p_folder text default 'inbox',
  p_label uuid default null,
  p_search text default null,
  p_from text default null,
  p_to text default null,
  p_subject text default null,
  p_has_attachment boolean default null,
  p_unread boolean default null,
  p_after timestamptz default null,
  p_before timestamptz default null,
  p_contact uuid default null,
  p_company uuid default null,
  p_party_email text default null,
  p_limit integer default 50,
  p_offset integer default 0
)
returns table (
  thread_id uuid,
  mailbox text,
  last_id uuid,
  last_at timestamptz,
  subject text,
  snippet text,
  participants text[],
  message_count integer,
  unread_count integer,
  starred boolean,
  important boolean,
  has_attachments boolean,
  has_draft boolean,
  label_ids uuid[],
  assigned_to uuid,
  last_direction text,
  last_delivery text,
  snoozed_until timestamptz,
  contact_id uuid,
  company_id uuid,
  dossier_id uuid,
  total_count bigint
)
language sql stable security invoker set search_path = public
as $$
  with msg as (
    select
      e.id, e.mailbox, e.direction, e.folder, e.subject, e.body, e.snippet, e.created_at,
      e.from_email, e.from_name, e.to_email, e.to_emails, e.cc_emails,
      e.has_attachments, e.assigned_to, e.delivery_status, e.search,
      e.contact_id, e.company_id, e.dossier_id,
      coalesce(e.thread_id, e.id) as tid,
      coalesce(s.read, not e.unread) as is_read,
      coalesce(s.starred, e.starred) as is_starred,
      coalesce(s.important, e.important) as is_important,
      s.snoozed_until as snooze
    from public.crm_emails e
    left join public.crm_email_user_state s
      on s.email_id = e.id and s.user_id = auth.uid()
    where p_mailbox is null or e.mailbox = p_mailbox
  ),
  hits as (
    select distinct m.tid
    from msg m
    where (
      case coalesce(p_folder, 'inbox')
        when 'inbox' then m.folder = 'inbox' and (m.snooze is null or m.snooze <= now())
        when 'snoozed' then m.snooze > now() and m.folder not in ('deleted', 'spam')
        when 'starred' then m.is_starred and m.folder not in ('deleted', 'spam')
        when 'important' then m.is_important and m.folder not in ('deleted', 'spam')
        when 'assigned' then m.assigned_to = auth.uid() and m.folder not in ('deleted', 'spam')
        when 'unread' then not m.is_read and m.folder not in ('deleted', 'spam', 'drafts')
        when 'all' then m.folder not in ('deleted', 'spam')
        when 'label' then m.folder not in ('deleted', 'spam')
        else m.folder = p_folder
      end
    )
    and (p_label is null or exists (
      select 1 from public.crm_email_label_links l where l.email_id = m.id and l.label_id = p_label
    ))
    and (p_search is null or p_search = '' or
      m.search @@ websearch_to_tsquery('french', p_search)
      or m.subject ilike '%' || p_search || '%'
      or m.from_email ilike '%' || p_search || '%'
      or coalesce(m.from_name, '') ilike '%' || p_search || '%'
      or m.to_email ilike '%' || p_search || '%')
    and (p_from is null or m.from_email ilike '%' || p_from || '%' or coalesce(m.from_name, '') ilike '%' || p_from || '%')
    and (p_to is null or m.to_email ilike '%' || p_to || '%'
      or exists (select 1 from unnest(m.to_emails || m.cc_emails) r where r ilike '%' || p_to || '%'))
    and (p_subject is null or m.subject ilike '%' || p_subject || '%')
    and (p_has_attachment is null or m.has_attachments = p_has_attachment)
    and (p_unread is null or (not m.is_read) = p_unread)
    and (p_after is null or m.created_at >= p_after)
    and (p_before is null or m.created_at < p_before)
    and (p_contact is null or m.contact_id = p_contact)
    and (p_company is null or m.company_id = p_company)
    and (p_party_email is null or lower(m.from_email) = lower(p_party_email)
      or lower(m.to_email) = lower(p_party_email)
      or lower(p_party_email) = any (m.to_emails || m.cc_emails))
  ),
  thread_msgs as (
    select m.*
    from msg m
    join hits h on h.tid = m.tid
    where case
      when p_folder in ('deleted', 'spam') then m.folder = p_folder
      else m.folder not in ('deleted', 'spam')
    end
  ),
  agg as (
    select
      t.tid,
      (array_agg(t.mailbox order by t.created_at desc))[1] as mailbox,
      (array_agg(t.id order by t.created_at desc))[1] as last_id,
      max(t.created_at) as last_at,
      (array_agg(t.subject order by t.created_at asc))[1] as subject,
      (array_agg(coalesce(t.snippet, left(t.body, 220)) order by t.created_at desc))[1] as snippet,
      array_agg(
        case when t.direction = 'out' then '__me__' else coalesce(nullif(t.from_name, ''), t.from_email) end
        order by t.created_at asc
      ) as participants,
      (count(*) filter (where t.folder <> 'drafts'))::integer as message_count,
      (count(*) filter (where not t.is_read))::integer as unread_count,
      bool_or(t.is_starred) as starred,
      bool_or(t.is_important) as important,
      bool_or(t.has_attachments) as has_attachments,
      bool_or(t.folder = 'drafts') as has_draft,
      (array_agg(t.assigned_to order by t.created_at desc) filter (where t.assigned_to is not null))[1] as assigned_to,
      (array_agg(t.direction order by t.created_at desc))[1] as last_direction,
      (array_agg(t.delivery_status order by t.created_at desc) filter (where t.direction = 'out' and t.folder <> 'drafts'))[1] as last_delivery,
      max(t.snooze) as snoozed_until,
      (array_agg(t.contact_id order by t.created_at desc) filter (where t.contact_id is not null))[1] as contact_id,
      (array_agg(t.company_id order by t.created_at desc) filter (where t.company_id is not null))[1] as company_id,
      (array_agg(t.dossier_id order by t.created_at desc) filter (where t.dossier_id is not null))[1] as dossier_id
    from thread_msgs t
    group by t.tid
  )
  select
    a.tid, a.mailbox, a.last_id, a.last_at, a.subject, a.snippet, a.participants,
    a.message_count, a.unread_count, a.starred, a.important, a.has_attachments, a.has_draft,
    coalesce((
      select array_agg(distinct l.label_id)
      from public.crm_email_label_links l
      join thread_msgs tm on tm.id = l.email_id
      where tm.tid = a.tid
    ), '{}') as label_ids,
    a.assigned_to, a.last_direction, a.last_delivery, a.snoozed_until,
    a.contact_id, a.company_id, a.dossier_id,
    count(*) over () as total_count
  from agg a
  order by a.last_at desc
  limit least(greatest(coalesce(p_limit, 50), 1), 200)
  offset greatest(coalesce(p_offset, 0), 0)
$$;
revoke all on function public.mail_threads(text, text, uuid, text, text, text, text, boolean, boolean, timestamptz, timestamptz, uuid, uuid, text, integer, integer) from public, anon;
grant execute on function public.mail_threads(text, text, uuid, text, text, text, text, boolean, boolean, timestamptz, timestamptz, uuid, uuid, text, integer, integer) to authenticated;

-- Compteurs de la barre latérale : non lus (réception, spam, libellés, attribués),
-- totaux (brouillons, programmés, en attente). Par boîte visible.
create or replace function public.mail_counts()
returns table (mailbox text, key text, count bigint)
language sql stable security invoker set search_path = public
as $$
  with msg as (
    select
      e.id, e.mailbox, e.folder, coalesce(e.thread_id, e.id) as tid, e.assigned_to,
      coalesce(s.read, not e.unread) as is_read,
      s.snoozed_until as snooze
    from public.crm_emails e
    left join public.crm_email_user_state s on s.email_id = e.id and s.user_id = auth.uid()
  )
  select mailbox, 'inbox', count(distinct tid) from msg
    where folder = 'inbox' and not is_read and (snooze is null or snooze <= now()) group by mailbox
  union all
  select mailbox, 'spam', count(distinct tid) from msg where folder = 'spam' and not is_read group by mailbox
  union all
  select mailbox, 'drafts', count(*) from msg where folder = 'drafts' group by mailbox
  union all
  select mailbox, 'scheduled', count(*) from msg where folder = 'scheduled' group by mailbox
  union all
  select mailbox, 'snoozed', count(distinct tid) from msg
    where snooze > now() and folder not in ('deleted', 'spam') group by mailbox
  union all
  select mailbox, 'assigned', count(distinct tid) from msg
    where assigned_to = auth.uid() and not is_read and folder not in ('deleted', 'spam') group by mailbox
  union all
  select m.mailbox, 'label:' || l.label_id::text, count(distinct m.tid)
    from msg m join public.crm_email_label_links l on l.email_id = m.id
    where not m.is_read and m.folder not in ('deleted', 'spam')
    group by m.mailbox, l.label_id
$$;
revoke all on function public.mail_counts() from public, anon;
grant execute on function public.mail_counts() to authenticated;

-- ---------------------------------------------------------------------------
-- 7. Stockage privé des pièces jointes (accès uniquement par URL signée serveur)
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit)
values ('mail-attachments', 'mail-attachments', false, 26214400)
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit;

-- ---------------------------------------------------------------------------
-- 8. Temps réel : les nouveaux mails arrivent sans recharger (RLS respectée)
-- ---------------------------------------------------------------------------

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (
       select 1 from pg_publication_tables
       where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'crm_emails'
     ) then
    alter publication supabase_realtime add table public.crm_emails;
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 9. Modèles partagés de départ (repris de l'ancien code, modifiables par la direction)
-- ---------------------------------------------------------------------------

insert into public.crm_mail_templates (name, subject, body_html, owner_id)
select v.name, v.subject, v.body_html, null
from (values
  ('Accueil client', 'Bienvenue chez Groupe Kalao',
   '<p>Bonjour {{nom}},</p><p>Merci de nous avoir contactés. Nous avons bien reçu votre demande et un conseiller Kalao vous répond sous 24 heures.</p><p>Vous pouvez répondre à cet e-mail pour nous transmettre des précisions ou des pièces.</p><p>Cordialement,</p>'),
  ('Accusé de réception', 'Nous avons bien reçu votre message',
   '<p>Bonjour {{nom}},</p><p>Votre message est bien arrivé. Nous le traitons et revenons vers vous dès que possible.</p><p>Cordialement,</p>'),
  ('Suivi de dossier', 'Suivi de votre dossier {{dossier}}',
   '<p>Bonjour {{nom}},</p><p>Voici un point sur votre dossier <strong>{{dossier}}</strong>.</p><p>N''hésitez pas à nous écrire si vous avez des questions.</p><p>Cordialement,</p>'),
  ('Rappel d''échéance', 'Rappel : échéance du {{echeance}}',
   '<p>Bonjour {{nom}},</p><p>Nous vous rappelons que la facture <strong>{{facture}}</strong> arrive à échéance le <strong>{{echeance}}</strong>. Reste à payer : <strong>{{reste_a_payer}}</strong>.</p><p>Cordialement,</p>')
) as v(name, subject, body_html)
where not exists (
  select 1 from public.crm_mail_templates t where t.owner_id is null and t.name = v.name
);
