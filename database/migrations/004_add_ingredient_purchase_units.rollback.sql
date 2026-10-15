-- Only rollback with the previous application version and after backing up purchase units.
ALTER TABLE ingredients DROP COLUMN purchase_unit;
