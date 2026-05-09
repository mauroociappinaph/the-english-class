module.exports = [
"[project]/Desktop/TheEnglishClass/src/lib/db.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/Desktop/TheEnglishClass/node_modules/@prisma/client)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f40$prisma$2f$adapter$2d$better$2d$sqlite3$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/@prisma/adapter-better-sqlite3/dist/index.mjs [app-rsc] (ecmascript)");
;
;
const adapter = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f40$prisma$2f$adapter$2d$better$2d$sqlite3$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PrismaBetterSqlite3"]({
    url: 'file:./dev.db'
});
const prisma = new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]({
    adapter
});
}),
"[project]/Desktop/TheEnglishClass/src/lib/groq.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "groq",
    ()=>groq
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$client$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__Groq__as__default$3e$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/client.mjs [app-rsc] (ecmascript) <export Groq as default>");
;
if (!process.env.GROQ_API_KEY) {
    throw new Error("Missing GROQ_API_KEY environment variable");
}
const groq = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$client$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__Groq__as__default$3e$__["default"]({
    apiKey: process.env.GROQ_API_KEY
});
}),
"[project]/Desktop/TheEnglishClass/src/app/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"40075ed5e4bdd75f3bcff5c089d5334066a9f04dce":{"name":"analyzeExpression"},"407515e1a3123c6092a6cdefcd7419542d2dfb2d35":{"name":"getExpression"}},"Desktop/TheEnglishClass/src/app/actions.ts",""] */ __turbopack_context__.s([
    "analyzeExpression",
    ()=>analyzeExpression,
    "getExpression",
    ()=>getExpression
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/src/lib/db.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$src$2f$lib$2f$groq$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/src/lib/groq.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function getExpression(text) {
    const normalizedText = text.toLowerCase().trim();
    const expression = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].expression.findUnique({
        where: {
            text: normalizedText
        },
        include: {
            examples: true
        }
    });
    if (!expression) return null;
    return {
        ...expression,
        secondaryMeanings: JSON.parse(expression.secondaryMeanings || "[]"),
        usageTips: JSON.parse(expression.usageTips || "{}"),
        tenses: JSON.parse(expression.tenses || "{}")
    };
}
async function analyzeExpression(text) {
    const normalizedText = text.toLowerCase().trim();
    // 1. Check if it exists in DB
    const existing = await getExpression(normalizedText);
    if (existing) return existing;
    // 2. Call Groq for analysis
    try {
        const prompt = `You are a Senior English Professor and Linguistic Analyst (Cambridge standards). 
Analyze the provided English expression and return a strictly valid JSON object.
Translations and explanations MUST be in Spanish.

Expression: "${normalizedText}"

Schema:
{
  "translation": "natural Spanish translation",
  "meaning": "clear explanation in Spanish",
  "secondaryMeanings": ["optional", "other", "meanings"],
  "type": "verb | phrasal_verb | idiom | expression | tense",
  "cefr": "A1 | A2 | B1 | B2 | C1 | C2",
  "ipa": "/phonetic transcription/",
  "frequency": 0.0 to 1.0,
  "formality": "formal | informal | neutral",
  "usageTips": {
    "naturalness": "description",
    "commonMistake": "description",
    "context": "description"
  },
  "tenses": {
    "present": "Example in present",
    "past": "Example in past",
    "presentPerfect": "Example in present perfect",
    "future": "Example in future"
  },
  "examples": [
    { "text": "natural example 1", "category": "cotidiano", "explanation": "Spanish explanation" },
    { "text": "advanced example 2", "category": "avanzado", "explanation": "Spanish explanation" },
    { "text": "dialectal/slang example 3", "category": "dialectal", "explanation": "Spanish explanation" }
  ]
}`;
        const completion = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$src$2f$lib$2f$groq$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["groq"].chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "Return ONLY a valid JSON object."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: {
                type: "json_object"
            },
            temperature: 0.1
        });
        const result = JSON.parse(completion.choices[0]?.message?.content || "{}");
        // 3. Save to DB
        const newExpression = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].expression.create({
            data: {
                text: normalizedText,
                translation: result.translation || "",
                meaning: result.meaning || "",
                secondaryMeanings: JSON.stringify(result.secondaryMeanings || []),
                type: result.type || "expression",
                cefr: result.cefr || "B1",
                ipa: result.ipa || "",
                frequency: result.frequency || 0.5,
                formality: result.formality || "neutral",
                usageTips: JSON.stringify(result.usageTips || {}),
                tenses: JSON.stringify(result.tenses || {}),
                examples: {
                    create: (result.examples || []).map((ex)=>({
                            text: ex.text,
                            category: ex.category,
                            explanation: ex.explanation
                        }))
                }
            },
            include: {
                examples: true
            }
        });
        return {
            ...newExpression,
            secondaryMeanings: JSON.parse(newExpression.secondaryMeanings || "[]"),
            usageTips: JSON.parse(newExpression.usageTips || "{}"),
            tenses: JSON.parse(newExpression.tenses || "{}")
        };
    } catch (error) {
        console.error("Analysis failed:", error);
        return null;
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getExpression,
    analyzeExpression
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getExpression, "407515e1a3123c6092a6cdefcd7419542d2dfb2d35", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(analyzeExpression, "40075ed5e4bdd75f3bcff5c089d5334066a9f04dce", null);
}),
"[project]/Desktop/TheEnglishClass/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/Desktop/TheEnglishClass/src/app/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/src/app/actions.ts [app-rsc] (ecmascript)");
;
}),
"[project]/Desktop/TheEnglishClass/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/Desktop/TheEnglishClass/src/app/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "407515e1a3123c6092a6cdefcd7419542d2dfb2d35",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getExpression"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$Desktop$2f$TheEnglishClass$2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/Desktop/TheEnglishClass/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => "[project]/Desktop/TheEnglishClass/src/app/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/src/app/actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=Desktop_TheEnglishClass_00-v.hu._.js.map