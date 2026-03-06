import SidebarMetrics from "@/app/components/SidebarMetrics";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-[#050B14]">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101922] flex flex-col shrink-0">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-[#1173d4] to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                        <span className="material-symbols-outlined font-bold">rocket_launch</span>
                    </div>
                    <div>
                        <h1 className="font-black text-xl tracking-tight leading-tight text-slate-900 dark:text-white">
                            BRAVECOM
                        </h1>
                        <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500 text-[#1173d4]">
                            Network Admin
                        </p>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-2 space-y-1">
                    <a className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1173d4]/10 hover:text-[#1173d4] rounded-lg transition-colors group" href="/dashboard">
                        <span className="material-symbols-outlined group-hover:scale-110 transition-transform">hub</span>
                        <span className="text-sm font-semibold">Referral Network</span>
                    </a>
                    <a className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1173d4]/10 hover:text-[#1173d4] rounded-lg transition-colors group" href="/franchise">
                        <span className="material-symbols-outlined group-hover:scale-110 transition-transform">storefront</span>
                        <span className="text-sm font-semibold">Franchise Partners</span>
                    </a>
                    <a className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1173d4]/10 hover:text-[#1173d4] rounded-lg transition-colors group" href="/disbursement">
                        <span className="material-symbols-outlined group-hover:scale-110 transition-transform">payments</span>
                        <span className="text-sm font-semibold">Disbursement</span>
                    </a>
                    <a className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1173d4]/10 hover:text-[#1173d4] rounded-lg transition-colors group" href="/register">
                        <span className="material-symbols-outlined group-hover:scale-110 transition-transform">person_add</span>
                        <span className="text-sm font-semibold">Register Investor</span>
                    </a>
                    <a className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1173d4]/10 hover:text-[#1173d4] rounded-lg transition-colors group mt-8 border-t border-slate-800 pt-4" href="/">
                        <span className="material-symbols-outlined group-hover:scale-110 transition-transform">public</span>
                        <span className="text-sm font-semibold">Public Website</span>
                    </a>
                </nav>

                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-[#0B121C]">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-4 shadow-inner relative overflow-hidden mb-4">
                        <div className="absolute -right-4 -top-4 w-16 h-16 bg-[#1173d4]/20 blur-xl rounded-full"></div>
                        <div className="flex items-center justify-between mb-2 relative z-10">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Status</span>
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                        </div>
                        <p className="text-xs font-medium text-slate-300 relative z-10">
                            Sunrays RBAC Active
                        </p>
                    </div>
                </div>
                <SidebarMetrics />
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Subtle grid background for high-tech feel */}
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #1f2937 1px, transparent 1px), linear-gradient(to bottom, #1f2937 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                <div className="relative z-10 w-full h-full flex flex-col">
                    {children}
                </div>
            </main>
        </div>
    );
}
