'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/utils/cn'

interface AdminNavProps {
    role?: string
}

export function AdminNav({ role }: AdminNavProps) {
    const pathname = usePathname()

    const isPartner = role === 'PARTNER'
    const isAdmin = role === 'ACADEMY_ADMIN' || role === 'SUPER_ADMIN'

    const navItems = [
        // Admin Links
        {
            label: 'Dashboard',
            href: '/admin/dashboard',
            visible: isAdmin,
            activeInfo: '/admin/dashboard'
        },
        {
            label: 'Parceiros',
            href: '/admin/partners',
            visible: isAdmin,
            activeInfo: '/admin/partners'
        },
        {
            label: 'Alunos',
            href: '/admin/students',
            visible: isAdmin,
            activeInfo: '/admin/students'
        },
        {
            label: 'Personalizar',
            href: '/admin/settings',
            visible: isAdmin,
            activeInfo: '/admin/settings'
        },
        // Partner Links (Also visible to admin for testing/usage)
        {
            label: 'Validar Voucher',
            href: '/admin/validate',
            visible: true, // Todos podem validar (Admin também pode operar caixa)
            activeInfo: '/admin/validate'
        },
        {
            label: 'Minhas Promoções',
            href: '/admin/benefits',
            visible: isPartner, // Apenas parceiros gerenciam suas próprias promos aqui por enquanto
            activeInfo: '/admin/benefits'
        }
    ]

    return (
        <nav className="flex gap-1 overflow-x-auto">
            {navItems.filter(item => item.visible).map((item) => {
                const isActive = pathname.startsWith(item.activeInfo)

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                            isActive
                                ? "border-indigo-600 text-indigo-600"
                                : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                        )}
                    >
                        {item.label}
                    </Link>
                )
            })}
        </nav>
    )
}
