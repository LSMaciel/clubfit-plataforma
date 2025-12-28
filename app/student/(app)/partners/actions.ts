'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { getStudentSession } from '@/utils/auth-student'

export async function getPartners() {
    const session = await getStudentSession()

    if (!session || !session.academyId) {
        return []
    }

    // Usamos o AdminClient porque a autenticação do aluno é feita via Cookie Customizado (JWT de Aplicação)
    // e não via Supabase Auth (Banco de Dados).
    // O RLS do banco não enxerga o 'studentId', portanto precisamos buscar como Admin
    // e aplicar a segurança manualmente no filtro .eq('academy_id', session.academyId).
    const supabase = createAdminClient()

    // Buscar VÍNCULOS ativos da academia do aluno
    const { data: links, error } = await supabase
        .from('academy_partners')
        .select(`
            partner:partners (
                id,
                name,
                description,
                address,
                benefits (
                    id,
                    rules,
                    status
                )
            )
        `)
        .eq('academy_id', session.academyId)
        .eq('status', 'ACTIVE')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Erro ao buscar parceiros:', error)
        return []
    }

    // Transformação dos dados para o formato esperado pelo Frontend
    // O retorno é uma lista de { partner: { ... } }, precisamos extrair o partner.
    const partners = links.map((link: any) => {
        const p = link.partner

        // Safety check se o partner vier null (integridade referencial deve impedir, mas bom garantir)
        if (!p) return null

        return {
            ...p,
            // Pega o primeiro benefício ativo como destaque
            mainBenefit: p.benefits?.find((b: any) => b.status === 'ACTIVE')?.rules || 'Consulte condições'
        }
    }).filter(p => p !== null) // Remove nulos

    return partners
}
