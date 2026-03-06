"use client";

import { motion } from "framer-motion";
import { X, Sparkles, ShoppingCart, TrendingUp, ArrowRight, Chrome, Mail, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: (userName: string, userType: "buyer" | "investor") => void;
}

type UserRole = "buyer" | "investor" | null;

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
    const [userRole, setUserRole] = useState<UserRole>(null);
    const [loading, setLoading] = useState(false);
    const [showEmailOTP, setShowEmailOTP] = useState(false);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [otpSent, setOtpSent] = useState(false);

    if (!isOpen) return null;

    const handleGoogleSignIn = async () => {
        if (!userRole) return;
        setLoading(true);
        setError("");
        
        try {
            await signIn("google", { 
                callbackUrl: "/dashboard",
                redirect: false,
            });
        } catch (err) {
            setError("Google sign in failed");
        } finally {
            setLoading(false);
        }
    };

    const handleEmailOTP = async () => {
        if (!email || !otp) return;
        setLoading(true);
        setError("");

        try {
            const result = await signIn("email-otp", {
                email,
                otp,
                redirect: false,
                callbackUrl: "/dashboard",
            });

            if (result?.ok) {
                onLoginSuccess(email.split("@")[0], userRole || "buyer");
                onClose();
                resetForm();
            } else {
                setError("Invalid OTP. Use 123456 in development.");
            }
        } catch (err) {
            setError("Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setUserRole(null);
        setShowEmailOTP(false);
        setEmail("");
        setOtp("");
        setOtpSent(false);
        setError("");
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleClose}
                className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />

            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-md bg-[#0a0f1a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
            >
                <button onClick={handleClose} className="absolute top-4 right-4 z-10 text-slate-400 hover:text-white p-2 bg-white/5 rounded-full transition-colors">
                    <X size={20} />
                </button>

                <div className="p-8">
                    <div className="flex items-center gap-2 mb-8 justify-center">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fuchsia-500 to-blue-500 flex items-center justify-center shadow-[0_0_15px_rgba(192,38,211,0.5)]">
                            <Sparkles size={16} className="text-white" />
                        </div>
                        <span className="text-xl font-black tracking-widest text-white uppercase">BRAVECOM</span>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {!showEmailOTP ? (
                        <>
                            <h3 className="text-2xl font-black text-white text-center mb-2">
                                Welcome to BRAVECOM
                            </h3>
                            <p className="text-center text-slate-400 text-sm mb-8 font-light">
                                Choose how you want to join our ecosystem
                            </p>

                            <div className="grid grid-cols-1 gap-4">
                                {/* Shopper Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => setUserRole("buyer")}
                                    className="cursor-pointer group relative bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-white/10 rounded-2xl p-6 hover:border-cyan-500/50 transition-all overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 flex items-center justify-center">
                                                <ShoppingCart className="w-7 h-7 text-cyan-400" />
                                            </div>
                                            <Chrome className="w-6 h-6 text-white/30" />
                                        </div>
                                        <h4 className="text-xl font-bold text-white mb-2">Shopper</h4>
                                        <p className="text-sm text-slate-400 mb-4">Browse our curated mall, purchase products with exclusive member pricing</p>
                                        <ul className="text-xs text-slate-500 space-y-1">
                                            <li className="flex items-center gap-2">
                                                <span className="w-1 h-1 rounded-full bg-cyan-400"></span>
                                                Access to sovereign mall
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="w-1 h-1 rounded-full bg-cyan-400"></span>
                                                Member-only deals
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="absolute bottom-4 right-4 flex items-center gap-2 text-xs text-cyan-400 font-medium">
                                        Continue <ArrowRight className="w-4 h-4" />
                                    </div>
                                </motion.div>

                                {/* Investor Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => setUserRole("investor")}
                                    className="cursor-pointer group relative bg-gradient-to-br from-[#1a1a2e] to-[#2d1b4e] border border-white/10 rounded-2xl p-6 hover:border-fuchsia-500/50 transition-all overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="w-14 h-14 rounded-2xl bg-fuchsia-500/20 flex items-center justify-center">
                                                <TrendingUp className="w-7 h-7 text-fuchsia-400" />
                                            </div>
                                            <Chrome className="w-6 h-6 text-white/30" />
                                        </div>
                                        <h4 className="text-xl font-bold text-white mb-2">Investor</h4>
                                        <p className="text-sm text-slate-400 mb-4">Build your network, earn commissions, and grow wealth through referrals</p>
                                        <ul className="text-xs text-slate-500 space-y-1">
                                            <li className="flex items-center gap-2">
                                                <span className="w-1 h-1 rounded-full bg-fuchsia-400"></span>
                                                6-level referral network
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="w-1 h-1 rounded-full bg-fuchsia-400"></span>
                                                Up to 20% commission
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="absolute bottom-4 right-4 flex items-center gap-2 text-xs text-fuchsia-400 font-medium">
                                        Continue <ArrowRight className="w-4 h-4" />
                                    </div>
                                </motion.div>
                            </div>

                            {/* Login Options */}
                            {userRole && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-6 space-y-3"
                                >
                                    <button
                                        onClick={handleGoogleSignIn}
                                        disabled={loading}
                                        className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors"
                                    >
                                        <Chrome size={20} />
                                        Continue with Google
                                    </button>
                                    
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-white/10"></div>
                                        </div>
                                        <div className="relative flex justify-center text-xs">
                                            <span className="bg-[#0a0f1a] px-2 text-slate-500">or</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setShowEmailOTP(true)}
                                        className="w-full py-3 border border-white/20 text-white font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
                                    >
                                        <Mail size={18} />
                                        Continue with Email OTP
                                    </button>
                                </motion.div>
                            )}

                            <div className="mt-6 text-center">
                                <p className="text-xs text-slate-500">
                                    By continuing, you agree to our Terms & Privacy Policy
                                </p>
                            </div>
                        </>
                    ) : (
                        /* Email OTP Form */
                        <>
                            <button onClick={() => setShowEmailOTP(false)} className="text-slate-400 text-sm hover:text-white mb-4 flex items-center gap-1">
                                ← Back
                            </button>

                            <h3 className="text-2xl font-black text-white text-center mb-2">
                                Email Verification
                            </h3>
                            <p className="text-center text-slate-400 text-sm mb-6">
                                {otpSent 
                                    ? `Enter OTP sent to ${email}` 
                                    : "Enter your email to receive verification code"}
                            </p>

                            {!otpSent ? (
                                <form onSubmit={(e) => { e.preventDefault(); setOtpSent(true); }} className="space-y-4">
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            type="email"
                                            required
                                            placeholder="Your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500"
                                        />
                                    </div>
                                    <button 
                                        type="submit"
                                        className="w-full py-3 bg-gradient-to-r from-fuchsia-600 to-blue-600 text-white font-bold rounded-xl"
                                    >
                                        Send OTP
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={(e) => { e.preventDefault(); handleEmailOTP(); }} className="space-y-4">
                                    <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-center mb-4">
                                        <p className="text-sm text-cyan-400">
                                            Development Mode: Use OTP <span className="font-mono font-bold">123456</span>
                                        </p>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            required
                                            placeholder="Enter 6-digit OTP"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500 text-center text-xl tracking-widest font-mono"
                                            maxLength={6}
                                        />
                                    </div>
                                    <button 
                                        type="submit"
                                        disabled={loading || otp.length !== 6}
                                        className="w-full py-3 bg-gradient-to-r from-fuchsia-600 to-blue-600 text-white font-bold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={20} /> : "Verify & Continue"}
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setOtpSent(false)}
                                        className="w-full text-sm text-slate-400 hover:text-white"
                                    >
                                        Change email
                                    </button>
                                </form>
                            )}
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
