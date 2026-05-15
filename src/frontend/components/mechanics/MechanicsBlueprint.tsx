"use client";

import { motion } from "framer-motion";
import { GitMerge, Activity, Info } from "lucide-react";
import { PhrasalVerbDetailsProps } from "../../types/components";
import { UsageLogic } from "./UsageLogic";
import { LogicDocumentation } from "./LogicDocumentation";
import { CollocationMap } from "./CollocationMap";

export function MechanicsBlueprint({ details }: PhrasalVerbDetailsProps) {
  const { verb, particle } = details;

  return (
    <div className="relative w-full glass rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
      {/* Background Blueprint Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      {/* Animated Light Blobs */}
      <div className="absolute -left-20 top-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -right-20 bottom-0 w-96 h-96 bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative p-10 md:p-16 space-y-24">
        {/* Header / Meta */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-2xl text-blue-400 flex items-center justify-center shadow-inner">
              <Activity size={28} />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-400">System Analysis</h4>
              <p className="text-2xl font-black text-white tracking-tight italic">Structural Decomposition</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-[0.3em]">Blueprint Revision</span>
              <p className="text-xs font-black text-zinc-400">v3.0.1 (Pedagogical Optimized)</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-24">
          {/* Core Assembly - Visualized structural link */}
          <section id="core-assembly" className="space-y-12">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <GitMerge size={20} />
              </div>
              <span className="text-sm font-black uppercase tracking-[0.2em] text-white">Core Assembly</span>
              <div className="h-px flex-1 bg-white/5" />
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-2">
              <div className="w-full md:flex-1 p-12 rounded-[2rem] bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center space-y-4 group hover:bg-white/[0.05] hover:border-white/10 transition-all duration-500">
                <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 group-hover:text-blue-400 transition-colors">Verbal Module</span>
                <span className="text-6xl md:text-8xl font-black text-white tracking-tighter italic transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-2">
                  {verb}
                </span>
              </div>
              
              <div className="flex flex-col items-center justify-center px-12 relative py-8">
                {/* Energy Flow Animation */}
                <motion.div 
                  className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full"
                  animate={{ 
                    scale: [1, 1.4, 1],
                    opacity: [0.3, 0.7, 0.3] 
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                
                <div className="h-px w-20 bg-zinc-800 relative z-10" />
                <motion.div 
                  className="w-4 h-4 rounded-full bg-blue-500 relative z-10"
                  animate={{ 
                    boxShadow: [
                      "0 0 0px 0px rgba(59, 130, 246, 0)",
                      "0 0 30px 10px rgba(59, 130, 246, 0.4)",
                      "0 0 0px 0px rgba(59, 130, 246, 0)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="h-px w-20 bg-zinc-800 relative z-10" />
                
                <div className="absolute -bottom-8 flex flex-col items-center">
                  <div className="w-px h-8 bg-gradient-to-b from-blue-500/50 to-transparent" />
                  <span className="text-xs font-black text-blue-500/60 uppercase tracking-[0.4em]">Functional Link</span>
                </div>
              </div>

              <div className="w-full md:flex-1 p-12 rounded-[2rem] bg-blue-500/5 border border-blue-500/10 flex flex-col items-center justify-center space-y-4 group hover:bg-blue-500/10 hover:border-blue-500/20 transition-all duration-500">
                <span className="text-xs font-mono uppercase tracking-widest text-blue-500/60 group-hover:text-blue-400 transition-colors">Particle Component</span>
                <span className="text-6xl md:text-8xl font-black text-blue-400 tracking-tighter italic transition-transform duration-500 group-hover:scale-105 group-hover:rotate-2">
                  {particle}
                </span>
              </div>
            </div>
          </section>

          {/* Usage Logic Overhaul */}
          <section className="space-y-12">
            <UsageLogic details={details} />
          </section>

          {/* Logic Documentation Section */}
          <section className="space-y-12">
            <LogicDocumentation details={details} />
          </section>

          {/* Collocation Map Section */}
          <section className="space-y-12">
            <CollocationMap details={details} />
          </section>

          {/* Infrastructure Footer */}
          <footer className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Info size={14} className="text-zinc-500" />
                <span className="text-xs font-black uppercase tracking-widest text-zinc-500">AI Pedagogical Validation: Pass</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-black uppercase tracking-widest text-zinc-500">Real-time Syntax Sync</span>
              </div>
            </div>
            <div className="flex gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-8 h-1 bg-white/5 rounded-full" />
              ))}
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
