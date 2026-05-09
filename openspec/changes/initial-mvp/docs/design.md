# Technical Design: Initial MVP

## Database Schema (Prisma)
```prisma
model Expression {
  id                String   @id @default(cuid())
  text              String   @unique
  translation       String
  meaning           String
  secondaryMeanings String?  // JSON string
  type              String   // verb, phrasal_verb, idiom, etc.
  cefr              String   // A1-C2
  ipa               String?
  frequency         Float?
  formality         String?
  usageTips         String?  // JSON string
  tenses            String?  // JSON string
  status            String   @default("pending") // pending, learning, mastered
  difficulty        Int      @default(1)
  timesStudied      Int      @default(0)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  examples          Example[]
}

model Example {
  id           String     @id @default(cuid())
  text         String
  category     String     // cotidiano, avanzado, dialectal
  explanation  String?
  expressionId String
  expression   Expression @relation(fields: [expressionId], references: [id])
}
```

## API Routes
- `POST /api/analyze`: Takes text, calls LLM, returns structured data.
- `POST /api/expressions`: Saves a new expression.
- `GET /api/expressions`: Fetches saved expressions with filters.

## Component Tree
- `Layout`: Navbar + Main Content.
- `SearchSection`: Large input + Analysis results.
- `StudyPanel`: Flashcards + Statistics.
- `Library`: Grid of saved cards with filtering.
```
