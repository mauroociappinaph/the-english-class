"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useStudyStore } from "@/frontend/store/useStudyStore";
import { useAiStream } from "@/frontend/hooks/useAiStream";
import { analyzeExpression, getExpressions, deleteExpression } from "./actions";
import { Expression } from "@/shared/types/expression";

import { SearchBar } from "@/frontend/components/SearchBar";
import { ExpressionLibrary } from "@/frontend/components/ExpressionLibrary";
import { StudySection } from "@/frontend/components/StudySection";
import { getCefrStyle } from "@/frontend/components/cefr-styles";

import { GrammarSection } from "@/frontend/components/GrammarSection";
import { Loader2 } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState<"search" | "library" | "study" | "grammar">("search");
  const { isAnalyzing, setAnalyzing, setCurrentAnalysis, expressions, setExpressions, addExpression, removeExpression } = useStudyStore();
  const { streamedText, startStream } = useAiStream();

  useEffect(() => {
    const fetchLibrary = async () => {
      const library = await getExpressions();
      setExpressions(library);
    };
    fetchLibrary();
  }, [setExpressions]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tab = searchParams.get("tab");
    if (tab === "grammar" || tab === "library" || tab === "study" || tab === "search") {
      setActiveTab(tab as "search" | "library" | "study" | "grammar");
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setAnalyzing(true);
    const clientStart = performance.now();
    console.log(`[Client] Starting analysis for: "${input}"`);
    
    try {
      startStream(input.toLowerCase(), { type: 'expression' });
      
      const result = await analyzeExpression(input.toLowerCase());
      const clientEnd = performance.now();
      console.log(`[Client] Analysis COMPLETED in ${((clientEnd - clientStart) / 1000).toFixed(2)}s`);

      if (result) {
        setCurrentAnalysis(result);
        if (!expressions.find(e => e.id === result.id)) {
          addExpression(result);
        }
        setTimeout(() => {
          router.push(`/expression/${result.id}`);
        }, 800);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteExpression(id);
    removeExpression(id);
  };

  const handleViewDetail = (ex: Expression) => {
    setCurrentAnalysis(ex);
    router.push(`/expression/${ex.id}`);
  };

  return (
    <div className="flex flex-col items-center gap-12 w-full max-w-4xl mx-auto pt-16 pb-32">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center space-y-6"
        layoutId="header-container"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.6em] text-zinc-600 block">
          Linguistic Analysis Engine
        </span>
        <h1 className="font-display text-6xl md:text-8xl font-black tracking-tighter text-white leading-none">
          The English Class
        </h1>
        <p className="text-zinc-500 text-xl font-medium max-w-lg mx-auto leading-relaxed">
          Your Intelligent Guide to Mastery. Decode syntax, pronunciation, and contextual mechanics instantly.
        </p>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="flex p-1 bg-zinc-950 rounded-2xl border border-white/10 w-fit relative overflow-hidden">
        {(["search", "library", "study", "grammar"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-colors z-10 ${
              activeTab === tab ? "text-black" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {activeTab === tab && (
              <motion.div
                layoutId="active-tab"
                className="absolute inset-0 bg-white rounded-xl -z-10"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            {tab}
          </button>
        ))}
      </div>

      <div className="w-full relative">
        {activeTab === "search" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <SearchBar 
              input={input} 
              setInput={setInput} 
              handleSearch={handleSearch} 
              isAnalyzing={isAnalyzing} 
            />

            <AnimatePresence mode="wait">
              {isAnalyzing && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="w-full max-w-2xl mx-auto mt-8 flex flex-col items-center gap-6 py-12 px-8 border border-white/10 rounded-3xl bg-black"
                >
                  <div className="flex items-center gap-3 text-zinc-400">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Neural Engine Active</span>
                  </div>
                  
                  <div className="w-full p-6 border border-white/5 rounded-2xl bg-zinc-950/50">
                    <p className="text-zinc-400 font-mono text-sm leading-relaxed text-left min-h-[120px]">
                      {streamedText || "Initializing deep linguistic analysis... Connecting to Chronos Engine..."}
                      <motion.span 
                        animate={{ opacity: [0, 1, 0] }} 
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="inline-block w-2 h-4 bg-white ml-1 align-middle"
                      />
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {activeTab === "library" && (
          <ExpressionLibrary 
            expressions={expressions} 
            getCefrStyle={getCefrStyle} 
            onDelete={handleDelete} 
            onViewDetail={handleViewDetail} 
          />
        )}

        {activeTab === "study" && <StudySection />}
        {activeTab === "grammar" && <GrammarSection />}
      </div>
    </div>
  );
}
