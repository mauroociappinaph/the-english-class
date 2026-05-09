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
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
async function getExpression(text) {
    const expression = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].expression.findUnique({
        where: {
            text
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
    // Simulate AI analysis or check DB
    const existing = await getExpression(text);
    if (existing) return existing;
    // In a real app, here we would call Gemini
    // For now, if it's not 'is packed with', we return null or a generic response
    return null;
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
"[project]/Desktop/TheEnglishClass/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/* eslint-disable import/no-extraneous-dependencies */ Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "registerServerReference", {
    enumerable: true,
    get: function() {
        return _server.registerServerReference;
    }
});
const _server = __turbopack_context__.r("[project]/Desktop/TheEnglishClass/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
}),
"[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/Desktop/TheEnglishClass/node_modules/@prisma/client)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@prisma/client-a59b8fc020b2a6de", () => require("@prisma/client-a59b8fc020b2a6de"));

module.exports = mod;
}),
"[project]/Desktop/TheEnglishClass/node_modules/@prisma/debug/dist/index.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Debug",
    ()=>Debug,
    "clearLogs",
    ()=>clearLogs,
    "default",
    ()=>index_default,
    "getLogs",
    ()=>getLogs
]);
var __defProp = Object.defineProperty;
var __export = (target, all)=>{
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
// ../../node_modules/.pnpm/kleur@4.1.5/node_modules/kleur/colors.mjs
var colors_exports = {};
__export(colors_exports, {
    $: ()=>$,
    bgBlack: ()=>bgBlack,
    bgBlue: ()=>bgBlue,
    bgCyan: ()=>bgCyan,
    bgGreen: ()=>bgGreen,
    bgMagenta: ()=>bgMagenta,
    bgRed: ()=>bgRed,
    bgWhite: ()=>bgWhite,
    bgYellow: ()=>bgYellow,
    black: ()=>black,
    blue: ()=>blue,
    bold: ()=>bold,
    cyan: ()=>cyan,
    dim: ()=>dim,
    gray: ()=>gray,
    green: ()=>green,
    grey: ()=>grey,
    hidden: ()=>hidden,
    inverse: ()=>inverse,
    italic: ()=>italic,
    magenta: ()=>magenta,
    red: ()=>red,
    reset: ()=>reset,
    strikethrough: ()=>strikethrough,
    underline: ()=>underline,
    white: ()=>white,
    yellow: ()=>yellow
});
var FORCE_COLOR;
var NODE_DISABLE_COLORS;
var NO_COLOR;
var TERM;
var isTTY = true;
if (typeof process !== "undefined") {
    ({ FORCE_COLOR, NODE_DISABLE_COLORS, NO_COLOR, TERM } = process.env || {});
    isTTY = process.stdout && process.stdout.isTTY;
}
var $ = {
    enabled: !NODE_DISABLE_COLORS && NO_COLOR == null && TERM !== "dumb" && (FORCE_COLOR != null && FORCE_COLOR !== "0" || isTTY)
};
function init(x, y) {
    let rgx = new RegExp(`\\x1b\\[${y}m`, "g");
    let open = `\x1B[${x}m`, close = `\x1B[${y}m`;
    return function(txt) {
        if (!$.enabled || txt == null) return txt;
        return open + (!!~("" + txt).indexOf(close) ? txt.replace(rgx, close + open) : txt) + close;
    };
}
var reset = init(0, 0);
var bold = init(1, 22);
var dim = init(2, 22);
var italic = init(3, 23);
var underline = init(4, 24);
var inverse = init(7, 27);
var hidden = init(8, 28);
var strikethrough = init(9, 29);
var black = init(30, 39);
var red = init(31, 39);
var green = init(32, 39);
var yellow = init(33, 39);
var blue = init(34, 39);
var magenta = init(35, 39);
var cyan = init(36, 39);
var white = init(37, 39);
var gray = init(90, 39);
var grey = init(90, 39);
var bgBlack = init(40, 49);
var bgRed = init(41, 49);
var bgGreen = init(42, 49);
var bgYellow = init(43, 49);
var bgBlue = init(44, 49);
var bgMagenta = init(45, 49);
var bgCyan = init(46, 49);
var bgWhite = init(47, 49);
// src/index.ts
var MAX_ARGS_HISTORY = 100;
var COLORS = [
    "green",
    "yellow",
    "blue",
    "magenta",
    "cyan",
    "red"
];
var argsHistory = [];
var lastTimestamp = Date.now();
var lastColor = 0;
var processEnv = typeof process !== "undefined" ? process.env : {};
globalThis.DEBUG ??= processEnv.DEBUG ?? "";
globalThis.DEBUG_COLORS ??= processEnv.DEBUG_COLORS ? processEnv.DEBUG_COLORS === "true" : true;
var topProps = {
    enable (namespace) {
        if (typeof namespace === "string") {
            globalThis.DEBUG = namespace;
        }
    },
    disable () {
        const prev = globalThis.DEBUG;
        globalThis.DEBUG = "";
        return prev;
    },
    // this is the core logic to check if logging should happen or not
    enabled (namespace) {
        const listenedNamespaces = globalThis.DEBUG.split(",").map((s)=>{
            return s.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
        });
        const isListened = listenedNamespaces.some((listenedNamespace)=>{
            if (listenedNamespace === "" || listenedNamespace[0] === "-") return false;
            return namespace.match(RegExp(listenedNamespace.split("*").join(".*") + "$"));
        });
        const isExcluded = listenedNamespaces.some((listenedNamespace)=>{
            if (listenedNamespace === "" || listenedNamespace[0] !== "-") return false;
            return namespace.match(RegExp(listenedNamespace.slice(1).split("*").join(".*") + "$"));
        });
        return isListened && !isExcluded;
    },
    log: (...args)=>{
        const [namespace, format, ...rest] = args;
        const logWithFormatting = console.warn ?? console.log;
        logWithFormatting(`${namespace} ${format}`, ...rest);
    },
    formatters: {}
};
function debugCreate(namespace) {
    const instanceProps = {
        color: COLORS[lastColor++ % COLORS.length],
        enabled: topProps.enabled(namespace),
        namespace,
        log: topProps.log,
        extend: ()=>{}
    };
    const debugCall = (...args)=>{
        const { enabled, namespace: namespace2, color, log } = instanceProps;
        if (args.length !== 0) {
            argsHistory.push([
                namespace2,
                ...args
            ]);
        }
        if (argsHistory.length > MAX_ARGS_HISTORY) {
            argsHistory.shift();
        }
        if (topProps.enabled(namespace2) || enabled) {
            const stringArgs = args.map((arg)=>{
                if (typeof arg === "string") {
                    return arg;
                }
                return safeStringify(arg);
            });
            const ms = `+${Date.now() - lastTimestamp}ms`;
            lastTimestamp = Date.now();
            if (globalThis.DEBUG_COLORS) {
                log(colors_exports[color](bold(namespace2)), ...stringArgs, colors_exports[color](ms));
            } else {
                log(namespace2, ...stringArgs, ms);
            }
        }
    };
    return new Proxy(debugCall, {
        get: (_, prop)=>instanceProps[prop],
        set: (_, prop, value)=>instanceProps[prop] = value
    });
}
var Debug = new Proxy(debugCreate, {
    get: (_, prop)=>topProps[prop],
    set: (_, prop, value)=>topProps[prop] = value
});
function safeStringify(value, indent = 2) {
    const cache = /* @__PURE__ */ new Set();
    return JSON.stringify(value, (key, value2)=>{
        if (typeof value2 === "object" && value2 !== null) {
            if (cache.has(value2)) {
                return `[Circular *]`;
            }
            cache.add(value2);
        } else if (typeof value2 === "bigint") {
            return value2.toString();
        }
        return value2;
    }, indent);
}
function getLogs(numChars = 7500) {
    const logs = argsHistory.map(([namespace, ...args])=>{
        return `${namespace} ${args.map((arg)=>{
            if (typeof arg === "string") {
                return arg;
            } else {
                return JSON.stringify(arg);
            }
        }).join(" ")}`;
    }).join("\n");
    if (logs.length < numChars) {
        return logs;
    }
    return logs.slice(-numChars);
}
function clearLogs() {
    argsHistory.length = 0;
}
var index_default = Debug;
;
}),
"[project]/Desktop/TheEnglishClass/node_modules/@prisma/driver-adapter-utils/dist/index.mjs [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ColumnTypeEnum",
    ()=>ColumnTypeEnum,
    "DriverAdapterError",
    ()=>DriverAdapterError,
    "bindAdapter",
    ()=>bindAdapter,
    "bindMigrationAwareSqlAdapterFactory",
    ()=>bindMigrationAwareSqlAdapterFactory,
    "bindSqlAdapterFactory",
    ()=>bindSqlAdapterFactory,
    "err",
    ()=>err,
    "isDriverAdapterError",
    ()=>isDriverAdapterError,
    "mockAdapter",
    ()=>mockAdapter,
    "mockAdapterErrors",
    ()=>mockAdapterErrors,
    "mockAdapterFactory",
    ()=>mockAdapterFactory,
    "mockMigrationAwareAdapterFactory",
    ()=>mockMigrationAwareAdapterFactory,
    "ok",
    ()=>ok
]);
// src/debug.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f40$prisma$2f$debug$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/@prisma/debug/dist/index.mjs [app-rsc] (ecmascript)");
;
// src/error.ts
var DriverAdapterError = class extends Error {
    name = "DriverAdapterError";
    cause;
    constructor(payload){
        super(typeof payload["message"] === "string" ? payload["message"] : payload.kind);
        this.cause = payload;
    }
};
function isDriverAdapterError(error) {
    return error["name"] === "DriverAdapterError" && typeof error["cause"] === "object";
}
// src/result.ts
function ok(value) {
    return {
        ok: true,
        value,
        map (fn) {
            return ok(fn(value));
        },
        flatMap (fn) {
            return fn(value);
        }
    };
}
function err(error) {
    return {
        ok: false,
        error,
        map () {
            return err(error);
        },
        flatMap () {
            return err(error);
        }
    };
}
// src/binder.ts
var debug = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f40$prisma$2f$debug$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Debug"])("driver-adapter-utils");
var ErrorRegistryInternal = class {
    registeredErrors = [];
    consumeError(id) {
        return this.registeredErrors[id];
    }
    registerNewError(error) {
        let i = 0;
        while(this.registeredErrors[i] !== void 0){
            i++;
        }
        this.registeredErrors[i] = {
            error
        };
        return i;
    }
};
function copySymbolsFromSource(source, target) {
    const symbols = Object.getOwnPropertySymbols(source);
    const symbolObject = Object.fromEntries(symbols.map((symbol)=>[
            symbol,
            true
        ]));
    Object.assign(target, symbolObject);
}
var bindMigrationAwareSqlAdapterFactory = (adapterFactory)=>{
    const errorRegistry = new ErrorRegistryInternal();
    const boundFactory = {
        adapterName: adapterFactory.adapterName,
        provider: adapterFactory.provider,
        errorRegistry,
        connect: async (...args)=>{
            const ctx = await wrapAsync(errorRegistry, adapterFactory.connect.bind(adapterFactory))(...args);
            return ctx.map((ctx2)=>bindAdapter(ctx2, errorRegistry));
        },
        connectToShadowDb: async (...args)=>{
            const ctx = await wrapAsync(errorRegistry, adapterFactory.connectToShadowDb.bind(adapterFactory))(...args);
            return ctx.map((ctx2)=>bindAdapter(ctx2, errorRegistry));
        }
    };
    copySymbolsFromSource(adapterFactory, boundFactory);
    return boundFactory;
};
var bindSqlAdapterFactory = (adapterFactory)=>{
    const errorRegistry = new ErrorRegistryInternal();
    const boundFactory = {
        adapterName: adapterFactory.adapterName,
        provider: adapterFactory.provider,
        errorRegistry,
        connect: async (...args)=>{
            const ctx = await wrapAsync(errorRegistry, adapterFactory.connect.bind(adapterFactory))(...args);
            return ctx.map((ctx2)=>bindAdapter(ctx2, errorRegistry));
        }
    };
    copySymbolsFromSource(adapterFactory, boundFactory);
    return boundFactory;
};
var bindAdapter = (adapter, errorRegistry = new ErrorRegistryInternal())=>{
    const boundAdapter = {
        adapterName: adapter.adapterName,
        errorRegistry,
        queryRaw: wrapAsync(errorRegistry, adapter.queryRaw.bind(adapter)),
        executeRaw: wrapAsync(errorRegistry, adapter.executeRaw.bind(adapter)),
        executeScript: wrapAsync(errorRegistry, adapter.executeScript.bind(adapter)),
        dispose: wrapAsync(errorRegistry, adapter.dispose.bind(adapter)),
        provider: adapter.provider,
        startTransaction: async (...args)=>{
            const ctx = await wrapAsync(errorRegistry, adapter.startTransaction.bind(adapter))(...args);
            return ctx.map((ctx2)=>bindTransaction(errorRegistry, ctx2));
        }
    };
    if (adapter.getConnectionInfo) {
        boundAdapter.getConnectionInfo = wrapSync(errorRegistry, adapter.getConnectionInfo.bind(adapter));
    }
    return boundAdapter;
};
var bindTransaction = (errorRegistry, transaction)=>{
    const boundTransaction = {
        adapterName: transaction.adapterName,
        provider: transaction.provider,
        options: transaction.options,
        queryRaw: wrapAsync(errorRegistry, transaction.queryRaw.bind(transaction)),
        executeRaw: wrapAsync(errorRegistry, transaction.executeRaw.bind(transaction)),
        commit: wrapAsync(errorRegistry, transaction.commit.bind(transaction)),
        rollback: wrapAsync(errorRegistry, transaction.rollback.bind(transaction))
    };
    if (transaction.createSavepoint) {
        boundTransaction.createSavepoint = wrapAsync(errorRegistry, transaction.createSavepoint.bind(transaction));
    }
    if (transaction.rollbackToSavepoint) {
        boundTransaction.rollbackToSavepoint = wrapAsync(errorRegistry, transaction.rollbackToSavepoint.bind(transaction));
    }
    if (transaction.releaseSavepoint) {
        boundTransaction.releaseSavepoint = wrapAsync(errorRegistry, transaction.releaseSavepoint.bind(transaction));
    }
    return boundTransaction;
};
function wrapAsync(registry, fn) {
    return async (...args)=>{
        try {
            return ok(await fn(...args));
        } catch (error) {
            debug("[error@wrapAsync]", error);
            if (isDriverAdapterError(error)) {
                return err(error.cause);
            }
            const id = registry.registerNewError(error);
            return err({
                kind: "GenericJs",
                id
            });
        }
    };
}
function wrapSync(registry, fn) {
    return (...args)=>{
        try {
            return ok(fn(...args));
        } catch (error) {
            debug("[error@wrapSync]", error);
            if (isDriverAdapterError(error)) {
                return err(error.cause);
            }
            const id = registry.registerNewError(error);
            return err({
                kind: "GenericJs",
                id
            });
        }
    };
}
// src/const.ts
var ColumnTypeEnum = {
    // Scalars
    Int32: 0,
    Int64: 1,
    Float: 2,
    Double: 3,
    Numeric: 4,
    Boolean: 5,
    Character: 6,
    Text: 7,
    Date: 8,
    Time: 9,
    DateTime: 10,
    Json: 11,
    Enum: 12,
    Bytes: 13,
    Set: 14,
    Uuid: 15,
    // Arrays
    Int32Array: 64,
    Int64Array: 65,
    FloatArray: 66,
    DoubleArray: 67,
    NumericArray: 68,
    BooleanArray: 69,
    CharacterArray: 70,
    TextArray: 71,
    DateArray: 72,
    TimeArray: 73,
    DateTimeArray: 74,
    JsonArray: 75,
    EnumArray: 76,
    BytesArray: 77,
    UuidArray: 78,
    // Custom
    UnknownNumber: 128
};
// src/mock.ts
var mockAdapterErrors = {
    queryRaw: new Error("Not implemented: queryRaw"),
    executeRaw: new Error("Not implemented: executeRaw"),
    startTransaction: new Error("Not implemented: startTransaction"),
    executeScript: new Error("Not implemented: executeScript"),
    dispose: new Error("Not implemented: dispose")
};
function mockAdapter(provider) {
    return {
        provider,
        adapterName: "@prisma/adapter-mock",
        queryRaw: ()=>Promise.reject(mockAdapterErrors.queryRaw),
        executeRaw: ()=>Promise.reject(mockAdapterErrors.executeRaw),
        startTransaction: ()=>Promise.reject(mockAdapterErrors.startTransaction),
        executeScript: ()=>Promise.reject(mockAdapterErrors.executeScript),
        dispose: ()=>Promise.reject(mockAdapterErrors.dispose),
        [Symbol.for("adapter.mockAdapter")]: true
    };
}
function mockAdapterFactory(provider) {
    return {
        provider,
        adapterName: "@prisma/adapter-mock",
        connect: ()=>Promise.resolve(mockAdapter(provider)),
        [Symbol.for("adapter.mockAdapterFactory")]: true
    };
}
function mockMigrationAwareAdapterFactory(provider) {
    return {
        provider,
        adapterName: "@prisma/adapter-mock",
        connect: ()=>Promise.resolve(mockAdapter(provider)),
        connectToShadowDb: ()=>Promise.resolve(mockAdapter(provider)),
        [Symbol.for("adapter.mockMigrationAwareAdapterFactory")]: true
    };
}
;
}),
"[externals]/better-sqlite3 [external] (better-sqlite3, cjs, [project]/Desktop/TheEnglishClass/node_modules/better-sqlite3)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("better-sqlite3-7fdb7c46d502625b", () => require("better-sqlite3-7fdb7c46d502625b"));

module.exports = mod;
}),
"[project]/Desktop/TheEnglishClass/node_modules/@prisma/adapter-better-sqlite3/dist/index.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PrismaBetterSqlite3",
    ()=>PrismaBetterSqlite3AdapterFactory
]);
// src/better-sqlite3.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f40$prisma$2f$debug$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/@prisma/debug/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/@prisma/driver-adapter-utils/dist/index.mjs [app-rsc] (ecmascript) <locals>");
// src/better-sqlite3.ts
var __TURBOPACK__imported__module__$5b$externals$5d2f$better$2d$sqlite3__$5b$external$5d$__$28$better$2d$sqlite3$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$better$2d$sqlite3$29$__ = __turbopack_context__.i("[externals]/better-sqlite3 [external] (better-sqlite3, cjs, [project]/Desktop/TheEnglishClass/node_modules/better-sqlite3)");
;
// ../../node_modules/.pnpm/async-mutex@0.5.0/node_modules/async-mutex/index.mjs
var E_TIMEOUT = new Error("timeout while waiting for mutex to become available");
var E_ALREADY_LOCKED = new Error("mutex already locked");
var E_CANCELED = new Error("request for lock canceled");
var __awaiter$2 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var Semaphore = class {
    constructor(_value, _cancelError = E_CANCELED){
        this._value = _value;
        this._cancelError = _cancelError;
        this._queue = [];
        this._weightedWaiters = [];
    }
    acquire(weight = 1, priority = 0) {
        if (weight <= 0) throw new Error(`invalid weight ${weight}: must be positive`);
        return new Promise((resolve, reject)=>{
            const task = {
                resolve,
                reject,
                weight,
                priority
            };
            const i = findIndexFromEnd(this._queue, (other)=>priority <= other.priority);
            if (i === -1 && weight <= this._value) {
                this._dispatchItem(task);
            } else {
                this._queue.splice(i + 1, 0, task);
            }
        });
    }
    runExclusive(callback_1) {
        return __awaiter$2(this, arguments, void 0, function*(callback, weight = 1, priority = 0) {
            const [value, release] = yield this.acquire(weight, priority);
            try {
                return yield callback(value);
            } finally{
                release();
            }
        });
    }
    waitForUnlock(weight = 1, priority = 0) {
        if (weight <= 0) throw new Error(`invalid weight ${weight}: must be positive`);
        if (this._couldLockImmediately(weight, priority)) {
            return Promise.resolve();
        } else {
            return new Promise((resolve)=>{
                if (!this._weightedWaiters[weight - 1]) this._weightedWaiters[weight - 1] = [];
                insertSorted(this._weightedWaiters[weight - 1], {
                    resolve,
                    priority
                });
            });
        }
    }
    isLocked() {
        return this._value <= 0;
    }
    getValue() {
        return this._value;
    }
    setValue(value) {
        this._value = value;
        this._dispatchQueue();
    }
    release(weight = 1) {
        if (weight <= 0) throw new Error(`invalid weight ${weight}: must be positive`);
        this._value += weight;
        this._dispatchQueue();
    }
    cancel() {
        this._queue.forEach((entry)=>entry.reject(this._cancelError));
        this._queue = [];
    }
    _dispatchQueue() {
        this._drainUnlockWaiters();
        while(this._queue.length > 0 && this._queue[0].weight <= this._value){
            this._dispatchItem(this._queue.shift());
            this._drainUnlockWaiters();
        }
    }
    _dispatchItem(item) {
        const previousValue = this._value;
        this._value -= item.weight;
        item.resolve([
            previousValue,
            this._newReleaser(item.weight)
        ]);
    }
    _newReleaser(weight) {
        let called = false;
        return ()=>{
            if (called) return;
            called = true;
            this.release(weight);
        };
    }
    _drainUnlockWaiters() {
        if (this._queue.length === 0) {
            for(let weight = this._value; weight > 0; weight--){
                const waiters = this._weightedWaiters[weight - 1];
                if (!waiters) continue;
                waiters.forEach((waiter)=>waiter.resolve());
                this._weightedWaiters[weight - 1] = [];
            }
        } else {
            const queuedPriority = this._queue[0].priority;
            for(let weight = this._value; weight > 0; weight--){
                const waiters = this._weightedWaiters[weight - 1];
                if (!waiters) continue;
                const i = waiters.findIndex((waiter)=>waiter.priority <= queuedPriority);
                (i === -1 ? waiters : waiters.splice(0, i)).forEach((waiter)=>waiter.resolve());
            }
        }
    }
    _couldLockImmediately(weight, priority) {
        return (this._queue.length === 0 || this._queue[0].priority < priority) && weight <= this._value;
    }
};
function insertSorted(a, v) {
    const i = findIndexFromEnd(a, (other)=>v.priority <= other.priority);
    a.splice(i + 1, 0, v);
}
function findIndexFromEnd(a, predicate) {
    for(let i = a.length - 1; i >= 0; i--){
        if (predicate(a[i])) {
            return i;
        }
    }
    return -1;
}
var __awaiter$1 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var Mutex = class {
    constructor(cancelError){
        this._semaphore = new Semaphore(1, cancelError);
    }
    acquire() {
        return __awaiter$1(this, arguments, void 0, function*(priority = 0) {
            const [, releaser] = yield this._semaphore.acquire(1, priority);
            return releaser;
        });
    }
    runExclusive(callback, priority = 0) {
        return this._semaphore.runExclusive(()=>callback(), 1, priority);
    }
    isLocked() {
        return this._semaphore.isLocked();
    }
    waitForUnlock(priority = 0) {
        return this._semaphore.waitForUnlock(1, priority);
    }
    release() {
        if (this._semaphore.isLocked()) this._semaphore.release();
    }
    cancel() {
        return this._semaphore.cancel();
    }
};
;
// package.json
var name = "@prisma/adapter-better-sqlite3";
;
var debug = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f40$prisma$2f$debug$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Debug"])("prisma:driver-adapter:better-sqlite3:conversion");
function mapDeclType(declType) {
    if (declType === null) {
        return null;
    }
    switch(declType.toUpperCase()){
        case "":
            return null;
        case "DECIMAL":
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Numeric;
        case "FLOAT":
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Float;
        case "DOUBLE":
        case "DOUBLE PRECISION":
        case "NUMERIC":
        case "REAL":
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Double;
        case "TINYINT":
        case "SMALLINT":
        case "MEDIUMINT":
        case "INT":
        case "INTEGER":
        case "SERIAL":
        case "INT2":
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Int32;
        case "BIGINT":
        case "UNSIGNED BIG INT":
        case "INT8":
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Int64;
        case "DATETIME":
        case "TIMESTAMP":
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].DateTime;
        case "TIME":
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Time;
        case "DATE":
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Date;
        case "TEXT":
        case "CLOB":
        case "CHARACTER":
        case "VARCHAR":
        case "VARYING CHARACTER":
        case "NCHAR":
        case "NATIVE CHARACTER":
        case "NVARCHAR":
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Text;
        case "BLOB":
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Bytes;
        case "BOOLEAN":
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Boolean;
        case "JSONB":
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Json;
        default:
            debug("unknown decltype:", declType);
            return null;
    }
}
function mapDeclaredColumnTypes(columnTypes) {
    const emptyIndices = /* @__PURE__ */ new Set();
    const result = columnTypes.map((typeName, index)=>{
        const mappedType = mapDeclType(typeName);
        if (mappedType === null) {
            emptyIndices.add(index);
        }
        return mappedType;
    });
    return [
        result,
        emptyIndices
    ];
}
function getColumnTypes(declaredTypes, rows) {
    const [columnTypes, emptyIndices] = mapDeclaredColumnTypes(declaredTypes);
    if (emptyIndices.size === 0) {
        return columnTypes;
    }
    columnLoop: for (const columnIndex of emptyIndices){
        for(let rowIndex = 0; rowIndex < rows.length; rowIndex++){
            const candidateValue = rows[rowIndex][columnIndex];
            if (candidateValue !== null) {
                columnTypes[columnIndex] = inferColumnType(candidateValue);
                continue columnLoop;
            }
        }
        columnTypes[columnIndex] = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Int32;
    }
    return columnTypes;
}
function inferColumnType(value) {
    switch(typeof value){
        case "string":
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Text;
        case "bigint":
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Int64;
        case "boolean":
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Boolean;
        case "number":
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].UnknownNumber;
        case "object":
            return inferObjectType(value);
        default:
            throw new UnexpectedTypeError(value);
    }
}
function inferObjectType(value) {
    if (value instanceof ArrayBuffer) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Bytes;
    }
    throw new UnexpectedTypeError(value);
}
var UnexpectedTypeError = class extends Error {
    name = "UnexpectedTypeError";
    constructor(value){
        const type = typeof value;
        const repr = type === "object" ? JSON.stringify(value) : String(value);
        super(`unexpected value of type ${type}: ${repr}`);
    }
};
function mapRow(row, columnTypes) {
    const result = [];
    for(let i = 0; i < row.length; i++){
        const value = row[i];
        if (typeof value === "number" && (columnTypes[i] === __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Int32 || columnTypes[i] === __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Int64) && !Number.isInteger(value)) {
            result[i] = Math.trunc(value);
            continue;
        }
        if ([
            "number",
            "bigint"
        ].includes(typeof value) && columnTypes[i] === __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].DateTime) {
            result[i] = new Date(Number(value)).toISOString();
            continue;
        }
        if (typeof value === "bigint") {
            const asNumber = Number(value);
            result[i] = Number.isSafeInteger(asNumber) ? asNumber : value.toString();
            continue;
        }
        result[i] = value;
    }
    return result;
}
function mapArg(arg, argType, options) {
    if (arg === null) {
        return null;
    }
    if (typeof arg === "string" && argType.scalarType === "int") {
        return Number.parseInt(arg);
    }
    if (typeof arg === "string" && argType.scalarType === "float") {
        return Number.parseFloat(arg);
    }
    if (typeof arg === "string" && argType.scalarType === "decimal") {
        return Number.parseFloat(arg);
    }
    if (typeof arg === "string" && argType.scalarType === "bigint") {
        return BigInt(arg);
    }
    if (typeof arg === "boolean") {
        return arg ? 1 : 0;
    }
    if (typeof arg === "string" && argType.scalarType === "datetime") {
        arg = new Date(arg);
    }
    if (arg instanceof Date) {
        const format = options?.timestampFormat ?? "iso8601";
        switch(format){
            case "unixepoch-ms":
                return arg.getTime();
            case "iso8601":
                return arg.toISOString().replace("Z", "+00:00");
            default:
                throw new Error(`Unknown timestamp format: ${format}`);
        }
    }
    if (typeof arg === "string" && argType.scalarType === "bytes") {
        return Buffer.from(arg, "base64");
    }
    return arg;
}
// src/errors.ts
function convertDriverError(error) {
    if (isDriverError(error)) {
        return {
            originalCode: error.code,
            originalMessage: error.message,
            ...mapDriverError(error)
        };
    }
    throw error;
}
function mapDriverError(error) {
    switch(error.code){
        case "SQLITE_BUSY":
            return {
                kind: "SocketTimeout"
            };
        case "SQLITE_CONSTRAINT_UNIQUE":
        case "SQLITE_CONSTRAINT_PRIMARYKEY":
            {
                const fields = error.message.split("constraint failed: ").at(1)?.split(", ").map((field)=>field.split(".").pop());
                return {
                    kind: "UniqueConstraintViolation",
                    constraint: fields !== void 0 ? {
                        fields
                    } : void 0
                };
            }
        case "SQLITE_CONSTRAINT_NOTNULL":
            {
                const fields = error.message.split("constraint failed: ").at(1)?.split(", ").map((field)=>field.split(".").pop());
                return {
                    kind: "NullConstraintViolation",
                    constraint: fields !== void 0 ? {
                        fields
                    } : void 0
                };
            }
        case "SQLITE_CONSTRAINT_FOREIGNKEY":
        case "SQLITE_CONSTRAINT_TRIGGER":
            return {
                kind: "ForeignKeyConstraintViolation",
                constraint: {
                    foreignKey: {}
                }
            };
        default:
            if (error.message.startsWith("no such table")) {
                return {
                    kind: "TableDoesNotExist",
                    table: error.message.split(": ").at(1)
                };
            } else if (error.message.startsWith("no such column")) {
                return {
                    kind: "ColumnNotFound",
                    column: error.message.split(": ").at(1)
                };
            } else if (error.message.includes("has no column named ")) {
                return {
                    kind: "ColumnNotFound",
                    column: error.message.split("has no column named ").at(1)
                };
            }
            throw error;
    }
}
function isDriverError(error) {
    return typeof error.code === "string" && typeof error.message === "string";
}
// src/better-sqlite3.ts
var debug2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f40$prisma$2f$debug$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Debug"])("prisma:driver-adapter:better-sqlite3");
var BetterSQLite3Queryable = class {
    constructor(client, adapterOptions){
        this.client = client;
        this.adapterOptions = adapterOptions;
    }
    provider = "sqlite";
    adapterName = name;
    /**
   * Execute a query given as SQL, interpolating the given parameters.
   */ async queryRaw(query) {
        const tag = "[js::queryRaw]";
        debug2(`${tag} %O`, query);
        const { columnNames, declaredTypes, values } = await this.performIO(query);
        const rows = values;
        const columnTypes = getColumnTypes(declaredTypes, rows);
        return {
            columnNames,
            columnTypes,
            rows: rows.map((row)=>mapRow(row, columnTypes))
        };
    }
    /**
   * Execute a query given as SQL, interpolating the given parameters and
   * returning the number of affected rows.
   * Note: Queryable expects a u64, but napi.rs only supports u32.
   */ async executeRaw(query) {
        const tag = "[js::executeRaw]";
        debug2(`${tag} %O`, query);
        return (await this.executeIO(query)).changes;
    }
    /**
   * Run a query against the database, returning the result set.
   * Should the query fail due to a connection error, the connection is
   * marked as unhealthy.
   */ executeIO(query) {
        try {
            const args = query.args.map((arg, i)=>mapArg(arg, query.argTypes[i], this.adapterOptions));
            const stmt = this.client.prepare(query.sql).bind(args);
            const result = stmt.run();
            return Promise.resolve(result);
        } catch (e) {
            this.onError(e);
        }
    }
    /**
   * Run a query against the database, returning the result set.
   * Should the query fail due to a connection error, the connection is
   * marked as unhealthy.
   */ performIO(query) {
        try {
            const args = query.args.map((arg, i)=>mapArg(arg, query.argTypes[i], this.adapterOptions));
            const stmt = this.client.prepare(query.sql).bind(args);
            if (!stmt.reader) {
                stmt.run();
                return Promise.resolve({
                    columnNames: [],
                    declaredTypes: [],
                    values: []
                });
            }
            const columns = stmt.columns();
            const resultSet = {
                declaredTypes: columns.map((column)=>column.type),
                columnNames: columns.map((column)=>column.name),
                values: stmt.raw().all()
            };
            return Promise.resolve(resultSet);
        } catch (e) {
            this.onError(e);
        }
    }
    onError(error) {
        debug2("Error in performIO: %O", error);
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DriverAdapterError"](convertDriverError(error));
    }
};
var BetterSQLite3Transaction = class extends BetterSQLite3Queryable {
    constructor(client, options, adapterOptions, unlockParent){
        super(client, adapterOptions);
        this.options = options;
        this.#unlockParent = unlockParent;
    }
    #unlockParent;
    commit() {
        debug2(`[js::commit]`);
        this.#unlockParent();
        return Promise.resolve();
    }
    rollback() {
        debug2(`[js::rollback]`);
        this.#unlockParent();
        return Promise.resolve();
    }
    async createSavepoint(name2) {
        await this.executeRaw({
            sql: `SAVEPOINT ${name2}`,
            args: [],
            argTypes: []
        });
    }
    async rollbackToSavepoint(name2) {
        await this.executeRaw({
            sql: `ROLLBACK TO ${name2}`,
            args: [],
            argTypes: []
        });
    }
    async releaseSavepoint(name2) {
        await this.executeRaw({
            sql: `RELEASE SAVEPOINT ${name2}`,
            args: [],
            argTypes: []
        });
    }
};
var PrismaBetterSqlite3Adapter = class extends BetterSQLite3Queryable {
    #mutex = new Mutex();
    constructor(client, adapterOptions){
        super(client, adapterOptions);
    }
    executeScript(script) {
        try {
            this.client.exec(script);
        } catch (e) {
            this.onError(e);
        }
        return Promise.resolve();
    }
    async startTransaction(isolationLevel) {
        if (isolationLevel && isolationLevel !== "SERIALIZABLE") {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DriverAdapterError"]({
                kind: "InvalidIsolationLevel",
                level: isolationLevel
            });
        }
        const options = {
            usePhantomQuery: false
        };
        const tag = "[js::startTransaction]";
        debug2("%s options: %O", tag, options);
        try {
            const release = await this.#mutex.acquire();
            this.client.prepare("BEGIN").run();
            return new BetterSQLite3Transaction(this.client, options, this.adapterOptions, release);
        } catch (e) {
            this.onError(e);
        }
    }
    dispose() {
        this.client.close();
        return Promise.resolve();
    }
};
var PrismaBetterSqlite3AdapterFactory = class {
    provider = "sqlite";
    adapterName = name;
    #config;
    #options;
    constructor(config, options){
        this.#config = config;
        this.#options = options;
    }
    connect() {
        return Promise.resolve(new PrismaBetterSqlite3Adapter(createBetterSQLite3Client(this.#config), this.#options));
    }
    connectToShadowDb() {
        const url = this.#options?.shadowDatabaseUrl ?? ":memory:";
        return Promise.resolve(new PrismaBetterSqlite3Adapter(createBetterSQLite3Client({
            ...this.#config,
            url
        }), this.#options));
    }
};
function createBetterSQLite3Client(input) {
    const { url, ...config } = input;
    const dbPath = url.replace(/^file:/, "");
    const db = new __TURBOPACK__imported__module__$5b$externals$5d2f$better$2d$sqlite3__$5b$external$5d$__$28$better$2d$sqlite3$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$better$2d$sqlite3$29$__["default"](dbPath, config);
    db.defaultSafeIntegers(true);
    return db;
}
;
}),
"[project]/Desktop/TheEnglishClass/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// This function ensures that all the exported values are valid server actions,
// during the runtime. By definition all actions are required to be async
// functions, but here we can only check that they are functions.
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ensureServerEntryExports", {
    enumerable: true,
    get: function() {
        return ensureServerEntryExports;
    }
});
function ensureServerEntryExports(actions) {
    for(let i = 0; i < actions.length; i++){
        const action = actions[i];
        if (typeof action !== 'function') {
            throw Object.defineProperty(new Error(`A "use server" file can only export async functions, found ${typeof action}.\nRead more: https://nextjs.org/docs/messages/invalid-use-server-value`), "__NEXT_ERROR_CODE", {
                value: "E352",
                enumerable: false,
                configurable: true
            });
        }
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0x6ag5k._.js.map