import React from "react";
import Link from "next/link";

export const metadata = {
    title: "Terms of Service | Brave Ecom Pvt Ltd",
    description: "Terms and conditions governing the use of Brave Ecom Pvt Ltd's investment, franchise, and marketplace services.",
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#f5f8f8] dark:bg-[#050B14] text-slate-900 dark:text-[#e2e8e8]">
            <div className="max-w-4xl mx-auto px-6 py-16">
                <header className="mb-12">
                    <Link href="/" className="inline-flex items-center gap-2 text-[#25f4f4] hover:underline text-sm font-medium mb-6">
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        Back to Home
                    </Link>
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">Terms of Service</h1>
                    <p className="text-sm text-slate-500 dark:text-[#9cbaba]">Effective Date: 1 January 2024 | Last Revised: 1 March 2026</p>
                </header>

                <div className="space-y-8">
                    {[
                        {
                            title: "1. Acceptance of Terms",
                            content: "By accessing or using the Brave Ecom Pvt Ltd platform, including the Sunray Investment Network, Brave Ecom Mall, Franchise Portal, and Vendor Marketplace, you agree to be bound by these Terms of Service. If you do not agree, you must discontinue use immediately.",
                        },
                        {
                            title: "2. Investment Services",
                            content: "Investments are structured across Tiers A–H with 12-month agreements. Monthly profit rates range from 3% (Tier A) to 6.5% (Tier H). Disbursements are processed via UPI, NEFT, RTGS, or IMPS based on transaction amount. Past performance does not guarantee future returns. All investments carry inherent risk.",
                        },
                        {
                            title: "3. Commission & Affiliate Network",
                            content: "The 6-Level Progressive Commission Engine distributes commissions across BRONZE, SILVER, GOLD, PLATINUM, and AMBASSADOR tiers. Commission rates, rank criteria, and team milestones are subject to periodic revision. Active Investor status (Green ID) requires a minimum capital of ₹1,00,000.",
                        },
                        {
                            title: "4. Franchise Operations",
                            content: "Franchise partnerships are offered on 12, 24, or 36-month contracts. Territory allocation is exclusive. Franchise fees are non-refundable after territory activation. Monthly royalties are based on business volume share within the allocated territory.",
                        },
                        {
                            title: "5. Marketplace & Vendor Terms",
                            content: "Vendor onboarding fees vary by tier (Basic: ₹10,000, Premium: ₹25,000, Featured: ₹50,000, Enterprise: ₹1,00,000). Product listings must comply with marketplace quality standards. Settlements are processed bi-weekly. Brave Ecom reserves the right to delist non-compliant products.",
                        },
                        {
                            title: "6. Account Closure",
                            content: "Investors may request account closure at any time. Final settlement includes principal plus accrued returns up to the closure date. Settlement is processed within 7–14 business days via the investor's registered bank account. Early closure may incur a processing fee.",
                        },
                        {
                            title: "7. Public Financial Ledger",
                            content: "Brave Ecom maintains a publicly accessible financial ledger showing all material transactions. Entity names and bank details are partially masked for privacy. The ledger is updated in real-time and accessible without authentication at /ledger.",
                        },
                        {
                            title: "8. AI-Powered Automation",
                            content: "Certain financial processes are automated using Google Gemini AI agents, including franchise onboarding, investor flow management, vendor operations, bank withdrawal processing, and ledger reconciliation. AI-generated recommendations are subject to human review before execution.",
                        },
                        {
                            title: "9. Limitation of Liability",
                            content: "Brave Ecom Pvt Ltd shall not be liable for losses arising from market fluctuations, force majeure events, or third-party banking delays. Maximum liability is limited to the principal amount invested. We recommend consulting independent financial advisors before making investment decisions.",
                        },
                        {
                            title: "10. Governing Law",
                            content: "These Terms shall be governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Mumbai, Maharashtra.",
                        },
                    ].map((section, i) => (
                        <section key={i}>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{section.title}</h2>
                            <div className="bg-white dark:bg-[#162a2a] rounded-xl p-6 border border-slate-200 dark:border-[#283939]">
                                <p className="text-slate-600 dark:text-[#9cbaba] leading-relaxed">{section.content}</p>
                            </div>
                        </section>
                    ))}

                    <div className="mt-12 text-center text-sm text-slate-500 dark:text-[#9cbaba]">
                        <p>Questions? Contact <Link href="/contact" className="text-[#25f4f4] hover:underline">support</Link> or email <a href="mailto:legal@braveecom.com" className="text-[#25f4f4] hover:underline">legal@braveecom.com</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
