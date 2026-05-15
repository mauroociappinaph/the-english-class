"use client";

import { motion } from "framer-motion";
import { AlertCircle, RotateCcw, XCircle } from "lucide-react";
import { AnalysisErrorCardProps } from "@/frontend/types/components";

export const AnalysisErrorCard: React.FC<AnalysisErrorCardProps> = ({ error, onRetry, onClear }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="w-full max-w-2xl mx-auto mt-8 overflow-hidden rounded-[2.5rem] border border-red-500/20 bg-black shadow-[0_0_40px_rgba(239,68,68,0.1)]"
    >
      <div className="relative p-8 md:p-10">
        {/* Decorative Background Glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-red-500/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-orange-500/5 blur-[100px] rounded-full" />

        <div className="relative z-10 flex flex-col items-center text-center gap-6">
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="p-4 bg-red-500/10 rounded-full"
            >
              <AlertCircle size={40} className="text-red-500" />
            </motion.div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-4 border-black animate-pulse" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white tracking-tight uppercase italic">
              Neural Sync <span className="text-red-500">Interrupted</span>
            </h3>
            <p className="text-zinc-500 font-mono text-xs tracking-widest uppercase">
              Error Code: {error.code}
            </p>
          </div>

          <div className="w-full p-6 rounded-2xl bg-zinc-950 border border-white/5 space-y-4">
            <p className="text-zinc-300 text-lg font-medium leading-relaxed">
              "{error.pedagogicalTip}"
            </p>
            {error.suggestion && (
              <div className="pt-4 border-t border-white/5">
                <p className="text-xs font-mono text-zinc-500 uppercase tracking-tighter mb-2">Suggested Correction</p>
                <p className="text-blue-400 font-bold text-xl italic">{error.suggestion}</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 w-full">
            <button
              onClick={onRetry}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-white text-black font-black uppercase tracking-tighter hover:bg-zinc-200 transition-colors"
            >
              <RotateCcw size={18} />
              Retry Analysis
            </button>
            <button
              onClick={onClear}
              className="px-6 py-4 rounded-2xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <XCircle size={20} />
            </button>
          </div>
          
          <p className="text-xs text-zinc-600 font-mono italic">
            Technical report: {error.message.slice(0, 50)}...
          </p>
        </div>
      </div>
    </motion.div>
  );
};
