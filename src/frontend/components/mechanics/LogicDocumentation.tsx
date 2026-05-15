"use client";

import { motion } from "framer-motion";
import { 
  Sparkles,
  Link,
  Split,
  ChevronRight,
  Info,
  Check,
  X,
  Target
} from "lucide-react";
import { PhrasalVerbDetailsProps } from "../../types/components";
import { clsx } from "clsx";

export function LogicDocumentation({ details }: PhrasalVerbDetailsProps) {
  const { verb, particle, separable, transitive, transitiveExplanation, separabilityExplanation, logicExplanation } = details || {};

  const safeVal = (v: unknown): string => {
    if (typeof v === 'string') return v;
    if (v && typeof v === 'object') {
      const obj = v as Record<string, string>;
      return obj.phrase || obj.text || obj.explanation || obj.logic || "";
    }
    return String(v ?? "");
  };

  return (
    <div className="relative group/specs p-8 md:p-16 rounded-[3.5rem] bg-blue-500/[0.02] border border-blue-500/10 space-y-16 overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute -right-20 -top-20 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] opacity-50" />
      <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] opacity-50" />

      {/* Header */}
      <div className="flex items-center gap-6 relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Sparkles className="text-white" size={32} />
        </div>
        <div>
          <h4 className="text-sm font-black uppercase tracking-[0.4em] text-blue-400/60">How it works</h4>
          <p className="text-3xl font-black text-white tracking-tight">The Linguistic Recipe</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative">
        {/* 1. Transitivity */}
        <div className="space-y-8 p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group/item">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Link size={24} />
              </div>
              <h5 className="text-xl font-black text-white">1. Transitivity</h5>
            </div>
            <span className={clsx(
              "px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
              transitive ? "bg-blue-500/20 text-blue-400 border border-blue-500/20" : "bg-zinc-800 text-zinc-500 border border-zinc-700"
            )}>
              {transitive ? "Needs an object" : "Standalone"}
            </span>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                <Info size={14} /> The Big Idea
              </p>
              <p className="text-zinc-300 leading-relaxed">
                {safeVal(transitiveExplanation) || (transitive 
                  ? `This phrasal verb is a "social" verb. It needs a companion (an object) to make sense.` 
                  : `This verb is an "independent" verb. It doesn't need anyone else to complete the action.`)}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                  <Check size={14} />
                </div>
                <p className="text-sm font-medium text-emerald-100 italic">
                  I {verb} {transitive ? "the topic " : ""}{particle}.
                </p>
              </div>
              {transitive && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                  <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white shrink-0">
                    <X size={14} />
                  </div>
                  <p className="text-sm font-medium text-red-200 italic line-through opacity-60">
                    I {verb} {particle}.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. Separability */}
        <div className="space-y-8 p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group/item">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Split size={24} />
              </div>
              <h5 className="text-xl font-black text-white">2. Separability</h5>
            </div>
            <span className={clsx(
              "px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
              separable === 'no' ? "bg-red-500/20 text-red-400 border border-red-500/20" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
            )}>
              {separable === 'no' ? "Fixed Unit" : "Splitable"}
            </span>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-bold text-purple-400 uppercase tracking-widest flex items-center gap-2">
                <Info size={14} /> Can we split it?
              </p>
              <p className="text-zinc-300 leading-relaxed">
                {safeVal(separabilityExplanation) || (separable === 'no' 
                  ? `No way! The verb and the particle are best friends. They must stay together.` 
                  : `Yes! You can put the object in the middle like a sandwich.`)}
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-zinc-900 border border-white/5 space-y-3">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  <span>Standard Style</span>
                  <Check size={12} className="text-emerald-500" />
                </div>
                <div className="flex items-center gap-2 text-sm font-mono">
                  <span className="text-white">{verb}</span>
                  <span className="text-blue-400">{particle}</span>
                  <span className="text-zinc-500">the object</span>
                </div>
              </div>
              
              {separable !== 'no' && (
                <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/10 space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-purple-400">
                    <span>Sandwich Style (Middle)</span>
                    <Check size={12} className="text-emerald-500" />
                  </div>
                  <div className="flex items-center gap-2 text-sm font-mono">
                    <span className="text-white">{verb}</span>
                    <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-zinc-300">the object</span>
                    <span className="text-blue-400">{particle}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Syntax Anatomy - Visual Block */}
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Target size={20} />
          </div>
          <h5 className="text-xl font-black text-white">3. Syntax Anatomy</h5>
          <div className="h-px flex-1 bg-gradient-to-r from-emerald-500/20 to-transparent" />
        </div>

        <div className="p-10 rounded-[2.5rem] bg-zinc-950/50 border border-white/5 relative overflow-hidden group/anatomy">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 relative z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-zinc-400 font-bold text-lg hover:bg-white/10 transition-colors cursor-help group/token">
                She
                <div className="absolute -top-12 opacity-0 group-hover/token:opacity-100 transition-opacity bg-zinc-800 text-white text-[10px] px-3 py-1 rounded-full uppercase tracking-widest pointer-events-none whitespace-nowrap">
                  Subject (The Doer)
                </div>
              </div>
              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Subject</span>
            </div>

            <div className="text-zinc-700 text-2xl font-light">+</div>

            <div className="flex flex-col items-center gap-3">
              <div className="px-6 py-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-white font-black text-2xl hover:scale-105 transition-transform cursor-help group/token">
                {verb}
                <div className="absolute -top-12 opacity-0 group-hover/token:opacity-100 transition-opacity bg-blue-600 text-white text-[10px] px-3 py-1 rounded-full uppercase tracking-widest pointer-events-none whitespace-nowrap">
                  Verb Module
                </div>
              </div>
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest italic">Verb</span>
            </div>

            {transitive && (
              <>
                <div className="text-zinc-700 text-2xl font-light">+</div>
                <div className="flex flex-col items-center gap-3">
                  <div className="px-6 py-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 font-bold text-lg hover:scale-105 transition-transform cursor-help group/token">
                    the topic
                    <div className="absolute -top-12 opacity-0 group-hover/token:opacity-100 transition-opacity bg-purple-600 text-white text-[10px] px-3 py-1 rounded-full uppercase tracking-widest pointer-events-none whitespace-nowrap">
                      The Receiver
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest underline underline-offset-4 decoration-purple-500/40">Object</span>
                </div>
              </>
            )}

            <div className="text-zinc-700 text-2xl font-light">+</div>

            <div className="flex flex-col items-center gap-3">
              <div className="px-6 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black text-2xl hover:scale-105 transition-transform cursor-help group/token">
                {particle}
                <div className="absolute -top-12 opacity-0 group-hover/token:opacity-100 transition-opacity bg-emerald-600 text-white text-[10px] px-3 py-1 rounded-full uppercase tracking-widest pointer-events-none whitespace-nowrap">
                  Directional Particle
                </div>
              </div>
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">Particle</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Overall Usage Logic */}
      <div className="pt-12 border-t border-white/5 space-y-8 relative">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Sparkles size={120} />
        </div>
        
        <div className="flex items-center gap-3 text-blue-500/60 uppercase tracking-[0.3em] font-black text-xs">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          The Secret Sauce
        </div>
        
        <div className="space-y-4 max-w-4xl">
          <p className="text-2xl font-black text-white tracking-tight leading-tight">
            When do people use <span className="text-blue-400 italic">"{verb} {particle}"</span>?
          </p>
          <p className="text-xl text-zinc-400 leading-relaxed font-medium italic bg-white/[0.01] p-8 rounded-3xl border border-white/5 shadow-inner">
            "{safeVal(logicExplanation) || `Native speakers use this verb when they want to convey the idea of ${verb} in a more dynamic, directional, or complete way using ${particle}.`}"
          </p>
        </div>

        {/* Mini Tip Card */}
        <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex gap-4 items-start max-w-2xl group/tip hover:bg-amber-500/10 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500 shrink-0 group-hover:scale-110 transition-transform">
            <Info size={20} />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-black text-amber-500/80 uppercase tracking-widest">Pro Tip</p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              If you're unsure where to put the object, <span className="text-amber-200/60 font-bold">keeping it at the end</span> is usually the safest bet in common conversation!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

