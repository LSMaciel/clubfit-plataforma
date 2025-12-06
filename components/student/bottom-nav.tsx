
'use client'

import { signOut } from '@/app/[slug]/benefits/actions'

interface BottomNavProps {
  slug: string
  primaryColor: string
}

export function BottomNav({ slug, primaryColor }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        
        {/* Botão Home (Ativo) */}
        <button className="flex flex-col items-center justify-center w-full h-full space-y-1">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{ color: primaryColor }}
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span 
            className="text-[10px] font-bold"
            style={{ color: primaryColor }}
          >
            Início
          </span>
        </button>

        {/* Botão Carteira (Placeholder Futuro) */}
        <button className="flex flex-col items-center justify-center w-full h-full space-y-1 opacity-40 cursor-not-allowed">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600">
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" x2="22" y1="10" y2="10" />
          </svg>
          <span className="text-[10px] font-medium text-slate-600">
            Carteira
          </span>
        </button>

        {/* Botão Sair */}
        <form action={async () => await signOut(slug)} className="w-full h-full">
            <button type="submit" className="flex flex-col items-center justify-center w-full h-full space-y-1 group">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-red-500 transition-colors">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" x2="9" y1="12" y2="12" />
            </svg>
            <span className="text-[10px] font-medium text-slate-400 group-hover:text-red-500 transition-colors">
                Sair
            </span>
            </button>
        </form>

      </div>
    </div>
  )
}
