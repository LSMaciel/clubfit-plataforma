
'use client'

import { createStudent } from '../actions'
import { FormInput } from '@/components/ui/form-input'
import Link from 'next/link'
import { useState } from 'react'

export default function NewStudentPage() {
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setError(null)
    const result = await createStudent(null, formData)
    if (result?.error) {
      setError(result.error)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
       <nav className="bg-white border-b border-slate-200 px-8 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
            <Link href="/admin/students" className="text-sm text-slate-500 hover:text-slate-900">
                ← Voltar
            </Link>
            <h1 className="font-bold text-xl text-slate-900">Novo Aluno</h1>
        </div>
      </nav>

      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <form action={handleSubmit} className="space-y-6">
                    
                    <FormInput 
                        label="Nome Completo" 
                        name="full_name" 
                        placeholder="Ex: Ana Souza" 
                        required 
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <FormInput 
                            label="CPF (Apenas números ou com pontos)" 
                            name="cpf" 
                            placeholder="000.000.000-00" 
                            required 
                            maxLength={14}
                        />
                        <FormInput 
                            label="Telefone (WhatsApp)" 
                            name="phone" 
                            placeholder="(11) 99999-9999" 
                        />
                    </div>

                    <FormInput 
                        label="E-mail (Opcional)" 
                        name="email" 
                        type="email"
                        placeholder="ana.souza@email.com" 
                    />

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-md text-sm border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="pt-4 flex justify-end gap-3">
                        <Link 
                            href="/admin/students"
                            className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 text-sm font-medium"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 text-sm font-medium"
                        >
                            Cadastrar Aluno
                        </button>
                    </div>

                </form>
            </div>
        </div>
      </main>
    </div>
  )
}
