-- Comprehensive Seed Data for ERP Quotation Module
-- This script provides realistic sample data for testing and development
-- Run this after creating the database schema

-- Clear existing data (in correct order to avoid foreign key conflicts)
TRUNCATE TABLE quotation_audit_trail CASCADE;
TRUNCATE TABLE sales_order_items CASCADE;
TRUNCATE TABLE sales_orders CASCADE;
TRUNCATE TABLE quotation_items CASCADE;
TRUNCATE TABLE quotations CASCADE;
TRUNCATE TABLE customers CASCADE;
TRUNCATE TABLE products CASCADE;
TRUNCATE TABLE users CASCADE;

-- Reset sequences if they exist
-- Note: PostgreSQL auto-generates sequences for UUID fields, so this is mainly for reference

-- 1. Insert Users (Sales staff and Customers)
INSERT INTO users (id, email, password_hash, role, is_active, created_at, updated_at) VALUES
-- Sales Staff
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'admin@quotation-erp.com', '$2a$12$nQWbw0fRMUkfHraA8uBeFe6JXaVAEBysa.YVSsBCedm9LnkoMp0gG', 'sales', true, '2024-01-15 08:00:00+00', '2024-01-15 08:00:00+00'),
('b2c3d4e5-f6g7-8901-bcde-f23456789012', 'sarah.manager@quotation-erp.com', '$2a$12$nQWbw0fRMUkfHraA8uBeFe6JXaVAEBysa.YVSsBCedm9LnkoMp0gG', 'sales', true, '2024-01-16 09:30:00+00', '2024-01-16 09:30:00+00'),
('c3d4e5f6-g7h8-9012-cdef-345678901234', 'mike.sales@quotation-erp.com', '$2a$12$nQWbw0fRMUkfHraA8uBeFe6JXaVAEBysa.YVSsBCedm9LnkoMp0gG', 'sales', true, '2024-01-17 10:15:00+00', '2024-01-17 10:15:00+00'),

-- Customers
('d4e5f6g7-h8i9-0123-def4-56789012345a', 'john.smith@techcorp.com', '$2a$12$nQWbw0fRMUkfHraA8uBeFe6JXaVAEBysa.YVSsBCedm9LnkoMp0gG', 'customer', true, '2024-02-01 14:20:00+00', '2024-02-01 14:20:00+00'),
('e5f6g7h8-i9j0-1234-ef56-789012345abc', 'lisa.johnson@manufacturing.com', '$2a$12$nQWbw0fRMUkfHraA8uBeFe6JXaVAEBysa.YVSsBCedm9LnkoMp0gG', 'customer', true, '2024-02-03 11:45:00+00', '2024-02-03 11:45:00+00'),
('f6g7h8i9-j0k1-2345-fg67-89012345abcd', 'robert.wilson@construction.com', '$2a$12$nQWbw0fRMUkfHraA8uBeFe6JXaVAEBysa.YVSsBCedm9LnkoMp0gG', 'customer', true, '2024-02-05 16:30:00+00', '2024-02-05 16:30:00+00'),
('g7h8i9j0-k1l2-3456-gh78-9012345abcde', 'emily.davis@startuptech.com', '$2a$12$nQWbw0fRMUkfHraA8uBeFe6JXaVAEBysa.YVSsBCedm9LnkoMp0gG', 'customer', true, '2024-02-08 13:15:00+00', '2024-02-08 13:15:00+00'),
('h8i9j0k1-l2m3-4567-hi89-012345abcdef', 'david.brown@retailstore.com', '$2a$12$nQWbw0fRMUkfHraA8uBeFe6JXaVAEBysa.YVSsBCedm9LnkoMp0gG', 'customer', true, '2024-02-10 09:40:00+00', '2024-02-10 09:40:00+00'),
('i9j0k1l2-m3n4-5678-ij90-123456abcdef', 'amanda.garcia@healthcare.com', '$2a$12$nQWbw0fRMUkfHraA8uBeFe6JXaVAEBysa.YVSsBCedm9LnkoMp0gG', 'customer', true, '2024-02-12 15:25:00+00', '2024-02-12 15:25:00+00');

-- 2. Insert Customer Profiles (Extended information for customers)
INSERT INTO customers (id, user_id, name, contact_person, phone_number, address, created_at, updated_at) VALUES
('ca1b2c3d-e4f5-6789-abc1-234567890123', 'd4e5f6g7-h8i9-0123-def4-56789012345a', 'TechCorp Solutions', 'John Smith', '+1-555-0101', '123 Technology Blvd, Suite 400, San Francisco, CA 94107', '2024-02-01 14:20:00+00', '2024-02-01 14:20:00+00'),
('cb2c3d4e-f5g6-789a-bcd2-34567890123f', 'e5f6g7h8-i9j0-1234-ef56-789012345abc', 'Premier Manufacturing Co.', 'Lisa Johnson', '+1-555-0202', '456 Industrial Park Dr, Detroit, MI 48201', '2024-02-03 11:45:00+00', '2024-02-03 11:45:00+00'),
('cc3d4e5f-g6h7-89ab-cde3-4567890123fg', 'f6g7h8i9-j0k1-2345-fg67-89012345abcd', 'Wilson Construction LLC', 'Robert Wilson', '+1-555-0303', '789 Builder Ave, Austin, TX 78701', '2024-02-05 16:30:00+00', '2024-02-05 16:30:00+00'),
('cd4e5f6g-h7i8-9abc-def4-567890123fgh', 'g7h8i9j0-k1l2-3456-gh78-9012345abcde', 'StartupTech Innovations', 'Emily Davis', '+1-555-0404', '321 Innovation Way, Seattle, WA 98101', '2024-02-08 13:15:00+00', '2024-02-08 13:15:00+00'),
('ce5f6g7h-i8j9-abcd-ef56-78901234fghi', 'h8i9j0k1-l2m3-4567-hi89-012345abcdef', 'Brown Retail Enterprises', 'David Brown', '+1-555-0505', '654 Commerce St, New York, NY 10001', '2024-02-10 09:40:00+00', '2024-02-10 09:40:00+00'),
('cf6g7h8i-j9k0-bcde-fg67-890123456hij', 'i9j0k1l2-m3n4-5678-ij90-123456abcdef', 'Regional Healthcare Systems', 'Amanda Garcia', '+1-555-0606', '987 Medical Center Dr, Phoenix, AZ 85001', '2024-02-12 15:25:00+00', '2024-02-12 15:25:00+00');

-- 3. Insert Products (Diverse range of business products)
INSERT INTO products (id, name, description, sku, price, stock_quantity, is_active, category, created_at, updated_at) VALUES
-- Office Equipment
('p1a2b3c4-d5e6-7890-prd1-123456789abc', 'Professional Laptop Workstation', 'High-performance business laptop with Intel i7, 16GB RAM, 512GB SSD, ideal for professional computing tasks', 'LAP-PROF-001', 1299.99, 45, true, 'Office Equipment', '2024-01-20 10:00:00+00', '2024-01-20 10:00:00+00'),
('p2b3c4d5-e6f7-8901-prd2-23456789abcd', 'Ergonomic Executive Office Chair', 'Premium ergonomic chair with lumbar support, adjustable height, and breathable mesh backing for all-day comfort', 'CHR-EXEC-002', 449.99, 28, true, 'Office Furniture', '2024-01-20 10:30:00+00', '2024-01-20 10:30:00+00'),
('p3c4d5e6-f7g8-9012-prd3-3456789abcde', 'Wireless Business Mouse Set', 'Professional wireless mouse and keyboard combo with extended battery life and precision tracking', 'MOU-WIRE-003', 89.99, 120, true, 'Office Equipment', '2024-01-20 11:00:00+00', '2024-01-20 11:00:00+00'),
('p4d5e6f7-g8h9-0123-prd4-456789abcdef', 'LED Desk Lamp with USB Charging', 'Adjustable LED desk lamp with multiple brightness settings, color temperature control, and built-in USB ports', 'LMP-LED-004', 79.99, 85, true, 'Office Accessories', '2024-01-20 11:30:00+00', '2024-01-20 11:30:00+00'),
('p5e6f7g8-h9i0-1234-prd5-56789abcdefg', 'Adjustable Monitor Stand with Storage', 'Height-adjustable monitor stand with built-in storage drawer and cable management system', 'STD-MON-005', 129.99, 32, true, 'Office Accessories', '2024-01-20 12:00:00+00', '2024-01-20 12:00:00+00'),

-- Technology & Electronics
('p6f7g8h9-i0j1-2345-prd6-6789abcdefgh', '27-inch 4K Professional Monitor', 'Ultra-high definition 4K monitor with color accuracy certification, perfect for design and development work', 'MON-4K-006', 599.99, 18, true, 'Technology', '2024-01-21 09:00:00+00', '2024-01-21 09:00:00+00'),
('p7g8h9i0-j1k2-3456-prd7-789abcdefghi', 'Network Security Firewall Device', 'Enterprise-grade firewall with advanced threat protection and VPN capabilities for small to medium businesses', 'FW-SEC-007', 1899.99, 12, true, 'Technology', '2024-01-21 09:30:00+00', '2024-01-21 09:30:00+00'),
('p8h9i0j1-k2l3-4567-prd8-89abcdefghij', 'Industrial Tablet Computer', 'Rugged tablet computer with IP65 rating, suitable for harsh industrial environments and field operations', 'TAB-IND-008', 849.99, 25, true, 'Technology', '2024-01-21 10:00:00+00', '2024-01-21 10:00:00+00'),

-- Industrial & Manufacturing
('p9i0j1k2-l3m4-5678-prd9-9abcdefghijk', 'Precision Digital Scale', 'High-precision digital scale for industrial weighing applications with RS-232 connectivity', 'SCL-DIG-009', 329.99, 15, true, 'Industrial Equipment', '2024-01-21 14:00:00+00', '2024-01-21 14:00:00+00'),
('p0j1k2l3-m4n5-6789-pr10-abcdefghijkl', 'Pneumatic Air Compressor', 'Industrial pneumatic air compressor, 50-gallon tank capacity, suitable for manufacturing operations', 'CMP-AIR-010', 2199.99, 8, true, 'Industrial Equipment', '2024-01-21 14:30:00+00', '2024-01-21 14:30:00+00'),

-- Healthcare & Medical
('p1k2l3m4-n5o6-789a-pr11-bcdefghijklm', 'Medical Grade UV Sanitizer', 'Professional UV-C sanitization device for medical equipment and surfaces with safety certifications', 'UV-MED-011', 399.99, 22, true, 'Healthcare', '2024-01-22 08:00:00+00', '2024-01-22 08:00:00+00'),
('p2l3m4n5-o6p7-89ab-pr12-cdefghijklmn', 'Digital Blood Pressure Monitor', 'Professional-grade automated blood pressure monitor with data logging and connectivity features', 'BP-DIG-012', 189.99, 35, true, 'Healthcare', '2024-01-22 08:30:00+00', '2024-01-22 08:30:00+00'),

-- Construction & Tools
('p3m4n5o6-p7q8-9abc-pr13-defghijklmno', 'Professional Power Drill Set', 'Complete cordless power drill set with multiple bits, charger, and carrying case for construction work', 'DRL-PWR-013', 249.99, 40, true, 'Construction Tools', '2024-01-22 13:00:00+00', '2024-01-22 13:00:00+00'),
('p4n5o6p7-q8r9-abcd-pr14-efghijklmnop', 'Laser Level Measuring Tool', 'Self-leveling laser level with tripod mount, ideal for construction and installation projects', 'LVL-LSR-014', 179.99, 18, true, 'Construction Tools', '2024-01-22 13:30:00+00', '2024-01-22 13:30:00+00'),

-- Office Supplies
('p5o6p7q8-r9s0-bcde-pr15-fghijklmnopq', 'Multi-Function Printer Scanner', 'All-in-one printer, scanner, copier with wireless connectivity and automatic document feeder', 'PRT-MFP-015', 329.99, 24, true, 'Office Equipment', '2024-01-23 10:00:00+00', '2024-01-23 10:00:00+00');

-- 4. Insert Quotations (Various stages and customers)
INSERT INTO quotations (id, quotation_number, customer_id, status, total_amount, created_by, approved_by, created_at, updated_at, approved_at) VALUES
-- Pending Quotations
('q1a2b3c4-d5e6-7890-quo1-123456789abc', 'QUO-2024-001', 'd4e5f6g7-h8i9-0123-def4-56789012345a', 'pending', 1979.97, 'd4e5f6g7-h8i9-0123-def4-56789012345a', NULL, '2024-03-01 09:15:00+00', '2024-03-01 09:15:00+00', NULL),
('q2b3c4d5-e6f7-8901-quo2-23456789abcd', 'QUO-2024-002', 'e5f6g7h8-i9j0-1234-ef56-789012345abc', 'pending', 3449.96, 'e5f6g7h8-i9j0-1234-ef56-789012345abc', NULL, '2024-03-03 14:30:00+00', '2024-03-03 14:30:00+00', NULL),

-- Approved Quotations
('q3c4d5e6-f7g8-9012-quo3-3456789abcde', 'QUO-2024-003', 'f6g7h8i9-j0k1-2345-fg67-89012345abcd', 'approved', 2549.97, 'f6g7h8i9-j0k1-2345-fg67-89012345abcd', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-03-05 11:20:00+00', '2024-03-06 16:45:00+00', '2024-03-06 16:45:00+00'),
('q4d5e6f7-g8h9-0123-quo4-456789abcdef', 'QUO-2024-004', 'g7h8i9j0-k1l2-3456-gh78-9012345abcde', 'approved', 1729.98, 'g7h8i9j0-k1l2-3456-gh78-9012345abcde', 'b2c3d4e5-f6g7-8901-bcde-f23456789012', '2024-03-08 08:45:00+00', '2024-03-09 13:20:00+00', '2024-03-09 13:20:00+00'),

-- Converted to Order
('q5e6f7g8-h9i0-1234-quo5-56789abcdefg', 'QUO-2024-005', 'h8i9j0k1-l2m3-4567-hi89-012345abcdef', 'converted_to_order', 1059.97, 'h8i9j0k1-l2m3-4567-hi89-012345abcdef', 'c3d4e5f6-g7h8-9012-cdef-345678901234', '2024-03-10 10:30:00+00', '2024-03-11 15:10:00+00', '2024-03-11 15:10:00+00'),

-- Rejected Quotation
('q6f7g8h9-i0j1-2345-quo6-6789abcdefgh', 'QUO-2024-006', 'i9j0k1l2-m3n4-5678-ij90-123456abcdef', 'rejected', 4599.96, 'i9j0k1l2-m3n4-5678-ij90-123456abcdef', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-03-12 13:15:00+00', '2024-03-13 09:30:00+00', NULL);

-- 5. Insert Quotation Items (Products within each quotation)
INSERT INTO quotation_items (id, quotation_id, product_id, quantity, unit_price, sub_total, created_at, updated_at) VALUES
-- QUO-2024-001 Items (TechCorp - Laptop + Mouse Set)
('qi1a2b3c-d4e5-6789-qit1-123456789abc', 'q1a2b3c4-d5e6-7890-quo1-123456789abc', 'p1a2b3c4-d5e6-7890-prd1-123456789abc', 1, 1299.99, 1299.99, '2024-03-01 09:15:00+00', '2024-03-01 09:15:00+00'),
('qi2b3c4d-e5f6-789a-qit2-23456789abcd', 'q1a2b3c4-d5e6-7890-quo1-123456789abc', 'p3c4d5e6-f7g8-9012-prd3-3456789abcde', 2, 89.99, 179.98, '2024-03-01 09:15:00+00', '2024-03-01 09:15:00+00'),
('qi3c4d5e-f6g7-89ab-qit3-3456789abcde', 'q1a2b3c4-d5e6-7890-quo1-123456789abc', 'p2b3c4d5-e6f7-8901-prd2-23456789abcd', 1, 449.99, 449.99, '2024-03-01 09:15:00+00', '2024-03-01 09:15:00+00'),
('qi4d5e6f-g7h8-9abc-qit4-456789abcdef', 'q1a2b3c4-d5e6-7890-quo1-123456789abc', 'p4d5e6f7-g8h9-0123-prd4-456789abcdef', 1, 79.99, 79.99, '2024-03-01 09:15:00+00', '2024-03-01 09:15:00+00'),

-- QUO-2024-002 Items (Manufacturing - Industrial equipment)
('qi5e6f7g-h8i9-abcd-qit5-56789abcdefg', 'q2b3c4d5-e6f7-8901-quo2-23456789abcd', 'p0j1k2l3-m4n5-6789-pr10-abcdefghijkl', 1, 2199.99, 2199.99, '2024-03-03 14:30:00+00', '2024-03-03 14:30:00+00'),
('qi6f7g8h-i9j0-bcde-qit6-6789abcdefgh', 'q2b3c4d5-e6f7-8901-quo2-23456789abcd', 'p9i0j1k2-l3m4-5678-prd9-9abcdefghijk', 2, 329.99, 659.98, '2024-03-03 14:30:00+00', '2024-03-03 14:30:00+00'),
('qi7g8h9i-j0k1-cdef-qit7-789abcdefghi', 'q2b3c4d5-e6f7-8901-quo2-23456789abcd', 'p8h9i0j1-k2l3-4567-prd8-89abcdefghij', 1, 849.99, 849.99, '2024-03-03 14:30:00+00', '2024-03-03 14:30:00+00'),

-- QUO-2024-003 Items (Construction - Tools and equipment)
('qi8h9i0j-k1l2-def0-qit8-89abcdefghij', 'q3c4d5e6-f7g8-9012-quo3-3456789abcde', 'p3m4n5o6-p7q8-9abc-pr13-defghijklmno', 3, 249.99, 749.97, '2024-03-05 11:20:00+00', '2024-03-05 11:20:00+00'),
('qi9i0j1k-l2m3-ef01-qit9-9abcdefghijk', 'q3c4d5e6-f7g8-9012-quo3-3456789abcde', 'p4n5o6p7-q8r9-abcd-pr14-efghijklmnop', 10, 179.99, 1799.90, '2024-03-05 11:20:00+00', '2024-03-05 11:20:00+00'),

-- QUO-2024-004 Items (Startup - Office setup)
('qi0j1k2l-m3n4-f012-qt10-abcdefghijkl', 'q4d5e6f7-g8h9-0123-quo4-456789abcdef', 'p1a2b3c4-d5e6-7890-prd1-123456789abc', 1, 1299.99, 1299.99, '2024-03-08 08:45:00+00', '2024-03-08 08:45:00+00'),
('qi1k2l3m-n4o5-0123-qt11-bcdefghijklm', 'q4d5e6f7-g8h9-0123-quo4-456789abcdef', 'p2b3c4d5-e6f7-8901-prd2-23456789abcd', 1, 449.99, 449.99, '2024-03-08 08:45:00+00', '2024-03-08 08:45:00+00'),

-- QUO-2024-005 Items (Retail - Office printer)
('qi2l3m4n-o5p6-1234-qt12-cdefghijklmn', 'q5e6f7g8-h9i0-1234-quo5-56789abcdefg', 'p5o6p7q8-r9s0-bcde-pr15-fghijklmnopq', 2, 329.99, 659.98, '2024-03-10 10:30:00+00', '2024-03-10 10:30:00+00'),
('qi3m4n5o-p6q7-2345-qt13-defghijklmno', 'q5e6f7g8-h9i0-1234-quo5-56789abcdefg', 'p1k2l3m4-n5o6-789a-pr11-bcdefghijklm', 1, 399.99, 399.99, '2024-03-10 10:30:00+00', '2024-03-10 10:30:00+00'),

-- QUO-2024-006 Items (Healthcare - Expensive rejected quote)
('qi4n5o6p-q7r8-3456-qt14-efghijklmnop', 'q6f7g8h9-i0j1-2345-quo6-6789abcdefgh', 'p7g8h9i0-j1k2-3456-prd7-789abcdefghi', 2, 1899.99, 3799.98, '2024-03-12 13:15:00+00', '2024-03-12 13:15:00+00'),
('qi5o6p7q-r8s9-4567-qt15-fghijklmnopq', 'q6f7g8h9-i0j1-2345-quo6-6789abcdefgh', 'p6f7g8h9-i0j1-2345-prd6-6789abcdefgh', 1, 599.99, 599.99, '2024-03-12 13:15:00+00', '2024-03-12 13:15:00+00'),
('qi6p7q8r-s9t0-5678-qt16-ghijklmnopqr', 'q6f7g8h9-i0j1-2345-quo6-6789abcdefgh', 'p2l3m4n5-o6p7-89ab-pr12-cdefghijklmn', 1, 189.99, 189.99, '2024-03-12 13:15:00+00', '2024-03-12 13:15:00+00');

-- 6. Insert Sales Orders (From approved and converted quotations)
INSERT INTO sales_orders (id, quotation_id, customer_id, order_date, total_amount, created_by, created_at, updated_at) VALUES
-- From approved quotations that were converted
('so1a2b3c-d4e5-6789-ord1-123456789abc', 'q5e6f7g8-h9i0-1234-quo5-56789abcdefg', 'h8i9j0k1-l2m3-4567-hi89-012345abcdef', '2024-03-11 15:10:00+00', 1059.97, 'c3d4e5f6-g7h8-9012-cdef-345678901234', '2024-03-11 15:10:00+00', '2024-03-11 15:10:00+00');

-- 7. Insert Sales Order Items (Matching the converted quotation)
INSERT INTO sales_order_items (id, sales_order_id, product_id, quantity, unit_price, sub_total, created_at, updated_at) VALUES
('soi1a2b3-c4d5-6789-soi1-123456789abc', 'so1a2b3c-d4e5-6789-ord1-123456789abc', 'p5o6p7q8-r9s0-bcde-pr15-fghijklmnopq', 2, 329.99, 659.98, '2024-03-11 15:10:00+00', '2024-03-11 15:10:00+00'),
('soi2b3c4-d5e6-789a-soi2-23456789abcd', 'so1a2b3c-d4e5-6789-ord1-123456789abc', 'p1k2l3m4-n5o6-789a-pr11-bcdefghijklm', 1, 399.99, 399.99, '2024-03-11 15:10:00+00', '2024-03-11 15:10:00+00');

-- 8. Insert Quotation Audit Trail (Track status changes and approvals)
INSERT INTO quotation_audit_trail (id, quotation_id, event_type, old_status, new_status, changed_by, change_reason, changed_at) VALUES
-- QUO-2024-001 - Created
('qa1a2b3c-d4e5-6789-aud1-123456789abc', 'q1a2b3c4-d5e6-7890-quo1-123456789abc', 'created', NULL, 'pending', 'd4e5f6g7-h8i9-0123-def4-56789012345a', 'Initial quotation request for office equipment upgrade', '2024-03-01 09:15:00+00'),

-- QUO-2024-002 - Created
('qa2b3c4d-e5f6-789a-aud2-23456789abcd', 'q2b3c4d5-e6f7-8901-quo2-23456789abcd', 'created', NULL, 'pending', 'e5f6g7h8-i9j0-1234-ef56-789012345abc', 'Manufacturing equipment procurement request', '2024-03-03 14:30:00+00'),

-- QUO-2024-003 - Created and Approved
('qa3c4d5e-f6g7-89ab-aud3-3456789abcde', 'q3c4d5e6-f7g8-9012-quo3-3456789abcde', 'created', NULL, 'pending', 'f6g7h8i9-j0k1-2345-fg67-89012345abcd', 'Construction tools bulk order request', '2024-03-05 11:20:00+00'),
('qa4d5e6f-g7h8-9abc-aud4-456789abcdef', 'q3c4d5e6-f7g8-9012-quo3-3456789abcde', 'approved', 'pending', 'approved', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Approved after verifying inventory and pricing', '2024-03-06 16:45:00+00'),

-- QUO-2024-004 - Created and Approved
('qa5e6f7g-h8i9-abcd-aud5-56789abcdefg', 'q4d5e6f7-g8h9-0123-quo4-456789abcdef', 'created', NULL, 'pending', 'g7h8i9j0-k1l2-3456-gh78-9012345abcde', 'Startup office setup quotation', '2024-03-08 08:45:00+00'),
('qa6f7g8h-i9j0-bcde-aud6-6789abcdefgh', 'q4d5e6f7-g8h9-0123-quo4-456789abcdef', 'approved', 'pending', 'approved', 'b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Approved with standard discount applied', '2024-03-09 13:20:00+00'),

-- QUO-2024-005 - Created, Approved, and Converted
('qa7g8h9i-j0k1-cdef-aud7-789abcdefghi', 'q5e6f7g8-h9i0-1234-quo5-56789abcdefg', 'created', NULL, 'pending', 'h8i9j0k1-l2m3-4567-hi89-012345abcdef', 'Office printer and sanitizer equipment request', '2024-03-10 10:30:00+00'),
('qa8h9i0j-k1l2-def0-aud8-89abcdefghij', 'q5e6f7g8-h9i0-1234-quo5-56789abcdefg', 'approved', 'pending', 'approved', 'c3d4e5f6-g7h8-9012-cdef-345678901234', 'Fast-tracked approval for urgent requirement', '2024-03-11 15:10:00+00'),
('qa9i0j1k-l2m3-ef01-aud9-9abcdefghijk', 'q5e6f7g8-h9i0-1234-quo5-56789abcdefg', 'converted_to_order', 'approved', 'converted_to_order', 'c3d4e5f6-g7h8-9012-cdef-345678901234', 'Customer confirmed order and payment terms', '2024-03-11 15:10:00+00'),

-- QUO-2024-006 - Created and Rejected
('qa0j1k2l-m3n4-f012-au10-abcdefghijkl', 'q6f7g8h9-i0j1-2345-quo6-6789abcdefgh', 'created', NULL, 'pending', 'i9j0k1l2-m3n4-5678-ij90-123456abcdef', 'Healthcare security and monitoring system upgrade', '2024-03-12 13:15:00+00'),
('qa1k2l3m-n4o5-0123-au11-bcdefghijklm', 'q6f7g8h9-i0j1-2345-quo6-6789abcdefgh', 'rejected', 'pending', 'rejected', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Budget constraints - customer requested revision with lower cost alternatives', '2024-03-13 09:30:00+00');

-- Summary Report (for verification)
-- This provides a quick overview of the seeded data
SELECT 
    'Users' as table_name, 
    COUNT(*) as record_count,
    COUNT(*) FILTER (WHERE role = 'sales') as sales_users,
    COUNT(*) FILTER (WHERE role = 'customer') as customer_users
FROM users
UNION ALL
SELECT 
    'Products' as table_name, 
    COUNT(*) as record_count,
    COUNT(*) FILTER (WHERE is_active = true) as active_products,
    COUNT(DISTINCT category) as categories
FROM products
UNION ALL
SELECT 
    'Quotations' as table_name, 
    COUNT(*) as record_count,
    COUNT(*) FILTER (WHERE status = 'pending') as pending,
    COUNT(*) FILTER (WHERE status = 'approved') as approved
FROM quotations
UNION ALL
SELECT 
    'Sales Orders' as table_name, 
    COUNT(*) as record_count,
    ROUND(AVG(total_amount), 2) as avg_order_value,
    COUNT(*)
FROM sales_orders;

-- Note: All passwords in this seed data use the hash for "password123"
-- In production, ensure all default passwords are changed and use strong authentication