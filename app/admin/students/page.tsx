
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { formatCPF } from '@/utils/formatters'

export default async function StudentsListPage() {
  const supabase = await createClient()

  // RLS filtra automaticamente pelos alunos da academia do usuário logado
  const { data: students } = await supabase
    .from('students')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center">
        <div className="font-bold text-xl text-slate-900">Gestão de Alunos</div>
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
          <h1 className="text-2xl font-bold text-slate-800">Base de Alunos</h1>
          <Link
            href="/admin/students/new"
            className="bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-800"
          >
            + Novo Aluno
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">CPF</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Contato</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Cadastrado em</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {students?.map((student) => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">{student.full_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-mono">
                    {formatCPF(student.cpf)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    <div className="flex flex-col">
                      <span>{student.email || '-'}</span>
                      <span className="text-xs">{student.phone || ''}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${student.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {student.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {new Date(student.created_at).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
              {students?.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Nenhum aluno cadastrado. Adicione seus alunos para que eles possam acessar os benefícios.
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
