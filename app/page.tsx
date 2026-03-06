"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowRight, BarChart3, Box, Globe2, Rocket, ShieldCheck, ChevronDown, CheckCircle2, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useAuth } from "./context/AuthContext";

export default function ParallaxLanding() {
    const containerRef = useRef(null);
    const [mounted, setMounted] = useState(false);
    const { user, openAuthModal, logout } = useAuth();

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(t);
    }, []);

    const { scrollYProgress } = useScroll({
        // We remove the target ref to use the window viewport scroll automatically, 
        // avoiding SSR hydration errors in Next.js.
    });

    // Smooth scroll progress
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // --- Header Animations ---
    const headerOpacity = useTransform(smoothProgress, [0, 0.05], [1, 0]);
    const headerY = useTransform(smoothProgress, [0, 0.1], [0, -100]);

    // --- Hero 3D Elements ---
    const logoScale = useTransform(smoothProgress, [0, 0.2], [1, 15]);
    const logoOpacity = useTransform(smoothProgress, [0, 0.1, 0.2], [1, 0.5, 0]);
    const logoRotate = useTransform(smoothProgress, [0, 0.2], [0, 45]);

    // Floating Orbs

    // --- Section 1: IPO Fundraising (Starts around 0.15, peaks at 0.3) ---
    const ipoOpacity = useTransform(smoothProgress, [0.1, 0.2, 0.35, 0.45], [0, 1, 1, 0]);
    const ipoZ = useTransform(smoothProgress, [0.1, 0.2, 0.35], [500, 0, -500]);
    const ipoRotateX = useTransform(smoothProgress, [0.1, 0.2, 0.35], [20, 0, -20]);
    const ipoPointerEvents = useTransform(ipoOpacity, v => v > 0.05 ? "auto" : "none");

    // --- Section 2: Dropshipping (Starts around 0.35, peaks at 0.55) ---
    const dropOpacity = useTransform(smoothProgress, [0.35, 0.45, 0.6, 0.7], [0, 1, 1, 0]);
    const dropX = useTransform(smoothProgress, [0.35, 0.45, 0.6], [500, 0, -500]);
    const dropRotateY = useTransform(smoothProgress, [0.35, 0.45, 0.6], [-30, 0, 30]);
    const dropPointerEvents = useTransform(dropOpacity, v => v > 0.05 ? "auto" : "none");

    // --- Section 3: PMS & Sunrays Ecosystem (Starts around 0.6, peaks at 0.8) ---
    const pmsOpacity = useTransform(smoothProgress, [0.6, 0.7, 0.9, 1], [0, 1, 1, 0]);
    const pmsScale = useTransform(smoothProgress, [0.6, 0.7, 0.9], [0.5, 1, 1.5]);
    const pmsPointerEvents = useTransform(pmsOpacity, v => v > 0.05 ? "auto" : "none");

    // --- Footer / CTA ---
    const ctaOpacity = useTransform(smoothProgress, [0.85, 0.95], [0, 1]);
    const ctaY = useTransform(smoothProgress, [0.85, 0.95], [100, 0]);
    const ctaPointerEvents = useTransform(ctaOpacity, v => v > 0.05 ? "auto" : "none");

    // Static content that renders during SSR (no framer-motion)
    const staticNavbar = (
        <nav className="absolute top-0 w-full z-50 p-6 flex justify-between items-center backdrop-blur-md border-b border-white/5 bg-black/20">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-gradient-to-tr from-[#1173d4] to-cyan-400 flex items-center justify-center">
                    <Rocket size={18} className="text-white" />
                </div>
                <span className="font-black tracking-widest text-xl bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">BRAVECOM</span>
            </div>
            <div className="hidden md:flex gap-8 text-sm font-medium text-slate-300 items-center">
                <Link href="#ipo" className="hover:text-white transition-colors">IPO platform</Link>
                <Link href="#dropshipping" className="hover:text-white transition-colors">Drop Shipping</Link>
                <Link href="#pms" className="hover:text-white transition-colors">PMS Services</Link>
                <Link href="/ledger" className="text-[#25f4f4] hover:text-[#25f4f4]/80 font-bold transition-colors">Public Ledger</Link>
                <div className="w-px h-4 bg-white/20"></div>
                <Link href="/esop" className="text-amber-400 hover:text-amber-300 font-bold transition-colors">ESOP Module</Link>
                <Link href="/network" className="text-blue-400 hover:text-blue-300 font-bold transition-colors">Sunrays Visualizer</Link>
            </div>
            {user ? (
                <div className="flex items-center gap-3">
                    <Link href="/dashboard" className="px-4 py-2 bg-[#1173d4] hover:bg-[#1173d4]/80 rounded-full text-sm font-bold transition-all flex items-center gap-2">
                        <User size={14} />
                        Dashboard
                    </Link>
                    <button onClick={logout} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Logout">
                        <LogOut size={18} className="text-slate-400" />
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-3">
                    <button onClick={openAuthModal} className="px-4 py-2 text-slate-300 hover:text-white text-sm font-medium transition-colors">
                        Login
                    </button>
                    <button onClick={openAuthModal} className="px-5 py-2 bg-gradient-to-r from-fuchsia-600 to-blue-600 hover:from-fuchsia-500 hover:to-blue-500 rounded-full text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-fuchsia-500/20">
                        Get Started <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            )}
        </nav>
    );

    return (
        <div ref={containerRef} className="relative h-[400vh] bg-[#050B14] overflow-clip font-['Outfit']">

            {/* Abstract Background Elements - Static for SSR */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[#050B14]"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
            </div>

            {/* Scroll Anchors */}
            <div id="ipo" className="absolute top-[75vh]" />
            <div id="dropshipping" className="absolute top-[160vh]" />
            <div id="pms" className="absolute top-[250vh]" />

            {/* Sticky Viewport */}
            <div className="sticky top-0 h-screen w-full overflow-hidden perspective-[1000px]">

                {/* Navbar - Show static first, animate after mount */}
                {mounted ? (
                    <motion.nav style={{ opacity: headerOpacity, y: headerY }} className="absolute top-0 w-full z-50 p-6 flex justify-between items-center backdrop-blur-md border-b border-white/5 bg-black/20">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded bg-gradient-to-tr from-[#1173d4] to-cyan-400 flex items-center justify-center">
                                <Rocket size={18} className="text-white" />
                            </div>
                            <span className="font-black tracking-widest text-xl bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">BRAVECOM</span>
                        </div>
                        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-300 items-center">
                            <Link href="#ipo" className="hover:text-white transition-colors">IPO platform</Link>
                            <Link href="#dropshipping" className="hover:text-white transition-colors">Drop Shipping</Link>
                            <Link href="#pms" className="hover:text-white transition-colors">PMS Services</Link>
                            <div className="w-px h-4 bg-white/20"></div>
                            <Link href="/esop" className="text-amber-400 hover:text-amber-300 font-bold transition-colors">ESOP Module</Link>
                            <Link href="/network" className="text-blue-400 hover:text-blue-300 font-bold transition-colors">Sunrays Visualizer</Link>
                        </div>
                        {user ? (
                            <div className="flex items-center gap-3">
                                <Link href="/dashboard" className="px-4 py-2 bg-[#1173d4] hover:bg-[#1173d4]/80 rounded-full text-sm font-bold transition-all flex items-center gap-2">
                                    <User size={14} />
                                    Dashboard
                                </Link>
                                <button onClick={logout} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Logout">
                                    <LogOut size={18} className="text-slate-400" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <button onClick={openAuthModal} className="px-4 py-2 text-slate-300 hover:text-white text-sm font-medium transition-colors">
                                    Login
                                </button>
                                <button onClick={openAuthModal} className="px-5 py-2 bg-gradient-to-r from-fuchsia-600 to-blue-600 hover:from-fuchsia-500 hover:to-blue-500 rounded-full text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-fuchsia-500/20">
                                    Get Started <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        )}
                    </motion.nav>
                ) : staticNavbar}

                {/* Hero Section */}
                <motion.div style={{ scale: logoScale, opacity: logoOpacity, rotateZ: logoRotate }} className="absolute inset-0 flex flex-col items-center justify-center z-40 transform-style-3d pointer-events-none">
                    <div className="relative flex flex-col items-center text-center">
                        <div className="absolute -inset-10 bg-[#1173d4] blur-[100px] opacity-30 rounded-full animate-pulse"></div>
                        <h1 className="text-[10vw] font-black tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-[#1173d4]/50 drop-shadow-2xl">
                            BRAVECOM
                        </h1>
                    </div>
                    <p className="mt-6 text-xl md:text-2xl font-light text-slate-300 max-w-2xl text-center px-4 tracking-wide">
                        The next-generation <b className="text-white">IPO Fundraising</b> & Ecosystem Platform.
                    </p>
                    <div className="absolute bottom-10 flex flex-col items-center gap-2 animate-bounce opacity-50">
                        <span className="text-[10px] tracking-widest uppercase font-bold">Scroll to explore</span>
                        <ChevronDown size={20} />
                    </div>
                </motion.div>

                {/* Section 1: IPO Fundraising */}
                <motion.div
                    style={{ opacity: ipoOpacity, z: ipoZ, rotateX: ipoRotateX, pointerEvents: ipoPointerEvents }}
                    className="absolute inset-0 flex items-center justify-center z-30 p-4"
                >
                    <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold tracking-widest uppercase">
                                <BarChart3 size={16} /> Pillar 01
                            </div>
                            <h2 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[1.1]">
                                IPO Focused <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1173d4] to-cyan-400">Fundraising.</span>
                            </h2>
                            <p className="text-xl text-slate-400 leading-relaxed font-light">
                                Target capital is softcapped at <b className="text-white">111 Cr</b> and hard capped at <b className="text-white">141 Cr</b>. We raised 12 Cr in our Pre-Seed Round and have been trading profitably since Jan 2024.
                            </p>
                            <ul className="space-y-4 pt-4">
                                {["NSE Mainboard IPO Criteria Targeted", "Pre-IPO ESOP Benefits for Early Investors", "15% Monthly Static ROI for Active Accounts"].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                                        <CheckCircle2 className="text-[#1173d4]" size={20} /> {item}
                                    </li>
                                ))}
                            </ul>
                            <div className="flex flex-col sm:flex-row gap-4 mt-8">
                                <Link href="/esop" className="group relative px-8 py-4 bg-[#1173d4] rounded-xl font-bold text-white shadow-[0_0_30px_rgba(17,115,212,0.4)] hover:shadow-[0_0_50px_rgba(17,115,212,0.6)] transition-all overflow-hidden flex items-center justify-center gap-3 transform hover:-translate-y-1">
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-[#1173d4] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <span className="relative z-10">Access IPO Platform</span>
                                    <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link href="/dashboard/register" className="group px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 text-white rounded-xl font-bold backdrop-blur-md transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1">
                                    Whitelist Registration
                                </Link>
                            </div>
                        </div>

                        {/* 3D Glass Card */}
                        <div className="relative aspect-[4/3] rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl shadow-blue-900/50 p-8 flex flex-col justify-between overflow-hidden transform-gpu preserve-3d">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#1173d4]/20 to-transparent"></div>
                            <div className="relative z-10 flex justify-between items-start">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-400 tracking-widest uppercase">Target & Soft Cap</h3>
                                    <p className="text-4xl font-black text-white mt-1">₹111,00,00,000</p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                                    <BarChart3 className="text-cyan-400" />
                                </div>
                            </div>

                            <div className="relative z-10 space-y-4">
                                <div className="flex justify-between text-sm font-bold text-slate-300">
                                    <span>Pre-Seed Raised</span>
                                    <span className="text-green-400">₹12,00,00,000</span>
                                </div>
                                <div className="w-full h-4 bg-black/40 rounded-full overflow-hidden shadow-inner border border-white/5">
                                    <div className="h-full w-[10.8%] bg-gradient-to-r from-[#1173d4] to-cyan-400 rounded-full shadow-[0_0_15px_rgba(17,115,212,0.8)] animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Section 2: Dropshipping */}
                <motion.div
                    style={{ opacity: dropOpacity, x: dropX, rotateY: dropRotateY, pointerEvents: dropPointerEvents }}
                    className="absolute inset-0 flex items-center justify-center z-20 p-4"
                >
                    <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                        {/* 3D Abstract UI representation */}
                        <div className="relative aspect-square md:aspect-[4/3] order-2 lg:order-1 flex items-center justify-center">
                            <div className="absolute w-64 h-64 bg-fuchsia-600/20 blur-[100px] rounded-full"></div>
                            <div className="grid grid-cols-2 gap-4 w-full h-full relative z-10 p-8 text-center text-xs">
                                {[
                                    { t: "Sustainable Living", s: "Bamboo & Beeswax" },
                                    { t: "Pet Care & Wellness", s: "Smart AI Feeders" },
                                    { t: "Gaming & Esports", s: "RGB Hardware" },
                                    { t: "Smart Home Tech", s: "Automation IoT" }
                                ].map((cat, i) => (
                                    <div key={i} className={`rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl p-4 flex flex-col items-center justify-center gap-2 transition-transform hover:scale-105 duration-500 ${i % 2 === 0 ? 'translate-y-8' : ''}`}>
                                        <Box className="text-fuchsia-400" size={24} />
                                        <span className="font-bold text-[10px] text-white">{cat.t}</span>
                                        <span className="text-[9px] text-slate-400">{cat.s}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6 order-1 lg:order-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 text-sm font-bold tracking-widest uppercase">
                                <Globe2 size={16} /> Pillar 02
                            </div>
                            <h2 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[1.1]">
                                Drop Shipping <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-purple-400">Ecosystem.</span>
                            </h2>
                            <p className="text-xl text-slate-400 leading-relaxed font-light">
                                Integrating high-demand products globally based on Google Trends. From <i>Eco-Friendly Beauty</i> and <i>Digital Nomad Gear</i> to <i>Smart Baby Monitors</i>.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mt-8">
                                <Link href="/vendor" className="group relative px-8 py-4 bg-fuchsia-600 rounded-xl font-bold text-white shadow-[0_0_30px_rgba(192,38,211,0.4)] hover:shadow-[0_0_50px_rgba(192,38,211,0.6)] transition-all overflow-hidden flex items-center justify-center gap-3 transform hover:-translate-y-1">
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-fuchsia-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <span className="relative z-10">Vendor Onboarding</span>
                                    <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link href="/mall" className="group px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 text-white rounded-xl font-bold backdrop-blur-md transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1">
                                    Mall (Customer Area)
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Section 3: PMS & Network */}
                <motion.div
                    style={{ opacity: pmsOpacity, scale: pmsScale, pointerEvents: pmsPointerEvents }}
                    className="absolute inset-0 flex items-center justify-center z-10 p-4"
                >
                    <div className="max-w-4xl text-center space-y-8 flex flex-col items-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm font-bold tracking-widest uppercase">
                            <ShieldCheck size={16} /> Pillar 03
                        </div>
                        <h2 className="text-6xl md:text-8xl font-black tracking-tight text-white leading-[1]">
                            PMS Services & <br />Sunrays <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Network.</span>
                        </h2>
                        <p className="text-xl md:text-2xl text-slate-400 font-light max-w-2xl">
                            Our Portfolio Management Services utilize a 6-Level affiliate marketing framework to distribute wealth.
                        </p>

                        <div className="flex justify-center mt-8">
                            <Link href="/network" className="group relative px-8 py-4 bg-amber-600 rounded-xl font-bold text-white shadow-[0_0_30px_rgba(217,119,6,0.4)] hover:shadow-[0_0_50px_rgba(217,119,6,0.6)] transition-all overflow-hidden flex items-center justify-center gap-3 transform hover:-translate-y-1">
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <span className="relative z-10">Enter Network Portal</span>
                                <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-8 text-left pointer-events-auto">
                            <div className="bg-gradient-to-b from-green-500/20 to-transparent border border-green-500/30 rounded-2xl p-6 backdrop-blur-xl">
                                <div className="w-3 h-3 rounded-full bg-green-500 mb-4 shadow-[0_0_10px_#22c55e]"></div>
                                <h3 className="font-bold text-lg mb-2 text-white">Active Investors</h3>
                                <p className="text-sm text-slate-400">Users with &gt; 100k INR invested. Earn 15% monthly ROI and affiliate commissions across 6 levels.</p>
                            </div>
                            <div className="bg-gradient-to-b from-orange-500/20 to-transparent border border-orange-500/30 rounded-2xl p-6 backdrop-blur-xl">
                                <div className="w-3 h-3 rounded-full bg-orange-500 mb-4 shadow-[0_0_10px_#f97316]"></div>
                                <h3 className="font-bold text-lg mb-2 text-white">Passive Connectors</h3>
                                <p className="text-sm text-slate-400">Users without capital who build massive networks. 60-day timer to achieve 100k INR capital requirement.</p>
                            </div>
                            <div className="bg-gradient-to-b from-red-500/20 to-transparent border border-red-500/30 rounded-2xl p-6 backdrop-blur-xl">
                                <div className="w-3 h-3 rounded-full bg-red-500 mb-4 shadow-[0_0_10px_#ef4444]"></div>
                                <h3 className="font-bold text-lg mb-2 text-white">Inactive/Dormant</h3>
                                <p className="text-sm text-slate-400">Users who fail to meet the capital threshold. Commission privileges suspended until activation.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* CTA Footer Section */}
                <motion.div
                    style={{ opacity: ctaOpacity, y: ctaY, pointerEvents: ctaPointerEvents }}
                    className="absolute inset-0 flex flex-col items-center justify-end pb-24 z-50 pointer-events-auto"
                >
                    <div className="bg-gradient-to-t from-black via-[#050B14] to-transparent absolute inset-0 -z-10 h-full w-full opacity-80"></div>
                    <h2 className="text-4xl md:text-5xl font-black text-white text-center mb-8">Ready to join the ecosystem?</h2>
                    <div className="flex flex-col sm:flex-row gap-6">
                        <Link href="/dashboard" className="group relative px-8 py-4 bg-gradient-to-r from-[#1173d4] to-cyan-500 rounded-full font-black text-white shadow-[0_0_40px_rgba(17,115,212,0.6)] hover:shadow-[0_0_60px_rgba(17,115,212,0.8)] transition-all overflow-hidden flex items-center justify-center gap-3 transform hover:scale-105 active:scale-95">
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none"></div>
                            Launch Dashboard
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                                <ArrowRight size={18} className="text-white" />
                            </div>
                        </Link>
                        <Link href="/ledger" className="group px-8 py-4 bg-[#25f4f4]/10 hover:bg-[#25f4f4]/20 border border-[#25f4f4]/40 hover:border-[#25f4f4]/60 text-[#25f4f4] rounded-full font-bold backdrop-blur-md transition-all flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(37,244,244,0.2)]">
                            View Public Ledger
                        </Link>
                        <Link href="/dashboard/register" className="group px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 text-white rounded-full font-bold backdrop-blur-md transition-all flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95">
                            Register Investor
                        </Link>
                    </div>
                    <p className="mt-12 text-sm text-slate-500 font-medium">© 2026 Brave Ecom Pvt Ltd. Sunray Systems.</p>
                </motion.div>

            </div >
        </div >
    );
}
