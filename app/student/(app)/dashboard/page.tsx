import { getStudentSession } from '@/utils/auth-student'
import { createAdminClient } from '@/utils/supabase/admin'
import { getPromotionsFeed, getQuickCategories, getFavorites } from '@/app/student/actions'
import { CategoryPills } from '../components/category-pills'
import { PromotionsFeed } from '../components/promotions-feed'
import Link from 'next/link'

export default async function StudentHomePage({
    searchParams
}: {
    searchParams: Promise<{ category?: string }>
}) {
    // 1. Auth & Data Fetching
    const session = await getStudentSession()
    if (!session) return null

    const resolvedParams = await searchParams

    // Get basic student info for "Welcome"
    const supabaseAdmin = createAdminClient()

    // Parallel Fetching: Student Info + Academy Slug (Reliable)
    const [studentResponse, academyResponse] = await Promise.all([
        supabaseAdmin
            .from('students')
            .select('full_name')
            .eq('id', session.studentId)
            .single(),
        supabaseAdmin
            .from('academies')
            .select('slug')
            .eq('id', session.academyId)
            .single()
    ])

    const student = studentResponse.data
    const firstName = student?.full_name.split(' ')[0] || 'Aluno'

    // Fallback is robust now, but primarily uses the Session Academy ID
    const academySlug = academyResponse.data?.slug || 'clubfit'

    // 2. Fetch Data (Optimized for STORY-005 + STORY-007)
    const categorySlug = resolvedParams.category

    // Parallel Fetching
    const [promotions, categories, favoritesList] = await Promise.all([
        getPromotionsFeed(academySlug, categorySlug),
        getQuickCategories(session.academyId),
        getFavorites() // Only user's favorites
    ])

    const favoriteIds = favoritesList.map((f: any) => f.item_id)

    return (
        <div className="px-6 py-6 space-y-8 pb-20">
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
                {/* Search Trigger */}
                <Link href="/student/search" className="bg-white p-2.5 rounded-full border border-slate-100 shadow-sm text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </Link>
            </section>

            {/* 2. Quick Categories (Pills) */}
            <section>
                <CategoryPills categories={categories} />
            </section>

            {/* 3. Promotions Feed */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-slate-800 text-lg">
                        {categorySlug ? 'Resultados' : 'Promoções Imperdíveis'}
                    </h2>
                </div>

                <PromotionsFeed
                    promotions={promotions}
                    academySlug={academySlug}
                    favoriteIds={favoriteIds}
                />
            </section>
        </div>
    )
}
