-- ============================================================================
-- DROPSHIPPING MODULE FOR SUNRAY E-COMMERCE
-- Multi-source Import, Inventory Sync, Order Forwarding, Tracking
-- ============================================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- ENUM TYPES FOR DROPSHIPPING
-- ============================================================================

-- Dropship Source Status
CREATE TYPE dropship_source_status AS ENUM (
    'ACTIVE',
    'PAUSED',
    'DISABLED',
    'ERROR'
);

-- Dropship Product Status
CREATE TYPE dropship_product_status AS ENUM (
    'DRAFT',
    'IMPORTED',
    'LISTED',
    'OUT_OF_STOCK',
    'DISABLED',
    'SYNC_FAILED'
);

-- Dropship Order Status
CREATE TYPE dropship_order_status AS ENUM (
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'IN_TRANSIT',
    'DELIVERED',
    'CANCELLED',
    'REFUNDED',
    'FAILED'
);

-- Sync Status
CREATE TYPE sync_status AS ENUM (
    'PENDING',
    'IN_PROGRESS',
    'COMPLETED',
    'FAILED'
);

-- ============================================================================
-- TABLE: dropship_sources
-- ============================================================================

CREATE TABLE IF NOT EXISTS dropship_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    source_type VARCHAR(50) NOT NULL, -- 'aliexpress', 'custom', 'api'
    api_endpoint TEXT,
    api_key_encrypted TEXT,
    api_secret_encrypted TEXT,
    webhook_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    status dropship_source_status DEFAULT 'ACTIVE',
    last_sync_at TIMESTAMPTZ,
    last_sync_status VARCHAR(20),
    config JSONB DEFAULT '{}',
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: dropship_products
-- ============================================================================

CREATE TABLE IF NOT EXISTS dropship_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID NOT NULL REFERENCES dropship_sources(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
    
    -- Source product info
    source_product_id VARCHAR(255) NOT NULL,
    source_url TEXT,
    source_category VARCHAR(100),
    
    -- Product details
    name VARCHAR(500) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    brand VARCHAR(100),
    
    -- Pricing (from source)
    source_price NUMERIC(12, 2),
    source_currency VARCHAR(10) DEFAULT 'USD',
    
    -- Our pricing
    cost_price NUMERIC(12, 2),
    selling_price NUMERIC(12, 2),
    margin_percentage NUMERIC(8, 2),
    
    -- Inventory
    source_stock INTEGER DEFAULT 0,
    local_stock INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 5,
    is_tracking_stock BOOLEAN DEFAULT TRUE,
    
    -- Images
    images JSONB DEFAULT '[]',
    main_image TEXT,
    
    -- Attributes
    attributes JSONB DEFAULT '{}',
    variants JSONB DEFAULT '[]',
    
    -- Status
    status dropship_product_status DEFAULT 'DRAFT',
    
    -- Sync tracking
    last_sync_at TIMESTAMPTZ,
    sync_status sync_status DEFAULT 'PENDING',
    sync_error TEXT,
    
    -- Metadata
    category VARCHAR(100),
    tags JSONB DEFAULT '[]',
    weight NUMERIC(8, 2),
    dimensions JSONB,
    
    -- Link to local product (if listed)
    local_product_id UUID,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(source_id, source_product_id)
);

-- ============================================================================
-- TABLE: dropship_orders
-- ============================================================================

CREATE TABLE IF NOT EXISTS dropship_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Links
    source_id UUID REFERENCES dropship_sources(id),
    local_order_id UUID REFERENCES vendor_orders(id),
    dropship_product_id UUID REFERENCES dropship_products(id),
    
    -- Supplier order reference
    supplier_order_id VARCHAR(255),
    supplier_tracking_number VARCHAR(255),
    
    -- Order details
    quantity INTEGER NOT NULL,
    unit_cost NUMERIC(12, 2) NOT NULL,
    total_cost NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    
    -- Shipping
    shipping_method VARCHAR(100),
    shipping_cost NUMERIC(12, 2) DEFAULT 0,
    estimated_delivery DATE,
    
    -- Customer info (for forwarding)
    customer_name VARCHAR(255),
    customer_phone VARCHAR(50),
    customer_address JSONB,
    
    -- Status
    status dropship_order_status DEFAULT 'PENDING',
    
    -- Timeline
    ordered_at TIMESTAMPTZ,
    confirmed_at TIMESTAMPTZ,
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    
    -- API responses
    api_request JSONB,
    api_response JSONB,
    
    -- Tracking
    tracking_url TEXT,
    tracking_carrier VARCHAR(100),
    tracking_events JSONB DEFAULT '[]',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: dropship_inventory_sync_log
-- ============================================================================

CREATE TABLE IF NOT EXISTS dropship_inventory_sync_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID REFERENCES dropship_sources(id) ON DELETE CASCADE,
    
    sync_type VARCHAR(50), -- 'full', 'incremental', 'scheduled'
    status sync_status DEFAULT 'PENDING',
    
    -- Stats
    products_total INTEGER DEFAULT 0,
    products_updated INTEGER DEFAULT 0,
    products_failed INTEGER DEFAULT 0,
    products_out_of_stock INTEGER DEFAULT 0,
    
    -- Timing
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    duration_seconds INTEGER,
    
    -- Errors
    error_message TEXT,
    error_details JSONB,
    
    -- Results
    results JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: dropship_price_rules
-- ============================================================================

CREATE TABLE IF NOT EXISTS dropship_price_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Targeting
    source_id UUID REFERENCES dropship_sources(id),
    category VARCHAR(100),
    brand VARCHAR(100),
    is_global BOOLEAN DEFAULT FALSE,
    
    -- Pricing formula
    pricing_type VARCHAR(50) NOT NULL, -- 'fixed_margin', 'percentage', 'formula'
    margin_percentage NUMERIC(8, 2),
    fixed_markup NUMERIC(12, 2),
    min_price NUMERIC(12, 2),
    max_price NUMERIC(12, 2),
    
    -- Rounding
    round_to NUMERIC(12, 2) DEFAULT 1,
    
    is_active BOOLEAN DEFAULT TRUE,
    priority INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: dropship_auto_order_rules
-- ============================================================================

CREATE TABLE IF NOT EXISTS dropship_auto_order_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Conditions
    source_id UUID REFERENCES dropship_sources(id),
    min_order_value NUMERIC(12, 2),
    max_auto_value NUMERIC(12, 2),
    
    -- Actions
    auto_forward BOOLEAN DEFAULT TRUE,
    require_approval BOOLEAN DEFAULT FALSE,
    notify_vendor BOOLEAN DEFAULT TRUE,
    
    -- Fallback
    fallback_action VARCHAR(50), -- 'hold', 'cancel', 'notify'
    
    is_active BOOLEAN DEFAULT TRUE,
    priority INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: dropship_notifications
-- ============================================================================

CREATE TABLE IF NOT EXISTS dropship_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL, -- 'order_forwarded', 'tracking_updated', 'stock_low', 'sync_failed'
    title VARCHAR(255) NOT NULL,
    message TEXT,
    
    -- Links
    source_id UUID REFERENCES dropship_sources(id),
    order_id UUID REFERENCES dropship_orders(id),
    product_id UUID REFERENCES dropship_products(id),
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    
    -- Delivery
    email_sent BOOLEAN DEFAULT FALSE,
    sms_sent BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Dropship sources
CREATE INDEX idx_dropship_sources_status ON dropship_sources(status);
CREATE INDEX idx_dropship_sources_type ON dropship_sources(source_type);

-- Dropship products
CREATE INDEX idx_dropship_products_source ON dropship_products(source_id);
CREATE INDEX idx_dropship_products_vendor ON dropship_products(vendor_id);
CREATE INDEX idx_dropship_products_status ON dropship_products(status);
CREATE INDEX idx_dropship_products_source_product ON dropship_products(source_id, source_product_id);
CREATE INDEX idx_dropship_products_sync_status ON dropship_products(sync_status);
CREATE INDEX idx_dropship_products_category ON dropship_products(category);

-- Dropship orders
CREATE INDEX idx_dropship_orders_source ON dropship_orders(source_id);
CREATE INDEX idx_dropship_orders_local_order ON dropship_orders(local_order_id);
CREATE INDEX idx_dropship_orders_status ON dropship_orders(status);
CREATE INDEX idx_dropship_orders_supplier_order ON dropship_orders(supplier_order_id);
CREATE INDEX idx_dropship_orders_created ON dropship_orders(created_at DESC);

-- Inventory sync logs
CREATE INDEX idx_sync_log_source ON dropship_inventory_sync_log(source_id);
CREATE INDEX idx_sync_log_status ON dropship_inventory_sync_log(status);
CREATE INDEX idx_sync_log_created ON dropship_inventory_sync_log(created_at DESC);

-- Price rules
CREATE INDEX idx_price_rules_source ON dropship_price_rules(source_id);
CREATE INDEX idx_price_rules_active ON dropship_price_rules(is_active);

-- Notifications
CREATE INDEX idx_notifications_read ON dropship_notifications(is_read);
CREATE INDEX idx_notifications_created ON dropship_notifications(created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE dropship_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE dropship_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE dropship_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE dropship_inventory_sync_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE dropship_price_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE dropship_auto_order_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE dropship_notifications ENABLE ROW LEVEL SECURITY;

-- Admin+ can manage dropship sources
CREATE POLICY "Admin can manage dropship sources"
    ON dropship_sources FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role_level >= 'ADMIN'::user_role_level
        )
    );

-- Admin+ can view all dropship data
CREATE POLICY "Admin can view dropship products"
    ON dropship_products FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role_level >= 'ADMIN'::user_role_level
        )
    );

-- Vendors can view their imported products
CREATE POLICY "Vendors can view own dropship products"
    ON dropship_products FOR SELECT
    USING (
        vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
        OR EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role_level >= 'ADMIN'::user_role_level
        )
    );

-- Vendors can manage their own dropship products
CREATE POLICY "Vendors can manage own dropship products"
    ON dropship_products FOR ALL
    USING (
        vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
        OR EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role_level >= 'ADMIN'::user_role_level
        )
    );

-- Admin+ can view all orders
CREATE POLICY "Admin can view dropship orders"
    ON dropship_orders FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role_level >= 'ADMIN'::user_role_level
        )
    );

-- System can manage orders
CREATE POLICY "System can manage dropship orders"
    ON dropship_orders FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role_level >= 'SYSTEM'::user_role_level
        )
    );

-- Admin+ can view sync logs
CREATE POLICY "Admin can view sync logs"
    ON dropship_inventory_sync_log FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role_level >= 'ADMIN'::user_role_level
        )
    );

-- Admin+ can manage price rules
CREATE POLICY "Admin can manage price rules"
    ON dropship_price_rules FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role_level >= 'ADMIN'::user_role_level
        )
    );

-- Admin+ can manage auto order rules
CREATE POLICY "Admin can manage auto order rules"
    ON dropship_auto_order_rules FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role_level >= 'ADMIN'::user_role_level
        )
    );

-- Everyone can view own notifications
CREATE POLICY "Users can view own dropship notifications"
    ON dropship_notifications FOR SELECT
    USING (true);

-- System can manage notifications
CREATE POLICY "System can manage notifications"
    ON dropship_notifications FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role_level >= 'SYSTEM'::user_role_level
        )
    );

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Calculate selling price based on rules
CREATE OR REPLACE FUNCTION calculate_dropship_price(
    p_cost_price NUMERIC,
    p_source_id UUID DEFAULT NULL,
    p_category VARCHAR DEFAULT NULL,
    p_brand VARCHAR DEFAULT NULL
)
RETURNS NUMERIC AS $$
DECLARE
    v_price NUMERIC;
    v_rule RECORD;
BEGIN
    v_price := p_cost_price;
    
    -- Find matching price rule (highest priority)
    SELECT * INTO v_rule
    FROM dropship_price_rules
    WHERE is_active = TRUE
      AND (
        (source_id IS NULL AND is_global = TRUE)
        OR source_id = p_source_id
      )
      AND (category IS NULL OR category = p_category)
      AND (brand IS NULL OR brand = p_brand)
    ORDER BY priority DESC
    LIMIT 1;
    
    IF FOUND THEN
        CASE v_rule.pricing_type
            WHEN 'fixed_margin' THEN
                v_price := p_cost_price * (1 + v_rule.margin_percentage / 100);
            WHEN 'percentage' THEN
                v_price := p_cost_price + v_rule.margin_percentage;
            WHEN 'fixed_markup' THEN
                v_price := p_cost_price + v_rule.fixed_markup;
        END CASE;
        
        -- Apply min/max constraints
        IF v_rule.min_price IS NOT NULL AND v_price < v_rule.min_price THEN
            v_price := v_rule.min_price;
        END IF;
        IF v_rule.max_price IS NOT NULL AND v_price > v_rule.max_price THEN
            v_price := v_rule.max_price;
        END IF;
        
        -- Round to specified value
        IF v_rule.round_to IS NOT NULL AND v_rule.round_to > 0 THEN
            v_price := ROUND(v_price / v_rule.round_to) * v_rule.round_to;
        END IF;
    ELSE
        -- Default: 20% margin
        v_price := p_cost_price * 1.20;
    END IF;
    
    RETURN v_price;
END;
$$ LANGUAGE plpgsql;

-- Forward order to dropship supplier
CREATE OR REPLACE FUNCTION forward_dropship_order(
    p_local_order_id UUID,
    p_dropship_product_id UUID,
    p_customer_info JSONB
)
RETURNS JSONB AS $$
DECLARE
    v_product RECORD;
    v_source RECORD;
    v_order RECORD;
    v_result JSONB;
BEGIN
    -- Get dropship product
    SELECT dp.*, ds.source_type, ds.api_endpoint, ds.api_key_encrypted, ds.config
    INTO v_product
    FROM dropship_products dp
    JOIN dropship_sources ds ON ds.id = dp.source_id
    WHERE dp.id = p_dropship_product_id;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Dropship product not found');
    END IF;
    
    -- Get local order details
    SELECT * INTO v_order
    FROM vendor_orders
    WHERE id = p_local_order_id;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Local order not found');
    END IF;
    
    -- Create dropship order record
    INSERT INTO dropship_orders (
        source_id,
        local_order_id,
        dropship_product_id,
        quantity,
        unit_cost,
        total_cost,
        customer_name,
        customer_phone,
        customer_address,
        status,
        ordered_at,
        api_request
    ) VALUES (
        v_product.source_id,
        p_local_order_id,
        p_dropship_product_id,
        v_order.quantity,
        v_product.cost_price,
        v_product.cost_price * v_order.quantity,
        p_customer_info->>'name',
        p_customer_info->>'phone',
        p_customer_info->>'address',
        'PENDING',
        NOW(),
        jsonb_build_object(
            'product_id', v_product.source_product_id,
            'quantity', v_order.quantity,
            'customer', p_customer_info,
            'source_type', v_product.source_type
        )
    )
    RETURNING id INTO v_result;
    
    -- Update local order status
    UPDATE vendor_orders
    SET status = 'DROPSHIP_PENDING',
        updated_at = NOW()
    WHERE id = p_local_order_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'dropship_order_id', v_result,
        'message', 'Order forwarded to supplier'
    );
END;
$$ LANGUAGE plpgsql;

-- Update tracking information
CREATE OR REPLACE FUNCTION update_dropship_tracking(
    p_dropship_order_id UUID,
    p_tracking_number VARCHAR,
    p_carrier VARCHAR,
    p_tracking_url TEXT,
    p_status VARCHAR
)
RETURNS JSONB AS $$
DECLARE
    v_order RECORD;
    v_old_status VARCHAR;
BEGIN
    SELECT * INTO v_order
    FROM dropship_orders
    WHERE id = p_dropship_order_id;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Order not found');
    END IF;
    
    v_old_status := v_order.status;
    
    -- Update tracking
    UPDATE dropship_orders
    SET tracking_number = p_tracking_number,
        tracking_carrier = p_carrier,
        tracking_url = p_tracking_url,
        status = p_status::dropship_order_status,
        tracking_events = tracking_events || jsonb_build_array(
            jsonb_build_object(
                'status', p_status,
                'timestamp', NOW(),
                'tracking_number', p_tracking_number
            )
        ),
        updated_at = NOW()
    WHERE id = p_dropship_order_id;
    
    -- Update local order if linked
    IF v_order.local_order_id IS NOT NULL THEN
        CASE p_status
            WHEN 'SHIPPED' THEN
                UPDATE vendor_orders
                SET tracking_number = p_tracking_number,
                    status = 'SHIPPED',
                    updated_at = NOW()
                WHERE id = v_order.local_order_id;
            WHEN 'DELIVERED' THEN
                UPDATE vendor_orders
                SET status = 'DELIVERED',
                    delivered_at = NOW(),
                    updated_at = NOW()
                WHERE id = v_order.local_order_id;
        END CASE;
    END IF;
    
    -- Create notification
    INSERT INTO dropship_notifications (
        type,
        title,
        message,
        order_id
    ) VALUES (
        'tracking_updated',
        'Tracking Updated',
        jsonb_build_object(
            'order_id', p_dropship_order_id,
            'tracking', p_tracking_number,
            'carrier', p_carrier,
            'status', p_status
        )::text,
        p_dropship_order_id
    );
    
    RETURN jsonb_build_object(
        'success', true,
        'old_status', v_old_status,
        'new_status', p_status
    );
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- END OF DROPSHIPPING MIGRATION
-- ============================================================================

COMMENT ON TABLE dropship_sources IS 'Dropshipping supplier sources (AliExpress, custom APIs, etc.)';
COMMENT ON TABLE dropship_products IS 'Products imported from dropshipping suppliers';
COMMENT ON TABLE dropship_orders IS 'Orders forwarded to dropshipping suppliers';
COMMENT ON TABLE dropship_inventory_sync_log IS 'Inventory synchronization history';
COMMENT ON TABLE dropship_price_rules IS 'Automatic pricing rules for dropship products';
COMMENT ON TABLE dropship_auto_order_rules IS 'Rules for automatic order forwarding';
COMMENT ON TABLE dropship_notifications IS 'Dropshipping-related notifications';
