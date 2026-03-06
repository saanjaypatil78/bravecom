"use client";

import { useState } from "react";

export default function SystemHealthPage() {
  const [services] = useState([
    { name: "Auth Service", type: "Critical", status: "Healthy", cpu: 12, ram: 400, uptime: "99.99%", pod: "Pod-x82" },
    { name: "Commission Engine", type: "Core", status: "High Load", cpu: 45, ram: 2100, uptime: "99.95%", pod: "Pod-c12", warning: true },
    { name: "Treasury Service", type: "Financial", status: "Healthy", cpu: 8, ram: 1200, uptime: "100.00%", pod: "Pod-t04" },
    { name: "Ledger Service", type: "Storage", status: "Healthy", cpu: 15, ram: 800, uptime: "99.98%", pod: "Pod-l08", websockets: 1200, writeOps: 342 },
  ]);

  return (
    <div className="min-h-screen bg-[#0f1214] text-slate-100 font-['Space_Grotesk',sans-serif] flex flex-col overflow-hidden">
      {/* Top Navigation */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#283539] bg-[#182023] px-6 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-4 text-white">
          <div className="size-8 flex items-center justify-center bg-[#0db9f2]/20 rounded-lg text-[#0db9f2]">
            <span className="material-symbols-outlined">hub</span>
          </div>
          <div>
            <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex items-center gap-2">
              System Architecture // Node Monitor V.2.0
              <span className="text-[10px] bg-[#0db9f2]/20 text-[#0db9f2] px-2 py-0.5 rounded uppercase tracking-wider font-bold">Live</span>
            </h2>
            <div className="text-xs text-slate-400 font-mono mt-0.5 flex gap-3">
              <span>SEBI Audit Logging: <span className="text-[#0bda57]">ACTIVE</span></span>
              <span className="text-[#3b4e54]">|</span>
              <span>Region: ap-south-1</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-[#1e2629] px-3 py-1.5 rounded-lg border border-[#283539]">
            <span className="material-symbols-outlined text-xs text-slate-400">schedule</span>
            <span className="text-sm font-mono text-[#0db9f2]">14:32:05 UTC</span>
          </div>
          <button className="flex items-center justify-center rounded-lg h-9 px-4 bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20 hover:bg-[#ef4444]/20 transition-colors text-sm font-bold tracking-[0.015em] gap-2">
            <span className="material-symbols-outlined text-[18px]">lock</span>
            <span>Lockdown Mode</span>
          </button>
          <button className="flex items-center justify-center rounded-lg h-9 w-9 bg-[#283539] text-white hover:bg-[#3b4e54] transition-colors relative">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#ef4444] rounded-full border border-[#283539]"></span>
          </button>
          <button className="flex items-center justify-center rounded-lg h-9 w-9 bg-[#283539] text-white hover:bg-[#3b4e54] transition-colors">
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>
          <button className="flex items-center justify-center rounded-lg h-9 w-9 bg-[#283539] text-white hover:bg-[#3b4e54] transition-colors">
            <span className="material-symbols-outlined text-[20px]">account_circle</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 gap-6 grid grid-cols-12 max-w-[1920px] mx-auto w-full">
        {/* Left Column: Service Health Grid */}
        <div className="col-span-12 xl:col-span-8 flex flex-col gap-6">
          {/* Service Cards Row 1 */}
          <section>
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-white tracking-tight text-xl font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0db9f2]">grid_view</span>
                Microservice Mesh
              </h2>
              <div className="text-xs text-slate-400 font-mono">
                Global Uptime: <span className="text-[#0bda57]">99.98%</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Auth Service Card */}
              <div className="bg-[#182023] border border-[#283539] rounded-xl p-5 hover:border-[#0db9f2]/30 transition-colors group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="material-symbols-outlined text-6xl">verified_user</span>
                </div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="flex flex-col">
                    <span className="text-slate-400 text-xs font-mono uppercase tracking-wider mb-1">Critical</span>
                    <h3 className="text-white font-bold text-lg">Auth Service</h3>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#0bda57]/10 px-2 py-1 rounded text-xs font-mono text-[#0bda57] border border-[#0bda57]/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0bda57] animate-pulse"></div>
                    Healthy
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4 relative z-10">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">CPU Usage</div>
                    <div className="text-xl font-mono font-bold text-white">12<span className="text-sm text-slate-500">%</span></div>
                    <div className="h-1 w-full bg-[#283539] rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-[#0db9f2] w-[12%] rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">RAM Alloc</div>
                    <div className="text-xl font-mono font-bold text-white">400<span className="text-sm text-slate-500">MB</span></div>
                    <div className="h-1 w-full bg-[#283539] rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-purple-500 w-[25%] rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-[#283539] relative z-10">
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <span className="material-symbols-outlined text-[14px]">timer</span>
                    <span className="font-mono">99.99%</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <span className="material-symbols-outlined text-[14px]">lan</span>
                    <span className="font-mono">Pod-x82</span>
                  </div>
                </div>
              </div>

              {/* Commission Engine Card */}
              <div className="bg-[#182023] border border-[#283539] rounded-xl p-5 hover:border-[#fbbf24]/30 transition-colors group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="material-symbols-outlined text-6xl">calculate</span>
                </div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="flex flex-col">
                    <span className="text-slate-400 text-xs font-mono uppercase tracking-wider mb-1">Core</span>
                    <h3 className="text-white font-bold text-lg">Commission Engine</h3>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#fbbf24]/10 px-2 py-1 rounded text-xs font-mono text-[#fbbf24] border border-[#fbbf24]/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]"></div>
                    High Load
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4 relative z-10">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">CPU Usage</div>
                    <div className="text-xl font-mono font-bold text-[#fbbf24]">45<span className="text-sm text-slate-500">%</span></div>
                    <div className="h-1 w-full bg-[#283539] rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-[#fbbf24] w-[45%] rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">RAM Alloc</div>
                    <div className="text-xl font-mono font-bold text-white">2.1<span className="text-sm text-slate-500">GB</span></div>
                    <div className="h-1 w-full bg-[#283539] rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-purple-500 w-[60%] rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-[#283539] relative z-10">
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <span className="material-symbols-outlined text-[14px]">timer</span>
                    <span className="font-mono">99.95%</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <span className="material-symbols-outlined text-[14px]">lan</span>
                    <span className="font-mono">Pod-c12</span>
                  </div>
                </div>
              </div>

              {/* Treasury Service Card */}
              <div className="bg-[#182023] border border-[#283539] rounded-xl p-5 hover:border-[#0db9f2]/30 transition-colors group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="material-symbols-outlined text-6xl">account_balance</span>
                </div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="flex flex-col">
                    <span className="text-slate-400 text-xs font-mono uppercase tracking-wider mb-1">Financial</span>
                    <h3 className="text-white font-bold text-lg">Treasury Service</h3>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#0bda57]/10 px-2 py-1 rounded text-xs font-mono text-[#0bda57] border border-[#0bda57]/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0bda57] animate-pulse"></div>
                    Healthy
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4 relative z-10">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">CPU Usage</div>
                    <div className="text-xl font-mono font-bold text-white">8<span className="text-sm text-slate-500">%</span></div>
                    <div className="h-1 w-full bg-[#283539] rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-[#0db9f2] w-[8%] rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">RAM Alloc</div>
                    <div className="text-xl font-mono font-bold text-white">1.2<span className="text-sm text-slate-500">GB</span></div>
                    <div className="h-1 w-full bg-[#283539] rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-purple-500 w-[40%] rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-[#283539] relative z-10">
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <span className="material-symbols-outlined text-[14px]">timer</span>
                    <span className="font-mono">100.00%</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <span className="material-symbols-outlined text-[14px]">lan</span>
                    <span className="font-mono">Pod-t04</span>
                  </div>
                </div>
              </div>

              {/* Ledger Service Card */}
              <div className="bg-[#182023] border border-[#283539] rounded-xl p-5 hover:border-[#0db9f2]/30 transition-colors group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="material-symbols-outlined text-6xl">receipt_long</span>
                </div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="flex flex-col">
                    <span className="text-slate-400 text-xs font-mono uppercase tracking-wider mb-1">Storage</span>
                    <h3 className="text-white font-bold text-lg">Ledger Service</h3>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#0bda57]/10 px-2 py-1 rounded text-xs font-mono text-[#0bda57] border border-[#0bda57]/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0bda57] animate-pulse"></div>
                    Healthy
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4 relative z-10">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">WebSockets</div>
                    <div className="text-xl font-mono font-bold text-white">1.2k</div>
                    <div className="h-1 w-full bg-[#283539] rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-[#0db9f2] w-[85%] rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Write Ops/s</div>
                    <div className="text-xl font-mono font-bold text-white">342</div>
                    <div className="h-1 w-full bg-[#283539] rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[50%] rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-[#283539] relative z-10">
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <span className="material-symbols-outlined text-[14px]">timer</span>
                    <span className="font-mono">99.98%</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <span className="material-symbols-outlined text-[14px]">enhanced_encryption</span>
                    <span className="font-mono text-[10px] uppercase">AES-256</span>
                  </div>
                </div>
              </div>

              {/* Audit Agent Mesh - Full Width */}
              <div className="md:col-span-2 bg-gradient-to-br from-[#182023] to-[#202a2e] border border-[#283539] rounded-xl p-5 hover:border-[#0db9f2]/40 transition-colors group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                  <span className="material-symbols-outlined text-8xl">policy</span>
                </div>
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="flex flex-col">
                    <span className="text-[#0db9f2] text-xs font-mono uppercase tracking-wider mb-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">security</span>
                      Compliance Mesh
                    </span>
                    <h3 className="text-white font-bold text-lg">Audit Agent Mesh</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Jobs/sec</div>
                      <div className="text-xl font-mono font-bold text-[#0db9f2]">450</div>
                    </div>
                    <div className="h-8 w-[1px] bg-[#283539]"></div>
                    <div className="flex items-center gap-1.5 bg-[#0bda57]/10 px-2 py-1 rounded text-xs font-mono text-[#0bda57] border border-[#0bda57]/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0bda57] animate-pulse"></div>
                      Syncing
                    </div>
                  </div>
                </div>
                {/* Mini Histogram Visualization */}
                <div className="flex items-end gap-1 h-16 w-full mb-2 relative z-10">
                  {[30, 45, 35, 60, 80, 75, 50, 65, 90, 100].map((height, i) => (
                    <div key={i} className={`flex-1 bg-[#0db9f2]/${20 + i * 5} rounded-sm h-[${height}%] hover:bg-[#0db9f2]/${40 + i * 5} transition-all`} style={{ height: `${height}%` }}></div>
                  ))}
                </div>
                <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
                  <span>Last 10 seconds</span>
                  <span>Peak: 480/s</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: System Stats & Events */}
        <div className="col-span-12 xl:col-span-4 flex flex-col gap-6">
          {/* System Stats */}
          <div className="bg-[#182023] rounded-xl border border-[#283539] p-6">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0db9f2]">memory</span>
              Cluster Stats
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">CPU Cluster</span>
                  <span className="text-white font-mono">24%</span>
                </div>
                <div className="h-2 bg-[#283539] rounded-full overflow-hidden">
                  <div className="h-full bg-[#0db9f2] w-[24%] rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Memory</span>
                  <span className="text-white font-mono">62%</span>
                </div>
                <div className="h-2 bg-[#283539] rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 w-[62%] rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Network I/O</span>
                  <span className="text-white font-mono">156 MB/s</span>
                </div>
                <div className="h-2 bg-[#283539] rounded-full overflow-hidden">
                  <div className="h-full bg-[#0bda57] w-[45%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Events */}
          <div className="bg-[#182023] rounded-xl border border-[#283539] flex-1 overflow-hidden">
            <div className="p-4 border-b border-[#283539] flex justify-between items-center">
              <h3 className="text-white font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400">event</span>
                System Events
              </h3>
              <span className="w-2 h-2 bg-[#0bda57] rounded-full animate-pulse"></span>
            </div>
            <div className="p-2 space-y-1 overflow-y-auto max-h-[400px]">
              {[
                { time: "14:32:05", event: "Pod-x82 health check passed", type: "success" },
                { time: "14:31:58", event: "Commission Engine scaled to 3 pods", type: "info" },
                { time: "14:31:45", event: "Ledger backup completed", type: "success" },
                { time: "14:30:12", event: "Audit mesh sync completed", type: "success" },
                { time: "14:29:30", event: "Memory threshold alert cleared", type: "warning" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded hover:bg-[#202a2e] transition-colors">
                  <span className="text-xs font-mono text-slate-500">{item.time}</span>
                  <div className={`w-2 h-2 rounded-full ${item.type === 'success' ? 'bg-[#0bda57]' : item.type === 'warning' ? 'bg-[#fbbf24]' : 'bg-[#0db9f2]'}`}></div>
                  <span className="text-sm text-slate-300">{item.event}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
