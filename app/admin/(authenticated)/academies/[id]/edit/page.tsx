import { createClient } from '@/utils/supabase/server'
import { getCachedAdminProfile } from '@/utils/supabase/cached-queries'
import { redirect } from 'next/navigation'
import { EditAcademyForm } from './edit-form'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function EditAcademyPage(props: PageProps) {
    const params = await props.params;
    const { id } = params
    const profile = await getCachedAdminProfile()

    if (profile?.role !== 'SUPER_ADMIN') {
        redirect('/admin')
    }

    const supabase = await createClient()

    const { data: academy, error } = await supabase
        .from('academies')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !academy) {
        return <div className="p-8">Academia não encontrada.</div>
    }

    return (
        <main className="flex-1 p-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold text-slate-900 mb-6">Editar Academia</h1>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                    <EditAcademyForm academy={academy} />
                </div>
            </div>
        </main>
    )
}
