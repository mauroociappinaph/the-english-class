"use client";

import { motion } from "framer-motion";
import { Terminal, Share2 } from "lucide-react";
import { InteractiveText } from "@/frontend/components/InteractiveText";
import { ExpressionScenariosProps, sectionVariants } from "./types";

export function ExpressionScenarios({ examples, rootText }: ExpressionScenariosProps) {
  if (!examples || examples.length === 0) return null;

  // Data Consistency Fix: Ensure examples actually relate to the root expression.
  // We split the rootText into words and check if at least the main parts are present.
  const rootWords = rootText.toLowerCase().split(' ').filter(w => w.length > 2);
  
  const filteredExamples = examples.filter(ex => {
    const text = ex.text.toLowerCase();
    // If the root is a single word, it must be present.
    // If it's a phrase (like a phrasal verb), we check if at least one significant part is present.
    return rootWords.some(word => text.includes(word));
  });

  // Fallback to all examples if filtering is too aggressive, but warn in console
  const finalExamples = filteredExamples.length > 0 ? filteredExamples : examples;

  return (
    <motion.section
      id="scenarios"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      className="space-y-10"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500">
          <Terminal size={20} />
        </div>
        <div>
          <h2 className="font-display text-lg font-black uppercase tracking-[0.4em] text-zinc-500 leading-none">Scenarios</h2>
          <p className="text-[10px] font-bold text-zinc-600 uppercase mt-1">Contextual Implementation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {finalExamples.map((ex, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col border border-white/5 rounded-2xl p-8 space-y-6 hover:border-white/10 bg-white/[0.01] transition-all duration-500 group/card"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 group-hover/card:text-blue-400 transition-colors">
                {(ex.category ?? "scenario").toUpperCase().replace(/\s+/g, "_")}
              </span>
              <div className="flex gap-2">
                {ex.tone && <span className="px-2 py-0.5 text-[10px] border border-amber-500/30 text-amber-400 rounded-lg font-black uppercase tracking-tighter">{ex.tone}</span>}
                {ex.register && <span className="px-2 py-0.5 text-[10px] border border-emerald-500/30 text-emerald-400 rounded-lg font-black uppercase tracking-tighter">{ex.register}</span>}
              </div>
            </div>

            {/* Example Text */}
            <div className="space-y-4 flex-1">
              <InteractiveText
                text={ex.text}
                translation={ex.translation || ""}
                className="text-2xl text-white leading-tight font-black tracking-tight block italic"
              />
              {ex.explanation && (
                <p className="text-sm text-zinc-500 leading-relaxed border-l-2 border-white/5 pl-4 group-hover/card:border-blue-500/20 transition-colors">
                  {ex.explanation}
                </p>
              )}
            </div>

            {/* Adaptations */}
            {(ex.literalTranslation || ex.subtitleAdaptation) && (
              <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-6">
                {ex.literalTranslation && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-zinc-600">
                      <Share2 size={10} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Literal</span>
                    </div>
                    <p className="text-sm text-zinc-500 italic leading-relaxed">&ldquo;{ex.literalTranslation}&rdquo;</p>
                  </div>
                )}
                {ex.subtitleAdaptation && (
                  <div className="space-y-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 block">Subtitle Adaptation</span>
                    <p className="text-sm text-zinc-400 font-medium leading-relaxed">&ldquo;{ex.subtitleAdaptation}&rdquo;</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
