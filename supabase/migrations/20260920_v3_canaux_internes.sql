-- V3 canaux : fils internes, mur interne, e-mails stockés (Meta / Resend optionnels).

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  channel text not null default 'internal' check (channel in (
    'internal', 'whatsapp', 'messenger', 'instagram', 'email'
  )),
  company_id uuid references public.companies(id) on delete set null,
  contact_id uuid references public.contacts(id) on delete set null,
  employee_id uuid references public.employees(id) on delete set null,
  dossier_id uuid references public.dossiers(id) on delete set null,
  title text not null,
  last_preview text,
  external_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists conversations_updated_at on public.conversations;
create trigger conversations_updated_at
  before update on public.conversations
  for each row execute procedure public.set_updated_at();

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  direction text not null check (direction in ('in', 'out')),
  body text not null,
  author_name text,
  status text not null default 'stored' check (status in ('stored', 'sent', 'failed')),
  channel text,
  created_at timestamptz not null default now()
);

create table if not exists public.social_posts (
  id uuid primary key default gen_random_uuid(),
  body text not null,
  author_label text not null default 'Groupe Kalao',
  source text not null default 'internal' check (source in ('internal', 'facebook', 'instagram')),
  external_id text,
  created_at timestamptz not null default now()
);

alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.social_posts enable row level security;

do $$
declare
  tbl text;
begin
  foreach tbl in array array['conversations', 'messages', 'social_posts']
  loop
    execute format('drop policy if exists authenticated_all on public.%I', tbl);
    execute format(
      'create policy authenticated_all on public.%I for all to authenticated using (true) with check (true)',
      tbl
    );
  end loop;
end;
$$;

insert into public.contacts (first_name, last_name, email, phone, job_title, company_id)
select 'Awa', 'Nguema', 'awa.nguema@batir-ensemble.cm', '+237 6 99 10 20 30', 'Directrice travaux', c.id
from public.companies c
where c.name = 'Bâtir Ensemble SARL'
and not exists (
  select 1 from public.contacts x where x.email = 'awa.nguema@batir-ensemble.cm'
);

insert into public.conversations (channel, company_id, contact_id, title, last_preview)
select 'internal', c.id, ct.id, 'Bâtir Ensemble SARL', 'Plan chantier Bonabéri'
from public.companies c
join public.contacts ct on ct.company_id = c.id and ct.email = 'awa.nguema@batir-ensemble.cm'
where c.name = 'Bâtir Ensemble SARL'
and not exists (
  select 1 from public.conversations v
  where v.title = 'Bâtir Ensemble SARL' and v.channel = 'internal'
);

insert into public.conversations (channel, employee_id, title, last_preview)
select 'internal', e.id, e.full_name, 'Point équipe interne'
from public.employees e
where e.email = 'amadou.koffi@groupe-kalao.com'
and not exists (
  select 1 from public.conversations v
  where v.employee_id = e.id and v.channel = 'internal'
);

insert into public.conversations (channel, company_id, contact_id, title, last_preview)
select 'email', c.id, ct.id, 'Relance devis chantier', 'Stocké — envoi si Resend'
from public.companies c
join public.contacts ct on ct.company_id = c.id and ct.email = 'awa.nguema@batir-ensemble.cm'
where c.name = 'Bâtir Ensemble SARL'
and not exists (
  select 1 from public.conversations v
  where v.title = 'Relance devis chantier' and v.channel = 'email'
);

insert into public.messages (conversation_id, direction, body, author_name, status, channel)
select v.id, 'in',
  'Bonjour Kalao, pouvez-vous confirmer le planning du chantier Bonabéri ?',
  'Awa Nguema', 'stored', 'internal'
from public.conversations v
where v.title = 'Bâtir Ensemble SARL' and v.channel = 'internal'
and not exists (
  select 1 from public.messages m where m.conversation_id = v.id
);

insert into public.messages (conversation_id, direction, body, author_name, status, channel)
select v.id, 'out',
  'Oui, l''équipe est sur site cette semaine. Fil interne CRM, pas WhatsApp.',
  'Kalao', 'stored', 'internal'
from public.conversations v
where v.title = 'Bâtir Ensemble SARL' and v.channel = 'internal'
and (
  select count(*) from public.messages m where m.conversation_id = v.id
) < 2;

insert into public.messages (conversation_id, direction, body, author_name, status, channel)
select v.id, 'out',
  'Amadou, merci de pointer les heures chantier dans Timesheets.',
  'Kalao', 'stored', 'internal'
from public.conversations v
join public.employees e on e.id = v.employee_id
where e.email = 'amadou.koffi@groupe-kalao.com' and v.channel = 'internal'
and not exists (
  select 1 from public.messages m where m.conversation_id = v.id
);

insert into public.messages (conversation_id, direction, body, author_name, status, channel)
select v.id, 'out',
  'Bonjour, relance devis chantier Bonabéri. Message stocké dans le CRM ; envoi réel si Resend/SMTP est configuré.',
  'Kalao', 'stored', 'email'
from public.conversations v
where v.title = 'Relance devis chantier' and v.channel = 'email'
and not exists (
  select 1 from public.messages m where m.conversation_id = v.id
);

insert into public.social_posts (body, author_label, source)
select 'Chantier Bonabéri en cours — équipe Kalao sur site. Mur interne Groupe Kalao (Facebook / Instagram non branchés).',
  'Groupe Kalao', 'internal'
where not exists (
  select 1 from public.social_posts p where p.body like 'Chantier Bonabéri en cours%'
);
