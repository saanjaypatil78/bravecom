"use client";

import { motion } from "framer-motion";
import { CreditCard, ShieldCheck, X, Truck, Building2 } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface OrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    productInfo: {
        name: string;
        price: number;
        variantName: string;
        image: string;
    };
}

export default function OrderModal({ isOpen, onClose, productInfo }: OrderModalProps) {
    const [step, setStep] = useState<"CART" | "ADDRESS" | "PAYMENT" | "SUCCESS">("CART");
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isOpen) return null;

    const handleProcessPayment = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setStep("SUCCESS");
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
                <button onClick={onClose} className="absolute top-4 right-4 z-10 text-slate-400 hover:text-slate-800 p-2 bg-slate-100 rounded-full transition-colors">
                    <X size={20} />
                </button>

                {/* Header Flow Indicators */}
                <div className="bg-slate-50 border-b border-slate-200 px-8 py-6 flex justify-between items-center text-sm font-bold uppercase tracking-widest text-slate-400">
                    <span className={step === "CART" ? "text-blue-600" : ""}>Cart Validation</span>
                    <span>----</span>
                    <span className={step === "ADDRESS" ? "text-blue-600" : ""}>Fulfillment</span>
                    <span>----</span>
                    <span className={step === "PAYMENT" ? "text-blue-600" : ""}>Secure Payment</span>
                </div>

                <div className="p-8">
                    {step === "CART" && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-black text-slate-900">Review Procurement</h3>
                            <div className="flex gap-6 items-center border border-slate-200 rounded-2xl p-4">
                                <div className="w-24 h-24 rounded-bl-xl bg-slate-100 shrink-0 relative overflow-hidden border border-slate-200">
                                    <Image src={productInfo.image} alt="Product" layout="fill" objectFit="cover" className="rounded-lg" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-800">{productInfo.name}</h4>
                                    <p className="text-sm text-slate-500 mt-1">{productInfo.variantName}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-black text-slate-900">₹{productInfo.price.toLocaleString('en-IN')}</div>
                                </div>
                            </div>

                            <div className="flex bg-blue-50 border border-blue-100 rounded-xl p-4 gap-3 items-start">
                                <ShieldCheck className="text-blue-500 shrink-0 mt-1" size={20} />
                                <div>
                                    <p className="text-sm font-bold text-blue-900">BRAVECOM Purchase Protection</p>
                                    <p className="text-xs text-blue-700/70 mt-1">Item is dispatched securely from a Verified Vendor. Margin differential feeds the Sunray Network.</p>
                                </div>
                            </div>

                            <button onClick={() => setStep("ADDRESS")} className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors">
                                Proceed to Fulfillment Destination
                            </button>
                        </div>
                    )}

                    {step === "ADDRESS" && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-black text-slate-900">Logistics Routing</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="First Name" className="p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-800" defaultValue="Rajesh" />
                                <input type="text" placeholder="Last Name" className="p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-800" defaultValue="Kumar" />
                                <input type="text" placeholder="Delivery Address" className="col-span-2 p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-800" defaultValue="42 Tech Park, Hitec City" />
                                <input type="text" placeholder="City" className="p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-800" defaultValue="Hyderabad" />
                                <input type="text" placeholder="Postal Code" className="p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-800" defaultValue="500081" />
                            </div>

                            <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-4 gap-3 items-center">
                                <Truck className="text-slate-400 shrink-0" size={20} />
                                <div className="text-sm text-slate-600 font-medium">Standard Free Shipping selected (3-5 Business Days).</div>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={() => setStep("CART")} className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors">Back</button>
                                <button onClick={() => setStep("PAYMENT")} className="flex-1 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors">
                                    Continue to Secure Payment
                                </button>
                            </div>
                        </div>
                    )}

                    {step === "PAYMENT" && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-black text-slate-900">Secure Protocol Setup</h3>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-4 border border-blue-500 bg-blue-50 rounded-xl cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <CreditCard className="text-blue-500" />
                                        <span className="font-bold text-blue-900">Debit / Credit Card (Gateway Simulation)</span>
                                    </div>
                                    <div className="w-5 h-5 rounded-full border-[5px] border-blue-500"></div>
                                </div>
                                <div className="flex items-center justify-between p-4 border border-slate-200 hover:border-slate-300 rounded-xl cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <Building2 className="text-slate-500" />
                                        <span className="font-bold text-slate-700">UPI / NetBanking</span>
                                    </div>
                                    <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mt-4 space-y-2">
                                <div className="flex justify-between text-sm text-slate-500"><span>Subtotal</span><span>₹{productInfo.price.toLocaleString('en-IN')}</span></div>
                                <div className="flex justify-between text-sm text-slate-500"><span>Shipping</span><span className="text-emerald-500 font-bold">Free</span></div>
                                <div className="flex justify-between text-lg font-black text-slate-900 pt-2 border-t border-slate-200 mt-2">
                                    <span>Total</span><span>₹{productInfo.price.toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={() => setStep("ADDRESS")} className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors">Back</button>
                                <button
                                    onClick={handleProcessPayment}
                                    disabled={isProcessing}
                                    className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white font-black rounded-xl transition-colors flex justify-center"
                                >
                                    {isProcessing ? "Processing Vault Lock..." : `Confirm Payment of ₹${productInfo.price.toLocaleString('en-IN')}`}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === "SUCCESS" && (
                        <div className="space-y-6 text-center py-10">
                            <div className="mx-auto w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                                <ShieldCheck className="text-emerald-500" size={48} />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900">Order Initiated Successfully</h3>
                            <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">
                                Your secure digital ledger has been recorded. The Verified Vendor will dispatch your &apos;{productInfo.name}&apos; shortly.
                            </p>
                            <button onClick={onClose} className="mt-8 px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors">
                                Return to Dropship Pipeline
                            </button>
                        </div>
                    )}
                </div>

            </motion.div>
        </div>
    );
}
