"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LedgerEntry,
    MonthSummary,
    LedgerStats,
    TRANSACTION_COLORS,
    TRANSACTION_LABELS,
} from "@/lib/ledger/ledgerTypes";

// ─── Format Helpers ─────────────────────────────────────────────────────────

function formatINR(amount: number): string {
    return "₹ " + amount.toLocaleString("en-IN");
}

function formatCompact(amount: number): string {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount}`;
}

// ─── Status Badge ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
    const config: Record<string, { bg: string; text: string; label: string }> = {
        COMPLETED: { bg: "bg-emerald-500/15", text: "text-emerald-400", label: "Completed" },
        PROCESSING: { bg: "bg-amber-500/15", text: "text-amber-400", label: "Processing" },
        WITHDRAWN_TO_BANK: { bg: "bg-cyan-500/15", text: "text-[#25f4f4]", label: "Withdrawn to Bank" },
        SETTLED: { bg: "bg-blue-500/15", text: "text-blue-400", label: "Settled" },
    };
    const c = config[status] || config.COMPLETED;
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
            {c.label}
        </span>
    );
}

// ─── Type Badge ─────────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: string }) {
    const color = TRANSACTION_COLORS[type as keyof typeof TRANSACTION_COLORS] || "#94a3b8";
    const label = TRANSACTION_LABELS[type as keyof typeof TRANSACTION_LABELS] || type;
    return (
        <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
            style={{ backgroundColor: `${color}18`, color }}
        >
            {label}
        </span>
    );
}

// ─── Payment Mode Chip ──────────────────────────────────────────────────────

function PaymentModeChip({ mode }: { mode: string }) {
    const modeColors: Record<string, string> = {
        UPI: "text-green-400 bg-green-500/10",
        NEFT: "text-blue-400 bg-blue-500/10",
        RTGS: "text-purple-400 bg-purple-500/10",
        IMPS: "text-orange-400 bg-orange-500/10",
    };
    return (
        <span className={`px-2 py-0.5 rounded text-xs font-bold ${modeColors[mode] || "text-slate-400 bg-slate-500/10"}`}>
            {mode}
        </span>
    );
}

// ─── Stats Cards ────────────────────────────────────────────────────────────

function StatsBar({ stats }: { stats: LedgerStats }) {
    const statItems = [
        { label: "Total Inflow", value: formatCompact(stats.totalInflow), icon: "trending_up", color: "text-emerald-400" },
        { label: "Withdrawn to Bank", value: formatCompact(stats.totalWithdrawnToBank), icon: "account_balance", color: "text-[#25f4f4]" },
        { label: "Commission Paid", value: formatCompact(stats.totalCommissionPaid), icon: "payments", color: "text-violet-400" },
        { label: "Active Investors", value: String(stats.activeInvestors), icon: "group", color: "text-amber-400" },
        { label: "Franchise Partners", value: String(stats.franchisePartners), icon: "storefront", color: "text-cyan-400" },
        { label: "Total Transactions", value: stats.totalTransactions.toLocaleString(), icon: "receipt_long", color: "text-pink-400" },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {statItems.map((item, i) => (
                <motion.div
                    key={item.label}
                    className="bg-white dark:bg-[#162a2a] rounded-xl p-4 border border-slate-200 dark:border-[#283939] shadow-sm"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`material-symbols-outlined text-lg ${item.color}`}>{item.icon}</span>
                        <span className="text-xs text-slate-500 dark:text-[#9cbaba] font-medium">{item.label}</span>
                    </div>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{item.value}</p>
                </motion.div>
            ))}
        </div>
    );
}

// ─── Month Tabs ─────────────────────────────────────────────────────────────

function MonthTabs({
    months,
    selected,
    onSelect,
}: {
    months: MonthSummary[];
    selected: string;
    onSelect: (month: string) => void;
}) {
    return (
        <div className="flex overflow-x-auto gap-2 pb-2 mb-6 scrollbar-hide">
            <button
                onClick={() => onSelect("ALL")}
                className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${selected === "ALL"
                        ? "bg-[#25f4f4] text-[#111818] shadow-[0_0_12px_rgba(37,244,244,0.3)]"
                        : "bg-white dark:bg-[#162a2a] text-slate-600 dark:text-[#9cbaba] border border-slate-200 dark:border-[#283939] hover:border-[#25f4f4]/50"
                    }`}
            >
                All Months
            </button>
            {months.map((m) => (
                <button
                    key={m.month}
                    onClick={() => onSelect(m.month)}
                    className={`shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${selected === m.month
                            ? "bg-[#25f4f4] text-[#111818] shadow-[0_0_12px_rgba(37,244,244,0.3)]"
                            : "bg-white dark:bg-[#162a2a] text-slate-600 dark:text-[#9cbaba] border border-slate-200 dark:border-[#283939] hover:border-[#25f4f4]/50"
                        }`}
                >
                    {m.label.replace(/(\w+)\s(\d+)/, (_, mon, yr) => `${mon.slice(0, 3)} '${yr.slice(2)}`)}
                    <span className="ml-1 opacity-60">({m.transactionCount})</span>
                </button>
            ))}
        </div>
    );
}

// ─── Row Animation ──────────────────────────────────────────────────────────

const rowVariant = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: { duration: 0.4, delay: Math.min(i * 0.03, 0.8), ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    }),
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
};

// ─── Main Component ─────────────────────────────────────────────────────────

interface LedgerTableProps {
    entries: LedgerEntry[];
    monthSummaries: MonthSummary[];
    stats: LedgerStats;
}

export default function LedgerTable({ entries, monthSummaries, stats }: LedgerTableProps) {
    const [selectedMonth, setSelectedMonth] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState<string>("ALL");
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 50;

    const filteredEntries = useMemo(() => {
        let filtered = entries;
        if (selectedMonth !== "ALL") {
            filtered = filtered.filter((e) => e.month === selectedMonth);
        }
        if (typeFilter !== "ALL") {
            filtered = filtered.filter((e) => e.type === typeFilter);
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (e) =>
                    e.entityName.toLowerCase().includes(q) ||
                    e.refId.toLowerCase().includes(q) ||
                    e.narration.toLowerCase().includes(q) ||
                    e.bankName.toLowerCase().includes(q)
            );
        }
        return filtered;
    }, [entries, selectedMonth, typeFilter, searchQuery]);

    const totalPages = Math.ceil(filteredEntries.length / PAGE_SIZE);
    const paginatedEntries = filteredEntries.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    // Summary for selected month
    const selectedSummary = selectedMonth === "ALL"
        ? null
        : monthSummaries.find((m) => m.month === selectedMonth);

    return (
        <div>
            {/* Global Stats */}
            <StatsBar stats={stats} />

            {/* Month Filter Tabs */}
            <MonthTabs months={monthSummaries} selected={selectedMonth} onSelect={(m) => { setSelectedMonth(m); setPage(1); }} />

            {/* Selected Month Summary */}
            {selectedSummary && (
                <motion.div
                    className="flex flex-wrap gap-6 bg-white dark:bg-[#162a2a] rounded-xl p-4 mb-6 border border-slate-200 dark:border-[#283939]"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                >
                    <div><span className="text-xs text-slate-500 dark:text-[#9cbaba]">Inflow</span><p className="text-lg font-bold text-emerald-400">{formatCompact(selectedSummary.totalInflow)}</p></div>
                    <div><span className="text-xs text-slate-500 dark:text-[#9cbaba]">Outflow</span><p className="text-lg font-bold text-red-400">{formatCompact(selectedSummary.totalOutflow)}</p></div>
                    <div><span className="text-xs text-slate-500 dark:text-[#9cbaba]">Net Flow</span><p className={`text-lg font-bold ${selectedSummary.netFlow >= 0 ? "text-emerald-400" : "text-red-400"}`}>{formatCompact(Math.abs(selectedSummary.netFlow))}</p></div>
                    <div><span className="text-xs text-slate-500 dark:text-[#9cbaba]">Investors</span><p className="text-lg font-bold text-white">{selectedSummary.investorCount}</p></div>
                    <div><span className="text-xs text-slate-500 dark:text-[#9cbaba]">Withdrawals</span><p className="text-lg font-bold text-[#25f4f4]">{selectedSummary.withdrawalCount}</p></div>
                </motion.div>
            )}

            {/* Search + Type Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="flex-1 flex items-stretch rounded-lg h-10 bg-white dark:bg-[#162a2a] border border-slate-200 dark:border-[#283939] focus-within:border-[#25f4f4]/50 transition-colors">
                    <div className="text-[#9cbaba] flex items-center justify-center pl-4">
                        <span className="material-symbols-outlined text-xl">search</span>
                    </div>
                    <input
                        className="flex w-full bg-transparent text-slate-900 dark:text-white focus:outline-0 border-none h-full placeholder:text-[#9cbaba] px-4 text-sm"
                        placeholder="Search by entity, ref ID, bank, or narration..."
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                    />
                </div>
                <select
                    className="h-10 px-4 rounded-lg bg-white dark:bg-[#162a2a] border border-slate-200 dark:border-[#283939] text-slate-900 dark:text-white text-sm focus:outline-0 focus:border-[#25f4f4]/50"
                    value={typeFilter}
                    onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
                >
                    <option value="ALL">All Types</option>
                    {Object.entries(TRANSACTION_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                    ))}
                </select>
            </div>

            {/* Results Count */}
            <p className="text-sm text-slate-500 dark:text-[#9cbaba] mb-4">
                Showing {paginatedEntries.length} of {filteredEntries.length} transactions
                {selectedMonth !== "ALL" && ` for ${monthSummaries.find(m => m.month === selectedMonth)?.label}`}
            </p>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#283939]">
                <table className="w-full min-w-[900px]">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-[#1a2e2e] text-left">
                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-[#9cbaba] uppercase tracking-wider">Date</th>
                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-[#9cbaba] uppercase tracking-wider">Ref ID</th>
                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-[#9cbaba] uppercase tracking-wider">Type</th>
                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-[#9cbaba] uppercase tracking-wider">Entity</th>
                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-[#9cbaba] uppercase tracking-wider text-right">Amount</th>
                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-[#9cbaba] uppercase tracking-wider">Mode</th>
                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-[#9cbaba] uppercase tracking-wider">Bank / IFSC</th>
                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-[#9cbaba] uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence mode="popLayout">
                            {paginatedEntries.map((entry, i) => (
                                <motion.tr
                                    key={entry.id}
                                    custom={i}
                                    variants={rowVariant}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="border-t border-slate-100 dark:border-[#283939]/60 hover:bg-slate-50 dark:hover:bg-[#1a2e2e]/50 transition-colors group"
                                >
                                    <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap">{entry.displayDate}</td>
                                    <td className="px-4 py-3">
                                        <span className="text-xs font-mono text-slate-500 dark:text-[#9cbaba]">{entry.refId}</span>
                                    </td>
                                    <td className="px-4 py-3"><TypeBadge type={entry.type} /></td>
                                    <td className="px-4 py-3">
                                        <div>
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">{entry.entityName}</p>
                                            <p className="text-xs text-slate-500 dark:text-[#9cbaba] line-clamp-1">{entry.narration}</p>
                                        </div>
                                    </td>
                                    <td className={`px-4 py-3 text-sm font-bold text-right whitespace-nowrap ${entry.direction === "INFLOW" ? "text-emerald-500" : "text-red-400"}`}>
                                        {entry.direction === "INFLOW" ? "+" : "−"} {formatINR(entry.amount)}
                                    </td>
                                    <td className="px-4 py-3"><PaymentModeChip mode={entry.paymentMode} /></td>
                                    <td className="px-4 py-3">
                                        <div>
                                            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">{entry.bankName}</p>
                                            <p className="text-xs text-slate-400 dark:text-[#9cbaba] font-mono">{entry.ifscCode}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3"><StatusBadge status={entry.status} /></td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                    <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="flex items-center justify-center size-10 rounded-lg border border-slate-200 dark:border-[#283939] bg-white dark:bg-[#162a2a] text-slate-500 dark:text-[#9cbaba] hover:bg-slate-100 dark:hover:bg-[#283939] transition-colors disabled:opacity-30"
                    >
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                        let pageNum: number;
                        if (totalPages <= 7) pageNum = i + 1;
                        else if (page <= 4) pageNum = i + 1;
                        else if (page >= totalPages - 3) pageNum = totalPages - 6 + i;
                        else pageNum = page - 3 + i;
                        return (
                            <button
                                key={pageNum}
                                onClick={() => setPage(pageNum)}
                                className={`flex items-center justify-center size-10 rounded-lg text-sm font-medium transition-all ${page === pageNum
                                        ? "bg-[#25f4f4] text-[#111818] font-bold"
                                        : "border border-slate-200 dark:border-[#283939] bg-white dark:bg-[#162a2a] text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-[#283939]"
                                    }`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                    <button
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="flex items-center justify-center size-10 rounded-lg border border-slate-200 dark:border-[#283939] bg-white dark:bg-[#162a2a] text-slate-500 dark:text-[#9cbaba] hover:bg-slate-100 dark:hover:bg-[#283939] transition-colors disabled:opacity-30"
                    >
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>
            )}
        </div>
    );
}
