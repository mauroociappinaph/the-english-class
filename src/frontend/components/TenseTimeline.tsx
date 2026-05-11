"use client";

import { motion } from "framer-motion";
import { InteractiveText } from "./InteractiveText";
import { TenseTimelineProps } from "@/frontend/types/components";

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
    const tenseData = data as { text: string; translation: string };
    if (k.includes("past")) categories.past.push({ key, ...tenseData });
    else if (k.includes("future")) categories.future.push({ key, ...tenseData });
    else categories.present.push({ key, ...tenseData });
  });


  return (
    <div className="relative py-20 px-4">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-blue-500/5 blur-[120px] rounded-full opacity-50" />
      
      {/* Main Path Line */}
      <div className="absolute top-1/2 left-0 w-full h-[2px] -translate-y-1/2 overflow-hidden">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
        <motion.div 
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"
        />
      </div>
      
      <div className="flex justify-between items-start relative max-w-5xl mx-auto gap-4">
        {tenseOrder.map((cat) => (
          <div key={cat} className="flex flex-col items-center gap-8 w-1/3 group">
            {/* Morphing Point Container */}
            <div className="relative">
              <motion.div 
                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 bg-blue-500 rounded-full blur-md"
              />
              <motion.div 
                whileHover={{ scale: 1.5 }}
                className="w-4 h-4 rounded-full bg-zinc-900 border-2 border-zinc-700 z-10 relative shadow-2xl group-hover:border-blue-500 transition-colors" 
              />
            </div>
            
            <div className="text-center space-y-6 w-full">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500 group-hover:text-zinc-300 transition-colors">
                {cat}
              </span>
              
              <div className="flex flex-col items-center gap-4">
                {categories[cat].map((tense) => (
                  <motion.div 
                    key={tense.key} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="w-full p-5 rounded-[2rem] glass-deep border border-white/5 hover:border-blue-500/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all cursor-default"
                  >
                    <span className="block text-[8px] font-black text-blue-500/60 uppercase mb-2 tracking-widest text-left">
                      {tense.key.replace(/_/g, ' ')}
                    </span>
                    <InteractiveText 
                      text={tense.text} 
                      translation={tense.translation} 
                      className="text-sm md:text-base text-zinc-100 leading-relaxed font-medium text-left block"
                    />
                  </motion.div>
                ))}
                {categories[cat].length === 0 && (
                  <div className="h-24 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-zinc-800 group-hover:bg-zinc-700 transition-colors" />
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
