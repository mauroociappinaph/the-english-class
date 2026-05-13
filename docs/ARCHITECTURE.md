# Arquitectura de The English Class

Este proyecto sigue los principios de **Clean Architecture** (Arquitectura Hexagonal), con una separación estricta entre la lógica de negocio, los casos de uso y los detalles de infraestructura.

## 🏗 Capas del Sistema

### 1. Domain (`src/backend/domain`)
La capa más interna. Contiene las reglas de negocio puras, interfaces de repositorios y tipos de datos que definen el corazón del sistema.
- **Pureza**: No depende de ninguna librería externa (excepto utilidades de tipos compartidas).
- **Contenido**: Entidades (`Expression`), interfaces de repositorios y errores de dominio.

### 2. Services / Use Cases (`src/backend/services`)
Orquestan el flujo de datos desde y hacia las entidades. 
- **Responsabilidad**: Implementar los casos de uso (ej. "Analizar una expresión", "Guardar progreso").
- **Abatracción**: Utiliza interfaces definidas en el dominio para interactuar con la infraestructura (Inyección de Dependencias).

### 3. Infrastructure (`src/backend/infrastructure`)
Implementaciones concretas de las interfaces del dominio.
- **Database**: Implementación de repositorios usando **Prisma** y SQLite, con abstracciones en `BasePrismaRepository`.
- **External APIs**: Pipeline resiliente con fallback automático (Groq -> NVIDIA -> Gemini).
- **Telemetry**: Monitoreo de performance y logs integrados en todas las capas.

### 4. Controllers / Entry Points (`src/app/actions.ts`)
La puerta de entrada al sistema desde el frontend.
- **Server Actions**: Next.js Server Actions que actúan como controladores, validando el input y llamando a los servicios correspondientes.

---

## 🔄 Flujo de Datos (Análisis de Expresión)

1. **Frontend**: El usuario ingresa una frase en la `SearchBar`.
2. **Action**: Se dispara `analyzeExpression` en `src/app/actions.ts`.
3. **Service**: La acción delega en el `ExpressionService`.
4. **Infrastructure**: El servicio utiliza el cliente de `Groq` para obtener el desglose lingüístico.
5. **Domain**: Se valida que la respuesta cumpla con los tipos de dominio.
6. **Infrastructure**: Se guarda la expresión en la DB vía `ExpressionRepository`.
7. **Frontend**: Se actualiza el store de `Zustand` y se muestra el resultado con `Framer Motion`.

---

## 🤖 Integración con IA y Resiliencia
-
-El sistema utiliza un orquestador resiliente (`withFallback`) que asegura la disponibilidad del servicio:
-1. **Groq (Llama 3.3 70B)**: Proveedor principal para análisis lingüístico profundo.
-2. **NVIDIA NIM (Llama 3.1 8B)**: Fallback estratégico y especialista en variaciones regionales (Slang).
-3. **Google Gemini 2.0**: Capa final de redundancia.
-
-La lógica de prompts está centralizada en `BaseSlangAnalyzer`, permitiendo que el sistema mantenga la calidad pedagógica independientemente del proveedor activo.

---

## 📅 Spaced Repetition System (SRS)

Se implementó el algoritmo **SM-2** para la gestión del aprendizaje a largo plazo. Cada expresión rastrea su `easiness`, `interval` y `nextReviewAt`, permitiendo sesiones de estudio optimizadas basadas en la curva del olvido.
