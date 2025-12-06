
'use client'

import { createPartner } from '../actions'
import { FormInput } from '@/components/ui/form-input'
import { AddressForm } from '@/components/shared/address-form'
import Link from 'next/link'
import { useState } from 'react'

export default function NewPartnerPage() {
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setError(null)
        const result = await createPartner(null, formData)
        if (result?.error) {
            setError(result.error)
        }
    }

    return (
        <main className="flex-1 p-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold text-slate-900 mb-6">Novo Parceiro</h1>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                    <form action={handleSubmit} className="space-y-8">

                        {/* Seção 1: Dados da Empresa */}
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Dados do Estabelecimento</h2>
                            <div className="grid grid-cols-1 gap-6">
                                <FormInput
                                    label="Nome Fantasia"
                                    name="partner_name"
                                    placeholder="Ex: Pizzaria do Zé"
                                    required
                                />
                                {/* Componente Inteligente de Endereço */}
                                <AddressForm />
                                <div className="w-full">
                                    <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
                                        Descrição Curta (Categoria)
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={3}
                                        className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                        placeholder="Ex: Pizzaria artesanal com desconto para alunos."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Seção 2: Dados de Acesso */}
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Acesso do Responsável (Dono)</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput
                                    label="Nome do Responsável"
                                    name="owner_name"
                                    placeholder="Nome Completo"
                                    required
                                />
                                <div className="hidden md:block"></div> {/* Spacer */}
                                <FormInput
                                    label="E-mail de Login"
                                    name="owner_email"
                                    type="email"
                                    placeholder="admin@pizzaria.com"
                                    required
                                />
                                <FormInput
                                    label="Senha Inicial"
                                    name="owner_password"
                                    type="text" // Mostrar texto para facilitar cadastro
                                    placeholder="Mínimo 6 caracteres"
                                    required
                                    minLength={6}
                                />
                            </div>
                            <p className="mt-2 text-xs text-slate-500 bg-blue-50 p-2 rounded text-center">
                                ℹ️ Guarde esta senha. O parceiro usará este e-mail e senha para acessar o painel de promoções.
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-md text-sm border border-red-100">
                                {error}
                            </div>
                        )}

                        <div className="pt-4 flex justify-end gap-3">
                            <Link
                                href="/admin/partners"
                                className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 text-sm font-medium"
                            >
                                Cancelar
                            </Link>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 text-sm font-medium"
                            >
                                Cadastrar Parceiro
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </main>
    )
}
