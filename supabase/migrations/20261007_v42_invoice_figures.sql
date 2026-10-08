-- V42 : statuts et soldes calculés. Une vue, lue par le tableau de bord et les exports.
-- security_invoker : la RLS des factures s'applique au lecteur.

create or replace view public.invoice_figures
with (security_invoker = true) as
select
  i.id,
  i.number,
  i.legacy_ref,
  i.company_id,
  i.contact_id,
  i.dossier_id,
  i.project,
  i.due_date,
  i.amount,
  i.paid_amount,
  greatest(0, coalesce(i.amount, 0) - coalesce(i.paid_amount, 0)) as remaining,
  i.status as stored_status,
  i.is_conditional,
  case
    when i.status = 'draft' then 'draft'
    when i.status = 'cancelled' then 'cancelled'
    when coalesce(i.is_conditional, false)
         and i.status not in ('draft', 'cancelled')
         and coalesce(i.paid_amount, 0) < coalesce(i.amount, 0) then 'conditional'
    when coalesce(i.paid_amount, 0) >= coalesce(i.amount, 0) and coalesce(i.amount, 0) > 0 then 'paid'
    when i.due_date < (timezone('Africa/Douala', now()))::date
         and coalesce(i.amount, 0) - coalesce(i.paid_amount, 0) > 0
         and i.status not in ('draft', 'cancelled') then 'overdue'
    when coalesce(i.paid_amount, 0) > 0 then 'partially_paid'
    else 'issued'
  end as computed_status,
  case
    when i.due_date < (timezone('Africa/Douala', now()))::date
         and coalesce(i.amount, 0) - coalesce(i.paid_amount, 0) > 0
         and i.status not in ('draft', 'cancelled')
         and not (
           coalesce(i.is_conditional, false)
           and coalesce(i.paid_amount, 0) < coalesce(i.amount, 0)
         )
      then ((timezone('Africa/Douala', now()))::date - i.due_date)
    else 0
  end as days_late
from public.invoices i;

grant select on public.invoice_figures to authenticated;

-- Rollback :
-- drop view if exists public.invoice_figures;
