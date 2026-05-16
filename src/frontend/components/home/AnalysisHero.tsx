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
import { useEffect } from "react";
import { AnalysisErrorCard } from "./AnalysisErrorCard";
import { AnalysisError } from "@/shared/types/analysis";

const ANALYSIS_STEPS = [
  { id: "neural", label: "Neural Engine Warmup", detail: "Initializing language model and context buffers..." },
  { id: "morph", label: "Morphological Mapping", detail: "Analyzing word roots, families and phrasal structures..." },
  { id: "chronos", label: "Temporal Sync", detail: "Synchronizing Chronos Engine for tense and timeline mapping..." },
  { id: "cefr", label: "CEFR Calibration", detail: "Finalizing metadata and level proficiency metrics..." },
];

const LEARNING_HACKS = [
  "Did you know? Understanding the root of a word multiplies your vocabulary by 4x.",
  "Phrasal verbs aren't just words; they are 'lego' blocks of English communication.",
  "Visualizing tenses on a timeline reduces cognitive friction by 30% compared to rules.",
  "Context is king: the same word can change meaning entirely based on its neighbor.",
];

export const AnalysisHero: React.FC = () => {
  const router = useRouter();
  const [input, setInput] = useState("");
  const { isAnalyzing, setAnalyzing, setCurrentAnalysis, addExpression, clearCurrentAnalysis } = useStudyStore();
  const { streamedText, startStream } = useAiStream();
  
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [activeTip, setActiveTip] = useState(0);
  const [errorState, setErrorState] = useState<AnalysisError | null>(null);

  // Progress Simulation Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnalyzing) {
      setProgress(0);
      setActiveStep(0);
      setActiveTip(0);

      interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + (100 / 23) * 0.5; // Roughly 23s total
          if (next >= 100) return 99;
          
          if (next > 75) setActiveStep(3);
          else if (next > 50) setActiveStep(2);
          else if (next > 25) setActiveStep(1);
          
          return next;
        });
      }, 500);

      const tipInterval = setInterval(() => {
        setActiveTip((prev) => (prev + 1) % LEARNING_HACKS.length);
      }, 5500);

      return () => {
        clearInterval(interval);
        clearInterval(tipInterval);
      };
    }
  }, [isAnalyzing]);

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
      if (response && typeof response === 'object' && 'success' in response && response.success === true) {
        const result = response.data;
        addExpression(result);
        setCurrentAnalysis(result);
        
        // Check for achievements
        const newAch = await checkAchievements();
        if (newAch && newAch.length > 0) {
          const { addAchievement } = useAchievementStore.getState();
          newAch.forEach((a) => addAchievement(a as unknown as import("@/frontend/types/achievements").Achievement));
        }

        setTimeout(() => {
          router.push(`/expression/${result.id}`);
        }, 800);
      } else {
        // Handle failure or empty responses
        const rawError = (response && typeof response === 'object' && 'error' in response) ? response.error : null;
        const errorData: AnalysisError = (rawError && typeof rawError === 'object' && Object.keys(rawError).length > 0) 
          ? rawError as AnalysisError
          : {
              code: "UNKNOWN",
              message: (!response || Object.keys(response).length === 0) 
                ? "The neural engine returned an empty sync state. This usually happens during high-load periods or provider timeouts." 
                : "The server returned a failed state without detailed error metadata.",
              pedagogicalTip: "La conexión con el motor neuronal fue interrumpida. ¡Probá una vez más, que ya casi lo tenemos!"
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
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="w-full max-w-2xl mx-auto mt-8 flex flex-col items-center gap-6 py-12 px-8 border border-white/10 rounded-[3rem] bg-black relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
            
            <div className="absolute inset-0 bg-blue-500/5 animate-pulse" />
            
            <div className="w-full flex flex-col items-center gap-4 relative z-10">
              <div className="flex items-center gap-3 text-blue-400">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-sm font-black uppercase tracking-[0.4em]">Neural Processing in Progress</span>
              </div>

              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>
              <div className="flex justify-between w-full px-1">
                <span className="text-sm font-mono text-zinc-600">SYST_INIT</span>
                <span className="text-sm font-mono text-blue-500 font-bold">{Math.round(progress)}%</span>
                <span className="text-sm font-mono text-zinc-600">LANG_SYNC</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full relative z-10">
              {ANALYSIS_STEPS.map((step, idx) => (
                <div 
                  key={step.id}
                  className={`p-4 rounded-2xl border transition-all duration-500 ${
                    idx <= activeStep 
                      ? "border-blue-500/30 bg-blue-500/5" 
                      : "border-white/5 bg-zinc-950/30 opacity-40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      idx < activeStep ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" : 
                      idx === activeStep ? "bg-blue-400 animate-pulse" : "bg-zinc-800"
                    }`} />
                    <span className={`text-sm font-bold uppercase tracking-wider ${
                      idx <= activeStep ? "text-blue-100" : "text-zinc-600"
                    }`}>
                      {step.label}
                    </span>
                  </div>
                  {idx === activeStep && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-zinc-500 mt-2 font-mono leading-tight"
                    >
                      {step.detail}
                    </motion.p>
                  )}
                </div>
              ))}
            </div>
            
            <div className="w-full p-6 border border-white/5 rounded-2xl bg-zinc-950/50 relative z-10">
              <p className="text-zinc-400 font-mono text-sm leading-relaxed text-left min-h-[60px]">
                {streamedText || "Initializing deep linguistic analysis..."}
                <motion.span 
                  animate={{ opacity: [0, 1, 0] }} 
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block w-1.5 h-3 bg-white ml-1 align-middle"
                />
              </p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTip}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center gap-2 text-center relative z-10"
              >
                <div className="flex items-center gap-2 text-blue-500/80">
                  <span className="text-sm font-black uppercase tracking-[0.3em]">Neural Insight #{activeTip + 1}</span>
                </div>
                <p className="text-sm text-zinc-400 italic max-w-sm px-4">
                  "{LEARNING_HACKS[activeTip]}"
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
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
