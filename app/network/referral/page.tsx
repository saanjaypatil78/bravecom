"use client";

import { useState } from "react";

export default function ReferralNetworkPage() {
  const [network] = useState({
    totalReferrals: 24,
    totalEarnings: 125000,
    level1: 8,
    level2: 6,
    level3: 4,
    level4: 3,
    level5: 2,
    level6: 1,
  });

  const [referrals] = useState([
    { id: 1, name: "Rahul Sharma", level: 1, investment: 50000, earnings: 3500, status: "Active" },
    { id: 2, name: "Priya Singh", level: 1, investment: 75000, earnings: 5250, status: "Active" },
    { id: 3, name: "Amit Kumar", level: 2, investment: 30000, earnings: 1500, status: "Active" },
    { id: 4, name: "Sneha Gupta", level: 2, investment: 25000, earnings: 1250, status: "Active" },
    { id: 5, name: "Raj Patel", level: 3, investment: 40000, earnings: 1200, status: "Pending" },
    { id: 6, name: "Anita Desai", level: 1, investment: 100000, earnings: 7000, status: "Active" },
  ]);

  return (
    <div className="bg-[#221c10] text-white min-h-screen font-['Inter',sans-serif]">
      {/* Header */}
      <header className="bg-[#2a2418] border-b border-[#3d3520] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#f4af25] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#221c10]">diversity_3</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Referral Network</h1>
              <p className="text-sm text-[#f4af25]">Sun Ray 6-Level Affiliate View</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">Your ID: <span className="text-white font-mono">SR-88219</span></span>
            <div className="w-10 h-10 rounded-full bg-[#f4af25]/20 flex items-center justify-center text-[#f4af25] font-bold">
              A
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#2a2418] rounded-xl p-5 border border-[#3d3520]">
            <p className="text-gray-400 text-sm mb-1">Total Referrals</p>
            <p className="text-3xl font-bold text-white">{network.totalReferrals}</p>
          </div>
          <div className="bg-[#2a2418] rounded-xl p-5 border border-[#3d3520]">
            <p className="text-gray-400 text-sm mb-1">Total Earnings</p>
            <p className="text-3xl font-bold text-[#f4af25]">₹{network.totalEarnings.toLocaleString()}</p>
          </div>
          <div className="bg-[#2a2418] rounded-xl p-5 border border-[#3d3520]">
            <p className="text-gray-400 text-sm mb-1">Level 1 Referrals</p>
            <p className="text-3xl font-bold text-white">{network.level1}</p>
          </div>
          <div className="bg-[#2a2418] rounded-xl p-5 border border-[#3d3520]">
            <p className="text-gray-400 text-sm mb-1">Active This Month</p>
            <p className="text-3xl font-bold text-emerald-500">18</p>
          </div>
        </div>

        {/* Referral Tree Visualization */}
        <div className="bg-[#2a2418] rounded-xl border border-[#3d3520] p-6 mb-8">
          <h2 className="text-lg font-bold mb-6">Network Visualization</h2>
          <div className="relative h-80 flex items-center justify-center">
            {/* Center Sun */}
            <div className="absolute w-20 h-20 rounded-full bg-[#f4af25] flex items-center justify-center z-10 shadow-lg shadow-[#f4af25]/30">
              <span className="material-symbols-outlined text-[#221c10] text-3xl">wb_sunny</span>
            </div>
            {/* Orbit rings */}
            <div className="absolute w-40 h-40 rounded-full border border-dashed border-[#f4af25]/30"></div>
            <div className="absolute w-64 h-64 rounded-full border border-dashed border-[#f4af25]/20"></div>
            <div className="absolute w-96 h-96 rounded-full border border-dashed border-[#f4af25]/10"></div>
            {/* Level nodes */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#f4af25]/20 border border-[#f4af25] flex items-center justify-center text-xs font-bold">
              L1
            </div>
            <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 rounded-full bg-[#f4af25]/20 border border-[#f4af25] flex items-center justify-center text-xs font-bold">
              L2
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#f4af25]/20 border border-[#f4af25] flex items-center justify-center text-xs font-bold">
              L3
            </div>
          </div>
        </div>

        {/* Referral List */}
        <div className="bg-[#2a2418] rounded-xl border border-[#3d3520] overflow-hidden">
          <div className="p-6 border-b border-[#3d3520]">
            <h2 className="text-lg font-bold">Your Referrals</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#221c10]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Level</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Investment</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Your Earnings</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3d3520]">
                {referrals.map((ref) => (
                  <tr key={ref.id} className="hover:bg-[#3d3520]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#f4af25]/20 flex items-center justify-center text-[#f4af25] font-bold">
                          {ref.name[0]}
                        </div>
                        <span className="font-medium">{ref.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded bg-[#f4af25]/10 text-[#f4af25] text-xs font-bold">
                        Level {ref.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono">₹{ref.investment.toLocaleString()}</td>
                    <td className="px-6 py-4 font-mono text-[#f4af25]">+₹{ref.earnings.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${ref.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-amber-500/10 text-amber-500"
                        }`}>
                        {ref.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
