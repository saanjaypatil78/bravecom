import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            include: {
                referralsMade: true,
                referredBy: true,
                investments: true,
            },
        });

        // Aggregate stats per level (1-6)
        const levelStats = [];
        for (let level = 1; level <= 6; level++) {
            const referrals = await prisma.referral.findMany({ where: { level } });
            const userIds = referrals.map((r) => r.referredUserId);

            const investments = await prisma.investment.findMany({
                where: { userId: { in: userIds }, status: "ACTIVE" },
            });

            const totalAUM = investments.reduce((s, i) => s + i.amount, 0);

            const commissions = await prisma.commissionLog.findMany({
                where: { level, status: "CREDITED" },
            });
            const totalCommission = commissions.reduce((s, c) => s + c.amount, 0);

            levelStats.push({
                level,
                investorCount: userIds.length,
                totalAUM,
                totalCommission,
            });
        }

        // Total network stats
        const totalUsers = await prisma.user.count();
        const directReferrals = await prisma.referral.count({ where: { level: 1 } });
        const allInvestments = await prisma.investment.findMany({ where: { status: "ACTIVE" } });
        const totalAUM = allInvestments.reduce((s, i) => s + i.amount, 0);
        const allCommissions = await prisma.commissionLog.findMany();
        const totalEarnings = allCommissions.reduce((s, c) => s + c.amount, 0);

        // Recent commission logs
        const recentLogs = await prisma.commissionLog.findMany({
            orderBy: { createdAt: "desc" },
            take: 20,
            include: {
                beneficiary: true,
            },
        });

        // Franchise partner (root user)
        const franchisePartner = await prisma.user.findFirst({
            where: { role: "FRANCHISE_PARTNER" },
        });

        return NextResponse.json({
            franchisePartner,
            networkStats: {
                totalUsers,
                directReferrals,
                totalAUM,
                totalEarnings,
                walletBalance: franchisePartner?.walletBalance || 0,
            },
            levelStats,
            recentLogs: recentLogs.map((log) => {
                const source = users.find(u => u.id === log.sourceUserId);
                return {
                    id: log.id,
                    transactionId: log.transactionId,
                    level: log.level,
                    sourceUser: source ? source.name : "Unknown",
                    sourceUserId: log.sourceUserId,
                    beneficiary: log.beneficiary?.name || "System",
                    amount: log.amount,
                    status: log.status,
                    createdAt: log.createdAt,
                };
            }),
        });
    } catch (error) {
        console.error("Dashboard API error:", error);
        return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 });
    }
}
