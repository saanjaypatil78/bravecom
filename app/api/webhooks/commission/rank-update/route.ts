import { NextRequest, NextResponse } from 'next/server';
import { progressiveCommissionCalculator } from '@/lib/calculations/progressive-commission';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, investmentId } = body;

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        // Calculate user rank
        const rankResult = await progressiveCommissionCalculator.calculateUserRank(userId);

        // Trigger webhook if rank changed (or progress >= 100)
        if (rankResult.progressPercentage >= 100) {
            // Placeholder for webhookHandler
            console.log('WEBHOOK_EVENT_TYPES.USER_RANK_UPGRADED triggered', {
                userId,
                newRank: rankResult.currentRank,
                totalBusiness: rankResult.totalBusiness,
                badge: rankResult.badge,
            });
        }

        return NextResponse.json({
            success: true,
            data: rankResult,
        });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Rank calculation failed' },
            { status: 500 }
        );
    }
}
