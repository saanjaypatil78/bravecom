"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { User, Mail, Phone, Shield, CreditCard, Building2, Edit3, Save, ArrowLeft } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

const PROFILE_SECTIONS = [
    {
        title: "Personal Information",
        icon: User,
        fields: [
            { label: "Full Name", value: "Investor Name", type: "text" },
            { label: "Email Address", value: "investor@example.com", type: "email" },
            { label: "Phone Number", value: "+91 98765 43210", type: "tel" },
            { label: "Date of Birth", value: "1990-01-15", type: "date" },
        ],
    },
    {
        title: "KYC Details",
        icon: Shield,
        fields: [
            { label: "PAN Card", value: "ABCDE1234F", type: "text" },
            { label: "Aadhaar Number", value: "XXXX XXXX 4523", type: "text" },
            { label: "KYC Status", value: "Verified ✓", type: "readonly" },
        ],
    },
    {
        title: "Bank Account",
        icon: CreditCard,
        fields: [
            { label: "Bank Name", value: "HDFC Bank", type: "text" },
            { label: "Account Number", value: "XXXX XXXX 7891", type: "text" },
            { label: "IFSC Code", value: "HDFC0001234", type: "text" },
            { label: "Account Type", value: "Savings", type: "readonly" },
        ],
    },
    {
        title: "Investment Profile",
        icon: Building2,
        fields: [
            { label: "Investor Tier", value: "Tier C — Level 3", type: "readonly" },
            { label: "Commission Level", value: "GOLD", type: "readonly" },
            { label: "ID Color", value: "🟢 GREEN (Active)", type: "readonly" },
            { label: "Referral Code", value: "BRAVE-INV-8827", type: "readonly" },
        ],
    },
];

export default function ProfilePage() {
    const { user } = useAuth();
    const [editing, setEditing] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#050B14] via-[#0a1628] to-[#050B14] text-white">
            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <Link href="/dashboard" className="inline-flex items-center gap-2 text-[#25f4f4] hover:underline text-sm font-medium mb-4">
                            <ArrowLeft size={16} /> Back to Dashboard
                        </Link>
                        <h1 className="text-3xl font-bold">My Profile</h1>
                        <p className="text-slate-400 text-sm mt-1">Manage your account details and preferences</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#25f4f4] to-emerald-400 flex items-center justify-center text-2xl font-black text-[#050B14]">
                            {user?.name?.[0]?.toUpperCase() || "B"}
                        </div>
                    </div>
                </div>

                {/* Profile Sections */}
                <div className="space-y-6">
                    {PROFILE_SECTIONS.map((section, si) => {
                        const SectionIcon = section.icon;
                        const isEditing = editing === section.title;
                        return (
                            <motion.div
                                key={section.title}
                                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: si * 0.1 }}
                            >
                                <div className="flex items-center justify-between mb-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-[#25f4f4]/10 flex items-center justify-center">
                                            <SectionIcon size={20} className="text-[#25f4f4]" />
                                        </div>
                                        <h2 className="text-lg font-bold">{section.title}</h2>
                                    </div>
                                    <button
                                        onClick={() => setEditing(isEditing ? null : section.title)}
                                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all hover:bg-white/10 border border-white/10"
                                    >
                                        {isEditing ? <><Save size={14} /> Save</> : <><Edit3 size={14} /> Edit</>}
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {section.fields.map((field) => (
                                        <div key={field.label}>
                                            <label className="block text-xs text-slate-400 mb-1.5 font-medium">{field.label}</label>
                                            {field.type === "readonly" || !isEditing ? (
                                                <div className="px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-sm text-white">
                                                    {field.value}
                                                </div>
                                            ) : (
                                                <input
                                                    type={field.type}
                                                    defaultValue={field.value}
                                                    className="w-full px-4 py-3 bg-white/10 border border-[#25f4f4]/30 rounded-xl text-white text-sm focus:outline-none focus:border-[#25f4f4] transition-colors"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
                    {[
                        { label: "Investments", href: "/dashboard", icon: "📊" },
                        { label: "Orders", href: "/mall/orders", icon: "📦" },
                        { label: "Network", href: "/network", icon: "🌐" },
                        { label: "Ledger", href: "/ledger", icon: "📋" },
                    ].map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:border-[#25f4f4]/30 transition-colors"
                        >
                            <span className="text-xl">{link.icon}</span>
                            <span className="text-sm font-medium">{link.label}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
