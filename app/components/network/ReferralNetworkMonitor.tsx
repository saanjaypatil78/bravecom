"use client";

import { Users, TrendingUp, ShieldCheck, ChevronRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const LEVEL_DATA = [
    { level: 1, users: 5, commission: "5.0%", totalEarned: 125000, status: "Active", color: "from-blue-500/20 to-blue-900/20", border: "border-blue-500/30", text: "text-blue-400" },
    { level: 2, users: 24, commission: "3.5%", totalEarned: 420000, status: "Active", color: "from-emerald-500/20 to-emerald-900/20", border: "border-emerald-500/30", text: "text-emerald-400" },
    { level: 3, users: 112, commission: "2.0%", totalEarned: 1120000, status: "Active", color: "from-amber-500/20 to-amber-900/20", border: "border-amber-500/30", text: "text-amber-400" },
    { level: 4, users: 430, commission: "1.0%", totalEarned: 2150000, status: "Active", color: "from-purple-500/20 to-purple-900/20", border: "border-purple-500/30", text: "text-purple-400" },
    { level: 5, users: 1845, commission: "0.5%", totalEarned: 4612500, status: "Active", color: "from-pink-500/20 to-pink-900/20", border: "border-pink-500/30", text: "text-pink-400" },
    { level: 6, users: 4210, commission: "0.5%", totalEarned: 10525000, status: "Active", color: "from-orange-500/20 to-orange-900/20", border: "border-orange-500/30", text: "text-orange-400" },
];

export default function ReferralNetworkMonitor() {
    return (
        <div className="w-full bg-[#0b1526] border border-white/5 rounded-2xl p-6 lg:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold font-['Outfit'] text-white flex items-center">
                        <Share2 className="w-6 h-6 mr-2 text-amber-500" />
                        6-Level Matrix Monitor
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">Live autonomous depth tracking and commission yield mapping.</p>
                </div>

                <div className="flex items-center space-x-3">
                    <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center">
                        <ShieldCheck className="w-4 h-4 text-emerald-400 mr-2" />
                        <span className="text-sm font-medium text-emerald-400">All Levels Unlocked</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {LEVEL_DATA.map((tier, index) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={tier.level}
                        className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${tier.color} border ${tier.border} p-5 hover:border-white/20 transition-all duration-300 group`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="text-sm text-gray-400 font-medium mb-1">Level {tier.level} Depth</div>
                                <div className={`text-2xl font-bold ${tier.text} flex items-center`}>
                                    <Users className="w-5 h-5 mr-2 opacity-80" />
                                    {tier.users.toLocaleString()} <span className="text-sm font-normal text-gray-500 ml-1">Assets</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#050b14]/50 border border-white/5 group-hover:bg-[#050b14] transition-colors">
                                <span className={`font-bold text-sm ${tier.text}`}>{tier.commission}</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                            <div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Yield Generated</div>
                                <div className="text-lg font-semibold text-white">₹{tier.totalEarned.toLocaleString()}</div>
                            </div>

                            <div className="flex items-center text-xs text-emerald-400 font-medium bg-[#050b14]/60 px-2 py-1 rounded-md">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Active
                            </div>
                        </div>

                        {/* Connection visualizer */}
                        {tier.level < 6 && (
                            <div className="absolute -bottom-3 -right-3 text-white/5 group-hover:text-white/10 transition-colors">
                                <Users className="w-24 h-24" />
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            <div className="mt-8 p-4 rounded-xl bg-blue-900/10 border border-blue-900/30 flex items-start">
                <TrendingUp className="w-5 h-5 text-blue-400 mr-3 mt-0.5" />
                <div>
                    <h4 className="text-sm font-semibold text-blue-300 mb-1">Matrix Saturation Note</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                        The current depth reflects accumulated momentum since Jan 2023. At Level 6, network expansion begins transitioning from primary direct routing into autonomous passive structural mapping, triggering the Franchise Royalty threshold mechanisms automatically.
                    </p>
                </div>
            </div>
        </div>
    );
}

// Just an icon helper so we don't import from lucide-react if missed
function Share2(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
            <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
        </svg>
    )
}
