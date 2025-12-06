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
"[project]/Desktop/00 - Clubfit/app/admin/academies/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"40d2b18c064c18396e1e7d13e961cff73e6a1a2907":"switchAdminContext","60405e5bfaa4757d29e06921e10ebab2e022fc2fe1":"createAcademy"},"",""] */ __turbopack_context__.s([
    "createAcademy",
    ()=>createAcademy,
    "switchAdminContext",
    ()=>switchAdminContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/utils/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/utils/supabase/admin.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
async function createAcademy(prevState, formData) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const supabaseAdmin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminClient"])();
    // 1. Verificação de Segurança (Apenas Super Admin)
    const { data: userData } = await supabase.from('users').select('role').single();
    if (userData?.role !== 'SUPER_ADMIN') {
        return {
            error: 'Permissão negada.'
        };
    }
    // Dados da Academia
    const name = formData.get('name');
    const slug = formData.get('slug');
    const primaryColor = formData.get('primary_color');
    const logoFile = formData.get('logo');
    // Dados do Dono
    const ownerName = formData.get('owner_name');
    const ownerEmail = formData.get('owner_email');
    const ownerPassword = formData.get('owner_password');
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
    // Validar formato do slug
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(slug)) {
        return {
            error: 'O Slug deve conter apenas letras minúsculas, números e hífens.'
        };
    }
    // Se preencheu algum campo de login, obriga a preencher todos
    const hasCredentialInputs = ownerEmail || ownerPassword || ownerName;
    if (hasCredentialInputs && (!ownerEmail || !ownerPassword || !ownerName)) {
        return {
            error: 'Para criar um usuário, preencha Nome, Email e Senha.'
        };
    }
    let logoUrl = null;
    // 3. Upload do Logo (se houver)
    if (logoFile && logoFile.size > 0) {
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
        const { data: { publicUrl } } = supabase.storage.from('academy-logos').getPublicUrl(filePath);
        logoUrl = publicUrl;
    }
    // --- INÍCIO DA TRANSAÇÃO LÓGICA ---
    let newUserId = null;
    // 4. Criar Usuário Auth (Se fornecido)
    if (hasCredentialInputs) {
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: ownerEmail,
            password: ownerPassword,
            email_confirm: true,
            user_metadata: {
                full_name: ownerName
            }
        });
        if (authError) {
            return {
                error: `Erro ao criar login: ${authError.message}`
            };
        }
        newUserId = authData.user.id;
    }
    // 5. Inserir Academia
    const { data: academyData, error: insertError } = await supabaseAdmin // Usar admin para garantir
    .from('academies').insert({
        name,
        slug,
        primary_color: primaryColor || '#000000',
        logo_url: logoUrl,
        zip_code: zipCode || null,
        street: street || null,
        number: number || null,
        neighborhood: neighborhood || null,
        city: city || null,
        state: state || null,
        complement: complement || null,
        latitude: latitude,
        longitude: longitude
    }).select().single();
    if (insertError) {
        // ROLLBACK: Deletar usuário criado (se houver)
        if (newUserId) {
            await supabaseAdmin.auth.admin.deleteUser(newUserId);
        }
        if (insertError.code === '23505') {
            return {
                error: 'Este Slug já está em uso. Escolha outro.'
            };
        }
        console.error('Erro insert academy:', insertError);
        return {
            error: 'Erro ao cadastrar academia.'
        };
    }
    // 6. Criar Perfil Público (Se usuário foi criado)
    if (newUserId) {
        const { error: profileError } = await supabaseAdmin.from('users').insert({
            id: newUserId,
            name: ownerName,
            role: 'ACADEMY_ADMIN',
            academy_id: academyData.id
        });
        if (profileError) {
            // ROLLBACK TOTAL: Deletar Academia e Usuário
            await supabaseAdmin.from('academies').delete().eq('id', academyData.id);
            await supabaseAdmin.auth.admin.deleteUser(newUserId);
            console.error('Erro insert user profile:', profileError);
            return {
                error: 'Erro ao criar perfil do administrador.'
            };
        }
    }
    // 7. Finalizar
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/admin/academies');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/admin/academies');
}
;
async function switchAdminContext(academyId) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return {
            error: 'Not authenticated'
        };
    }
    // Verify if user is really Super Admin
    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
    if (profile?.role !== 'SUPER_ADMIN') {
        return {
            error: 'Unauthorized: Only Super Admin can switch context.'
        };
    }
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    if (academyId) {
        cookieStore.set('admin-context-academy-id', academyId);
    } else {
        cookieStore.delete('admin-context-academy-id');
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/admin', 'layout');
    return {
        success: true
    };
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    createAcademy,
    switchAdminContext
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createAcademy, "60405e5bfaa4757d29e06921e10ebab2e022fc2fe1", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(switchAdminContext, "40d2b18c064c18396e1e7d13e961cff73e6a1a2907", null);
}),
"[project]/Desktop/00 - Clubfit/utils/admin-context.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getEffectiveAcademyId",
    ()=>getEffectiveAcademyId
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/node_modules/next/headers.js [app-rsc] (ecmascript)");
;
async function getEffectiveAcademyId(user) {
    if (!user) return null;
    // Users bound to an academy (Normal Admins, Partners)
    if (user.role === 'ACADEMY_ADMIN' || user.role === 'PARTNER') {
        return user.academy_id;
    }
    // Super Admin: Check for context cookie
    if (user.role === 'SUPER_ADMIN') {
        const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
        const contextId = cookieStore.get('admin-context-academy-id')?.value;
        return contextId || null;
    }
    return null;
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
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$utils$2f$admin$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/utils/admin-context.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
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
    const effectiveAcademyId = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$utils$2f$admin$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getEffectiveAcademyId"])(adminProfile);
    if (!effectiveAcademyId) {
        return {
            error: 'Nenhuma academia selecionada (Use o seletor no topo se for Super Admin).'
        };
    }
    // 2. Dados do Formulário
    // 3. Dados do Formulário
    const partnerName = formData.get('partner_name');
    const description = formData.get('description');
    // Novos Campos de Endereço V2
    const zipCode = formData.get('zip_code');
    const street = formData.get('street');
    const number = formData.get('number');
    const neighborhood = formData.get('neighborhood');
    const city = formData.get('city');
    const state = formData.get('state');
    const complement = formData.get('complement');
    // Legacy address (Fallback: Montar string completa para exibir em listas antigas)
    // Se o form enviou 'address' explícito, usa ele. Se não, monta com base nos novos campos.
    let legacyAddress = formData.get('address');
    if (!legacyAddress && street) {
        legacyAddress = `${street}, ${number} - ${neighborhood}, ${city} - ${state}`;
    }
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
        academy_id: effectiveAcademyId
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
        academy_id: effectiveAcademyId,
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
"[project]/Desktop/00 - Clubfit/.next-internal/server/app/admin/partners/new/page/actions.js { ACTIONS_MODULE0 => \"[project]/Desktop/00 - Clubfit/app/auth/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/Desktop/00 - Clubfit/app/admin/academies/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/Desktop/00 - Clubfit/app/admin/partners/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/app/auth/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$app$2f$admin$2f$academies$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/app/admin/academies/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$app$2f$admin$2f$partners$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/app/admin/partners/actions.ts [app-rsc] (ecmascript)");
;
;
;
;
}),
"[project]/Desktop/00 - Clubfit/.next-internal/server/app/admin/partners/new/page/actions.js { ACTIONS_MODULE0 => \"[project]/Desktop/00 - Clubfit/app/auth/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/Desktop/00 - Clubfit/app/admin/academies/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/Desktop/00 - Clubfit/app/admin/partners/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "00cab8b81673684c95375fdb5e59a793c4e0bade15",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["signOut"],
    "40bc7c7b4abeb16fdb1e299f149f86959ecd527f00",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["signIn"],
    "40d2b18c064c18396e1e7d13e961cff73e6a1a2907",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$app$2f$admin$2f$academies$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["switchAdminContext"],
    "60514a3ddea3266cfcdf3103871e42321907cb34e1",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$app$2f$admin$2f$partners$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createPartner"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$partners$2f$new$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$app$2f$admin$2f$academies$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$app$2f$admin$2f$partners$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/Desktop/00 - Clubfit/.next-internal/server/app/admin/partners/new/page/actions.js { ACTIONS_MODULE0 => "[project]/Desktop/00 - Clubfit/app/auth/actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/Desktop/00 - Clubfit/app/admin/academies/actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE2 => "[project]/Desktop/00 - Clubfit/app/admin/partners/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/app/auth/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$app$2f$admin$2f$academies$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/app/admin/academies/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$00__$2d$__Clubfit$2f$app$2f$admin$2f$partners$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/00 - Clubfit/app/admin/partners/actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=Desktop_00%20-%20Clubfit_ce8153c4._.js.map