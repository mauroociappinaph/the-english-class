import { SlangLevel } from "@/shared/types/expression";

export function SlangLevelBar({ level }: { level: SlangLevel }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-sm font-bold uppercase tracking-widest text-zinc-500">Slang</span>
      <div className="flex gap-0.5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1.5 w-4 rounded-full transition-all ${
              i < level
                ? "bg-purple-400"
                : i === level && level > 0
                ? "bg-purple-400/50"
                : "bg-zinc-700"
            }`}
          />
        ))}
      </div>
      {level === 0 && <span className="text-sm text-zinc-600">Standard</span>}
      {level === 1 && <span className="text-sm text-amber-400">Mild</span>}
      {level === 2 && <span className="text-sm text-orange-400">Heavy</span>}
      {level === 3 && <span className="text-sm text-red-400">Very heavy</span>}
    </div>
  );
}
