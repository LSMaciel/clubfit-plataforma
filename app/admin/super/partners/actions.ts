'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

/**
 * Super Admin: Listar todos os parceiros globais.
 */
export async function getGlobalPartners() {
    const supabase = await createClient()

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Não autenticado' }

    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'SUPER_ADMIN') {
        return { error: 'Acesso negado. Apenas Super Admin.' }
    }

    // Admin Client para ler tudo sem RLS de academia
    const supabaseAdmin = createAdminClient()

    // Buscar parceiros e count de vínculos
    // Nota: Supabase não tem count relation easy, então pegamos raw ou usamos subquery.
    // Vamos buscar simples primeiro.
    // count de vínculos precisa ser "academy_partners(count)"
    const { data: partners, error } = await supabaseAdmin
        .from('partners')
        .select(`
            id,
            name,
            cnpj,
            city,
            state,
            created_at,
            academy_partners(count),
            users (name)
      `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Super Admin Fetch Error:', error)
        return { error: 'Erro ao buscar parceiros.' }
    }

    // Formatar retorno
    const formatted = partners.map((p: any) => ({
        id: p.id,
        name: p.name,
        cnpj: p.cnpj,
        location: p.city ? `${p.city}/${p.state}` : '-',
        owner_email: p.users?.name || 'N/A', // Fallback to name as email is not in public.users
        links_count: p.academy_partners?.[0]?.count || 0,
        created_at: p.created_at
    }))

    return { data: formatted }
}

/**
 * Super Admin: Criar parceiro global (Sem vínculo).
 */
export async function createGlobalPartnerSuper(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const supabaseAdmin = createAdminClient()

    // 1. Auth Check (Super Admin)
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) return { error: 'Não autenticado.' }

    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', currentUser.id)
        .single()

    if (profile?.role !== 'SUPER_ADMIN') {
        return { error: 'Acesso negado.' }
    }

    // 2. Extrair Dados
    const name = formData.get('name') as string
    const cnpj = formData.get('cnpj') as string
    const description = formData.get('description') as string

    // Endereço
    const street = formData.get('street') as string
    const number = formData.get('number') as string
    const neighborhood = formData.get('neighborhood') as string
    const city = formData.get('city') as string
    const state = formData.get('state') as string
    const zipCode = formData.get('zip_code') as string

    // Owner
    const ownerName = formData.get('owner_name') as string
    const ownerEmail = formData.get('owner_email') as string
    const ownerPassword = formData.get('owner_password') as string

    if (!name || !cnpj || !ownerEmail || !ownerPassword) {
        return { error: 'Dados obrigatórios faltando.' }
    }

    // 3. Check Duplicidade CNPJ
    const { data: existing } = await supabaseAdmin
        .from('partners')
        .select('id')
        .eq('cnpj', cnpj)
        .single()

    if (existing) {
        return { error: 'CNPJ já cadastrado no sistema.' }
    }

    // 4. Criar Usuário Owner
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: ownerEmail,
        password: ownerPassword,
        email_confirm: true,
        user_metadata: { full_name: ownerName }
    })

    if (authError) return { error: `Erro Auth: ${authError.message}` }
    const ownerId = authData.user.id

    // 5. Criar Perfil Owner
    await supabaseAdmin.from('users').insert({
        id: ownerId,
        name: ownerName,
        role: 'PARTNER',
        academy_id: null
    })

    // 6. Criar Parceiro ("Solto")
    const { error: partnerError } = await supabaseAdmin
        .from('partners')
        .insert({
            owner_id: ownerId,
            name,
            cnpj,
            description,
            street,
            number,
            neighborhood,
            city,
            state,
            zip_code: zipCode,
            // address: legacy fallback construct
            address: `${street}, ${number} - ${city}/${state}`
        })

    if (partnerError) {
        await supabaseAdmin.auth.admin.deleteUser(ownerId)
        console.error(partnerError)
        return { error: 'Erro ao criar parceiro.' }
    }

    revalidatePath('/admin/super/partners')
    redirect('/admin/super/partners')
}

/**
 * Super Admin: Buscar detalhes de um parceiro e seus vínculos.
 */
export async function getPartnerDetails(partnerId: string) {
    const supabaseAdmin = createAdminClient()

    // 1. Buscar Parceiro
    const { data: partner, error } = await supabaseAdmin
        .from('partners')
        .select(`
            *,
            users!partners_owner_id_fkey (name, email)
        `)
        .eq('id', partnerId)
        .single()

    if (error || !partner) {
        return { error: 'Parceiro não encontrado.' }
    }

    // 2. Buscar Vínculos (Academy Partners)
    const { data: links } = await supabaseAdmin
        .from('academy_partners')
        .select(`
            status,
            created_at,
            academies (id, name, slug, logo_url)
        `)
        .eq('partner_id', partnerId)
        .order('created_at', { ascending: false })

    // Formatar links
    const formattedLinks = links?.map((l: any) => ({
        academyId: l.academies.id,
        academyName: l.academies.name,
        academySlug: l.academies.slug,
        status: l.status,
        linkedAt: l.created_at
    })) || []

    return {
        partner: {
            ...partner,
            ownerName: partner.users?.name || 'N/A',
            ownerEmail: partner.users?.email || 'N/A',
        },
        links: formattedLinks
    }
}

/**
 * Super Admin: Buscar todas as academias para o Select.
 */
export async function getAllAcademies() {
    const supabaseAdmin = createAdminClient()

    // Simplificado para dropdown
    const { data: academies } = await supabaseAdmin
        .from('academies')
        .select('id, name, slug')
        .order('name')

    return { academies: academies || [] }
}

/**
 * Super Admin: Vincular Academia a Parceiro (Force Link).
 */
export async function linkAcademySuper(partnerId: string, academyId: string) {
    const supabaseAdmin = createAdminClient()

    // Upsert para garantir idempotência e reativação
    const { error } = await supabaseAdmin
        .from('academy_partners')
        .upsert({
            partner_id: partnerId,
            academy_id: academyId,
            status: 'ACTIVE'
        }, { onConflict: 'academy_id, partner_id' })

    if (error) {
        console.error('Link Error:', error)
        return { error: 'Erro ao vincular academia.' }
    }

    revalidatePath(`/admin/super/partners/${partnerId}`)
    return { success: true }
}

/**
 * Super Admin: Desvincular Academia (Soft Delete).
 */
export async function unlinkAcademySuper(partnerId: string, academyId: string) {
    const supabaseAdmin = createAdminClient()

    const { error } = await supabaseAdmin
        .from('academy_partners')
        .update({ status: 'INACTIVE' })
        .eq('partner_id', partnerId)
        .eq('academy_id', academyId)

    if (error) {
        console.error('Unlink Error:', error)
        return { error: 'Erro ao desvincular.' }
    }

    revalidatePath(`/admin/super/partners/${partnerId}`)
    return { success: true }
}
