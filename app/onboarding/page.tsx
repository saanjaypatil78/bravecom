"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2, User, Building2, ShieldCheck, CreditCard } from "lucide-react";

const STEPS = [
    { id: 1, title: "Personal Details", icon: User, fields: ["Full Name", "Email Address", "Phone Number", "Date of Birth"] },
    { id: 2, title: "KYC Verification", icon: ShieldCheck, fields: ["PAN Card Number", "Aadhaar Number", "Address Line 1", "City & State"] },
    { id: 3, title: "Bank Details", icon: CreditCard, fields: ["Bank Name", "Account Number", "IFSC Code", "Branch Name"] },
    { id: 4, title: "Investment Plan", icon: Building2, fields: ["Select Tier (A-H)", "Investment Amount", "Duration (12 months)", "Referral Code (Optional)"] },
];

export default function OnboardingPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [completed, setCompleted] = useState<number[]>([]);

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCompleted(prev => [...prev, currentStep]);
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) setCurrentStep(prev => prev - 1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#050B14] via-[#0a1628] to-[#050B14] text-white">
            <nav className="border-b border-white/5 backdrop-blur-md bg-black/20 px-6 py-4 flex items-center justify-between">
                <Link href="/" className="font-black tracking-widest text-xl bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">BRAVECOM</Link>
                <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors">Skip to Dashboard →</Link>
            </nav>

            <div className="max-w-3xl mx-auto px-6 py-16">
                {/* Step Indicator */}
                <div className="flex items-center justify-center gap-2 mb-12">
                    {STEPS.map((step, i) => (
                        <React.Fragment key={step.id}>
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${i === currentStep
                                    ? "bg-[#25f4f4] text-[#050B14]"
                                    : completed.includes(i)
                                        ? "bg-emerald-500/20 text-emerald-400"
                                        : "bg-white/5 text-slate-500"
                                }`}>
                                {completed.includes(i) ? <CheckCircle2 size={16} /> : <step.icon size={16} />}
                                <span className="hidden sm:inline">{step.title}</span>
                            </div>
                            {i < STEPS.length - 1 && <div className={`w-8 h-px ${i < currentStep ? "bg-emerald-400" : "bg-white/10"}`}></div>}
                        </React.Fragment>
                    ))}
                </div>

                {/* Step Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
                    >
                        <h2 className="text-2xl font-bold mb-2">{STEPS[currentStep].title}</h2>
                        <p className="text-slate-400 text-sm mb-8">Step {currentStep + 1} of {STEPS.length}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {STEPS[currentStep].fields.map((field) => (
                                <div key={field}>
                                    <label className="block text-xs text-slate-400 mb-1.5 font-medium">{field}</label>
                                    <input
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-[#25f4f4]/50 transition-colors"
                                        placeholder={`Enter ${field.toLowerCase()}`}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between mt-8">
                            <button
                                onClick={handleBack}
                                disabled={currentStep === 0}
                                className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors disabled:opacity-30"
                            >
                                ← Back
                            </button>
                            {currentStep === STEPS.length - 1 ? (
                                <Link
                                    href="/dashboard"
                                    className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-[#25f4f4] rounded-xl text-sm font-bold text-[#050B14] hover:shadow-[0_0_30px_rgba(37,244,244,0.3)] transition-all flex items-center gap-2"
                                >
                                    Complete Onboarding <ArrowRight size={16} />
                                </Link>
                            ) : (
                                <button
                                    onClick={handleNext}
                                    className="px-8 py-3 bg-[#25f4f4] rounded-xl text-sm font-bold text-[#050B14] hover:shadow-[0_0_30px_rgba(37,244,244,0.3)] transition-all flex items-center gap-2"
                                >
                                    Continue <ArrowRight size={16} />
                                </button>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
