-- V36 : opérations de caisse (recettes, dépôts, retraits) + correction stock si une dépense change.

create table if not exists public.cash_operations (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('recette', 'depot', 'retrait', 'operation')),
  direction text not null default 'entree' check (direction in ('entree', 'sortie')),
  label text not null,
  amount numeric(12,2) not null check (amount > 0),
  occurred_at date not null default current_date,
  method text not null default 'cash' check (method in ('cash', 'bank_transfer', 'mobile_money', 'card')),
  counterparty text,
  notes text,
  created_by uuid references public.profiles(id) default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cash_operations_occurred_at_idx on public.cash_operations (occurred_at desc);

drop trigger if exists cash_operations_set_updated_at on public.cash_operations;
create trigger cash_operations_set_updated_at
  before update on public.cash_operations
  for each row execute procedure public.set_updated_at();

alter table public.cash_operations enable row level security;

revoke all on table public.cash_operations from anon, public;
grant select, insert, update, delete on table public.cash_operations to authenticated;

drop policy if exists cash_operations_select on public.cash_operations;
drop policy if exists cash_operations_insert on public.cash_operations;
drop policy if exists cash_operations_update on public.cash_operations;
drop policy if exists cash_operations_delete on public.cash_operations;

create policy cash_operations_select on public.cash_operations
  for select to authenticated
  using (public.is_staff());

create policy cash_operations_insert on public.cash_operations
  for insert to authenticated
  with check (public.is_finance());

create policy cash_operations_update on public.cash_operations
  for update to authenticated
  using (public.is_finance())
  with check (public.is_finance());

create policy cash_operations_delete on public.cash_operations
  for delete to authenticated
  using (public.is_finance());

drop policy if exists expenses_insert on public.expenses;
create policy expenses_insert on public.expenses
  for insert to authenticated
  with check (public.is_finance());

-- Mouvements de stock : correction réservée à la finance.
drop policy if exists staff_insert on public.stock_movements;
drop policy if exists finance_insert_stock_movements on public.stock_movements;
create policy finance_insert_stock_movements on public.stock_movements
  for insert to authenticated
  with check (public.is_finance());

drop policy if exists staff_update on public.stock_movements;
drop policy if exists finance_update_stock_movements on public.stock_movements;
create policy finance_update_stock_movements on public.stock_movements
  for update to authenticated
  using (public.is_finance())
  with check (public.is_finance());

create or replace function public.expense_sync_stock()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'DELETE' then
    if old.category = 'achat_stock' and old.catalog_item_id is not null and coalesce(old.qty, 0) > 0 then
      insert into public.stock_movements (catalog_item_id, location_id, qty, reason)
      values (
        old.catalog_item_id,
        old.stock_location_id,
        -old.qty,
        'Annulation dépense ' || old.id
      );
    end if;
    return old;
  end if;

  if tg_op = 'UPDATE' then
    if old.category = 'achat_stock' and old.catalog_item_id is not null and coalesce(old.qty, 0) > 0 then
      insert into public.stock_movements (catalog_item_id, location_id, qty, reason)
      values (
        old.catalog_item_id,
        old.stock_location_id,
        -old.qty,
        'Correction dépense ' || old.id
      );
    end if;
  end if;

  if new.category = 'achat_stock' and new.catalog_item_id is not null and coalesce(new.qty, 0) > 0 then
    insert into public.stock_movements (catalog_item_id, location_id, qty, reason)
    values (
      new.catalog_item_id,
      new.stock_location_id,
      new.qty,
      case when tg_op = 'INSERT' then 'Achat — dépense ' else 'Correction dépense ' end || new.id
    );
  end if;

  return new;
end;
$$;

drop trigger if exists expenses_stock_movement on public.expenses;
create trigger expenses_stock_movement
  after insert or update or delete on public.expenses
  for each row execute procedure public.expense_sync_stock();
