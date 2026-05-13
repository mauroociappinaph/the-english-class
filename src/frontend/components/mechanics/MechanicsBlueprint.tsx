"use client";

import { motion } from "framer-motion";
import { Settings2, GitMerge, ListTree, PackageSearch, Activity } from "lucide-react";
import { PhrasalVerbDetailsProps } from "../../types/components";

export function MechanicsBlueprint({ details }: PhrasalVerbDetailsProps) {
  const { verb, particle, separable, transitive, commonCollocations } = details;

  const separableInfo = {
    no: { label: "Inseparable", desc: "The verb and particle stay together.", color: "text-rose-400" },
    optional: { label: "Separable (Optional)", desc: "You can put the object in the middle.", color: "text-amber-400" },
    mandatory: { label: "Separable (Mandatory)", desc: "The object MUST go in the middle.", color: "text-emerald-400" },
  };

  const currentSep = separableInfo[separable] || separableInfo.no;

  return (
    <div className="relative w-full glass rounded-[3rem] border border-white/10 overflow-hidden">
      {/* Background Blueprint Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      
      <div className="relative p-12 space-y-16">
        {/* Header / Meta */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
              <Activity size={20} />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">System Analysis</h4>
              <p className="text-lg font-bold text-white">Structural Decomposition</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Blueprint v2.0.4</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Core Assembly */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-3">
              <GitMerge size={16} className="text-blue-500" />
              <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Core Assembly</span>
            </div>
            
            <div className="flex items-center gap-1">
              <div className="flex-1 p-8 rounded-[2rem] bg-white/5 border border-white/10 flex flex-col items-center justify-center space-y-2 group hover:bg-white/[0.08] transition-colors">
                <span className="text-[10px] font-mono uppercase text-zinc-500 group-hover:text-blue-400 transition-colors">Verb Module</span>
                <span className="text-4xl md:text-6xl font-black text-white tracking-tighter italic">{verb}</span>
              </div>
              
              <div className="flex flex-col items-center justify-center px-4">
                <div className="h-px w-8 bg-zinc-800" />
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse my-2" />
                <div className="h-px w-8 bg-zinc-800" />
              </div>

              <div className="flex-1 p-8 rounded-[2rem] bg-blue-500/5 border border-blue-500/20 flex flex-col items-center justify-center space-y-2 group hover:bg-blue-500/10 transition-colors">
                <span className="text-[10px] font-mono uppercase text-blue-500/50 group-hover:text-blue-400 transition-colors">Particle Link</span>
                <span className="text-4xl md:text-6xl font-black text-blue-400 tracking-tighter italic">{particle}</span>
              </div>
            </div>
          </div>

          {/* Usage Logic */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <ListTree size={16} className="text-purple-500" />
              <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Usage Logic</span>
            </div>

            <div className="space-y-4">
              {/* Transitive */}
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-zinc-500 tracking-tighter">Transitive</span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${transitive ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' : 'bg-zinc-800 text-zinc-500'}`}>
                    {transitive ? 'Detected' : 'Negative'}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                  {transitive ? "Needs an object to complete the circuit." : "Stands alone as a complete action."}
                </p>
              </div>

              {/* Separability */}
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-zinc-500 tracking-tighter">Separability</span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase bg-zinc-800 ${currentSep.color}`}>
                    {currentSep.label}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                  {currentSep.desc}
                </p>
              </div>

              {/* Logic Documentation - Enhanced UI/UX with Live Examples */}
              <div className="relative group/specs p-8 rounded-[2.5rem] bg-blue-500/[0.03] border border-blue-500/10 space-y-6 mt-12 overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover/specs:bg-blue-500/10 transition-colors" />
                
                <div className="flex items-center gap-3 text-blue-400">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Activity size={16} />
                  </div>
                  <span className="text-xs font-black uppercase tracking-[0.2em]">Logic Documentation</span>
                </div>

                <div className="space-y-8 relative">
                  {/* Transitividad Case */}
                  <div className="space-y-4">
                    <div className="flex items-baseline gap-2">
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">01. Transitividad</p>
                      <div className="h-px flex-1 bg-white/5" />
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm text-zinc-300 leading-relaxed">
                        Define si el verbo necesita un objeto para cerrar el sentido.
                      </p>
                      {/* Live Example for Transitive */}
                      <div className="p-4 rounded-2xl bg-zinc-900/50 border border-white/5 font-mono text-[11px] space-y-2">
                        <div className="flex items-center gap-2 text-zinc-500">
                          <span className="w-1 h-1 rounded-full bg-blue-500" />
                          <span>LIVE EXAMPLE</span>
                        </div>
                        <p className="text-zinc-300">
                          {transitive ? (
                            <>
                              I <span className="text-white font-bold">{verb}</span> <span className="text-blue-400 font-black underline decoration-blue-500/30 underline-offset-4">[something]</span> {particle}
                            </>
                          ) : (
                            <>
                              It just <span className="text-white font-bold">{verb}</span> {particle}
                            </>
                          )}
                        </p>
                        <p className="text-[9px] text-zinc-600 italic">
                          {transitive ? "Requires a target to complete the action." : "Action is self-contained."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Separabilidad Case */}
                  <div className="space-y-4">
                    <div className="flex items-baseline gap-2">
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">02. Separabilidad</p>
                      <div className="h-px flex-1 bg-white/5" />
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm text-zinc-300 leading-relaxed">
                        Determina si podés meter el objeto en el medio del bloque.
                      </p>
                      
                      {/* Live Example for Separability */}
                      <div className="grid grid-cols-1 gap-2">
                        <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 font-mono text-[11px] space-y-1">
                          <div className="flex items-center gap-2 text-emerald-500/60 mb-1">
                            <span className="text-[9px] font-black tracking-widest">VALID</span>
                          </div>
                          <p className="text-zinc-300">
                            {separable === 'no' ? (
                              <><span className="text-white">{verb}</span> {particle} <span className="text-emerald-400">[object]</span></>
                            ) : (
                              <><span className="text-white">{verb}</span> <span className="text-emerald-400">[object]</span> {particle}</>
                            )}
                          </p>
                        </div>

                        {separable === 'no' && (
                          <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 font-mono text-[11px] space-y-1 opacity-60">
                            <div className="flex items-center gap-2 text-rose-500/60 mb-1">
                              <span className="text-[9px] font-black tracking-widest">INVALID</span>
                            </div>
                            <p className="text-zinc-500 line-through decoration-rose-500/50">
                              <span className="">{verb}</span> <span className="">[object]</span> {particle}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Bar */}
                <div className="pt-6 border-t border-white/5 flex items-center justify-between opacity-40">
                  <span className="text-[8px] font-mono uppercase tracking-[0.3em] text-zinc-500">Pedagogical Engine Active</span>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-blue-500" />
                    <div className="w-1 h-1 rounded-full bg-blue-500/40" />
                    <div className="w-1 h-1 rounded-full bg-blue-500/10" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Collocations */}
          <div className="lg:col-span-3 pt-8 border-t border-white/5 space-y-8">
            <div className="flex items-center gap-3">
              <PackageSearch size={16} className="text-amber-500" />
              <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Common Partners (Collocations)</span>
            </div>
            
            <div className="flex flex-wrap gap-4">
              {commonCollocations.map((partner, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -2 }}
                  className="px-8 py-4 rounded-2xl bg-zinc-900/50 border border-white/5 text-zinc-300 font-bold italic text-lg tracking-tight hover:border-blue-500/30 hover:text-white transition-all cursor-default"
                >
                  &ldquo;{partner}&rdquo;
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
