# 🎓 The English Class

![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)
![Type Safety](https://img.shields.io/badge/type--safety-100%25-brightgreen.svg)
![Architecture](https://img.shields.io/badge/architecture-modular--hexagonal-orange.svg)
![Health Score](https://img.shields.io/badge/health--score-100%2F100-brightgreen.svg)

**The English Class** es una plataforma inteligente de aprendizaje de inglés diseñada para el dominio profundo de expresiones, modismos y verbos compuestos. Potenciada por IA, ofrece un desglose lingüístico preciso y una experiencia inmersiva.

---

## 🚀 Quick Start

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar el entorno**:
   Crea un archivo `.env` basado en `.env.example` con tu `GROQ_API_KEY`.

3. **Levantar el entorno de desarrollo**:
   ```bash
   npm run dev
   ```

4. **Activar el Sentinel (Watch Mode)**:
   ```bash
   npm run analyze:watch
   ```

---

## 🛠 Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS 4, Framer Motion.
- **Backend**: Server Actions, Prisma, SQLite (better-sqlite3).
- **IA**: Groq Cloud, NVIDIA NIM, Google Gemini (Multi-provider Resilient Pipeline).
- **Gobernanza**: TS-Morph (Custom Architectural Sentinel).
- **Testing**: Vitest.
- **Persistence**: SM-2 Algorithm for Spaced Repetition (SR).

---

## 🏗 Arquitectura y Gobernanza

Este proyecto no es solo código; es un sistema con leyes estrictas para garantizar la escalabilidad y la ausencia de deuda técnica.

- **[Guía de Arquitectura](docs/ARCHITECTURE.md)**: Detalles sobre la Arquitectura Hexagonal y el flujo de datos.
- **[Guía de Gobernanza](docs/GOVERNANCE.md)**: Todo sobre el **Architectural Sentinel** y la política **Zero-Any**.

---

## 📈 Calidad de Código

Mantenemos un estándar de calidad extremadamente alto. Antes de cada commit, el Sentinel verifica:
- ✅ **Zero Any Policy** (Enforced 100%)
- ✅ **Layer Boundaries** (Strict Hexagonal)
- ✅ **Cohesión de Interfaces** (SOLID compliance)
- ✅ **Resiliencia de IA** (Automatic Failover)
- ✅ **Seguridad OWASP** (Stateless & Type-safe)

---

## 🤝 Contribución

Si vas a agregar una funcionalidad, asegúrate de que el comando `npm run analyze:types` pase sin errores. No aceptamos PRs con advertencias críticas de arquitectura.
