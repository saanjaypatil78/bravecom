import { NextRequest, NextResponse } from 'next/server';
import { autonomousRankEngine, seedRankThresholds } from '@/lib/autonomous-rank-engine';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { periodMonth } = body;

        // Use current month if not specified
        const month = periodMonth || new Date().toISOString().slice(0, 7);

        // Ensure rank thresholds are seeded
        await seedRankThresholds();

        // Batch evaluate all users
        const result = await autonomousRankEngine.batchEvaluateAllUsers(month);

        return NextResponse.json({
            success: result.success,
            data: result,
        });
    } catch (error) {
        console.error('Batch rank evaluation error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Batch rank evaluation failed' },
            { status: 500 }
        );
    }
}
