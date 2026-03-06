-- Vendor Module Database Schema
-- BRAVECOM Sunray Ecosystem - Task 6: Vendor Management System

-- ============================================================================
-- VENDORS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(50),
    description TEXT,
    gst_number VARCHAR(20),
    status VARCHAR(20) DEFAULT 'PENDING',
    tier VARCHAR(20) DEFAULT 'BRONZE',
    commission_rate DECIMAL(5,2) DEFAULT 25.00,
    monthly_sales DECIMAL(15,2) DEFAULT 0,
    total_sales DECIMAL(15,2) DEFAULT 0,
    approved_at TIMESTAMP,
    approved_by UUID REFERENCES users(id),
    bank_account_number VARCHAR(50),
    bank_name VARCHAR(100),
    bank_branch VARCHAR(100),
    ifsc_code VARCHAR(20),
    kyc_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for vendor lookups
CREATE INDEX IF NOT EXISTS idx_vendors_user_id ON vendors(user_id);
CREATE INDEX IF NOT EXISTS idx_vendors_status ON vendors(status);
CREATE INDEX IF NOT EXISTS idx_vendors_tier ON vendors(tier);

-- ============================================================================
-- VENDOR PRODUCTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS vendor_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID REFERENCES vendors(id) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    tags TEXT[],
    mrp DECIMAL(10,2) NOT NULL,
    selling_price DECIMAL(10,2) NOT NULL,
    commission DECIMAL(5,2) DEFAULT 0,
    inventory INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    images TEXT[],
    roi_percentage DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for product lookups
CREATE INDEX IF NOT EXISTS idx_vendor_products_vendor_id ON vendor_products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_products_category ON vendor_products(category);
CREATE INDEX IF NOT EXISTS idx_vendor_products_status ON vendor_products(status);

-- ============================================================================
-- VENDOR ORDERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS vendor_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    vendor_id UUID REFERENCES vendors(id) NOT NULL,
    buyer_id UUID REFERENCES users(id) NOT NULL,
    product_id UUID REFERENCES vendor_products(id) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    commission_amount DECIMAL(10,2) DEFAULT 0,
    vendor_payout DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'PENDING',
    payment_status VARCHAR(20) DEFAULT 'PENDING',
    fulfillment_status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for order lookups
CREATE INDEX IF NOT EXISTS idx_vendor_orders_vendor_id ON vendor_orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_orders_buyer_id ON vendor_orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_vendor_orders_order_number ON vendor_orders(order_number);
CREATE INDEX IF NOT EXISTS idx_vendor_orders_status ON vendor_orders(status);

-- ============================================================================
-- VENDOR SETTLEMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS vendor_settlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID REFERENCES vendors(id) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_sales DECIMAL(15,2) NOT NULL,
    commission DECIMAL(15,2) NOT NULL,
    amount_payable DECIMAL(15,2) NOT NULL,
    amount_paid DECIMAL(15,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'PENDING',
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Index for settlement lookups
CREATE INDEX IF NOT EXISTS idx_vendor_settlements_vendor_id ON vendor_settlements(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_settlements_status ON vendor_settlements(status);
CREATE INDEX IF NOT EXISTS idx_vendor_settlements_period ON vendor_settlements(period_start, period_end);

-- ============================================================================
-- VENDOR KYC DOCUMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS vendor_kyc_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID REFERENCES vendors(id) NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    document_url TEXT NOT NULL,
    document_number VARCHAR(100),
    verification_status VARCHAR(20) DEFAULT 'PENDING',
    verified_at TIMESTAMP,
    verified_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vendor_kyc_documents_vendor_id ON vendor_kyc_documents(vendor_id);

-- ============================================================================
-- VENDOR BANK ACCOUNTS TABLE (for settlement tracking)
-- ============================================================================
CREATE TABLE IF NOT EXISTS vendor_bank_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID REFERENCES vendors(id) NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    account_holder_name VARCHAR(255) NOT NULL,
    bank_name VARCHAR(100) NOT NULL,
    branch_name VARCHAR(100),
    ifsc_code VARCHAR(20) NOT NULL,
    is_primary BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vendor_bank_accounts_vendor_id ON vendor_bank_accounts(vendor_id);

-- ============================================================================
-- AUDIT LOG FOR VENDOR OPERATIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS vendor_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID REFERENCES vendors(id),
    action VARCHAR(50) NOT NULL,
    details JSONB,
    performed_by UUID REFERENCES users(id),
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vendor_audit_logs_vendor_id ON vendor_audit_logs(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_audit_logs_created_at ON vendor_audit_logs(created_at);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to auto-upgrade vendor tier based on monthly sales
CREATE OR REPLACE FUNCTION update_vendor_tier()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.monthly_sales != OLD.monthly_sales THEN
        IF NEW.monthly_sales >= 1000000 THEN
            NEW.tier := 'DIAMOND';
            NEW.commission_rate := 40.00;
        ELSIF NEW.monthly_sales >= 500000 THEN
            NEW.tier := 'PLATINUM';
            NEW.commission_rate := 35.00;
        ELSIF NEW.monthly_sales >= 100000 THEN
            NEW.tier := 'GOLD';
            NEW.commission_rate := 30.00;
        ELSIF NEW.monthly_sales >= 50000 THEN
            NEW.tier := 'SILVER';
            NEW.commission_rate := 27.00;
        ELSE
            NEW.tier := 'BRONZE';
            NEW.commission_rate := 25.00;
        END IF;
    END IF;
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto tier upgrade
DROP TRIGGER IF EXISTS trigger_update_vendor_tier ON vendors;
CREATE TRIGGER trigger_update_vendor_tier
    BEFORE UPDATE ON vendors
    FOR EACH ROW
    EXECUTE FUNCTION update_vendor_tier();

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_vendor_order_number()
RETURNS TRIGGER AS $$
DECLARE
    order_prefix VARCHAR(10);
    sequence_num BIGINT;
BEGIN
    order_prefix := TO_CHAR(NOW(), 'YYYYMMDD');
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 10 FOR 8) AS BIGINT)), 0) + 1
    INTO sequence_num
    FROM vendor_orders
    WHERE order_number LIKE 'ORD-' || order_prefix || '-%';
    
    NEW.order_number := 'ORD-' || order_prefix || '-' || LPAD(sequence_num::TEXT, 8, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for order number generation
DROP TRIGGER IF EXISTS trigger_generate_order_number ON vendor_orders;
CREATE TRIGGER trigger_generate_order_number
    BEFORE INSERT ON vendor_orders
    FOR EACH ROW
    WHEN (NEW.order_number IS NULL)
    EXECUTE FUNCTION generate_vendor_order_number();

-- Function to calculate order amounts
CREATE OR REPLACE FUNCTION calculate_order_amounts()
RETURNS TRIGGER AS $$
DECLARE
    vendor_commission_rate DECIMAL(5,2);
BEGIN
    SELECT commission_rate INTO vendor_commission_rate
    FROM vendors WHERE id = NEW.vendor_id;
    
    IF vendor_commission_rate IS NULL THEN
        vendor_commission_rate := 25.00;
    END IF;
    
    NEW.total_amount := NEW.quantity * NEW.unit_price;
    NEW.commission_amount := ROUND(NEW.total_amount * vendor_commission_rate / 100, 2);
    NEW.vendor_payout := NEW.total_amount - NEW.commission_amount;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for order amount calculation
DROP TRIGGER IF EXISTS trigger_calculate_order_amounts ON vendor_orders;
CREATE TRIGGER trigger_calculate_order_amounts
    BEFORE INSERT OR UPDATE ON vendor_orders
    FOR EACH ROW
    EXECUTE FUNCTION calculate_order_amounts();

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on vendor tables
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_settlements ENABLE ROW LEVEL SECURITY;

-- Vendors can only see their own data
CREATE POLICY "Vendors can view own profile" ON vendors
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Vendors can update own profile" ON vendors
    FOR UPDATE USING (user_id = auth.uid());

-- Products: vendors can manage their own products
CREATE POLICY "Vendors can view own products" ON vendor_products
    FOR SELECT USING (
        vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
    );

CREATE POLICY "Vendors can insert own products" ON vendor_products
    FOR INSERT WITH CHECK (
        vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
    );

CREATE POLICY "Vendors can update own products" ON vendor_products
    FOR UPDATE USING (
        vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
    );

CREATE POLICY "Vendors can delete own products" ON vendor_products
    FOR DELETE USING (
        vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
    );

-- Orders: vendors can view their own orders
CREATE POLICY "Vendors can view own orders" ON vendor_orders
    FOR SELECT USING (
        vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
    );

-- Settlements: vendors can view their own settlements
CREATE POLICY "Vendors can view own settlements" ON vendor_settlements
    FOR SELECT USING (
        vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
    );

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE vendors IS 'Vendor profiles with business details and tier information';
COMMENT ON TABLE vendor_products IS 'Products listed by vendors in the marketplace';
COMMENT ON TABLE vendor_orders IS 'Orders placed by buyers for vendor products';
COMMENT ON TABLE vendor_settlements IS 'Monthly settlement records for vendor payouts';
COMMENT ON TABLE vendor_kyc_documents IS 'KYC documents submitted by vendors for verification';
COMMENT ON TABLE vendor_bank_accounts IS 'Bank account details for vendor settlements';
COMMENT ON TABLE vendor_audit_logs IS 'Audit trail for vendor-related operations';

COMMENT ON COLUMN vendors.status IS 'Status: PENDING, APPROVED, REJECTED, SUSPENDED';
COMMENT ON COLUMN vendors.tier IS 'Tier: BRONZE, SILVER, GOLD, PLATINUM, DIAMOND';
COMMENT ON COLUMN vendors.commission_rate IS 'Commission rate percentage based on tier';
