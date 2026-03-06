'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import MallHeaderActions from './components/MallHeaderActions';
import AddToCartButton from './components/AddToCartButton';
import { FEATURED_PRODUCTS, ALL_PRODUCTS } from '@/lib/data/mall-products-data';
import {
    AnimatedProductCard,
    AnimatedStatCard,
    AnimatedBanner,
    AnimatedTitle,
} from './components/AnimatedMallComponents';
import { FloatingParticles } from '../components/CinematicEffects';

// Map centralized products to the dashboard card format
const dashboardProducts = [...FEATURED_PRODUCTS.slice(0, 4), ...ALL_PRODUCTS.filter(p => !p.badge).slice(0, 4)].slice(0, 8).map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    quantity: 1,
    image: p.images[0],
    variant: `${p.category} • ${p.seller}`,
    badge: p.badge
}));

export default function MallDashboard() {
    return (
        <div className="bg-[#f8f5f7] dark:bg-[#22101c] text-slate-900 dark:text-slate-100 font-display overflow-x-hidden min-h-screen">
            <div className="relative flex h-screen w-full flex-col overflow-hidden">
                {/* Prismatic Glitch Overlay Background */}
                <div className="absolute inset-0 pointer-events-none z-0 bg-[linear-gradient(45deg,rgba(244,37,175,0.05)_0%,rgba(34,16,28,0)_50%,rgba(244,37,175,0.05)_100%)]"></div>
                <FloatingParticles count={15} color="#f425af" />
                <div className="layout-container flex h-full grow flex-col z-10 w-full">
                    {/* Header / Top Nav */}
                    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 px-6 lg:px-10 py-4 bg-[#f8f5f7]/95 dark:bg-[#22101c]/95 backdrop-blur-sm sticky top-0 z-50">
                        <div className="flex items-center gap-8">
                            <Link href="/mall" className="flex items-center gap-3 text-slate-900 dark:text-white">
                                <div className="size-8 flex items-center justify-center text-[#f425af]">
                                    <span className="material-symbols-outlined text-3xl">diamond</span>
                                </div>
                                <h2 className="text-xl font-bold leading-tight tracking-tight uppercase">Sovereign Mall</h2>
                            </Link>
                            {/* Search Bar */}
                            <label className="hidden md:flex flex-col min-w-40 h-10 w-96">
                                <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-slate-100 dark:bg-[#2d1625] border border-slate-200 dark:border-slate-700 focus-within:border-[#f425af] focus-within:ring-1 focus-within:ring-[#f425af] transition-all">
                                    <div className="text-slate-400 flex items-center justify-center pl-3">
                                        <span className="material-symbols-outlined">search</span>
                                    </div>
                                    <input
                                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden bg-transparent text-slate-900 dark:text-white focus:outline-0 focus:ring-0 border-none h-full placeholder:text-slate-400 px-3 text-sm font-normal"
                                        placeholder="Search collections, drops, items..."
                                        defaultValue=""
                                    />
                                </div>
                            </label>
                        </div>
                        <div className="flex items-center gap-4 lg:gap-8">
                            <div className="hidden lg:flex items-center gap-6">
                                <Link href="/mall/categories" className="text-slate-600 dark:text-slate-300 hover:text-[#f425af] dark:hover:text-[#f425af] transition-colors text-sm font-medium leading-normal">
                                    Marketplace
                                </Link>
                                <Link href="/mall/cart" className="text-slate-600 dark:text-slate-300 hover:text-[#f425af] dark:hover:text-[#f425af] transition-colors text-sm font-medium leading-normal">
                                    My Vault
                                </Link>
                                <Link href="/mall/cart" className="text-slate-600 dark:text-slate-300 hover:text-[#f425af] dark:hover:text-[#f425af] transition-colors text-sm font-medium leading-normal">
                                    Wallet
                                </Link>
                            </div>
                            <MallHeaderActions theme="fuchsia" />
                        </div>
                    </header>

                    {/* Main Content Area */}
                    <div className="flex flex-1 overflow-hidden">
                        {/* Sidebar */}
                        <aside className="hidden xl:flex w-64 flex-col border-r border-slate-200 dark:border-slate-800 bg-[#f8f5f7] dark:bg-[#22101c] p-6 gap-6">
                            <div className="flex flex-col gap-2">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Dashboard</h3>
                                <Link href="/mall" className="flex items-center gap-3 p-3 rounded-lg bg-[#f425af]/10 text-[#f425af] font-medium">
                                    <span className="material-symbols-outlined">dashboard</span>
                                    Overview
                                </Link>
                                <Link href="/mall/categories" className="flex items-center gap-3 p-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#2d1625] transition-colors">
                                    <span className="material-symbols-outlined">shopping_bag</span>
                                    Orders
                                </Link>
                                <Link href="/mall/products" className="flex items-center gap-3 p-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#2d1625] transition-colors">
                                    <span className="material-symbols-outlined">favorite</span>
                                    Wishlist
                                </Link>
                            </div>
                            <div className="mt-auto">
                                <motion.div
                                    className="p-4 rounded-xl bg-gradient-to-br from-[#2d1625] to-black border border-slate-700 relative overflow-hidden group"
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity transform group-hover:scale-110 duration-500">
                                        <span className="material-symbols-outlined text-6xl text-white">bolt</span>
                                    </div>
                                    <p className="text-xs text-slate-400 mb-1">Status</p>
                                    <h4 className="text-white font-bold text-lg flex items-center gap-2">
                                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
                                        Sovereign
                                    </h4>
                                    <div className="mt-3 pt-3 border-t border-slate-700">
                                        <p className="text-xs text-slate-400">
                                            Next Tier: <span className="text-[#f425af]">Imperial</span>
                                        </p>
                                        <div className="w-full h-1 bg-slate-700 rounded-full mt-1">
                                            <motion.div
                                                className="h-full bg-[#f425af] rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: '75%' }}
                                                transition={{ duration: 1.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </aside>

                        {/* Scrollable Content */}
                        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
                            <div className="max-w-[1200px] mx-auto flex flex-col gap-8">
                                {/* Top Stats Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {/* Wallet Balance */}
                                    <AnimatedStatCard index={0} className="flex flex-col justify-between p-6 rounded-xl bg-white dark:bg-[#2d1625] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-[#f425af]/50 transition-colors">
                                        <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                                            <span className="material-symbols-outlined text-8xl">account_balance_wallet</span>
                                        </div>
                                        <div>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Wallet Pay Balance</p>
                                            <h3 className="text-slate-900 dark:text-white text-4xl font-bold mt-2 tracking-tight">₹ 1,24,500</h3>
                                        </div>
                                        <div className="flex items-center gap-2 mt-4 text-green-500 text-sm font-medium">
                                            <span className="material-symbols-outlined text-lg">trending_up</span>
                                            <span>+12.5% from ROI</span>
                                        </div>
                                    </AnimatedStatCard>
                                    {/* User Status Mobile/Tablet */}
                                    <AnimatedStatCard index={1} className="xl:hidden flex flex-col justify-between p-6 rounded-xl bg-white dark:bg-[#2d1625] border border-slate-200 dark:border-slate-800 shadow-sm">
                                        <div>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Member Status</p>
                                            <div className="flex items-center gap-3 mt-2">
                                                <h3 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">Sovereign</h3>
                                                <span className="px-2 py-1 rounded text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20 uppercase">
                                                    Active
                                                </span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-4 overflow-hidden">
                                            <motion.div
                                                className="bg-[#f425af] h-full rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: '75%' }}
                                                transition={{ duration: 1.5, delay: 0.5 }}
                                            />
                                        </div>
                                    </AnimatedStatCard>
                                    {/* Promo / Action */}
                                    <AnimatedBanner className="lg:col-span-1 md:col-span-2 xl:col-span-2 flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-[#f425af] to-purple-600 text-white shadow-lg relative overflow-hidden">
                                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                                        <div className="relative z-10 max-w-md">
                                            <h3 className="text-2xl font-bold mb-1">New &quot;Glitch&quot; Collection</h3>
                                            <p className="text-white/80 text-sm mb-4">Limited edition streetwear drops available for Sovereign members only.</p>
                                            <Link href="/mall/categories" className="inline-block bg-white text-[#f425af] px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-100 transition-colors shadow-lg">
                                                View Drop
                                            </Link>
                                        </div>
                                        <div className="hidden sm:block relative z-10">
                                            <div className="w-24 h-24 rounded-full border-4 border-white/20 flex items-center justify-center backdrop-blur-sm">
                                                <span className="material-symbols-outlined text-5xl">apparel</span>
                                            </div>
                                        </div>
                                    </AnimatedBanner>
                                </div>

                                {/* Range Selector Tabs */}
                                <div className="flex flex-col gap-6">
                                    <div className="flex items-center justify-between">
                                        <AnimatedTitle className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                                            Exclusive Collections
                                        </AnimatedTitle>
                                        <Link href="/mall/categories" className="text-sm font-medium text-[#f425af] hover:text-[#f425af]/80 flex items-center gap-1">
                                            View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                        </Link>
                                    </div>
                                    <div className="border-b border-slate-200 dark:border-slate-800">
                                        <nav aria-label="Tabs" className="flex gap-8 -mb-px overflow-x-auto">
                                            <button className="shrink-0 border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300">
                                                Low Range (Entry)
                                            </button>
                                            <button aria-current="page" className="shrink-0 border-b-2 border-[#f425af] px-1 pb-4 text-sm font-bold text-[#f425af]">
                                                Mid Range (Core)
                                            </button>
                                            <button className="shrink-0 border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300">
                                                High Range (Elite)
                                            </button>
                                        </nav>
                                    </div>
                                </div>

                                {/* Product Grid — 3D animated cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" style={{ perspective: 1200 }}>
                                    {dashboardProducts.map((product, idx) => (
                                        <AnimatedProductCard key={product.id} index={idx} className="group relative bg-white dark:bg-[#2d1625] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-[#f425af] transition-all duration-300 flex flex-col">
                                            <Link href={`/mall/product/${product.id}`} className="relative aspect-[4/5] overflow-hidden bg-slate-100 dark:bg-black block">
                                                {product.badge && (
                                                    <div className="absolute top-3 left-3 z-10">
                                                        <span className={`px-2 py-1 backdrop-blur-md text-white text-xs font-bold uppercase rounded border border-white/10 ${product.badge.color}`}>{product.badge.text}</span>
                                                    </div>
                                                )}
                                                <div className="absolute top-3 right-3 z-10">
                                                    <button className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-colors">
                                                        <span className="material-symbols-outlined text-sm">favorite</span>
                                                    </button>
                                                </div>
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    alt={product.name}
                                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                                                    src={product.image}
                                                />
                                                <div className="absolute inset-0 bg-[#f425af]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay"></div>
                                            </Link>
                                            <div className="p-4 flex flex-col flex-grow">
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-[#f425af] transition-colors">{product.name}</h3>
                                                <p className="text-slate-500 text-xs mb-3">{product.variant}</p>
                                                <div className="mt-auto flex items-center justify-between">
                                                    <p className="text-xl font-bold text-slate-900 dark:text-white">₹ {product.price.toLocaleString('en-IN')}</p>
                                                    <AddToCartButton product={product} />
                                                </div>
                                            </div>
                                        </AnimatedProductCard>
                                    ))}
                                </div>

                                {/* Special Offer / Banner */}
                                <AnimatedBanner className="relative rounded-2xl overflow-hidden mt-6 group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10"></div>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        alt="Model wearing futuristic fashion in neon lighting"
                                        className="w-full h-48 md:h-64 object-cover object-center group-hover:scale-105 transition-transform duration-700"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCY9HcNGKfrYdhwMz44dox2Xu-MxniwCBDwL3TqQfWY0YF_nXvL7IJonEMzAKpu6k2X0QiwTjaEHHTMMYdcuvqHUOGfQ5Em7iJJJQmEjh4WMNU2l0HWJTlVX3ZqfyWCk9BlIqIAU8xrF-2z37oW_-NeGAJ-7npOv0NO8KHSkMqmrBXPgKE2hg-gTQRanms3Q4YEUw5dZVHcS1Sc9J4Io80Aj-pdboHr3_DX7h6Fu5SsIxnsGyFrCo0_tQMsEq4StofOcgiIahkV-hIx"
                                    />
                                    <div className="absolute inset-0 z-20 flex flex-col justify-center p-8 md:p-12">
                                        <span className="inline-block px-3 py-1 bg-[#f425af] text-white text-xs font-bold uppercase rounded w-fit mb-3">Coming Soon</span>
                                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 max-w-xl">The Prism Drop</h2>
                                        <p className="text-slate-300 text-sm md:text-base max-w-md mb-6">
                                            Unlock exclusive access to the upcoming holographic streetwear line. Available to Sovereign members first.
                                        </p>
                                        <button className="w-fit bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-[#f425af] hover:text-white transition-colors flex items-center gap-2">
                                            Set Reminder <span className="material-symbols-outlined text-lg">alarm</span>
                                        </button>
                                    </div>
                                </AnimatedBanner>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
}
