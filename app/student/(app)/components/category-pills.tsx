'use client'

import { cn } from '@/utils/cn'
import { useRouter, useSearchParams } from 'next/navigation'

interface Category {
    id: string
    name: string
    slug: string
    icon_name?: string
}

export function CategoryPills({ categories }: { categories: Category[] }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const activeCategory = searchParams.get('category')

    const handleSelect = (slug: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (activeCategory === slug) {
            params.delete('category') // Toggle off
        } else {
            params.set('category', slug)
        }
        router.push(`?${params.toString()}`)
    }

    return (
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar px-4 -mx-4">
            <button
                onClick={() => {
                    const params = new URLSearchParams(searchParams.toString())
                    params.delete('category')
                    router.push(`?${params.toString()}`)
                }}
                className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border",
                    !activeCategory
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                )}
            >
                🔥 Tudo
            </button>

            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => handleSelect(cat.slug)}
                    className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border",
                        activeCategory === cat.slug
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    )}
                >
                    {cat.name}
                </button>
            ))}
        </div>
    )
}
