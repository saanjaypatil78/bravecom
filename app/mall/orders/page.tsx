"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Package, Truck, CheckCircle2, Clock, ArrowRight } from "lucide-react";

const SAMPLE_ORDERS = [
    { id: "ORD-2026-00412", date: "28 Feb 2026", product: "Premium Wireless Headphones", category: "Electronics", amount: 4999, status: "Delivered", tracking: "DELHIVERY-8827391", image: "🎧" },
    { id: "ORD-2026-00389", date: "25 Feb 2026", product: "Organic Cold-Pressed Juice Set", category: "Grocery", amount: 1299, status: "In Transit", tracking: "BLUEDART-7728194", image: "🥤" },
    { id: "ORD-2026-00356", date: "20 Feb 2026", product: "Ergonomic Office Chair", category: "Home & Kitchen", amount: 12999, status: "Processing", tracking: null, image: "🪑" },
    { id: "ORD-2026-00298", date: "14 Feb 2026", product: "Leather Crossbody Bag", category: "Fashion Women", amount: 3499, status: "Delivered", tracking: "ECOM-EXP-9982713", image: "👜" },
    { id: "ORD-2026-00251", date: "8 Feb 2026", product: "Vitamin D3 Supplement 90ct", category: "Health & Wellness", amount: 699, status: "Delivered", tracking: "DELHIVERY-7712983", image: "💊" },
    { id: "ORD-2025-01189", date: "15 Dec 2025", product: "Smart Fitness Band Pro", category: "Sports", amount: 2999, status: "Delivered", tracking: "BLUEDART-6619284", image: "⌚" },
];

const statusConfig: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
    "Delivered": { color: "text-emerald-400", bg: "bg-emerald-500/10", icon: CheckCircle2 },
    "In Transit": { color: "text-blue-400", bg: "bg-blue-500/10", icon: Truck },
    "Processing": { color: "text-amber-400", bg: "bg-amber-500/10", icon: Clock },
};

export default function OrdersPage() {
    return (
        <div className="min-h-screen bg-[#f5f8f8] dark:bg-[#050B14] text-slate-900 dark:text-[#e2e8e8]">
            <div className="max-w-5xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Link href="/mall" className="text-[#f425af] hover:underline text-sm font-medium">← Back to Mall</Link>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            <Package size={28} className="text-[#f425af]" /> My Orders
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-[#9cbaba] mt-1">{SAMPLE_ORDERS.length} orders placed</p>
                    </div>
                    <Link href="/mall/products" className="px-6 py-2.5 bg-[#f425af] text-white rounded-xl text-sm font-bold hover:bg-[#d41f99] transition-colors flex items-center gap-2">
                        Continue Shopping <ArrowRight size={16} />
                    </Link>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {SAMPLE_ORDERS.map((order, i) => {
                        const sc = statusConfig[order.status] || statusConfig["Processing"];
                        const StatusIcon = sc.icon;
                        return (
                            <motion.div
                                key={order.id}
                                className="bg-white dark:bg-[#0f1a2e] rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-[#f425af]/30 transition-colors"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: i * 0.08 }}
                            >
                                <div className="text-4xl w-14 h-14 flex items-center justify-center bg-slate-50 dark:bg-[#1a0e17] rounded-xl">{order.image}</div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-slate-900 dark:text-white truncate">{order.product}</h3>
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${sc.bg} ${sc.color}`}>
                                            <StatusIcon size={12} /> {order.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                                        <span className="font-mono">{order.id}</span>
                                        <span>{order.date}</span>
                                        <span className="text-slate-400">{order.category}</span>
                                    </div>
                                    {order.tracking && (
                                        <p className="text-xs text-slate-400 mt-1">Tracking: <span className="text-[#f425af] font-mono">{order.tracking}</span></p>
                                    )}
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">₹{order.amount.toLocaleString("en-IN")}</p>
                                    <button className="text-xs text-[#f425af] hover:underline mt-1">View Details</button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
