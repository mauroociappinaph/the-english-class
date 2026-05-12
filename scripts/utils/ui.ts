/**
 * UI Utilities for the Architectural Suite.
 * Provides consistent, high-fidelity terminal components.
 */

export const COLORS = {
  RESET: "\x1b[0m",
  BOLD: "\x1b[1m",
  DIM: "\x1b[2m",
  ITALIC: "\x1b[3m",
  UNDERLINE: "\x1b[4m",
  
  // Semantic Colors
  SUCCESS: "\x1b[32m",
  INFO: "\x1b[36m",
  WARN: "\x1b[33m",
  ERROR: "\x1b[31m",
  
  // Shades
  GRAY: "\x1b[90m",
  WHITE: "\x1b[37m",
  MAGENTA: "\x1b[35m",
  CYAN: "\x1b[36m",
};

export class UI {
  /**
   * Draws a professional section banner.
   */
  public static banner(text: string, color: string = COLORS.INFO): void {
    const line = "─".repeat(text.length + 4);
    console.log(`\n${color}${COLORS.BOLD}┌${line}┐${COLORS.RESET}`);
    console.log(`${color}${COLORS.BOLD}│  ${text.toUpperCase()}  │${COLORS.RESET}`);
    console.log(`${color}${COLORS.BOLD}└${line}┘${COLORS.RESET}\n`);
  }

  /**
   * Creates a modern progress/quality bar.
   */
  public static progressBar(value: number, total: number, width: number = 30): string {
    const percentage = Math.min(Math.max(value / total, 0), 1);
    const filledCount = Math.round(percentage * width);
    const emptyCount = width - filledCount;
    
    let color = COLORS.SUCCESS;
    if (percentage < 0.8) color = COLORS.WARN;
    if (percentage < 0.5) color = COLORS.ERROR;

    const filled = `${color}${"█".repeat(filledCount)}${COLORS.RESET}`;
    const empty = `${COLORS.GRAY}${"░".repeat(emptyCount)}${COLORS.RESET}`;
    
    return `[${filled}${empty}] ${color}${Math.round(percentage * 100)}%${COLORS.RESET}`;
  }

  /**
   * Clears the terminal screen (softly).
   */
  public static clear(): void {
    process.stdout.write('\x1Bc');
  }

  /**
   * Formats a duration nicely.
   */
  public static formatDuration(ms: number): string {
    const color = ms > 5000 ? COLORS.WARN : COLORS.GRAY;
    return `${color}${ms}ms${COLORS.RESET}`;
  }
}
