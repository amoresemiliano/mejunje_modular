-- MEJUNJE Backoffice MySQL Database Rollback
-- Rollback: 001_create_suppliers_and_ingredients.rollback.sql
-- Target: BlueHost MySQL / Percona Server 5.7.44-48
-- Target Database: DEV (athcomar_mejunje_dev) / PROD (athcomar_mejunje)
-- Safe dependency order: Drop ingredients table first (foreign key child), then suppliers (parent).

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS ingredients;
DROP TABLE IF EXISTS suppliers;

SET FOREIGN_KEY_CHECKS = 1;
