'use client'

import { LucideIcon, Home, Wallet, User, Bell, ChevronRight, Star } from 'lucide-react'

interface ThemeColors {
    primary: string
    secondary: string
    background: string
    surface: string
    textPrimary: string
    textSecondary: string
    border: string
    radius: string
}

interface MobilePreviewProps {
    colors: ThemeColors
}

export function MobilePreview({ colors }: MobilePreviewProps) {
    // Generate styles dynamically based on props
    const previewStyles = {
        '--p-primary': colors.primary,
        '--p-secondary': colors.secondary,
        '--p-bg': colors.background,
        '--p-surface': colors.surface,
        '--p-text-main': colors.textPrimary,
        '--p-text-sec': colors.textSecondary,
        '--p-border': colors.border,
        '--p-radius': colors.radius,
    } as React.CSSProperties

    return (
        <div className="flex justify-center items-center p-4">
            {/* Phone Bezel */}
            <div className="relative w-[300px] h-[600px] bg-slate-900 rounded-[3rem] p-3 shadow-2xl border-4 border-slate-800">
                {/* Dynamic Screen Container */}
                <div
                    className="w-full h-full bg-[var(--p-bg)] rounded-[2.2rem] overflow-hidden flex flex-col relative transition-colors duration-200"
                    style={previewStyles}
                >
                    {/* Status Bar (Fake) */}
                    <div className="h-8 w-full flex justify-between items-center px-6 pt-2">
                        <span className="text-[10px] font-bold text-[var(--p-text-main)] opacity-70">9:41</span>
                        <div className="flex gap-1">
                            <div className="w-3 h-3 bg-[var(--p-text-main)] opacity-70 rounded-full"></div>
                            <div className="w-3 h-3 bg-[var(--p-text-main)] opacity-70 rounded-full"></div>
                        </div>
                    </div>

                    {/* App Header */}
                    <header className="px-5 py-4 flex justify-between items-center">
                        <div>
                            <p className="text-xs text-[var(--p-text-sec)]">Bem-vindo,</p>
                            <h1 className="text-xl font-bold text-[var(--p-text-main)] leading-tight">ClubFit Aluno</h1>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[var(--p-surface)] flex items-center justify-center relative shadow-sm">
                            <Bell size={18} className="text-[var(--p-primary)]" />
                            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--p-secondary)] border border-[var(--p-surface)]"></div>
                        </div>
                    </header>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-hidden relative">
                        {/* Decorative background blob */}
                        <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-[var(--p-primary)] opacity-10 rounded-full blur-3xl"></div>

                        <div className="px-5 space-y-5 pb-20">

                            {/* Search Input */}
                            <div className="w-full h-12 bg-[var(--p-surface)] flex items-center px-4 gap-3 shadow-sm border border-[var(--p-border)]" style={{ borderRadius: 'var(--p-radius)' }}>
                                <div className="w-4 h-4 rounded-full border-2 border-[var(--p-text-sec)] opacity-30"></div>
                                <div className="h-2 w-24 bg-[var(--p-text-sec)] opacity-20 rounded-full"></div>
                            </div>

                            {/* Categories Carousel */}
                            <div>
                                <h2 className="text-sm font-semibold text-[var(--p-text-main)] mb-3">Categorias</h2>
                                <div className="flex gap-3 overflow-hidden">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="flex flex-col items-center gap-2">
                                            <div className={`w-14 h-14 flex items-center justify-center shadow-sm ${i === 1 ? 'bg-[var(--p-primary)]' : 'bg-[var(--p-surface)] border border-[var(--p-border)]'}`} style={{ borderRadius: 'var(--p-radius)' }}>
                                                <div className={`w-6 h-6 rounded-md ${i === 1 ? 'bg-white/30' : 'bg-[var(--p-text-sec)]/20'}`}></div>
                                            </div>
                                            <div className="w-10 h-2 bg-[var(--p-text-sec)] opacity-20 rounded-full"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Partner Card */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <h2 className="text-sm font-semibold text-[var(--p-text-main)]">Destaques</h2>
                                    <span className="text-xs text-[var(--p-primary)] font-medium">Ver todos</span>
                                </div>
                                <div className="bg-[var(--p-surface)] p-4 shadow-sm relative overflow-hidden" style={{ borderRadius: 'var(--p-radius)' }}>
                                    <div className="absolute top-3 right-3 bg-[var(--p-secondary)] text-white text-[10px] font-bold px-2 py-1 rounded-full">
                                        NOVO
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-16 h-16 bg-slate-200 flex-shrink-0" style={{ borderRadius: 'calc(var(--p-radius) * 0.75)' }}></div>
                                        <div className="flex-1">
                                            <h3 className="text-base font-bold text-[var(--p-text-main)]">Mega Suplementos</h3>
                                            <p className="text-xs text-[var(--p-text-sec)] mt-1">1.2 km • Centro</p>
                                            <div className="flex gap-1 mt-2">
                                                <Star className="w-3 h-3 fill-[var(--p-secondary)] text-[var(--p-secondary)]" />
                                                <span className="text-xs font-medium text-[var(--p-text-main)]">4.9</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-[var(--p-border)]">
                                        <button className="w-full py-2.5 bg-[var(--p-primary)] text-white text-xs font-bold uppercase tracking-wide" style={{ borderRadius: 'calc(var(--p-radius) * 0.75)' }}>
                                            Ver Ofertas
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Bottom Nav */}
                    <div className="h-16 bg-[var(--p-surface)] absolute bottom-0 w-full flex justify-around items-center rounded-t-[1.5rem] shadow-[0_-5px_20px_rgba(0,0,0,0.03)] border-t border-[var(--p-border)]">
                        <div className="flex flex-col items-center gap-1">
                            <Home size={20} className="text-[var(--p-primary)]" />
                            <div className="w-1 h-1 rounded-full bg-[var(--p-primary)]"></div>
                        </div>
                        <div className="flex flex-col items-center gap-1 opacity-50">
                            <Wallet size={20} className="text-[var(--p-text-sec)]" />
                        </div>
                        <div className="flex flex-col items-center gap-1 opacity-50">
                            <User size={20} className="text-[var(--p-text-sec)]" />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
