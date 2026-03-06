"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, CheckCircle2, TrendingUp, DollarSign, Package, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

const WORKFLOW_STEPS = [
    {
        id: 1,
        title: "Fetching Trending Ideas",
        description: "Scanning TikTok & Amazon Movers & Shakers...",
        icon: Search,
        delay: 2000,
        logs: [
            "Intercepting viral API streams...",
            "Candidate found: Magnetic Floating Globe (Est. Base: ₹850)",
            "Candidate found: Auto Face Tracking Tripod (Est. Base: ₹1200)",
            "Candidate found: Postural Corrector Pro (Est. Base: ₹250)",
            "Selecting highest velocity candidate: Postural Corrector Pro"
        ]
    },
    {
        id: 2,
        title: "Verifying Google Trends",
        description: "Checking search volume momentum...",
        icon: TrendingUp,
        delay: 2500,
        logs: [
            "Querying Google Trends API...",
            "Validating search volume curve for 'Postural Corrector Pro'...",
            "Trend validation: POSITIVE (Upward curve detected)"
        ]
    },
    {
        id: 3,
        title: "Supplier Verification",
        description: "Checking AliExpress Dropshipping Center...",
        icon: AlertCircle,
        delay: 2500,
        logs: [
            "Scanning top suppliers...",
            "Supplier found: Rating 4.8 | Orders: 14,205",
            "Supplier validation: PASSED (Gold Standard Tier)"
        ]
    },
    {
        id: 4,
        title: "Profit Margin Calculation",
        description: "Ensuring 15% ROI logic sustainability...",
        icon: DollarSign,
        delay: 2000,
        logs: [
            "Supplier Cost: ₹250",
            "Estimated Ad Spend (30%): ₹225",
            "Target Selling Price: ₹750",
            "Estimated Net Profit: ₹275",
            "Margin validation: PASSED"
        ]
    },
    {
        id: 5,
        title: "Mall Catalog Auto-Injection",
        description: "Deploying to live production...",
        icon: CheckCircle2,
        delay: 2000,
        logs: [
            "Fetching high-res product imagery...",
            "Assigning ID: MALL-PRD-00001",
            "Applying 'TRENDING' and '-28%' badges...",
            "Syncing to database route...",
            "SUCCESS! Product is now LIVE."
        ]
    }
];

export default function AutoResearchWorkflow() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [isActive, setIsActive] = useState(false);

    const startWorkflow = () => {
        setIsActive(true);
        setCurrentStep(1);
        setLogs(["System Initialized. Awaiting telemetry..."]);
    };

    useEffect(() => {
        if (!isActive || currentStep > WORKFLOW_STEPS.length) return;

        const step = WORKFLOW_STEPS[currentStep - 1];
        let logIndex = 0;

        const logInterval = setInterval(() => {
            if (logIndex < step.logs.length) {
                setLogs(prev => [...prev, `[STEP ${step.id}/5] ${step.logs[logIndex]}`]);
                logIndex++;
            } else {
                clearInterval(logInterval);
                if (currentStep < WORKFLOW_STEPS.length) {
                    setTimeout(() => setCurrentStep(prev => prev + 1), 500);
                } else {
                    setTimeout(() => setIsComplete(true), 1000);
                }
            }
        }, step.delay / step.logs.length);

        return () => clearInterval(logInterval);
    }, [currentStep, isActive]);

    return (
        <div className="w-full bg-[#0B1526]/80 p-6 md:p-8 border border-white/5 rounded-2xl backdrop-blur-xl">
            <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-black mb-1 text-white">Autonomous Research Engine</h2>
                    <p className="text-sm text-slate-400">AI-driven product discovery, margin verification, and automated mall injection.</p>
                </div>
                {!isActive && (
                    <button
                        onClick={startWorkflow}
                        className="px-6 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(192,38,211,0.3)] flex items-center gap-2"
                    >
                        <Search size={18} /> Initialize Scan
                    </button>
                )}
            </div>

            {isActive && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Visualizer */}
                    <div className="space-y-4">
                        {WORKFLOW_STEPS.map((step) => {
                            const Icon = step.icon || Package;
                            const isActiveStep = currentStep === step.id;
                            const isPastStep = currentStep > step.id;

                            return (
                                <motion.div
                                    key={step.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: isActiveStep || isPastStep ? 1 : 0.3, x: 0 }}
                                    className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${isActiveStep ? 'bg-fuchsia-500/10 border-fuchsia-500/50 shadow-[0_0_15px_rgba(192,38,211,0.2)]' : isPastStep ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-transparent border-white/5'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isActiveStep ? 'bg-fuchsia-500/20 text-fuchsia-400' : isPastStep ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                                        }`}>
                                        {isActiveStep ? <Loader2 className="w-5 h-5 animate-spin" /> : isPastStep ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <div className={`font-bold ${isActiveStep ? 'text-fuchsia-400' : isPastStep ? 'text-emerald-400' : 'text-slate-500'}`}>{step.title}</div>
                                        <div className="text-xs text-slate-400 mt-0.5">{step.description}</div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Terminal Window */}
                    <div className="bg-black/80 border border-slate-800 rounded-xl p-4 font-mono text-xs md:text-sm text-emerald-400 max-h-[400px] overflow-y-auto flex flex-col pt-4">
                        <div className="text-slate-500 mb-4 pb-2 border-b border-slate-800 flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                            <span className="ml-2">bravecom_engine.exe - Running</span>
                        </div>
                        <AnimatePresence>
                            {logs.map((log, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-1.5"
                                >
                                    <span className="text-slate-500 mr-2">{new Date().toLocaleTimeString().split(' ')[0]}</span>
                                    {log.includes('PASSED') || log.includes('SUCCESS') ? (
                                        <span className="text-emerald-400">{log}</span>
                                    ) : log.includes('FAILED') || log.includes('CRITICAL') ? (
                                        <span className="text-red-400">{log}</span>
                                    ) : log.includes('Postural Corrector Pro') ? (
                                        <span className="text-fuchsia-400 font-bold">{log}</span>
                                    ) : (
                                        <span className="text-emerald-500/70">{log}</span>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Success Injection Banner */}
                        {isComplete && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mt-8 bg-fuchsia-900/30 border border-fuchsia-500/50 rounded-xl p-6 text-white text-center"
                            >
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-fuchsia-500/20 text-fuchsia-400 rounded-full mb-4">
                                    <Package size={24} />
                                </div>
                                <h1 className="text-3xl lg:text-4xl font-bold mb-4">Postural Corrector Pro</h1>
                                <p className="text-fuchsia-200 mb-6 font-sans">
                                    Product has been successfully vetted, priced, and injected into the Sovereign Mall catalog. Live metrics are now tracking.
                                </p>
                                <Link href="/mall/product?id=MALL-PRD-00001" className="inline-flex items-center gap-2 font-sans px-6 py-2.5 bg-white text-black font-bold rounded-lg hover:bg-slate-200 transition-colors">
                                    View Live Product <ArrowRight size={16} />
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
