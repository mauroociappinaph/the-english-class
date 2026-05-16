export function SectionDivider({ label, type = "primary" }: { label: string, type?: "primary" | "secondary" }) {
  if (type === "secondary") {
    return (
      <div className="flex items-center gap-4 py-8 opacity-50">
        <span className="text-[10px] font-black uppercase tracking-[0.6em] text-zinc-500">{label}</span>
        <div className="h-px flex-1 bg-white/5" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-6 py-4">
      <div className="h-px flex-1 bg-white/5" />
      <span className="text-sm font-black uppercase tracking-[0.5em] text-zinc-700">{label}</span>
      <div className="h-px flex-1 bg-white/5" />
    </div>
  );
}
