-- MEJUNJE Backoffice MySQL Database Migration
-- Migration: 002_create_purchase_orders.sql
-- Target: BlueHost MySQL / Percona Server 5.7.44-48
-- Target Database: DEV (athcomar_mejunje_dev) / PROD (athcomar_mejunje_prod)
-- Domain Vertical: Purchase Orders + Items (1:N Relationship)

-- -----------------------------------------------------------------------------
-- 1. TABLE: purchase_orders
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS purchase_orders (
  id VARCHAR(64) NOT NULL,
  code VARCHAR(64) NOT NULL UNIQUE,
  supplier_id VARCHAR(64) NULL,
  supplier_name VARCHAR(255) NOT NULL,
  order_date DATE NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'Borrador',
  subtotal_ars DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  total_ars DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  observations TEXT NULL,
  received_at DATETIME NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_po_status (status),
  KEY idx_po_supplier (supplier_id),
  KEY idx_po_date (order_date),
  KEY idx_po_active (is_active),
  CONSTRAINT fk_po_supplier
    FOREIGN KEY (supplier_id)
    REFERENCES suppliers (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2. TABLE: purchase_order_items
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS purchase_order_items (
  id VARCHAR(64) NOT NULL,
  purchase_order_id VARCHAR(64) NOT NULL,
  ingredient_id VARCHAR(64) NULL,
  ingredient_name VARCHAR(255) NOT NULL,
  unit VARCHAR(16) NOT NULL,
  ordered_qty DECIMAL(14,4) NOT NULL DEFAULT 0.0000,
  unit_price_ars DECIMAL(14,4) NOT NULL DEFAULT 0.0000,
  subtotal_ars DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_poi_order (purchase_order_id),
  KEY idx_poi_ingredient (ingredient_id),
  CONSTRAINT fk_poi_order
    FOREIGN KEY (purchase_order_id)
    REFERENCES purchase_orders (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_poi_ingredient
    FOREIGN KEY (ingredient_id)
    REFERENCES ingredients (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
