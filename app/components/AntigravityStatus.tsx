"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Zap, RefreshCw, CheckCircle, AlertTriangle } from "lucide-react";

interface AntigravityStatusProps {
  compact?: boolean;
}

export default function AntigravityStatus({ compact = false }: AntigravityStatusProps) {
  const [status, setStatus] = useState<"connected" | "syncing" | "warning">("connected");

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus("syncing");
      setTimeout(() => {
        setStatus("connected");
      }, 1500);
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case "connected": return "text-emerald-400";
      case "syncing": return "text-blue-400";
      case "warning": return "text-amber-400";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "connected": return <CheckCircle size={12} className="text-emerald-400" />;
      case "syncing": return <RefreshCw size={12} className="text-blue-400 animate-spin" />;
      case "warning": return <AlertTriangle size={12} className="text-amber-400" />;
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
        <Shield size={12} className="text-fuchsia-400" />
        <span className={`text-xs font-medium ${getStatusColor()} flex items-center gap-1.5`}>
          {getStatusIcon()}
          Antigravity
        </span>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-fuchsia-500/10 to-blue-500/10 rounded-xl border border-white/10 backdrop-blur-md"
    >
      <div className="relative">
        <Shield size={18} className="text-fuchsia-400" />
        <motion.span 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full"
        />
      </div>
      
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white tracking-wide">ANTIGRAVITY</span>
          <span className={`text-[10px] font-medium ${getStatusColor()} flex items-center gap-1`}>
            {getStatusIcon()}
            {status === "connected" ? "Active" : status === "syncing" ? "Syncing..." : "Warning"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
          <Zap size={10} className="text-amber-400" />
          <span>QA Lead: opencode • Model: gemini-2.0-pro</span>
        </div>
      </div>
    </motion.div>
  );
}
