'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { createStudentSession } from '@/utils/auth-student'
import { redirect } from 'next/navigation'

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

    // 1. Base Query
    let dbQuery = supabaseAdmin
        .from('partners')
        .select(`
            id, name, description, address,
            academy_partners!inner(status),
            benefits(title),
            partner_categories!inner(
                categories!inner(slug, name)
            ),
            partner_tags_link(
                partner_tags(name, icon_name)
            )
        `)
        .eq('academy_partners.academy_id', academyId)
        .eq('academy_partners.status', 'ACTIVE')

    // 2. Filter by Category Slug
    if (category) {
        dbQuery = dbQuery.eq('partner_categories.categories.slug', category)
    }

    // 3. Filter by Text Search (Name)
    // Note: Searching tags via text is complex in PostgREST 1-step. 
    // We will filter by Partner Name OR Description here. Tag text search we might skip for MVP or do client side.
    if (query) {
        dbQuery = dbQuery.ilike('name', `%${query}%`)
    }

    const { data: partners, error } = await dbQuery

    if (error) {
        console.error('Search Error:', error)
        return { partners: [], tags: [], categories: [] }
    }

    // 4. Client-side filtering/processing for Tags (due to complex N:N filtering in Supabase)
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
