import { NextResponse } from 'next/server';
import { franchiseRoyaltyCalculator } from '@/lib/calculations/franchise-royalty';

export async function GET() {
    try {
        const periodMonth = new Date().toISOString().slice(0, 7);
        const result = await franchiseRoyaltyCalculator.trackRoyaltySavings(periodMonth);

        return NextResponse.json({
            success: true,
            data: result,
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch savings tracker' },
            { status: 500 }
        );
    }
}
