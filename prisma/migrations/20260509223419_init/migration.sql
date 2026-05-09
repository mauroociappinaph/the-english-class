-- CreateTable
CREATE TABLE "Expression" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "meaning" TEXT NOT NULL,
    "secondaryMeanings" TEXT,
    "type" TEXT NOT NULL,
    "cefr" TEXT NOT NULL,
    "ipa" TEXT,
    "frequency" REAL,
    "formality" TEXT,
    "usageTips" TEXT,
    "tenses" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "difficulty" INTEGER NOT NULL DEFAULT 1,
    "timesStudied" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Example" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "explanation" TEXT,
    "expressionId" TEXT NOT NULL,
    CONSTRAINT "Example_expressionId_fkey" FOREIGN KEY ("expressionId") REFERENCES "Expression" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Expression_text_key" ON "Expression"("text");
