'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FormInput } from '@/components/ui/form-input'

export default function DesignSystemPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-600 pb-20">
            {/* 
               PROFESSIONAL HEADER 
               - Solid structure
               - Clear separation
            */}
            <header className="bg-white border-b border-slate-200 px-8 py-5 mb-10 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-8 bg-slate-900 rounded-md flex items-center justify-center text-white font-bold">C</div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 leading-none">ClubFit Admin</h1>
                            <p className="text-xs text-slate-500 mt-1">Design System v2.0 (Professional)</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-8 space-y-12">

                {/* 1. GUIDELINE */}
                <section>
                    <div className="mb-6 border-b border-slate-200 pb-4">
                        <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">01. Diretrizes Visuais</h2>
                        <p className="text-sm text-slate-500 mt-1">Foco em legibilidade, estrutura e "Sharpness".</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="p-6 border-l-4 border-l-slate-900 rounded-none rounded-r-lg">
                            <h3 className="font-bold text-slate-900 mb-2">Estrutura Sólida</h3>
                            <p className="text-sm text-slate-600">
                                Bordas definidas (`border-slate-200`) e cantos com raio contido (`rounded-md`).
                                Transmite estabilidade.
                            </p>
                        </Card>
                        <Card className="p-6 border-l-4 border-l-indigo-600 rounded-none rounded-r-lg">
                            <h3 className="font-bold text-slate-900 mb-2">Alto Contraste</h3>
                            <p className="text-sm text-slate-600">
                                Preto sobre Branco. Ações em Indigo ou Preto. Sem ambiguidades visuais.
                            </p>
                        </Card>
                        <Card className="p-6 border-l-4 border-l-emerald-600 rounded-none rounded-r-lg">
                            <h3 className="font-bold text-slate-900 mb-2">Densidade de Dados</h3>
                            <p className="text-sm text-slate-600">
                                Espaçamento otimizado para exibir mais informações sem poluição visual.
                            </p>
                        </Card>
                    </div>
                </section>

                {/* 2. COMPONENTES */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Botões */}
                    <div>
                        <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-2">
                            <h2 className="text-sm font-bold text-slate-900 uppercase">Botões & Ações</h2>
                        </div>
                        <Card className="p-8 flex flex-col gap-6 items-start bg-white">
                            <div className="flex flex-wrap gap-3 items-center">
                                <Button variant="primary">Primary Action</Button>
                                <Button variant="secondary">Secondary</Button>
                                <Button variant="outline">Outline</Button>
                            </div>
                            <div className="flex flex-wrap gap-3 items-center">
                                <Button size="sm" variant="primary">Small</Button>
                                <Button size="sm" variant="outline">Small Outline</Button>
                                <Button size="sm" variant="ghost">Ghost Config</Button>
                            </div>
                            <Button variant="danger" className="w-full">Danger Zone (Full Width)</Button>
                        </Card>
                    </div>

                    {/* Cards & KPIs */}
                    <div>
                        <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-2">
                            <h2 className="text-sm font-bold text-slate-900 uppercase">Data Cards</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Card KPI 1 */}
                            <Card className="p-5">
                                <div className="text-slate-500 text-xs font-semibold uppercase mb-2">Receita Total</div>
                                <div className="flex items-end justify-between">
                                    <span className="text-2xl font-bold text-slate-900">R$ 14.2k</span>
                                    <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                                        +4.5%
                                    </span>
                                </div>
                            </Card>
                            {/* Card KPI 2 */}
                            <Card className="p-5">
                                <div className="text-slate-500 text-xs font-semibold uppercase mb-2">Novos Alunos</div>
                                <div className="flex items-end justify-between">
                                    <span className="text-2xl font-bold text-slate-900">128</span>
                                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                                        0%
                                    </span>
                                </div>
                            </Card>

                            {/* List Item */}
                            <Card className="col-span-2 p-0 overflow-hidden">
                                <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase">
                                    Atividades Recentes
                                </div>
                                <div className="divide-y divide-slate-100">
                                    <div className="px-5 py-3 hover:bg-slate-50 flex justify-between items-center cursor-pointer text-sm">
                                        <span className="text-slate-900 font-medium">Matrícula #4920</span>
                                        <span className="text-slate-500 text-xs">há 2 min</span>
                                    </div>
                                    <div className="px-5 py-3 hover:bg-slate-50 flex justify-between items-center cursor-pointer text-sm">
                                        <span className="text-slate-900 font-medium">Pagamento Confirmado</span>
                                        <span className="text-slate-500 text-xs">há 15 min</span>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                </section>

                {/* 3. INPUTS */}
                <section>
                    <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-2">
                        <h2 className="text-sm font-bold text-slate-900 uppercase">Formulários & Inputs</h2>
                    </div>
                    <Card className="p-8 max-w-2xl grid grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-semibold text-slate-900 mb-1">Nome da Academia</label>
                            <input type="text" className="w-full rounded-md border-slate-300 shadow-sm focus:border-slate-900 focus:ring-slate-900 transition-colors" placeholder="Ex: Ironberg CT" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-1">CNPJ</label>
                            <input type="text" className="w-full rounded-md border-slate-300 shadow-sm focus:border-slate-900 focus:ring-slate-900 transition-colors" placeholder="00.000.000/0001-00" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-1">Status</label>
                            <select className="w-full rounded-md border-slate-300 shadow-sm focus:border-slate-900 focus:ring-slate-900 transition-colors">
                                <option>Ativo</option>
                                <option>Inativo</option>
                            </select>
                        </div>
                    </Card>
                </section>

            </main>
        </div>
    )
}
