'use client'

import { useState } from 'react'
import { toggleFavorite } from '@/app/student/actions'
import { useRouter } from 'next/navigation'

interface FavoriteButtonProps {
    itemId: string
    itemType: 'PARTNER' | 'OFFER'
    initialIsFavorite: boolean
    className?: string
}

export function FavoriteButton({ itemId, itemType, initialIsFavorite, className = '' }: FavoriteButtonProps) {
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    async function handleToggle(e: React.MouseEvent) {
        e.preventDefault() // Prevent link navigation if inside a card
        e.stopPropagation()

        if (isLoading) return

        // Optimistic Update
        const newState = !isFavorite
        setIsFavorite(newState)
        setIsLoading(true)

        try {
            await toggleFavorite(itemType, itemId)
        } catch (error) {
            // Revert on error
            setIsFavorite(!newState)
            console.error('Error toggling favorite', error)
        } finally {
            setIsLoading(false)
            router.refresh() // Refresh to update lists if needed
        }
    }

    return (
        <button
            onClick={handleToggle}
            className={`p-2 rounded-full transition-all active:scale-90 ${isFavorite
                    ? 'text-red-500 bg-red-50 hover:bg-red-100'
                    : 'text-slate-400 bg-black/5 hover:bg-black/10 hover:text-slate-600'
                } ${className}`}
            aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={isFavorite ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth={isFavorite ? "0" : "2"}
                className="w-5 h-5"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
        </button>
    )
}
