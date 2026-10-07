-- MEJUNJE Backoffice MySQL Database Migration
-- Migration: 001_create_suppliers_and_ingredients.sql
-- Target: BlueHost MySQL / Percona Server 5.7.44-48
-- Target Database: DEV (athcomar_mejunje_dev) / PROD (athcomar_mejunje_prod)
-- Domain Vertical: Suppliers + Ingredients (1:N Relationship)

-- -----------------------------------------------------------------------------
-- 1. TABLE: suppliers
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS suppliers (
  id VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255) NOT NULL DEFAULT '',
  phone_whatsapp VARCHAR(64) NOT NULL DEFAULT '',
  email VARCHAR(255) NULL,
  web VARCHAR(255) NULL,
  location VARCHAR(255) NULL,
  categories_supplied JSON NULL COMMENT 'JSON array of category strings (e.g. ["Fragancias", "Aditivos"])',
  min_purchase_ars DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  delivery_time_days INT NOT NULL DEFAULT 0,
  notes TEXT NULL,
  image_url TEXT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_suppliers_active (is_active),
  KEY idx_suppliers_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2. TABLE: ingredients
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ingredients (
  id VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(64) NOT NULL COMMENT 'Category (e.g., Ceras, Fragancias, Aditivos, Pabilos, Envases)',
  unit VARCHAR(16) NOT NULL COMMENT 'Base unit (g, kg, ml, l, unid, %)',
  purchase_price_ars DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  reference_qty DECIMAL(12,4) NOT NULL DEFAULT 1.0000,
  unit_cost_ars DECIMAL(12,4) NOT NULL DEFAULT 0.0000 COMMENT 'Calculated unit cost (purchase_price_ars / reference_qty) maintained by API',
  stock DECIMAL(12,4) NOT NULL DEFAULT 0.0000,
  min_stock DECIMAL(12,4) NOT NULL DEFAULT 0.0000,
  default_supplier_id VARCHAR(64) NULL,
  image_url TEXT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_ingredients_category (category),
  KEY idx_ingredients_active (is_active),
  KEY idx_ingredients_name (name),
  KEY idx_ingredients_supplier (default_supplier_id),
  CONSTRAINT fk_ingredients_default_supplier 
    FOREIGN KEY (default_supplier_id) 
    REFERENCES suppliers (id) 
    ON DELETE SET NULL 
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
