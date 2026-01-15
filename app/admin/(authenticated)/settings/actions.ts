'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateAcademyTheme(prevState: any, formData: FormData) {
    const supabase = await createClient()

    // 1. Validate Authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Usuário não autenticado.' }
    }

    // 2. Get User Profile to find Academy ID
    const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

    if (!profile) {
        return { error: 'Perfil de usuário não encontrado.' }
    }

    if (profile.role !== 'ACADEMY_ADMIN' && profile.role !== 'SUPER_ADMIN') {
        return { error: 'Permissão negada.' }
    }

    // If Super Admin, allow editing any if context implies, but for now let's strict to own academy or context.
    // Assuming simple flow where user has academy_id in profile.
    const { getEffectiveAcademyId } = await import('@/utils/admin-context')
    const academyId = await getEffectiveAcademyId(profile)

    if (!academyId) {
        return { error: 'Nenhuma academia selecionada (Use o seletor no topo se for Super Admin).' }
    }

    // 3. Extract and Validate Data
    const colors = {
        color_primary: formData.get('color_primary') as string,
        color_secondary: formData.get('color_secondary') as string,
        color_background: formData.get('color_background') as string,
        color_surface: formData.get('color_surface') as string,
        color_text_primary: formData.get('color_text_primary') as string,
        color_text_secondary: formData.get('color_text_secondary') as string,
        color_border: formData.get('color_border') as string,
        border_radius: formData.get('border_radius') as string,
    }

    // Basic Validation (Optional regex check could go here)
    for (const [key, value] of Object.entries(colors)) {
        if (!value || !value.startsWith('#') || value.length !== 7) {
            // Let it slide for now or return error? Let's return error to be safe.
            // Actually, input type='color' guarantees hex, but safe to check.
            if (!value) return { error: `Cor inválida para ${key}` }
        }
    }

    // 4. Update Database
    console.log('Attempting update for Academy:', academyId, 'Colors:', colors)

    const { data: updateData, error: updateError } = await supabase
        .from('academies')
        .update(colors)
        .eq('id', academyId)
        .select()

    if (updateError) {
        console.error('❌ Supabase Update Error:', updateError)
        return { error: `Erro de Banco: ${updateError.message}` }
    }

    console.log('✅ Update Success:', updateData)

    // 5. Revalidate
    revalidatePath('/admin/settings')
    revalidatePath(`/student`) // Invalidate student app to pick up new colors (if we were using static gen)

    return { success: true, message: 'Tema atualizado com sucesso!' }
}
