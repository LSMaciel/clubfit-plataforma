'use client'

import { useState, useEffect, useCallback } from 'react'
import { searchGlobalPartners, linkPartner, unlinkPartner } from '@/app/admin/partners/actions'
import Link from 'next/link'

// Quick debounce implementation since hook doesn't exist
function useDebounceValue<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay)
        return () => clearTimeout(handler)
    }, [value, delay])
    return debouncedValue
}

export function PartnerSearch() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const debouncedQuery = useDebounceValue(query, 500)

    const handleSearch = useCallback(async (q: string) => {
        if (!q || q.length < 3) {
            setResults([])
            return
        }
        setLoading(true)
        const { data, error } = await searchGlobalPartners(q)
        setLoading(false)
        if (data) setResults(data)
        if (error) console.error(error)
    }, [])

    useEffect(() => {
        handleSearch(debouncedQuery)
    }, [debouncedQuery, handleSearch])

    const handleLink = async (partnerId: string) => {
        // Optimistic update
        setResults(prev => prev.map(p =>
            p.id === partnerId
                ? { ...p, is_linked: true, link_status: 'ACTIVE' }
                : p
        ))

        const { error } = await linkPartner(partnerId)
        if (error) {
            // Revert if error
            alert('Erro ao vincular parceiros.')
            handleSearch(debouncedQuery)
        }
    }

    const handleUnlink = async (partnerId: string) => {
        // Optimistic update
        setResults(prev => prev.map(p =>
            p.id === partnerId
                ? { ...p, is_linked: false, link_status: 'INACTIVE' }
                : p
        ))

        const { error } = await unlinkPartner(partnerId)
        if (error) {
            alert('Erro ao desvincular parceiro.')
            handleSearch(debouncedQuery)
        }
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Buscar na Rede Global
                </label>
                <div className="relative">
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                        placeholder="Digite o nome do estabelecimento ou CNPJ..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {loading && (
                        <div className="absolute right-3 top-2.5">
                            <div className="animate-spin h-5 w-5 border-2 border-slate-900 border-t-transparent rounded-full"></div>
                        </div>
                    )}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                    Digite pelo menos 3 caracteres para buscar.
                </p>
            </div>

            <div className="space-y-4">
                {results.map((partner) => (
                    <div
                        key={partner.id}
                        className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-300 transition-colors"
                    >
                        <div className="flex gap-4 items-center">
                            <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 shrink-0">
                                {partner.logo_url ? (
                                    <img src={partner.logo_url} alt={partner.name} className="h-12 w-12 rounded-full object-cover" />
                                ) : (
                                    <span className="text-xl font-bold">{partner.name.substring(0, 2).toUpperCase()}</span>
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">{partner.name}</h3>
                                <p className="text-sm text-slate-500">
                                    {partner.city}/{partner.state} • {partner.cnpj || 'Sem CNPJ'}
                                </p>
                                {partner.link_status === 'INACTIVE' && (
                                    <span className="text-xs text-amber-600 font-medium">Vínculo Inativo</span>
                                )}
                            </div>
                        </div>

                        <div>
                            {partner.is_linked ? (
                                <button
                                    onClick={() => handleUnlink(partner.id)}
                                    className="px-4 py-2 text-sm text-red-600 hover:text-red-800 font-medium border border-transparent hover:border-red-100 rounded-md transition-colors"
                                >
                                    Desvincular
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleLink(partner.id)}
                                    className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800 transition-colors shadow-sm"
                                >
                                    Vincular Parceiro
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {query.length >= 3 && results.length === 0 && !loading && (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        <p className="text-slate-500 mb-4">Nenhum parceiro encontrado na rede global.</p>
                        <Link href="/admin/partners/new" className="text-slate-900 font-medium underline underline-offset-4 hover:text-slate-700">
                            Cadastrar um novo parceiro
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
