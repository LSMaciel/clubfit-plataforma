import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function AcademiesListPage() {
  const supabase = await createClient()

  // Buscar academias (apenas Super Admin verá todas devido ao RLS, mas garantimos visualização)
  const { data: academies, error } = await supabase
    .from('academies')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Academias Cadastradas</h1>
        <Link
          href="/admin/academies/new"
          className="bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-800"
        >
          + Nova Academia
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Logo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Slug (URL)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Cor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Criado em</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {academies?.map((academy) => (
              <tr key={academy.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {academy.logo_url ? (
                    <img src={academy.logo_url} alt={academy.name} className="h-10 w-10 rounded-full object-cover border border-slate-200" />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs">Sem logo</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                  {academy.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  /{academy.slug}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border border-slate-200" style={{ backgroundColor: academy.primary_color || '#000000' }}></div>
                    <span className="text-sm text-slate-500">{academy.primary_color}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {new Date(academy.created_at).toLocaleDateString('pt-BR')}
                </td>
              </tr>
            ))}
            {academies?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  Nenhuma academia encontrada. Comece cadastrando a primeira!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}
