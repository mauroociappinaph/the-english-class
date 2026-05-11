export interface ParsedDeclaration {
  name: string;
  kind: string;
  startLine: number;
  endLine: number;
  isExported: boolean;
}

export interface ParsedFile {
  filePath: string;
  declarations: ParsedDeclaration[];
  imports: { module: string; named: string[] }[];
}
