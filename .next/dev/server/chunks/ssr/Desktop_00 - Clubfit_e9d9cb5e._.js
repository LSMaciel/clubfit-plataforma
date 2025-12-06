module.exports = [
"[project]/Desktop/00 - Clubfit/utils/supabase/server.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/node_modules/@supabase/ssr/dist/module/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/node_modules/next/headers.js [app-rsc] (ecmascript)");
;
;
async function createClient() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerClient"])(("TURBOPACK compile-time value", "https://huxwjxzuhrhrdyvzlgnx.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1eHdqeHp1aHJocmR5dnpsZ254Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4MjU0NzQsImV4cCI6MjA3NDQwMTQ3NH0.zyMrpeFv-4Js3E2_ml538_IffkyBAyornWaLpa0-lSc"), {
        cookies: {
            get (name) {
                return cookieStore.get(name)?.value;
            },
            set (name, value, options) {
                try {
                    cookieStore.set({
                        name,
                        value,
                        ...options
                    });
                } catch (error) {
                // The `set` method was called from a Server Component.
                // This can be ignored if you have middleware refreshing
                // user sessions.
                }
            },
            remove (name, options) {
                try {
                    cookieStore.set({
                        name,
                        value: '',
                        ...options
                    });
                } catch (error) {
                // The `delete` method was called from a Server Component.
                // This can be ignored if you have middleware refreshing
                // user sessions.
                }
            }
        }
    });
}
}),
"[project]/Desktop/00 - Clubfit/utils/formatters.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cleanCPF",
    ()=>cleanCPF,
    "formatCPF",
    ()=>formatCPF
]);
function cleanCPF(cpf) {
    return cpf.replace(/\D/g, '');
}
function formatCPF(cpf) {
    const cleaned = cleanCPF(cpf);
    if (cleaned.length !== 11) return cpf // Retorna original se formato inválido
    ;
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}
}),
"[project]/Desktop/00 - Clubfit/app/admin/students/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"6079b67df52634303c47bf90cf4e30cd4c69425cb2":"createStudent"},"",""] */ __turbopack_context__.s([
    "createStudent",
    ()=>createStudent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/utils/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$utils$2f$formatters$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/utils/formatters.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
async function createStudent(prevState, formData) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    // 1. Verificar Autenticação e Permissão
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return {
        error: 'Não autenticado.'
    };
    const { data: profile } = await supabase.from('users').select('role, academy_id').eq('id', user.id).single();
    if (!profile || ![
        'ACADEMY_ADMIN',
        'SUPER_ADMIN'
    ].includes(profile.role)) {
        return {
            error: 'Permissão negada. Apenas administradores podem cadastrar alunos.'
        };
    }
    // 2. Coletar e Limpar Dados
    const fullName = formData.get('full_name');
    const rawCpf = formData.get('cpf');
    const email = formData.get('email');
    const phone = formData.get('phone');
    if (!fullName || !rawCpf) {
        return {
            error: 'Nome e CPF são obrigatórios.'
        };
    }
    const cpf = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$utils$2f$formatters$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cleanCPF"])(rawCpf);
    // Validação simples de tamanho (MVP)
    if (cpf.length !== 11) {
        return {
            error: 'O CPF deve conter exatamente 11 dígitos.'
        };
    }
    // 3. Inserir no Banco
    const { error: insertError } = await supabase.from('students').insert({
        academy_id: profile.academy_id,
        full_name: fullName,
        cpf: cpf,
        email: email || null,
        phone: phone || null,
        status: 'ACTIVE'
    });
    if (insertError) {
        // Tratamento de Erro Específico: CPF Duplicado (constraint unique_cpf)
        if (insertError.code === '23505') {
            return {
                error: 'Este CPF já está cadastrado no sistema ClubFit.'
            };
        }
        console.error('Erro Student:', insertError);
        return {
            error: 'Erro ao cadastrar aluno.'
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/admin/students');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/admin/students');
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    createStudent
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createStudent, "6079b67df52634303c47bf90cf4e30cd4c69425cb2", null);
}),
"[project]/Desktop/00 - Clubfit/.next-internal/server/app/admin/students/new/page/actions.js { ACTIONS_MODULE0 => \"[project]/Desktop/00 - Clubfit/app/admin/students/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$app$2f$admin$2f$students$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/app/admin/students/actions.ts [app-rsc] (ecmascript)");
;
}),
"[project]/Desktop/00 - Clubfit/.next-internal/server/app/admin/students/new/page/actions.js { ACTIONS_MODULE0 => \"[project]/Desktop/00 - Clubfit/app/admin/students/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "6079b67df52634303c47bf90cf4e30cd4c69425cb2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$app$2f$admin$2f$students$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createStudent"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$students$2f$new$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$app$2f$admin$2f$students$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/Desktop/00 - Clubfit/.next-internal/server/app/admin/students/new/page/actions.js { ACTIONS_MODULE0 => "[project]/Desktop/00 - Clubfit/app/admin/students/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$app$2f$admin$2f$students$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/app/admin/students/actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=Desktop_00%20-%20Clubfit_e9d9cb5e._.js.map