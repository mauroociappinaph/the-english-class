import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LiveModuleViewProps } from './types';
import { Info, ChevronRight, Sparkles } from 'lucide-react';
import { TagList } from '../ui/TagList';

export const LiveModuleView: React.FC<LiveModuleViewProps> = ({ module, accentColor }) => {
  return (
    <div className="relative min-h-[280px] w-full p-8 rounded-[2.5rem] bg-zinc-900/40 backdrop-blur-2xl border border-white/10 overflow-hidden shadow-2xl">
      {/* Background Ambient Glow */}
      <div className={`absolute -top-24 -right-24 w-64 h-64 blur-[100px] opacity-20 rounded-full bg-gradient-to-br from-white to-transparent`} />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={module.tense}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.05, y: -10 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                <Sparkles className={`w-4 h-4 ${accentColor}`} />
              </div>
              <h3 className={`text-lg font-black uppercase tracking-[0.2em] ${accentColor}`}>
                {module.tense}
              </h3>
            </div>
            <TagList 
              tags={module.grammarTags || []} 
              variant="glass" 
              tagClassName="text-sm font-mono px-3 py-1 rounded-full border border-white/5"
            />
          </div>

          {/* Large Phrase Preview */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl blur-xl" />
            <p className="text-3xl md:text-4xl font-medium text-white italic leading-tight tracking-tight">
              "{module.example}"
            </p>
          </div>

          {/* Explanation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white/40">
                <Info className="w-3 h-3" />
                <span className="text-sm font-mono uppercase tracking-widest">Pedagogical_Logic</span>
              </div>
              <p className="text-sm text-white/80 leading-relaxed font-light">
                {module.simpleExplanation}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white/40">
                <ChevronRight className="w-3 h-3" />
                <span className="text-sm font-mono uppercase tracking-widest">Technical_Structure</span>
              </div>
              <p className="text-sm text-white/60 leading-relaxed font-mono bg-black/20 p-3 rounded-xl border border-white/5">
                {module.technicalExplanation}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Decorative Metadata */}
      <div className="absolute bottom-4 right-8 opacity-10 font-mono text-sm tracking-[0.4em] uppercase">
        Live_Temporal_Simulation_Active
      </div>
    </div>
  );
};
