-- MEJUNJE Backoffice MySQL Database Rollback Migration
-- Rollback Migration: 002_create_purchase_orders.rollback.sql
-- Target: BlueHost MySQL / Percona Server 5.7.44-48
-- Target Database: DEV (athcomar_mejunje_dev) / PROD (athcomar_mejunje_prod)
-- Domain Vertical: Purchase Orders + Items

DROP TABLE IF EXISTS purchase_order_items;
DROP TABLE IF EXISTS purchase_orders;
