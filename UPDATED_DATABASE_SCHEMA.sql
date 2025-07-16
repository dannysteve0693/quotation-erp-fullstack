-- PostgreSQL Database Schema for ERP Quotation Module
-- Updated to include quotation_number field that the backend model expects

-- 1. Create ENUM types first, as they are used by tables

-- Enum for user roles
CREATE TYPE user_role AS ENUM ('customer', 'sales');

-- Enum for quotation status
CREATE TYPE quotation_status AS ENUM ('pending', 'approved', 'rejected', 'converted_to_order');

-- Enum for audit event types
CREATE TYPE audit_event_type AS ENUM ('created', 'status_change', 'approved', 'rejected', 'converted_to_order');

-- 2. Create Tables

-- User Table
-- Stores user authentication details and roles.
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Product Table
-- Stores details of products available for quotation.
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Customer Table (Optional: if distinct customer profiles are needed beyond user authentication)
-- Links to the users table and stores additional customer-specific details.
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE, -- Links to the user who is this customer
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    phone_number VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Quotation Table
-- Represents a customer's request for a quote.
CREATE TABLE quotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quotation_number VARCHAR(255) UNIQUE NOT NULL, -- Added this field required by backend model
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- The user (customer role) who created this quote
    status quotation_status DEFAULT 'pending' NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
    created_by UUID REFERENCES users(id), -- User who initiated the quotation (could be customer or sales on their behalf)
    approved_by UUID REFERENCES users(id), -- Sales user who approved/rejected it
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP WITH TIME ZONE -- Timestamp when the quotation was approved
);

-- Quotation Item Table
-- Details individual products and quantities within a quotation.
CREATE TABLE quotation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quotation_id UUID NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT, -- Prevent deleting a product if it's in a quote
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
    sub_total DECIMAL(10, 2) NOT NULL CHECK (sub_total >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sales Order Table
-- Automatically generated from an approved quotation.
CREATE TABLE sales_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quotation_id UUID UNIQUE NOT NULL REFERENCES quotations(id) ON DELETE CASCADE, -- One-to-one relationship with the source quotation
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- The customer for whom the order was placed
    order_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
    created_by UUID REFERENCES users(id), -- User who approved the quotation that led to this order
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sales Order Item Table
-- Details individual products and quantities within a sales order.
CREATE TABLE sales_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sales_order_id UUID NOT NULL REFERENCES sales_orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT, -- Prevent deleting a product if it's in a sales order
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
    sub_total DECIMAL(10, 2) NOT NULL CHECK (sub_total >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Quotation Audit Trail Table
-- Tracks status changes and other significant events for a quotation.
CREATE TABLE quotation_audit_trail (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quotation_id UUID NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
    event_type audit_event_type NOT NULL,
    old_status quotation_status, -- Previous status before the change
    new_status quotation_status, -- New status after the change
    changed_by UUID REFERENCES users(id), -- User who made the change
    change_reason TEXT, -- Optional reason for the change
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Indexes (Optional but Recommended for Performance)
-- These indexes can improve query performance on frequently accessed columns.

CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_quotations_customer_id ON quotations (customer_id);
CREATE INDEX idx_quotations_status ON quotations (status);
CREATE INDEX idx_quotations_quotation_number ON quotations (quotation_number); -- Added index for quotation_number
CREATE INDEX idx_quotation_items_quotation_id ON quotation_items (quotation_id);
CREATE INDEX idx_sales_orders_quotation_id ON sales_orders (quotation_id);
CREATE INDEX idx_sales_orders_customer_id ON sales_orders (customer_id);
CREATE INDEX idx_quotation_audit_trail_quotation_id ON quotation_audit_trail (quotation_id);