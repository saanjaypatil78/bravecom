"use client";

import { motion } from "framer-motion";
import { Copy, QrCode, Building2, CheckCircle2, ShieldCheck, X } from "lucide-react";
import { useState } from "react";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    amount: number;
    type: "VENDOR_ONBOARDING" | "MALL_PURCHASE" | "INVESTMENT";
    onSuccess?: () => void;
}

export default function PaymentModal({ isOpen, onClose, amount, type, onSuccess }: PaymentModalProps) {
    const [copiedText, setCopiedText] = useState<string | null>(null);

    if (!isOpen) return null;

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopiedText(label);
        setTimeout(() => setCopiedText(null), 2000);
    };

    // Determine logical text flows based on the transaction type
    const getTransparencyLogic = () => {
        switch (type) {
            case "VENDOR_ONBOARDING":
                return {
                    header: "Vendor API Integration Deposit",
                    desc: "This upfront deposit instantly provisions your API tokens and is autonomously redirected into the BRAVECOM Marketing Protocol, acquiring your initial guaranteed customer base.",
                    marginContext: "100% Marketing & Technical Infrastructure."
                };
            case "MALL_PURCHASE":
                return {
                    header: "Classy Mall Purchase Validation",
                    desc: "Authentic dropshipping fulfillment. Your payment secures the inventory. Revenue is logically split: Unit cost to Vendor, and the remaining margin (guaranteed strictly lesser than Amazon & BlinkIt ratios) feeds the 15% Network Yield Pool.",
                    marginContext: "Vendor Output + Core System Yield."
                };
            default:
                return {
                    header: "Capital Protocol Alignment",
                    desc: "Your capital directly secures your Pre-Seed ESOP equity and fuels the Sunray 15% Yield algorithmic pool.",
                    marginContext: "Direct Liquidity Vaulting."
                };
        }
    };

    const logicInfo = getTransparencyLogic();

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative w-full max-w-4xl bg-[#0a0f1a] border border-white/10 rounded-3xl shadow-[0_0_100px_rgba(17,115,212,0.15)] overflow-hidden flex flex-col md:flex-row"
            >
                <button onClick={onClose} className="absolute top-4 right-4 z-10 text-slate-400 hover:text-white p-2 bg-black/50 rounded-full backdrop-blur transition-colors">
                    <X size={20} />
                </button>

                {/* Left Side: Context & QR (PhonePe) */}
                <div className="w-full md:w-2/5 bg-gradient-to-br from-[#12182b] to-[#0a0f1a] p-8 border-r border-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>

                    <ShieldCheck size={48} className="text-emerald-400 mb-6" />

                    <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Seamless RTGS</h3>
                    <p className="text-sm text-slate-400 font-light leading-relaxed mb-8">
                        Due to high-ticket logic (≥ ₹1,00,000 INR), we utilize highly secure bank-tracing protocols over standard gateways to prevent friction.
                    </p>

                    <div className="bg-white p-4 rounded-3xl shadow-2xl relative group">
                        {/* Fallback classy placeholder if the direct PhonePe QR path isn't dynamically linked yet */}
                        <div className="w-48 h-48 bg-slate-100 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300 relative overflow-hidden">
                            {/* Injecting the actual user-provided PhonePe QR here if possible, otherwise simulating classy UI */}
                            <QrCode size={64} className="text-slate-300" />
                            <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">Scan PhonePe Business</span>
                            </div>
                        </div>
                    </div>
                    <p className="mt-4 text-[10px] text-fuchsia-300 font-mono tracking-widest uppercase">Approved Network QR</p>
                </div>

                {/* Right Side: Bank Details & Logic */}
                <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col">
                    <div className="mb-10">
                        <div className="text-xs font-bold text-fuchsia-500 tracking-widest uppercase mb-2">Protocol Routing</div>
                        <h2 className="text-3xl font-black text-white">{logicInfo.header}</h2>
                        <div className="mt-6 p-5 bg-white/5 border border-white/10 rounded-2xl">
                            <p className="text-sm text-slate-300 leading-relaxed font-light">
                                {logicInfo.desc}
                            </p>
                            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-400/10 w-fit px-3 py-1 rounded-full">
                                <CheckCircle2 size={14} /> {logicInfo.marginContext}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 flex-1">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <div className="text-sm text-slate-400 flex items-center gap-2"><Building2 size={16} /> Company Name</div>
                            <div className="text-right flex items-center gap-3">
                                <span className="font-bold text-white tracking-wide">Brave Ecom Pvt Ltd</span>
                                <button onClick={() => copyToClipboard("Brave Ecom Pvt Ltd", "name")} className="text-slate-500 hover:text-white transition-colors">
                                    {copiedText === "name" ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Copy size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <div className="text-sm text-slate-400">Account Number</div>
                            <div className="text-right flex items-center gap-3">
                                <span className="font-mono text-lg font-bold text-white tracking-widest">4051939609</span>
                                <button onClick={() => copyToClipboard("4051939609", "acc")} className="text-slate-500 hover:text-white transition-colors">
                                    {copiedText === "acc" ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Copy size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <div className="text-sm text-slate-400">IFSC Code</div>
                            <div className="text-right flex items-center gap-3">
                                <span className="font-mono text-lg font-bold text-white tracking-widest uppercase">kkbk0001352</span>
                                <button onClick={() => copyToClipboard("KKBK0001352", "ifsc")} className="text-slate-500 hover:text-white transition-colors">
                                    {copiedText === "ifsc" ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Copy size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <div className="text-sm text-slate-400">Accepted Vaulting</div>
                            <div className="text-right flex items-center gap-2">
                                <span className="px-2 py-1 bg-white/5 rounded text-xs font-bold text-white">RTGS</span>
                                <span className="px-2 py-1 bg-white/5 rounded text-xs font-bold text-white">NEFT</span>
                                <span className="px-2 py-1 bg-white/5 rounded text-xs font-bold text-white">IMPS</span>
                            </div>
                        </div>
                    </div>

                    {/* Amount Display */}
                    <div className="mt-8 pt-8 border-t border-white/10 flex items-end justify-between">
                        <div>
                            <div className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Required Commitment</div>
                            <div className="text-xl text-slate-300 font-light">INR</div>
                        </div>
                        <div className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-fuchsia-400">
                            ₹{amount.toLocaleString()}
                        </div>
                    </div>

                    {onSuccess && (
                        <button
                            onClick={() => { onSuccess(); onClose(); }}
                            className="mt-6 w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-lg tracking-tight hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                        >
                            <CheckCircle2 size={20} /> I Have Paid · Confirm Order
                        </button>
                    )}
                </div>

            </motion.div>
        </div>
    );
}
