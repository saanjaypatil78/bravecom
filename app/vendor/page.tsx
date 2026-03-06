"use client";

import { CheckCircle2, Factory, Link2, ShieldAlert, ArrowRight, Zap, RefreshCw, Smartphone } from "lucide-react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";
import PaymentModal from "../components/PaymentModal";

export default function VendorPortal() {
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.2]);

    return (
        <div className="min-h-screen bg-[#050B14] font-['Outfit'] text-white overflow-x-hidden relative">

            {/* Abstract Backgrounds */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[#050B14]"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 mix-blend-overlay"></div>
                <motion.div style={{ y, opacity }} className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-fuchsia-600/10 rounded-full blur-[120px]"></motion.div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-blue-600/10 rounded-full blur-[120px]"></div>
            </div>

            <nav className="relative z-10 w-full p-6 flex justify-between items-center bg-black/50 backdrop-blur-md border-b border-white/5">
                <Link href="/" className="font-black tracking-widest text-xl bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-slate-400 flex items-center gap-2">
                    <Factory className="text-fuchsia-500" size={24} /> BRAVECOM VENDOR
                </Link>
                <Link href="/mall" className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-sm font-bold transition-all flex items-center gap-2">
                    View Live Mall <ArrowRight size={14} />
                </Link>
            </nav>

            <main className="relative z-10 max-w-6xl mx-auto px-6 py-20 pb-32">
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-400 text-sm font-bold tracking-widest uppercase">
                        <Zap size={16} /> Dropshipping Partner Network
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">
                        Automated Supply <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-600">Distribution.</span>
                    </h1>
                    <p className="text-xl text-slate-400 font-light leading-relaxed">
                        By onboarding as a verified vendor (₹1 Lakh Entry), you gain instant frictionless API access to our investor-driven customer base and mandatory core dropping services.
                    </p>
                </div>

                {/* Required Post-Onboarding Services */}
                <div className="mb-24">
                    <h2 className="text-3xl font-black mb-10 flex items-center gap-4">
                        <ShieldAlert className="text-fuchsia-500" /> Mandatory Enrolled Services
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-slate-900 to-black border border-slate-800 rounded-3xl p-8 hover:border-fuchsia-500/50 transition-colors group">
                            <div className="w-12 h-12 bg-fuchsia-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-fuchsia-500/40 transition-colors">
                                <RefreshCw className="text-fuchsia-400" size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Shopify Connect API</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                Directly linking your inventory management CMS. When a product is purchased in our Mall, your backend receives a silent fulfillment alert immediately.
                            </p>
                            <div className="text-xs font-mono text-fuchsia-400 bg-fuchsia-500/10 px-3 py-1.5 rounded inline-block font-bold">Protocol Active</div>
                        </div>

                        <div className="bg-gradient-to-br from-slate-900 to-black border border-slate-800 rounded-3xl p-8 hover:border-blue-500/50 transition-colors group">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/40 transition-colors">
                                <Link2 className="text-blue-400" size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Margin Guarantee Sync</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                Automatic repricing algorithmic enforcement. We guarantee our network overheads are protected before vendor payout to sustain the 15% ROI logic.
                            </p>
                            <div className="text-xs font-mono text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded inline-block font-bold">Protocol Active</div>
                        </div>

                        <div className="bg-gradient-to-br from-slate-900 to-black border border-slate-800 rounded-3xl p-8 hover:border-emerald-500/50 transition-colors group">
                            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/40 transition-colors">
                                <Smartphone className="text-emerald-400" size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Live Purchase Triggers</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                Your products trigger live social proofs on the BRAVECOM mall. Verified supply tags ensure high velocity sell-through rates to our internal network.
                            </p>
                            <div className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded inline-block font-bold">Protocol Active</div>
                        </div>
                    </div>
                </div>

                {/* Action Panel */}
                <div className="bg-gradient-to-r from-fuchsia-900/30 to-purple-900/10 border border-fuchsia-500/30 rounded-3xl p-10 md:p-14 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-4 max-w-2xl">
                        <h2 className="text-3xl md:text-4xl font-black">Initiate Vendor Handshake</h2>
                        <p className="text-fuchsia-200 text-lg">
                            The ₹1,00,000 INR setup is processed as an upfront liquidity deposit directly fueling the Sunray 15% Network Reserve Pool. Average annual returns per vendor exceed ₹5,00,000.
                        </p>
                        <ul className="space-y-2 pt-4">
                            <li className="flex gap-2 text-sm text-fuchsia-100 font-medium">
                                <CheckCircle2 size={18} className="text-fuchsia-400" /> API Keys Generated Immediately
                            </li>
                            <li className="flex gap-2 text-sm text-fuchsia-100 font-medium">
                                <CheckCircle2 size={18} className="text-fuchsia-400" /> Google Trend Keyword Assignment
                            </li>
                        </ul>
                    </div>

                    <div className="w-full md:w-auto shrink-0">
                        <button
                            onClick={() => setIsPaymentOpen(true)}
                            className="w-full md:w-auto px-10 py-5 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-black text-lg rounded-2xl shadow-[0_0_30px_rgba(192,38,211,0.4)] transition-all flex justify-center items-center gap-3"
                        >
                            Commit ₹1 Lakh Deposit <ArrowRight />
                        </button>
                        <p className="text-center text-xs text-slate-400 mt-4 opacity-70">Secured via RTGS/NEFT Protocol</p>
                    </div>
                </div>

            </main>

            <PaymentModal
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
                amount={100000}
                type="VENDOR_ONBOARDING"
            />
        </div>
    );
}
