'use client'

import Link from 'next/link'
import { Utensils, Activity, GraduationCap, Ticket, Briefcase, LayoutGrid } from 'lucide-react'

// Map icon strings to Lucide components
const iconMap: Record<string, any> = {
    'utensils': Utensils,
    'activity': Activity,
    'graduation-cap': GraduationCap,
    'ticket': Ticket,
    'briefcase': Briefcase,
}

interface CategoryCarouselProps {
    categories: {
        id: string
        name: string
        slug: string
        icon_name: string | null
    }[]
}

export function CategoryCarousel({ categories }: CategoryCarouselProps) {
    return (
        <div className="flex gap-4 overflow-x-auto pb-4 px-1 -mx-2 snap-x scrollbar-hide">
            {/* "All" Item */}
            <Link
                href="/student/search"
                className="flex flex-col items-center min-w-[72px] snap-center group"
            >
                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm group-hover:border-[var(--primary-color)] group-hover:text-[var(--primary-color)] transition-colors">
                    <LayoutGrid className="w-7 h-7" />
                </div>
                <span className="text-xs font-medium text-slate-600 mt-2 text-center">Todos</span>
            </Link>

            {categories.map((category) => {
                const Icon = category.icon_name && iconMap[category.icon_name]
                    ? iconMap[category.icon_name]
                    : LayoutGrid // Fallback

                return (
                    <Link
                        key={category.id}
                        href={`/student/search?category=${category.slug}`}
                        className="flex flex-col items-center min-w-[72px] snap-center group"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-500 shadow-sm group-hover:border-[var(--primary-color)] group-hover:text-[var(--primary-color)] transition-colors">
                            <Icon className="w-7 h-7" />
                        </div>
                        <span className="text-xs font-medium text-slate-600 mt-2 text-center px-1 line-clamp-1">
                            {category.name}
                        </span>
                    </Link>
                )
            })}
        </div>
    )
}
