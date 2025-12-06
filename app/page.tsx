import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans">
            {/* Hero Section */}
            <div className="text-center space-y-4 mb-12">
                <h1 className="text-5xl font-extrabold text-white tracking-tight">
                    ClubFit
                </h1>
                <p className="text-slate-400 text-lg max-w-md mx-auto">
                    Plataforma White-label de fidelidade e benefícios para academias.
                </p>
            </div>

            {/* Cards Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">

                {/* Card: Área Corporativa (Admin) */}
                <Link
                    href="/admin/login"
                    className="group relative block p-8 bg-slate-800 rounded-2xl border border-slate-700 hover:border-indigo-500 transition-all hover:shadow-2xl hover:shadow-indigo-500/20"
                >
                    <div className="absolute top-4 right-4 text-slate-600 group-hover:text-indigo-400 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-indigo-400">Área Corporativa</h3>
                    <p className="text-slate-400 text-sm mb-6">
                        Acesso administrativo para Super Admins, Gestores de Academia e Parceiros Comerciais.
                    </p>
                    <div className="flex items-center text-indigo-400 font-medium text-sm">
                        Acessar Painel &rarr;
                    </div>
                </Link>

                {/* Card: Portal do Aluno */}
                <Link
                    href="/student/login"
                    className="group relative block p-8 bg-slate-800 rounded-2xl border border-slate-700 hover:border-emerald-500 transition-all hover:shadow-2xl hover:shadow-emerald-500/20"
                >
                    <div className="absolute top-4 right-4 text-slate-600 group-hover:text-emerald-400 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12c-2-3-5.5-3-7.5-3-2.5 0-4.5 1.5-4.5 3.5V21h24v-8.5c0-2-2-3.5-4.5-3.5-2 0-5.5 0-7.5 3z" /><path d="M12 12V3a3 3 0 0 0-6 0v9" /><path d="M18 12V6a3 3 0 0 0-6 0v6" /></svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-400">Portal do Aluno</h3>
                    <p className="text-slate-400 text-sm mb-6">
                        Área exclusiva para alunos visualizarem benefícios e gerarem vouchers de desconto.
                    </p>
                    <div className="flex items-center text-emerald-400 font-medium text-sm">
                        Acessar Portal &rarr;
                    </div>
                </Link>

            </div>

            <footer className="mt-16 text-slate-600 text-sm flex flex-col items-center gap-2">
                <p>&copy; 2024 ClubFit MVP. Ambiente de Homologação.</p>
                <p className="text-xs text-slate-700">Documentação disponível em <code>docs/</code></p>
            </footer>
        </div>
    );
}
