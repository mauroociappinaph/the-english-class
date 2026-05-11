"use client";

import { motion } from "framer-motion";
import { InteractiveText } from "./InteractiveText";

interface TenseTimelineProps {
  tenses: Record<string, { text: string; translation: string }>;
}

export function TenseTimeline({ tenses }: TenseTimelineProps) {
  const tenseOrder = ["past", "present", "future"];
  
  // Group tenses into the three main categories
  const categories: Record<string, any[]> = {
    past: [],
    present: [],
    future: []
  };

  Object.entries(tenses).forEach(([key, data]) => {
    const k = key.toLowerCase();
    if (k.includes("past")) categories.past.push({ key, ...data });
    else if (k.includes("future")) categories.future.push({ key, ...data });
    else categories.present.push({ key, ...data });
  });

  return (
    <div className="relative py-16 px-4 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-blue-500/5 blur-[100px] rounded-full" />
      
      {/* Horizontal Line with Gradient */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent -translate-y-1/2" />
      
      <div className="flex justify-between items-center relative max-w-5xl mx-auto">
        {tenseOrder.map((cat) => (
          <div key={cat} className="flex flex-col items-center gap-6 w-1/3">
            {/* Morphing Point */}
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-3 h-3 rounded-full bg-zinc-800 border border-zinc-600 z-10 shadow-[0_0_20px_rgba(255,255,255,0.1)]" 
            />
            
            <div className="text-center space-y-4">
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600">
                {cat}
              </span>
              
              <div className="space-y-4 flex flex-col items-center">
                {categories[cat].map((tense) => (
                  <motion.div 
                    key={tense.key} 
                    whileHover={{ scale: 1.05 }}
                    className="p-4 rounded-2xl glass hover:border-blue-500/30 transition-all cursor-default max-w-[200px]"
                  >
                    <span className="block text-[7px] font-black text-zinc-600 uppercase mb-2 tracking-widest">
                      {tense.key.replace(/_/g, ' ')}
                    </span>
                    <InteractiveText 
                      text={tense.text} 
                      translation={tense.translation} 
                      className="text-sm text-zinc-200 leading-tight font-medium"
                    />
                  </motion.div>
                ))}
                {categories[cat].length === 0 && (
                  <div className="h-20 flex items-center justify-center opacity-10">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
