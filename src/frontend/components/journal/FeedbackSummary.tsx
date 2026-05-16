"use client";

import { motion } from 'framer-motion';
import { FeedbackSummaryProps } from '@/frontend/types/journal';

export function FeedbackSummary({ analysis }: FeedbackSummaryProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8 mt-12"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="CEFR Level" value={analysis.cefrLevel} color="blue" />
        <StatCard label="Vocabulary" value={`${analysis.metrics.vocabulary}%`} color="purple" />
        <StatCard label="Accuracy" value={`${analysis.metrics.grammar}%`} color="green" />
      </div>

      {/* Feedback Section */}
      <div className="glass rounded-3xl p-8 border border-white/10 bg-white/[0.01]">
        <h3 className="text-xl font-bold mb-4 text-zinc-200">Linguistic Insight</h3>
        <p className="text-zinc-400 leading-relaxed italic text-lg">"{analysis.feedback}"</p>
        
        {analysis.suggestedVocab.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {analysis.suggestedVocab.map((vocab, i) => {
              return (
                <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-blue-300">
                  {vocab}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Corrections List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold px-2">Corrections & Explanations</h3>
        {analysis.corrections.map((c, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-6 border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all"
          >
             <div className="flex flex-col md:flex-row items-start gap-4">
                <span className={`px-2 py-1 rounded text-sm font-black uppercase tracking-wider ${getTypeColor(c.type)}`}>
                  {c.type}
                </span>
                <div className="flex-1 space-y-3">
                   <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-red-400/80 line-through text-base decoration-red-500/50">{c.originalText}</span>
                      <span className="text-zinc-600">→</span>
                      <span className="text-green-400 font-bold text-lg">{c.suggestedText}</span>
                   </div>
                   <p className="text-zinc-300 text-sm leading-relaxed">{c.explanation}</p>
                   {c.rule && (
                     <div className="pt-2 border-t border-white/5">
                        <p className="text-zinc-500 text-sm font-medium">RULE: {c.rule}</p>
                     </div>
                   )}
                </div>
             </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function StatCard({ label, value, color }: { label: string, value: string, color: string }) {
  const colors = {
    blue: "text-blue-400 border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]",
    purple: "text-purple-400 border-purple-500/20 shadow-[0_0_20_rgba(168,85,247,0.1)]",
    green: "text-green-400 border-green-500/20 shadow-[0_0_20_rgba(34,197,94,0.1)]"
  };
  return (
    <div className={`glass rounded-2xl p-6 border ${colors[color as keyof typeof colors]} text-center bg-white/[0.01]`}>
      <p className="text-sm font-black uppercase tracking-[0.2em] opacity-50 mb-2">{label}</p>
      <p className="text-4xl font-black">{value}</p>
    </div>
  );
}

function getTypeColor(type: string) {
  switch (type) {
    case 'GRAMMAR': return 'bg-red-500/20 text-red-400';
    case 'VOCABULARY': return 'bg-purple-500/20 text-purple-400';
    case 'STYLE': return 'bg-blue-500/20 text-blue-400';
    case 'SPELLING': return 'bg-orange-500/20 text-orange-400';
    default: return 'bg-zinc-500/20 text-zinc-400';
  }
}
