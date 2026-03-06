import { createSupabaseServerClient } from '@/lib/supabase/server';
import { thinkingOrchestrator } from '@/lib/mcp/sequential-thinking';
import { cacheGet, cacheSet } from '@/lib/cache/upstash-free-tier';
import { sendMonthlyRoyaltyProofEmail } from '@/lib/emailService';

// ============================================================================
// FRANCHISE ROYALTY CONFIGURATION (Optimized)
// ============================================================================
export const FRANCHISE_CONFIG = {
    // Royalty calculated on PROFIT, not principal
    CALCULATION_BASE: 'PROFIT' as const,

    // Overall royalty pool
    TOTAL_ROYALTY_POOL: 0.03, // 3% of profit pool

    // Effective rate on corpus (the Hidden Gem!)
    EFFECTIVE_RATE_ON_CORPUS: 0.02, // ~2% (saves 1%)

    // Monthly savings at scale
    SAVINGS_AT_100_CRORE: 10000000, // rs 1 Crore/month
    SAVINGS_AT_500_CRORE: 50000000, // rs 5 Crore/month
    SAVINGS_AT_1000_CRORE: 100000000, // rs 10 Crore/month

    // Franchise ranks with targets
    RANKS: [
        { rank: 'BRONZE', target: 10000000, royalty: 0.0100, referralBonus: 0.00 },
        { rank: 'SILVER', target: 50000000, royalty: 0.0075, referralBonus: 0.01 },
        { rank: 'GOLD', target: 100000000, royalty: 0.0050, referralBonus: 0.02 },
        { rank: 'PLATINUM', target: 250000000, royalty: 0.0035, referralBonus: 0.03 },
        { rank: 'DIAMOND', target: 500000000, royalty: 0.0025, referralBonus: 0.04 },
        { rank: 'AMBASSADOR', target: 1000000000, royalty: 0.0015, referralBonus: 0.05 },
    ],

    // Referral commission percentages (on profit)
    REFERRAL_LEVELS: [
        { level: 1, percentage: 0.20 },
        { level: 2, percentage: 0.10 },
        { level: 3, percentage: 0.07 },
        { level: 4, percentage: 0.05 },
        { level: 5, percentage: 0.02 },
        { level: 6, percentage: 0.01 },
    ],

    // Recurring commission settings
    RECURRING_ENABLED: true,
    LIFETIME_WHILE_ACTIVE: true,
    PAYOUT_CYCLE_DAYS: 30,
} as const;

// ============================================================================
// FRANCHISE ROYALTY CALCULATOR
// ============================================================================
export class FranchiseRoyaltyCalculator {
    // ============================================================================
    // CALCULATE FRANCHISE ROYALTY (Profit-Based)
    // ============================================================================
    async calculateFranchiseRoyalty(
        userId: string,
        periodMonth: string
    ): Promise<RoyaltyCalculationResult> {
        // Create thinking session for royalty calculation
        const session = await thinkingOrchestrator.createSession({
            name: 'franchise_royalty_calculation',
            goal: `Calculate franchise royalty for user ${userId} - Profit-based (Hidden Gem: 1% savings)`,
            priority: 'high',
            agent: 'royalty-calculator',
        });

        const supabase = await createSupabaseServerClient();

        // Step 1: Get user's franchise status
        await thinkingOrchestrator.addThought({
            sessionId: session.id,
            thought: 'Fetching user franchise status and current rank...',
            thoughtNumber: 1,
            totalThoughts: 7,
            nextThoughtNeeded: true,
            confidence: 0.95,
        });

        const { data: franchiseStatus } = await supabase
            .from('user_franchise_status')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (!franchiseStatus || !franchiseStatus.royalty_qualified) {
            await thinkingOrchestrator.endSession({
                sessionId: session.id,
                summary: 'User not qualified for franchise royalty yet',
                decision: { qualified: false },
            });

            return {
                success: false,
                qualified: false,
                message: 'User has not achieved franchise target yet',
            };
        }

        // Step 2: Get user's profit pool (15% of active investments)
        await thinkingOrchestrator.addThought({
            sessionId: session.id,
            thought: `Calculating profit pool from active investments (15% of principal)...`,
            thoughtNumber: 2,
            totalThoughts: 7,
            nextThoughtNeeded: true,
            confidence: 1.0,
        });

        const { data: investments } = await supabase
            .from('investments')
            .select('amount, monthly_profit')
            .eq('user_id', userId)
            .eq('status', 'ACTIVE');

        const totalPrincipal = investments?.reduce((sum, inv) => sum + Number(inv.amount), 0) || 0;
        const totalProfitPool = investments?.reduce((sum, inv) => sum + Number(inv.monthly_profit), 0) || 0;

        await thinkingOrchestrator.addThought({
            sessionId: session.id,
            thought: `Principal: rs${totalPrincipal.toLocaleString()}, Profit Pool (15%): rs${totalProfitPool.toLocaleString()}`,
            thoughtNumber: 3,
            totalThoughts: 7,
            nextThoughtNeeded: true,
            confidence: 1.0,
        });

        // Step 3: Get royalty percentage for rank
        const rankConfig = FRANCHISE_CONFIG.RANKS.find(r => r.rank === franchiseStatus.current_rank);
        if (!rankConfig) {
            throw new Error('Invalid franchise rank');
        }

        await thinkingOrchestrator.addThought({
            sessionId: session.id,
            thought: `Franchise Rank: ${franchiseStatus.current_rank}, Royalty: ${(rankConfig.royalty * 100).toFixed(2)}%, Referral Bonus: ${(rankConfig.referralBonus * 100).toFixed(2)}%`,
            thoughtNumber: 4,
            totalThoughts: 7,
            nextThoughtNeeded: true,
            confidence: 1.0,
        });

        // Step 4: Calculate royalty on PROFIT (not principal!)
        const royaltyAmount = totalProfitPool * rankConfig.royalty;
        const referralBonusAmount = totalProfitPool * rankConfig.referralBonus;
        const totalEarning = royaltyAmount + referralBonusAmount;

        await thinkingOrchestrator.addThought({
            sessionId: session.id,
            thought: `Royalty Amount: rs${royaltyAmount.toLocaleString()}, Referral Bonus: rs${referralBonusAmount.toLocaleString()}, Total: rs${totalEarning.toLocaleString()}`,
            thoughtNumber: 5,
            totalThoughts: 7,
            nextThoughtNeeded: true,
            confidence: 1.0,
        });

        // Step 5: Calculate effective rate on corpus (Hidden Gem visualization)
        const effectiveRateOnCorpus = totalPrincipal > 0 ? totalEarning / totalPrincipal : 0;
        const oldModelAmount = totalPrincipal * 0.03; // 3% of principal
        const savingsAmount = oldModelAmount - totalEarning;

        await thinkingOrchestrator.addThought({
            sessionId: session.id,
            thought: `HIDDEN GEM: Effective rate ${((effectiveRateOnCorpus * 100)).toFixed(2)}% of corpus (vs 3% old model). Monthly savings: rs${savingsAmount.toLocaleString()}`,
            thoughtNumber: 6,
            totalThoughts: 7,
            nextThoughtNeeded: true,
            confidence: 1.0,
        });

        // Step 6: Store royalty earning record
        const { data: royaltyRecord, error } = await supabase
            .from('royalty_earnings')
            .insert({
                user_id: userId,
                franchise_rank: franchiseStatus.current_rank,
                calculation_base: 'PROFIT',
                profit_pool: totalProfitPool,
                royalty_percentage: rankConfig.royalty,
                royalty_amount: royaltyAmount,
                referral_bonus_percentage: rankConfig.referralBonus,
                referral_bonus_amount: referralBonusAmount,
                total_earning: totalEarning,
                period_month: periodMonth,
                status: 'CALCULATED',
            })
            .select()
            .single();

        if (error) {
            console.error("Supabase Error saving royalty record: ", error);
        }

        // Automatically send proof email since calculation was processed successfully
        try {
            const { data: userRecord } = await supabase
                .from('users')
                .select('email')
                .eq('id', userId)
                .single();

            if (userRecord && userRecord.email) {
                await sendMonthlyRoyaltyProofEmail(userRecord.email, {
                    periodMonth,
                    calculationBase: 'PROFIT (Net Yield Base)',
                    totalPrincipal,
                    totalEarning,
                    royaltyAmount,
                    referralBonusAmount
                });
            }
        } catch (err) {
            console.error('Failed to send proof email:', err);
        }

        // Step 7: Complete thinking session
        await thinkingOrchestrator.endSession({
            sessionId: session.id,
            summary: `Franchise royalty calculated: rs${totalEarning.toLocaleString()} (rs${savingsAmount.toLocaleString()} saved vs old model)`,
            decision: {
                qualified: true,
                royaltyAmount,
                referralBonusAmount,
                totalEarning,
                savingsAmount,
                effectiveRate: effectiveRateOnCorpus,
            },
        });

        return {
            success: true,
            qualified: true,
            userId,
            franchiseRank: franchiseStatus.current_rank,
            totalPrincipal,
            totalProfitPool,
            royaltyPercentage: rankConfig.royalty,
            royaltyAmount,
            referralBonusPercentage: rankConfig.referralBonus,
            referralBonusAmount,
            totalEarning,
            effectiveRateOnCorpus,
            oldModelAmount,
            savingsAmount,
            periodMonth,
            calculationBase: 'PROFIT',
            message: 'Hidden Gem: 1% savings on total corpus',
        };
    }

    // ============================================================================
    // TRACK ROYALTY SAVINGS (The 1% Hidden Gem)
    // ============================================================================
    async trackRoyaltySavings(periodMonth: string): Promise<SavingsTrackerResult> {
        const supabase = await createSupabaseServerClient();

        // Get total investment corpus
        const { data: corpusData } = await supabase
            .from('investments')
            .select('amount, monthly_profit')
            .eq('status', 'ACTIVE');

        const totalCorpus = corpusData?.reduce((sum, inv) => sum + Number(inv.amount), 0) || 0;
        const totalProfit = corpusData?.reduce((sum, inv) => sum + Number(inv.monthly_profit), 0) || 0;

        // OLD MODEL: 3% of principal
        const oldModelAmount = totalCorpus * 0.03;

        // NEW MODEL: 3% of profit (~2% effective on corpus)
        const newModelAmount = totalProfit * 0.03;

        // Monthly savings
        const monthlySavings = oldModelAmount - newModelAmount;

        // Get cumulative savings
        const { data: historicalSavings } = await supabase
            .from('royalty_savings_tracker')
            .select('monthly_savings')
            .neq('period_month', periodMonth);

        const cumulativeSavings = monthlySavings + (historicalSavings?.reduce((sum, s) => sum + Number(s.monthly_savings), 0) || 0);

        // Store in tracker
        await supabase
            .from('royalty_savings_tracker')
            .upsert({
                period_month: periodMonth,
                total_investment_corpus: totalCorpus,
                total_profit_pool: totalProfit,
                old_royalty_model_amount: oldModelAmount,
                new_royalty_model_amount: newModelAmount,
                monthly_savings: monthlySavings,
                cumulative_savings: cumulativeSavings,
                savings_percentage: 1.00,
                notes: 'Hidden Gem: 1% savings = rs 1 Crore/month at rs 100 Crore corpus',
            });

        // Cache the result
        await cacheSet(`royalty:savings:${periodMonth}`, {
            totalCorpus,
            totalProfit,
            oldModelAmount,
            newModelAmount,
            monthlySavings,
            cumulativeSavings,
        }, 2592000); // 30 days

        return {
            periodMonth,
            totalCorpus,
            totalProfit,
            oldModelAmount,
            newModelAmount,
            monthlySavings,
            cumulativeSavings,
            savingsPercentage: 1.00,
            milestone: this.getSavingsMilestone(monthlySavings),
        };
    }

    private getSavingsMilestone(monthlySavings: number): string {
        if (monthlySavings >= 100000000) return '🎯 rs 1000 Crore Corpus (rs 10 Cr/month savings)';
        if (monthlySavings >= 50000000) return '🎯 rs 500 Crore Corpus (rs 5 Cr/month savings)';
        if (monthlySavings >= 10000000) return '🎯 rs 100 Crore Corpus (rs 1 Cr/month savings)';
        return '📈 Growing...';
    }

    // ============================================================================
    // SETUP RECURRING COMMISSIONS (Lifetime Returns)
    // ============================================================================
    async setupRecurringCommissions(
        userId: string,
        investmentId: string,
        monthlyProfit: number
    ): Promise<RecurringCommissionResult> {
        const supabase = await createSupabaseServerClient();

        // Get user's upline hierarchy
        const { data: user } = await supabase
            .from('users')
            .select('upline_1, upline_2, upline_3, upline_4, upline_5, upline_6')
            .eq('id', userId)
            .single();

        if (!user) {
            throw new Error('User not found');
        }

        const uplines = [user.upline_1, user.upline_2, user.upline_3, user.upline_4, user.upline_5, user.upline_6];
        const recurringCommissions = [];

        for (let level = 0; level < 6; level++) {
            if (!uplines[level]) continue;

            const commission = {
                user_id: uplines[level],
                investment_id: investmentId,
                commission_type: `LEVEL_${level + 1}`,
                percentage: FRANCHISE_CONFIG.REFERRAL_LEVELS[level].percentage,
                calculation_base: 'PROFIT',
                monthly_amount: monthlyProfit * FRANCHISE_CONFIG.REFERRAL_LEVELS[level].percentage,
                is_recurring: true,
                start_date: new Date().toISOString(),
                next_payout_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'ACTIVE',
            };

            recurringCommissions.push(commission);
        }

        if (recurringCommissions.length > 0) {
            const { error } = await supabase
                .from('recurring_commissions')
                .insert(recurringCommissions);

            if (error) {
                console.error("Supabase Error recurring setup:", error);
            }
        }

        return {
            success: true,
            userId,
            investmentId,
            recurringCommissions: recurringCommissions.length,
            totalMonthlyPayout: recurringCommissions.reduce((sum, c) => sum + c.monthly_amount, 0),
            lifetime: true,
            message: 'Recurring commissions setup for 6 levels - Lifetime returns while investment active',
        };
    }

    // ============================================================================
    // PROCESS MONTHLY RECURRING PAYOUTS
    // ============================================================================
    async processMonthlyRecurringPayouts(): Promise<PayoutProcessResult> {
        const supabase = await createSupabaseServerClient();
        const now = new Date();

        // Get all recurring commissions due for payout
        const { data: commissions } = await supabase
            .from('recurring_commissions')
            .select('*, user:users(email, full_name)')
            .eq('status', 'ACTIVE')
            .lte('next_payout_date', now.toISOString());

        if (!commissions || commissions.length === 0) {
            return { processed: 0, totalAmount: 0, payouts: [] };
        }

        const payouts = [];

        for (const commission of commissions) {
            // Create payout record
            const payout = {
                user_id: commission.user_id,
                investment_id: commission.investment_id,
                type: commission.commission_type,
                amount: commission.monthly_amount,
                status: 'PENDING',
            };

            payouts.push(payout);

            // Update recurring commission
            await supabase
                .from('recurring_commissions')
                .update({
                    last_paid_at: now.toISOString(),
                    next_payout_date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                    total_paid: Number(commission.total_paid) + commission.monthly_amount,
                    payment_count: commission.payment_count + 1,
                })
                .eq('id', commission.id);

            // Automate precise email proof to registered user email for recurring referrals!
            if (commission.user && commission.user.email) {
                try {
                    const periodMonth = new Date().toISOString().slice(0, 7);
                    const isRoyalty = commission.commission_type === 'FRANCHISE_ROYALTY';
                    const isReferral = commission.commission_type?.startsWith('LEVEL_');

                    await sendMonthlyRoyaltyProofEmail(commission.user.email, {
                        periodMonth,
                        calculationBase: commission.calculation_base,
                        totalEarning: commission.monthly_amount,
                        royaltyAmount: isRoyalty ? commission.monthly_amount : 0,
                        referralBonusAmount: isReferral ? commission.monthly_amount : 0,
                        totalPrincipal: 'N/A' // Referral is strictly based on downline profit yield
                    });
                } catch (err) {
                    console.error('Failed to send proof email:', err);
                }
            }
        }

        // Insert all payouts
        if (payouts.length > 0) {
            await supabase.from('payouts').insert(payouts);
        }

        return {
            processed: payouts.length,
            totalAmount: payouts.reduce((sum, p) => sum + p.amount, 0),
            payouts,
        };
    }
}

// ============================================================================
// TYPES
// ============================================================================
export interface RoyaltyCalculationResult {
    success: boolean;
    qualified?: boolean;
    userId?: string;
    franchiseRank?: string;
    totalPrincipal?: number;
    totalProfitPool?: number;
    royaltyPercentage?: number;
    royaltyAmount?: number;
    referralBonusPercentage?: number;
    referralBonusAmount?: number;
    totalEarning?: number;
    effectiveRateOnCorpus?: number;
    oldModelAmount?: number;
    savingsAmount?: number;
    periodMonth?: string;
    calculationBase?: string;
    message?: string;
}

export interface SavingsTrackerResult {
    periodMonth: string;
    totalCorpus: number;
    totalProfit: number;
    oldModelAmount: number;
    newModelAmount: number;
    monthlySavings: number;
    cumulativeSavings: number;
    savingsPercentage: number;
    milestone: string;
}

export interface RecurringCommissionResult {
    success: boolean;
    userId: string;
    investmentId: string;
    recurringCommissions: number;
    totalMonthlyPayout: number;
    lifetime: boolean;
    message: string;
}

export interface PayoutProcessResult {
    processed: number;
    totalAmount: number;
    payouts: any[];
}

// Singleton instance
export const franchiseRoyaltyCalculator = new FranchiseRoyaltyCalculator();
