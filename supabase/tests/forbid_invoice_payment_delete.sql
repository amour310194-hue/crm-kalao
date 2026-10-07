-- À lancer sur une base où la migration v39 est appliquée.
-- Chaque DELETE doit échouer avec suppression_interdite, puis la transaction est annulée.

begin;

do $$
declare
  inv uuid;
  pay uuid;
begin
  insert into public.invoices (number, amount, paid_amount, status)
  values ('TEST-FORBID-DELETE', 1, 0, 'unpaid')
  returning id into inv;

  begin
    delete from public.invoices where id = inv;
    raise exception 'le DELETE facture aurait dû échouer';
  exception
    when insufficient_privilege then
      if sqlerrm not like '%suppression_interdite%' then
        raise;
      end if;
  end;

  insert into public.payments (invoice_id, amount, method)
  values (inv, 1, 'cash')
  returning id into pay;

  begin
    delete from public.payments where id = pay;
    raise exception 'le DELETE paiement aurait dû échouer';
  exception
    when insufficient_privilege then
      if sqlerrm not like '%suppression_interdite%' then
        raise;
      end if;
  end;
end;
$$;

rollback;
