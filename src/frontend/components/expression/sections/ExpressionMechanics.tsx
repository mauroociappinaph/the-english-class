"use client";

import { motion } from "framer-motion";
import { Settings2, ListTree } from "lucide-react";
import { MechanicsBlueprint } from "@/frontend/components/mechanics/MechanicsBlueprint";
import { WordFamilyList } from "@/frontend/components/WordFamilyList";
import { ExpressionMechanicsProps, sectionVariants } from "./types";

export function ExpressionMechanics({ phrasalVerbDetails, wordFamilies }: ExpressionMechanicsProps) {
  return (
    <motion.section
      id="mechanics"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      className="space-y-10"
    >
      <div className="flex items-center gap-4">
        <Settings2 size={20} className="text-zinc-600" />
        <h2 className="font-display text-lg font-black uppercase tracking-[0.4em] text-zinc-500">Mechanics</h2>
      </div>

      {phrasalVerbDetails ? (
        <MechanicsBlueprint details={phrasalVerbDetails} />
      ) : (
        <div className="p-12 border border-white/5 rounded-2xl text-center space-y-3">
          <Settings2 size={24} className="text-zinc-800 mx-auto" />
          <p className="text-zinc-600 font-medium">Follows standard grammatical rules.</p>
        </div>
      )}

      {wordFamilies && (
        <div className="pt-16">
          <WordFamilyList families={wordFamilies} />
        </div>
      )}
    </motion.section>
  );
}
