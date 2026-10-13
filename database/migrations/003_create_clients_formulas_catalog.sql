-- DEV only. MySQL / Percona 5.7. Review before execution; DDL is not transactional.

CREATE TABLE IF NOT EXISTS clients (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(64) NOT NULL,
  type VARCHAR(64) NOT NULL,
  email VARCHAR(255) NULL,
  address VARCHAR(500) NULL,
  notes TEXT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'Activo',
  last_order_date DATE NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS formulas (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(64) NOT NULL,
  yield_size VARCHAR(128) NOT NULL,
  yield_units DECIMAL(14,4) NOT NULL DEFAULT 1,
  batch_size_grams DECIMAL(14,4) NOT NULL,
  status VARCHAR(32) NOT NULL,
  version VARCHAR(64) NOT NULL,
  notes TEXT NULL,
  top_notes JSON NULL,
  heart_notes JSON NULL,
  base_notes JSON NULL,
  suggested_margin_percent DECIMAL(8,2) NOT NULL DEFAULT 65,
  process_max_melting_temp DECIMAL(10,2) NULL,
  process_fragrance_temp DECIMAL(10,2) NULL,
  process_pouring_temp DECIMAL(10,2) NULL,
  process_curing_days INT NULL,
  process_notes TEXT NULL,
  total_cost_ars DECIMAL(14,4) NOT NULL DEFAULT 0,
  unit_cost_ars DECIMAL(14,4) NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS formula_ingredients (
  id VARCHAR(64) PRIMARY KEY,
  formula_id VARCHAR(64) NOT NULL,
  ingredient_id VARCHAR(64) NULL,
  ingredient_name VARCHAR(255) NOT NULL,
  category VARCHAR(64) NOT NULL,
  quantity DECIMAL(14,4) NOT NULL,
  unit VARCHAR(16) NOT NULL,
  percentage DECIMAL(8,4) NOT NULL,
  unit_cost_ars DECIMAL(14,4) NOT NULL,
  supplier_id VARCHAR(64) NULL,
  supplier_name VARCHAR(255) NULL,
  calculated_cost_ars DECIMAL(14,4) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_fi_formula FOREIGN KEY (formula_id) REFERENCES formulas(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_fi_ingredient FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS catalog_products (
  id VARCHAR(64) PRIMARY KEY,
  sku VARCHAR(128) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(128) NOT NULL,
  description TEXT NOT NULL,
  short_description VARCHAR(500) NOT NULL,
  collection VARCHAR(255) NOT NULL,
  fragrance_family VARCHAR(255) NOT NULL,
  status VARCHAR(32) NOT NULL,
  formula_id VARCHAR(64) NULL,
  formula_name VARCHAR(255) NULL,
  image_url TEXT NULL,
  images JSON NULL,
  badge VARCHAR(255) NULL,
  top_notes TEXT NULL,
  heart_notes TEXT NULL,
  base_notes TEXT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_cp_formula FOREIGN KEY (formula_id) REFERENCES formulas(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS product_variants (
  id VARCHAR(64) PRIMARY KEY,
  product_id VARCHAR(64) NOT NULL,
  sku VARCHAR(128) NOT NULL UNIQUE,
  size VARCHAR(128) NOT NULL,
  unit VARCHAR(32) NOT NULL,
  aroma VARCHAR(255) NOT NULL,
  sale_price_ars DECIMAL(14,2) NOT NULL,
  estimated_cost_ars DECIMAL(14,4) NOT NULL,
  suggested_sale_price_ars DECIMAL(14,2) NULL,
  margin_percent DECIMAL(8,2) NULL,
  status VARCHAR(32) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_pv_product FOREIGN KEY (product_id) REFERENCES catalog_products(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
