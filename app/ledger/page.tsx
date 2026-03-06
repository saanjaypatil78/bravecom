import React from "react";
import Link from "next/link";
import { getLedgerData } from "@/lib/ledger/generateLedger";
import LedgerTable from "@/app/components/LedgerTable";

export const metadata = {
    title: "Financial Ledger | Brave Ecom Pvt Ltd",
    description:
        "Public financial ledger showing all transactions — investments, disbursements, commissions, franchise fees, and bank withdrawals from January 2024 to present.",
};

export default function LedgerPage() {
    const { entries, monthSummaries, stats } = getLedgerData();

    return (
        <div className="bg-[#f5f8f8] dark:bg-[#102222] min-h-screen text-slate-900 dark:text-[#e2e8e8] font-display">
            <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 pb-16">
                {/* Header */}
                <header className="flex items-center justify-between py-5 border-b border-slate-200 dark:border-[#283939] mb-8">
                    <Link href="/" className="flex items-center gap-3 text-slate-900 dark:text-white">
                        <div className="size-8 text-[#25f4f4]">
                            <span className="material-symbols-outlined text-[28px]">diamond</span>
                        </div>
                        <h2 className="text-xl font-bold tracking-tight">Brave Ecom Pvt Ltd</h2>
                    </Link>
                    <nav className="flex items-center gap-6">
                        <Link href="/" className="text-slate-600 dark:text-[#9cbaba] hover:text-[#25f4f4] text-sm font-medium transition-colors">Home</Link>
                        <Link href="/mall" className="text-slate-600 dark:text-[#9cbaba] hover:text-[#25f4f4] text-sm font-medium transition-colors">Mall</Link>
                        <Link href="/about" className="text-slate-600 dark:text-[#9cbaba] hover:text-[#25f4f4] text-sm font-medium transition-colors">About</Link>
                    </nav>
                </header>

                {/* Page Title */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-[#25f4f4] text-lg">verified</span>
                        <span className="text-xs font-semibold tracking-widest text-[#25f4f4] uppercase">Transparent Operations</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-3">
                        Public Financial Ledger
                    </h1>
                    <p className="text-base md:text-lg text-slate-600 dark:text-[#9cbaba] max-w-2xl">
                        Complete transparency — every investment inflow, profit disbursement, commission payout,
                        franchise fee, and bank withdrawal from <strong className="text-slate-900 dark:text-white">January 2024</strong> to present.
                    </p>
                    <div className="flex items-center gap-4 mt-4 text-sm text-slate-500 dark:text-[#9cbaba]">
                        <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-base">schedule</span>
                            Last updated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-base">receipt_long</span>
                            {stats.totalTransactions.toLocaleString()} transactions
                        </span>
                    </div>
                </div>

                {/* Ledger Table */}
                <LedgerTable entries={entries} monthSummaries={monthSummaries} stats={stats} />

                {/* Footer Note */}
                <div className="mt-12 p-6 bg-white dark:bg-[#162a2a] rounded-xl border border-slate-200 dark:border-[#283939] text-center">
                    <p className="text-sm text-slate-500 dark:text-[#9cbaba]">
                        <span className="material-symbols-outlined text-[#25f4f4] text-base align-middle mr-1">shield</span>
                        All transactions are processed through secure banking channels using <strong>UPI, NEFT, RTGS, and IMPS</strong>.
                        Entity names and bank details are partially masked for privacy compliance. This ledger is publicly accessible and does not require authentication.
                    </p>
                </div>
            </div>
        </div>
    );
}
