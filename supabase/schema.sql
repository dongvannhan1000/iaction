-- IAction Database Schema for Supabase
-- Run this SQL in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================
-- ORDERS TABLE
-- =====================================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_code VARCHAR(20) UNIQUE NOT NULL,
    product_id VARCHAR(100) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    amount BIGINT NOT NULL CHECK (amount >= 0), -- Amount in VND
    customer_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255),
    customer_phone VARCHAR(20),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled', 'refunded')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX idx_orders_order_code ON orders(order_code);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- =====================================
-- PAYMENTS TABLE
-- =====================================
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    sepay_transaction_id VARCHAR(100) UNIQUE,
    payment_method VARCHAR(20) CHECK (payment_method IN ('vietqr', 'bank_transfer', 'card')),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
    webhook_received_at TIMESTAMPTZ,
    raw_webhook JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_sepay_transaction_id ON payments(sepay_transaction_id);
CREATE INDEX idx_payments_status ON payments(status);

-- =====================================
-- UPDATED_AT TRIGGER
-- =====================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything
CREATE POLICY "Service role has full access to orders"
    ON orders FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to payments"
    ON payments FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- Policy: Anonymous can only insert orders (for checkout)
CREATE POLICY "Anyone can create orders"
    ON orders FOR INSERT
    WITH CHECK (true);

-- Policy: Anonymous can read their own orders by email (optional)
-- CREATE POLICY "Customers can view own orders"
--     ON orders FOR SELECT
--     USING (customer_email = current_setting('request.jwt.claims')::json->>'email');

-- =====================================
-- HELPER FUNCTIONS
-- =====================================

-- Generate unique order code (IA + timestamp + random)
CREATE OR REPLACE FUNCTION generate_order_code()
RETURNS VARCHAR(20) AS $$
DECLARE
    new_code VARCHAR(20);
BEGIN
    new_code := 'IA' || to_char(NOW(), 'YYMMDD') || substr(md5(random()::text), 1, 6);
    RETURN UPPER(new_code);
END;
$$ LANGUAGE plpgsql;
