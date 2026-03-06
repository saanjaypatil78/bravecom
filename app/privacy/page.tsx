import React from "react";
import Link from "next/link";

export const metadata = {
    title: "Privacy Policy | Brave Ecom Pvt Ltd",
    description: "Privacy policy governing data collection, use, and security at Brave Ecom Pvt Ltd.",
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#f5f8f8] dark:bg-[#050B14] text-slate-900 dark:text-[#e2e8e8]">
            <div className="max-w-4xl mx-auto px-6 py-16">
                <header className="mb-12">
                    <Link href="/" className="inline-flex items-center gap-2 text-[#25f4f4] hover:underline text-sm font-medium mb-6">
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        Back to Home
                    </Link>
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">Privacy Policy</h1>
                    <p className="text-sm text-slate-500 dark:text-[#9cbaba]">Last updated: 1 March 2026</p>
                </header>

                <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. Information We Collect</h2>
                        <div className="bg-white dark:bg-[#162a2a] rounded-xl p-6 border border-slate-200 dark:border-[#283939]">
                            <p className="text-slate-600 dark:text-[#9cbaba] mb-4">We collect the following types of information:</p>
                            <ul className="space-y-2 text-slate-600 dark:text-[#9cbaba]">
                                <li className="flex items-start gap-2"><span className="text-[#25f4f4] mt-1">•</span> <strong>Personal Information:</strong> Name, email, phone number, PAN card, Aadhaar, bank account details (IFSC, account number) provided during registration.</li>
                                <li className="flex items-start gap-2"><span className="text-[#25f4f4] mt-1">•</span> <strong>Financial Data:</strong> Investment amounts, transaction history, commission records, disbursement preferences.</li>
                                <li className="flex items-start gap-2"><span className="text-[#25f4f4] mt-1">•</span> <strong>Technical Data:</strong> IP address, browser type, device information, cookies for analytics and session management.</li>
                                <li className="flex items-start gap-2"><span className="text-[#25f4f4] mt-1">•</span> <strong>Referral Data:</strong> Referral codes, network hierarchy, commission tier levels.</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">2. How We Use Your Information</h2>
                        <div className="bg-white dark:bg-[#162a2a] rounded-xl p-6 border border-slate-200 dark:border-[#283939]">
                            <ul className="space-y-2 text-slate-600 dark:text-[#9cbaba]">
                                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-1">✓</span> Process investments and disbursements via UPI, NEFT, RTGS, IMPS</li>
                                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-1">✓</span> Calculate and distribute commissions across the 6-level affiliate network</li>
                                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-1">✓</span> Manage franchise partner territories and royalty payments</li>
                                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-1">✓</span> Vendor onboarding and marketplace operations</li>
                                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-1">✓</span> AI-powered financial automation using Google Gemini for ledger reconciliation</li>
                                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-1">✓</span> Comply with Indian financial regulations and KYC/AML requirements</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">3. Data Security</h2>
                        <div className="bg-white dark:bg-[#162a2a] rounded-xl p-6 border border-slate-200 dark:border-[#283939]">
                            <p className="text-slate-600 dark:text-[#9cbaba]">All financial data is encrypted at rest and in transit. Bank account numbers and IFSC codes are partially masked in the public ledger (e.g., XXXX XXXX 4523, HDFC0XXX***). Access to sensitive data is restricted to authorized personnel with audit logging enabled.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">4. Your Rights</h2>
                        <div className="bg-white dark:bg-[#162a2a] rounded-xl p-6 border border-slate-200 dark:border-[#283939]">
                            <p className="text-slate-600 dark:text-[#9cbaba] mb-3">Under applicable data protection laws, you have the right to:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {[
                                    "Access your personal data",
                                    "Correct inaccurate information",
                                    "Request data deletion (subject to legal retention)",
                                    "Opt out of marketing communications",
                                    "Download your transaction history",
                                    "Lodge complaints with data protection authorities",
                                ].map((right, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-[#9cbaba]">
                                        <span className="text-[#25f4f4]">→</span> {right}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">5. Contact</h2>
                        <div className="bg-white dark:bg-[#162a2a] rounded-xl p-6 border border-slate-200 dark:border-[#283939]">
                            <p className="text-slate-600 dark:text-[#9cbaba]">For privacy concerns, contact us at <a href="mailto:privacy@braveecom.com" className="text-[#25f4f4] hover:underline">privacy@braveecom.com</a> or visit our <Link href="/contact" className="text-[#25f4f4] hover:underline">Contact</Link> page.</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
