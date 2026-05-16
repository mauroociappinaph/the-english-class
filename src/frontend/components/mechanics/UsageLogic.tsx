"use client";

import { motion } from "framer-motion";
import { 
  GitMerge, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Info,
  ArrowRightLeft,
  Activity,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { PhrasalVerbDetailsProps } from "../../types/components";
import { clsx } from "clsx";

export function UsageLogic({ details }: PhrasalVerbDetailsProps) {
  const { verb, particle, separable, transitive, transitiveExplanation, separabilityExplanation, validExamples, invalidExamples } = details || {};

  const separableLabels = {
    no: { label: "Inseparable", color: "text-red-400 border-red-500/20 bg-red-500/5", icon: ShieldCheck },
    optional: { label: "Separable (Optional)", color: "text-amber-400 border-amber-500/20 bg-amber-500/5", icon: ArrowRightLeft },
    mandatory: { label: "Separable (Mandatory)", color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5", icon: GitMerge },
  };

  const currentSep = separableLabels[separable] || separableLabels.no;

  const safeExample = (ex: unknown): string => {
    if (typeof ex === 'string') return ex;
    if (ex && typeof ex === 'object') {
      const obj = ex as Record<string, string>;
      return obj.phrase || obj.text || obj.example || "";
    }
    return String(ex ?? "");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Transitivity Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-10 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-8 relative overflow-hidden group"
      >
        <div className="absolute top-0 left-0 w-1 h-24 bg-blue-500/40 rounded-full mt-10" />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Activity size={24} />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500">Transitivity</h4>
              <p className="text-xl font-bold text-white">Object Requirement</p>
            </div>
          </div>
          <div className={clsx(
            "px-4 py-1.5 rounded-full border text-sm font-black uppercase tracking-widest transition-all duration-500",
            transitive ? "bg-blue-500/20 text-blue-400 border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]" : "bg-zinc-900 text-zinc-500 border-zinc-800"
          )}>
            {transitive ? "Detected" : "Negative"}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-zinc-400 text-sm leading-relaxed">
            {transitiveExplanation || (transitive ? "The verb needs an object to complete the meaning of the action." : "The action is self-contained and does not require an external object.")}
          </p>

          {/* Visual Specimen */}
          <div className="p-6 rounded-2xl bg-zinc-950/50 border border-white/5 font-mono text-sm space-y-4">
            <div className="flex items-center gap-2 text-zinc-600">
              <motion.div 
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-blue-500"
              />
              <span className="text-sm font-black tracking-widest uppercase">Sentence Anatomy</span>
            </div>
            
            <div className="flex items-center gap-3 text-lg">
              <span className="text-zinc-500 italic">I</span>
              <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-white font-bold">{verb}</span>
              {transitive && (
                <motion.span 
                  animate={{ scale: [1, 1.05, 1], color: ["#60a5fa", "#93c5fd", "#60a5fa"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="px-4 py-1 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 font-black underline underline-offset-4"
                >
                  [something]
                </motion.span>
              )}
              <span className="px-3 py-1 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 font-bold">{particle}</span>
            </div>

            <p className="text-sm text-zinc-500 leading-relaxed italic border-t border-white/5 pt-4">
              <span className="text-blue-500/60 font-black uppercase tracking-tighter mr-2">Note:</span>
              {transitive ? "A target object is mandatory to stabilize the sentence structure." : "Autonomous operation: No external target required."}
            </p>
          </div>
        </div>

        {/* Comparison Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-2">
            <div className="flex items-center gap-2 text-emerald-500">
              <CheckCircle2 size={12} />
              <span className="text-sm font-black uppercase tracking-widest">Valid Instance</span>
            </div>
            <p className="text-sm text-zinc-300 font-medium leading-relaxed italic">
              {/* Ensure example contains the verb/particle or fallback to template */}
              {(validExamples?.[0] && safeExample(validExamples[0]).toLowerCase().includes(verb.toLowerCase()))
                ? safeExample(validExamples[0])
                : `He ${verb}s ${transitive ? 'it ' : ''}${particle}.`}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 space-y-2">
            <div className="flex items-center gap-2 text-red-500">
              <XCircle size={12} />
              <span className="text-sm font-black uppercase tracking-widest">Invalid Path</span>
            </div>
            <p className="text-sm text-zinc-500 font-medium leading-relaxed italic line-through opacity-60">
              {(invalidExamples?.[0] && safeExample(invalidExamples[0]).toLowerCase().includes(verb.toLowerCase()))
                ? safeExample(invalidExamples[0])
                : `He ${verb}s ${transitive ? '' : 'it '}${particle}.`}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Separability Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="p-10 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-8 relative overflow-hidden group"
      >
        <div className={clsx(
          "absolute top-0 left-0 w-1 h-24 rounded-full mt-10 opacity-40",
          separable === 'no' ? "bg-red-500" : separable === 'optional' ? "bg-amber-500" : "bg-emerald-500"
        )} />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={clsx(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg",
              currentSep.color
            )}>
              <currentSep.icon size={24} />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500">Structure</h4>
              <p className="text-xl font-bold text-white">Separability</p>
            </div>
          </div>
          <div className={clsx(
            "px-4 py-1.5 rounded-full border text-sm font-black uppercase tracking-widest",
            currentSep.color
          )}>
            {currentSep.label}
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-zinc-400 text-sm leading-relaxed">
            {separabilityExplanation || (separable === 'no' ? "The verb and particle must remain together. Moving the object between them is incorrect." : "The object can (or must) be placed between the verb and the particle.")}
          </p>

          {/* Visual Flow Diagram */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 px-4">
              <ArrowRightLeft size={14} className="text-zinc-700" />
              <span className="text-sm font-black uppercase tracking-widest text-zinc-600">Mutation States</span>
            </div>

            <div className="space-y-2">
              <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 relative group/valid">
                <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover/valid:opacity-100 transition-opacity">
                  <CheckCircle2 size={20} className="text-emerald-500/40" />
                </div>
                <div className="flex items-center gap-3 font-mono text-sm">
                  <span className="text-white font-bold">{verb}</span>
                  {separable !== 'no' && <span className="text-emerald-400 font-black">it</span>}
                  <span className="text-zinc-300 font-bold">{particle}</span>
                  {separable === 'no' && <span className="text-emerald-400 font-black">it</span>}
                </div>
                <p className="mt-2 text-sm font-black text-emerald-500/60 uppercase tracking-widest">Valid Syntax</p>
              </div>

              <div className={clsx(
                "p-5 rounded-2xl bg-red-500/5 border border-red-500/10 relative group/invalid transition-all",
                separable === 'mandatory' ? "opacity-100" : "opacity-40"
              )}>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover/invalid:opacity-100 transition-opacity">
                  <AlertCircle size={20} className="text-red-500/40" />
                </div>
                <div className="flex items-center gap-3 font-mono text-sm line-through decoration-red-500/30">
                  <span className="text-zinc-500">{verb}</span>
                  {separable === 'no' && <span className="text-red-400 font-black italic underline">it</span>}
                  <span className="text-zinc-500">{particle}</span>
                  {separable === 'mandatory' && <span className="text-red-400 font-black italic underline">it</span>}
                </div>
                <p className="mt-2 text-sm font-black text-red-500/60 uppercase tracking-widest">
                  {separable === 'mandatory' ? "Object MUST be inside" : "Broken Logic"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-500 shrink-0">
              <Info size={20} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-zinc-300">Why this fails?</p>
              <p className="text-sm text-zinc-500 leading-relaxed italic">
                {separable === 'no' 
                  ? "Inseparable verbs function as a single unit. Think of them as 'welded' together."
                  : "Pronoun objects (like 'it', 'them') almost always go in the middle of separable phrasal verbs."}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
