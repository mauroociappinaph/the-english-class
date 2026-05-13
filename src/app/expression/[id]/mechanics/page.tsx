"use client";

import { motion } from "framer-motion";
import { Settings2, GitMerge, ListTree, PackageSearch } from "lucide-react";
import { useStudyStore } from "@/frontend/store/useStudyStore";
import { PhrasalVerbDetails } from "@/frontend/components/PhrasalVerbDetails";
import { WordFamilyList } from "@/frontend/components/WordFamilyList";

export default function MechanicsPage() {
  const { currentAnalysis } = useStudyStore();

  if (!currentAnalysis) return null;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-24">
      {/* Pedagogical Intro */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 text-center"
      >
        <h2 className="text-4xl font-bold tracking-tight gradient-text">The Internal Engine</h2>
        <p className="text-zinc-400 max-w-3xl mx-auto text-lg leading-relaxed">
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
          <h3 className="text-xl font-black uppercase tracking-[0.5em] text-white">Phrasal Mechanics</h3>
          <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent" />
        </div>

        {currentAnalysis.phrasalVerbDetails ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="glass p-10 rounded-[3rem] space-y-8">
              <div className="flex items-center gap-4">
                <GitMerge size={20} className="text-zinc-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Core Structure</span>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase text-zinc-600">Verb</p>
                  <p className="text-2xl font-bold text-white">{currentAnalysis.phrasalVerbDetails.verb}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase text-zinc-600">Particle</p>
                  <p className="text-2xl font-bold text-blue-400">{currentAnalysis.phrasalVerbDetails.particle}</p>
                </div>
              </div>
            </div>

            <div className="glass p-10 rounded-[3rem] space-y-8">
              <div className="flex items-center gap-4">
                <ListTree size={20} className="text-zinc-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Syntactic Rules (The Usage Logic)</span>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase text-zinc-600">Transitive</p>
                  <p className="text-xl font-bold text-white">{currentAnalysis.phrasalVerbDetails.transitive ? "Yes" : "No"}</p>
                  <p className="text-[9px] text-zinc-500 uppercase tracking-tighter">Needs an object to make sense</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase text-zinc-600">Separability</p>
                  <p className="text-xl font-bold text-white uppercase tracking-tighter">
                    {currentAnalysis.phrasalVerbDetails.separable === 'mandatory' ? 'Separable (Mandatory)' : 
                     currentAnalysis.phrasalVerbDetails.separable === 'optional' ? 'Separable (Optional)' : 'Inseparable'}
                  </p>
                  <p className="text-[9px] text-zinc-500 uppercase tracking-tighter">Can you put words in the middle?</p>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 glass p-10 rounded-[3rem] space-y-8">
              <div className="flex items-center gap-4">
                <PackageSearch size={20} className="text-zinc-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Common Partners (Collocations)</span>
              </div>
              <div className="flex flex-wrap gap-4">
                {currentAnalysis.phrasalVerbDetails.commonCollocations.map((partner, i) => (
                  <div key={i} className="px-6 py-3 rounded-2xl bg-white/5 border border-white/5 text-zinc-300 font-medium italic">
                    &ldquo;{partner}&rdquo;
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center glass rounded-[3rem] border border-white/5 space-y-4">
            <p className="text-zinc-400 font-medium">Standard Structural Logic</p>
            <p className="text-zinc-500 italic text-sm">This expression follows standard grammatical rules rather than phrasal verb mechanics. Its usage is determined by its base part of speech.</p>
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
            <h3 className="text-xl font-black uppercase tracking-[0.5em] text-white">Word Families</h3>
            <p className="text-[10px] font-bold text-purple-500 uppercase tracking-widest">The Vocabulary Multiplier: Learn one, get four.</p>
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent" />
        </div>

        {currentAnalysis.wordFamilies ? (
          <WordFamilyList families={currentAnalysis.wordFamilies} />
        ) : (
          <div className="p-12 text-center glass rounded-[3rem] border border-white/5">
            <p className="text-zinc-500 italic">No extended word family data available for this term.</p>
          </div>
        )}
      </div>
    </div>
  );
}
