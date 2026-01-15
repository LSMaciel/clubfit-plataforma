'use client'

import { createGlobalPartnerSuper } from '../actions'
import { FormInput } from '@/components/ui/form-input'
import { AddressForm } from '@/components/shared/address-form'
import Link from 'next/link'
import { useFormStatus } from 'react-dom'
import { useActionState } from 'react'

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md font-medium hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
        >
            {pending ? 'Salvando...' : 'Criar Parceiro Global'}
        </button>
    )
}

const initialState = {
    message: '',
    error: ''
}

export default function NewGlobalPartnerPage() {
    // React 19 / Next.js 16: useActionState replaces useFormState
    const [state, formAction] = useActionState(createGlobalPartnerSuper, initialState)

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8 flex items-center gap-4">
                <Link href="/admin/super/partners" className="text-slate-400 hover:text-slate-600">← Voltar</Link>
                <h1 className="text-2xl font-bold text-slate-900">Novo Parceiro Global</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                {state?.error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-md text-sm">
                        {state.error}
                    </div>
                )}

                <form action={formAction} className="space-y-8">

                    {/* Seção 1: Dados Cadastrais */}
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">1. Dados do Estabelecimento</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput label="Nome Fantasia" name="name" required placeholder="Ex: Madero Steakhouse" />
                            <FormInput label="CNPJ" name="cnpj" required placeholder="00.000.000/0000-00" />
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Descrição / Categoria</label>
                            <textarea name="description" rows={2} className="w-full border-slate-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" />
                        </div>
                    </div>

                    {/* Seção 2: Endereço */}
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">2. Localização</h2>
                        <AddressForm />
                    </div>

                    {/* Seção 3: Responsável */}
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">3. Acesso do Responsável (Owner)</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput label="Nome do Responsável" name="owner_name" required />
                            <div className="md:hidden"></div>
                            <FormInput label="E-mail de Login" name="owner_email" type="email" required />
                        </div>
                        <p className="mt-2 text-xs text-blue-600 bg-blue-50 p-3 rounded text-center border border-blue-100">
                            📧 O responsável receberá um convite por e-mail para definir sua senha.
                        </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                        <Link href="/admin/super/partners" className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-md border border-slate-300">Cancelar</Link>
                        <SubmitButton />
                    </div>
                </form>
            </div>
        </div>
    )
}
