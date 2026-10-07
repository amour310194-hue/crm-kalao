-- V43 : journal de caisse, clôture du jour et du mois.
-- finance_period_closed, défini vide en v41, devient effectif ici.

create table if not exists public.cash_day_closes (
  id uuid primary key default gen_random_uuid(),
  closed_on date not null unique,
  counted_amount numeric(14,2) not null,
  book_amount numeric(14,2) not null,
  variance numeric(14,2) not null,
  requested_by uuid not null,
  validated_by uuid,
  status text not null default 'pending' check (status in ('pending', 'validated', 'rejected')),
  created_at timestamptz not null default now()
);

create table if not exists public.cash_month_closes (
  id uuid primary key default gen_random_uuid(),
  month_key text not null unique,
  requested_by uuid not null,
  validated_by uuid,
  status text not null default 'pending' check (status in ('pending', 'validated', 'rejected')),
  created_at timestamptz not null default now()
);

alter table public.cash_day_closes enable row level security;
alter table public.cash_month_closes enable row level security;

drop policy if exists cash_day_closes_select on public.cash_day_closes;
create policy cash_day_closes_select on public.cash_day_closes
  for select to authenticated using (public.is_finance());
drop policy if exists cash_month_closes_select on public.cash_month_closes;
create policy cash_month_closes_select on public.cash_month_closes
  for select to authenticated using (public.is_finance());

do $$
declare r record;
begin
  for r in
    select rel.relname as table_name, con.conname
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_namespace nsp on nsp.oid = rel.relnamespace
    where nsp.nspname = 'public'
      and rel.relname in ('cash_operations', 'expenses')
      and con.contype = 'c'
      and pg_get_constraintdef(con.oid) ilike '%method%'
  loop
    execute format('alter table public.%I drop constraint %I', r.table_name, r.conname);
  end loop;
end $$;

alter table public.cash_operations
  add constraint cash_operations_method_check
  check (method in ('cash', 'bank_transfer', 'mobile_money', 'card', 'mtn_momo', 'orange_money', 'cheque'));

alter table public.expenses
  add constraint expenses_method_check
  check (method in ('cash', 'bank_transfer', 'mobile_money', 'card', 'mtn_momo', 'orange_money', 'cheque'));

create or replace function public.finance_period_closed(p_day date)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    exists (
      select 1 from public.cash_month_closes m
      where m.status = 'validated'
        and m.month_key = to_char(p_day, 'YYYY-MM')
    )
    or exists (
      select 1 from public.cash_day_closes d
      where d.status = 'validated'
        and d.closed_on = p_day
    )
$$;

create or replace function public.cash_movement_guard()
returns trigger
language plpgsql
as $$
declare
  day date;
begin
  if tg_table_name = 'expenses' then
    day := case when tg_op = 'DELETE' then old.spent_at else new.spent_at end;
  else
    day := case when tg_op = 'DELETE' then old.occurred_at else new.occurred_at end;
  end if;
  if public.finance_period_closed(day) then
    raise exception 'mois_cloture' using errcode = '42501';
  end if;
  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

drop trigger if exists cash_operations_period_trg on public.cash_operations;
create trigger cash_operations_period_trg
  before insert or update or delete on public.cash_operations
  for each row execute function public.cash_movement_guard();

drop trigger if exists expenses_period_trg on public.expenses;
create trigger expenses_period_trg
  before insert or update or delete on public.expenses
  for each row execute function public.cash_movement_guard();

create or replace view public.cash_journal
with (security_invoker = true) as
select
  id,
  source,
  occurred_on,
  label,
  delta,
  bucket,
  sum(delta) over (
    partition by bucket
    order by occurred_on, source, id
    rows between unbounded preceding and current row
  ) as balance
from (
  select
    p.id,
    'encaissement'::text as source,
    p.paid_at as occurred_on,
    coalesce(i.number, 'Facture') as label,
    p.amount as delta,
    case
      when p.method = 'cash' then 'especes'
      when p.method in ('mtn_momo', 'mobile_money', 'mobile') then 'mtn'
      when p.method = 'orange_money' then 'orange'
      else 'banque'
    end as bucket
  from public.payments p
  left join public.invoices i on i.id = p.invoice_id
  where coalesce(p.status, 'valide') = 'valide'
  union all
  select
    e.id,
    'depense',
    e.spent_at,
    e.label,
    -e.amount,
    case
      when e.method = 'cash' then 'especes'
      when e.method in ('mtn_momo', 'mobile_money') then 'mtn'
      when e.method = 'orange_money' then 'orange'
      else 'banque'
    end
  from public.expenses e
  union all
  select
    c.id,
    'operation',
    c.occurred_at,
    c.label,
    case when c.direction = 'sortie' then -c.amount else c.amount end,
    case
      when c.method = 'cash' then 'especes'
      when c.method in ('mtn_momo', 'mobile_money') then 'mtn'
      when c.method = 'orange_money' then 'orange'
      else 'banque'
    end
  from public.cash_operations c
) movements;

grant select on public.cash_journal to authenticated;

create or replace function public.cash_book_balance(p_day date)
returns numeric
language sql
stable
security definer
set search_path = public
as $$
  select
    coalesce((
      select sum(p.amount) from public.payments p
      where p.method = 'cash' and coalesce(p.status, 'valide') = 'valide' and p.paid_at <= p_day
    ), 0)
    - coalesce((
      select sum(e.amount) from public.expenses e
      where e.method = 'cash' and e.spent_at <= p_day
    ), 0)
    + coalesce((
      select sum(case when c.direction = 'sortie' then -c.amount else c.amount end)
      from public.cash_operations c
      where c.method = 'cash' and c.occurred_at <= p_day
    ), 0)
$$;

create or replace function public.request_day_close(p_day date, p_counted numeric)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  book numeric;
  row_id uuid;
begin
  if not public.is_finance() then
    raise exception 'reserve_finance' using errcode = '42501';
  end if;
  book := public.cash_book_balance(p_day);
  insert into public.cash_day_closes (closed_on, counted_amount, book_amount, variance, requested_by)
  values (p_day, p_counted, book, p_counted - book, auth.uid())
  on conflict (closed_on) do update
    set counted_amount = excluded.counted_amount,
        book_amount = excluded.book_amount,
        variance = excluded.variance,
        requested_by = excluded.requested_by,
        status = 'pending',
        validated_by = null
  where public.cash_day_closes.status is distinct from 'validated'
  returning id into row_id;
  if row_id is null then
    raise exception 'jour_deja_cloture' using errcode = '42501';
  end if;
  return row_id;
end;
$$;

create or replace function public.validate_day_close(p_id uuid, p_approve boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  row public.cash_day_closes%rowtype;
begin
  if not public.can_approve_finance() then
    raise exception 'validation_reservee' using errcode = '42501';
  end if;
  select * into row from public.cash_day_closes where id = p_id for update;
  if row.requested_by = auth.uid() then
    raise exception 'auteur_interdit' using errcode = '42501';
  end if;
  update public.cash_day_closes
  set status = case when p_approve then 'validated' else 'rejected' end,
      validated_by = auth.uid()
  where id = p_id
    and status = 'pending';
end;
$$;

create or replace function public.request_month_close(p_month text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  row_id uuid;
begin
  if not public.is_finance() then
    raise exception 'reserve_finance' using errcode = '42501';
  end if;
  if p_month !~ '^\d{4}-\d{2}$' then
    raise exception 'mois_invalide';
  end if;
  insert into public.cash_month_closes (month_key, requested_by)
  values (p_month, auth.uid())
  on conflict (month_key) do update
    set requested_by = excluded.requested_by,
        status = 'pending',
        validated_by = null
  where public.cash_month_closes.status is distinct from 'validated'
  returning id into row_id;
  if row_id is null then
    raise exception 'mois_deja_cloture' using errcode = '42501';
  end if;
  return row_id;
end;
$$;

create or replace function public.validate_month_close(p_id uuid, p_approve boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  row public.cash_month_closes%rowtype;
begin
  if not public.can_approve_finance() then
    raise exception 'validation_reservee' using errcode = '42501';
  end if;
  select * into row from public.cash_month_closes where id = p_id for update;
  if row.requested_by = auth.uid() then
    raise exception 'auteur_interdit' using errcode = '42501';
  end if;
  update public.cash_month_closes
  set status = case when p_approve then 'validated' else 'rejected' end,
      validated_by = auth.uid()
  where id = p_id
    and status = 'pending';
end;
$$;

revoke all on function public.request_day_close(date, numeric) from public, anon;
revoke all on function public.validate_day_close(uuid, boolean) from public, anon;
revoke all on function public.request_month_close(text) from public, anon;
revoke all on function public.validate_month_close(uuid, boolean) from public, anon;
revoke all on function public.cash_book_balance(date) from public, anon;
grant execute on function public.request_day_close(date, numeric) to authenticated;
grant execute on function public.validate_day_close(uuid, boolean) to authenticated;
grant execute on function public.request_month_close(text) to authenticated;
grant execute on function public.validate_month_close(uuid, boolean) to authenticated;
grant execute on function public.cash_book_balance(date) to authenticated;

-- Rollback :
-- drop view if exists public.cash_journal;
-- drop function if exists public.validate_month_close(uuid, boolean);
-- drop function if exists public.request_month_close(text);
-- drop function if exists public.validate_day_close(uuid, boolean);
-- drop function if exists public.request_day_close(date, numeric);
-- drop table if exists public.cash_day_closes;
-- drop table if exists public.cash_month_closes;
-- create or replace function public.finance_period_closed(p_day date) returns boolean language sql stable as $$ select false $$;
