

import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { unlinkPartner } from './actions'

export default async function PartnersListPage() {
  const supabase = await createClient()

  // Buscar vínculos da academia (RLS garante que só venham os meus)
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
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center">
        <div className="font-bold text-xl text-slate-900">Gestão de Parceiros</div>
        <div className="flex gap-4">
          <Link
            href="/admin/dashboard"
            className="text-sm text-slate-500 hover:text-slate-800"
          >
            Voltar ao Dashboard
          </Link>
        </div>
      </nav>

      <main className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Parceiros Comerciais</h1>
          <div className="flex gap-3">
            <Link
              href="/admin/partners/new"
              className="bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-800"
            >
              + Novo Parceiro
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Empresa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Localização</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status Vínculo</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {links?.map((link: any) => {
                const partner = link.partner
                // Fallback de endereço
                const addressDisplay = partner.street
                  ? `${partner.street}, ${partner.number} - ${partner.neighborhood}, ${partner.city}/${partner.state}`
                  : (partner.address || '-')

                return (
                  <tr key={partner.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{partner.name}</div>
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
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Ativo
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 text-slate-800">
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
                          <button className="text-red-600 hover:text-red-900">Desvincular</button>
                        </form>
                      ) : (
                        <span className="text-slate-400 cursor-not-allowed">Desvinculado</span>
                      )}
                    </td>
                  </tr>
                )
              })}
              {links?.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    Sua academia ainda não possui parceiros vinculados.
                    <br />
                    Use o botão <strong>Executar</strong> par buscar opções.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
