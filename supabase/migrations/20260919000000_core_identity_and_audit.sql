-- =========================================================================
-- MEJUNJE MODULAR - MIGRATION 20260919000000
-- Core Identity, Authorization & Audit Foundation
-- Domain: CORE (Agent 00)
-- Description: Establishes customer/staff profile separation, RLS helper
--              functions, deny-by-default security policies, staff update guards,
--              and controlled RPC audit log write authority.
-- =========================================================================

-- Enable pgcrypto / uuid extensions
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- =========================================================================
-- 1. HELPER: Updated at timestamp trigger
-- =========================================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$;

-- =========================================================================
-- 2. TABLE: CUSTOMER PROFILES (customer_profiles)
-- Profile data for public ecommerce customers (Visitor -> Registered Customer).
-- Tied 1:1 to auth.users.
-- =========================================================================
create table if not exists public.customer_profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    email text not null,
    full_name text,
    phone text,
    document_id text,
    is_active boolean not null default true,
    metadata jsonb default '{}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

comment on table public.customer_profiles is 'Stores ecommerce customer authentication profiles linked to auth.users.';

create trigger trigger_customer_profiles_updated_at
    before update on public.customer_profiles
    for each row execute function public.set_updated_at();

-- =========================================================================
-- 3. TABLE: STAFF PROFILES (staff_profiles)
-- Internal MEJUNJE staff profiles and role assignments.
-- INVARIANT: CUSTOMER != STAFF. Existence of auth.users account does NOT
-- grant internal /lab access unless explicitly provisioned here.
-- =========================================================================
create table if not exists public.staff_profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    email text not null,
    full_name text,
    role text not null check (role in ('admin', 'manager', 'staff')),
    is_active boolean not null default true,
    permissions jsonb default '[]'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

comment on table public.staff_profiles is 'Stores internal staff accounts and authoritative role assignments.';

create trigger trigger_staff_profiles_updated_at
    before update on public.staff_profiles
    for each row execute function public.set_updated_at();

-- =========================================================================
-- 4. AUTHORIZATION FUNCTIONS (SECURITY DEFINER)
-- Authoritative server-side helper functions for RLS evaluation.
-- Hardened with fixed search_path = public and schema-qualified references.
-- =========================================================================

-- Check if current authenticated user is an active staff member
create or replace function public.is_staff()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
    select exists (
        select 1 from public.staff_profiles
        where id = auth.uid()
          and is_active = true
    );
$$;

-- Check if current authenticated user is an active admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
    select exists (
        select 1 from public.staff_profiles
        where id = auth.uid()
          and is_active = true
          and role = 'admin'
    );
$$;

-- Get the staff role of the current authenticated user
create or replace function public.get_staff_role()
returns text
language sql
security definer
stable
set search_path = public
as $$
    select role from public.staff_profiles
    where id = auth.uid()
      and is_active = true
    limit 1;
$$;

-- Restrict execution grants
revoke execute on function public.is_staff() from public;
grant execute on function public.is_staff() to authenticated, anon;

revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

revoke execute on function public.get_staff_role() from public;
grant execute on function public.get_staff_role() to authenticated;

-- =========================================================================
-- 5. STAFF PROFILE PRIVILEGE ESCALATION GUARD (TRIGGER)
-- Prevents non-admin staff from escalating own role, permissions, or is_active.
-- =========================================================================
create or replace function public.enforce_staff_profile_update_guard()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    -- Only administrators can modify authorization, security, or status fields
    if not public.is_admin() then
        if new.role is distinct from old.role then
            raise exception 'Unauthorized: Non-admin staff cannot modify their own role.';
        end if;
        if new.permissions is distinct from old.permissions then
            raise exception 'Unauthorized: Non-admin staff cannot modify their own permissions.';
        end if;
        if new.is_active is distinct from old.is_active then
            raise exception 'Unauthorized: Non-admin staff cannot modify their own active status.';
        end if;
        if new.id is distinct from old.id then
            raise exception 'Unauthorized: Staff ID cannot be mutated.';
        end if;
        if new.email is distinct from old.email then
            raise exception 'Unauthorized: Staff email cannot be mutated directly.';
        end if;
    end if;
    return new;
end;
$$;

create trigger trigger_staff_profiles_update_guard
    before update on public.staff_profiles
    for each row execute function public.enforce_staff_profile_update_guard();

-- =========================================================================
-- 6. TABLE: AUDIT LOGS (audit_logs)
-- Shared audit trail for security and sensitive business operations.
-- Direct client INSERT is REVOKED. Insertion is gated exclusively via RPC log_audit_event().
-- Strictly immutable (no update/delete policies).
-- =========================================================================
create table if not exists public.audit_logs (
    id uuid primary key default gen_random_uuid(),
    actor_id uuid references auth.users(id) on delete set null,
    actor_type text not null check (actor_type in ('visitor', 'customer', 'staff', 'system')),
    action text not null,
    entity_type text not null,
    entity_id text,
    metadata jsonb default '{}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

comment on table public.audit_logs is 'Immutable audit log recording security and sensitive operational actions.';

-- Indexes for audit query performance
create index if not exists idx_audit_logs_actor_id on public.audit_logs(actor_id);
create index if not exists idx_audit_logs_entity on public.audit_logs(entity_type, entity_id);
create index if not exists idx_audit_logs_created_at on public.audit_logs(created_at desc);

-- =========================================================================
-- 7. CONTROLLED AUDIT LOGGING FUNCTION (RPC)
-- Authoritative server-side entry point for writing audit entries.
-- Derives actor_id and actor_type directly from session; prevents client forgery.
-- =========================================================================
create or replace function public.log_audit_event(
    p_action text,
    p_entity_type text,
    p_entity_id text default null,
    p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
    v_uid uuid;
    v_is_staff boolean;
    v_actor_type text;
    v_audit_id uuid;
begin
    v_uid := auth.uid();
    
    if v_uid is null then
        raise exception 'Anonymous callers are not authorized to log audit events.';
    end if;

    select exists (
        select 1 from public.staff_profiles
        where id = v_uid and is_active = true
    ) into v_is_staff;
    
    if v_is_staff then
        v_actor_type := 'staff';
    else
        v_actor_type := 'customer';
    end if;
    
    if p_action is null or trim(p_action) = '' then
        raise exception 'Audit action cannot be empty.';
    end if;
    if p_entity_type is null or trim(p_entity_type) = '' then
        raise exception 'Audit entity_type cannot be empty.';
    end if;
    
    insert into public.audit_logs (
        actor_id,
        actor_type,
        action,
        entity_type,
        entity_id,
        metadata
    ) values (
        v_uid,
        v_actor_type,
        trim(p_action),
        trim(p_entity_type),
        p_entity_id,
        coalesce(p_metadata, '{}'::jsonb)
    ) returning id into v_audit_id;
    
    return v_audit_id;
end;
$$;

-- Restrict direct table write access from clients
revoke insert on public.audit_logs from public, authenticated, anon;
revoke execute on function public.log_audit_event from public, anon;
grant execute on function public.log_audit_event to authenticated;

-- =========================================================================
-- 8. ROW LEVEL SECURITY (RLS) - DENY BY DEFAULT
-- =========================================================================

alter table public.customer_profiles enable row level security;
alter table public.staff_profiles enable row level security;
alter table public.audit_logs enable row level security;

-- --- RLS: customer_profiles ---
create policy customer_profiles_select_policy on public.customer_profiles
    for select
    using (
        auth.uid() = id or public.is_staff()
    );

create policy customer_profiles_update_policy on public.customer_profiles
    for update
    using (
        auth.uid() = id or public.is_admin()
    )
    with check (
        auth.uid() = id or public.is_admin()
    );

create policy customer_profiles_insert_policy on public.customer_profiles
    for insert
    with check (
        auth.uid() = id or public.is_staff()
    );

create policy customer_profiles_delete_policy on public.customer_profiles
    for delete
    using (
        public.is_admin()
    );

-- --- RLS: staff_profiles ---
create policy staff_profiles_select_policy on public.staff_profiles
    for select
    using (
        public.is_staff()
    );

create policy staff_profiles_insert_policy on public.staff_profiles
    for insert
    with check (
        public.is_admin()
    );

create policy staff_profiles_update_policy on public.staff_profiles
    for update
    using (
        public.is_admin() or (public.is_staff() and auth.uid() = id)
    )
    with check (
        public.is_admin() or (public.is_staff() and auth.uid() = id)
    );

create policy staff_profiles_delete_policy on public.staff_profiles
    for delete
    using (
        public.is_admin()
    );

-- --- RLS: audit_logs ---
-- 1. Read access restricted to Admins and Managers
create policy audit_logs_select_policy on public.audit_logs
    for select
    using (
        public.is_admin() or (public.is_staff() and public.get_staff_role() = 'manager')
    );

-- Notice: Direct client INSERT policy REMOVED.
-- Clients must invoke the controlled RPC public.log_audit_event().
-- Strict Immutability: NO UPDATE or DELETE policies on audit_logs.
