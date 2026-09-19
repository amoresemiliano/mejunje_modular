/**
 * @mejunje/auth
 * Shared authentication client factories and authorization evaluation helpers.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { CustomerProfile, StaffProfile, UserRole } from '@mejunje/types';
import type { StaffVerificationResult } from '@mejunje/contracts';
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
