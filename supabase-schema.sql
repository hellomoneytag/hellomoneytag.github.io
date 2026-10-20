-- MoneyTag: minimal secure Supabase schema for authentication + profiles.
-- Run this in Supabase SQL Editor. Review before running against existing data.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  public_id text not null unique,
  role text not null check (role in ('f','b')),
  full_name text not null default '',
  phone text,
  company text,
  bio text,
  location text,
  title text,
  rate numeric(12,2),
  language text,
  skills text,
  nid_status text not null default 'not_submitted' check (nid_status in ('not_submitted','pending','verified','rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
revoke all on public.profiles from anon;
grant select, insert, update on public.profiles to authenticated;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select to authenticated using (auth.uid() = id);
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check (auth.uid() = id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create or replace function public.handle_new_moneytag_user()
returns trigger language plpgsql security definer set search_path = '' as $$
declare r text;
begin
  r := case when new.raw_user_meta_data ->> 'role' = 'b' then 'b' else 'f' end;
  insert into public.profiles (id, public_id, role, full_name, phone, company)
  values (
    new.id,
    (case when r = 'b' then 'B-' else 'F-' end) || upper(substr(replace(new.id::text, '-', ''), 1, 8)),
    r,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'phone', ''),
    nullif(new.raw_user_meta_data ->> 'company', '')
  ) on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_moneytag on auth.users;
create trigger on_auth_user_created_moneytag after insert on auth.users
for each row execute procedure public.handle_new_moneytag_user();

create or replace function public.set_moneytag_profile_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end;
$$;
drop trigger if exists profiles_updated_at_moneytag on public.profiles;
create trigger profiles_updated_at_moneytag before update on public.profiles
for each row execute procedure public.set_moneytag_profile_updated_at();

-- Important: this schema does NOT implement job posting, escrow, wallets, payment verification,
-- SMS provider setup, NID verification, or private document storage. Do not treat client-side
-- localStorage balances as real money. Keep those features disabled until a trusted backend exists.
