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

export default function Home() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState<"search" | "library" | "study">("search");
  const { isAnalyzing, setAnalyzing, setCurrentAnalysis, expressions, setExpressions, addExpression, removeExpression } = useStudyStore();
  const { streamedText, startStream } = useAiStream();

  useEffect(() => {
    const fetchLibrary = async () => {
      const library = await getExpressions();
      setExpressions(library);
    };
    fetchLibrary();
  }, [setExpressions]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setAnalyzing(true);
    try {
      // Start visual streaming in parallel to show progress
      startStream(input.toLowerCase(), { type: 'expression' });
      
      const result = await analyzeExpression(input.toLowerCase());
      if (result) {
        setCurrentAnalysis(result);
        if (!expressions.find(e => e.id === result.id)) {
          addExpression(result);
        }
        // Small delay to let the user see the final tokens if the server action was too fast
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
          <SearchBar 
            input={input} 
            setInput={setInput} 
            handleSearch={handleSearch} 
            isAnalyzing={isAnalyzing} 
          />

          <AnimatePresence mode="wait">
            {isAnalyzing && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl flex flex-col items-center gap-6 py-12 px-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl"
              >
                <div className="relative">
                  <div className="h-16 w-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
                  </div>
                </div>
                
                <div className="space-y-2 text-center w-full">
                  <p className="text-blue-400 font-bold tracking-tight uppercase text-xs">AI Analysis in Progress</p>
                  <div className="h-[120px] overflow-hidden relative group">
                    <p className="text-zinc-300 font-mono text-sm leading-relaxed text-left line-clamp-5">
                      {streamedText || "Initializing neural linguistic engine..."}
                    </p>
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
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
    </div>
  );
}
