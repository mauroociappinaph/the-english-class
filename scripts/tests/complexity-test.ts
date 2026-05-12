/**
 * Test file for Advanced Interface Complexity metrics.
 */

// 1. Recursive Interface
interface RecursiveNode {
  id: string;
  next?: RecursiveNode; // Should be detected as recursive
}

// 2. High Union Complexity
type ComplexUnion = string | number | boolean | null | undefined | { id: string } | string[] | number[]; 

// 3. Giant Interface with High Optionality
interface GiantBag {
  prop1?: string;
  prop2?: number;
  prop3?: boolean;
  prop4?: string[];
  prop5?: Record<string, any>;
  prop6?: any;
  prop7?: any;
  prop8?: any;
  prop9?: any;
  prop10?: any;
  prop11?: any;
  prop12?: any;
  prop13?: any;
  prop14?: any;
  prop15?: any;
  prop16?: any;
  prop17?: any;
  prop18?: any;
  prop19?: any;
  prop20?: any;
  prop21?: any; // > 20 props
}

// 4. Deeply Nested
interface DeeplyNested {
  level1: {
    level2: {
      level3: {
        level4: {
          level5: string; // Nesting: 5
        }
      }
    }
  }
}
