-- V39 : une facture ou un encaissement ne se supprime pas, quel que soit le rôle.
-- La RLS ne suffit pas : service_role la contourne. Le trigger, lui, s'exécute.
-- ENABLE ALWAYS : il part aussi quand session_replication_role = replica.

create or replace function public.forbid_finance_delete()
returns trigger
language plpgsql
as $$
begin
  raise exception 'suppression_interdite'
    using errcode = '42501',
          hint = 'Une facture ou un encaissement s''annule, il ne se supprime pas.';
end;
$$;

revoke all on function public.forbid_finance_delete() from public, anon;

drop trigger if exists invoices_forbid_delete on public.invoices;
create trigger invoices_forbid_delete
  before delete on public.invoices
  for each row execute function public.forbid_finance_delete();

drop trigger if exists payments_forbid_delete on public.payments;
create trigger payments_forbid_delete
  before delete on public.payments
  for each row execute function public.forbid_finance_delete();

alter table public.invoices enable always trigger invoices_forbid_delete;
alter table public.payments enable always trigger payments_forbid_delete;

revoke delete on table public.invoices from public, anon, authenticated, service_role;
revoke delete on table public.payments from public, anon, authenticated, service_role;

drop policy if exists invoices_delete on public.invoices;
drop policy if exists payments_delete on public.payments;
