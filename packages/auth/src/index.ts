/**
 * @mejunje/auth
 * Shared authentication client factories and authorization evaluation helpers.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { CustomerProfile, StaffProfile, UserRole, ActorType } from '@mejunje/types';
import type { StaffVerificationResult, AuditEventPayload } from '@mejunje/contracts';
import { getSupabaseEnv } from '@mejunje/config';

/**
 * Creates a browser-safe Supabase client using public anon key.
 * Never passes service-role keys to browser context.
 */
export function createBrowserSupabaseClient(
  customUrl?: string,
  customAnonKey?: string
): SupabaseClient {
  const env = getSupabaseEnv();
  const url = customUrl || env.supabaseUrl || 'https://placeholder.supabase.co';
  const anonKey = customAnonKey || env.supabaseAnonKey || 'placeholder-anon-key';

  return createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

/**
 * Checks whether a given staff profile grants valid, active internal staff access.
 */
export function hasStaffAccess(profile: StaffProfile | null | undefined): boolean {
  if (!profile) return false;
  if (!profile.is_active) return false;
  const validRoles: UserRole[] = ['admin', 'manager', 'staff'];
  return validRoles.includes(profile.role);
}

/**
 * Checks whether a given staff profile grants administrator access.
 */
export function hasAdminAccess(profile: StaffProfile | null | undefined): boolean {
  if (!profile) return false;
  if (!profile.is_active) return false;
  return profile.role === 'admin';
}

/**
 * Evaluates whether an actor has permission to access a specific customer's private profile.
 * Security invariant: Customer A cannot access Customer B's profile; Staff with active status can access for support.
 */
export function evaluateCustomerAccess(
  authenticatedUserId: string | null | undefined,
  targetCustomerId: string,
  staffProfile?: StaffProfile | null
): { allowed: boolean; reason: string } {
  if (!authenticatedUserId) {
    return { allowed: false, reason: 'Unauthenticated actor cannot access customer profile.' };
  }

  // Active staff can view customer profile
  if (hasStaffAccess(staffProfile)) {
    return { allowed: true, reason: 'Permitted via active staff authorization.' };
  }

  // Customer can only view their own profile
  if (authenticatedUserId === targetCustomerId) {
    return { allowed: true, reason: 'Permitted for profile owner.' };
  }

  return { allowed: false, reason: 'Denied: Actor is neither the profile owner nor authorized staff.' };
}

/**
 * Evaluates whether an actor has permission to access /lab internal ERP resources.
 * Security invariant: Only authenticated active staff can access /lab. Anonymous and Customers fail closed.
 */
export function evaluateLabAccess(
  authenticatedUserId: string | null | undefined,
  staffProfile: StaffProfile | null | undefined
): { allowed: boolean; reason: string } {
  if (!authenticatedUserId) {
    return { allowed: false, reason: 'Denied: Anonymous visitors cannot access /lab.' };
  }

  if (!staffProfile || !staffProfile.is_active) {
    return { allowed: false, reason: 'Denied: User does not possess an active staff profile.' };
  }

  if (hasStaffAccess(staffProfile)) {
    return { allowed: true, reason: 'Permitted for active staff member.' };
  }

  return { allowed: false, reason: 'Denied: Unrecognized role fails closed.' };
}

/**
 * Evaluates self-profile mutation requests on staff_profiles.
 * Security Invariant: Non-admin staff can NEVER mutate role, permissions, or is_active.
 */
export function evaluateStaffProfileUpdate(
  updatingStaff: StaffProfile,
  fieldChanges: Partial<StaffProfile>
): { allowed: boolean; reason: string } {
  const isCallerAdmin = hasAdminAccess(updatingStaff);

  if (isCallerAdmin) {
    return { allowed: true, reason: 'Admin possesses full authorization to update staff fields.' };
  }

  // Protected security fields
  const protectedFields: (keyof StaffProfile)[] = ['role', 'permissions', 'is_active', 'id', 'email'];
  for (const field of protectedFields) {
    if (field in fieldChanges && fieldChanges[field] !== undefined) {
      return {
        allowed: false,
        reason: `Denied: Non-admin staff cannot modify protected security field '${String(field)}'.`,
      };
    }
  }

  return { allowed: true, reason: 'Permitted for benign staff self-profile update (e.g. full_name).' };
}

/**
 * Evaluates audit log write authority.
 * Invariant: Direct client table INSERTs are DENIED. Writes must pass through controlled RPC log_audit_event().
 */
export function evaluateAuditWriteAuthority(
  isDirectClientInsert: boolean,
  isViaControlledRpc: boolean,
  payload: AuditEventPayload,
  isAuthenticated: boolean = true
): { allowed: boolean; effectiveActorType: ActorType; reason: string } {
  if (!isAuthenticated) {
    return {
      allowed: false,
      effectiveActorType: payload.actorType,
      reason: 'Denied: Anonymous actors cannot execute audit ingestion.',
    };
  }

  if (isDirectClientInsert) {
    return {
      allowed: false,
      effectiveActorType: payload.actorType,
      reason: 'Denied: Direct arbitrary client INSERT to public.audit_logs is revoked.',
    };
  }

  if (!isViaControlledRpc) {
    return {
      allowed: false,
      effectiveActorType: payload.actorType,
      reason: 'Denied: Unrecognized write mechanism.',
    };
  }

  if (!payload.action || payload.action.trim() === '') {
    return {
      allowed: false,
      effectiveActorType: payload.actorType,
      reason: 'Denied: Audit action cannot be empty.',
    };
  }

  if (!payload.entityType || payload.entityType.trim() === '') {
    return {
      allowed: false,
      effectiveActorType: payload.actorType,
      reason: 'Denied: Audit entity_type cannot be empty.',
    };
  }

  return {
    allowed: true,
    effectiveActorType: payload.actorType,
    reason: 'Accepted: Authorized via controlled RPC with server-derived actor identity.',
  };
}

/**
 * Authoritatively resolves actor_type for audit event logging.
 * Prevents client-side forgery of staff or system credentials.
 */
export function resolveAuthoritativeActorType(
  authUserId: string | null | undefined,
  claimedActorType: ActorType,
  isStaff: boolean
): { effectiveActorType: ActorType; wasOverridden: boolean } {
  if (!authUserId) {
    const isAnonymousValid = claimedActorType === 'visitor' || claimedActorType === 'system';
    return {
      effectiveActorType: isAnonymousValid ? claimedActorType : 'visitor',
      wasOverridden: !isAnonymousValid,
    };
  }

  if (isStaff) {
    return {
      effectiveActorType: 'staff',
      wasOverridden: claimedActorType !== 'staff',
    };
  }

  // Authenticated customer cannot claim staff or system
  const effectiveActorType: ActorType = 'customer';
  return {
    effectiveActorType,
    wasOverridden: claimedActorType !== 'customer',
  };
}

/**
 * Verifies staff profile status and returns a structured contract result.
 */
export function verifyStaffStatus(
  profile: StaffProfile | null | undefined
): StaffVerificationResult {
  if (!profile || !profile.is_active) {
    return {
      isStaff: false,
      role: null,
      isActive: false,
      staffProfile: null,
    };
  }

  return {
    isStaff: hasStaffAccess(profile),
    role: profile.role,
    isActive: profile.is_active,
    staffProfile: profile,
  };
}
