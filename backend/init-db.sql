-- Database initialization script
-- This script will be run when the PostgreSQL container starts for the first time

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Insert sample products for testing
INSERT INTO products (id, name, description, sku, price, stock_quantity, category, is_active, created_at, updated_at)
VALUES 
    (uuid_generate_v4(), 'Laptop Computer', 'High-performance business laptop', 'LAP001', 999.99, 50, 'Electronics', true, NOW(), NOW()),
    (uuid_generate_v4(), 'Office Chair', 'Ergonomic office chair with lumbar support', 'CHR001', 299.99, 25, 'Furniture', true, NOW(), NOW()),
    (uuid_generate_v4(), 'Wireless Mouse', 'Bluetooth wireless mouse', 'MOU001', 49.99, 100, 'Electronics', true, NOW(), NOW()),
    (uuid_generate_v4(), 'Desk Lamp', 'LED desk lamp with adjustable brightness', 'LMP001', 79.99, 75, 'Office Supplies', true, NOW(), NOW()),
    (uuid_generate_v4(), 'Monitor Stand', 'Adjustable monitor stand with storage', 'STD001', 89.99, 30, 'Electronics', true, NOW(), NOW());

-- Insert sample users for testing
-- Password for both users: "password123"
INSERT INTO users (id, email, password_hash, role, first_name, last_name, is_active, created_at, updated_at)
VALUES 
    (uuid_generate_v4(), 'admin@example.com', '$2a$12$nQWbw0fRMUkfHraA8uBeFe6JXaVAEBysa.YVSsBCedm9LnkoMp0gG', 'sales', 'Admin', 'User', true, NOW(), NOW()),
    (uuid_generate_v4(), 'customer@example.com', '$2a$12$nQWbw0fRMUkfHraA8uBeFe6JXaVAEBysa.YVSsBCedm9LnkoMp0gG', 'customer', 'John', 'Doe', true, NOW(), NOW());

-- Note: The password hash above is for "password123" - change this in production!