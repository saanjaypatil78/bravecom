// Vendor Commission and Settlement Calculations
// BRAVECOM Sunray Ecosystem - Task 6: Vendor Management System

import { VendorTier, VENDOR_TIER_CONFIG } from './types';
import { getCommissionRateForTier, getTierForSales } from './vendor';

/**
 * Calculate commission for an order
 */
export function calculateCommission(
    totalAmount: number,
    commissionRate: number
): number {
    return Math.round((totalAmount * commissionRate / 100) * 100) / 100;
}

/**
 * Calculate vendor payout (total - commission)
 */
export function calculateVendorPayout(
    totalAmount: number,
    commissionRate: number
): number {
    const commission = calculateCommission(totalAmount, commissionRate);
    return Math.round((totalAmount - commission) * 100) / 100;
}

/**
 * Get tier upgrade recommendation based on monthly sales
 */
export function getTierUpgradeRecommendation(currentTier: VendorTier, monthlySales: number): {
    shouldUpgrade: boolean;
    newTier: VendorTier | null;
    targetSales: number;
} {
    const currentConfig = VENDOR_TIER_CONFIG[currentTier];
    const targetSales = currentConfig.monthlySalesTarget;

    // If already at highest tier, no upgrade needed
    if (currentTier === VendorTier.DIAMOND) {
        return {
            shouldUpgrade: false,
            newTier: null,
            targetSales: 0
        };
    }

    // Check if sales exceed current tier target
    if (monthlySales > targetSales) {
        const newTier = getTierForSales(monthlySales);
        if (newTier !== currentTier) {
            const newConfig = VENDOR_TIER_CONFIG[newTier];
            return {
                shouldUpgrade: true,
                newTier,
                targetSales: newConfig.monthlySalesTarget
            };
        }
    }

    return {
        shouldUpgrade: false,
        newTier: null,
        targetSales
    };
}

/**
 * Calculate settlement summary for a vendor period
 */
export function calculateSettlement(
    vendorId: string,
    periodStart: Date,
    periodEnd: Date,
    orders: Array<{
        totalAmount: number;
        commissionRate: number;
    }>
): {
    totalSales: number;
    totalCommission: number;
    amountPayable: number;
    orderCount: number;
} {
    let totalSales = 0;
    let totalCommission = 0;

    for (const order of orders) {
        totalSales += order.totalAmount;
        totalCommission += calculateCommission(order.totalAmount, order.commissionRate);
    }

    return {
        totalSales: Math.round(totalSales * 100) / 100,
        totalCommission: Math.round(totalCommission * 100) / 100,
        amountPayable: Math.round((totalSales - totalCommission) * 100) / 100,
        orderCount: orders.length
    };
}

/**
 * Calculate ROI for a product
 */
export function calculateProductROI(
    sellingPrice: number,
    costPrice: number
): number {
    if (costPrice === 0) return 0;
    return Math.round(((sellingPrice - costPrice) / costPrice) * 10000) / 100;
}

/**
 * Calculate tier progress percentage
 */
export function calculateTierProgress(monthlySales: number, tier: VendorTier): number {
    const config = VENDOR_TIER_CONFIG[tier];
    const target = config.monthlySalesTarget;

    if (target === 0) return 100; // Bronze tier - already at max for entry level

    const progress = (monthlySales / target) * 100;
    return Math.min(Math.round(progress * 100) / 100, 100);
}

/**
 * Get next tier info
 */
export function getNextTierInfo(currentTier: VendorTier): {
    tier: VendorTier;
    target: number;
    rate: number;
} | null {
    const tierOrder = [
        VendorTier.BRONZE,
        VendorTier.SILVER,
        VendorTier.GOLD,
        VendorTier.PLATINUM,
        VendorTier.DIAMOND
    ];

    const currentIndex = tierOrder.indexOf(currentTier);

    if (currentIndex === -1 || currentIndex === tierOrder.length - 1) {
        return null; // Already at highest tier
    }

    const nextTier = tierOrder[currentIndex + 1];
    const config = VENDOR_TIER_CONFIG[nextTier];

    return {
        tier: nextTier,
        target: config.monthlySalesTarget,
        rate: config.commissionRate
    };
}

/**
 * Format currency for display (INR)
 */
export function formatINR(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

/**
 * Validate bank account details
 */
export function validateBankDetails(details: {
    accountNumber?: string;
    ifscCode?: string;
    bankName?: string;
}): {
    isValid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    if (!details.accountNumber || details.accountNumber.length < 9) {
        errors.push('Invalid account number');
    }

    if (!details.ifscCode || details.ifscCode.length !== 11) {
        errors.push('Invalid IFSC code');
    }

    if (!details.bankName || details.bankName.length < 2) {
        errors.push('Invalid bank name');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Generate settlement report for vendor
 */
export function generateSettlementReport(
    vendor: {
        id: string;
        businessName: string;
        tier: VendorTier;
        commissionRate: number;
    },
    settlements: Array<{
        periodStart: Date;
        periodEnd: Date;
        totalSales: number;
        commission: number;
        amountPayable: number;
        amountPaid: number;
        status: string;
    }>
): {
    vendorId: string;
    businessName: string;
    currentTier: string;
    currentRate: number;
    totalEarnings: number;
    totalPaid: number;
    totalPending: number;
    settlementCount: number;
    periods: typeof settlements;
} {
    let totalEarnings = 0;
    let totalPaid = 0;

    for (const s of settlements) {
        totalEarnings += s.amountPayable;
        totalPaid += s.amountPaid;
    }

    return {
        vendorId: vendor.id,
        businessName: vendor.businessName,
        currentTier: vendor.tier,
        currentRate: vendor.commissionRate,
        totalEarnings: Math.round(totalEarnings * 100) / 100,
        totalPaid: Math.round(totalPaid * 100) / 100,
        totalPending: Math.round((totalEarnings - totalPaid) * 100) / 100,
        settlementCount: settlements.length,
        periods: settlements
    };
}