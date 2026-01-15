import { createClient } from '@/utils/supabase/server'
import { getCachedAdminProfile } from '@/utils/supabase/cached-queries'
import { redirect } from 'next/navigation'
import { unlinkPartner } from '@/app/admin/(authenticated)/partners/actions'

export async function PartnersListConnections() {
    const supabase = await createClient()

    // Context Check
    const profile = await getCachedAdminProfile()
    if (!profile) redirect('/admin/login')

    const effectiveAcademyId = profile.effective_academy_id

    // Redirect Logic
    if (!effectiveAcademyId && profile?.role === 'SUPER_ADMIN') {
        redirect('/admin/super/partners')
    }

    // Fetch Data
    const { data: links, error } = await supabase
        .from('academy_partners')
        .select(`
      status,
      created_at,
      partner:partners (
        id,
        name,
        description,
        city,
        state,
        street,
        number,
        neighborhood,
        address,
        cnpj
      )
    `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching partners:', error)
        return <div className="p-4 text-red-500 bg-red-50 rounded-md">Erro ao carregar parceiros: {error.message}</div>
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-900 uppercase tracking-wider">Empresa</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-900 uppercase tracking-wider">Localização</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-900 uppercase tracking-wider">Status Vínculo</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-slate-900 uppercase tracking-wider">Ações</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {links?.map((link: any) => {
                        const partner = link.partner
                        // Address Fallback
                        const addressDisplay = partner.street
                            ? `${partner.street}, ${partner.number} - ${partner.neighborhood}, ${partner.city}/${partner.state}`
                            : (partner.address || '-')

                        return (
                            <tr key={partner.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-bold text-slate-900">{partner.name}</div>
                                    <div className="text-sm text-slate-500">{partner.description}</div>
                                    <div className="text-xs text-slate-400 mt-1">{partner.cnpj}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                    <div className="max-w-xs truncate" title={addressDisplay}>
                                        {addressDisplay}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {link.status === 'ACTIVE' ? (
                                        <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-md bg-green-50 text-green-700 border border-green-100">
                                            Ativo
                                        </span>
                                    ) : (
                                        <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                                            Inativo
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {link.status === 'ACTIVE' ? (
                                        <form action={async () => {
                                            'use server'
                                            await unlinkPartner(partner.id)
                                        }}>
                                            <button className="text-red-600 hover:text-red-900 font-semibold text-xs uppercase tracking-wide">Desvincular</button>
                                        </form>
                                    ) : (
                                        <span className="text-slate-400 cursor-not-allowed text-xs font-semibold uppercase tracking-wide">Desvinculado</span>
                                    )}
                                </td>
                            </tr>
                        )
                    })}
                    {links?.length === 0 && (
                        <tr>
                            <td colSpan={4} className="px-6 py-16 text-center text-slate-500">
                                <div className="mx-auto w-12 h-12 bg-slate-100 rounded-md flex items-center justify-center mb-4">
                                    <span className="text-2xl">🤝</span>
                                </div>
                                <p className="font-medium text-slate-900">Nenhum parceiro vinculado</p>
                                <p className="text-sm text-slate-500 mt-1">
                                    Use o botão <strong>Explorar Rede</strong> para buscar estabelecimentos.
                                </p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
