import { prisma } from '@/lib/prisma';

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
// RANK CONFIGURATION (Bi-Directional)
// ============================================================================
export const AUTONOMOUS_RANK_CONFIG = {
    // Performance Score Weights
    ACTIVITY_WEIGHT: 0.40,
    RETENTION_WEIGHT: 0.30,
    GROWTH_WEIGHT: 0.30,
    
    // Thresholds
    MIN_UPGRADE_SCORE: 70,
    MIN_DOWNGRADE_SCORE: 50,
    CRITICAL_SCORE: 30,
    
    // Grace Period
    GRACE_PERIOD_DAYS: 30,
    WARNING_BEFORE_DAYS: 15,
    
    // Check Frequency
    PERFORMANCE_CHECK_INTERVAL_DAYS: 1,
    RANK_EVALUATION_INTERVAL_DAYS: 7,
    
    // Notification
    SEND_WARNING_NOTIFICATIONS: true,
    SEND_RANK_CHANGE_NOTIFICATIONS: true,
    
    // Reversal
    ALLOW_RANK_REVERSAL: true,
    REVERSAL_REQUEST_DEADLINE_DAYS: 7,
} as const;

// ============================================================================
// DEFAULT RANK THRESHOLDS (For seeding)
// ============================================================================
export const DEFAULT_RANK_THRESHOLDS = [
    {
        rankName: 'BASE',
        upgradeBusinessTarget: 0,
        upgradeMinPerformanceScore: 0,
        upgradeMinActiveDownline: 0,
        downgradeBusinessTarget: 0,
        downgradeMinPerformanceScore: 0,
        downgradeMinActiveDownline: 0,
        downgradeMaxInactiveMonths: 3,
        gracePeriodDays: 30,
        warningBeforeDowngradeDays: 15,
        level1Percent: 0.20,
        level2Percent: 0.10,
        level3Percent: 0.07,
        level4Percent: 0.05,
        level5Percent: 0.02,
        level6Percent: 0.01,
        badgeColor: 'GRAY',
        benefits: JSON.stringify({ benefits: ['Basic Commission'] }),
    },
    {
        rankName: 'BRONZE',
        upgradeBusinessTarget: 10000000,
        upgradeMinPerformanceScore: 70,
        upgradeMinActiveDownline: 5,
        downgradeBusinessTarget: 5000000,
        downgradeMinPerformanceScore: 50,
        downgradeMinActiveDownline: 3,
        downgradeMaxInactiveMonths: 3,
        gracePeriodDays: 30,
        warningBeforeDowngradeDays: 15,
        level1Percent: 0.21,
        level2Percent: 0.11,
        level3Percent: 0.08,
        level4Percent: 0.06,
        level5Percent: 0.03,
        level6Percent: 0.02,
        badgeColor: 'BRONZE',
        benefits: JSON.stringify({ benefits: ['+1% Commission', 'Email Support', 'Badge'] }),
    },
    {
        rankName: 'SILVER',
        upgradeBusinessTarget: 50000000,
        upgradeMinPerformanceScore: 75,
        upgradeMinActiveDownline: 10,
        downgradeBusinessTarget: 25000000,
        downgradeMinPerformanceScore: 55,
        downgradeMinActiveDownline: 5,
        downgradeMaxInactiveMonths: 3,
        gracePeriodDays: 30,
        warningBeforeDowngradeDays: 15,
        level1Percent: 0.2175,
        level2Percent: 0.1175,
        level3Percent: 0.0875,
        level4Percent: 0.0675,
        level5Percent: 0.0375,
        level6Percent: 0.0275,
        badgeColor: 'SILVER',
        benefits: JSON.stringify({ benefits: ['+1.75% Commission', 'Priority Support', 'Monthly Bonus'] }),
    },
    {
        rankName: 'GOLD',
        upgradeBusinessTarget: 100000000,
        upgradeMinPerformanceScore: 80,
        upgradeMinActiveDownline: 20,
        downgradeBusinessTarget: 50000000,
        downgradeMinPerformanceScore: 60,
        downgradeMinActiveDownline: 10,
        downgradeMaxInactiveMonths: 3,
        gracePeriodDays: 30,
        warningBeforeDowngradeDays: 15,
        level1Percent: 0.2225,
        level2Percent: 0.1225,
        level3Percent: 0.0925,
        level4Percent: 0.0725,
        level5Percent: 0.0425,
        level6Percent: 0.0325,
        badgeColor: 'GOLD',
        benefits: JSON.stringify({ benefits: ['+2.25% Commission', 'Dedicated Manager', 'Quarterly Bonus'] }),
    },
    {
        rankName: 'PLATINUM',
        upgradeBusinessTarget: 250000000,
        upgradeMinPerformanceScore: 85,
        upgradeMinActiveDownline: 50,
        downgradeBusinessTarget: 125000000,
        downgradeMinPerformanceScore: 65,
        downgradeMinActiveDownline: 25,
        downgradeMaxInactiveMonths: 3,
        gracePeriodDays: 30,
        warningBeforeDowngradeDays: 15,
        level1Percent: 0.226,
        level2Percent: 0.126,
        level3Percent: 0.096,
        level4Percent: 0.076,
        level5Percent: 0.046,
        level6Percent: 0.036,
        badgeColor: 'PLATINUM',
        benefits: JSON.stringify({ benefits: ['+2.60% Commission', 'VIP Support', 'Monthly Bonus', 'Event Invites'] }),
    },
    {
        rankName: 'DIAMOND',
        upgradeBusinessTarget: 500000000,
        upgradeMinPerformanceScore: 90,
        upgradeMinActiveDownline: 100,
        downgradeBusinessTarget: 250000000,
        downgradeMinPerformanceScore: 70,
        downgradeMinActiveDownline: 50,
        downgradeMaxInactiveMonths: 3,
        gracePeriodDays: 30,
        warningBeforeDowngradeDays: 15,
        level1Percent: 0.2285,
        level2Percent: 0.1285,
        level3Percent: 0.0985,
        level4Percent: 0.0785,
        level5Percent: 0.0485,
        level6Percent: 0.0385,
        badgeColor: 'DIAMOND',
        benefits: JSON.stringify({ benefits: ['+2.85% Commission', 'Executive Support', 'Annual Bonus', 'Travel Rewards'] }),
    },
    {
        rankName: 'AMBASSADOR',
        upgradeBusinessTarget: 1000000000,
        upgradeMinPerformanceScore: 95,
        upgradeMinActiveDownline: 200,
        downgradeBusinessTarget: 500000000,
        downgradeMinPerformanceScore: 75,
        downgradeMinActiveDownline: 100,
        downgradeMaxInactiveMonths: 3,
        gracePeriodDays: 30,
        warningBeforeDowngradeDays: 15,
        level1Percent: 0.23,
        level2Percent: 0.13,
        level3Percent: 0.10,
        level4Percent: 0.08,
        level5Percent: 0.05,
        level6Percent: 0.04,
        badgeColor: 'AMBASSADOR',
        benefits: JSON.stringify({ benefits: ['+3% Commission', 'Personal Account Manager', 'Equity Options', 'Global Events'] }),
    },
];

// ============================================================================
// TYPES
// ============================================================================
export interface RankEligibilityResult {
    success: boolean;
    userId: string;
    currentRank: string;
    performanceScore: number;
    totalBusiness: number;
    activeDownline: number;
    newBusiness: number;
    inactiveMonths: number;
    upgradeEligible: boolean;
    downgradeTriggered: boolean;
    warningRequired: boolean;
    gracePeriodActive: boolean;
    changeType: 'UPGRADE' | 'DOWNGRADE' | 'NONE';
    newRank: string | null;
    reason: string;
}

export interface RankEvaluationResult {
    success: boolean;
    userId: string;
    periodMonth: string;
    action: 'UPGRADE' | 'DOWNGRADE' | 'MAINTAIN';
    eligibility: RankEligibilityResult;
    rankChangeResult: any;
    notificationRequired: boolean;
}

export interface WarningResult {
    success: boolean;
    warningId: string;
    warningLevel: string;
    deadlineDate: Date;
    notificationSent: boolean;
}

export interface ReversalResult {
    success: boolean;
    message: string;
    restoredRank?: string;
    currentScore?: number;
    requiredScore?: number;
}

export interface BatchEvaluationResult {
    success: boolean;
    totalUsers: number;
    evaluated: number;
    upgraded: number;
    downgraded: number;
    maintained: number;
    errors: number;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function getUserUplineIds(userId: string): Promise<string[]> {
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

    return [
        user?.upline1,
        user?.upline2,
        user?.upline3,
        user?.upline4,
        user?.upline5,
        user?.upline6,
    ].filter(Boolean) as string[];
}

async function calculatePerformanceScore(userId: string, periodMonth: string): Promise<number> {
    const activityScore = await calculateActivityScore(userId, periodMonth);
    const retentionScore = await calculateRetentionScore(userId);
    const growthScore = await calculateGrowthScore(userId, periodMonth);

    const overallScore = (
        activityScore * AUTONOMOUS_RANK_CONFIG.ACTIVITY_WEIGHT +
        retentionScore * AUTONOMOUS_RANK_CONFIG.RETENTION_WEIGHT +
        growthScore * AUTONOMOUS_RANK_CONFIG.GROWTH_WEIGHT
    );

    return Math.min(Math.round(overallScore * 100) / 100, 100);
}

async function calculateActivityScore(userId: string, periodMonth: string): Promise<number> {
    try {
        const [year, month] = periodMonth.split('-').map(Number);
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const uplineIds = await getUserUplineIds(userId);
        if (uplineIds.length === 0) return 0;

        const investments = await prisma.investment.findMany({
            where: {
                userId: { in: uplineIds },
                status: 'ACTIVE',
                startDate: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            select: { amount: true },
        });

        const newBusiness = investments.reduce((sum, inv) => sum + inv.amount, 0);
        return Math.min((newBusiness / 1000000) * 10, 40);
    } catch (error) {
        console.error('Error calculating activity score:', error);
        return 0;
    }
}

async function calculateRetentionScore(userId: string): Promise<number> {
    try {
        const uplineIds = await getUserUplineIds(userId);
        if (uplineIds.length === 0) return 0;

        const downlineUsers = await prisma.user.findMany({
            where: {
                OR: [
                    { upline1: userId },
                    { upline2: userId },
                    { upline3: userId },
                    { upline4: userId },
                    { upline5: userId },
                    { upline6: userId },
                ],
            },
            select: {
                id: true,
                investments: {
                    where: { status: 'ACTIVE' },
                    select: { id: true },
                },
            },
        });

        const activeCount = downlineUsers.filter(u => u.investments.length > 0).length;
        const totalCount = downlineUsers.length;

        if (totalCount === 0) return 0;
        return (activeCount / totalCount) * 30;
    } catch (error) {
        console.error('Error calculating retention score:', error);
        return 0;
    }
}

async function calculateGrowthScore(userId: string, periodMonth: string): Promise<number> {
    try {
        const [year, month] = periodMonth.split('-').map(Number);
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const commissions = await prisma.commissionLog.findMany({
            where: {
                beneficiaryId: userId,
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
                status: 'CREDITED',
            },
            select: { amount: true },
        });

        const commissionEarned = commissions.reduce((sum, c) => sum + c.amount, 0);
        return Math.min((commissionEarned / 100000) * 10, 30);
    } catch (error) {
        console.error('Error calculating growth score:', error);
        return 0;
    }
}

async function getDownlineCounts(userId: string): Promise<{ active: number; inactive: number }> {
    try {
        const downlineUsers = await prisma.user.findMany({
            where: {
                OR: [
                    { upline1: userId },
                    { upline2: userId },
                    { upline3: userId },
                    { upline4: userId },
                    { upline5: userId },
                    { upline6: userId },
                ],
            },
            select: {
                id: true,
                investments: {
                    where: { status: 'ACTIVE' },
                    select: { id: true },
                },
            },
        });

        const active = downlineUsers.filter(u => u.investments.length > 0).length;
        return { active, inactive: downlineUsers.length - active };
    } catch (error) {
        console.error('Error getting downline counts:', error);
        return { active: 0, inactive: 0 };
    }
}

async function getTotalBusinessVolume(userId: string): Promise<number> {
    try {
        const uplineIds = await getUserUplineIds(userId);
        if (uplineIds.length === 0) return 0;

        const investments = await prisma.investment.findMany({
            where: {
                userId: { in: uplineIds },
                status: 'ACTIVE',
            },
            select: { amount: true },
        });

        return investments.reduce((sum, inv) => sum + inv.amount, 0);
    } catch (error) {
        console.error('Error getting total business volume:', error);
        return 0;
    }
}

async function getNewBusinessVolume(userId: string, periodMonth: string): Promise<number> {
    try {
        const [year, month] = periodMonth.split('-').map(Number);
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const uplineIds = await getUserUplineIds(userId);
        if (uplineIds.length === 0) return 0;

        const investments = await prisma.investment.findMany({
            where: {
                userId: { in: uplineIds },
                status: 'ACTIVE',
                startDate: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            select: { amount: true },
        });

        return investments.reduce((sum, inv) => sum + inv.amount, 0);
    } catch (error) {
        console.error('Error getting new business volume:', error);
        return 0;
    }
}

async function getInactiveMonthsCount(userId: string, minScore: number): Promise<number> {
    try {
        const recentMetrics = await prisma.rankPerformanceMetrics.findMany({
            where: {
                userId,
                overallPerformanceScore: { lt: minScore },
            },
            orderBy: { periodMonth: 'desc' },
            take: 3,
        });

        return recentMetrics.length;
    } catch (error) {
        console.error('Error getting inactive months count:', error);
        return 0;
    }
}

// ============================================================================
// SEED RANK THRESHOLDS
// ============================================================================
export async function seedRankThresholds(): Promise<void> {
    for (const threshold of DEFAULT_RANK_THRESHOLDS) {
        await prisma.rankThreshold.upsert({
            where: { rankName: threshold.rankName },
            update: threshold,
            create: threshold,
        });
    }
    console.log('Rank thresholds seeded successfully');
}

// ============================================================================
// MAIN AUTONOMOUS RANK ENGINE CLASS
// ============================================================================
export class AutonomousRankEngine {
    
    async checkRankEligibility(userId: string, periodMonth: string): Promise<RankEligibilityResult> {
        const session = await thinkingOrchestrator.createSession({
            name: 'rank_eligibility_check',
            goal: `Check if user ${userId} is eligible for rank upgrade or downgrade`,
            priority: 'high',
            agent: 'rank-engine',
        });

        await thinkingOrchestrator.addThought({
            sessionId: session.id,
            thought: 'Step 1: Fetching current rank and performance data...',
            thoughtNumber: 1,
            totalThoughts: 6,
            nextThoughtNeeded: true,
            confidence: 0.95,
        });

        // Get current rank from user business volume
        let currentRank = 'BASE';
        const userBV = await prisma.userBusinessVolume.findUnique({
            where: { userId },
        });
        if (userBV?.currentRank) {
            currentRank = userBV.currentRank;
        }

        // Get rank thresholds
        const currentThreshold = await prisma.rankThreshold.findUnique({
            where: { rankName: currentRank },
        });

        if (!currentThreshold) {
            return {
                success: false,
                userId,
                currentRank,
                performanceScore: 0,
                totalBusiness: 0,
                activeDownline: 0,
                newBusiness: 0,
                inactiveMonths: 0,
                upgradeEligible: false,
                downgradeTriggered: false,
                warningRequired: false,
                gracePeriodActive: false,
                changeType: 'NONE',
                newRank: null,
                reason: 'Rank threshold not found',
            };
        }

        // Calculate performance score
        const performanceScore = await calculatePerformanceScore(userId, periodMonth);

        // Get business metrics
        const totalBusiness = await getTotalBusinessVolume(userId);
        const newBusiness = await getNewBusinessVolume(userId, periodMonth);
        const { active: activeDownline } = await getDownlineCounts(userId);
        const inactiveMonths = await getInactiveMonthsCount(userId, currentThreshold.downgradeMinPerformanceScore);

        await thinkingOrchestrator.addThought({
            sessionId: session.id,
            thought: `Step 2: Performance Score: ${performanceScore}, Business: ₹${totalBusiness}, Active Downline: ${activeDownline}, Inactive Months: ${inactiveMonths}`,
            thoughtNumber: 2,
            totalThoughts: 6,
            nextThoughtNeeded: true,
            confidence: 1.0,
        });

        // Get next rank (for upgrade)
        const nextRank = await prisma.rankThreshold.findFirst({
            where: {
                upgradeBusinessTarget: { gt: currentThreshold.upgradeBusinessTarget },
            },
            orderBy: { upgradeBusinessTarget: 'asc' },
        });

        // Get previous rank (for downgrade)
        const prevRank = await prisma.rankThreshold.findFirst({
            where: {
                downgradeBusinessTarget: { lt: currentThreshold.downgradeBusinessTarget },
            },
            orderBy: { downgradeBusinessTarget: 'desc' },
        });

        // Check for active grace period
        const recentWarning = await prisma.rankWarningNotification.findFirst({
            where: {
                userId,
                gracePeriodEnds: { gt: new Date() },
                resolved: false,
            },
            orderBy: { createdAt: 'desc' },
        });
        const gracePeriodActive = !!recentWarning;

        // ========================================================================
        // CHECK UPGRADE ELIGIBILITY
        // ========================================================================
        let upgradeEligible = false;
        let newRank: string | null = null;
        let changeType: 'UPGRADE' | 'DOWNGRADE' | 'NONE' = 'NONE';
        let reason = 'No change';

        if (nextRank) {
            if (totalBusiness >= nextRank.upgradeBusinessTarget &&
                performanceScore >= nextRank.upgradeMinPerformanceScore &&
                activeDownline >= nextRank.upgradeMinActiveDownline) {
                upgradeEligible = true;
                changeType = 'UPGRADE';
                newRank = nextRank.rankName;
                reason = `Upgrade targets met - Business: ₹${totalBusiness}, Score: ${performanceScore}`;
            }
        }

        await thinkingOrchestrator.addThought({
            sessionId: session.id,
            thought: `Step 3: Upgrade eligible: ${upgradeEligible}, Next rank: ${nextRank?.rankName || 'MAX'}`,
            thoughtNumber: 3,
            totalThoughts: 6,
            nextThoughtNeeded: true,
            confidence: 0.95,
        });

        // ========================================================================
        // CHECK DOWNGRADE TRIGGER (Only if not upgrading)
        // ========================================================================
        let downgradeTriggered = false;
        let warningRequired = false;

        if (!upgradeEligible && prevRank) {
            const belowBusinessTarget = totalBusiness < currentThreshold.downgradeBusinessTarget;
            const belowPerformance = performanceScore < currentThreshold.downgradeMinPerformanceScore;
            const belowDownline = activeDownline < currentThreshold.downgradeMinActiveDownline;
            const tooManyInactiveMonths = inactiveMonths >= currentThreshold.downgradeMaxInactiveMonths;

            if (belowBusinessTarget || belowPerformance || belowDownline || tooManyInactiveMonths) {
                downgradeTriggered = true;
                warningRequired = true;
                
                if (!gracePeriodActive) {
                    changeType = 'DOWNGRADE';
                    newRank = prevRank.rankName;
                    reason = `Downgrade threshold triggered - Business: ₹${totalBusiness}, Score: ${performanceScore}, Inactive Months: ${inactiveMonths}`;
                } else {
                    reason = 'Warning issued - Grace period active';
                }
            }
        }

        await thinkingOrchestrator.addThought({
            sessionId: session.id,
            thought: `Step 4: Downgrade triggered: ${downgradeTriggered}, Warning required: ${warningRequired}, Grace period: ${gracePeriodActive}`,
            thoughtNumber: 4,
            totalThoughts: 6,
            nextThoughtNeeded: true,
            confidence: 0.90,
        });

        await thinkingOrchestrator.endSession({
            sessionId: session.id,
            summary: `Eligibility check complete: ${changeType} to ${newRank || currentRank}`,
            decision: { changeType, newRank, performanceScore, totalBusiness },
        });

        return {
            success: true,
            userId,
            currentRank,
            performanceScore,
            totalBusiness,
            activeDownline,
            newBusiness,
            inactiveMonths,
            upgradeEligible,
            downgradeTriggered,
            warningRequired,
            gracePeriodActive,
            changeType,
            newRank,
            reason,
        };
    }

    async evaluateUserRank(userId: string, periodMonth: string): Promise<RankEvaluationResult> {
        const eligibility = await this.checkRankEligibility(userId, periodMonth);

        if (!eligibility.success) {
            return {
                success: false,
                userId,
                periodMonth,
                action: 'MAINTAIN',
                eligibility,
                rankChangeResult: null,
                notificationRequired: false,
            };
        }

        let action: 'UPGRADE' | 'DOWNGRADE' | 'MAINTAIN' = 'MAINTAIN';
        let rankChangeResult = null;

        if (eligibility.changeType === 'UPGRADE') {
            action = 'UPGRADE';
            rankChangeResult = await this.executeRankChange(
                userId,
                'UPGRADE',
                eligibility.newRank!,
                eligibility.reason
            );
        } else if (eligibility.changeType === 'DOWNGRADE') {
            action = 'DOWNGRADE';
            rankChangeResult = await this.executeRankChange(
                userId,
                'DOWNGRADE',
                eligibility.newRank!,
                eligibility.reason
            );

            // Issue warning
            if (eligibility.warningRequired && !eligibility.gracePeriodActive) {
                await this.issueRankWarning({
                    userId,
                    currentRank: eligibility.currentRank,
                    warningType: 'PERFORMANCE_DROP',
                    performanceScore: eligibility.performanceScore,
                    totalBusiness: eligibility.totalBusiness,
                    deadlineDate: new Date(Date.now() + AUTONOMOUS_RANK_CONFIG.GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000),
                });
            }
        }

        // Store performance metrics
        await this.storePerformanceMetrics(userId, periodMonth, eligibility, action);

        return {
            success: true,
            userId,
            periodMonth,
            action,
            eligibility,
            rankChangeResult,
            notificationRequired: action !== 'MAINTAIN',
        };
    }

    async executeRankChange(
        userId: string,
        changeType: 'UPGRADE' | 'DOWNGRADE',
        newRank: string,
        reason: string
    ): Promise<any> {
        const previousRank = await prisma.userBusinessVolume.findUnique({
            where: { userId },
            select: { currentRank: true },
        });

        const prevRankName = previousRank?.currentRank || 'BASE';

        // Get commission structures
        const prevThreshold = await prisma.rankThreshold.findUnique({
            where: { rankName: prevRankName },
        });
        const newThreshold = await prisma.rankThreshold.findUnique({
            where: { rankName: newRank },
        });

        const prevCommission = prevThreshold ? {
            L1: prevThreshold.level1Percent,
            L2: prevThreshold.level2Percent,
            L3: prevThreshold.level3Percent,
            L4: prevThreshold.level4Percent,
            L5: prevThreshold.level5Percent,
            L6: prevThreshold.level6Percent,
        } : null;

        const newCommission = newThreshold ? {
            L1: newThreshold.level1Percent,
            L2: newThreshold.level2Percent,
            L3: newThreshold.level3Percent,
            L4: newThreshold.level4Percent,
            L5: newThreshold.level5Percent,
            L6: newThreshold.level6Percent,
        } : null;

        const commissionDiff = newThreshold && prevThreshold
            ? ((newThreshold.level1Percent - prevThreshold.level1Percent) +
               (newThreshold.level2Percent - prevThreshold.level2Percent) +
               (newThreshold.level3Percent - prevThreshold.level3Percent) +
               (newThreshold.level4Percent - prevThreshold.level4Percent) +
               (newThreshold.level5Percent - prevThreshold.level5Percent) +
               (newThreshold.level6Percent - prevThreshold.level6Percent)) * 100
            : 0;

        // Calculate reversal deadline for downgrades
        const reversalDeadline = changeType === 'DOWNGRADE' && newThreshold
            ? new Date(Date.now() + newThreshold.gracePeriodDays * 24 * 60 * 60 * 1000)
            : null;

        // Update user business volume
        await prisma.userBusinessVolume.upsert({
            where: { userId },
            update: {
                currentRank: newRank,
                rankAchievedAt: changeType === 'UPGRADE' ? new Date() : undefined,
                lastCalculatedAt: new Date(),
            },
            create: {
                userId,
                currentRank: newRank,
                rankAchievedAt: changeType === 'UPGRADE' ? new Date() : undefined,
                lastCalculatedAt: new Date(),
            },
        });

        // Create rank change history
        const history = await prisma.rankChangeHistory.create({
            data: {
                userId,
                previousRank: prevRankName,
                newRank,
                changeType,
                changeReason: reason,
                triggerType: 'AUTO',
                previousCommission: JSON.stringify(prevCommission),
                newCommission: JSON.stringify(newCommission),
                commissionDifference: commissionDiff,
                isReversible: changeType === 'DOWNGRADE',
                reversalDeadline,
            },
        });

        // Create webhook event (simulated)
        console.log(`WEBHOOK: USER_RANK_${changeType}`, {
            userId,
            previousRank: prevRankName,
            newRank,
            changeType,
            reason,
        });

        return {
            success: true,
            previousRank: prevRankName,
            newRank,
            changeType,
            commissionDifference: commissionDiff,
            isReversible: changeType === 'DOWNGRADE',
            reversalDeadline,
            historyId: history.id,
        };
    }

    async issueRankWarning(config: {
        userId: string;
        currentRank: string;
        warningType: string;
        performanceScore: number;
        totalBusiness: number;
        deadlineDate: Date;
    }): Promise<WarningResult> {
        const warningLevel = this.calculateWarningLevel(config.performanceScore);
        const message = this.generateWarningMessage(config);

        const warning = await prisma.rankWarningNotification.create({
            data: {
                userId: config.userId,
                currentRank: config.currentRank,
                warningType: config.warningType,
                warningLevel,
                message,
                actionRequired: 'Improve performance or rank will be downgraded',
                deadlineDate: config.deadlineDate,
                gracePeriodEnds: config.deadlineDate,
            },
        });

        console.log(`WEBHOOK: RANK_WARNING_ISSUED`, {
            userId: config.userId,
            warningId: warning.id,
            warningLevel,
            deadlineDate: config.deadlineDate,
        });

        return {
            success: true,
            warningId: warning.id,
            warningLevel,
            deadlineDate: config.deadlineDate,
            notificationSent: false,
        };
    }

    private calculateWarningLevel(performanceScore: number): string {
        if (performanceScore >= 60) return 'LOW';
        if (performanceScore >= 50) return 'MEDIUM';
        if (performanceScore >= 40) return 'HIGH';
        return 'CRITICAL';
    }

    private generateWarningMessage(config: any): string {
        return `Rank Warning: Your ${config.currentRank} rank is at risk. Current Performance Score: ${config.performanceScore}/100, Business Volume: ₹${config.totalBusiness.toLocaleString()}. Improve within ${AUTONOMOUS_RANK_CONFIG.GRACE_PERIOD_DAYS} days to avoid downgrade.`;
    }

    async storePerformanceMetrics(
        userId: string,
        periodMonth: string,
        eligibility: RankEligibilityResult,
        action: 'UPGRADE' | 'DOWNGRADE' | 'MAINTAIN'
    ): Promise<void> {
        const { active: activeDownline, inactive: inactiveDownline } = await getDownlineCounts(userId);
        const commissionEarned = await this.getCommissionEarned(userId, periodMonth);

        await prisma.rankPerformanceMetrics.upsert({
            where: {
                userId_periodMonth: {
                    userId,
                    periodMonth,
                },
            },
            update: {
                currentRank: eligibility.currentRank,
                newBusinessVolume: eligibility.newBusiness,
                totalBusinessVolume: eligibility.totalBusiness,
                activeDownlineCount: activeDownline,
                inactiveDownlineCount: inactiveDownline,
                commissionEarned,
                activityScore: eligibility.performanceScore * AUTONOMOUS_RANK_CONFIG.ACTIVITY_WEIGHT,
                retentionScore: eligibility.performanceScore * AUTONOMOUS_RANK_CONFIG.RETENTION_WEIGHT,
                growthScore: eligibility.performanceScore * AUTONOMOUS_RANK_CONFIG.GROWTH_WEIGHT,
                overallPerformanceScore: eligibility.performanceScore,
                rankAtMonthEnd: action !== 'MAINTAIN' ? eligibility.newRank : eligibility.currentRank,
                rankChanged: action !== 'MAINTAIN',
                rankChangeType: action,
                upgradeThresholdMet: eligibility.upgradeEligible,
                downgradeThresholdTriggered: eligibility.downgradeTriggered,
                warningIssued: eligibility.warningRequired,
                gracePeriodActive: eligibility.gracePeriodActive,
                calculatedAt: new Date(),
            },
            create: {
                userId,
                periodMonth,
                currentRank: eligibility.currentRank,
                newBusinessVolume: eligibility.newBusiness,
                totalBusinessVolume: eligibility.totalBusiness,
                activeDownlineCount: activeDownline,
                inactiveDownlineCount: inactiveDownline,
                commissionEarned,
                activityScore: eligibility.performanceScore * AUTONOMOUS_RANK_CONFIG.ACTIVITY_WEIGHT,
                retentionScore: eligibility.performanceScore * AUTONOMOUS_RANK_CONFIG.RETENTION_WEIGHT,
                growthScore: eligibility.performanceScore * AUTONOMOUS_RANK_CONFIG.GROWTH_WEIGHT,
                overallPerformanceScore: eligibility.performanceScore,
                rankAtMonthStart: eligibility.currentRank,
                rankAtMonthEnd: action !== 'MAINTAIN' ? eligibility.newRank : eligibility.currentRank,
                rankChanged: action !== 'MAINTAIN',
                rankChangeType: action,
                upgradeThresholdMet: eligibility.upgradeEligible,
                downgradeThresholdTriggered: eligibility.downgradeTriggered,
                warningIssued: eligibility.warningRequired,
                gracePeriodActive: eligibility.gracePeriodActive,
                calculatedAt: new Date(),
            },
        });
    }

    private async getCommissionEarned(userId: string, periodMonth: string): Promise<number> {
        try {
            const [year, month] = periodMonth.split('-').map(Number);
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0);

            const commissions = await prisma.commissionLog.findMany({
                where: {
                    beneficiaryId: userId,
                    createdAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                    status: 'CREDITED',
                },
                select: { amount: true },
            });

            return commissions.reduce((sum, c) => sum + c.amount, 0);
        } catch (error) {
            return 0;
        }
    }

    async processRankReversal(userId: string): Promise<ReversalResult> {
        // Find eligible reversible rank change
        const reversibleChange = await prisma.rankChangeHistory.findFirst({
            where: {
                userId,
                isReversible: true,
                reversed: false,
                reversalDeadline: { gt: new Date() },
            },
            orderBy: { createdAt: 'desc' },
        });

        if (!reversibleChange) {
            return {
                success: false,
                message: 'No eligible rank reversals found',
            };
        }

        // Check if performance improved
        const eligibility = await this.checkRankEligibility(userId, new Date().toISOString().slice(0, 7));

        if (eligibility.performanceScore >= AUTONOMOUS_RANK_CONFIG.MIN_UPGRADE_SCORE) {
            // Reverse the downgrade
            await this.executeRankChange(
                userId,
                'UPGRADE',
                reversibleChange.previousRank,
                'Rank reversal - Performance recovered'
            );

            // Mark as reversed
            await prisma.rankChangeHistory.update({
                where: { id: reversibleChange.id },
                data: {
                    reversed: true,
                    reversedAt: new Date(),
                    reversalReason: 'Performance recovered within grace period',
                },
            });

            console.log(`WEBHOOK: RANK_REVERSED`, {
                userId,
                restoredRank: reversibleChange.previousRank,
            });

            return {
                success: true,
                message: 'Rank successfully restored',
                restoredRank: reversibleChange.previousRank,
            };
        }

        return {
            success: false,
            message: 'Performance not yet sufficient for reversal',
            currentScore: eligibility.performanceScore,
            requiredScore: AUTONOMOUS_RANK_CONFIG.MIN_UPGRADE_SCORE,
        };
    }

    async batchEvaluateAllUsers(periodMonth: string): Promise<BatchEvaluationResult> {
        // Get all users with business volume records
        const users = await prisma.userBusinessVolume.findMany({
            select: { userId: true },
            take: 1000,
        });

        const results = {
            totalUsers: users.length,
            evaluated: 0,
            upgraded: 0,
            downgraded: 0,
            maintained: 0,
            errors: 0,
        };

        for (const { userId } of users) {
            try {
                const result = await this.evaluateUserRank(userId, periodMonth);
                results.evaluated++;

                if (result.action === 'UPGRADE') {
                    results.upgraded++;
                } else if (result.action === 'DOWNGRADE') {
                    results.downgraded++;
                } else {
                    results.maintained++;
                }
            } catch (error) {
                console.error(`Error evaluating user ${userId}:`, error);
                results.errors++;
            }
        }

        console.log(`WEBHOOK: RANK_EVALUATION_BATCH_COMPLETE`, results);

        return {
            success: true,
            ...results,
        };
    }

    async getUserRankStatus(userId: string): Promise<any> {
        const userBV = await prisma.userBusinessVolume.findUnique({
            where: { userId },
        });

        const currentRank = userBV?.currentRank || 'BASE';
        const eligibility = await this.checkRankEligibility(userId, new Date().toISOString().slice(0, 7));

        // Get next and previous ranks
        const currentThreshold = await prisma.rankThreshold.findUnique({
            where: { rankName: currentRank },
        });

        const nextRank = await prisma.rankThreshold.findFirst({
            where: {
                upgradeBusinessTarget: { gt: currentThreshold?.upgradeBusinessTarget || 0 },
            },
            orderBy: { upgradeBusinessTarget: 'asc' },
        });

        const prevRank = await prisma.rankThreshold.findFirst({
            where: {
                downgradeBusinessTarget: { lt: currentThreshold?.downgradeBusinessTarget || 0 },
            },
            orderBy: { downgradeBusinessTarget: 'desc' },
        });

        // Calculate upgrade progress
        let upgradeProgress = 0;
        if (nextRank && currentThreshold) {
            const businessNeeded = nextRank.upgradeBusinessTarget - eligibility.totalBusiness;
            const totalNeeded = nextRank.upgradeBusinessTarget - currentThreshold.downgradeBusinessTarget;
            upgradeProgress = Math.max(0, Math.min(100, ((totalNeeded - businessNeeded) / totalNeeded) * 100));
        }

        // Get active warning
        const activeWarning = await prisma.rankWarningNotification.findFirst({
            where: {
                userId,
                gracePeriodEnds: { gt: new Date() },
                resolved: false,
            },
        });

        // Determine downgrade risk
        let downgradeRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
        if (eligibility.downgradeTriggered) {
            if (eligibility.performanceScore >= 50) downgradeRisk = 'MEDIUM';
            if (eligibility.performanceScore >= 40) downgradeRisk = 'HIGH';
            if (eligibility.performanceScore < 40) downgradeRisk = 'CRITICAL';
        }

        return {
            currentRank,
            performanceScore: eligibility.performanceScore,
            totalBusiness: eligibility.totalBusiness,
            activeDownline: eligibility.activeDownline,
            nextRank: nextRank?.rankName || null,
            previousRank: prevRank?.rankName || null,
            upgradeProgress,
            downgradeRisk,
            gracePeriodActive: !!activeWarning,
            gracePeriodEnds: activeWarning?.gracePeriodEnds,
        };
    }

    async getUserRankHistory(userId: string): Promise<any[]> {
        const history = await prisma.rankChangeHistory.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });

        return history.map(h => ({
            changeType: h.changeType,
            previousRank: h.previousRank,
            newRank: h.newRank,
            changedAt: h.createdAt,
            reason: h.changeReason,
            reversible: h.isReversible,
            reversalDeadline: h.reversalDeadline,
        }));
    }
}

// Singleton instance
export const autonomousRankEngine = new AutonomousRankEngine();
