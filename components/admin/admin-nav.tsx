'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/utils/cn'

interface AdminNavProps {
    role?: string
    isGlobalContext?: boolean
}

export function AdminNav({ role, isGlobalContext = false }: AdminNavProps) {
    const pathname = usePathname()

    const isPartner = role === 'PARTNER'
    const isSuperAdmin = role === 'SUPER_ADMIN'
    const isAdmin = role === 'ACADEMY_ADMIN' || isSuperAdmin

    // Visibility Logic:
    // - Super Admin Global: Can see Academies. Cannot see generic Academy links (unless we want to).
    // - Super Admin Context: Can see Academy links (Dashboard, Partners...). Can ALSO see Academies link (to go back).

    // If Global Context, generic "manage academy" links should be hidden because there is no target academy.
    const showAcademyLinks = isAdmin && !isGlobalContext

    const navItems = [
        // ACADEMY CONTEXT LINKS (Dashboard First)
        {
            label: 'Dashboard',
            href: '/admin/dashboard',
            visible: showAcademyLinks || (isSuperAdmin && isGlobalContext), // Global Dashboard exists too
            activeInfo: '/admin/dashboard'
        },

        // SUPER ADMIN GLOBAL LINKS
        {
            label: 'Academias',
            href: '/admin/super/academies',
            visible: isSuperAdmin,
            activeInfo: '/admin/super/academies'
        },
        {
            label: 'Parceiros',
            href: '/admin/partners',
            visible: showAcademyLinks,
            activeInfo: '/admin/partners'
        },
        {
            label: 'Alunos',
            href: '/admin/students',
            visible: showAcademyLinks,
            activeInfo: '/admin/students'
        },
        {
            label: 'Personalizar',
            href: '/admin/settings',
            visible: showAcademyLinks,
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
        },
        {
            label: 'Meu Negócio',
            href: '/admin/profile',
            visible: isPartner,
            activeInfo: '/admin/profile'
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
