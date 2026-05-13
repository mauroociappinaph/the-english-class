"use client";

import { motion } from "framer-motion";
import { Puzzle, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { PhrasalVerbDetailsProps } from "../types/components";
import { QuotedPill } from "@/frontend/components/ui/QuotedPill";

export function PhrasalVerbDetails({ details }: PhrasalVerbDetailsProps) {
  const { verb, particle, separable, transitive, commonCollocations } = details;

  const separableLabels = {
    no: { label: "Inseparable", color: "text-red-400 bg-red-500/10 border-red-500/20" },
    optional: { label: "Separable (Optional)", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
    mandatory: { label: "Separable (Mandatory)", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  };

  const currentSeparable = separableLabels[separable] || separableLabels.no;

  return (
    <div className="space-y-4 text-left w-full">
      <div className="flex items-center gap-2 mb-1">
        <Puzzle size={14} className="text-zinc-500" />
        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black opacity-80">
          Phrasal Mechanics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Structure */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center justify-between p-3 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm"
        >
          <div className="flex flex-col">
            <span className="text-[9px] uppercase font-bold text-zinc-500 mb-1">Verb</span>
            <span className="text-sm font-bold text-blue-400">{verb}</span>
          </div>
          <ArrowRight size={14} className="text-zinc-700" />
          <div className="flex flex-col text-right">
            <span className="text-[9px] uppercase font-bold text-zinc-500 mb-1">Particle</span>
            <span className="text-sm font-bold text-emerald-400">{particle}</span>
          </div>
        </motion.div>

        {/* Rules */}
        <motion.div 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-2 p-3 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-[9px] uppercase font-bold text-zinc-500">Transitive</span>
            <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${transitive ? 'text-blue-400 border-blue-500/20 bg-blue-500/10' : 'text-zinc-400 border-zinc-500/20 bg-zinc-500/10'}`}>
              {transitive ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[9px] uppercase font-bold text-zinc-500">Separability</span>
            <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${currentSeparable.color}`}>
              {currentSeparable.label}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Collocations */}
      {commonCollocations.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-1.5">
            <Zap size={10} className="text-amber-500" />
            <span className="text-[9px] uppercase font-bold text-zinc-500">Common Partners</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {commonCollocations.map((item, idx) => (
              <QuotedPill key={idx} className="text-[11px] text-zinc-400 bg-white/5 px-2 py-0.5 rounded-lg border border-white/5 italic">
                {item}
              </QuotedPill>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
