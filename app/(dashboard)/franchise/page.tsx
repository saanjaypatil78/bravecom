"use client";

import { useEffect, useState } from "react";

interface FranchiseData {
    id: string;
    name: string;
    walletBalance: number;
    referralsMade: { referredUser: { name: string; id: string } }[];
}

function formatCurrency(val: number): string {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
    return `₹${val.toLocaleString("en-IN")}`;
}

export default function FranchisePage() {
    const [data, setData] = useState<FranchiseData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/register")
            .then((r) => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.text();
            })
            .then((text) => {
                if (!text) return;
                const d = JSON.parse(text);
                const franchises = (d.users || []).filter(
                    (u: { role: string }) => u.role === "FRANCHISE_PARTNER"
                );
                setData(franchises);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#1173d4] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <>
            <header className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center px-8 bg-white dark:bg-[#101922]">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#1173d4]">storefront</span>
                    Franchise Partners
                </h2>
            </header>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.map((fp) => (
                        <div
                            key={fp.id}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow animate-fade-in"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1173d4] to-blue-700 flex items-center justify-center text-white text-xl font-black">
                                    {fp.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">{fp.name}</h4>
                                    <span className="text-[10px] font-bold text-[#1173d4] bg-[#1173d4]/10 px-2 py-0.5 rounded">
                                        FRANCHISE PARTNER
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-end p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg">
                                    <p className="text-xs text-slate-500 font-medium">Wallet Balance</p>
                                    <p className="text-lg font-black text-green-500">{formatCurrency(fp.walletBalance)}</p>
                                </div>
                                <div className="flex justify-between items-end p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg">
                                    <p className="text-xs text-slate-500 font-medium">Direct Referrals</p>
                                    <p className="text-lg font-bold">{fp.referralsMade?.length || 0}</p>
                                </div>
                            </div>

                            {fp.referralsMade && fp.referralsMade.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Affiliate</p>
                                    <div className="space-y-1">
                                        {fp.referralsMade.slice(0, 5).map((r, idx) => (
                                            <div key={idx} className="flex items-center justify-between text-xs">
                                                <span className="font-medium">{r.referredUser.name}</span>
                                                <span className="font-mono text-slate-500">{r.referredUser.id.slice(0, 8)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {data.length === 0 && (
                        <div className="col-span-full text-center py-12 text-slate-500">
                            <span className="material-symbols-outlined text-4xl mb-2">storefront</span>
                            <p>No franchise partners found. Seed the database first.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
