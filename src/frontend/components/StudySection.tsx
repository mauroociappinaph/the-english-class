"use client";

import { motion } from "framer-motion";
import { GraduationCap, Loader2 } from "lucide-react";
import { useState } from "react";
import { useStudyStore } from "@/frontend/store/useStudyStore";
import { getReviewSession } from "@/app/actions";
import { ReviewSession } from "./ReviewSession";

export function StudySection() {
  const { isReviewing, startReview, expressions } = useStudyStore();
  const [isLoading, setIsLoading] = useState(false);

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

  const dueCount = expressions.filter(e => {
    if (!e.nextReviewAt) return true;
    return new Date(e.nextReviewAt) <= new Date();
  }).length;

  return (
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
        <p className="text-zinc-500">
          {dueCount > 0
            ? `Master ${dueCount} expression${dueCount !== 1 ? 's' : ''} today using spaced repetition.`
            : "No expressions due for review. Add more!"}
        </p>
      </div>
      <button 
        onClick={handleStartSession}
        disabled={isLoading || dueCount === 0}
        className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-zinc-200 transition-colors shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Loading...
          </>
        ) : (
          "Start Session"
        )}
      </button>
    </motion.div>
  );
}
