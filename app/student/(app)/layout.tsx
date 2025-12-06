import { getStudentSession } from '@/utils/auth-student'
import { createAdminClient } from '@/utils/supabase/admin'
import { redirect } from 'next/navigation'
import { StudentHeader } from '@/components/student/student-header'

export default async function StudentAppLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // 1. Validar Sessão
    const session = await getStudentSession()
    if (!session || !session.studentId) {
        redirect('/student/login')
    }

    const { studentId, academyId } = session

    // 2. Buscar Dados da Academia (Theme)
    // Usamos admin client pois a tabela academies pode ter regras de leitura restritas
    // e queremos garantir que pegamos os dados corretos vinculados ao token
    const supabaseAdmin = createAdminClient()

    const { data: academy } = await supabaseAdmin
        .from('academies')
        .select('name, logo_url, primary_color')
        .eq('id', academyId)
        .single()

    const themeColor = academy?.primary_color || '#000000'

    return (
        <div
            className="min-h-screen bg-slate-50 font-sans"
            style={
                {
                    '--primary-color': themeColor,
                } as React.CSSProperties
            }
        >
            <StudentHeader
                academyName={academy?.name || 'ClubFit'}
                logoUrl={academy?.logo_url}
                primaryColor={themeColor}
            />

            <main className="pb-20">
                {children}
            </main>

            {/* TabBar de Navegação (Futuro) */}
        </div>
    )
}
