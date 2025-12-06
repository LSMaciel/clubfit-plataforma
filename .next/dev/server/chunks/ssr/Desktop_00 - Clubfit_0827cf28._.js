module.exports = [
"[project]/Desktop/00 - Clubfit/utils/supabase/admin.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createAdminClient",
    ()=>createAdminClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$esm$2f$wrapper$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/node_modules/@supabase/supabase-js/dist/esm/wrapper.mjs [app-rsc] (ecmascript)");
;
function createAdminClient() {
    const supabaseUrl = ("TURBOPACK compile-time value", "https://huxwjxzuhrhrdyvzlgnx.supabase.co");
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY não definida no .env.local');
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$esm$2f$wrapper$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}
}),
"[project]/Desktop/00 - Clubfit/utils/auth-student.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createStudentSession",
    ()=>createStudentSession,
    "decryptStudentSession",
    ()=>decryptStudentSession,
    "deleteStudentSession",
    ()=>deleteStudentSession,
    "encryptStudentSession",
    ()=>encryptStudentSession,
    "getStudentSession",
    ()=>getStudentSession
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/node_modules/jose/dist/webapi/jwt/sign.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/node_modules/jose/dist/webapi/jwt/verify.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/node_modules/next/headers.js [app-rsc] (ecmascript)");
;
;
const SECRET_KEY = process.env.SUPABASE_JWT_SECRET || 'fallback-secret-key-change-me';
const key = new TextEncoder().encode(SECRET_KEY);
async function encryptStudentSession(payload) {
    return await new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SignJWT"](payload).setProtectedHeader({
        alg: 'HS256'
    }).setIssuedAt().setExpirationTime('30d') // Longa duração para "App" feel
    .sign(key);
}
async function decryptStudentSession(input) {
    try {
        const { payload } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jwtVerify"])(input, key, {
            algorithms: [
                'HS256'
            ]
        });
        return payload;
    } catch (error) {
        return null;
    }
}
async function getStudentSession() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const token = cookieStore.get('clubfit-student-token')?.value;
    if (!token) return null;
    return await decryptStudentSession(token);
}
async function createStudentSession(studentId, academyId) {
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 dias
    ;
    const session = await encryptStudentSession({
        studentId,
        academyId,
        expires
    });
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.set('clubfit-student-token', session, {
        httpOnly: true,
        secure: ("TURBOPACK compile-time value", "development") === 'production',
        expires,
        sameSite: 'lax',
        path: '/'
    });
}
async function deleteStudentSession() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.delete('clubfit-student-token');
}
}),
"[project]/Desktop/00 - Clubfit/app/student/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"00980c37bd9f8ce217a40afb0ab34ebb1a906d2b42":"studentLogout","40448c53ce001ac14e0381464897f62f18f222d153":"studentLogin"},"",""] */ __turbopack_context__.s([
    "studentLogin",
    ()=>studentLogin,
    "studentLogout",
    ()=>studentLogout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/utils/supabase/admin.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$utils$2f$auth$2d$student$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/utils/auth-student.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
async function studentLogin(formData) {
    const rawCpf = formData.get('cpf');
    if (!rawCpf) return {
        error: 'CPF é obrigatório.'
    };
    // Clean CPF
    const cpf = rawCpf.replace(/\D/g, '');
    if (cpf.length !== 11) return {
        error: 'CPF inválido.'
    };
    const supabaseAdmin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminClient"])();
    // 1. Buscar Aluno (Admin Client para bypass RLS)
    // Precisamos encontrar se esse CPF existe e está ativo.
    const { data: student, error } = await supabaseAdmin.from('students').select('id, academy_id, full_name, status').eq('cpf', cpf).single();
    if (error || !student) {
        return {
            error: 'CPF não encontrado. Verifique se digitou corretamente.'
        };
    }
    if (student.status !== 'ACTIVE') {
        return {
            error: 'Seu cadastro está inativo. Procure a recepção da academia.'
        };
    }
    // 2. Criar Sessão
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$utils$2f$auth$2d$student$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createStudentSession"])(student.id, student.academy_id);
    // 3. Redirecionar
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/student/dashboard');
}
async function studentLogout() {
    const { deleteStudentSession } = await __turbopack_context__.A("[project]/Desktop/00 - Clubfit/utils/auth-student.ts [app-rsc] (ecmascript, async loader)");
    await deleteStudentSession();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/student/login');
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    studentLogin,
    studentLogout
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(studentLogin, "40448c53ce001ac14e0381464897f62f18f222d153", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(studentLogout, "00980c37bd9f8ce217a40afb0ab34ebb1a906d2b42", null);
}),
"[project]/Desktop/00 - Clubfit/.next-internal/server/app/student/login/page/actions.js { ACTIONS_MODULE0 => \"[project]/Desktop/00 - Clubfit/app/student/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$app$2f$student$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/app/student/actions.ts [app-rsc] (ecmascript)");
;
}),
"[project]/Desktop/00 - Clubfit/.next-internal/server/app/student/login/page/actions.js { ACTIONS_MODULE0 => \"[project]/Desktop/00 - Clubfit/app/student/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "40448c53ce001ac14e0381464897f62f18f222d153",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$app$2f$student$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["studentLogin"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f2e$next$2d$internal$2f$server$2f$app$2f$student$2f$login$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$app$2f$student$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/Desktop/00 - Clubfit/.next-internal/server/app/student/login/page/actions.js { ACTIONS_MODULE0 => "[project]/Desktop/00 - Clubfit/app/student/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$app$2f$student$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/app/student/actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=Desktop_00%20-%20Clubfit_0827cf28._.js.map