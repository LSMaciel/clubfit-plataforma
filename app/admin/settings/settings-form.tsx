'use client'

import { useState } from 'react'
import { updateAcademyTheme } from './actions'
import { MobilePreview } from '@/components/admin/mobile-preview'

// Default branding for fallback
export const DEFAULT_COLORS = {
    primary: '#000000',
    secondary: '#F59E0B',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    border: '#CBD5E1',
    radius: '16px'
}

interface SettingsFormProps {
    initialColors: typeof DEFAULT_COLORS
}

export function SettingsForm({ initialColors }: SettingsFormProps) {
    // Merge defaults to avoid empty strings if backend returns nulls
    const [colors, setColors] = useState({ ...DEFAULT_COLORS, ...initialColors })
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const handleColorChange = (key: keyof typeof colors, value: string) => {
        setColors(prev => ({ ...prev, [key]: value }))
    }

    const handleSubmit = async (formData: FormData) => {
        setMessage(null)
        // Pass formData directly. The action will extract values.
        // NOTE: We rely on hidden inputs or name attributes in inputs.
        // My custom ColorInput uses name=..., so formData will have it. 
        // Radius uses name="border_radius" hidden input.

        const result = await updateAcademyTheme(null, formData)

        if (result?.error) {
            setMessage({ type: 'error', text: result.error })
        } else if (result?.success) {
            setMessage({ type: 'success', text: result.message || 'Salvo com sucesso!' })
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* PREVIEW SECTION */}
            <div className="lg:col-span-4 lg:order-2 sticky top-8 space-y-4">
                <div className="bg-slate-100 rounded-3xl p-6 flex flex-col items-center justify-center border border-slate-200">
                    <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">Preview em Tempo Real</h3>
                    <MobilePreview colors={colors} />
                </div>
            </div>

            {/* FORM SECTION */}
            <div className="lg:col-span-8 lg:order-1">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                    <form action={handleSubmit} className="space-y-8">

                        {/* Grupo: Marca */}
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                                <div className="w-2 h-6 bg-slate-900 rounded-full"></div>
                                Identidade da Marca
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ColorInput
                                    label="Cor Primária"
                                    name="color_primary"
                                    description="Botões principais, ícones ativos e destaques."
                                    value={colors.primary}
                                    onChange={(v) => handleColorChange('primary', v)}
                                />
                                <ColorInput
                                    label="Cor Secundária"
                                    name="color_secondary"
                                    description="Detalhes, badges de novidade e elementos de apoio."
                                    value={colors.secondary}
                                    onChange={(v) => handleColorChange('secondary', v)}
                                />
                            </div>
                        </div>

                        {/* Grupo: Estrutura */}
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                                <div className="w-2 h-6 bg-slate-400 rounded-full"></div>
                                Estrutura (Fundo e Superfície)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ColorInput
                                    label="Fundo da Tela"
                                    name="color_background"
                                    description="A cor de fundo geral do aplicativo."
                                    value={colors.background}
                                    onChange={(v) => handleColorChange('background', v)}
                                />
                                <ColorInput
                                    label="Superfície (Cards)"
                                    name="color_surface"
                                    description="Fundo de cards, cabeçalho e menus."
                                    value={colors.surface}
                                    onChange={(v) => handleColorChange('surface', v)}
                                />
                            </div>
                        </div>

                        {/* Grupo: Tipografia */}
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                                <div className="w-2 h-6 bg-slate-200 rounded-full"></div>
                                Tipografia
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ColorInput
                                    label="Texto Principal"
                                    name="color_text_primary"
                                    description="Títulos e textos de maior importância."
                                    value={colors.textPrimary}
                                    onChange={(v) => handleColorChange('textPrimary', v)}
                                />
                                <ColorInput
                                    label="Texto Secundário"
                                    name="color_text_secondary"
                                    description="Legendas, datas e textos de apoio."
                                    value={colors.textSecondary}
                                    onChange={(v) => handleColorChange('textSecondary', v)}
                                />
                            </div>
                        </div>

                        {/* Grupo: Tipografia e Estilo */}
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                                <div className="w-2 h-6 bg-slate-200 rounded-full"></div>
                                Bordas e Estilo
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <ColorInput
                                    label="Cor da Borda"
                                    name="color_border"
                                    description="Linhas divisórias e bordas sutis."
                                    value={colors.border}
                                    onChange={(v) => handleColorChange('border', v)}
                                />

                                {/* Radius Slider */}
                                <div className="relative">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-sm font-bold text-slate-700">Arredondamento</label>
                                        <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                            {colors.radius}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 border-2 border-slate-300 bg-slate-50" style={{ borderRadius: 0 }}></div>
                                        <input
                                            type="range"
                                            name="border_radius_raw"
                                            min="0"
                                            max="40"
                                            step="2"
                                            value={parseInt(colors.radius) || 0}
                                            onChange={(e) => handleColorChange('radius', `${e.target.value}px`)}
                                            className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                                        />
                                        <input type="hidden" name="border_radius" value={colors.radius} />
                                        <div className="w-8 h-8 border-2 border-slate-300 bg-slate-50" style={{ borderRadius: '40px' }}></div>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">
                                        Ajuste o arredondamento dos cards e botões.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {message && (
                            <div className={`p-4 rounded-lg border text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                {message.text}
                            </div>
                        )}

                        <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row gap-4 justify-end items-center">
                            {/* Actions */}
                            <div className="flex gap-3 items-center">
                                {/* Copy Link */}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        const url = `${window.location.origin}/student/login`
                                        navigator.clipboard.writeText(url)
                                        alert(`Link copiado: ${url}`)
                                    }}
                                    className="px-4 py-3 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
                                    title="Copiar link para o celular"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                                    </svg>
                                    <span className="hidden sm:inline">Copiar Link</span>
                                </button>

                                {/* View App */}
                                <a
                                    href="/student/login"
                                    target="_blank"
                                    className="px-4 py-3 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
                                    title="Abrir app em nova aba"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                    </svg>
                                    <span className="hidden sm:inline">Visualizar</span>
                                </a>

                                {/* Save */}
                                <button type="submit" className="px-6 py-3 bg-[var(--primary-color)] bg-slate-900 text-white rounded-lg hover:opacity-90 font-bold transition-transform active:scale-95 shadow-lg shadow-slate-900/10">
                                    Salvar Alterações
                                </button>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}

function ColorInput({ label, name, description, value, onChange }: { label: string, name: string, description: string, value: string, onChange: (val: string) => void }) {
    return (
        <div className="relative">
            <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-bold text-slate-700">{label}</label>
                <span className="text-xs font-mono text-slate-400 bg-slate-50 px-1 rounded border border-slate-100 uppercase">{value}</span>
            </div>
            <div className="flex gap-3 items-center">
                <div className="w-12 h-12 rounded-lg border-2 border-white shadow-md overflow-hidden relative group cursor-pointer ring-1 ring-slate-200 hover:ring-slate-400 transition-all">
                    <input
                        type="color"
                        name={name}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="absolute inset-0 w-[150%] h-[150%] top-[-25%] left-[-25%] p-0 m-0 border-0 cursor-pointer"
                    />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed flex-1">{description}</p>
            </div>
        </div>
    )
}
