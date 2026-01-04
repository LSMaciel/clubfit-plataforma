'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'

// Fetch Partner Profile for the logged-in user
export async function getMyPartnerProfile() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const supabaseAdmin = createAdminClient()

    // Find the partner where owner_id matches current user
    const { data: partner, error } = await supabaseAdmin
        .from('partners')
        .select(`
            *,
            partner_categories(category_id),
            partner_tags_link(tag_id)
        `)
        .eq('owner_id', user.id)
        .single()

    if (error || !partner) {
        console.error('Partner Profile Error:', error)
        return null
    }

    // Transform categories/tags to simpler arrays of IDs
    const categoryIds = partner.partner_categories?.map((pc: any) => pc.category_id) || []
    const tagIds = partner.partner_tags_link?.map((pt: any) => pt.tag_id) || []

    return {
        ...partner,
        categoryIds,
        tagIds
    }
}

export async function getProfileMetadata() {
    const supabaseAdmin = createAdminClient()

    // Fetch all available categories and tags for selection
    const [categoriesRes, tagsRes] = await Promise.all([
        supabaseAdmin
            .from('categories')
            .select('id, name')
            .is('parent_id', null)
            .neq('name', 'Categoria Teste') // Hide test category
            .order('name'),
        supabaseAdmin.from('partner_tags').select('id, name').order('name')
    ])

    return {
        categories: categoriesRes.data || [],
        tags: tagsRes.data || []
    }
}

export async function updatePartnerProfile(partnerId: string, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Usuário não autenticado.' }

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const address = formData.get('address') as string
    const logo_url = formData.get('logo_url') as string
    const cover_url = formData.get('cover_url') as string
    const categoryIds = formData.getAll('categories') as string[] // "categories" input name
    const tagIds = formData.getAll('tags') as string[] // "tags" input name

    if (!name) return { error: 'Nome é obrigatório.' }

    const supabaseAdmin = createAdminClient()

    // 1. Verify Ownership (Security)
    const { data: current } = await supabaseAdmin
        .from('partners')
        .select('id, owner_id')
        .eq('id', partnerId)
        .single()

    if (!current || current.owner_id !== user.id) {
        return { error: 'Permissão negada. Você só pode editar sua própria loja.' }
    }

    // 2. Update Basic Fields
    const { error: updateError } = await supabaseAdmin
        .from('partners')
        .update({
            name,
            description,
            address,
            logo_url,
            cover_url,
            updated_at: new Date().toISOString()
        })
        .eq('id', partnerId)

    if (updateError) {
        return { error: 'Erro ao atualizar dados básicos.' }
    }

    // 3. Update Categories (Full Replace)
    // Delete existing
    await supabaseAdmin.from('partner_categories').delete().eq('partner_id', partnerId)
    // Insert new
    if (categoryIds.length > 0) {
        const catInserts = categoryIds.map(cid => ({ partner_id: partnerId, category_id: cid }))
        await supabaseAdmin.from('partner_categories').insert(catInserts)
    }

    // 4. Update Tags (Full Replace)
    // Delete existing
    await supabaseAdmin.from('partner_tags_link').delete().eq('partner_id', partnerId)
    // Insert new
    if (tagIds.length > 0) {
        const tagInserts = tagIds.map(tid => ({ partner_id: partnerId, tag_id: tid }))
        await supabaseAdmin.from('partner_tags_link').insert(tagInserts)
    }

    revalidatePath('/admin/profile')
    return { success: true }
}
