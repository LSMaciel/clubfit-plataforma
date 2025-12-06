'use server'

import { createClient } from '@/utils/supabase/server'
import { getStudentSession } from '@/utils/auth-student'

export async function getPartners() {
    const session = await getStudentSession()
    if (!session || !session.academyId) {
        return []
    }

    const supabase = await createClient()

    // Buscar parceiros da academia do aluno
    const { data: partners, error } = await supabase
        .from('partners')
        .select(`
            id,
            name,
            description,
            address,
            benefits (
                id,
                rules,
                status
            )
        `)
        .eq('academy_id', session.academyId)
        .eq('benefits.status', 'ACTIVE') // Apenas benefícios ativos
        .order('name')

    if (error) {
        console.error('Erro ao buscar parceiros:', error)
        return []
    }

    // Filtrar/Organizar dados (caso o join traga nulls ou múltiplos benefícios)
    return partners.map(partner => ({
        ...partner,
        // Pega o primeiro benefício ativo como destaque (MVP)
        mainBenefit: partner.benefits?.[0]?.rules || 'Consulte condições'
    }))
}
