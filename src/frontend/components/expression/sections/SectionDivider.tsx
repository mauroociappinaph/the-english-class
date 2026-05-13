export function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-6 py-4">
      <div className="h-px flex-1 bg-white/5" />
      <span className="text-[9px] font-black uppercase tracking-[0.5em] text-zinc-700">{label}</span>
      <div className="h-px flex-1 bg-white/5" />
    </div>
  );
}
