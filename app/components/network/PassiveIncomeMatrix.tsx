"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Zap, Globe, Coins, HandCoins, ActivitySquare, Network } from "lucide-react";
import Link from "next/link";

interface MatrixData {
    globalWealth: number;
    roiBase: number;
    referralMatrix: number;
    franchiseRoyalties: number;
}

export default function PassiveIncomeMatrix() {
    const [data, setData] = useState<MatrixData>({
        globalWealth: 0,
        roiBase: 0,
        referralMatrix: 0,
        franchiseRoyalties: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/dashboard', { cache: 'no-store' });
                const json = await res.json();
                
                const totalAUM = json?.networkStats?.totalAUM || 0;
                const totalEarnings = json?.networkStats?.totalEarnings || 0;
                
                setData({
                    globalWealth: totalAUM + totalEarnings,
                    roiBase: totalAUM * 0.15,
                    referralMatrix: totalEarnings * 0.7,
                    franchiseRoyalties: totalEarnings * 0.3
                });
            } catch (error) {
                console.error('Failed to fetch matrix data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const formatCrore = (value: number) => {
        if (value >= 10000000) {
            return `₹${(value / 10000000).toFixed(1)} CR`;
        }
        return `₹${(value / 100000).toFixed(1)} L`;
    };

    const MATRIX_DATA = [
        {
            title: "Global Wealth Escapement",
            value: loading ? "..." : formatCrore(data.globalWealth),
            subtitle: "Total distributed across network",
            icon: <Globe className="w-8 h-8 text-blue-400" />,
            gradient: "from-blue-500/10 to-blue-900/20",
            border: "border-blue-500/20",
            glow: "bg-blue-500/20"
        },
        {
            title: "Primary 15% ROI Base",
            value: loading ? "..." : formatCrore(data.roiBase),
            subtitle: "Zero-deduction capital returns",
            icon: <Coins className="w-8 h-8 text-emerald-400" />,
            gradient: "from-emerald-500/10 to-emerald-900/20",
            border: "border-emerald-500/20",
            glow: "bg-emerald-500/20"
        },
        {
            title: "6-Level Matrix Lift",
            value: loading ? "..." : formatCrore(data.referralMatrix),
            subtitle: "Referral commissions unlocked",
            icon: <Network className="w-8 h-8 text-amber-400" />,
            gradient: "from-amber-500/10 to-amber-900/20",
            border: "border-amber-500/20",
            glow: "bg-amber-500/20"
        },
        {
            title: "Franchise 1% Royalties",
            value: loading ? "..." : formatCrore(data.franchiseRoyalties),
            subtitle: "System structural savings",
            icon: <HandCoins className="w-8 h-8 text-purple-400" />,
            gradient: "from-purple-500/10 to-purple-900/20",
            border: "border-purple-500/20",
            glow: "bg-purple-500/20"
        }
    ];
    return (
        <div className="w-full relative py-8">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.03),transparent_50%)] pointer-events-none"></div>

            <div className="flex flex-col md:flex-row justify-between items-end mb-8 relative z-10">
                <div>
                    <h2 className="text-3xl font-bold font-['Outfit'] text-white mb-2 flex items-center">
                        <ActivitySquare className="w-8 h-8 mr-3 text-emerald-400" />
                        Passive Income Matrix
                    </h2>
                    <p className="text-gray-400 max-w-xl">
                        Live telemetry of massive wealth generation vectors. The Sun Ray engine automatically balances base ROI against structural 6-level referral lifts and franchise royalties.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {MATRIX_DATA.map((kpi, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1, duration: 0.5 }}
                        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${kpi.gradient} border ${kpi.border} p-6 group hover:border-white/30 transition-all cursor-crosshair`}
                    >
                        {/* Background Glow Effect */}
                        <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full blur-3xl ${kpi.glow} opacity-50 group-hover:opacity-100 transition-opacity`} />

                        <div className="relative z-10">
                            <div className="p-3 bg-[#050b14]/50 rounded-xl inline-block mb-4 border border-white/5 group-hover:bg-[#050b14]/80 transition-colors">
                                {kpi.icon}
                            </div>
                            <h3 className="text-gray-300 font-medium text-sm mb-1">{kpi.title}</h3>
                            <div className="text-3xl font-bold text-white mb-1 tracking-tight">{kpi.value}</div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{kpi.subtitle}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
                <div className="flex-1 bg-[#0b1526]/80 border border-white/5 rounded-2xl p-6 flex flex-col justify-center">
                    <h4 className="text-white font-bold text-lg flex items-center mb-2">
                        <ShieldCheck className="w-5 h-5 mr-2 text-emerald-500" />
                        Zero Deduction Promise
                    </h4>
                    <p className="text-sm text-gray-400">
                        Unlike standard matrixes, the base 15% ROI is completely shielded. Referral and royalty budgets are pulled from a separate institutional fund margin.
                    </p>
                </div>

                <Link href="/mall" className="flex-1 bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-500/30 rounded-2xl p-6 flex flex-col justify-center hover:from-amber-600/30 hover:to-orange-600/30 transition-all group">
                    <h4 className="text-white font-bold text-lg flex items-center mb-2">
                        <Zap className="w-5 h-5 mr-2 text-amber-500" />
                        Spend Matrix Yields
                    </h4>
                    <p className="text-sm text-amber-200/70 mb-4">
                        Directly transfer your massive networking yield into the Sovereign Mall for luxury asset acquisition.
                    </p>
                    <div className="flex items-center text-amber-400 font-medium text-sm group-hover:text-amber-300">
                        Enter Sovereign Mall <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                </Link>
            </div>
        </div>
    );
}
