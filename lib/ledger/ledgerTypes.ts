// ============================================================================
// LEDGER TYPE DEFINITIONS
// Brave Ecom Pvt Ltd — Public Financial Ledger
// ============================================================================

export type TransactionType =
    | "INVESTMENT_INFLOW"
    | "PROFIT_DISBURSEMENT"
    | "COMMISSION_PAYOUT"
    | "FRANCHISE_FEE"
    | "FRANCHISE_ROYALTY"
    | "VENDOR_ONBOARDING"
    | "VENDOR_BUSINESS"
    | "BANK_WITHDRAWAL"
    | "ACCOUNT_CLOSURE";

export type PaymentMode = "UPI" | "NEFT" | "RTGS" | "IMPS";

export type TransactionStatus =
    | "COMPLETED"
    | "PROCESSING"
    | "WITHDRAWN_TO_BANK"
    | "SETTLED";

export type EntityType =
    | "INVESTOR"
    | "FRANCHISE_PARTNER"
    | "VENDOR"
    | "COMPANY"
    | "AFFILIATE";

export interface LedgerEntry {
    id: string;
    refId: string;             // e.g. TXN-2024-01-00001
    date: string;              // ISO date string
    displayDate: string;       // e.g. "15 Jan 2024"
    type: TransactionType;
    typeLabel: string;         // Human-readable label
    entityName: string;        // Masked entity name
    entityType: EntityType;
    amount: number;
    direction: "INFLOW" | "OUTFLOW";
    paymentMode: PaymentMode;
    bankName: string;          // e.g. "HDFC Bank"
    ifscCode: string;          // Masked: HDFC0001***
    accountNumber: string;     // Masked: XXXX XXXX 4523
    status: TransactionStatus;
    narration: string;         // Transaction description
    month: string;             // YYYY-MM for filtering
    tier?: string;             // Investment tier (A-H)
    commissionLevel?: string;  // BRONZE/SILVER/GOLD/PLATINUM/AMBASSADOR
}

export interface MonthSummary {
    month: string;
    label: string;             // "January 2024"
    totalInflow: number;
    totalOutflow: number;
    netFlow: number;
    transactionCount: number;
    investorCount: number;
    withdrawalCount: number;
}

export interface LedgerStats {
    totalInflow: number;
    totalOutflow: number;
    totalWithdrawnToBank: number;
    totalCommissionPaid: number;
    activeInvestors: number;
    franchisePartners: number;
    vendorsOnboarded: number;
    totalTransactions: number;
}

export const TRANSACTION_LABELS: Record<TransactionType, string> = {
    INVESTMENT_INFLOW: "Investment Received",
    PROFIT_DISBURSEMENT: "Profit Disbursed",
    COMMISSION_PAYOUT: "Commission Payout",
    FRANCHISE_FEE: "Franchise Onboarding Fee",
    FRANCHISE_ROYALTY: "Franchise Monthly Royalty",
    VENDOR_ONBOARDING: "Vendor Onboarding Fee",
    VENDOR_BUSINESS: "Vendor Business Payment",
    BANK_WITHDRAWAL: "Withdrawn to Bank",
    ACCOUNT_CLOSURE: "Account Closure Settlement",
};

export const TRANSACTION_COLORS: Record<TransactionType, string> = {
    INVESTMENT_INFLOW: "#10b981",       // emerald
    PROFIT_DISBURSEMENT: "#f59e0b",     // amber
    COMMISSION_PAYOUT: "#8b5cf6",       // violet
    FRANCHISE_FEE: "#06b6d4",           // cyan
    FRANCHISE_ROYALTY: "#0ea5e9",        // sky
    VENDOR_ONBOARDING: "#ec4899",       // pink
    VENDOR_BUSINESS: "#f97316",         // orange
    BANK_WITHDRAWAL: "#25f4f4",         // teal (brand)
    ACCOUNT_CLOSURE: "#ef4444",         // red
};

export const PAYMENT_MODE_LIMITS: Record<PaymentMode, { min: number; max: number }> = {
    UPI: { min: 100, max: 100000 },
    IMPS: { min: 1000, max: 500000 },
    NEFT: { min: 10000, max: 1000000 },
    RTGS: { min: 200000, max: 100000000 },
};
