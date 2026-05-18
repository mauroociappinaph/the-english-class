"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchBar } from "@/frontend/components/SearchBar";
import { useAiStream } from "@/frontend/hooks/useAiStream";
import { useStudyStore } from "@/frontend/store/useStudyStore";
import { useAchievementStore } from "@/frontend/store/useAchievementStore";
import { analyzeExpression, checkAchievements } from "@/app/actions";
import { useRouter } from "next/navigation";
import { AnalysisErrorCard } from "./AnalysisErrorCard";
import { AnalysisLoading } from "./AnalysisLoading";
import { AnalysisError } from "@/shared/types/analysis";

export const AnalysisHero: React.FC = () => {
  const router = useRouter();
  const [input, setInput] = useState("");
  const { isAnalyzing, setAnalyzing, setCurrentAnalysis, addExpression, clearCurrentAnalysis } = useStudyStore();
  const { streamedText, startStream } = useAiStream();
  
  const [errorState, setErrorState] = useState<AnalysisError | null>(null);

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    try {
      setErrorState(null);
      clearCurrentAnalysis();
      setAnalyzing(true);
      startStream(input);
      
      const response = await analyzeExpression(input);
      console.log(`[AnalysisHero] Received response for "${input}":`, response);
      
      // Robust response check
      if (response && typeof response === "object" && "success" in response && response.success === true) {
        const result = response.data;
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
      } else {
        // Handle failure or empty responses
        const rawError = response?.error;
        const errorData: AnalysisError = (rawError && typeof rawError === "object" && Object.keys(rawError).length > 0) 
          ? rawError 
          : {
              code: "UNKNOWN",
              message: !response || Object.keys(response).length === 0 
                ? "The server returned an empty response. This usually indicates a timeout or a crash in the neural engine." 
                : "The server returned a failed state without detailed error metadata.",
              pedagogicalTip: "El motor neuronal devolvió una respuesta vacía. Esto puede pasar si la conexión es inestable o si el servidor está saturado. ¡Probá de nuevo!"
            };
            
        console.error("[AnalysisHero] Analysis Failed. Full Response:", response);
        console.error("[AnalysisHero] Resolved Error Data:", errorData);
        setErrorState(errorData);
      }
    } catch (err) {
      console.error("[AnalysisHero] Catastrophic Error:", err);
      setErrorState({
        code: "UNKNOWN",
        message: err instanceof Error ? err.message : String(err),
        pedagogicalTip: "Algo salió mal de forma inesperada en el motor de análisis. ¿Probamos de nuevo?"
      });
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
          <AnalysisLoading streamedText={streamedText} />
        )}

        {errorState && !isAnalyzing && (
          <AnalysisErrorCard 
            error={errorState} 
            onRetry={() => handleAnalyze()}
            onClear={() => setErrorState(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
