import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export const PartnerDashboard: React.FC = () => {
  const { signOut, profile } = useAuth();

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex flex-col antialiased selection:bg-primary selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-surface-dark/70 backdrop-blur-md border-b border-white/5 px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="size-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-xl">grid_view</span>
            </div>
            <div>
              <h1 className="text-white text-lg font-bold leading-tight tracking-tight">Franchise Command Center</h1>
              <p className="text-slate-400 text-xs font-medium tracking-wide">LEVEL 4 REGIONAL MASTER</p>
            </div>
          </div>
          
          <div className="flex flex-1 justify-end items-center gap-6">
            {/* Search */}
            <div className="hidden md:flex relative group w-full max-w-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </div>
              <input 
                type="text" 
                className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-[#151f23] text-sm text-white placeholder-slate-500 focus:ring-1 focus:ring-primary focus:bg-surface-dark transition-all duration-200" 
                placeholder="Search franchise network, users, or reports..." 
              />
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-3">
              <button className="relative p-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-dark transition-colors">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2.5 right-2.5 size-2 bg-[#fa5f38] rounded-full border-2 border-background-dark"></span>
              </button>
              
              <div className="h-8 w-px bg-white/10 mx-1"></div>
              
              <button onClick={signOut} className="flex items-center gap-3 pl-2 pr-1 rounded-full hover:bg-surface-dark transition-colors group">
                <div className="text-right hidden lg:block">
                  <p className="text-sm font-semibold text-white">{profile?.full_name || 'Partner'}</p>
                  <p className="text-xs text-slate-400">Regional Manager</p>
                </div>
                <div className="size-10 rounded-full bg-[#151f23] border border-white/10 flex items-center justify-center relative">
                  <span className="text-xs font-bold">{profile?.full_name?.charAt(0) || 'P'}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1400px] mx-auto p-6 md:p-8 space-y-8">
        {/* Header & Date Filter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">Regional Overview</h2>
            <p className="text-slate-400 text-base max-w-2xl">Monitoring Level 4 Franchise Network Performance & Health for North Zone.</p>
          </div>
          <div className="flex items-center bg-surface-dark rounded-lg p-1 border border-white/5 self-start">
            <button className="px-4 py-1.5 text-sm font-medium text-slate-400 hover:text-white rounded-md transition-colors">Weekly</button>
            <button className="px-4 py-1.5 text-sm font-medium bg-primary text-background-dark shadow-lg shadow-primary/25 rounded-md font-bold">Monthly</button>
            <button className="px-4 py-1.5 text-sm font-medium text-slate-400 hover:text-white rounded-md transition-colors">Quarterly</button>
          </div>
        </div>

        {/* Massive KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Network AUM */}
          <div className="bg-surface-dark rounded-xl p-6 border border-white/5 relative overflow-hidden group hover:border-primary/30 transition-all duration-300 shadow-xl shadow-black/20">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-8xl text-primary">account_balance</span>
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between gap-4">
              <div className="flex justify-between items-start">
                <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Total Network AUM</p>
                <span className="bg-[#0bda57]/10 text-[#0bda57] text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">trending_up</span> 12.4%
                </span>
              </div>
              <div>
                <h3 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-1">₹ 45.2 <span className="text-2xl text-slate-400 font-bold">Cr</span></h3>
                <p className="text-slate-500 text-sm">Target: ₹ 111 Cr (40.7% Achieved)</p>
              </div>
              <div className="w-full bg-[#151f23] rounded-full h-1.5 mt-2">
                <div className="bg-primary h-1.5 rounded-full" style={{ width: '40.7%' }}></div>
              </div>
            </div>
          </div>

          {/* Total Franchise Royalty */}
          <div className="bg-surface-dark rounded-xl p-6 border border-white/5 relative overflow-hidden group hover:border-primary/30 transition-all duration-300 shadow-xl shadow-black/20">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-8xl text-purple-500">payments</span>
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between gap-4">
              <div className="flex justify-between items-start">
                <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Total Franchise Royalty</p>
                <span className="bg-[#0bda57]/10 text-[#0bda57] text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">trending_up</span> 5.2%
                </span>
              </div>
              <div>
                <h3 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-1">₹ 8.45 <span className="text-2xl text-slate-400 font-bold">L</span></h3>
                <p className="text-slate-500 text-sm">Accumulated Earnings (This Month)</p>
              </div>
              <button className="text-primary text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all mt-2 group/btn">
                View Payout History <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Active User Ratio */}
          <div className="bg-surface-dark rounded-xl p-6 border border-white/5 relative overflow-hidden group hover:border-primary/30 transition-all duration-300 shadow-xl shadow-black/20 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Active User Ratio</p>
              <span className="bg-[#fa5f38]/10 text-[#fa5f38] text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">trending_down</span> 2.1%
              </span>
            </div>
            <div className="flex items-center gap-6">
              {/* Simple CSS Donut Chart */}
              <div className="relative size-24 shrink-0">
                <svg className="size-full -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                  <path className="text-[#151f23]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4"></path>
                  <path className="text-[#fa5f38] drop-shadow-[0_0_10px_rgba(250,95,56,0.5)]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="88, 100" strokeLinecap="round" strokeWidth="4"></path>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-xl font-bold text-white">88%</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300 flex items-center gap-2"><span className="size-2 rounded-full bg-[#0bda57]"></span>Active</span>
                  <span className="text-white font-bold">1,420</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300 flex items-center gap-2"><span className="size-2 rounded-full bg-[#fa5f38]"></span>Inactive</span>
                  <span className="text-white font-bold">194</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">12 users near 60-day limit</p>
              </div>
            </div>
          </div>
        </div>

        {/* Target Royalty Roadmap */}
        <div className="bg-surface-dark rounded-xl border border-white/5 p-6 md:p-8 shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">flag</span>
                Target Royalty Roadmap
              </h3>
              <p className="text-slate-400 text-sm mt-1">Progress towards next tier milestone</p>
            </div>
            <div className="bg-[#151f23] px-4 py-2 rounded-lg border border-white/5">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Current Tier</p>
              <p className="text-primary font-bold text-lg">Silver Partner</p>
            </div>
          </div>

          <div className="relative pt-6 pb-2">
            {/* Progress Bar Background */}
            <div className="h-3 bg-[#151f23] rounded-full w-full overflow-hidden flex">
              {/* Progress Fill */}
              <div className="h-full bg-gradient-to-r from-primary/50 to-primary relative w-[45%] shadow-[0_0_20px_rgba(13,185,242,0.4)]">
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 animate-pulse"></div>
              </div>
            </div>

            {/* Markers */}
            <div className="absolute top-0 left-0 w-full flex justify-between transform -translate-y-1/2 mt-1.5 px-[2px]">
              {/* Step 1 */}
              <div className="flex flex-col items-center gap-3">
                <div className="size-4 rounded-full bg-primary border-4 border-surface-dark shadow-[0_0_0_2px_rgba(13,185,242,0.3)]"></div>
                <div className="text-center w-24">
                  <p className="text-xs font-bold text-primary">Bronze</p>
                  <p className="text-[10px] text-slate-400">₹ 50L</p>
                </div>
              </div>
              
              {/* Step 2 (Current) */}
              <div className="flex flex-col items-center gap-3 relative left-[-10%]">
                <div className="size-6 rounded-full bg-primary border-4 border-surface-dark shadow-[0_0_0_4px_rgba(13,185,242,0.2)] flex items-center justify-center">
                  <div className="size-1.5 bg-white rounded-full"></div>
                </div>
                <div className="text-center w-32 bg-[#151f23]/80 backdrop-blur-sm p-1 rounded border border-primary/20 -mt-1">
                  <p className="text-xs font-bold text-white">Current: ₹ 1.2 Cr</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center gap-3">
                <div className="size-4 rounded-full bg-[#151f23] border-4 border-surface-dark ring-2 ring-slate-700"></div>
                <div className="text-center w-24">
                  <p className="text-xs font-bold text-slate-300">Gold</p>
                  <p className="text-[10px] text-slate-500">₹ 5 Cr</p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center gap-3">
                <div className="size-4 rounded-full bg-[#151f23] border-4 border-surface-dark ring-2 ring-slate-700"></div>
                <div className="text-center w-24">
                  <p className="text-xs font-bold text-slate-300">Platinum</p>
                  <p className="text-[10px] text-slate-500">₹ 25 Cr</p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex flex-col items-center gap-3">
                <div className="size-4 rounded-full bg-[#151f23] border-4 border-surface-dark ring-2 ring-slate-700"></div>
                <div className="text-center w-24">
                  <p className="text-xs font-bold text-slate-300">Ambassador</p>
                  <p className="text-[10px] text-slate-500">₹ 111 Cr</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Layout: Ledger + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Downline Health Ledger */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">groups</span>
                Downline Health Ledger
              </h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 text-lg">filter_alt</span>
                  <select className="pl-9 pr-8 py-2 bg-surface-dark border border-white/5 rounded-lg text-sm text-slate-300 focus:ring-primary focus:border-primary">
                    <option>All Statuses</option>
                    <option>Critical (Inactivity)</option>
                    <option>High Performers</option>
                  </select>
                </div>
                <button className="p-2 bg-surface-dark border border-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-lg">download</span>
                </button>
              </div>
            </div>

            <div className="bg-surface-dark rounded-xl border border-white/5 overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#151f23] text-slate-400 text-xs uppercase tracking-wider border-b border-white/5">
                      <th className="p-4 font-semibold">Franchisee Name</th>
                      <th className="p-4 font-semibold">Tier Level</th>
                      <th className="p-4 font-semibold text-right">AUM Contribution</th>
                      <th className="p-4 font-semibold text-center">Inactivity</th>
                      <th className="p-4 font-semibold text-center">Status</th>
                      <th className="p-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {/* Critical Row */}
                    <tr className="group hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">RK</div>
                          <div>
                            <p className="font-medium text-white">Rahul Kumar</p>
                            <p className="text-xs text-slate-500">ID: #FR-4921</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-300">Level 2</td>
                      <td className="p-4 text-right font-mono text-white">₹ 5,00,000</td>
                      <td className="p-4 text-center">
                        <span className="text-[#fa5f38] font-bold">58 Days</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#fa5f38]/10 text-[#fa5f38] border border-[#fa5f38]/20">
                          <span className="size-1.5 rounded-full bg-[#fa5f38] animate-pulse"></span> Critical
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button className="px-3 py-1.5 bg-[#fa5f38] text-background-dark font-bold text-xs rounded hover:bg-orange-400 transition-colors">
                          Alert
                        </button>
                      </td>
                    </tr>
                    {/* Healthy Row */}
                    <tr className="group hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-full bg-[#151f23] border border-white/10 flex items-center justify-center text-slate-400 text-xs font-bold">PS</div>
                          <div>
                            <p className="font-medium text-white">Priya Sharma</p>
                            <p className="text-xs text-slate-500">ID: #FR-1109</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-300">Level 1</td>
                      <td className="p-4 text-right font-mono text-white">₹ 42,00,000</td>
                      <td className="p-4 text-center">
                        <span className="text-slate-500">2 Days</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#0bda57]/10 text-[#0bda57] border border-[#0bda57]/20">
                          <span className="size-1.5 rounded-full bg-[#0bda57]"></span> Active
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button className="text-slate-400 hover:text-white transition-colors">
                          <span className="material-symbols-outlined text-lg">more_horiz</span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-white/5 bg-[#151f23]/50 flex justify-center">
                <button className="text-xs font-medium text-slate-400 hover:text-primary transition-colors flex items-center gap-1">
                  View All Users <span className="material-symbols-outlined text-sm">arrow_downward</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Action Card */}
            <div className="bg-surface-dark rounded-xl p-6 border border-white/5 shadow-lg">
              <h4 className="text-white font-bold mb-4">Quick Actions</h4>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-primary text-background-dark font-bold hover:bg-primary-dark transition-all shadow-[0_4px_14px_0_rgba(13,185,242,0.39)]">
                  <span className="material-symbols-outlined">person_add</span>
                  Invite Franchisee
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-[#151f23] border border-white/10 text-white font-medium hover:bg-white/5 transition-all group">
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">description</span>
                  Generate Report
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-[#151f23] border border-white/10 text-white font-medium hover:bg-white/5 transition-all group">
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-[#0bda57] transition-colors">account_balance_wallet</span>
                  Request Payout
                </button>
              </div>
            </div>

            {/* Mini Insight */}
            <div className="bg-gradient-to-br from-surface-dark to-slate-900 rounded-xl p-6 border border-white/5 relative overflow-hidden">
              <div className="absolute -right-6 -top-6 bg-primary/20 blur-3xl size-32 rounded-full pointer-events-none"></div>
              <h4 className="text-white font-bold mb-2 relative z-10">Referral Leaderboard</h4>
              <p className="text-xs text-slate-400 mb-4 relative z-10">Top performers this week</p>
              <ul className="space-y-4 relative z-10">
                <li className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-yellow-500 w-4">01</span>
                    <span className="text-sm text-slate-200">Sneha R.</span>
                  </div>
                  <span className="text-xs font-mono text-[#0bda57]">+₹22L</span>
                </li>
                <li className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 w-4">02</span>
                    <span className="text-sm text-slate-200">Arun V.</span>
                  </div>
                  <span className="text-xs font-mono text-[#0bda57]">+₹18L</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
