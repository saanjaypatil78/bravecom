"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ShoppingCart, TrendingUp, ArrowRight, Chrome, Mail, Lock, User as UserIcon, Loader2, ChevronLeft } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: (userName: string, userType: "buyer" | "investor") => void;
}

type UserRole = "buyer" | "investor" | null;
type AuthState = "ROLE_SELECTION" | "LOGIN" | "SIGNUP";

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
    const [userRole, setUserRole] = useState<UserRole>(null);
    const [authState, setAuthState] = useState<AuthState>("ROLE_SELECTION");

    // Form States
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

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

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (authState === "SIGNUP") {
                if (formData.password !== formData.confirmPassword) {
                    setError("Passwords do not match");
                    return;
                }
                if (formData.password.length < 8) {
                    setError("Password must be at least 8 characters");
                    return;
                }
                // TODO: Replace with real Supabase Signup
                // const { data, error } = await supabase.auth.signUp({ ... })
                await new Promise(res => setTimeout(res, 1500)); // Mock network delay
                onLoginSuccess(formData.name || formData.email.split("@")[0], userRole || "buyer");
                handleClose();
            } else {
                // TODO: Replace with real Supabase Login
                // const { data, error } = await supabase.auth.signInWithPassword({ ... })
                await new Promise(res => setTimeout(res, 1500)); // Mock network delay
                onLoginSuccess(formData.email.split("@")[0], userRole || "buyer");
                handleClose();
            }
        } catch (err: any) {
            setError(err.message || "Authentication failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setUserRole(null);
        setAuthState("ROLE_SELECTION");
        setFormData({ name: "", email: "", password: "", confirmPassword: "" });
        setError("");
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const selectRole = (role: UserRole) => {
        setUserRole(role);
        setAuthState("SIGNUP");
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleClose}
                className="absolute inset-0 bg-[#050B14]/80 backdrop-blur-xl"
            />

            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 30 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full max-w-md bg-[#0a0f1a]/80 border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-2xl"
            >
                {/* Cinematic Core Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-b from-[#1173d4]/20 via-transparent to-transparent opacity-50 blur-2xl pointer-events-none"></div>

                <button onClick={handleClose} className="absolute top-4 right-4 z-20 text-slate-400 hover:text-white p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors backdrop-blur-md">
                    <X size={20} />
                </button>

                {(authState === "LOGIN" || authState === "SIGNUP") && (
                    <button onClick={() => setAuthState("ROLE_SELECTION")} className="absolute top-4 left-4 z-20 text-slate-400 hover:text-white p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors backdrop-blur-md">
                        <ChevronLeft size={20} />
                    </button>
                )}

                <div className="p-8 relative z-10">
                    <div className="flex items-center gap-2 mb-8 justify-center">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1173d4] to-cyan-400 p-[1px] shadow-[0_0_20px_rgba(17,115,212,0.4)]">
                            <div className="w-full h-full bg-[#0a0f1a] rounded-[11px] flex items-center justify-center">
                                <Sparkles size={18} className="text-cyan-400" />
                            </div>
                        </div>
                        <span className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 uppercase">BRAVECOM</span>
                    </div>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 backdrop-blur-md"
                            >
                                <div className="w-1 h-10 bg-red-500 rounded-full"></div>
                                <p className="text-red-400 text-sm font-medium">{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                        {authState === "ROLE_SELECTION" ? (
                            <motion.div
                                key="role-selection"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h3 className="text-3xl font-black text-white text-center mb-2 tracking-tight">
                                    Join the Ecosystem
                                </h3>
                                <p className="text-center text-slate-400 text-sm mb-8 font-light">
                                    Select your path to continue
                                </p>

                                <div className="grid grid-cols-1 gap-4">
                                    {/* Shopper Card */}
                                    <motion.div
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => selectRole("buyer")}
                                        className="cursor-pointer group relative bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-cyan-500/50 transition-all overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="relative z-10 flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0)] group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-shadow">
                                                <ShoppingCart className="w-6 h-6 text-cyan-400" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">Shopper Portal</h4>
                                                <p className="text-xs text-slate-400 leading-relaxed">Access the Drop Shipping Mall with exclusive member pricing and rewards.</p>
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all mt-3" />
                                        </div>
                                    </motion.div>

                                    {/* Investor Card */}
                                    <motion.div
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => selectRole("investor")}
                                        className="cursor-pointer group relative bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-[#1173d4]/50 transition-all overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#1173d4]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="relative z-10 flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-[#1173d4]/10 border border-[#1173d4]/20 flex items-center justify-center shadow-[0_0_15px_rgba(17,115,212,0)] group-hover:shadow-[0_0_15px_rgba(17,115,212,0.3)] transition-shadow">
                                                <TrendingUp className="w-6 h-6 text-[#1173d4]" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-lg font-bold text-white mb-1 group-hover:text-[#1173d4] transition-colors">Investor Platform</h4>
                                                <p className="text-xs text-slate-400 leading-relaxed">Fundraise, build your 6-level network, and earn up to 20% commission.</p>
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-[#1173d4] group-hover:translate-x-1 transition-all mt-3" />
                                        </div>
                                    </motion.div>
                                </div>
                                <div className="mt-8 text-center text-xs text-slate-500 font-medium tracking-wide">
                                    Already have an account? <button onClick={() => setAuthState("LOGIN")} className="text-white hover:text-cyan-400 transition-colors font-bold uppercase ml-1">Log in here</button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={`auth-form-${authState}`}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col h-full"
                            >
                                <div className="text-center mb-8">
                                    <h3 className="text-3xl font-black text-white tracking-tight mb-2">
                                        {authState === "SIGNUP" ? "Create Account" : "Welcome Back"}
                                    </h3>
                                    <p className="text-slate-400 text-sm font-light">
                                        {authState === "SIGNUP"
                                            ? `Registering as ${userRole === "investor" ? "an Investor" : "a Shopper"}`
                                            : "Enter your credentials to access the ecosystem"}
                                    </p>
                                </div>

                                <form onSubmit={handleEmailAuth} className="space-y-4">
                                    {authState === "SIGNUP" && (
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <UserIcon size={18} className="text-slate-500 group-focus-within:text-[#1173d4] transition-colors" />
                                            </div>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                placeholder="Full Legal Name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-[#1173d4] focus:bg-white/5 transition-all shadow-inner"
                                            />
                                        </div>
                                    )}

                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail size={18} className="text-slate-500 group-focus-within:text-[#1173d4] transition-colors" />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            placeholder="Email Address"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-[#1173d4] focus:bg-white/5 transition-all shadow-inner"
                                        />
                                    </div>

                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock size={18} className="text-slate-500 group-focus-within:text-[#1173d4] transition-colors" />
                                        </div>
                                        <input
                                            type="password"
                                            name="password"
                                            required
                                            placeholder="Password (Min 8 chars)"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-[#1173d4] focus:bg-white/5 transition-all shadow-inner"
                                        />
                                    </div>

                                    {authState === "SIGNUP" && (
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Lock size={18} className="text-slate-500 group-focus-within:text-[#1173d4] transition-colors" />
                                            </div>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                required
                                                placeholder="Confirm Password"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-[#1173d4] focus:bg-white/5 transition-all shadow-inner"
                                            />
                                        </div>
                                    )}

                                    {authState === "LOGIN" && (
                                        <div className="flex justify-end pt-1">
                                            <button type="button" className="text-xs text-[#1173d4] hover:text-cyan-400 transition-colors font-medium">
                                                Forgot Password?
                                            </button>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="group relative w-full py-4 bg-gradient-to-r from-[#1173d4] to-cyan-500 text-white font-black rounded-xl overflow-hidden disabled:opacity-70 transition-transform active:scale-[0.98]"
                                    >
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none"></div>
                                        <div className="relative z-10 flex items-center justify-center gap-2">
                                            {loading ? <Loader2 className="animate-spin w-5 h-5 text-white" /> : (authState === "SIGNUP" ? "Create Account" : "Secure Login")}
                                            {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                                        </div>
                                    </button>
                                </form>

                                <div className="mt-8 relative">
                                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-white/10"></div>
                                    <div className="relative flex justify-center">
                                        <span className="bg-[#0a0f1a] px-4 text-xs font-bold text-slate-500 uppercase tracking-widest">or</span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleGoogleSignIn}
                                    disabled={loading}
                                    className="mt-8 w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-all"
                                >
                                    <Chrome className="text-[#1173d4]" size={20} />
                                    Continue with Google
                                </button>

                                <div className="mt-8 text-center text-xs text-slate-500 font-medium tracking-wide">
                                    {authState === "SIGNUP" ? "Already have an account?" : "Don't have an account?"}
                                    <button
                                        onClick={() => setAuthState(authState === "SIGNUP" ? "LOGIN" : "ROLE_SELECTION")}
                                        className="text-white hover:text-cyan-400 transition-colors font-bold uppercase ml-1"
                                    >
                                        {authState === "SIGNUP" ? "Log In" : "Sign Up"}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
