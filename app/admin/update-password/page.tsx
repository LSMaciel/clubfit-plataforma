import { updatePassword } from './actions'
import { PageShell } from '@/components/admin/page-shell'

export default async function UpdatePasswordPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 w-full max-w-md">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-slate-900">Definir Senha</h1>
                    <p className="text-slate-500 text-sm mt-2">
                        Crie uma nova senha segura para acessar sua conta ClubFit.
                    </p>
                </div>

                <form action={updatePassword} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nova Senha</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            required
                            minLength={6}
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Confirmar Senha</label>
                        <input
                            name="confirm_password"
                            type="password"
                            placeholder="••••••••"
                            required
                            minLength={6}
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2.5 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors"
                    >
                        Salvar Senha e Entrar
                    </button>
                </form>
            </div>
        </div>
    )
}
