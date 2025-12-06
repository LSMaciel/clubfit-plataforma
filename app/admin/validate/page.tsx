
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { QrScanner } from '@/components/partner/qr-scanner'
import { validateTokenAction, ValidationResult } from './actions'
import { FormInput } from '@/components/ui/form-input'

export default function ValidatePage() {
  const [activeTab, setActiveTab] = useState<'SCAN' | 'MANUAL'>('SCAN')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ValidationResult | null>(null)
  
  async function handleValidation(code: string) {
    if (!code) return
    setLoading(true)
    setResult(null)
    
    // Limpar espaços em branco acidentais
    const cleanCode = code.trim()
    
    const response = await validateTokenAction(cleanCode)
    
    setResult(response)
    setLoading(false)
  }

  function reset() {
    setResult(null)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
       <nav className="bg-white border-b border-slate-200 px-8 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-sm text-slate-500 hover:text-slate-900">
                ← Voltar
            </Link>
            <h1 className="font-bold text-xl text-slate-900">Validar Voucher</h1>
        </div>
      </nav>

      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-md mx-auto">
            
            {/* CARD DE RESULTADO (OVERLAY) */}
            {result && (
                <div className={`mb-6 p-6 rounded-2xl shadow-lg border-2 text-center animate-in zoom-in-95 duration-200 ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="text-4xl mb-2">
                        {result.success ? '✅' : '❌'}
                    </div>
                    <h2 className={`text-xl font-bold mb-1 ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                        {result.success ? 'Validado com Sucesso!' : 'Falha na Validação'}
                    </h2>
                    <p className={`text-sm mb-4 ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                        {result.message}
                    </p>

                    {result.success && (
                        <div className="bg-white/60 rounded-lg p-3 text-left space-y-2 mb-4">
                            <div>
                                <span className="text-xs text-green-700 font-bold uppercase">Aluno</span>
                                <p className="text-green-900 font-medium">{result.student}</p>
                            </div>
                            <div>
                                <span className="text-xs text-green-700 font-bold uppercase">Benefício Aplicado</span>
                                <p className="text-green-900 font-medium">{result.benefit}</p>
                            </div>
                        </div>
                    )}

                    <button 
                        onClick={reset}
                        className={`w-full py-3 rounded-xl font-bold text-white shadow-md ${result.success ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                    >
                        {result.success ? 'Validar Próximo' : 'Tentar Novamente'}
                    </button>
                </div>
            )}

            {/* INTERFACE DE LEITURA (Só mostra se não tiver resultado na tela) */}
            {!result && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    {/* Abas */}
                    <div className="flex border-b border-slate-100">
                        <button 
                            onClick={() => setActiveTab('SCAN')}
                            className={`flex-1 py-4 text-sm font-medium text-center ${activeTab === 'SCAN' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            📷 Câmera
                        </button>
                        <button 
                            onClick={() => setActiveTab('MANUAL')}
                            className={`flex-1 py-4 text-sm font-medium text-center ${activeTab === 'MANUAL' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            ⌨️ Digitar Código
                        </button>
                    </div>

                    <div className="p-6">
                        {activeTab === 'SCAN' && (
                             <QrScanner onScanSuccess={handleValidation} />
                        )}

                        {activeTab === 'MANUAL' && (
                            <form action={(formData) => handleValidation(formData.get('code') as string)} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2 text-center">
                                        Código do Voucher (8 caracteres ou completo)
                                    </label>
                                    <input 
                                        name="code"
                                        type="text"
                                        placeholder="Ex: 8f9a2..."
                                        className="block w-full text-center text-2xl font-mono tracking-widest rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-4 border uppercase"
                                        autoFocus
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {loading ? 'Verificando...' : 'Validar Código'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {!result && activeTab === 'SCAN' && (
                 <p className="text-center mt-6 text-xs text-slate-400">
                    Certifique-se que o ambiente está bem iluminado.
                </p>
            )}

        </div>
      </main>
    </div>
  )
}
