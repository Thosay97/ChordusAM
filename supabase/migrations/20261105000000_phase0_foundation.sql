-- ChordusAM Phase 0: shared foundation for every module.
-- Users (profiles + roles), role helper functions, and the audit log.
-- Rollback: supabase/rollbacks/20261105000000_phase0_foundation.down.sql

-- ---------------------------------------------------------------------------
-- Roles
-- ---------------------------------------------------------------------------
create type public.app_role as enum ('employee', 'hr', 'admin', 'finance');

-- ---------------------------------------------------------------------------
-- Shared helpers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Profiles: one row per auth user. Role lives here, never in auth metadata,
-- because users can edit their own auth metadata.
-- ---------------------------------------------------------------------------
create table public.profiles (
  id                    uuid primary key references auth.users (id) on delete cascade,
  email                 text not null unique,
  full_name             text not null default '',
  role                  public.app_role not null default 'employee',
  -- PLAN.md section 2: producers, coordinators etc. may raise vendor payment requests.
  can_request_payments  boolean not null default false,
  active                boolean not null default true,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Role of the calling user, or null (signed out, no profile, or inactive).
-- security definer so policies on profiles can call it without recursing into RLS.
create or replace function public.current_app_role()
returns public.app_role
language sql
stable
security definer
set search_path = ''
as $$
  select p.role from public.profiles p where p.id = auth.uid() and p.active;
$$;

create or replace function public.has_role(variadic roles public.app_role[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(public.current_app_role() = any (roles), false);
$$;

-- New auth user -> employee profile. Role is NOT copied from signup metadata.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, coalesce(new.email, ''), coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Only Admins (or the service role / migrations, where auth.uid() is null) may change
-- role, active, can_request_payments or email. Everyone else may only change their name.
create or replace function public.guard_profile_privileged_columns()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null or public.has_role('admin') then
    return new;
  end if;
  if new.role is distinct from old.role
     or new.active is distinct from old.active
     or new.can_request_payments is distinct from old.can_request_payments
     or new.email is distinct from old.email
     or new.id is distinct from old.id then
    raise exception 'Only an Admin can change role, status, permissions or email'
      using errcode = '42501';
  end if;
  return new;
end;
$$;

create trigger profiles_guard_privileged
  before update on public.profiles
  for each row execute function public.guard_profile_privileged_columns();

alter table public.profiles enable row level security;

create policy profiles_select on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.has_role('admin', 'hr', 'finance'));

create policy profiles_update_self on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy profiles_update_admin on public.profiles
  for update to authenticated
  using (public.has_role('admin'))
  with check (public.has_role('admin'));

-- No insert or delete policies: profiles are created by the trigger above and
-- removed only by deleting the auth user (service role).

revoke all on public.profiles from anon;
grant select, update on public.profiles to authenticated;

-- ---------------------------------------------------------------------------
-- Audit log: append only. Shared by HR, Vendor Payments and Finance.
-- ---------------------------------------------------------------------------
create table public.audit_log (
  id         uuid primary key default gen_random_uuid(),
  -- No foreign key on purpose: the log must keep the actor even if the user is
  -- deleted later, and an "on delete set null" would be an update on an append-only table.
  actor_id   uuid,
  action     text not null,
  entity     text not null,
  entity_id  text,
  before     jsonb,
  after      jsonb,
  at         timestamptz not null default now()
);

create index audit_log_entity_idx on public.audit_log (entity, entity_id);
create index audit_log_at_idx on public.audit_log (at desc);
create index audit_log_actor_idx on public.audit_log (actor_id);

alter table public.audit_log enable row level security;

create policy audit_log_select_admin on public.audit_log
  for select to authenticated
  using (public.has_role('admin'));

-- No insert/update/delete policies: rows arrive only through the functions below.
revoke all on public.audit_log from anon, authenticated;
grant select on public.audit_log to authenticated;

-- Block edits and deletes for everyone, including the table owner.
create or replace function public.audit_log_immutable()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'audit_log is append only' using errcode = '42501';
end;
$$;

create trigger audit_log_no_update
  before update or delete on public.audit_log
  for each row execute function public.audit_log_immutable();

create trigger audit_log_no_truncate
  before truncate on public.audit_log
  for each statement execute function public.audit_log_immutable();

-- Explicit audit entry from the app (lib/audit.ts). The actor is always the caller.
create or replace function public.write_audit(
  p_action    text,
  p_entity    text,
  p_entity_id text default null,
  p_before    jsonb default null,
  p_after     jsonb default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Not signed in' using errcode = '42501';
  end if;
  insert into public.audit_log (actor_id, action, entity, entity_id, before, after)
  values (auth.uid(), p_action, p_entity, p_entity_id, p_before, p_after)
  returning id into v_id;
  return v_id;
end;
$$;

revoke all on function public.write_audit(text, text, text, jsonb, jsonb) from public, anon;
grant execute on function public.write_audit(text, text, text, jsonb, jsonb) to authenticated;

-- Generic row-change audit trigger. Attach to every sensitive table:
--   create trigger x_audit after insert or update or delete on public.x
--     for each row execute function public.audit_row_change();
create or replace function public.audit_row_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_before jsonb := case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) end;
  v_after  jsonb := case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) end;
begin
  if tg_op = 'UPDATE' and v_before is not distinct from v_after then
    return new;
  end if;
  insert into public.audit_log (actor_id, action, entity, entity_id, before, after)
  values (
    auth.uid(),
    lower(tg_op),
    tg_table_name,
    coalesce(v_after ->> 'id', v_before ->> 'id'),
    v_before,
    v_after
  );
  return coalesce(new, old);
end;
$$;

create trigger profiles_audit
  after insert or update or delete on public.profiles
  for each row execute function public.audit_row_change();

-- Helper functions are callable by signed-in users only.
revoke all on function public.current_app_role() from public, anon;
revoke all on function public.has_role(public.app_role[]) from public, anon;
grant execute on function public.current_app_role() to authenticated;
grant execute on function public.has_role(public.app_role[]) to authenticated;
