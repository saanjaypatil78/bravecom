"use client";

import { useState } from "react";

export default function EcosystemMonitorPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-[#111618] text-slate-100 font-['Space_Grotesk',sans-serif] flex flex-col overflow-hidden">
      {/* Top Navigation */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#283539] px-6 py-3 bg-[#111618]/95 backdrop-blur-sm z-50 sticky top-0">
        <div className="flex items-center gap-4 text-white">
          <div className="size-8 text-[#0db9f2] flex items-center justify-center">
            <span className="material-symbols-outlined text-[32px]">solar_power</span>
          </div>
          <div>
            <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">Sun Ray Admin</h2>
            <p className="text-slate-400 text-xs font-medium tracking-wide">ECOSYSTEM MONITOR v2.4</p>
          </div>
        </div>
        <div className="flex flex-1 justify-end gap-6 items-center">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded bg-[#1b2529] border border-[#283539]">
            <span className="w-2 h-2 rounded-full bg-[#0bda57] animate-pulse"></span>
            <span className="text-xs font-medium text-slate-300">API: HEALTHY</span>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#0db9f2]/20 text-[#0db9f2] border border-[#0db9f2]/30 rounded-lg hover:bg-[#0db9f2]/30 transition-colors shadow-[0_0_8px_rgba(13,185,242,0.2)]">
              <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
              <span className="text-sm font-bold truncate">RBAC: Super Admin</span>
            </button>
            <button className="relative p-2 rounded-lg bg-[#283539] text-white hover:bg-[#1b2529] transition-colors">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#eb5757] rounded-full border-2 border-[#283539]"></span>
            </button>
            <button className="p-2 rounded-lg bg-[#283539] text-white hover:bg-[#1b2529] transition-colors">
              <span className="material-symbols-outlined text-[20px]">settings</span>
            </button>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-[#283539] overflow-hidden bg-[#1b2529]">
            <img alt="Admin Profile Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtFFlq9Fcmjo0vFkbyH3z-aDknsp6tHoZ83GaXpbnzpZJ0mkwKR-KCOlaXlZLUMwyHCPYmXyNF47KVchIF-jjSU6ntrgM2GCbcWR9ZA9ZBFoyHmJOsVWwszDJdRIExJ_ygK0tcd0pqpWbAxwGMgG8RsjhQVmm4_BBAEcoco8puEnYfK5QTQvBI-3A-Rq4lQlH2ZACBvP4UYF-dkvfnf6y7tP_P-L2gtevYKkOloZQJmblgGcrknk6RKwm988CsVYa-e_JSc71YwV4W"/>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-1 flex flex-col md:flex-row h-[calc(100vh-65px)] overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className={`${sidebarExpanded ? 'w-64' : 'w-20'} bg-[#111618] border-r border-[#283539] hidden md:flex flex-col justify-between py-6 transition-all duration-300`}>
          <nav className="flex flex-col gap-2 px-3">
            <a className="flex items-center gap-3 px-3 py-3 rounded-lg bg-[#0db9f2]/10 text-[#0db9f2] border border-[#0db9f2]/20 shadow-[0_0_8px_rgba(13,185,242,0.2)] group" href="#">
              <span className="material-symbols-outlined">dashboard</span>
              <span className={`${sidebarExpanded ? 'block' : 'hidden'} lg:block font-medium`}>Dashboard</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-[#283539] transition-colors group" href="#">
              <span className="material-symbols-outlined">account_tree</span>
              <span className={`${sidebarExpanded ? 'block' : 'hidden'} lg:block font-medium`}>Referral Tree</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-[#283539] transition-colors group" href="#">
              <span className="material-symbols-outlined">account_balance_wallet</span>
              <span className={`${sidebarExpanded ? 'block' : 'hidden'} lg:block font-medium`}>Treasury</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-[#283539] transition-colors group" href="#">
              <span className="material-symbols-outlined">group</span>
              <span className={`${sidebarExpanded ? 'block' : 'hidden'} lg:block font-medium`}>Investors</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-[#283539] transition-colors group" href="#">
              <span className="material-symbols-outlined">gavel</span>
              <span className={`${sidebarExpanded ? 'block' : 'hidden'} lg:block font-medium`}>Compliance</span>
            </a>
          </nav>
          <div className={`px-6 ${sidebarExpanded ? 'block' : 'hidden'} lg:block`}>
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#1b2529] to-[#283539] border border-[#283539]">
              <p className="text-xs text-slate-400 mb-1">System Load</p>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-2xl font-bold text-white">24%</span>
                <span className="text-xs text-[#0bda57] mb-1">Normal</span>
              </div>
              <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-[#0bda57] w-[24%]"></div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Dashboard Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 flex flex-col gap-8">
          {/* Master AUM Progress */}
          <section className="flex flex-col gap-4">
            <div className="flex flex-wrap justify-between items-end gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Total AUM Goal Progress</h1>
                <p className="text-slate-400 text-sm">Tracking towards ₹111 Cr Target • Real-time Updates</p>
              </div>
              <div className="flex items-end gap-3 text-right">
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Current AUM</p>
                  <p className="text-3xl font-bold text-white font-mono">₹45.2 Cr</p>
                </div>
                <span className="text-2xl text-slate-600 font-light">/</span>
                <div className="opacity-60">
                  <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Goal</p>
                  <p className="text-xl font-bold text-slate-300 font-mono">₹111 Cr</p>
                </div>
              </div>
            </div>
            {/* Progress Bar Container */}
            <div className="relative h-14 bg-[#1b2529] rounded-xl border border-[#283539] overflow-visible shadow-inner">
              {/* Progress Fill */}
              <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#0db9f2]/60 to-[#0db9f2] w-[41%] rounded-l-xl shadow-[0_0_20px_rgba(13,185,242,0.4)] flex items-center justify-end px-4 border-r border-white/20">
                <span className="text-white font-bold text-sm drop-shadow-md">41%</span>
              </div>
              {/* Grid Lines */}
              <div className="absolute inset-0 grid grid-cols-10 pointer-events-none">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="border-r border-white/5 h-full"></div>
                ))}
              </div>
              {/* SEBI Trigger Marker (30%) */}
              <div className="absolute top-0 bottom-0 left-[30%] w-px bg-[#f2c94c] z-10">
                <div className="absolute -top-10 -translate-x-1/2 flex flex-col items-center">
                  <div className="bg-[#f2c94c]/10 text-[#f2c94c] border border-[#f2c94c]/30 px-3 py-1 rounded text-xs font-bold whitespace-nowrap backdrop-blur-md shadow-[0_0_10px_rgba(242,201,76,0.2)]">
                    SEBI Trigger (30%) PASSED
                  </div>
                  <div className="h-4 w-px bg-[#f2c94c]"></div>
                </div>
                <div className="absolute top-0 bottom-0 w-8 -translate-x-1/2 bg-[#f2c94c]/5 pointer-events-none"></div>
              </div>
            </div>
          </section>

          {/* Metrics Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 */}
            <div className="bg-[#1b2529] rounded-xl p-5 border border-[#283539] hover:border-[#0db9f2]/30 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-6xl text-[#0db9f2]">groups</span>
              </div>
              <p className="text-slate-400 text-sm font-medium mb-2">Total Active Investors</p>
              <div className="flex items-end gap-3">
                <h3 className="text-3xl font-bold text-white tracking-tight">1,245</h3>
                <span className="text-[#0bda57] text-sm font-bold flex items-center mb-1 bg-[#0bda57]/10 px-1.5 py-0.5 rounded">
                  <span className="material-symbols-outlined text-sm mr-0.5">trending_up</span>12%
                </span>
              </div>
            </div>
            {/* Card 2 */}
            <div className="bg-[#1b2529] rounded-xl p-5 border border-[#283539] hover:border-[#0db9f2]/30 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-6xl text-[#0db9f2]">payments</span>
              </div>
              <p className="text-slate-400 text-sm font-medium mb-2">Avg. Ticket Size</p>
              <div className="flex items-end gap-3">
                <h3 className="text-3xl font-bold text-white tracking-tight">₹3.6 L</h3>
                <span className="text-[#0bda57] text-sm font-bold flex items-center mb-1 bg-[#0bda57]/10 px-1.5 py-0.5 rounded">
                  <span className="material-symbols-outlined text-sm mr-0.5">trending_up</span>5%
                </span>
              </div>
            </div>
            {/* Card 3 */}
            <div className="bg-[#1b2529] rounded-xl p-5 border border-[#283539] hover:border-[#0db9f2]/30 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-6xl text-[#0db9f2]">hub</span>
              </div>
              <p className="text-slate-400 text-sm font-medium mb-2">Referral Pool Distributed</p>
              <div className="flex items-end gap-3">
                <h3 className="text-3xl font-bold text-white tracking-tight">₹8.4 Cr</h3>
                <span className="text-[#0bda57] text-sm font-bold flex items-center mb-1 bg-[#0bda57]/10 px-1.5 py-0.5 rounded">
                  <span className="material-symbols-outlined text-sm mr-0.5">trending_up</span>18%
                </span>
              </div>
            </div>
            {/* Card 4 */}
            <div className="bg-[#1b2529] rounded-xl p-5 border border-[#283539] hover:border-[#0db9f2]/30 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-6xl text-[#0db9f2]">water_drop</span>
              </div>
              <p className="text-slate-400 text-sm font-medium mb-2">Treasury Surplus</p>
              <div className="flex items-end gap-3">
                <h3 className="text-3xl font-bold text-white tracking-tight">₹1.2 Cr</h3>
                <span className="text-[#0bda57] text-sm font-bold flex items-center mb-1 bg-[#0bda57]/10 px-1.5 py-0.5 rounded">
                  <span className="material-symbols-outlined text-sm mr-0.5">trending_up</span>2%
                </span>
              </div>
            </div>
          </section>

          {/* Main Visualizer Area */}
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-8 flex-1 min-h-[500px]">
            {/* Sun Ray Visualizer (Centerpiece) */}
            <div className="xl:col-span-2 bg-[#1b2529] rounded-xl border border-[#283539] p-6 flex flex-col relative overflow-hidden">
              {/* Header */}
              <div className="flex justify-between items-start mb-6 z-10">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#0db9f2]">sunny</span>
                    Sun Ray Referral Visualizer
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">Live breakdown of the 20% Pool Distribution across 6 Levels</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-xs font-bold text-slate-300 bg-[#283539] hover:bg-white/10 rounded transition-colors border border-white/5">Export CSV</button>
                  <button className="px-3 py-1.5 text-xs font-bold text-[#0db9f2] bg-[#0db9f2]/10 hover:bg-[#0db9f2]/20 rounded transition-colors border border-[#0db9f2]/20">Live View</button>
                </div>
              </div>
              {/* Visualization Container */}
              <div className="flex-1 flex items-center justify-center relative">
                {/* Abstract Sunburst Using CSS/SVG */}
                <div className="relative w-[340px] h-[340px] md:w-[450px] md:h-[450px]">
                  {/* Glow background */}
                  <div className="absolute inset-0 bg-[#0db9f2]/5 rounded-full blur-3xl"></div>
                  {/* Center Core */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-[#1b2529] border-4 border-[#0db9f2]/30 flex flex-col items-center justify-center z-20 shadow-[0_0_30px_rgba(13,185,242,0.15)]">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Pool</p>
                    <p className="text-xl font-bold text-white">₹8.4 Cr</p>
                  </div>
                  {/* Rings (Conceptual representation of Sunburst) */}
                  {/* Ring 1 (Level 1 - 7%) */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-[16px] border-[#0db9f2]/80 z-10 hover:scale-105 transition-transform cursor-pointer group">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#283539] text-xs text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 shadow-lg">Level 1: 7%</div>
                  </div>
                  {/* Ring 2 (Level 2 - 5%) */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-[14px] border-[#0db9f2]/60 z-0 hover:scale-105 transition-transform cursor-pointer group">
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#283539] text-xs text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 shadow-lg">Level 2: 5%</div>
                  </div>
                  {/* Ring 3 (Level 3 - 2%) */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-76 h-76 md:w-80 md:h-80 rounded-full border-[10px] border-[#0db9f2]/40 -z-10 hover:scale-105 transition-transform cursor-pointer group"></div>
                  {/* Ring 4 (Level 4 - 2%) */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-88 h-88 md:w-96 md:h-96 rounded-full border-[8px] border-[#0db9f2]/30 -z-20 hover:scale-105 transition-transform cursor-pointer group"></div>
                  {/* Ring 5 (Level 5 - 2%) */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] md:w-[440px] md:h-[440px] rounded-full border-[6px] border-[#0db9f2]/20 -z-30 hover:scale-105 transition-transform cursor-pointer group"></div>
                  {/* Ring 6 (Level 6 - 2%) */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] md:w-[480px] md:h-[480px] rounded-full border-[4px] border-dashed border-[#0db9f2]/10 -z-40"></div>
                </div>
              </div>
              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-4 mt-6 z-10 border-t border-white/5 pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#0db9f2]/80"></div>
                  <span className="text-xs text-slate-300 font-medium">L1 (7%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#0db9f2]/60"></div>
                  <span className="text-xs text-slate-300 font-medium">L2 (5%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#0db9f2]/40"></div>
                  <span className="text-xs text-slate-300 font-medium">L3 (2%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#0db9f2]/30"></div>
                  <span className="text-xs text-slate-300 font-medium">L4-L6 (2% ea)</span>
                </div>
              </div>
            </div>

            {/* Side Panel: Treasury & Feed */}
            <div className="flex flex-col gap-6">
              {/* Treasury Overflow Monitor */}
              <div className="bg-[#1b2529] rounded-xl border border-[#283539] p-6 flex flex-col gap-4 relative shadow-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#f2c94c]">savings</span>
                    Treasury Overflow
                  </h3>
                  <span className="text-[10px] font-bold text-[#0bda57] uppercase bg-[#0bda57]/10 px-2 py-0.5 rounded border border-[#0bda57]/20">Active</span>
                </div>
                <p className="text-xs text-slate-400">Funds bypassing Level 6 accumulation.</p>
                {/* Visual Liquid Container */}
                <div className="h-32 bg-black/40 rounded-lg relative overflow-hidden border border-white/5 flex items-center justify-center">
                  {/* Liquid Animation CSS would go here, simulated with gradient */}
                  <div className="absolute bottom-0 left-0 right-0 h-[45%] bg-gradient-to-t from-[#f2c94c]/20 to-[#f2c94c]/60 border-t border-[#f2c94c]/50 shadow-[0_0_20px_rgba(242,201,76,0.3)]"></div>
                  {/* Grid */}
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                  <div className="relative z-10 text-center">
                    <span className="block text-3xl font-bold text-white drop-shadow-lg">₹1,240,500</span>
                    <span className="text-xs text-[#f2c94c] font-medium">+₹12k this hour</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div className="bg-[#283539] p-2 rounded border border-white/5">
                    <p className="text-[10px] text-slate-400 uppercase">Last Inflow</p>
                    <p className="text-sm font-bold text-white">₹450.00</p>
                  </div>
                  <div className="bg-[#283539] p-2 rounded border border-white/5">
                    <p className="text-[10px] text-slate-400 uppercase">Overflow Rate</p>
                    <p className="text-sm font-bold text-white">2.4%</p>
                  </div>
                </div>
              </div>
              {/* Live Ledger Feed */}
              <div className="bg-[#1b2529] rounded-xl border border-[#283539] p-0 flex flex-col flex-1 overflow-hidden min-h-[300px]">
                <div className="p-4 border-b border-[#283539] flex justify-between items-center bg-[#1b2529] sticky top-0 z-10">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400 text-sm">history</span>
                    Live Ledger
                  </h3>
                  <span className="w-2 h-2 bg-[#0bda57] rounded-full animate-pulse shadow-[0_0_8px_#0bda57]"></span>
                </div>
                <div className="overflow-y-auto p-2 space-y-1">
                  {/* Item 1 */}
                  <div className="flex items-center justify-between p-3 rounded hover:bg-[#283539]/50 transition-colors border border-transparent hover:border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#0db9f2]/10 flex items-center justify-center text-[#0db9f2]">
                        <span className="material-symbols-outlined text-sm">arrow_outward</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-200">L1 Commission</p>
                        <p className="text-xs text-slate-500">Ref: #U-88219</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#0db9f2]">+₹1,250</p>
                      <p className="text-[10px] text-slate-500">Just now</p>
                    </div>
                  </div>
                  {/* Item 2 */}
                  <div className="flex items-center justify-between p-3 rounded hover:bg-[#283539]/50 transition-colors border border-transparent hover:border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#0bda57]/10 flex items-center justify-center text-[#0bda57]">
                        <span className="material-symbols-outlined text-sm">add_card</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-200">New Investment</p>
                        <p className="text-xs text-slate-500">User: Alex K.</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">+₹50,000</p>
                      <p className="text-[10px] text-slate-500">2 min ago</p>
                    </div>
                  </div>
                  {/* Item 3 */}
                  <div className="flex items-center justify-between p-3 rounded hover:bg-[#283539]/50 transition-colors border border-transparent hover:border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#f2c94c]/10 flex items-center justify-center text-[#f2c94c]">
                        <span className="material-symbols-outlined text-sm">water_drop</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-200">Treasury Inflow</p>
                        <p className="text-xs text-slate-500">Overflow L6</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#f2c94c]">+₹450</p>
                      <p className="text-[10px] text-slate-500">5 min ago</p>
                    </div>
                  </div>
                  {/* Item 4 */}
                  <div className="flex items-center justify-between p-3 rounded hover:bg-[#283539]/50 transition-colors border border-transparent hover:border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#0db9f2]/10 flex items-center justify-center text-[#0db9f2]">
                        <span className="material-symbols-outlined text-sm">arrow_outward</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-200">L3 Commission</p>
                        <p className="text-xs text-slate-500">Ref: #U-22910</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#0db9f2]">+₹450</p>
                      <p className="text-[10px] text-slate-500">12 min ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
