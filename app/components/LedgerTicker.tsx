"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { LedgerEntry } from "@/lib/ledger/ledgerTypes";
import { TRANSACTION_COLORS, TRANSACTION_LABELS } from "@/lib/ledger/ledgerTypes";

interface LedgerTickerProps {
    entries: LedgerEntry[];
}

function formatINR(amount: number): string {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount.toLocaleString("en-IN")}`;
}

export default function LedgerTicker({ entries }: LedgerTickerProps) {
    const [visibleIndex, setVisibleIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setVisibleIndex((prev) => (prev + 1) % entries.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [entries.length]);

    if (entries.length === 0) return null;

    const displayEntries = entries.slice(0, 8);

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25f4f4] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#25f4f4]"></span>
                    </span>
                    <span className="text-sm font-semibold text-[#25f4f4] tracking-wide uppercase">Live Ledger</span>
                </div>
                <Link href="/ledger" className="text-sm text-[#25f4f4] hover:underline font-medium flex items-center gap-1">
                    View Full Ledger
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
            </div>

            <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-5 gap-2 px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-white/5">
                    <span>Date</span>
                    <span>Type</span>
                    <span>Entity</span>
                    <span className="text-right">Amount</span>
                    <span>Status</span>
                </div>

                {/* Animated Rows */}
                <div className="divide-y divide-white/5">
                    {displayEntries.map((entry, i) => {
                        const color = TRANSACTION_COLORS[entry.type as keyof typeof TRANSACTION_COLORS] || "#94a3b8";
                        return (
                            <motion.div
                                key={entry.id}
                                className="grid grid-cols-5 gap-2 px-4 py-2.5 text-sm hover:bg-white/5 transition-colors"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: i * 0.08 }}
                            >
                                <span className="text-slate-400 text-xs">{entry.displayDate}</span>
                                <span className="text-xs px-1.5 py-0.5 rounded w-fit" style={{ backgroundColor: `${color}20`, color }}>
                                    {TRANSACTION_LABELS[entry.type as keyof typeof TRANSACTION_LABELS]?.split(" ").slice(0, 2).join(" ")}
                                </span>
                                <span className="text-white text-xs truncate">{entry.entityName}</span>
                                <span className={`text-xs font-bold text-right ${entry.direction === "INFLOW" ? "text-emerald-400" : "text-red-400"}`}>
                                    {entry.direction === "INFLOW" ? "+" : "−"}{formatINR(entry.amount)}
                                </span>
                                <span className={`text-xs ${entry.status === "WITHDRAWN_TO_BANK" ? "text-[#25f4f4]" : "text-slate-400"}`}>
                                    {entry.status === "WITHDRAWN_TO_BANK" ? "→ Bank" : entry.status === "COMPLETED" ? "✓ Done" : "● Settled"}
                                </span>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Auto-cycling highlight */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={visibleIndex}
                        className="px-4 py-3 bg-gradient-to-r from-[#25f4f4]/10 to-transparent border-t border-[#25f4f4]/20"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <p className="text-xs text-[#25f4f4]">
                            <span className="font-bold">{entries[visibleIndex]?.refId}</span>
                            {" — "}
                            {entries[visibleIndex]?.narration}
                            {" via "}
                            <span className="font-bold">{entries[visibleIndex]?.paymentMode}</span>
                            {" • "}
                            {entries[visibleIndex]?.bankName}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
