# Gobernanza y Calidad: Architectural Sentinel

Para mantener la integridad del sistema a medida que crece, este proyecto cuenta con un motor de auditoría estática personalizado llamado **Architectural Sentinel**.

## 🛡 El Sentinel

El Sentinel (`scripts/`) utiliza **TS-Morph** para analizar el árbol de sintaxis abstracta (AST) de TypeScript y asegurar que se cumplan las "Leyes de Arquitectura" definidas para el proyecto.

### Ejecución
- **Full Audit**: `npm run analyze:types`
- **Watch Mode**: `npm run analyze:watch` (Monitorización en tiempo real con latencia sub-segundo).

---

## 📜 Leyes de Arquitectura (Analyzers)

El sistema hace cumplir las siguientes reglas automáticamente:

### 1. Zero-Any Policy (`any-usage`)
**Innegociable.** El uso de `any` está prohibido. Si una librería externa no está tipada, se debe crear un `.d.ts` o usar `unknown` con type guards.

### 2. Architecture Boundaries (`architecture-boundary`)
Asegura que las capas no se mezclen.
- **Domain** no puede importar de `infrastructure` o `services`.
- **Services** no puede importar de `infrastructure` (debe usar interfaces).

### 3. Cohesión de Interfaces (`giant-interfaces`)
Previene la creación de interfaces "dios" que contienen demasiadas propiedades. Si una interfaz crece demasiado, el Sentinel sugiere dividirla para mantener el principio de Segregación de Interfaces (SOLID).

### 4. Naming Conventions (`naming-convention`)
Fuerza un estilo de nombrado consistente que prioriza el lenguaje del dominio (Ubiquitous Language).

### 5. Seguridad (`security-env-leak` & `security-owasp`)
Escanea el código en busca de fugas de variables de entorno o patrones de código vulnerables (ej. inyecciones básicas).

### 6. Mantenibilidad (`dead-code` & `duplicate-logic`)
Detecta código que no se usa y lógica duplicada que debería ser extraída a utilidades compartidas.

---

## 🛠 Cómo extender el Sentinel

Si querés agregar una nueva regla:
1. Crea un archivo en `scripts/analyzers/` (ej. `my-rule.analyzer.ts`) que extienda de `BaseAnalyzer`.
2. Implementa el método `run(project: Project)`.
3. Registrá el nuevo analyzer en `scripts/analyzers/registry.ts`.
4. El Sentinel lo incluirá automáticamente en el próximo scan.
