import Image from 'next/image'

interface StudentHeaderProps {
    logoUrl?: string | null
    academyName: string
    primaryColor: string
}

export function StudentHeader({ logoUrl, academyName, primaryColor }: StudentHeaderProps) {
    return (
        <header className="bg-white shadow-sm sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
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

            <button className="text-slate-400">
                {/* Icone de Menu ou Perfil (Futuro) */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>
        </header>
    )
}
