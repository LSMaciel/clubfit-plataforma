import { PartnerSearch } from '@/components/admin/partners/partner-search'
import Link from 'next/link'

export default function ExplorePartnersPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <nav className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <Link href="/admin/partners" className="text-slate-400 hover:text-slate-600 transition-colors">
                        ← Voltar
                    </Link>
                    <div className="h-6 w-px bg-slate-200"></div>
                    <div className="font-bold text-xl text-slate-900">Explorar Parceiros</div>
                </div>
            </nav>

            <main className="p-8 max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Conectar Rede</h1>
                    <p className="text-slate-600 text-lg">
                        Busque estabelecimentos que já usam o ClubFit e conecte-os à sua academia para oferecer benefícios imediatos aos seus alunos.
                    </p>
                </div>

                <PartnerSearch />
            </main>
        </div>
    )
}
