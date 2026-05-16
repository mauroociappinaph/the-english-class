"use client";

import { motion } from "framer-motion";
import { WordFamilyListProps } from "../types/components";
import { Sparkles, ListTree, Box, Zap, Palette, Wind, ArrowRight, Quote } from "lucide-react";
import { WordFamilies, WordVariant } from "@/shared/types/expression";
import { MorphologyTree } from "./word-variant/MorphologyTree";
import { RegisterSpectrum } from "./word-variant/RegisterSpectrum";
import { clsx } from "clsx";

const posConfig: Record<string, { label: string; sub: string; color: string; icon: any }> = {
  noun: { 
    label: "Noun", 
    sub: "Concept / Entity", 
    color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    icon: Box
  },
  verb: { 
    label: "Verb", 
    sub: "Action / State", 
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    icon: Zap
  },
  adjective: { 
    label: "Adjective", 
    sub: "Quality / Description", 
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    icon: Palette
  },
  adverb: { 
    label: "Adverb", 
    sub: "Manner / Degree", 
    color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    icon: Wind
  },
};

export function WordFamilyList({ families }: WordFamilyListProps) {
  const richFamilies = families as unknown as WordFamilies;
  const entries = Object.entries(richFamilies || {}).filter(([_, variants]) => variants && variants.length > 0);
  const allVariants = Object.values(richFamilies || {}).flat().filter(Boolean) as WordVariant[];
  const rootWord = allVariants[0]?.morphology?.root || "Root";

  if (entries.length === 0) return null;

  return (
    <div className="w-full relative space-y-32 pb-32">
      {/* 1. EDITORIAL HEADER */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-12">
        <div className="space-y-6 max-w-2xl">
          <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-blue-500/5 border border-blue-500/10 w-fit">
            <ListTree size={12} className="text-blue-400" />
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">
              Morphology Architecture
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9]">
            One root, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">infinite</span> possibilities.
          </h2>
          <p className="text-zinc-500 text-xl leading-relaxed font-medium">
            Mastering the root unlocks the whole family. It's the ultimate shortcut to natural English fluency.
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Efficiency Boost</span>
          <div className="text-5xl font-black text-white">x{allVariants.length}</div>
          <div className="text-xs font-bold text-blue-500/60 uppercase">Vocabulary leverage</div>
        </div>
      </section>

      {/* 2. THE MORPHOLOGY TREE (Interactive Visual) */}
      <section className="relative py-20 bg-zinc-950/50 rounded-[4rem] border border-white/5 overflow-hidden">
        <div className="absolute top-0 left-0 p-12 opacity-20">
          <Sparkles size={80} className="text-blue-500" />
        </div>
        <MorphologyTree families={richFamilies} rootWord={rootWord} />
      </section>

      {/* 3. EDITORIAL MODULES (Replacing Cards) */}
      <section className="space-y-40">
        {Object.entries(posConfig).map(([pos, config]) => {
          const variants = richFamilies[pos as keyof WordFamilies];
          if (!variants || variants.length === 0) return null;

          return (
            <div key={pos} className="relative">
              {/* Sticky PoS Sidebar/Header */}
              <div className="sticky top-24 z-30 mb-12 flex items-center gap-6">
                <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl", config.color)}>
                  <config.icon size={24} />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-white tracking-tight leading-none">{config.label}s</h3>
                  <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest mt-1">{config.sub}</p>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
              </div>

              {/* The Words Flow */}
              <div className="space-y-32 pl-4 md:pl-20 border-l border-white/5">
                {variants.map((variant, idx) => (
                  <motion.div 
                    key={variant.word}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-16"
                  >
                    {/* Word Identity Column */}
                    <div className="lg:col-span-4 space-y-8">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h4 className="text-4xl font-black text-white tracking-tighter">{variant.word}</h4>
                          <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-zinc-400 uppercase">
                            {variant.cefr}
                          </div>
                        </div>
                        <p className="text-sm font-bold text-blue-500/60 font-mono tracking-widest">
                          {variant.pronunciation}
                        </p>
                      </div>

                      <p className="text-xl text-zinc-400 leading-relaxed font-medium">
                        {variant.simpleExplanation}
                      </p>

                      <div className="space-y-4">
                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Usage Context</span>
                        <RegisterSpectrum registers={variant.naturalContexts} />
                      </div>
                    </div>

                    {/* Word Intelligence Column */}
                    <div className="lg:col-span-8 space-y-12">
                      {/* Examples Stream */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-3">
                          <Quote size={16} className="text-emerald-500" />
                          <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Real Usage</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {variant.examples.slice(0, 2).map((ex, i) => (
                            <div key={i} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-3 group hover:bg-white/[0.04] transition-colors">
                              <p className="text-white font-bold tracking-tight">"{ex.text}"</p>
                              <p className="text-sm text-zinc-500 font-medium">{ex.translation}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Collocations Grid */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-3">
                          <Sparkles size={16} className="text-amber-500" />
                          <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Common Partners</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {variant.commonCollocations?.map((col, i) => (
                            <div key={i} className="px-5 py-2.5 rounded-2xl bg-zinc-950 border border-white/5 text-sm font-bold text-zinc-300 hover:border-blue-500/30 hover:text-blue-400 transition-all cursor-default">
                              {col}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Discovery Interaction */}
                      <button className="flex items-center gap-4 group/btn">
                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover/btn:bg-blue-500 group-hover/btn:text-white transition-all">
                          <ArrowRight size={18} />
                        </div>
                        <span className="text-sm font-black uppercase tracking-widest text-zinc-500 group-hover/btn:text-white transition-colors">
                          Deep Dive into Nuances
                        </span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* 4. FINAL PEDAGOGICAL CTA */}
      <section className="p-16 rounded-[4rem] bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-white/10 relative overflow-hidden text-center space-y-8">
        <div className="w-20 h-20 rounded-3xl bg-blue-500 flex items-center justify-center text-white mx-auto shadow-2xl shadow-blue-500/20">
          <Sparkles size={40} />
        </div>
        <h3 className="text-4xl font-black text-white tracking-tight">Expand your mind.</h3>
        <p className="text-zinc-400 max-w-xl mx-auto text-lg">
          You didn't just learn a word. You mastered an entire structural branch of the English language. 
          Keep exploring the patterns to reach effortless fluency.
        </p>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
      </section>
    </div>
  );
}
