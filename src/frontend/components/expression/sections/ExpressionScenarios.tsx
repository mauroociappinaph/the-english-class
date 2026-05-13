"use client";

import { motion } from "framer-motion";
import { Terminal, Share2 } from "lucide-react";
import { InteractiveText } from "@/frontend/components/InteractiveText";
import { Example } from "@/shared/types/expression";

const sectionVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

interface Props {
  examples?: Example[];
}

export function ExpressionScenarios({ examples }: Props) {
  if (!examples || examples.length === 0) return null;

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
        <Terminal size={20} className="text-zinc-600" />
        <h2 className="font-display text-lg font-black uppercase tracking-[0.4em] text-zinc-500">Scenarios</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {examples.map((ex, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col border border-white/5 rounded-2xl p-8 space-y-6 hover:border-white/10 transition-all duration-500"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600">
                {(ex.category ?? "scenario").toUpperCase().replace(/\s+/g, "_")}
              </span>
              <div className="flex gap-2">
                {ex.tone && <span className="px-2 py-0.5 text-[9px] border border-amber-500/30 text-amber-400 rounded font-bold uppercase">{ex.tone}</span>}
                {ex.register && <span className="px-2 py-0.5 text-[9px] border border-emerald-500/30 text-emerald-400 rounded font-bold uppercase">{ex.register}</span>}
              </div>
            </div>

            {/* Example Text */}
            <div className="space-y-3 flex-1">
              <InteractiveText
                text={ex.text}
                translation={ex.translation || ""}
                className="text-xl text-white leading-tight font-bold tracking-tight block"
              />
              {ex.explanation && (
                <p className="text-sm text-zinc-500 leading-relaxed border-l border-white/5 pl-4">
                  {ex.explanation}
                </p>
              )}
            </div>

            {/* Adaptations */}
            {(ex.literalTranslation || ex.subtitleAdaptation) && (
              <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                {ex.literalTranslation && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-zinc-700">
                      <Share2 size={9} />
                      <span className="text-[8px] font-black uppercase tracking-widest">Literal</span>
                    </div>
                    <p className="text-xs text-zinc-500 italic">&ldquo;{ex.literalTranslation}&rdquo;</p>
                  </div>
                )}
                {ex.subtitleAdaptation && (
                  <div className="space-y-1">
                    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-700 block">Subtitle</span>
                    <p className="text-xs text-zinc-400">&ldquo;{ex.subtitleAdaptation}&rdquo;</p>
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
