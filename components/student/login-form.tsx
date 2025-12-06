'use client'

import { useState } from 'react'
import { studentLogin } from '@/app/student/actions'
import { useRouter } from 'next/navigation'

export function StudentLoginForm() {
  const [cpf, setCpf] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 11) value = value.slice(0, 11)

    // Simple mask XXX.XXX.XXX-XX
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')

    setCpf(value)
    setError(null)
  }

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    const result = await studentLogin(formData)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      // Redirect handled by server action or router refresh
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="cpf" className="block text-sm font-medium text-slate-700 mb-2">
          Digite seu CPF
        </label>
        <div className="relative">
          <input
            id="cpf"
            name="cpf"
            type="tel"
            value={cpf}
            onChange={handleCpfChange}
            placeholder="000.000.000-00"
            className="block w-full rounded-lg border-slate-300 px-4 py-4 text-center text-2xl font-bold tracking-widest text-slate-900 placeholder:text-slate-300 focus:border-slate-900 focus:ring-slate-900"
            required
          />
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-center text-sm text-red-600">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={cpf.length < 14 || isLoading}
        className="w-full rounded-lg bg-slate-900 py-4 text-base font-bold text-white transition hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Entrando...' : 'Acessar minha conta'}
      </button>
    </form>
  )
}