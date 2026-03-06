"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Award } from 'lucide-react';
import { COMMISSION_CONFIG } from '@/lib/calculations/progressive-commission';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

interface RankData {
    rank: string;
    target: number;
    royaltyAddon: number;
    commissions: { L1: number; L2: number; L3: number; L4: number; L5: number; L6: number };
    badge: string;
}

export function ProgressiveRankDashboard() {
    const [selectedRank, setSelectedRank] = useState<string>('BRONZE');

    // Using config from the calculation engine
    const ranks: RankData[] = [...COMMISSION_CONFIG.FRANCHISE_RANKS];

    // Mock current user progress
    const currentBusiness = 12500000; // 1.25 Cr
    const currentRankIndex = ranks.findIndex(r => r.target > currentBusiness) - 1;
    const currentRank = currentRankIndex >= 0 ? ranks[currentRankIndex] : ranks[ranks.length - 1];
    const nextRank = currentRankIndex + 1 < ranks.length ? ranks[currentRankIndex + 1] : null;

    const progressPct = nextRank ? (currentBusiness - currentRank.target) / (nextRank.target - currentRank.target) * 100 : 100;

    const getRankColor = (badge: string) => {
        switch (badge) {
            case 'GRAY': return 'from-gray-400 to-gray-600 border-gray-500';
            case 'BRONZE': return 'from-[#CD7F32] to-[#A0522D] border-[#CD7F32]';
            case 'SILVER': return 'from-slate-300 to-slate-500 border-slate-400';
            case 'GOLD': return 'from-yellow-400 to-yellow-600 border-yellow-500';
            case 'PLATINUM': return 'from-teal-300 to-teal-500 border-teal-400';
            case 'DIAMOND': return 'from-cyan-300 to-blue-500 border-cyan-400';
            case 'AMBASSADOR': return 'from-purple-500 to-indigo-700 border-purple-500';
            default: return 'from-gray-600 to-gray-800 border-gray-700';
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white p-6 md:p-12 font-sans selection:bg-orange-500/30">

            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
            >
                <div className="flex items-center gap-3 mb-2">
                    <Trophy className="text-orange-500 w-8 h-8" />
                    <h1 className="text-4xl font-black bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent tracking-tighter">
                        BRAVEcom Progressive Commission
                    </h1>
                </div>
                <p className="text-gray-400 text-lg max-w-2xl">
                    Your royalty multiplier increases automatically as you hit sequential business milestones. Advance your rank. Escalate your wealth.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Col - Current Progress */}
                <motion.div
                    className="lg:col-span-2 space-y-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Progress Card */}
                    <motion.div variants={itemVariants} className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 backdrop-blur-xl">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Trophy className="w-48 h-48 text-white" />
                        </div>

                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                            <div>
                                <p className="text-orange-400 font-bold uppercase tracking-widest text-xs mb-1">Current Status</p>
                                <div className="flex items-end gap-4">
                                    <h2 className={`text-5xl font-black bg-gradient-to-r ${getRankColor(currentRank.badge)} bg-clip-text text-transparent drop-shadow-lg`}>
                                        {currentRank.rank}
                                    </h2>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-gray-400 text-sm">Total Business Volume</p>
                                <div className="text-4xl font-mono font-medium text-white tracking-tight">
                                    ₹{(currentBusiness / 10000000).toFixed(2)} <span className="text-xl text-gray-500">Cr</span>
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        {nextRank && (
                            <div className="relative z-10 mb-4">
                                <div className="flex justify-between text-sm mb-3">
                                    <span className="text-gray-400">Progress to <span className="font-bold text-white">{nextRank.rank}</span></span>
                                    <span className="text-orange-400 font-mono">{(progressPct).toFixed(1)}%</span>
                                </div>
                                <div className="h-3 w-full bg-black/50 rounded-full overflow-hidden border border-white/5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progressPct}%` }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className={`h-full bg-gradient-to-r ${getRankColor(nextRank.badge)} rounded-full shadow-[0_0_15px_rgba(255,165,0,0.5)]`}
                                    />
                                </div>
                                <div className="flex justify-between text-xs mt-3 text-gray-500 font-mono">
                                    <span>₹{(currentRank.target / 10000000).toFixed(2)} Cr</span>
                                    <span>Target: ₹{(nextRank.target / 10000000).toFixed(2)} Cr</span>
                                </div>
                            </div>
                        )}

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 relative z-10">
                            <div className="bg-black/40 border border-white/5 rounded-2xl p-4">
                                <p className="text-gray-500 text-xs uppercase mb-1">Royalty Add-on</p>
                                <p className="text-xl font-bold text-green-400">+{currentRank.royaltyAddon * 100}%</p>
                            </div>
                            <div className="bg-black/40 border border-white/5 rounded-2xl p-4">
                                <p className="text-gray-500 text-xs uppercase mb-1">Level 1 Com.</p>
                                <p className="text-xl font-bold text-white">{(currentRank.commissions.L1 * 100).toFixed(2)}%</p>
                            </div>
                            <div className="bg-black/40 border border-white/5 rounded-2xl p-4">
                                <p className="text-gray-500 text-xs uppercase mb-1">Level 2 Com.</p>
                                <p className="text-xl font-bold text-white">{(currentRank.commissions.L2 * 100).toFixed(2)}%</p>
                            </div>
                            <div className="bg-black/40 border border-white/5 rounded-2xl p-4">
                                <p className="text-gray-500 text-xs uppercase mb-1">Level 3 Com.</p>
                                <p className="text-xl font-bold text-gray-300">{(currentRank.commissions.L3 * 100).toFixed(2)}%</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Mr. A Simulation Narrative */}
                    <motion.div variants={itemVariants} className="rounded-3xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-transparent p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <TrendingUp className="text-orange-500" />
                            <h3 className="text-2xl font-bold text-white">The &quot;Mr. A&quot; Journey</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center shrink-0">1</div>
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-200">Base Entry</h4>
                                    <p className="text-gray-400 mt-1">Mr. A refers 5 clients bringing ₹45 Lakhs. Placed in <span className="text-white font-bold">BASE</span> rank. Earns a standard ~45% distributed commission map.</p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-full bg-orange-900 border border-orange-500 flex items-center justify-center shrink-0 text-orange-400">2</div>
                                <div>
                                    <h4 className="text-lg font-semibold text-orange-400">The Bronze Upgrade</h4>
                                    <p className="text-gray-400 mt-1">Mr. A hits 1 Crore target. Automatic promotion to <span className="text-orange-400 font-bold">BRONZE</span>. +1% flat royalty added to all 6 levels. L1 jumps from 20% to 21%.</p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-400 flex items-center justify-center shrink-0 text-slate-300">3</div>
                                <div>
                                    <h4 className="text-lg font-semibold text-slate-300">Silver Escalation</h4>
                                    <p className="text-gray-400 mt-1">Network expands to 5 Crores. Promoted to <span className="text-slate-300 font-bold">SILVER</span>. +1.75% royalty addon. L1 surges to 21.75%, exponential compounding kicks in.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </motion.div>

                {/* Right Col - Leaderboard / Tiers */}
                <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-[#111113] rounded-3xl border border-white/5 p-6 h-fit sticky top-6 overflow-hidden"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-bold text-xl text-white">Target Tiers</h3>
                        <Award className="text-gray-500" />
                    </div>

                    <div className="space-y-3 relative">
                        <div className="absolute left-4 top-4 bottom-4 w-px bg-white/10" />

                        {ranks.map((rank) => {
                            const isActive = currentRank.rank === rank.rank;
                            const isPassed = currentBusiness >= rank.target;

                            return (
                                <div
                                    key={rank.rank}
                                    onClick={() => setSelectedRank(rank.rank)}
                                    className={`relative flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${selectedRank === rank.rank ? 'bg-white/10 ring-1 ring-white/20' : 'hover:bg-white/5'} ${isPassed ? 'opacity-100' : 'opacity-40 grayscale'}`}
                                >
                                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center bg-[#111113] shrink-0 z-10 ${isActive ? 'border-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' : isPassed ? 'border-gray-500' : 'border-gray-700'}`}>
                                        {isPassed && !isActive && <div className="w-2 h-2 rounded-full bg-gray-500" />}
                                        {isActive && <div className="w-3 h-3 rounded-full bg-orange-500" />}
                                    </div>

                                    <div className="flex-1">
                                        <h4 className={`font-bold ${getRankColor(rank.badge).split(' ')[0].replace('from-', 'text-')}`}>
                                            {rank.rank}
                                        </h4>
                                        <p className="text-xs text-gray-500 font-mono">Target: {rank.target > 0 ? `₹${(rank.target / 10000000).toFixed(1)} Cr` : 'Entry'}</p>
                                    </div>

                                    <div className="text-right">
                                        <span className="bg-black/50 border border-white/10 px-2 py-1 flex items-center justify-center text-xs rounded text-green-400 font-mono font-bold">
                                            +{rank.royaltyAddon * 100}%
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </motion.div>
            </div>

            {/* Expanded Details Modal/Section for Selected Rank */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 border border-white/10 rounded-3xl bg-black/40 backdrop-blur-md p-8 overflow-x-auto"
            >
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <span className={`bg-gradient-to-r ${getRankColor(ranks.find(r => r.rank === selectedRank)?.badge || 'GRAY')} bg-clip-text text-transparent`}>
                        {selectedRank}
                    </span>
                    <span className="text-gray-500 text-sm font-normal">Commission Map View</span>
                </h3>

                <div className="min-w-[700px]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-gray-400 text-sm uppercase tracking-wider">
                                <th className="pb-4 font-medium pl-4">Tier Level</th>
                                <th className="pb-4 font-medium">Base %</th>
                                <th className="pb-4 font-medium">Royalty %</th>
                                <th className="pb-4 font-medium font-bold text-white">Final Payout %</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-mono">
                            {[1, 2, 3, 4, 5, 6].map((level) => {
                                const targetRank = ranks.find(r => r.rank === selectedRank);
                                const baseRank = ranks[0];
                                const basePct = baseRank.commissions[`L${level}` as keyof typeof baseRank.commissions];
                                const finalPct = targetRank?.commissions[`L${level}` as keyof typeof targetRank.commissions] || 0;

                                return (
                                    <tr key={level} className="hover:bg-white/5 transition-colors">
                                        <td className="py-4 pl-4 text-gray-300">Level {level}</td>
                                        <td className="py-4 text-gray-500">{(basePct * 100).toFixed(2)}%</td>
                                        <td className="py-4 text-green-500/80">+{((targetRank?.royaltyAddon || 0) * 100).toFixed(2)}%</td>
                                        <td className="py-4 text-orange-400 font-bold text-lg">{(finalPct * 100).toFixed(2)}%</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </motion.div>

        </div>
    );
}
