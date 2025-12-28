import { getStudentSession } from '@/utils/auth-student'
import { createAdminClient } from '@/utils/supabase/admin'
import { getFavoritePartners } from '@/app/student/actions'
import { PartnerCard } from '@/components/student/partner-card'
import Link from 'next/link'

export default async function FavoritesPage() {
    const session = await getStudentSession()
    if (!session) return null

    // Get Academy Slug
    const supabaseAdmin = createAdminClient()
    const { data: student } = await supabaseAdmin
        .from('students')
        .select('academies(slug)')
        .eq('id', session.studentId)
        .single()

    const academySlug = (student?.academies as any)?.slug || 'clubfit'

    const partners = await getFavoritePartners(academySlug)

    return (
        <div className="min-h-screen bg-[var(--color-background)] pb-24 px-4 py-6">
            <header className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Meus Favoritos</h1>
                    <p className="text-slate-500 text-sm">Parceiros que você curtiu</p>
                </div>
            </header>

            {partners.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {partners.map((partner: any) => (
                        <PartnerCard
                            key={partner.id}
                            partner={partner}
                            academySlug={academySlug}
                            isFavorite={true} // In this list, everyone is a favorite
                        />
                    ))}
                </div>
            ) : (
                <div className="mt-20 flex flex-col items-center text-center space-y-4 opacity-60">
                    <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-bold text-slate-800 text-lg">Nenhum favorito ainda</p>
                        <p className="text-sm text-slate-500 max-w-[200px] mx-auto">
                            Explore o catálogo e clique no coração para salvar seus parceiros preferidos.
                        </p>
                    </div>
                    <Link
                        href="/student/search"
                        className="bg-[var(--primary-color)] text-white px-6 py-3 rounded-full font-bold shadow-md hover:opacity-90 transition-opacity"
                    >
                        Explorar Parceiros
                    </Link>
                </div>
            )}
        </div>
    )
}
