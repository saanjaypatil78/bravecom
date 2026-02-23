import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { useAuth } from '../contexts/AuthContext';

export const LandingPage: React.FC = () => {
  const { signInWithGoogle, loading } = useAuth();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background-dark text-slate-100 font-display flex flex-col overflow-x-hidden">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-b-surface-border bg-background-dark/90 backdrop-blur-md px-4 md:px-10 py-3">
        <div className="flex items-center gap-4 text-white">
          <div className="size-6 text-primary">
            <span className="material-symbols-outlined text-2xl">ssid_chart</span>
          </div>
          <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">InvestFuture</h2>
        </div>
        <div className="hidden lg:flex flex-1 justify-end gap-8">
          <div className="flex items-center gap-9">
            <a className="text-slate-300 hover:text-primary transition-colors text-sm font-medium leading-normal" href="#">Dashboard</a>
            <a className="text-slate-300 hover:text-primary transition-colors text-sm font-medium leading-normal" href="#">Portfolio</a>
            <a className="text-slate-300 hover:text-primary transition-colors text-sm font-medium leading-normal" href="#">Markets</a>
            <a className="text-slate-300 hover:text-primary transition-colors text-sm font-medium leading-normal" href="#">Learn</a>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={signInWithGoogle}
              disabled={loading}
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary text-[#111813] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors shadow-glow"
            >
              <span className="truncate">{loading ? 'Connecting...' : 'Invest Now'}</span>
            </button>
            <button 
              onClick={signInWithGoogle}
              disabled={loading}
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-surface-border text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#3b5443] transition-colors border border-white/10"
            >
              <span className="truncate">Log In</span>
            </button>
          </div>
        </div>
        <div className="lg:hidden text-white cursor-pointer">
          <span className="material-symbols-outlined">menu</span>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center w-full">
        {/* Hero Section: Progress Tracker */}
        <section className="w-full max-w-7xl px-4 md:px-8 py-12 md:py-20 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl opacity-20 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary rounded-full blur-[120px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500 rounded-full blur-[100px]"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center gap-6 mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-border/50 border border-primary/20 text-primary text-xs font-bold tracking-wider uppercase backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-glow"></span>
              Live Round
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white">
              Pre-IPO <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400 glow-text">Fundraising</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl leading-relaxed">
              Join the exclusive journey to our <span className="text-white font-bold">₹111 Cr</span> milestone. Be part of the future of algorithmic trading and logistics infrastructure.
            </p>
          </div>

          {/* Main Progress Component */}
          <div className="relative w-full max-w-4xl mx-auto bg-[#1c2a21]/80 backdrop-blur-xl border border-surface-border rounded-2xl p-6 md:p-10 shadow-2xl">
            <div className="flex flex-col md:flex-row justify-between items-end mb-4 gap-4">
              <div>
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Total Raised</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl md:text-5xl font-bold text-white">₹12.00 Cr</span>
                  <span className="text-primary font-bold text-sm bg-primary/10 px-2 py-1 rounded">+15% this week</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Target Goal</p>
                <span className="text-2xl md:text-3xl font-bold text-slate-200">₹111.00 Cr</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-6 w-full bg-[#111813] rounded-full overflow-hidden border border-surface-border shadow-inner mb-6">
              <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-600 via-primary to-emerald-400 rounded-full shadow-glow w-[10.8%] transition-all duration-1000 ease-out"></div>
              {/* Stripes pattern overlay */}
              <div className="absolute top-0 left-0 h-full w-full opacity-10" style={{ backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem' }}></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
              <div className="bg-[#111813]/50 p-4 rounded-xl border border-white/5">
                <div className="text-slate-400 text-xs uppercase mb-1">Investors</div>
                <div className="text-xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">groups</span> 1,245
                </div>
              </div>
              <div className="bg-[#111813]/50 p-4 rounded-xl border border-white/5">
                <div className="text-slate-400 text-xs uppercase mb-1">Min Investment</div>
                <div className="text-xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">payments</span> ₹10,000
                </div>
              </div>
              <div className="bg-[#111813]/50 p-4 rounded-xl border border-white/5">
                <div className="text-slate-400 text-xs uppercase mb-1">Time Remaining</div>
                <div className="text-xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">timer</span> 14 Days
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button 
                onClick={signInWithGoogle}
                className="w-full md:w-auto px-8 py-4 bg-primary text-[#111813] font-bold text-lg rounded-xl hover:bg-primary/90 transition-all shadow-glow hover:shadow-glow-lg flex items-center justify-center gap-2 group"
              >
                Secure Your Allocation
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>

        {/* Business Performance Cards */}
        <section className="w-full max-w-7xl px-4 md:px-8 py-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <span className="w-1 h-8 bg-primary rounded-full shadow-glow"></span>
            Business Performance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Trading */}
            <div className="group relative overflow-hidden rounded-2xl bg-[#1c2a21] border border-surface-border p-6 hover:border-primary/50 transition-colors duration-300">
              <div className="absolute inset-0 bg-[url('https://placeholder.pics/svg/300')] opacity-5 mix-blend-overlay"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-surface-border rounded-lg text-primary">
                      <span className="material-symbols-outlined">candlestick_chart</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Active Trading</h3>
                      <p className="text-xs text-slate-400">Algorithmic HFT & Retail</p>
                    </div>
                  </div>
                  <span className="bg-surface-border text-primary text-xs font-bold px-2 py-1 rounded border border-primary/20">+15% MoM</span>
                </div>
                <div className="flex items-end gap-2 mb-4">
                  <span className="text-3xl font-bold text-white">₹45.2 Cr</span>
                  <span className="text-sm text-slate-400 mb-1">Monthly Volume</span>
                </div>
                {/* Simulated Chart */}
                <div className="h-32 w-full relative">
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
                    <path className="drop-shadow-[0_0_8px_rgba(43,238,108,0.5)]" d="M0 45 Q 10 40, 20 42 T 40 30 T 60 35 T 80 15 T 100 5" fill="none" stroke="#2bee6c" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                    <path d="M0 45 Q 10 40, 20 42 T 40 30 T 60 35 T 80 15 T 100 5 V 50 H 0 Z" fill="url(#gradient1)" opacity="0.2"></path>
                    <defs>
                      <linearGradient id="gradient1" x1="0%" x2="0%" y1="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#2bee6c', stopOpacity: 1 }}></stop>
                        <stop offset="100%" style={{ stopColor: '#2bee6c', stopOpacity: 0 }}></stop>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>

            {/* Card 2: Drop Shipping */}
            <div className="group relative overflow-hidden rounded-2xl bg-[#1c2a21] border border-surface-border p-6 hover:border-primary/50 transition-colors duration-300">
              <div className="absolute inset-0 bg-[url('https://placeholder.pics/svg/300')] opacity-5 mix-blend-overlay"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-surface-border rounded-lg text-primary">
                      <span className="material-symbols-outlined">local_shipping</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Logistics Solutions</h3>
                      <p className="text-xs text-slate-400">Global Drop Shipping Network</p>
                    </div>
                  </div>
                  <span className="bg-surface-border text-primary text-xs font-bold px-2 py-1 rounded border border-primary/20">Global Reach</span>
                </div>
                <div className="flex items-end gap-2 mb-4">
                  <span className="text-3xl font-bold text-white">12.5K+</span>
                  <span className="text-sm text-slate-400 mb-1">Orders Shipped / Day</span>
                </div>
                {/* Simulated Chart */}
                <div className="h-32 w-full relative">
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
                    <path className="drop-shadow-[0_0_8px_rgba(43,238,108,0.5)]" d="M0 35 Q 25 35, 35 25 T 65 20 T 100 10" fill="none" stroke="#2bee6c" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                    <path d="M0 35 Q 25 35, 35 25 T 65 20 T 100 10 V 50 H 0 Z" fill="url(#gradient2)" opacity="0.2"></path>
                    <defs>
                      <linearGradient id="gradient2" x1="0%" x2="0%" y1="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#2bee6c', stopOpacity: 1 }}></stop>
                        <stop offset="100%" style={{ stopColor: '#2bee6c', stopOpacity: 0 }}></stop>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Compliance Roadmap */}
        <section className="w-full max-w-7xl px-4 md:px-8 py-16">
          <div className="bg-[#0f1612] border border-surface-border rounded-2xl p-8 md:p-12 relative overflow-hidden">
            {/* Decorative background grid */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#28392e 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <div className="relative z-10">
              <div className="text-center mb-12">
                <span className="text-primary text-sm font-bold tracking-widest uppercase mb-2 block">Regulatory Transparency</span>
                <h2 className="text-3xl font-bold text-white mb-4">Compliance Roadmap</h2>
                <p className="text-slate-400 max-w-xl mx-auto">
                  We are committed to full regulatory compliance. Our transition to a public entity is triggered automatically upon reaching key financial milestones.
                </p>
              </div>

              <div className="relative">
                {/* Connecting Line for Desktop */}
                <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-surface-border">
                  <div className="h-full bg-primary/30 w-1/3"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
                  {/* Step 1 */}
                  <div className="relative flex flex-col items-center text-center md:pt-8 group">
                    <div className="w-12 h-12 rounded-full bg-primary text-[#111813] flex items-center justify-center font-bold text-xl border-4 border-[#0f1612] z-10 shadow-glow mb-4 md:absolute md:-top-6">
                      1
                    </div>
                    <div className="bg-[#1c2a21] p-6 rounded-xl border border-primary/20 w-full hover:border-primary/50 transition-colors">
                      <div className="text-primary font-bold mb-2 flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined">flag</span>
                        Phase 1
                      </div>
                      <h3 className="text-white font-bold text-lg mb-2">Fundraising Goal</h3>
                      <p className="text-slate-400 text-sm">Raise full ₹111 Cr corpus to enable high-volume algorithmic infrastructure.</p>
                      <div className="mt-3 text-xs font-bold text-emerald-400 bg-emerald-900/30 py-1 px-2 rounded inline-block">IN PROGRESS</div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative flex flex-col items-center text-center md:pt-8 group">
                    <div className="w-12 h-12 rounded-full bg-surface-border text-slate-300 flex items-center justify-center font-bold text-xl border-4 border-[#0f1612] z-10 mb-4 md:absolute md:-top-6 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                      2
                    </div>
                    <div className="bg-[#1c2a21]/50 p-6 rounded-xl border border-surface-border w-full hover:bg-[#1c2a21] transition-colors">
                      <div className="text-slate-300 font-bold mb-2 flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined">savings</span>
                        Phase 2
                      </div>
                      <h3 className="text-white font-bold text-lg mb-2">Reserve Buffer</h3>
                      <p className="text-slate-400 text-sm">Accumulate +30% surplus operational capital to ensure market stability during transition.</p>
                      <div className="mt-3 text-xs font-bold text-slate-500 bg-slate-900/30 py-1 px-2 rounded inline-block">PENDING</div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative flex flex-col items-center text-center md:pt-8 group">
                    <div className="w-12 h-12 rounded-full bg-surface-border text-slate-300 flex items-center justify-center font-bold text-xl border-4 border-[#0f1612] z-10 mb-4 md:absolute md:-top-6 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                      3
                    </div>
                    <div className="bg-[#1c2a21]/50 p-6 rounded-xl border border-surface-border w-full hover:bg-[#1c2a21] transition-colors">
                      <div className="text-slate-300 font-bold mb-2 flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined">gavel</span>
                        Phase 3
                      </div>
                      <h3 className="text-white font-bold text-lg mb-2">SEBI Registration</h3>
                      <p className="text-slate-400 text-sm">Formal legal name change & SEBI registration filing for public listing.</p>
                      <div className="mt-3 text-xs font-bold text-slate-500 bg-slate-900/30 py-1 px-2 rounded inline-block">PENDING</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="w-full px-4 py-16 bg-[#0a0f0c] border-t border-surface-border text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to shape the future?</h2>
            <p className="text-slate-400 mb-8">Join thousands of forward-thinking investors in the most advanced algorithmic trading ecosystem.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={signInWithGoogle}
                className="px-8 py-3 bg-primary text-[#111813] font-bold rounded-lg hover:bg-primary/90 transition-all shadow-glow"
              >
                Invest Now
              </button>
              <button className="px-8 py-3 bg-transparent border border-surface-border text-white font-bold rounded-lg hover:bg-surface-border transition-all">
                Download Pitch Deck
              </button>
            </div>
          </div>
        </section>

        {/* Simple Footer */}
        <footer className="w-full py-8 border-t border-surface-border bg-[#111813] text-center text-slate-500 text-sm">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="material-symbols-outlined text-lg">verified_user</span>
            <span>Secure SSL Encryption</span>
          </div>
          <p>© 2023 InvestFuture Technologies. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
};