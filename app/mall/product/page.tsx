'use client';

import React from 'react';
import Link from 'next/link';
import {
    Search, ShoppingBag, Diamond, Star, StarHalf,
    MemoryStick, Gauge, HardDrive, Shield,
    TrendingUp, Network, PiggyBank, ArrowUpCircle,
    ChevronLeft, ChevronRight, Plus, Lock
} from 'lucide-react';

export default function SovereignMallProductDetail() {
    return (
        <div className="bg-[#f6f6f8] dark:bg-[#101622] text-[#111318] dark:text-[#f6f6f8] antialiased min-h-screen flex flex-col font-sans transition-colors duration-300">
            {/* Header Section */}
            <header className="sticky top-0 z-50 bg-[#ffffff] dark:bg-[#1a2332] border-b border-[#f0f2f4] dark:border-[#2d3748] w-full transition-colors duration-300">
                <div className="px-6 md:px-10 py-3 max-w-[1440px] mx-auto flex items-center justify-between whitespace-nowrap">
                    <div className="flex items-center gap-8">
                        <Link href="/mall" className="flex items-center gap-4 text-[#111318] dark:text-white hover:opacity-80 transition-opacity">
                            <div className="size-8 text-[#1152d4] flex items-center justify-center">
                                <Diamond size={32} />
                            </div>
                            <h2 className="text-xl font-bold leading-tight tracking-[-0.015em]">Sovereign Mall</h2>
                        </Link>

                        <nav className="hidden md:flex items-center gap-9">
                            <Link href="/mall" className="text-sm font-medium hover:text-[#1152d4] transition-colors">Shop</Link>
                            <Link href="/dashboard" className="text-sm font-medium hover:text-[#1152d4] transition-colors">Invest</Link>
                            <Link href="/mall/categories" className="text-sm font-medium hover:text-[#1152d4] transition-colors">Lifestyle</Link>
                            <Link href="/dashboard/portfolio" className="text-sm font-medium hover:text-[#1152d4] transition-colors">My Portfolio</Link>
                            <Link href="/support" className="text-sm font-medium hover:text-[#1152d4] transition-colors">Support</Link>
                        </nav>
                    </div>

                    <div className="flex flex-1 justify-end gap-6 items-center">
                        {/* Search Bar */}
                        <label className="hidden lg:flex flex-col min-w-40 h-10 max-w-64 relative">
                            <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-[#f0f2f4] dark:bg-[#2d3748] focus-within:ring-2 focus-within:ring-[#1152d4] transition-all">
                                <div className="text-[#616f89] dark:text-[#a0aec0] flex border-none items-center justify-center pl-4 rounded-l-lg border-r-0">
                                    <Search size={20} />
                                </div>
                                <input
                                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111318] dark:text-white focus:outline-0 focus:ring-0 border-none bg-transparent focus:border-none h-full placeholder:text-[#616f89] dark:placeholder:text-[#a0aec0] px-4 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal"
                                    placeholder="Search assets..."
                                />
                            </div>
                        </label>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Link href="/login" className="hidden sm:flex h-10 px-4 items-center justify-center rounded-lg bg-[#ffffff] dark:bg-[#1a2332] border border-[#dbdfe6] dark:border-[#4a5568] hover:bg-gray-50 dark:hover:bg-[#2d3748] text-sm font-bold tracking-[0.015em] transition-colors">
                                <span className="mr-2">Sign In</span>
                            </Link>
                            <Link href="/mall/cart" className="flex h-10 w-10 sm:w-auto sm:px-4 items-center justify-center rounded-lg bg-[#1152d4] text-white hover:bg-[#0a3a9b] text-sm font-bold tracking-[0.015em] transition-colors shadow-lg shadow-[#1152d4]/20">
                                <ShoppingBag className="sm:mr-2" size={18} />
                                <span className="hidden sm:inline">Cart (2)</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-10 py-6 md:py-8">
                {/* Breadcrumbs */}
                <div className="flex flex-wrap gap-2 mb-6 text-sm">
                    <Link href="/mall" className="text-[#616f89] dark:text-[#a0aec0] hover:text-[#1152d4] transition-colors font-medium">Home</Link>
                    <span className="text-[#616f89] dark:text-[#a0aec0] font-medium">/</span>
                    <Link href="/mall/categories/electronics" className="text-[#616f89] dark:text-[#a0aec0] hover:text-[#1152d4] transition-colors font-medium">Luxury Electronics</Link>
                    <span className="text-[#616f89] dark:text-[#a0aec0] font-medium">/</span>
                    <span className="font-medium">Quantum Series X</span>
                </div>

                {/* Main Product Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* Left Column: Gallery & Details */}
                    <div className="lg:col-span-7 xl:col-span-8 space-y-8">
                        {/* Product Title & Rating Header */}
                        <div className="flex flex-col gap-4">
                            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight">Quantum Series X Workstation</h1>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1 text-[#1152d4]">
                                    <Star size={18} fill="currentColor" />
                                    <Star size={18} fill="currentColor" />
                                    <Star size={18} fill="currentColor" />
                                    <Star size={18} fill="currentColor" />
                                    <StarHalf size={18} fill="currentColor" />
                                </div>
                                <span className="font-bold text-sm">4.9</span>
                                <span className="text-[#616f89] dark:text-[#a0aec0] text-sm border-l border-gray-300 dark:border-gray-600 pl-4">128 Verified Reviews</span>
                                <span className="hidden sm:inline text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">In Stock</span>
                            </div>
                        </div>

                        {/* Gallery Grid */}
                        <div className="w-full gap-2 overflow-hidden bg-white dark:bg-[#1a2332] aspect-[4/3] md:aspect-[16/9] rounded-2xl grid grid-cols-1 md:grid-cols-3 md:grid-rows-2">
                            <div className="w-full h-full bg-gray-100 dark:bg-gray-800 md:col-span-2 md:row-span-2 relative group overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=2642&auto=format&fit=crop"
                                    alt="Quantum Series X Workstation Front View"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <div className="hidden md:block w-full h-full bg-gray-100 dark:bg-gray-800 relative group overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1587202372634-32705e3bf49c?q=80&w=2681&auto=format&fit=crop"
                                    alt="Workstation Detail Side View"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <div className="hidden md:block w-full h-full bg-gray-100 dark:bg-gray-800 relative group overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=2626&auto=format&fit=crop"
                                    alt="Workstation Ports and Connectivity"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                        </div>

                        {/* Product Description Tabs */}
                        <div>
                            <div className="border-b border-gray-200 dark:border-gray-700">
                                <nav aria-label="Tabs" className="-mb-px flex space-x-8 overflow-x-auto hide-scrollbar">
                                    <button className="border-[#1152d4] text-[#1152d4] whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm">Specifications</button>
                                    <button className="border-transparent text-[#616f89] dark:text-[#a0aec0] hover:text-[#111318] dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors">Investment Tier</button>
                                    <button className="border-transparent text-[#616f89] dark:text-[#a0aec0] hover:text-[#111318] dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors">Warranty & Support</button>
                                </nav>
                            </div>

                            <div className="prose dark:prose-invert max-w-none text-[#616f89] dark:text-[#a0aec0] leading-relaxed mt-6">
                                <p>
                                    The Quantum Series X is not merely a workstation; it is an asset. Engineered for high-frequency trading and heavy computational rendering, this machine features the latest Sovereign Chipset architecture. Owning this unit qualifies you for the Tier-4 Investor Circle benefits.
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-[#ffffff] dark:bg-[#1a2332] border border-gray-100 dark:border-gray-700 shadow-sm">
                                        <MemoryStick className="text-[#1152d4]" size={24} />
                                        <span className="font-medium text-[#111318] dark:text-white">128-Core Processor</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-[#ffffff] dark:bg-[#1a2332] border border-gray-100 dark:border-gray-700 shadow-sm">
                                        <Gauge className="text-[#1152d4]" size={24} />
                                        <span className="font-medium text-[#111318] dark:text-white">256GB DDR5 RAM</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-[#ffffff] dark:bg-[#1a2332] border border-gray-100 dark:border-gray-700 shadow-sm">
                                        <HardDrive className="text-[#1152d4]" size={24} />
                                        <span className="font-medium text-[#111318] dark:text-white">8TB NVMe SSD Gen5</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-[#ffffff] dark:bg-[#1a2332] border border-gray-100 dark:border-gray-700 shadow-sm">
                                        <Shield className="text-[#1152d4]" size={24} />
                                        <span className="font-medium text-[#111318] dark:text-white">Biometric Vault Security</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Purchase & Economic Impact */}
                    <div className="lg:col-span-5 xl:col-span-4 space-y-6">

                        {/* Purchase Card */}
                        <div className="bg-[#ffffff] dark:bg-[#1a2332] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8 sticky top-24">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <p className="text-[#616f89] dark:text-[#a0aec0] text-sm font-medium mb-1">Current Market Price</p>
                                    <h2 className="text-3xl font-bold text-[#111318] dark:text-white">₹51,111</h2>
                                    <p className="text-green-600 dark:text-green-400 text-sm font-semibold mt-1 flex items-center gap-1">
                                        <TrendingUp size={16} />
                                        +4.2% since last month
                                    </p>
                                </div>
                                <div className="bg-[#1152d4]/10 dark:bg-[#1152d4]/20 text-[#1152d4] p-2 rounded-lg">
                                    <Diamond size={24} />
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <label className="block text-xs font-semibold text-[#616f89] dark:text-[#a0aec0] uppercase mb-1.5">Configuration</label>
                                        <select className="w-full rounded-lg border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-[#2d3748] text-[#111318] dark:text-white text-sm focus:border-[#1152d4] focus:ring-[#1152d4] p-3 outline-none">
                                            <option>Ultimate (128-Core)</option>
                                            <option>Pro (64-Core)</option>
                                            <option>Base (32-Core)</option>
                                        </select>
                                    </div>
                                    <div className="w-24">
                                        <label className="block text-xs font-semibold text-[#616f89] dark:text-[#a0aec0] uppercase mb-1.5">Qty</label>
                                        <input
                                            className="w-full rounded-lg border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-[#2d3748] text-[#111318] dark:text-white text-sm focus:border-[#1152d4] focus:ring-[#1152d4] p-3 outline-none"
                                            min="1"
                                            type="number"
                                            defaultValue="1"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button className="w-full py-3.5 bg-[#1152d4] hover:bg-[#0a3a9b] text-white rounded-xl font-bold text-base shadow-lg shadow-[#1152d4]/25 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2">
                                        <span>Add to Cart</span>
                                        <ShoppingBag size={20} />
                                    </button>
                                    <button className="w-full py-3.5 bg-white dark:bg-[#1a2332] border border-gray-200 dark:border-gray-600 hover:border-[#1152d4]/50 dark:hover:border-[#1152d4]/50 text-[#111318] dark:text-white hover:text-[#1152d4] dark:hover:text-[#1152d4] rounded-xl font-bold text-base transition-colors">
                                        Buy Now & Invest
                                    </button>
                                </div>
                            </div>

                            {/* Economic Impact Widget */}
                            <div className="bg-[#f8fafc] dark:bg-[#17202e] rounded-xl border border-blue-100 dark:border-blue-900/50 p-5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-2 opacity-5 dark:opacity-10 pointer-events-none text-[#1152d4]">
                                    <Network size={80} />
                                </div>
                                <div className="flex items-center gap-2 mb-4 relative z-10">
                                    <span className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                                    <h3 className="text-sm font-bold uppercase tracking-wide">Economic Impact Analysis</h3>
                                </div>

                                <div className="space-y-4 relative z-10">
                                    {/* Personal ROI */}
                                    <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3">
                                        <div className="flex items-center gap-3">
                                            <span className="bg-blue-100 dark:bg-blue-900/40 text-[#1152d4] dark:text-blue-400 p-1.5 rounded-lg shadow-sm">
                                                <PiggyBank size={18} />
                                            </span>
                                            <div>
                                                <p className="text-xs text-[#616f89] dark:text-[#a0aec0] font-medium">Personal Asset Value</p>
                                                <p className="text-sm font-bold">Tier 4 Unlocked</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-[#1152d4] dark:text-blue-400">+ ₹2,450/mo</p>
                                            <p className="text-[10px] text-[#616f89] dark:text-[#a0aec0]">Est. Passive Return</p>
                                        </div>
                                    </div>

                                    {/* Network Impact */}
                                    <div>
                                        <p className="text-xs text-[#616f89] dark:text-[#a0aec0] font-medium mb-2">Network Distribution (6-Level Chain)</p>
                                        <div className="flex gap-1 h-2 w-full rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mb-2">
                                            <div className="bg-[#1152d4] w-[40%]"></div>
                                            <div className="bg-[#1152d4]/80 w-[25%]"></div>
                                            <div className="bg-[#1152d4]/60 w-[15%]"></div>
                                            <div className="bg-[#1152d4]/40 w-[10%]"></div>
                                            <div className="bg-[#1152d4]/20 w-[10%]"></div>
                                        </div>
                                        <div className="flex justify-between text-[10px] text-[#616f89] dark:text-[#a0aec0] font-medium">
                                            <span>Direct: 5%</span>
                                            <span>L2-L6: 12% Total</span>
                                        </div>
                                    </div>

                                    {/* Total Value */}
                                    <div className="bg-[#ffffff] dark:bg-[#1a2332] rounded-lg p-3 border border-blue-100 dark:border-blue-900/50 flex items-center justify-between shadow-sm">
                                        <span className="text-xs font-medium text-[#616f89] dark:text-[#a0aec0]">Total Portfolio Impact</span>
                                        <span className="text-sm font-bold flex items-center gap-1 text-[#111318] dark:text-white">
                                            <ArrowUpCircle size={16} className="text-green-500" />
                                            15.4% Yield
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#616f89] dark:text-[#a0aec0] font-medium">
                                <Lock size={14} />
                                <span>Secure Transaction via Sovereign Chain</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recommended Luxury Add-ons Section */}
                <section className="mt-16 md:mt-24 mb-12">
                    <div className="flex items-center justify-between mb-6 px-1">
                        <div>
                            <h3 className="text-2xl font-bold">Recommended Luxury Add-ons</h3>
                            <p className="text-[#616f89] dark:text-[#a0aec0] text-sm mt-1">Enhance your asset performance with these ecosystem integrations.</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <ChevronLeft size={20} />
                            </button>
                            <button className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Horizontal Scroll Container */}
                    <div className="flex overflow-x-auto gap-6 pb-8 hide-scrollbar snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0">
                        {/* Item 1 */}
                        <div className="min-w-[280px] md:min-w-[320px] snap-center bg-white dark:bg-[#1a2332] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden group hover:shadow-lg hover:border-[#1152d4]/30 dark:hover:border-[#1152d4]/50 transition-all duration-300">
                            <div className="relative h-48 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=2670&auto=format&fit=crop"
                                    alt="Professional Monitor"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-3 right-3 bg-white/90 dark:bg-[#1a2332]/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold shadow-sm">
                                    Tier 2
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold text-lg group-hover:text-[#1152d4] dark:group-hover:text-blue-400 transition-colors">Ocular 8K Display</h4>
                                        <p className="text-xs text-[#616f89] dark:text-[#a0aec0]">Visual Asset Class</p>
                                    </div>
                                </div>
                                <div className="flex items-end justify-between mt-4">
                                    <div>
                                        <span className="block text-lg font-bold">₹12,499</span>
                                        <span className="text-[10px] text-green-600 dark:text-green-400 font-medium">+1.2% Network ROI</span>
                                    </div>
                                    <button className="w-8 h-8 rounded-full bg-[#f6f6f8] dark:bg-[#2d3748] hover:bg-[#1152d4] hover:text-white dark:hover:bg-[#1152d4] flex items-center justify-center transition-colors">
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Item 2 */}
                        <div className="min-w-[280px] md:min-w-[320px] snap-center bg-white dark:bg-[#1a2332] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden group hover:shadow-lg hover:border-[#1152d4]/30 dark:hover:border-[#1152d4]/50 transition-all duration-300">
                            <div className="relative h-48 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=2671&auto=format&fit=crop"
                                    alt="Ergonomic Keyboard"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-3 right-3 bg-white/90 dark:bg-[#1a2332]/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold shadow-sm">
                                    Tier 1
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold text-lg group-hover:text-[#1152d4] dark:group-hover:text-blue-400 transition-colors">Tactile Command Key</h4>
                                        <p className="text-xs text-[#616f89] dark:text-[#a0aec0]">Input Efficiency Tool</p>
                                    </div>
                                </div>
                                <div className="flex items-end justify-between mt-4">
                                    <div>
                                        <span className="block text-lg font-bold">₹4,200</span>
                                        <span className="text-[10px] text-green-600 dark:text-green-400 font-medium">+0.5% Network ROI</span>
                                    </div>
                                    <button className="w-8 h-8 rounded-full bg-[#f6f6f8] dark:bg-[#2d3748] hover:bg-[#1152d4] hover:text-white dark:hover:bg-[#1152d4] flex items-center justify-center transition-colors">
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Item 3 */}
                        <div className="min-w-[280px] md:min-w-[320px] snap-center bg-white dark:bg-[#1a2332] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden group hover:shadow-lg hover:border-[#1152d4]/30 dark:hover:border-[#1152d4]/50 transition-all duration-300">
                            <div className="relative h-48 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1628126235206-5260b9ea6441?q=80&w=2670&auto=format&fit=crop"
                                    alt="Digital Storage Drive"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-3 right-3 bg-white/90 dark:bg-[#1a2332]/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold shadow-sm">
                                    Tier 3
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold text-lg group-hover:text-[#1152d4] dark:group-hover:text-blue-400 transition-colors">Vault 4TB Cloud Node</h4>
                                        <p className="text-xs text-[#616f89] dark:text-[#a0aec0]">Data Sovereignity</p>
                                    </div>
                                </div>
                                <div className="flex items-end justify-between mt-4">
                                    <div>
                                        <span className="block text-lg font-bold">₹8,999</span>
                                        <span className="text-[10px] text-green-600 dark:text-green-400 font-medium">+2.0% Network ROI</span>
                                    </div>
                                    <button className="w-8 h-8 rounded-full bg-[#f6f6f8] dark:bg-[#2d3748] hover:bg-[#1152d4] hover:text-white dark:hover:bg-[#1152d4] flex items-center justify-center transition-colors">
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Item 4 */}
                        <div className="min-w-[280px] md:min-w-[320px] snap-center bg-white dark:bg-[#1a2332] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden group hover:shadow-lg hover:border-[#1152d4]/30 dark:hover:border-[#1152d4]/50 transition-all duration-300">
                            <div className="relative h-48 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=2588&auto=format&fit=crop"
                                    alt="Luxury Headphones"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-3 right-3 bg-white/90 dark:bg-[#1a2332]/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold shadow-sm">
                                    Tier 2
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold text-lg group-hover:text-[#1152d4] dark:group-hover:text-blue-400 transition-colors">Sonic Pro ANC</h4>
                                        <p className="text-xs text-[#616f89] dark:text-[#a0aec0]">Audio Asset</p>
                                    </div>
                                </div>
                                <div className="flex items-end justify-between mt-4">
                                    <div>
                                        <span className="block text-lg font-bold">₹15,200</span>
                                        <span className="text-[10px] text-green-600 dark:text-green-400 font-medium">+1.5% Network ROI</span>
                                    </div>
                                    <button className="w-8 h-8 rounded-full bg-[#f6f6f8] dark:bg-[#2d3748] hover:bg-[#1152d4] hover:text-white dark:hover:bg-[#1152d4] flex items-center justify-center transition-colors">
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-white dark:bg-[#1a2332] border-t border-gray-200 dark:border-gray-700 py-8 px-4 md:px-10 transition-colors duration-300">
                <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-[#616f89] dark:text-[#a0aec0]">© {new Date().getFullYear()} Sovereign Mall. All Investment Tiers Reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="text-sm text-[#616f89] dark:text-[#a0aec0] hover:text-[#1152d4] transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="text-sm text-[#616f89] dark:text-[#a0aec0] hover:text-[#1152d4] transition-colors">Terms of Service</Link>
                        <Link href="/feedback" className="text-sm text-[#616f89] dark:text-[#a0aec0] hover:text-[#1152d4] transition-colors">ROI Disclaimer</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
