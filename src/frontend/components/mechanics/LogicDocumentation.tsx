"use client";

import { motion } from "framer-motion";
import { 
  BookOpen, 
  Terminal, 
  FileCode2,
  Brain,
  ChevronRight,
  ArrowRight,
  Cpu
} from "lucide-react";
import { PhrasalVerbDetailsProps } from "../../types/components";
import { clsx } from "clsx";

export function LogicDocumentation({ details }: PhrasalVerbDetailsProps) {
  const { verb, particle, separable, transitive, transitiveExplanation, separabilityExplanation, logicExplanation } = details || {};

  const safeVal = (v: unknown): string => {
    if (typeof v === 'string') return v;
    if (v && typeof v === 'object') {
      const obj = v as Record<string, string>;
      return obj.phrase || obj.text || obj.explanation || obj.logic || "";
    }
    return String(v ?? "");
  };

  const docs = [
    {
      id: "01",
      title: "Transitividad",
      description: "Define whether the verb requires an object to complete the action logically.",
      techNote: transitive ? "Linguistic Requirement: Object Dependent" : "Linguistic Requirement: Standalone Action",
      details: safeVal(transitiveExplanation) || (transitive ? "Needs an object to close the sense circuit." : "Standalone operation."),
      icon: Cpu,
      color: "text-blue-400 bg-blue-500/10"
    },
    {
      id: "02",
      title: "Separabilidad",
      description: "Determines whether the object can be inserted inside the verbal structure.",
      techNote: `Structure: ${separable?.toUpperCase() || "N/A"}`,
      details: safeVal(separabilityExplanation) || (separable === 'no' ? "Fixed unit." : "Flexible unit."),
      icon: Terminal,
      color: "text-purple-400 bg-purple-500/10"
    }
  ];

  return (
    <div className="relative group/specs p-12 rounded-[3.5rem] bg-blue-500/[0.02] border border-blue-500/10 space-y-12 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute -right-12 -top-12 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl opacity-50 group-hover/specs:bg-blue-500/10 transition-all duration-700" />
      <div className="absolute top-0 right-0 p-8">
        <span className="text-[10px] font-mono text-blue-500/30 uppercase tracking-[0.4em]">Engine v2.1.0</span>
      </div>

      <div className="flex items-center gap-6 text-blue-400 relative">
        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center shadow-lg shadow-blue-500/5">
          <Brain size={28} />
        </div>
        <div>
          <h4 className="text-xs font-black uppercase tracking-[0.4em] text-blue-400/60">Technical Analysis</h4>
          <p className="text-2xl font-black text-white tracking-tight">Logic Documentation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative">
        {docs.map((doc, i) => (
          <div key={doc.id} className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-blue-500 font-black">{doc.id}.</span>
                <h5 className="text-sm font-black uppercase tracking-widest text-white">{doc.title}</h5>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-blue-500/20 to-transparent" />
            </div>

            <div className="space-y-6">
              <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                {doc.description}
              </p>

              <div className="space-y-4">
                {/* Advanced Explanation */}
                <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-6 group/item hover:bg-white/[0.04] transition-all">
                  <div className="flex items-center gap-3">
                    <doc.icon size={16} className={doc.color} />
                    <span className={clsx("text-[9px] font-black uppercase tracking-[0.2em]", doc.color)}>
                      {doc.techNote}
                    </span>
                  </div>
                  
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {doc.details}
                  </p>

                  <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <button 
                      onClick={() => document.getElementById('core-assembly')?.scrollIntoView({ behavior: 'smooth' })}
                      className="text-[10px] font-black text-zinc-600 uppercase tracking-widest hover:text-blue-400 transition-colors flex items-center gap-2"
                    >
                      View Syntax anatomy <ChevronRight size={12} />
                    </button>
                  </div>
                </div>

                {/* Visual Sentence Anatomy Placeholder - Logic based */}
                <div className="px-6 py-4 rounded-2xl bg-zinc-950/50 border border-white/5 flex items-center gap-4 font-mono text-[10px]">
                  <FileCode2 size={14} className="text-zinc-700" />
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500 italic">subject</span>
                    <ArrowRight size={10} className="text-zinc-800" />
                    <span className="text-white font-bold">{verb}</span>
                    <ArrowRight size={10} className="text-zinc-800" />
                    {doc.id === "01" && transitive && <span className="text-blue-400 font-black underline">[object]</span>}
                    {doc.id === "02" && separable !== "no" && <span className="text-purple-400 font-black italic underline">[object]</span>}
                    <ArrowRight size={10} className="text-zinc-800" />
                    <span className="text-emerald-400 font-bold">{particle}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Logic Summary Footer */}
      <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 opacity-60">
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <p className="text-xs font-bold text-zinc-500 tracking-tight">
            Overall System Logic: <span className="text-zinc-300 italic">"{safeVal(logicExplanation) || "Context-dependent structural behavior."}"</span>
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex -space-x-1">
            {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-500/20" />)}
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Pedagogical Engine Active</span>
        </div>
      </div>
    </div>
  );
}
