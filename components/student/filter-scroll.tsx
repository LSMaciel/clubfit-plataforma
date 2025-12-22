'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

interface FilterScrollProps {
    tags: { id: string, name: string }[]
}

export function FilterScroll({ tags }: FilterScrollProps) {
    const searchParams = useSearchParams()
    const activeTag = searchParams.get('tag')
    const router = useRouter()

    const handleTagClick = (tagName: string) => {
        const params = new URLSearchParams(searchParams.toString())

        if (activeTag === tagName) {
            params.delete('tag') // Toggle Off
        } else {
            params.set('tag', tagName) // Toggle On
        }

        router.push(`/student/search?${params.toString()}`)
    }

    return (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {tags.map(tag => {
                const isActive = activeTag === tag.name
                return (
                    <button
                        key={tag.id}
                        onClick={() => handleTagClick(tag.name)}
                        className={`
                            whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium border transition-colors
                            ${isActive
                                ? 'bg-[var(--primary-color)] text-white border-[var(--primary-color)]'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-[var(--primary-color)]'
                            }
                        `}
                    >
                        {tag.name}
                    </button>
                )
            })}
        </div>
    )
}
