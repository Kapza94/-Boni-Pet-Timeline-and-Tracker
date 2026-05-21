-- F02: auth schema tests
-- Run via: npx supabase test db --local
--
-- Verifies the households + users tables, RLS posture, and the
-- on_auth_user_created trigger that auto-creates the household + user
-- rows whenever Supabase Auth inserts into auth.users.

begin;

select plan(14);

-- ---- households table ----
select has_table('public', 'households', 'households table exists');
select has_column('public', 'households', 'id', 'households.id exists');
select has_column('public', 'households', 'subscription_tier', 'households.subscription_tier exists');
select has_column('public', 'households', 'subscription_status', 'households.subscription_status exists');
select col_default_is(
  'public', 'households', 'subscription_tier', 'free'::text,
  'households.subscription_tier defaults to free'
);

-- ---- users table ----
select has_table('public', 'users', 'users table exists');
select has_column('public', 'users', 'id', 'users.id exists');
select has_column('public', 'users', 'household_id', 'users.household_id exists');
select has_column('public', 'users', 'auth_provider', 'users.auth_provider exists');
select has_column('public', 'users', 'role', 'users.role exists');

-- ---- RLS posture ----
select is(
  (
    select c.relrowsecurity
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relname = 'households'
  ),
  true,
  'households has RLS enabled'
);
select is(
  (
    select c.relrowsecurity
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relname = 'users'
  ),
  true,
  'users has RLS enabled'
);

-- ---- on_auth_user_created trigger creates household + user atomically ----
do $$
declare
  fake_uid uuid := gen_random_uuid();
begin
  insert into auth.users (id, email, raw_user_meta_data, created_at, updated_at)
  values (
    fake_uid,
    'tdd-' || fake_uid::text || '@example.com',
    jsonb_build_object('name', 'Tdd User'),
    now(),
    now()
  );
end $$;

select isnt_empty(
  $$select 1 from public.users where email like 'tdd-%@example.com' limit 1$$,
  'inserting into auth.users creates a public.users row'
);

select isnt_empty(
  $$
  select 1
  from public.households h
  join public.users u on u.household_id = h.id
  where u.email like 'tdd-%@example.com'
  limit 1
  $$,
  'inserting into auth.users creates a household linked to the new user'
);

select * from finish();
rollback;
