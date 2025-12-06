import { StudentLoginForm } from '@/components/student/login-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Acesso do Aluno | ClubFit',
    description: 'Acesse sua carteira digital.',
}

export default function StudentLoginPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-sm">
                <div className="mb-10 text-center">
                    <div className="mx-auto h-16 w-16 rounded-xl bg-slate-900 flex items-center justify-center mb-6">
                        <span className="text-2xl font-bold text-white">CF</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Bem-vindo(a)</h1>
                    <p className="mt-2 text-slate-500">
                        Informe seu CPF para acessar seus benefícios e carteira digital.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                    <StudentLoginForm />
                </div>

                <p className="mt-8 text-center text-xs text-slate-400">
                    &copy; 2024 ClubFit. Todos os direitos reservados.
                </p>
            </div>
        </div>
    )
}
