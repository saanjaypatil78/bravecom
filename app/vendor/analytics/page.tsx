import Link from "next/link";
import { ArrowLeft, Activity, Users, ShoppingBag } from "lucide-react";
import AutoResearchWorkflow from "@/app/components/vendor/AutoResearchWorkflow";

export default function VendorAnalyticsPage() {
    return (
        <div className="min-h-screen bg-[#050B14] font-['Outfit'] text-white overflow-x-hidden relative">
            {/* Backgrounds */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[#050B14]"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 mix-blend-overlay"></div>
                <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-emerald-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute top-[40%] left-[-20%] w-[40vw] h-[40vw] bg-fuchsia-600/10 rounded-full blur-[150px]"></div>
            </div>

            <nav className="relative z-10 w-full p-6 flex justify-between items-center bg-black/50 border-b border-white/5 backdrop-blur-md sticky top-0">
                <Link href="/vendor" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold text-sm">
                    <ArrowLeft size={16} /> Back to Vendor Hub
                </Link>
                <div className="flex gap-4">
                    <div className="px-4 py-1.5 bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-full text-xs font-bold text-fuchsia-400 flex items-center gap-2 tracking-widest uppercase">
                        <Activity size={14} /> Telemetry Online
                    </div>
                </div>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 pb-32">
                <div className="mb-12 space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1]">
                        Live <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Telemetry</span> & Corpus Growth.
                    </h1>
                    <p className="text-lg text-slate-400 font-light max-w-3xl">
                        Monitor live dropshipping conversion rates, auto-inject high-velocity trending products, and oversee your vendor performance metrics natively.
                    </p>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-[#0b1526] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl -mr-10 -mt-10" />
                        <ShoppingBag className="w-8 h-8 text-blue-400 mb-4" />
                        <div className="text-sm text-slate-400 font-medium mb-1">Total Active Listings</div>
                        <div className="text-4xl font-black">124</div>
                        <div className="text-xs text-blue-400 mt-2 font-bold">+12% vs last month</div>
                    </div>
                    <div className="bg-[#0b1526] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl -mr-10 -mt-10" />
                        <Activity className="w-8 h-8 text-emerald-400 mb-4" />
                        <div className="text-sm text-slate-400 font-medium mb-1">Average Conversion Rate</div>
                        <div className="text-4xl font-black">4.2%</div>
                        <div className="text-xs text-emerald-400 mt-2 font-bold">+0.8% vs last month</div>
                    </div>
                    <div className="bg-[#0b1526] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl -mr-10 -mt-10" />
                        <Users className="w-8 h-8 text-purple-400 mb-4" />
                        <div className="text-sm text-slate-400 font-medium mb-1">Network Referral Buyers</div>
                        <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">14,205</div>
                        <div className="text-xs text-purple-400 mt-2 font-bold">15% ROI distribution active</div>
                    </div>
                </div>

                {/* Autonomous Research Engine */}
                <div className="mb-12">
                    <AutoResearchWorkflow />
                </div>
            </main>
        </div>
    );
}
