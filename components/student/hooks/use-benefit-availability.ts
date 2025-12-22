import { useMemo } from 'react'

export interface BenefitConstraints {
    channel?: 'BOTH' | 'DELIVERY' | 'STORE'
    min_spend?: number
    allowed_days?: number[] // 0 (Sun) - 6 (Sat)
    active_hours?: {
        start: string // "HH:MM"
        end: string
    }
}

export function useBenefitAvailability(
    validityEnd?: string | null,
    constraints?: BenefitConstraints | null
) {
    return useMemo(() => {
        const now = new Date()

        // 1. Check Global Validity (Expiry Date)
        if (validityEnd) {
            const end = new Date(validityEnd)
            if (now > end) {
                return { isAvailable: false, reason: 'EXPIRADO' }
            }
        }

        if (!constraints) return { isAvailable: true, reason: null }

        // 2. Check Allowed Days (0-6)
        if (constraints.allowed_days && constraints.allowed_days.length > 0) {
            const currentDay = now.getDay()
            if (!constraints.allowed_days.includes(currentDay)) {
                return { isAvailable: false, reason: 'DIA INDISPONÍVEL' }
            }
        }

        // 3. Check Active Hours (HH:MM)
        if (constraints.active_hours) {
            const currentMinutes = now.getHours() * 60 + now.getMinutes()

            const [startH, startM] = constraints.active_hours.start.split(':').map(Number)
            const [endH, endM] = constraints.active_hours.end.split(':').map(Number)

            const startTotal = startH * 60 + startM
            const endTotal = endH * 60 + endM

            // Handle overnight ranges (e.g. 22:00 to 05:00)
            const isOvernight = endTotal < startTotal

            if (isOvernight) {
                if (currentMinutes < startTotal && currentMinutes > endTotal) {
                    return { isAvailable: false, reason: `ABRE ÀS ${constraints.active_hours.start}` }
                }
            } else {
                if (currentMinutes < startTotal) {
                    return { isAvailable: false, reason: `ABRE ÀS ${constraints.active_hours.start}` }
                }
                if (currentMinutes > endTotal) {
                    return { isAvailable: false, reason: 'ENCERRADO POR HOJE' }
                }
            }
        }

        return { isAvailable: true, reason: null }

    }, [validityEnd, constraints])
}
