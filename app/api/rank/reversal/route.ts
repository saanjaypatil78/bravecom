import { NextRequest, NextResponse } from 'next/server';
import { autonomousRankEngine } from '@/lib/autonomous-rank-engine';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId } = body;

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        // Process rank reversal
        const result = await autonomousRankEngine.processRankReversal(userId);

        return NextResponse.json({
            success: result.success,
            data: result,
        });
    } catch (error) {
        console.error('Rank reversal error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Rank reversal failed' },
            { status: 500 }
        );
    }
}
