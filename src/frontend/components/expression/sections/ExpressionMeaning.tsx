"use client";

import { motion } from "framer-motion";
import { ExpressionMeaningProps, sectionVariants } from "./types";
import { QuotedPillList } from "@/frontend/components/ui/QuotedPillList";
import { Languages, Lightbulb } from "lucide-react";

export function ExpressionMeaning({ meaning, secondaryMeanings, mnemonic }: ExpressionMeaningProps) {
  return (
    <motion.section
      id="meaning"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      className="space-y-10"
    >
      <div className="flex items-center gap-4">
        <Languages size={20} className="text-zinc-600" />
        <h2 className="font-display text-lg font-black uppercase tracking-[0.4em] text-zinc-500">Meaning</h2>
      </div>

      <div className="space-y-8 pl-4 border-l border-white/5">
        <p className="text-3xl md:text-4xl text-white leading-relaxed font-medium">
          {meaning}
        </p>
        {secondaryMeanings && secondaryMeanings.length > 0 && (
          <QuotedPillList 
            items={secondaryMeanings} 
            className="px-4 py-1.5 rounded-full border border-white/5 text-sm text-zinc-500 font-medium italic"
          />
        )}
      </div>

      {mnemonic && (
        <div className="mt-8 p-8 rounded-2xl border border-white/5 bg-white/[0.02] space-y-4">
          <div className="flex items-center gap-2 text-zinc-600">
            <Lightbulb size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Memory Trick</span>
          </div>
          <p className="text-zinc-300 text-xl font-medium leading-relaxed italic">
            &ldquo;{mnemonic}&rdquo;
          </p>
        </div>
      )}
    </motion.section>
  );
}
