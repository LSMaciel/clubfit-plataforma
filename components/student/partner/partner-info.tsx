import { MapPin } from 'lucide-react'

interface PartnerInfoProps {
    description?: string
    address?: string
    amenities?: string[]
}

export function PartnerInfo({ description, address, amenities }: PartnerInfoProps) {
    return (
        <div className="px-5 mt-4 space-y-6">
            {/* Address */}
            {address && (
                <div className="flex items-start gap-3 text-slate-600">
                    <MapPin className="w-5 h-5 mt-0.5 shrink-0 text-[var(--color-primary)]" />
                    <span className="text-sm leading-relaxed">{address}</span>
                </div>
            )}

            {/* Description */}
            {description && (
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-slate-900">Sobre</h3>
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                        {description}
                    </p>
                </div>
            )}

            {/* Amenities (Simple List) */}
            {amenities && amenities.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-900">Comodidades</h3>
                    <div className="flex flex-wrap gap-2">
                        {amenities.map(tag => (
                            <span
                                key={tag}
                                className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full font-medium capitalize"
                            >
                                {tag.replace('_', ' ')}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
