"use client";

import { useState } from "react";

export default function DisbursementPortalPage() {
  const [disbursements] = useState([
    { id: 1, user: "Rahul Sharma", amount: 5500, date: "2026-02-25", status: "Processed", bank: "HDFC ****4521" },
    { id: 2, user: "Priya Singh", amount: 8200, date: "2026-02-25", status: "Processed", bank: "ICICI ****8832" },
    { id: 3, user: "Amit Kumar", amount: 3500, date: "2026-02-24", status: "Pending", bank: "SBI ****2291" },
    { id: 4, user: "Sneha Gupta", amount: 12000, date: "2026-02-24", status: "Processed", bank: "Axis ****7743" },
    { id: 5, user: "Raj Patel", amount: 4500, date: "2026-02-23", status: "Failed", bank: "IDBI ****1122" },
  ]);

  const totalProcessed = disbursements.filter(d => d.status === "Processed").reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="min-h-screen bg-[#0F172A] text-white font-['Inter',sans-serif]">
      <header className="bg-[#1E293B] border-b border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Disbursement Portal</h1>
              <p className="text-sm text-slate-400">Payout Management</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#1E293B] rounded-xl p-5 border border-slate-700">
            <p className="text-slate-400 text-sm mb-1">Total Disbursed</p>
            <p className="text-3xl font-bold text-emerald-500">₹{totalProcessed.toLocaleString()}</p>
          </div>
          <div className="bg-[#1E293B] rounded-xl p-5 border border-slate-700">
            <p className="text-slate-400 text-sm mb-1">Pending</p>
            <p className="text-3xl font-bold text-amber-500">₹3,500</p>
          </div>
          <div className="bg-[#1E293B] rounded-xl p-5 border border-slate-700">
            <p className="text-slate-400 text-sm mb-1">Failed</p>
            <p className="text-3xl font-bold text-red-500">₹4,500</p>
          </div>
          <div className="bg-[#1E293B] rounded-xl p-5 border border-slate-700">
            <p className="text-slate-400 text-sm mb-1">This Cycle</p>
            <p className="text-3xl font-bold">₹33,700</p>
          </div>
        </div>

        <div className="bg-[#1E293B] rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-700 flex justify-between items-center">
            <h2 className="text-lg font-bold">Recent Disbursements</h2>
            <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-bold hover:bg-emerald-600">
              Process All Pending
            </button>
          </div>
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400">Bank</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {disbursements.map((d) => (
                <tr key={d.id} className="hover:bg-slate-700/30">
                  <td className="px-6 py-4 font-medium">{d.user}</td>
                  <td className="px-6 py-4 font-mono">₹{d.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-slate-400">{d.date}</td>
                  <td className="px-6 py-4 text-slate-400">{d.bank}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      d.status === "Processed" ? "bg-emerald-500/10 text-emerald-500" :
                      d.status === "Pending" ? "bg-amber-500/10 text-amber-500" :
                      "bg-red-500/10 text-red-500"
                    }`}>{d.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
