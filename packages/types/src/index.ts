/**
 * @mejunje/types
 * Core shared identity, authorization, and audit type definitions.
 */

export type UserRole = 'admin' | 'manager' | 'staff';

export interface BaseProfile {
  id: string; // references auth.users.id
  email: string;
  full_name?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomerProfile extends BaseProfile {
  phone?: string | null;
  document_id?: string | null;
  is_active: boolean;
  metadata?: Record<string, unknown>;
}

export interface StaffProfile extends BaseProfile {
  role: UserRole;
  is_active: boolean;
  permissions?: string[];
}

export type ActorType = 'visitor' | 'customer' | 'staff' | 'system';

export interface AuditLogEntry {
  id: string;
  actor_id?: string | null;
  actor_type: ActorType;
  action: string;
  entity_type: string;
  entity_id?: string | null;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface AuthSessionState {
  isAuthenticated: boolean;
  userId: string | null;
  email: string | null;
  customerProfile: CustomerProfile | null;
  staffProfile: StaffProfile | null;
  isStaff: boolean;
  isAdmin: boolean;
}
