"use client";

import Link from "next/link";
import { Languages, Settings2, ListTree, GraduationCap, Sparkles, Terminal, Share2, Lightbulb } from "lucide-react";
import { useStudyStore } from "@/frontend/store/useStudyStore";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { SimilarWords } from "@/frontend/components/expression/SimilarWords";
import { MechanicsBlueprint } from "@/frontend/components/mechanics/MechanicsBlueprint";
import { WordFamilyList } from "@/frontend/components/WordFamilyList";
import { InteractiveText } from "@/frontend/components/InteractiveText";
import { TenseTimeline } from "@/frontend/components/TenseTimeline";
import { getCefrStyle } from "@/frontend/components/cefr-styles";
import { Example } from "@/shared/types/expression";

const FORMALITY_BADGE: Record<string, { border: string; text: string }> = {
  formal: { border: "border-blue-500/30", text: "text-blue-300" },
  neutral: { border: "border-zinc-700", text: "text-zinc-400" },
  informal: { border: "border-amber-500/30", text: "text-amber-300" },
  slang: { border: "border-purple-500/30", text: "text-purple-300" },
  offensive: { border: "border-red-500/30", text: "text-red-400" },
  "old-fashioned": { border: "border-stone-500/30", text: "text-stone-400" },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-6 py-4">
      <div className="h-px flex-1 bg-white/5" />
      <span className="text-[9px] font-black uppercase tracking-[0.5em] text-zinc-700">{label}</span>
      <div className="h-px flex-1 bg-white/5" />
    </div>
  );
}

export default function ExpressionPage() {
  const { currentAnalysis } = useStudyStore();
  const params = useParams();
  const id = params.id as string;

  if (!currentAnalysis || !currentAnalysis.metadata || !currentAnalysis.linguistics) return null;

  const slangData = currentAnalysis?.linguistics?.slangData;
  const topVariant = slangData?.regionalVariants?.[0] ?? null;
  const formalityKey = (currentAnalysis?.metadata?.formality ?? "neutral").toLowerCase();
  const formalityStyle = FORMALITY_BADGE[formalityKey] ?? FORMALITY_BADGE.neutral;
  const cefrStyle = getCefrStyle(currentAnalysis.metadata.cefr);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-32 pb-40">

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <motion.section
        id="hero"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="text-center space-y-8 pt-8"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.6em] text-zinc-600 block">
          {currentAnalysis.metadata.type}
        </span>

        <h1 className="font-display text-8xl md:text-[10rem] font-black tracking-tighter text-white leading-none">
          {currentAnalysis.text}
        </h1>

        <div className="flex items-center justify-center gap-6 flex-wrap">
          <p className="text-zinc-500 italic font-mono text-xl">{currentAnalysis.metadata.ipa}</p>
          <div className={`px-4 py-1.5 rounded-full border ${cefrStyle.bg} text-white text-xs font-black uppercase tracking-widest`}>
            {currentAnalysis.metadata.cefr}
          </div>
          {topVariant && (
            <div className="flex items-center gap-2 text-sm text-zinc-500 font-bold">
              <span className="text-base">{topVariant.flag}</span>
              {topVariant.region}
            </div>
          )}
        </div>

        {/* Badges strip */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${formalityStyle.border} ${formalityStyle.text}`}>
            {currentAnalysis.metadata.formality ?? "Neutral"}
          </span>
          {slangData?.isSlang && (
            <span className="px-3 py-1 rounded-full border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
              Slang · Level {slangData.detectedSlangLevel}/3
            </span>
          )}
          {slangData?.regionalVariants?.length > 0 && (
            <Link
              href={`/expression/${id}/slang`}
              className="px-3 py-1 rounded-full border border-white/10 text-zinc-400 text-xs font-semibold hover:text-white hover:border-white/30 transition-all"
            >
              🌍 {slangData.regionalVariants.length} regional variants →
            </Link>
          )}
          <SimilarWords words={slangData?.similarWords} limit={3} />
        </div>
      </motion.section>

      <SectionDivider label="meaning" />

      {/* ─── MEANING ──────────────────────────────────────────── */}
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
            {currentAnalysis.meaning}
          </p>
          {currentAnalysis.metadata.secondaryMeanings?.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {currentAnalysis.metadata.secondaryMeanings.map((m: string, i: number) => (
                <span key={i} className="px-4 py-1.5 rounded-full border border-white/5 text-sm text-zinc-500 font-medium italic">
                  &ldquo;{m}&rdquo;
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Mnemonic */}
        {currentAnalysis.metadata.mnemonic && (
          <div className="mt-8 p-8 rounded-2xl border border-white/5 bg-white/[0.02] space-y-4">
            <div className="flex items-center gap-2 text-zinc-600">
              <Lightbulb size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Memory Trick</span>
            </div>
            <p className="text-zinc-300 text-xl font-medium leading-relaxed italic">
              &ldquo;{currentAnalysis.metadata.mnemonic}&rdquo;
            </p>
          </div>
        )}
      </motion.section>

      <SectionDivider label="mechanics" />

      {/* ─── MECHANICS ────────────────────────────────────────── */}
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

        {currentAnalysis.linguistics.phrasalVerbDetails ? (
          <MechanicsBlueprint details={currentAnalysis.linguistics.phrasalVerbDetails} />
        ) : (
          <div className="p-12 border border-white/5 rounded-2xl text-center space-y-3">
            <Settings2 size={24} className="text-zinc-800 mx-auto" />
            <p className="text-zinc-600 font-medium">Follows standard grammatical rules.</p>
          </div>
        )}

        {currentAnalysis.linguistics.wordFamilies && (
          <div className="space-y-8 pt-8">
            <div className="flex items-center gap-4">
              <ListTree size={16} className="text-zinc-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Word Families — Learn one, get four</span>
            </div>
            <WordFamilyList families={currentAnalysis.linguistics.wordFamilies} />
          </div>
        )}
      </motion.section>

      <SectionDivider label="chronology" />

      {/* ─── CHRONOLOGY (Timeline) ───────────────────────────── */}
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
        <TenseTimeline expression={currentAnalysis} />
      </motion.section>

      <SectionDivider label="scenarios" />

      {/* ─── SCENARIOS ────────────────────────────────────────── */}
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
          {currentAnalysis.linguistics.examples?.map((ex: Example, i: number) => (
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

      <SectionDivider label="mastery" />

      {/* ─── MASTERY ──────────────────────────────────────────── */}
      <motion.section
        id="mastery"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        className="space-y-10"
      >
        <div className="flex items-center gap-4">
          <GraduationCap size={20} className="text-zinc-600" />
          <h2 className="font-display text-lg font-black uppercase tracking-[0.4em] text-zinc-500">Mastery</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Naturalness */}
          {currentAnalysis.linguistics.usageTips?.naturalness && (
            <div className="space-y-4 border border-white/5 rounded-2xl p-8">
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600 block">Naturalness</span>
              <p className="text-white text-2xl leading-relaxed font-medium">
                {currentAnalysis.linguistics.usageTips.naturalness}
              </p>
            </div>
          )}

          {/* Common Mistake */}
          {currentAnalysis.linguistics.usageTips?.commonMistake && (
            <div className="space-y-4 border border-red-500/10 rounded-2xl p-8">
              <div className="flex items-center gap-2 text-red-400">
                <Sparkles size={14} />
                <span className="text-[9px] font-black uppercase tracking-[0.4em]">Common Pitfall</span>
              </div>
              <p className="text-zinc-400 text-xl leading-relaxed italic">
                &ldquo;{currentAnalysis.linguistics.usageTips.commonMistake}&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* Formality + Frequency */}
        <div className="flex flex-wrap gap-12 pt-4">
          <div className="space-y-2">
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600 block">Formality</span>
            <p className="font-display text-4xl font-black uppercase tracking-tighter text-white">{currentAnalysis.metadata.formality}</p>
          </div>
          <div className="space-y-4">
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600 block">Frequency</span>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`h-2 w-10 rounded-full transition-all duration-700 ${i <= 4 ? "bg-white" : "bg-zinc-800"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.section>

    </div>
  );
}
