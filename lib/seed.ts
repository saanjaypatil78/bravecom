/**
 * BRAVECOM Database Seeder
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding BRAVECOM database...");

    // Generate Admin
    const admin = await prisma.user.create({
        data: {
            name: "Admin User",
            email: "admin@bravecom.in",
            role: "ADMIN",
            idColor: "GREEN",
            walletBalance: 0,
            referralCode: "admin_superuser_bravecom",
            place: "Mumbai"
        },
    });
    console.log(`  ✅ Admin created: ${admin.name}`);

    // Generate Franchise Partner
    const root = await prisma.user.create({
        data: {
            name: "Arjun Mehta",
            email: "arjun@franchise.in",
            role: "FRANCHISE_PARTNER",
            idColor: "GREEN",
            walletBalance: 1245000,
            referralCode: "arjun_mehta_" + Date.now() + "_delhi",
            place: "Delhi"
        },
    });
    console.log(`  ✅ Root Franchise: ${root.name}`);

    // Create 6 levels of referrals, mixing active and passive users
    const userNames = [
        ["Priya Singh", "Rohan Das", "Sneha Rao"],        // L1
        ["Vikram Patel", "Ananya Joshi"],                 // L2
        ["Deepak Kumar", "Nisha Verma"],                  // L3
        ["Arun Sharma"],                                  // L4
        ["Meera Gupta"],                                  // L5
        ["Suresh Reddy"],                                 // L6
    ];

    let previousLevelUsers = [root];
    const investmentAmounts = [500000, 300000, 0, 150000, 100000, 75000]; // Note: index 2 is 0 (passive user), index 5 < 100k

    for (let level = 0; level < userNames.length; level++) {
        const currentLevelUsers = [];
        for (let i = 0; i < userNames[level].length; i++) {
            const parentUser = previousLevelUsers[i % previousLevelUsers.length];
            const amount = investmentAmounts[level];

            let idColor: "GREEN" | "ORANGE" | "RED" = "GREEN";
            let activationTimerEnd = null;

            if (amount === 0) {
                idColor = "ORANGE"; // Passive user with network but no investment
                activationTimerEnd = new Date(Date.now() + 60 * 86400000); // 60 days from now
            } else if (amount < 100000) {
                idColor = "RED"; // Inactive user (investment < 100k)
            }

            const userName = userNames[level][i];
            const user = await prisma.user.create({
                data: {
                    name: userName,
                    email: `${userName.toLowerCase().replace(' ', '')}@example.com`,
                    role: "INVESTOR",
                    idColor,
                    activationTimerEnd,
                    walletBalance: 0,
                    referralCode: `${userName.toLowerCase().replace(' ', '_')}_${Date.now()}_city`,
                    place: "City"
                },
            });

            await prisma.referral.create({
                data: {
                    referrerId: parentUser.id,
                    referredUserId: user.id,
                    level: level + 1,
                },
            });

            if (amount > 0) {
                await prisma.investment.create({
                    data: {
                        userId: user.id,
                        amount: amount,
                        startDate: new Date(Date.now() - 46 * 86400000), // Due for 45-day payout
                        status: "ACTIVE",
                    },
                });
            }

            console.log(`  ✅ L${level + 1} User: ${user.name} [${idColor}] → Ref by ${parentUser.name} (₹${amount.toLocaleString()})`);
            currentLevelUsers.push(user);
        }
        previousLevelUsers = currentLevelUsers;
    }

    // Create Campaign
    await prisma.fundraisingCampaign.create({
        data: {
            goalAmount: 50000000, // 5 Cr
            currentAmount: 1225000,
            status: "ACTIVE"
        }
    });

    const totalUsers = await prisma.user.count();
    console.log(`\n🎉 Seeding complete! ${totalUsers} users created.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
