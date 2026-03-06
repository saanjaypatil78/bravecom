"use client";

import { useState } from "react";

export default function CommissionSettingsPage() {
  const [commissionLevels] = useState([
    { level: 1, percentage: 7, minInvestment: 10000, maxInvestment: 50000 },
    { level: 2, percentage: 5, minInvestment: 10000, maxInvestment: 100000 },
    { level: 3, percentage: 3, minInvestment: 10000, maxInvestment: 200000 },
    { level: 4, percentage: 2, minInvestment: 10000, maxInvestment: 500000 },
    { level: 5, percentage: 2, minInvestment: 10000, maxInvestment: 1000000 },
    { level: 6, percentage: 1, minInvestment: 10000, maxInvestment: 5000000 },
  ]);

  return (
    <div className="bg-[#0F172A] text-gray-100 font-['Inter',sans-serif] min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-[#1E293B] border-b border-gray-700 sticky top-0 z-30">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 flex items-center gap-2">
                <span className="material-icons text-[#4F46E5] text-3xl">analytics</span>
                <h1 className="text-xl font-bold tracking-tight text-white">Admin Portal</h1>
              </div>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <a className="border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium" href="#">Dashboard</a>
                <a className="border-[#4F46E5] text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium" href="#">Commission Config</a>
                <a className="border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium" href="#">Franchise</a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="bg-[#4F46E5] hover:bg-[#4338ca] text-white px-4 py-2 rounded text-sm font-medium shadow-sm transition-colors flex items-center gap-2">
                <span className="material-icons text-sm">save</span>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden h-[calc(100vh-64px)] w-full max-w-[1920px] mx-auto p-4 lg:p-6 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white leading-tight">Commission Structure</h2>
            <p className="text-sm text-gray-400 mt-1">Configure 6-Level affiliate commissions, admin charges, and profit distribution tiers.</p>
          </div>
          <div className="flex gap-4 items-center bg-[#1E293B] p-2 rounded-lg border border-gray-700 shadow-sm">
            <div className="px-3 border-r border-gray-700">
              <span className="text-xs text-gray-400 uppercase font-semibold">Base Currency</span>
              <div className="font-medium text-sm">INR (₹)</div>
            </div>
            <div className="px-3">
              <span className="text-xs text-gray-400 uppercase font-semibold">Pool</span>
              <div className="font-medium text-sm">20% of AUM</div>
            </div>
          </div>
        </div>

        {/* Commission Levels Table */}
        <div className="bg-[#1E293B] rounded-xl border border-gray-700 overflow-hidden flex-1">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-lg font-bold text-white">Referral Commission Tiers</h3>
            <p className="text-sm text-gray-400 mt-1">Set percentage allocations for each referral level</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Level</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Commission %</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Min Investment</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Max Investment</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Pool Share</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {commissionLevels.map((level) => (
                  <tr key={level.level} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#4F46E5]/10 text-[#4F46E5] flex items-center justify-center font-bold">
                          L{level.level}
                        </div>
                        <span className="text-white font-medium">Level {level.level}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          defaultValue={level.percentage}
                          className="w-20 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white font-mono text-center focus:outline-none focus:border-[#4F46E5]"
                        />
                        <span className="text-gray-400">%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-mono">₹{level.minInvestment.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-mono">₹{level.maxInvestment.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-32 bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div className="bg-[#4F46E5] h-full" style={{ width: `${level.percentage}%` }}></div>
                      </div>
                      <span className="text-xs text-gray-400 mt-1 block">{level.percentage}%</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Admin Charges & Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#1E293B] rounded-xl border border-gray-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Admin Charges</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Platform Fee</p>
                  <p className="text-sm text-gray-400">Annual maintenance charge</p>
                </div>
                <div className="flex items-center gap-2">
                  <input type="number" defaultValue={2} className="w-20 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white font-mono text-center focus:outline-none focus:border-[#4F46E5]" />
                  <span className="text-gray-400">%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">SEBI Compliance Fee</p>
                  <p className="text-sm text-gray-400">Regulatory charges</p>
                </div>
                <div className="flex items-center gap-2">
                  <input type="number" defaultValue={0.5} className="w-20 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white font-mono text-center focus:outline-none focus:border-[#4F46E5]" />
                  <span className="text-gray-400">%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Withdrawal Processing Fee</p>
                  <p className="text-sm text-gray-400">Per transaction charge</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">₹</span>
                  <input type="number" defaultValue={25} className="w-20 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white font-mono text-center focus:outline-none focus:border-[#4F46E5]" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1E293B] rounded-xl border border-gray-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Distribution Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Disbursement Cycle</p>
                  <p className="text-sm text-gray-400">Frequency of commission payouts</p>
                </div>
                <select className="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-[#4F46E5]">
                  <option>Monthly</option>
                  <option>Weekly</option>
                  <option>Bi-weekly</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Minimum Payout</p>
                  <p className="text-sm text-gray-400">Threshold for automatic transfer</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">₹</span>
                  <input type="number" defaultValue={500} className="w-24 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white font-mono text-center focus:outline-none focus:border-[#4F46E5]" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">TDS Deduction</p>
                  <p className="text-sm text-gray-400">Tax deducted at source</p>
                </div>
                <div className="flex items-center gap-2">
                  <input type="number" defaultValue={10} className="w-20 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white font-mono text-center focus:outline-none focus:border-[#4F46E5]" />
                  <span className="text-gray-400">%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
