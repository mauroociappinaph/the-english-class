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
        // 1. If we have the data already in the store (from navigation or persistence)
        if (currentAnalysis && currentAnalysis.id === id) {
          console.log(`[ExpressionPage] Data ready in store for ID: ${id}`);
          setIsSyncing(false);
          return;
        }

        setIsSyncing(true);
        setError(null);
        
        console.log(`[ExpressionPage] Fetching data from backend for ID: ${id}`);
        const data = await getExpressionById(id);
        
        if (data) {
          console.log(`[ExpressionPage] Success: Hydrated ${data.text}`);
          setCurrentAnalysis(data);
        } else {
          console.error(`[ExpressionPage] Not Found: ${id}`);
          setError("This expression doesn't exist in our neural archive.");
        }
      } catch (err) {
        console.error("[ExpressionPage] Sync failed:", err);
        setError("Unable to connect to the neural archive. Please verify your link.");
      } finally {
        setIsSyncing(false);
      }
    };

    syncData();
  }, [id, currentAnalysis?.id, setCurrentAnalysis]);

  // Handle hydration delay and sync
  const isDataReady = currentAnalysis && currentAnalysis.id === id && currentAnalysis.metadata && currentAnalysis.linguistics;

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto min-h-[60vh] flex flex-col items-center justify-center gap-6 px-6">
        <div className="p-12 border border-red-500/20 bg-red-500/5 rounded-[3rem] text-center backdrop-blur-xl">
          <p className="text-red-400 font-bold uppercase tracking-[0.4em] text-[10px] mb-4">Neural Link Severed</p>
          <p className="text-zinc-400 max-w-sm mx-auto leading-relaxed">{error}</p>
          <button 
            onClick={() => window.location.href = "/"}
            className="mt-8 px-8 py-3 bg-white text-black rounded-full font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-transform"
          >
            Return to Base
          </button>
        </div>
      </div>
    );
  }

  if (!isDataReady || isSyncing) {
    return (
      <div className="w-full max-w-6xl mx-auto min-h-[60vh] flex flex-col items-center justify-center gap-8">
        <div className="relative">
          <div className="w-24 h-24 bg-blue-500/10 rounded-[2.5rem] border border-blue-500/20 flex items-center justify-center animate-pulse">
            <Loader2 className="animate-spin text-blue-500" size={36} />
          </div>
          <div className="absolute -inset-4 bg-blue-500/10 blur-3xl -z-10 rounded-full" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-white font-black uppercase tracking-[0.5em] text-[10px]">
            {isSyncing ? "Syncing Neural Archive" : "Calibrating Neural Engine"}
          </p>
          <p className="text-zinc-500 text-[10px] uppercase tracking-widest animate-pulse">
            Rebuilding linguistic pathways...
          </p>
        </div>
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
