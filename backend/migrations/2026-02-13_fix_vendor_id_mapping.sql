-- Normalize vendor_id references from users.id to vendors.id
-- Run on MySQL after backup.

-- 1) Products table
UPDATE pemtshop_products.vendor_products p
JOIN pemtshop_auth.vendors v ON p.vendor_id = v.user_id
SET p.vendor_id = v.id
WHERE p.vendor_id <> v.id;

-- 2) Product categories table
UPDATE pemtshop_products.product_categories c
JOIN pemtshop_auth.vendors v ON c.vendor_id = v.user_id
SET c.vendor_id = v.id
WHERE c.vendor_id <> v.id;

-- 3) Orders table
UPDATE pemtshop_orders.vendor_orders o
JOIN pemtshop_auth.vendors v ON o.vendor_id = v.user_id
SET o.vendor_id = v.id
WHERE o.vendor_id <> v.id;

-- Optional sanity checks
SELECT 'vendor_products' AS table_name, COUNT(*) AS rows_with_user_id_vendor
FROM pemtshop_products.vendor_products p
JOIN pemtshop_auth.vendors v ON p.vendor_id = v.user_id;

SELECT 'product_categories' AS table_name, COUNT(*) AS rows_with_user_id_vendor
FROM pemtshop_products.product_categories c
JOIN pemtshop_auth.vendors v ON c.vendor_id = v.user_id;

SELECT 'vendor_orders' AS table_name, COUNT(*) AS rows_with_user_id_vendor
FROM pemtshop_orders.vendor_orders o
JOIN pemtshop_auth.vendors v ON o.vendor_id = v.user_id;
