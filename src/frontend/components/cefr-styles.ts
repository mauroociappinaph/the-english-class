export const getCefrStyle = (level: string) => {
  const styles: Record<string, { bg: string; glow: string }> = {
    A1: { bg: "bg-cefr-a1", glow: "var(--cefr-glow-A1)" },
    A2: { bg: "bg-cefr-a2", glow: "var(--cefr-glow-A2)" },
    B1: { bg: "bg-cefr-b1", glow: "var(--cefr-glow-B1)" },
    B2: { bg: "bg-cefr-b2", glow: "var(--cefr-glow-B2)" },
    C1: { bg: "bg-cefr-c1", glow: "var(--cefr-glow-C1)" },
    C2: { bg: "bg-cefr-c2", glow: "var(--cefr-glow-C2)" },
  };
  return styles[level] || { bg: "bg-zinc-500", glow: "255, 255, 255" };
};
