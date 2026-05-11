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
    <div className="relative py-12 px-4">
      {/* Horizontal Line */}
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-zinc-700 to-transparent -translate-y-1/2" />
      
      <div className="grid grid-cols-3 gap-8 relative">
        {tenseOrder.map((cat) => (
          <div key={cat} className="flex flex-col items-center gap-4">
            {/* Point on the line */}
            <div className="w-4 h-4 rounded-full bg-zinc-900 border-2 border-zinc-500 z-10 shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
            
            <div className="text-center space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                {cat}
              </span>
              
              <div className="space-y-2">
                {categories[cat].map((tense) => (
                  <div key={tense.key} className="glass p-3 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors">
                    <span className="block text-[8px] font-bold text-zinc-600 uppercase mb-1">
                      {tense.key.replace(/_/g, ' ')}
                    </span>
                    <InteractiveText 
                      text={tense.text} 
                      translation={tense.translation} 
                      className="text-xs text-zinc-200"
                    />
                  </div>
                ))}
                {categories[cat].length === 0 && (
                  <div className="h-12 flex items-center justify-center opacity-20">
                    <div className="w-1 h-1 rounded-full bg-zinc-500" />
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
