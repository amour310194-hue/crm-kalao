-- V46 : tunnel commercial, étapes par pôle, agent limité à ses dossiers.
-- Sauvegarde puis passage des dossiers visa encore en « develop » vers « constitution ».

alter table public.leads add column if not exists lost_reason text;
alter table public.leads add column if not exists destination_country text;
alter table public.leads add column if not exists budget numeric(12,2);
alter table public.leads add column if not exists score integer not null default 0;

do $$
declare r record;
begin
  for r in
    select conname from pg_constraint
    where conrelid = 'public.leads'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%converted%'
  loop
    execute format('alter table public.leads drop constraint %I', r.conname);
  end loop;
end $$;

alter table public.leads
  add constraint leads_status_check
  check (status in ('new', 'contacted', 'qualified', 'unqualified', 'converted', 'lost'));

alter table public.dossiers add column if not exists filed_at date;
alter table public.dossiers add column if not exists appointment_at date;
alter table public.dossiers add column if not exists decision_at date;
alter table public.dossiers add column if not exists travel_at date;
alter table public.dossiers add column if not exists passport_expires_at date;
alter table public.dossiers add column if not exists cancel_reason text;

create table if not exists public.project_stages (
  id uuid primary key default gen_random_uuid(),
  kind text not null,
  step_key text not null,
  label text not null,
  position integer not null,
  target_days integer,
  requires text,
  unique (kind, step_key)
);

insert into public.project_stages (kind, step_key, label, position, requires)
values
  ('visa', 'consult', 'Consultation et éligibilité', 1, null),
  ('visa', 'ouverture', 'Ouverture de dossier', 2, 'advance_paid'),
  ('visa', 'documents', 'Collecte des documents', 3, null),
  ('visa', 'constitution', 'Constitution du dossier', 4, null),
  ('visa', 'soumission', 'Dépôt de la demande', 5, 'checklist_complete'),
  ('visa', 'biometrie', 'Biométrie', 6, null),
  ('visa', 'traitement', 'Traitement', 7, null),
  ('visa', 'decision', 'Décision', 8, null),
  ('visa', 'retrait', 'Retrait du visa', 9, null),
  ('visa', 'done', 'Clôturé', 10, null),
  ('chantier', 'etude', 'Étude', 1, null),
  ('chantier', 'preparation', 'Préparation', 2, null),
  ('chantier', 'travaux', 'Travaux', 3, null),
  ('chantier', 'reception', 'Réception', 4, null),
  ('chantier', 'done', 'Clôturé', 5, null),
  ('plantation', 'preparation', 'Préparation', 1, null),
  ('plantation', 'plantation', 'Plantation', 2, null),
  ('plantation', 'entretien', 'Entretien', 3, null),
  ('plantation', 'recolte', 'Récolte', 4, null),
  ('plantation', 'done', 'Clôturé', 5, null),
  ('voyage', 'demande', 'Demande', 1, null),
  ('voyage', 'reservation', 'Réservation', 2, null),
  ('voyage', 'documents', 'Documents', 3, null),
  ('voyage', 'depart', 'Départ', 4, null),
  ('voyage', 'retour', 'Retour', 5, null),
  ('voyage', 'done', 'Clôturé', 6, null)
on conflict (kind, step_key) do nothing;

create table if not exists public.dossier_piece_templates (
  id uuid primary key default gen_random_uuid(),
  destination text not null,
  label text not null,
  position integer not null,
  unique (destination, label)
);

insert into public.dossier_piece_templates (destination, label, position)
values
  ('russie', 'Passeport', 1),
  ('russie', 'Photo', 2),
  ('russie', 'Formulaire', 3),
  ('canada', 'Passeport', 1),
  ('canada', 'Photo', 2),
  ('canada', 'Preuve de fonds', 3),
  ('allemagne', 'Passeport', 1),
  ('allemagne', 'Photo', 2),
  ('allemagne', 'Assurance', 3)
on conflict (destination, label) do nothing;

create table if not exists public._backup_20261009_dossier_status as
select id, title, status, now() as backed_up_at
from public.dossiers
where kind = 'visa' and status = 'develop';

do $$
declare n integer;
begin
  select count(*) into n from public._backup_20261009_dossier_status;
  if n <> 9 then
    raise exception 'attendu_9_dossiers_develop, trouve %', n;
  end if;
end $$;

update public.dossiers d
set status = 'constitution'
from public._backup_20261009_dossier_status b
where d.id = b.id
  and d.status = 'develop';

create or replace function public.agent_sees_dossier(p_dossier_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_staff()
    and (
      public.current_profile_role() is distinct from 'agent'
      or public.is_dossier_member(p_dossier_id)
    )
$$;

drop policy if exists dossiers_select on public.dossiers;
drop policy if exists dossiers_update on public.dossiers;
create policy dossiers_select on public.dossiers
  for select to authenticated
  using (public.agent_sees_dossier(id));
create policy dossiers_update on public.dossiers
  for update to authenticated
  using (public.agent_sees_dossier(id))
  with check (public.agent_sees_dossier(id));

drop policy if exists staff_select on public.dossier_checklist;
drop policy if exists staff_update on public.dossier_checklist;
create policy staff_select on public.dossier_checklist
  for select to authenticated
  using (public.agent_sees_dossier(dossier_id));
create policy staff_update on public.dossier_checklist
  for update to authenticated
  using (public.agent_sees_dossier(dossier_id))
  with check (public.agent_sees_dossier(dossier_id));

drop policy if exists staff_select on public.dossier_milestones;
drop policy if exists staff_update on public.dossier_milestones;
create policy staff_select on public.dossier_milestones
  for select to authenticated
  using (public.agent_sees_dossier(dossier_id));
create policy staff_update on public.dossier_milestones
  for update to authenticated
  using (public.agent_sees_dossier(dossier_id))
  with check (public.agent_sees_dossier(dossier_id));

drop policy if exists staff_select on public.attachments;
drop policy if exists staff_update on public.attachments;
create policy staff_select on public.attachments
  for select to authenticated
  using (
    public.is_staff()
    and (
      entity_type is distinct from 'dossier'
      or public.agent_sees_dossier(entity_id)
    )
  );
create policy staff_update on public.attachments
  for update to authenticated
  using (
    public.is_staff()
    and (
      entity_type is distinct from 'dossier'
      or public.agent_sees_dossier(entity_id)
    )
  )
  with check (
    public.is_staff()
    and (
      entity_type is distinct from 'dossier'
      or public.agent_sees_dossier(entity_id)
    )
  );

create table if not exists public.approval_requests (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  action text not null,
  requester uuid references public.profiles(id),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  comment text,
  decided_by uuid references public.profiles(id),
  decided_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.approval_requests enable row level security;
drop policy if exists approval_requests_select on public.approval_requests;
create policy approval_requests_select on public.approval_requests
  for select to authenticated
  using (public.is_staff());
grant select on public.approval_requests to authenticated;

create or replace function public.request_dossier_cancel(p_id uuid, p_reason text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare row_id uuid;
begin
  if not public.is_staff() then
    raise exception 'reserve_staff' using errcode = '42501';
  end if;
  if coalesce(trim(p_reason), '') = '' then
    raise exception 'motif_obligatoire';
  end if;
  if not public.agent_sees_dossier(p_id) then
    raise exception 'dossier_interdit' using errcode = '42501';
  end if;
  insert into public.approval_requests (entity_type, entity_id, action, requester, comment)
  values ('dossier', p_id, 'cancel', auth.uid(), trim(p_reason))
  returning id into row_id;
  return row_id;
end;
$$;

create or replace function public.decide_dossier_cancel(p_id uuid, p_approve boolean, p_note text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare req public.approval_requests%rowtype;
begin
  if not public.can_approve_finance() then
    raise exception 'validation_reservee' using errcode = '42501';
  end if;
  select * into req from public.approval_requests where id = p_id for update;
  if req.requester = auth.uid() then
    raise exception 'auteur_interdit' using errcode = '42501';
  end if;
  update public.approval_requests
  set status = case when p_approve then 'approved' else 'rejected' end,
      decided_by = auth.uid(),
      decided_at = now(),
      comment = coalesce(nullif(trim(p_note), ''), comment)
  where id = p_id and status = 'pending';
  if p_approve then
    update public.dossiers
    set status = 'cancelled', cancel_reason = req.comment
    where id = req.entity_id;
  end if;
end;
$$;

create table if not exists public.automation_rules (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  trigger_key text not null,
  conditions jsonb not null default '{}'::jsonb,
  actions jsonb not null default '[]'::jsonb,
  active boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.automation_runs (
  id uuid primary key default gen_random_uuid(),
  rule_id uuid not null references public.automation_rules(id) on delete cascade,
  subject_id uuid,
  status text not null check (status in ('simulation', 'done', 'error')),
  detail text,
  created_at timestamptz not null default now()
);

create unique index if not exists automation_runs_once
  on public.automation_runs (rule_id, subject_id, status)
  where subject_id is not null;

alter table public.automation_rules enable row level security;
alter table public.automation_runs enable row level security;
drop policy if exists automation_rules_select on public.automation_rules;
drop policy if exists automation_runs_select on public.automation_runs;
create policy automation_rules_select on public.automation_rules
  for select to authenticated using (public.is_staff());
create policy automation_runs_select on public.automation_runs
  for select to authenticated using (public.is_direction());
grant select on public.automation_rules to authenticated;
grant select on public.automation_runs to authenticated;

insert into public.automation_rules (name, trigger_key, actions)
select * from (values
  ('Nouveau prospect', 'lead.created', '[{"type":"assign"},{"type":"task","label":"Appeler sous 24 h"}]'::jsonb),
  ('Prospect sans activité', 'lead.idle_3d', '[{"type":"notify","role":"owner"}]'::jsonb),
  ('Devis sans réponse', 'quote.idle_5d', '[{"type":"task","label":"Relancer le devis"}]'::jsonb),
  ('Avance payée', 'invoice.advance_paid', '[{"type":"stage","key":"documents"}]'::jsonb),
  ('Passeport bientôt expiré', 'dossier.passport_6m', '[{"type":"notify","role":"owner"}]'::jsonb),
  ('Dossier immobile', 'dossier.idle_14d', '[{"type":"notify","role":"direction"}]'::jsonb)
) as seed(name, trigger_key, actions)
where not exists (select 1 from public.automation_rules r where r.name = seed.name);

create or replace function public.simulate_automations()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare n integer;
begin
  if not public.is_direction() then
    raise exception 'validation_reservee' using errcode = '42501';
  end if;
  insert into public.automation_runs (rule_id, status, detail)
  select id, 'simulation', 'Règle inactive : aucune action envoyée.'
  from public.automation_rules
  where active = false;
  get diagnostics n = row_count;
  return n;
end;
$$;

revoke all on function public.agent_sees_dossier(uuid) from public, anon;
revoke all on function public.request_dossier_cancel(uuid, text) from public, anon;
revoke all on function public.decide_dossier_cancel(uuid, boolean, text) from public, anon;
revoke all on function public.simulate_automations() from public, anon;
grant execute on function public.agent_sees_dossier(uuid) to authenticated;
grant execute on function public.request_dossier_cancel(uuid, text) to authenticated;
grant execute on function public.decide_dossier_cancel(uuid, boolean, text) to authenticated;
grant execute on function public.simulate_automations() to authenticated;

-- Rollback :
-- update public.dossiers d set status = b.status from public._backup_20261009_dossier_status b where d.id = b.id;
-- drop function if exists public.simulate_automations();
-- drop function if exists public.decide_dossier_cancel(uuid, boolean, text);
-- drop function if exists public.request_dossier_cancel(uuid, text);
-- drop function if exists public.agent_sees_dossier(uuid);
