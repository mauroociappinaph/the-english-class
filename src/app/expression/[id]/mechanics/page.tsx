"use client";

import { motion } from "framer-motion";
import { Settings2, ListTree } from "lucide-react";
import { useStudyStore } from "@/frontend/store/useStudyStore";
import { MechanicsBlueprint } from "@/frontend/components/mechanics/MechanicsBlueprint";
import { WordFamilyList } from "@/frontend/components/WordFamilyList";

export default function MechanicsPage() {
  const { currentAnalysis } = useStudyStore();

  if (!currentAnalysis) return null;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-32 pb-32">
      {/* Pedagogical Intro */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8 text-center"
      >
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
          <Settings2 size={12} />
          Structural Logic
        </div>
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter gradient-text">
          The Internal Engine
        </h2>
        <p className="text-zinc-400 max-w-2xl mx-auto text-xl leading-relaxed font-medium">
          Understanding how a word is built and how it interacts with its environment is the secret to sounding natural. 
          <span className="text-zinc-200"> Mechanics</span> breaks down the structural rules so you don't just memorize—you understand the logic.
        </p>
      </motion.div>

      {/* Phrasal Mechanics Section */}
      <div className="space-y-12">
        <div className="flex items-center gap-8">
          <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-400">
            <Settings2 size={24} />
          </div>
          <h3 className="text-2xl font-black uppercase tracking-[0.5em] text-white">Phrasal Mechanics</h3>
          <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent" />
        </div>

        {currentAnalysis.phrasalVerbDetails ? (
          <MechanicsBlueprint details={currentAnalysis.phrasalVerbDetails} />
        ) : (
          <div className="p-20 text-center glass rounded-[3rem] border border-white/5 space-y-6">
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center mx-auto">
              <Settings2 size={24} className="text-zinc-700" />
            </div>
            <div className="space-y-2">
              <p className="text-white text-xl font-bold">Standard Structural Logic</p>
              <p className="text-zinc-500 italic max-w-md mx-auto">
                This expression follows standard grammatical rules rather than phrasal verb mechanics. 
                Its usage is determined by its base part of speech.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Word Families Section */}
      <div className="space-y-12">
        <div className="flex items-center gap-8">
          <div className="p-4 bg-purple-500/10 rounded-2xl text-purple-400">
            <ListTree size={24} />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-black uppercase tracking-[0.5em] text-white">Word Families</h3>
            <p className="text-xs font-bold text-purple-500 uppercase tracking-widest">
              The Vocabulary Multiplier: Learn one, get four.
            </p>
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent" />
        </div>

        {currentAnalysis.wordFamilies ? (
          <WordFamilyList families={currentAnalysis.wordFamilies} />
        ) : (
          <div className="p-20 text-center glass rounded-[3rem] border border-white/5">
            <p className="text-zinc-500 italic text-lg">No extended word family data available for this term.</p>
          </div>
        )}
      </div>
    </div>
  );
}
