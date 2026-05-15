"use client";

import { motion } from "framer-motion";
import { useStudyStore } from "@/frontend/store/useStudyStore";
import { useAchievementStore } from "@/frontend/store/useAchievementStore";
import { getAdaptivePath, checkAchievements } from "@/app/actions";
import { useEffect, useState } from "react";
import { AdaptivePathResponse } from "@/frontend/types/store";
import { Loader2, Sparkles, AlertCircle, ArrowRight, CheckCircle2, TrendingUp } from "lucide-react";

export function SessionSummary() {
  const { sessionErrors, reviewQueue, endReview } = useStudyStore();
  const { addAchievement } = useAchievementStore();
  const [recommendations, setRecommendations] = useState<AdaptivePathResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const total = reviewQueue.length;
  const errorsCount = sessionErrors.length;
  const successCount = total - errorsCount;
  const successRate = Math.round((successCount / total) * 100);

  useEffect(() => {
    async function fetchRecommendations() {
      if (errorsCount > 0) {
        setIsLoading(true);
        try {
          const res = await getAdaptivePath(sessionErrors.map(e => e.id));
          setRecommendations(res);
        } catch (err) {
          console.error("Failed to fetch adaptive path:", err);
        } finally {
          setIsLoading(false);
        }
      }
    }

    async function verifyAchievements() {
      try {
        const newAchievements = await checkAchievements();
        if (newAchievements && newAchievements.length > 0) {
          newAchievements.forEach((a: any) => addAchievement(a as unknown as import("@/frontend/store/useAchievementStore").Achievement));
        }
      } catch (err) {
        console.error("Failed to check achievements:", err);
      }
    }

    fetchRecommendations();
    verifyAchievements();
  }, [errorsCount, sessionErrors, addAchievement]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto space-y-8 pb-20"
    >
      {/* Session Overview Card */}
      <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] -mr-32 -mt-32" />
        
        <div className="flex flex-col items-center text-center gap-6 relative z-10">
          <div className="h-20 w-20 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/20">
            <CheckCircle2 size={40} className="text-emerald-400" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-4xl font-black tracking-tight">Session Complete!</h2>
            <p className="text-zinc-500 font-medium italic">"Every mistake is a step towards mastery."</p>
          </div>

          <div className="grid grid-cols-3 gap-8 w-full mt-4">
            <div className="space-y-1">
              <p className="text-sm font-black uppercase tracking-widest text-zinc-500">Reviewed</p>
              <p className="text-2xl font-black">{total}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-black uppercase tracking-widest text-zinc-500">Mastered</p>
              <p className="text-2xl font-black text-emerald-400">{successCount}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-black uppercase tracking-widest text-zinc-500">Accuracy</p>
              <p className="text-2xl font-black text-blue-400">{successRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Adaptive Learning Path Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-4">
          <Sparkles className="text-purple-400" size={20} />
          <h3 className="text-xl font-black tracking-tight">Adaptive Learning Path</h3>
        </div>

        {errorsCount === 0 ? (
          <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-[2rem] p-8 text-center space-y-4">
             <p className="text-emerald-400 font-bold">Perfect session! No gaps detected in your current path.</p>
             <p className="text-zinc-500 text-sm">Keep this momentum to maintain your proficiency levels.</p>
          </div>
        ) : isLoading ? (
          <div className="bg-white/5 border border-white/5 rounded-[2rem] p-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-purple-500" size={32} />
            <p className="text-sm font-black uppercase tracking-widest text-zinc-500">AI Analyst is designing your remedial path...</p>
          </div>
        ) : recommendations ? (
          <div className="space-y-6">
            {/* Diagnosis */}
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-3xl p-6 flex gap-4">
              <AlertCircle className="text-purple-400 shrink-0" size={20} />
              <div className="space-y-1">
                <p className="text-sm font-black uppercase tracking-widest text-purple-400">Diagnosis</p>
                <p className="text-sm text-zinc-300 leading-relaxed font-medium">{recommendations.diagnosis}</p>
              </div>
            </div>

            {/* Recommendations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.recommendedExpressions?.map((rec, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-sm font-bold rounded-md border border-blue-500/20">
                      {rec.level}
                    </span>
                    <TrendingUp size={14} className="text-zinc-600 group-hover:text-purple-400 transition-colors" />
                  </div>
                  <h4 className="text-lg font-black mb-2 group-hover:text-white transition-colors">{rec.text}</h4>
                  <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2 italic">{rec.reason}</p>
                </motion.div>
              ))}
            </div>

            {/* Action Tip */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-3xl p-6 flex gap-4">
              <TrendingUp className="text-blue-400 shrink-0" size={20} />
              <div className="space-y-1">
                <p className="text-sm font-black uppercase tracking-widest text-blue-400">Learning Strategy</p>
                <p className="text-sm text-zinc-300 leading-relaxed font-medium">{recommendations.learningTip}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-zinc-500 italic">
            Could not generate recommendations at this time.
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <button
        onClick={endReview}
        className="w-full bg-white text-black font-black py-6 rounded-2xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-white/5"
      >
        Continue to Dashboard
        <ArrowRight size={20} />
      </button>
    </motion.div>
  );
}
