export function QuotedPill({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={className}>
      &ldquo;{children}&rdquo;
    </span>
  );
}
