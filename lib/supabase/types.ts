/**
 * Supabase Database Types — BRAVECOM Sunray Ecosystem
 * Auto-aligned with prisma/schema.prisma + supabase/migrations/
 * Generated: 2026-03-01
 */

// ─── ENUMS ────────────────────────────────────────────────────────────────────

export type UserRole =
    | 'guest' | 'registered' | 'investor' | 'vendor'
    | 'finance' | 'compliance' | 'admin' | 'super_admin'
    | 'system' | 'root';

export type KYCStatus = 'not_started' | 'pending' | 'in_review' | 'approved' | 'rejected';
export type InvestmentStatus = 'ACTIVE' | 'MATURED' | 'WITHDRAWN' | 'CANCELLED';
export type CommissionStatus = 'PENDING' | 'APPROVED' | 'RELEASED' | 'CANCELLED';
export type VendorStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
export type VendorTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'DRAFT' | 'OUT_OF_STOCK';
export type SettlementStatus = 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED' | 'CANCELLED';

// ─── ROW TYPES ────────────────────────────────────────────────────────────────

export interface UserProfileRow {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    role: UserRole;
    wallet_balance: number;
    member_status: 'Active' | 'Inactive' | 'Suspended';
    member_tier: 'Core' | 'Sovereign' | 'Imperial';
    phone: string | null;
    referral_code: string | null;
    referrer_id: string | null;
    kyc_status: KYCStatus;
    two_factor_enabled: boolean;
    two_factor_secret: string | null;
    two_factor_backup_codes: string[] | null;
    failed_login_attempts: number;
    locked_until: string | null;
    permissions: string[];
    created_at: string;
    updated_at: string;
}

export interface CategoryRow {
    id: string;
    name: string;
    description: string | null;
    slug: string;
    image_url: string | null;
    created_at: string;
}

export interface ProductRow {
    id: string;
    category_id: string | null;
    name: string;
    description: string | null;
    price: number;
    stock: number;
    image_url: string | null;
    variant: string | null;
    badge_text: string | null;
    badge_color: string | null;
    is_featured: boolean;
    roi_percentage: number | null;
    created_at: string;
    updated_at: string;
}

export interface OrderRow {
    id: string;
    user_id: string;
    status: OrderStatus;
    total_amount: number;
    taxes: number;
    shipping_cost: number;
    created_at: string;
}

export interface OrderItemRow {
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    created_at: string;
}

export interface InvestmentRow {
    id: string;
    user_id: string;
    amount: number;
    roi_percentage: number;
    expected_return: number;
    actual_return: number | null;
    status: InvestmentStatus;
    plan_name: string | null;
    lock_in_months: number;
    maturity_date: string | null;
    created_at: string;
    updated_at: string;
}

export interface CommissionLedgerRow {
    id: string;
    user_id: string;
    from_user_id: string;
    investment_id: string | null;
    vendor_order_id: string | null;
    commission_type: 'INVESTMENT' | 'VENDOR' | 'RANK_BONUS' | 'TEAM_VOLUME';
    tier_level: number;
    gross_amount: number;
    commission_rate: number;
    commission_amount: number;
    status: CommissionStatus;
    locked_until: string | null;
    released_at: string | null;
    created_at: string;
}

export interface KYCDocumentRow {
    id: string;
    user_id: string;
    document_type: string;
    document_url: string;
    document_number: string | null;
    verification_status: 'PENDING' | 'APPROVED' | 'REJECTED';
    verified_at: string | null;
    verified_by: string | null;
    created_at: string;
}

export interface VendorRow {
    id: string;
    user_id: string;
    business_name: string;
    business_type: string | null;
    description: string | null;
    gst_number: string | null;
    status: VendorStatus;
    tier: VendorTier;
    commission_rate: number;
    monthly_sales: number;
    total_sales: number;
    approved_at: string | null;
    approved_by: string | null;
    bank_account_number: string | null;
    bank_name: string | null;
    bank_branch: string | null;
    ifsc_code: string | null;
    kyc_verified: boolean;
    created_at: string;
    updated_at: string;
}

export interface VendorProductRow {
    id: string;
    vendor_id: string;
    name: string;
    description: string | null;
    category: string | null;
    tags: string[] | null;
    mrp: number;
    selling_price: number;
    commission: number;
    inventory: number;
    status: ProductStatus;
    images: string[] | null;
    roi_percentage: number | null;
    created_at: string;
    updated_at: string;
}

export interface VendorOrderRow {
    id: string;
    order_number: string;
    vendor_id: string;
    buyer_id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
    total_amount: number;
    commission_amount: number;
    vendor_payout: number;
    status: OrderStatus;
    payment_status: PaymentStatus;
    fulfillment_status: 'PENDING' | 'PROCESSING' | 'FULFILLED' | 'FAILED';
    created_at: string;
    updated_at: string;
}

export interface VendorSettlementRow {
    id: string;
    vendor_id: string;
    period_start: string;
    period_end: string;
    total_sales: number;
    commission: number;
    amount_payable: number;
    amount_paid: number;
    status: SettlementStatus;
    paid_at: string | null;
    created_at: string;
}

export interface OTPVerificationRow {
    id: string;
    phone: string;
    email: string;
    otp_hash: string;
    purpose: 'registration' | 'login' | 'kyc_verification' | 'password_reset';
    verified: boolean;
    attempts: number;
    max_attempts: number;
    created_at: string;
    expires_at: string;
}

export interface AuditLogRow {
    id: string;
    action: string;
    user_id: string | null;
    session_id: string | null;
    ip_address: string | null;
    user_agent: string | null;
    details: Record<string, unknown> | null;
    created_at: string;
}

export interface RankBonusRow {
    id: string;
    user_id: string;
    from_user_id: string;
    previous_rank: string | null;
    new_rank: string;
    bonus_amount: number;
    status: CommissionStatus;
    paid_at: string | null;
    created_at: string;
}

// ─── INSERT TYPES (omit auto-generated fields) ───────────────────────────────

export type UserProfileInsert = Omit<UserProfileRow, 'created_at' | 'updated_at'> & {
    created_at?: string;
    updated_at?: string;
};

export type ProductInsert = Omit<ProductRow, 'id' | 'created_at' | 'updated_at'> & {
    id?: string;
};

export type OrderInsert = Omit<OrderRow, 'id' | 'created_at'> & { id?: string };
export type OrderItemInsert = Omit<OrderItemRow, 'id' | 'created_at'> & { id?: string };
export type InvestmentInsert = Omit<InvestmentRow, 'id' | 'created_at' | 'updated_at'> & { id?: string };
export type VendorInsert = Omit<VendorRow, 'id' | 'created_at' | 'updated_at'> & { id?: string };
export type VendorProductInsert = Omit<VendorProductRow, 'id' | 'created_at' | 'updated_at'> & { id?: string };
export type VendorOrderInsert = Omit<VendorOrderRow, 'id' | 'created_at' | 'updated_at'> & { id?: string };
export type CommissionLedgerInsert = Omit<CommissionLedgerRow, 'id' | 'created_at'> & { id?: string };
export type OTPVerificationInsert = Omit<OTPVerificationRow, 'id' | 'created_at'> & { id?: string };
export type AuditLogInsert = Omit<AuditLogRow, 'id' | 'created_at'> & { id?: string };

// ─── UPDATE TYPES ────────────────────────────────────────────────────────────

export type UserProfileUpdate = Partial<
    Omit<UserProfileRow, 'id' | 'created_at'>
>;
export type ProductUpdate = Partial<Omit<ProductRow, 'id' | 'created_at'>>;
export type OrderUpdate = Partial<Omit<OrderRow, 'id' | 'user_id' | 'created_at'>>;
export type VendorUpdate = Partial<Omit<VendorRow, 'id' | 'user_id' | 'created_at'>>;
export type VendorProductUpdate = Partial<Omit<VendorProductRow, 'id' | 'vendor_id' | 'created_at'>>;
export type VendorOrderUpdate = Partial<Omit<VendorOrderRow, 'id' | 'vendor_id' | 'buyer_id' | 'created_at'>>;

// ─── RESPONSE WRAPPERS ────────────────────────────────────────────────────────

export interface SupabaseResult<T> {
    data: T | null;
    error: string | null;
    count?: number;
}

export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    error: string | null;
}
