'use client'

import React from 'react'

interface StatusScreenProps {
    academyName: string
    primaryColor: string
}

export function MaintenanceScreen({ academyName, primaryColor }: StatusScreenProps) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center" style={{ backgroundColor: '#F8FAFC' }}>
            <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-6 animate-pulse"
                style={{ backgroundColor: `${primaryColor}20` }} // 20% opacity
            >
                <span className="text-4xl">🛠️</span>
            </div>

            <h1 className="text-2xl font-bold mb-2 text-slate-800">Estamos em Manutenção</h1>
            <p className="text-slate-600 mb-8 max-w-xs mx-auto">
                A equipe da <strong>{academyName}</strong> está fazendo melhorias no sistema.
                Voltaremos em breve!
            </p>

            <div className="w-full max-w-xs h-1 bg-slate-200 rounded-full overflow-hidden">
                <div
                    className="h-full animate-progress"
                    style={{
                        width: '60%',
                        backgroundColor: primaryColor,
                        animation: 'indeterminate 2s infinite linear'
                    }}
                />
            </div>

            {/* Inline style for custom animation keyframe if not in tailwind config */}
            <style jsx>{`
                @keyframes indeterminate {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-progress {
                    animation: indeterminate 1.5s infinite ease-in-out;
                }
            `}</style>
        </div>
    )
}

export function SuspendedScreen({ academyName, primaryColor }: StatusScreenProps) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-white">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 border-4 border-red-100">
                <span className="text-4xl">🔒</span>
            </div>

            <h1 className="text-2xl font-bold mb-2 text-slate-800">Acesso Temporariamente Indisponível</h1>
            <p className="text-slate-600 mb-8 max-w-sm mx-auto">
                O acesso ao aplicativo da <strong>{academyName}</strong> está suspenso no momento.
            </p>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 max-w-xs w-full">
                <p className="text-sm text-slate-500 font-medium">O que fazer?</p>
                <p className="text-xs text-slate-400 mt-1">
                    Entre em contato com a administração da academia presencialmente para mais informações.
                </p>
            </div>
        </div>
    )
}
