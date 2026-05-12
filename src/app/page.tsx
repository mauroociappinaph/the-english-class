"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useStudyStore } from "@/frontend/store/useStudyStore";
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
      const result = await analyzeExpression(input.toLowerCase());
      if (result) {
        setCurrentAnalysis(result);
        if (!expressions.find(e => e.id === result.id)) {
          addExpression(result);
        }
        // Navigate to the detail page
        router.push(`/expression/${result.id}`);
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
