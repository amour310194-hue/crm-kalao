-- V31 : dépenses générales d'entreprise + entrée de stock automatique.

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in (
    'achat_stock', 'loyer', 'salaire_ponctuel', 'carburant',
    'fourniture', 'maintenance', 'autre'
  )),
  label text not null,
  amount numeric(12,2) not null default 0,
  spent_at date not null default current_date,
  method text not null default 'cash' check (method in ('cash', 'bank_transfer', 'mobile_money', 'card')),
  supplier text,
  catalog_item_id uuid references public.catalog_items(id) on delete set null,
  stock_location_id uuid references public.stock_locations(id) on delete set null,
  qty numeric(12,2),
  attachment_id uuid references public.attachments(id) on delete set null,
  notes text,
  created_by uuid references public.profiles(id) default auth.uid(),
  created_at timestamptz not null default now()
);

create index if not exists expenses_spent_at_idx on public.expenses (spent_at desc);
create index if not exists expenses_category_idx on public.expenses (category);

alter table public.expenses enable row level security;

revoke all on table public.expenses from anon, public;
grant select, insert, update, delete on table public.expenses to authenticated;

drop policy if exists expenses_select on public.expenses;
drop policy if exists expenses_insert on public.expenses;
drop policy if exists expenses_update on public.expenses;
drop policy if exists expenses_delete on public.expenses;

create policy expenses_select on public.expenses
  for select to authenticated
  using (public.is_staff());

create policy expenses_insert on public.expenses
  for insert to authenticated
  with check (public.is_staff());

create policy expenses_update on public.expenses
  for update to authenticated
  using (public.is_finance())
  with check (public.is_finance());

create policy expenses_delete on public.expenses
  for delete to authenticated
  using (public.is_finance());

create or replace function public.expense_stock_movement()
returns trigger
language plpgsql
as $$
begin
  if new.category = 'achat_stock' and new.catalog_item_id is not null and new.qty is not null and new.qty > 0 then
    insert into public.stock_movements (catalog_item_id, location_id, qty, reason)
    values (new.catalog_item_id, new.stock_location_id, new.qty, 'Achat — dépense ' || new.id);
  end if;
  return new;
end;
$$;

drop trigger if exists expenses_stock_movement on public.expenses;
create trigger expenses_stock_movement
  after insert on public.expenses
  for each row execute procedure public.expense_stock_movement();
