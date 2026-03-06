"use client";

import { useState } from "react";

export default function TreasuryPage() {
  const [treasury] = useState({
    total: 1240500,
    overflow: 240500,
    lastInflow: 450,
    overflowRate: 2.4,
  });

  return (
    <div className="min-h-screen bg-[#111618] text-slate-100 font-['Space_Grotesk',sans-serif]">
      <header className="bg-[#1b2529] border-b border-[#283539] px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#f2c94c]/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-[#f2c94c]">savings</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">Treasury Management</h1>
            <p className="text-sm text-slate-400">Fund Overflow Tracking</p>
          </div>
        </div>
      </header>

      <main className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#1b2529] rounded-xl p-5 border border-[#283539]">
            <p className="text-slate-400 text-sm mb-1">Total Treasury</p>
            <p className="text-3xl font-bold text-white">₹{(treasury.total / 100000).toFixed(2)}L</p>
          </div>
          <div className="bg-[#1b2529] rounded-xl p-5 border border-[#283539]">
            <p className="text-slate-400 text-sm mb-1">Overflow Pool</p>
            <p className="text-3xl font-bold text-[#f2c94c]">₹{(treasury.overflow / 1000).toFixed(0)}k</p>
          </div>
          <div className="bg-[#1b2529] rounded-xl p-5 border border-[#283539]">
            <p className="text-slate-400 text-sm mb-1">Last Inflow</p>
            <p className="text-3xl font-bold">₹{treasury.lastInflow}</p>
          </div>
          <div className="bg-[#1b2529] rounded-xl p-5 border border-[#283539]">
            <p className="text-slate-400 text-sm mb-1">Overflow Rate</p>
            <p className="text-3xl font-bold text-[#f2c94c]">{treasury.overflowRate}%</p>
          </div>
        </div>

        <div className="bg-[#1b2529] rounded-xl border border-[#283539] p-6">
          <h2 className="text-xl font-bold mb-6">Treasury Flow</h2>
          <div className="h-48 bg-black/40 rounded-lg relative overflow-hidden flex items-center justify-center">
            <div className="absolute bottom-0 left-0 right-0 h-[45%] bg-gradient-to-t from-[#f2c94c]/20 to-[#f2c94c]/60"></div>
            <div className="relative z-10 text-center">
              <span className="block text-4xl font-bold">₹12,40,500</span>
              <span className="text-sm text-[#f2c94c]">+₹12k this hour</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
