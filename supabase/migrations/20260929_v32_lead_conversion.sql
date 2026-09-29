-- V32 : un lead ne devient client que s'il a souscrit un service (deal gagné).

alter table public.contacts add column if not exists status text not null default 'client';
alter table public.contacts drop constraint if exists contacts_status_check;
alter table public.contacts add constraint contacts_status_check check (status in ('prospect', 'client'));

create or replace function public.enforce_lead_conversion()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  has_service boolean;
begin
  if new.status = 'converted' and coalesce(old.status, '') <> 'converted' then
    select exists (
      select 1
      from public.deals d
      join public.deal_lines dl on dl.deal_id = d.id
      where d.lead_id = new.id
        and d.stage = 'won'
        and dl.kind = 'service'
    ) into has_service;

    if not has_service then
      raise exception 'Conversion refusee : aucun service souscrit (deal gagne avec une ligne de service requis).';
    end if;

    if new.contact_id is not null then
      update public.contacts set status = 'client' where id = new.contact_id;
    end if;
  end if;
  return new;
end;
$$;

revoke all on function public.enforce_lead_conversion() from public, anon;
grant execute on function public.enforce_lead_conversion() to authenticated;

drop trigger if exists leads_enforce_conversion on public.leads;
create trigger leads_enforce_conversion
  before update on public.leads
  for each row execute procedure public.enforce_lead_conversion();

alter table public.capture_forms drop constraint if exists capture_forms_created_by_fkey;
alter table public.capture_forms
  add constraint capture_forms_created_by_fkey
  foreign key (created_by) references public.profiles(id) on delete set null;

alter table public.expenses drop constraint if exists expenses_created_by_fkey;
alter table public.expenses
  add constraint expenses_created_by_fkey
  foreign key (created_by) references public.profiles(id) on delete set null;
