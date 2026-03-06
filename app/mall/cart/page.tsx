'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Gem, Search, Bell, ShoppingCart, ShieldCheck,
    Minus, Plus, Trash2, HelpCircle, Leaf
} from 'lucide-react';

const cartItemVariant = {
    hidden: { opacity: 0, x: -60, rotateY: -5 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        rotateY: 0,
        transition: {
            duration: 0.7,
            delay: i * 0.15,
            ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        },
    }),
};

const sidebarVariant = {
    hidden: { opacity: 0, x: 60, scale: 0.95 },
    visible: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: { duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    },
};

export default function SovereignMallSmartCart() {
    return (
        <div className="bg-[#f5f8f8] dark:bg-[#111818] text-slate-900 dark:text-slate-100 font-display min-h-screen flex flex-col overflow-x-hidden">
            {/* Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-[#283939] px-6 py-4 lg:px-10 w-full transition-colors">
                <div className="flex items-center gap-8">
                    <Link href="/mall" className="flex items-center gap-4 dark:text-white group">
                        <div className="size-8 text-[#25f4f4] flex items-center justify-center transition-transform group-hover:scale-110">
                            <Gem size={28} />
                        </div>
                        <h2 className="dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
                            Sovereign Mall
                        </h2>
                    </Link>
                    <label className="hidden md:flex flex-col min-w-40 !h-10 max-w-64 relative group">
                        <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-slate-100 dark:bg-[#283939] transition-colors border border-transparent focus-within:border-[#25f4f4]/50">
                            <div className="text-[#9cbaba] flex items-center justify-center pl-4 rounded-l-lg border-none">
                                <Search size={20} />
                            </div>
                            <input
                                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg dark:text-white focus:outline-0 focus:ring-0 border-none bg-transparent placeholder:text-[#9cbaba] px-4 text-sm font-normal leading-normal"
                                placeholder="Search assets..."
                                type="text"
                            />
                        </div>
                    </label>
                </div>

                <div className="flex flex-1 justify-end gap-6 items-center">
                    <nav className="hidden lg:flex items-center gap-8">
                        <Link className="dark:text-white hover:text-[#25f4f4] transition-colors text-sm font-medium leading-normal" href="/mall">
                            Marketplace
                        </Link>
                        <Link className="dark:text-white hover:text-[#25f4f4] transition-colors text-sm font-medium leading-normal" href="/investor/portfolio">
                            Investments
                        </Link>
                        <Link className="dark:text-white hover:text-[#25f4f4] transition-colors text-sm font-medium leading-normal" href="/network">
                            Community
                        </Link>
                    </nav>
                    <div className="flex gap-3">
                        <Link href="/mall/checkout" className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#25f4f4] text-[#111818] hover:bg-[#25f4f4]/90 transition-colors text-sm font-bold leading-normal tracking-[0.015em] shadow-[0_0_15px_rgba(37,244,244,0.3)]">
                            <span className="truncate">Checkout</span>
                        </Link>
                        <button className="hidden sm:flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-slate-200 dark:bg-[#283939] text-slate-700 dark:text-white hover:bg-slate-300 dark:hover:bg-[#283939]/80 transition-colors gap-2 text-sm font-bold px-2.5">
                            <Bell size={20} />
                        </button>
                        <Link href="/mall/cart" className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-slate-200 dark:bg-[#283939] text-slate-700 dark:text-white hover:bg-slate-300 dark:hover:bg-[#283939]/80 transition-colors gap-2 text-sm font-bold px-2.5 relative">
                            <ShoppingCart size={20} />
                            <span className="absolute top-1.5 right-1.5 size-2 bg-[#25f4f4] rounded-full shadow-[0_0_5px_rgba(37,244,244,0.8)]"></span>
                        </Link>
                    </div>
                    <div className="flex items-center justify-center rounded-full size-10 border-2 border-[#25f4f4]/20 bg-slate-200 dark:bg-[#283939] text-slate-500 dark:text-[#9cbaba]">
                        <Gem size={20} />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 px-4 md:px-10 py-8 lg:px-20 xl:px-40 lg:py-12 w-full max-w-[1440px] mx-auto">
                {/* Page Title */}
                <div className="flex flex-wrap justify-between items-end gap-4 mb-10">
                    <div className="flex flex-col gap-2">
                        <motion.h1
                            className="text-4xl md:text-5xl font-black leading-tight tracking-tight dark:text-white"
                            initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            Your Smart Cart
                        </motion.h1>
                        <motion.p
                            className="text-[#9cbaba] text-lg font-normal max-w-2xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            Review your luxury selections and investment potential. Your current cart qualifies for Tier 2 rewards.
                        </motion.p>
                    </div>
                    <motion.div
                        className="flex items-center gap-2 text-[#25f4f4] bg-[#25f4f4]/10 px-4 py-2 rounded-full border border-[#25f4f4]/20"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <ShieldCheck size={20} />
                        <span className="text-sm font-bold">Secure Transaction Environment</span>
                    </motion.div>
                </div>

                <div className="flex flex-col xl:flex-row gap-8 items-start">
                    {/* Cart Items List */}
                    <div className="flex flex-col gap-6 w-full xl:w-2/3" style={{ perspective: 1000 }}>
                        {/* Item 1 */}
                        <motion.div
                            custom={0}
                            variants={cartItemVariant}
                            initial="hidden"
                            animate="visible"
                            whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(37,244,244,0.15)", transition: { duration: 0.3 } }}
                            className="group relative flex flex-col sm:flex-row items-stretch gap-6 rounded-xl bg-white dark:bg-[#1b2727] p-4 shadow-lg border border-slate-200 dark:border-[#283939] hover:border-[#25f4f4]/50 transition-colors"
                        >
                            <div className="w-full sm:w-48 aspect-video sm:aspect-square bg-slate-100 dark:bg-[#111818] rounded-lg overflow-hidden relative">
                                <img
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzkA03dfYiu8bAg1wdQWs9qajOLK_LTS9sQw5y4kwoWx14vVN_KySFHATwiv-PUN3VkGVrJxVY1SaSs1msN7DD1tU-anGywGNUTmmHcxkAv0Te2g_nFFIM7Eu0AS3K28RZLI1kNk6gkL85CU9QZ7hi3OQ9cEtlHFlnMrkfv4-w4_tq11zQLhnAhJ1YZz0oi-_1Id2DcEukxCjXpnzvuBKNKDEQG3uMwT5rHGfjw9uppcfjA4UqUeeItyQrE79JwZmMKN4QmrizoMkT"
                                    alt="Luxury gold watch with intricate mechanical details"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                                />
                                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-medium text-white border border-white/10">Only 2 left</div>
                            </div>
                            <div className="flex flex-1 flex-col justify-between py-1">
                                <div>
                                    <div className="flex justify-between items-start mb-1 gap-2">
                                        <h3 className="text-xl font-bold dark:text-white group-hover:text-[#25f4f4] transition-colors leading-tight">Limited Edition Chronograph</h3>
                                        <span className="text-lg font-bold dark:text-white whitespace-nowrap">₹3,750,000</span>
                                    </div>
                                    <p className="text-[#9cbaba] text-sm font-medium mb-4">Luxury Watches • Ref: 8992-X</p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <span className="px-2 py-1 bg-[#f5f8f8] dark:bg-[#111818] rounded text-xs text-slate-500 dark:text-[#9cbaba] border border-slate-200 dark:border-slate-700">Authenticity Verified</span>
                                        <span className="px-2 py-1 bg-[#f5f8f8] dark:bg-[#111818] rounded text-xs text-slate-500 dark:text-[#9cbaba] border border-slate-200 dark:border-slate-700">Insured Shipping</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-4 sm:mt-0">
                                    <div className="flex items-center gap-4 bg-[#f5f8f8] dark:bg-[#111818] rounded-lg p-1 border border-slate-200 dark:border-[#283939]">
                                        <button className="size-8 flex items-center justify-center rounded hover:bg-slate-200 dark:hover:bg-[#283939] text-slate-500 dark:text-[#9cbaba] transition-colors"><Minus size={16} /></button>
                                        <span className="text-sm font-bold dark:text-white w-4 text-center">1</span>
                                        <button className="size-8 flex items-center justify-center rounded hover:bg-slate-200 dark:hover:bg-[#283939] text-slate-500 dark:text-[#9cbaba] transition-colors"><Plus size={16} /></button>
                                    </div>
                                    <button className="flex items-center gap-1.5 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                                        <Trash2 size={18} /><span className="hidden sm:inline">Remove</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Item 2 */}
                        <motion.div
                            custom={1}
                            variants={cartItemVariant}
                            initial="hidden"
                            animate="visible"
                            whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(37,244,244,0.15)", transition: { duration: 0.3 } }}
                            className="group relative flex flex-col sm:flex-row items-stretch gap-6 rounded-xl bg-white dark:bg-[#1b2727] p-4 shadow-lg border border-slate-200 dark:border-[#283939] hover:border-[#25f4f4]/50 transition-colors"
                        >
                            <div className="w-full sm:w-48 aspect-video sm:aspect-square bg-slate-100 dark:bg-[#111818] rounded-lg overflow-hidden relative">
                                <img
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdrCNvInJExbJdmka2tM4DhYz--yKfYmbYC8_GOe5LHUESJggJ2moBpn7q50jpIs0jPxWQZPAkKuYfuXn6bSv_nEVjEBZo2PS-zq2HMX1c38OGIECdd-w6N1BXLgO1FslQJ221TnZaIGbqpowpazZYa4wQtGDGMK4utICLxievsfv45zP9rcZhQCHRT6jrUl2RKY1L0jhbDoSBrBX1rPRPTIfwoCrFEKaG0zuqjDU6I0bbS7koY6taJS0tNO6qk12z4cRN7FQ8G5Cn"
                                    alt="Abstract digital landscape representing virtual real estate"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                                />
                                <div className="absolute top-2 left-2 bg-[#25f4f4]/90 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-[#111818] shadow-sm">Trending Asset</div>
                            </div>
                            <div className="flex flex-1 flex-col justify-between py-1">
                                <div>
                                    <div className="flex justify-between items-start mb-1 gap-2">
                                        <h3 className="text-xl font-bold dark:text-white group-hover:text-[#25f4f4] transition-colors leading-tight">Virtual Estate Parcel #402</h3>
                                        <span className="text-lg font-bold dark:text-white whitespace-nowrap">₹1,041,666</span>
                                    </div>
                                    <p className="text-[#9cbaba] text-sm font-medium mb-4">Digital Assets • Prime District</p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <span className="px-2 py-1 bg-[#f5f8f8] dark:bg-[#111818] rounded text-xs text-slate-500 dark:text-[#9cbaba] border border-slate-200 dark:border-slate-700">NFT Certificate</span>
                                        <span className="px-2 py-1 bg-[#f5f8f8] dark:bg-[#111818] rounded text-xs text-slate-500 dark:text-[#9cbaba] border border-slate-200 dark:border-slate-700">Instant Transfer</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-4 sm:mt-0">
                                    <div className="flex items-center gap-4 bg-[#f5f8f8] dark:bg-[#111818] rounded-lg p-1 border border-slate-200 dark:border-[#283939]">
                                        <button className="size-8 flex items-center justify-center rounded hover:bg-slate-200 dark:hover:bg-[#283939] text-slate-500 dark:text-[#9cbaba] transition-colors"><Minus size={16} /></button>
                                        <span className="text-sm font-bold dark:text-white w-4 text-center">1</span>
                                        <button className="size-8 flex items-center justify-center rounded hover:bg-slate-200 dark:hover:bg-[#283939] text-slate-500 dark:text-[#9cbaba] transition-colors"><Plus size={16} /></button>
                                    </div>
                                    <button className="flex items-center gap-1.5 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                                        <Trash2 size={18} /><span className="hidden sm:inline">Remove</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Item 3 */}
                        <motion.div
                            custom={2}
                            variants={cartItemVariant}
                            initial="hidden"
                            animate="visible"
                            whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(37,244,244,0.15)", transition: { duration: 0.3 } }}
                            className="group relative flex flex-col sm:flex-row items-stretch gap-6 rounded-xl bg-white dark:bg-[#1b2727] p-4 shadow-lg border border-slate-200 dark:border-[#283939] hover:border-[#25f4f4]/50 transition-colors"
                        >
                            <div className="w-full sm:w-48 aspect-video sm:aspect-square bg-slate-100 dark:bg-[#111818] rounded-lg overflow-hidden relative">
                                <img
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKGM18HOdM3cHybfLslJcjxsEaQbMYR_VTZLkKbMXIk_qaos9G8bJOCfCo8goibPI_8diM-xal_Xi8U6NPb9MoreQYNGJz4l4T4wqhAsogOAPScHZjKzFjlHLrcamPaW-UvJ4Jk7zDKi6sMobm3eubmcc1L0Gtu3Kj_WGtdYSPUIjnumJx_jGkVnsDp_c1_bsSKcqV9rC6sq06SPVEq3DxXdmhVefarGqpQRUlR-vz_zRJcIe8xPXu6TUtOGczypQSuF5Vw99vkRAw"
                                    alt="High-tech secure hardware wallet with diamond accents"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                                />
                            </div>
                            <div className="flex flex-1 flex-col justify-between py-1">
                                <div>
                                    <div className="flex justify-between items-start mb-1 gap-2">
                                        <h3 className="text-xl font-bold dark:text-white group-hover:text-[#25f4f4] transition-colors leading-tight">Diamond Encrusted Ledger</h3>
                                        <span className="text-lg font-bold dark:text-white whitespace-nowrap">₹683,333</span>
                                    </div>
                                    <p className="text-[#9cbaba] text-sm font-medium mb-4">Hardware Wallets • Custom Order</p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <span className="px-2 py-1 bg-[#f5f8f8] dark:bg-[#111818] rounded text-xs text-slate-500 dark:text-[#9cbaba] border border-slate-200 dark:border-slate-700">Pre-Order</span>
                                        <span className="px-2 py-1 bg-[#f5f8f8] dark:bg-[#111818] rounded text-xs text-slate-500 dark:text-[#9cbaba] border border-slate-200 dark:border-slate-700">White Glove Delivery</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-4 sm:mt-0">
                                    <div className="flex items-center gap-4 bg-[#f5f8f8] dark:bg-[#111818] rounded-lg p-1 border border-slate-200 dark:border-[#283939]">
                                        <button className="size-8 flex items-center justify-center rounded hover:bg-slate-200 dark:hover:bg-[#283939] text-slate-500 dark:text-[#9cbaba] transition-colors"><Minus size={16} /></button>
                                        <span className="text-sm font-bold dark:text-white w-4 text-center">1</span>
                                        <button className="size-8 flex items-center justify-center rounded hover:bg-slate-200 dark:hover:bg-[#283939] text-slate-500 dark:text-[#9cbaba] transition-colors"><Plus size={16} /></button>
                                    </div>
                                    <button className="flex items-center gap-1.5 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                                        <Trash2 size={18} /><span className="hidden sm:inline">Remove</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <motion.div
                        className="w-full xl:w-1/3 flex flex-col gap-6 sticky top-24"
                        variants={sidebarVariant}
                        initial="hidden"
                        animate="visible"
                    >
                        <div className="bg-white dark:bg-[#1b2727] rounded-xl p-6 shadow-xl border border-slate-200 dark:border-[#283939] relative">
                            <h3 className="text-xl font-bold dark:text-white mb-6">Order Summary</h3>
                            <div className="space-y-4 mb-6 border-b border-slate-200 dark:border-[#283939] pb-6">
                                <div className="flex justify-between text-slate-600 dark:text-[#9cbaba]">
                                    <span>Subtotal</span>
                                    <span className="dark:text-white font-medium">₹5,475,000</span>
                                </div>
                                <div className="flex justify-between text-slate-600 dark:text-[#9cbaba]">
                                    <span>Processing Fees</span>
                                    <span className="dark:text-white font-medium">₹10,416</span>
                                </div>
                                <div className="flex justify-between text-slate-600 dark:text-[#9cbaba]">
                                    <span>Shipping Estimate</span>
                                    <span className="text-[#25f4f4] font-medium">Free</span>
                                </div>
                                <div className="flex justify-between text-slate-600 dark:text-[#9cbaba] pt-2">
                                    <span className="flex items-center gap-1.5">
                                        Estimated Tax
                                        <span title="Calculated based on your region">
                                            <HelpCircle size={14} className="cursor-help" />
                                        </span>
                                    </span>
                                    <span className="dark:text-white font-medium">₹273,750</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end mb-8">
                                <div>
                                    <span className="block text-sm text-slate-500 dark:text-[#9cbaba] mb-1">Total Due</span>
                                    <motion.span
                                        className="text-3xl font-black dark:text-white tracking-tight"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.6, delay: 0.6 }}
                                    >
                                        ₹5,759,166
                                    </motion.span>
                                </div>
                            </div>

                            <Link href="/mall/checkout" className="flex items-center justify-center w-full py-4 bg-[#25f4f4] hover:bg-[#25f4f4]/90 text-[#111818] font-bold text-lg rounded-xl shadow-[0_4px_14px_0_rgba(37,244,244,0.39)] transition-all hover:scale-[1.02] active:scale-[0.98] mb-4">
                                Proceed to Checkout
                            </Link>
                            <Link href="/mall" className="flex items-center justify-center w-full py-3.5 border border-slate-200 dark:border-[#283939] hover:border-[#25f4f4]/50 text-slate-700 dark:text-white hover:text-[#25f4f4] font-bold rounded-xl transition-colors">
                                Continue Shopping
                            </Link>
                        </div>

                        {/* Ecosystem Contribution Card */}
                        <motion.div
                            className="bg-gradient-to-br from-[#1b2727] to-[#283939] rounded-xl p-6 border border-[#25f4f4]/20 relative overflow-hidden group shadow-lg"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            whileHover={{ boxShadow: "0 0 30px rgba(37,244,244,0.15)" }}
                        >
                            <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#25f4f4]/20 rounded-full blur-3xl group-hover:bg-[#25f4f4]/30 transition-all duration-700"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-3 text-[#25f4f4]">
                                    <Leaf size={18} />
                                    <span className="text-xs font-bold uppercase tracking-wider">Ecosystem Contribution</span>
                                </div>
                                <p className="text-[#9cbaba] text-sm mb-4">
                                    By completing this purchase, you&apos;re contributing to the community pool.
                                </p>
                                <div className="flex items-end gap-2">
                                    <motion.span
                                        className="text-3xl font-bold text-white"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.6, delay: 1 }}
                                    >
                                        + 245
                                    </motion.span>
                                    <span className="text-sm font-medium text-[#25f4f4] mb-1.5">GOV Tokens</span>
                                </div>
                                <div className="mt-4 w-full bg-black/30 rounded-full h-1.5 overflow-hidden">
                                    <motion.div
                                        className="bg-[#25f4f4] h-full rounded-full shadow-[0_0_8px_rgba(37,244,244,0.6)]"
                                        initial={{ width: 0 }}
                                        animate={{ width: '75%' }}
                                        transition={{ duration: 1.5, delay: 1, ease: [0.16, 1, 0.3, 1] }}
                                    />
                                </div>
                                <p className="text-xs text-slate-400 dark:text-[#9cbaba] mt-2 text-right">75% to next tier reward</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
