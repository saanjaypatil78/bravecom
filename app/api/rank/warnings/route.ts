import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const unresolved = searchParams.get('unresolved') === 'true';

        const where: any = {};
        if (userId) where.userId = userId;
        if (unresolved) {
            where.resolved = false;
            where.gracePeriodEnds = { gt: new Date() };
        }

        const warnings = await prisma.rankWarningNotification.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 50,
        });

        return NextResponse.json({
            success: true,
            data: warnings,
        });
    } catch (error) {
        console.error('Get warnings error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to get warnings' },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { warningId, action, resolutionNotes } = body;

        if (!warningId) {
            return NextResponse.json({ error: 'Warning ID required' }, { status: 400 });
        }

        if (action === 'acknowledge') {
            const warning = await prisma.rankWarningNotification.update({
                where: { id: warningId },
                data: {
                    userAcknowledged: true,
                    userAcknowledgedAt: new Date(),
                },
            });

            return NextResponse.json({
                success: true,
                data: warning,
            });
        }

        if (action === 'resolve') {
            const warning = await prisma.rankWarningNotification.update({
                where: { id: warningId },
                data: {
                    resolved: true,
                    resolvedAt: new Date(),
                    resolutionType: resolutionNotes || 'MANUAL_OVERRIDE',
                    resolutionNotes,
                },
            });

            return NextResponse.json({
                success: true,
                data: warning,
            });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('Update warning error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to update warning' },
            { status: 500 }
        );
    }
}
