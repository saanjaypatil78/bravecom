"use client";

import { useEffect, useState } from "react";
import { Download, AlertTriangle, PlayCircle, Users, Wallet, Target, Info, RefreshCw } from "lucide-react";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [distributing, setDistributing] = useState(false);
  const [simulatedRole, setSimulatedRole] = useState("ADMIN");
  const [activeCapPct, setActiveCapPct] = useState(8.5);

  useEffect(() => {
    let mounted = true;
    
    async function fetchData() {
      try {
        const res = await fetch("/api/dashboard", { 
          cache: 'no-store'
        });
        
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        
        const json = await res.json();
        if (mounted) {
          setData(json);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to load");
          setLoading(false);
        }
      }
    }
    
    fetchData();
    
    return () => { mounted = false; };
  }, []);

  const refetchData = () => {
    setLoading(true);
    fetch("/api/dashboard", { cache: 'no-store' })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then(text => {
        if (!text) throw new Error('Empty response');
        const json = JSON.parse(text);
        setData(json);
      })
      .catch(err => { setError(err.message); })
      .finally(() => setLoading(false));
  };

  const handleDistribute = async () => {
    setDistributing(true);
    try {
      const distRes = await fetch("/api/distribute", { method: "POST" });
      if (!distRes.ok) throw new Error('Distribution failed');
      
      const res = await fetch("/api/dashboard", { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch dashboard');
      const text = await res.text();
      if (!text) throw new Error('Empty response');
      const json = JSON.parse(text);
      setData(json);
      alert("Commission distribution processed!");
    } catch (err: any) {
      alert(err.message || 'Error processing distribution');
    } finally {
      setDistributing(false);
    }
  };

  const exportCSV = () => {
    if (!data?.recentLogs) return;
    const csvContent = "data:text/csv;charset=utf-8," +
      "Transaction ID,Date,Level,Beneficiary,Amount,Status\n" +
      data.recentLogs.map((log: any) =>
        `${log.transactionId},${new Date(log.createdAt).toLocaleDateString()},L${log.level},${log.beneficiary},${log.amount},${log.status}`
      ).join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `bravecom_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#1173d4] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <AlertTriangle className="text-red-500 w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={refetchData}
            className="px-6 py-2 bg-[#1173d4] text-white rounded-lg font-bold hover:bg-[#1173d4]/80"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#050B14]">
      {/* Header */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-black text-white tracking-widest uppercase flex items-center gap-3">
            Network Terminal
            {simulatedRole === "GREEN" && <span className="text-[10px] px-2 py-0.5 rounded bg-gradient-to-r from-yellow-600 to-yellow-400 text-black font-black uppercase tracking-widest">🏆 Gold Tier</span>}
            {simulatedRole === "ADMIN" && <span className="text-[10px] px-2 py-0.5 rounded bg-gradient-to-r from-slate-400 to-white text-black font-black uppercase tracking-widest">💎 Platinum</span>}
          </h2>

          <div className="ml-8 flex gap-2">
            {["ADMIN", "GREEN", "ORANGE", "RED"].map((r) => (
              <button
                key={r}
                onClick={() => setSimulatedRole(r)}
                className={`text-[10px] font-bold px-3 py-1 rounded-full border transition-all ${simulatedRole === r
                  ? (r === 'ADMIN' ? 'bg-purple-500/20 text-purple-400 border-purple-500/50'
                    : r === 'GREEN' ? 'bg-green-500/20 text-green-400 border-green-500/50'
                      : r === 'ORANGE' ? 'bg-orange-500/20 text-orange-400 border-orange-500/50'
                        : 'bg-red-500/20 text-red-400 border-red-500/50')
                  : 'bg-transparent text-slate-500 border-slate-700 hover:text-white'
                  }`}
              >
                Simulate: {r}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {simulatedRole === "ADMIN" && (
            <button onClick={handleDistribute} disabled={distributing} className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#1173d4] to-cyan-400 text-white rounded-full text-xs font-black tracking-widest uppercase hover:opacity-90 transition-all shadow-[0_0_15px_rgba(17,115,212,0.4)] disabled:opacity-50">
              {distributing ? <RefreshCw size={16} className="animate-spin" /> : <PlayCircle size={16} />}
              Trigger Distribution
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 font-['Outfit'] scroll-smooth">
        {/* ORANGE Warning */}
        {simulatedRole === "ORANGE" && (
          <div className="mb-6 bg-gradient-to-r from-orange-500/20 to-transparent border border-orange-500/30 rounded-xl p-5 flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-4">
              <AlertTriangle className="text-orange-400" size={24} />
              <div>
                <h3 className="text-orange-400 font-bold tracking-widest uppercase text-sm">Passive Network State</h3>
                <p className="text-orange-400/80 text-xs mt-1">You have built a network but have not met the capital requirement.</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-black text-2xl font-mono">59d 12h 45m</p>
              <p className="text-[10px] text-orange-400 font-bold uppercase tracking-widest">Time remaining to invest 1L INR</p>
            </div>
          </div>
        )}

        {/* RED Warning */}
        {simulatedRole === "RED" && (
          <div className="mb-6 bg-gradient-to-r from-red-500/20 to-transparent border border-red-500/30 rounded-xl p-5 flex items-center gap-4">
            <AlertTriangle className="text-red-400" size={24} />
            <div>
              <h3 className="text-red-400 font-bold tracking-widest uppercase text-sm">Inactive Profile</h3>
              <p className="text-red-400/80 text-xs mt-1">Privileges suspended. Add ₹1,00,000 INR to reactivate network commission pipelines.</p>
            </div>
          </div>
        )}

        {/* ADMIN Dashboard */}
        {simulatedRole === "ADMIN" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Capital Reserve */}
              <div className="col-span-1 lg:col-span-2 bg-[#0B121C] border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">IPO Capital Reserve</h3>
                    <p className="text-sm text-slate-400 font-medium">Nationwide Tracking</p>
                  </div>
                  <Target className="text-cyan-400" opacity={0.5} size={40} />
                </div>

                <div className="space-y-2 mt-12">
                  <div className="flex justify-between text-xs font-bold text-slate-300 uppercase tracking-widest">
                    <span>Raised: ₹12,00,00,000 (Pre-Seed) + Active: ₹{(data?.networkStats?.totalAUM || 0).toLocaleString()}</span>
                    <span>Soft Cap: 111 Cr | Hard Cap: 141 Cr</span>
                  </div>
                  <div className="w-full h-6 bg-black rounded-full overflow-hidden border border-white/10 relative group">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#1173d4] to-cyan-400 transition-all opacity-80 shadow-[0_0_20px_rgba(17,115,212,0.8)] pointer-events-none"
                      style={{ width: `${activeCapPct}%` }}
                    ></div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="0.1"
                      value={activeCapPct}
                      onChange={(e) => setActiveCapPct(parseFloat(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10"
                    />
                  </div>
                </div>
              </div>

              {/* Total Dispursed */}
              <div className="bg-[#0B121C] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-400 tracking-widest uppercase mb-1">Total Dispursed</h3>
                  <p className="text-4xl font-black text-white">₹{(data?.networkStats?.totalEarnings || 0).toLocaleString()}</p>
                </div>
                <div className="mt-8 border-t border-slate-800 pt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Agents</p>
                    <p className="text-xl font-bold text-white">{data?.networkStats?.totalUsers || 0}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Commissions</p>
                    <p className="text-xl font-bold text-green-400">Fixed 20%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Table */}
            <div className="bg-[#0B121C] border border-slate-800 rounded-2xl p-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-4">
                <h3 className="font-bold text-white uppercase tracking-widest text-sm flex items-center gap-2">
                  <Users size={16} /> Global Transaction Book
                </h3>
                <button onClick={exportCSV} className="px-4 py-2 border border-slate-700 hover:bg-slate-800 rounded-lg text-xs font-bold text-slate-300 transition-all flex items-center gap-2">
                  <Download size={14} /> Export CSV Report
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-[10px] uppercase font-bold text-slate-500 tracking-widest bg-slate-900/50">
                    <tr>
                      <th className="p-4 rounded-tl-lg">Txn Ref</th>
                      <th className="p-4">Level</th>
                      <th className="p-4">Beneficiary</th>
                      <th className="p-4">Disbursed Amt</th>
                      <th className="p-4 rounded-tr-lg">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {(data?.recentLogs || []).map((log: any) => (
                      <tr key={log.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-mono text-xs text-slate-400">{log.transactionId}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold text-[10px]">L{log.level}</span>
                        </td>
                        <td className="p-4 font-bold text-white">{log.beneficiary}</td>
                        <td className="p-4 font-bold text-green-400">₹{log.amount?.toLocaleString()}</td>
                        <td className="p-4">
                          <button className="text-[10px] bg-slate-800 px-2 py-1 rounded text-white">Reassign</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Investor Dashboards */}
        {simulatedRole !== "ADMIN" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* ROI Card */}
              <div className={`bg-[#0B121C] border-2 rounded-2xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.5)] ${simulatedRole === "GREEN" ? "border-green-500/30" :
                simulatedRole === "ORANGE" ? "border-orange-500/30 opacity-80 grayscale-[30%]" : "border-red-500/30 opacity-50 grayscale"
                }`}>
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Static ROI Wallet</h3>
                    <p className={`text-4xl font-black mt-2 ${simulatedRole === "GREEN" ? "text-white" : "text-slate-500"}`}>
                      ₹{simulatedRole === "GREEN" ? "22,500" : "0"}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${simulatedRole === "GREEN" ? "bg-green-500/10 text-green-400" : "bg-slate-800 text-slate-500"}`}>
                    <Wallet size={20} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-slate-400">Base Capital</span>
                    <span className={simulatedRole === "GREEN" ? "text-white" : "text-slate-500"}>
                      {simulatedRole === "GREEN" ? "₹1,00,000" : "₹0"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-slate-400">Monthly Yield</span>
                    <span className={simulatedRole === "GREEN" ? "text-green-400" : "text-slate-500"}>15%</span>
                  </div>
                  <div className="pt-4 border-t border-white/5 text-xs text-slate-500 flex items-start gap-2 leading-relaxed">
                    <Info size={16} className="mt-0.5" />
                    <span>Your 1st payout is scheduled exactly <strong>45 Days</strong> from activation.</span>
                  </div>
                </div>
              </div>

              {/* Network Card */}
              <div className={`bg-[#0B121C] border border-slate-800 rounded-2xl p-6 ${simulatedRole === "RED" ? "opacity-30" : ""}`}>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-800 pb-4">6-Level Network Strength</h3>
                <div className="space-y-4">
                  {[
                    { l: 1, p: "20%", i: 12, c: "text-[#1173d4]" },
                    { l: 2, p: "10%", i: 24, c: "text-cyan-400" },
                    { l: 3, p: "5%", i: 48, c: "text-blue-400" },
                    { l: 4, p: "2.5%", i: 96, c: "text-purple-400" },
                    { l: 5, p: "1.25%", i: 182, c: "text-fuchsia-400" },
                    { l: 6, p: "0.625%", i: 310, c: "text-pink-400" }
                  ].map(lvl => (
                    <div key={lvl.l} className="flex grid grid-cols-3 items-center text-sm font-bold">
                      <span className={`uppercase tracking-widest ${lvl.c}`}>Level 0{lvl.l}</span>
                      <span className="text-slate-400 text-center">{lvl.p}</span>
                      <span className="text-white text-right font-mono">{simulatedRole === "RED" ? 0 : lvl.i}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
