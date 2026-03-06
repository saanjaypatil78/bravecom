import { NextRequest, NextResponse } from 'next/server';
import { autonomousRankEngine } from '@/lib/autonomous-rank-engine';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        // Get user rank history
        const history = await autonomousRankEngine.getUserRankHistory(userId);

        return NextResponse.json({
            success: true,
            data: history,
        });
    } catch (error) {
        console.error('Get rank history error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to get rank history' },
            { status: 500 }
        );
    }
}
