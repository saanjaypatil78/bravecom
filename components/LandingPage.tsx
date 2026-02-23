import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { ArrowRight, Globe, Zap, BarChart3, Users, Award, Check, ChevronLeft, MapPin, Box, Truck, ShieldCheck, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type LandingView = 'home' | 'plans';

// Generate random dots for the city map
const MAP_DOTS = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    top: Math.random() * 80 + 10 + '%',
    left: Math.random() * 90 + 5 + '%',
    delay: Math.random() * 2 + 's',
    duration: Math.random() * 2 + 1 + 's',
    size: Math.random() > 0.8 ? 'w-3 h-3' : 'w-1.5 h-1.5' // Some large hubs, some small nodes
}));

export const LandingPage: React.FC = () => {
  const { signInWithGoogle, loading } = useAuth();
  const [currentView, setCurrentView] = useState<LandingView>('home');
  const [scrollY, setScrollY] = useState(0);

  // Parallax Logic
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    if (target === 'plans') {
        setCurrentView('plans');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        if (currentView === 'plans') {
            setCurrentView('home');
            setTimeout(() => {
                const element = document.getElementById(target);
                if (element) {
                    const headerOffset = 100;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
            }, 100);
        } else {
            const element = document.getElementById(target);
            if (element) {
                const headerOffset = 100;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        }
    }
  };

  const navigateHome = (e: React.MouseEvent) => {
      e.preventDefault();
      setCurrentView('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white selection:bg-amber-500 selection:text-black overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-[#0f172a]/80 backdrop-blur-lg border-b border-white/5 transition-all duration-500" style={{ transform: `translateY(${scrollY > 50 ? '0' : '0'})` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Redirection Logic */}
            <div 
                className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-all hover:scale-105 active:scale-95" 
                onClick={navigateHome}
            >
              <div>
                <Logo size="sm" />
              </div>
              <div className="hidden md:block">
                <span className="text-xl font-bold tracking-wider font-['Rajdhani']">BRAVE</span>
                <span className="text-amber-500 font-bold ml-1 font-['Rajdhani']">ECOM</span>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a onClick={(e) => handleNavClick(e, 'features')} href="#features" className={`text-sm font-medium transition-all hover:scale-110 ${currentView === 'home' ? 'text-slate-300 hover:text-white' : 'text-slate-500 hover:text-slate-300'}`}>Solutions</a>
              <a onClick={(e) => handleNavClick(e, 'global')} href="#global" className={`text-sm font-medium transition-all hover:scale-110 ${currentView === 'home' ? 'text-slate-300 hover:text-white' : 'text-slate-500 hover:text-slate-300'}`}>Global Network</a>
              <a onClick={(e) => handleNavClick(e, 'plans')} href="#plans" className={`text-sm font-bold transition-all hover:scale-110 ${currentView === 'plans' ? 'text-amber-500' : 'text-slate-300 hover:text-amber-500'}`}>Smart Plans</a>
            </div>
            <button 
              onClick={signInWithGoogle}
              disabled={loading}
              className="bronze-gradient text-slate-900 px-6 py-2 rounded-md font-bold text-sm hover:shadow-[0_0_20px_rgba(199,145,85,0.4)] transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              {loading ? 'CONNECTING...' : 'CLIENT LOGIN'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </div>
        </div>
      </nav>

      {/* VIEW: HOME */}
      {currentView === 'home' && (
        <div className="animate-fade-in relative">
            
            {/* Parallax Background Layers */}
            <div className="fixed inset-0 pointer-events-none z-0">
                 {/* Deep Space Layer */}
                 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black"></div>
                 
                 {/* Floating Particles - Parallax - Layer 1 (Fast) */}
                 <div className="absolute top-20 left-10 w-2 h-2 bg-amber-500 rounded-full opacity-20 blur-[1px]" style={{ transform: `translateY(${scrollY * 0.2}px)` }}></div>
                 <div className="absolute top-40 right-20 w-3 h-3 bg-blue-500 rounded-full opacity-20 blur-[1px]" style={{ transform: `translateY(${scrollY * -0.15}px)` }}></div>
                 <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-white rounded-full opacity-30 blur-[1px]" style={{ transform: `translateY(${scrollY * 0.5}px)` }}></div>
                 
                 {/* Parallax - Layer 2 (Medium) */}
                 <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-amber-600/5 rounded-full blur-3xl" style={{ transform: `translateY(${scrollY * 0.05}px)` }}></div>
                 <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" style={{ transform: `translateY(${scrollY * -0.05}px)` }}></div>

                 {/* Parallax - Layer 3 (Slow/Background shapes) */}
                 <div className="absolute -top-20 -right-20 w-[500px] h-[500px] border border-white/5 rounded-full opacity-20" style={{ transform: `rotate(${scrollY * 0.02}deg)` }}></div>
                 <div className="absolute top-1/2 left-10 w-20 h-20 border-2 border-amber-500/10 rotate-45 opacity-20" style={{ transform: `translateY(${scrollY * 0.1}px) rotate(${45 + scrollY * 0.1}deg)` }}></div>
            </div>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden z-10">
                {/* Dynamic Glow Behind Text */}
                <div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-amber-600/10 rounded-full blur-[100px] -z-10"
                    style={{ transform: `translate(-50%, -50%) scale(${1 + scrollY * 0.001})` }}
                ></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-amber-500/30 mb-8 animate-fade-in-up hover:bg-slate-800 transition-all cursor-pointer group hover:scale-105 duration-300 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse group-hover:bg-green-400 shadow-[0_0_10px_#f59e0b]"></span>
                        <span className="text-xs font-semibold text-amber-400 tracking-wide uppercase group-hover:text-green-400 transition-colors">System Operational v2.4</span>
                    </div>
                    
                    <div className="relative group cursor-pointer mb-6 inline-block">
                        <h1 className="relative text-5xl md:text-8xl font-bold font-['Rajdhani'] leading-tight transition-all duration-300 group-hover:tracking-wide z-10">
                            THE FUTURE OF <br />
                            <span className="text-bronze-gradient drop-shadow-2xl inline-block relative transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-105">
                                FRICTIONLESS DROPSHIPPING
                            </span>
                        </h1>
                    </div>
                    
                    <p className="max-w-2xl mx-auto text-lg text-slate-400 mb-10 font-light leading-relaxed backdrop-blur-sm p-4 rounded-xl transition-all hover:bg-white/5 hover:scale-[1.01]">
                        Empowering Brave Ecom Pvt Ltd with automated fulfillment, AI-driven market analysis, and a global logistics network. Scale your empire without touching inventory.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <a 
                            href="#plans"
                            onClick={(e) => handleNavClick(e, 'plans')}
                            className="w-full sm:w-auto px-8 py-4 bronze-gradient rounded-lg font-bold text-slate-900 text-lg flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-[0_0_30px_rgba(199,145,85,0.3)] transform hover:-translate-y-1 hover:scale-105 active:scale-95"
                        >
                            View Smart Plans <ArrowRight size={20} />
                        </a>
                        <button 
                            onClick={signInWithGoogle}
                            className="w-full sm:w-auto px-8 py-4 bg-slate-800/80 border border-slate-600 rounded-lg font-bold text-slate-200 text-lg hover:bg-slate-700 transition-all backdrop-blur-md flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(148,163,184,0.2)] transform hover:-translate-y-1 hover:scale-105 active:scale-95"
                        >
                            Launch Dashboard
                        </button>
                    </div>
                </div>

                {/* Floating Parallax Logos */}
                <div className="absolute top-20 left-10 opacity-30" style={{ transform: `translateY(${scrollY * 0.4}px) rotate(${scrollY * 0.1}deg)` }}>
                    <Logo size="lg" />
                </div>
                <div className="absolute bottom-10 right-10 opacity-30" style={{ transform: `translateY(${scrollY * -0.2}px) rotate(${scrollY * -0.05}deg)` }}>
                    <Logo size="lg" />
                </div>
            </section>

            {/* Stats Section with Parallax */}
            <section className="py-12 border-y border-white/5 bg-slate-900/60 backdrop-blur-md relative z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { label: 'Active Merchants', val: '10k+' },
                            { label: 'Daily Shipments', val: '50k+' },
                            { label: 'Countries Served', val: '140+' },
                            { label: 'Uptime', val: '99.99%' },
                        ].map((stat, i) => (
                            <div key={i} className="hover:scale-110 transition-transform duration-300 cursor-default p-4 rounded-xl hover:bg-white/5">
                                <h4 className="text-4xl font-bold text-white font-['Rajdhani'] mb-1 drop-shadow-md">{stat.val}</h4>
                                <p className="text-sm text-amber-500 uppercase tracking-widest font-bold">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Global Reach / Citywide Zooming Section */}
            <section id="global" className="h-[80vh] relative overflow-hidden flex items-center justify-center z-10 border-b border-white/5">
                {/* Background Map - Parallax Zoom Effect */}
                <div 
                    className="absolute inset-0 bg-[#0b1120] z-0 transition-transform duration-75"
                    style={{ 
                        transform: `scale(${1 + Math.max(0, (scrollY - 500) * 0.0005)})`,
                        backgroundImage: 'radial-gradient(circle at 50% 50%, #1e293b 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                >
                    {/* Pulsing Dots - Randomized Rhythm */}
                    {MAP_DOTS.map((dot) => (
                        <div 
                            key={dot.id}
                            className={`absolute rounded-full bg-amber-500 shadow-[0_0_15px_#f59e0b] animate-pulse`}
                            style={{ 
                                top: dot.top, 
                                left: dot.left, 
                                width: dot.size === 'w-3 h-3' ? '12px' : '6px',
                                height: dot.size === 'w-3 h-3' ? '12px' : '6px',
                                animationDuration: dot.duration,
                                animationDelay: dot.delay,
                                opacity: 0.8
                            }}
                        >
                            {/* Connecting Lines for larger hubs */}
                            {dot.size === 'w-3 h-3' && (
                                <div className="absolute top-1/2 left-1/2 w-32 h-[1px] bg-gradient-to-r from-amber-500/50 to-transparent -translate-y-1/2 -z-10 rotate-45"></div>
                            )}
                        </div>
                    ))}
                    
                    {/* Central Hub Pulse */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform duration-500 cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_30px_white] animate-ping"></div>
                        <div className="absolute top-0 left-0 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                </div>

                <div className="relative z-10 text-center max-w-4xl mx-auto px-4 bg-slate-900/40 p-12 rounded-3xl backdrop-blur-sm border border-white/10 shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-amber-500/10">
                    <Globe className="w-16 h-16 text-amber-500 mx-auto mb-6 animate-pulse" />
                    <h2 className="text-5xl font-bold font-['Rajdhani'] mb-4 tracking-tight">
                        GLOBAL <span className="text-bronze-gradient">CITYWIDE NETWORK</span>
                    </h2>
                    <p className="text-xl text-slate-300 leading-relaxed">
                        From low-earth orbit tracking to city-street delivery. Our heart-pulsing logistics network connects your brand to customers in 140+ countries with millimeter precision.
                    </p>
                    <div className="mt-8 flex justify-center gap-8">
                         <div className="flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors transform hover:scale-110 duration-300">
                             <Truck size={20} className="text-amber-500" /> 
                             <span className="text-sm font-bold tracking-widest uppercase">Last Mile</span>
                         </div>
                         <div className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors transform hover:scale-110 duration-300">
                             <Box size={20} className="text-blue-500" /> 
                             <span className="text-sm font-bold tracking-widest uppercase">Automated</span>
                         </div>
                         <div className="flex items-center gap-2 text-slate-400 hover:text-green-400 transition-colors transform hover:scale-110 duration-300">
                             <MapPin size={20} className="text-green-500" /> 
                             <span className="text-sm font-bold tracking-widest uppercase">Live Tracking</span>
                         </div>
                    </div>
                </div>
            </section>

            {/* Features Grid - Pop-up Hover Effects */}
            <section id="features" className="py-24 relative z-10 bg-gradient-to-b from-[#0f172a] to-[#0b1120]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold font-['Rajdhani'] mb-4">ENGINEERED FOR <span className="text-amber-500">GROWTH</span></h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Our infrastructure removes the bottlenecks of traditional e-commerce.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { 
                                icon: Zap, 
                                title: 'Instant Sourcing', 
                                desc: 'Connect with verified suppliers instantly. Our AI matches your niche with high-margin products.',
                                color: 'text-yellow-400',
                                bg: 'group-hover:bg-yellow-400'
                            },
                            { 
                                icon: Globe, 
                                title: 'Global Fulfillment', 
                                desc: 'Warehouses in US, EU, and Asia ensure your customers get products in days, not weeks.',
                                color: 'text-blue-400',
                                bg: 'group-hover:bg-blue-400'
                            },
                            { 
                                icon: BarChart3, 
                                title: 'Predictive Analytics', 
                                desc: 'Real-time dashboards that predict trends before they happen using our proprietary data sets.',
                                color: 'text-green-400',
                                bg: 'group-hover:bg-green-400'
                            },
                        ].map((feat, i) => (
                            <div key={i} className="group p-8 rounded-2xl bg-slate-900/80 border border-slate-800 transition-all duration-500 relative overflow-hidden hover:scale-105 hover:-translate-y-4 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] hover:border-amber-500/30 cursor-default">
                                {/* Hover Glow Background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                
                                <div className={`w-14 h-14 rounded-xl bg-slate-800 flex items-center justify-center ${feat.color} mb-6 ${feat.bg} group-hover:text-black transition-all duration-300 shadow-lg group-hover:scale-110 group-hover:rotate-3`}>
                                    <feat.icon size={28} />
                                </div>
                                <h3 className="text-2xl font-bold mb-3 font-['Rajdhani'] text-white group-hover:text-amber-400 transition-colors">{feat.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-200 transition-colors">{feat.desc}</p>
                                
                                {/* Corner Accent */}
                                <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-r-[40px] border-t-transparent border-r-amber-500/0 group-hover:border-r-amber-500 transition-all duration-300"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
      )}

      {/* VIEW: PLANS (SUBPAGE) */}
      {currentView === 'plans' && (
        <section className="pt-32 pb-24 bg-[#0f172a] min-h-screen animate-fade-in relative z-20">
           {/* Subpage Header */}
           <div className="absolute top-32 left-4 md:left-8">
                <button 
                    onClick={() => setCurrentView('home')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-all group px-4 py-2 bg-slate-900 rounded-lg border border-slate-800 hover:border-amber-500 hover:scale-105 active:scale-95"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </button>
           </div>

           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
              <div className="text-center mb-16 relative">
                  <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold mb-4 border border-amber-500/20 hover:scale-105 transition-transform cursor-default">
                      SECURED • NOTARIZED • EQUITY BACKED
                  </div>
                  <h2 className="text-5xl font-bold font-['Rajdhani'] mb-6">SMART <span className="text-bronze-gradient">STRATEGIC PLANS</span></h2>
                  <p className="text-slate-400 max-w-3xl mx-auto text-lg leading-relaxed">
                      Join Brave Ecom Pvt Ltd with a secure, high-yield partnership structure. 
                      Featuring year-wise notarized agreements and defined exit strategies.
                  </p>
              </div>
  
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                  {/* Standard Partner */}
                  <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 relative overflow-hidden hover:border-amber-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-900/10 group hover:-translate-y-2 hover:scale-[1.02]">
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                          <Users size={140} />
                      </div>
                      <h3 className="text-3xl font-bold text-white font-['Rajdhani'] mb-2">Equity Partner</h3>
                      <div className="text-5xl font-bold text-amber-500 mb-2">₹10 Lacs <span className="text-base text-slate-400 font-normal align-middle">/ unit</span></div>
                      <p className="text-base text-slate-400 mb-8 border-b border-slate-800 pb-8">0.1% Equity Stake per Unit</p>
  
                      <div className="space-y-6 mb-10">
                          {[
                              { icon: Check, color: 'text-green-500', bg: 'bg-green-500/10', title: 'Monthly 50% Capital Return', desc: 'First payout on 45th day, then every 30 days. 50% of capital monthly for 12 months.' },
                              { icon: ShieldCheck, color: 'text-amber-500', bg: 'bg-amber-500/10', title: 'Notarized Security', desc: 'Fully notarized backed agreement ensuring your capital.' },
                              { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10', title: 'Auto-Termination Clause', desc: 'Agreement terminates automatically after 12th month.' }
                          ].map((feat, i) => (
                              <div key={i} className="flex items-start gap-4 group/item hover:translate-x-2 transition-transform duration-300">
                                  <div className={`w-10 h-10 rounded-lg ${feat.bg} flex items-center justify-center shrink-0`}>
                                      <feat.icon className={feat.color} size={20} />
                                  </div>
                                  <div>
                                      <p className="font-bold text-white text-base">{feat.title}</p>
                                      <p className="text-sm text-slate-400 mt-1">{feat.desc}</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                      
                      <button onClick={signInWithGoogle} className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all border border-slate-600 text-lg hover:shadow-lg hover:scale-[1.02] active:scale-95">
                          Join Equity Plan
                      </button>
                  </div>
  
                  {/* Strategic Investor */}
                  <div className="bg-gradient-to-b from-slate-900 to-amber-950/30 border border-amber-500/50 rounded-2xl p-8 relative overflow-hidden shadow-2xl shadow-amber-900/20 transform hover:-translate-y-4 hover:scale-[1.03] transition-all duration-300">
                      <div className="absolute top-0 right-0 bg-amber-500 text-slate-900 text-sm font-bold px-4 py-1.5 rounded-bl-xl shadow-lg">
                          RECOMMENDED
                      </div>
                       <div className="absolute top-0 right-0 p-4 opacity-10 mt-8 group-hover:scale-110 transition-transform duration-500">
                          <Award size={140} />
                      </div>
                      <h3 className="text-3xl font-bold text-white font-['Rajdhani'] mb-2">Strategic Partner</h3>
                      <div className="text-5xl font-bold text-amber-500 mb-2">₹50 Lacs <span className="text-base text-slate-400 font-normal align-middle">/ max cap</span></div>
                      <p className="text-base text-slate-400 mb-8 border-b border-amber-500/20 pb-8">0.5% Equity Stake (Max per Partner)</p>
  
                      <div className="space-y-6 mb-10">
                          {[
                              { icon: Check, color: 'text-green-500', bg: 'bg-green-500/10', title: 'Aggressive Return Schedule', desc: 'Monthly 50% capital payout starting 45th day for 12 months.' },
                              { icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10', title: 'Monthly Referral Bonus', desc: 'Earn referral amounts on returns (monthly basis).' },
                              { icon: ShieldCheck, color: 'text-amber-500', bg: 'bg-amber-500/10', title: 'Notarized & Secured', desc: 'Backed by premium notarized agreement security.' }
                          ].map((feat, i) => (
                              <div key={i} className="flex items-start gap-4 hover:translate-x-2 transition-transform duration-300">
                                  <div className={`w-10 h-10 rounded-lg ${feat.bg} flex items-center justify-center shrink-0`}>
                                      <feat.icon className={feat.color} size={20} />
                                  </div>
                                  <div>
                                      <p className="font-bold text-white text-base">{feat.title}</p>
                                      <p className="text-sm text-slate-400 mt-1">{feat.desc}</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                      
                      <button onClick={signInWithGoogle} className="w-full py-4 bronze-gradient text-slate-900 font-bold rounded-xl transition-all hover:scale-[1.05] active:scale-95 shadow-lg text-lg hover:shadow-amber-500/20">
                          Join Strategic Plan
                      </button>
                  </div>
              </div>
              
              <div className="mt-16 p-6 bg-slate-900/50 rounded-xl border border-slate-800 text-center max-w-4xl mx-auto hover:bg-slate-900 transition-colors duration-300">
                  <h4 className="text-slate-300 font-bold mb-2 uppercase text-xs tracking-widest">Legal Disclaimer & Terms</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                      12-month agreement term. Payout logic: Monthly 50% of capital contribution starting on the 45th day, then every 30 days until the 12th month. Agreement terminates automatically thereafter. Equity allocation is 0.1% per ₹10 Lacs contribution. Max cap ₹50 Lacs per partner. Equity stack make you partner not retail investors and it's limited time deal upto max quota of 5 % gets allotted early investors those value is already above 20L INR = 0.01% of equity. Investments are subject to market risks and company performance.
                  </p>
              </div>
           </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-slate-950 pt-20 pb-10 border-t border-slate-900 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                <div className="flex items-center gap-3 mb-6 md:mb-0 hover:scale-105 transition-transform duration-300 origin-left cursor-default">
                    <Logo size="md" />
                    <div>
                        <h4 className="text-2xl font-bold font-['Rajdhani'] tracking-widest text-white">BRAVE</h4>
                        <p className="text-xs text-amber-600 font-bold tracking-[0.2em]">ECOM PVT LTD</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-slate-500 text-sm">Headquarters</p>
                    <p className="text-slate-300">Mumbai, Maharashtra, India</p>
                </div>
            </div>
            <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600">
                <p>&copy; 2024 brave ecom pvt ltd. All rights reserved.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <a href="#" className="hover:text-amber-500 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-amber-500 transition-colors">Terms of Service</a>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
};