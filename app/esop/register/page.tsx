"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ChevronRight, ChevronLeft, Landmark, UserPlus, Fingerprint, Lock, ShieldCheck, RefreshCw, Smartphone, AlertTriangle, TrendingUp, Briefcase, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const BANKS = ["HDFC Bank", "State Bank of India", "ICICI Bank", "Axis Bank", "Kotak Mahindra Bank", "Bank of Baroda", "Punjab National Bank"];

function ESOPRegisterContent() {
    const searchParams = useSearchParams();
    const [step, setStep] = useState(1);
    const [users, setUsers] = useState<{ id: string, name: string }[]>([]);
    const [investmentType, setInvestmentType] = useState<"standard" | "esop">("esop");

    const [formData, setFormData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        mobile: "",
        email: "",
        address: "",
        aadhaar: "",
        bankName: "",
        accountNumber: "",
        ifscCode: "",
        passbookDoc: "",
        nomineeName: "",
        nomineeMobile: "",
        nomineeRelation: "",
        nomineeAccount: "",
        nomineeIfsc: "",
        referrerId: "",
        username: "",
        password: "",
        confirmPassword: "",
        mobileOtp: "",
        emailOtp: "",
        captcha: "",
        termsAgreed: false,
        ageAgreed: false,
        esopAmount: "100000",
    });

    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [usernameAvail, setUsernameAvail] = useState<boolean | null>(null);
    const [mobileTimer, setMobileTimer] = useState(300);
    const [emailTimer, setEmailTimer] = useState(600);
    const [captchaVal, setCaptchaVal] = useState("XR7B9W");
    const [diditVerified, setDiditVerified] = useState(false);

    useEffect(() => {
        fetch("/api/register").then(r => r.json()).then(data => setUsers(data.users || []));

        const draft = localStorage.getItem("bravecom_esop_draft");
        if (draft) {
            setFormData(JSON.parse(draft));
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (formData.firstName || formData.mobile) {
                localStorage.setItem("bravecom_esop_draft", JSON.stringify(formData));
            }
        }, 30000);
        return () => clearInterval(interval);
    }, [formData]);

    useEffect(() => {
        if (mobileTimer === 0 || emailTimer === 0) return;
        const iv = setInterval(() => {
            setMobileTimer(m => Math.max(0, m - 1));
            setEmailTimer(m => Math.max(0, m - 1));
        }, 1000);
        return () => clearInterval(iv);
    }, [mobileTimer, emailTimer]);

    const handleChange = (e: any) => {
        let val = e.target.value;
        if (e.target.name === "mobile") val = val.replace(/\D/g, "").slice(0, 10);
        if (e.target.name === "firstName" || e.target.name === "lastName") val = val.replace(/[^A-Za-z\s]/g, "");
        if (e.target.name === "aadhaar") {
            setFormData({ ...formData, aadhaar: val.replace(/\D/g, "").slice(0, 12) });
            return;
        }
        setFormData({ ...formData, [e.target.name]: val });

        if (e.target.name === "username" && val.length >= 6) {
            setTimeout(() => setUsernameAvail(val.toLowerCase() !== "admin123"), 500);
        } else if (e.target.name === "username") {
            setUsernameAvail(null);
        }
    };

    const getPwdStrength = () => {
        const p = formData.password;
        if (p.length === 0) return 0;
        let score = 0;
        if (p.length >= 8) score += 25;
        if (/[A-Z]/.test(p)) score += 25;
        if (/[0-9]/.test(p)) score += 25;
        if (/[^A-Za-z0-9]/.test(p)) score += 25;
        return score;
    };

    const isStep1Valid = formData.firstName.length >= 2 && formData.lastName.length >= 2;
    const isStep2Valid = formData.mobile.length === 10 && formData.email.includes("@") && formData.address.length > 5;
    const isStep3Valid = formData.aadhaar.length === 12 && diditVerified;
    const isStep4Valid = formData.bankName && formData.accountNumber.length >= 9 && formData.ifscCode.length === 11;
    const isStep5Valid = formData.nomineeName.length >= 2 && formData.nomineeRelation && formData.nomineeMobile.length === 10;
    const isStep6Valid = usernameAvail && getPwdStrength() >= 75 && formData.password === formData.confirmPassword && formData.mobileOtp === "123456" && formData.emailOtp === "123456" && formData.captcha.toUpperCase() === captchaVal && formData.termsAgreed && formData.ageAgreed;

    const canProceed = () => {
        if (step === 1) return isStep1Valid;
        if (step === 2) return isStep2Valid;
        if (step === 3) return isStep3Valid;
        if (step === 4) return isStep4Valid;
        if (step === 5) return isStep5Valid;
        return false;
    };

    const submitForm = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    place: formData.address.substring(0, 20),
                    referrerId: formData.referrerId,
                    amount: parseInt(formData.esopAmount),
                    bankName: formData.bankName,
                    bankAccount: formData.accountNumber,
                    ifsc: formData.ifscCode,
                    guardian: formData.nomineeName,
                    username: formData.username,
                    isMobileVerified: true,
                    isEmailVerified: true,
                    registrationType: "ESOP",
                    equityAllocation: Math.floor(parseInt(formData.esopAmount) / 100000) * 0.01,
                    lastDraftSaved: JSON.stringify(formData)
                }),
            });
            const data = await res.json();
            if (data.success) {
                localStorage.removeItem("bravecom_esop_draft");
                setSuccessMsg(`ESOP Allocation Complete! You have been allocated ${Math.floor(parseInt(formData.esopAmount) / 100000) * 0.01}% equity.`);
            }
        } catch {
            alert("Error submitting. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (successMsg) {
        return (
            <div className="flex-1 p-8 flex items-center justify-center">
                <div className="bg-slate-900 border border-blue-500/30 p-12 rounded-2xl text-center max-w-lg shadow-[0_0_50px_rgba(17,115,212,0.2)]">
                    <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Briefcase size={40} className="text-blue-500" />
                    </div>
                    <h2 className="text-2xl font-black text-white mb-4">Equity Allocation Confirmed</h2>
                    <p className="text-slate-400 mb-8">{successMsg}</p>
                    <p className="text-sm text-blue-400 mb-8">Your equity is locked in. The 10x-50x grey market multiple will be realized upon NSE listing.</p>
                    <button onClick={() => window.location.href = '/dashboard'} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors">
                        Proceed to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const stepsArray = [
        { id: 1, title: "Personal", icon: <UserPlus size={16} /> },
        { id: 2, title: "Contact", icon: <Smartphone size={16} /> },
        { id: 3, title: "Identity", icon: <Fingerprint size={16} /> },
        { id: 4, title: "Banking", icon: <Landmark size={16} /> },
        { id: 5, title: "Nominee", icon: <ShieldCheck size={16} /> },
        { id: 6, title: "Secure", icon: <Lock size={16} /> },
    ];

    return (
        <div className="flex-1 p-8 overflow-y-auto font-sans bg-[#050B14]">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-bold tracking-widest uppercase mb-4">
                        <Zap size={16} /> Pre-IPO ESOP Module
                    </div>
                    <h2 className="text-4xl font-black text-white tracking-tight">Secure Equity Allocation</h2>
                    <p className="text-slate-400 mt-2">Convert capital into corporate equity blocks aligned with NSE Pre-Seed trajectory.</p>
                </div>

                <div className="flex justify-center mb-8">
                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 flex items-center gap-4">
                        <div className="text-center">
                            <p className="text-xs text-blue-400 uppercase tracking-widest">Your Investment</p>
                            <p className="text-2xl font-black text-white">₹{parseInt(formData.esopAmount).toLocaleString()}</p>
                        </div>
                        <div className="w-px h-12 bg-blue-500/30"></div>
                        <div className="text-center">
                            <p className="text-xs text-green-400 uppercase tracking-widest">Equity Allocation</p>
                            <p className="text-2xl font-black text-green-400">{(Math.floor(parseInt(formData.esopAmount) / 100000) * 0.01).toFixed(2)}%</p>
                        </div>
                        <div className="w-px h-12 bg-blue-500/30"></div>
                        <div className="text-center">
                            <p className="text-xs text-purple-400 uppercase tracking-widest">Est. Grey Mkt</p>
                            <p className="text-2xl font-black text-purple-400">10x - 50x</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between mb-10 relative px-4">
                    <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-800 -translate-y-1/2 rounded-full z-0"></div>
                    <div className="absolute top-1/2 left-4 h-1 bg-gradient-to-r from-blue-600 to-purple-600 -translate-y-1/2 rounded-full z-0 transition-all duration-500" style={{ width: `calc(${((step - 1) / 5) * 100}% - 2rem)` }}></div>

                    {stepsArray.map((s) => (
                        <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2 ${step === s.id ? 'bg-slate-900 border-blue-500 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.4)] scale-110' : step > s.id ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-950 border-slate-800 text-slate-600'}`}>
                                {step > s.id ? <CheckCircle2 size={24} /> : s.icon}
                            </div>
                            <span className={`text-[10px] uppercase tracking-widest font-black ${step === s.id ? 'text-blue-400' : step > s.id ? 'text-slate-300' : 'text-slate-600'}`}>{s.title}</span>
                        </div>
                    ))}
                </div>

                <div className="bg-[#0A0F1A] border border-blue-500/20 rounded-3xl shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 bg-blue-900/40 text-blue-400 text-[10px] font-mono px-3 py-1 rounded-bl-xl border-l border-b border-blue-500/20 flex items-center gap-2">
                        <Lock size={10} /> ESOP SECURED
                    </div>

                    <div className="p-10 min-h-[400px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-6"
                            >
                                {step === 1 && (
                                    <>
                                        <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Personal Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">First Name *</label>
                                                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full bg-[#12182B] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="As per PAN" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Middle Name</label>
                                                <input type="text" name="middleName" value={formData.middleName} onChange={handleChange} className="w-full bg-[#12182B] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none" placeholder="Optional" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Last Name *</label>
                                                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full bg-[#12182B] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none" placeholder="Surname" />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {step === 2 && (
                                    <>
                                        <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Contact Details</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Mobile Number *</label>
                                                <div className="flex">
                                                    <span className="bg-[#1A2235] border border-white/10 border-r-0 rounded-l-xl px-4 py-3 text-slate-400 font-mono">+91</span>
                                                    <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="w-full bg-[#12182B] border border-white/10 rounded-r-xl px-4 py-3 text-white font-mono focus:border-blue-500 outline-none" placeholder="9999999999" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address *</label>
                                                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-[#12182B] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none" placeholder="name@domain.com" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Residential Address *</label>
                                            <textarea name="address" value={formData.address} onChange={handleChange} maxLength={500} rows={4} className="w-full bg-[#12182B] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none resize-none" placeholder="Exactly as per Aadhaar Card..."></textarea>
                                        </div>
                                    </>
                                )}

                                {step === 3 && (
                                    <>
                                        <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">UIDAI Integration Check</h3>
                                        <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-6 mb-6">
                                            <label className="block text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Aadhaar Number *</label>
                                            <input
                                                type="text"
                                                value={formData.aadhaar}
                                                onChange={(e) => handleChange({ target: { name: 'aadhaar', value: e.target.value } })}
                                                maxLength={12}
                                                className="w-full bg-[#0A0F1A] border border-blue-500/30 rounded-xl px-4 py-4 text-white font-mono text-xl tracking-widest focus:border-blue-500 outline-none"
                                                placeholder="12 Digit Aadhaar Number"
                                            />
                                        </div>

                                        {/* DIDIT KYC INTEGRATION */}
                                        <div className="bg-fuchsia-900/10 border border-fuchsia-500/20 rounded-xl p-6 mb-6">
                                            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                                <ShieldCheck size={16} className="text-fuchsia-400" /> Premium Biometric KYC (Didit.me)
                                            </h4>
                                            <p className="text-xs text-slate-400 mb-4">Complete your Identity & AML Verification using Didit biometric authentication.</p>

                                            {diditVerified ? (
                                                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm bg-emerald-900/20 p-3 rounded-lg border border-emerald-500/30">
                                                    <CheckCircle2 size={18} /> Biometric Verification Complete
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            window.open('https://verify.didit.me/u/7gCcaJAuTxyV3MYoom8JmA', '_blank');
                                                            // Verification simulator
                                                            setTimeout(() => setDiditVerified(true), 5000);
                                                        }}
                                                        className="w-full py-3 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(192,38,211,0.4)]"
                                                    >
                                                        Start Identity Verification
                                                    </button>
                                                    <p className="text-[10px] text-slate-500 text-center font-mono">
                                                        API Key: ******************************<br />
                                                        App ID: ************************************
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}

                                {step === 4 && (
                                    <>
                                        <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Bank Architecture</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Registered Bank *</label>
                                                <select name="bankName" value={formData.bankName} onChange={handleChange} className="w-full bg-[#12182B] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none">
                                                    <option value="">Select recognized Indian Bank</option>
                                                    {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Account Number *</label>
                                                <input type="password" name="accountNumber" value={formData.accountNumber} onChange={handleChange} className="w-full bg-[#12182B] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none font-mono tracking-widest" placeholder="9-18 digits" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">IFSC Code *</label>
                                                <input type="text" name="ifscCode" value={formData.ifscCode} onChange={handleChange} maxLength={11} className="w-full bg-[#12182B] border border-white/10 rounded-xl px-4 py-3 text-white uppercase focus:border-blue-500 outline-none font-mono" placeholder="SBIN0001234" />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {step === 5 && (
                                    <>
                                        <h3 className="text-xl font-bold text-white mb-2 pb-2">Inheritance Declaration</h3>
                                        <p className="text-xs text-slate-500 mb-6 border-b border-white/10 pb-4">Mandatory compliance for investors above 18 years.</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Nominee Full Name *</label>
                                                <input type="text" name="nomineeName" value={formData.nomineeName} onChange={handleChange} className="w-full bg-[#12182B] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Relationship *</label>
                                                <select name="nomineeRelation" value={formData.nomineeRelation} onChange={handleChange} className="w-full bg-[#12182B] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none">
                                                    <option value="">Select Relation</option>
                                                    <option value="Spouse">Spouse</option>
                                                    <option value="Child">Child</option>
                                                    <option value="Parent">Parent</option>
                                                    <option value="Sibling">Sibling</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Nominee Mobile *</label>
                                                <input type="text" name="nomineeMobile" value={formData.nomineeMobile} onChange={handleChange} maxLength={10} className="w-full bg-[#12182B] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none font-mono" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Nominee Bank A/C *</label>
                                                <input type="text" name="nomineeAccount" value={formData.nomineeAccount} onChange={handleChange} className="w-full bg-[#12182B] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none font-mono" />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {step === 6 && (
                                    <>
                                        <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Security Protocol & OTP Vault</h3>

                                        <div className="mb-6 p-4 bg-blue-900/10 border border-blue-500/20 rounded-xl">
                                            <label className="block text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Referral Code (Franchise Anchor)</label>
                                            <select name="referrerId" onChange={handleChange} value={formData.referrerId} className="w-full bg-[#0A0F1A] border border-blue-500/30 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none">
                                                <option value="">-- Enter Referral Code If Any --</option>
                                                {users.map((u) => (
                                                    <option key={u.id} value={u.id}>{u.name} - Franchise Node</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-white/5">
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Desired Username *</label>
                                                <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full bg-[#12182B] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none" placeholder="6-20 alphanumeric characters" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Encrypted Password *</label>
                                                <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full bg-[#12182B] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Confirm Encryption *</label>
                                                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full bg-[#12182B] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl">
                                                <label className="block text-xs font-bold text-slate-300 mb-2 flex justify-between">
                                                    <span>Mobile OTP <span className="text-blue-400 font-normal">(Use: 123456)</span></span>
                                                    <span className="text-blue-400 font-mono">0{Math.floor(mobileTimer / 60)}:{(mobileTimer % 60).toString().padStart(2, '0')}</span>
                                                </label>
                                                <input type="text" name="mobileOtp" value={formData.mobileOtp} onChange={handleChange} maxLength={6} className="w-full bg-[#0A0F1A] border border-slate-700 rounded-lg px-4 py-2 text-white text-center font-mono tracking-widest outline-none" placeholder="123456" />
                                            </div>
                                            <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl">
                                                <label className="block text-xs font-bold text-slate-300 mb-2 flex justify-between">
                                                    <span>Email OTP <span className="text-blue-400 font-normal">(Use: 123456)</span></span>
                                                    <span className="text-blue-400 font-mono">0{Math.floor(emailTimer / 60)}:{(emailTimer % 60).toString().padStart(2, '0')}</span>
                                                </label>
                                                <input type="text" name="emailOtp" value={formData.emailOtp} onChange={handleChange} maxLength={6} className="w-full bg-[#0A0F1A] border border-slate-700 rounded-lg px-4 py-2 text-white text-center font-mono tracking-widest outline-none" placeholder="123456" />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 mb-2 border border-white/10 p-2 rounded-xl bg-[#12182B]">
                                            <div className="bg-white text-black font-black italic tracking-widest text-xl px-6 py-2 rounded-lg select-none blur-[1px] relative overflow-hidden">
                                                <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
                                                {captchaVal}
                                            </div>
                                            <input type="text" name="captcha" value={formData.captcha} onChange={handleChange} className="flex-1 bg-transparent border-none text-white font-mono uppercase outline-none" placeholder="TYPE CAPTCHA" />
                                        </div>

                                        <div className="space-y-3 mt-8">
                                            <label className="flex items-start gap-3 cursor-pointer">
                                                <div className="mt-0.5">
                                                    <input type="checkbox" name="ageAgreed" checked={formData.ageAgreed} onChange={(e) => setFormData({ ...formData, ageAgreed: e.target.checked })} className="w-4 h-4 rounded bg-slate-800 border-slate-700" />
                                                </div>
                                                <span className="text-xs text-slate-400">I declare that I am 18 years or older.</span>
                                            </label>
                                            <label className="flex items-start gap-3 cursor-pointer">
                                                <div className="mt-0.5">
                                                    <input type="checkbox" name="termsAgreed" checked={formData.termsAgreed} onChange={(e) => setFormData({ ...formData, termsAgreed: e.target.checked })} className="w-4 h-4 rounded bg-slate-800 border-slate-700" />
                                                </div>
                                                <span className="text-xs text-slate-400">I accept the ESOP Terms and Conditions and Privacy Policy.</span>
                                            </label>
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="bg-[#12182B] p-6 border-t border-white/5 flex justify-between items-center relative z-10">
                        <button
                            onClick={() => setStep(step - 1)}
                            disabled={step === 1 || loading}
                            className="px-6 py-3 bg-transparent text-slate-400 font-bold disabled:opacity-0 hover:text-white transition-colors flex items-center gap-2"
                        >
                            <ChevronLeft size={16} /> Back
                        </button>

                        {step < 6 ? (
                            <button
                                onClick={() => setStep(step + 1)}
                                disabled={!canProceed()}
                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] disabled:opacity-30 disabled:grayscale transition-all flex items-center gap-2"
                            >
                                Validate & Next <ChevronRight size={16} />
                            </button>
                        ) : (
                            <button
                                onClick={submitForm}
                                disabled={loading || !isStep6Valid}
                                className="px-10 py-3 bg-blue-500 hover:bg-blue-400 text-white rounded-xl font-black disabled:opacity-20 disabled:grayscale transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)] animate-pulse"
                            >
                                {loading ? "Allocating Equity..." : "Secure Equity Allocation"} <ShieldCheck size={18} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <Link href="/esop" className="text-sm text-slate-500 hover:text-slate-400">
                        ← Back to ESOP Options
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function ESOPRegisterPage() {
    return (
        <Suspense fallback={
            <div className="flex-1 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <ESOPRegisterContent />
        </Suspense>
    );
}
