'use client'

import { useState, useEffect } from 'react'

export function InstallBanner() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const handler = (e: any) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault()
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e)
            // Show the banner
            setIsVisible(true)
        }

        window.addEventListener('beforeinstallprompt', handler)

        // Check if already installed or standalone
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsVisible(false)
        }

        return () => window.removeEventListener('beforeinstallprompt', handler)
    }, [])

    async function handleInstall() {
        if (!deferredPrompt) return

        // Show the install prompt
        deferredPrompt.prompt()

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice

        // We no longer need the prompt. Clear it
        setDeferredPrompt(null)
        setIsVisible(false)
    }

    if (!isVisible) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900 text-white p-4 z-50 flex items-center justify-between shadow-lg pb-safe-area">
            <div className="flex items-center gap-3">
                <div className="bg-white/10 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                </div>
                <div>
                    <h3 className="font-bold text-sm">Instalar App ClubFit</h3>
                    <p className="text-xs text-slate-300">Acesso rápido e offline</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setIsVisible(false)}
                    className="text-xs text-slate-400 font-medium px-2 py-1"
                >
                    Agora não
                </button>
                <button
                    onClick={handleInstall}
                    className="bg-[var(--color-secondary)] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg" // Using standard clubfit secondary or fallback
                    style={{ backgroundColor: '#F59E0B' }}
                >
                    Baixar
                </button>
            </div>
        </div>
    )
}
