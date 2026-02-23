import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export const AdminDashboard: React.FC = () => {
  const { signOut, profile } = useAuth();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-dark text-slate-100 font-display">
      {/* Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-72 h-full bg-[#111618] border-r border-[#283539]">
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-900 flex items-center justify-center text-white font-bold">
              <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
            </div>
            <div>
              <h1 className="text-white text-lg font-bold tracking-tight">Master Gov</h1>
              <p className="text-[#9cb2ba] text-xs font-mono">v4.0.1 // Admin</p>
            </div>
          </div>
          <nav className="flex flex-col gap-2">
            <a className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 border border-primary/20 text-primary" href="#">
              <span className="material-symbols-outlined text-[20px]">dashboard</span>
              <span className="text-sm font-medium">Command Center</span>
            </a>
            <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#9cb2ba] hover:bg-[#1a2327] hover:text-white transition-colors" href="#">
              <span className="material-symbols-outlined text-[20px]">group</span>
              <span className="text-sm font-medium">User Management</span>
            </a>
            <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#9cb2ba] hover:bg-[#1a2327] hover:text-white transition-colors" href="#">
              <span className="material-symbols-outlined text-[20px]">payments</span>
              <span className="text-sm font-medium">Payout Portal</span>
            </a>
            <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#9cb2ba] hover:bg-[#1a2327] hover:text-white transition-colors" href="#">
              <span className="material-symbols-outlined text-[20px]">security</span>
              <span className="text-sm font-medium">Audit Logs</span>
            </a>
            <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#9cb2ba] hover:bg-[#1a2327] hover:text-white transition-colors" href="#">
              <span className="material-symbols-outlined text-[20px]">settings</span>
              <span className="text-sm font-medium">System Config</span>
            </a>
          </nav>
        </div>
        <div className="mt-auto p-6">
          <button onClick={signOut} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors mb-4">
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span className="text-sm font-medium">Sign Out</span>
          </button>
          <div className="bg-[#1a2327] rounded-lg p-4 border border-[#283539]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#9cb2ba] uppercase tracking-wider">Server Time</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <p className="text-white font-mono text-sm">14:32:01 UTC</p>
            <p className="text-[#586c75] text-[10px] mt-1 font-mono break-all">Ledger: 0x7f...3a2</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto relative">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-[#111618] border-b border-[#283539]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">admin_panel_settings</span>
            <span className="font-bold text-white">Master Gov</span>
          </div>
          <button className="text-white">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </header>

        {/* Top Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 border-b border-[#283539] bg-[#111618]/95 backdrop-blur sticky top-0 z-20">
          <div className="md:col-span-1 flex items-center gap-3">
            <h2 className="text-xl font-bold text-white tracking-tight">Dashboard Overview</h2>
          </div>
          <div className="md:col-span-3 flex justify-end items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-xs text-[#9cb2ba] uppercase">Current Active Cycle</span>
              <span className="text-sm font-bold text-white">Q3 Investment Phase</span>
            </div>
            <div className="h-8 w-px bg-[#283539]"></div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 bg-[#283539] hover:bg-[#35454b] text-white px-3 py-1.5 rounded text-sm transition-colors">
                <span className="material-symbols-outlined text-[16px]">notifications</span>
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 rounded-full">3</span>
              </button>
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center border border-[#283539]">
                <span className="text-xs font-bold">{profile?.full_name?.charAt(0) || 'A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto w-full">
          {/* Main KPI Section: The "Brain" */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Central Radial Gauge (The Core Metric) */}
            <div className="lg:col-span-8 flex flex-col">
              <div className="relative bg-[#1a2327] border border-[#283539] rounded-xl p-8 overflow-hidden min-h-[400px] flex flex-col justify-between shadow-glow">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <h3 className="text-[#9cb2ba] text-sm font-medium uppercase tracking-widest mb-1">Pre-IPO Corpus Progress</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl md:text-5xl font-bold text-white tracking-tighter">₹12,00,00,000</span>
                      <span className="text-lg text-[#9cb2ba]">/ ₹111 Cr</span>
                    </div>
                  </div>
                  <div className="bg-primary/10 border border-primary/20 px-3 py-1 rounded text-primary text-xs font-mono font-bold uppercase tracking-wider animate-pulse">
                    Live Inflow
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center py-8 relative z-10">
                  {/* Semi Circle Gauge Visualization */}
                  <div className="relative w-[280px] h-[140px] md:w-[360px] md:h-[180px] flex justify-center items-end overflow-hidden">
                    <div className="absolute bottom-0 w-full h-[200%] rounded-full" style={{ background: 'conic-gradient(#2bee6c 0% 10.8%, #1a2327 10.8% 100%)', transform: 'rotate(-90deg)' }}></div>
                    {/* Inner Circle Mask */}
                    <div className="absolute bottom-0 w-[80%] h-[160%] bg-[#1a2327] rounded-full z-10 flex items-end justify-center pb-2">
                      <div className="text-center mb-8">
                        <span className="block text-5xl md:text-6xl font-bold text-white glow-text">10.8%</span>
                        <span className="text-sm text-primary uppercase tracking-widest font-medium">Goal Met</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 relative z-10 border-t border-[#283539] pt-6 mt-2">
                  <div>
                    <p className="text-[#586c75] text-xs uppercase mb-1">24h Inflow</p>
                    <p className="text-emerald-400 font-bold text-lg">+₹45.2L</p>
                  </div>
                  <div>
                    <p className="text-[#586c75] text-xs uppercase mb-1">Total Contributors</p>
                    <p className="text-white font-bold text-lg">1,248</p>
                  </div>
                  <div>
                    <p className="text-[#586c75] text-xs uppercase mb-1">Avg Ticket Size</p>
                    <p className="text-white font-bold text-lg">₹96,153</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Side Widgets */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* System Integrity */}
              <div className="bg-[#1a2327] border border-[#283539] rounded-xl p-6 relative overflow-hidden group">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">verified_user</span>
                    System Integrity
                  </h3>
                  <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2 py-1 rounded border border-emerald-500/20">99.9% Uptime</span>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-16 w-16 rounded-full border-4 border-[#283539] border-t-emerald-500 border-r-emerald-500 flex items-center justify-center">
                    <span className="material-symbols-outlined text-emerald-500">check</span>
                  </div>
                  <div>
                    <p className="text-sm text-[#9cb2ba]">Immutable Ledger</p>
                    <p className="text-white font-bold">Health: Optimal</p>
                    <p className="text-[10px] text-[#586c75] mt-1">Last check: 2s ago</p>
                  </div>
                </div>
                <div className="w-full bg-[#283539] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[98%] shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                </div>
              </div>

              {/* Treasury Overflow */}
              <div className="bg-[#1a2327] border border-[#283539] rounded-xl p-6 relative flex-1 flex flex-col justify-center">
                <div className="absolute top-0 right-0 p-4">
                  <span className="material-symbols-outlined text-primary/30 text-[48px]">account_balance</span>
                </div>
                <h3 className="text-[#9cb2ba] text-xs font-medium uppercase tracking-widest mb-2">Treasury Overflow</h3>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-3xl font-bold text-white tracking-tight">₹45,20,000</span>
                  <span className="text-emerald-400 text-sm font-medium mb-1 flex items-center">
                    <span className="material-symbols-outlined text-[16px]">trending_up</span> 12%
                  </span>
                </div>
                <p className="text-xs text-[#586c75]">Excess funds reserved for operations & emergency liquidity.</p>
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 bg-[#283539] hover:bg-[#35454b] text-white text-xs py-2 rounded transition-colors border border-[#3b4e54]">View Ledger</button>
                  <button className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary text-xs py-2 rounded transition-colors border border-primary/20">Allocate</button>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Row: Charts & Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Ecosystem Growth Chart */}
            <div className="lg:col-span-2 bg-[#1a2327] border border-[#283539] rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-white font-bold text-lg">Ecosystem Growth</h3>
                  <p className="text-xs text-[#9cb2ba]">AUM Growth vs 15% ROI Target</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-1 text-xs text-white bg-[#283539] rounded cursor-pointer">1W</span>
                  <span className="px-2 py-1 text-xs text-[#111618] bg-primary font-bold rounded cursor-pointer">1M</span>
                  <span className="px-2 py-1 text-xs text-white bg-[#283539] rounded cursor-pointer">3M</span>
                </div>
              </div>
              
              {/* CSS-only Chart Simulation */}
              <div className="h-64 w-full flex items-end justify-between gap-1 relative pt-10">
                {/* Background Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
                  <div className="w-full h-px bg-[#283539] border-t border-dashed border-[#586c75]/30"></div>
                  <div className="w-full h-px bg-[#283539] border-t border-dashed border-[#586c75]/30"></div>
                  <div className="w-full h-px bg-[#283539] border-t border-dashed border-[#586c75]/30"></div>
                  <div className="w-full h-px bg-[#283539] border-t border-dashed border-[#586c75]/30"></div>
                  <div className="w-full h-px bg-[#283539]"></div>
                </div>
                
                {/* ROI Target Line */}
                <div className="absolute top-[30%] left-0 w-full h-px bg-emerald-500/50 z-0">
                  <span className="absolute -top-3 right-0 text-[10px] text-emerald-400 bg-[#1a2327] px-1">Target ROI (15%)</span>
                </div>
                
                {/* Bar/Area Representation */}
                <div className="w-full flex items-end justify-between gap-2 z-10 h-full pb-8 px-2">
                  <div className="w-full bg-primary/20 hover:bg-primary/40 rounded-t h-[20%] transition-all duration-300 relative group"><div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded">₹1.2Cr</div></div>
                  <div className="w-full bg-primary/20 hover:bg-primary/40 rounded-t h-[35%] transition-all duration-300 relative group"><div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded">₹2.8Cr</div></div>
                  <div className="w-full bg-primary/20 hover:bg-primary/40 rounded-t h-[28%] transition-all duration-300 relative group"><div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded">₹2.1Cr</div></div>
                  <div className="w-full bg-primary/20 hover:bg-primary/40 rounded-t h-[45%] transition-all duration-300 relative group"><div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded">₹4.2Cr</div></div>
                  <div className="w-full bg-primary/20 hover:bg-primary/40 rounded-t h-[52%] transition-all duration-300 relative group"><div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded">₹5.1Cr</div></div>
                  <div className="w-full bg-primary/20 hover:bg-primary/40 rounded-t h-[60%] transition-all duration-300 relative group"><div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded">₹6.8Cr</div></div>
                  <div className="w-full bg-primary/20 hover:bg-primary/40 rounded-t h-[58%] transition-all duration-300 relative group"><div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded">₹6.5Cr</div></div>
                  <div className="w-full bg-primary/20 hover:bg-primary/40 rounded-t h-[72%] transition-all duration-300 relative group"><div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded">₹8.9Cr</div></div>
                  <div className="w-full bg-gradient-to-t from-primary/60 to-primary rounded-t h-[85%] shadow-[0_0_15px_rgba(43,238,108,0.4)] relative group">
                    <div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-[#111618] font-bold text-xs px-2 py-1 rounded">₹12.0Cr</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions & Referrals */}
            <div className="flex flex-col gap-6">
              {/* Quick Actions */}
              <div className="bg-[#1a2327] border border-[#283539] rounded-xl p-6">
                <h3 className="text-white font-bold mb-4 flex justify-between items-center">
                  Action Required 
                  <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">45</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded bg-[#283539] border-l-2 border-primary hover:bg-[#35454b] cursor-pointer transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded text-primary group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-[20px]">payments</span>
                      </div>
                      <div>
                        <p className="text-sm text-white font-medium">Pending Payouts</p>
                        <p className="text-xs text-[#9cb2ba]">42 users waiting</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#586c75] text-[18px]">chevron_right</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded bg-[#283539] border-l-2 border-emerald-500 hover:bg-[#35454b] cursor-pointer transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-500/10 p-2 rounded text-emerald-500 group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-[20px]">person_add</span>
                      </div>
                      <div>
                        <p className="text-sm text-white font-medium">KYC Approvals</p>
                        <p className="text-xs text-[#9cb2ba]">3 high-value users</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#586c75] text-[18px]">chevron_right</span>
                  </div>
                </div>
              </div>

              {/* 6-Level Referral Breakdown */}
              <div className="bg-[#1a2327] border border-[#283539] rounded-xl p-6 flex-1">
                <h3 className="text-white font-bold mb-4">Referral Levels (Active)</h3>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[#586c75] w-8">Lvl 1</span>
                    <div className="flex-1 h-2 bg-[#283539] rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[85%]"></div>
                    </div>
                    <span className="text-xs text-white w-8 text-right">85%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[#586c75] w-8">Lvl 2</span>
                    <div className="flex-1 h-2 bg-[#283539] rounded-full overflow-hidden">
                      <div className="h-full bg-primary/80 w-[65%]"></div>
                    </div>
                    <span className="text-xs text-white w-8 text-right">65%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[#586c75] w-8">Lvl 3</span>
                    <div className="flex-1 h-2 bg-[#283539] rounded-full overflow-hidden">
                      <div className="h-full bg-primary/60 w-[45%]"></div>
                    </div>
                    <span className="text-xs text-white w-8 text-right">45%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[#586c75] w-8">Lvl 4</span>
                    <div className="flex-1 h-2 bg-[#283539] rounded-full overflow-hidden">
                      <div className="h-full bg-primary/40 w-[30%]"></div>
                    </div>
                    <span className="text-xs text-white w-8 text-right">30%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[#586c75] w-8">Lvl 5</span>
                    <div className="flex-1 h-2 bg-[#283539] rounded-full overflow-hidden">
                      <div className="h-full bg-primary/30 w-[15%]"></div>
                    </div>
                    <span className="text-xs text-white w-8 text-right">15%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[#586c75] w-8">Lvl 6</span>
                    <div className="flex-1 h-2 bg-[#283539] rounded-full overflow-hidden">
                      <div className="h-full bg-primary/20 w-[5%]"></div>
                    </div>
                    <span className="text-xs text-white w-8 text-right">5%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
