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

import { useEffect, useState } from "react";
import { getExpressionById } from "@/app/actions";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function ExpressionPage() {
  const { currentAnalysis, setCurrentAnalysis } = useStudyStore();
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    const syncData = async () => {
      try {
        setIsSyncing(true);
        setError(null);
        
        console.log(`[ExpressionPage] Syncing data for ID: ${id}`);
        
        // 1. Try local store first
        if (currentAnalysis && currentAnalysis.id === id) {
          console.log(`[ExpressionPage] Using current analysis from store`);
          setIsSyncing(false);
          return;
        }

        // 2. Fetch from backend
        const data = await getExpressionById(id);
        
        if (data) {
          console.log(`[ExpressionPage] Data fetched from backend: ${data.text}`);
          setCurrentAnalysis(data);
        } else {
          console.error(`[ExpressionPage] Expression not found for ID: ${id}`);
          setError("Expression not found in archive.");
        }
      } catch (err) {
        console.error("[ExpressionPage] Sync error:", err);
        setError("Failed to load expression data. Please try again.");
      } finally {
        setIsSyncing(false);
      }
    };

    syncData();
  }, [id, currentAnalysis?.id, setCurrentAnalysis]);

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <div className="p-8 border border-red-500/20 bg-red-500/5 rounded-[2rem] text-center">
          <p className="text-red-400 font-bold uppercase tracking-widest text-xs mb-2">Sync Error</p>
          <p className="text-zinc-400">{error}</p>
        </div>
      </div>
    );
  }

  if (isSyncing || !currentAnalysis || !currentAnalysis.metadata || !currentAnalysis.linguistics || currentAnalysis.id !== id) {
    return (
      <div className="w-full max-w-6xl mx-auto min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <div className="w-20 h-20 bg-white/5 rounded-[2rem] border border-white/5 flex items-center justify-center">
          <Loader2 className="animate-spin text-blue-500" size={32} />
        </div>
        <p className="text-zinc-500 font-black uppercase tracking-[0.3em] text-[10px]">
          {isSyncing ? "Syncing with Archive..." : "Calibrating Linguistic Engine..."}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-32 pb-40">
      {/* Primary Zone: Core Meaning */}
      <div className="space-y-12">
        <ExpressionHero 
          expressionId={id} 
          text={currentAnalysis.text}
          translation={currentAnalysis.translation}
          type={currentAnalysis.metadata.type}
          cefr={currentAnalysis.metadata.cefr}
          ipa={currentAnalysis.metadata.ipa}
          formality={currentAnalysis.metadata.formality}
          slangData={currentAnalysis.linguistics.slangData}
          correction={currentAnalysis.metadata.correction}
        />

        <ExpressionMeaning
          meaning={currentAnalysis.meaning}
          secondaryMeanings={currentAnalysis.metadata.secondaryMeanings}
          mnemonic={currentAnalysis.metadata.mnemonic ?? undefined}
        />
      </div>

      {/* Technical Zone: Linguistic Blueprint */}
      <div className="relative">
        <div className="absolute inset-x-0 -inset-y-12 bg-white/[0.01] border-y border-white/5 pointer-events-none" />
        <div className="relative space-y-32">
          <div>
            <SectionDivider label="mechanics" type="secondary" />
            <ExpressionMechanics
              phrasalVerbDetails={currentAnalysis.linguistics.phrasalVerbDetails ?? undefined}
              wordFamilies={currentAnalysis.linguistics.wordFamilies ?? undefined}
            />
          </div>

          <div>
            <SectionDivider label="chronology" type="secondary" />
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
          </div>
        </div>
      </div>

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
