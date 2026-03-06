-- ============================================================================
-- COMPREHENSIVE SUNRAY ECOSYSTEM DATABASE SCHEMA
-- BRAVECOM Investment Platform - Supabase PostgreSQL
-- Migration: 001_full_schema.sql
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- ENUM TYPES
-- ============================================================================

-- User Role Hierarchy (10-level)
CREATE TYPE user_role_level AS ENUM (
    'GUEST',      -- Level 1: Unauthenticated visitors
    'REGISTERED', -- Level 2: Basic registered user
    'INVESTOR',   -- Level 3: Active investor
    'VENDOR',     -- Level 4: Vendor account
    'FINANCE',    -- Level 5: Finance team
    'COMPLIANCE', -- Level 6: Compliance officer
    'ADMIN',      -- Level 7: System admin
    'SUPER_ADMIN',-- Level 8: Super admin
    'SYSTEM',     -- Level 9: System account
    'ROOT'        -- Level 10: Root access
);

-- KYC Status
CREATE TYPE kyc_status_type AS ENUM (
    'PENDING',
    'SUBMITTED',
    'VERIFIED',
    'REJECTED',
    'EXPIRED'
);

-- ID Color Status
CREATE TYPE id_color_status AS ENUM (
    'GREEN',
    'ORANGE',
    'RED'
);

-- Investment Status
CREATE TYPE investment_status AS ENUM (
    'ACTIVE',
    'COMPLETED',
    'WITHDRAWN',
    'CANCELLED',
    'DEFAULTED'
);

-- Investment Tier
CREATE TYPE investment_tier_type AS ENUM (
    'LEVEL_A',
    'LEVEL_L1',
    'LEVEL_L2',
    'LEVEL_L3',
    'LEVEL_L4',
    'LEVEL_L5',
    'LEVEL_L6'
);

-- Vendor Status
CREATE TYPE vendor_status AS ENUM (
    'PENDING',
    'ACTIVE',
    'SUSPENDED',
    'TERMINATED'
);

-- Product Listing Decision
CREATE TYPE listing_decision AS ENUM (
    'AUTO_LIST',
    'MANUAL_REVIEW',
    'POSTPONE',
    'REJECT'
);

-- Commission Status
CREATE TYPE commission_status AS ENUM (
    'PENDING',
    'APPROVED',
    'PROCESSED',
    'REJECTED',
    'CANCELLED'
);

-- Payout Status
CREATE TYPE payout_status AS ENUM (
    'PENDING',
    'APPROVED',
    'PROCESSED',
    'REJECTED',
    'FAILED'
);

-- Webhook Status
CREATE TYPE webhook_status AS ENUM (
    'PENDING',
    'PROCESSED',
    'FAILED',
    'RETRYING'
);

-- Verification Status
CREATE TYPE verification_status AS ENUM (
    'PENDING',
    'VERIFIED',
    'REJECTED'
);

-- Rank Change Type
CREATE TYPE rank_change_type AS ENUM (
    'PROMOTION',
    'DEMOTION',
    'AUTO',
    'MANUAL'
);

-- ============================================================================
-- TABLE: users (Extended from user_profiles)
-- ============================================================================

-- Add extended columns to existing user_profiles table
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS role_level user_role_level DEFAULT 'REGISTERED';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS username VARCHAR(100) UNIQUE;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS rank VARCHAR(50) DEFAULT 'BRONZE';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS id_color id_color_status DEFAULT 'ORANGE';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS referral_code VARCHAR(20) UNIQUE;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS referrer_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS place VARCHAR(255);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS wallet_balance NUMERIC(20, 2) DEFAULT 0.00;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS aadhaar_hash VARCHAR(255);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS pan_hash VARCHAR(255);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS bank_account_encrypted TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS ifsc_encrypted TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS is_mobile_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS is_email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS kyc_status kyc_status_type DEFAULT 'PENDING';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS total_volume NUMERIC(20, 2) DEFAULT 0;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS upline_1 UUID REFERENCES user_profiles(id) ON DELETE SET NULL;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS upline_2 UUID REFERENCES user_profiles(id) ON DELETE SET NULL;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS upline_3 UUID REFERENCES user_profiles(id) ON DELETE SET NULL;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS upline_4 UUID REFERENCES user_profiles(id) ON DELETE SET NULL;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS upline_5 UUID REFERENCES user_profiles(id) ON DELETE SET NULL;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS upline_6 UUID REFERENCES user_profiles(id) ON DELETE SET NULL;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ============================================================================
-- TABLE: investments
-- ============================================================================

CREATE TABLE IF NOT EXISTS investments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    amount NUMERIC(20, 2) NOT NULL,
    investment_tier investment_tier_type NOT NULL DEFAULT 'LEVEL_L1',
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status investment_status DEFAULT 'ACTIVE',
    agreement_end_date DATE,
    monthly_profit_rate NUMERIC(5, 4) DEFAULT 0.15,
    monthly_profit NUMERIC(20, 2) DEFAULT 0,
    total_profit_earned NUMERIC(20, 2) DEFAULT 0,
    payout_schedule VARCHAR(20) DEFAULT 'MONTHLY',
    payment_method VARCHAR(50),
    transaction_id VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: vendors
-- ============================================================================

CREATE TABLE IF NOT EXISTS vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(100),
    business_address TEXT,
    gst_number VARCHAR(50),
    revenue_share_percentage NUMERIC(5, 4) DEFAULT 0.10,
    status vendor_status DEFAULT 'PENDING',
    product_count INTEGER DEFAULT 0,
    total_sales NUMERIC(20, 2) DEFAULT 0,
    activation_date TIMESTAMPTZ,
    approved_by UUID REFERENCES user_profiles(id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- ============================================================================
-- TABLE: vendor_products
-- ============================================================================

CREATE TABLE IF NOT EXISTS vendor_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(12, 2) NOT NULL,
    category VARCHAR(100),
    sub_category VARCHAR(100),
    stock INTEGER DEFAULT 0,
    sku VARCHAR(100) UNIQUE,
    images JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT TRUE,
    google_trends_score NUMERIC(5, 2),
    listing_decision listing_decision DEFAULT 'MANUAL_REVIEW',
    listed_at TIMESTAMPTZ,
    postponed_until TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: vendor_orders
-- ============================================================================

CREATE TABLE IF NOT EXISTS vendor_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES vendor_products(id) ON DELETE RESTRICT,
    buyer_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12, 2) NOT NULL,
    total_amount NUMERIC(20, 2) NOT NULL,
    tax_amount NUMERIC(12, 2) DEFAULT 0,
    shipping_cost NUMERIC(12, 2) DEFAULT 0,
    status VARCHAR(30) DEFAULT 'PENDING',
    shipping_address JSONB,
    tracking_number VARCHAR(100),
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: commission_accumulation_ledger
-- ============================================================================

CREATE TABLE IF NOT EXISTS commission_accumulation_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    source_investment_id UUID REFERENCES investments(id) ON DELETE SET NULL,
    beneficiary_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    level INTEGER NOT NULL CHECK (level >= 1 AND level <= 6),
    percentage NUMERIC(5, 4) NOT NULL,
    gross_amount NUMERIC(20, 2) NOT NULL,
    admin_charge NUMERIC(20, 2) DEFAULT 0,
    net_amount NUMERIC(20, 2) NOT NULL,
    status commission_status DEFAULT 'PENDING',
    calculation_period VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: daily_payout_accumulation
-- ============================================================================

CREATE TABLE IF NOT EXISTS daily_payout_accumulation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_commission NUMERIC(20, 2) DEFAULT 0,
    total_payout NUMERIC(20, 2) DEFAULT 0,
    investment_returns NUMERIC(20, 2) DEFAULT 0,
    vendor_earnings NUMERIC(20, 2) DEFAULT 0,
    processed_at TIMESTAMPTZ,
    UNIQUE(user_id, date)
);

-- ============================================================================
-- TABLE: payouts
-- ============================================================================

CREATE TABLE IF NOT EXISTS payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    amount NUMERIC(20, 2) NOT NULL,
    payment_method VARCHAR(50),
    bank_name VARCHAR(100),
    account_number VARCHAR(50),
    ifsc_code VARCHAR(20),
    upi_id VARCHAR(100),
    status payout_status DEFAULT 'PENDING',
    utr_number VARCHAR(100),
    rejection_reason TEXT,
    approved_by UUID REFERENCES user_profiles(id),
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: user_business_volume
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_business_volume (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    direct_business NUMERIC(20, 2) DEFAULT 0,
    level2_business NUMERIC(20, 2) DEFAULT 0,
    level3_business NUMERIC(20, 2) DEFAULT 0,
    level4_business NUMERIC(20, 2) DEFAULT 0,
    level5_business NUMERIC(20, 2) DEFAULT 0,
    level6_business NUMERIC(20, 2) DEFAULT 0,
    total_business NUMERIC(20, 2) DEFAULT 0,
    current_rank VARCHAR(50) DEFAULT 'BRONZE',
    next_rank VARCHAR(50),
    business_needed_for_next NUMERIC(20, 2),
    calculated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- ============================================================================
-- TABLE: rank_change_history
-- ============================================================================

CREATE TABLE IF NOT EXISTS rank_change_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    previous_rank VARCHAR(50),
    new_rank VARCHAR(50) NOT NULL,
    change_type rank_change_type NOT NULL,
    business_volume NUMERIC(20, 2),
    triggered_by UUID REFERENCES user_profiles(id),
    reason TEXT,
    changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: webhook_event_queue
-- ============================================================================

CREATE TABLE IF NOT EXISTS webhook_event_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    webhook_url TEXT,
    status webhook_status DEFAULT 'PENDING',
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    last_retry_at TIMESTAMPTZ,
    processed_at TIMESTAMPTZ,
    error_message TEXT,
    response_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: google_trends_tracking
-- ============================================================================

CREATE TABLE IF NOT EXISTS google_trends_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    keyword VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    trend_score NUMERIC(5, 2),
    search_volume INTEGER,
    growth_rate NUMERIC(10, 4),
    related_queries JSONB DEFAULT '[]',
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_trends_keyword_time ON google_trends_tracking(keyword, recorded_at DESC);

-- ============================================================================
-- TABLE: product_listing_strategy
-- ============================================================================

CREATE TABLE IF NOT EXISTS product_listing_strategy (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    min_score NUMERIC(5, 2) NOT NULL,
    max_score NUMERIC(5, 2) NOT NULL,
    decision listing_decision NOT NULL,
    postpone_days INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default listing strategies
INSERT INTO product_listing_strategy (min_score, max_score, decision, postpone_days) VALUES
    (80, 100, 'AUTO_LIST', 0),
    (50, 79.99, 'MANUAL_REVIEW', 0),
    (30, 49.99, 'POSTPONE', 7),
    (0, 29.99, 'REJECT', 0)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- TABLE: kyc_documents
-- ============================================================================

CREATE TABLE IF NOT EXISTS kyc_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL,
    document_number VARCHAR(100),
    file_url TEXT NOT NULL,
    file_name VARCHAR(255),
    file_size INTEGER,
    mime_type VARCHAR(100),
    verification_status verification_status DEFAULT 'PENDING',
    verified_by UUID REFERENCES user_profiles(id),
    rejection_reason TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    verified_at TIMESTAMPTZ
);

-- ============================================================================
-- TABLE: audit_logs
-- ============================================================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- User profiles indexes
CREATE INDEX idx_users_referral_code ON user_profiles(referral_code);
CREATE INDEX idx_users_referrer_id ON user_profiles(referrer_id);
CREATE INDEX idx_users_role_level ON user_profiles(role_level);
CREATE INDEX idx_users_kyc_status ON user_profiles(kyc_status);
CREATE INDEX idx_users_id_color ON user_profiles(id_color);

-- Investments indexes
CREATE INDEX idx_investments_user_id ON investments(user_id);
CREATE INDEX idx_investments_status ON investments(status);
CREATE INDEX idx_investments_tier ON investments(investment_tier);
CREATE INDEX idx_investments_start_date ON investments(start_date);

-- Vendors indexes
CREATE INDEX idx_vendors_user_id ON vendors(user_id);
CREATE INDEX idx_vendors_status ON vendors(status);

-- Vendor products indexes
CREATE INDEX idx_vendor_products_vendor_id ON vendor_products(vendor_id);
CREATE INDEX idx_vendor_products_category ON vendor_products(category);
CREATE INDEX idx_vendor_products_is_active ON vendor_products(is_active);
CREATE INDEX idx_vendor_products_listing_decision ON vendor_products(listing_decision);

-- Vendor orders indexes
CREATE INDEX idx_vendor_orders_product_id ON vendor_orders(product_id);
CREATE INDEX idx_vendor_orders_buyer_id ON vendor_orders(buyer_id);
CREATE INDEX idx_vendor_orders_vendor_id ON vendor_orders(vendor_id);
CREATE INDEX idx_vendor_orders_status ON vendor_orders(status);
CREATE INDEX idx_vendor_orders_created_at ON vendor_orders(created_at DESC);

-- Commission ledger indexes
CREATE INDEX idx_commission_user_id ON commission_accumulation_ledger(user_id);
CREATE INDEX idx_commission_source_investment ON commission_accumulation_ledger(source_investment_id);
CREATE INDEX idx_commission_status ON commission_accumulation_ledger(status);
CREATE INDEX idx_commission_created_at ON commission_accumulation_ledger(created_at DESC);

-- Daily payout indexes
CREATE INDEX idx_daily_payout_user_date ON daily_payout_accumulation(user_id, date);

-- Payouts indexes
CREATE INDEX idx_payouts_user_id ON payouts(user_id);
CREATE INDEX idx_payouts_status ON payouts(status);
CREATE INDEX idx_payouts_created_at ON payouts(created_at DESC);

-- Business volume indexes
CREATE INDEX idx_business_volume_user_id ON user_business_volume(user_id);
CREATE INDEX idx_business_volume_rank ON user_business_volume(current_rank);

-- Rank change history indexes
CREATE INDEX idx_rank_change_user_id ON rank_change_history(user_id);
CREATE INDEX idx_rank_change_changed_at ON rank_change_history(changed_at DESC);

-- Webhook queue indexes
CREATE INDEX idx_webhook_status ON webhook_event_queue(status);
CREATE INDEX idx_webhook_created_at ON webhook_event_queue(created_at);

-- KYC documents indexes
CREATE INDEX idx_kyc_user_id ON kyc_documents(user_id);
CREATE INDEX idx_kyc_status ON kyc_documents(verification_status);

-- Audit logs indexes
CREATE INDEX idx_audit_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_action ON audit_logs(action);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_accumulation_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_payout_accumulation ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_business_volume ENABLE ROW LEVEL SECURITY;
ALTER TABLE rank_change_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_event_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE google_trends_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_listing_strategy ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to get user role level
CREATE OR REPLACE FUNCTION get_user_role_level(user_uuid UUID)
RETURNS user_role_level AS $$
DECLARE
    role_lvl user_role_level;
BEGIN
    SELECT role_level INTO role_lvl 
    FROM user_profiles 
    WHERE id = user_uuid;
    RETURN COALESCE(role_lvl, 'GUEST'::user_role_level);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user has minimum role level
CREATE OR REPLACE FUNCTION has_minimum_role(user_uuid UUID, required_level user_role_level)
RETURNS BOOLEAN AS $$
DECLARE
    current_level user_role_level;
    level_values INTEGER[];
BEGIN
    level_values := ARRAY[
        'GUEST'::user_role_level,
        'REGISTERED'::user_role_level,
        'INVESTOR'::user_role_level,
        'VENDOR'::user_role_level,
        'FINANCE'::user_role_level,
        'COMPLIANCE'::user_role_level,
        'ADMIN'::user_role_level,
        'SUPER_ADMIN'::user_role_level,
        'SYSTEM'::user_role_level,
        'ROOT'::user_role_level
    ];
    
    SELECT role_level INTO current_level
    FROM user_profiles
    WHERE id = user_uuid;
    
    IF current_level IS NULL THEN
        RETURN FALSE;
    END IF;
    
    RETURN (
        ARRAY_POSITION(level_values, current_level) >= 
        ARRAY_POSITION(level_values, required_level)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- RLS POLICIES FOR user_profiles
-- ============================================================================

-- Everyone can view public profiles
CREATE POLICY "Public profiles viewable by everyone"
    ON user_profiles FOR SELECT
    USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = id);

-- Only admins can insert
CREATE POLICY "Admins can manage users"
    ON user_profiles FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role_level IN ('ADMIN'::user_role_level, 'SUPER_ADMIN'::user_role_level, 'ROOT'::user_role_level)
        )
    );

-- ============================================================================
-- RLS POLICIES FOR investments
-- ============================================================================

-- Users can view own investments
CREATE POLICY "Users can view own investments"
    ON investments FOR SELECT
    USING (user_id = auth.uid());

-- Users can create own investments
CREATE POLICY "Users can create investments"
    ON investments FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Users can update own investments
CREATE POLICY "Users can update own investments"
    ON investments FOR UPDATE
    USING (user_id = auth.uid());

-- Finance+ can view all
CREATE POLICY "Finance can view all investments"
    ON investments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role_level >= 'FINANCE'::user_role_level
        )
    );

-- ============================================================================
-- RLS POLICIES FOR vendors
-- ============================================================================

-- Vendors can view own vendor profile
CREATE POLICY "Vendors can view own profile"
    ON vendors FOR SELECT
    USING (user_id = auth.uid());

-- Users can create vendor profile
CREATE POLICY "Users can create vendor profile"
    ON vendors FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Vendors can update own profile
CREATE POLICY "Vendors can update own profile"
    ON vendors FOR UPDATE
    USING (user_id = auth.uid());

-- Finance+ can view all
CREATE POLICY "Finance can view all vendors"
    ON vendors FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role_level >= 'FINANCE'::user_role_level
        )
    );

-- ============================================================================
-- RLS POLICIES FOR vendor_products
-- ============================================================================

-- Anyone can view active products
CREATE POLICY "Active products viewable by everyone"
    ON vendor_products FOR SELECT
    USING (is_active = TRUE);

-- Vendors can manage own products
CREATE POLICY "Vendors can manage own products"
    ON vendor_products FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM vendors 
            WHERE vendor_id = id 
            AND user_id = auth.uid()
        )
    ) OR (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role_level >= 'ADMIN'::user_role_level
        )
    );

-- ============================================================================
-- RLS POLICIES FOR vendor_orders
-- ============================================================================

-- Buyers can view own orders
CREATE POLICY "Buyers can view own orders"
    ON vendor_orders FOR SELECT
    USING (buyer_id = auth.uid());

-- Vendors can view own orders
CREATE POLICY "Vendors can view own orders"
    ON vendor_orders FOR SELECT
    USING (vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid()));

-- Create orders
CREATE POLICY "Users can create orders"
    ON vendor_orders FOR INSERT
    WITH CHECK (buyer_id = auth.uid());

-- Finance+ can view all
CREATE POLICY "Finance can view all orders"
    ON vendor_orders FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role_level >= 'FINANCE'::user_role_level
        )
    );

-- ============================================================================
-- RLS POLICIES FOR commission_accumulation_ledger
-- ============================================================================

-- Users can view own commissions
CREATE POLICY "Users can view own commissions"
    ON commission_accumulation_ledger FOR SELECT
    USING (user_id = auth.uid());

-- Finance+ can view all
CREATE POLICY "Finance can view all commissions"
    ON commission_accumulation_ledger FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role_level >= 'FINANCE'::user_role_level
        )
    );

-- ============================================================================
-- RLS POLICIES FOR payouts
-- ============================================================================

-- Users can view own payouts
CREATE POLICY "Users can view own payouts"
    ON payouts FOR SELECT
    USING (user_id = auth.uid());

-- Finance can approve/process
CREATE POLICY "Finance can manage payouts"
    ON payouts FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role_level >= 'FINANCE'::user_role_level
        )
    );

-- ============================================================================
-- RLS POLICIES FOR user_business_volume
-- ============================================================================

-- Users can view own business volume
CREATE POLICY "Users can view own business volume"
    ON user_business_volume FOR SELECT
    USING (user_id = auth.uid());

-- Compliance+ can view all
CREATE POLICY "Compliance can view all business volumes"
    ON user_business_volume FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role_level >= 'COMPLIANCE'::user_role_level
        )
    );

-- ============================================================================
-- RLS POLICIES FOR rank_change_history
-- ============================================================================

-- Users can view own rank history
CREATE POLICY "Users can view own rank history"
    ON rank_change_history FOR SELECT
    USING (user_id = auth.uid());

-- Compliance+ can view all
CREATE POLICY "Compliance can view all rank history"
    ON rank_change_history FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role_level >= 'COMPLIANCE'::user_role_level
        )
    );

-- ============================================================================
-- RLS POLICIES FOR kyc_documents
-- ============================================================================

-- Users can view own KYC
CREATE POLICY "Users can view own KYC"
    ON kyc_documents FOR SELECT
    USING (user_id = auth.uid());

-- Users can upload own KYC
CREATE POLICY "Users can upload KYC"
    ON kyc_documents FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Compliance+ can verify KYC
CREATE POLICY "Compliance can manage KYC"
    ON kyc_documents FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role_level >= 'COMPLIANCE'::user_role_level
        )
    );

-- ============================================================================
-- RLS POLICIES FOR audit_logs
-- ============================================================================

-- Compliance+ can view all audit logs
CREATE POLICY "Compliance can view audit logs"
    ON audit_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role_level >= 'COMPLIANCE'::user_role_level
        )
    );

-- System can insert audit logs
CREATE POLICY "Service role can insert audit logs"
    ON audit_logs FOR INSERT
    WITH CHECK (TRUE);

-- ============================================================================
-- RLS POLICIES FOR webhook_event_queue
-- ============================================================================

-- System can manage webhooks
CREATE POLICY "System can manage webhooks"
    ON webhook_event_queue FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role_level >= 'SYSTEM'::user_role_level
        )
    );

-- ============================================================================
-- RLS POLICIES FOR google_trends_tracking
-- ============================================================================

-- Everyone can view trends
CREATE POLICY "Trends viewable by everyone"
    ON google_trends_tracking FOR SELECT
    USING (true);

-- Admin+ can manage
CREATE POLICY "Admin can manage trends"
    ON google_trends_tracking FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role_level >= 'ADMIN'::user_role_level
        )
    );

-- ============================================================================
-- RLS POLICIES FOR product_listing_strategy
-- ============================================================================

-- Everyone can view strategies
CREATE POLICY "Strategies viewable by everyone"
    ON product_listing_strategy FOR SELECT
    USING (is_active = true);

-- Admin+ can manage
CREATE POLICY "Admin can manage strategies"
    ON product_listing_strategy FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role_level >= 'ADMIN'::user_role_level
        )
    );

-- ============================================================================
-- RLS POLICIES FOR daily_payout_accumulation
-- ============================================================================

-- Users can view own daily payouts
CREATE POLICY "Users can view own daily payouts"
    ON daily_payout_accumulation FOR SELECT
    USING (user_id = auth.uid());

-- Finance+ can view all
CREATE POLICY "Finance can view all daily payouts"
    ON daily_payout_accumulation FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role_level >= 'FINANCE'::user_role_level
        )
    );

-- ============================================================================
-- DATABASE FUNCTIONS
-- ============================================================================

-- ============================================================================
-- FUNCTION: calculate_rank
-- Calculates user rank based on business volume
-- ============================================================================

CREATE OR REPLACE FUNCTION calculate_rank(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_current_volume NUMERIC(20, 2);
    v_new_rank VARCHAR(50);
    v_next_rank VARCHAR(50);
    v_business_needed NUMERIC(20, 2);
    v_result JSONB;
BEGIN
    -- Get user's total business volume
    SELECT total_business INTO v_current_volume
    FROM user_business_volume
    WHERE user_id = p_user_id;

    -- Determine rank based on volume thresholds
    v_new_rank := CASE
        WHEN v_current_volume >= 1000000000 THEN 'AMBASSADOR'
        WHEN v_current_volume >= 500000000 THEN 'DIAMOND'
        WHEN v_current_volume >= 250000000 THEN 'PLATINUM'
        WHEN v_current_volume >= 100000000 THEN 'GOLD'
        WHEN v_current_volume >= 50000000 THEN 'SILVER'
        ELSE 'BRONZE'
    END;

    -- Determine next rank
    v_next_rank := CASE
        WHEN v_current_volume < 50000000 THEN 'SILVER'
        WHEN v_current_volume < 100000000 THEN 'GOLD'
        WHEN v_current_volume < 250000000 THEN 'PLATINUM'
        WHEN v_current_volume < 500000000 THEN 'DIAMOND'
        WHEN v_current_volume < 1000000000 THEN 'AMBASSADOR'
        ELSE NULL
    END;

    -- Calculate business needed for next rank
    v_business_needed := CASE v_next_rank
        WHEN 'SILVER' THEN 50000000 - v_current_volume
        WHEN 'GOLD' THEN 100000000 - v_current_volume
        WHEN 'PLATINUM' THEN 250000000 - v_current_volume
        WHEN 'DIAMOND' THEN 500000000 - v_current_volume
        WHEN 'AMBASSADOR' THEN 1000000000 - v_current_volume
        ELSE 0
    END;

    -- Update user_business_volume
    UPDATE user_business_volume
    SET current_rank = v_new_rank,
        next_rank = v_next_rank,
        business_needed_for_next = v_business_needed,
        calculated_at = NOW()
    WHERE user_id = p_user_id;

    -- Update user's rank in user_profiles
    UPDATE user_profiles
    SET rank = v_new_rank,
        updated_at = NOW()
    WHERE id = p_user_id;

    -- Insert rank change history if rank changed
    INSERT INTO rank_change_history (user_id, previous_rank, new_rank, change_type, business_volume)
    SELECT 
        p_user_id,
        rank,
        v_new_rank,
        'AUTO'::rank_change_type,
        v_current_volume
    FROM user_profiles
    WHERE id = p_user_id AND rank != v_new_rank;

    v_result := jsonb_build_object(
        'success', true,
        'user_id', p_user_id,
        'current_rank', v_new_rank,
        'next_rank', v_next_rank,
        'business_needed', v_business_needed,
        'total_volume', v_current_volume
    );

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- FUNCTION: process_commissions
-- Process all commissions for an investment
-- ============================================================================

CREATE OR REPLACE FUNCTION process_commissions(p_investment_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_investment RECORD;
    v_investor RECORD;
    v_commission_rates NUMERIC(5,4)[] := ARRAY[0.20, 0.10, 0.07, 0.05, 0.02, 0.01];
    v_level INTEGER;
    v_upline_id UUID;
    v_upline_user RECORD;
    v_gross_amount NUMERIC(20,2);
    v_admin_charge NUMERIC(20,2);
    v_net_amount NUMERIC(20,2);
    v_total_commissions NUMERIC(20,2) := 0;
    v_commission_count INTEGER := 0;
BEGIN
    -- Get investment details
    SELECT * INTO v_investment
    FROM investments
    WHERE id = p_investment_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Investment not found');
    END IF;

    -- Get investor details
    SELECT * INTO v_investor
    FROM user_profiles
    WHERE id = v_investment.user_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Investor not found');
    END IF;

    -- Process commissions for each level (1-6)
    FOR v_level IN 1..6 LOOP
        -- Get upline ID dynamically
        CASE v_level
            WHEN 1 THEN v_upline_id := v_investor.upline_1;
            WHEN 2 THEN v_upline_id := v_investor.upline_2;
            WHEN 3 THEN v_upline_id := v_investor.upline_3;
            WHEN 4 THEN v_upline_id := v_investor.upline_4;
            WHEN 5 THEN v_upline_id := v_investor.upline_5;
            WHEN 6 THEN v_upline_id := v_investor.upline_6;
        END CASE;

        -- If upline exists, create commission
        IF v_upline_id IS NOT NULL THEN
            -- Get upline user
            SELECT * INTO v_upline_user
            FROM user_profiles
            WHERE id = v_upline_id;

            IF FOUND THEN
                -- Calculate commission based on monthly profit
                v_gross_amount := v_investment.monthly_profit * v_commission_rates[v_level];
                
                -- Admin charge (e.g., 5%)
                v_admin_charge := v_gross_amount * 0.05;
                
                -- Net amount
                v_net_amount := v_gross_amount - v_admin_charge;

                -- Insert commission record
                INSERT INTO commission_accumulation_ledger (
                    user_id,
                    source_investment_id,
                    beneficiary_id,
                    level,
                    percentage,
                    gross_amount,
                    admin_charge,
                    net_amount,
                    status,
                    calculation_period
                ) VALUES (
                    v_upline_id,
                    p_investment_id,
                    v_investor.id,
                    v_level,
                    v_commission_rates[v_level],
                    v_gross_amount,
                    v_admin_charge,
                    v_net_amount,
                    'PENDING',
                    TO_CHAR(NOW(), 'YYYY-MM')
                );

                v_total_commissions := v_total_commissions + v_net_amount;
                v_commission_count := v_commission_count + 1;
            END IF;
        END IF;
    END LOOP;

    RETURN jsonb_build_object(
        'success', true,
        'investment_id', p_investment_id,
        'monthly_profit', v_investment.monthly_profit,
        'total_commissions', v_total_commissions,
        'commission_count', v_commission_count,
        'period', TO_CHAR(NOW(), 'YYYY-MM')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- FUNCTION: calculate_payout
-- Calculate payout for user in a given period
-- ============================================================================

CREATE OR REPLACE FUNCTION calculate_payout(
    p_user_id UUID,
    p_period_start DATE,
    p_period_end DATE
)
RETURNS JSONB AS $$
DECLARE
    v_total_commission NUMERIC(20,2) := 0;
    v_total_payout NUMERIC(20,2) := 0;
    v_investment_returns NUMERIC(20,2) := 0;
    v_vendor_earnings NUMERIC(20,2) := 0;
    v_pending_payouts NUMERIC(20,2) := 0;
    v_approved_payouts NUMERIC(20,2) := 0;
    v_processed_payouts NUMERIC(20,2) := 0;
BEGIN
    -- Get total commissions for period
    SELECT COALESCE(SUM(net_amount), 0) INTO v_total_commission
    FROM commission_accumulation_ledger
    WHERE user_id = p_user_id
      AND created_at >= p_period_start
      AND created_at < p_period_end + INTERVAL '1 day';

    -- Get investment returns
    SELECT COALESCE(SUM(monthly_profit), 0) INTO v_investment_returns
    FROM investments
    WHERE user_id = p_user_id
      AND status = 'ACTIVE'
      AND start_date < p_period_end;

    -- Get vendor earnings
    SELECT COALESCE(SUM(total_amount), 0) INTO v_vendor_earnings
    FROM vendor_orders
    WHERE vendor_id IN (SELECT id FROM vendors WHERE user_id = p_user_id)
      AND status = 'DELIVERED'
      AND created_at >= p_period_start
      AND created_at < p_period_end + INTERVAL '1 day';

    -- Get pending payouts
    SELECT COALESCE(SUM(amount), 0) INTO v_pending_payouts
    FROM payouts
    WHERE user_id = p_user_id
      AND status = 'PENDING';

    -- Get approved payouts
    SELECT COALESCE(SUM(amount), 0) INTO v_approved_payouts
    FROM payouts
    WHERE user_id = p_user_id
      AND status = 'APPROVED';

    -- Get processed payouts
    SELECT COALESCE(SUM(amount), 0) INTO v_processed_payouts
    FROM payouts
    WHERE user_id = p_user_id
      AND status = 'PROCESSED'
      AND processed_at >= p_period_start
      AND processed_at < p_period_end + INTERVAL '1 day';

    -- Calculate total payoutable amount
    v_total_payout := v_total_commission + v_investment_returns + v_vendor_earnings;

    -- Insert/update daily accumulation
    INSERT INTO daily_payout_accumulation (
        user_id,
        date,
        total_commission,
        total_payout,
        investment_returns,
        vendor_earnings,
        processed_at
    ) VALUES (
        p_user_id,
        p_period_end,
        v_total_commission,
        v_total_payout,
        v_investment_returns,
        v_vendor_earnings,
        NOW()
    )
    ON CONFLICT (user_id, date) DO UPDATE SET
        total_commission = EXCLUDED.total_commission,
        total_payout = EXCLUDED.total_payout,
        investment_returns = EXCLUDED.investment_returns,
        vendor_earnings = EXCLUDED.vendor_earnings,
        processed_at = NOW();

    RETURN jsonb_build_object(
        'success', true,
        'user_id', p_user_id,
        'period_start', p_period_start,
        'period_end', p_period_end,
        'total_commission', v_total_commission,
        'investment_returns', v_investment_returns,
        'vendor_earnings', v_vendor_earnings,
        'total_payoutable', v_total_payout,
        'pending_payouts', v_pending_payouts,
        'approved_payouts', v_approved_payouts,
        'processed_payouts', v_processed_payouts
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- FUNCTION: update_business_volume
-- Updates user business volume based on new investment
-- ============================================================================

CREATE OR REPLACE FUNCTION update_business_volume(
    p_user_id UUID,
    p_amount NUMERIC(20, 2)
)
RETURNS VOID AS $$
DECLARE
    v_upline_id UUID;
    v_level INTEGER;
    v_current_volume NUMERIC(20, 2);
BEGIN
    -- Update direct business for the user
    INSERT INTO user_business_volume (user_id, direct_business, total_business)
    VALUES (p_user_id, p_amount, p_amount)
    ON CONFLICT (user_id) DO UPDATE SET
        direct_business = user_business_volume.direct_business + p_amount,
        total_business = user_business_volume.total_business + p_amount;

    -- Update upline's business volume (levels 2-6)
    FOR v_level IN 2..6 LOOP
        -- Get upline
        EXECUTE format(
            'SELECT upline_%s FROM user_profiles WHERE id = %L',
            v_level, p_user_id
        ) INTO v_upline_id;

        IF v_upline_id IS NOT NULL THEN
            -- Get current volume
            SELECT total_business INTO v_current_volume
            FROM user_business_volume
            WHERE user_id = v_upline_id;

            -- Update upline's level business
            EXECUTE format(
                'UPDATE user_business_volume 
                 SET level%s_business = COALESCE(level%s_business, 0) + %s,
                     total_business = total_business + %s
                 WHERE user_id = %L',
                v_level, v_level, p_amount, p_amount, v_upline_id
            );
        END IF;
    END LOOP;

    -- Recalculate rank for the user
    PERFORM calculate_rank(p_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- TRIGGER: After investment creation, update business volume
-- ============================================================================

CREATE OR REPLACE FUNCTION trigger_update_business_volume()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'ACTIVE' AND (OLD IS NULL OR OLD.status != 'ACTIVE') THEN
        PERFORM update_business_volume(NEW.user_id, NEW.amount);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_investment_business_volume
    AFTER INSERT OR UPDATE OF status ON investments
    FOR EACH ROW
    WHEN (NEW.status = 'ACTIVE')
    EXECUTE FUNCTION trigger_update_business_volume();

-- ============================================================================
-- TRIGGER: Auto-create user business volume on user creation
-- ============================================================================

CREATE OR REPLACE FUNCTION trigger_create_business_volume()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_business_volume (user_id, current_rank)
    VALUES (NEW.id, 'BRONZE')
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_user_business_volume
    AFTER INSERT ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION trigger_create_business_volume();

-- ============================================================================
-- TRIGGER: Auto-generate referral code on user creation
-- ============================================================================

CREATE OR REPLACE FUNCTION trigger_generate_referral_code()
RETURNS TRIGGER AS $$
DECLARE
    v_referral_code VARCHAR(20);
BEGIN
    -- Generate unique referral code
    v_referral_code := UPPER(
        SUBSTRING(NEW.email FROM 1 FOR 3) || 
        TO_CHAR(NOW(), 'YYMMDD') || 
        SUBSTRING(GEN_RANDOM_UUID()::TEXT FROM 1 FOR 4)
    );
    
    NEW.referral_code := v_referral_code;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_user_referral_code
    BEFORE INSERT ON user_profiles
    FOR EACH ROW
    WHEN (NEW.referral_code IS NULL)
    EXECUTE FUNCTION trigger_generate_referral_code();

-- ============================================================================
-- FUNCTION: Log audit event
-- ============================================================================

CREATE OR REPLACE FUNCTION log_audit_event(
    p_user_id UUID,
    p_action VARCHAR,
    p_entity_type VARCHAR,
    p_entity_id UUID DEFAULT NULL,
    p_old_values JSONB DEFAULT NULL,
    p_new_values JSONB DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO audit_logs (
        user_id, action, entity_type, entity_id,
        old_values, new_values, ip_address, user_agent, metadata
    ) VALUES (
        p_user_id, p_action, p_entity_type, p_entity_id,
        p_old_values, p_new_values, p_ip_address, p_user_agent, p_metadata
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================

-- Add comments for documentation
COMMENT ON TABLE user_profiles IS 'Extended user profiles with role hierarchy, KYC, and investment platform fields';
COMMENT ON TABLE investments IS 'Investment records with tiers and profit tracking';
COMMENT ON TABLE vendors IS 'Vendor accounts with business details';
COMMENT ON TABLE vendor_products IS 'Vendor product listings with Google Trends integration';
COMMENT ON TABLE vendor_orders IS 'Product orders from vendors';
COMMENT ON TABLE commission_accumulation_ledger IS 'Multi-level commission tracking (6 levels)';
COMMENT ON TABLE daily_payout_accumulation IS 'Daily payout totals per user';
COMMENT ON TABLE payouts IS 'Payout requests and processing';
COMMENT ON TABLE user_business_volume IS 'Business volume tracking for rank calculations';
COMMENT ON TABLE rank_change_history IS 'Historical log of rank changes';
COMMENT ON TABLE webhook_event_queue IS 'Webhook event processing queue';
COMMENT ON TABLE google_trends_tracking IS 'Google Trends data for product research';
COMMENT ON TABLE product_listing_strategy IS 'Auto-listing rules based on trend scores';
COMMENT ON TABLE kyc_documents IS 'KYC document storage and verification';
COMMENT ON TABLE audit_logs IS 'Comprehensive audit trail for compliance';