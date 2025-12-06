
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function PartnersListPage() {
  const supabase = await createClient()

  // Graças ao RLS, essa query só retorna parceiros da academia do usuário logado
  const { data: partners, error } = await supabase
    .from('partners')
    .select('*, owner:users(name, id)')
    .order('created_at', { ascending: false })

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
          <Link
            href="/admin/partners/new"
            className="bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-800"
          >
            + Novo Parceiro
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Empresa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Endereço</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Criado em</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {partners?.map((partner) => (
                <tr key={partner.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">{partner.name}</div>
                    <div className="text-sm text-slate-500">{partner.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {partner.street ? (
                      <>
                        {partner.street}, {partner.number}<br />
                        <span className="text-xs">{partner.neighborhood} - {partner.city}/{partner.state}</span>
                      </>
                    ) : (
                      partner.address || '-'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Ativo
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {new Date(partner.created_at).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
              {partners?.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    Nenhum parceiro cadastrado nesta academia.
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
