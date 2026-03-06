"use client";

import { useState } from "react";

export default function InvestorPortfolioPage() {
  const [earnings] = useState([
    { month: "Jan", amount: 12500 },
    { month: "Feb", amount: 18200 },
    { month: "Mar", amount: 15800 },
    { month: "Apr", amount: 22100 },
    { month: "May", amount: 19500 },
    { month: "Jun", amount: 24800 },
  ]);

  return (
    <div className="bg-[#101622] text-slate-100 font-['Inter',sans-serif] min-h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0 bg-[#111318] border-r border-slate-800 flex flex-col h-screen overflow-y-auto sticky top-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#135bec] flex items-center justify-center text-white font-bold">
            <span className="material-symbols-outlined">trending_up</span>
          </div>
          <h1 className="text-white text-lg font-bold tracking-tight">InvestFlow</h1>
        </div>
        <div className="px-4 py-2">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-[#18202F] border border-[#283042] mb-6">
            <div className="bg-center bg-no-repeat bg-cover rounded-full h-10 w-10 shrink-0" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAjIt-6zNocQlx27SobHCX8Y3CNWcK6ANsVs-3IQrZkFq1H2OsEzEnkxANCdooCZRCRXM7NS8-bPMagrlVU_eQdU-TYC1F8RxmDpreCCl0S0be6nkGjlMx2LCw5MFW9k0yStIGzOFtsX3H6IxdAKepBdBA3mJ3hGsvbj2TRUxMjKjlErFTOGkYc-d5lzs6a90l-qIfbOhEPB28iDjLUcr-QdxgfQ_9DN3tIk-h4IM04iSK2UuZCUAFmNimXOV1VaOza6vjjOjaWT4eV");' }}></div>
            <div className="flex flex-col min-w-0">
              <h2 className="text-white text-sm font-medium truncate">Alex Morgan</h2>
              <p className="text-slate-400 text-xs truncate">Active Investor</p>
            </div>
          </div>
          <nav className="flex flex-col gap-1">
            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors group" href="#">
              <span className="material-symbols-outlined group-hover:text-white" style={{ fontSize: "20px" }}>dashboard</span>
              <span className="text-sm font-medium">Dashboard</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors group" href="#">
              <span className="material-symbols-outlined group-hover:text-white" style={{ fontSize: "20px" }}>pie_chart</span>
              <span className="text-sm font-medium">Portfolio</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#135bec] text-white shadow-lg shadow-[#135bec]/20 transition-colors" href="#">
              <span className="material-symbols-outlined text-white" style={{ fontSize: "20px" }}>account_balance_wallet</span>
              <span className="text-sm font-medium">Financials</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors group" href="#">
              <span className="material-symbols-outlined group-hover:text-white" style={{ fontSize: "20px" }}>diversity_3</span>
              <span className="text-sm font-medium">Network</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors group" href="#">
              <span className="material-symbols-outlined group-hover:text-white" style={{ fontSize: "20px" }}>settings</span>
              <span className="text-sm font-medium">Settings</span>
            </a>
          </nav>
        </div>
        <div className="mt-auto p-4 border-t border-slate-800">
          <button className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 px-4 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium">
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>logout</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen bg-[#101622] p-4 md:p-8 lg:p-10">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Financial Overview</h1>
              <p className="text-slate-400 mt-1">Track your ROI, referral income, and upcoming payouts.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-semibold border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Active Investor
              </span>
              <button className="px-4 py-2 bg-[#135bec] hover:bg-[#135bec]/90 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-[#135bec]/25 flex items-center gap-2">
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>download</span>
                Export Report
              </button>
            </div>
          </div>

          {/* The Big Three Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Card 1: Referral Earnings */}
            <div className="bg-[#18202F] rounded-xl p-6 border border-[#283042] flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#135bec]/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
              <div className="flex justify-between items-start z-10">
                <div className="p-2 bg-[#135bec]/10 rounded-lg text-[#135bec]">
                  <span className="material-symbols-outlined">group_add</span>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded bg-slate-800 text-slate-300">Lifetime</span>
              </div>
              <div className="mt-4 z-10">
                <p className="text-slate-400 text-sm font-medium">Referral Earnings</p>
                <h3 className="text-2xl md:text-3xl font-bold text-white mt-1">₹ 1,25,000</h3>
                <div className="flex items-center gap-1 mt-2 text-emerald-500 text-sm font-medium">
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_upward</span>
                  <span>12 active affiliates</span>
                </div>
              </div>
            </div>

            {/* Card 2: Disbursed Amount */}
            <div className="bg-[#18202F] rounded-xl p-6 border border-[#283042] flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
              <div className="flex justify-between items-start z-10">
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                  <span className="material-symbols-outlined">payments</span>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded bg-slate-800 text-slate-300">Verified</span>
              </div>
              <div className="mt-4 z-10">
                <p className="text-slate-400 text-sm font-medium">Total Disbursed</p>
                <h3 className="text-2xl md:text-3xl font-bold text-white mt-1">₹ 5,50,000</h3>
                <div className="flex items-center gap-1 mt-2 text-slate-400 text-sm">
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>check_circle</span>
                  <span>All payouts cleared</span>
                </div>
              </div>
            </div>

            {/* Card 3: Accumulated Earnings */}
            <div className="bg-[#18202F] rounded-xl p-6 border border-[#283042] flex flex-col justify-between relative overflow-hidden ring-1 ring-[#135bec]/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
              <div className="flex justify-between items-start z-10">
                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                  <span className="material-symbols-outlined">pending</span>
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">Upcoming</span>
              </div>
              <div className="mt-4 z-10">
                <p className="text-slate-400 text-sm font-medium">Accumulated (Pending)</p>
                <h3 className="text-2xl md:text-3xl font-bold text-white mt-1">₹ 22,500</h3>
                <div className="flex items-center gap-1 mt-2 text-slate-400 text-sm">
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>schedule</span>
                  <span>Next cycle: Feb 28</span>
                </div>
              </div>
            </div>
          </div>

          {/* Earnings Chart */}
          <div className="bg-[#18202F] rounded-xl border border-[#283042] p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">Earnings History</h3>
              <select className="bg-[#101622] border border-[#283042] rounded-lg px-3 py-2 text-sm text-slate-300">
                <option>Last 6 Months</option>
                <option>Last Year</option>
                <option>All Time</option>
              </select>
            </div>
            <div className="h-64 flex items-end gap-4">
              {earnings.map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-[#135bec]/20 rounded-t-lg relative overflow-hidden" style={{ height: `${(item.amount / 25000) * 100}%` }}>
                    <div className="absolute bottom-0 left-0 right-0 bg-[#135bec] rounded-t-lg"></div>
                  </div>
                  <span className="text-xs text-slate-400">{item.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-[#18202F] rounded-xl border border-[#283042] overflow-hidden">
            <div className="p-6 border-b border-[#283042]">
              <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
            </div>
            <div className="divide-y divide-[#283042]">
              {[
                { date: "Feb 15, 2026", type: "Commission", level: "Level 1", amount: "+₹5,500", status: "Completed" },
                { date: "Feb 10, 2026", type: "Commission", level: "Level 2", amount: "+₹2,200", status: "Completed" },
                { date: "Feb 5, 2026", type: "Investment", level: "Self", amount: "₹50,000", status: "Verified" },
                { date: "Jan 28, 2026", type: "Commission", level: "Level 1", amount: "+₹4,800", status: "Completed" },
              ].map((tx, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'Commission' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-[#135bec]/10 text-[#135bec]'}`}>
                      <span className="material-symbols-outlined text-sm">{tx.type === 'Commission' ? 'arrow_downward' : 'add_circle'}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{tx.type}</p>
                      <p className="text-xs text-slate-400">{tx.level} - {tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${tx.amount.startsWith('+') ? 'text-emerald-500' : 'text-white'}`}>{tx.amount}</p>
                    <span className="text-xs text-emerald-500">{tx.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
