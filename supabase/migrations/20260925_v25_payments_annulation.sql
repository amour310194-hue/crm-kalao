-- V25 : un paiement ne se supprime plus. Annulation avec motif.
-- Aucune ligne de paiement n'est effacee.

alter table public.payments
  add column if not exists status text not null default 'valide';
alter table public.payments
  add column if not exists cancelled_at timestamptz;
alter table public.payments
  add column if not exists cancelled_by uuid;
alter table public.payments
  add column if not exists cancel_reason text;

update public.payments
set status = 'valide'
where status is null or status = '';

alter table public.payments drop constraint if exists payments_status_check;
alter table public.payments
  add constraint payments_status_check
  check (status in ('valide', 'annule'));

create or replace function public.refresh_invoice_paid()
returns trigger
language plpgsql
as $$
declare
  inv uuid;
  paid numeric;
  total numeric;
  current_status text;
begin
  inv := coalesce(new.invoice_id, old.invoice_id);
  select coalesce(sum(amount), 0) into paid
  from public.payments
  where invoice_id = inv
    and coalesce(status, 'valide') = 'valide';
  select amount, status into total, current_status
  from public.invoices
  where id = inv;
  if current_status = 'cancelled' then
    update public.invoices
    set paid_amount = paid, updated_at = now()
    where id = inv;
    return coalesce(new, old);
  end if;
  update public.invoices
  set paid_amount = paid,
      status = case
        when paid <= 0 then 'unpaid'
        when paid >= coalesce(total, 0) then 'paid'
        else 'partially_paid'
      end,
      updated_at = now()
  where id = inv;
  return coalesce(new, old);
end;
$$;
