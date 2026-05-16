import { QuotedPill } from "./QuotedPill";

export function QuotedPillList({ items, className = "" }: { items: string[]; className?: string }) {
  if (!items || items.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item, idx) => (
        <QuotedPill key={idx} className={className}>
          {item}
        </QuotedPill>
      ))}
    </div>
  );
}
