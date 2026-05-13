export interface DiagnosticIssue {
  file: string;
  line: number;
  column: number;
  message: string;
  code: number;
  suggestion?: string;
}
