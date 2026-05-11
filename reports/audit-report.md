# Architecture Audit Report

**Generated At:** 5/11/2026, 6:54:39 PM
**Quality Score:** 82/100

## Summary
- **Total Issues:** 6
- **Critical (High):** 0
- **Warnings (Medium):** 6
- **Suggestions (Low):** 0

### UnusedTypesAnalyzer
| Severity | File | Line | Explanation | Suggestion |
| --- | --- | --- | --- | --- |
| MEDIUM | [routes.d.ts](/Users/mauroociappina/Desktop/TheEnglishClass/.next/types/routes.d.ts) | 17 | Unused TypeAliasDeclaration "ParamsOf" is declared but never used in the project. | Remove the unused typealiasdeclaration or ensure it is correctly imported and used. |

### AnyUsageAnalyzer
| Severity | File | Line | Explanation | Suggestion |
| --- | --- | --- | --- | --- |
| MEDIUM | [page.tsx](/Users/mauroociappina/Desktop/TheEnglishClass/src/app/page.tsx) | 57 | Found usage of "any" in: any... | Replace with "unknown", a generic, or a specific interface. |
| MEDIUM | [telemetry.ts](/Users/mauroociappina/Desktop/TheEnglishClass/src/backend/infrastructure/telemetry.ts) | 9 | Found usage of "any" in: any... | Replace with "unknown", a generic, or a specific interface. |
| MEDIUM | [telemetry.ts](/Users/mauroociappina/Desktop/TheEnglishClass/src/backend/infrastructure/telemetry.ts) | 18 | Found usage of "any" in: any... | Replace with "unknown", a generic, or a specific interface. |
| MEDIUM | [ts-parser.ts](/Users/mauroociappina/Desktop/TheEnglishClass/src/backend/infrastructure/ts-parser.ts) | 31 | Found usage of "any" in: any... | Replace with "unknown", a generic, or a specific interface. |
| MEDIUM | [ts-parser.ts](/Users/mauroociappina/Desktop/TheEnglishClass/src/backend/infrastructure/ts-parser.ts) | 40 | Found usage of "any" in: any... | Replace with "unknown", a generic, or a specific interface. |

