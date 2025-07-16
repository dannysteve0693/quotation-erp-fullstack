-- Corrected Seed Data for ERP Quotation Module with proper UUID format
-- Run this after creating the database schema

-- Clear existing data (in correct order to avoid foreign key conflicts)
TRUNCATE TABLE quotation_audit_trail CASCADE;
TRUNCATE TABLE sales_order_items CASCADE;
TRUNCATE TABLE sales_orders CASCADE;
TRUNCATE TABLE quotation_items CASCADE;
TRUNCATE TABLE quotations CASCADE;
TRUNCATE TABLE products CASCADE;
TRUNCATE TABLE users CASCADE;

-- 1. Insert Users (Sales staff and Customers)
-- Password hash is for "password123" - change in production
INSERT INTO users (id, email, password_hash, role, is_active, created_at, updated_at) VALUES
-- Sales Staff
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'admin@quotation-erp.com', '$2a$12$nQWbw0fRMUkfHraA8uBeFe6JXaVAEBysa.YVSsBCedm9LnkoMp0gG', 'sales', true, '2024-01-15 08:00:00+00', '2024-01-15 08:00:00+00'),
('b2c3d4e5-f6a7-8901-bcde-f23456789012', 'sarah.manager@quotation-erp.com', '$2a$12$nQWbw0fRMUkfHraA8uBeFe6JXaVAEBysa.YVSsBCedm9LnkoMp0gG', 'sales', true, '2024-01-16 09:30:00+00', '2024-01-16 09:30:00+00'),
('c3d4e5f6-a7b8-9012-cdef-345678901234', 'mike.sales@quotation-erp.com', '$2a$12$nQWbw0fRMUkfHraA8uBeFe6JXaVAEBysa.YVSsBCedm9LnkoMp0gG', 'sales', true, '2024-01-17 10:15:00+00', '2024-01-17 10:15:00+00'),

-- Customer Users
('d4e5f6a7-b8c9-0123-def4-56789012345a', 'john.smith@techcorp.com', '$2a$12$nQWbw0fRMUkfHraA8uBeFe6JXaVAEBysa.YVSsBCedm9LnkoMp0gG', 'customer', true, '2024-02-01 14:20:00+00', '2024-02-01 14:20:00+00'),
('e5f6a7b8-c9d0-1234-ef56-789012345abc', 'lisa.johnson@manufacturing.com', '$2a$12$nQWbw0fRMUkfHraA8uBeFe6JXaVAEBysa.YVSsBCedm9LnkoMp0gG', 'customer', true, '2024-02-03 11:45:00+00', '2024-02-03 11:45:00+00'),
('f6a7b8c9-d0e1-2345-fa67-89012345abcd', 'robert.wilson@construction.com', '$2a$12$nQWbw0fRMUkfHraA8uBeFe6JXaVAEBysa.YVSsBCedm9LnkoMp0gG', 'customer', true, '2024-02-05 16:30:00+00', '2024-02-05 16:30:00+00'),
('a7b8c9d0-e1f2-3456-ab78-9012345abcde', 'emily.davis@startuptech.com', '$2a$12$nQWbw0fRMUkfHraA8uBeFe6JXaVAEBysa.YVSsBCedm9LnkoMp0gG', 'customer', true, '2024-02-08 13:15:00+00', '2024-02-08 13:15:00+00'),
('b8c9d0e1-f2a3-4567-bc89-012345abcdef', 'david.brown@retailstore.com', '$2a$12$nQWbw0fRMUkfHraA8uBeFe6JXaVAEBysa.YVSsBCedm9LnkoMp0gG', 'customer', true, '2024-02-10 09:40:00+00', '2024-02-10 09:40:00+00'),
('c9d0e1f2-a3b4-5678-cd90-123456abcdef', 'amanda.garcia@healthcare.com', '$2a$12$nQWbw0fRMUkfHraA8uBeFe6JXaVAEBysa.YVSsBCedm9LnkoMp0gG', 'customer', true, '2024-02-12 15:25:00+00', '2024-02-12 15:25:00+00'),
('d0e1f2a3-b4c5-6789-de01-23456789abcd', 'carlos.martinez@logistics.com', '$2a$12$nQWbw0fRMUkfHraA8uBeFe6JXaVAEBysa.YVSsBCedm9LnkoMp0gG', 'customer', true, '2024-02-14 10:30:00+00', '2024-02-14 10:30:00+00'),
('e1f2a3b4-c5d6-789a-ef12-3456789abcde', 'patricia.lee@education.com', '$2a$12$nQWbw0fRMUkfHraA8uBeFe6JXaVAEBysa.YVSsBCedm9LnkoMp0gG', 'customer', true, '2024-02-16 14:45:00+00', '2024-02-16 14:45:00+00');

-- 2. Insert Products (Comprehensive product catalog)
INSERT INTO products (id, name, description, sku, price, stock_quantity, is_active, category, created_at, updated_at) VALUES
-- Office Equipment & Technology
('550e8400-e29b-41d4-a716-446655440001', 'Professional Laptop Workstation', 'High-performance business laptop with Intel i7 processor, 16GB RAM, 512GB SSD. Perfect for professional computing tasks and development work.', 'LAP-PROF-001', 1299.99, 45, true, 'Office Equipment', '2024-01-20 10:00:00+00', '2024-01-20 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440002', 'Ergonomic Executive Office Chair', 'Premium ergonomic chair with lumbar support, adjustable height, armrests, and breathable mesh backing. Designed for all-day comfort and productivity.', 'CHR-EXEC-002', 449.99, 28, true, 'Office Furniture', '2024-01-20 10:30:00+00', '2024-01-20 10:30:00+00'),
('550e8400-e29b-41d4-a716-446655440003', 'Wireless Business Mouse & Keyboard Set', 'Professional wireless mouse and keyboard combo with extended battery life, precision tracking, and ergonomic design for office use.', 'MOU-WIRE-003', 89.99, 120, true, 'Office Equipment', '2024-01-20 11:00:00+00', '2024-01-20 11:00:00+00'),
('550e8400-e29b-41d4-a716-446655440004', 'LED Desk Lamp with USB Charging', 'Adjustable LED desk lamp with multiple brightness settings, color temperature control, built-in USB charging ports, and modern design.', 'LMP-LED-004', 79.99, 85, true, 'Office Accessories', '2024-01-20 11:30:00+00', '2024-01-20 11:30:00+00'),
('550e8400-e29b-41d4-a716-446655440005', 'Adjustable Monitor Stand with Storage', 'Height-adjustable monitor stand with built-in storage drawer, cable management system, and support for monitors up to 27 inches.', 'STD-MON-005', 129.99, 32, true, 'Office Accessories', '2024-01-20 12:00:00+00', '2024-01-20 12:00:00+00'),
('550e8400-e29b-41d4-a716-446655440006', '27-inch 4K Professional Monitor', 'Ultra-high definition 4K IPS monitor with 99% sRGB color accuracy, USB-C connectivity, and adjustable stand. Ideal for design and development.', 'MON-4K-006', 599.99, 18, true, 'Technology', '2024-01-21 09:00:00+00', '2024-01-21 09:00:00+00'),
('550e8400-e29b-41d4-a716-446655440007', 'Multi-Function Printer Scanner', 'All-in-one printer, scanner, copier with wireless connectivity, automatic document feeder, and mobile printing capabilities.', 'PRT-MFP-007', 329.99, 24, true, 'Office Equipment', '2024-01-21 09:30:00+00', '2024-01-21 09:30:00+00'),
('550e8400-e29b-41d4-a716-446655440008', 'Wireless Presentation System', 'Professional wireless presentation system supporting multiple devices, 4K resolution, and easy setup for conference rooms.', 'PRE-WIRE-008', 449.99, 15, true, 'Technology', '2024-01-21 10:00:00+00', '2024-01-21 10:00:00+00'),

-- Industrial & Manufacturing Equipment
('550e8400-e29b-41d4-a716-446655440009', 'Precision Digital Scale', 'High-precision digital scale for industrial weighing applications with RS-232 connectivity, calibration certificate, and 1000kg capacity.', 'SCL-DIG-009', 329.99, 15, true, 'Industrial Equipment', '2024-01-21 14:00:00+00', '2024-01-21 14:00:00+00'),
('550e8400-e29b-41d4-a716-446655440010', 'Pneumatic Air Compressor', 'Industrial pneumatic air compressor with 50-gallon tank capacity, 175 PSI maximum pressure, suitable for manufacturing operations.', 'CMP-AIR-010', 2199.99, 8, true, 'Industrial Equipment', '2024-01-21 14:30:00+00', '2024-01-21 14:30:00+00'),
('550e8400-e29b-41d4-a716-446655440011', 'Industrial Tablet Computer', 'Rugged tablet computer with IP65 rating, 10-inch display, suitable for harsh industrial environments and field operations.', 'TAB-IND-011', 849.99, 25, true, 'Industrial Equipment', '2024-01-21 15:00:00+00', '2024-01-21 15:00:00+00'),
('550e8400-e29b-41d4-a716-446655440012', 'Barcode Scanner System', 'Professional barcode scanner system with wireless connectivity, long-range scanning, and inventory management software integration.', 'BAR-SCAN-012', 189.99, 40, true, 'Industrial Equipment', '2024-01-21 15:30:00+00', '2024-01-21 15:30:00+00'),

-- Healthcare & Medical Equipment
('550e8400-e29b-41d4-a716-446655440013', 'Medical Grade UV Sanitizer', 'Professional UV-C sanitization device for medical equipment and surfaces with safety certifications and automatic shut-off.', 'UV-MED-013', 399.99, 22, true, 'Healthcare', '2024-01-22 08:00:00+00', '2024-01-22 08:00:00+00'),
('550e8400-e29b-41d4-a716-446655440014', 'Digital Blood Pressure Monitor', 'Professional-grade automated blood pressure monitor with data logging, connectivity features, and clinical accuracy certification.', 'BP-DIG-014', 189.99, 35, true, 'Healthcare', '2024-01-22 08:30:00+00', '2024-01-22 08:30:00+00'),
('550e8400-e29b-41d4-a716-446655440015', 'Medical Equipment Cart', 'Mobile medical equipment cart with adjustable shelves, locking wheels, and power outlets for healthcare facilities.', 'CART-MED-015', 299.99, 18, true, 'Healthcare', '2024-01-22 09:00:00+00', '2024-01-22 09:00:00+00'),

-- Construction & Tools
('550e8400-e29b-41d4-a716-446655440016', 'Professional Power Drill Set', 'Complete cordless power drill set with multiple bits, two batteries, fast charger, and heavy-duty carrying case.', 'DRL-PWR-016', 249.99, 40, true, 'Construction Tools', '2024-01-22 13:00:00+00', '2024-01-22 13:00:00+00'),
('550e8400-e29b-41d4-a716-446655440017', 'Laser Level Measuring Tool', 'Self-leveling laser level with tripod mount, 100ft range, and green laser technology for construction and installation projects.', 'LVL-LSR-017', 179.99, 18, true, 'Construction Tools', '2024-01-22 13:30:00+00', '2024-01-22 13:30:00+00'),
('550e8400-e29b-41d4-a716-446655440018', 'Safety Equipment Package', 'Complete safety equipment package including hard hats, safety glasses, gloves, and high-visibility vests for construction sites.', 'SAF-PKG-018', 129.99, 50, true, 'Construction Tools', '2024-01-22 14:00:00+00', '2024-01-22 14:00:00+00'),

-- Networking & Security
('550e8400-e29b-41d4-a716-446655440019', 'Network Security Firewall', 'Enterprise-grade firewall with advanced threat protection, VPN capabilities, and centralized management for small to medium businesses.', 'FW-SEC-019', 1899.99, 12, true, 'Technology', '2024-01-23 09:00:00+00', '2024-01-23 09:00:00+00'),
('550e8400-e29b-41d4-a716-446655440020', 'Wireless Access Point', 'High-performance wireless access point with WiFi 6 support, PoE+ power, and enterprise-grade security features.', 'WAP-WIFI-020', 199.99, 30, true, 'Technology', '2024-01-23 09:30:00+00', '2024-01-23 09:30:00+00'),
('550e8400-e29b-41d4-a716-446655440021', 'Network Switch 24-Port', '24-port managed Gigabit Ethernet switch with PoE+ support, VLAN capabilities, and web-based management interface.', 'SW-24P-021', 449.99, 20, true, 'Technology', '2024-01-23 10:00:00+00', '2024-01-23 10:00:00+00'),

-- Educational & Training Equipment
('550e8400-e29b-41d4-a716-446655440022', 'Interactive Whiteboard System', 'Large interactive whiteboard with touch capability, projector integration, and educational software for classrooms and training rooms.', 'WB-INT-022', 1299.99, 10, true, 'Education', '2024-01-23 14:00:00+00', '2024-01-23 14:00:00+00'),
('550e8400-e29b-41d4-a716-446655440023', 'Document Camera', 'High-resolution document camera with zoom capability, LED lighting, and USB connectivity for presentations and training.', 'CAM-DOC-023', 199.99, 25, true, 'Education', '2024-01-23 14:30:00+00', '2024-01-23 14:30:00+00'),
('550e8400-e29b-41d4-a716-446655440024', 'Audio System for Classrooms', 'Complete audio system with wireless microphones, speakers, and amplifier designed for educational environments.', 'AUD-CLS-024', 599.99, 15, true, 'Education', '2024-01-23 15:00:00+00', '2024-01-23 15:00:00+00'),

-- Storage & Organization
('550e8400-e29b-41d4-a716-446655440025', 'Mobile Storage Cabinet', 'Secure mobile storage cabinet with multiple compartments, locking mechanism, and heavy-duty casters for office organization.', 'CAB-MOB-025', 299.99, 20, true, 'Office Furniture', '2024-01-24 10:00:00+00', '2024-01-24 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440026', 'Server Rack Cabinet', '42U server rack cabinet with ventilation, cable management, and locking front and rear doors for data center equipment.', 'RACK-SVR-026', 799.99, 8, true, 'Technology', '2024-01-24 10:30:00+00', '2024-01-24 10:30:00+00');

-- Display summary of inserted data
SELECT 
    'Total Users' as description, 
    COUNT(*) as count
FROM users
UNION ALL
SELECT 
    'Sales Users' as description, 
    COUNT(*) as count
FROM users WHERE role = 'sales'
UNION ALL
SELECT 
    'Customer Users' as description, 
    COUNT(*) as count
FROM users WHERE role = 'customer'
UNION ALL
SELECT 
    'Total Products' as description, 
    COUNT(*) as count
FROM products
UNION ALL
SELECT 
    'Active Products' as description, 
    COUNT(*) as count
FROM products WHERE is_active = true
UNION ALL
SELECT 
    'Product Categories' as description, 
    COUNT(DISTINCT category) as count
FROM products WHERE category IS NOT NULL;

-- Show product categories and counts
SELECT 
    category,
    COUNT(*) as product_count,
    ROUND(AVG(price), 2) as avg_price,
    MIN(price) as min_price,
    MAX(price) as max_price
FROM products 
WHERE category IS NOT NULL
GROUP BY category
ORDER BY product_count DESC;