import { motion } from "framer-motion";
import { WordVariantCardProps } from "../types/components";
import { useState } from "react";
import { clsx } from "clsx";

// Modularized Components
import { VariantHeader } from "./word-variant/VariantHeader";
import { ExampleSection } from "./word-variant/ExampleSection";
import { AdvancedMechanics } from "./word-variant/AdvancedMechanics";
import { MorphologyPattern } from "./word-variant/MorphologyPattern";
import { EducationalInsights } from "./word-variant/EducationalInsights";
import { HumanContext } from "./word-variant/HumanContext";
import { TagList } from "./ui/TagList";

export function WordVariantCard({ variant, category, index }: WordVariantCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative"
    >
      <div className={clsx(
        "relative overflow-hidden rounded-[2rem] border transition-all duration-500",
        isExpanded ? "bg-white/[0.03] border-white/10 shadow-2xl" : "bg-white/[0.01] border-white/5 hover:border-white/10"
      )}>
        {/* Progress Line */}
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${category.color.split(' ')[2]} opacity-20`} />

        <div className="p-8 md:p-12">
          <VariantHeader 
            variant={variant} 
            category={category} 
            isExpanded={isExpanded} 
            onToggle={() => setIsExpanded(!isExpanded)} 
          />

          {/* Simple Intro - Always visible */}
          {!isExpanded && (
            <div className="mt-8 space-y-6">
              <p className="text-zinc-400 text-lg leading-relaxed max-w-[95%] font-medium">
                {variant.simpleExplanation}
              </p>

              <div className="flex items-center justify-between">
                <TagList 
                  tags={variant.naturalContexts || []} 
                  limit={3} 
                  tagClassName="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white/5 border border-white/10 text-zinc-400"
                />
                
                <button 
                  onClick={() => setIsExpanded(true)}
                  className="text-xs font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  Explore pedagogically <span>→</span>
                </button>
              </div>
            </div>
          )}

          {isExpanded && (
            <div className="mt-12 space-y-20">
              {/* Human Context - The Hero Section of the expansion */}
              <section>
                <HumanContext variant={variant} />
              </section>

              {/* Examples - Visual Sentences */}
              <section className="pt-12 border-t border-white/5">
                <ExampleSection variant={variant} />
              </section>

              {/* Deep Mechanics - Collocations & Synonyms */}
              <section className="pt-12 border-t border-white/5">
                <div className="space-y-12">
                  <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-white/5" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Advanced Mechanics</span>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>
                  <AdvancedMechanics variant={variant} />
                </div>
              </section>

              {/* Morphology & Logic Expansion */}
              <section className="pt-12 border-t border-white/5">
                <MorphologyPattern variant={variant} />
              </section>

              {/* Educational Insights - The Study Hub */}
              <section className="pt-12 border-t border-white/5 p-10 rounded-[3rem] bg-white/[0.01]">
                <EducationalInsights variant={variant} />
              </section>

              <div className="pt-10 border-t border-white/5 flex justify-center">
                <button 
                  onClick={() => setIsExpanded(false)}
                  className="px-8 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-black uppercase tracking-widest text-zinc-500 hover:bg-white/10 hover:text-white transition-all"
                >
                  Collapse Insights
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

