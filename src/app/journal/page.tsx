"use client";

import { useState, useEffect } from 'react';
import { JournalEditor } from '@/frontend/components/journal/JournalEditor';
import { FeedbackSummary } from '@/frontend/components/journal/FeedbackSummary';
import { createJournalEntry, analyzeJournalEntry } from '@/app/actions';
import { LinguisticAnalysis } from "@/shared/types/journal";
import { useAiStream } from '@/frontend/hooks/useAiStream';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Sparkles, Cpu } from 'lucide-react';

const DAILY_PROMPTS = [
  "What was the highlight of your day today?",
  "Describe a place you've always wanted to visit and why.",
  "If you could have dinner with any historical figure, who would it be?",
  "Talk about a book or movie that changed your perspective.",
  "How do you stay motivated when learning something new?"
];

export default function JournalPage() {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<LinguisticAnalysis | null>(null);
  const [prompt, setPrompt] = useState('');
  const { streamedText, startStream } = useAiStream();

  useEffect(() => {
    setPrompt(DAILY_PROMPTS[Math.floor(Math.random() * DAILY_PROMPTS.length)]);
  }, []);

  const handleSave = async () => {
    if (!content.trim()) return;
    setIsSaving(true);
    try {
      await createJournalEntry({ content, mode: 'FREE_WRITING' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    setIsAnalyzing(true);
    try {
      // Start streaming visual progress
      startStream(content, { type: 'journal' });

      // 1. Save first to get ID
      const entry = await createJournalEntry({ content, mode: 'FREE_WRITING' });
      // 2. Analyze
      const result = await analyzeJournalEntry(entry.id);
      if (result && result.metadata) {
        const metadata = result.metadata as Record<string, any>;
        setAnalysis({
          cefrLevel: result.cefrLevel || 'N/A',
          metrics: metadata?.metrics || { grammar: 0, vocabulary: 0, coherence: 0 },
          feedback: metadata?.feedback || '',
          suggestedVocab: metadata?.suggestedVocab || [],
          recurringErrors: (metadata?.recurringErrors as string[]) || [],
          corrections: result.corrections || []
        });
      }
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      // Small delay for UX
      setTimeout(() => setIsAnalyzing(false), 1000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24">
      <header className="space-y-4">
        <div className="flex items-center gap-3 text-blue-400">
          <BookOpen size={20} />
          <span className="text-xs font-black uppercase tracking-[0.3em]">Learning Feature</span>
        </div>
        <h1 className="text-5xl font-black tracking-tight bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent">
          English Writing Journal
        </h1>
        <p className="text-zinc-500 text-lg max-w-2xl">
          Improve your fluency by writing daily. Our AI analyzes your text to provide 
          grammatical corrections and pedagogical insights.
        </p>
      </header>

      {/* Guided Prompt Card */}
      {!analysis && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-8 border border-blue-500/10 bg-blue-500/[0.02] flex flex-col md:flex-row items-center gap-6"
        >
          <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-400">
            <Sparkles size={32} />
          </div>
          <div className="space-y-1 text-center md:text-left">
            <p className="text-xs font-black text-blue-400 uppercase tracking-widest">Daily Prompt</p>
            <p className="text-xl font-medium text-zinc-300 italic">"{prompt}"</p>
          </div>
        </motion.div>
      )}

      <JournalEditor 
        content={content}
        onChange={setContent}
        onSave={handleSave}
        onAnalyze={handleAnalyze}
        isSaving={isSaving}
        isAnalyzing={isAnalyzing}
      />

      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass rounded-3xl p-8 border border-blue-500/20 bg-blue-500/[0.03] space-y-4"
          >
            <div className="flex items-center gap-3 text-blue-400">
              <Cpu size={20} className="animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest">Real-time Linguistic Processing</span>
            </div>
            <div className="font-mono text-sm text-zinc-400 leading-relaxed max-h-[200px] overflow-y-auto custom-scrollbar">
              {streamedText || "Initializing deep analysis engine..."}
              <motion.span 
                animate={{ opacity: [0, 1] }} 
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-2 h-4 ml-1 bg-blue-500 align-middle"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <FeedbackSummary analysis={analysis} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
