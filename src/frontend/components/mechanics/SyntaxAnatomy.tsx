import { Terminal, MoveRight } from "lucide-react";
import { SyntaxAnatomyProps } from "@/frontend/types/components";

export function SyntaxAnatomy({ details }: SyntaxAnatomyProps) {
  const { verb, particle, separable, transitive } = details || {};

  return (
    <div className="space-y-6 p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all relative overflow-hidden group/anatomy">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-white/5 flex items-center justify-center text-blue-400 group-hover/anatomy:border-blue-500/30 transition-colors">
          <Terminal size={24} />
        </div>
        <div>
          <h5 className="text-xl font-black text-white">Syntax Anatomy</h5>
          <p className="text-sm text-zinc-500">Deconstructing the structural relationship</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6 justify-center py-8 px-4 rounded-3xl bg-zinc-950/40 border border-white/5">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Action Base</span>
          <span className="text-2xl font-black text-white bg-white/5 px-6 py-3 rounded-2xl border border-white/10">{verb}</span>
          <span className="text-xs text-blue-400 font-mono">Verb</span>
        </div>

        <MoveRight size={20} className="text-zinc-600 animate-pulse hidden md:block" />

        {transitive && separable !== "no" && (
          <>
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">Target</span>
              <span className="text-2xl font-black text-purple-400 bg-purple-500/5 px-6 py-3 rounded-2xl border border-purple-500/20">Object</span>
              <span className="text-xs text-purple-400/60 font-mono">Direct / Pronoun</span>
            </div>
            <MoveRight size={20} className="text-zinc-600 animate-pulse hidden md:block" />
          </>
        )}

        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Direction / State</span>
          <span className="text-2xl font-black text-blue-400 bg-blue-500/5 px-6 py-3 rounded-2xl border border-blue-500/20">{particle}</span>
          <span className="text-xs text-blue-400/60 font-mono">Particle</span>
        </div>

        {transitive && separable === "no" && (
          <>
            <MoveRight size={20} className="text-zinc-600 animate-pulse hidden md:block" />
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">Target</span>
              <span className="text-2xl font-black text-purple-400 bg-purple-500/5 px-6 py-3 rounded-2xl border border-purple-500/20">Object</span>
              <span className="text-xs text-purple-400/60 font-mono">Direct / Pronoun</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
