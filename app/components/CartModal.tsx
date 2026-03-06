"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function CartModal() {
    const { items, removeItem, updateQuantity, totalAmount, isCartOpen, setIsCartOpen, clearCart } = useCart();

    if (!isCartOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex justify-end"
                onClick={() => setIsCartOpen(false)}
            >
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

                {/* Cart Panel */}
                <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="relative w-full max-w-md bg-[#0f172a] border-l border-white/10 h-full flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/10">
                        <div className="flex items-center gap-3">
                            <ShoppingBag className="text-[#0ea5e9]" size={24} />
                            <h2 className="text-xl font-bold text-white">Your Cart</h2>
                            <span className="bg-[#0ea5e9] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                {items.length}
                            </span>
                        </div>
                        <button
                            onClick={() => setIsCartOpen(false)}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X size={20} className="text-slate-400" />
                        </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {items.length === 0 ? (
                            <div className="text-center py-12">
                                <ShoppingBag size={48} className="text-slate-600 mx-auto mb-4" />
                                <p className="text-slate-400 mb-4">Your cart is empty</p>
                                <Link
                                    href="/mall"
                                    onClick={() => setIsCartOpen(false)}
                                    className="text-[#0ea5e9] hover:underline font-medium"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        ) : (
                            items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex gap-4 bg-white/5 border border-white/10 rounded-xl p-4"
                                >
                                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-white text-sm truncate">{item.name}</h3>
                                        {item.variant && (
                                            <p className="text-xs text-slate-400">{item.variant}</p>
                                        )}
                                        <p className="text-[#0ea5e9] font-bold mt-1">₹{item.price.toLocaleString()}</p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-7 h-7 rounded bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="text-white font-medium w-6 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-7 h-7 rounded bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="ml-auto text-red-400 hover:text-red-300 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                        <div className="p-6 border-t border-white/10 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Total</span>
                                <span className="text-2xl font-black text-white">₹{totalAmount.toLocaleString()}</span>
                            </div>
                            <Link
                                href="/mall/checkout"
                                onClick={() => setIsCartOpen(false)}
                                className="w-full bg-[#0ea5e9] hover:bg-[#0284c7] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                            >
                                Checkout <ArrowRight size={18} />
                            </Link>
                            <button
                                onClick={clearCart}
                                className="w-full text-slate-400 hover:text-white py-2 text-sm transition-colors"
                            >
                                Clear Cart
                            </button>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
