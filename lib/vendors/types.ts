// Vendor Module Type Definitions for BRAVECOM Sunray Ecosystem
// Task 6: Vendor Management System

/**
 * Vendor Status Types
 * Represents the approval workflow states
 */
export enum VendorStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    SUSPENDED = 'SUSPENDED'
}

/**
 * Vendor Tier Types
 * Defines the tier levels based on monthly sales targets
 */
export enum VendorTier {
    BRONZE = 'BRONZE',
    SILVER = 'SILVER',
    GOLD = 'GOLD',
    PLATINUM = 'PLATINUM',
    DIAMOND = 'DIAMOND'
}

/**
 * Business Types
 * Categories of business entities
 */
export enum BusinessType {
    INDIVIDUAL = 'INDIVIDUAL',
    PARTNERSHIP = 'PARTNERSHIP',
    PRIVATE_LIMITED = 'PRIVATE_LIMITED',
    PUBLIC_LIMITED = 'PUBLIC_LIMITED',
    LLP = 'LLP',
    TRUST = 'TRUST',
    SOCIETY = 'SOCIETY'
}

/**
 * Product Status Types
 */
export enum ProductStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    DRAFT = 'DRAFT',
    OUT_OF_STOCK = 'OUT_OF_STOCK'
}

/**
 * Order Status Types
 */
export enum OrderStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
    REFUNDED = 'REFUNDED'
}

/**
 * Payment Status Types
 */
export enum PaymentStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED'
}

/**
 * Fulfillment Status Types
 */
export enum FulfillmentStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    FULFILLED = 'FULFILLED',
    FAILED = 'FAILED'
}

/**
 * Settlement Status Types
 */
export enum SettlementStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    PAID = 'PAID',
    FAILED = 'FAILED',
    CANCELLED = 'CANCELLED'
}

/**
 * Vendor Tier Configuration
 * Defines commission rates and sales targets for each tier
 */
export interface VendorTierConfig {
    tier: VendorTier;
    monthlySalesTarget: number;
    commissionRate: number;
    description: string;
}

/**
 * Default tier configurations matching requirements
 */
export const VENDOR_TIER_CONFIG: Record<VendorTier, VendorTierConfig> = {
    [VendorTier.BRONZE]: {
        tier: VendorTier.BRONZE,
        monthlySalesTarget: 0,
        commissionRate: 25.00,
        description: 'Entry level - 25% commission on sales'
    },
    [VendorTier.SILVER]: {
        tier: VendorTier.SILVER,
        monthlySalesTarget: 50000,
        commissionRate: 27.00,
        description: '₹50,000 monthly target - 27% commission'
    },
    [VendorTier.GOLD]: {
        tier: VendorTier.GOLD,
        monthlySalesTarget: 100000,
        commissionRate: 30.00,
        description: '₹1,00,000 monthly target - 30% commission'
    },
    [VendorTier.PLATINUM]: {
        tier: VendorTier.PLATINUM,
        monthlySalesTarget: 500000,
        commissionRate: 35.00,
        description: '₹5,00,000 monthly target - 35% commission'
    },
    [VendorTier.DIAMOND]: {
        tier: VendorTier.DIAMOND,
        monthlySalesTarget: 1000000,
        commissionRate: 40.00,
        description: '₹10,00,000 monthly target - 40% commission'
    }
};

/**
 * Vendor Registration Input
 * Data required to register as a vendor
 */
export interface VendorRegistrationInput {
    businessName: string;
    businessType: BusinessType;
    description?: string;
    gstNumber?: string;
    bankAccountNumber?: string;
    bankName?: string;
    bankBranch?: string;
    ifscCode?: string;
    kycVerified: boolean;
}

/**
 * Vendor Profile Update Input
 */
export interface VendorProfileUpdateInput {
    businessName?: string;
    businessType?: BusinessType;
    description?: string;
    gstNumber?: string;
    bankAccountNumber?: string;
    bankName?: string;
    bankBranch?: string;
    ifscCode?: string;
}

/**
 * Product Input
 * Data required to create/update a product
 */
export interface ProductInput {
    name: string;
    description?: string;
    category?: string;
    tags?: string[];
    mrp: number;
    sellingPrice: number;
    commission?: number;
    inventory?: number;
    images?: string[];
    roiPercentage?: number;
}

/**
 * Order Input
 */
export interface OrderInput {
    vendorId: string;
    productId: string;
    quantity: number;
    unitPrice: number;
}

/**
 * Pagination Parameters
 */
export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

/**
 * API Response Types
 */
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}