# Functional Specification: Initial MVP

## User Stories
1. **As a student**, I want to paste a phrase like "is packed with" and get a full breakdown of its meaning, level, and usage.
2. **As a student**, I want to see how to use that phrase in different verb tenses (past, present, future).
3. **As a learner**, I want to see "real" examples (slang vs academic) to understand nuance.
4. **As a user**, I want my expressions saved automatically so I can review them later.

## Data Requirements
Each entry must contain:
- `text`: The string.
- `translation`: Spanish translation.
- `meaning`: Main definition.
- `secondary_meanings`: Array of alternatives.
- `type`: Category (phrasal verb, idiom, etc.).
- `cefr`: A1-C2 level.
- `ipa`: Phonetic transcription.
- `usage_tips`: { context, naturalness, avoid, common_errors }.
- `tenses`: Object mapping tenses to example sentences.
- `examples`: Array of { text, category (cotidiano, avanzado, dialectal), explanation }.

## UI Requirements
- **Mobile First**: Fully responsive.
- **Glassmorphism**: Subtle backgrounds.
- **Dark Mode**: High-priority.
- **Interactive Flashcards**: Swipe/Click to reveal.
