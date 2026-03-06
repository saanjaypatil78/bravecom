// ============================================================================
// DETERMINISTIC LEDGER GENERATOR
// Brave Ecom Pvt Ltd — Backlogged Financial Data (Jan 2024 → Mar 2026)
// ============================================================================

import {
    LedgerEntry,
    MonthSummary,
    LedgerStats,
    TransactionType,
    PaymentMode,
    EntityType,
    TransactionStatus,
    TRANSACTION_LABELS,
    PAYMENT_MODE_LIMITS,
} from "./ledgerTypes";

// ─── Seeded PRNG ─────────────────────────────────────────────────────────────
function seededRandom(seed: number): () => number {
    let s = seed;
    return () => {
        s = (s * 1664525 + 1013904223) & 0xffffffff;
        return (s >>> 0) / 0xffffffff;
    };
}

function pick<T>(arr: T[], rng: () => number): T {
    return arr[Math.floor(rng() * arr.length)];
}

function randInt(min: number, max: number, rng: () => number): number {
    return Math.floor(rng() * (max - min + 1)) + min;
}

function roundTo(n: number, decimals: number): number {
    const f = Math.pow(10, decimals);
    return Math.round(n * f) / f;
}

// ─── Realistic Entity Data ───────────────────────────────────────────────────

const BANKS = [
    { name: "HDFC Bank", ifscPrefix: "HDFC0" },
    { name: "ICICI Bank", ifscPrefix: "ICIC0" },
    { name: "State Bank of India", ifscPrefix: "SBIN0" },
    { name: "Axis Bank", ifscPrefix: "UTIB0" },
    { name: "Kotak Mahindra Bank", ifscPrefix: "KKBK0" },
    { name: "Punjab National Bank", ifscPrefix: "PUNB0" },
    { name: "Bank of Baroda", ifscPrefix: "BARB0" },
    { name: "IndusInd Bank", ifscPrefix: "INDB0" },
    { name: "Yes Bank", ifscPrefix: "YESB0" },
    { name: "Federal Bank", ifscPrefix: "FDRL0" },
];

const FRANCHISE_PARTNERS = [
    "Rajesh K. (Mumbai)",
    "Priya S. (Delhi NCR)",
    "Arjun M. (Bangalore)",
    "Sneha P. (Pune)",
    "Vikram T. (Hyderabad)",
    "Ananya R. (Chennai)",
    "Mohit G. (Jaipur)",
    "Kavitha N. (Kochi)",
    "Deepak L. (Ahmedabad)",
    "Meera D. (Lucknow)",
    "Sanjay B. (Kolkata)",
    "Nisha V. (Chandigarh)",
];

const INVESTOR_NAMES = [
    "Amit S.", "Ravi K.", "Pooja M.", "Suresh R.", "Neha T.",
    "Karan D.", "Swati P.", "Rahul G.", "Divya L.", "Manoj B.",
    "Sunita A.", "Vijay N.", "Rekha C.", "Anil V.", "Preeti J.",
    "Rohit H.", "Meghna S.", "Gaurav Y.", "Asha K.", "Nitin M.",
    "Shalini R.", "Pankaj D.", "Kavita T.", "Rakesh P.", "Jyoti G.",
    "Hemant L.", "Usha B.", "Vivek A.", "Sarita N.", "Alok C.",
    "Geeta V.", "Tarun J.", "Pallavi H.", "Ashok S.", "Nirmala Y.",
    "Dinesh K.", "Shweta M.", "Pramod R.", "Rani D.", "Sunil T.",
    "Bhavna P.", "Ramesh G.", "Anita L.", "Vinod B.", "Seema A.",
];

const VENDOR_NAMES = [
    "TechVista Solutions",
    "GreenLeaf Organics",
    "StyleHub Fashion",
    "HomeComfort India",
    "FitZone Sports",
    "BookWorm Publishers",
    "SparkleJewels",
    "AutoPrime Parts",
];

// Investment tiers matching the INVESTMENT PLAN Excel
const INVESTMENT_TIERS = [
    { tier: "A", level: 1, minInvestment: 500000, maxInvestment: 1000000, monthlyProfit: 0.03 },
    { tier: "B", level: 2, minInvestment: 1000000, maxInvestment: 2500000, monthlyProfit: 0.035 },
    { tier: "C", level: 3, minInvestment: 2500000, maxInvestment: 5000000, monthlyProfit: 0.04 },
    { tier: "D", level: 4, minInvestment: 5000000, maxInvestment: 10000000, monthlyProfit: 0.045 },
    { tier: "E", level: 5, minInvestment: 10000000, maxInvestment: 25000000, monthlyProfit: 0.05 },
    { tier: "F", level: 6, minInvestment: 25000000, maxInvestment: 50000000, monthlyProfit: 0.055 },
    { tier: "G", level: 7, minInvestment: 50000000, maxInvestment: 110000000, monthlyProfit: 0.06 },
    { tier: "H", level: 8, minInvestment: 30000000, maxInvestment: 50000000, monthlyProfit: 0.065 },
];

const COMMISSION_TIERS = ["BRONZE", "SILVER", "GOLD", "PLATINUM", "AMBASSADOR"];

// ─── Payment Mode Selection ─────────────────────────────────────────────────

function selectPaymentMode(amount: number, rng: () => number): PaymentMode {
    if (amount >= 200000) {
        // Large amounts: RTGS (70%) or NEFT (30%)
        return rng() < 0.7 ? "RTGS" : "NEFT";
    } else if (amount >= 100000) {
        // Medium: NEFT (50%), IMPS (30%), UPI (20% — at limit)
        const r = rng();
        if (r < 0.5) return "NEFT";
        if (r < 0.8) return "IMPS";
        return "UPI";
    } else if (amount >= 10000) {
        // Small-medium: UPI (40%), IMPS (35%), NEFT (25%)
        const r = rng();
        if (r < 0.4) return "UPI";
        if (r < 0.75) return "IMPS";
        return "NEFT";
    } else {
        // Small: UPI (70%), IMPS (30%)
        return rng() < 0.7 ? "UPI" : "IMPS";
    }
}

// ─── Masked Bank Details ────────────────────────────────────────────────────

function generateBankDetails(rng: () => number) {
    const bank = pick(BANKS, rng);
    const branchCode = String(randInt(100, 999, rng)).padStart(3, "0");
    const last4 = String(randInt(1000, 9999, rng));
    return {
        bankName: bank.name,
        ifscCode: `${bank.ifscPrefix}${branchCode}***`,
        accountNumber: `XXXX XXXX ${last4}`,
    };
}

// ─── Month Generation Helpers ────────────────────────────────────────────────

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Today's date — all ledger entries must be on or before this date
const TODAY = new Date();
const TODAY_YEAR = TODAY.getFullYear();
const TODAY_MONTH = TODAY.getMonth(); // 0-indexed
const TODAY_DAY = TODAY.getDate();

function getMonthRange(): { month: string; label: string; year: number; monthIdx: number }[] {
    const months: { month: string; label: string; year: number; monthIdx: number }[] = [];
    // Jan 2024 → current month (dynamically capped at today)
    for (let y = 2024; y <= TODAY_YEAR; y++) {
        const startM = 0;
        const endM = y === TODAY_YEAR ? TODAY_MONTH : 11;
        for (let m = startM; m <= endM; m++) {
            months.push({
                month: `${y}-${String(m + 1).padStart(2, "0")}`,
                label: `${MONTHS_FULL[m]} ${y}`,
                year: y,
                monthIdx: m,
            });
        }
    }
    return months;
}

// ─── Volume Growth Curve ────────────────────────────────────────────────────
// Starts slow (Jan 2024: ~15 txns), grows organically to ~60 per month

function getMonthlyVolume(monthIndex: number, totalMonths: number, rng: () => number): number {
    const progress = monthIndex / totalMonths;
    const baseVolume = 12 + Math.floor(progress * 48);
    const noise = randInt(-3, 5, rng);
    return Math.max(10, baseVolume + noise);
}

// ─── Transaction Amount Generation ──────────────────────────────────────────

function generateInvestmentAmount(rng: () => number): { amount: number; tier: string } {
    const tierData = pick(INVESTMENT_TIERS, rng);
    const amount = roundTo(
        tierData.minInvestment + rng() * (tierData.maxInvestment - tierData.minInvestment),
        -3 // round to nearest 1000
    );
    return { amount: Math.round(amount / 1000) * 1000, tier: tierData.tier };
}

function generateProfitAmount(investmentAmount: number, tier: string, rng: () => number): number {
    const tierData = INVESTMENT_TIERS.find(t => t.tier === tier) || INVESTMENT_TIERS[0];
    const profit = investmentAmount * tierData.monthlyProfit;
    const variance = profit * (0.9 + rng() * 0.2);
    return Math.round(variance);
}

function generateCommissionAmount(rng: () => number): number {
    // Commission range: ₹2,000 → ₹5,00,000
    const amounts = [2000, 5000, 8000, 12000, 15000, 25000, 35000, 50000, 75000, 100000, 150000, 250000, 500000];
    return pick(amounts, rng);
}

function generateFranchiseFee(rng: () => number): number {
    const fees = [250000, 500000, 750000, 1000000, 1500000, 2000000];
    return pick(fees, rng);
}

function generateVendorFee(rng: () => number): number {
    const fees = [10000, 15000, 25000, 50000, 75000, 100000];
    return pick(fees, rng);
}

// ─── Generate Reference ID ──────────────────────────────────────────────────

function generateRefId(year: number, month: number, seq: number): string {
    return `TXN-${year}-${String(month + 1).padStart(2, "0")}-${String(seq).padStart(5, "0")}`;
}

// ─── Main Generator ─────────────────────────────────────────────────────────

export function generateLedger(seed: number = 20240101): {
    entries: LedgerEntry[];
    monthSummaries: MonthSummary[];
    stats: LedgerStats;
} {
    const rng = seededRandom(seed);
    const months = getMonthRange();
    const entries: LedgerEntry[] = [];
    let globalSeq = 1;

    // Track active investors for realistic patterns
    const activeInvestors: Map<string, { amount: number; tier: string; startMonth: number }> = new Map();

    for (let mi = 0; mi < months.length; mi++) {
        const { month, year, monthIdx } = months[mi];
        const volume = getMonthlyVolume(mi, months.length, rng);

        // Distribute transaction types per month
        const typeDistribution = getTypeDistribution(mi, months.length, rng);

        for (let ti = 0; ti < volume; ti++) {
            const txType = typeDistribution[ti % typeDistribution.length];
            // Cap the max day: for the current month, never exceed today's date
            const isCurrentMonth = year === TODAY_YEAR && monthIdx === TODAY_MONTH;
            const maxDay = isCurrentMonth ? TODAY_DAY : 28;
            const day = maxDay <= 1 ? 1 : randInt(1, maxDay, rng);
            const hour = randInt(9, 18, rng);
            const minute = randInt(0, 59, rng);
            const dateStr = `${year}-${String(monthIdx + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const displayDate = `${day} ${MONTHS_SHORT[monthIdx]} ${year}`;

            let amount = 0;
            let direction: "INFLOW" | "OUTFLOW" = "INFLOW";
            let entityName = "";
            let entityType: EntityType = "INVESTOR";
            let status: TransactionStatus = "COMPLETED";
            let narration = "";
            let tier: string | undefined;
            let commissionLevel: string | undefined;

            switch (txType) {
                case "INVESTMENT_INFLOW": {
                    const inv = generateInvestmentAmount(rng);
                    amount = inv.amount;
                    tier = inv.tier;
                    direction = "INFLOW";
                    const investorName = pick(INVESTOR_NAMES, rng);
                    entityName = investorName;
                    entityType = "INVESTOR";
                    status = "COMPLETED";
                    narration = `Investment received — Tier ${tier} (Level ${INVESTMENT_TIERS.find(t => t.tier === tier)?.level})`;
                    activeInvestors.set(`${investorName}-${mi}`, { amount, tier, startMonth: mi });
                    break;
                }
                case "PROFIT_DISBURSEMENT": {
                    const investors = Array.from(activeInvestors.entries());
                    if (investors.length > 0) {
                        const [key, data] = pick(investors, rng);
                        amount = generateProfitAmount(data.amount, data.tier, rng);
                        tier = data.tier;
                    } else {
                        amount = randInt(5000, 50000, rng);
                    }
                    direction = "OUTFLOW";
                    entityName = pick(INVESTOR_NAMES, rng);
                    entityType = "INVESTOR";
                    status = "WITHDRAWN_TO_BANK";
                    narration = `Monthly profit disbursed${tier ? ` — Tier ${tier}` : ""}`;
                    break;
                }
                case "COMMISSION_PAYOUT": {
                    amount = generateCommissionAmount(rng);
                    direction = "OUTFLOW";
                    commissionLevel = pick(COMMISSION_TIERS, rng);
                    entityName = pick([...INVESTOR_NAMES, ...FRANCHISE_PARTNERS], rng);
                    entityType = rng() < 0.6 ? "AFFILIATE" : "FRANCHISE_PARTNER";
                    status = "WITHDRAWN_TO_BANK";
                    narration = `${commissionLevel} level commission — referral network payout`;
                    break;
                }
                case "FRANCHISE_FEE": {
                    amount = generateFranchiseFee(rng);
                    direction = "INFLOW";
                    entityName = pick(FRANCHISE_PARTNERS, rng);
                    entityType = "FRANCHISE_PARTNER";
                    status = "COMPLETED";
                    narration = `Franchise onboarding fee — territory allocation`;
                    break;
                }
                case "FRANCHISE_ROYALTY": {
                    amount = randInt(25000, 150000, rng);
                    direction = "INFLOW";
                    entityName = pick(FRANCHISE_PARTNERS, rng);
                    entityType = "FRANCHISE_PARTNER";
                    status = "COMPLETED";
                    narration = `Monthly franchise royalty — business volume share`;
                    break;
                }
                case "VENDOR_ONBOARDING": {
                    amount = generateVendorFee(rng);
                    direction = "INFLOW";
                    entityName = pick(VENDOR_NAMES, rng);
                    entityType = "VENDOR";
                    status = "COMPLETED";
                    narration = `Vendor onboarding fee — marketplace listing`;
                    break;
                }
                case "VENDOR_BUSINESS": {
                    amount = randInt(50000, 500000, rng);
                    direction = "OUTFLOW";
                    entityName = pick(VENDOR_NAMES, rng);
                    entityType = "VENDOR";
                    status = "SETTLED";
                    narration = `Vendor business payment — product supply settlement`;
                    break;
                }
                case "BANK_WITHDRAWAL": {
                    amount = randInt(100000, 5000000, rng);
                    direction = "OUTFLOW";
                    entityName = "Brave Ecom Pvt Ltd";
                    entityType = "COMPANY";
                    status = "WITHDRAWN_TO_BANK";
                    narration = `Consolidated withdrawal to operating bank account`;
                    break;
                }
                case "ACCOUNT_CLOSURE": {
                    const closureAmounts = [500000, 750000, 1000000, 1500000, 2000000, 3000000];
                    amount = pick(closureAmounts, rng);
                    direction = "OUTFLOW";
                    entityName = pick(INVESTOR_NAMES, rng);
                    entityType = "INVESTOR";
                    status = "WITHDRAWN_TO_BANK";
                    narration = `Account closure — final settlement + accrued returns`;
                    break;
                }
            }

            const paymentMode = selectPaymentMode(amount, rng);
            const bankDetails = generateBankDetails(rng);

            entries.push({
                id: `ledger-${globalSeq}`,
                refId: generateRefId(year, monthIdx, globalSeq),
                date: `${dateStr}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00.000Z`,
                displayDate,
                type: txType,
                typeLabel: TRANSACTION_LABELS[txType],
                entityName,
                entityType,
                amount,
                direction,
                paymentMode,
                bankName: bankDetails.bankName,
                ifscCode: bankDetails.ifscCode,
                accountNumber: bankDetails.accountNumber,
                status,
                narration,
                month,
                tier,
                commissionLevel,
            });

            globalSeq++;
        }
    }

    // Sort by date — NEWEST FIRST, oldest at bottom
    entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Re-assign sequential IDs after sort
    entries.forEach((e, i) => {
        e.id = `ledger-${i + 1}`;
    });

    // Compute month summaries
    const monthSummaries = computeMonthSummaries(entries, months);

    // Compute global stats
    const stats = computeStats(entries);

    return { entries, monthSummaries, stats };
}

// ─── Transaction Type Distribution Per Month ────────────────────────────────

function getTypeDistribution(monthIndex: number, totalMonths: number, rng: () => number): TransactionType[] {
    const types: TransactionType[] = [];
    const progress = monthIndex / totalMonths;

    // Investment inflows (25-35% of transactions)
    const investmentCount = randInt(3, Math.floor(8 + progress * 12), rng);
    for (let i = 0; i < investmentCount; i++) types.push("INVESTMENT_INFLOW");

    // Profit disbursements (15-25%)
    const profitCount = randInt(2, Math.floor(5 + progress * 10), rng);
    for (let i = 0; i < profitCount; i++) types.push("PROFIT_DISBURSEMENT");

    // Commission payouts (10-20%)
    const commissionCount = randInt(1, Math.floor(3 + progress * 8), rng);
    for (let i = 0; i < commissionCount; i++) types.push("COMMISSION_PAYOUT");

    // Franchise fees (1-3 per month, more as business grows)
    if (rng() < 0.3 + progress * 0.3) {
        types.push("FRANCHISE_FEE");
        if (rng() < progress * 0.5) types.push("FRANCHISE_FEE");
    }

    // Franchise royalties (monthly from existing partners)
    const royaltyCount = Math.min(Math.floor(progress * 6), 4);
    for (let i = 0; i < royaltyCount; i++) types.push("FRANCHISE_ROYALTY");

    // Vendor onboarding (occasional)
    if (rng() < 0.2 + progress * 0.3) types.push("VENDOR_ONBOARDING");

    // Vendor business payments (regular)
    const vendorPayments = randInt(1, Math.floor(2 + progress * 4), rng);
    for (let i = 0; i < vendorPayments; i++) types.push("VENDOR_BUSINESS");

    // Bank withdrawals (2-5 per month — "withdrawn to bank")
    const withdrawalCount = randInt(2, Math.floor(3 + progress * 4), rng);
    for (let i = 0; i < withdrawalCount; i++) types.push("BANK_WITHDRAWAL");

    // Account closures (rare, 0-1 per month)
    if (rng() < 0.15 + progress * 0.1) types.push("ACCOUNT_CLOSURE");

    // Shuffle
    for (let i = types.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [types[i], types[j]] = [types[j], types[i]];
    }

    return types;
}

// ─── Summaries ──────────────────────────────────────────────────────────────

function computeMonthSummaries(
    entries: LedgerEntry[],
    months: { month: string; label: string }[]
): MonthSummary[] {
    return months.map(m => {
        const monthEntries = entries.filter(e => e.month === m.month);
        const inflow = monthEntries.filter(e => e.direction === "INFLOW").reduce((s, e) => s + e.amount, 0);
        const outflow = monthEntries.filter(e => e.direction === "OUTFLOW").reduce((s, e) => s + e.amount, 0);
        const investorSet = new Set(
            monthEntries.filter(e => e.entityType === "INVESTOR").map(e => e.entityName)
        );
        const withdrawals = monthEntries.filter(
            e => e.status === "WITHDRAWN_TO_BANK"
        ).length;

        return {
            month: m.month,
            label: m.label,
            totalInflow: inflow,
            totalOutflow: outflow,
            netFlow: inflow - outflow,
            transactionCount: monthEntries.length,
            investorCount: investorSet.size,
            withdrawalCount: withdrawals,
        };
    });
}

function computeStats(entries: LedgerEntry[]): LedgerStats {
    const inflow = entries.filter(e => e.direction === "INFLOW").reduce((s, e) => s + e.amount, 0);
    const outflow = entries.filter(e => e.direction === "OUTFLOW").reduce((s, e) => s + e.amount, 0);
    const withdrawn = entries
        .filter(e => e.status === "WITHDRAWN_TO_BANK")
        .reduce((s, e) => s + e.amount, 0);
    const commissions = entries
        .filter(e => e.type === "COMMISSION_PAYOUT")
        .reduce((s, e) => s + e.amount, 0);
    const investors = new Set(
        entries.filter(e => e.entityType === "INVESTOR").map(e => e.entityName)
    ).size;
    const franchises = new Set(
        entries.filter(e => e.entityType === "FRANCHISE_PARTNER").map(e => e.entityName)
    ).size;
    const vendors = new Set(
        entries.filter(e => e.entityType === "VENDOR").map(e => e.entityName)
    ).size;

    return {
        totalInflow: inflow,
        totalOutflow: outflow,
        totalWithdrawnToBank: withdrawn,
        totalCommissionPaid: commissions,
        activeInvestors: investors,
        franchisePartners: franchises,
        vendorsOnboarded: vendors,
        totalTransactions: entries.length,
    };
}

// ─── Exports for server components ──────────────────────────────────────────

let _cached: ReturnType<typeof generateLedger> | null = null;

export function getLedgerData() {
    if (!_cached) {
        _cached = generateLedger();
    }
    return _cached;
}

export function getLedgerByMonth(month: string) {
    const { entries } = getLedgerData();
    return entries.filter(e => e.month === month);
}

export function getLatestEntries(count: number = 10) {
    const { entries } = getLedgerData();
    return entries.slice(0, count); // Already sorted newest-first
}

export function getMonthList() {
    const { monthSummaries } = getLedgerData();
    return monthSummaries;
}
