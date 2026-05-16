import { Project, Diagnostic } from "ts-morph";
import { DiagnosticIssue } from "./types";
import { Suggester } from "./suggester";

export class DiagnosticEngine {
  static processDiagnostics(project: Project): DiagnosticIssue[] {
    const diagnostics = project.getPreEmitDiagnostics();
    const issues: DiagnosticIssue[] = [];

    for (const diag of diagnostics) {
      const sourceFile = diag.getSourceFile();
      if (!sourceFile || sourceFile.getFilePath().includes("node_modules")) continue;

      const message = diag.getMessageText();
      const messageText = typeof message === "string" ? message : message.getMessageText();
      const code = diag.getCode();
      const start = diag.getStart();
      
      if (start === undefined) continue;

      const lineChar = sourceFile.getLineAndColumnAtPos(start);
      
      let suggestion: string | undefined;

      // Logic for missing names (Code 2304)
      if (code === 2304) {
        const match = messageText.match(/Cannot find name '(.+)'/);
        if (match) {
          suggestion = Suggester.findBestMatch(match[1], sourceFile);
        }
      }

      // Logic for properties (Code 2339)
      if (code === 2339) {
        const match = messageText.match(/Property '(.+)' does not exist on type/);
        if (match) {
          // We could implement deeper property matching here
          suggestion = "Verify the object type definition or check for typos.";
        }
      }

      // Logic for "Did you mean" (Code 2552) - TS already gives us a suggestion
      if (code === 2552) {
         const match = messageText.match(/Did you mean '(.+)'\?/);
         if (match) {
           suggestion = `Try changing it to '${match[1]}'`;
         }
      }

      issues.push({
        file: sourceFile.getFilePath(),
        line: lineChar.line,
        column: lineChar.column,
        message: messageText,
        code: code,
        suggestion: suggestion
      });
    }

    return issues;
  }
}
