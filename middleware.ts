// Compatibility shim: Next.js 15 reads middleware.ts; Next.js 16 reads proxy.ts.
// Re-export from src/proxy.ts so both work.
export { proxy as middleware, config } from "./src/proxy";
