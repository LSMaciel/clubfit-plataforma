interface PartnerActionsProps {
    whatsapp?: string
    instagram?: string
    phone?: string
    menuUrl?: string
    address?: string
}

export function PartnerActions({ whatsapp, instagram, phone, menuUrl, address }: PartnerActionsProps) {

    // Construct Links
    const waLink = whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=Olá,%20vi%20no%20ClubFit` : null
    const igLink = instagram ? (instagram.startsWith('http') ? instagram : `https://instagram.com/${instagram.replace('@', '')}`) : null
    const phoneLink = phone ? `tel:${phone.replace(/\D/g, '')}` : null
    // Maps fallback: Search query
    const mapsLink = address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` : null

    return (
        <div className="px-5 mt-16 grid grid-cols-4 gap-3">
            <ActionLink href={waLink} label="WhatsApp" icon="💬" color="text-green-600" />
            <ActionLink href={igLink} label="Instagram" icon="📷" color="text-pink-600" />
            <ActionLink href={phoneLink} label="Ligar" icon="📞" color="text-blue-600" />
            <ActionLink href={mapsLink} label="Como Chegar" icon="📍" color="text-red-500" />
        </div>
    )
}

function ActionLink({ href, label, icon, color }: { href: string | null, label: string, icon: string, color?: string }) {
    if (!href) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-slate-50 opacity-40 grayscale cursor-not-allowed">
                <span className="text-2xl">{icon}</span>
                <span className="text-[10px] font-medium text-slate-600 truncate w-full text-center">{label}</span>
            </div>
        )
    }

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 active:scale-95 shadow-sm transition-all"
        >
            <span className={`text-2xl ${color}`}>{icon}</span>
            <span className="text-[10px] font-medium text-slate-600 truncate w-full text-center">{label}</span>
        </a>
    )
}
