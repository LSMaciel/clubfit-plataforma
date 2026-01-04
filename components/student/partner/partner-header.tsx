import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

interface PartnerHeaderProps {
    name: string
    logoUrl?: string
    coverUrl?: string | null
    galleryUrls?: string[]
    academySlug: string
}

export function PartnerHeader({ name, logoUrl, coverUrl, galleryUrls, academySlug }: PartnerHeaderProps) {
    // Use coverUrl, or first image from gallery, or null
    const coverImage = coverUrl || (galleryUrls && galleryUrls.length > 0 ? galleryUrls[0] : null)

    return (
        <div className="relative h-64 w-full bg-slate-200">
            {/* Cover Image */}
            {coverImage ? (
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${coverImage})` }}
                >
                    <div className="absolute inset-0 bg-black/30" /> {/* Dimmer */}
                </div>
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] opacity-80" />
            )}

            {/* Back Button */}
            <Link
                href={`/student/${academySlug}`}
                className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors"
            >
                <ChevronLeft size={24} />
            </Link>

            {/* Logo/Avatar & Name Container */}
            <div className="absolute -bottom-12 left-0 right-0 px-5 flex flex-col items-center">
                {/* Logo Box */}
                <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center overflow-hidden border-4 border-white">
                    {logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={logoUrl} alt={name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-3xl font-bold text-[var(--color-primary)]">
                            {name.charAt(0)}
                        </span>
                    )}
                </div>

                {/* Name */}
                <h1 className="mt-3 text-2xl font-bold text-slate-900 text-center">
                    {name}
                </h1>
            </div>
        </div>
    )
}
