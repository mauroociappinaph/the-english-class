import * as levenshtein from "fast-levenshtein";
import { SourceFile, Node } from "ts-morph";

export class Suggester {
  /**
   * Find the most similar identifier in the current file or global exports
   */
  static findBestMatch(missingName: string, sourceFile: SourceFile): string | undefined {
    // 1. Get all identifiers in the current file
    const allIdentifiers = new Set<string>();
    
    // We look at all nodes to find variable names, function names, etc.
    sourceFile.forEachDescendant(node => {
      if (Node.isIdentifier(node)) {
        const text = node.getText();
        if (text !== missingName && text.length > 2) {
          allIdentifiers.add(text);
        }
      }
    });

    // 2. Add imported names
    sourceFile.getImportDeclarations().forEach(imp => {
      imp.getNamedImports().forEach(ni => allIdentifiers.add(ni.getName()));
      const defaultImport = imp.getDefaultImport();
      if (defaultImport) allIdentifiers.add(defaultImport.getText());
    });

    const candidates = Array.from(allIdentifiers);
    let bestMatch: string | undefined;
    let minDistance = 4; // Threshold: don't suggest if it's too different

    for (const candidate of candidates) {
      const distance = levenshtein.get(missingName.toLowerCase(), candidate.toLowerCase());
      if (distance < minDistance) {
        minDistance = distance;
        bestMatch = candidate;
      }
    }

    return bestMatch ? `Did you mean '${bestMatch}'?` : undefined;
  }
}
