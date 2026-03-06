"use client";

import Link from "next/link";
import { Wallet, Users, Banknote } from "lucide-react";

export default function SidebarMetrics() {
    return (
        <div className="p-4 space-y-3 mb-4 border-t border-slate-800 pt-4 mt-auto">
            <h4 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2">Financial Portfolio</h4>

            <Link href="/income-breakdown" className="block bg-slate-900 border border-slate-800 p-3 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer group shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <Wallet size={16} />
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Invested Amount</p>
                        <p className="text-sm font-black text-white">₹1,00,000</p>
                    </div>
                </div>
            </Link>

            <Link href="/income-breakdown" className="block bg-slate-900 border border-slate-800 p-3 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer group shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-green-500/10 text-green-400 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors">
                        <Users size={16} />
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Referral Comm.</p>
                        <p className="text-sm font-black text-white cursor-pointer hover:underline text-green-400">₹14,500</p>
                    </div>
                </div>
            </Link>

            <Link href="/income-breakdown" className="block bg-slate-900 border border-slate-800 p-3 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer group shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-colors">
                        <Banknote size={16} />
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Total Disbursed</p>
                        <p className="text-sm font-black text-white">₹2,40,000</p>
                    </div>
                </div>
            </Link>
        </div>
    );
}
