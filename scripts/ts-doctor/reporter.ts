import chalk from "chalk";
import path from "path";

export interface DiagnosticIssue {
  file: string;
  line: number;
  column: number;
  message: string;
  code: number;
  suggestion?: string;
}

export class Reporter {
  private static root = process.cwd();

  static printHeader() {
    console.log("\n" + chalk.bgCyan.black.bold(" TS DOCTOR ") + chalk.cyan(" 🩺 Searching for diagnostic issues...\n"));
  }

  static printIssue(issue: DiagnosticIssue) {
    const relativePath = path.relative(this.root, issue.file);
    const location = chalk.gray(`${relativePath}:${issue.line}:${issue.column}`);
    const errorCode = chalk.gray(`(TS${issue.code})`);

    console.log(`${chalk.red.bold("✖")} ${chalk.white.bold(issue.message)} ${errorCode}`);
    console.log(`  ${chalk.gray("└─")} ${location}`);
    
    if (issue.suggestion) {
      console.log(`  ${chalk.cyan.bold("💡 Suggestion:")} ${chalk.cyan(issue.suggestion)}`);
    }
    console.log("");
  }

  static printSummary(total: number, errors: number) {
    const border = chalk.gray("─".repeat(50));
    console.log(border);
    if (errors === 0) {
      console.log(chalk.green.bold(`\n✨ Perfect health! Analyzed ${total} files and found 0 diagnostic errors.\n`));
    } else {
      console.log(chalk.red.bold(`\n🚨 Found ${errors} diagnostic errors in the project.\n`));
    }
    console.log(border + "\n");
  }
}
