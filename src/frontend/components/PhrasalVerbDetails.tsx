"use client";

import { motion } from "framer-motion";
import { Puzzle, ArrowRight, Activity, GitMerge, Sparkles } from "lucide-react";
import { PhrasalVerbDetailsProps } from "../types/components";
import { clsx } from "clsx";

export function PhrasalVerbDetails({ details }: PhrasalVerbDetailsProps) {
  const { verb, particle, separable, transitive, collocations } = details;

  const separableLabels = {
    no: { label: "Inseparable", color: "text-red-400 bg-red-500/10 border-red-500/20" },
    optional: { label: "Separable (Optional)", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    mandatory: { label: "Separable (Mandatory)", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  };

  const currentSeparable = separableLabels[separable] || separableLabels.no;

  return (
    <div className="space-y-6 text-left w-full">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
            <Activity size={16} />
          </div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-black">
            Linguistic Mechanics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Structure Visualization */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center justify-between p-6 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-md relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex flex-col relative">
            <span className="text-[9px] uppercase font-black tracking-widest text-zinc-600 mb-2">Verb Module</span>
            <span className="text-xl font-black text-white italic tracking-tight">{verb}</span>
          </div>
          <div className="flex flex-col items-center gap-1 opacity-40">
            <ArrowRight size={14} className="text-blue-500" />
            <div className="w-1 h-1 rounded-full bg-blue-500" />
          </div>
          <div className="flex flex-col text-right relative">
            <span className="text-[9px] uppercase font-black tracking-widest text-blue-500/50 mb-2">Particle Link</span>
            <span className="text-xl font-black text-blue-400 italic tracking-tight">{particle}</span>
          </div>
        </motion.div>

        {/* Logic States */}
        <motion.div 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-3 p-6 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitMerge size={12} className="text-zinc-600" />
              <span className="text-[9px] uppercase font-black tracking-widest text-zinc-500">Transitive</span>
            </div>
            <span className={clsx(
              "px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest",
              transitive ? "text-blue-400 border-blue-500/20 bg-blue-500/10" : "text-zinc-600 border-zinc-800 bg-zinc-900"
            )}>
              {transitive ? "Detected" : "No"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Puzzle size={12} className="text-zinc-600" />
              <span className="text-[9px] uppercase font-black tracking-widest text-zinc-500">Separability</span>
            </div>
            <span className={clsx(
              "px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest",
              currentSeparable.color
            )}>
              {currentSeparable.label}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Mini Collocations Map */}
      {collocations && collocations.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 pt-2"
        >
          <div className="flex items-center gap-2 px-1">
            <Sparkles size={14} className="text-amber-500" />
            <span className="text-[9px] uppercase font-black tracking-[0.2em] text-zinc-500">Common Partners</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {collocations.slice(0, 5).map((item, idx) => (
              <div 
                key={idx} 
                className="px-4 py-2 rounded-xl bg-zinc-900/50 border border-white/5 text-xs font-bold text-zinc-400 italic hover:border-blue-500/30 hover:text-white transition-all cursor-default"
              >
                &ldquo;{typeof item === 'string' ? item : item.phrase}&rdquo;
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
