"use client";

import { motion } from "framer-motion";

interface WordFamilyListProps {
  families: {
    noun?: string[];
    verb?: string[];
    adjective?: string[];
    adverb?: string[];
  };
}

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
    <div className="space-y-4 text-left w-full">
      <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black mb-1 opacity-80">
        Word Families
      </p>
      <div className="flex flex-wrap gap-2">
        {entries.map(([pos, words], groupIdx) => (
          <div key={pos} className="flex flex-wrap gap-2 items-center">
            {words?.map((word, idx) => (
              <motion.div
                key={`${pos}-${word}-${idx}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: (groupIdx * 0.1) + (idx * 0.05),
                  type: "spring",
                  stiffness: 260,
                  damping: 20 
                }}
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  transition: { duration: 0.2 }
                }}
                className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl border backdrop-blur-sm text-xs font-semibold transition-colors ${posLabels[pos]?.color || "text-zinc-400 border-zinc-700 bg-zinc-800/50"}`}
              >
                <span className="font-black uppercase opacity-40 text-[9px] tracking-tighter group-hover:opacity-100 transition-opacity">
                  {posLabels[pos]?.label || pos}
                </span>
                <span className="tracking-tight">{word}</span>
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
