import { prisma } from '@/lib/prisma';

// Import assuming thinkingOrchestrator exists or mock if it throws error
let thinkingOrchestrator: any;
try {
    thinkingOrchestrator = require('@/lib/mcp/sequential-thinking').thinkingOrchestrator;
} catch (e) {
    thinkingOrchestrator = {
        createSession: async () => ({ id: 'fallback-session' }),
        addThought: async () => { },
        endSession: async () => { },
    };
}

// ============================================================================
// COMMISSION CONFIGURATION
// ============================================================================
export const COMMISSION_CONFIG = {
    // Base Commission (Before Royalty)
    BASE_COMMISSION: {
        L1: 0.20,
        L2: 0.10,
        L3: 0.07,
        L4: 0.05,
        L5: 0.02,
        L6: 0.01,
        TOTAL: 0.45,
    },

    // Admin Charges
    ADMIN_CHARGE_PERCENT: 0.10, // 10% of commission

    // Franchise Ranks (Progressive)
    FRANCHISE_RANKS: [
        {
            rank: 'BASE',
            target: 0,
            royaltyAddon: 0.0000,
            commissions: { L1: 0.2000, L2: 0.1000, L3: 0.0700, L4: 0.0500, L5: 0.0200, L6: 0.0100 },
            badge: 'GRAY',
        },
        {
            rank: 'BRONZE',
            target: 10000000, // ₹1 Crore
            royaltyAddon: 0.0100,
            commissions: { L1: 0.2100, L2: 0.1100, L3: 0.0800, L4: 0.0600, L5: 0.0300, L6: 0.0200 },
            badge: 'BRONZE',
        },
        {
            rank: 'SILVER',
            target: 50000000, // ₹5 Crore
            royaltyAddon: 0.0175,
            commissions: { L1: 0.2175, L2: 0.1175, L3: 0.0875, L4: 0.0675, L5: 0.0375, L6: 0.0275 },
            badge: 'SILVER',
        },
        {
            rank: 'GOLD',
            target: 100000000, // ₹10 Crore
            royaltyAddon: 0.0225,
            commissions: { L1: 0.2225, L2: 0.1225, L3: 0.0925, L4: 0.0725, L5: 0.0425, L6: 0.0325 },
            badge: 'GOLD',
        },
        {
            rank: 'PLATINUM',
            target: 250000000, // ₹25 Crore
            royaltyAddon: 0.0260,
            commissions: { L1: 0.2260, L2: 0.1260, L3: 0.0960, L4: 0.0760, L5: 0.0460, L6: 0.0360 },
            badge: 'PLATINUM',
        },
        {
            rank: 'DIAMOND',
            target: 500000000, // ₹50 Crore
            royaltyAddon: 0.0285,
            commissions: { L1: 0.2285, L2: 0.1285, L3: 0.0985, L4: 0.0785, L5: 0.0485, L6: 0.0385 },
            badge: 'DIAMOND',
        },
        {
            rank: 'AMBASSADOR',
            target: 1000000000, // ₹100 Crore
            royaltyAddon: 0.0300,
            commissions: { L1: 0.2300, L2: 0.1300, L3: 0.1000, L4: 0.0800, L5: 0.0500, L6: 0.0400 },
            badge: 'AMBASSADOR',
        },
    ],

    // Investment Profit
    INVESTOR_PROFIT_PERCENT: 0.15, // 15% flat

    // Recurring
    RECURRING_MONTHS: 12,
    PAYOUT_INTERVAL_DAYS: 30,
} as const;

// ============================================================================
// TYPES
// ============================================================================
export interface RankCalculationResult {
    success: boolean;
    userId: string;
    currentRank: string;
    totalBusiness: number;
    nextRank: string | null;
    businessNeededForNext: number;
    progressPercentage: number;
    commissionStructure: { L1: number; L2: number; L3: number; L4: number; L5: number; L6: number };
    badge: string;
}

export interface CommissionCalculationResult {
    success: boolean;
    uplineUserId: string;
    downlineInvestmentId: string;
    level: number;
    investmentAmount: number;
    commissionPercentage: number;
    commissionAmount: number;
    adminCharge: number;
    paidCommission: number;
    userRank: string;
    badge: string;
}

export interface AllLevelCommissionResult {
    success: boolean;
    uplineUserId: string;
    downlineInvestmentId: string;
    commissions: CommissionCalculationResult[];
    totalCommission: number;
    totalAdmin: number;
    totalPaid: number;
    effectiveRate: number;
}

// ============================================================================
// PROGRESSIVE COMMISSION CALCULATOR
// ============================================================================
export class ProgressiveCommissionCalculator {
    // ============================================================================
    // CALCULATE USER RANK (Based on Business Volume)
    // ============================================================================
    async calculateUserRank(userId: string): Promise<RankCalculationResult> {
        const session = await thinkingOrchestrator.createSession({
            name: 'rank_calculation',
            goal: `Calculate progressive rank for user ${userId} based on business volume`,
            priority: 'high',
            agent: 'commission-calculator',
        });

        await thinkingOrchestrator.addThought({
            sessionId: session.id,
            thought: 'Step 1: Calculating total business volume from downline investments...',
            thoughtNumber: 1,
            totalThoughts: 5,
            nextThoughtNeeded: true,
            confidence: 0.95,
        });

        // Find the user to get uplines 1-6
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                upline1: true,
                upline2: true,
                upline3: true,
                upline4: true,
                upline5: true,
                upline6: true,
            }
        });

        const uplineIds = [
            user?.upline1,
            user?.upline2,
            user?.upline3,
            user?.upline4,
            user?.upline5,
            user?.upline6
        ].filter(Boolean) as string[];

        // Calculate total business volume
        let totalBusiness = 0;
        if (uplineIds.length > 0) {
            const investments = await prisma.investment.findMany({
                where: {
                    userId: { in: uplineIds },
                    status: 'ACTIVE'
                },
                select: { amount: true }
            });
            totalBusiness = investments.reduce((sum, inv) => sum + inv.amount, 0);
        }

        await thinkingOrchestrator.addThought({
            sessionId: session.id,
            thought: `Step 2: Total business volume calculated: ₹${totalBusiness.toLocaleString()}`,
            thoughtNumber: 2,
            totalThoughts: 5,
            nextThoughtNeeded: true,
            confidence: 1.0,
        });

        // Determine rank
        const rank = COMMISSION_CONFIG.FRANCHISE_RANKS.slice().reverse().find(r => totalBusiness >= r.target) || COMMISSION_CONFIG.FRANCHISE_RANKS[0];

        await thinkingOrchestrator.addThought({
            sessionId: session.id,
            thought: `Step 3: Rank determined: ${rank.rank} (Target: ₹${(rank.target / 10000000).toFixed(1)} Crore)`,
            thoughtNumber: 3,
            totalThoughts: 5,
            nextThoughtNeeded: true,
            confidence: 1.0,
        });

        // Calculate next rank
        const nextRank = COMMISSION_CONFIG.FRANCHISE_RANKS.find(r => r.target > totalBusiness);
        const businessNeeded = nextRank ? nextRank.target - totalBusiness : 0;
        const progressPercentage = rank.target === 0 && !nextRank ? 100 : (nextRank ? (totalBusiness / nextRank.target) * 100 : 100);

        await thinkingOrchestrator.addThought({
            sessionId: session.id,
            thought: `Step 4: Next rank: ${nextRank?.rank || 'MAX'}, Business needed: ₹${(businessNeeded / 10000000).toFixed(2)} Crore, Progress: ${progressPercentage.toFixed(2)}%`,
            thoughtNumber: 4,
            totalThoughts: 5,
            nextThoughtNeeded: true,
            confidence: 0.95,
        });

        // Get current rank to check if it changed
        let userBusinessVolume = await prisma.userBusinessVolume.findUnique({
            where: { userId }
        });

        const previousRank = userBusinessVolume?.currentRank || 'BASE';
        const rankChanged = previousRank !== rank.rank;

        // Update user rank in database
        userBusinessVolume = await prisma.userBusinessVolume.upsert({
            where: { userId },
            update: {
                totalBusiness,
                currentRank: rank.rank,
                nextRank: nextRank?.rank,
                businessNeededForNext: businessNeeded,
                progressPercentage: Math.min(progressPercentage, 100),
                rankAchievedAt: rankChanged ? new Date() : (userBusinessVolume?.rankAchievedAt || new Date()),
                lastCalculatedAt: new Date(),
            },
            create: {
                userId,
                totalBusiness,
                currentRank: rank.rank,
                nextRank: nextRank?.rank,
                businessNeededForNext: businessNeeded,
                progressPercentage: Math.min(progressPercentage, 100),
                rankAchievedAt: new Date(),
                lastCalculatedAt: new Date(),
            }
        });

        // Log commission structure change if rank changed
        if (rankChanged) {
            const prevRankData = COMMISSION_CONFIG.FRANCHISE_RANKS.find(r => r.rank === previousRank) || COMMISSION_CONFIG.FRANCHISE_RANKS[0];
            await prisma.commissionStructureHistory.create({
                data: {
                    userId,
                    previousRank,
                    newRank: rank.rank,
                    previousCommission: JSON.stringify(prevRankData.commissions),
                    newCommission: JSON.stringify(rank.commissions),
                    businessVolume: totalBusiness,
                }
            });
        }

        await thinkingOrchestrator.addThought({
            sessionId: session.id,
            thought: 'Step 5: User rank updated in database with commission structure history',
            thoughtNumber: 5,
            totalThoughts: 5,
            nextThoughtNeeded: false,
            confidence: 0.95,
        });

        await thinkingOrchestrator.endSession({
            sessionId: session.id,
            summary: `Rank calculated: ${rank.rank}, Business: ₹${totalBusiness.toLocaleString()}, Progress: ${progressPercentage.toFixed(2)}%`,
            decision: { rank, totalBusiness, nextRank, businessNeeded, progressPercentage },
        });

        return {
            success: true,
            userId,
            currentRank: rank.rank,
            totalBusiness,
            nextRank: nextRank?.rank || null,
            businessNeededForNext: businessNeeded,
            progressPercentage: Math.min(progressPercentage, 100),
            commissionStructure: rank.commissions,
            badge: rank.badge,
        };
    }

    // ============================================================================
    // CALCULATE REFERRAL COMMISSION (Progressive Based on Rank)
    // ============================================================================
    async calculateReferralCommission(
        uplineUserId: string,
        downlineInvestmentId: string,
        level: number
    ): Promise<CommissionCalculationResult> {
        // Get upline user's rank
        const rankResult = await this.calculateUserRank(uplineUserId);

        // Get investment amount
        const investment = await prisma.investment.findUnique({
            where: { id: downlineInvestmentId }
        });

        if (!investment) {
            throw new Error('Investment not found');
        }

        // Get commission percentage based on level and rank
        const commissionPercent = rankResult.commissionStructure[`L${level}` as keyof typeof rankResult.commissionStructure] as number;

        // Calculate commission
        const investmentAmount = investment.amount;
        const commissionAmount = investmentAmount * commissionPercent;
        const adminCharge = commissionAmount * COMMISSION_CONFIG.ADMIN_CHARGE_PERCENT;
        const paidCommission = commissionAmount - adminCharge;

        return {
            success: true,
            uplineUserId,
            downlineInvestmentId,
            level,
            investmentAmount,
            commissionPercentage: commissionPercent,
            commissionAmount,
            adminCharge,
            paidCommission,
            userRank: rankResult.currentRank,
            badge: rankResult.badge,
        };
    }

    // ============================================================================
    // CALCULATE ALL LEVEL COMMISSIONS (For One Downline Investment)
    // ============================================================================
    async calculateAllLevelCommissions(
        uplineUserId: string,
        downlineInvestmentId: string
    ): Promise<AllLevelCommissionResult> {
        const commissions: CommissionCalculationResult[] = [];
        let totalCommission = 0;
        let totalAdmin = 0;
        let totalPaid = 0;

        for (let level = 1; level <= 6; level++) {
            const commission = await this.calculateReferralCommission(uplineUserId, downlineInvestmentId, level);
            commissions.push(commission);
            totalCommission += commission.commissionAmount;
            totalAdmin += commission.adminCharge;
            totalPaid += commission.paidCommission;
        }

        return {
            success: true,
            uplineUserId,
            downlineInvestmentId,
            commissions,
            totalCommission,
            totalAdmin,
            totalPaid,
            effectiveRate: totalCommission / commissions[0].investmentAmount,
        };
    }
}

// Singleton instance
export const progressiveCommissionCalculator = new ProgressiveCommissionCalculator();
