'use client';

import { useEffect, useState } from 'react';

// Assuming local basic UI components to match previous project patterns
const Card = ({ children, className = "" }: any) => <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>{children}</div>;
const CardHeader = ({ children }: any) => <div className="mb-4">{children}</div>;
const CardTitle = ({ children }: any) => <h3 className="text-xl font-bold">{children}</h3>;
const CardContent = ({ children }: any) => <div>{children}</div>;
const Badge = ({ children, className = "" }: any) => <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${className}`}>{children}</span>;
const Progress = ({ value, className = "" }: any) => (
    <div className={`w-full bg-gray-200 rounded-full h-3 ${className}`}>
        <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${value}%` }}></div>
    </div>
);
const Button = ({ children, onClick, variant = "default", className = "" }: any) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-lg font-bold transition-colors ${variant === 'outline' ? 'border-2 border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-blue-600 text-white hover:bg-blue-700'} ${className}`}
    >
        {children}
    </button>
);

interface FranchiseStatus {
    currentRank: string;
    currentVolume: number;
    targetVolume: number;
    progressPercentage: number;
    royaltyQualified: boolean;
    nextRank: string;
    volumeNeededForNext: number;
}

interface RoyaltyEarnings {
    totalEarning: number;
    royaltyAmount: number;
    referralBonusAmount: number;
    periodMonth: string;
}

interface SavingsTracker {
    totalCorpus: number;
    monthlySavings: number;
    cumulativeSavings: number;
    milestone: string;
}

export default function FranchiseRoyaltyDashboard({ userId }: { userId: string }) {
    const [franchiseStatus, setFranchiseStatus] = useState<FranchiseStatus | null>(null);
    const [royaltyEarnings, setRoyaltyEarnings] = useState<RoyaltyEarnings | null>(null);
    const [savingsTracker, setSavingsTracker] = useState<SavingsTracker | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statusRes, earningsRes, savingsRes] = await Promise.all([
                    fetch(`/api/franchise/status?userId=${userId}`),
                    fetch(`/api/franchise/royalty?userId=${userId}`),
                    fetch('/api/franchise/savings'),
                ]);

                const status = statusRes.ok ? await statusRes.json() : { data: null };
                const earnings = earningsRes.ok ? await earningsRes.json() : { data: null };
                const savings = savingsRes.ok ? await savingsRes.json() : { data: null };

                setFranchiseStatus(status.data);
                setRoyaltyEarnings(earnings.data);
                setSavingsTracker(savings.data);
            } catch (e) {
                console.error("Failed to load franchise dashboards", e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 60000); // Refresh every minute
        return () => clearInterval(interval);
    }, [userId]);

    if (loading) return <LoadingState />;

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Franchise Progress */}
            <Card className="border-2 border-blue-200">
                <CardHeader>
                    <CardTitle>🏆 Franchise Progress</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-semibold">{franchiseStatus?.currentRank || 'BRONZE'}</span>
                            {franchiseStatus?.royaltyQualified && (
                                <Badge variant="default" className="bg-green-500">
                                    ✅ Royalty Qualified
                                </Badge>
                            )}
                        </div>

                        <Progress value={franchiseStatus?.progressPercentage || 0} className="h-3 bg-slate-200" />

                        <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                            <div>
                                <p className="text-gray-500">Current Volume</p>
                                <p className="font-semibold font-mono text-lg">₹{(franchiseStatus?.currentVolume || 0).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Target Volume</p>
                                <p className="font-semibold font-mono text-lg text-blue-800">₹{(franchiseStatus?.targetVolume || 10000000).toLocaleString()}</p>
                            </div>
                        </div>

                        {franchiseStatus?.nextRank && (
                            <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-bold text-blue-800 uppercase tracking-widest">
                                        🎯 Next Rank: {franchiseStatus.nextRank}
                                    </p>
                                    <p className="text-sm text-blue-600 mt-1">
                                        Volume Needed: ₹{franchiseStatus.volumeNeededForNext.toLocaleString()}
                                    </p>
                                </div>
                                <div className="hidden sm:block">
                                    <span className="material-symbols-outlined text-4xl text-blue-200">rocket_launch</span>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Royalty Earnings */}
            <Card className="border-2 border-emerald-200">
                <CardHeader>
                    <CardTitle>💰 Monthly Royalty Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="p-5 bg-emerald-50 rounded-xl border border-emerald-100 shadow-sm">
                            <p className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-1">Royalty Amount</p>
                            <p className="text-3xl font-black text-emerald-600 font-mono tracking-tighter">
                                ₹{(royaltyEarnings?.royaltyAmount || 0).toLocaleString()}
                            </p>
                        </div>
                        <div className="p-5 bg-sky-50 rounded-xl border border-sky-100 shadow-sm">
                            <p className="text-sm font-bold text-sky-800 uppercase tracking-wider mb-1">Referral Bonus</p>
                            <p className="text-3xl font-black text-sky-600 font-mono tracking-tighter">
                                ₹{(royaltyEarnings?.referralBonusAmount || 0).toLocaleString()}
                            </p>
                        </div>
                        <div className="p-5 bg-indigo-50 rounded-xl border border-indigo-100 shadow-sm">
                            <p className="text-sm font-bold text-indigo-800 uppercase tracking-wider mb-1">Total Earning</p>
                            <p className="text-3xl font-black text-indigo-600 font-mono tracking-tighter">
                                ₹{(royaltyEarnings?.totalEarning || 0).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                        <span className="material-symbols-outlined text-amber-500">lightbulb</span>
                        <p className="text-sm text-amber-800 leading-relaxed">
                            <strong>Hidden Gem Concept Active:</strong> Calculated directly on net investor profits (not principal). This optimization secures a 1% structural reserve savings on the overall platform corpus while fully funding franchise benefits.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Company Savings Tracker */}
            <Card className="border-2 border-orange-200">
                <CardHeader>
                    <CardTitle>🎯 Corporate Analytics: Systemic Savings Yield</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="p-6 bg-gradient-to-br from-orange-50 to-rose-50 rounded-xl border border-orange-100">
                            <p className="text-sm font-bold text-orange-800 uppercase tracking-widest mb-2">Monthly Structural Savings (1% of Corpus)</p>
                            <p className="text-4xl md:text-5xl font-black text-orange-600 font-mono tracking-tighter">
                                ₹{(savingsTracker?.monthlySavings || 0).toLocaleString()}
                            </p>
                            <p className="text-sm font-medium text-orange-700 mt-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px]">trending_up</span> {savingsTracker?.milestone || 'Initializing Phase...'}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="p-4 bg-slate-50 rounded-lg">
                                <p className="text-sm font-bold text-slate-500 uppercase">Global Corpus TVL</p>
                                <p className="font-bold text-xl mt-1 font-mono">₹{(savingsTracker?.totalCorpus || 0).toLocaleString()}</p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                                <p className="text-sm font-bold text-green-700 uppercase">Perpetual Cumulative Savings</p>
                                <p className="font-bold text-xl text-green-600 mt-1 font-mono">
                                    ₹{(savingsTracker?.cumulativeSavings || 0).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm text-center">
                            <p className="text-sm font-medium text-slate-600">
                                📊 <strong>Economic Scale Blueprint:</strong> ₹100 Cr corpus = <strong>₹1 Cr/mo</strong> savings |
                                ₹500 Cr = <strong>₹5 Cr/mo</strong> | ₹1000 Cr = <strong>₹10 Cr/mo</strong>
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Action Triggers */}
            <div className="flex flex-wrap gap-4 pt-4">
                <Button onClick={() => window.location.href = `/api/franchise/claim?userId=${userId}`}>
                    💰 Initialize Royalty Claim
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/api/franchise/history'}>
                    📋 Download Audit History
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/api/franchise/upgrade'}>
                    🚀 View Upgrade Paths
                </Button>
            </div>
        </div>
    );
}

function LoadingState() {
    return (
        <div className="flex flex-col items-center justify-center p-24 bg-white rounded-2xl shadow-sm border border-slate-100 max-w-7xl mx-auto">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4" />
            <p className="text-slate-500 font-medium animate-pulse">Synchronizing Franchise Royalty Tiers...</p>
        </div>
    );
}
