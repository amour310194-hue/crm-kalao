-- Durcit la réinitialisation de mot de passe : tentatives, quota, lookup email sans listUsers.
-- DDL uniquement : aucune ligne métier n'est modifiée.

alter table public.password_resets
  add column if not exists attempts integer not null default 0;

create table if not exists public.rate_limits (
  key text primary key,
  count integer not null default 0,
  window_start timestamptz not null default now()
);

alter table public.rate_limits enable row level security;
revoke all on public.rate_limits from anon, authenticated, public;

create or replace function public.hit_rate_limit(
  p_key text,
  p_window_seconds integer,
  p_max integer
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  rec public.rate_limits%rowtype;
  allowed boolean;
begin
  if p_key is null or length(trim(p_key)) = 0 then
    return jsonb_build_object('ok', false, 'count', 0);
  end if;

  insert into public.rate_limits (key, count, window_start)
  values (p_key, 1, now())
  on conflict (key) do update
    set
      count = case
        when public.rate_limits.window_start < now() - make_interval(secs => p_window_seconds)
          then 1
        else public.rate_limits.count + 1
      end,
      window_start = case
        when public.rate_limits.window_start < now() - make_interval(secs => p_window_seconds)
          then now()
        else public.rate_limits.window_start
      end
  returning * into rec;

  allowed := rec.count <= p_max;
  return jsonb_build_object(
    'ok', allowed,
    'count', rec.count,
    'retry_after', greatest(
      0,
      p_window_seconds - floor(extract(epoch from (now() - rec.window_start)))
    )
  );
end;
$$;

revoke all on function public.hit_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.hit_rate_limit(text, integer, integer) to service_role;

-- Lookup ciblé : pas de listUsers(200). Service role only.
create or replace function public.lookup_auth_user_id(p_email text)
returns uuid
language sql
stable
security definer
set search_path = auth, public
as $$
  select u.id
  from auth.users u
  where lower(u.email) = lower(trim(p_email))
  limit 1;
$$;

revoke all on function public.lookup_auth_user_id(text) from public, anon, authenticated;
grant execute on function public.lookup_auth_user_id(text) to service_role;
