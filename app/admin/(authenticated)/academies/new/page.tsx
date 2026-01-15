'use client'

import { useActionState } from 'react' // Note: In Next.js 14+ / React 18 canary this might be useFormState from react-dom
// But for broader compatibility or newer React, we use the hooks available. 
// Assuming standard Next.js 14 server actions pattern.
// If useActionState is not available, we use generic form handling.
// Let's use standard client component form with server action prop.

import { createAcademy } from '../actions'
import { FormInput } from '@/components/ui/form-input'
import { AddressForm } from '@/components/shared/address-form'
import Link from 'next/link'
import { useState } from 'react'

export default function NewAcademyPage() {
    const [createAdmin, setCreateAdmin] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Wrapper para capturar erro da Server Action sem usar useFormState (para simplicidade e compatibilidade)
    async function handleSubmit(formData: FormData) {
        setError(null)
        const result = await createAcademy(null, formData)
        if (result?.error) {
            setError(result.error)
        }
    }

    return (
        <main className="flex-1 p-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold text-slate-900 mb-6">Nova Academia</h1>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                    <form action={handleSubmit} className="space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput
                                label="Nome da Academia"
                                name="name"
                                placeholder="Ex: Ironberg CT"
                                required
                            />
                            <FormInput
                                label="Slug (URL)"
                                name="slug"
                                placeholder="ex: ironberg-ct"
                                required
                                pattern="^[a-z0-9\-]+$"
                                title="Apenas letras minúsculas, números e hífens."
                            />
                        </div>

                        {/* Seção 2: Dados de Acesso (Novo Admin) */}
                        <div>
                            <div className="flex items-center justify-between mb-4 border-b pb-2">
                                <h2 className="text-lg font-bold text-slate-800">Acesso do Responsável</h2>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="create_admin"
                                        className="h-4 w-4 rounded border-gray-300 text-slate-900 focus:ring-slate-900"
                                        checked={createAdmin}
                                        onChange={(e) => setCreateAdmin(e.target.checked)}
                                    />
                                    <label htmlFor="create_admin" className="text-sm font-medium text-slate-700 cursor-pointer">
                                        Criar usuário administrador?
                                    </label>
                                </div>
                            </div>

                            {createAdmin ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-4 fade-in duration-300">
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
                                        placeholder="admin@academia.com"
                                        required
                                    />
                                    <div className="col-span-1 md:col-span-2 bg-blue-50 text-blue-800 p-4 rounded-md text-sm border border-blue-100 flex items-start gap-2">
                                        <span>📧</span>
                                        <p>
                                            Um convite será enviado para este e-mail.
                                            O responsável receberá um link para definir a senha e acessar o sistema.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500 bg-gray-50 p-4 rounded-md border border-gray-100">
                                    Nenhum usuário será criado neste momento. Você poderá adicionar administradores manualmente depois ou gerenciar esta academia como Super Admin.
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput
                                label="Cor Primária"
                                name="primary_color"
                                type="color"
                                defaultValue="#000000"
                                className="h-12 p-1 cursor-pointer"
                            />
                            <div className="w-full">
                                <label htmlFor="logo" className="block text-sm font-medium text-slate-700 mb-1">
                                    Logo da Academia
                                </label>
                                <input
                                    id="logo"
                                    name="logo"
                                    type="file"
                                    accept="image/*"
                                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                                />
                                <p className="mt-1 text-xs text-slate-400">Recomendado: PNG ou JPG quadrado (500x500px)</p>
                            </div>
                        </div>

                        {/* Seção de Localização */}
                        <div className="pt-4 border-t border-slate-100">
                            <h3 className="text-sm font-medium text-slate-900 mb-4">Localização & Endereço</h3>
                            <AddressForm />
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-md text-sm border border-red-100">
                                {error}
                            </div>
                        )}

                        <div className="pt-4 flex justify-end gap-3">
                            <Link
                                href="/admin/academies"
                                className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 text-sm font-medium"
                            >
                                Cancelar
                            </Link>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 text-sm font-medium"
                            >
                                Criar Academia
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </main>
    )
}
