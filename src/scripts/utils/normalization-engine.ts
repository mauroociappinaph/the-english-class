import { Node, SyntaxKind, StructuralTemplate } from '../types/analyzer.types';

export class NormalizationEngine {
  /**
   * Generates a structural representation of a node by:
   * 1. Stripping comments
   * 2. Normalizing identifiers (variable names, parameter names)
   * 3. Removing formatting
   */
  static normalize(node: Node): string {
    const kind = node.getKind();

    // We only care about executable blocks or declarations
    if (Node.isFunctionDeclaration(node) || Node.isArrowFunction(node) || Node.isMethodDeclaration(node) || Node.isBlock(node)) {
      return this.processNode(node);
    }

    return '';
  }

  private static processNode(node: Node): string {
    let structure = '';

    // Traverse children recursively
    node.forEachChild(child => {
      const kind = child.getKindName();

      if (Node.isIdentifier(child)) {
        structure += '_ID_'; // Normalize identifier
      } else if (Node.isStringLiteral(child)) {
        structure += '_STR_'; // Normalize strings
      } else if (Node.isNumericLiteral(child)) {
        structure += '_NUM_'; // Normalize numbers
      } else if (child.getChildCount() === 0) {
        structure += child.getText(); // Keep operators, punctuation
      } else {
        structure += `(${kind}:${this.processNode(child)})`;
      }
    });

    return structure;
  }

  /**
   * Calculate a simple structural hash
   */
  static getStructuralHash(node: Node): string {
    const normalized = this.normalize(node);
    if (!normalized) return '';
    return this.hashString(normalized);
  }

  /**
   * Generates a template with tracked tokens for diffing.
   */
  static getTemplate(node: Node): StructuralTemplate {
    const tokens: { kind: string; value: string; pos: number }[] = [];
    const structure = this.processNodeWithTokens(node, tokens);
    const hash = this.hashString(structure);

    return { hash, structure, tokens };
  }

  private static processNodeWithTokens(node: Node, tokens: { kind: string; value: string; pos: number }[]): string {
    let structure = '';

    node.forEachChild(child => {
      const kind = child.getKindName();

      if (Node.isIdentifier(child) || Node.isStringLiteral(child) || Node.isNumericLiteral(child)) {
        const type = Node.isIdentifier(child) ? '_ID_' : Node.isStringLiteral(child) ? '_STR_' : '_NUM_';
        tokens.push({ kind: type, value: child.getText(), pos: child.getStart() });
        structure += type;
      } else if (child.getChildCount() === 0) {
        structure += child.getText();
      } else {
        structure += `(${kind}:${this.processNodeWithTokens(child, tokens)})`;
      }
    });

    return structure;
  }

  private static hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return hash.toString(36);
  }
}
