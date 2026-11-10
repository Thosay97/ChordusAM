-- Reverts supabase/migrations/20261105000000_phase0_foundation.sql
-- WARNING: drops all profiles and the audit log. Take a backup first.

drop trigger if exists on_auth_user_created on auth.users;

drop table if exists public.audit_log;
drop table if exists public.profiles;

drop function if exists public.audit_row_change();
drop function if exists public.write_audit(text, text, text, jsonb, jsonb);
drop function if exists public.audit_log_immutable();
drop function if exists public.guard_profile_privileged_columns();
drop function if exists public.handle_new_user();
drop function if exists public.has_role(public.app_role[]);
drop function if exists public.current_app_role();
drop function if exists public.set_updated_at();

drop type if exists public.app_role;
