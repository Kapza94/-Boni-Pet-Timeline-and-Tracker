-- F02: auth schema — households + users tables, RLS, on_auth_user_created.
--
-- Every authenticated user owns exactly one row in public.users. The
-- on_auth_user_created trigger fires on auth.users INSERT and (a)
-- creates a fresh `households` row for the user, (b) creates the
-- matching `public.users` row linked to it, with role='primary'.
-- Subsequent users joining the household come in via the F13 invite
-- flow which inserts directly into public.users with a non-primary
-- role.

create extension if not exists pgcrypto;

-- ---- enums ----
create type subscription_tier as enum ('free', 'weekly', 'monthly', 'yearly');
create type subscription_status as enum ('active', 'trialing', 'expired', 'canceled', 'stubbed');
create type user_role as enum ('primary', 'partner', 'housemate', 'walker', 'other');
create type auth_provider as enum ('apple', 'google', 'email');

-- ---- households ----
create table public.households (
  id uuid primary key default gen_random_uuid(),
  name text,
  subscription_tier subscription_tier not null default 'free',
  subscription_status subscription_status not null default 'active',
  subscription_renews_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.households enable row level security;

-- ---- users ----
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  household_id uuid not null references public.households(id) on delete cascade,
  name text,
  avatar_initials text,
  avatar_color text,
  role user_role not null default 'primary',
  email text,
  auth_provider auth_provider not null default 'email',
  auth_provider_id text,
  onboarded_at timestamptz,
  created_at timestamptz not null default now(),
  last_active_at timestamptz not null default now()
);

create index users_household_id_idx on public.users (household_id);

alter table public.users enable row level security;

-- ---- households policies (reference users; defined after users exists) ----
create policy "households visible to members"
  on public.households for select
  using (
    exists (
      select 1 from public.users u
      where u.household_id = households.id
        and u.id = auth.uid()
    )
  );

create policy "primary can update household"
  on public.households for update
  using (
    exists (
      select 1 from public.users u
      where u.household_id = households.id
        and u.id = auth.uid()
        and u.role = 'primary'
    )
  );

-- ---- users policies ----
create policy "user reads self"
  on public.users for select
  using (id = auth.uid());

create policy "user reads housemates"
  on public.users for select
  using (
    household_id = (
      select household_id from public.users where id = auth.uid()
    )
  );

create policy "user updates self"
  on public.users for update
  using (id = auth.uid());

-- ---- trigger: auth.users → households + public.users ----
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_household_id uuid;
  provider auth_provider;
  derived_name text;
  derived_initials text;
begin
  if (new.raw_app_meta_data ->> 'provider') = 'apple' then
    provider := 'apple';
  elsif (new.raw_app_meta_data ->> 'provider') = 'google' then
    provider := 'google';
  else
    provider := 'email';
  end if;

  derived_name := coalesce(
    new.raw_user_meta_data ->> 'name',
    split_part(new.email, '@', 1)
  );

  derived_initials := upper(substr(derived_name, 1, 1));

  insert into public.households (name)
  values (derived_name || ' household')
  returning id into new_household_id;

  insert into public.users (
    id, household_id, name, avatar_initials, role, email,
    auth_provider, auth_provider_id
  )
  values (
    new.id,
    new_household_id,
    derived_name,
    derived_initials,
    'primary',
    new.email,
    provider,
    new.raw_user_meta_data ->> 'sub'
  );

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_auth_user();
