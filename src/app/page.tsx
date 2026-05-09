"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, BookOpen, GraduationCap, ChevronRight, Languages } from "lucide-react";
import { useStudyStore } from "@/store/useStudyStore";
import { INITIAL_EXPRESSION } from "@/lib/constants";
import { getExpression } from "./actions";

export default function Home() {
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState<"search" | "library" | "study">("search");
  const { isAnalyzing, setAnalyzing, currentAnalysis, setCurrentAnalysis, expressions } = useStudyStore();

  useEffect(() => {
    setCurrentAnalysis(INITIAL_EXPRESSION);
  }, [setCurrentAnalysis]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setAnalyzing(true);
    try {
      const result = await getExpression(input.toLowerCase());
      if (result) {
        setCurrentAnalysis(result);
      } else {
        // Fallback or show "not found"
        console.log("No result found in DB for:", input);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const getCefrColor = (level: string) => {
    const colors: Record<string, string> = {
      A1: "bg-cefr-a1",
      A2: "bg-cefr-a2",
      B1: "bg-cefr-b1",
      B2: "bg-cefr-b2",
      C1: "bg-cefr-c1",
      C2: "bg-cefr-c2",
    };
    return colors[level] || "bg-zinc-500";
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
          <motion.form 
            onSubmit={handleSearch}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full relative"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex items-center bg-black rounded-2xl border border-white/10 p-2 shadow-2xl">
                <Search className="ml-4 text-zinc-500" />
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe una palabra o frase..."
                  className="w-full bg-transparent border-none outline-none px-4 py-4 text-xl text-white placeholder:text-zinc-600"
                />
                <button 
                  type="submit"
                  disabled={isAnalyzing}
                  className="bg-white text-black font-bold px-8 py-4 rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50"
                >
                  {isAnalyzing ? "Analizando..." : "Analizar"}
                </button>
              </div>
            </div>
          </motion.form>

          {/* Results Section */}
          <AnimatePresence mode="wait">
            {currentAnalysis && !isAnalyzing && (
              <motion.div
                key={currentAnalysis.text}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {/* Main Info Card */}
                <div className="md:col-span-2 space-y-6">
                  <div className="glass rounded-3xl p-8 space-y-6 border-l-4 border-l-cefr-b2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-zinc-500 uppercase tracking-widest text-xs font-bold">{currentAnalysis.type}</span>
                        <h2 className="text-4xl font-bold mt-1">{currentAnalysis.text}</h2>
                        <p className="text-zinc-400 italic mt-1 font-mono">{currentAnalysis.ipa}</p>
                      </div>
                      <div className={`${getCefrColor(currentAnalysis.cefr)} text-white px-4 py-1 rounded-full font-bold text-sm shadow-lg`}>
                        {currentAnalysis.cefr}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-2xl font-semibold text-blue-400">
                        <Languages size={24} />
                        <span>{currentAnalysis.translation}</span>
                      </div>
                      <p className="text-zinc-300 text-lg leading-relaxed">
                        {currentAnalysis.meaning}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                       <div className="bg-white/5 rounded-2xl p-4">
                          <span className="text-zinc-500 text-xs font-bold uppercase">Formality</span>
                          <p className="text-white font-medium">{currentAnalysis.formality}</p>
                       </div>
                       <div className="bg-white/5 rounded-2xl p-4">
                          <span className="text-zinc-500 text-xs font-bold uppercase">Frequency</span>
                          <div className="flex gap-1 mt-1">
                            {[1,2,3,4,5].map(i => (
                              <div key={i} className={`h-1.5 w-full rounded-full ${i <= 4 ? 'bg-blue-500' : 'bg-zinc-700'}`} />
                            ))}
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* Tenses Card */}
                  <div className="glass rounded-3xl p-8 space-y-4">
                    <div className="flex items-center gap-2 text-zinc-300 font-bold">
                      <Sparkles size={20} className="text-purple-400" />
                      <h3>Verb Tenses / Timeline</h3>
                    </div>
                    <div className="space-y-3">
                      {Object.entries(currentAnalysis.tenses).map(([tense, text]: [string, any]) => (
                        <div key={tense} className="flex gap-4 items-center group">
                          <span className="w-32 text-xs font-bold text-zinc-500 uppercase">{tense.replace('_', ' ')}</span>
                          <div className="flex-1 bg-white/5 p-3 rounded-xl border border-transparent group-hover:border-purple-500/30 transition-colors">
                            <p className="text-zinc-200">{text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar Cards */}
                <div className="space-y-6">
                  {/* Examples Card */}
                  <div className="glass rounded-3xl p-6 space-y-4">
                     <div className="flex items-center gap-2 text-zinc-300 font-bold">
                      <BookOpen size={20} className="text-blue-400" />
                      <h3>Smart Examples</h3>
                    </div>
                    <div className="space-y-4">
                      {currentAnalysis.examples.map((ex: any, i: number) => (
                        <div key={i} className="space-y-1">
                          <span className="text-[10px] font-black uppercase text-zinc-500 tracking-tighter">{ex.category}</span>
                          <p className="text-sm text-zinc-200 leading-snug">{ex.text}</p>
                          {ex.explanation && <p className="text-[10px] text-zinc-500 italic">{ex.explanation}</p>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Usage Tips Card */}
                  <div className="glass rounded-3xl p-6 space-y-4 bg-gradient-to-br from-zinc-900 to-black">
                     <div className="flex items-center gap-2 text-zinc-300 font-bold">
                      <GraduationCap size={20} className="text-emerald-400" />
                      <h3>Quick Tips</h3>
                    </div>
                    <div className="space-y-4 text-xs">
                      <div>
                        <span className="text-emerald-500 font-bold">Naturalness:</span>
                        <p className="text-zinc-400">{currentAnalysis.usageTips.naturalness}</p>
                      </div>
                      <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
                        <span className="text-red-400 font-bold">Common Error:</span>
                        <p className="text-zinc-400 mt-1">{currentAnalysis.usageTips.common_errors}</p>
                      </div>
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
          {/* Mock Saved Expressions */}
          {[currentAnalysis, ...expressions].map((ex, i) => (
            <div key={i} className="glass p-6 rounded-2xl space-y-3 relative group overflow-hidden">
               <div className={`absolute top-0 right-0 w-2 h-full ${getCefrColor(ex?.cefr || 'A1')}`} />
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase">{ex?.type}</span>
                  <span className="text-[10px] font-bold text-white/50">{ex?.cefr}</span>
               </div>
               <h4 className="text-xl font-bold">{ex?.text}</h4>
               <p className="text-zinc-400 text-sm">{ex?.translation}</p>
               <button className="text-xs text-blue-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
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
