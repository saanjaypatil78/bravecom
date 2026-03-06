/**
 * BRAVECOM - Sunray Referral System & Static ROI Engine
 * 
 * Logic:
 * - Investor Static ROI: 15% monthly on active investment.
 * - Initial Payout: 45 days (1.5 months) = 22.5% ROI
 * - Subsequent Payouts: 30 days = 15% ROI
 * - Direct Referral Commission: 20% of Investor's Payout.
 * - Indirect Levels (2-6): Halving decay (10%, 5%, 2.5%, 1.25%, 0.625% of payout)
 */

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// These rates represent the percentage of the INVESTOR'S PAYOUT that uplines receive.
// Based on the INVESTMENT PLAN.xlsx 15-Level structure (Converted to decimals representing direct percentage on ROI)
export const UPLINE_PAYOUT_RATES: Record<number, number> = {
    1: 0.20,      // Level 1: 20%
    2: 0.10,      // Level 2: 10%
    3: 0.07,      // Level 3: 7%
    4: 0.05,      // Level 4: 5%
    5: 0.02,      // Level 5: 2%
    6: 0.01,      // Level 6: 1%
    // The exact fractions for L7-L15 are derived from proportional distribution in the sheet, 
    // approximated below to maintain the decreasing curve.
    7: 0.0075,    // Level 7: 0.75%
    8: 0.005,     // Level 8: 0.5%
    9: 0.0035,    // Level 9: 0.35%
    10: 0.0025,   // Level 10: 0.25%
    11: 0.0015,   // Level 11: 0.15%
    12: 0.001,    // Level 12: 0.1%
    13: 0.00075,  // Level 13: 0.075%
    14: 0.0005,   // Level 14: 0.05%
    15: 0.00025,  // Level 15: 0.025%
};

/**
 * Walk up the referral chain from a given user and return upline user IDs with levels.
 */
export async function getUplineChain(userId: string): Promise<{ userId: string; level: number }[]> {
    const chain: { userId: string; level: number }[] = [];
    let currentUserId = userId;

    for (let level = 1; level <= 15; level++) {
        const referral = await prisma.referral.findUnique({
            where: { referredUserId: currentUserId },
            include: { referrer: true },
        });

        if (!referral) break;
        chain.push({ userId: referral.referrerId, level });
        currentUserId = referral.referrerId;
    }

    return chain;
}

/**
 * Check if an investment is due for distribution and return the calculation details.
 */
export function calculateDistribution(
    startDate: Date,
    lastDistributionDate: Date | null,
    amount: number
): { isDue: boolean; payoutAmount: number; isInitial: boolean } {
    const now = new Date();
    const msPerDay = 86400000;

    if (!lastDistributionDate) {
        // First distribution after 45 days
        const daysSinceStart = (now.getTime() - new Date(startDate).getTime()) / msPerDay;
        if (daysSinceStart >= 45) {
            // 22.5% payout (1.5 months * 15%)
            return { isDue: true, payoutAmount: amount * 0.225, isInitial: true };
        }
    } else {
        // Subsequent distributions every 30 days
        const daysSinceLast = (now.getTime() - new Date(lastDistributionDate).getTime()) / msPerDay;
        if (daysSinceLast >= 30) {
            // 15% payout (1 month * 15%)
            return { isDue: true, payoutAmount: amount * 0.15, isInitial: false };
        }
    }

    return { isDue: false, payoutAmount: 0, isInitial: false };
}

/**
 * Distribute the investor's ROI and upline commissions for a specific investment.
 */
export async function distributeCommissions(investmentId: string): Promise<{
    distributed: boolean;
    investorPayout: number;
    logs: { beneficiaryId: string; amount: number; level: number }[];
}> {
    const investment = await prisma.investment.findUnique({
        where: { id: investmentId },
    });

    if (!investment || investment.status !== "ACTIVE") {
        return { distributed: false, investorPayout: 0, logs: [] };
    }

    // Determine due state and payout amount
    const lastLog = await prisma.commissionLog.findFirst({
        where: { sourceUserId: investment.userId, level: 0 },
        orderBy: { createdAt: "desc" },
    });

    const calc = calculateDistribution(investment.startDate, lastLog?.createdAt || null, investment.amount);

    if (!calc.isDue) {
        return { distributed: false, investorPayout: 0, logs: [] };
    }

    const logs: { beneficiaryId: string; amount: number; level: number }[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transactions: any[] = [];
    const baseTxnId = `TXN-${Date.now()}-${investment.userId.slice(0, 4)}`;

    // 1. Payout to the Investor (Level 0)
    // Phase 6 Pivot: Investor gets the full 15% ROI without admin deductions. Admin fee is a separate corporate liability.
    const investorNetAmount = calc.payoutAmount;

    transactions.push(
        prisma.commissionLog.create({
            data: {
                transactionId: `${baseTxnId}-INV`,
                sourceUserId: investment.userId,
                beneficiaryId: investment.userId,
                amount: investorNetAmount,
                level: 0,
                status: "CREDITED",
            },
        }),
        prisma.user.update({
            where: { id: investment.userId },
            data: { walletBalance: { increment: investorNetAmount } },
        })
    );
    logs.push({ beneficiaryId: investment.userId, amount: investorNetAmount, level: 0 });

    // 2. Payout to Upline Chain (Levels 1 to 15)
    const uplineChain = await getUplineChain(investment.userId);

    for (const { userId: beneficiaryId, level } of uplineChain) {
        const rate = UPLINE_PAYOUT_RATES[level] || 0;
        const grossCommission = calc.payoutAmount * rate; // Commission is proportional to the investor's gross payout
        const netCommission = grossCommission; // No admin deduction on referral comms based on new pivot math.

        if (netCommission > 0) {
            transactions.push(
                prisma.commissionLog.create({
                    data: {
                        transactionId: `${baseTxnId}-L${level}`,
                        sourceUserId: investment.userId,
                        beneficiaryId,
                        amount: netCommission,
                        level,
                        status: "CREDITED",
                    },
                }),
                prisma.user.update({
                    where: { id: beneficiaryId },
                    data: { walletBalance: { increment: netCommission } },
                })
            );
            logs.push({ beneficiaryId, amount: netCommission, level });
        }
    }

    await prisma.$transaction(transactions);

    // After successfully distributing to the uplines, re-evaluate their Royalty Tiers
    // This runs outside the transaction to prevent huge locks on the whole chain's downlines
    for (const { userId: beneficiaryId } of uplineChain) {
        await checkAndUpgradeRoyaltyTier(beneficiaryId);
    }
    // And also check the base investor
    await checkAndUpgradeRoyaltyTier(investment.userId);

    return { distributed: true, investorPayout: calc.payoutAmount, logs };
}

/**
 * Run the full distribution cycle for ALL active investments due for payout.
 */
export async function runDistributionCycle(): Promise<{
    processedCount: number;
    totalPayout: number;
}> {
    const activeInvestments = await prisma.investment.findMany({
        where: { status: "ACTIVE" },
    });

    let processedCount = 0;
    let totalPayout = 0;

    for (const inv of activeInvestments) {
        const lastLog = await prisma.commissionLog.findFirst({
            where: { sourceUserId: inv.userId, level: 0 },
            orderBy: { createdAt: "desc" },
        });

        const calc = calculateDistribution(inv.startDate, lastLog?.createdAt || null, inv.amount);

        if (calc.isDue) {
            const result = await distributeCommissions(inv.id);
            if (result.distributed) {
                processedCount++;
                totalPayout += result.logs.reduce((s, l) => s + l.amount, 0);
            }
        }
    }

    return { processedCount, totalPayout };
}

/**
 * Calculate total active investment volume of a user's entire downline network
 * up to 15 levels deep.
 */
export async function getNetworkVolume(userId: string): Promise<number> {
    let totalVolume = 0;

    // Level 1 referrals
    let currentLevelUsers = await prisma.referral.findMany({
        where: { referrerId: userId },
        select: { referredUserId: true }
    });

    for (let level = 1; level <= 15; level++) {
        if (currentLevelUsers.length === 0) break;

        const userIds = currentLevelUsers.map(u => u.referredUserId);

        // Sum active investments for these users
        const investments = await prisma.investment.findMany({
            where: {
                userId: { in: userIds },
                status: "ACTIVE"
            }
        });

        totalVolume += investments.reduce((sum, inv) => sum + inv.amount, 0);

        // Get next level
        if (level < 15) {
            currentLevelUsers = await prisma.referral.findMany({
                where: { referrerId: { in: userIds } },
                select: { referredUserId: true }
            });
        }
    }

    return totalVolume;
}

/**
 * Royalty Tiers definitions (Thresholds in INR)
 */
export const ROYALTY_TIERS = [
    { name: "AMBASSADOR", threshold: 1000000000, rate: 0.0015 }, // 100 Crore
    { name: "DIAMOND", threshold: 500000000, rate: 0.0025 },    // 50 Crore
    { name: "PLATINUM", threshold: 250000000, rate: 0.0035 },   // 25 Crore
    { name: "GOLD", threshold: 100000000, rate: 0.0050 },       // 10 Crore
    { name: "SILVER", threshold: 50000000, rate: 0.0075 },      // 5 Crore
    { name: "BRONZE", threshold: 10000000, rate: 0.0100 },      // 1 Crore
];

/**
 * Evaluates a user's network volume and upgrades their Royalty Tier if necessary.
 */
export async function checkAndUpgradeRoyaltyTier(userId: string): Promise<{ upgraded: boolean, newTier: string }> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { royaltyTier: true }
    });

    if (!user) return { upgraded: false, newTier: "NONE" };

    const networkVolume = await getNetworkVolume(userId);
    let newTier = "NONE";

    for (const tier of ROYALTY_TIERS) {
        if (networkVolume >= tier.threshold) {
            newTier = tier.name;
            break; // Found highest applicable tier
        }
    }

    // Only update if tier has improved (assuming array is sorted High -> Low)
    if (newTier !== "NONE" && user.royaltyTier !== newTier) {
        // We'll trust the descending order. If they hit a higher tier, it's an upgrade.
        const currentIndex = ROYALTY_TIERS.findIndex(t => t.name === user.royaltyTier);
        const newIndex = ROYALTY_TIERS.findIndex(t => t.name === newTier);

        // If current is NONE (index -1) or new index is higher (closer to 0/AMBASSADOR)
        if (currentIndex === -1 || newIndex < currentIndex) {
            await prisma.user.update({
                where: { id: userId },
                data: { royaltyTier: newTier }
            });
            return { upgraded: true, newTier };
        }
    }

    return { upgraded: false, newTier: user.royaltyTier };
}
