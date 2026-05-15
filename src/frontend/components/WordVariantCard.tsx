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
        isExpanded ? "bg-white/[0.03] border-white/10" : "bg-white/[0.01] border-white/5 hover:border-white/10"
      )}>
        {/* Progress Line */}
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${category.color.split(' ')[2]} opacity-20`} />

        <div className="p-8">
          <VariantHeader 
            variant={variant} 
            category={category} 
            isExpanded={isExpanded} 
            onToggle={() => setIsExpanded(!isExpanded)} 
          />

          <p className="mt-6 text-zinc-400 text-sm leading-relaxed max-w-[90%]">
            {variant.simpleExplanation}
          </p>

          <div className="mt-6 flex items-center justify-between">
            <TagList 
              tags={variant.naturalContexts || []} 
              limit={2} 
              tagClassName="px-3 py-1 rounded-lg text-sm font-bold uppercase tracking-widest"
            />
            
            {!isExpanded && (
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-6 h-6 rounded-lg bg-zinc-800 border-2 border-zinc-950 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-lg bg-zinc-600" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {isExpanded && (
            <div className="mt-10 pt-10 border-t border-white/5 space-y-12">
              <ExampleSection variant={variant} />
              <AdvancedMechanics variant={variant} />
              <MorphologyPattern variant={variant} />
              <EducationalInsights variant={variant} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
