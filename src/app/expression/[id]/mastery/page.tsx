"use client";

import { GraduationCap, Sparkles } from "lucide-react";
import { useStudyStore } from "@/frontend/store/useStudyStore";

export default function MasteryPage() {
  const { currentAnalysis } = useStudyStore();

  if (!currentAnalysis) return null;

  return (
    <div className="w-full max-w-5xl mx-auto">
       <div className="glass-deep p-16 md:p-24 rounded-[5rem] space-y-16 text-left border border-white/10 shadow-3xl overflow-hidden group relative">
         <GraduationCap size={300} className="absolute -bottom-24 -right-24 text-blue-500 opacity-[0.03] group-hover:opacity-[0.06] transition-all duration-1000 rotate-12" />

         <div className="flex items-center gap-8">
           <div className="p-6 bg-blue-500/10 rounded-[2.5rem] text-blue-400">
             <GraduationCap size={40} />
           </div>
           <h3 className="text-xl font-black uppercase tracking-[0.8em] text-white">Mastery Tips</h3>
         </div>
         
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 relative z-10">
            <div className="space-y-16">
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                  <span className="text-zinc-500 text-sm font-black uppercase tracking-[0.4em] block">Naturalness</span>
                </div>
                <p className="text-zinc-100 text-3xl leading-relaxed font-bold pl-8 border-l-2 border-white/10">
                  {currentAnalysis.usageTips?.naturalness}
                </p>
              </div>

              <div className="p-12 bg-white/[0.03] border border-white/5 rounded-[4rem] space-y-8">
                <div className="flex items-center gap-4 text-red-400">
                  <Sparkles size={32} />
                  <span className="text-sm font-black uppercase tracking-[0.4em]">Common Pitfall</span>
                </div>
                <p className="text-zinc-400 text-xl leading-relaxed font-medium italic">
                  "{currentAnalysis.usageTips?.commonMistake}"
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-end gap-16 lg:pl-20 lg:border-l border-white/5">
              <div className="space-y-6">
                <span className="text-zinc-600 text-sm font-black uppercase tracking-[0.5em] block">Formality</span>
                <p className="text-white text-5xl font-black uppercase tracking-tighter text-glow-sm">{currentAnalysis.formality}</p>
              </div>
              <div className="space-y-8">
                <span className="text-zinc-600 text-sm font-black uppercase tracking-[0.5em] block">Frequency</span>
                <div className="flex gap-5 mt-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div 
                      key={i} 
                      className={`h-4 w-12 rounded-full transition-all duration-1000 ${i <= 4 ? 'bg-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.6)]' : 'bg-zinc-800'}`} 
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
       </div>
    </div>
  );
}
