import { NextRequest, NextResponse } from 'next/server';
import { autonomousRankEngine, seedRankThresholds } from '@/lib/autonomous-rank-engine';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, periodMonth } = body;

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        // Use current month if not specified
        const month = periodMonth || new Date().toISOString().slice(0, 7);

        // Ensure rank thresholds are seeded
        await seedRankThresholds();

        // Evaluate user rank
        const result = await autonomousRankEngine.evaluateUserRank(userId, month);

        return NextResponse.json({
            success: result.success,
            data: result,
        });
    } catch (error) {
        console.error('Rank evaluation error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Rank evaluation failed' },
            { status: 500 }
        );
    }
}
