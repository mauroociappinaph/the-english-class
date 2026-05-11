import { motion } from "framer-motion";
import { Languages, GraduationCap, Sparkles } from "lucide-react";
import { InteractiveText } from "./InteractiveText";
import { TenseTimeline } from "./TenseTimeline";
import { VisualCard } from "./VisualCard";

import { AnalysisResultProps } from "@/frontend/types/components";


export function AnalysisResult({ currentAnalysis, getCefrStyle }: AnalysisResultProps) {
  return (
    <motion.div
      key={currentAnalysis.text}
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.1 } },
        hidden: {}
      }}
      className="w-full relative py-20"
    >
      {/* Background Aura */}
      <div 
        className="glow-aura" 
        style={{ 
          background: `radial-gradient(circle, rgba(${getCefrStyle(currentAnalysis.cefr).glow}, 0.5) 0%, transparent 70%)`
        }}
      />

      <div className="flex flex-col items-center text-center space-y-12">
        {/* Hero Expression */}
        <motion.div 
          variants={{
            hidden: { opacity: 0, scale: 0.8, y: 40 },
            visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 15 } }
          }}
          className="space-y-4"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500 opacity-50 block mb-4">
            {currentAnalysis.type}
          </span>
          <h2 className="text-8xl md:text-9xl font-black tracking-tighter text-white text-glow leading-none">
            {currentAnalysis.text}
          </h2>
          <div className="flex items-center justify-center gap-6 mt-6">
            <p className="text-zinc-500 italic font-mono text-xl">{currentAnalysis.ipa}</p>
            <div className={`w-12 h-12 flex items-center justify-center ${getCefrStyle(currentAnalysis.cefr).bg} rounded-full text-white font-black text-xs shadow-2xl`}>
              {currentAnalysis.cefr}
            </div>
          </div>
        </motion.div>

        {/* Primary Translation & Meaning */}
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          className="max-w-2xl space-y-8"
        >
          <div className="flex items-center justify-center gap-4 text-4xl md:text-5xl font-bold text-white">
            <Languages size={40} className="text-blue-500" />
            <span className="gradient-text">{currentAnalysis.translation}</span>
          </div>
          <p className="text-zinc-400 text-xl leading-relaxed font-medium">
            {currentAnalysis.meaning}
          </p>
        </motion.div>

        {/* Visual Mnemonic Bubble */}
        <motion.div 
          variants={{
            hidden: { opacity: 0, scale: 0.9 },
            visible: { opacity: 1, scale: 1 }
          }}
          className="w-full max-w-4xl"
        >
          <VisualCard 
            mnemonic={currentAnalysis.mnemonic} 
            text={currentAnalysis.text} 
          />
        </motion.div>

        {/* Usage & Examples Grid */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12">
          {/* Left: Examples & Timeline */}
          <div className="lg:col-span-8 space-y-12">
            <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-zinc-800" />
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">Chronological Context</h3>
                <div className="h-px flex-1 bg-zinc-800" />
              </div>
              <TenseTimeline tenses={currentAnalysis.tenses} />
            </motion.div>

            <div className="space-y-12">
              <div className="flex items-center gap-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">Live Scenarios</h3>
                <div className="h-px flex-1 bg-zinc-800" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                {currentAnalysis.examples.map((ex: any, i: number) => (
                  <motion.div 
                    key={i}
                    variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
                    className="space-y-2 p-6 rounded-3xl hover:bg-white/5 transition-colors group border-l border-white/5"
                  >
                    <span className="text-[10px] font-black uppercase text-zinc-600 tracking-tighter group-hover:text-blue-500 transition-colors">
                      {ex.category}
                    </span>
                    <div className="block">
                      <InteractiveText 
                        text={ex.text} 
                        translation={ex.translation} 
                        className="text-lg text-zinc-200 leading-tight font-medium" 
                      />
                    </div>
                    {ex.explanation && <p className="text-xs text-zinc-500 leading-relaxed">{ex.explanation}</p>}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Quick Tips Floating */}
          <div className="lg:col-span-4 space-y-6">
             <motion.div 
              variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}
              className="glass-deep p-10 rounded-[3rem] space-y-10 text-left animate-float border border-white/5 relative overflow-hidden"
             >
               <GraduationCap size={120} className="absolute -bottom-10 -right-10 text-emerald-500 opacity-5" />

               <div className="flex items-center gap-4 text-emerald-400">
                 <div className="p-3 bg-emerald-500/10 rounded-2xl">
                   <GraduationCap size={24} />
                 </div>
                 <h3 className="text-xs font-black uppercase tracking-[0.3em]">Mastery Tips</h3>
               </div>
               
               <div className="space-y-10 relative z-10">
                 <div className="space-y-3">
                   <div className="flex items-center gap-2">
                     <div className="w-1 h-1 rounded-full bg-emerald-500" />
                     <span className="text-emerald-500/70 text-[9px] font-black uppercase tracking-widest block">Naturalness</span>
                   </div>
                   <p className="text-zinc-300 text-base leading-relaxed font-medium pl-3 border-l border-emerald-500/20">
                     {currentAnalysis.usageTips.naturalness}
                   </p>
                 </div>

                 <div className="p-8 bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/10 rounded-[2rem] space-y-3">
                   <div className="flex items-center gap-2 text-red-400">
                     <Sparkles size={16} />
                     <span className="text-[9px] font-black uppercase tracking-widest">Common Pitfall</span>
                   </div>
                   <p className="text-zinc-300 text-sm leading-relaxed font-medium italic">
                     "{currentAnalysis.usageTips.commonMistake}"
                   </p>
                 </div>

                 <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
                    <div className="space-y-2">
                      <span className="text-zinc-600 text-[9px] font-black uppercase tracking-widest block">Formality</span>
                      <p className="text-white text-sm font-black uppercase tracking-tighter">{currentAnalysis.formality}</p>
                    </div>
                    <div className="space-y-2 text-right">
                      <span className="text-zinc-600 text-[9px] font-black uppercase tracking-widest block">Frequency</span>
                      <div className="flex gap-1.5 mt-2 justify-end">
                        {[1,2,3,4,5].map(i => (
                          <div 
                            key={i} 
                            className={`h-1.5 w-3 rounded-full transition-all duration-500 ${i <= 4 ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-zinc-800'}`} 
                          />
                        ))}
                      </div>
                    </div>
                 </div>
               </div>
             </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
