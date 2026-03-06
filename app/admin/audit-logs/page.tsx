"use client";

import { useState } from "react";

export default function AuditLogsPage() {
  const [logs] = useState([
    { id: 1, timestamp: "2026-02-25 14:32:05", user: "Admin", action: "Commission Distribution", details: "Monthly cycle executed", status: "Success" },
    { id: 2, timestamp: "2026-02-25 14:30:12", user: "System", action: "User Registration", details: "New investor: Rahul S.", status: "Success" },
    { id: 3, timestamp: "2026-02-25 14:28:45", user: "Admin", action: "AUM Adjustment", details: "Manual correction: +₹50,000", status: "Success" },
    { id: 4, timestamp: "2026-02-25 14:25:33", user: "System", action: "Payout Processing", details: "Disbursed: ₹2,45,000 to 12 users", status: "Success" },
    { id: 5, timestamp: "2026-02-25 14:20:10", user: "Admin", action: "Settings Update", details: "Commission rates modified", status: "Warning" },
    { id: 6, timestamp: "2026-02-25 14:15:22", user: "Investor", action: "Investment", details: "New investment: ₹1,00,000", status: "Success" },
    { id: 7, timestamp: "2026-02-25 14:10:05", user: "System", action: "Backup", details: "Daily database backup completed", status: "Success" },
    { id: 8, timestamp: "2026-02-25 14:05:00", user: "System", action: "Security Alert", details: "Failed login attempt detected", status: "Error" },
  ]);

  return (
    <div className="min-h-screen bg-[#111618] text-slate-100 font-['Inter',sans-serif]">
      {/* Header */}
      <header className="bg-[#1b2529] border-b border-[#283539] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#0db9f2]/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#0db9f2]">receipt_long</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Audit Logs</h1>
              <p className="text-sm text-slate-400">System Event Tracking</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-[#283539] rounded-lg text-sm font-medium hover:bg-[#1b2529] transition-colors">
              Export CSV
            </button>
            <button className="px-4 py-2 bg-[#0db9f2] text-[#111618] rounded-lg text-sm font-bold hover:bg-[#0db9f2]/90 transition-colors">
              Filter
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#1b2529] rounded-xl p-5 border border-[#283539]">
            <p className="text-slate-400 text-sm mb-1">Total Events (24h)</p>
            <p className="text-3xl font-bold">1,245</p>
          </div>
          <div className="bg-[#1b2529] rounded-xl p-5 border border-[#283539]">
            <p className="text-slate-400 text-sm mb-1">Successful</p>
            <p className="text-3xl font-bold text-emerald-500">1,180</p>
          </div>
          <div className="bg-[#1b2529] rounded-xl p-5 border border-[#283539]">
            <p className="text-slate-400 text-sm mb-1">Warnings</p>
            <p className="text-3xl font-bold text-amber-500">52</p>
          </div>
          <div className="bg-[#1b2529] rounded-xl p-5 border border-[#283539]">
            <p className="text-slate-400 text-sm mb-1">Errors</p>
            <p className="text-3xl font-bold text-red-500">13</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-[#1b2529] rounded-xl border border-[#283539] p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <select className="bg-[#283539] border border-[#3b4e54] rounded-lg px-4 py-2 text-sm">
              <option>All Events</option>
              <option>User Actions</option>
              <option>System Events</option>
              <option>Security</option>
            </select>
            <select className="bg-[#283539] border border-[#3b4e54] rounded-lg px-4 py-2 text-sm">
              <option>All Status</option>
              <option>Success</option>
              <option>Warning</option>
              <option>Error</option>
            </select>
            <input 
              type="date" 
              className="bg-[#283539] border border-[#3b4e54] rounded-lg px-4 py-2 text-sm"
            />
            <input 
              type="text" 
              placeholder="Search logs..."
              className="bg-[#283539] border border-[#3b4e54] rounded-lg px-4 py-2 text-sm flex-1"
            />
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-[#1b2529] rounded-xl border border-[#283539] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#283539]/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Timestamp</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">User</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Action</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Details</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#283539]">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#283539]/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm text-slate-400">{log.timestamp}</td>
                    <td className="px-6 py-4">
                      <span className="text-white">{log.user}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[#0db9f2] font-medium">{log.action}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">{log.details}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                        log.status === 'Success' ? 'bg-emerald-500/10 text-emerald-500' :
                        log.status === 'Warning' ? 'bg-amber-500/10 text-amber-500' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          log.status === 'Success' ? 'bg-emerald-500' :
                          log.status === 'Warning' ? 'bg-amber-500' :
                          'bg-red-500'
                        }`}></span>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
