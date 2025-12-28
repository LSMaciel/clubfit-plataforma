'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { createStudentSession, getStudentSession } from '@/utils/auth-student'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function studentLogin(formData: FormData) {
    const rawCpf = formData.get('cpf') as string
    if (!rawCpf) return { error: 'CPF é obrigatório.' }

    // Clean CPF
    const cpf = rawCpf.replace(/\D/g, '')

    if (cpf.length !== 11) return { error: 'CPF inválido.' }

    const supabaseAdmin = createAdminClient()

    // 1. Buscar Aluno (Admin Client para bypass RLS)
    // Precisamos encontrar se esse CPF existe e está ativo.
    const { data: student, error } = await supabaseAdmin
        .from('students')
        .select('id, academy_id, full_name, status')
        .eq('cpf', cpf)
        .single()

    if (error || !student) {
        return { error: 'CPF não encontrado. Verifique se digitou corretamente.' }
    }

    if (student.status !== 'ACTIVE') {
        return { error: 'Seu cadastro está inativo. Procure a recepção da academia.' }
    }

    // 2. Criar Sessão
    await createStudentSession(student.id, student.academy_id)

    // 3. Redirecionar
    redirect('/student/dashboard')
}

export async function studentLogout() {
    const { deleteStudentSession } = await import('@/utils/auth-student')
    await deleteStudentSession()
    redirect('/student/login')
}

export async function getMarketplaceData(academyId: string) {
    const supabaseAdmin = createAdminClient()

    // 1. Fetch Categories (Only Parents for now)
    const { data: categories } = await supabaseAdmin
        .from('categories')
        .select('id, name, slug, icon_name')
        .is('parent_id', null)
        .order('name')

    // 2. Fetch Partners linked to this Academy
    const { data: partners } = await supabaseAdmin
        .from('partners')
        .select(`
            id, 
            name, 
            description, 
            address, 
            academy_partners!inner(status),
            benefits(title)
        `)
        .eq('academy_partners.academy_id', academyId)
        .eq('academy_partners.status', 'ACTIVE')
        // We limit to 20 for Home page
        .limit(20)

    // Process partners to get main benefit
    const formattedPartners = partners?.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        address: p.address,
        // Pegar o primeiro benefício ativo como "Main Benefit"
        mainBenefit: p.benefits?.[0]?.title || 'Ver Ofertas'
    })) || []

    return {
        categories: categories || [],
        partners: formattedPartners
    }
}

export async function searchMarketplace(
    academyId: string,
    params: { query?: string, category?: string, tag?: string }
) {
    const supabaseAdmin = createAdminClient()
    const { query, category, tag } = params

    // 1. Dynamic Join Type for Category
    const categoryJoin = category ? 'partner_categories!inner' : 'partner_categories'
    const categoryFilter = category ? 'categories!inner' : 'categories'

    // 2. Base Query
    let dbQuery = supabaseAdmin
        .from('partners')
        .select(`
            id, name, description, address, logo_url,
            academy_partners!inner(status),
            benefits(title),
            ${categoryJoin}(
                ${categoryFilter}(slug, name)
            ),
            partner_tags_link(
                partner_tags(name, icon_name)
            )
        `)
        .eq('academy_partners.academy_id', academyId)
        .eq('academy_partners.status', 'ACTIVE')

    // 3. Filter by Category Slug
    if (category) {
        dbQuery = dbQuery.eq('partner_categories.categories.slug', category)
    }

    // 4. Filter by Text Search (Name)
    if (query) {
        dbQuery = dbQuery.ilike('name', `%${query}%`)
    }

    const { data: partners, error } = await dbQuery

    if (error) {
        console.error('Search Error:', error)
        return { partners: [], tags: [], categories: [] }
    }

    // 5. Client-side filtering/processing for Tags
    let filteredPartners = partners || []

    if (tag) {
        filteredPartners = filteredPartners.filter(p =>
            p.partner_tags_link.some((link: any) => link.partner_tags.name === tag)
        )
    }

    // Format for View
    const formattedPartners = filteredPartners.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        address: p.address,
        logoUrl: p.logo_url,
        mainBenefit: p.benefits?.[0]?.title || 'Ver Ofertas',
        // Extract tags for display
        tags: p.partner_tags_link.map((link: any) => link.partner_tags.name)
    }))

    // 5. Fetch Metadata for Filters (All Categories + All Tags)
    // We could optimize this to only return relevant filters, but for now we return all.
    const { data: allCategories } = await supabaseAdmin
        .from('categories')
        .select('id, name, slug')
        .is('parent_id', null)
        .order('name')

    const { data: allTags } = await supabaseAdmin
        .from('partner_tags')
        .select('id, name')
        .order('name')

    return {
        partners: formattedPartners,
        categories: allCategories || [],
        tags: allTags || []
    }
}

// PROJ-011: Optimized Single-Query Fetch
export async function getPartnerProfile(academySlug: string, partnerId: string) {
    const supabaseAdmin = createAdminClient()

    const { data, error } = await supabaseAdmin
        .from('partners')
        .select(`
            *,
            academy_partners!inner(status, academy_id),
            academies:academy_partners(
                slug
            ),
            benefits(id, title, description, rules, validity_end, status)
        `)
        .eq('id', partnerId)
        .eq('academy_partners.status', 'ACTIVE')
        .single() // We will filter slug in JS or let the JOIN filtering happen if we could, but Supabase nested filtering is tricky on inner joins sometimes. 
    // Actually, let's filter slug via the nested relation if possible, or verify after.
    // Simpler to verify slug matches the relation.

    if (error || !data) {
        console.error('Error fetching partner profile:', error)
        return null
    }

    // Verify Academy Slug (Security/Integrity check)
    // data.academies is an array because academy_partners -> academies is N:1 defined but returns array in supabase usually or object depending on relation code.
    // Wait, join is: partners -> academy_partners -> academies.
    // academy_partners has academy_id.
    // Let's optimize: We just need to know if this partner is linked to an academy with this slug.

    // Better query approach to filter by slug in DB:
    // .eq('academy_partners.academies.slug', academySlug) -> Requires setting up filters on nested resources which PostgREST supports.

    // Let's stick to the robust check:
    const linkedAcademies = Array.isArray(data.academies) ? data.academies : [data.academies]
    const hasMatchingSlug = linkedAcademies.some((a: any) => a.slug === academySlug)

    if (!hasMatchingSlug) {
        return null // Partner exists but not linked to this academy slug
    }

    // Filter active benefits
    if (data.benefits) {
        data.benefits = data.benefits.filter((b: any) => b.status === 'ACTIVE')
    }

    return data
}

// PROJ-014: BI Functions
export async function getStudentEconomyStats() {
    const session = await getStudentSession()
    if (!session) return null
    const supabase = createAdminClient()

    // Call RPC
    const { data, error } = await supabase.rpc('get_student_economy_summary', {
        p_student_id: session.studentId
    })

    if (error) {
        console.error('getStudentEconomyStats Error:', error)
        throw error
    }

    // RPC returns array of 1 item
    return data && data.length > 0 ? data[0] : { total_economy: 0, vouchers_count: 0 }
}

export async function getStudentHistory(page: number = 0) {
    const session = await getStudentSession()
    if (!session) return []
    const supabase = createAdminClient()
    const LIMIT = 20
    const OFFSET = page * LIMIT

    const { data, error } = await supabase.rpc('get_student_voucher_history', {
        p_student_id: session.studentId,
        p_limit: LIMIT,
        p_offset: OFFSET
    })

    if (error) {
        console.error('getStudentHistory Error:', error)
        return []
    }

    return data || []
}

// STORY-005: Promotions Feed (App 2.0)
export async function getPromotionsFeed(academySlug: string, categorySlug?: string) {
    const supabaseAdmin = createAdminClient()

    // 1. Resolver Academy ID pelo Slug
    const { data: academy } = await supabaseAdmin
        .from('academies')
        .select('id')
        .eq('slug', academySlug)
        .single()

    if (!academy) return []

    // 2. Definir Join Type dinamicamente
    // Se temos filtro de categoria, exigimos que a relação exista (!inner).
    // Se não temos (aba Tudo), aceitamos (left join padrão).
    const categoryJoin = categorySlug ? 'partner_categories!inner' : 'partner_categories'
    const categoryFilter = categorySlug ? 'categories!inner' : 'categories'

    // 3. Buscar Benefícios
    let query = supabaseAdmin
        .from('benefits')
        .select(`
            id,
            title,
            type,
            configuration,
            description,
            validity_end,
            partner_id,
            partners!inner (
                id,
                name,
                logo_url,
                address,
                latitude,
                longitude,
                academy_partners!inner (
                    status
                ),
                ${categoryJoin} (
                    ${categoryFilter} (
                        slug
                    )
                )
            )
        `)
        .eq('partners.academy_partners.academy_id', academy.id)
        .eq('partners.academy_partners.status', 'ACTIVE')
        .eq('status', 'ACTIVE')
        .order('created_at', { ascending: false })
        .limit(50)

    // Apply Filter strict
    if (categorySlug) {
        query = query.eq('partners.partner_categories.categories.slug', categorySlug)
    }

    const { data: benefits, error } = await query

    if (error) {
        console.error('getPromotionsFeed Error:', error)
        return []
    }

    // 4. Formatar para UI
    return benefits.map((b: any) => ({
        id: b.id,
        title: b.title,
        description: b.description,
        type: b.type || 'STANDARD',
        discountValue: b.configuration?.discount_value || null,
        partner: {
            id: b.partners.id,
            name: b.partners.name,
            logoUrl: b.partners.logo_url,
            address: b.partners.address,
            lat: b.partners.latitude,
            lng: b.partners.longitude
        }
    }))
}

// Helper para Categorias Rápidas (Inteligência: Só categorias com parceiros ativos na academia)
export async function getQuickCategories(academyId?: string) {
    const supabaseAdmin = createAdminClient()

    let query = supabaseAdmin
        .from('categories')
        .select(`
            id, 
            name, 
            slug, 
            icon_name
        `)
        .is('parent_id', null)
        .order('name')
        .limit(20)

    // Se tiver academyId, filtra apenas categorias que tenham parceiros NESSA academia
    if (academyId) {
        query = supabaseAdmin
            .from('categories')
            .select(`
                id, 
                name, 
                slug, 
                icon_name,
                partner_categories!inner (
                    partners!inner (
                        academy_partners!inner (
                            academy_id
                        )
                    )
                )
            `)
            .eq('partner_categories.partners.academy_partners.academy_id', academyId)
            .eq('partner_categories.partners.academy_partners.status', 'ACTIVE')
            .is('parent_id', null)
            .order('name')
            // PostgREST unique behavior: selecting from root implies uniqueness of root rows usually, 
            // but let's limit to be safe.
            .limit(20)
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching quick categories:', error)
        return []
    }

    // Remove duplicates manually if necessary (PostgREST sometimes duplicates on joins)
    const uniqueCategories = data ? Array.from(new Map(data.map((item: any) => [item.id, item])).values()) : []

    return uniqueCategories
}

// STORY-007: Favorites Actions
export async function toggleFavorite(itemType: 'PARTNER' | 'OFFER', itemId: string) {
    console.log('--- [FAV DEBUG] Start Toggle ---')
    console.log('Params:', { itemType, itemId })

    const supabase = await createClient() // Use User Client (RLS)
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        console.error('[FAV DEBUG] Auth Error or No User:', authError)
        return { error: 'Você precisa estar logado.' }
    }

    console.log('[FAV DEBUG] User Found:', user.id)

    // 1. Check if exists
    const { data: existing, error: selectError } = await supabase
        .from('user_favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('item_type', itemType)
        .eq('item_id', itemId)
        .single()

    if (selectError && selectError.code !== 'PGRST116') {
        console.error('[FAV DEBUG] Select Error:', selectError)
    }
    console.log('[FAV DEBUG] Existing Record:', existing)

    if (existing) {
        // DELETE
        console.log('[FAV DEBUG] Deleting ID:', existing.id)
        const { error: deleteError } = await supabase
            .from('user_favorites')
            .delete()
            .eq('id', existing.id)

        if (deleteError) {
            console.error('[FAV DEBUG] Delete Error:', deleteError)
            throw new Error('Erro ao remover favorito')
        }
        console.log('[FAV DEBUG] Delete Success')

        revalidatePath('/student/favorites')
        revalidatePath('/student/dashboard')
        revalidatePath('/student/search')
        return { isFavorite: false }
    } else {
        // INSERT
        console.log('[FAV DEBUG] Inserting new record...')
        const { error: insertError } = await supabase
            .from('user_favorites')
            .insert({
                user_id: user.id,
                item_type: itemType,
                item_id: itemId
            })

        if (insertError) {
            console.error('[FAV DEBUG] Insert Error:', insertError)
            throw new Error('Erro ao adicionar favorito: ' + insertError.message)
        }
        console.log('[FAV DEBUG] Insert Success')

        revalidatePath('/student/favorites')
        revalidatePath('/student/dashboard')
        revalidatePath('/student/search')
        return { isFavorite: true }
    }
}

export async function getFavorites() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data } = await supabase
        .from('user_favorites')
        .select('item_id, item_type')
        .eq('user_id', user.id)

    return data || []
}

export async function getFavoritePartners(academySlug: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const supabaseAdmin = createAdminClient()

    // 1. Get favorite IDs
    const { data: favorites } = await supabase
        .from('user_favorites')
        .select('item_id')
        .eq('user_id', user.id)
        .eq('item_type', 'PARTNER')

    if (!favorites || favorites.length === 0) return []

    const partnerIds = favorites.map(f => f.item_id)

    // 2. Fetch Partners Data
    const { data: partners } = await supabaseAdmin
        .from('partners')
        .select(`
            id, 
            name, 
            description, 
            address, 
            logo_url,
            latitude,
            longitude,
            benefits(title)
        `)
        .in('id', partnerIds)

    if (!partners) return []

    return partners.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        address: p.address,
        logoUrl: p.logo_url,
        lat: p.latitude,
        lng: p.longitude,
        mainBenefit: p.benefits?.[0]?.title || 'Ver Ofertas'
    }))
}
