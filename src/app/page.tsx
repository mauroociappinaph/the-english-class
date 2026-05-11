"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, BookOpen, GraduationCap, ChevronRight, Languages, X } from "lucide-react";
import { useStudyStore } from "@/frontend/store/useStudyStore";
import { INITIAL_EXPRESSION } from "@/backend/infrastructure/constants";

import { analyzeExpression, getExpressions, deleteExpression } from "./actions";
import { InteractiveText } from "@/frontend/components/InteractiveText";
import { TenseTimeline } from "@/frontend/components/TenseTimeline";
import { VisualCard } from "@/frontend/components/VisualCard";


export default function Home() {
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState<"search" | "library" | "study">("search");
  const { isAnalyzing, setAnalyzing, currentAnalysis, setCurrentAnalysis, expressions, setExpressions, addExpression, removeExpression } = useStudyStore();

  useEffect(() => {
    setCurrentAnalysis(INITIAL_EXPRESSION);
    // Fetch initial library
    const fetchLibrary = async () => {
      const library = await getExpressions();
      setExpressions(library as any);
    };
    fetchLibrary();
  }, [setCurrentAnalysis, setExpressions]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setAnalyzing(true);
    try {
      const result = await analyzeExpression(input.toLowerCase());
      if (result) {
        setCurrentAnalysis(result);
        // Update library if it's new
        if (!expressions.find(e => e.id === result.id)) {
          addExpression(result as any);
        }
      } else {
        // Fallback or show "not found"
        console.log("No result found for:", input);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const getCefrStyle = (level: string) => {
    const styles: Record<string, { bg: string; glow: string }> = {
      A1: { bg: "bg-cefr-a1", glow: "var(--cefr-glow-A1)" },
      A2: { bg: "bg-cefr-a2", glow: "var(--cefr-glow-A2)" },
      B1: { bg: "bg-cefr-b1", glow: "var(--cefr-glow-B1)" },
      B2: { bg: "bg-cefr-b2", glow: "var(--cefr-glow-B2)" },
      C1: { bg: "bg-cefr-c1", glow: "var(--cefr-glow-C1)" },
      C2: { bg: "bg-cefr-c2", glow: "var(--cefr-glow-C2)" },
    };
    return styles[level] || { bg: "bg-zinc-500", glow: "255, 255, 255" };
  };

  return (
    <div className="flex flex-col items-center gap-12 w-full max-w-4xl mx-auto pt-12">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-6xl font-bold tracking-tighter gradient-text">
          The English Class
        </h1>
        <p className="text-zinc-400 text-lg font-medium">
          Your Intelligent Guide to Mastery
        </p>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10 w-fit">
        {(["search", "library", "study"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab 
                ? "bg-white text-black shadow-lg" 
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "search" && (
        <>
          {/* Search Section */}
          <div className="w-full max-w-2xl mx-auto sticky top-8 z-50 pt-8">
            <motion.form 
              onSubmit={handleSearch}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="glass-deep rounded-full p-2 flex items-center shadow-2xl"
            >
              <div className="flex-1 flex items-center px-6 gap-4">
                <Search className="text-zinc-500" size={20} />
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Analyze expression..."
                  className="bg-transparent border-none outline-none text-white w-full py-3 text-lg placeholder:text-zinc-600 font-medium"
                />
              </div>
              <button 
                type="submit"
                disabled={isAnalyzing}
                className="bg-white text-black px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50"
              >
                {isAnalyzing ? "..." : "Analyze"}
              </button>
            </motion.form>
          </div>

          {/* Results Section */}
          <AnimatePresence mode="wait">
            {currentAnalysis && !isAnalyzing && (
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

                  {/* Usage & Examples Grid - More organic */}
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
                         {/* Decorative Background Icon */}
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
            )}

            {isAnalyzing && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full flex flex-col items-center gap-4 py-20"
              >
                <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-zinc-500 animate-pulse font-medium">Desglosando lingüísticamente...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {activeTab === "library" && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
        {/* Real Saved Expressions */}
        {expressions.map((ex, i) => (
          <div key={ex.id || i} className="glass p-6 rounded-2xl space-y-3 relative group overflow-hidden">
             <div 
               className={`absolute top-0 right-0 w-2 h-full ${getCefrStyle(ex?.cefr || 'A1').bg}`} 
               style={{ boxShadow: `-5px 0 15px rgba(${getCefrStyle(ex?.cefr || 'A1').glow}, 0.2)` }}
             />
             
             {/* Delete Button */}
             <button 
               onClick={async (e) => {
                 e.stopPropagation();
                 if (ex.id) {
                   await deleteExpression(ex.id);
                   removeExpression(ex.id);
                 }
               }}
               className="absolute top-2 right-4 p-1 rounded-lg bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
             >
               <X size={14} />
             </button>

             <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">{ex?.type}</span>
                <span className="text-[10px] font-bold text-white/50">{ex?.cefr}</span>
             </div>
             <h4 className="text-xl font-bold">{ex?.text}</h4>
             <p className="text-zinc-400 text-sm">{ex?.translation}</p>
             <button 
               onClick={() => {
                 setCurrentAnalysis(ex);
                 setActiveTab("search");
               }}
               className="text-xs text-blue-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
             >
                Ver detalle <ChevronRight size={12} />
             </button>
          </div>
        ))}
        </motion.div>
      )}

      {activeTab === "study" && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md aspect-[3/4] glass rounded-[3rem] p-12 flex flex-col items-center justify-center text-center gap-8 shadow-3xl"
        >
          <div className="h-20 w-20 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
             <GraduationCap size={40} className="text-blue-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-bold">Ready for Review?</h3>
            <p className="text-zinc-500">Master 12 expressions today using spaced repetition.</p>
          </div>
          <button className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-zinc-200 transition-colors shadow-xl">
             Start Session
          </button>
        </motion.div>
      )}

    </div>
  );
}
