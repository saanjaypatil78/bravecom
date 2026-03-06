import Link from 'next/link';

export default function SpotlightPage() {
    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
            <div className="bg-[#0f172a] text-slate-100 min-h-screen font-['Noto_Serif',serif]">
                <header className="sticky top-0 z-50 bg-[#0f172a]/90 backdrop-blur-md border-b border-[#334155]">
                    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#0ea5e9]">local_offer</span>
                            <h1 className="text-xl font-bold tracking-tight">Sovereign <span className="text-[#0ea5e9]">Spotlight</span></h1>
                        </div>
                        <nav className="hidden md:flex items-center gap-6">
                            <Link className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="/dashboard">Dashboard</Link>
                            <Link className="text-sm font-medium text-[#0ea5e9] border-b-2 border-[#0ea5e9] py-5" href="#">Today&apos;s Value</Link>
                            <Link className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="/mall">Mall Home</Link>
                            <Link className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="/mall/luxury">Luxury Tier</Link>
                        </nav>
                        <div className="flex items-center gap-4">
                            <button className="text-slate-300 hover:text-white"><span className="material-symbols-outlined">search</span></button>
                            <Link href="/mall/checkout" className="text-slate-300 hover:text-white relative">
                                <span className="material-symbols-outlined">shopping_cart</span>
                                <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-[#0ea5e9] text-[8px] font-bold text-white">2</span>
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-6 py-8 space-y-12">
                    <section className="text-center py-12 border-b border-[#334155]">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">Exceptional Value. Daily.</h2>
                        <p className="text-[#94a3b8] max-w-2xl mx-auto text-lg">
                            Curated high-discount, high-velocity consumer goods. Perfect for immediate dropshipping scale or personal upgrades.
                        </p>
                    </section>

                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <span className="material-symbols-outlined text-red-500 animate-pulse">local_fire_department</span>
                            <h3 className="text-2xl font-bold text-white">Trending Deals (70%+ OFF)</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Spotlight Card 1 */}
                            <div className="bg-[#1e293b] rounded-xl overflow-hidden border border-[#334155] hover:border-[#0ea5e9]/50 transition-colors group">
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <img alt="Wireless Earbuds" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" src="https://images.unsplash.com/photo-1606220588913-b3aecb44df0e?q=80&w=600&auto=format&fit=crop" />
                                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">72% OFF</div>
                                </div>
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-lg text-white">Phantom X Earbuds</h4>
                                        <div className="flex items-center gap-1 text-yellow-400 text-xs">
                                            <span className="material-symbols-outlined text-[14px]">star</span>
                                            <span>4.8</span>
                                        </div>
                                    </div>
                                    <p className="text-[#94a3b8] text-sm mb-4 line-clamp-2">40dB Hybrid ANC, 36-Hour Battery. High demand in Tier 1 cities.</p>
                                    <div className="flex items-center justify-between mt-auto">
                                        <div>
                                            <span className="text-xs text-[#94a3b8] line-through block">₹12,999</span>
                                            <span className="text-xl font-bold text-[#0ea5e9]">₹3,499</span>
                                        </div>
                                        <Link href="/mall/product?id=MALL-PRD-00001" className="bg-[#1e293b] text-white border border-[#334155] hover:bg-[#0ea5e9] hover:text-white px-4 py-2 rounded text-sm font-bold transition-colors">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Spotlight Card 2 */}
                            <div className="bg-[#1e293b] rounded-xl overflow-hidden border border-[#334155] hover:border-[#0ea5e9]/50 transition-colors group">
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <img alt="Smartwatch" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=600&auto=format&fit=crop" />
                                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">74% OFF</div>
                                </div>
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-lg text-white">Horizon Smartwatch</h4>
                                        <div className="flex items-center gap-1 text-yellow-400 text-xs">
                                            <span className="material-symbols-outlined text-[14px]">star</span>
                                            <span>4.6</span>
                                        </div>
                                    </div>
                                    <p className="text-[#94a3b8] text-sm mb-4 line-clamp-2">AMOLED display, ECG monitoring. Perfect up-sell item.</p>
                                    <div className="flex items-center justify-between mt-auto">
                                        <div>
                                            <span className="text-xs text-[#94a3b8] line-through block">₹8,999</span>
                                            <span className="text-xl font-bold text-[#0ea5e9]">₹2,299</span>
                                        </div>
                                        <Link href="/mall/product?id=MALL-PRD-00002" className="bg-[#1e293b] text-white border border-[#334155] hover:bg-[#0ea5e9] hover:text-white px-4 py-2 rounded text-sm font-bold transition-colors">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Spotlight Card 3 */}
                            <div className="bg-[#1e293b] rounded-xl overflow-hidden border border-[#334155] hover:border-[#0ea5e9]/50 transition-colors group">
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <img alt="Mechanical Keyboard" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" src="https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=600&auto=format&fit=crop" />
                                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">60% OFF</div>
                                </div>
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-lg text-white">Pro Mechanical Board</h4>
                                        <div className="flex items-center gap-1 text-yellow-400 text-xs">
                                            <span className="material-symbols-outlined text-[14px]">star</span>
                                            <span>4.9</span>
                                        </div>
                                    </div>
                                    <p className="text-[#94a3b8] text-sm mb-4 line-clamp-2">Tactile switches, RGB backlighting. High conversion rate in tech enthusiast circles.</p>
                                    <div className="flex items-center justify-between mt-auto">
                                        <div>
                                            <span className="text-xs text-[#94a3b8] line-through block">₹4,999</span>
                                            <span className="text-xl font-bold text-[#0ea5e9]">₹1,999</span>
                                        </div>
                                        <Link href="/mall/product?id=MALL-PRD-00003" className="bg-[#1e293b] text-white border border-[#334155] hover:bg-[#0ea5e9] hover:text-white px-4 py-2 rounded text-sm font-bold transition-colors">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
                <footer className="bg-[#0f172a] border-t border-[#334155] py-8 text-center mt-12">
                    <p className="text-[#94a3b8] text-sm">© 2024 Sovereign Spotlight. High Velocity E-commerce.</p>
                </footer>
            </div>
        </>
    );
}
