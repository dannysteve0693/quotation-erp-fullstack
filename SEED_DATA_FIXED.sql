-- PostgreSQL Seed Data for ERP Quotation Module
-- This file contains realistic test data for all tables with valid UUIDs

-- Clear existing data (optional - uncomment if needed)
-- TRUNCATE TABLE quotation_audit_trail, sales_order_items, quotation_items, sales_orders, quotations, customers, products, users CASCADE;

-- 1. Insert Users (Sales staff and Customers)
INSERT INTO users (id, email, password_hash, role, created_at, updated_at) VALUES
-- Sales Users
('550e8400-e29b-41d4-a716-446655440001', 'sales@company.com', '$2b$10$example_hash_1', 'sales', '2024-01-01 10:00:00+00', '2024-01-01 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440002', 'john.sales@company.com', '$2b$10$example_hash_2', 'sales', '2024-01-02 10:00:00+00', '2024-01-02 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440003', 'sarah.manager@company.com', '$2b$10$example_hash_3', 'sales', '2024-01-03 10:00:00+00', '2024-01-03 10:00:00+00'),

-- Customer Users
('550e8400-e29b-41d4-a716-446655440004', 'customer1@techcorp.com', '$2b$10$example_hash_4', 'customer', '2024-01-04 10:00:00+00', '2024-01-04 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440005', 'procurement@manufacturing.com', '$2b$10$example_hash_5', 'customer', '2024-01-05 10:00:00+00', '2024-01-05 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440006', 'buyer@retailchain.com', '$2b$10$example_hash_6', 'customer', '2024-01-06 10:00:00+00', '2024-01-06 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440007', 'orders@startup.io', '$2b$10$example_hash_7', 'customer', '2024-01-07 10:00:00+00', '2024-01-07 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440008', 'purchasing@logistics.com', '$2b$10$example_hash_8', 'customer', '2024-01-08 10:00:00+00', '2024-01-08 10:00:00+00');

-- 2. Insert Products
INSERT INTO products (id, name, description, price, stock_quantity, created_at, updated_at) VALUES
-- Electronics
('6ba7b810-9dad-11d1-80b4-00c04fd430c1', 'Laptop Computer', 'High-performance business laptop with 16GB RAM and 512GB SSD', 999.99, 25, '2024-01-01 09:00:00+00', '2024-01-01 09:00:00+00'),
('6ba7b810-9dad-11d1-80b4-00c04fd430c2', 'Wireless Mouse', 'Ergonomic wireless mouse with precision tracking', 29.99, 150, '2024-01-01 09:15:00+00', '2024-01-01 09:15:00+00'),
('6ba7b810-9dad-11d1-80b4-00c04fd430c3', 'USB-C Hub', 'Multi-port USB-C hub with HDMI, USB 3.0, and SD card slots', 79.99, 75, '2024-01-01 09:30:00+00', '2024-01-01 09:30:00+00'),
('6ba7b810-9dad-11d1-80b4-00c04fd430c4', '4K Monitor', '27-inch 4K display with USB-C connectivity', 449.99, 30, '2024-01-01 09:45:00+00', '2024-01-01 09:45:00+00'),
('6ba7b810-9dad-11d1-80b4-00c04fd430c5', 'Wireless Keyboard', 'Compact mechanical keyboard with backlight', 89.99, 60, '2024-01-01 10:00:00+00', '2024-01-01 10:00:00+00'),

-- Office Supplies
('6ba7b810-9dad-11d1-80b4-00c04fd430c6', 'Office Chair', 'Ergonomic office chair with lumbar support', 299.99, 20, '2024-01-01 10:15:00+00', '2024-01-01 10:15:00+00'),
('6ba7b810-9dad-11d1-80b4-00c04fd430c7', 'Standing Desk', 'Electric height-adjustable standing desk', 599.99, 15, '2024-01-01 10:30:00+00', '2024-01-01 10:30:00+00'),
('6ba7b810-9dad-11d1-80b4-00c04fd430c8', 'Desk Lamp', 'LED desk lamp with adjustable brightness', 39.99, 100, '2024-01-01 10:45:00+00', '2024-01-01 10:45:00+00'),
('6ba7b810-9dad-11d1-80b4-00c04fd430c9', 'File Cabinet', '3-drawer locking file cabinet', 199.99, 12, '2024-01-01 11:00:00+00', '2024-01-01 11:00:00+00'),
('6ba7b810-9dad-11d1-80b4-00c04fd430ca', 'Whiteboard', 'Magnetic dry-erase whiteboard 4x6 feet', 129.99, 8, '2024-01-01 11:15:00+00', '2024-01-01 11:15:00+00'),

-- Software & Services
('6ba7b810-9dad-11d1-80b4-00c04fd430cb', 'Software License', 'Annual productivity software license', 199.99, 1000, '2024-01-01 11:30:00+00', '2024-01-01 11:30:00+00'),
('6ba7b810-9dad-11d1-80b4-00c04fd430cc', 'Cloud Storage', 'Premium cloud storage 1TB annual plan', 99.99, 500, '2024-01-01 11:45:00+00', '2024-01-01 11:45:00+00'),
('6ba7b810-9dad-11d1-80b4-00c04fd430cd', 'Training Course', 'Professional development training course', 299.99, 50, '2024-01-01 12:00:00+00', '2024-01-01 12:00:00+00');

-- 3. Insert Customers (Optional detailed customer profiles)
INSERT INTO customers (id, user_id, name, contact_person, phone_number, address, created_at, updated_at) VALUES
('123e4567-e89b-12d3-a456-426614174001', '550e8400-e29b-41d4-a716-446655440004', 'TechCorp Solutions', 'Alice Johnson', '+1-555-0101', '123 Tech Street, Silicon Valley, CA 94025', '2024-01-04 10:30:00+00', '2024-01-04 10:30:00+00'),
('123e4567-e89b-12d3-a456-426614174002', '550e8400-e29b-41d4-a716-446655440005', 'Manufacturing Inc', 'Bob Smith', '+1-555-0202', '456 Industrial Blvd, Detroit, MI 48201', '2024-01-05 10:30:00+00', '2024-01-05 10:30:00+00'),
('123e4567-e89b-12d3-a456-426614174003', '550e8400-e29b-41d4-a716-446655440006', 'Retail Chain Corp', 'Carol Davis', '+1-555-0303', '789 Commerce Ave, New York, NY 10001', '2024-01-06 10:30:00+00', '2024-01-06 10:30:00+00'),
('123e4567-e89b-12d3-a456-426614174004', '550e8400-e29b-41d4-a716-446655440007', 'Startup Innovations', 'David Wilson', '+1-555-0404', '321 Innovation Dr, Austin, TX 78701', '2024-01-07 10:30:00+00', '2024-01-07 10:30:00+00'),
('123e4567-e89b-12d3-a456-426614174005', '550e8400-e29b-41d4-a716-446655440008', 'Logistics Solutions', 'Emma Brown', '+1-555-0505', '654 Supply Chain Ln, Chicago, IL 60601', '2024-01-08 10:30:00+00', '2024-01-08 10:30:00+00');

-- 4. Insert Quotations
INSERT INTO quotations (id, quotation_number, customer_id, status, total_amount, created_by, approved_by, created_at, updated_at, approved_at) VALUES
-- Pending Quotations
('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Q-1704110400000', '550e8400-e29b-41d4-a716-446655440004', 'pending', 1579.97, '550e8400-e29b-41d4-a716-446655440004', NULL, '2024-01-10 14:00:00+00', '2024-01-10 14:00:00+00', NULL),
('f47ac10b-58cc-4372-a567-0e02b2c3d480', 'Q-1704196800000', '550e8400-e29b-41d4-a716-446655440005', 'pending', 2399.94, '550e8400-e29b-41d4-a716-446655440005', NULL, '2024-01-11 14:00:00+00', '2024-01-11 14:00:00+00', NULL),
('f47ac10b-58cc-4372-a567-0e02b2c3d481', 'Q-1704283200000', '550e8400-e29b-41d4-a716-446655440006', 'pending', 769.97, '550e8400-e29b-41d4-a716-446655440006', NULL, '2024-01-12 14:00:00+00', '2024-01-12 14:00:00+00', NULL),

-- Approved Quotations
('f47ac10b-58cc-4372-a567-0e02b2c3d482', 'Q-1704369600000', '550e8400-e29b-41d4-a716-446655440007', 'approved', 1199.98, '550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440001', '2024-01-13 14:00:00+00', '2024-01-13 16:00:00+00', '2024-01-13 16:00:00+00'),
('f47ac10b-58cc-4372-a567-0e02b2c3d483', 'Q-1704456000000', '550e8400-e29b-41d4-a716-446655440008', 'approved', 929.97, '550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440002', '2024-01-14 14:00:00+00', '2024-01-14 15:30:00+00', '2024-01-14 15:30:00+00'),

-- Rejected Quotations
('f47ac10b-58cc-4372-a567-0e02b2c3d484', 'Q-1704542400000', '550e8400-e29b-41d4-a716-446655440004', 'rejected', 3999.96, '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', '2024-01-15 14:00:00+00', '2024-01-15 17:00:00+00', NULL),

-- Converted to Order
('f47ac10b-58cc-4372-a567-0e02b2c3d485', 'Q-1704628800000', '550e8400-e29b-41d4-a716-446655440005', 'converted_to_order', 599.99, '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', '2024-01-16 14:00:00+00', '2024-01-16 16:30:00+00', '2024-01-16 16:30:00+00');

-- 5. Insert Quotation Items
INSERT INTO quotation_items (id, quotation_id, product_id, quantity, unit_price, sub_total, created_at, updated_at) VALUES
-- Quotation Q-1704110400000 items (TechCorp - Pending)
('87654321-1234-5678-9abc-def012345678', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '6ba7b810-9dad-11d1-80b4-00c04fd430c1', 1, 999.99, 999.99, '2024-01-10 14:00:00+00', '2024-01-10 14:00:00+00'),
('87654321-1234-5678-9abc-def012345679', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '6ba7b810-9dad-11d1-80b4-00c04fd430c2', 2, 29.99, 59.98, '2024-01-10 14:00:00+00', '2024-01-10 14:00:00+00'),
('87654321-1234-5678-9abc-def012345680', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '6ba7b810-9dad-11d1-80b4-00c04fd430c3', 1, 79.99, 79.99, '2024-01-10 14:00:00+00', '2024-01-10 14:00:00+00'),
('87654321-1234-5678-9abc-def012345681', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '6ba7b810-9dad-11d1-80b4-00c04fd430c4', 1, 449.99, 449.99, '2024-01-10 14:00:00+00', '2024-01-10 14:00:00+00'),

-- Quotation Q-1704196800000 items (Manufacturing - Pending)
('87654321-1234-5678-9abc-def012345682', 'f47ac10b-58cc-4372-a567-0e02b2c3d480', '6ba7b810-9dad-11d1-80b4-00c04fd430c6', 4, 299.99, 1199.96, '2024-01-11 14:00:00+00', '2024-01-11 14:00:00+00'),
('87654321-1234-5678-9abc-def012345683', 'f47ac10b-58cc-4372-a567-0e02b2c3d480', '6ba7b810-9dad-11d1-80b4-00c04fd430c7', 2, 599.99, 1199.98, '2024-01-11 14:00:00+00', '2024-01-11 14:00:00+00'),

-- Quotation Q-1704283200000 items (Retail Chain - Pending)
('87654321-1234-5678-9abc-def012345684', 'f47ac10b-58cc-4372-a567-0e02b2c3d481', '6ba7b810-9dad-11d1-80b4-00c04fd430cb', 3, 199.99, 599.97, '2024-01-12 14:00:00+00', '2024-01-12 14:00:00+00'),
('87654321-1234-5678-9abc-def012345685', 'f47ac10b-58cc-4372-a567-0e02b2c3d481', '6ba7b810-9dad-11d1-80b4-00c04fd430cc', 1, 99.99, 99.99, '2024-01-12 14:00:00+00', '2024-01-12 14:00:00+00'),
('87654321-1234-5678-9abc-def012345686', 'f47ac10b-58cc-4372-a567-0e02b2c3d481', '6ba7b810-9dad-11d1-80b4-00c04fd430c8', 2, 39.99, 79.98, '2024-01-12 14:00:00+00', '2024-01-12 14:00:00+00'),

-- Quotation Q-1704369600000 items (Startup - Approved)
('87654321-1234-5678-9abc-def012345687', 'f47ac10b-58cc-4372-a567-0e02b2c3d482', '6ba7b810-9dad-11d1-80b4-00c04fd430c1', 1, 999.99, 999.99, '2024-01-13 14:00:00+00', '2024-01-13 14:00:00+00'),
('87654321-1234-5678-9abc-def012345688', 'f47ac10b-58cc-4372-a567-0e02b2c3d482', '6ba7b810-9dad-11d1-80b4-00c04fd430cb', 1, 199.99, 199.99, '2024-01-13 14:00:00+00', '2024-01-13 14:00:00+00'),

-- Quotation Q-1704456000000 items (Logistics - Approved)
('87654321-1234-5678-9abc-def012345689', 'f47ac10b-58cc-4372-a567-0e02b2c3d483', '6ba7b810-9dad-11d1-80b4-00c04fd430c6', 3, 299.99, 899.97, '2024-01-14 14:00:00+00', '2024-01-14 14:00:00+00'),
('87654321-1234-5678-9abc-def012345690', 'f47ac10b-58cc-4372-a567-0e02b2c3d483', '6ba7b810-9dad-11d1-80b4-00c04fd430c2', 1, 29.99, 29.99, '2024-01-14 14:00:00+00', '2024-01-14 14:00:00+00'),

-- Quotation Q-1704542400000 items (TechCorp - Rejected)
('87654321-1234-5678-9abc-def012345691', 'f47ac10b-58cc-4372-a567-0e02b2c3d484', '6ba7b810-9dad-11d1-80b4-00c04fd430c1', 4, 999.99, 3999.96, '2024-01-15 14:00:00+00', '2024-01-15 14:00:00+00'),

-- Quotation Q-1704628800000 items (Manufacturing - Converted)
('87654321-1234-5678-9abc-def012345692', 'f47ac10b-58cc-4372-a567-0e02b2c3d485', '6ba7b810-9dad-11d1-80b4-00c04fd430c7', 1, 599.99, 599.99, '2024-01-16 14:00:00+00', '2024-01-16 14:00:00+00');

-- 6. Insert Sales Orders (from approved/converted quotations)
INSERT INTO sales_orders (id, quotation_id, customer_id, order_date, total_amount, created_by, created_at, updated_at) VALUES
('9b59b5e3-3456-4789-a012-123456789abc', 'f47ac10b-58cc-4372-a567-0e02b2c3d482', '550e8400-e29b-41d4-a716-446655440007', '2024-01-13 16:00:00+00', 1199.98, '550e8400-e29b-41d4-a716-446655440001', '2024-01-13 16:00:00+00', '2024-01-13 16:00:00+00'),
('9b59b5e3-3456-4789-a012-123456789abd', 'f47ac10b-58cc-4372-a567-0e02b2c3d483', '550e8400-e29b-41d4-a716-446655440008', '2024-01-14 15:30:00+00', 929.97, '550e8400-e29b-41d4-a716-446655440002', '2024-01-14 15:30:00+00', '2024-01-14 15:30:00+00'),
('9b59b5e3-3456-4789-a012-123456789abe', 'f47ac10b-58cc-4372-a567-0e02b2c3d485', '550e8400-e29b-41d4-a716-446655440005', '2024-01-16 16:30:00+00', 599.99, '550e8400-e29b-41d4-a716-446655440001', '2024-01-16 16:30:00+00', '2024-01-16 16:30:00+00');

-- 7. Insert Sales Order Items
INSERT INTO sales_order_items (id, sales_order_id, product_id, quantity, unit_price, sub_total, created_at, updated_at) VALUES
-- Sales Order from Q-1704369600000 (Startup)
('12345678-9abc-def0-1234-56789abcdef0', '9b59b5e3-3456-4789-a012-123456789abc', '6ba7b810-9dad-11d1-80b4-00c04fd430c1', 1, 999.99, 999.99, '2024-01-13 16:00:00+00', '2024-01-13 16:00:00+00'),
('12345678-9abc-def0-1234-56789abcdef1', '9b59b5e3-3456-4789-a012-123456789abc', '6ba7b810-9dad-11d1-80b4-00c04fd430cb', 1, 199.99, 199.99, '2024-01-13 16:00:00+00', '2024-01-13 16:00:00+00'),

-- Sales Order from Q-1704456000000 (Logistics)
('12345678-9abc-def0-1234-56789abcdef2', '9b59b5e3-3456-4789-a012-123456789abd', '6ba7b810-9dad-11d1-80b4-00c04fd430c6', 3, 299.99, 899.97, '2024-01-14 15:30:00+00', '2024-01-14 15:30:00+00'),
('12345678-9abc-def0-1234-56789abcdef3', '9b59b5e3-3456-4789-a012-123456789abd', '6ba7b810-9dad-11d1-80b4-00c04fd430c2', 1, 29.99, 29.99, '2024-01-14 15:30:00+00', '2024-01-14 15:30:00+00'),

-- Sales Order from Q-1704628800000 (Manufacturing)
('12345678-9abc-def0-1234-56789abcdef4', '9b59b5e3-3456-4789-a012-123456789abe', '6ba7b810-9dad-11d1-80b4-00c04fd430c7', 1, 599.99, 599.99, '2024-01-16 16:30:00+00', '2024-01-16 16:30:00+00');

-- 8. Insert Quotation Audit Trail
INSERT INTO quotation_audit_trail (id, quotation_id, event_type, old_status, new_status, changed_by, change_reason, changed_at) VALUES
-- Quotation creation events
('abcdef12-3456-7890-abcd-ef1234567890', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'created', NULL, 'pending', '550e8400-e29b-41d4-a716-446655440004', 'Initial quotation request', '2024-01-10 14:00:00+00'),
('abcdef12-3456-7890-abcd-ef1234567891', 'f47ac10b-58cc-4372-a567-0e02b2c3d480', 'created', NULL, 'pending', '550e8400-e29b-41d4-a716-446655440005', 'Initial quotation request', '2024-01-11 14:00:00+00'),
('abcdef12-3456-7890-abcd-ef1234567892', 'f47ac10b-58cc-4372-a567-0e02b2c3d481', 'created', NULL, 'pending', '550e8400-e29b-41d4-a716-446655440006', 'Initial quotation request', '2024-01-12 14:00:00+00'),
('abcdef12-3456-7890-abcd-ef1234567893', 'f47ac10b-58cc-4372-a567-0e02b2c3d482', 'created', NULL, 'pending', '550e8400-e29b-41d4-a716-446655440007', 'Initial quotation request', '2024-01-13 14:00:00+00'),
('abcdef12-3456-7890-abcd-ef1234567894', 'f47ac10b-58cc-4372-a567-0e02b2c3d483', 'created', NULL, 'pending', '550e8400-e29b-41d4-a716-446655440008', 'Initial quotation request', '2024-01-14 14:00:00+00'),
('abcdef12-3456-7890-abcd-ef1234567895', 'f47ac10b-58cc-4372-a567-0e02b2c3d484', 'created', NULL, 'pending', '550e8400-e29b-41d4-a716-446655440004', 'Initial quotation request', '2024-01-15 14:00:00+00'),
('abcdef12-3456-7890-abcd-ef1234567896', 'f47ac10b-58cc-4372-a567-0e02b2c3d485', 'created', NULL, 'pending', '550e8400-e29b-41d4-a716-446655440005', 'Initial quotation request', '2024-01-16 14:00:00+00'),

-- Status change events
('abcdef12-3456-7890-abcd-ef1234567897', 'f47ac10b-58cc-4372-a567-0e02b2c3d482', 'approved', 'pending', 'approved', '550e8400-e29b-41d4-a716-446655440001', 'Approved after review - good pricing and requirements match', '2024-01-13 16:00:00+00'),
('abcdef12-3456-7890-abcd-ef1234567898', 'f47ac10b-58cc-4372-a567-0e02b2c3d483', 'approved', 'pending', 'approved', '550e8400-e29b-41d4-a716-446655440002', 'Approved - standard office furniture order', '2024-01-14 15:30:00+00'),
('abcdef12-3456-7890-abcd-ef1234567899', 'f47ac10b-58cc-4372-a567-0e02b2c3d484', 'rejected', 'pending', 'rejected', '550e8400-e29b-41d4-a716-446655440003', 'Rejected - quantity too large for current inventory', '2024-01-15 17:00:00+00'),
('abcdef12-3456-7890-abcd-ef1234567900', 'f47ac10b-58cc-4372-a567-0e02b2c3d485', 'approved', 'pending', 'approved', '550e8400-e29b-41d4-a716-446655440001', 'Approved for immediate processing', '2024-01-16 16:30:00+00'),
('abcdef12-3456-7890-abcd-ef1234567901', 'f47ac10b-58cc-4372-a567-0e02b2c3d485', 'converted_to_order', 'approved', 'converted_to_order', '550e8400-e29b-41d4-a716-446655440001', 'Converted to sales order', '2024-01-16 16:30:00+00');