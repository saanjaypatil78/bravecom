"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";

const SAMPLE_WISHLIST = [
    { id: "w1", name: "MacBook Air M3 15-inch", category: "Electronics", price: 134900, mrp: 149900, image: "💻", rating: 4.8, inStock: true },
    { id: "w2", name: "Diamond Pendant Necklace 18K", category: "Jewelry", price: 28999, mrp: 45000, image: "💎", rating: 4.9, inStock: true },
    { id: "w3", name: "Organic Matcha Powder 200g", category: "Grocery", price: 899, mrp: 1299, image: "🍵", rating: 4.5, inStock: true },
    { id: "w4", name: "Italian Leather Oxford Shoes", category: "Fashion Men", price: 7499, mrp: 12999, image: "👞", rating: 4.7, inStock: false },
    { id: "w5", name: "Resistance Band Set (5-Pack)", category: "Sports", price: 1499, mrp: 2499, image: "🏋️", rating: 4.6, inStock: true },
    { id: "w6", name: "Ceramic Diffuser with Essential Oils", category: "Home & Kitchen", price: 1999, mrp: 3499, image: "🕯️", rating: 4.4, inStock: true },
];

export default function WishlistPage() {
    const [items, setItems] = useState(SAMPLE_WISHLIST);

    const removeItem = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    return (
        <div className="min-h-screen bg-[#f5f8f8] dark:bg-[#050B14] text-slate-900 dark:text-[#e2e8e8]">
            <div className="max-w-5xl mx-auto px-6 py-12">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link href="/mall" className="text-[#f425af] hover:underline text-sm font-medium block mb-2">← Back to Mall</Link>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            <Heart size={28} className="text-[#f425af] fill-[#f425af]" /> My Wishlist
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-[#9cbaba] mt-1">{items.length} items saved</p>
                    </div>
                    <Link href="/mall/products" className="px-6 py-2.5 bg-[#f425af] text-white rounded-xl text-sm font-bold hover:bg-[#d41f99] transition-colors flex items-center gap-2">
                        Browse More <ArrowRight size={16} />
                    </Link>
                </div>

                <AnimatePresence mode="popLayout">
                    {items.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <Heart size={64} className="text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                            <h2 className="text-xl font-bold text-slate-500 dark:text-slate-400 mb-2">Your wishlist is empty</h2>
                            <p className="text-sm text-slate-400 mb-6">Start adding products you love!</p>
                            <Link href="/mall/products" className="px-8 py-3 bg-[#f425af] text-white rounded-xl font-bold hover:bg-[#d41f99] transition-colors">
                                Explore Products
                            </Link>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {items.map((item, i) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                                    transition={{ duration: 0.4, delay: i * 0.06 }}
                                    className="bg-white dark:bg-[#0f1a2e] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden group hover:border-[#f425af]/30 transition-all"
                                >
                                    <div className="h-40 bg-slate-50 dark:bg-[#1a0e17] flex items-center justify-center text-6xl relative">
                                        {item.image}
                                        {!item.inStock && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                <span className="text-sm font-bold text-white bg-red-500 px-3 py-1 rounded-full">Out of Stock</span>
                                            </div>
                                        )}
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 dark:bg-black/50 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                    <div className="p-4">
                                        <span className="text-xs text-[#f425af] font-medium">{item.category}</span>
                                        <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-1 line-clamp-1">{item.name}</h3>
                                        <div className="flex items-center gap-1 mt-1">
                                            <span className="text-yellow-500 text-xs">★ {item.rating}</span>
                                        </div>
                                        <div className="flex items-baseline gap-2 mt-2">
                                            <span className="text-lg font-bold text-slate-900 dark:text-white">₹{item.price.toLocaleString("en-IN")}</span>
                                            <span className="text-xs text-slate-400 line-through">₹{item.mrp.toLocaleString("en-IN")}</span>
                                            <span className="text-xs text-emerald-500 font-bold">{Math.round((1 - item.price / item.mrp) * 100)}% off</span>
                                        </div>
                                        <button
                                            disabled={!item.inStock}
                                            className="w-full mt-3 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-40 bg-[#f425af] text-white hover:bg-[#d41f99]"
                                        >
                                            <ShoppingCart size={14} /> Add to Cart
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
