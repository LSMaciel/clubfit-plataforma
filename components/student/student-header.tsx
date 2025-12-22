'use client'

import Image from 'next/image'
import { useState } from 'react'
import { studentLogout } from '@/app/student/actions'

interface StudentHeaderProps {
    logoUrl?: string | null
    academyName: string
    primaryColor: string
}

export function StudentHeader({ logoUrl, academyName, primaryColor }: StudentHeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50 px-6 py-4 flex items-center justify-between relative">
            <div className="flex items-center gap-3">
                {logoUrl ? (
                    <div className="relative h-10 w-10 overflow-hidden rounded-full border border-slate-100">
                        <Image
                            src={logoUrl}
                            alt={academyName}
                            fill
                            className="object-cover"
                        />
                    </div>
                ) : (
                    <div
                        className="h-10 w-10 flex items-center justify-center rounded-full text-white font-bold text-lg"
                        style={{ backgroundColor: primaryColor }}
                    >
                        {academyName.charAt(0).toUpperCase()}
                    </div>
                )}
                <span className="font-bold text-slate-800 text-lg">{academyName}</span>
            </div>

            <div className="relative">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-slate-400 p-2 hover:bg-slate-50 rounded-full transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>

                {isMenuOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsMenuOpen(false)}
                        />
                        <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-xl border border-slate-100 z-20 py-1 overflow-hidden">
                            <button
                                onClick={async () => await studentLogout()}
                                className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-slate-50 flex items-center gap-2 font-medium"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                                </svg>
                                Sair da Conta
                            </button>
                        </div>
                    </>
                )}
            </div>
        </header>
    )
}
