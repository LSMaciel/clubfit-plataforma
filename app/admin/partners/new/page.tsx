'use client'

import { createPartner, linkPartner, searchGlobalPartners } from '../actions'
import { FormInput } from '@/components/ui/form-input'
import { AddressForm } from '@/components/shared/address-form'
import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

// Debounce hook simple implementation
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay)
        return () => clearTimeout(handler)
    }, [value, delay])
    return debouncedValue
}

export default function NewPartnerPage() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)

    // States for Smart Search
    const [searchTerm, setSearchTerm] = useState('')
    const [cnpjTerm, setCnpjTerm] = useState('')
    const [suggestions, setSuggestions] = useState<any[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [isSearching, setIsSearching] = useState(false)

    // Selected Partner (Link Mode)
    const [selectedPartner, setSelectedPartner] = useState<any | null>(null)

    // Debounced terms
    const debouncedName = useDebounce(searchTerm, 400)
    const debouncedCnpj = useDebounce(cnpjTerm, 400)

    // Trigger search when user types
    useEffect(() => {
        const query = debouncedName || debouncedCnpj
        if (query && query.length >= 3 && !selectedPartner) {
            setIsSearching(true)
            searchGlobalPartners(query).then(result => {
                setIsSearching(false)
                if (result.data) {
                    setSuggestions(result.data)
                    setShowSuggestions(true)
                }
            })
        } else {
            setSuggestions([])
            setShowSuggestions(false)
        }
    }, [debouncedName, debouncedCnpj, selectedPartner])

    function handleSelectPartner(partner: any) {
        setSelectedPartner(partner)
        setShowSuggestions(false)
        // Clear search terms to avoid re-triggering search immediately but keep form clean
        // Actually, we want to popoulate the form visually or just show a "Selected Card"
    }

    function clearSelection() {
        setSelectedPartner(null)
        setSearchTerm('')
        setCnpjTerm('')
        setSuggestions([])
    }

    async function handleSubmit(formData: FormData) {
        setError(null)

        if (selectedPartner) {
            // LINK MODE
            const result = await linkPartner(selectedPartner.id)
            if (result?.error) {
                setError(result.error)
            } else {
                // Success - Redirect
                router.refresh()
                router.push('/admin/partners')
            }
        } else {
            // CREATE MODE (Legacy/Standard)
            const result = await createPartner(null, formData)
            if (result?.error) {
                setError(result.error)
            }
        }
    }

    return (
        <main className="flex-1 p-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold text-slate-900 mb-6">
                    {selectedPartner ? 'Vincular Parceiro Existente' : 'Novo Parceiro'}
                </h1>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 relative">

                    {/* SUGGESTION DROPDOWN */}
                    {showSuggestions && suggestions.length > 0 && !selectedPartner && (
                        <div className="absolute top-24 left-8 right-8 z-50 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                            <div className="p-2 text-xs font-semibold text-slate-500 bg-slate-50 uppercase tracking-wider">
                                Sugestões encontradas na rede
                            </div>
                            {suggestions.map(p => (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => handleSelectPartner(p)}
                                    className="w-full text-left px-4 py-3 hover:bg-indigo-50 flex justify-between items-center transition-colors border-b last:border-0 border-slate-100"
                                >
                                    <div>
                                        <div className="font-bold text-slate-800">{p.name}</div>
                                        <div className="text-sm text-slate-500">{p.city}/{p.state} • {p.cnpj}</div>
                                    </div>
                                    <div className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                                        Selecionar
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    <form action={handleSubmit} className="space-y-8">

                        {selectedPartner ? (
                            // --- VIEW MODE (SELECTED) ---
                            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6 text-center space-y-4">
                                <div className="mx-auto h-16 w-16 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-indigo-600 shadow-sm border border-indigo-100">
                                    {selectedPartner.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">{selectedPartner.name}</h3>
                                    <p className="text-slate-600">{selectedPartner.description}</p>
                                    <p className="text-sm text-slate-500 mt-1">{selectedPartner.cnpj}</p>
                                    <p className="text-sm text-slate-500">{selectedPartner.city}/{selectedPartner.state}</p>
                                </div>

                                {selectedPartner.link_status === 'ACTIVE' ? (
                                    <div className="p-4 bg-green-100 text-green-800 rounded-md font-medium">
                                        Este parceiro já está vinculado à sua academia!
                                    </div>
                                ) : (
                                    <div className="p-4 bg-white rounded-md border border-indigo-100 text-sm text-slate-600">
                                        Ao clicar em Confirmar, você ativará o vínculo com este parceiro.
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={clearSelection}
                                    className="text-sm text-slate-500 hover:text-slate-800 underline"
                                >
                                    Não é este? Cancelar seleção e cadastrar novo
                                </button>
                            </div>
                        ) : (
                            // --- CREATE MODE (INPUTS) ---
                            <>
                                {/* Seção 1: Dados da Empresa */}
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Dados do Estabelecimento</h2>
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-800 mb-2 border border-blue-100">
                                            💡 Comece digitando. Se o parceiro já existir, ele aparecerá na lista para você vincular.
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="relative">
                                                <FormInput
                                                    label="Nome Fantasia"
                                                    name="partner_name"
                                                    placeholder="Ex: Pizzaria do Zé"
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    required={!selectedPartner}
                                                    autoComplete="off"
                                                />
                                                {isSearching && (
                                                    <div className="absolute right-3 top-9 text-slate-400">
                                                        <div className="animate-spin h-4 w-4 border-2 border-slate-300 border-t-transparent rounded-full" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="relative">
                                                <FormInput
                                                    label="CNPJ"
                                                    name="cnpj"
                                                    placeholder="00.000.000/0000-00"
                                                    value={cnpjTerm}
                                                    onChange={(e) => setCnpjTerm(e.target.value)}
                                                    required={!selectedPartner}
                                                    autoComplete="off"
                                                />
                                            </div>
                                        </div>

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
                                            required={!selectedPartner}
                                        />
                                        <div className="hidden md:block"></div> {/* Spacer */}
                                        <FormInput
                                            label="E-mail de Login"
                                            name="owner_email"
                                            type="email"
                                            placeholder="admin@pizzaria.com"
                                            required={!selectedPartner}
                                        />
                                        <FormInput
                                            label="Senha Inicial"
                                            name="owner_password"
                                            type="text"
                                            placeholder="Mínimo 6 caracteres"
                                            required={!selectedPartner}
                                            minLength={6}
                                        />
                                    </div>
                                    <p className="mt-2 text-xs text-slate-500 bg-slate-50 p-2 rounded text-center border border-slate-100">
                                        ℹ️ O parceiro usará este e-mail e senha para acessar o painel dele.
                                    </p>
                                </div>
                            </>
                        )}

                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-md text-sm border border-red-100 animate-pulse">
                                ⚠️ {error}
                            </div>
                        )}

                        <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-8">
                            <Link
                                href="/admin/partners"
                                className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 text-sm font-medium"
                            >
                                Cancelar
                            </Link>
                            {selectedPartner ? (
                                <button
                                    type="submit"
                                    disabled={selectedPartner.link_status === 'ACTIVE'}
                                    className={`px-6 py-2 rounded-md text-white text-sm font-medium transition-colors ${selectedPartner.link_status === 'ACTIVE'
                                        ? 'bg-green-500 cursor-not-allowed'
                                        : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200'
                                        }`}
                                >
                                    {selectedPartner.link_status === 'ACTIVE' ? '✅ Já Vinculado' : '🔗 Confirmar Vínculo'}
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 text-sm font-medium shadow-lg shadow-slate-200"
                                >
                                    Cadastrar Novo
                                </button>
                            )}
                        </div>

                    </form>
                </div>
            </div>
        </main>
    )
}
