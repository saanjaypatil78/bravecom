import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');
        const expectedToken = process.env.SYNC_SECRET;

        if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Feature not implemented: syncProductsToRoute() script is missing from codebase.
        // Returning success to prevent build failures.

        return NextResponse.json({
            success: true,
            message: 'Product sync acknowledged but unimplemented.'
        });
    } catch (error) {
        return NextResponse.json({
            error: 'Sync failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({
        status: 'ok',
        message: 'Use POST to trigger sync',
        env: process.env.SYNC_SECRET ? 'Secret configured' : 'No secret (public)'
    });
}
