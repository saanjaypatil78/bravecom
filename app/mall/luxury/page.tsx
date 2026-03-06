export default function LuxuryMarketPage() {
    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&display=swap" rel="stylesheet" />
            <div className="bg-[#121212] text-slate-100 min-h-screen font-['Newsreader',serif]">
                <header className="border-b border-white/10 bg-[#0a0e1a] sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
                        <div className="flex items-center gap-3 shrink-0">
                            <div className="bg-[#ecb613] p-1.5 rounded-lg">
                                <span className="material-symbols-outlined text-[#121212] flex items-center justify-center text-2xl font-bold">diamond</span>
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#ecb613] to-[#fff3d0]">Sovereign Market</h1>
                        </div>
                        <div className="flex-1 flex items-center gap-4 max-w-2xl">
                            <div className="flex items-center gap-2 px-3 py-2 bg-[#1e1e1e] rounded-lg border border-white/5 text-slate-300 hover:border-[#ecb613]/50 cursor-pointer">
                                <span className="material-symbols-outlined text-sm">location_on</span>
                                <div className="text-[10px] leading-none uppercase tracking-widest font-bold">
                                    <span className="block opacity-60">Deliver to</span>
                                    <span className="text-white">Global Partners</span>
                                </div>
                            </div>
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-slate-400">search</span>
                                </div>
                                <input className="block w-full pl-10 pr-3 py-2.5 bg-[#1e1e1e] border-none rounded-lg focus:ring-1 focus:ring-[#ecb613] text-slate-100 placeholder-slate-500 outline-none" placeholder="Search luxury dropshipping solutions..." type="text" />
                            </div>
                        </div>
                        <nav className="flex items-center gap-6">
                            <div className="hidden lg:flex gap-6 text-sm font-medium text-slate-300">
                                <a className="hover:text-[#ecb613] transition-colors" href="/dashboard">Dashboard</a>
                                <a className="hover:text-[#ecb613] transition-colors" href="/mall">Elite Portal</a>
                            </div>
                            <div className="flex items-center gap-4">
                                <a href="/mall/checkout" className="relative p-2 text-slate-300 hover:text-[#ecb613]">
                                    <span className="material-symbols-outlined">shopping_bag</span>
                                    <span className="absolute top-1 right-1 bg-[#ecb613] text-[#121212] text-[10px] font-bold px-1 rounded-full">3</span>
                                </a>
                                <div className="h-10 w-10 rounded-full border border-[#ecb613]/30 p-0.5 overflow-hidden">
                                    <img alt="User Profile" className="rounded-full h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6CIiV5eS2-rH-mFGJMpIrGlFqmBWVrwXtB5AbOYE8IYS4eEdZAQ3KutVf_7OqTggZxBEmqz6_0eXGQrsSPsdlxnY3g4446yjjrv4mkS__vCkd1bW_0wwXD9b-vYa4CIgjpGSlCvcD7t1y-OZgZNZFhnrnhBiX3Vj-Iv0nyKvc71Awmsom5c_BCMF1fKrQxUpkDIh_JVXZrgATIG8A6I4k_SbzCU5ltS4SE8qP6dScFcFu6DMbW8J32A1DF5-hxBYoJZ93DTyDs0hi" />
                                </div>
                            </div>
                        </nav>
                    </div>
                </header>
                <div className="bg-[#1e1e1e] border-b border-white/5">
                    <div className="max-w-7xl mx-auto px-6 h-10 flex items-center gap-8 overflow-x-auto text-xs uppercase tracking-widest font-bold text-slate-400 no-scrollbar">
                        <a className="flex items-center gap-1 text-[#ecb613]" href="/mall/categories"><span className="material-symbols-outlined text-base">menu</span> All Categories</a>
                        <a className="hover:text-white whitespace-nowrap" href="/mall/products">Drop Shipping Elite</a>
                        <a className="hover:text-white whitespace-nowrap" href="/mall/categories">Haute Couture</a>
                        <a className="hover:text-white whitespace-nowrap" href="/mall/products">Bespoke Electronics</a>
                        <a className="hover:text-white whitespace-nowrap" href="/mall/spotlight">Sovereign Rewards</a>
                        <a className="ml-auto text-[#ecb613] border-l border-white/10 pl-8" href="/investor/portfolio">Brave Ecom SaaS Access</a>
                    </div>
                </div>

                <main className="max-w-7xl mx-auto px-6 py-8 space-y-12 text-left">
                    <section className="relative rounded-xl overflow-hidden aspect-[21/9]">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-[#121212]/40 to-transparent z-10"></div>
                        <img alt="Luxury Hero" className="absolute inset-0 w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxMRYO8mZXX9S8O33G1Yl2E6m2t1FMuv3HTq6uAF1kjFI91iXUG-2Ic6nd0ELCqKg67ilTwqdpS-OdCpDOLhOJ-2vVK7wCk6tsdu51Sjmbf54bF12P48ZgvbZ4vknb_l-mkcTKlxxfz7rmac6uimOCwR34Y_N7cWuT0T5kp8GqVkaAe2WzhRDu9pqj63Biccp68NtrBaEUWIYNdHpxXfp4YENSyooez7-fDRQ_mPhSIRwz4WbvXKHJJiY0VgHS8zB-CbgGq1qK_YfX" />
                        <div className="relative z-20 h-full flex flex-col justify-center px-12 max-w-xl space-y-6">
                            <span className="text-[#ecb613] font-bold tracking-[0.3em] uppercase text-sm">Summer Collection 2024</span>
                            <h2 className="text-6xl font-bold leading-tight">The Sovereign Selection</h2>
                            <p className="text-slate-300 text-lg">Curated dropshipping portfolios for the modern digital tycoon. High margins, low friction.</p>
                            <div className="flex gap-4">
                                <a href="/mall/product" className="bg-[#ecb613] flex items-center justify-center text-[#121212] px-8 py-3 rounded-lg font-bold hover:brightness-110 transition-all uppercase text-sm tracking-wider">Start Scaling</a>
                            </div>
                        </div>
                    </section>

                    <section className="bg-[#0a0e1a] rounded-xl border border-[#ecb613]/20 overflow-hidden">
                        <div className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-1 space-y-4 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ecb613]/10 border border-[#ecb613]/30 rounded-full text-[#ecb613] text-xs font-bold uppercase tracking-widest">
                                    <span className="material-symbols-outlined text-sm">verified</span> Member Exclusive
                                </div>
                                <h2 className="text-4xl font-bold text-white leading-tight">Tier 1 Investor Portal</h2>
                                <p className="text-slate-400 max-w-lg">Access restricted pricing and global dropshipping pipelines. Exclusive for active users with investments of ₹51,111+.</p>
                                <div className="flex items-center gap-6 pt-4 justify-center md:justify-start">
                                    <div>
                                        <span className="block text-2xl font-bold text-[#ecb613]">₹12,45,000</span>
                                        <span className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Est. Weekly Margin</span>
                                    </div>
                                    <div className="w-px h-10 bg-white/10"></div>
                                    <div>
                                        <span className="block text-2xl font-bold text-[#ecb613]">42</span>
                                        <span className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Active Pipelines</span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full md:w-1/3 bg-[#1e1e1e] p-6 rounded-xl border border-white/5 space-y-4">
                                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Current SaaS Yield</h4>
                                <div className="h-2 bg-[#121212] rounded-full overflow-hidden">
                                    <div className="bg-[#ecb613] h-full w-[78%]"></div>
                                </div>
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-slate-500">Target Reached</span>
                                    <span className="text-[#ecb613]">78%</span>
                                </div>
                                <button className="w-full bg-[#ecb613]/20 text-[#ecb613] border border-[#ecb613]/30 py-2.5 rounded hover:bg-[#ecb613]/30 transition-all font-bold text-xs uppercase tracking-widest">Unlock Dashboard</button>
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-end justify-between mb-8">
                            <div>
                                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#ecb613] to-[#fff3d0]">Elite Collections</h2>
                                <p className="text-slate-500 mt-1">Sourced through the Sovereign Global Network</p>
                            </div>
                            <a className="text-[#ecb613] hover:underline font-bold text-sm tracking-widest uppercase" href="/mall/products">View All Assets</a>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Card 1 */}
                            <div className="bg-[#0a0e1a] group rounded-xl overflow-hidden shadow-[0_10px_30px_-15px_rgba(0,0,0,0.7)] border border-white/5">
                                <a href="/mall/product" className="block relative h-64 overflow-hidden">
                                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhikdBtVb3NZ-t4d7nwWAYaq3oS4orQH72uUdNj1V7C1CkNFuXnKmnIvAB-lIrFJlNqLJute42Z1rLz7QPGfIF-cWcVM7D_1mYPzQgjfor8XlEW0BhXfEFy1VaKnTKS_nslYBavBxNDTx839uujBJgKG2wHBzzpAexdJ5keWxavt521hnDZlb8wQNJnAjJ7FnLyl0XAJEe84kP3MBuAgFPl-T7hif1UEceIwE2MmQ4blZZox2MgpOKCeY88oxm9JxMoYjj-IsnYs2d" />
                                    <div className="absolute top-4 right-4 bg-[#121212]/80 backdrop-blur px-2 py-1 rounded text-[#ecb613] text-[10px] font-bold uppercase tracking-widest">New Yield</div>
                                </a>
                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-100">Milan Fashion Portfolio</h3>
                                            <p className="text-slate-500 text-xs">Drop Shipping | Q4 Distribution</p>
                                        </div>
                                        <span className="text-xl font-bold text-[#ecb613]">₹89,999</span>
                                    </div>
                                    <p className="text-slate-400 text-sm line-clamp-2">Exclusive dropshipping rights for emerging Milanese labels. Pre-vetted logistics inclusive of SaaS fees.</p>
                                    <a href="/mall/product" className="flex items-center justify-center w-full bg-white/5 border border-white/10 hover:border-[#ecb613]/50 text-white font-bold py-2 rounded-lg transition-colors text-sm uppercase tracking-widest">Explore Asset</a>
                                </div>
                            </div>
                            {/* Card 2 */}
                            <div className="bg-[#0a0e1a] group rounded-xl overflow-hidden shadow-[0_10px_30px_-15px_rgba(0,0,0,0.7)] border border-white/5">
                                <a href="/mall/product" className="block relative h-64 overflow-hidden">
                                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuClpgiu-JGu98bF28bcE7N2rpRXahD9PBfcW8uflB_nrbSSfsL7kVoTQodjPZiByYZCwpcgyzwlqDZ8q_1IlSput4GPEzwFPDLqul5X2wX76qAlHI9p58iUyzr_bfPd_SlG_y5DQazxfqYRyEQnV-5ut8BBU3CftapiMs5RNt_F-LtmC9daVBNjNrQxh1D1kMzhpuyKoC1GZOXlZMzP2NV9Va1cVA0gNq9nIz00GiaB6IrFC4sKU99tKst_USo2J2dRxo2XTiMccXGW" />
                                    <div className="absolute top-4 right-4 bg-[#ecb613] px-2 py-1 rounded text-[#121212] text-[10px] font-bold uppercase tracking-widest">High Margin</div>
                                </a>
                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-100">Artisan Leather Bundle</h3>
                                            <p className="text-slate-500 text-xs">Bespoke Goods | Wholesale</p>
                                        </div>
                                        <span className="text-xl font-bold text-[#ecb613]">₹1,52,500</span>
                                    </div>
                                    <p className="text-slate-400 text-sm line-clamp-2">Premium tanned Italian leather goods. Direct-from-source pricing for Brave Ecom members.</p>
                                    <a href="/mall/product" className="flex items-center justify-center w-full bg-white/5 border border-white/10 hover:border-[#ecb613]/50 text-white font-bold py-2 rounded-lg transition-colors text-sm uppercase tracking-widest">Explore Asset</a>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
                <footer className="bg-[#0a0e1a] border-t border-white/5 py-12 text-left">
                    <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest font-bold text-slate-600">
                        <p>© 2024 Sovereign Market by Brave Ecom. All Rights Reserved.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
