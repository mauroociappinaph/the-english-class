module.exports = [
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
"[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/tslib.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__classPrivateFieldGet",
    ()=>__classPrivateFieldGet,
    "__classPrivateFieldSet",
    ()=>__classPrivateFieldSet
]);
function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
}
function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
;
}),
"[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/utils/uuid.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
/**
 * https://stackoverflow.com/a/2117523
 */ __turbopack_context__.s([
    "uuid4",
    ()=>uuid4
]);
let uuid4 = function() {
    const { crypto } = globalThis;
    if (crypto?.randomUUID) {
        uuid4 = crypto.randomUUID.bind(crypto);
        return crypto.randomUUID();
    }
    const u8 = new Uint8Array(1);
    const randomByte = crypto ? ()=>crypto.getRandomValues(u8)[0] : ()=>Math.random() * 0xff & 0xff;
    return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c)=>(+c ^ randomByte() & 15 >> +c / 4).toString(16));
};
}),
"[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/errors.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
__turbopack_context__.s([
    "castToError",
    ()=>castToError,
    "isAbortError",
    ()=>isAbortError
]);
function isAbortError(err) {
    return typeof err === 'object' && err !== null && // Spec-compliant fetch implementations
    ('name' in err && err.name === 'AbortError' || 'message' in err && String(err.message).includes('FetchRequestCanceledException'));
}
const castToError = (err)=>{
    if (err instanceof Error) return err;
    if (typeof err === 'object' && err !== null) {
        try {
            if (Object.prototype.toString.call(err) === '[object Error]') {
                // @ts-ignore - not all envs have native support for cause yet
                const error = new Error(err.message, err.cause ? {
                    cause: err.cause
                } : {});
                if (err.stack) error.stack = err.stack;
                // @ts-ignore - not all envs have native support for cause yet
                if (err.cause && !error.cause) error.cause = err.cause;
                if (err.name) error.name = err.name;
                return error;
            }
        } catch  {}
        try {
            return new Error(JSON.stringify(err));
        } catch  {}
    }
    return new Error(err);
};
}),
"[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/core/error.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "APIConnectionError",
    ()=>APIConnectionError,
    "APIConnectionTimeoutError",
    ()=>APIConnectionTimeoutError,
    "APIError",
    ()=>APIError,
    "APIUserAbortError",
    ()=>APIUserAbortError,
    "AuthenticationError",
    ()=>AuthenticationError,
    "BadRequestError",
    ()=>BadRequestError,
    "ConflictError",
    ()=>ConflictError,
    "GroqError",
    ()=>GroqError,
    "InternalServerError",
    ()=>InternalServerError,
    "NotFoundError",
    ()=>NotFoundError,
    "PermissionDeniedError",
    ()=>PermissionDeniedError,
    "RateLimitError",
    ()=>RateLimitError,
    "UnprocessableEntityError",
    ()=>UnprocessableEntityError
]);
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$errors$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/errors.mjs [app-rsc] (ecmascript)");
;
class GroqError extends Error {
}
class APIError extends GroqError {
    constructor(status, error, message, headers){
        super(`${APIError.makeMessage(status, error, message)}`);
        this.status = status;
        this.headers = headers;
        this.error = error;
    }
    static makeMessage(status, error, message) {
        const msg = error?.message ? typeof error.message === 'string' ? error.message : JSON.stringify(error.message) : error ? JSON.stringify(error) : message;
        if (status && msg) {
            return `${status} ${msg}`;
        }
        if (status) {
            return `${status} status code (no body)`;
        }
        if (msg) {
            return msg;
        }
        return '(no status code or body)';
    }
    static generate(status, errorResponse, message, headers) {
        if (!status || !headers) {
            return new APIConnectionError({
                message,
                cause: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$errors$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["castToError"])(errorResponse)
            });
        }
        const error = errorResponse;
        if (status === 400) {
            return new BadRequestError(status, error, message, headers);
        }
        if (status === 401) {
            return new AuthenticationError(status, error, message, headers);
        }
        if (status === 403) {
            return new PermissionDeniedError(status, error, message, headers);
        }
        if (status === 404) {
            return new NotFoundError(status, error, message, headers);
        }
        if (status === 409) {
            return new ConflictError(status, error, message, headers);
        }
        if (status === 422) {
            return new UnprocessableEntityError(status, error, message, headers);
        }
        if (status === 429) {
            return new RateLimitError(status, error, message, headers);
        }
        if (status >= 500) {
            return new InternalServerError(status, error, message, headers);
        }
        return new APIError(status, error, message, headers);
    }
}
class APIUserAbortError extends APIError {
    constructor({ message } = {}){
        super(undefined, undefined, message || 'Request was aborted.', undefined);
    }
}
class APIConnectionError extends APIError {
    constructor({ message, cause }){
        super(undefined, undefined, message || 'Connection error.', undefined);
        // in some environments the 'cause' property is already declared
        // @ts-ignore
        if (cause) this.cause = cause;
    }
}
class APIConnectionTimeoutError extends APIConnectionError {
    constructor({ message } = {}){
        super({
            message: message ?? 'Request timed out.'
        });
    }
}
class BadRequestError extends APIError {
}
class AuthenticationError extends APIError {
}
class PermissionDeniedError extends APIError {
}
class NotFoundError extends APIError {
}
class ConflictError extends APIError {
}
class UnprocessableEntityError extends APIError {
}
class RateLimitError extends APIError {
}
class InternalServerError extends APIError {
}
}),
"[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/utils/values.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "coerceBoolean",
    ()=>coerceBoolean,
    "coerceFloat",
    ()=>coerceFloat,
    "coerceInteger",
    ()=>coerceInteger,
    "ensurePresent",
    ()=>ensurePresent,
    "hasOwn",
    ()=>hasOwn,
    "isAbsoluteURL",
    ()=>isAbsoluteURL,
    "isArray",
    ()=>isArray,
    "isEmptyObj",
    ()=>isEmptyObj,
    "isObj",
    ()=>isObj,
    "isReadonlyArray",
    ()=>isReadonlyArray,
    "maybeCoerceBoolean",
    ()=>maybeCoerceBoolean,
    "maybeCoerceFloat",
    ()=>maybeCoerceFloat,
    "maybeCoerceInteger",
    ()=>maybeCoerceInteger,
    "maybeObj",
    ()=>maybeObj,
    "safeJSON",
    ()=>safeJSON,
    "validatePositiveInteger",
    ()=>validatePositiveInteger
]);
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/core/error.mjs [app-rsc] (ecmascript)");
;
// https://url.spec.whatwg.org/#url-scheme-string
const startsWithSchemeRegexp = /^[a-z][a-z0-9+.-]*:/i;
const isAbsoluteURL = (url)=>{
    return startsWithSchemeRegexp.test(url);
};
let isArray = (val)=>(isArray = Array.isArray, isArray(val));
let isReadonlyArray = isArray;
function maybeObj(x) {
    if (typeof x !== 'object') {
        return {};
    }
    return x ?? {};
}
function isEmptyObj(obj) {
    if (!obj) return true;
    for(const _k in obj)return false;
    return true;
}
function hasOwn(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}
function isObj(obj) {
    return obj != null && typeof obj === 'object' && !Array.isArray(obj);
}
const ensurePresent = (value)=>{
    if (value == null) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["GroqError"](`Expected a value to be given but received ${value} instead.`);
    }
    return value;
};
const validatePositiveInteger = (name, n)=>{
    if (typeof n !== 'number' || !Number.isInteger(n)) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["GroqError"](`${name} must be an integer`);
    }
    if (n < 0) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["GroqError"](`${name} must be a positive integer`);
    }
    return n;
};
const coerceInteger = (value)=>{
    if (typeof value === 'number') return Math.round(value);
    if (typeof value === 'string') return parseInt(value, 10);
    throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["GroqError"](`Could not coerce ${value} (type: ${typeof value}) into a number`);
};
const coerceFloat = (value)=>{
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return parseFloat(value);
    throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["GroqError"](`Could not coerce ${value} (type: ${typeof value}) into a number`);
};
const coerceBoolean = (value)=>{
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value === 'true';
    return Boolean(value);
};
const maybeCoerceInteger = (value)=>{
    if (value == null) {
        return undefined;
    }
    return coerceInteger(value);
};
const maybeCoerceFloat = (value)=>{
    if (value == null) {
        return undefined;
    }
    return coerceFloat(value);
};
const maybeCoerceBoolean = (value)=>{
    if (value == null) {
        return undefined;
    }
    return coerceBoolean(value);
};
const safeJSON = (text)=>{
    try {
        return JSON.parse(text);
    } catch (err) {
        return undefined;
    }
};
}),
"[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/utils/sleep.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
__turbopack_context__.s([
    "sleep",
    ()=>sleep
]);
const sleep = (ms)=>new Promise((resolve)=>setTimeout(resolve, ms));
}),
"[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/version.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "VERSION",
    ()=>VERSION
]);
const VERSION = '1.1.2'; // x-release-please-version
}),
"[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/detect-platform.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getPlatformHeaders",
    ()=>getPlatformHeaders,
    "isRunningInBrowser",
    ()=>isRunningInBrowser
]);
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$version$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/version.mjs [app-rsc] (ecmascript)");
;
const isRunningInBrowser = ()=>{
    return(// @ts-ignore
    ("TURBOPACK compile-time value", "undefined") !== 'undefined' && // @ts-ignore
    typeof window.document !== 'undefined' && // @ts-ignore
    typeof navigator !== 'undefined');
};
/**
 * Note this does not detect 'browser'; for that, use getBrowserInfo().
 */ function getDetectedPlatform() {
    if (typeof Deno !== 'undefined' && Deno.build != null) {
        return 'deno';
    }
    if (typeof EdgeRuntime !== 'undefined') {
        return 'edge';
    }
    if (Object.prototype.toString.call(typeof globalThis.process !== 'undefined' ? globalThis.process : 0) === '[object process]') {
        return 'node';
    }
    return 'unknown';
}
const getPlatformProperties = ()=>{
    const detectedPlatform = getDetectedPlatform();
    if (detectedPlatform === 'deno') {
        return {
            'X-Stainless-Lang': 'js',
            'X-Stainless-Package-Version': __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$version$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["VERSION"],
            'X-Stainless-OS': normalizePlatform(Deno.build.os),
            'X-Stainless-Arch': normalizeArch(Deno.build.arch),
            'X-Stainless-Runtime': 'deno',
            'X-Stainless-Runtime-Version': typeof Deno.version === 'string' ? Deno.version : Deno.version?.deno ?? 'unknown'
        };
    }
    if (typeof EdgeRuntime !== 'undefined') {
        return {
            'X-Stainless-Lang': 'js',
            'X-Stainless-Package-Version': __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$version$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["VERSION"],
            'X-Stainless-OS': 'Unknown',
            'X-Stainless-Arch': `other:${EdgeRuntime}`,
            'X-Stainless-Runtime': 'edge',
            'X-Stainless-Runtime-Version': globalThis.process.version
        };
    }
    // Check if Node.js
    if (detectedPlatform === 'node') {
        return {
            'X-Stainless-Lang': 'js',
            'X-Stainless-Package-Version': __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$version$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["VERSION"],
            'X-Stainless-OS': normalizePlatform(globalThis.process.platform ?? 'unknown'),
            'X-Stainless-Arch': normalizeArch(globalThis.process.arch ?? 'unknown'),
            'X-Stainless-Runtime': 'node',
            'X-Stainless-Runtime-Version': globalThis.process.version ?? 'unknown'
        };
    }
    const browserInfo = getBrowserInfo();
    if (browserInfo) {
        return {
            'X-Stainless-Lang': 'js',
            'X-Stainless-Package-Version': __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$version$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["VERSION"],
            'X-Stainless-OS': 'Unknown',
            'X-Stainless-Arch': 'unknown',
            'X-Stainless-Runtime': `browser:${browserInfo.browser}`,
            'X-Stainless-Runtime-Version': browserInfo.version
        };
    }
    // TODO add support for Cloudflare workers, etc.
    return {
        'X-Stainless-Lang': 'js',
        'X-Stainless-Package-Version': __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$version$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["VERSION"],
        'X-Stainless-OS': 'Unknown',
        'X-Stainless-Arch': 'unknown',
        'X-Stainless-Runtime': 'unknown',
        'X-Stainless-Runtime-Version': 'unknown'
    };
};
// Note: modified from https://github.com/JS-DevTools/host-environment/blob/b1ab79ecde37db5d6e163c050e54fe7d287d7c92/src/isomorphic.browser.ts
function getBrowserInfo() {
    if (typeof navigator === 'undefined' || !navigator) {
        return null;
    }
    // NOTE: The order matters here!
    const browserPatterns = [
        {
            key: 'edge',
            pattern: /Edge(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
        },
        {
            key: 'ie',
            pattern: /MSIE(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
        },
        {
            key: 'ie',
            pattern: /Trident(?:.*rv\:(\d+)\.(\d+)(?:\.(\d+))?)?/
        },
        {
            key: 'chrome',
            pattern: /Chrome(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
        },
        {
            key: 'firefox',
            pattern: /Firefox(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
        },
        {
            key: 'safari',
            pattern: /(?:Version\W+(\d+)\.(\d+)(?:\.(\d+))?)?(?:\W+Mobile\S*)?\W+Safari/
        }
    ];
    // Find the FIRST matching browser
    for (const { key, pattern } of browserPatterns){
        const match = pattern.exec(navigator.userAgent);
        if (match) {
            const major = match[1] || 0;
            const minor = match[2] || 0;
            const patch = match[3] || 0;
            return {
                browser: key,
                version: `${major}.${minor}.${patch}`
            };
        }
    }
    return null;
}
const normalizeArch = (arch)=>{
    // Node docs:
    // - https://nodejs.org/api/process.html#processarch
    // Deno docs:
    // - https://doc.deno.land/deno/stable/~/Deno.build
    if (arch === 'x32') return 'x32';
    if (arch === 'x86_64' || arch === 'x64') return 'x64';
    if (arch === 'arm') return 'arm';
    if (arch === 'aarch64' || arch === 'arm64') return 'arm64';
    if (arch) return `other:${arch}`;
    return 'unknown';
};
const normalizePlatform = (platform)=>{
    // Node platforms:
    // - https://nodejs.org/api/process.html#processplatform
    // Deno platforms:
    // - https://doc.deno.land/deno/stable/~/Deno.build
    // - https://github.com/denoland/deno/issues/14799
    platform = platform.toLowerCase();
    // NOTE: this iOS check is untested and may not work
    // Node does not work natively on IOS, there is a fork at
    // https://github.com/nodejs-mobile/nodejs-mobile
    // however it is unknown at the time of writing how to detect if it is running
    if (platform.includes('ios')) return 'iOS';
    if (platform === 'android') return 'Android';
    if (platform === 'darwin') return 'MacOS';
    if (platform === 'win32') return 'Windows';
    if (platform === 'freebsd') return 'FreeBSD';
    if (platform === 'openbsd') return 'OpenBSD';
    if (platform === 'linux') return 'Linux';
    if (platform) return `Other:${platform}`;
    return 'Unknown';
};
let _platformHeaders;
const getPlatformHeaders = ()=>{
    return _platformHeaders ?? (_platformHeaders = getPlatformProperties());
};
}),
"[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/shims.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
__turbopack_context__.s([
    "CancelReadableStream",
    ()=>CancelReadableStream,
    "ReadableStreamFrom",
    ()=>ReadableStreamFrom,
    "ReadableStreamToAsyncIterable",
    ()=>ReadableStreamToAsyncIterable,
    "getDefaultFetch",
    ()=>getDefaultFetch,
    "makeReadableStream",
    ()=>makeReadableStream
]);
function getDefaultFetch() {
    if (typeof fetch !== 'undefined') {
        return fetch;
    }
    throw new Error('`fetch` is not defined as a global; Either pass `fetch` to the client, `new Groq({ fetch })` or polyfill the global, `globalThis.fetch = fetch`');
}
function makeReadableStream(...args) {
    const ReadableStream = globalThis.ReadableStream;
    if (typeof ReadableStream === 'undefined') {
        // Note: All of the platforms / runtimes we officially support already define
        // `ReadableStream` as a global, so this should only ever be hit on unsupported runtimes.
        throw new Error('`ReadableStream` is not defined as a global; You will need to polyfill it, `globalThis.ReadableStream = ReadableStream`');
    }
    return new ReadableStream(...args);
}
function ReadableStreamFrom(iterable) {
    let iter = Symbol.asyncIterator in iterable ? iterable[Symbol.asyncIterator]() : iterable[Symbol.iterator]();
    return makeReadableStream({
        start () {},
        async pull (controller) {
            const { done, value } = await iter.next();
            if (done) {
                controller.close();
            } else {
                controller.enqueue(value);
            }
        },
        async cancel () {
            await iter.return?.();
        }
    });
}
function ReadableStreamToAsyncIterable(stream) {
    if (stream[Symbol.asyncIterator]) return stream;
    const reader = stream.getReader();
    return {
        async next () {
            try {
                const result = await reader.read();
                if (result?.done) reader.releaseLock(); // release lock when stream becomes closed
                return result;
            } catch (e) {
                reader.releaseLock(); // release lock when stream becomes errored
                throw e;
            }
        },
        async return () {
            const cancelPromise = reader.cancel();
            reader.releaseLock();
            await cancelPromise;
            return {
                done: true,
                value: undefined
            };
        },
        [Symbol.asyncIterator] () {
            return this;
        }
    };
}
async function CancelReadableStream(stream) {
    if (stream === null || typeof stream !== 'object') return;
    if (stream[Symbol.asyncIterator]) {
        await stream[Symbol.asyncIterator]().return?.();
        return;
    }
    const reader = stream.getReader();
    const cancelPromise = reader.cancel();
    reader.releaseLock();
    await cancelPromise;
}
}),
"[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/request-options.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
__turbopack_context__.s([
    "FallbackEncoder",
    ()=>FallbackEncoder
]);
const FallbackEncoder = ({ headers, body })=>{
    return {
        bodyHeaders: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(body)
    };
};
}),
"[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/utils/query.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "stringifyQuery",
    ()=>stringifyQuery
]);
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/core/error.mjs [app-rsc] (ecmascript)");
;
function stringifyQuery(query) {
    return Object.entries(query).filter(([_, value])=>typeof value !== 'undefined').map(([key, value])=>{
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        }
        if (value === null) {
            return `${encodeURIComponent(key)}=`;
        }
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["GroqError"](`Cannot stringify type ${typeof value}; Expected string, number, boolean, or null. If you need to pass nested query parameters, you can manually encode them, e.g. { query: { 'foo[key1]': value1, 'foo[key2]': value2 } }, and please open a GitHub issue requesting better support for your use case.`);
    }).join('&');
}
}),
"[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/uploads.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkFileSupport",
    ()=>checkFileSupport,
    "createForm",
    ()=>createForm,
    "getName",
    ()=>getName,
    "isAsyncIterable",
    ()=>isAsyncIterable,
    "makeFile",
    ()=>makeFile,
    "maybeMultipartFormRequestOptions",
    ()=>maybeMultipartFormRequestOptions,
    "multipartFormRequestOptions",
    ()=>multipartFormRequestOptions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$shims$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/shims.mjs [app-rsc] (ecmascript)");
;
const checkFileSupport = ()=>{
    if (typeof File === 'undefined') {
        const { process } = globalThis;
        const isOldNode = typeof process?.versions?.node === 'string' && parseInt(process.versions.node.split('.')) < 20;
        throw new Error('`File` is not defined as a global, which is required for file uploads.' + (isOldNode ? " Update to Node 20 LTS or newer, or set `globalThis.File` to `import('node:buffer').File`." : ''));
    }
};
function makeFile(fileBits, fileName, options) {
    checkFileSupport();
    return new File(fileBits, fileName ?? 'unknown_file', options);
}
function getName(value) {
    return (typeof value === 'object' && value !== null && ('name' in value && value.name && String(value.name) || 'url' in value && value.url && String(value.url) || 'filename' in value && value.filename && String(value.filename) || 'path' in value && value.path && String(value.path)) || '').split(/[\\/]/).pop() || undefined;
}
const isAsyncIterable = (value)=>value != null && typeof value === 'object' && typeof value[Symbol.asyncIterator] === 'function';
const maybeMultipartFormRequestOptions = async (opts, fetch)=>{
    if (!hasUploadableValue(opts.body)) return opts;
    return {
        ...opts,
        body: await createForm(opts.body, fetch)
    };
};
const multipartFormRequestOptions = async (opts, fetch)=>{
    return {
        ...opts,
        body: await createForm(opts.body, fetch)
    };
};
const supportsFormDataMap = /* @__PURE__ */ new WeakMap();
/**
 * node-fetch doesn't support the global FormData object in recent node versions. Instead of sending
 * properly-encoded form data, it just stringifies the object, resulting in a request body of "[object FormData]".
 * This function detects if the fetch function provided supports the global FormData object to avoid
 * confusing error messages later on.
 */ function supportsFormData(fetchObject) {
    const fetch = typeof fetchObject === 'function' ? fetchObject : fetchObject.fetch;
    const cached = supportsFormDataMap.get(fetch);
    if (cached) return cached;
    const promise = (async ()=>{
        try {
            const FetchResponse = 'Response' in fetch ? fetch.Response : (await fetch('data:,')).constructor;
            const data = new FormData();
            if (data.toString() === await new FetchResponse(data).text()) {
                return false;
            }
            return true;
        } catch  {
            // avoid false negatives
            return true;
        }
    })();
    supportsFormDataMap.set(fetch, promise);
    return promise;
}
const createForm = async (body, fetch)=>{
    if (!await supportsFormData(fetch)) {
        throw new TypeError('The provided fetch function does not support file uploads with the current global FormData class.');
    }
    const form = new FormData();
    await Promise.all(Object.entries(body || {}).map(([key, value])=>addFormValue(form, key, value)));
    return form;
};
// We check for Blob not File because Bun.File doesn't inherit from File,
// but they both inherit from Blob and have a `name` property at runtime.
const isNamedBlob = (value)=>value instanceof Blob && 'name' in value;
const isUploadable = (value)=>typeof value === 'object' && value !== null && (value instanceof Response || isAsyncIterable(value) || isNamedBlob(value));
const hasUploadableValue = (value)=>{
    if (isUploadable(value)) return true;
    if (Array.isArray(value)) return value.some(hasUploadableValue);
    if (value && typeof value === 'object') {
        for(const k in value){
            if (hasUploadableValue(value[k])) return true;
        }
    }
    return false;
};
const addFormValue = async (form, key, value)=>{
    if (value === undefined) return;
    if (value == null) {
        throw new TypeError(`Received null for "${key}"; to pass null in FormData, you must use the string 'null'`);
    }
    // TODO: make nested formats configurable
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        form.append(key, String(value));
    } else if (value instanceof Response) {
        form.append(key, makeFile([
            await value.blob()
        ], getName(value)));
    } else if (isAsyncIterable(value)) {
        form.append(key, makeFile([
            await new Response((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$shims$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ReadableStreamFrom"])(value)).blob()
        ], getName(value)));
    } else if (isNamedBlob(value)) {
        form.append(key, value, getName(value));
    } else if (Array.isArray(value)) {
        await Promise.all(value.map((entry)=>addFormValue(form, key + '[]', entry)));
    } else if (typeof value === 'object') {
        await Promise.all(Object.entries(value).map(([name, prop])=>addFormValue(form, `${key}[${name}]`, prop)));
    } else {
        throw new TypeError(`Invalid value given to form, expected a string, number, boolean, object, Array, File or Blob but got ${value} instead`);
    }
};
}),
"[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/to-file.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "toFile",
    ()=>toFile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$uploads$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/uploads.mjs [app-rsc] (ecmascript)");
;
;
/**
 * This check adds the arrayBuffer() method type because it is available and used at runtime
 */ const isBlobLike = (value)=>value != null && typeof value === 'object' && typeof value.size === 'number' && typeof value.type === 'string' && typeof value.text === 'function' && typeof value.slice === 'function' && typeof value.arrayBuffer === 'function';
/**
 * This check adds the arrayBuffer() method type because it is available and used at runtime
 */ const isFileLike = (value)=>value != null && typeof value === 'object' && typeof value.name === 'string' && typeof value.lastModified === 'number' && isBlobLike(value);
const isResponseLike = (value)=>value != null && typeof value === 'object' && typeof value.url === 'string' && typeof value.blob === 'function';
async function toFile(value, name, options) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$uploads$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["checkFileSupport"])();
    // If it's a promise, resolve it.
    value = await value;
    // If we've been given a `File` we don't need to do anything
    if (isFileLike(value)) {
        if (value instanceof File) {
            return value;
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$uploads$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["makeFile"])([
            await value.arrayBuffer()
        ], value.name);
    }
    if (isResponseLike(value)) {
        const blob = await value.blob();
        name || (name = new URL(value.url).pathname.split(/[\\/]/).pop());
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$uploads$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["makeFile"])(await getBytes(blob), name, options);
    }
    const parts = await getBytes(value);
    name || (name = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$uploads$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getName"])(value));
    if (!options?.type) {
        const type = parts.find((part)=>typeof part === 'object' && 'type' in part && part.type);
        if (typeof type === 'string') {
            options = {
                ...options,
                type
            };
        }
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$uploads$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["makeFile"])(parts, name, options);
}
async function getBytes(value) {
    let parts = [];
    if (typeof value === 'string' || ArrayBuffer.isView(value) || // includes Uint8Array, Buffer, etc.
    value instanceof ArrayBuffer) {
        parts.push(value);
    } else if (isBlobLike(value)) {
        parts.push(value instanceof Blob ? value : await value.arrayBuffer());
    } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$uploads$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isAsyncIterable"])(value) // includes Readable, ReadableStream, etc.
    ) {
        for await (const chunk of value){
            parts.push(...await getBytes(chunk)); // TODO, consider validating?
        }
    } else {
        const constructor = value?.constructor?.name;
        throw new Error(`Unexpected data type: ${typeof value}${constructor ? `; constructor: ${constructor}` : ''}${propsForError(value)}`);
    }
    return parts;
}
function propsForError(value) {
    if (typeof value !== 'object' || value === null) return '';
    const props = Object.getOwnPropertyNames(value);
    return `; props: [${props.map((p)=>`"${p}"`).join(', ')}]`;
}
}),
"[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/core/uploads.mjs [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$to$2d$file$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/to-file.mjs [app-rsc] (ecmascript)");
;
}),
"[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/core/resource.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
__turbopack_context__.s([
    "APIResource",
    ()=>APIResource
]);
class APIResource {
    constructor(client){
        this._client = client;
    }
}
}),
"[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/headers.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildHeaders",
    ()=>buildHeaders,
    "isEmptyHeaders",
    ()=>isEmptyHeaders
]);
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$values$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/utils/values.mjs [app-rsc] (ecmascript)");
;
const brand_privateNullableHeaders = /* @__PURE__ */ Symbol('brand.privateNullableHeaders');
function* iterateHeaders(headers) {
    if (!headers) return;
    if (brand_privateNullableHeaders in headers) {
        const { values, nulls } = headers;
        yield* values.entries();
        for (const name of nulls){
            yield [
                name,
                null
            ];
        }
        return;
    }
    let shouldClear = false;
    let iter;
    if (headers instanceof Headers) {
        iter = headers.entries();
    } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$values$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isReadonlyArray"])(headers)) {
        iter = headers;
    } else {
        shouldClear = true;
        iter = Object.entries(headers ?? {});
    }
    for (let row of iter){
        const name = row[0];
        if (typeof name !== 'string') throw new TypeError('expected header name to be a string');
        const values = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$values$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isReadonlyArray"])(row[1]) ? row[1] : [
            row[1]
        ];
        let didClear = false;
        for (const value of values){
            if (value === undefined) continue;
            // Objects keys always overwrite older headers, they never append.
            // Yield a null to clear the header before adding the new values.
            if (shouldClear && !didClear) {
                didClear = true;
                yield [
                    name,
                    null
                ];
            }
            yield [
                name,
                value
            ];
        }
    }
}
const buildHeaders = (newHeaders)=>{
    const targetHeaders = new Headers();
    const nullHeaders = new Set();
    for (const headers of newHeaders){
        const seenHeaders = new Set();
        for (const [name, value] of iterateHeaders(headers)){
            const lowerName = name.toLowerCase();
            if (!seenHeaders.has(lowerName)) {
                targetHeaders.delete(name);
                seenHeaders.add(lowerName);
            }
            if (value === null) {
                targetHeaders.delete(name);
                nullHeaders.add(lowerName);
            } else {
                targetHeaders.append(name, value);
                nullHeaders.delete(lowerName);
            }
        }
    }
    return {
        [brand_privateNullableHeaders]: true,
        values: targetHeaders,
        nulls: nullHeaders
    };
};
const isEmptyHeaders = (headers)=>{
    for (const _ of iterateHeaders(headers))return false;
    return true;
};
}),
"[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/resources/audio/speech.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Speech",
    ()=>Speech
]);
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$resource$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/core/resource.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$headers$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/headers.mjs [app-rsc] (ecmascript)");
;
;
class Speech extends __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$resource$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["APIResource"] {
    /**
     * Generates audio from the input text.
     *
     * @example
     * ```ts
     * const speech = await client.audio.speech.create({
     *   input: 'The quick brown fox jumped over the lazy dog',
     *   model: 'playai-tts',
     *   voice: 'Fritz-PlayAI',
     * });
     *
     * const content = await speech.blob();
     * console.log(content);
     * ```
     */ create(body, options) {
        return this._client.post('/openai/v1/audio/speech', {
            body,
            ...options,
            headers: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$headers$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["buildHeaders"])([
                {
                    Accept: 'audio/wav'
                },
                options?.headers
            ]),
            __binaryResponse: true
        });
    }
}
}),
"[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/resources/audio/transcriptions.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Transcriptions",
    ()=>Transcriptions
]);
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$resource$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/core/resource.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$uploads$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/uploads.mjs [app-rsc] (ecmascript)");
;
;
class Transcriptions extends __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$resource$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["APIResource"] {
    /**
     * Transcribes audio into the input language.
     *
     * @example
     * ```ts
     * const transcription =
     *   await client.audio.transcriptions.create({
     *     model: 'whisper-large-v3-turbo',
     *   });
     * ```
     */ create(body, options) {
        return this._client.post('/openai/v1/audio/transcriptions', (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$uploads$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["multipartFormRequestOptions"])({
            body,
            ...options
        }, this._client));
    }
}
}),
"[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/resources/audio/translations.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Translations",
    ()=>Translations
]);
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$resource$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/core/resource.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$uploads$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/uploads.mjs [app-rsc] (ecmascript)");
;
;
class Translations extends __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$resource$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["APIResource"] {
    /**
     * Translates audio into English.
     *
     * @example
     * ```ts
     * const translation = await client.audio.translations.create({
     *   model: 'whisper-large-v3-turbo',
     * });
     * ```
     */ create(body, options) {
        return this._client.post('/openai/v1/audio/translations', (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$uploads$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["multipartFormRequestOptions"])({
            body,
            ...options
        }, this._client));
    }
}
}),
"[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/resources/audio/audio.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Audio",
    ()=>Audio
]);
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$resource$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/core/resource.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$resources$2f$audio$2f$speech$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/resources/audio/speech.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$resources$2f$audio$2f$transcriptions$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/resources/audio/transcriptions.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$resources$2f$audio$2f$translations$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/resources/audio/translations.mjs [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
class Audio extends __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$resource$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["APIResource"] {
    constructor(){
        super(...arguments);
        this.speech = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$resources$2f$audio$2f$speech$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Speech"](this._client);
        this.transcriptions = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$resources$2f$audio$2f$transcriptions$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Transcriptions"](this._client);
        this.translations = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$resources$2f$audio$2f$translations$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Translations"](this._client);
    }
}
Audio.Speech = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$resources$2f$audio$2f$speech$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Speech"];
Audio.Transcriptions = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$resources$2f$audio$2f$transcriptions$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Transcriptions"];
Audio.Translations = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$resources$2f$audio$2f$translations$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Translations"];
}),
"[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/utils/path.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createPathTagFunction",
    ()=>createPathTagFunction,
    "encodeURIPath",
    ()=>encodeURIPath,
    "path",
    ()=>path
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/core/error.mjs [app-rsc] (ecmascript)");
;
function encodeURIPath(str) {
    return str.replace(/[^A-Za-z0-9\-._~!$&'()*+,;=:@]+/g, encodeURIComponent);
}
const EMPTY = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.create(null));
const createPathTagFunction = (pathEncoder = encodeURIPath)=>function path(statics, ...params) {
        // If there are no params, no processing is needed.
        if (statics.length === 1) return statics[0];
        let postPath = false;
        const invalidSegments = [];
        const path1 = statics.reduce((previousValue, currentValue, index)=>{
            if (/[?#]/.test(currentValue)) {
                postPath = true;
            }
            const value = params[index];
            let encoded = (postPath ? encodeURIComponent : pathEncoder)('' + value);
            if (index !== params.length && (value == null || typeof value === 'object' && // handle values from other realms
            value.toString === Object.getPrototypeOf(Object.getPrototypeOf(value.hasOwnProperty ?? EMPTY) ?? EMPTY)?.toString)) {
                encoded = value + '';
                invalidSegments.push({
                    start: previousValue.length + currentValue.length,
                    length: encoded.length,
                    error: `Value of type ${Object.prototype.toString.call(value).slice(8, -1)} is not a valid path parameter`
                });
            }
            return previousValue + currentValue + (index === params.length ? '' : encoded);
        }, '');
        const pathOnly = path1.split(/[?#]/, 1)[0];
        const invalidSegmentPattern = /(?<=^|\/)(?:\.|%2e){1,2}(?=\/|$)/gi;
        let match;
        // Find all invalid segments
        while((match = invalidSegmentPattern.exec(pathOnly)) !== null){
            invalidSegments.push({
                start: match.index,
                length: match[0].length,
                error: `Value "${match[0]}" can\'t be safely passed as a path parameter`
            });
        }
        invalidSegments.sort((a, b)=>a.start - b.start);
        if (invalidSegments.length > 0) {
            let lastEnd = 0;
            const underline = invalidSegments.reduce((acc, segment)=>{
                const spaces = ' '.repeat(segment.start - lastEnd);
                const arrows = '^'.repeat(segment.length);
                lastEnd = segment.start + segment.length;
                return acc + spaces + arrows;
            }, '');
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["GroqError"](`Path parameters result in path with invalid segments:\n${invalidSegments.map((e)=>e.error).join('\n')}\n${path1}\n${underline}`);
        }
        return path1;
    };
const path = /* @__PURE__ */ createPathTagFunction(encodeURIPath);
}),
"[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/resources/batches.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Batches",
    ()=>Batches
]);
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$resource$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/core/resource.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$path$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/utils/path.mjs [app-rsc] (ecmascript)");
;
;
class Batches extends __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$resource$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["APIResource"] {
    /**
     * Creates and executes a batch from an uploaded file of requests.
     * [Learn more](/docs/batch).
     */ create(body, options) {
        return this._client.post('/openai/v1/batches', {
            body,
            ...options
        });
    }
    /**
     * Retrieves a batch.
     */ retrieve(batchID, options) {
        return this._client.get(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$path$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["path"]`/openai/v1/batches/${batchID}`, options);
    }
    /**
     * List your organization's batches.
     */ list(options) {
        return this._client.get('/openai/v1/batches', options);
    }
    /**
     * Cancels a batch.
     */ cancel(batchID, options) {
        return this._client.post(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$path$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["path"]`/openai/v1/batches/${batchID}/cancel`, options);
    }
}
}),
"[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/resources/chat/completions.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Completions",
    ()=>Completions
]);
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$resource$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/core/resource.mjs [app-rsc] (ecmascript)");
;
class Completions extends __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$resource$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["APIResource"] {
    create(body, options) {
        return this._client.post('/openai/v1/chat/completions', {
            body,
            ...options,
            stream: body.stream ?? false
        });
    }
}
}),
"[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/resources/chat/chat.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Chat",
    ()=>Chat
]);
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$resource$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/core/resource.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$resources$2f$chat$2f$completions$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/resources/chat/completions.mjs [app-rsc] (ecmascript)");
;
;
;
class Chat extends __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$resource$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["APIResource"] {
    constructor(){
        super(...arguments);
        this.completions = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$resources$2f$chat$2f$completions$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Completions"](this._client);
    }
}
Chat.Completions = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$resources$2f$chat$2f$completions$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Completions"];
}),
"[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/resources/completions.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Completions",
    ()=>Completions
]);
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$resource$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/core/resource.mjs [app-rsc] (ecmascript)");
;
class Completions extends __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$resource$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["APIResource"] {
}
}),
"[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/resources/embeddings.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Embeddings",
    ()=>Embeddings
]);
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$resource$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/core/resource.mjs [app-rsc] (ecmascript)");
;
class Embeddings extends __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$resource$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["APIResource"] {
    /**
     * Creates an embedding vector representing the input text.
     *
     * @example
     * ```ts
     * const createEmbeddingResponse =
     *   await client.embeddings.create({
     *     input: 'The quick brown fox jumped over the lazy dog',
     *     model: 'nomic-embed-text-v1_5',
     *   });
     * ```
     */ create(body, options) {
        return this._client.post('/openai/v1/embeddings', {
            body,
            ...options
        });
    }
}
}),
"[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/resources/files.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Files",
    ()=>Files
]);
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$resource$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/core/resource.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$headers$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/headers.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$uploads$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/uploads.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$path$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/utils/path.mjs [app-rsc] (ecmascript)");
;
;
;
;
class Files extends __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$resource$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["APIResource"] {
    /**
     * Upload a file that can be used across various endpoints.
     *
     * The Batch API only supports `.jsonl` files up to 100 MB in size. The input also
     * has a specific required [format](/docs/batch).
     *
     * Please contact us if you need to increase these storage limits.
     */ create(body, options) {
        return this._client.post('/openai/v1/files', (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$uploads$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["multipartFormRequestOptions"])({
            body,
            ...options
        }, this._client));
    }
    /**
     * Returns a list of files.
     */ list(options) {
        return this._client.get('/openai/v1/files', options);
    }
    /**
     * Delete a file.
     */ delete(fileID, options) {
        return this._client.delete(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$path$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["path"]`/openai/v1/files/${fileID}`, options);
    }
    /**
     * Returns the contents of the specified file.
     */ content(fileID, options) {
        return this._client.get(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$path$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["path"]`/openai/v1/files/${fileID}/content`, {
            ...options,
            headers: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$headers$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["buildHeaders"])([
                {
                    Accept: 'application/octet-stream'
                },
                options?.headers
            ]),
            __binaryResponse: true
        });
    }
    /**
     * Returns information about a file.
     */ info(fileID, options) {
        return this._client.get(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$path$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["path"]`/openai/v1/files/${fileID}`, options);
    }
}
}),
"[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/resources/models.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Models",
    ()=>Models
]);
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$resource$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/core/resource.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$path$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/utils/path.mjs [app-rsc] (ecmascript)");
;
;
class Models extends __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$resource$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["APIResource"] {
    /**
     * Get a specific model
     */ retrieve(model, options) {
        return this._client.get(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$path$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["path"]`/openai/v1/models/${model}`, options);
    }
    /**
     * get all available models
     */ list(options) {
        return this._client.get('/openai/v1/models', options);
    }
    /**
     * Delete a model
     */ delete(model, options) {
        return this._client.delete(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$path$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["path"]`/openai/v1/models/${model}`, options);
    }
}
}),
"[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/resources/index.mjs [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$resources$2f$audio$2f$audio$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/resources/audio/audio.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$resources$2f$batches$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/resources/batches.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$resources$2f$chat$2f$chat$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/resources/chat/chat.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$resources$2f$completions$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/resources/completions.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$resources$2f$embeddings$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/resources/embeddings.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$resources$2f$files$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/resources/files.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$resources$2f$models$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/resources/models.mjs [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
}),
"[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/utils/bytes.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "concatBytes",
    ()=>concatBytes,
    "decodeUTF8",
    ()=>decodeUTF8,
    "encodeUTF8",
    ()=>encodeUTF8
]);
function concatBytes(buffers) {
    let length = 0;
    for (const buffer of buffers){
        length += buffer.length;
    }
    const output = new Uint8Array(length);
    let index = 0;
    for (const buffer of buffers){
        output.set(buffer, index);
        index += buffer.length;
    }
    return output;
}
let encodeUTF8_;
function encodeUTF8(str) {
    let encoder;
    return (encodeUTF8_ ?? (encoder = new globalThis.TextEncoder(), encodeUTF8_ = encoder.encode.bind(encoder)))(str);
}
let decodeUTF8_;
function decodeUTF8(bytes) {
    let decoder;
    return (decodeUTF8_ ?? (decoder = new globalThis.TextDecoder(), decodeUTF8_ = decoder.decode.bind(decoder)))(bytes);
}
}),
"[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/decoders/line.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LineDecoder",
    ()=>LineDecoder,
    "findDoubleNewlineIndex",
    ()=>findDoubleNewlineIndex
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$tslib$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/tslib.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$bytes$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/utils/bytes.mjs [app-rsc] (ecmascript)");
var _LineDecoder_buffer, _LineDecoder_carriageReturnIndex;
;
;
class LineDecoder {
    constructor(){
        _LineDecoder_buffer.set(this, void 0);
        _LineDecoder_carriageReturnIndex.set(this, void 0);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$tslib$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["__classPrivateFieldSet"])(this, _LineDecoder_buffer, new Uint8Array(), "f");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$tslib$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["__classPrivateFieldSet"])(this, _LineDecoder_carriageReturnIndex, null, "f");
    }
    decode(chunk) {
        if (chunk == null) {
            return [];
        }
        const binaryChunk = chunk instanceof ArrayBuffer ? new Uint8Array(chunk) : typeof chunk === 'string' ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$bytes$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["encodeUTF8"])(chunk) : chunk;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$tslib$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["__classPrivateFieldSet"])(this, _LineDecoder_buffer, (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$bytes$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["concatBytes"])([
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$tslib$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["__classPrivateFieldGet"])(this, _LineDecoder_buffer, "f"),
            binaryChunk
        ]), "f");
        const lines = [];
        let patternIndex;
        while((patternIndex = findNewlineIndex((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$tslib$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["__classPrivateFieldGet"])(this, _LineDecoder_buffer, "f"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$tslib$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["__classPrivateFieldGet"])(this, _LineDecoder_carriageReturnIndex, "f"))) != null){
            if (patternIndex.carriage && (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$tslib$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["__classPrivateFieldGet"])(this, _LineDecoder_carriageReturnIndex, "f") == null) {
                // skip until we either get a corresponding `\n`, a new `\r` or nothing
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$tslib$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["__classPrivateFieldSet"])(this, _LineDecoder_carriageReturnIndex, patternIndex.index, "f");
                continue;
            }
            // we got double \r or \rtext\n
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$tslib$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["__classPrivateFieldGet"])(this, _LineDecoder_carriageReturnIndex, "f") != null && (patternIndex.index !== (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$tslib$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["__classPrivateFieldGet"])(this, _LineDecoder_carriageReturnIndex, "f") + 1 || patternIndex.carriage)) {
                lines.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$bytes$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["decodeUTF8"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$tslib$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["__classPrivateFieldGet"])(this, _LineDecoder_buffer, "f").subarray(0, (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$tslib$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["__classPrivateFieldGet"])(this, _LineDecoder_carriageReturnIndex, "f") - 1)));
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$tslib$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["__classPrivateFieldSet"])(this, _LineDecoder_buffer, (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$tslib$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["__classPrivateFieldGet"])(this, _LineDecoder_buffer, "f").subarray((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$tslib$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["__classPrivateFieldGet"])(this, _LineDecoder_carriageReturnIndex, "f")), "f");
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$tslib$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["__classPrivateFieldSet"])(this, _LineDecoder_carriageReturnIndex, null, "f");
                continue;
            }
            const endIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$tslib$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["__classPrivateFieldGet"])(this, _LineDecoder_carriageReturnIndex, "f") !== null ? patternIndex.preceding - 1 : patternIndex.preceding;
            const line = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$bytes$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["decodeUTF8"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$tslib$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["__classPrivateFieldGet"])(this, _LineDecoder_buffer, "f").subarray(0, endIndex));
            lines.push(line);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$tslib$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["__classPrivateFieldSet"])(this, _LineDecoder_buffer, (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$tslib$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["__classPrivateFieldGet"])(this, _LineDecoder_buffer, "f").subarray(patternIndex.index), "f");
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$tslib$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["__classPrivateFieldSet"])(this, _LineDecoder_carriageReturnIndex, null, "f");
        }
        return lines;
    }
    flush() {
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$tslib$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["__classPrivateFieldGet"])(this, _LineDecoder_buffer, "f").length) {
            return [];
        }
        return this.decode('\n');
    }
}
_LineDecoder_buffer = new WeakMap(), _LineDecoder_carriageReturnIndex = new WeakMap();
// prettier-ignore
LineDecoder.NEWLINE_CHARS = new Set([
    '\n',
    '\r'
]);
LineDecoder.NEWLINE_REGEXP = /\r\n|[\n\r]/g;
/**
 * This function searches the buffer for the end patterns, (\r or \n)
 * and returns an object with the index preceding the matched newline and the
 * index after the newline char. `null` is returned if no new line is found.
 *
 * ```ts
 * findNewLineIndex('abc\ndef') -> { preceding: 2, index: 3 }
 * ```
 */ function findNewlineIndex(buffer, startIndex) {
    const newline = 0x0a; // \n
    const carriage = 0x0d; // \r
    for(let i = startIndex ?? 0; i < buffer.length; i++){
        if (buffer[i] === newline) {
            return {
                preceding: i,
                index: i + 1,
                carriage: false
            };
        }
        if (buffer[i] === carriage) {
            return {
                preceding: i,
                index: i + 1,
                carriage: true
            };
        }
    }
    return null;
}
function findDoubleNewlineIndex(buffer) {
    // This function searches the buffer for the end patterns (\r\r, \n\n, \r\n\r\n)
    // and returns the index right after the first occurrence of any pattern,
    // or -1 if none of the patterns are found.
    const newline = 0x0a; // \n
    const carriage = 0x0d; // \r
    for(let i = 0; i < buffer.length - 1; i++){
        if (buffer[i] === newline && buffer[i + 1] === newline) {
            // \n\n
            return i + 2;
        }
        if (buffer[i] === carriage && buffer[i + 1] === carriage) {
            // \r\r
            return i + 2;
        }
        if (buffer[i] === carriage && buffer[i + 1] === newline && i + 3 < buffer.length && buffer[i + 2] === carriage && buffer[i + 3] === newline) {
            // \r\n\r\n
            return i + 4;
        }
    }
    return -1;
}
}),
"[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/utils/log.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatRequestDetails",
    ()=>formatRequestDetails,
    "loggerFor",
    ()=>loggerFor,
    "parseLogLevel",
    ()=>parseLogLevel
]);
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$values$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/utils/values.mjs [app-rsc] (ecmascript)");
;
const levelNumbers = {
    off: 0,
    error: 200,
    warn: 300,
    info: 400,
    debug: 500
};
const parseLogLevel = (maybeLevel, sourceName, client)=>{
    if (!maybeLevel) {
        return undefined;
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$values$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["hasOwn"])(levelNumbers, maybeLevel)) {
        return maybeLevel;
    }
    loggerFor(client).warn(`${sourceName} was set to ${JSON.stringify(maybeLevel)}, expected one of ${JSON.stringify(Object.keys(levelNumbers))}`);
    return undefined;
};
function noop() {}
function makeLogFn(fnLevel, logger, logLevel) {
    if (!logger || levelNumbers[fnLevel] > levelNumbers[logLevel]) {
        return noop;
    } else {
        // Don't wrap logger functions, we want the stacktrace intact!
        return logger[fnLevel].bind(logger);
    }
}
const noopLogger = {
    error: noop,
    warn: noop,
    info: noop,
    debug: noop
};
let cachedLoggers = /* @__PURE__ */ new WeakMap();
function loggerFor(client) {
    const logger = client.logger;
    const logLevel = client.logLevel ?? 'off';
    if (!logger) {
        return noopLogger;
    }
    const cachedLogger = cachedLoggers.get(logger);
    if (cachedLogger && cachedLogger[0] === logLevel) {
        return cachedLogger[1];
    }
    const levelLogger = {
        error: makeLogFn('error', logger, logLevel),
        warn: makeLogFn('warn', logger, logLevel),
        info: makeLogFn('info', logger, logLevel),
        debug: makeLogFn('debug', logger, logLevel)
    };
    cachedLoggers.set(logger, [
        logLevel,
        levelLogger
    ]);
    return levelLogger;
}
const formatRequestDetails = (details)=>{
    if (details.options) {
        details.options = {
            ...details.options
        };
        delete details.options['headers']; // redundant + leaks internals
    }
    if (details.headers) {
        details.headers = Object.fromEntries((details.headers instanceof Headers ? [
            ...details.headers
        ] : Object.entries(details.headers)).map(([name, value])=>[
                name,
                name.toLowerCase() === 'authorization' || name.toLowerCase() === 'cookie' || name.toLowerCase() === 'set-cookie' ? '***' : value
            ]));
    }
    if ('retryOfRequestLogID' in details) {
        if (details.retryOfRequestLogID) {
            details.retryOf = details.retryOfRequestLogID;
        }
        delete details.retryOfRequestLogID;
    }
    return details;
};
}),
"[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/core/streaming.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Stream",
    ()=>Stream,
    "_iterSSEMessages",
    ()=>_iterSSEMessages
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$tslib$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/tslib.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/core/error.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$shims$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/shims.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$decoders$2f$line$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/decoders/line.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$errors$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/errors.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$bytes$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/utils/bytes.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$log$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/utils/log.mjs [app-rsc] (ecmascript)");
var _Stream_client;
;
;
;
;
;
;
;
;
;
class Stream {
    constructor(iterator, controller, client){
        this.iterator = iterator;
        _Stream_client.set(this, void 0);
        this.controller = controller;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$tslib$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["__classPrivateFieldSet"])(this, _Stream_client, client, "f");
    }
    static fromSSEResponse(response, controller, client) {
        let consumed = false;
        const logger = client ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$log$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["loggerFor"])(client) : console;
        async function* iterator() {
            if (consumed) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["GroqError"]('Cannot iterate over a consumed stream, use `.tee()` to split the stream.');
            }
            consumed = true;
            let done = false;
            try {
                for await (const sse of _iterSSEMessages(response, controller)){
                    if (done) continue;
                    if (sse.data.startsWith('[DONE]')) {
                        done = true;
                        continue;
                    }
                    if (sse.event === null || !sse.event.startsWith('thread.')) {
                        let data;
                        try {
                            data = JSON.parse(sse.data);
                        } catch (e) {
                            logger.error(`Could not parse message into JSON:`, sse.data);
                            logger.error(`From chunk:`, sse.raw);
                            throw e;
                        }
                        if (data && data.error) {
                            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["APIError"](undefined, data.error, undefined, response.headers);
                        }
                        yield data;
                    } else {
                        let data;
                        try {
                            data = JSON.parse(sse.data);
                        } catch (e) {
                            console.error(`Could not parse message into JSON:`, sse.data);
                            console.error(`From chunk:`, sse.raw);
                            throw e;
                        }
                        // TODO: Is this where the error should be thrown?
                        if (sse.event == 'error') {
                            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["APIError"](undefined, data.error, data.message, undefined);
                        }
                        yield {
                            event: sse.event,
                            data: data
                        };
                    }
                }
                done = true;
            } catch (e) {
                // If the user calls `stream.controller.abort()`, we should exit without throwing.
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$errors$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isAbortError"])(e)) return;
                throw e;
            } finally{
                // If the user `break`s, abort the ongoing request.
                if (!done) controller.abort();
            }
        }
        return new Stream(iterator, controller, client);
    }
    /**
     * Generates a Stream from a newline-separated ReadableStream
     * where each item is a JSON value.
     */ static fromReadableStream(readableStream, controller, client) {
        let consumed = false;
        async function* iterLines() {
            const lineDecoder = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$decoders$2f$line$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LineDecoder"]();
            const iter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$shims$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ReadableStreamToAsyncIterable"])(readableStream);
            for await (const chunk of iter){
                for (const line of lineDecoder.decode(chunk)){
                    yield line;
                }
            }
            for (const line of lineDecoder.flush()){
                yield line;
            }
        }
        async function* iterator() {
            if (consumed) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["GroqError"]('Cannot iterate over a consumed stream, use `.tee()` to split the stream.');
            }
            consumed = true;
            let done = false;
            try {
                for await (const line of iterLines()){
                    if (done) continue;
                    if (line) yield JSON.parse(line);
                }
                done = true;
            } catch (e) {
                // If the user calls `stream.controller.abort()`, we should exit without throwing.
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$errors$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isAbortError"])(e)) return;
                throw e;
            } finally{
                // If the user `break`s, abort the ongoing request.
                if (!done) controller.abort();
            }
        }
        return new Stream(iterator, controller, client);
    }
    [(_Stream_client = new WeakMap(), Symbol.asyncIterator)]() {
        return this.iterator();
    }
    /**
     * Splits the stream into two streams which can be
     * independently read from at different speeds.
     */ tee() {
        const left = [];
        const right = [];
        const iterator = this.iterator();
        const teeIterator = (queue)=>{
            return {
                next: ()=>{
                    if (queue.length === 0) {
                        const result = iterator.next();
                        left.push(result);
                        right.push(result);
                    }
                    return queue.shift();
                }
            };
        };
        return [
            new Stream(()=>teeIterator(left), this.controller, (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$tslib$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["__classPrivateFieldGet"])(this, _Stream_client, "f")),
            new Stream(()=>teeIterator(right), this.controller, (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$tslib$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["__classPrivateFieldGet"])(this, _Stream_client, "f"))
        ];
    }
    /**
     * Converts this stream to a newline-separated ReadableStream of
     * JSON stringified values in the stream
     * which can be turned back into a Stream with `Stream.fromReadableStream()`.
     */ toReadableStream() {
        const self = this;
        let iter;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$shims$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["makeReadableStream"])({
            async start () {
                iter = self[Symbol.asyncIterator]();
            },
            async pull (ctrl) {
                try {
                    const { value, done } = await iter.next();
                    if (done) return ctrl.close();
                    const bytes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$bytes$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["encodeUTF8"])(JSON.stringify(value) + '\n');
                    ctrl.enqueue(bytes);
                } catch (err) {
                    ctrl.error(err);
                }
            },
            async cancel () {
                await iter.return?.();
            }
        });
    }
}
async function* _iterSSEMessages(response, controller) {
    if (!response.body) {
        controller.abort();
        if (typeof globalThis.navigator !== 'undefined' && globalThis.navigator.product === 'ReactNative') {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["GroqError"](`The default react-native fetch implementation does not support streaming. Please use expo/fetch: https://docs.expo.dev/versions/latest/sdk/expo/#expofetch-api`);
        }
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["GroqError"](`Attempted to iterate over a response with no body`);
    }
    const sseDecoder = new SSEDecoder();
    const lineDecoder = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$decoders$2f$line$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LineDecoder"]();
    const iter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$shims$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ReadableStreamToAsyncIterable"])(response.body);
    for await (const sseChunk of iterSSEChunks(iter)){
        for (const line of lineDecoder.decode(sseChunk)){
            const sse = sseDecoder.decode(line);
            if (sse) yield sse;
        }
    }
    for (const line of lineDecoder.flush()){
        const sse = sseDecoder.decode(line);
        if (sse) yield sse;
    }
}
/**
 * Given an async iterable iterator, iterates over it and yields full
 * SSE chunks, i.e. yields when a double new-line is encountered.
 */ async function* iterSSEChunks(iterator) {
    let data = new Uint8Array();
    for await (const chunk of iterator){
        if (chunk == null) {
            continue;
        }
        const binaryChunk = chunk instanceof ArrayBuffer ? new Uint8Array(chunk) : typeof chunk === 'string' ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$bytes$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["encodeUTF8"])(chunk) : chunk;
        let newData = new Uint8Array(data.length + binaryChunk.length);
        newData.set(data);
        newData.set(binaryChunk, data.length);
        data = newData;
        let patternIndex;
        while((patternIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$decoders$2f$line$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["findDoubleNewlineIndex"])(data)) !== -1){
            yield data.slice(0, patternIndex);
            data = data.slice(patternIndex);
        }
    }
    if (data.length > 0) {
        yield data;
    }
}
class SSEDecoder {
    constructor(){
        this.event = null;
        this.data = [];
        this.chunks = [];
    }
    decode(line) {
        if (line.endsWith('\r')) {
            line = line.substring(0, line.length - 1);
        }
        if (!line) {
            // empty line and we didn't previously encounter any messages
            if (!this.event && !this.data.length) return null;
            const sse = {
                event: this.event,
                data: this.data.join('\n'),
                raw: this.chunks
            };
            this.event = null;
            this.data = [];
            this.chunks = [];
            return sse;
        }
        this.chunks.push(line);
        if (line.startsWith(':')) {
            return null;
        }
        let [fieldname, _, value] = partition(line, ':');
        if (value.startsWith(' ')) {
            value = value.substring(1);
        }
        if (fieldname === 'event') {
            this.event = value;
        } else if (fieldname === 'data') {
            this.data.push(value);
        }
        return null;
    }
}
function partition(str, delimiter) {
    const index = str.indexOf(delimiter);
    if (index !== -1) {
        return [
            str.substring(0, index),
            delimiter,
            str.substring(index + delimiter.length)
        ];
    }
    return [
        str,
        '',
        ''
    ];
}
}),
"[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/parse.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "defaultParseResponse",
    ()=>defaultParseResponse
]);
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$streaming$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/core/streaming.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$log$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/utils/log.mjs [app-rsc] (ecmascript)");
;
;
async function defaultParseResponse(client, props) {
    const { response, requestLogID, retryOfRequestLogID, startTime } = props;
    const body = await (async ()=>{
        // fetch refuses to read the body when the status code is 204.
        if (response.status === 204) {
            return null;
        }
        if (props.options.__binaryResponse) {
            return response;
        }
        if (props.options.stream) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$streaming$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Stream"].fromSSEResponse(response, props.controller, client);
        }
        const contentType = response.headers.get('content-type');
        const mediaType = contentType?.split(';')[0]?.trim();
        const isJSON = mediaType?.includes('application/json') || mediaType?.endsWith('+json');
        if (isJSON) {
            const contentLength = response.headers.get('content-length');
            if (contentLength === '0') {
                // if there is no content we can't do anything
                return undefined;
            }
            const json = await response.json();
            return json;
        }
        const text = await response.text();
        return text;
    })();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$log$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["loggerFor"])(client).debug(`[${requestLogID}] response parsed`, (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$log$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatRequestDetails"])({
        retryOfRequestLogID,
        url: response.url,
        status: response.status,
        body,
        durationMs: Date.now() - startTime
    }));
    return body;
}
}),
"[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/core/api-promise.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "APIPromise",
    ()=>APIPromise
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$tslib$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/tslib.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$parse$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/parse.mjs [app-rsc] (ecmascript)");
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
var _APIPromise_client;
;
;
class APIPromise extends Promise {
    constructor(client, responsePromise, parseResponse = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$parse$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["defaultParseResponse"]){
        super((resolve)=>{
            // this is maybe a bit weird but this has to be a no-op to not implicitly
            // parse the response body; instead .then, .catch, .finally are overridden
            // to parse the response
            resolve(null);
        });
        this.responsePromise = responsePromise;
        this.parseResponse = parseResponse;
        _APIPromise_client.set(this, void 0);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$tslib$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["__classPrivateFieldSet"])(this, _APIPromise_client, client, "f");
    }
    _thenUnwrap(transform) {
        return new APIPromise((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$tslib$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["__classPrivateFieldGet"])(this, _APIPromise_client, "f"), this.responsePromise, async (client, props)=>transform(await this.parseResponse(client, props), props));
    }
    /**
     * Gets the raw `Response` instance instead of parsing the response
     * data.
     *
     * If you want to parse the response body but still get the `Response`
     * instance, you can use {@link withResponse()}.
     *
     * 👋 Getting the wrong TypeScript type for `Response`?
     * Try setting `"moduleResolution": "NodeNext"` or add `"lib": ["DOM"]`
     * to your `tsconfig.json`.
     */ asResponse() {
        return this.responsePromise.then((p)=>p.response);
    }
    /**
     * Gets the parsed response data and the raw `Response` instance.
     *
     * If you just want to get the raw `Response` instance without parsing it,
     * you can use {@link asResponse()}.
     *
     * 👋 Getting the wrong TypeScript type for `Response`?
     * Try setting `"moduleResolution": "NodeNext"` or add `"lib": ["DOM"]`
     * to your `tsconfig.json`.
     */ async withResponse() {
        const [data, response] = await Promise.all([
            this.parse(),
            this.asResponse()
        ]);
        return {
            data,
            response
        };
    }
    parse() {
        if (!this.parsedPromise) {
            this.parsedPromise = this.responsePromise.then((data)=>this.parseResponse((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$tslib$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["__classPrivateFieldGet"])(this, _APIPromise_client, "f"), data));
        }
        return this.parsedPromise;
    }
    then(onfulfilled, onrejected) {
        return this.parse().then(onfulfilled, onrejected);
    }
    catch(onrejected) {
        return this.parse().catch(onrejected);
    }
    finally(onfinally) {
        return this.parse().finally(onfinally);
    }
}
_APIPromise_client = new WeakMap();
}),
"[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/utils/env.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
/**
 * Read an environment variable.
 *
 * Trims beginning and trailing whitespace.
 *
 * Will return undefined if the environment variable doesn't exist or cannot be accessed.
 */ __turbopack_context__.s([
    "readEnv",
    ()=>readEnv
]);
const readEnv = (env)=>{
    if (typeof globalThis.process !== 'undefined') {
        return globalThis.process.env?.[env]?.trim() ?? undefined;
    }
    if (typeof globalThis.Deno !== 'undefined') {
        return globalThis.Deno.env?.get?.(env)?.trim();
    }
    return undefined;
};
}),
"[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/client.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Groq",
    ()=>Groq
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$tslib$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/tslib.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$uuid$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/utils/uuid.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$values$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/utils/values.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$sleep$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/utils/sleep.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$errors$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/errors.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$detect$2d$platform$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/detect-platform.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$shims$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/shims.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$request$2d$options$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/request-options.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$query$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/utils/query.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$version$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/version.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/core/error.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$uploads$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/core/uploads.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$to$2d$file$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/to-file.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$resources$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/resources/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$resources$2f$completions$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/resources/completions.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$resources$2f$chat$2f$chat$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/resources/chat/chat.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$resources$2f$embeddings$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/resources/embeddings.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$resources$2f$audio$2f$audio$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/resources/audio/audio.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$resources$2f$models$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/resources/models.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$resources$2f$batches$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/resources/batches.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$resources$2f$files$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/resources/files.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$api$2d$promise$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/core/api-promise.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$headers$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/headers.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$env$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/utils/env.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$log$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/internal/utils/log.mjs [app-rsc] (ecmascript)");
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
var _Groq_instances, _a, _Groq_encoder, _Groq_baseURLOverridden;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
class Groq {
    /**
     * API Client for interfacing with the Groq API.
     *
     * @param {string | undefined} [opts.apiKey=process.env['GROQ_API_KEY'] ?? undefined]
     * @param {string} [opts.baseURL=process.env['GROQ_BASE_URL'] ?? https://api.groq.com] - Override the default base URL for the API.
     * @param {number} [opts.timeout=1 minute] - The maximum amount of time (in milliseconds) the client will wait for a response before timing out.
     * @param {MergedRequestInit} [opts.fetchOptions] - Additional `RequestInit` options to be passed to `fetch` calls.
     * @param {Fetch} [opts.fetch] - Specify a custom `fetch` function implementation.
     * @param {number} [opts.maxRetries=2] - The maximum number of times the client will retry a request.
     * @param {HeadersLike} opts.defaultHeaders - Default headers to include with every request to the API.
     * @param {Record<string, string | undefined>} opts.defaultQuery - Default query parameters to include with every request to the API.
     * @param {boolean} [opts.dangerouslyAllowBrowser=false] - By default, client-side use of this library is not allowed, as it risks exposing your secret API credentials to attackers.
     */ constructor({ baseURL = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$env$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["readEnv"])('GROQ_BASE_URL'), apiKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$env$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["readEnv"])('GROQ_API_KEY'), ...opts } = {}){
        _Groq_instances.add(this);
        _Groq_encoder.set(this, void 0);
        this.completions = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$resources$2f$completions$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Completions"](this);
        this.chat = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$resources$2f$chat$2f$chat$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Chat"](this);
        this.embeddings = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$resources$2f$embeddings$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Embeddings"](this);
        this.audio = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$resources$2f$audio$2f$audio$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Audio"](this);
        this.models = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$resources$2f$models$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Models"](this);
        this.batches = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$resources$2f$batches$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Batches"](this);
        this.files = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$resources$2f$files$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Files"](this);
        if (apiKey === undefined) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["GroqError"]("The GROQ_API_KEY environment variable is missing or empty; either provide it, or instantiate the Groq client with an apiKey option, like new Groq({ apiKey: 'My API Key' }).");
        }
        const options = {
            apiKey,
            ...opts,
            baseURL: baseURL || `https://api.groq.com`
        };
        if (!options.dangerouslyAllowBrowser && (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$detect$2d$platform$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isRunningInBrowser"])()) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["GroqError"]("It looks like you're running in a browser-like environment.\n\nThis is disabled by default, as it risks exposing your secret API credentials to attackers.\nIf you understand the risks and have appropriate mitigations in place,\nyou can set the `dangerouslyAllowBrowser` option to `true`, e.g.,\n\nnew Groq({ apiKey, dangerouslyAllowBrowser: true })");
        }
        this.baseURL = options.baseURL;
        this.timeout = options.timeout ?? _a.DEFAULT_TIMEOUT /* 1 minute */ ;
        this.logger = options.logger ?? console;
        const defaultLogLevel = 'warn';
        // Set default logLevel early so that we can log a warning in parseLogLevel.
        this.logLevel = defaultLogLevel;
        this.logLevel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$log$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseLogLevel"])(options.logLevel, 'ClientOptions.logLevel', this) ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$log$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseLogLevel"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$env$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["readEnv"])('GROQ_LOG'), "process.env['GROQ_LOG']", this) ?? defaultLogLevel;
        this.fetchOptions = options.fetchOptions;
        this.maxRetries = options.maxRetries ?? 2;
        this.fetch = options.fetch ?? __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$shims$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDefaultFetch"]();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$tslib$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["__classPrivateFieldSet"])(this, _Groq_encoder, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$request$2d$options$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FallbackEncoder"], "f");
        this._options = options;
        this.apiKey = apiKey;
    }
    /**
     * Create a new client instance re-using the same options given to the current client with optional overriding.
     */ withOptions(options) {
        const client = new this.constructor({
            ...this._options,
            baseURL: this.baseURL,
            maxRetries: this.maxRetries,
            timeout: this.timeout,
            logger: this.logger,
            logLevel: this.logLevel,
            fetch: this.fetch,
            fetchOptions: this.fetchOptions,
            apiKey: this.apiKey,
            ...options
        });
        return client;
    }
    defaultQuery() {
        return this._options.defaultQuery;
    }
    validateHeaders({ values, nulls }) {
        return;
    }
    async authHeaders(opts) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$headers$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["buildHeaders"])([
            {
                Authorization: `Bearer ${this.apiKey}`
            }
        ]);
    }
    /**
     * Basic re-implementation of `qs.stringify` for primitive types.
     */ stringifyQuery(query) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$query$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["stringifyQuery"])(query);
    }
    getUserAgent() {
        return `${this.constructor.name}/JS ${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$version$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["VERSION"]}`;
    }
    defaultIdempotencyKey() {
        return `stainless-node-retry-${(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$uuid$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["uuid4"])()}`;
    }
    makeStatusError(status, error, message, headers) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["APIError"].generate(status, error, message, headers);
    }
    buildURL(path, query, defaultBaseURL) {
        const baseURL = !(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$tslib$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["__classPrivateFieldGet"])(this, _Groq_instances, "m", _Groq_baseURLOverridden).call(this) && defaultBaseURL || this.baseURL;
        const url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$values$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isAbsoluteURL"])(path) ? new URL(path) : new URL(baseURL + (baseURL.endsWith('/') && path.startsWith('/') ? path.slice(1) : path));
        const defaultQuery = this.defaultQuery();
        const pathQuery = Object.fromEntries(url.searchParams);
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$values$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isEmptyObj"])(defaultQuery) || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$values$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isEmptyObj"])(pathQuery)) {
            query = {
                ...pathQuery,
                ...defaultQuery,
                ...query
            };
        }
        if (typeof query === 'object' && query && !Array.isArray(query)) {
            url.search = this.stringifyQuery(query);
        }
        return url.toString();
    }
    /**
     * Used as a callback for mutating the given `FinalRequestOptions` object.
     */ async prepareOptions(options) {}
    /**
     * Used as a callback for mutating the given `RequestInit` object.
     *
     * This is useful for cases where you want to add certain headers based off of
     * the request properties, e.g. `method` or `url`.
     */ async prepareRequest(request, { url, options }) {}
    get(path, opts) {
        return this.methodRequest('get', path, opts);
    }
    post(path, opts) {
        return this.methodRequest('post', path, opts);
    }
    patch(path, opts) {
        return this.methodRequest('patch', path, opts);
    }
    put(path, opts) {
        return this.methodRequest('put', path, opts);
    }
    delete(path, opts) {
        return this.methodRequest('delete', path, opts);
    }
    methodRequest(method, path, opts) {
        return this.request(Promise.resolve(opts).then((opts)=>{
            return {
                method,
                path,
                ...opts
            };
        }));
    }
    request(options, remainingRetries = null) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$api$2d$promise$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["APIPromise"](this, this.makeRequest(options, remainingRetries, undefined));
    }
    async makeRequest(optionsInput, retriesRemaining, retryOfRequestLogID) {
        const options = await optionsInput;
        const maxRetries = options.maxRetries ?? this.maxRetries;
        if (retriesRemaining == null) {
            retriesRemaining = maxRetries;
        }
        await this.prepareOptions(options);
        const { req, url, timeout } = await this.buildRequest(options, {
            retryCount: maxRetries - retriesRemaining
        });
        await this.prepareRequest(req, {
            url,
            options
        });
        /** Not an API request ID, just for correlating local log entries. */ const requestLogID = 'log_' + (Math.random() * (1 << 24) | 0).toString(16).padStart(6, '0');
        const retryLogStr = retryOfRequestLogID === undefined ? '' : `, retryOf: ${retryOfRequestLogID}`;
        const startTime = Date.now();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$log$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["loggerFor"])(this).debug(`[${requestLogID}] sending request`, (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$log$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatRequestDetails"])({
            retryOfRequestLogID,
            method: options.method,
            url,
            options,
            headers: req.headers
        }));
        if (options.signal?.aborted) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["APIUserAbortError"]();
        }
        const controller = new AbortController();
        const response = await this.fetchWithTimeout(url, req, timeout, controller).catch(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$errors$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["castToError"]);
        const headersTime = Date.now();
        if (response instanceof globalThis.Error) {
            const retryMessage = `retrying, ${retriesRemaining} attempts remaining`;
            if (options.signal?.aborted) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["APIUserAbortError"]();
            }
            // detect native connection timeout errors
            // deno throws "TypeError: error sending request for url (https://example/): client error (Connect): tcp connect error: Operation timed out (os error 60): Operation timed out (os error 60)"
            // undici throws "TypeError: fetch failed" with cause "ConnectTimeoutError: Connect Timeout Error (attempted address: example:443, timeout: 1ms)"
            // others do not provide enough information to distinguish timeouts from other connection errors
            const isTimeout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$errors$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isAbortError"])(response) || /timed? ?out/i.test(String(response) + ('cause' in response ? String(response.cause) : ''));
            if (retriesRemaining) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$log$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["loggerFor"])(this).info(`[${requestLogID}] connection ${isTimeout ? 'timed out' : 'failed'} - ${retryMessage}`);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$log$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["loggerFor"])(this).debug(`[${requestLogID}] connection ${isTimeout ? 'timed out' : 'failed'} (${retryMessage})`, (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$log$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatRequestDetails"])({
                    retryOfRequestLogID,
                    url,
                    durationMs: headersTime - startTime,
                    message: response.message
                }));
                return this.retryRequest(options, retriesRemaining, retryOfRequestLogID ?? requestLogID);
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$log$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["loggerFor"])(this).info(`[${requestLogID}] connection ${isTimeout ? 'timed out' : 'failed'} - error; no more retries left`);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$log$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["loggerFor"])(this).debug(`[${requestLogID}] connection ${isTimeout ? 'timed out' : 'failed'} (error; no more retries left)`, (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$log$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatRequestDetails"])({
                retryOfRequestLogID,
                url,
                durationMs: headersTime - startTime,
                message: response.message
            }));
            if (isTimeout) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["APIConnectionTimeoutError"]();
            }
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["APIConnectionError"]({
                cause: response
            });
        }
        const responseInfo = `[${requestLogID}${retryLogStr}] ${req.method} ${url} ${response.ok ? 'succeeded' : 'failed'} with status ${response.status} in ${headersTime - startTime}ms`;
        if (!response.ok) {
            const shouldRetry = await this.shouldRetry(response);
            if (retriesRemaining && shouldRetry) {
                const retryMessage = `retrying, ${retriesRemaining} attempts remaining`;
                // We don't need the body of this response.
                await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$shims$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CancelReadableStream"](response.body);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$log$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["loggerFor"])(this).info(`${responseInfo} - ${retryMessage}`);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$log$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["loggerFor"])(this).debug(`[${requestLogID}] response error (${retryMessage})`, (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$log$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatRequestDetails"])({
                    retryOfRequestLogID,
                    url: response.url,
                    status: response.status,
                    headers: response.headers,
                    durationMs: headersTime - startTime
                }));
                return this.retryRequest(options, retriesRemaining, retryOfRequestLogID ?? requestLogID, response.headers);
            }
            const retryMessage = shouldRetry ? `error; no more retries left` : `error; not retryable`;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$log$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["loggerFor"])(this).info(`${responseInfo} - ${retryMessage}`);
            const errText = await response.text().catch((err)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$errors$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["castToError"])(err).message);
            const errJSON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$values$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["safeJSON"])(errText);
            const errMessage = errJSON ? undefined : errText;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$log$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["loggerFor"])(this).debug(`[${requestLogID}] response error (${retryMessage})`, (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$log$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatRequestDetails"])({
                retryOfRequestLogID,
                url: response.url,
                status: response.status,
                headers: response.headers,
                message: errMessage,
                durationMs: Date.now() - startTime
            }));
            const err = this.makeStatusError(response.status, errJSON, errMessage, response.headers);
            throw err;
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$log$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["loggerFor"])(this).info(responseInfo);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$log$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["loggerFor"])(this).debug(`[${requestLogID}] response start`, (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$log$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatRequestDetails"])({
            retryOfRequestLogID,
            url: response.url,
            status: response.status,
            headers: response.headers,
            durationMs: headersTime - startTime
        }));
        return {
            response,
            options,
            controller,
            requestLogID,
            retryOfRequestLogID,
            startTime
        };
    }
    async fetchWithTimeout(url, init, ms, controller) {
        const { signal, method, ...options } = init || {};
        const abort = this._makeAbort(controller);
        if (signal) signal.addEventListener('abort', abort, {
            once: true
        });
        const timeout = setTimeout(abort, ms);
        const isReadableBody = globalThis.ReadableStream && options.body instanceof globalThis.ReadableStream || typeof options.body === 'object' && options.body !== null && Symbol.asyncIterator in options.body;
        const fetchOptions = {
            signal: controller.signal,
            ...isReadableBody ? {
                duplex: 'half'
            } : {},
            method: 'GET',
            ...options
        };
        if (method) {
            // Custom methods like 'patch' need to be uppercased
            // See https://github.com/nodejs/undici/issues/2294
            fetchOptions.method = method.toUpperCase();
        }
        try {
            // use undefined this binding; fetch errors if bound to something else in browser/cloudflare
            return await this.fetch.call(undefined, url, fetchOptions);
        } finally{
            clearTimeout(timeout);
        }
    }
    async shouldRetry(response) {
        // Note this is not a standard header.
        const shouldRetryHeader = response.headers.get('x-should-retry');
        // If the server explicitly says whether or not to retry, obey.
        if (shouldRetryHeader === 'true') return true;
        if (shouldRetryHeader === 'false') return false;
        // Retry on request timeouts.
        if (response.status === 408) return true;
        // Retry on lock timeouts.
        if (response.status === 409) return true;
        // Retry on rate limits.
        if (response.status === 429) return true;
        // Retry internal errors.
        if (response.status >= 500) return true;
        return false;
    }
    async retryRequest(options, retriesRemaining, requestLogID, responseHeaders) {
        let timeoutMillis;
        // Note the `retry-after-ms` header may not be standard, but is a good idea and we'd like proactive support for it.
        const retryAfterMillisHeader = responseHeaders?.get('retry-after-ms');
        if (retryAfterMillisHeader) {
            const timeoutMs = parseFloat(retryAfterMillisHeader);
            if (!Number.isNaN(timeoutMs)) {
                timeoutMillis = timeoutMs;
            }
        }
        // About the Retry-After header: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After
        const retryAfterHeader = responseHeaders?.get('retry-after');
        if (retryAfterHeader && !timeoutMillis) {
            const timeoutSeconds = parseFloat(retryAfterHeader);
            if (!Number.isNaN(timeoutSeconds)) {
                timeoutMillis = timeoutSeconds * 1000;
            } else {
                timeoutMillis = Date.parse(retryAfterHeader) - Date.now();
            }
        }
        // If the API asks us to wait a certain amount of time, just do what it
        // says, but otherwise calculate a default
        if (timeoutMillis === undefined) {
            const maxRetries = options.maxRetries ?? this.maxRetries;
            timeoutMillis = this.calculateDefaultRetryTimeoutMillis(retriesRemaining, maxRetries);
        }
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$sleep$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sleep"])(timeoutMillis);
        return this.makeRequest(options, retriesRemaining - 1, requestLogID);
    }
    calculateDefaultRetryTimeoutMillis(retriesRemaining, maxRetries) {
        const initialRetryDelay = 0.5;
        const maxRetryDelay = 8.0;
        const numRetries = maxRetries - retriesRemaining;
        // Apply exponential backoff, but not more than the max.
        const sleepSeconds = Math.min(initialRetryDelay * Math.pow(2, numRetries), maxRetryDelay);
        // Apply some jitter, take up to at most 25 percent of the retry time.
        const jitter = 1 - Math.random() * 0.25;
        return sleepSeconds * jitter * 1000;
    }
    async buildRequest(inputOptions, { retryCount = 0 } = {}) {
        const options = {
            ...inputOptions
        };
        const { method, path, query, defaultBaseURL } = options;
        const url = this.buildURL(path, query, defaultBaseURL);
        if ('timeout' in options) (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$utils$2f$values$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validatePositiveInteger"])('timeout', options.timeout);
        options.timeout = options.timeout ?? this.timeout;
        const { bodyHeaders, body } = this.buildBody({
            options
        });
        const reqHeaders = await this.buildHeaders({
            options: inputOptions,
            method,
            bodyHeaders,
            retryCount
        });
        const req = {
            method,
            headers: reqHeaders,
            ...options.signal && {
                signal: options.signal
            },
            ...globalThis.ReadableStream && body instanceof globalThis.ReadableStream && {
                duplex: 'half'
            },
            ...body && {
                body
            },
            ...this.fetchOptions ?? {},
            ...options.fetchOptions ?? {}
        };
        return {
            req,
            url,
            timeout: options.timeout
        };
    }
    async buildHeaders({ options, method, bodyHeaders, retryCount }) {
        let idempotencyHeaders = {};
        if (this.idempotencyHeader && method !== 'get') {
            if (!options.idempotencyKey) options.idempotencyKey = this.defaultIdempotencyKey();
            idempotencyHeaders[this.idempotencyHeader] = options.idempotencyKey;
        }
        const headers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$headers$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["buildHeaders"])([
            idempotencyHeaders,
            {
                Accept: 'application/json',
                'User-Agent': this.getUserAgent(),
                'X-Stainless-Retry-Count': String(retryCount),
                ...options.timeout ? {
                    'X-Stainless-Timeout': String(Math.trunc(options.timeout / 1000))
                } : {},
                ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$detect$2d$platform$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPlatformHeaders"])()
            },
            await this.authHeaders(options),
            this._options.defaultHeaders,
            bodyHeaders,
            options.headers
        ]);
        this.validateHeaders(headers);
        return headers.values;
    }
    _makeAbort(controller) {
        // note: we can't just inline this method inside `fetchWithTimeout()` because then the closure
        //       would capture all request options, and cause a memory leak.
        return ()=>controller.abort();
    }
    buildBody({ options: { body, headers: rawHeaders } }) {
        if (!body) {
            return {
                bodyHeaders: undefined,
                body: undefined
            };
        }
        const headers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$headers$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["buildHeaders"])([
            rawHeaders
        ]);
        if (// Pass raw type verbatim
        ArrayBuffer.isView(body) || body instanceof ArrayBuffer || body instanceof DataView || typeof body === 'string' && // Preserve legacy string encoding behavior for now
        headers.values.has('content-type') || globalThis.Blob && body instanceof globalThis.Blob || // `FormData` -> `multipart/form-data`
        body instanceof FormData || // `URLSearchParams` -> `application/x-www-form-urlencoded`
        body instanceof URLSearchParams || globalThis.ReadableStream && body instanceof globalThis.ReadableStream) {
            return {
                bodyHeaders: undefined,
                body: body
            };
        } else if (typeof body === 'object' && (Symbol.asyncIterator in body || Symbol.iterator in body && 'next' in body && typeof body.next === 'function')) {
            return {
                bodyHeaders: undefined,
                body: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$shims$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ReadableStreamFrom"](body)
            };
        } else if (typeof body === 'object' && headers.values.get('content-type') === 'application/x-www-form-urlencoded') {
            return {
                bodyHeaders: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                body: this.stringifyQuery(body)
            };
        } else {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$tslib$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["__classPrivateFieldGet"])(this, _Groq_encoder, "f").call(this, {
                body,
                headers
            });
        }
    }
}
_a = Groq, _Groq_encoder = new WeakMap(), _Groq_instances = new WeakSet(), _Groq_baseURLOverridden = function _Groq_baseURLOverridden() {
    return this.baseURL !== 'https://api.groq.com';
};
Groq.Groq = _a;
Groq.DEFAULT_TIMEOUT = 60000; // 1 minute
Groq.GroqError = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["GroqError"];
Groq.APIError = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["APIError"];
Groq.APIConnectionError = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["APIConnectionError"];
Groq.APIConnectionTimeoutError = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["APIConnectionTimeoutError"];
Groq.APIUserAbortError = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["APIUserAbortError"];
Groq.NotFoundError = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["NotFoundError"];
Groq.ConflictError = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ConflictError"];
Groq.RateLimitError = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["RateLimitError"];
Groq.BadRequestError = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BadRequestError"];
Groq.AuthenticationError = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AuthenticationError"];
Groq.InternalServerError = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["InternalServerError"];
Groq.PermissionDeniedError = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PermissionDeniedError"];
Groq.UnprocessableEntityError = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UnprocessableEntityError"];
Groq.toFile = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$internal$2f$to$2d$file$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toFile"];
Groq.Completions = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$resources$2f$completions$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Completions"];
Groq.Chat = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$resources$2f$chat$2f$chat$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Chat"];
Groq.Embeddings = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$resources$2f$embeddings$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Embeddings"];
Groq.Audio = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$resources$2f$audio$2f$audio$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Audio"];
Groq.Models = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$resources$2f$models$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Models"];
Groq.Batches = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$resources$2f$batches$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Batches"];
Groq.Files = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$resources$2f$files$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Files"];
}),
"[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/index.mjs [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$client$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/client.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$uploads$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/core/uploads.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$api$2d$promise$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/core/api-promise.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/core/error.mjs [app-rsc] (ecmascript)");
;
;
;
;
;
}),
"[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/client.mjs [app-rsc] (ecmascript) <export Groq as default>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$client$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Groq"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$TheEnglishClass$2f$node_modules$2f$groq$2d$sdk$2f$client$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/TheEnglishClass/node_modules/groq-sdk/client.mjs [app-rsc] (ecmascript)");
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

//# sourceMappingURL=%5Broot-of-the-server%5D__0jqsjx.._.js.map