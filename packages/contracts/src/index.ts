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

// =========================================================================
// CATALOG DOMAIN (02-CAT) PUBLIC CONTRACTS & DTOs
// =========================================================================

export interface CatalogPriceDTO {
  amount: number;
  currency: string;
  isActive: boolean;
}

export interface CatalogVariantDTO {
  id: string;
  sku: string;
  name: string;
  isActive: boolean;
  price: CatalogPriceDTO | null;
}

export interface CatalogCategoryDTO {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  parentId?: string | null;
}

export interface OlfactoryPyramidDTO {
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  description?: string | null;
}

export interface CatalogMediaDTO {
  id: string;
  filePath: string;
  altText?: string | null;
  displayOrder: number;
  isPrimary: boolean;
  mediaType: 'image' | 'video' | 'document';
}

export interface CatalogProductDTO {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  status: 'draft' | 'published' | 'archived';
  isPublished: boolean;
  categories: CatalogCategoryDTO[];
  variants: CatalogVariantDTO[];
  olfactoryPyramid?: OlfactoryPyramidDTO | null;
  media: CatalogMediaDTO[];
}

export interface CatalogProductDetailDTO extends CatalogProductDTO {
  metadata?: Record<string, unknown>;
}

