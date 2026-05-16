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
        <Languages size={20} className="text-blue-500/50" />
        <h2 className="font-display text-lg font-black uppercase tracking-[0.4em] text-zinc-500">Core Meaning</h2>
      </div>

      <div className="space-y-8 pl-8 border-l-2 border-blue-500/20">
        <p className="text-4xl md:text-5xl text-white leading-tight font-black tracking-tight">
          {meaning}
        </p>
        {secondaryMeanings && secondaryMeanings.length > 0 && (
          <div className="pt-4">
            <QuotedPillList 
              items={secondaryMeanings} 
              className="px-6 py-2.5 rounded-full border border-white/5 bg-white/[0.02] text-base text-zinc-400 font-medium italic"
            />
          </div>
        )}
      </div>

      {mnemonic && (
        <div className="mt-12 p-10 rounded-[2.5rem] border border-blue-500/10 bg-blue-500/[0.02] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Lightbulb size={120} className="text-blue-500" />
          </div>
          <div className="relative space-y-6">
            <div className="flex items-center gap-3 text-blue-400">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Lightbulb size={16} />
              </div>
              <span className="text-sm font-black uppercase tracking-[0.4em]">Memory Bridge</span>
            </div>
            <p className="text-white text-2xl md:text-3xl font-bold leading-relaxed italic">
              &ldquo;{mnemonic}&rdquo;
            </p>
          </div>
        </div>
      )}
    </motion.section>
  );
}
