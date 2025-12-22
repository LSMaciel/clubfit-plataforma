import { getStudentSession } from '@/utils/auth-student'
import { searchMarketplace } from '@/app/student/actions'
import { PartnerCard } from '@/components/student/partner-card'
import { FilterScroll } from '@/components/student/filter-scroll'
import Link from 'next/link'
import { SearchInput } from '@/components/student/search-input' // Will create this small client component

export default async function SearchPage({
    searchParams,
}: {
    searchParams: { query?: string; category?: string; tag?: string }
}) {
    const session = await getStudentSession()
    if (!session) return null

    const { partners, tags, categories } = await searchMarketplace(session.academyId, searchParams)

    // Find category name for display if active
    const activeCategory = categories.find((c: any) => c.slug === searchParams.category)

    return (
        <div className="min-h-screen bg-[var(--color-background)]">
            {/* Header / Search Bar */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 p-4 space-y-3">
                <div className="flex items-center gap-3">
                    <Link href="/student/dashboard" className="p-2 -ml-2 text-slate-400 hover:text-slate-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>
                    </Link>
                    <div className="flex-1">
                        <SearchInput initialQuery={searchParams.query} />
                    </div>
                </div>

                {/* Filters */}
                <FilterScroll tags={tags} />
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
                {/* Active Category Indicator */}
                {activeCategory && (
                    <div className="flex justify-between items-center">
                        <h2 className="font-bold text-slate-800">
                            {activeCategory.name}
                        </h2>
                        <Link href="/student/search" className="text-xs text-red-500 font-medium">
                            Limpar Filtros
                        </Link>
                    </div>
                )}

                {/* Results */}
                {partners.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {partners.map((partner: any) => (
                            <PartnerCard
                                key={partner.id}
                                partner={partner}
                                academySlug="clubfit" // We can fetch this if needed, for now standard
                            />
                        ))}
                    </div>
                ) : (
                    <div className="mt-10 flex flex-col items-center text-center space-y-4 opacity-60">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-bold text-slate-800">Nenhum parceiro encontrado</p>
                            <p className="text-sm text-slate-500 max-w-[200px]">
                                Tente mudar os filtros ou buscar por outra coisa.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
