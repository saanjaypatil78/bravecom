"use client";

import { CheckCircle2, TrendingUp, Briefcase, Zap, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ESOPLandingPage() {
    return (
        <div className="min-h-screen bg-[#050B14] font-['Outfit'] text-white">
            {/* Abstract Backgrounds */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[#050B14]"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 mix-blend-overlay"></div>
                <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-[#1173d4]/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] bg-fuchsia-600/20 rounded-full blur-[120px]"></div>
            </div>

            <nav className="relative z-10 w-full p-6 flex justify-between items-center border-b border-white/5 bg-black/50 backdrop-blur-md">
                <Link href="/" className="font-black tracking-widest text-xl bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">BRAVECOM</Link>
                <Link href="/dashboard" className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-sm font-bold transition-all">Go to Dashboard</Link>
            </nav>

            <main className="relative z-10 max-w-6xl mx-auto px-6 py-20 pb-32">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1173d4]/10 border border-[#1173d4]/30 text-[#1173d4] text-sm font-bold tracking-widest uppercase">
                        <Zap size={16} /> Pre-IPO Stage
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">
                        Unlocking <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-400">Grey Market</span> Prosperity.
                    </h1>
                    <p className="text-xl text-slate-400 font-light leading-relaxed">
                        Choose between standard active investment caps or fast-track into the exclusive BRAVECOM ESOP pool prior to NSE Mainboard Listing.
                    </p>
                </div>

                {/* Investment Options Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">

                    {/* Option 1: Standard Investment */}
                    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700 rounded-3xl p-10 hover:border-blue-500/50 transition-colors group relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <h3 className="text-2xl font-black mb-2 flex items-center gap-3">
                            <TrendingUp className="text-blue-400" /> Standard Investor Module
                        </h3>
                        <p className="text-slate-400 mb-8 h-12">Earn 15% Monthly Static ROI with standard Sunrays Network commission privileges.</p>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                                <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Minimum Entry</span>
                                <span className="font-mono text-white">₹1,00,000</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                                <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Maximum Cap (Per PAN)</span>
                                <span className="font-mono text-white text-lg font-black">₹50,00,000</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                                <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Equity Allocation</span>
                                <span className="font-mono text-slate-400 font-bold">N/A</span>
                            </div>
                        </div>

                        <Link href="/dashboard/register" className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors">
                            Begin Registration <ArrowRight size={16} />
                        </Link>
                    </div>

                    {/* Option 2: Pre-IPO ESOP */}
                    <div className="bg-gradient-to-b from-[#1173d4]/10 to-transparent backdrop-blur-xl border-2 border-[#1173d4]/50 rounded-3xl p-10 relative overflow-hidden shadow-[0_0_40px_rgba(17,115,212,0.15)] transform scale-[1.02]">
                        <div className="absolute top-0 right-0 bg-[#1173d4] text-white text-[10px] uppercase font-black tracking-widest px-4 py-1 rounded-bl-xl">High Return Vector</div>
                        <h3 className="text-2xl font-black mb-2 flex items-center gap-3">
                            <Briefcase className="text-white" /> Pre-IPO ESOP Module
                        </h3>
                        <p className="text-blue-100/80 mb-8 h-12">Convert active capital into corporate equity blocks directly aligned with NSE Pre-Seed trajectory.</p>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center border-b border-[#1173d4]/20 pb-2">
                                <span className="text-blue-400 font-bold uppercase tracking-widest text-xs">Initial Limit</span>
                                <span className="font-mono text-white">₹1,00,000</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-[#1173d4]/20 pb-2">
                                <span className="text-blue-400 font-bold uppercase tracking-widest text-xs">Expanded ESOP Maximum Cap</span>
                                <span className="font-mono text-green-400 text-lg font-black">₹1,00,00,000</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-[#1173d4]/20 pb-2">
                                <span className="text-blue-400 font-bold uppercase tracking-widest text-xs">Base Equity (Per 1 Lakh)</span>
                                <span className="font-mono text-white font-black bg-[#1173d4]/20 px-2 py-0.5 rounded">0.01%</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-blue-400 font-bold uppercase tracking-widest text-xs">Est. Grey Mkt Multiple</span>
                                <span className="font-mono text-white font-black">10x - 50x ROI</span>
                            </div>
                        </div>

                        <Link href="/esop/register" className="w-full py-4 bg-gradient-to-r from-[#1173d4] to-cyan-400 hover:opacity-90 text-white font-black rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/25">
                            Secure Equity Allocation <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>

                {/* Dropshipping Vendor Deep Dive */}
                <div className="bg-gradient-to-r from-fuchsia-900/20 to-purple-900/20 border border-fuchsia-500/30 rounded-3xl p-10 backdrop-blur-md">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-full bg-fuchsia-500/20 flex items-center justify-center">
                            <AlertCircle className="text-fuchsia-400" size={24} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black">Vendor Dropship Protocol</h2>
                            <p className="text-fuchsia-300">Guaranteed systemic sustainability for the next 5 years.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <h4 className="font-bold uppercase tracking-widest text-slate-400 text-xs mb-4">Operations & Economics</h4>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-slate-300">
                                    <CheckCircle2 className="text-fuchsia-400 shrink-0" size={20} />
                                    <span><b>Upfront Setup Cost:</b> ₹1,00,000 standard entry point for white-labeled automated portals.</span>
                                </li>
                                <li className="flex gap-3 text-slate-300">
                                    <CheckCircle2 className="text-fuchsia-400 shrink-0" size={20} />
                                    <span><b>Annual Minimum Yield:</b> System architecture guarantees base net revenue of ₹5,00,000 annually per vendor.</span>
                                </li>
                                <li className="flex gap-3 text-slate-300">
                                    <CheckCircle2 className="text-fuchsia-400 shrink-0" size={20} />
                                    <span><b>Google Trends Synergies:</b> High-velocity products dynamically updated (e.g. Ergonomic lumbar setups, AI smart tech, Eco-beauty).</span>
                                </li>
                            </ul>
                        </div>
                        <div className="bg-black/40 rounded-xl p-6 border border-white/5">
                            <h4 className="font-bold text-white mb-2">How it limits liability</h4>
                            <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                By charging the vendor onboarding upfront and utilizing the BRAVECOM internal network as the initial core-customer base, liquidity flows back into the primary 15% Static ROI reserve pool, creating a self-sustaining positive feedback loop.
                            </p>
                            <Link href="#" className="text-xs font-bold uppercase tracking-widest text-fuchsia-400 hover:text-fuchsia-300 flex items-center gap-2">
                                Download Vendor SLA <ArrowRight size={12} />
                            </Link>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
