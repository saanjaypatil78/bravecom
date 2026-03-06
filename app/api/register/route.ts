import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { randomUUID } from "crypto";

// Register a new user with a referral code
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            name, email, place, referrerId, amount,
            bankName, bankAccount, ifsc, guardian,
            username, isMobileVerified, isEmailVerified, lastDraftSaved
        } = body;

        // Basic validation - minimum required for the DB
        if (!name) {
            return NextResponse.json(
                { error: "name is required" },
                { status: 400 }
            );
        }

        const finalEmail = email || `user_${randomUUID()}@test.com`;

        // Ensure amount is handled (can be 0 for RED status)
        const safeAmount = parseFloat(amount) || 0;

        // Handle referrer logic (Optional for ROOT users)
        let actualReferrerId = referrerId;
        if (referrerId) {
            const referrer = await prisma.user.findUnique({ where: { id: referrerId } });
            if (!referrer) actualReferrerId = null; // Failsafe
        }

        const newUser = await prisma.user.create({
            data: {
                name,
                email: finalEmail,
                place,
                role: "INVESTOR",
                idColor: safeAmount >= 100000 ? "GREEN" : safeAmount > 0 ? "ORANGE" : "RED",
                walletBalance: 0,
                referralCode: `${name.replace(/\s+/g, '').substring(0, 4).toUpperCase()}-${randomUUID().slice(0, 8)}`,

                // Phase 6 KYC fields
                bankName,
                bankAccount,
                ifscCode: ifsc,
                guardian,
                username,
                isMobileVerified: !!isMobileVerified,
                isEmailVerified: !!isEmailVerified,
                lastDraftSaved
            },
        });

        // Create direct referral relationship if sponsor exists
        if (actualReferrerId) {
            await prisma.referral.create({
                data: {
                    referrerId: actualReferrerId,
                    referredUserId: newUser.id,
                    level: 1,
                },
            });
        }

        // Create initial investment record if they added money
        if (safeAmount > 0) {
            await prisma.investment.create({
                data: {
                    userId: newUser.id,
                    amount: safeAmount,
                    status: safeAmount >= 100000 ? "ACTIVE" : "PENDING",
                    startDate: new Date(),
                },
            });
        }

        return NextResponse.json({
            success: true,
            user: newUser,
            message: `User ${name} registered successfully.`,
        });
    } catch (error) {
        console.error("Register error:", error);
        return NextResponse.json({ error: "Registration failed" }, { status: 500 });
    }
}

// Get all users
export async function GET() {
    try {
        const users = await prisma.user.findMany({
            include: {
                referralsMade: { include: { referredUser: true } },
                referredBy: { include: { referrer: true } },
                investments: true,
            },
            orderBy: { createdAt: "asc" },
        });

        return NextResponse.json({ users });
    } catch (error) {
        console.error("Users GET error:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}
