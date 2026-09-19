/**
 * @mejunje/contracts
 * Cross-module public contracts and DTOs for identity, authentication, and audit.
 */

import type { CustomerProfile, StaffProfile, UserRole, ActorType, AuditLogEntry } from '@mejunje/types';

export interface CustomerRegistrationDTO {
  email: string;
  fullName?: string;
  phone?: string;
  documentId?: string;
}

export interface CustomerProfileUpdateDTO {
  fullName?: string;
  phone?: string;
  metadata?: Record<string, unknown>;
}

export interface StaffVerificationResult {
  isStaff: boolean;
  role: UserRole | null;
  isActive: boolean;
  staffProfile: StaffProfile | null;
}

export interface AuditEventPayload {
  actorId?: string | null;
  actorType: ActorType;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
}

export interface AuthErrorContract {
  code: string;
  message: string;
  status: number;
}
