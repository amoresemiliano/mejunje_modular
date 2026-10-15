-- MySQL 5.7. Preserve historical costs and stock quantities.
ALTER TABLE ingredients ADD COLUMN purchase_unit VARCHAR(16) NULL AFTER unit;
UPDATE ingredients SET purchase_unit = unit WHERE purchase_unit IS NULL;
ALTER TABLE ingredients MODIFY COLUMN purchase_unit VARCHAR(16) NOT NULL;
