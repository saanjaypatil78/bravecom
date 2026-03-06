"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Shield, LogIn } from "lucide-react";
import { useAuth, UserRole, ROLE_META, ROLE_DASHBOARDS } from "../context/AuthContext";
import { useRouter } from "next/navigation";

const DEMO_CREDENTIALS: Record<UserRole, { email: string; password: string; name: string }> = {
    ADMIN: { email: "rajesh.sharma@bravecom.in", password: "Admin@Brave2026", name: "Rajesh Sharma" },
    INVESTOR: { email: "priya.kapoor@bravecom.in", password: "Invest@Brave2026", name: "Priya Kapoor" },
    FRANCHISE_PARTNER: { email: "amit.deshmukh@bravecom.in", password: "Franchise@Brave2026", name: "Amit Deshmukh" },
    BUYER: { email: "neha.patel@bravecom.in", password: "Buyer@Brave2026", name: "Neha Patel" },
    VENDOR: { email: "vikram.reddy@bravecom.in", password: "Vendor@Brave2026", name: "Vikram Reddy" },
    QA_ANALYST: { email: "saanjaypatil@gmail.com", password: "QA@Brave2026", name: "Sanjay Patil" },
};

export default function LoginPage() {
    const { login, user, setRole, signIn } = useAuth();
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showForm, setShowForm] = useState(false);

    // If already logged in, redirect to role dashboard
    if (user) {
        router.replace(ROLE_DASHBOARDS[user.role]);
        return (
            <div className="min-h-screen bg-[#050B14] flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-[#25f4f4] border-t-transparent rounded-full"></div>
            </div>
        );
    }

    const handleRoleSelect = (role: UserRole) => {
        setSelectedRole(role);
        const creds = DEMO_CREDENTIALS[role];
        setEmail(creds.email);
        setPassword(creds.password);
        setShowForm(true);
    };

    const handleLogin = () => {
        if (!selectedRole) return;
        setRole(selectedRole);
        login(DEMO_CREDENTIALS[selectedRole].name, selectedRole, email);
        // Use Google sign-in which will redirect to the correct dashboard
        signIn();
    };

    const handleDemoAccess = () => {
        if (!selectedRole) return;
        setRole(selectedRole);
        login(DEMO_CREDENTIALS[selectedRole].name, selectedRole, email);
        router.push(ROLE_DASHBOARDS[selectedRole]);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#050B14] via-[#0a1628] to-[#050B14] text-white overflow-hidden">
            {/* Header */}
            <nav className="border-b border-white/5 backdrop-blur-md bg-black/20 px-6 py-4 flex items-center justify-between">
                <Link href="/" className="font-black tracking-widest text-xl bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                    BRAVECOM
                </Link>
                <Link href="/ledger" className="text-sm text-[#25f4f4] hover:underline font-medium">
                    View Public Ledger →
                </Link>
            </nav>

            <div className="max-w-5xl mx-auto px-6 py-12">
                {/* Title */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-slate-400 mb-4"
                    >
                        <Shield size={14} className="text-[#25f4f4]" />
                        SECURE ROLE-BASED ACCESS
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-4xl font-bold mb-3"
                    >
                        Select Your Portal
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 max-w-lg mx-auto text-sm"
                    >
                        Each role has a dedicated dashboard with tailored features. Choose your role to proceed.
                    </motion.p>
                </div>

                {/* Role Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {(Object.entries(ROLE_META) as [UserRole, typeof ROLE_META[UserRole]][]).map(([role, meta], i) => (
                        <motion.button
                            key={role}
                            onClick={() => handleRoleSelect(role)}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.08 }}
                            className={`text-left p-5 rounded-2xl border transition-all duration-300 group relative overflow-hidden ${
                                selectedRole === role
                                    ? "bg-white/10 border-white/30 shadow-lg"
                                    : "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/15"
                            }`}
                            style={{
                                boxShadow: selectedRole === role ? `0 0 40px ${meta.color}20` : undefined,
                            }}
                        >
                            {/* Selection indicator */}
                            {selectedRole === role && (
                                <motion.div
                                    layoutId="roleIndicator"
                                    className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                    style={{ backgroundColor: meta.color }}
                                >
                                    ✓
                                </motion.div>
                            )}

                            <div className="text-3xl mb-3">{meta.icon}</div>
                            <h3 className="font-bold text-white text-lg mb-1">{meta.label}</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">{meta.description}</p>

                            {/* Role-specific accent bar */}
                            <div
                                className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ backgroundColor: meta.color }}
                            />
                        </motion.button>
                    ))}
                </div>

                {/* Login Form (appears when role is selected) */}
                <AnimatePresence mode="wait">
                    {showForm && selectedRole && (
                        <motion.div
                            key="loginForm"
                            initial={{ opacity: 0, y: 20, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: "auto" }}
                            exit={{ opacity: 0, y: -20, height: 0 }}
                            transition={{ duration: 0.4 }}
                            className="max-w-md mx-auto"
                        >
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="text-3xl">{ROLE_META[selectedRole].icon}</span>
                                    <div>
                                        <h3 className="font-bold text-white">{ROLE_META[selectedRole].label} Login</h3>
                                        <p className="text-xs text-slate-400">Pre-filled demo credentials</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs text-slate-400 mb-1.5 font-medium">Email Address</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#25f4f4]/50 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-400 mb-1.5 font-medium">Password</label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#25f4f4]/50 transition-colors"
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            onClick={handleLogin}
                                            className="flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 text-white"
                                            style={{ backgroundColor: ROLE_META[selectedRole].color }}
                                        >
                                            <LogIn size={16} /> Sign In with Google
                                        </button>
                                    </div>
                                    <button
                                        onClick={handleDemoAccess}
                                        className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                                    >
                                        Quick Demo Access <ArrowRight size={14} />
                                    </button>
                                </div>

                                <p className="text-[10px] text-slate-500 text-center mt-4">
                                    Demo credentials are pre-filled. Click &quot;Quick Demo Access&quot; to explore without Google sign-in.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
