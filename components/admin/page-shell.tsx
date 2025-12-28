import { ReactNode } from 'react'

interface PageShellProps {
    title: string
    subtitle?: string
    actions?: ReactNode
    children: ReactNode
}

/**
 * PageShell - The standard wrapper for all Admin pages.
 * Enforces consistency in Headers, Margins, and Spacing.
 * Style: Professional & Sharp.
 */
export function PageShell({ title, subtitle, actions, children }: PageShellProps) {
    return (
        <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8 pb-20">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
                    {subtitle && (
                        <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
                    )}
                </div>
                {actions && (
                    <div className="flex items-center gap-3">
                        {actions}
                    </div>
                )}
            </header>

            {/* Content Section */}
            <main className="space-y-8 fade-in-up">
                {children}
            </main>
        </div>
    )
}
