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
"[project]/Desktop/00 - Clubfit/app/admin/partners/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"60514a3ddea3266cfcdf3103871e42321907cb34e1":"createPartner"},"",""] */ __turbopack_context__.s([
    "createPartner",
    ()=>createPartner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/utils/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/utils/supabase/admin.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
async function createPartner(prevState, formData) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const supabaseAdmin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminClient"])();
    // 1. Identificar quem está logado (O Admin da Academia)
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) return {
        error: 'Não autenticado.'
    };
    // Buscar dados do perfil para saber qual academia ele gerencia
    const { data: adminProfile } = await supabase.from('users').select('role, academy_id').eq('id', currentUser.id).single();
    // Validação de Permissão
    if (!adminProfile || ![
        'ACADEMY_ADMIN',
        'SUPER_ADMIN'
    ].includes(adminProfile.role)) {
        return {
            error: 'Permissão negada. Apenas Admins de Academia podem cadastrar parceiros.'
        };
    }
    if (!adminProfile.academy_id) {
        return {
            error: 'Usuário não vinculado a uma academia.'
        };
    }
    // 2. Dados do Formulário
    // 3. Dados do Formulário
    const partnerName = formData.get('partner_name');
    const description = formData.get('description');
    // Legacy address (manter compatibilidade se o form enviar)
    const legacyAddress = formData.get('address');
    // Novos Campos de Endereço V2
    const zipCode = formData.get('zip_code');
    const street = formData.get('street');
    const number = formData.get('number');
    const neighborhood = formData.get('neighborhood');
    const city = formData.get('city');
    const state = formData.get('state');
    const complement = formData.get('complement');
    // Tratamento de Lat/Long (podem vir vazios)
    const latStr = formData.get('latitude');
    const lngStr = formData.get('longitude');
    const latitude = latStr ? parseFloat(latStr) : null;
    const longitude = lngStr ? parseFloat(lngStr) : null;
    const ownerName = formData.get('owner_name');
    const ownerEmail = formData.get('owner_email');
    const ownerPassword = formData.get('owner_password');
    // Validação básica (mantendo compatibilidade: apenas campos antigos obrigatórios por enquanto)
    if (!partnerName || !ownerEmail || !ownerPassword || !ownerName) {
        return {
            error: 'Preencha todos os campos obrigatórios.'
        };
    }
    // 3. Criar Usuário Auth (Usando Admin Client para não perder sessão atual)
    // email_confirm: true evita que o usuário fique preso no envio de email
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: ownerEmail,
        password: ownerPassword,
        email_confirm: true,
        user_metadata: {
            full_name: ownerName
        }
    });
    if (authError) {
        console.error('Erro Auth:', authError);
        return {
            error: `Erro ao criar login: ${authError.message}`
        };
    }
    const newUserId = authData.user.id;
    // 4. Criar Perfil Público (public.users)
    const { error: profileError } = await supabaseAdmin.from('users').insert({
        id: newUserId,
        name: ownerName,
        role: 'PARTNER',
        academy_id: adminProfile.academy_id
    });
    if (profileError) {
        // Rollback manual (deletar user criado se falhar perfil)
        await supabaseAdmin.auth.admin.deleteUser(newUserId);
        console.error('Erro Profile:', profileError);
        return {
            error: 'Erro ao criar perfil do parceiro.'
        };
    }
    // 5. Criar Registro do Parceiro (public.partners)
    const { error: partnerError } = await supabaseAdmin.from('partners').insert({
        academy_id: adminProfile.academy_id,
        owner_id: newUserId,
        name: partnerName,
        address: legacyAddress,
        description: description,
        // Novos campos
        zip_code: zipCode || null,
        street: street || null,
        number: number || null,
        neighborhood: neighborhood || null,
        city: city || null,
        state: state || null,
        complement: complement || null,
        latitude: latitude,
        longitude: longitude
    });
    if (partnerError) {
        console.error('Erro Partner:', partnerError);
        return {
            error: 'Erro ao criar dados da empresa parceira.'
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/admin/partners');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/admin/partners');
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    createPartner
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createPartner, "60514a3ddea3266cfcdf3103871e42321907cb34e1", null);
}),
"[project]/Desktop/00 - Clubfit/.next-internal/server/app/admin/partners/new/page/actions.js { ACTIONS_MODULE0 => \"[project]/Desktop/00 - Clubfit/app/admin/partners/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$app$2f$admin$2f$partners$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/app/admin/partners/actions.ts [app-rsc] (ecmascript)");
;
}),
"[project]/Desktop/00 - Clubfit/.next-internal/server/app/admin/partners/new/page/actions.js { ACTIONS_MODULE0 => \"[project]/Desktop/00 - Clubfit/app/admin/partners/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "60514a3ddea3266cfcdf3103871e42321907cb34e1",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$app$2f$admin$2f$partners$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createPartner"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$partners$2f$new$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$app$2f$admin$2f$partners$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/Desktop/00 - Clubfit/.next-internal/server/app/admin/partners/new/page/actions.js { ACTIONS_MODULE0 => "[project]/Desktop/00 - Clubfit/app/admin/partners/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$app$2f$admin$2f$partners$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/app/admin/partners/actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=Desktop_00%20-%20Clubfit_5de017e6._.js.map