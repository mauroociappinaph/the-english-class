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
import { ChronologyEngine } from "@/frontend/components/chronology/ChronologyEngine";
import { OnboardingTour } from "@/frontend/components/onboarding/OnboardingTour";
import { Loader2 } from "lucide-react";

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

  if (!currentAnalysis || !currentAnalysis.metadata || !currentAnalysis.linguistics) {
    return (
      <div className="w-full max-w-6xl mx-auto min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <div className="w-20 h-20 bg-white/5 rounded-[2rem] border border-white/5 flex items-center justify-center">
          <Loader2 className="animate-spin text-blue-500" size={32} />
        </div>
        <p className="text-zinc-500 font-black uppercase tracking-[0.3em] text-[10px]">
          Calibrating Linguistic Engine...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-32 pb-40">
      <ExpressionHero 
        expressionId={id} 
        text={currentAnalysis.text}
        translation={currentAnalysis.translation}
        type={currentAnalysis.metadata.type}
        cefr={currentAnalysis.metadata.cefr}
        ipa={currentAnalysis.metadata.ipa}
        formality={currentAnalysis.metadata.formality}
        slangData={currentAnalysis.linguistics.slangData}
      />

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
        <ChronologyEngine data={currentAnalysis.linguistics.chronology} />
      </motion.section>

      <SectionDivider label="scenarios" />
      <ExpressionScenarios 
        examples={currentAnalysis.linguistics.examples} 
        rootText={currentAnalysis.text} 
      />

      <SectionDivider label="mastery" />
      <ExpressionMastery
        usageTips={currentAnalysis.linguistics.usageTips ?? undefined}
        formality={currentAnalysis.metadata.formality ?? "Neutral"}
      />
      
      {/* Educational Onboarding */}
      <OnboardingTour />
    </div>
  );
}
