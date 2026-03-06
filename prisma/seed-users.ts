/**
 * SEED: 6 RBAC User Profiles
 * Roles: ADMIN, INVESTOR, FRANCHISE_PARTNER, BUYER, VENDOR, QA_ANALYST
 * 
 * Run: npx tsx prisma/seed-users.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateReferralCode(name: string, place: string): string {
    const now = new Date();
    const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    return `${name.replace(/\s+/g, '').toUpperCase()}_${stamp}_${place.toUpperCase().replace(/\s+/g, '')}`;
}

const USERS = [
    {
        name: 'Rajesh Sharma',
        email: 'rajesh.sharma@bravecom.in',
        role: 'ADMIN' as const,
        username: 'rajesh_admin',
        place: 'Mumbai',
        walletBalance: 250000,
        idColor: 'GREEN' as const,
        royaltyTier: 'PLATINUM',
        isMobileVerified: true,
        isEmailVerified: true,
        upline1: null,
    },
    {
        name: 'Priya Kapoor',
        email: 'priya.kapoor@bravecom.in',
        role: 'INVESTOR' as const,
        username: 'priya_investor',
        place: 'Delhi',
        walletBalance: 500000,
        idColor: 'GREEN' as const,
        royaltyTier: 'GOLD',
        isMobileVerified: true,
        isEmailVerified: true,
        upline1: null,
    },
    {
        name: 'Amit Deshmukh',
        email: 'amit.deshmukh@bravecom.in',
        role: 'FRANCHISE_PARTNER' as const,
        username: 'amit_franchise',
        place: 'Pune',
        walletBalance: 175000,
        idColor: 'GREEN' as const,
        royaltyTier: 'SILVER',
        isMobileVerified: true,
        isEmailVerified: true,
        upline1: null,
    },
    {
        name: 'Neha Patel',
        email: 'neha.patel@bravecom.in',
        role: 'BUYER' as const,
        username: 'neha_buyer',
        place: 'Ahmedabad',
        walletBalance: 12500,
        idColor: 'ORANGE' as const,
        royaltyTier: 'BRONZE',
        isMobileVerified: true,
        isEmailVerified: true,
        upline1: null,
    },
    {
        name: 'Vikram Reddy',
        email: 'vikram.reddy@bravecom.in',
        role: 'VENDOR' as const,
        username: 'vikram_vendor',
        place: 'Hyderabad',
        walletBalance: 85000,
        idColor: 'GREEN' as const,
        royaltyTier: 'GOLD',
        isMobileVerified: true,
        isEmailVerified: true,
        upline1: null,
    },
    {
        name: 'Sanjay Patil',
        email: '007saanjaypatil@gmail.com',
        role: 'QA_ANALYST' as const,
        username: 'sanjay_qa',
        place: 'Bangalore',
        walletBalance: 50000,
        idColor: 'GREEN' as const,
        royaltyTier: 'PLATINUM',
        isMobileVerified: true,
        isEmailVerified: true,
        upline1: null,
    },
];

async function main() {
    console.log('👥 Seeding 6 RBAC User Profiles...');
    console.log('━'.repeat(60));

    // Create each user
    for (const userData of USERS) {
        const referralCode = generateReferralCode(userData.name, userData.place);

        // Check if user already exists
        const existing = await prisma.user.findUnique({
            where: { email: userData.email },
        });

        if (existing) {
            console.log(`   ⚠️  ${userData.name} (${userData.role}) — already exists, skipping`);
            continue;
        }

        const user = await prisma.user.create({
            data: {
                name: userData.name,
                email: userData.email,
                role: userData.role,
                username: userData.username,
                place: userData.place,
                walletBalance: userData.walletBalance,
                idColor: userData.idColor,
                royaltyTier: userData.royaltyTier,
                referralCode,
                isMobileVerified: userData.isMobileVerified,
                isEmailVerified: userData.isEmailVerified,
                upline1: userData.upline1,
            },
        });

        console.log(`   ✅ ${user.name} | ${user.role} | ${user.email} | Ref: ${referralCode}`);
    }

    console.log('\n' + '━'.repeat(60));
    console.log('🎉 USER SEED COMPLETE!');

    // Verify
    const total = await prisma.user.count();
    const byRole = await prisma.user.groupBy({
        by: ['role'],
        _count: true,
    });

    console.log(`\n📊 VERIFICATION:`);
    console.log(`   Total Users: ${total}`);
    for (const r of byRole) {
        console.log(`   ${r.role}: ${r._count}`);
    }

    // Print login credentials table
    console.log('\n📋 USER PROFILES:');
    console.log('┌─────────────────────┬──────────────────────┬───────────────────────────────────┐');
    console.log('│ Name                │ Role                 │ Email                             │');
    console.log('├─────────────────────┼──────────────────────┼───────────────────────────────────┤');
    for (const u of USERS) {
        console.log(`│ ${u.name.padEnd(19)} │ ${u.role.padEnd(20)} │ ${u.email.padEnd(33)} │`);
    }
    console.log('└─────────────────────┴──────────────────────┴───────────────────────────────────┘');
}

main()
    .catch((e) => {
        console.error('❌ User seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
