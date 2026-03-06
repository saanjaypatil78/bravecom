"use client";

import React from 'react';
import Link from 'next/link';
import MallHeaderActions from '../components/MallHeaderActions';
import { useCart } from '@/app/context/CartContext';

export default function SecureCheckout() {
    const { items, totalAmount, removeItem } = useCart();
    // Simulate some simple calculations
    const vaultServiceFee = 15000;
    const tax = totalAmount > 0 ? Math.floor(totalAmount * 0.05) : 0; // 5% tax
    const shipping = 0; // Free for white-glove
    const finalTotal = totalAmount > 0 ? totalAmount + vaultServiceFee + tax + shipping : 0;

    return (
        <div className="bg-[#f8f5f7] dark:bg-[#1a0f16] min-h-screen text-slate-900 dark:text-slate-100 font-display font-medium overflow-x-hidden">
            <div className="flex flex-col h-full w-full">
                {/* Simplified Header for Checkout */}
                <header className="sticky top-0 z-50 flex items-center justify-between border-b border-solid border-slate-200 dark:border-[#2d1625] px-6 lg:px-12 py-5 bg-[#f8f5f7]/90 dark:bg-[#1a0f16]/90 backdrop-blur-md">
                    <Link href="/mall" className="flex items-center gap-4 text-slate-900 dark:text-white cursor-pointer group">
                        <div className="size-8 text-[#f425af] flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-[32px]">shield_lock</span>
                        </div>
                        <h2 className="text-xl font-bold tracking-tight uppercase">Sovereign Secure Checkout</h2>
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link href="/mall/products" className="text-sm font-medium text-slate-500 hover:text-[#f425af] transition-colors flex items-center gap-1 cursor-pointer">
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            Return to Catalog
                        </Link>
                        <MallHeaderActions theme="fuchsia" />
                    </div>
                </header>

                {/* Main Content */}
                <div className="flex flex-1 justify-center w-full py-8 px-4 md:px-8">
                    <div className="flex flex-col lg:flex-row max-w-[1200px] w-full gap-8 lg:gap-12">

                        {/* Left Column: Checkout Steps */}
                        <div className="flex-1 flex flex-col gap-8">
                            {/* Progress Indicator */}
                            <div className="flex items-center w-full mb-4">
                                <div className="flex flex-col items-center gap-2 flex-1 relative">
                                    <div className="w-8 h-8 rounded-full bg-[#f425af] text-white flex items-center justify-center font-bold text-sm shadow-[0_0_15px_rgba(244,37,175,0.4)] z-10">
                                        <span className="material-symbols-outlined text-sm">check</span>
                                    </div>
                                    <span className="text-xs font-bold text-[#f425af] uppercase tracking-wider absolute -bottom-5">Authentication</span>
                                    <div className="absolute top-4 left-1/2 w-full h-0.5 bg-[#f425af]"></div>
                                </div>
                                <div className="flex flex-col items-center gap-2 flex-1 relative">
                                    <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold text-sm shadow-md z-10 border-4 border-[#f8f5f7] dark:border-[#1a0f16]">
                                        2
                                    </div>
                                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider absolute -bottom-5">Shipping</span>
                                    <div className="absolute top-4 left-1/2 w-full h-0.5 bg-slate-200 dark:bg-[#3d1e32]"></div>
                                </div>
                                <div className="flex flex-col items-center gap-2 flex-1 relative">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-[#2d1625] text-slate-500 dark:text-slate-400 flex items-center justify-center font-bold text-sm z-10">
                                        3
                                    </div>
                                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider absolute -bottom-5">Payment</span>
                                    <div className="absolute top-4 left-1/2 w-full h-0.5 bg-slate-200 dark:bg-[#3d1e32]"></div>
                                </div>
                                <div className="flex flex-col items-center gap-2 flex-1 relative">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-[#2d1625] text-slate-500 dark:text-slate-400 flex items-center justify-center font-bold text-sm z-10">
                                        4
                                    </div>
                                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider absolute -bottom-5">Review</span>
                                </div>
                            </div>

                            {/* Step 2 Content: Shipping */}
                            <div className="mt-8 bg-white dark:bg-[#2d1625] rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-[#3d1e32] shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Shipping Address</h2>
                                    <button className="text-[#f425af] text-sm font-bold hover:underline">Use Saved Address</button>
                                </div>

                                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">First Name</label>
                                        <input
                                            className="w-full rounded-lg h-12 px-4 bg-slate-50 dark:bg-[#1a0f16] border border-slate-200 dark:border-[#3d1e32] text-slate-900 dark:text-white focus:border-[#f425af] focus:ring-1 focus:ring-[#f425af] transition-all outline-none"
                                            placeholder="Alexander"
                                            type="text"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Last Name</label>
                                        <input
                                            className="w-full rounded-lg h-12 px-4 bg-slate-50 dark:bg-[#1a0f16] border border-slate-200 dark:border-[#3d1e32] text-slate-900 dark:text-white focus:border-[#f425af] focus:ring-1 focus:ring-[#f425af] transition-all outline-none"
                                            placeholder="Pierce"
                                            type="text"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2 md:col-span-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Street Address</label>
                                        <input
                                            className="w-full rounded-lg h-12 px-4 bg-slate-50 dark:bg-[#1a0f16] border border-slate-200 dark:border-[#3d1e32] text-slate-900 dark:text-white focus:border-[#f425af] focus:ring-1 focus:ring-[#f425af] transition-all outline-none"
                                            placeholder="123 Sovereign Way, Suite 400"
                                            type="text"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">City</label>
                                        <input
                                            className="w-full rounded-lg h-12 px-4 bg-slate-50 dark:bg-[#1a0f16] border border-slate-200 dark:border-[#3d1e32] text-slate-900 dark:text-white focus:border-[#f425af] focus:ring-1 focus:ring-[#f425af] transition-all outline-none"
                                            placeholder="Metropolis"
                                            type="text"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">State / Province</label>
                                        <select className="w-full rounded-lg h-12 px-4 bg-slate-50 dark:bg-[#1a0f16] border border-slate-200 dark:border-[#3d1e32] text-slate-900 dark:text-white focus:border-[#f425af] focus:ring-1 focus:ring-[#f425af] transition-all outline-none appearance-none">
                                            <option value="">Select State</option>
                                            <option value="NY">New York</option>
                                            <option value="CA">California</option>
                                            <option value="TX">Texas</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Postal / Zip Code</label>
                                        <input
                                            className="w-full rounded-lg h-12 px-4 bg-slate-50 dark:bg-[#1a0f16] border border-slate-200 dark:border-[#3d1e32] text-slate-900 dark:text-white focus:border-[#f425af] focus:ring-1 focus:ring-[#f425af] transition-all outline-none"
                                            placeholder="10001"
                                            type="text"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Country</label>
                                        <div className="relative">
                                            <select className="w-full rounded-lg h-12 px-4 bg-slate-50 dark:bg-[#1a0f16] border border-slate-200 dark:border-[#3d1e32] text-slate-900 dark:text-white focus:border-[#f425af] focus:ring-1 focus:ring-[#f425af] transition-all outline-none appearance-none pr-10">
                                                <option value="US">United States</option>
                                                <option value="UK">United Kingdom</option>
                                                <option value="JP">Japan</option>
                                            </select>
                                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                                expand_more
                                            </span>
                                        </div>
                                    </div>
                                </form>

                                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-[#3d1e32]">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Shipping Method</h3>
                                    <div className="flex flex-col gap-3">
                                        <label className="flex items-center justify-between p-4 rounded-xl border border-[#f425af] bg-[#f425af]/5 cursor-pointer transition-colors relative">
                                            <div className="flex items-center gap-4">
                                                <div className="w-5 h-5 rounded-full border-2 border-[#f425af] flex items-center justify-center">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#f425af]"></div>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white">White-Glove Courier Service</p>
                                                    <p className="text-sm text-slate-500">Hand-delivered within 24-48 hours. Includes authentication certificate handling.</p>
                                                </div>
                                            </div>
                                            <span className="font-bold text-[#f425af]">Free</span>
                                        </label>
                                        <label className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-[#3d1e32] bg-transparent hover:bg-slate-50 dark:hover:bg-[#1a0f16] cursor-pointer transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600"></div>
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white">Secure International Logistics</p>
                                                    <p className="text-sm text-slate-500">Fully insured armored transport. 3-5 business days globally.</p>
                                                </div>
                                            </div>
                                            <span className="font-bold text-slate-900 dark:text-white">₹ 15,000</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-end">
                                    <button
                                        disabled={items.length === 0}
                                        className="disabled:opacity-50 disabled:cursor-not-allowed bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3.5 rounded-xl font-bold text-lg hover:bg-[#f425af] dark:hover:bg-[#f425af] hover:text-white dark:hover:text-white transition-all shadow-lg flex items-center gap-2"
                                    >
                                        Continue to Payment
                                        <span className="material-symbols-outlined">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Order Summary */}
                        <div className="w-full lg:w-[400px]">
                            <div className="bg-white dark:bg-[#2d1625] rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-[#3d1e32] shadow-xl sticky top-28">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Order Summary</h2>

                                {/* Dynamic Item List */}
                                <div className="flex flex-col gap-6 mb-8 border-b border-slate-200 dark:border-[#3d1e32] pb-6">
                                    {items.length === 0 ? (
                                        <div className="text-center py-6">
                                            <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">production_quantity_limits</span>
                                            <p className="text-slate-500 font-medium">Your cart is empty.</p>
                                            <Link href="/mall/products" className="text-[#f425af] text-sm hover:underline mt-2 inline-block">Continue Shopping</Link>
                                        </div>
                                    ) : (
                                        items.map(item => (
                                            <div key={item.id} className="flex gap-4">
                                                <div className="w-20 h-24 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 relative group">
                                                    <img
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                        src={item.image}
                                                    />
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                                                        title="Remove item"
                                                    >
                                                        <span className="material-symbols-outlined text-xl hover:text-red-500">delete</span>
                                                    </button>
                                                </div>
                                                <div className="flex flex-col flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="font-bold text-slate-900 dark:text-white leading-tight">{item.name}</h3>
                                                        <span className="font-bold text-slate-900 dark:text-white whitespace-nowrap ml-2">₹ {(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{item.id}</p>
                                                    <p className="text-xs font-bold text-[#f425af] mt-auto">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}

                                    {/* Vault Service Add-on */}
                                    {items.length > 0 && (
                                        <div className="flex gap-4 items-center bg-slate-50 dark:bg-[#1a0f16] p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                                            <div className="w-10 h-10 rounded bg-[#f425af]/10 flex items-center justify-center text-[#f425af]">
                                                <span className="material-symbols-outlined">security</span>
                                            </div>
                                            <div className="flex flex-col flex-1">
                                                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Sovereign Vault Storage</h4>
                                                <p className="text-xs text-slate-500">1 Year Initial Term</p>
                                            </div>
                                            <span className="font-bold text-sm text-slate-900 dark:text-white">+ ₹ {vaultServiceFee.toLocaleString('en-IN')}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Subtotals */}
                                <div className="flex flex-col gap-3 mb-6">
                                    <div className="flex justify-between text-base">
                                        <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
                                        <span className="font-medium text-slate-900 dark:text-white">₹ {totalAmount.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between text-base">
                                        <span className="text-slate-500 dark:text-slate-400">Vault Services</span>
                                        <span className="font-medium text-slate-900 dark:text-white">₹ {items.length > 0 ? vaultServiceFee.toLocaleString('en-IN') : '0'}</span>
                                    </div>
                                    <div className="flex justify-between text-base">
                                        <span className="text-slate-500 dark:text-slate-400">Shipping</span>
                                        <span className="font-medium text-green-500">Free</span>
                                    </div>
                                    <div className="flex justify-between text-base">
                                        <span className="text-slate-500 dark:text-slate-400">Estimated Taxes</span>
                                        <span className="font-medium text-slate-900 dark:text-white">₹ {tax.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="pt-6 border-t border-slate-200 dark:border-[#3d1e32]">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-lg font-bold text-slate-900 dark:text-white">Total</span>
                                        <div className="text-right">
                                            <span className="text-3xl font-black text-[#f425af] dark:text-[#f425af] tracking-tight">₹ {finalTotal.toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 text-right">Includes applicable VAT/GST where required.</p>
                                </div>

                                {/* Trust Badges */}
                                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-[#3d1e32] flex flex-col gap-4">
                                    <div className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-[#f425af]">verified_user</span>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">Authenticity Guaranteed</p>
                                            <p className="text-xs text-slate-500">Every item is rigorously inspected by our master authenticators.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-[#f425af]">lock</span>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">Secure Encrypted Payment</p>
                                            <p className="text-xs text-slate-500">Your financial details are tokenized and protected by bank-level security.</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
