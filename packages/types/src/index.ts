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

// =========================================================================
// CATALOG DOMAIN (02-CAT) TYPES
// =========================================================================

export type ProductStatus = 'draft' | 'published' | 'archived';

export interface Product {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  status: ProductStatus;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  name: string;
  is_active: boolean;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Price {
  id: string;
  variant_id: string;
  amount: number;
  currency: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductCategory {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  parent_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface OlfactoryPyramid {
  id: string;
  product_id: string;
  top_notes: string[];
  heart_notes: string[];
  base_notes: string[];
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CatalogMedia {
  id: string;
  product_id?: string | null;
  variant_id?: string | null;
  file_path: string;
  alt_text?: string | null;
  display_order: number;
  is_primary: boolean;
  media_type: 'image' | 'video' | 'document';
  created_at: string;
  updated_at: string;
}

