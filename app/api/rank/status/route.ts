import { NextRequest, NextResponse } from 'next/server';
import { autonomousRankEngine } from '@/lib/autonomous-rank-engine';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        // Get user rank status
        const status = await autonomousRankEngine.getUserRankStatus(userId);

        return NextResponse.json({
            success: true,
            data: status,
        });
    } catch (error) {
        console.error('Get rank status error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to get rank status' },
            { status: 500 }
        );
    }
}
