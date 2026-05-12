import { Node, SyntaxKind } from 'ts-morph';

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
    
    // Simple hash function for demonstration (in production use crypto)
    let hash = 0;
    for (let i = 0; i < normalized.length; i++) {
      const char = normalized.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0; 
    }
    return hash.toString(36);
  }
}
