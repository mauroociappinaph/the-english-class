"use client";

import { motion } from "framer-motion";
import { WordFamilyListProps } from "../types/components";


const posLabels: Record<string, { label: string; color: string }> = {
  noun: { label: "Noun", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  verb: { label: "Verb", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  adjective: { label: "Adj", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  adverb: { label: "Adv", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
};

export function WordFamilyList({ families }: WordFamilyListProps) {
  const entries = Object.entries(families).filter(([_, words]) => words && words.length > 0);

  if (entries.length === 0) return null;

  return (
    <div className="w-full glass rounded-[3rem] border border-white/5 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-x divide-y divide-white/5">
        {Object.entries(posLabels).map(([key, config]) => {
          const words = families[key as keyof typeof families];
          if (!words || words.length === 0) return null;

          return (
            <div key={key} className="p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${config.color.split(' ')[0]}`} />
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${config.color.split(' ')[0]}`}>
                  {config.label}
                </span>
              </div>
              
              <div className="space-y-3">
                {words.map((word, idx) => (
                  <motion.div
                    key={`${key}-${word}-${idx}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center justify-between group cursor-default"
                  >
                    <span className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                      {word}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity uppercase">
                      {config.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
