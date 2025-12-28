import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { unlinkPartner } from './actions'
import { PageShell } from '@/components/admin/page-shell'
import { Button } from '@/components/ui/button'
import { getEffectiveAcademyId } from '@/utils/admin-context'
import { redirect } from 'next/navigation'

export default async function PartnersListPage() {
  const supabase = await createClient()

  // 1. Verificar Contexto
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('users')
    .select('role, academy_id')
    .eq('id', user.id)
    .single()

  const effectiveAcademyId = await getEffectiveAcademyId(profile)

  // 2. Lógica de Redirecionamento (Smart Context)
  // Se for Super Admin e estiver no modo "Global" (sem academy_id),
  // ele deve ver o Catálogo Global, não a lista vazia da academia.
  if (!effectiveAcademyId && profile?.role === 'SUPER_ADMIN') {
    redirect('/admin/super/partners')
  }

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

  const PageActions = (
    <div className="flex gap-3">
      <Link href="/admin/partners/explore">
        <button className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-md text-sm font-semibold transition-colors shadow-sm">
          🔍 Explorar Rede
        </button>
      </Link>
      <Link href="/admin/partners/new">
        <button className="bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm">
          + Novo Parceiro
        </button>
      </Link>
    </div>
  )

  return (
    <PageShell
      title="Parceiros Comerciais"
      subtitle="Gerencie os estabelecimentos parceiros vinculados à sua academia."
      actions={PageActions}
    >
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
              // Fallback de endereço
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
    </PageShell>
  )
}
