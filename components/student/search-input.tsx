'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export function SearchInput({ initialQuery }: { initialQuery?: string }) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [text, setText] = useState(initialQuery || '')

    // Debounce Effect
    useEffect(() => {
        const timer = setTimeout(() => {
            const currentQuery = searchParams.get('query') || ''
            if (text !== currentQuery) {
                const params = new URLSearchParams(searchParams.toString())
                if (text) {
                    params.set('query', text)
                } else {
                    params.delete('query')
                }
                router.replace(`/student/search?${params.toString()}`)
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [text, router, searchParams])

    return (
        <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Busque por nome, sushis..."
                className="w-full bg-slate-50 border-none rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-[var(--primary-color)]/20 outline-none transition-all"
            />
        </div>
    )
}
