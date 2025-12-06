import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { toggleBenefitStatus } from './actions'

export default async function BenefitsListPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return <div>Acesso negado</div>

  // 1. Identificar o ID do Parceiro atual
  const { data: partner } = await supabase
    .from('partners')
    .select('id, name')
    .eq('owner_id', user.id)
    .single()

  // Se for Admin acessando, pode não ter partner vinculado diretamente, 
  // mas para esta Story assumimos o fluxo do Parceiro.
  // Se não tiver partner, array vazio.
  let benefits = []

  if (partner) {
    const { data } = await supabase
      .from('benefits')
      .select('*')
      .eq('partner_id', partner.id)
      .order('created_at', { ascending: false })
    benefits = data || []
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center">
        <div className="font-bold text-xl text-slate-900">Minhas Ofertas</div>
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
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Promoções Ativas</h1>
            <p className="text-sm text-slate-500">
              Gerenciando ofertas de: <span className="font-medium text-slate-900">{partner?.name || '...'}</span>
            </p>
          </div>
          <Link
            href="/admin/benefits/new"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 shadow-sm"
          >
            + Criar Promoção
          </Link>
        </div>

        {!partner ? (
          <div className="p-8 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
            Você não possui um estabelecimento vinculado ao seu usuário. Peça ao administrador da academia para vincular.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit) => (
              <div key={benefit.id} className={`bg-white rounded-xl shadow-sm border p-6 flex flex-col justify-between ${benefit.status === 'ACTIVE' ? 'border-slate-200' : 'border-slate-100 opacity-75'}`}>
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${benefit.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                      {benefit.status === 'ACTIVE' ? 'ATIVA' : 'INATIVA'}
                    </span>
                    {benefit.validity_end && (
                      <span className="text-xs text-slate-400">
                        Vence: {new Date(benefit.validity_end).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{benefit.title}</h3>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-3 whitespace-pre-line">
                    {benefit.rules || 'Sem regras específicas.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <form action={async () => {
                    'use server'
                    await toggleBenefitStatus(benefit.id, benefit.status)
                  }}>
                    <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                      {benefit.status === 'ACTIVE' ? 'Pausar Oferta' : 'Reativar Oferta'}
                    </button>
                  </form>

                  <div className="text-xs text-slate-400">
                    👀 Visível no app
                  </div>
                </div>
              </div>
            ))}

            {benefits.length === 0 && (
              <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-slate-300">
                <div className="text-4xl mb-4">🏷️</div>
                <h3 className="text-lg font-medium text-slate-900">Nenhuma promoção criada</h3>
                <p className="text-slate-500 mb-6">Crie sua primeira oferta para atrair os alunos da academia.</p>
                <Link
                  href="/admin/benefits/new"
                  className="text-indigo-600 font-medium hover:underline"
                >
                  Criar agora &rarr;
                </Link>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}