import { getPartnerDetails, getAllAcademies } from '../actions'
import { AcademyLinker } from '@/components/admin/super/academy-linker'
import Link from 'next/link'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function SuperPartnerDetailPage({ params }: PageProps) {
    const { id } = await params

    // Fetch data in parallel
    const [detailsRes, academiesRes] = await Promise.all([
        getPartnerDetails(id),
        getAllAcademies()
    ])

    if (detailsRes.error || !detailsRes.partner) {
        return <div className="p-8 text-red-600">Parceiro não encontrado: {detailsRes.error}</div>
    }

    const { partner, links } = detailsRes
    const { academies } = academiesRes

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/admin/super/partners" className="text-slate-400 hover:text-slate-600">← Voltar</Link>
            </div>

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">{partner.name}</h1>
                <div className="flex gap-4 mt-2 text-sm text-slate-500">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-mono">{id}</span>
                    <span>•</span>
                    <span>CNPJ: {partner.cnpj}</span>
                    <span>•</span>
                    <span>Owner: {partner.ownerName} ({partner.ownerEmail})</span>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Esquerda: Detalhes Cadastrais (Read Only por enquanto) */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="font-bold text-slate-900 mb-4 border-b pb-2">Sobre</h3>
                        <div className="space-y-4 text-sm">
                            <div>
                                <label className="block text-slate-500 text-xs uppercase">Descrição</label>
                                <p className="text-slate-800 mt-1">{partner.description || '-'}</p>
                            </div>
                            <div>
                                <label className="block text-slate-500 text-xs uppercase">Endereço</label>
                                <p className="text-slate-800 mt-1">
                                    {partner.street}, {partner.number} <br />
                                    {partner.neighborhood}, {partner.city}/{partner.state}
                                </p>
                            </div>
                            <div>
                                <label className="block text-slate-500 text-xs uppercase">Contato</label>
                                <p className="text-slate-800 mt-1">
                                    {(partner.phone || partner.whatsapp) || 'Sem contato'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Direita: Gestão de Vínculos (Interativo) */}
                <div className="lg:col-span-2">
                    <AcademyLinker
                        partnerId={id}
                        initialLinks={links}
                        allAcademies={academies}
                    />
                </div>
            </div>
        </div>
    )
}
