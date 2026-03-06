-- ============================================================================
-- ENHANCED DROPSHIPPING: ADDITIONAL TABLES
-- Multi-source Order Routing, Returns, Reviews
-- ============================================================================

-- ============================================================================
-- TABLE: dropship_returns
-- ============================================================================

CREATE TABLE IF NOT EXISTS dropship_returns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dropship_order_id UUID REFERENCES dropship_orders(id) ON DELETE CASCADE,
    local_order_id UUID REFERENCES vendor_orders(id),
    
    -- Return details
    return_type VARCHAR(20) NOT NULL, -- 'refund', 'replace', 'reimburse'
    reason VARCHAR(100),
    description TEXT,
    requested_quantity INTEGER NOT NULL DEFAULT 1,
    
    -- Status
    status VARCHAR(30) DEFAULT 'PENDING', -- 'pending', 'approved', 'rejected', 'processed', 'completed'
    
    -- Supplier interaction
    supplier_return_id VARCHAR(255),
    supplier_approved BOOLEAN DEFAULT FALSE,
    supplier_response TEXT,
    
    -- Resolution
    resolution VARCHAR(50), -- 'refunded', 'replaced', 'reimbursed', 'rejected'
    refund_amount NUMERIC(12, 2),
    refund_method VARCHAR(50), -- 'original', 'store_credit'
    
    -- Timeline
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    shipped_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    
    -- Notes
    admin_notes TEXT,
    customer_notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: dropship_product_reviews
-- ============================================================================

CREATE TABLE IF NOT EXISTS dropship_product_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dropship_product_id UUID REFERENCES dropship_products(id) ON DELETE CASCADE,
    
    -- Review from supplier
    source_review_id VARCHAR(255),
    reviewer_name VARCHAR(100),
    reviewer_country VARCHAR(100),
    
    -- Review content
    rating NUMERIC(3, 2) NOT NULL, -- 1-5
    title VARCHAR(255),
    content TEXT,
    pros TEXT,
    cons TEXT,
    
    -- Review metadata
    review_date DATE,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    
    -- Sync status
    last_sync_at TIMESTAMPTZ,
    is_synced BOOLEAN DEFAULT FALSE,
    
    -- Display settings
    is_displayed BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(dropship_product_id, source_review_id)
);

-- ============================================================================
-- TABLE: dropship_csv_imports
-- ============================================================================

CREATE TABLE IF NOT EXISTS dropship_csv_imports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID REFERENCES dropship_sources(id) ON DELETE SET NULL,
    
    -- File info
    file_name VARCHAR(255),
    file_url TEXT,
    file_size INTEGER,
    
    -- Import settings
    mapping_config JSONB, -- column mapping
    update_existing BOOLEAN DEFAULT TRUE,
    auto_publish BOOLEAN DEFAULT FALSE,
    
    -- Status
    status VARCHAR(30) DEFAULT 'PENDING', -- 'pending', 'processing', 'completed', 'failed'
    
    -- Stats
    total_rows INTEGER DEFAULT 0,
    imported_rows INTEGER DEFAULT 0,
    updated_rows INTEGER DEFAULT 0,
    failed_rows INTEGER DEFAULT 0,
    skipped_rows INTEGER DEFAULT 0,
    
    -- Errors
    error_log JSONB DEFAULT '[]',
    
    -- Timing
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: dropship_order_routing_rules
-- ============================================================================

CREATE TABLE IF NOT EXISTS dropship_order_routing_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Priority
    priority INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Conditions (all must match)
    conditions JSONB DEFAULT '{}', -- {min_stock, max_price, preferred_countries, exclude_countries}
    
    -- Actions
    action_type VARCHAR(50) NOT NULL, -- 'route_to_source', 'route_to_vendor', 'split_order'
    target_source_id UUID REFERENCES dropship_sources(id),
    target_vendor_id UUID REFERENCES vendors(id),
    
    -- Fallback
    fallback_action VARCHAR(50),
    fallback_source_id UUID REFERENCES dropship_sources(id),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: dropship_shipping_rates
-- ============================================================================

CREATE TABLE IF NOT EXISTS dropship_shipping_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID REFERENCES dropship_sources(id) ON DELETE CASCADE,
    
    -- Shipping method
    carrier_name VARCHAR(100) NOT NULL,
    service_name VARCHAR(100),
    service_code VARCHAR(50),
    
    -- Coverage
    origin_country VARCHAR(10),
    destination_countries JSONB DEFAULT '[]', -- country codes
    
    -- Pricing
    base_rate NUMERIC(10, 2) DEFAULT 0,
    per_kg_rate NUMERIC(10, 2) DEFAULT 0,
    free_shipping_threshold NUMERIC(12, 2),
    handling_fee NUMERIC(10, 2) DEFAULT 0,
    
    -- Delivery
    min_delivery_days INTEGER,
    max_delivery_days INTEGER,
    is_tracked BOOLEAN DEFAULT TRUE,
    is_insurance_included BOOLEAN DEFAULT FALSE,
    
    -- e-packet flag
    is_epacket BOOLEAN DEFAULT FALSE,
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: dropship_product_variants
-- ============================================================================

CREATE TABLE IF NOT EXISTS dropship_product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dropship_product_id UUID REFERENCES dropship_products(id) ON DELETE CASCADE,
    
    -- Variant identifiers
    source_variant_id VARCHAR(255),
    sku VARCHAR(100),
    
    -- Variant attributes
    attributes JSONB NOT NULL, -- {color: "Red", size: "M"}
    
    -- Pricing
    cost_price NUMERIC(12, 2),
    selling_price NUMERIC(12, 2),
    
    -- Inventory
    stock INTEGER DEFAULT 0,
    
    -- Images
    images JSONB DEFAULT '[]',
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(dropship_product_id, source_variant_id)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_returns_order ON dropship_returns(dropship_order_id);
CREATE INDEX idx_returns_status ON dropship_returns(status);
CREATE INDEX idx_returns_created ON dropship_returns(created_at DESC);

CREATE INDEX idx_reviews_product ON dropship_product_reviews(dropship_product_id);
CREATE INDEX idx_reviews_rating ON dropship_product_reviews(rating DESC);
CREATE INDEX idx_reviews_synced ON dropship_product_reviews(is_synced);

CREATE INDEX idx_csv_imports_status ON dropship_csv_imports(status);
CREATE INDEX idx_csv_imports_source ON dropship_csv_imports(source_id);

CREATE INDEX idx_routing_priority ON dropship_order_routing_rules(priority DESC);
CREATE INDEX idx_routing_active ON dropship_order_routing_rules(is_active);

CREATE INDEX idx_shipping_source ON dropship_shipping_rates(source_id);
CREATE INDEX idx_shipping_epacket ON dropship_shipping_rates(is_epacket);

CREATE INDEX idx_variants_product ON dropship_product_variants(dropship_product_id);

-- ============================================================================
-- RLS
-- ============================================================================

ALTER TABLE dropship_returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE dropship_product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE dropship_csv_imports ENABLE ROW LEVEL SECURITY;
ALTER TABLE dropship_order_routing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE dropship_shipping_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE dropship_product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage returns"
    ON dropship_returns FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role_level >= 'ADMIN'::user_role_level
        )
    );

CREATE POLICY "Admin can manage reviews"
    ON dropship_product_reviews FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role_level >= 'ADMIN'::user_role_level
        )
    );

CREATE POLICY "Admin can manage csv imports"
    ON dropship_csv_imports FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role_level >= 'ADMIN'::user_role_level
        )
    );

CREATE POLICY "Admin can manage routing"
    ON dropship_order_routing_rules FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role_level >= 'ADMIN'::user_role_level
        )
    );

CREATE POLICY "Admin can manage shipping"
    ON dropship_shipping_rates FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role_level >= 'ADMIN'::user_role_level
        )
    );

CREATE POLICY "Admin can manage variants"
    ON dropship_product_variants FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role_level >= 'ADMIN'::user_role_level
        )
    );

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Route order to best supplier based on rules
CREATE OR REPLACE FUNCTION route_order_to_best_supplier(
    p_product_id UUID,
    p_quantity INTEGER,
    p_destination_country VARCHAR(10)
)
RETURNS UUID AS $$
DECLARE
    v_best_source_id UUID;
    v_rule RECORD;
    v_product RECORD;
    v_stock_available INTEGER;
    v_shipping_rate RECORD;
    v_best_score NUMERIC := -1;
    v_current_score NUMERIC;
BEGIN
    -- Get product details
    SELECT * INTO v_product
    FROM dropship_products
    WHERE id = p_product_id;
    
    IF NOT FOUND THEN
        RETURN NULL;
    END IF;
    
    -- Get active routing rules ordered by priority
    FOR v_rule IN 
        SELECT * FROM dropship_order_routing_rules
        WHERE is_active = TRUE
        ORDER BY priority DESC
    LOOP
        -- Check if product matches source
        SELECT ds.id, dp.source_stock INTO v_best_source_id, v_stock_available
        FROM dropship_products dp
        JOIN dropship_sources ds ON ds.id = dp.source_id
        WHERE dp.id = p_product_id
          AND ds.id = v_rule.target_source_id
          AND ds.is_active = TRUE
          AND ds.status = 'ACTIVE'
          AND dp.status = 'LISTED'
          AND dp.source_stock >= p_quantity;
        
        IF v_best_source_id IS NOT NULL THEN
            RETURN v_best_source_id;
        END IF;
    END LOOP;
    
    -- Fallback: return the original source if no rules match
    RETURN v_product.source_id;
END;
$$ LANGUAGE plpgsql;

-- Calculate shipping for dropship order
CREATE OR REPLACE FUNCTION calculate_dropship_shipping(
    p_source_id UUID,
    p_destination_country VARCHAR(10),
    p_weight NUMERIC,
    p_order_value NUMERIC
)
RETURNS JSONB AS $$
DECLARE
    v_rate RECORD;
    v_shipping_cost NUMERIC := 0;
    v_delivery_days VARCHAR(50);
    v_is_tracked BOOLEAN := TRUE;
    v_result JSONB;
BEGIN
    -- Find best matching shipping rate
    SELECT * INTO v_rate
    FROM dropship_shipping_rates
    WHERE source_id = p_source_id
      AND is_active = TRUE
      AND (
        destination_countries IS NULL 
        OR destination_countries = '[]'::jsonb 
        OR p_destination_country = ANY(destination_countries)
      )
    ORDER BY 
        CASE WHEN is_epacket = TRUE THEN 0 ELSE 1 END,
        (base_rate + (p_weight * per_kg_rate)) ASC
    LIMIT 1;
    
    IF FOUND THEN
        v_shipping_cost := v_rate.base_rate + (p_weight * v_rate.per_kg_rate);
        
        -- Apply free shipping threshold
        IF v_rate.free_shipping_threshold IS NOT NULL 
           AND p_order_value >= v_rate.free_shipping_threshold THEN
            v_shipping_cost := 0;
        END IF;
        
        -- Add handling fee
        v_shipping_cost := v_shipping_cost + COALESCE(v_rate.handling_fee, 0);
        
        v_delivery_days := v_rate.min_delivery_days::text || '-' || v_rate.max_delivery_days::text || ' days';
        v_is_tracked := v_rate.is_tracked;
    ELSE
        -- Default shipping calculation
        v_shipping_cost := 10 + (p_weight * 2);
        v_delivery_days := '7-14 days';
    END IF;
    
    RETURN jsonb_build_object(
        'cost', v_shipping_cost,
        'carrier', v_rate.carrier_name,
        'service', v_rate.service_name,
        'delivery_days', v_delivery_days,
        'is_tracked', v_is_tracked,
        'is_epacket', v_rate.is_epacket
    );
END;
$$ LANGUAGE plpgsql;

-- Process return request
CREATE OR REPLACE FUNCTION process_dropship_return(
    p_return_id UUID,
    p_action VARCHAR, -- 'approve', 'reject', 'refund', 'complete'
    p_notes TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_return RECORD;
    v_order RECORD;
    v_result JSONB;
BEGIN
    SELECT * INTO v_return
    FROM dropship_returns
    WHERE id = p_return_id;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Return not found');
    END IF;
    
    CASE p_action
        WHEN 'approve' THEN
            UPDATE dropship_returns
            SET status = 'approved',
                approved_at = NOW(),
                admin_notes = COALESCE(admin_notes || '; ', '') || p_notes,
                updated_at = NOW()
            WHERE id = p_return_id;
            
            -- Notify supplier
            INSERT INTO dropship_notifications (
                type, title, message, order_id
            ) VALUES (
                'return_approved',
                'Return Approved',
                'Return ' || p_return_id || ' has been approved',
                v_return.dropship_order_id
            );
            
        WHEN 'reject' THEN
            UPDATE dropship_returns
            SET status = 'rejected',
                resolution = 'rejected',
                admin_notes = COALESCE(admin_notes || '; ', '') || p_notes,
                updated_at = NOW()
            WHERE id = p_return_id;
            
        WHEN 'refund' THEN
            UPDATE dropship_returns
            SET status = 'processed',
                resolution = 'refunded',
                refund_amount = p_return.requested_quantity * (
                    SELECT total_cost / quantity 
                    FROM dropship_orders 
                    WHERE id = v_return.dropship_order_id
                ),
                admin_notes = COALESCE(admin_notes || '; ', '') || p_notes,
                completed_at = NOW(),
                updated_at = NOW()
            WHERE id = p_return_id;
            
            -- Update local order
            UPDATE vendor_orders
            SET status = 'REFUNDED',
                updated_at = NOW()
            WHERE id = v_return.local_order_id;
            
        WHEN 'complete' THEN
            UPDATE dropship_returns
            SET status = 'completed',
                completed_at = NOW(),
                updated_at = NOW()
            WHERE id = p_return_id;
    END CASE;
    
    RETURN jsonb_build_object(
        'success', true,
        'return_id', p_return_id,
        'action', p_action
    );
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- END OF ENHANCED DROPSHIPPING
-- ============================================================================

COMMENT ON TABLE dropship_returns IS 'Dropship return requests and processing';
COMMENT ON TABLE dropship_product_reviews IS 'Synced product reviews from suppliers';
COMMENT ON TABLE dropship_csv_imports IS 'CSV bulk import history and configs';
COMMENT ON TABLE dropship_order_routing_rules IS 'Rules for routing orders to best suppliers';
COMMENT ON TABLE dropship_shipping_rates IS 'Shipping rates and methods per source';
COMMENT ON TABLE dropship_product_variants IS 'Product variants from suppliers';
