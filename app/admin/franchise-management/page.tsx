"use client";

import { useState } from "react";

export default function FranchiseManagementPage() {
  const [partners] = useState([
    { id: 1, name: "Mumbai Central", partner: "Rahul Sharma", region: "West", investors: 245, revenue: 1250000, status: "Active", tier: "Gold" },
    { id: 2, name: "Delhi NCR", partner: "Priya Singh", region: "North", investors: 312, revenue: 1850000, status: "Active", tier: "Platinum" },
    { id: 3, name: "Bangalore South", partner: "Arun Kumar", region: "South", investors: 189, revenue: 980000, status: "Active", tier: "Silver" },
    { id: 4, name: "Chennai East", partner: "Karthik R", region: "South", investors: 156, revenue: 780000, status: "Active", tier: "Silver" },
    { id: 5, name: "Kolkata Hub", partner: "Sanjay Gupta", region: "East", investors: 98, revenue: 450000, status: "Pending", tier: "Bronze" },
  ]);

  return (
    <div className="bg-[#101922] text-white font-['Inter',sans-serif] h-screen flex overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-72 hidden lg:flex flex-col border-r border-[#283039] bg-[#101922] flex-shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-[#1173d4]/20 p-2 rounded-lg text-[#1173d4]">
              <span className="material-symbols-outlined text-3xl">token</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold leading-tight">InvestFlow</h1>
              <p className="text-[#9dabb9] text-xs font-medium">Enterprise Admin</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#9dabb9] hover:bg-[#1A2632] transition-colors group" href="#">
              <span className="material-symbols-outlined group-hover:text-[#1173d4] transition-colors">grid_view</span>
              <span className="text-sm font-medium">Dashboard</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#1173d4]/10 text-[#1173d4]" href="#">
              <span className="material-symbols-outlined fill-1">groups</span>
              <span className="text-sm font-bold">Franchise Mgmt</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#9dabb9] hover:bg-[#1A2632] transition-colors group" href="#">
              <span className="material-symbols-outlined group-hover:text-[#1173d4] transition-colors">work</span>
              <span className="text-sm font-medium">Investors</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#9dabb9] hover:bg-[#1A2632] transition-colors group" href="#">
              <span className="material-symbols-outlined group-hover:text-[#1173d4] transition-colors">payments</span>
              <span className="text-sm font-medium">Commissions</span>
            </a>
            <div className="my-2 border-t border-[#283039]"></div>
            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#9dabb9] hover:bg-[#1A2632] transition-colors group" href="#">
              <span className="material-symbols-outlined group-hover:text-[#1173d4] transition-colors">settings</span>
              <span className="text-sm font-medium">Settings</span>
            </a>
          </div>
        </div>
        <div className="mt-auto p-6 border-t border-[#283039]">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-[#1A2632]">
            <div className="w-10 h-10 rounded-full bg-[#1173d4]/20 flex items-center justify-center text-[#1173d4] font-bold">A</div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">Admin User</span>
              <span className="text-xs text-[#9dabb9]">Super Admin</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Franchise Management</h2>
            <p className="text-[#9dabb9] text-sm mt-1">Manage regional partners and their performance</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-[#1A2632] border border-[#283039] text-white rounded-lg text-sm font-medium hover:bg-[#283039] transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>download</span>
              Export
            </button>
            <button className="px-4 py-2 bg-[#1173d4] text-white rounded-lg text-sm font-medium hover:bg-[#1173d4]/90 transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>add</span>
              Add Partner
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#1A2632] rounded-xl p-5 border border-[#283039]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#9dabb9] text-sm">Total Partners</span>
              <span className="material-symbols-outlined text-[#1173d4]">groups</span>
            </div>
            <p className="text-2xl font-bold text-white">24</p>
            <p className="text-xs text-emerald-500 mt-1">+3 this month</p>
          </div>
          <div className="bg-[#1A2632] rounded-xl p-5 border border-[#283039]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#9dabb9] text-sm">Total Investors</span>
              <span className="material-symbols-outlined text-[#1173d4]">person</span>
            </div>
            <p className="text-2xl font-bold text-white">1,245</p>
            <p className="text-xs text-emerald-500 mt-1">+156 this month</p>
          </div>
          <div className="bg-[#1A2632] rounded-xl p-5 border border-[#283039]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#9dabb9] text-sm">Revenue (MTD)</span>
              <span className="material-symbols-outlined text-emerald-500">payments</span>
            </div>
            <p className="text-2xl font-bold text-white">₹45.2L</p>
            <p className="text-xs text-emerald-500 mt-1">+12% vs last month</p>
          </div>
          <div className="bg-[#1A2632] rounded-xl p-5 border border-[#283039]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#9dabb9] text-sm">Pending Requests</span>
              <span className="material-symbols-outlined text-amber-500">pending</span>
            </div>
            <p className="text-2xl font-bold text-white">5</p>
            <p className="text-xs text-amber-500 mt-1">Awaiting approval</p>
          </div>
        </div>

        {/* Partners Table */}
        <div className="bg-[#1A2632] rounded-xl border border-[#283039] overflow-hidden">
          <div className="p-6 border-b border-[#283039]">
            <h3 className="text-lg font-bold text-white">Regional Partners</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#283039]/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#9dabb9] uppercase">Partner Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#9dabb9] uppercase">Region</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#9dabb9] uppercase">Investors</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#9dabb9] uppercase">Revenue</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#9dabb9] uppercase">Tier</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#9dabb9] uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#9dabb9] uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#283039]">
                {partners.map((partner) => (
                  <tr key={partner.id} className="hover:bg-[#283039]/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{partner.name}</p>
                        <p className="text-sm text-[#9dabb9]">{partner.partner}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white">{partner.region}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-mono">{partner.investors}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-mono">₹{(partner.revenue / 100000).toFixed(1)}L</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                        partner.tier === 'Platinum' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                        partner.tier === 'Gold' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        partner.tier === 'Silver' ? 'bg-gray-400/10 text-gray-300 border border-gray-400/20' :
                        'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                      }`}>
                        {partner.tier}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                        partner.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${partner.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        {partner.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-[#283039] rounded-lg transition-colors">
                          <span className="material-symbols-outlined text-[#9dabb9]">visibility</span>
                        </button>
                        <button className="p-2 hover:bg-[#283039] rounded-lg transition-colors">
                          <span className="material-symbols-outlined text-[#9dabb9]">edit</span>
                        </button>
                      </div>
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
