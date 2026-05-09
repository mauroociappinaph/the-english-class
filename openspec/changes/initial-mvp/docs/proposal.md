# Proposal: The English Class MVP

## Goal
Develop a modern, AI-powered English study application that helps users save, analyze, and master English expressions (words, phrases, idioms, phrasal verbs).

## Proposed Architecture
- **Framework**: Next.js 14+ (App Router).
- **Styling**: TailwindCSS + Framer Motion for high-end animations.
- **Components**: shadcn/ui.
- **Database**: Prisma with SQLite (initial) / PostgreSQL.
- **Analysis Engine**: A dedicated LLM service to provide CEFR levels, grammar analysis, and dialect-specific examples.
- **State Management**: Zustand for interactive study sessions.

## Core Components
1. **Intelligence Engine**: Server Action that takes a string, queries an LLM, and returns a structured JSON (using Zod for validation).
2. **Dashboard**: Unified search input with immediate visual feedback.
3. **Study System**: Anki-style spaced repetition logic (simplified for MVP).
4. **Visual Analytics**: Charts for vocabulary growth and CEFR level distribution.

## Tech Decisions
- **LLM Selection**: Gemini 1.5 Flash for speed and high-quality linguistic reasoning.
- **Animation**: "Linear-style" transitions for card expansions and loading states.
- **Database Schema**:
  - `Expression`: Main table (content, type, cefr, etc.)
  - `Example`: Relational table for the 3 types for examples.
  - `Progress`: Tracks mastery level and study dates.
