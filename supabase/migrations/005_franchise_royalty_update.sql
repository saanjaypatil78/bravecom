-- ============================================================================
-- FRANCHISE TARGETS TABLE (New)
-- ============================================================================
CREATE TABLE franchise_targets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rank VARCHAR(50) NOT NULL UNIQUE,
    target_volume DECIMAL(20, 2) NOT NULL,
    royalty_percentage DECIMAL(5, 4) NOT NULL,
    referral_bonus_percentage DECIMAL(5, 4) DEFAULT 0,
    benefits JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert Franchise Ranks (Based on Excel Sheet Logic)
INSERT INTO franchise_targets (rank, target_volume, royalty_percentage, referral_bonus_percentage, benefits) VALUES
('BRONZE', 10000000, 0.0100, 0.00, '{"benefits": ["Basic Royalty", "Email Support"]}'),
('SILVER', 50000000, 0.0075, 0.01, '{"benefits": ["Silver Royalty", "Priority Support", "1% Referral Bonus"]}'),
('GOLD', 100000000, 0.0050, 0.02, '{"benefits": ["Gold Royalty", "Dedicated Manager", "2% Referral Bonus"]}'),
('PLATINUM', 250000000, 0.0035, 0.03, '{"benefits": ["Platinum Royalty", "VIP Support", "3% Referral Bonus"]}'),
('DIAMOND', 500000000, 0.0025, 0.04, '{"benefits": ["Diamond Royalty", "Executive Support", "4% Referral Bonus"]}'),
('AMBASSADOR', 1000000000, 0.0015, 0.05, '{"benefits": ["Ambassador Royalty", "Personal Account Manager", "5% Referral Bonus"]}');

-- Indexes
CREATE INDEX idx_franchise_targets_rank ON franchise_targets(rank);
CREATE INDEX idx_franchise_targets_volume ON franchise_targets(target_volume);

-- ============================================================================
-- USER FRANCHISE STATUS TABLE (New)
-- ============================================================================
CREATE TABLE user_franchise_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    current_rank VARCHAR(50) DEFAULT 'BRONZE',
    current_volume DECIMAL(20, 2) DEFAULT 0,
    target_volume DECIMAL(20, 2) DEFAULT 0,
    progress_percentage DECIMAL(5, 2) DEFAULT 0,
    royalty_qualified BOOLEAN DEFAULT FALSE,
    qualified_at TIMESTAMPTZ,
    next_rank VARCHAR(50),
    volume_needed_for_next DECIMAL(20, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

CREATE INDEX idx_user_franchise_user_id ON user_franchise_status(user_id);
CREATE INDEX idx_user_franchise_qualified ON user_franchise_status(royalty_qualified);
CREATE INDEX idx_user_franchise_rank ON user_franchise_status(current_rank);

-- ============================================================================
-- ROYALTY EARNINGS TABLE (Updated)
-- ============================================================================
CREATE TABLE royalty_earnings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    franchise_rank VARCHAR(50) NOT NULL,
    calculation_base VARCHAR(20) DEFAULT 'PROFIT', -- 'PROFIT' not 'PRINCIPAL'
    profit_pool DECIMAL(20, 2) NOT NULL,
    royalty_percentage DECIMAL(5, 4) NOT NULL,
    royalty_amount DECIMAL(20, 2) NOT NULL,
    referral_bonus_percentage DECIMAL(5, 4) DEFAULT 0,
    referral_bonus_amount DECIMAL(20, 2) DEFAULT 0,
    total_earning DECIMAL(20, 2) NOT NULL,
    period_month VARCHAR(7) NOT NULL, -- YYYY-MM
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, CALCULATED, PAID
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_royalty_earnings_user_id ON royalty_earnings(user_id);
CREATE INDEX idx_royalty_earnings_period ON royalty_earnings(period_month);
CREATE INDEX idx_royalty_earnings_status ON royalty_earnings(status);
CREATE INDEX idx_royalty_earnings_rank ON royalty_earnings(franchise_rank);

-- ============================================================================
-- RECURRING COMMISSIONS TABLE (New - For Lifetime Returns)
-- ============================================================================
CREATE TABLE recurring_commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    investment_id UUID NOT NULL REFERENCES investments(id) ON DELETE CASCADE,
    commission_type VARCHAR(30) NOT NULL, -- 'LEVEL_1' to 'LEVEL_6', 'FRANCHISE_ROYALTY'
    percentage DECIMAL(5, 4) NOT NULL,
    calculation_base VARCHAR(20) DEFAULT 'PROFIT',
    monthly_amount DECIMAL(20, 2) NOT NULL,
    is_recurring BOOLEAN DEFAULT TRUE,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ, -- NULL = lifetime while investment active
    status VARCHAR(20) DEFAULT 'ACTIVE', -- ACTIVE, PAUSED, ENDED
    last_paid_at TIMESTAMPTZ,
    next_payout_date TIMESTAMPTZ,
    total_paid DECIMAL(20, 2) DEFAULT 0,
    payment_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_recurring_commissions_user_id ON recurring_commissions(user_id);
CREATE INDEX idx_recurring_commissions_investment_id ON recurring_commissions(investment_id);
CREATE INDEX idx_recurring_commissions_status ON recurring_commissions(status);
CREATE INDEX idx_recurring_commissions_next_payout ON recurring_commissions(next_payout_date);

-- ============================================================================
-- ROYALTY SAVINGS TRACKER TABLE (New - Track the 1% Savings)
-- ============================================================================
CREATE TABLE royalty_savings_tracker (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_month VARCHAR(7) NOT NULL UNIQUE,
    total_investment_corpus DECIMAL(20, 2) NOT NULL,
    total_profit_pool DECIMAL(20, 2) NOT NULL,
    old_royalty_model_amount DECIMAL(20, 2) NOT NULL, -- 3% of principal
    new_royalty_model_amount DECIMAL(20, 2) NOT NULL, -- 3% of profit (~2% effective)
    monthly_savings DECIMAL(20, 2) NOT NULL,
    cumulative_savings DECIMAL(20, 2) DEFAULT 0,
    savings_percentage DECIMAL(5, 2) DEFAULT 1.00,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_royalty_savings_period ON royalty_savings_tracker(period_month);

-- ============================================================================
-- TRIGGER: Auto-update User Franchise Status on Volume Change
-- ============================================================================
CREATE OR REPLACE FUNCTION update_franchise_status()
RETURNS TRIGGER AS $$
DECLARE
    v_new_rank VARCHAR(50);
    v_royalty_percentage DECIMAL(5, 4);
    v_referral_bonus DECIMAL(5, 4);
    v_next_rank VARCHAR(50);
    v_next_volume DECIMAL(20, 2);
BEGIN
    -- Determine new rank based on volume
    SELECT rank, royalty_percentage, referral_bonus_percentage
    INTO v_new_rank, v_royalty_percentage, v_referral_bonus
    FROM franchise_targets
    WHERE NEW.total_volume >= target_volume
    ORDER BY target_volume DESC
    LIMIT 1;

    -- Get next rank info
    SELECT rank, target_volume
    INTO v_next_rank, v_next_volume
    FROM franchise_targets
    WHERE target_volume > NEW.total_volume
    ORDER BY target_volume ASC
    LIMIT 1;

    -- Update or insert franchise status
    INSERT INTO user_franchise_status (
        user_id, current_rank, current_volume, target_volume,
        progress_percentage, royalty_qualified, qualified_at,
        next_rank, volume_needed_for_next
    ) VALUES (
        NEW.id,
        v_new_rank,
        NEW.total_volume,
        (SELECT target_volume FROM franchise_targets WHERE rank = v_new_rank),
        ROUND((NEW.total_volume / (SELECT target_volume FROM franchise_targets WHERE rank = v_new_rank)) * 100, 2),
        TRUE,
        CASE WHEN v_new_rank != 'BRONZE' THEN NOW() ELSE NULL END,
        v_next_rank,
        v_next_volume - NEW.total_volume
    )
    ON CONFLICT (user_id) DO UPDATE SET
        current_rank = v_new_rank,
        current_volume = NEW.total_volume,
        target_volume = (SELECT target_volume FROM franchise_targets WHERE rank = v_new_rank),
        progress_percentage = ROUND((NEW.total_volume / (SELECT target_volume FROM franchise_targets WHERE rank = v_new_rank)) * 100, 2),
        royalty_qualified = TRUE,
        next_rank = v_next_rank,
        volume_needed_for_next = v_next_volume - NEW.total_volume,
        updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to users table
-- DROP TRIGGER IF EXISTS trigger_update_franchise_status ON users;
-- CREATE TRIGGER trigger_update_franchise_status
--     AFTER UPDATE OF total_volume ON users
--     FOR EACH ROW
--     EXECUTE FUNCTION update_franchise_status();

-- ============================================================================
-- FUNCTION: Calculate Monthly Royalty (Profit-Based, Not Principal)
-- ============================================================================
CREATE OR REPLACE FUNCTION calculate_monthly_royalty(
    p_user_id UUID,
    p_period_month VARCHAR(7)
)
RETURNS JSONB AS $$
DECLARE
    v_franchise_rank VARCHAR(50);
    v_royalty_percentage DECIMAL(5, 4);
    v_referral_bonus_percentage DECIMAL(5, 4);
    v_profit_pool DECIMAL(20, 2);
    v_royalty_amount DECIMAL(20, 2);
    v_referral_bonus_amount DECIMAL(20, 2);
    v_total_earning DECIMAL(20, 2);
BEGIN
    -- Get user's franchise rank
    SELECT current_rank INTO v_franchise_rank
    FROM user_franchise_status
    WHERE user_id = p_user_id
    ORDER BY created_at DESC
    LIMIT 1;

    -- Get royalty percentage for rank
    SELECT royalty_percentage, referral_bonus_percentage
    INTO v_royalty_percentage, v_referral_bonus_percentage
    FROM franchise_targets
    WHERE rank = v_franchise_rank;

    -- Calculate profit pool (15% of user's active investments)
    SELECT COALESCE(SUM(monthly_profit), 0) INTO v_profit_pool
    FROM investments
    WHERE user_id = p_user_id
    AND status = 'ACTIVE';

    -- Calculate royalty (on PROFIT, not principal!)
    v_royalty_amount := v_profit_pool * v_royalty_percentage;
    v_referral_bonus_amount := v_profit_pool * v_referral_bonus_percentage;
    v_total_earning := v_royalty_amount + v_referral_bonus_amount;

    -- Insert royalty earning record
    INSERT INTO royalty_earnings (
        user_id, franchise_rank, calculation_base, profit_pool,
        royalty_percentage, royalty_amount, referral_bonus_percentage,
        referral_bonus_amount, total_earning, period_month, status
    ) VALUES (
        p_user_id, v_franchise_rank, 'PROFIT', v_profit_pool,
        v_royalty_percentage, v_royalty_amount, v_referral_bonus_percentage,
        v_referral_bonus_amount, v_total_earning, p_period_month, 'CALCULATED'
    );

    RETURN jsonb_build_object(
        'success', TRUE,
        'user_id', p_user_id,
        'franchise_rank', v_franchise_rank,
        'profit_pool', v_profit_pool,
        'royalty_amount', v_royalty_amount,
        'referral_bonus_amount', v_referral_bonus_amount,
        'total_earning', v_total_earning,
        'calculation_base', 'PROFIT_NOT_PRINCIPAL',
        'effective_savings', '1% of total corpus'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- FUNCTION: Track Royalty Savings (The 1% Hidden Gem)
-- ============================================================================
CREATE OR REPLACE FUNCTION track_royalty_savings(p_period_month VARCHAR(7))
RETURNS JSONB AS $$
DECLARE
    v_total_corpus DECIMAL(20, 2);
    v_total_profit DECIMAL(20, 2);
    v_old_model_amount DECIMAL(20, 2); -- 3% of principal
    v_new_model_amount DECIMAL(20, 2); -- 3% of profit
    v_monthly_savings DECIMAL(20, 2);
    v_cumulative_savings DECIMAL(20, 2);
BEGIN
    -- Get total investment corpus
    SELECT COALESCE(SUM(amount), 0) INTO v_total_corpus
    FROM investments
    WHERE status = 'ACTIVE';

    -- Get total profit pool (15% of corpus)
    SELECT COALESCE(SUM(monthly_profit), 0) INTO v_total_profit
    FROM investments
    WHERE status = 'ACTIVE';

    -- OLD MODEL: 3% of principal
    v_old_model_amount := v_total_corpus * 0.03;

    -- NEW MODEL: 3% of profit (effective ~2% of corpus)
    v_new_model_amount := v_total_profit * 0.03;

    -- Monthly savings
    v_monthly_savings := v_old_model_amount - v_new_model_amount;

    -- Get cumulative savings
    SELECT COALESCE(SUM(monthly_savings), 0) INTO v_cumulative_savings
    FROM royalty_savings_tracker;

    -- Insert or update tracker
    INSERT INTO royalty_savings_tracker (
        period_month, total_investment_corpus, total_profit_pool,
        old_royalty_model_amount, new_royalty_model_amount,
        monthly_savings, cumulative_savings, savings_percentage
    ) VALUES (
        p_period_month, v_total_corpus, v_total_profit,
        v_old_model_amount, v_new_model_amount,
        v_monthly_savings, COALESCE(v_cumulative_savings, 0) + v_monthly_savings,
        ROUND((v_monthly_savings / NULLIF(v_old_model_amount, 0)) * 100, 2)
    )
    ON CONFLICT (period_month) DO UPDATE SET
        total_investment_corpus = EXCLUDED.total_investment_corpus,
        total_profit_pool = EXCLUDED.total_profit_pool,
        old_royalty_model_amount = EXCLUDED.old_royalty_model_amount,
        new_royalty_model_amount = EXCLUDED.new_royalty_model_amount,
        monthly_savings = EXCLUDED.monthly_savings,
        cumulative_savings = COALESCE(v_cumulative_savings, 0) + EXCLUDED.monthly_savings,
        updated_at = NOW();

    RETURN jsonb_build_object(
        'success', TRUE,
        'period_month', p_period_month,
        'total_corpus', v_total_corpus,
        'total_profit', v_total_profit,
        'old_model_payout', v_old_model_amount,
        'new_model_payout', v_new_model_amount,
        'monthly_savings', v_monthly_savings,
        'cumulative_savings', COALESCE(v_cumulative_savings, 0) + v_monthly_savings,
        'savings_percentage', '1% of corpus',
        'message', 'Hidden Gem: 1% savings = rs 1 Crore/month at rs 100 Crore corpus'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- FUNCTION: Setup Recurring Commissions (Lifetime Returns)
-- ============================================================================
CREATE OR REPLACE FUNCTION setup_recurring_commissions(
    p_user_id UUID,
    p_investment_id UUID,
    p_monthly_profit DECIMAL(20, 2)
)
RETURNS JSONB AS $$
DECLARE
    v_upline_user_id UUID;
    v_commission_percentages DECIMAL(5, 4)[] := ARRAY[0.20, 0.10, 0.07, 0.05, 0.02, 0.01];
    v_level INTEGER;
    v_upline_field TEXT;
BEGIN
    -- Get investor's upline hierarchy
    FOR v_level IN 1..6 LOOP
        v_upline_field := 'upline_' || CASE v_level
            WHEN 1 THEN '1' WHEN 2 THEN '2' WHEN 3 THEN '3'
            WHEN 4 THEN '4' WHEN 5 THEN '5' WHEN 6 THEN '6'
        END;

        -- Get upline user ID dynamically
        EXECUTE format('SELECT %I FROM users WHERE id = %L', v_upline_field, p_user_id)
        INTO v_upline_user_id;

        IF v_upline_user_id IS NOT NULL THEN
            -- Create recurring commission record
            INSERT INTO recurring_commissions (
                user_id, investment_id, commission_type, percentage,
                calculation_base, monthly_amount, is_recurring,
                start_date, next_payout_date, status
            ) VALUES (
                v_upline_user_id, p_investment_id,
                'LEVEL_' || v_level,
                v_commission_percentages[v_level],
                'PROFIT',
                p_monthly_profit * v_commission_percentages[v_level],
                TRUE,
                NOW(),
                NOW() + INTERVAL '1 month',
                'ACTIVE'
            );
        END IF;
    END LOOP;

    RETURN jsonb_build_object(
        'success', TRUE,
        'message', 'Recurring commissions setup for 6 levels',
        'calculation_base', 'PROFIT_NOT_PRINCIPAL',
        'recurring', TRUE,
        'lifetime', 'While investment remains active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
