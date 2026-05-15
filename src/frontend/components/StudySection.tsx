"use client";

import { motion } from "framer-motion";
import { GraduationCap, Loader2, BookOpen, Target, Zap } from "lucide-react";
import { useState } from "react";
import { useStudyStore } from "@/frontend/store/useStudyStore";
import { getReviewSession } from "@/app/actions";
import { ReviewSession } from "./ReviewSession";
import { MasteryHeatmap } from "./study/MasteryHeatmap";
import { BadgeGallery } from "./study/BadgeGallery";
import { getAchievements } from "@/app/actions";
import { useAchievementStore } from "@/frontend/store/useAchievementStore";
import { useEffect } from "react";

export function StudySection() {
  const { isReviewing, startReview, expressions } = useStudyStore();
  const { achievements, setAchievements } = useAchievementStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAchievements = async () => {
      const data = await getAchievements();
      setAchievements(data as unknown as import("@/frontend/store/useAchievementStore").Achievement[]);
    };
    fetchAchievements();
  }, [setAchievements]);

  const handleStartSession = async () => {
    setIsLoading(true);
    try {
      const reviewExpressions = await getReviewSession(12);
      if (reviewExpressions.length > 0) {
        startReview(reviewExpressions);
      }
    } catch (err) {
      console.error("Failed to start review session:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isReviewing) {
    return <ReviewSession />;
  }

  const dueExpressions = expressions.filter(e => {
    if (!e.study.nextReviewAt) return true;
    return new Date(e.study.nextReviewAt) <= new Date();
  });
  
  const dueCount = dueExpressions.length;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
        <div className="space-y-2">
          <h2 className="text-4xl font-black tracking-tight">Study Center</h2>
          <p className="text-zinc-500 font-medium">Track your progress and master new expressions through active recall.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl flex items-center gap-2">
            <BookOpen size={14} className="text-blue-400" />
            <span className="text-sm font-bold">{expressions.length} Total</span>
          </div>
          <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/10 rounded-xl flex items-center gap-2">
            <Zap size={14} className="text-emerald-400" />
            <span className="text-sm font-bold text-emerald-400">{dueCount} Due Now</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Progress (Heatmap) */}
        <div className="lg:col-span-2 space-y-12">
          <MasteryHeatmap expressions={expressions} />
          <BadgeGallery unlockedAchievements={achievements} />
        </div>

        {/* Action Card */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center gap-8 shadow-2xl relative overflow-hidden group"
        >
          {/* Decorative background blur */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[80px] rounded-full -mr-16 -mt-16 group-hover:bg-blue-500/30 transition-colors" />
          
          <div className="h-20 w-20 bg-white/10 rounded-3xl flex items-center justify-center mb-4 border border-white/10 group-hover:scale-110 transition-transform duration-500">
             <GraduationCap size={40} className="text-white" />
          </div>
          
          <div className="space-y-3 z-10">
            <h3 className="text-2xl font-black">Daily Challenge</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              {dueCount > 0
                ? `You have ${dueCount} expression${dueCount !== 1 ? 's' : ''} ready to be mastered today.`
                : "Your memory is sharp! All current expressions are up to date."}
            </p>
          </div>

          <button 
            onClick={handleStartSession}
            disabled={isLoading || dueCount === 0}
            className="w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-zinc-200 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 z-10"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Initializing...
              </>
            ) : (
              <>
                <Target size={20} />
                Start Review Session
              </>
            )}
          </button>

          {dueCount === 0 && expressions.length > 0 && (
            <p className="text-sm font-black uppercase tracking-widest text-zinc-500 mt-2">
              Next review scheduled in a few hours
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
