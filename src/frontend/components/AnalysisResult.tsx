import { motion } from "framer-motion";
import { Languages, GraduationCap, Sparkles } from "lucide-react";
import { InteractiveText } from "./InteractiveText";
import { TenseTimeline } from "./TenseTimeline";
import { VisualCard } from "./VisualCard";
import { AnalysisResultProps } from "@/frontend/types/components";
import { WordFamilyList } from "./WordFamilyList";
import { PhrasalVerbDetails } from "./PhrasalVerbDetails";

export function AnalysisResult({ currentAnalysis, getCefrStyle }: AnalysisResultProps) {
  // Global Guard: If there is no data, render nothing.
  if (!currentAnalysis) return null;

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

      <div className="flex flex-col items-center text-center space-y-24">
        {/* Hero Expression */}
        <motion.div 
          variants={{
            hidden: { opacity: 0, scale: 0.8, y: 40 },
            visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 15 } }
          }}
          className="space-y-6"
        >
          <span className="text-[12px] font-black uppercase tracking-[0.6em] text-zinc-500 opacity-50 block mb-6">
            {currentAnalysis.type}
          </span>
          <h2 className="text-8xl md:text-[10rem] font-black tracking-tighter text-white text-glow leading-none">
            {currentAnalysis.text}
          </h2>
          <div className="flex items-center justify-center gap-8 mt-10">
            <p className="text-zinc-500 italic font-mono text-2xl">{currentAnalysis.ipa}</p>
            <div className={`w-16 h-16 flex items-center justify-center ${getCefrStyle(currentAnalysis.cefr).bg} rounded-full text-white font-black text-sm shadow-[0_0_40px_rgba(var(--glow-rgb),0.3)]`}>
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
          className="max-w-3xl space-y-10"
        >
          <div className="flex items-center justify-center gap-6 text-5xl md:text-6xl font-bold text-white">
            <Languages size={56} className="text-blue-500" />
            <span className="gradient-text tracking-tight">{currentAnalysis.translation}</span>
          </div>
          <p className="text-zinc-400 text-2xl leading-relaxed font-medium">
            {currentAnalysis.meaning}
          </p>
          {currentAnalysis.secondaryMeanings && currentAnalysis.secondaryMeanings.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              {currentAnalysis.secondaryMeanings.map((m, i) => (
                <span key={i} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-sm text-zinc-500 font-medium italic">
                  &ldquo;{m}&rdquo;
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {/* Visual Mnemonic Bubble */}
        <motion.div 
          variants={{
            hidden: { opacity: 0, scale: 0.95 },
            visible: { opacity: 1, scale: 1 }
          }}
          className="w-full max-w-5xl"
        >
          <VisualCard 
            mnemonic={currentAnalysis.mnemonic} 
            text={currentAnalysis.text} 
          />
        </motion.div>


        {/* Linguistic Mechanics Section */}
        {(currentAnalysis.wordFamilies || currentAnalysis.phrasalVerbDetails) && (
          <motion.div 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 p-12 rounded-[4rem] bg-white/[0.02] border border-white/5"
          >
            {currentAnalysis.phrasalVerbDetails && (
              <div className="space-y-6">
                <PhrasalVerbDetails details={currentAnalysis.phrasalVerbDetails} />
              </div>
            )}
            {currentAnalysis.wordFamilies && (
              <div className="space-y-6">
                <WordFamilyList families={currentAnalysis.wordFamilies} />
              </div>
            )}
          </motion.div>
        )}

        {/* Usage & Examples Section */}
        <div className="w-full space-y-32 pt-24 border-t border-white/5">
          {/* Chronological Context */}
          <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} className="space-y-16">
            <div className="flex items-center gap-8">
              <h3 className="text-sm font-black uppercase tracking-[0.5em] text-zinc-500 whitespace-nowrap">Chronological Context</h3>
              <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent" />
            </div>
            <TenseTimeline tenses={currentAnalysis.tenses} />
          </motion.div>

          {/* Live Scenarios */}
          <div className="space-y-16">
            <div className="flex items-center gap-8">
              <h3 className="text-sm font-black uppercase tracking-[0.5em] text-zinc-500 whitespace-nowrap">Live Scenarios</h3>
              <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 text-left">
              {currentAnalysis.examples?.map((ex, i) => (
                <motion.div 
                  key={i}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  className="group space-y-6 p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    <span className="text-[11px] font-black uppercase text-zinc-600 tracking-[0.3em] group-hover:text-blue-400 transition-colors">
                      {ex.category}
                    </span>
                  </div>
                  <div className="space-y-4">
                    <InteractiveText 
                      text={ex.text} 
                      translation={ex.translation || ""} 
                      className="text-2xl text-zinc-100 leading-tight font-bold tracking-tight" 
                    />
                    {ex.explanation && (
                      <p className="text-sm text-zinc-500 leading-relaxed font-medium italic border-l-2 border-white/5 pl-6">
                        {ex.explanation}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mastery Tips (At the end) */}
          <motion.div 
            variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
            className="w-full"
          >
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
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
