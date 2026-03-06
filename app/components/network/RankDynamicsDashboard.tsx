"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    RefreshCw,
    ChevronRight,
    Clock,
    Award,
    Target,
    Users,
    DollarSign,
    Activity
} from 'lucide-react';

interface RankStatus {
    currentRank: string;
    performanceScore: number;
    totalBusiness: number;
    activeDownline: number;
    nextRank: string | null;
    previousRank: string | null;
    upgradeProgress: number;
    downgradeRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    gracePeriodActive: boolean;
    gracePeriodEnds: string | null;
}

interface RankHistoryItem {
    changeType: 'UPGRADE' | 'DOWNGRADE';
    previousRank: string;
    newRank: string;
    changedAt: string;
    reason: string;
    reversible: boolean;
    reversalDeadline: string | null;
}

const RANK_COLORS: Record<string, string> = {
    BASE: 'from-gray-400 to-gray-600 border-gray-500',
    BRONZE: 'from-[#CD7F32] to-[#A0522D] border-[#CD7F32]',
    SILVER: 'from-slate-300 to-slate-500 border-slate-400',
    GOLD: 'from-yellow-400 to-yellow-600 border-yellow-500',
    PLATINUM: 'from-teal-300 to-teal-500 border-teal-400',
    DIAMOND: 'from-cyan-300 to-blue-500 border-cyan-400',
    AMBASSADOR: 'from-purple-500 to-indigo-700 border-purple-500',
};

const RISK_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    LOW: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    MEDIUM: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
    HIGH: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    CRITICAL: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

export default function RankDynamicsDashboard({ userId }: { userId: string }) {
    const [rankStatus, setRankStatus] = useState<RankStatus | null>(null);
    const [rankHistory, setRankHistory] = useState<RankHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [evaluating, setEvaluating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, [userId]);

    const fetchData = async () => {
        try {
            setError(null);
            const [statusRes, historyRes] = await Promise.all([
                fetch(`/api/rank/status?userId=${userId}`),
                fetch(`/api/rank/history?userId=${userId}`),
            ]);

            if (!statusRes.ok || !historyRes.ok) {
                throw new Error('Failed to fetch rank data');
            }

            const statusText = await statusRes.text();
            const historyText = await historyRes.text();
            
            if (!statusText || !historyText) {
                throw new Error('Empty response from server');
            }

            const statusData = JSON.parse(statusText);
            const historyData = JSON.parse(historyText);

            if (statusData.success) {
                setRankStatus(statusData.data);
            }
            if (historyData.success) {
                setRankHistory(historyData.data);
            }
        } catch (err) {
            setError('Failed to fetch rank data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEvaluate = async () => {
        setEvaluating(true);
        try {
            const response = await fetch('/api/rank/evaluate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });
            if (!response.ok) throw new Error('Evaluation failed');
            const text = await response.text();
            if (!text) return;
            const data = JSON.parse(text);
            if (data.success) {
                await fetchData();
            }
        } catch (err) {
            setError('Evaluation failed');
        } finally {
            setEvaluating(false);
        }
    };

    const handleRequestReversal = async () => {
        try {
            const response = await fetch('/api/rank/reversal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });
            if (!response.ok) throw new Error('Reversal request failed');
            const text = await response.text();
            if (!text) return;
            const data = JSON.parse(text);
            if (data.success) {
                await fetchData();
                alert(data.data.message);
            } else {
                alert(data.data.message);
            }
        } catch (err) {
            alert('Reversal request failed');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A0A0B] text-white p-6 md:p-12 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <RefreshCw className="w-12 h-12 text-orange-500 animate-spin" />
                    <p className="text-gray-400">Loading rank dynamics...</p>
                </div>
            </div>
        );
    }

    const riskStyle = rankStatus ? RISK_COLORS[rankStatus.downgradeRisk] : RISK_COLORS.LOW;

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white p-6 md:p-12 font-sans">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Activity className="text-orange-500 w-8 h-8" />
                            <h1 className="text-4xl font-black bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
                                Autonomous Rank Dynamics
                            </h1>
                        </div>
                        <p className="text-gray-400 text-lg">
                            Bi-directional rank system with auto-upgrade and auto-downgrade
                        </p>
                    </div>
                    <button
                        onClick={handleEvaluate}
                        disabled={evaluating}
                        className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-500 rounded-xl font-bold transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-5 h-5 ${evaluating ? 'animate-spin' : ''}`} />
                        {evaluating ? 'Evaluating...' : 'Evaluate Now'}
                    </button>
                </div>
            </motion.div>

            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Status Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 space-y-6"
                >
                    {/* Current Rank Status */}
                    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 backdrop-blur-xl">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Award className="w-48 h-48 text-white" />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <p className="text-orange-400 font-bold uppercase tracking-widest text-xs mb-1">Current Rank</p>
                                    <h2 className={`text-6xl font-black bg-gradient-to-r ${RANK_COLORS[rankStatus?.currentRank || 'BASE']} bg-clip-text text-transparent drop-shadow-lg`}>
                                        {rankStatus?.currentRank || 'BASE'}
                                    </h2>
                                </div>
                                <div className={`px-4 py-2 rounded-xl border ${riskStyle.bg} ${riskStyle.border}`}>
                                    <p className={`text-sm font-bold ${riskStyle.text}`}>
                                        Risk: {rankStatus?.downgradeRisk || 'LOW'}
                                    </p>
                                </div>
                            </div>

                            {/* Performance Score */}
                            <div className="mb-6">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-400">Performance Score</span>
                                    <span className="font-mono font-bold">{rankStatus?.performanceScore || 0}/100</span>
                                </div>
                                <div className="h-3 w-full bg-black/50 rounded-full overflow-hidden border border-white/5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${rankStatus?.performanceScore || 0}%` }}
                                        transition={{ duration: 1 }}
                                        className={`h-full rounded-full ${(rankStatus?.performanceScore || 0) >= 70 ? 'bg-green-500' :
                                                (rankStatus?.performanceScore || 0) >= 50 ? 'bg-yellow-500' :
                                                    (rankStatus?.performanceScore || 0) >= 30 ? 'bg-orange-500' : 'bg-red-500'
                                            }`}
                                    />
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-black/40 border border-white/5 rounded-2xl p-4">
                                    <p className="text-gray-500 text-xs uppercase mb-1">Total Business</p>
                                    <p className="text-lg font-bold">₹{((rankStatus?.totalBusiness || 0) / 10000000).toFixed(2)}Cr</p>
                                </div>
                                <div className="bg-black/40 border border-white/5 rounded-2xl p-4">
                                    <p className="text-gray-500 text-xs uppercase mb-1">Active Affiliates</p>
                                    <p className="text-lg font-bold">{rankStatus?.activeDownline || 0}</p>
                                </div>
                                <div className="bg-black/40 border border-white/5 rounded-2xl p-4">
                                    <p className="text-gray-500 text-xs uppercase mb-1">Next Rank</p>
                                    <p className="text-lg font-bold text-green-400">{rankStatus?.nextRank || 'MAX'}</p>
                                </div>
                                <div className="bg-black/40 border border-white/5 rounded-2xl p-4">
                                    <p className="text-gray-500 text-xs uppercase mb-1">Upgrade Progress</p>
                                    <p className="text-lg font-bold">{rankStatus?.upgradeProgress?.toFixed(1) || 0}%</p>
                                </div>
                            </div>

                            {/* Grace Period Warning */}
                            {rankStatus?.gracePeriodActive && (
                                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <AlertTriangle className="text-red-500 w-6 h-6" />
                                        <div>
                                            <p className="font-bold text-red-700">Grace Period Active</p>
                                            <p className="text-sm text-red-600">
                                                Improve performance before {rankStatus.gracePeriodEnds ? new Date(rankStatus.gracePeriodEnds).toLocaleDateString() : 'deadline'} to avoid downgrade
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Upgrade/Downgrade Progress */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Upgrade Progress */}
                        <div className="rounded-3xl border-2 border-green-500/20 bg-gradient-to-br from-green-500/10 to-transparent p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <TrendingUp className="text-green-500 w-6 h-6" />
                                <h3 className="text-xl font-bold">Upgrade Progress</h3>
                            </div>

                            <div className="mb-4">
                                <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${rankStatus?.upgradeProgress || 0}%` }}
                                        className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Target</span>
                                    <span className="font-mono">{rankStatus?.nextRank || 'MAX'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Progress</span>
                                    <span className="font-mono text-green-400">{rankStatus?.upgradeProgress?.toFixed(1) || 0}%</span>
                                </div>
                            </div>
                        </div>

                        {/* Downgrade Risk */}
                        <div className={`rounded-3xl border-2 ${rankStatus?.downgradeRisk === 'LOW' ? 'border-green-500/20 bg-green-500/5' : 'border-red-500/20 bg-red-500/5'} p-6`}>
                            <div className="flex items-center gap-3 mb-4">
                                {rankStatus?.downgradeRisk === 'LOW' ? (
                                    <TrendingDown className="text-gray-500 w-6 h-6" />
                                ) : (
                                    <AlertTriangle className="text-red-500 w-6 h-6" />
                                )}
                                <h3 className="text-xl font-bold">Downgrade Risk</h3>
                            </div>

                            <div className={`p-3 rounded-lg ${riskStyle.bg} border ${riskStyle.border} mb-4`}>
                                <p className={`font-bold ${riskStyle.text}`}>
                                    {rankStatus?.downgradeRisk === 'LOW' && '✅ Rank Secure'}
                                    {rankStatus?.downgradeRisk === 'MEDIUM' && '⚠️ Monitor Closely'}
                                    {rankStatus?.downgradeRisk === 'HIGH' && '🚨 Action Required'}
                                    {rankStatus?.downgradeRisk === 'CRITICAL' && '🔴 Downgrade Imminent'}
                                </p>
                            </div>

                            {rankStatus?.previousRank && (
                                <div className="text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Previous Rank</span>
                                        <span className="font-mono">{rankStatus.previousRank}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Rank Change History */}
                    <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold">Rank Change History</h3>
                            <ChevronRight className="text-gray-500" />
                        </div>

                        <div className="space-y-3">
                            {rankHistory.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No rank changes yet</p>
                            ) : (
                                rankHistory.slice(0, 5).map((change, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-4 bg-white/5 rounded-xl"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${change.changeType === 'UPGRADE' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                                }`}>
                                                {change.changeType === 'UPGRADE' ? (
                                                    <TrendingUp className="w-5 h-5" />
                                                ) : (
                                                    <TrendingDown className="w-5 h-5" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold">
                                                    {change.previousRank} → {change.newRank}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(change.changedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        {change.reversible && change.reversalDeadline && new Date(change.reversalDeadline) > new Date() && (
                                            <div className="text-right">
                                                <p className="text-xs text-orange-400">Reversible</p>
                                                <p className="text-xs text-gray-500">
                                                    Until {new Date(change.reversalDeadline).toLocaleDateString()}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Sidebar */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                >
                    {/* Quick Actions */}
                    <div className="bg-[#111113] rounded-3xl border border-white/5 p-6">
                        <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button
                                onClick={handleEvaluate}
                                disabled={evaluating}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 hover:bg-orange-500 rounded-xl font-bold transition-colors disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 ${evaluating ? 'animate-spin' : ''}`} />
                                Evaluate Rank
                            </button>
                            <button
                                onClick={handleRequestReversal}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-white/10 hover:bg-white/5 rounded-xl font-bold transition-colors"
                            >
                                <Clock className="w-4 h-4" />
                                Request Reversal
                            </button>
                        </div>
                    </div>

                    {/* Performance Breakdown */}
                    <div className="bg-[#111113] rounded-3xl border border-white/5 p-6">
                        <h3 className="font-bold text-lg mb-4">Score Breakdown</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-400">Activity</span>
                                    <span className="font-mono">40%</span>
                                </div>
                                <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded-full"
                                        style={{ width: `${(rankStatus?.performanceScore || 0) * 0.4}%` }}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-400">Retention</span>
                                    <span className="font-mono">30%</span>
                                </div>
                                <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-purple-500 rounded-full"
                                        style={{ width: `${(rankStatus?.performanceScore || 0) * 0.3}%` }}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-400">Growth</span>
                                    <span className="font-mono">30%</span>
                                </div>
                                <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-500 rounded-full"
                                        style={{ width: `${(rankStatus?.performanceScore || 0) * 0.3}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Rank Tiers */}
                    <div className="bg-[#111113] rounded-3xl border border-white/5 p-6">
                        <h3 className="font-bold text-lg mb-4">Rank Tiers</h3>
                        <div className="space-y-2">
                            {['BASE', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'AMBASSADOR'].map((rank) => {
                                const isActive = rankStatus?.currentRank === rank;
                                const isPast = rankStatus &&
                                    ['BASE', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'AMBASSADOR'].indexOf(rank) <
                                    ['BASE', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'AMBASSADOR'].indexOf(rankStatus.currentRank);

                                return (
                                    <div
                                        key={rank}
                                        className={`flex items-center justify-between p-3 rounded-xl ${isActive ? 'bg-orange-500/20 border border-orange-500/30' :
                                                isPast ? 'bg-green-500/10 border border-green-500/20' :
                                                    'bg-black/20'
                                            }`}
                                    >
                                        <span className={`font-bold ${isActive ? 'text-orange-400' :
                                                isPast ? 'text-green-400' :
                                                    'text-gray-500'
                                            }`}>
                                            {rank}
                                        </span>
                                        {isActive && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                                        {isPast && <div className="w-2 h-2 rounded-full bg-green-500" />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Commission Preview */}
                    <div className="bg-[#111113] rounded-3xl border border-white/5 p-6">
                        <h3 className="font-bold text-lg mb-4">Commission Preview</h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="bg-black/40 rounded-lg p-3">
                                <p className="text-gray-500 text-xs">Level 1</p>
                                <p className="font-bold">{(21 + (rankStatus?.performanceScore || 0) * 0.01).toFixed(2)}%</p>
                            </div>
                            <div className="bg-black/40 rounded-lg p-3">
                                <p className="text-gray-500 text-xs">Level 2</p>
                                <p className="font-bold">{(11 + (rankStatus?.performanceScore || 0) * 0.01).toFixed(2)}%</p>
                            </div>
                            <div className="bg-black/40 rounded-lg p-3">
                                <p className="text-gray-500 text-xs">Level 3</p>
                                <p className="font-bold">{(8 + (rankStatus?.performanceScore || 0) * 0.01).toFixed(2)}%</p>
                            </div>
                            <div className="bg-black/40 rounded-lg p-3">
                                <p className="text-gray-500 text-xs">Level 4</p>
                                <p className="font-bold">{(6 + (rankStatus?.performanceScore || 0) * 0.01).toFixed(2)}%</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
