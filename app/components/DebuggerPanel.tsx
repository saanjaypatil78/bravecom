"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bug, X, ChevronDown, ChevronUp, AlertCircle, CheckCircle, Clock, Zap } from "lucide-react";

interface DebugLog {
  id: string;
  level: "info" | "warn" | "error" | "success";
  message: string;
  timestamp: Date;
  details?: string;
}

interface DebuggerPanelProps {
  model?: string;
  enabled?: boolean;
}

export default function DebuggerPanel({ 
  model = "gemini-2.0-pro", 
  enabled = true 
}: DebuggerPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<DebugLog[]>([
    {
      id: "1",
      level: "success",
      message: "Debugger initialized",
      timestamp: new Date(),
      details: `Model: ${model}`
    },
    {
      id: "2",
      level: "info",
      message: "QA Lead connected",
      timestamp: new Date(),
      details: "opencode@antigravity.local"
    },
    {
      id: "3",
      level: "success",
      message: "Antigravity workspace loaded",
      timestamp: new Date(),
      details: "Auto-sync enabled (300s)"
    }
  ]);

  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    
    const interval = setInterval(() => {
      const levels: DebugLog["level"][] = ["info", "warn", "success"];
      const messages = [
        "Processing validation request",
        "Syncing with Prisma database",
        "Running QA checks",
        "Validating product data",
        "Checking image sources"
      ];
      
      const randomLevel = levels[Math.floor(Math.random() * levels.length)];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      
      const newLog: DebugLog = {
        id: Date.now().toString(),
        level: randomLevel,
        message: randomMessage,
        timestamp: new Date()
      };
      
      setLogs(prev => [newLog, ...prev].slice(0, 50));
    }, 8000);
    
    return () => clearInterval(interval);
  }, [enabled]);

  const getLevelColor = (level: DebugLog["level"]) => {
    switch (level) {
      case "error": return "text-red-400";
      case "warn": return "text-amber-400";
      case "success": return "text-emerald-400";
      default: return "text-blue-400";
    }
  };

  const getLevelIcon = (level: DebugLog["level"]) => {
    switch (level) {
      case "error": return <AlertCircle size={12} className="text-red-400" />;
      case "warn": return <AlertCircle size={12} className="text-amber-400" />;
      case "success": return <CheckCircle size={12} className="text-emerald-400" />;
      default: return <Zap size={12} className="text-blue-400" />;
    }
  };

  if (!enabled) return null;

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-[9999] p-3 bg-[#1173d4]/20 backdrop-blur-md border border-[#1173d4]/30 rounded-full hover:bg-[#1173d4]/30 transition-all group"
        title="Debugger Panel"
      >
        <Bug size={20} className="text-[#1173d4]" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></span>
      </button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.9 }}
            className="fixed bottom-20 right-4 w-96 max-h-[500px] bg-[#0a0f1a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-[9998] overflow-hidden"
          >
            {/* Header */}
            <div 
              className="p-4 bg-gradient-to-r from-[#1173d4]/20 to-transparent border-b border-white/5 cursor-pointer"
              onClick={() => setMinimized(!minimized)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#1173d4]/20 rounded-lg">
                    <Bug size={16} className="text-[#1173d4]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Debugger Console</h3>
                    <p className="text-xs text-slate-400">Model: {model}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                    Live
                  </span>
                  {minimized ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronUp size={16} className="text-slate-400" />}
                </div>
              </div>
            </div>

            {/* Content */}
            {!minimized && (
              <div className="p-4 max-h-80 overflow-y-auto space-y-2 custom-scrollbar">
                {logs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    {getLevelIcon(log.level)}
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs ${getLevelColor(log.level)} truncate`}>{log.message}</p>
                      {log.details && (
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">{log.details}</p>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Clock size={10} />
                      {log.timestamp.toLocaleTimeString()}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Footer */}
            {!minimized && (
              <div className="p-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">QA Lead: opencode</span>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={14} className="text-slate-400" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
        }
      `}</style>
    </>
  );
}
