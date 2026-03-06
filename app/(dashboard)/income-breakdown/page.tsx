"use client";

import { useState } from "react";
import { Search, Plus, Edit2, Trash2, ShieldAlert, Filter } from "lucide-react";

type Role = "ADMIN" | "FRANCHISE_PARTNER" | "TEAM_LEADER" | "INVESTOR";

const mockEntries = [
    { id: 1, date: "2026-02-23", level: "Self", name: "System", type: "Monthly Investor Yield (15%)", amount: 15000, status: "Processing" },
    { id: 2, date: "2026-02-23", level: "L1 (Direct)", name: "Rahul Sharma", type: "Referral Commission (20% of Yield)", amount: 3000, status: "Cleared" },
    { id: 3, date: "2026-02-24", level: "L2 (Indirect)", name: "Anita Desai", type: "Referral Commission (10% of Yield)", amount: 1500, status: "Cleared" },
    { id: 4, date: "2026-02-24", level: "Admin Pool", name: "Global System", type: "Admin Operational Fee (10% of Yield)", amount: 1500, status: "Cleared" },
    { id: 5, date: "2026-02-25", level: "Royalty Pool", name: "Platinum Tier", type: "Volume Royalty (3% of Principal)", amount: 3000, status: "Pending" },
    { id: 6, date: "2026-02-25", level: "Corporate", name: "Treasury", type: "Operational Overhead (5% of Yield)", amount: 750, status: "Cleared" },
    { id: 7, date: "2026-02-25", level: "Corporate", name: "Compliance", type: "Tax Reservoir (5% of Yield)", amount: 750, status: "Cleared" },
    { id: 8, date: "2026-02-25", level: "Corporate", name: "Fortress", type: "Reserve Safety Fund (5% of Yield)", amount: 750, status: "Holding" },
];

export default function IncomeBreakdownPage() {
    const [simulatedRole, setSimulatedRole] = useState<Role>("ADMIN");
    const [entries, setEntries] = useState(mockEntries);

    const handleDelete = (id: number) => {
        if (simulatedRole !== "ADMIN") return;
        if (confirm("ADMIN PERMISSION REQ: Are you sure you want to delete this financial entry?")) {
            setEntries(entries.filter(e => e.id !== id));
        }
    };

    const handleEdit = (id: number) => {
        if (simulatedRole !== "ADMIN") return;
        const amt = prompt("ADMIN PERMISSION REQ: Enter new adjusted amount:");
        if (amt && !isNaN(Number(amt))) {
            setEntries(entries.map(e => e.id === id ? { ...e, amount: Number(amt) } : e));
        }
    };

    const handleAdd = () => {
        if (simulatedRole !== "ADMIN") return;
        const amt = prompt("ADMIN PERMISSION REQ: Enter manual ledger injection amount:");
        if (amt && !isNaN(Number(amt))) {
            const newEntry = {
                id: Date.now(),
                date: new Date().toISOString().split('T')[0],
                level: "Manual Overlay",
                name: "Admin Adjustment",
                type: "Manual Credit",
                amount: Number(amt),
                status: "Cleared"
            };
            setEntries([newEntry, ...entries]);
        }
    };

    return (
        <div className="flex-1 p-8 overflow-y-auto bg-[#050B14] font-sans">
            {/* Header & RBAC Toggle */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                        Income Breakdown Ledger
                        {simulatedRole === "ADMIN" && <span className="bg-purple-500/20 text-purple-400 border border-purple-500/50 text-[10px] px-2 py-0.5 rounded-full uppercase">Admin Privileges</span>}
                        {simulatedRole === "FRANCHISE_PARTNER" && <span className="bg-blue-500/20 text-blue-400 border border-blue-500/50 text-[10px] px-2 py-0.5 rounded-full uppercase">Franchise Node</span>}
                        {simulatedRole === "TEAM_LEADER" && <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 text-[10px] px-2 py-0.5 rounded-full uppercase">Team Leader</span>}
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Granular View: Invested Amount, Multi-Tier Referral Commissions & Disbursals</p>
                </div>

                <div className="flex flex-wrap gap-2 items-center bg-[#0B121C] p-2 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pl-2 pr-4 border-r border-slate-800">Simulate RBAC As:</span>
                    {(["ADMIN", "FRANCHISE_PARTNER", "TEAM_LEADER", "INVESTOR"] as Role[]).map(r => (
                        <button
                            key={r}
                            onClick={() => setSimulatedRole(r)}
                            className={`text-[10px] font-bold px-3 py-1.5 rounded transition-all tracking-widest ${simulatedRole === r ? 'bg-[#1173d4] text-white shadow-lg' : 'text-slate-500 hover:bg-slate-800 hover:text-white'}`}
                        >
                            {r.replace("_", " ")}
                        </button>
                    ))}
                </div>
            </div>

            {/* Financial Summary Cards - 100k Benchmark Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Card 1: Retained Capital */}
                <div className="bg-[#0B121C] border border-emerald-900/50 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.05)]">
                    <div className="absolute top-0 right-0 p-4 opacity-5"><ShieldAlert size={80} /></div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Company Retained Capital</h3>
                    <p className="text-3xl font-black text-white">₹73,750</p>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-widest uppercase rounded">73.75% Retention</span>
                        <span className="text-[10px] text-slate-500 font-mono">Net Sustainability Score: Excellent</span>
                    </div>
                </div>

                {/* Card 2: Total Immediate Outflow */}
                <div className="bg-[#0B121C] border border-red-900/30 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5"><Filter size={80} /></div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Total Immediate Outflow</h3>
                    <p className="text-3xl font-black text-red-400">₹26,250</p>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-red-500/10 text-red-400 text-[10px] font-bold tracking-widest uppercase rounded">26.25% Liability</span>
                        <span className="text-[10px] text-slate-500 font-mono">Yield + Network + Royalty + Ops + Reserve</span>
                    </div>
                </div>

                {/* Card 3: Break-Even Target */}
                <div className="bg-[#0B121C] border border-blue-900/40 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.05)]">
                    <div className="absolute top-0 right-0 p-4 opacity-5"><Search size={80} /></div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Break-Even ROI Req.</h3>
                    <p className="text-3xl font-black text-[#1173d4]">~35.6%</p>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] font-bold tracking-widest uppercase rounded">Trading Target</span>
                        <span className="text-[10px] text-slate-500 font-mono">Calculated on Retained Capital</span>
                    </div>
                </div>
            </div>

            {/* Admin Financial Action Bar */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-white uppercase tracking-widest">Master Ledger</h2>
                {simulatedRole === "ADMIN" ? (
                    <button onClick={handleAdd} className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest shadow-lg shadow-purple-500/20 transition-all">
                        <Plus size={14} /> Add Manual Entry
                    </button>
                ) : (
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                        <ShieldAlert size={14} /> View Only Mode (Locked by RBAC)
                    </div>
                )}
            </div>

            {/* Ledger Table */}
            <div className="bg-[#0B121C] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-[10px] uppercase font-bold text-slate-500 tracking-widest bg-slate-900/50">
                            <tr>
                                <th className="p-4 border-b border-slate-800">Date</th>
                                <th className="p-4 border-b border-slate-800">Source Level</th>
                                <th className="p-4 border-b border-slate-800">Affiliate Name</th>
                                <th className="p-4 border-b border-slate-800">Income Type</th>
                                <th className="p-4 border-b border-slate-800">Amount (INR)</th>
                                <th className="p-4 border-b border-slate-800 text-right">Status</th>
                                {simulatedRole === "ADMIN" && (
                                    <th className="p-4 border-b border-slate-800 text-center text-purple-400">Admin Actions</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50 text-slate-300">
                            {entries.map((entry) => (
                                <tr key={entry.id} className="hover:bg-slate-800/30 transition-colors group">
                                    <td className="p-4 font-mono text-xs text-slate-400">{entry.date}</td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 rounded bg-slate-800 text-[10px] font-bold tracking-widest text-[#1173d4]">
                                            {entry.level}
                                        </span>
                                    </td>
                                    <td className="p-4 font-bold text-white">{entry.name}</td>
                                    <td className="p-4 text-slate-400 text-xs">{entry.type}</td>
                                    <td className="p-4 font-black font-mono text-green-400">₹{entry.amount.toLocaleString()}</td>
                                    <td className="p-4 text-right">
                                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${entry.status === 'Cleared' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                            {entry.status}
                                        </span>
                                    </td>
                                    {simulatedRole === "ADMIN" && (
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleEdit(entry.id)} className="w-8 h-8 rounded bg-blue-500/10 text-blue-400 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors">
                                                    <Edit2 size={14} />
                                                </button>
                                                <button onClick={() => handleDelete(entry.id)} className="w-8 h-8 rounded bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {entries.length === 0 && (
                    <div className="p-8 text-center text-slate-500 italic text-sm">No financial entries found in the ledger.</div>
                )}
            </div>
        </div>
    );
}
