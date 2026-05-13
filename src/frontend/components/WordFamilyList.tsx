"use client";

import { motion } from "framer-motion";
import { WordFamilyListProps } from "../types/components";
import { Sparkles, Box, Zap, Palette, Wind } from "lucide-react";

const posConfig: Record<string, { label: string; sub: string; color: string; icon: any }> = {
  noun: { 
    label: "Noun", 
    sub: "The Entity", 
    color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    icon: Box
  },
  verb: { 
    label: "Verb", 
    sub: "The Action", 
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    icon: Zap
  },
  adjective: { 
    label: "Adjective", 
    sub: "The Quality", 
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    icon: Palette
  },
  adverb: { 
    label: "Adverb", 
    sub: "The Manner", 
    color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    icon: Wind
  },
};

export function WordFamilyList({ families }: WordFamilyListProps) {
  const entries = Object.entries(families).filter(([_, words]) => words && words.length > 0);

  if (entries.length === 0) return null;

  return (
    <div className="w-full relative space-y-4">
      {/* Educational Header */}
      <div className="flex items-center gap-2 px-6 py-2 rounded-full bg-blue-500/5 border border-blue-500/10 w-fit">
        <Sparkles size={12} className="text-blue-400" />
        <p className="text-[10px] font-bold text-blue-400/80 uppercase tracking-widest">
          Morphology Map: Learn the variations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(posConfig).map(([key, config]) => {
          const words = families[key as keyof typeof families];
          if (!words || words.length === 0) return null;

          const Icon = config.icon;

          return (
            <motion.div 
              key={key} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative p-6 rounded-[2.5rem] bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] transition-colors group overflow-hidden"
            >
              {/* Functional Label */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl ${config.color} flex items-center justify-center`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/90">
                      {config.label}
                    </p>
                    <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">
                      {config.sub}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {words.map((word, idx) => (
                  <motion.div
                    key={`${key}-${word}-${idx}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex flex-col space-y-1"
                  >
                    <span className="text-xl font-black text-white group-hover:text-blue-400 transition-colors tracking-tight">
                      {word}
                    </span>
                    <div className="h-px w-4 bg-white/10 group-hover:w-8 group-hover:bg-blue-500/30 transition-all" />
                  </motion.div>
                ))}
              </div>

              {/* Decorative Corner Label */}
              <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <Icon size={80} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
