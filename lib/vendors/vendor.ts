// Vendor Data Models for BRAVECOM Sunray Ecosystem
// Task 6: Vendor Management System

import {
    VendorStatus,
    VendorTier,
    BusinessType,
    ProductStatus,
    OrderStatus,
    PaymentStatus,
    FulfillmentStatus,
    SettlementStatus
} from './types';

/**
 * Database Model: Vendor
 */
export interface Vendor {
    id: string;
    userId: string;
    businessName: string;
    businessType: BusinessType | null;
    description: string | null;
    gstNumber: string | null;
    status: VendorStatus;
    tier: VendorTier;
    commissionRate: number;
    monthlySales: number;
    totalSales: number;
    approvedAt: Date | null;
    approvedBy: string | null;
    bankAccountNumber: string | null;
    bankName: string | null;
    bankBranch: string | null;
    ifscCode: string | null;
    kycVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Database Model: Vendor Product
 */
export interface VendorProduct {
    id: string;
    vendorId: string;
    name: string;
    description: string | null;
    category: string | null;
    tags: string[] | null;
    mrp: number;
    sellingPrice: number;
    commission: number;
    inventory: number;
    status: ProductStatus;
    images: string[] | null;
    roiPercentage: number | null;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Database Model: Vendor Order
 */
export interface VendorOrder {
    id: string;
    orderNumber: string;
    vendorId: string;
    buyerId: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
    commissionAmount: number;
    vendorPayout: number;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    fulfillmentStatus: FulfillmentStatus;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Database Model: Vendor Settlement
 */
export interface VendorSettlement {
    id: string;
    vendorId: string;
    periodStart: Date;
    periodEnd: Date;
    totalSales: number;
    commission: number;
    amountPayable: number;
    amountPaid: number;
    status: SettlementStatus;
    paidAt: Date | null;
    createdAt: Date;
}

/**
 * Vendor with User Relations
 */
export interface VendorWithUser extends Vendor {
    user?: {
        id: string;
        name: string;
        email: string;
        phone?: string;
    };
    approvedByUser?: {
        id: string;
        name: string;
    };
}

/**
 * Vendor Product with Vendor Info
 */
export interface VendorProductWithVendor extends VendorProduct {
    vendor?: {
        id: string;
        businessName: string;
        tier: VendorTier;
        status: VendorStatus;
    };
}

/**
 * Order with Product and Vendor Info
 */
export interface VendorOrderWithDetails extends VendorOrder {
    product?: {
        id: string;
        name: string;
        category: string | null;
        images: string[] | null;
    };
    vendor?: {
        id: string;
        businessName: string;
    };
    buyer?: {
        id: string;
        name: string;
        email: string;
    };
}

/**
 * Settlement with Vendor Info
 */
export interface VendorSettlementWithVendor extends VendorSettlement {
    vendor?: {
        id: string;
        businessName: string;
        bankAccountNumber: string | null;
        bankName: string | null;
        ifscCode: string | null;
    };
}

/**
 * Helper function to create default vendor object
 */
export function createDefaultVendor(userId: string, input: {
    businessName: string;
    businessType?: BusinessType;
    description?: string;
    gstNumber?: string;
    bankAccountNumber?: string;
    bankName?: string;
    bankBranch?: string;
    ifscCode?: string;
}): Partial<Vendor> {
    return {
        userId,
        businessName: input.businessName,
        businessType: input.businessType || null,
        description: input.description || null,
        gstNumber: input.gstNumber || null,
        status: VendorStatus.PENDING,
        tier: VendorTier.BRONZE,
        commissionRate: 25.00,
        monthlySales: 0,
        totalSales: 0,
        bankAccountNumber: input.bankAccountNumber || null,
        bankName: input.bankName || null,
        bankBranch: input.bankBranch || null,
        ifscCode: input.ifscCode || null,
        kycVerified: false,
        approvedAt: null,
        approvedBy: null
    };
}

/**
 * Helper function to create default product object
 */
export function createDefaultProduct(vendorId: string, input: {
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
}): Partial<VendorProduct> {
    const commission = input.commission || 0;
    return {
        vendorId,
        name: input.name,
        description: input.description || null,
        category: input.category || null,
        tags: input.tags || null,
        mrp: input.mrp,
        sellingPrice: input.sellingPrice,
        commission,
        inventory: input.inventory || 0,
        status: ProductStatus.ACTIVE,
        images: input.images || null,
        roiPercentage: input.roiPercentage || null
    };
}

/**
 * Calculate order amounts
 */
export function calculateOrderAmounts(
    quantity: number,
    unitPrice: number,
    commissionRate: number
): {
    totalAmount: number;
    commissionAmount: number;
    vendorPayout: number;
} {
    const totalAmount = quantity * unitPrice;
    const commissionAmount = (totalAmount * commissionRate) / 100;
    const vendorPayout = totalAmount - commissionAmount;

    return {
        totalAmount: Math.round(totalAmount * 100) / 100,
        commissionAmount: Math.round(commissionAmount * 100) / 100,
        vendorPayout: Math.round(vendorPayout * 100) / 100
    };
}

/**
 * Determine tier based on monthly sales
 */
export function getTierForSales(monthlySales: number): VendorTier {
    if (monthlySales >= 1000000) return VendorTier.DIAMOND;
    if (monthlySales >= 500000) return VendorTier.PLATINUM;
    if (monthlySales >= 100000) return VendorTier.GOLD;
    if (monthlySales >= 50000) return VendorTier.SILVER;
    return VendorTier.BRONZE;
}

/**
 * Get commission rate for tier
 */
export function getCommissionRateForTier(tier: VendorTier): number {
    const rates: Record<VendorTier, number> = {
        [VendorTier.BRONZE]: 25.00,
        [VendorTier.SILVER]: 27.00,
        [VendorTier.GOLD]: 30.00,
        [VendorTier.PLATINUM]: 35.00,
        [VendorTier.DIAMOND]: 40.00
    };
    return rates[tier];
}

/**
 * Generate unique order number
 */
export function generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD-${timestamp}-${random}`;
}

/**
 * Generate settlement period
 */
export function getCurrentSettlementPeriod(): { start: Date; end: Date } {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return {
        start,
        end
    };
}
