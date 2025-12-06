(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__e9b801db._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/Desktop/00 - Clubfit/utils/supabase/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "updateSession",
    ()=>updateSession
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/node_modules/@supabase/ssr/dist/module/index.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/node_modules/@supabase/ssr/dist/module/createServerClient.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
;
;
async function updateSession(request) {
    let response = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next({
        request: {
            headers: request.headers
        }
    });
    let supabase;
    try {
        supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["createServerClient"])(("TURBOPACK compile-time value", "https://huxwjxzuhrhrdyvzlgnx.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1eHdqeHp1aHJocmR5dnpsZ254Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4MjU0NzQsImV4cCI6MjA3NDQwMTQ3NH0.zyMrpeFv-4Js3E2_ml538_IffkyBAyornWaLpa0-lSc"), {
            cookies: {
                get (name) {
                    return request.cookies.get(name)?.value;
                },
                set (name, value, options) {
                    request.cookies.set({
                        name,
                        value,
                        ...options
                    });
                    response = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next({
                        request: {
                            headers: request.headers
                        }
                    });
                    response.cookies.set({
                        name,
                        value,
                        ...options
                    });
                },
                remove (name, options) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options
                    });
                    response = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next({
                        request: {
                            headers: request.headers
                        }
                    });
                    response.cookies.set({
                        name,
                        value: '',
                        ...options
                    });
                }
            }
        });
    } catch (e) {
        // If Supabase keys are missing, just convert to next() to allow page load
        console.error('Supabase init failed:', e);
        return response;
    }
    // Refresh session if expired
    const start = performance.now();
    const { data: { user } } = await supabase.auth.getUser();
    const end = performance.now();
    response.headers.set('x-middleware-auth-latency', (end - start).toFixed(0) + 'ms');
    // PROTEÇÃO DE ROTAS ADMIN
    // Se tentar acessar /admin e não estiver logado, manda pro login
    if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/admin/login', request.url));
        }
    }
    // Se estiver logado e tentar ir pro login, manda pro dashboard
    if (request.nextUrl.pathname === '/admin/login' && user) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/admin/dashboard', request.url));
    }
    return response;
}
}),
"[project]/Desktop/00 - Clubfit/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$utils$2f$supabase$2f$middleware$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/utils/supabase/middleware.ts [middleware-edge] (ecmascript)");
;
;
async function middleware(request) {
    const requestUrl = new URL(request.url);
    const isStudentRoute = requestUrl.pathname.startsWith('/student');
    if (isStudentRoute) {
        // Lógica Específica para Área do Aluno (Token Customizado)
        const token = request.cookies.get('clubfit-student-token')?.value;
        const isLoginPage = requestUrl.pathname === '/student/login';
        if (!token && !isLoginPage) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/student/login', request.url));
        }
        if (token && isLoginPage) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/student/dashboard', request.url));
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // Lógica Padrão (Admin/Supabase)
    return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$utils$2f$supabase$2f$middleware$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["updateSession"])(request);
}
const config = {
    matcher: [
        /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */ '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__e9b801db._.js.map