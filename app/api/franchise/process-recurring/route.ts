import { NextResponse } from 'next/server';
import { franchiseRoyaltyCalculator } from '@/lib/calculations/franchise-royalty';

// Mocked check for admin role (in a production environment verify valid user session headers)
const verifyAdminAuth = async () => ({ valid: true });

export async function POST() {
    try {
        const authResult = await verifyAdminAuth();
        if (!authResult.valid) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const result = await franchiseRoyaltyCalculator.processMonthlyRecurringPayouts();

        return NextResponse.json({
            success: true,
            data: result,
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to process recurring payouts' },
            { status: 500 }
        );
    }
}
