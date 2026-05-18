import { motion } from "framer-motion";
import { 
  GraduationCap, 
  MessageCircle, 
  Brain, 
  BookOpen,
  Sparkles,
  Zap,
  BarChart3,
  Clock
} from "lucide-react";
import { clsx } from "clsx";
import { HumanContextProps } from "@/frontend/types/word-variant";

export function HumanContext({ variant }: HumanContextProps) {
  const usageCards = [
    { 
      id: "academic", 
      label: "Academic Use", 
      icon: GraduationCap, 
      color: "text-blue-400 bg-blue-500/10",
      active: variant.naturalContexts?.includes("academic") || variant.naturalContexts?.includes("business")
    },
    { 
      id: "casual", 
      label: "Casual Use", 
      icon: MessageCircle, 
      color: "text-emerald-400 bg-emerald-500/10",
      active: variant.naturalContexts?.includes("casual conversation") || variant.naturalContexts?.includes("informal")
    },
    { 
      id: "deep", 
      label: "Deep Learning", 
      icon: Brain, 
      color: "text-purple-400 bg-purple-500/10",
      active: true 
    },
    { 
      id: "self", 
      label: "Self-Study", 
      icon: BookOpen, 
      color: "text-amber-400 bg-amber-500/10",
      active: true 
    },
  ];

  return (
    <div className="space-y-12">
      {/* Human Explanation Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 text-blue-500/60 uppercase tracking-[0.3em] font-black text-[10px]">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          The Human Side
        </div>
        <div className="p-8 md:p-12 rounded-[3rem] bg-white/[0.02] border border-white/5 relative overflow-hidden group">
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] group-hover:bg-blue-500/10 transition-all duration-700" />
          
          <div className="relative z-10 space-y-6">
            <h4 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
              When we say <span className="text-blue-400 italic">"{variant.word}"</span>, we usually mean...
            </h4>
            <p className="text-lg md:text-xl text-zinc-400 leading-relaxed font-medium">
              {variant.simpleExplanation}
            </p>
          </div>
        </div>
      </div>

      {/* Visual Usage Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {usageCards.map((card) => (
          <div 
            key={card.id}
            className={clsx(
              "p-6 rounded-[2rem] border transition-all duration-500 flex flex-col items-center text-center gap-4 group",
              card.active 
                ? "bg-white/[0.03] border-white/10 hover:bg-white/[0.05] hover:border-white/20" 
                : "bg-white/[0.01] border-white/5 opacity-40 grayscale"
            )}
          >
            <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110", card.color)}>
              <card.icon size={24} />
            </div>
            <span className={clsx(
              "text-xs font-black uppercase tracking-widest",
              card.active ? "text-zinc-300" : "text-zinc-600"
            )}>
              {card.label}
            </span>
          </div>
        ))}
      </div>

      {/* Real-life Scenarios / Emotional Context */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-purple-500/60 uppercase tracking-[0.3em] font-black text-[10px]">
            <Sparkles size={14} />
            Real-life Scenarios
          </div>
          <div className="space-y-3">
            {variant.tips?.slice(0, 3).map((tip, i) => (
              <div key={i} className="p-5 rounded-2xl bg-purple-500/[0.02] border border-purple-500/10 flex items-center gap-4 hover:bg-purple-500/[0.05] transition-colors cursor-default">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                  <Zap size={16} />
                </div>
                <p className="text-sm text-zinc-300 font-medium italic">"{tip}"</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3 text-emerald-500/60 uppercase tracking-[0.3em] font-black text-[10px]">
            <BarChart3 size={14} />
            Tone & Frequency
          </div>
          <div className="p-8 rounded-[2.5rem] bg-emerald-500/[0.02] border border-emerald-500/10 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-zinc-500">Frequency Score</span>
              <span className="text-sm font-black text-emerald-400 uppercase tracking-widest">High Flow</span>
            </div>
            <div className="h-2 w-full bg-emerald-500/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "85%" }}
                viewport={{ once: true }}
                className="h-full bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              />
            </div>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-zinc-600" />
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Daily Use: 9/10</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle size={14} className="text-zinc-600" />
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Spoken: Common</span>
              </div>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed italic">
              Native speakers use this word constantly in both academic and daily conversations. It's a foundational pillar of the English language.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
