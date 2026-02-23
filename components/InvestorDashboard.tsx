import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export const InvestorDashboard: React.FC = () => {
  const { signOut, profile } = useAuth();

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex flex-col overflow-x-hidden selection:bg-primary selection:text-background-dark">
      {/* Global Header */}
      <header className="sticky top-0 z-50 w-full border-b border-card-border bg-background-dark/95 backdrop-blur-md px-6 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-white">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-3xl">token</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight">InvestFuture</h2>
            </div>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a className="text-white text-sm font-semibold hover:text-primary transition-colors" href="#">Dashboard</a>
            <a className="text-slate-400 text-sm font-medium hover:text-primary transition-colors" href="#">Portfolio</a>
            <a className="text-slate-400 text-sm font-medium hover:text-primary transition-colors" href="#">Referrals</a>
            <a className="text-slate-400 text-sm font-medium hover:text-primary transition-colors" href="#">Wallet</a>
          </nav>

          <div className="flex items-center gap-6">
            {/* Status Badge with Pulsing Effect */}
            <div className="hidden sm:flex items-center gap-3 rounded-full bg-card-dark border border-card-border py-1.5 pl-2 pr-4 shadow-sm">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">Active Status</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="relative rounded-full p-2 text-slate-400 hover:text-white transition-colors">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-background-dark"></span>
              </button>
              <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-card-border bg-card-dark flex items-center justify-center cursor-pointer" onClick={signOut}>
                <span className="text-xs font-bold">{profile?.full_name?.charAt(0) || 'U'}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full px-4 py-8 mx-auto max-w-7xl">
        {/* Hero Section: Disbursement Countdown */}
        <section className="mb-12">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card-dark to-background-dark border border-card-border p-8 md:p-12 shadow-2xl">
            {/* Abstract decorative background glow */}
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-primary/5 blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="max-w-xl text-center md:text-left">
                <div className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1 mb-4">
                  <span className="material-symbols-outlined text-primary text-sm">schedule</span>
                  <span className="text-primary text-xs font-bold uppercase tracking-wide">Cycle: 1st - 14th</span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight mb-4">
                  Next Disbursement<br/>Cycle Ends In
                </h1>
                <p className="text-slate-400 text-base md:text-lg max-w-md mx-auto md:mx-0">
                  Payouts are processed automatically. Ensure your wallet is connected before the timer hits zero.
                </p>
              </div>
              
              {/* Countdown Timer */}
              <div className="flex gap-3 md:gap-5">
                <div className="flex flex-col gap-2">
                  <div className="flex h-20 w-20 md:h-24 md:w-24 flex-col items-center justify-center rounded-xl bg-[#1e3626] border border-[#2a4a35] shadow-inner">
                    <span className="text-3xl md:text-4xl font-black text-white">12</span>
                  </div>
                  <span className="text-center text-xs md:text-sm font-medium text-slate-400 uppercase tracking-widest">Days</span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex h-20 w-20 md:h-24 md:w-24 flex-col items-center justify-center rounded-xl bg-[#1e3626] border border-[#2a4a35] shadow-inner">
                    <span className="text-3xl md:text-4xl font-black text-white">04</span>
                  </div>
                  <span className="text-center text-xs md:text-sm font-medium text-slate-400 uppercase tracking-widest">Hours</span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex h-20 w-20 md:h-24 md:w-24 flex-col items-center justify-center rounded-xl bg-[#1e3626] border border-[#2a4a35] shadow-inner">
                    <span className="text-3xl md:text-4xl font-black text-white">32</span>
                  </div>
                  <span className="text-center text-xs md:text-sm font-medium text-slate-400 uppercase tracking-widest">Mins</span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex h-20 w-20 md:h-24 md:w-24 flex-col items-center justify-center rounded-xl bg-primary/20 border border-primary/30 shadow-[0_0_15px_rgba(13,242,89,0.2)]">
                    <span className="text-3xl md:text-4xl font-black text-primary animate-pulse">15</span>
                  </div>
                  <span className="text-center text-xs md:text-sm font-bold text-primary uppercase tracking-widest">Secs</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Card 1: Active Investment */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-card-dark border border-card-border p-6 hover:border-primary/50 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">Total Active Investment</p>
                <h3 className="text-3xl font-bold text-white tracking-tight">₹55,000<span className="text-slate-500 text-lg">.00</span></h3>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1e3626] text-primary group-hover:bg-primary group-hover:text-background-dark transition-colors">
                <span className="material-symbols-outlined">payments</span>
              </div>
            </div>
            <div className="mt-auto">
              <div className="flex items-center gap-2 text-sm font-medium text-primary bg-primary/10 w-fit px-2 py-1 rounded">
                <span className="material-symbols-outlined text-base">trending_up</span>
                <span>+₹4,000 this month</span>
              </div>
            </div>
          </div>

          {/* Card 2: ROI Rate */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-card-dark border border-card-border p-6 hover:border-primary/50 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">Current ROI Rate</p>
                <h3 className="text-3xl font-bold text-white tracking-tight">15% <span className="text-lg text-slate-500 font-medium">(Static)</span></h3>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1e3626] text-primary group-hover:bg-primary group-hover:text-background-dark transition-colors">
                <span className="material-symbols-outlined">ssid_chart</span>
              </div>
            </div>
            <div className="mt-auto w-full bg-background-dark rounded-full h-1.5 overflow-hidden">
              <div className="bg-primary h-1.5 rounded-full" style={{ width: '15%' }}></div>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-right">Fixed Monthly Return</p>
          </div>

          {/* Card 3: Referral Action (Critical) */}
          <div className="relative flex flex-col justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 to-card-dark border border-primary/30 p-6">
            <div className="absolute top-0 right-0 p-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Maintain Green Status</h3>
            <p className="text-sm text-slate-300 mb-6">You have <span className="text-white font-bold">12 days</span> remaining in your 60-day cycle to maintain active status.</p>
            <button className="flex items-center justify-center gap-2 w-full rounded-lg bg-primary py-3 text-sm font-bold text-background-dark hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95">
              <span className="material-symbols-outlined">qr_code_2</span>
              Generate Referral Code
            </button>
          </div>
        </div>

        {/* Recent Activity Table Section */}
        <section className="rounded-xl bg-card-dark border border-card-border overflow-hidden">
          <div className="px-6 py-5 border-b border-card-border flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
            <button className="text-primary text-sm font-semibold hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-background-dark/50 text-slate-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border text-slate-200">
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-primary">
                        <span className="material-symbols-outlined text-sm">arrow_downward</span>
                      </div>
                      <span className="font-medium">ROI Disbursement</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-400">Oct 15, 2023</td>
                  <td className="px-6 py-4 font-bold text-primary">+₹8,250</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      Completed
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-500/10 text-blue-400">
                        <span className="material-symbols-outlined text-sm">group_add</span>
                      </div>
                      <span className="font-medium">Referral Bonus (Lvl 2)</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-400">Oct 12, 2023</td>
                  <td className="px-6 py-4 font-bold text-white">+₹1,500</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      Completed
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-orange-500/10 text-orange-400">
                        <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
                      </div>
                      <span className="font-medium">Withdrawal to Bank</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-400">Oct 01, 2023</td>
                  <td className="px-6 py-4 font-bold text-slate-300">-₹12,000</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-700 px-2.5 py-0.5 text-xs font-medium text-slate-300">
                      Processed
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};
