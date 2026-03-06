"use client";

import { ArrowRight, Activity, Users, Globe2 } from "lucide-react";
import Link from "next/link";
import HistoricalPassiveIncomeGenerator from "../components/network/HistoricalPassiveIncomeGenerator";
import ReferralNetworkMonitor from "../components/network/ReferralNetworkMonitor";
import PassiveIncomeMatrix from "../components/network/PassiveIncomeMatrix";
import { ProgressiveRankDashboard } from "../components/network/ProgressiveRankDashboard";

export default function NetworkStructurePage() {
    return (
        <div className="min-h-screen bg-[#050B14] font-['Outfit'] text-white">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 mix-blend-overlay"></div>
                <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] bg-amber-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[10%] left-[-10%] w-[40vw] h-[40vw] bg-blue-600/10 rounded-full blur-[100px]"></div>
            </div>

            <nav className="relative z-10 w-full p-6 flex justify-between items-center bg-black/50 border-b border-white/5 backdrop-blur-md sticky top-0">
                <Link href="/" className="font-black tracking-widest text-xl bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">BRAVECOM</Link>
                <div className="flex gap-4">
                    <Link href="/esop" className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-full text-sm font-bold transition-all border border-white/10 flex items-center">
                        <Activity className="w-4 h-4 mr-2 text-emerald-400" />
                        Franchise Engine
                    </Link>
                    <Link href="/mall" className="hidden md:flex px-6 py-2 bg-gradient-to-r from-amber-600/20 to-orange-600/20 hover:from-amber-600/30 hover:to-orange-600/30 border border-amber-500/30 rounded-full text-sm font-bold transition-all items-center gap-2">
                        <Globe2 className="w-4 h-4 text-amber-500" /> Sovereign Mall <ArrowRight size={14} />
                    </Link>
                </div>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 pb-32">
                <div className="mb-12 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-sm font-bold tracking-widest uppercase">
                        <Users size={16} /> Sun Ray Intelligence
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1]">
                        6-Level <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Wealth Engine</span>.
                    </h1>
                    <p className="text-lg text-slate-400 font-light max-w-3xl">
                        A transparent view of your total structural distribution telemetry, tracking passive yields across 15% ROI, 6-level referral lifts, and Franchise Royalty escarpments natively since 2023.
                    </p>
                </div>

                <div className="space-y-12">
                    {/* Component 1: Matrix Totals */}
                    <section>
                        <PassiveIncomeMatrix />
                    </section>

                    {/* Component 2: The Timeline Chart */}
                    <section>
                        <HistoricalPassiveIncomeGenerator />
                    </section>

                    {/* Component 3: The 6-Level Hierarchy Live Render */}
                    <section>
                        <ReferralNetworkMonitor />
                    </section>

                    {/* Component 4: Progressive Commission Journey (Mr. A) */}
                    <section>
                        <ProgressiveRankDashboard />
                    </section>
                </div>
            </main>
        </div>
    );
}
