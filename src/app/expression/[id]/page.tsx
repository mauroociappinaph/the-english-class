"use client";

import { useStudyStore } from "@/frontend/store/useStudyStore";
import { useParams } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { VisualGrammarEngine } from "@/frontend/components/VisualGrammarEngine";
import { SectionDivider } from "@/frontend/components/expression/sections/SectionDivider";
import { ExpressionHero } from "@/frontend/components/expression/sections/ExpressionHero";
import { ExpressionMeaning } from "@/frontend/components/expression/sections/ExpressionMeaning";
import { ExpressionMechanics } from "@/frontend/components/expression/sections/ExpressionMechanics";
import { ExpressionScenarios } from "@/frontend/components/expression/sections/ExpressionScenarios";
import { ExpressionMastery } from "@/frontend/components/expression/sections/ExpressionMastery";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function ExpressionPage() {
  const { currentAnalysis } = useStudyStore();
  const params = useParams();
  const id = params.id as string;

  if (!currentAnalysis || !currentAnalysis.metadata || !currentAnalysis.linguistics) return null;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-32 pb-40">
      <ExpressionHero expressionId={id} analysis={currentAnalysis} />

      <SectionDivider label="meaning" />
      <ExpressionMeaning
        meaning={currentAnalysis.meaning}
        secondaryMeanings={currentAnalysis.metadata.secondaryMeanings}
        mnemonic={currentAnalysis.metadata.mnemonic ?? undefined}
      />

      <SectionDivider label="mechanics" />
      <ExpressionMechanics
        phrasalVerbDetails={currentAnalysis.linguistics.phrasalVerbDetails ?? undefined}
        wordFamilies={currentAnalysis.linguistics.wordFamilies ?? undefined}
      />

      <SectionDivider label="chronology" />
      <motion.section
        id="chronology"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        className="space-y-10"
      >
        <div className="flex items-center gap-4">
          <span className="text-zinc-600 text-lg">⏱</span>
          <h2 className="font-display text-lg font-black uppercase tracking-[0.4em] text-zinc-500">Chronology</h2>
        </div>
        <VisualGrammarEngine tenses={currentAnalysis.linguistics.tenses} />
      </motion.section>

      <SectionDivider label="scenarios" />
      <ExpressionScenarios examples={currentAnalysis.linguistics.examples} />

      <SectionDivider label="mastery" />
      <ExpressionMastery
        usageTips={currentAnalysis.linguistics.usageTips ?? undefined}
        formality={currentAnalysis.metadata.formality ?? "Neutral"}
      />
    </div>
  );
}
