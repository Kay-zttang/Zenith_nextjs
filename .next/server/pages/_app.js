const CHUNK_PUBLIC_PATH = "server/pages/_app.js";
const runtime = require("../chunks/ssr/[turbopack]_runtime.js");
runtime.loadChunk("server/chunks/ssr/[root of the server]__8bd32b._.js");
module.exports = runtime.getOrInstantiateRuntimeModule("[project]/node_modules/.pnpm/next@15.2.0-canary.29_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/app.js [ssr] (ecmascript)", CHUNK_PUBLIC_PATH).exports;
