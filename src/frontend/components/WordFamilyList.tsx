"use client";

import { motion } from "framer-motion";
import { WordFamilyListProps } from "../types/components";
import { Sparkles, Box, Zap, Palette, Wind, ListTree, LucideIcon } from "lucide-react";
import { WordVariantCard } from "./WordVariantCard";
import { WordFamilies } from "@/shared/types/expression";

const posConfig: Record<string, { label: string; sub: string; color: string; icon: LucideIcon }> = {
  noun: { 
    label: "Noun", 
    sub: "The Entity / Concept", 
    color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    icon: Box
  },
  verb: { 
    label: "Verb", 
    sub: "The Action / State", 
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    icon: Zap
  },
  adjective: { 
    label: "Adjective", 
    sub: "The Quality / Description", 
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    icon: Palette
  },
  adverb: { 
    label: "Adverb", 
    sub: "The Manner / Degree", 
    color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    icon: Wind
  },
};

export function WordFamilyList({ families }: WordFamilyListProps) {
  // Cast families to rich type if needed, or handle both for backward compatibility
  const richFamilies = families as unknown as WordFamilies;
  const entries = Object.entries(richFamilies || {}).filter(([_, variants]) => variants && variants.length > 0);

  if (entries.length === 0) return null;

  // Flatten all variants to check for patterns and counts
  const allVariants = Object.values(richFamilies || {}).flat().filter(Boolean);

  return (
    <div className="w-full relative space-y-12">
      {/* Educational Header & Introduction */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-6 py-2 rounded-full bg-blue-500/5 border border-blue-500/10 w-fit">
            <ListTree size={14} className="text-blue-400" />
            <p className="text-sm font-black text-blue-400/90 uppercase tracking-[0.3em]">
              Morphology Map & Word Families
            </p>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight leading-tight">
            One root, <span className="text-blue-500">infinite</span> possibilities.
          </h2>
          <p className="text-zinc-500 max-w-xl text-lg leading-relaxed">
            Understanding how words morph into different parts of speech is the fastest way to expand your vocabulary. 
            Learn the root, and you unlock the whole family.
          </p>
        </div>

        {/* "Learn one, unlock many" Mini Stats */}
        <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
            <Sparkles size={28} />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-zinc-400">Linguistic Boost</p>
            <p className="text-xl font-black text-white">
              Learn 1, Unlock {allVariants.length}
            </p>
            <p className="text-sm font-bold text-blue-500/70 uppercase mt-1">Efficiency +{allVariants.length * 100}%</p>
          </div>
        </div>
      </div>

      {/* Visual Tree / Connection Map (Simplified for now, but aesthetic) */}
      <div className="relative">
        {/* Background Connection Lines (Aesthetic) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
          <svg width="100%" height="100%" className="overflow-visible">
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <circle cx="50%" cy="50%" r="200" fill="none" stroke="url(#lineGrad)" strokeWidth="1" strokeDasharray="10 20" className="animate-[spin_60s_linear_infinite]" />
            <circle cx="50%" cy="50%" r="300" fill="none" stroke="url(#lineGrad)" strokeWidth="1" strokeDasharray="5 15" className="animate-[spin_40s_linear_infinite_reverse]" />
          </svg>
        </div>

        {/* Word Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
          {Object.entries(posConfig).map(([key, config]) => {
            const variants = richFamilies[key as keyof WordFamilies];
            if (!variants || variants.length === 0) return null;

            return (
              <div key={key} className="space-y-6">
                <div className="flex items-center gap-4 px-2">
                  <div className={`w-8 h-8 rounded-2xl ${config.color} flex items-center justify-center`}>
                    <config.icon size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white">
                      {config.label}s
                    </h4>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                      {config.sub}
                    </p>
                  </div>
                  <div className="h-px flex-1 bg-white/5 ml-4" />
                </div>

                <div className="space-y-4">
                  {variants.map((variant, idx) => (
                    <WordVariantCard 
                      key={`${key}-${variant.word}-${idx}`}
                      variant={variant}
                      category={config}
                      index={idx}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* "Learn one, unlock many" Pedagogical Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-12 rounded-[2rem] bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 border border-white/5 relative overflow-hidden group"
      >
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-[2rem] bg-blue-500 flex items-center justify-center text-white shadow-2xl shadow-blue-500/20">
              <Sparkles size={32} />
            </div>
            <h3 className="text-3xl font-black text-white tracking-tight">
              Unlock the <span className="text-blue-400">Power of Morphology</span>
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              Native speakers don't learn each word in isolation. They learn the <strong>root</strong> and then apply 
              morphological patterns to transform it. By understanding these prefixes and suffixes, you 
              multiply your vocabulary capacity by 4x.
            </p>
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white">400%</span>
                <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Retention Speed</span>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white">x4</span>
                <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Word Capacity</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-blue-500">Learning Strategy</p>
            <div className="space-y-3">
              {[
                { title: "Spot the Root", desc: "Identify the core meaning that stays constant." },
                { title: "Attach the Suffix", desc: "Notice how -ly makes it an adverb, -able makes it an adjective." },
                { title: "Contextual Shift", desc: "Observe how the word changes role in a sentence." }
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors flex items-center gap-4 group">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-sm font-black text-zinc-400 group-hover:text-blue-400 group-hover:border-blue-500/30 transition-all">
                    {i + 1}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white tracking-tight">{item.title}</h5>
                    <p className="text-sm text-zinc-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Background Sparkles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[100px] pointer-events-none" />
      </motion.div>
    </div>
  );
}
