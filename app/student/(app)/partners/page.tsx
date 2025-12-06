import { getPartners } from './actions'
import { PartnerCard } from '@/components/student/partner-card'
import Link from 'next/link'

export default async function PartnersListPage() {
    const partners = await getPartners()

    return (
        <div className="min-h-screen bg-slate-50 p-6 pb-24">
            {/* Header */}
            <div className="mb-6 flex items-center gap-3">
                <Link href="/student/dashboard" className="text-slate-400 hover:text-slate-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                </Link>
                <h1 className="text-xl font-bold text-slate-800">Parceiros</h1>
            </div>

            {/* Search (Visual Only for MVP) */}
            <div className="relative mb-8">
                <input
                    type="text"
                    placeholder="Buscar parceiro..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]/50"
                />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400 absolute left-3 top-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
            </div>

            {/* List */}
            <div className="space-y-4">
                {partners.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                        <p>Nenhum parceiro encontrado.</p>
                        <p className="text-xs mt-1">Fique ligado, novidades em breve!</p>
                    </div>
                ) : (
                    partners.map(partner => (
                        <PartnerCard key={partner.id} partner={partner} />
                    ))
                )}
            </div>
        </div>
    )
}
