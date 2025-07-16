-- Simple Seed Data Generator using PostgreSQL's built-in UUID functions
-- This approach uses gen_random_uuid() to generate valid UUIDs automatically

-- Clear existing data (optional - uncomment if needed)
-- TRUNCATE TABLE quotation_audit_trail, sales_order_items, quotation_items, sales_orders, quotations, customers, products, users CASCADE;

-- 1. Insert Users (Using gen_random_uuid() for automatic UUID generation)
INSERT INTO users (email, password_hash, role, created_at, updated_at) VALUES
-- Sales Users
('sales@company.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'sales', NOW(), NOW()),
('john.sales@company.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'sales', NOW(), NOW()),
('sarah.manager@company.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'sales', NOW(), NOW()),

-- Customer Users
('customer1@techcorp.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'customer', NOW(), NOW()),
('procurement@manufacturing.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'customer', NOW(), NOW()),
('buyer@retailchain.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'customer', NOW(), NOW()),
('orders@startup.io', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'customer', NOW(), NOW()),
('purchasing@logistics.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'customer', NOW(), NOW());

-- 2. Insert Products (Using gen_random_uuid() for automatic UUID generation)
INSERT INTO products (name, description, price, stock_quantity, created_at, updated_at) VALUES
-- Electronics
('Laptop Computer', 'High-performance business laptop with 16GB RAM and 512GB SSD', 999.99, 25, NOW(), NOW()),
('Wireless Mouse', 'Ergonomic wireless mouse with precision tracking', 29.99, 150, NOW(), NOW()),
('USB-C Hub', 'Multi-port USB-C hub with HDMI, USB 3.0, and SD card slots', 79.99, 75, NOW(), NOW()),
('4K Monitor', '27-inch 4K display with USB-C connectivity', 449.99, 30, NOW(), NOW()),
('Wireless Keyboard', 'Compact mechanical keyboard with backlight', 89.99, 60, NOW(), NOW()),

-- Office Supplies
('Office Chair', 'Ergonomic office chair with lumbar support', 299.99, 20, NOW(), NOW()),
('Standing Desk', 'Electric height-adjustable standing desk', 599.99, 15, NOW(), NOW()),
('Desk Lamp', 'LED desk lamp with adjustable brightness', 39.99, 100, NOW(), NOW()),
('File Cabinet', '3-drawer locking file cabinet', 199.99, 12, NOW(), NOW()),
('Whiteboard', 'Magnetic dry-erase whiteboard 4x6 feet', 129.99, 8, NOW(), NOW()),

-- Software & Services
('Software License', 'Annual productivity software license', 199.99, 1000, NOW(), NOW()),
('Cloud Storage', 'Premium cloud storage 1TB annual plan', 99.99, 500, NOW(), NOW()),
('Training Course', 'Professional development training course', 299.99, 50, NOW(), NOW());

-- 3. Create some sample quotations (you'll need to replace the UUIDs with actual values after running above)
-- First, let's create a helper to get user IDs
DO $$
DECLARE
    customer_id UUID;
    sales_id UUID;
    product_laptop_id UUID;
    product_mouse_id UUID;
    quotation_id UUID;
BEGIN
    -- Get some user IDs
    SELECT id INTO customer_id FROM users WHERE email = 'customer1@techcorp.com';
    SELECT id INTO sales_id FROM users WHERE email = 'sales@company.com';
    
    -- Get some product IDs
    SELECT id INTO product_laptop_id FROM products WHERE name = 'Laptop Computer';
    SELECT id INTO product_mouse_id FROM products WHERE name = 'Wireless Mouse';
    
    -- Create a sample quotation
    INSERT INTO quotations (quotation_number, customer_id, status, total_amount, created_by, created_at, updated_at)
    VALUES ('Q-' || EXTRACT(epoch FROM NOW())::text, customer_id, 'pending', 1059.98, customer_id, NOW(), NOW())
    RETURNING id INTO quotation_id;
    
    -- Add items to the quotation
    INSERT INTO quotation_items (quotation_id, product_id, quantity, unit_price, sub_total, created_at, updated_at)
    VALUES 
    (quotation_id, product_laptop_id, 1, 999.99, 999.99, NOW(), NOW()),
    (quotation_id, product_mouse_id, 2, 29.99, 59.98, NOW(), NOW());
    
    -- Create audit trail entry
    INSERT INTO quotation_audit_trail (quotation_id, event_type, old_status, new_status, changed_by, change_reason, changed_at)
    VALUES (quotation_id, 'created', NULL, 'pending', customer_id, 'Initial quotation request', NOW());
    
END $$;

-- Create a few more quotations with different statuses
DO $$
DECLARE
    customer_id UUID;
    sales_id UUID;
    product_chair_id UUID;
    product_desk_id UUID;
    quotation_id UUID;
BEGIN
    -- Get user IDs
    SELECT id INTO customer_id FROM users WHERE email = 'procurement@manufacturing.com';
    SELECT id INTO sales_id FROM users WHERE email = 'john.sales@company.com';
    
    -- Get product IDs
    SELECT id INTO product_chair_id FROM products WHERE name = 'Office Chair';
    SELECT id INTO product_desk_id FROM products WHERE name = 'Standing Desk';
    
    -- Create approved quotation
    INSERT INTO quotations (quotation_number, customer_id, status, total_amount, created_by, approved_by, created_at, updated_at, approved_at)
    VALUES ('Q-' || (EXTRACT(epoch FROM NOW()) + 1)::text, customer_id, 'approved', 1499.97, customer_id, sales_id, NOW(), NOW(), NOW())
    RETURNING id INTO quotation_id;
    
    -- Add items
    INSERT INTO quotation_items (quotation_id, product_id, quantity, unit_price, sub_total, created_at, updated_at)
    VALUES 
    (quotation_id, product_chair_id, 2, 299.99, 599.98, NOW(), NOW()),
    (quotation_id, product_desk_id, 1, 599.99, 599.99, NOW(), NOW());
    
    -- Create audit trail entries
    INSERT INTO quotation_audit_trail (quotation_id, event_type, old_status, new_status, changed_by, change_reason, changed_at)
    VALUES 
    (quotation_id, 'created', NULL, 'pending', customer_id, 'Initial quotation request', NOW()),
    (quotation_id, 'approved', 'pending', 'approved', sales_id, 'Approved after review', NOW());
    
END $$;

-- Display summary
SELECT 
    'Users' as table_name, 
    count(*) as record_count 
FROM users
UNION ALL
SELECT 
    'Products' as table_name, 
    count(*) as record_count 
FROM products
UNION ALL
SELECT 
    'Quotations' as table_name, 
    count(*) as record_count 
FROM quotations
UNION ALL
SELECT 
    'Quotation Items' as table_name, 
    count(*) as record_count 
FROM quotation_items
UNION ALL
SELECT 
    'Audit Trail' as table_name, 
    count(*) as record_count 
FROM quotation_audit_trail;