"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { SearchBar } from "@/frontend/components/SearchBar";
import { useAiStream } from "@/frontend/hooks/useAiStream";
import { useStudyStore } from "@/frontend/store/useStudyStore";
import { useAchievementStore } from "@/frontend/store/useAchievementStore";
import { analyzeExpression, checkAchievements } from "@/app/actions";
import { useRouter } from "next/navigation";

export const AnalysisHero: React.FC = () => {
  const router = useRouter();
  const [input, setInput] = useState("");
  const { isAnalyzing, setAnalyzing, setCurrentAnalysis, addExpression } = useStudyStore();
  const { streamedText, startStream } = useAiStream();

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      setAnalyzing(true);
      startStream(input);
      
      const result = await analyzeExpression(input);
      if (result) {
        addExpression(result);
        setCurrentAnalysis(result);
        
        // Check for achievements
        const newAch = await checkAchievements();
        if (newAch && newAch.length > 0) {
          const { addAchievement } = useAchievementStore.getState();
          newAch.forEach((a) => addAchievement(a as unknown as import("@/frontend/store/useAchievementStore").Achievement));
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      <div className="text-center space-y-4">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white">
          THE <span className="text-blue-500">ENGLISH</span> CLASS
        </h1>
        <p className="text-zinc-500 text-lg md:text-xl font-medium tracking-tight">
          Master morphology and chronology through neural analysis.
        </p>
      </div>

      <SearchBar 
        input={input}
        setInput={setInput}
        handleSearch={handleAnalyze} 
        isAnalyzing={isAnalyzing} 
      />

      <AnimatePresence mode="wait">
        {isAnalyzing && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="w-full max-w-2xl mx-auto mt-8 flex flex-col items-center gap-6 py-12 px-8 border border-white/10 rounded-[3rem] bg-black relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
            
            <div className="flex items-center gap-3 text-zinc-400">
              <Loader2 size={16} className="animate-spin text-blue-500" />
              <span className="text-xs font-black uppercase tracking-[0.4em]">Smart Analysis Active</span>
            </div>
            
            <div className="w-full p-6 border border-white/5 rounded-2xl bg-zinc-950/50 relative">
              <p className="text-zinc-400 font-mono text-sm leading-relaxed text-left min-h-[120px]">
                {streamedText || "Initializing deep linguistic analysis... Connecting to Chronos Engine..."}
                <motion.span 
                  animate={{ opacity: [0, 1, 0] }} 
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block w-2 h-4 bg-white ml-1 align-middle"
                />
              </p>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex flex-col items-center gap-3 text-center"
            >
              <div className="flex items-center gap-2 text-blue-400">
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Learning Hack</span>
              </div>
              <p className="text-xs text-zinc-500 italic max-w-sm">
                "Did you know? Understanding the <strong>root</strong> of a word multiplies your vocabulary by 4x. We're currently mapping its morphology for you."
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
