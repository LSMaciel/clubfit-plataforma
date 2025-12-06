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
"[project]/Desktop/00 - Clubfit/app/admin/academies/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"60405e5bfaa4757d29e06921e10ebab2e022fc2fe1":"createAcademy"},"",""] */ __turbopack_context__.s([
    "createAcademy",
    ()=>createAcademy
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/utils/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
async function createAcademy(prevState, formData) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    // 1. Verificação de Segurança (Apenas Super Admin)
    const { data: userData } = await supabase.from('users').select('role').single();
    if (userData?.role !== 'SUPER_ADMIN') {
        return {
            error: 'Permissão negada.'
        };
    }
    const name = formData.get('name');
    const slug = formData.get('slug');
    const primaryColor = formData.get('primary_color');
    const logoFile = formData.get('logo');
    // Novos Campos de Endereço V2
    const zipCode = formData.get('zip_code');
    const street = formData.get('street');
    const number = formData.get('number');
    const neighborhood = formData.get('neighborhood');
    const city = formData.get('city');
    const state = formData.get('state');
    const complement = formData.get('complement');
    // Tratamento de Lat/Long
    const latStr = formData.get('latitude');
    const lngStr = formData.get('longitude');
    const latitude = latStr ? parseFloat(latStr) : null;
    const longitude = lngStr ? parseFloat(lngStr) : null;
    // 2. Validações Básicas
    if (!name || !slug) {
        return {
            error: 'Nome e Slug são obrigatórios.'
        };
    }
    // Validar formato do slug (apenas letras minúsculas e hifens)
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(slug)) {
        return {
            error: 'O Slug deve conter apenas letras minúsculas, números e hífens (sem espaços).'
        };
    }
    let logoUrl = null;
    // 3. Upload do Logo (se houver)
    if (logoFile && logoFile.size > 0) {
        // Gerar nome único para o arquivo
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${slug}-${Date.now()}.${fileExt}`;
        const filePath = `public/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('academy-logos').upload(filePath, logoFile);
        if (uploadError) {
            console.error('Erro upload:', uploadError);
            return {
                error: 'Erro ao fazer upload da logo.'
            };
        }
        // Obter URL pública
        const { data: { publicUrl } } = supabase.storage.from('academy-logos').getPublicUrl(filePath);
        logoUrl = publicUrl;
    }
    // 4. Inserir no Banco de Dados
    const { error: insertError } = await supabase.from('academies').insert({
        name,
        slug,
        primary_color: primaryColor || '#000000',
        logo_url: logoUrl,
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
    if (insertError) {
        if (insertError.code === '23505') {
            return {
                error: 'Este Slug já está em uso. Escolha outro.'
            };
        }
        console.error('Erro insert:', insertError);
        return {
            error: 'Erro ao cadastrar academia.'
        };
    }
    // 5. Finalizar
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/admin/academies');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/admin/academies');
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    createAcademy
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createAcademy, "60405e5bfaa4757d29e06921e10ebab2e022fc2fe1", null);
}),
"[project]/Desktop/00 - Clubfit/.next-internal/server/app/admin/academies/new/page/actions.js { ACTIONS_MODULE0 => \"[project]/Desktop/00 - Clubfit/app/admin/academies/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$app$2f$admin$2f$academies$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/app/admin/academies/actions.ts [app-rsc] (ecmascript)");
;
}),
"[project]/Desktop/00 - Clubfit/.next-internal/server/app/admin/academies/new/page/actions.js { ACTIONS_MODULE0 => \"[project]/Desktop/00 - Clubfit/app/admin/academies/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "60405e5bfaa4757d29e06921e10ebab2e022fc2fe1",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$app$2f$admin$2f$academies$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAcademy"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$academies$2f$new$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$app$2f$admin$2f$academies$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/Desktop/00 - Clubfit/.next-internal/server/app/admin/academies/new/page/actions.js { ACTIONS_MODULE0 => "[project]/Desktop/00 - Clubfit/app/admin/academies/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$app$2f$admin$2f$academies$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/app/admin/academies/actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=Desktop_00%20-%20Clubfit_996c9040._.js.map