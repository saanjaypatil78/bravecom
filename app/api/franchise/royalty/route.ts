import { NextRequest, NextResponse } from 'next/server';
import { franchiseRoyaltyCalculator } from '@/lib/calculations/franchise-royalty';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const userId = searchParams.get('userId');
        const periodMonth = searchParams.get('periodMonth') || new Date().toISOString().slice(0, 7);

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        const result = await franchiseRoyaltyCalculator.calculateFranchiseRoyalty(userId, periodMonth);

        if (!result.success) {
            return NextResponse.json({ error: result.message }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            data: result,
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to calculate royalty' },
            { status: 500 }
        );
    }
}
