'use client';
/**
 * Feedback Page — /feedback
 * 3-step form: Category → Details → Contact
 * Calls POST /api/feedback — AI analysis + admin email handled server-side
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ────────────────────────── TYPES ────────────────────────────────────────────

interface FeedbackData {
    category: string;
    rating: number;
    comment: string;
    productInterest: string;
    userType: string;
    email: string;
    username: string;
    wouldRecommend: boolean | null;
    improvements: string;
    contactPermission: boolean;
}

interface AIAnalysis {
    sentiment: string;
    sentimentScore: number;
    urgency: string;
    requiresFollowUp: boolean;
    suggestedAction: string;
    keyTopics: string[];
    riskFlags: string[];
}

// ────────────────────────── CONSTANTS ────────────────────────────────────────

const FEEDBACK_CATEGORIES = [
    { value: 'investment', label: 'Investment', icon: '💰' },
    { value: 'vendor', label: 'Vendor Program', icon: '🏪' },
    { value: 'platform', label: 'Platform', icon: '🖥️' },
    { value: 'support', label: 'Support', icon: '🎧' },
    { value: 'commission', label: 'Commissions', icon: '💳' },
    { value: 'kyc', label: 'KYC', icon: '🆔' },
    { value: 'product', label: 'Products', icon: '📦' },
    { value: 'other', label: 'Other', icon: '📝' },
];

const PRODUCT_INTERESTS = [
    { value: 'none', label: 'Not Interested' },
    { value: 'level-a', label: 'Level A (₹51,111)' },
    { value: 'level-l1', label: 'Level L1 (₹10.6L)' },
    { value: 'level-l2', label: 'Level L2 (₹27L)' },
    { value: 'level-l3', label: 'Level L3 (₹53L)' },
    { value: 'level-l4', label: 'Level L4 (₹1.1Cr)' },
    { value: 'vendor', label: 'Vendor Program' },
];

const initialForm: FeedbackData = {
    category: '',
    rating: 0,
    comment: '',
    productInterest: 'none',
    userType: 'investor',
    email: '',
    username: '',
    wouldRecommend: null,
    improvements: '',
    contactPermission: false,
};

// ────────────────────────── STAR RATING ──────────────────────────────────────

function StarRating({ value, onChange }: { value: number; onChange: (n: number) => void }) {
    const labels = ['', 'Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'];
    return (
        <div className="text-center">
            <div className="flex gap-3 justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => onChange(star)}
                        className={`text-4xl transition-all hover:scale-110 ${star <= value ? 'text-amber-400' : 'text-slate-600'}`}
                    >
                        ★
                    </button>
                ))}
            </div>
            {value > 0 && <p className="text-slate-400 text-sm">{labels[value]}</p>}
        </div>
    );
}

// ────────────────────────── SUCCESS BANNER ───────────────────────────────────

function SuccessBanner({ ai, onReset }: { ai: AIAnalysis; onReset: () => void }) {
    const emoji = ai.sentiment === 'positive' ? '🟢' : ai.sentiment === 'negative' ? '🔴' : '🟡';
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 space-y-6"
        >
            <div className="text-7xl mb-4">✅</div>
            <h2 className="text-3xl font-bold text-white">Thank you!</h2>
            <p className="text-slate-400">Your feedback has been submitted and the team has been notified.</p>

            <div className="max-w-md mx-auto bg-slate-800/60 rounded-2xl p-6 border border-white/10 text-left space-y-3">
                <p className="text-amber-400 font-semibold text-sm">🤖 AI Analysis Summary</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                        <span className="text-slate-400">Sentiment</span>
                        <p className="text-white font-medium">{emoji} {ai.sentiment}</p>
                    </div>
                    <div>
                        <span className="text-slate-400">Score</span>
                        <p className="text-white font-medium">{ai.sentimentScore}/100</p>
                    </div>
                    <div>
                        <span className="text-slate-400">Urgency</span>
                        <p className="text-white font-medium capitalize">{ai.urgency}</p>
                    </div>
                    <div>
                        <span className="text-slate-400">Follow‑up</span>
                        <p className={ai.requiresFollowUp ? 'text-amber-400 font-medium' : 'text-emerald-400 font-medium'}>
                            {ai.requiresFollowUp ? 'Required' : 'Not needed'}
                        </p>
                    </div>
                </div>
                {ai.riskFlags.length > 0 && (
                    <p className="text-red-400 text-xs">⚠️ Risk flags noted: {ai.riskFlags.join(', ')}</p>
                )}
            </div>

            <button
                onClick={onReset}
                className="bg-amber-500 hover:bg-amber-400 text-white font-bold py-3 px-8 rounded-full transition-all"
            >
                Submit Another
            </button>
        </motion.div>
    );
}

// ────────────────────────── MAIN PAGE ────────────────────────────────────────

export default function FeedbackPage() {
    const [form, setForm] = useState<FeedbackData>(initialForm);
    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);
    const [aiResult, setAiResult] = useState<AIAnalysis | null>(null);

    const update = (field: keyof FeedbackData, value: unknown) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
    };

    const validate = (s: number) => {
        const e: Record<string, string> = {};
        if (s === 1) {
            if (!form.category) e.category = 'Select a category';
            if (!form.rating) e.rating = 'Select a rating';
        }
        if (s === 2) {
            if (form.comment.length < 20) e.comment = 'Min 20 characters required';
            if (form.comment.length > 1000) e.comment = 'Max 1000 characters';
        }
        if (s === 3) {
            if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
            if (form.wouldRecommend === null) e.wouldRecommend = 'Please answer';
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate(3)) return;
        setSubmitting(true);
        try {
            const res = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const text = await res.text();
            if (!text) throw new Error('Empty response');
            const json = JSON.parse(text);
            if (json.success) {
                setAiResult(json.aiAnalysis);
            } else {
                setErrors({ submit: json.error ?? 'Submission failed' });
            }
        } catch (err: any) {
            setErrors({ submit: err.message || 'Network error — please try again' });
        } finally {
            setSubmitting(false);
        }
    };

    if (aiResult) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 pt-24 pb-12 px-4">
                <div className="max-w-2xl mx-auto">
                    <SuccessBanner ai={aiResult} onReset={() => { setAiResult(null); setForm(initialForm); setStep(1); }} />
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 pt-24 pb-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        <span className="bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">
                            Share Your Feedback
                        </span>
                    </h1>
                    <p className="text-slate-400">Your insights help us improve the Sunray Ecosystem</p>
                    <div className="flex gap-3 justify-center mt-3 text-xs">
                        <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full">🤖 AI Analysis</span>
                        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full">📧 Direct to Admin</span>
                    </div>
                </div>

                {/* Step Progress */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    {[1, 2, 3].map((s) => (
                        <React.Fragment key={s}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${s < step ? 'bg-emerald-500 text-white' : s === step ? 'bg-amber-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                                {s < step ? '✓' : s}
                            </div>
                            {s < 3 && <div className={`h-1 w-16 rounded ${s < step ? 'bg-amber-400' : 'bg-slate-700'}`} />}
                        </React.Fragment>
                    ))}
                </div>

                <div className="bg-slate-800/50 backdrop-blur rounded-2xl border border-white/10 p-8">
                    <AnimatePresence mode="wait">

                        {/* ── Step 1 ─────────────────────────────── */}
                        {step === 1 && (
                            <motion.div key="s1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-8">
                                <h2 className="text-xl font-semibold text-white">Category & Rating</h2>

                                <div>
                                    <p className="text-slate-400 text-sm mb-3">Select a category *</p>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {FEEDBACK_CATEGORIES.map((c) => (
                                            <button
                                                key={c.value}
                                                onClick={() => update('category', c.value)}
                                                className={`p-4 rounded-xl border text-center transition-all ${form.category === c.value ? 'border-amber-500 bg-amber-500/20 text-white' : 'border-white/10 bg-slate-800/60 text-slate-300 hover:border-amber-500/50'}`}
                                            >
                                                <div className="text-2xl mb-1">{c.icon}</div>
                                                <div className="text-xs font-medium">{c.label}</div>
                                            </button>
                                        ))}
                                    </div>
                                    {errors.category && <p className="text-red-400 text-xs mt-2">{errors.category}</p>}
                                </div>

                                <div>
                                    <p className="text-slate-400 text-sm mb-3">Overall rating *</p>
                                    <StarRating value={form.rating} onChange={(v) => update('rating', v)} />
                                    {errors.rating && <p className="text-red-400 text-xs mt-2 text-center">{errors.rating}</p>}
                                </div>
                            </motion.div>
                        )}

                        {/* ── Step 2 ─────────────────────────────── */}
                        {step === 2 && (
                            <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-6">
                                <h2 className="text-xl font-semibold text-white">Detailed Feedback</h2>

                                <div>
                                    <label className="text-slate-400 text-sm mb-2 block">Your feedback * <span className="text-slate-500">(min 20 chars)</span></label>
                                    <textarea
                                        rows={5}
                                        value={form.comment}
                                        onChange={(e) => update('comment', e.target.value)}
                                        placeholder="Share your experience, suggestions, or concerns…"
                                        className={`w-full bg-slate-900/80 border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition resize-none ${errors.comment ? 'border-red-500' : 'border-white/10'}`}
                                    />
                                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                                        <span>{form.comment.length}/1000</span>
                                        {errors.comment && <span className="text-red-400">{errors.comment}</span>}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-slate-400 text-sm mb-2 block">Product interest</label>
                                    <select value={form.productInterest} onChange={(e) => update('productInterest', e.target.value)} className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                                        {PRODUCT_INTERESTS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-slate-400 text-sm mb-2 block">Suggested improvements <span className="text-slate-500">(optional)</span></label>
                                    <textarea
                                        rows={3}
                                        value={form.improvements}
                                        onChange={(e) => update('improvements', e.target.value)}
                                        placeholder="Any specific features or improvements you'd like?"
                                        className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* ── Step 3 ─────────────────────────────── */}
                        {step === 3 && (
                            <motion.div key="s3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-6">
                                <h2 className="text-xl font-semibold text-white">Contact & Confirmation</h2>

                                <div>
                                    <label className="text-slate-400 text-sm mb-2 block">Email address *</label>
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => update('email', e.target.value)}
                                        placeholder="you@email.com"
                                        className={`w-full bg-slate-900/80 border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.email ? 'border-red-500' : 'border-white/10'}`}
                                    />
                                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="text-slate-400 text-sm mb-2 block">Name <span className="text-slate-500">(optional)</span></label>
                                    <input
                                        value={form.username}
                                        onChange={(e) => update('username', e.target.value)}
                                        placeholder="Your name"
                                        className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-slate-400 text-sm mb-3 block">Would you recommend Sunray Ecosystem? *</label>
                                    <div className="flex gap-4">
                                        <button onClick={() => update('wouldRecommend', true)} className={`flex-1 py-3 rounded-xl font-medium transition-all ${form.wouldRecommend === true ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
                                            👍 Yes
                                        </button>
                                        <button onClick={() => update('wouldRecommend', false)} className={`flex-1 py-3 rounded-xl font-medium transition-all ${form.wouldRecommend === false ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
                                            👎 No
                                        </button>
                                    </div>
                                    {errors.wouldRecommend && <p className="text-red-400 text-xs mt-1">{errors.wouldRecommend}</p>}
                                </div>

                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={form.contactPermission} onChange={(e) => update('contactPermission', e.target.checked)} className="w-5 h-5 rounded accent-amber-500" />
                                    <span className="text-slate-300 text-sm">Allow the team to contact me about this feedback</span>
                                </label>

                                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-sm text-amber-300">
                                    🔒 Your feedback is sent securely to admin. AI analysis will categorise and prioritise it.
                                </div>

                                {errors.submit && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg p-3">{errors.submit}</p>}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex justify-between mt-10 pt-6 border-t border-white/10">
                        <button
                            onClick={() => setStep((s) => Math.max(s - 1, 1))}
                            className="bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-6 rounded-full transition-all"
                        >
                            {step === 1 ? 'Cancel' : '← Back'}
                        </button>

                        {step < 3 ? (
                            <button
                                onClick={() => validate(step) && setStep((s) => s + 1)}
                                className="bg-gradient-to-r from-amber-500 to-amber-400 text-white font-bold py-3 px-8 rounded-full hover:scale-105 transition-all shadow-lg shadow-amber-500/30"
                            >
                                Next →
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="bg-gradient-to-r from-amber-500 to-amber-400 text-white font-bold py-3 px-8 rounded-full hover:scale-105 transition-all shadow-lg shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {submitting && <span className="animate-spin">⟳</span>}
                                {submitting ? 'Submitting…' : 'Submit Feedback'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
