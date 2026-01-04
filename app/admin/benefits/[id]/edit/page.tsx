import { createClient } from '@/utils/supabase/server'
import { PromotionWizard } from '@/components/admin/promotions/promotion-wizard'
import { redirect } from 'next/navigation'

export default async function EditBenefitPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/admin/login')

    const { id: benefitId } = await params

    // Fetch Benefit & Verify Ownership
    const { data: benefit, error } = await supabase
        .from('benefits')
        .select('*, partners!inner(owner_id)')
        .eq('id', benefitId)
        .eq('partners.owner_id', user.id)
        .single()

    if (error || !benefit) {
        return <div className="p-8">Promoção não encontrada.</div>
    }

    // Map DB data to PromotionDraft
    const initialData = {
        type: benefit.type,
        title: benefit.title,
        description: benefit.description,
        main_image_url: benefit.main_image_url,
        cover_image_url: benefit.cover_image_url,
        configuration: benefit.configuration,
        constraints: benefit.constraints
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <nav className="bg-white border-b border-slate-200 px-8 py-4">
                <div className="max-w-5xl mx-auto flex items-center gap-4">
                    <h1 className="font-bold text-xl text-slate-900">Editar Promoção</h1>
                </div>
            </nav>

            <main className="flex-1 p-8">
                <PromotionWizard initialData={initialData} benefitId={benefit.id} />
            </main>
        </div>
    )
}
