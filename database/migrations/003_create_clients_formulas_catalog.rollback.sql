-- Destructive rollback: child tables first.
DROP TABLE IF EXISTS product_variants;
DROP TABLE IF EXISTS catalog_products;
DROP TABLE IF EXISTS formula_ingredients;
DROP TABLE IF EXISTS formulas;
DROP TABLE IF EXISTS clients;
