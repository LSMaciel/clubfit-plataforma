import { getStudentSession } from '@/utils/auth-student'
import { createAdminClient } from '@/utils/supabase/admin'
import { getMarketplaceData } from '@/app/student/actions'
import { CategoryCarousel } from '@/components/student/category-carousel'
import { PartnerCard } from '@/components/student/partner-card'
import Link from 'next/link'

export default async function StudentHomePage() {
    // 1. Auth & Data Fetching
    const session = await getStudentSession()
    if (!session) return null

    // Get basic student info for "Welcome"
    const supabaseAdmin = createAdminClient()
    const { data: student } = await supabaseAdmin
        .from('students')
        .select('full_name, academy_id, academies(slug)')
        .eq('id', session.studentId)
        .single()

    const firstName = student?.full_name.split(' ')[0] || 'Aluno'
    const academySlug = Array.isArray(student?.academies)
        ? student?.academies[0]?.slug
        : (student?.academies as any)?.slug || 'clubfit'

    // Get Marketplace Data (Categories + Partners)
    const { categories, partners } = await getMarketplaceData(session.academyId)

    return (
        <div className="px-6 py-6 space-y-8">
            {/* 1. Welcome Header */}
            <section className="flex justify-between items-end">
                <div>
                    <h1 className="text-xl font-light text-slate-800">
                        Olá, <span className="font-bold">{firstName}</span> 👋
                    </h1>
                    <p className="text-slate-500 text-sm mt-0.5">
                        O que vamos curtir hoje?
                    </p>
                </div>
                {/* Search Trigger (Visual Only for now) */}
                <Link href="/student/search" className="bg-white p-2.5 rounded-full border border-slate-100 shadow-sm text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </Link>
            </section>

            {/* 2. Categories Carousel */}
            <section>
                <div className="flex justify-between items-center mb-3">
                    <h2 className="font-bold text-slate-800 text-lg">Categorias</h2>
                </div>
                <CategoryCarousel categories={categories} />
            </section>

            {/* 3. Partner Feed (Destaques) */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-slate-800 text-lg">Destaques</h2>
                    <Link href="/student/search" className="text-xs font-medium text-[var(--primary-color)] hover:underline">
                        Ver todos
                    </Link>
                </div>

                {partners.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {partners.map(partner => (
                            <PartnerCard
                                key={partner.id}
                                partner={partner}
                                academySlug={academySlug}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <p className="text-slate-400 text-sm">Nenhum parceiro encontrado nesta academia.</p>
                    </div>
                )}
            </section>
        </div>
    )
}
