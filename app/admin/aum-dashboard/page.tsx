"use client";

import { useState } from "react";

export default function AUMDashboardPage() {
  const [stats] = useState({
    totalAUM: 45200000,
    targetAUM: 111000000,
    growthRate: 12.5,
    investors: 1245,
    avgTicket: 36300,
  });

  const [monthlyData] = useState([
    { month: "Jan", aum: 32000000 },
    { month: "Feb", aum: 34500000 },
    { month: "Mar", aum: 36200000 },
    { month: "Apr", aum: 38000000 },
    { month: "May", aum: 41000000 },
    { month: "Jun", aum: 45200000 },
  ]);

  const progress = Math.round((stats.totalAUM / stats.targetAUM) * 100);

  return (
    <div className="min-h-screen bg-[#0F172A] text-white font-['Inter',sans-serif]">
      {/* Header */}
      <header className="bg-[#1E293B] border-b border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#4F46E5] flex items-center justify-center">
              <span className="material-symbols-outlined text-white">account_balance</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">AUM Dashboard</h1>
              <p className="text-sm text-slate-400">Assets Under Management</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400">Last updated: Just now</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* AUM Progress Card */}
        <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-2xl p-8 border border-slate-700 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <p className="text-slate-400 text-sm mb-1">Current AUM</p>
              <h2 className="text-5xl font-bold text-white">₹{(stats.totalAUM / 10000000).toFixed(1)} Cr</h2>
              <p className="text-slate-400 mt-2">
                Target: ₹{(stats.targetAUM / 10000000).toFixed(0)} Cr
              </p>
            </div>
            <div className="text-right">
              <p className="text-emerald-400 text-2xl font-bold">+{stats.growthRate}%</p>
              <p className="text-slate-400 text-sm">vs last month</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative h-8 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-white drop-shadow-lg">{progress}% of goal</span>
            </div>
          </div>

          {/* SEBI Marker */}
          <div className="relative mt-6">
            <div className="absolute" style={{ left: '30%' }}>
              <div className="text-amber-400 text-xs font-bold">SEBI Trigger</div>
              <div className="w-px h-4 bg-amber-400"></div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#1E293B] rounded-xl p-5 border border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined text-[#4F46E5]">groups</span>
              <span className="text-slate-400 text-sm">Total Investors</span>
            </div>
            <p className="text-3xl font-bold">{stats.investors.toLocaleString()}</p>
          </div>
          <div className="bg-[#1E293B] rounded-xl p-5 border border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined text-emerald-500">trending_up</span>
              <span className="text-slate-400 text-sm">Growth Rate</span>
            </div>
            <p className="text-3xl font-bold text-emerald-500">+{stats.growthRate}%</p>
          </div>
          <div className="bg-[#1E293B] rounded-xl p-5 border border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined text-amber-500">payments</span>
              <span className="text-slate-400 text-sm">Avg Ticket Size</span>
            </div>
            <p className="text-3xl font-bold">₹{(stats.avgTicket / 100000).toFixed(1)}L</p>
          </div>
          <div className="bg-[#1E293B] rounded-xl p-5 border border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined text-purple-500">savings</span>
              <span className="text-slate-400 text-sm">Remaining</span>
            </div>
            <p className="text-3xl font-bold">₹{((stats.targetAUM - stats.totalAUM) / 10000000).toFixed(1)}Cr</p>
          </div>
        </div>

        {/* AUM Growth Chart */}
        <div className="bg-[#1E293B] rounded-xl border border-slate-700 p-6">
          <h3 className="text-lg font-bold mb-6">AUM Growth Trend</h3>
          <div className="h-64 flex items-end gap-4">
            {monthlyData.map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-[#4F46E5] rounded-t-lg hover:bg-[#6366F1] transition-colors"
                  style={{ height: `${(item.aum / stats.totalAUM) * 100}%` }}
                ></div>
                <span className="text-xs text-slate-400">{item.month}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
