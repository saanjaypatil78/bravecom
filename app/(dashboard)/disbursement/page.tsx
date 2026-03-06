"use client";

import { useEffect, useState } from "react";

interface LogEntry {
    id: string;
    transactionId: string;
    level: number;
    sourceUser: string;
    beneficiary: string;
    amount: number;
    status: string;
    createdAt: string;
}

function formatCurrency(val: number): string {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
    return `₹${val.toLocaleString("en-IN")}`;
}

const LEVEL_BADGE_COLORS = [
    "bg-[#1173d4]/10 text-[#1173d4]",
    "bg-blue-400/10 text-blue-400",
    "bg-indigo-400/10 text-indigo-400",
    "bg-slate-400/10 text-slate-400",
    "bg-slate-400/10 text-slate-400",
    "bg-slate-400/10 text-slate-400",
];

export default function DisbursementPage() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [totalDisbursed, setTotalDisbursed] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        
        async function fetchData() {
            try {
                const res = await fetch("/api/dashboard");
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const text = await res.text();
                if (!text) return;
                const json = JSON.parse(text);
                if (mounted) {
                    setLogs(json.recentLogs || []);
                    setTotalDisbursed(json.networkStats?.totalEarnings || 0);
                }
            } catch (e) {
                console.error(e);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        
        fetchData();
        
        return () => { mounted = false; };
    }, []);

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#1173d4] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // Aggregate by level
    const levelTotals: Record<number, number> = {};
    logs.forEach((l) => {
        levelTotals[l.level] = (levelTotals[l.level] || 0) + l.amount;
    });

    return (
        <>
            <header className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center px-8 bg-white dark:bg-[#101922]">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#1173d4]">payments</span>
                    Disbursement History &amp; Receipts
                </h2>
            </header>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-[#1173d4] to-blue-700 rounded-xl p-5 text-white shadow-lg animate-fade-in">
                        <p className="text-white/60 text-[10px] uppercase font-bold mb-1">Total Disbursed</p>
                        <p className="text-2xl font-black">{formatCurrency(totalDisbursed)}</p>
                    </div>
                    {[1, 2, 3].map((level) => (
                        <div key={level} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm animate-fade-in" style={{ animationDelay: `${0.1 * level}s` }}>
                            <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Level {level} Total</p>
                            <p className="text-xl font-black text-[#1173d4]">{formatCurrency(levelTotals[level] || 0)}</p>
                        </div>
                    ))}
                </div>

                {/* Full Log */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <h4 className="font-bold">Commission Disbursement Log</h4>
                        <span className="text-xs text-slate-500">Showing {logs.length} entries</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] uppercase text-slate-500 font-bold">
                                <tr>
                                    <th className="px-6 py-4">TXN ID</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Level</th>
                                    <th className="px-6 py-4">From</th>
                                    <th className="px-6 py-4">To</th>
                                    <th className="px-6 py-4 text-right">Amount</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                                {logs.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                                            No disbursements found. Run a distribution cycle first.
                                        </td>
                                    </tr>
                                ) : logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-slate-500">{log.transactionId}</td>
                                        <td className="px-6 py-4">{new Date(log.createdAt).toLocaleString("en-IN")}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded-full ${LEVEL_BADGE_COLORS[log.level - 1]} text-[10px] font-bold`}>
                                                L{log.level}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium">{log.sourceUser}</td>
                                        <td className="px-6 py-4 font-medium">{log.beneficiary}</td>
                                        <td className="px-6 py-4 text-right font-bold text-green-500">+{formatCurrency(log.amount)}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-100 dark:bg-green-500/10 px-2 py-0.5 rounded">
                                                <span className="w-1 h-1 rounded-full bg-green-600"></span>
                                                {log.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
