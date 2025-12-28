import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { formatCPF } from '@/utils/formatters'
import { PageShell } from '@/components/admin/page-shell'
import { Button } from '@/components/ui/button'

export default async function StudentsListPage() {
  const supabase = await createClient()

  // RLS filtra automaticamente pelos alunos da academia do usuário logado
  const { data: students } = await supabase
    .from('students')
    .select('*')
    .order('created_at', { ascending: false })

  const PageActions = (
    <Link href="/admin/students/new">
      <Button variant="primary">
        + Novo Aluno
      </Button>
    </Link>
  )

  return (
    <PageShell
      title="Base de Alunos"
      subtitle="Gerencie o acesso e os benefícios dos seus alunos."
      actions={PageActions}
    >
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-900 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-900 uppercase tracking-wider">CPF</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-900 uppercase tracking-wider">Contato</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-900 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-900 uppercase tracking-wider">Cadastrado em</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {students?.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-slate-900">{student.full_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-mono">
                  {formatCPF(student.cpf)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-700">{student.email || '-'}</span>
                    <span className="text-xs">{student.phone || ''}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-md border ${student.status === 'ACTIVE'
                      ? 'bg-green-50 text-green-700 border-green-100'
                      : 'bg-red-50 text-red-700 border-red-100'
                    }`}>
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
                <td colSpan={5} className="px-6 py-16 text-center text-slate-500">
                  <div className="mx-auto w-12 h-12 bg-slate-100 rounded-md flex items-center justify-center mb-4">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <p className="font-medium text-slate-900">Nenhum aluno cadastrado</p>
                  <p className="text-sm text-slate-500 mt-1">
                    Adicione seus alunos para que eles possam acessar os benefícios.
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
