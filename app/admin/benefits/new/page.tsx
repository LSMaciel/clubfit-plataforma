'use client'

import { createBenefit } from '../actions'
import { FormInput } from '@/components/ui/form-input'
import Link from 'next/link'
import { useState } from 'react'

export default function NewBenefitPage() {
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setError(null)
    const result = await createBenefit(null, formData)
    if (result?.error) {
      setError(result.error)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
       <nav className="bg-white border-b border-slate-200 px-8 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
            <Link href="/admin/benefits" className="text-sm text-slate-500 hover:text-slate-900">
                ← Voltar
            </Link>
            <h1 className="font-bold text-xl text-slate-900">Nova Promoção</h1>
        </div>
      </nav>

      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <form action={handleSubmit} className="space-y-6">
                    
                    <div className="bg-indigo-50 border border-indigo-100 rounded-md p-4 mb-6">
                        <h3 className="text-sm font-bold text-indigo-900">Dica de Sucesso</h3>
                        <p className="text-xs text-indigo-700 mt-1">
                            Ofertas simples e diretas funcionam melhor. Ex: "15% OFF em todo o cardápio" ou "Sobremesa grátis na compra de um prato".
                        </p>
                    </div>

                    <FormInput 
                        label="Título da Oferta" 
                        name="title" 
                        placeholder="Ex: 15% de Desconto em Suplementos" 
                        required 
                        maxLength={60}
                    />

                    <div className="w-full">
                        <label htmlFor="rules" className="block text-sm font-medium text-slate-700 mb-1">
                            Regras e Condições
                        </label>
                        <textarea
                            id="rules"
                            name="rules"
                            rows={4}
                            className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                            placeholder="Ex: Válido apenas de segunda a quarta-feira. Não cumulativo com outras promoções. Apresente o QR Code no pagamento."
                        />
                    </div>

                    <div className="w-full md:w-1/2">
                        <label htmlFor="validity_end" className="block text-sm font-medium text-slate-700 mb-1">
                            Válido até (Opcional)
                        </label>
                        <input
                            type="date"
                            id="validity_end"
                            name="validity_end"
                            className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                        />
                        <p className="mt-1 text-xs text-slate-400">Deixe em branco se for por tempo indeterminado.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-md text-sm border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="pt-4 flex justify-end gap-3">
                        <Link 
                            href="/admin/benefits"
                            className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 text-sm font-medium"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium shadow-sm"
                        >
                            Publicar Oferta
                        </button>
                    </div>

                </form>
            </div>
        </div>
      </main>
    </div>
  )
}