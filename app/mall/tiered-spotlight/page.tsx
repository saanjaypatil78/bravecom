'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Gem, Search, ShoppingCart, ChevronRight,
    Wrench, Zap, Crown, Factory, TrendingUp, BadgeCheck,
    ArrowRight, TrendingDown, Plus
} from 'lucide-react';

export default function SovereignTieredSpotlight() {
    const [activeTier, setActiveTier] = useState<'low' | 'mid' | 'high'>('mid');

    return (
        <div className="min-h-screen w-full flex flex-col overflow-x-hidden bg-[#f8f8f5] dark:bg-[#181611] text-slate-900 dark:text-slate-100 font-sans antialiased">
            <div className="flex h-full grow flex-col">
                {/* Header */}
                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#393528] px-4 md:px-10 py-3 bg-[#181611]">
                    <div className="flex items-center gap-8">
                        <Link href="/mall" className="flex items-center gap-4 text-white hover:opacity-80 transition-opacity">
                            <div className="size-8 flex items-center justify-center text-[#f2b90d]">
                                <Gem size={32} />
                            </div>
                            <h2 className="text-white text-xl font-serif font-bold leading-tight tracking-tight">Sovereign Mall</h2>
                        </Link>
                        <div className="hidden lg:flex items-center gap-9">
                            <Link className="text-white hover:text-[#f2b90d] transition-colors text-sm font-medium leading-normal" href="/mall">Home</Link>
                            <Link className="text-white hover:text-[#f2b90d] transition-colors text-sm font-medium leading-normal" href="/mall/products">Shop</Link>
                            <Link className="text-[#f2b90d] hover:text-yellow-500 transition-colors text-sm font-medium leading-normal" href="/mall/tiered-spotlight">Deals</Link>
                            <Link className="text-white hover:text-[#f2b90d] transition-colors text-sm font-medium leading-normal" href="/dashboard">Investors</Link>
                            <Link className="text-white hover:text-[#f2b90d] transition-colors text-sm font-medium leading-normal" href="/dashboard/profile">Account</Link>
                        </div>
                    </div>
                    <div className="flex flex-1 justify-end gap-4 md:gap-8">
                        <label className="hidden md:flex flex-col min-w-40 h-10 max-w-64">
                            <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-[#393528] overflow-hidden">
                                <div className="text-[#bab29c] flex items-center justify-center pl-4 pr-2">
                                    <Search size={20} />
                                </div>
                                <input
                                    className="flex w-full min-w-0 flex-1 resize-none bg-transparent text-white focus:outline-none focus:ring-0 border-none placeholder:text-[#bab29c] px-2 text-base font-normal leading-normal"
                                    placeholder="Search luxury..."
                                />
                            </div>
                        </label>
                        <div className="flex gap-2">
                            <Link href="/mall/cart" className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f2b90d] hover:bg-yellow-500 transition-colors text-[#181611] text-sm font-bold leading-normal tracking-wide">
                                <span className="truncate flex items-center gap-2">
                                    <ShoppingCart size={20} />
                                    <span className="hidden sm:inline">Cart</span>
                                </span>
                            </Link>
                            <Link href="/login" className="hidden sm:flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#393528] hover:bg-[#4a4536] transition-colors text-white text-sm font-bold leading-normal tracking-wide">
                                <span className="truncate">Log In</span>
                            </Link>
                        </div>
                    </div>
                </header>

                <div className="px-4 md:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-5">
                    <div className="flex flex-col max-w-[1200px] flex-1">

                        {/* Hero Section */}
                        <div className="flex flex-col gap-6 py-6 md:py-10 lg:flex-row">
                            <div
                                className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl shadow-2xl border border-[#544e3b]/30 lg:h-auto lg:min-w-[400px] lg:w-1/2 relative overflow-hidden group min-h-[300px]"
                                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2080&auto=format&fit=crop")' }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-6 left-6">
                                    <span className="bg-[#f2b90d] text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">Sovereign Choice</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-6 lg:min-w-[400px] lg:gap-8 lg:justify-center lg:w-1/2 lg:pl-10">
                                <div className="flex flex-col gap-4 text-left">
                                    <h1 className="text-white font-serif text-4xl font-black leading-tight tracking-tight md:text-5xl lg:text-6xl">
                                        Sovereign Deals: Luxury Within Reach
                                    </h1>
                                    <h2 className="text-[#bab29c] text-lg font-light leading-relaxed max-w-xl">
                                        Experience high-quality craftsmanship across all tiers. From practical essentials to sovereign grandeur, discover exceptional value at unexpectedly low costs.
                                    </h2>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-[#f2b90d] hover:bg-yellow-500 transition-colors text-[#181611] text-base font-bold leading-normal tracking-wide shadow-lg shadow-[#f2b90d]/20">
                                        <span className="truncate">Explore Deals</span>
                                    </button>
                                    <button className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 border border-[#544e3b] hover:bg-[#27241b] transition-colors text-white text-base font-bold leading-normal tracking-wide">
                                        <span className="truncate">How it works</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Tier Filter */}
                        <div className="flex py-6 md:py-8 sticky top-0 z-30 bg-[#181611]/95 backdrop-blur-sm border-b border-[#393528] mb-8">
                            <div className="flex h-12 md:h-14 flex-1 items-center justify-center rounded-xl bg-[#27241b] p-1 md:p-1.5 border border-[#393528] max-w-3xl mx-auto shadow-lg relative">
                                <label className={`group flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 transition-all duration-300 relative z-10 ${activeTier === 'low' ? 'text-[#f2b90d]' : 'text-[#bab29c] hover:text-white'}`}>
                                    <span className="truncate font-medium text-xs sm:text-sm md:text-base flex items-center md:gap-2">
                                        <Wrench size={18} className="hidden sm:block" />
                                        <span className="sm:hidden">Practical</span>
                                        <span className="hidden sm:inline">Low Range (Practical)</span>
                                    </span>
                                    <input
                                        className="invisible w-0 absolute"
                                        name="tier_filter"
                                        type="radio"
                                        value="low"
                                        checked={activeTier === 'low'}
                                        onChange={() => setActiveTier('low')}
                                    />
                                </label>

                                <label className={`group flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 transition-all duration-300 relative z-10 ${activeTier === 'mid' ? 'text-[#f2b90d]' : 'text-[#bab29c] hover:text-white'}`}>
                                    <span className="truncate font-medium text-xs sm:text-sm md:text-base flex items-center md:gap-2">
                                        <Zap size={18} className="hidden sm:block" />
                                        <span className="sm:hidden">Performance</span>
                                        <span className="hidden sm:inline">Mid Range (Performance)</span>
                                    </span>
                                    <input
                                        className="invisible w-0 absolute"
                                        name="tier_filter"
                                        type="radio"
                                        value="mid"
                                        checked={activeTier === 'mid'}
                                        onChange={() => setActiveTier('mid')}
                                    />
                                </label>

                                <label className={`group flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 transition-all duration-300 relative z-10 ${activeTier === 'high' ? 'text-[#f2b90d]' : 'text-[#bab29c] hover:text-white'}`}>
                                    <span className="truncate font-medium text-xs sm:text-sm md:text-base flex items-center md:gap-2">
                                        <Crown size={18} className="hidden sm:block" />
                                        <span className="sm:hidden">Sovereign</span>
                                        <span className="hidden sm:inline">High Range (Sovereign)</span>
                                    </span>
                                    <input
                                        className="invisible w-0 absolute"
                                        name="tier_filter"
                                        type="radio"
                                        value="high"
                                        checked={activeTier === 'high'}
                                        onChange={() => setActiveTier('high')}
                                    />
                                </label>

                                {/* Animated active background indicator */}
                                <div
                                    className="absolute top-1 bottom-1 w-[calc(33.333%-4px)] bg-[#393528] rounded-lg shadow-sm transition-transform duration-300 ease-in-out z-0"
                                    style={{
                                        transform: activeTier === 'low' ? 'translateX(calc(-100% - 2px))' :
                                            activeTier === 'mid' ? 'translateX(0)' :
                                                'translateX(calc(100% + 2px))'
                                    }}
                                ></div>
                            </div>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 lg:mb-16">
                            <div className="flex gap-4 rounded-xl border border-[#544e3b] bg-[#27241b] p-6 flex-col hover:border-[#f2b90d]/50 transition-colors duration-300 group">
                                <div className="text-[#f2b90d] w-12 h-12 rounded-full bg-[#f2b90d]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Factory size={28} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h2 className="text-white text-lg font-serif font-bold leading-tight">Direct Sourcing</h2>
                                    <p className="text-[#bab29c] text-sm font-normal leading-relaxed">We cut out the middlemen to bring you factory-direct prices, ensuring luxury isn&apos;t lost in markup.</p>
                                </div>
                            </div>

                            <div className="flex gap-4 rounded-xl border border-[#544e3b] bg-[#27241b] p-6 flex-col hover:border-[#f2b90d]/50 transition-colors duration-300 group">
                                <div className="text-[#f2b90d] w-12 h-12 rounded-full bg-[#f2b90d]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <TrendingUp size={28} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h2 className="text-white text-lg font-serif font-bold leading-tight">Member ROI</h2>
                                    <p className="text-[#bab29c] text-sm font-normal leading-relaxed">Active investors receive exclusive ROI discounts on every purchase, turning spending into saving.</p>
                                </div>
                            </div>

                            <div className="flex gap-4 rounded-xl border border-[#544e3b] bg-[#27241b] p-6 flex-col hover:border-[#f2b90d]/50 transition-colors duration-300 group">
                                <div className="text-[#f2b90d] w-12 h-12 rounded-full bg-[#f2b90d]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <BadgeCheck size={28} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h2 className="text-white text-lg font-serif font-bold leading-tight">Quality Assured</h2>
                                    <p className="text-[#bab29c] text-sm font-normal leading-relaxed">Every item passes rigorous quality checks. Even our practical range feels like a premium experience.</p>
                                </div>
                            </div>
                        </div>

                        {/* Value Spotlight Section */}
                        <div className="flex flex-col gap-8 pb-10">
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between px-2 gap-4">
                                <div>
                                    <h1 className="text-white font-serif text-3xl md:text-4xl font-bold leading-tight mb-2">Value Spotlight</h1>
                                    <p className="text-[#bab29c]">Uncompromising quality at varied price points.</p>
                                </div>
                                <Link className="text-[#f2b90d] hover:text-white transition-colors text-sm font-bold flex items-center gap-1 group w-max" href="/mall/products">
                                    View all products <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Card 1: Low Range */}
                                <div className={`group flex flex-col gap-4 rounded-xl bg-[#27241b] border ${activeTier === 'low' ? 'border-[#f2b90d] shadow-[0_0_15px_rgba(242,185,13,0.15)]' : 'border-[#544e3b] hover:border-[#f2b90d]/50'} p-4 transition-all duration-300`}>
                                    <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden bg-[#1a1a1a]">
                                        <div className="absolute top-3 left-3 z-10 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold tracking-widest text-white uppercase border border-white/10">Practical</div>
                                        <div
                                            className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop")' }}
                                        ></div>
                                        <button className="absolute bottom-3 right-3 bg-[#f2b90d] text-black w-10 h-10 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110">
                                            <Plus size={24} />
                                        </button>
                                    </div>
                                    <div className="flex flex-col flex-1 justify-between">
                                        <div>
                                            <h3 className="text-white text-lg font-serif font-bold line-clamp-1 mb-1" title="Nova Chrono Basic">Nova Chrono Basic</h3>
                                            <p className="text-[#bab29c] text-sm mb-3 line-clamp-2">Reliable movement, synthetic strap</p>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-[#393528] pt-3 mt-auto">
                                            <div className="flex flex-col">
                                                <span className="text-[#bab29c] text-xs line-through">₹ 2,499</span>
                                                <span className="text-[#f2b90d] text-xl font-serif font-bold">₹ 899</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-[10px] text-green-400 bg-green-400/10 px-2 py-1.5 rounded">
                                                <TrendingDown size={12} />
                                                <span className="font-bold">-64% ROI</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Card 2: Mid Range */}
                                <div className={`group flex flex-col gap-4 rounded-xl bg-[#27241b] border ${activeTier === 'mid' ? 'border-[#f2b90d] shadow-[0_0_15px_rgba(242,185,13,0.15)]' : 'border-[#544e3b] hover:border-[#f2b90d]/50'} p-4 transition-all duration-300`}>
                                    <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden bg-[#1a1a1a]">
                                        <div className="absolute top-3 left-3 z-10 bg-[#393528]/80 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold tracking-widest text-[#f2b90d] uppercase border border-[#f2b90d]/20">Performance</div>
                                        <div
                                            className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop")' }}
                                        ></div>
                                        <button className="absolute bottom-3 right-3 bg-[#f2b90d] text-black w-10 h-10 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110">
                                            <Plus size={24} />
                                        </button>
                                    </div>
                                    <div className="flex flex-col flex-1 justify-between">
                                        <div>
                                            <h3 className="text-white text-lg font-serif font-bold line-clamp-1 mb-1" title="Sonic Pro ANC">Sonic Pro ANC</h3>
                                            <p className="text-[#bab29c] text-sm mb-3 line-clamp-2">Active noise cancellation, 40h battery</p>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-[#393528] pt-3 mt-auto">
                                            <div className="flex flex-col">
                                                <span className="text-[#bab29c] text-xs line-through">₹ 12,999</span>
                                                <span className="text-[#f2b90d] text-xl font-serif font-bold">₹ 4,499</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-[10px] text-green-400 bg-green-400/10 px-2 py-1.5 rounded">
                                                <TrendingDown size={12} />
                                                <span className="font-bold">-65% ROI</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Card 3: High Range */}
                                <div className={`group flex flex-col gap-4 rounded-xl bg-[#27241b] border p-4 transition-all duration-300 relative overflow-hidden ${activeTier === 'high' ? 'border-[#f2b90d] shadow-[0_0_20px_rgba(242,185,13,0.3)]' : 'border-[#f2b90d]/60 shadow-[0_0_10px_rgba(242,185,13,0.1)] hover:shadow-[0_0_15px_rgba(242,185,13,0.2)]'}`}>
                                    <div className="absolute -right-12 top-6 bg-[#f2b90d] text-black text-[10px] font-bold px-12 py-1.5 rotate-45 z-20 shadow-md flex items-center justify-center gap-1">
                                        <Crown size={10} /> BEST VALUE
                                    </div>
                                    <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden bg-[#1a1a1a]">
                                        <div className="absolute top-3 left-3 z-10 bg-[#f2b90d] text-black px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase shadow-md flex items-center gap-1">
                                            <Gem size={10} /> Sovereign
                                        </div>
                                        <div
                                            className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=2000&auto=format&fit=crop")' }}
                                        ></div>
                                        <button className="absolute bottom-3 right-3 bg-[#f2b90d] text-black w-10 h-10 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110">
                                            <Plus size={24} />
                                        </button>
                                    </div>
                                    <div className="flex flex-col flex-1 justify-between">
                                        <div>
                                            <h3 className="text-white text-lg font-serif font-bold line-clamp-1 mb-1" title="Royal Azure Heels">Royal Azure Heels</h3>
                                            <p className="text-[#bab29c] text-sm mb-3 line-clamp-2">Italian leather, hand-stitched sole</p>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-[#393528] pt-3 mt-auto">
                                            <div className="flex flex-col">
                                                <span className="text-[#bab29c] text-xs line-through">₹ 45,000</span>
                                                <span className="text-[#f2b90d] text-xl font-serif font-bold">₹ 12,999</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-[10px] text-green-400 bg-green-400/10 px-2 py-1.5 rounded">
                                                <TrendingDown size={12} />
                                                <span className="font-bold">-71% ROI</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Card 4: High Range (Alternative) */}
                                <div className={`group flex flex-col gap-4 rounded-xl bg-[#27241b] border p-4 transition-all duration-300 relative ${activeTier === 'high' ? 'border-[#544e3b] shadow-[0_0_15px_rgba(242,185,13,0.05)]' : 'border-[#544e3b] hover:border-[#f2b90d]/50'}`}>
                                    <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden bg-[#1a1a1a]">
                                        <div className="absolute top-3 left-3 z-10 bg-[#f2b90d]/90 backdrop-blur-sm text-black px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase shadow-md flex items-center gap-1">
                                            <Gem size={10} /> Sovereign
                                        </div>
                                        <div
                                            className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2069&auto=format&fit=crop")' }}
                                        ></div>
                                        <button className="absolute bottom-3 right-3 bg-[#f2b90d] text-black w-10 h-10 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110">
                                            <Plus size={24} />
                                        </button>
                                    </div>
                                    <div className="flex flex-col flex-1 justify-between">
                                        <div>
                                            <h3 className="text-white text-lg font-serif font-bold line-clamp-1 mb-1" title="Estate Duffel">Estate Duffel</h3>
                                            <p className="text-[#bab29c] text-sm mb-3 line-clamp-2">Full-grain leather, brass hardware</p>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-[#393528] pt-3 mt-auto">
                                            <div className="flex flex-col">
                                                <span className="text-[#bab29c] text-xs line-through">₹ 28,500</span>
                                                <span className="text-[#f2b90d] text-xl font-serif font-bold">₹ 9,999</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-[10px] text-green-400 bg-green-400/10 px-2 py-1.5 rounded">
                                                <TrendingDown size={12} />
                                                <span className="font-bold">-65% ROI</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Member Banner */}
                        <div className="rounded-xl overflow-hidden relative mt-8 mb-16 shadow-2xl group border border-[#544e3b]/30 hover:border-[#f2b90d]/30 transition-colors">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#f2b90d] to-[#f2b90d]/70 mix-blend-multiply z-10 transition-opacity duration-500 group-hover:opacity-90"></div>
                            <div className="absolute inset-0 bg-black/40 z-[5]"></div>
                            <div
                                className="absolute inset-0 bg-cover bg-center opacity-40 transition-transform duration-700 group-hover:scale-105"
                                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1620241608701-94efd38d9fde?q=80&w=2068&auto=format&fit=crop")' }}
                            ></div>
                            <div className="relative z-20 flex flex-col md:flex-row items-center justify-between p-8 md:p-12 gap-8">
                                <div className="flex flex-col gap-3 max-w-xl text-center md:text-left">
                                    <h2 className="text-[#181611] font-serif text-3xl md:text-4xl font-black">Become a Sovereign Investor</h2>
                                    <p className="text-[#181611] font-medium text-lg leading-relaxed bg-white/20 backdrop-blur-sm p-3 rounded-lg border border-[#181611]/10 shadow-sm inline-block">
                                        Unlock deeper discounts and ROI tracking on your dashboard. Investments start at <span className="font-bold text-xl">₹500</span>.
                                    </p>
                                </div>
                                <Link
                                    href="/onboarding"
                                    className="bg-[#181611] text-[#f2b90d] hover:text-white px-8 py-4 rounded-xl font-bold shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex items-center gap-3 whitespace-nowrap text-lg group/btn border border-[#181611] hover:border-[#f2b90d]/50"
                                >
                                    <span>Join Now</span>
                                    <ChevronRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Simple Footer */}
                <footer className="border-t border-[#393528] py-8 text-center text-[#bab29c] text-sm bg-[#181611] mt-auto">
                    <div className="flex justify-center mb-4 text-[#544e3b]">
                        <Gem size={24} />
                    </div>
                    <p className="font-serif tracking-wide">© {new Date().getFullYear()} Sovereign Mall. Luxury Redefined.</p>
                </footer>
            </div>
        </div>
    );
}
