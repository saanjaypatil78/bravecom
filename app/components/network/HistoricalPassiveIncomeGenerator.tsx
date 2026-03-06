"use client";

import { useEffect, useState } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend
} from "recharts";
import { Coins, TrendingUp, Landmark, LineChart as LineChartIcon, Activity } from "lucide-react";

// Mock Data Generator: Jan 2023 to Present (Feb 2026)
const generateHistoricalData = () => {
    const data = [];
    const startDate = new Date(2023, 0, 1);
    const endDate = new Date(); // Current date

    let currentCapital = 50000; // Starting with ₹50,000 mapping
    let baseNetworkSize = 12; // Start with 12 referrals

    // We will simulate data month over month
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        const monthLabel = currentDate.toLocaleString('default', { month: 'short', year: '2-digit' });

        // Randomize growth factors mimicking compounding network effects
        const networkGrowth = Math.floor(Math.random() * 5) + 1; // 1 to 5 new people a month
        baseNetworkSize += networkGrowth;

        // Base 15% ROI Monthly Calculation roughly
        const monthlyRoiProfit = Math.floor((currentCapital * 0.15) * (1 + (Math.random() * 0.05)));

        // Referral Matrix Commission (6-levels deep simulated)
        // Assume an average of ₹1500 per active network asset downline
        const referralCommission = baseNetworkSize * 1500 + Math.floor(Math.random() * 5000);

        // Franchise Royalty (Assuming achieving royalty tier mid-2024)
        let franchiseRoyalty = 0;
        if (currentDate.getFullYear() > 2023 || currentDate.getMonth() > 5) {
            franchiseRoyalty = Math.floor(currentCapital * 0.02) + (baseNetworkSize * 250);
        }

        const totalPassiveIncome = monthlyRoiProfit + referralCommission + franchiseRoyalty;

        // Reinvest part of it occasionally to simulate compounding
        if (Math.random() > 0.4) {
            currentCapital += Math.floor(totalPassiveIncome * 0.3); // Reinvesting 30% of profit
        }

        data.push({
            month: monthLabel,
            roiProfit: monthlyRoiProfit,
            referralCommission: referralCommission,
            franchiseRoyalty: franchiseRoyalty,
            totalPassiveIncome: totalPassiveIncome,
            networkSize: baseNetworkSize,
            activeCapital: currentCapital
        });

        // Move to next month
        currentDate.setMonth(currentDate.getMonth() + 1);
    }
    return data;
};

export default function HistoricalPassiveIncomeGenerator() {
    const [data, setData] = useState<any[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setData(generateHistoricalData());
        setIsMounted(true);
    }, []);

    if (!isMounted) return <div className="h-64 animate-pulse bg-[#0B1526] rounded-xl"></div>;

    const totalIncomeGenerated = data.reduce((acc, curr) => acc + curr.totalPassiveIncome, 0);
    const latestMonth = data[data.length - 1];

    return (
        <div className="w-full space-y-6">
            {/* Top Summaries */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#0b1526] border border-amber-900/30 rounded-xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
                    <Coins className="w-6 h-6 text-amber-500 mb-4" />
                    <div className="text-sm text-gray-400 font-medium tracking-wider mb-1">Total Passive Income (3 Yrs)</div>
                    <div className="text-3xl font-bold text-white">₹{totalIncomeGenerated.toLocaleString()}</div>
                    <div className="mt-2 text-xs text-emerald-400 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Continuous auto-compounding
                    </div>
                </div>

                <div className="bg-[#0b1526] border border-emerald-900/30 rounded-xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
                    <Activity className="w-6 h-6 text-emerald-400 mb-4" />
                    <div className="text-sm text-gray-400 font-medium tracking-wider mb-1">Latest Monthly Matrix Yield</div>
                    <div className="text-3xl font-bold text-white">₹{latestMonth?.referralCommission.toLocaleString()}</div>
                    <div className="mt-2 text-xs text-emerald-400 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        From {latestMonth?.networkSize} Affiliate Assets
                    </div>
                </div>

                <div className="bg-[#0b1526] border border-blue-900/30 rounded-xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
                    <LineChartIcon className="w-6 h-6 text-blue-400 mb-4" />
                    <div className="text-sm text-gray-400 font-medium tracking-wider mb-1">Base Capital Escapement</div>
                    <div className="text-3xl font-bold text-white">₹{latestMonth?.activeCapital.toLocaleString()}</div>
                    <div className="mt-2 text-xs text-gray-400">Rebounding via systematic 30% retention</div>
                </div>

                <div className="bg-[#0b1526] border border-purple-900/30 rounded-xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
                    <Landmark className="w-6 h-6 text-purple-400 mb-4" />
                    <div className="text-sm text-gray-400 font-medium tracking-wider mb-1">Exclusive Franchise Royalty</div>
                    <div className="text-3xl font-bold text-white">₹{latestMonth?.franchiseRoyalty.toLocaleString()}</div>
                    <div className="mt-2 text-xs text-purple-400">Triggered Mid-2024 at Scale</div>
                </div>
            </div>

            {/* Historical Compound Charting */}
            <div className="bg-[#0b1526] border border-white/5 rounded-xl p-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1">Systematic Wealth Velocity</h3>
                        <p className="text-sm text-gray-400">Layered mapping of 15% Base ROI + 6-Level Referrals + Royalty (Jan 2023 - Present)</p>
                    </div>
                    <div className="px-4 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 text-xs font-semibold text-gray-300">
                        Historical Simulation Engine
                    </div>
                </div>

                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorReferral" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                            <XAxis
                                dataKey="month"
                                stroke="#52525b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                minTickGap={30}
                            />
                            <YAxis
                                stroke="#52525b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                itemStyle={{ fontWeight: 600 }}
                                formatter={(value: any) => [`₹${value.toLocaleString()}`, '']}
                            />
                            <Area
                                type="monotone"
                                dataKey="totalPassiveIncome"
                                name="Total Trajectory"
                                stroke="#f59e0b"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorTotal)"
                            />
                            <Area
                                type="monotone"
                                dataKey="referralCommission"
                                name="Matrix Yield"
                                stroke="#34d399"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorReferral)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Micro-Distribution Details */}
            <div className="bg-[#0b1526] border border-white/5 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-6">Income Vector Distribution</h3>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.slice(-12)} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                            <XAxis dataKey="month" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                            <Tooltip
                                cursor={{ fill: '#ffffff0a' }}
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                            />
                            <Legend wrapperStyle={{ fontSize: '12px' }} />
                            <Bar dataKey="roiProfit" name="Base ROI (15%)" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} />
                            <Bar dataKey="referralCommission" name="Referral Matrix" stackId="a" fill="#10b981" />
                            <Bar dataKey="franchiseRoyalty" name="Royalties" stackId="a" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
