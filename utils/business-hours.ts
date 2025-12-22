export type OpeningHours = {
    [key: string]: { open: string; close: string } | null
}

const DAYS_MAP = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

export function getPartnerStatus(openingHours: OpeningHours | null) {
    if (!openingHours) return { isOpen: false, text: 'Consulte horários' }

    const now = new Date()
    const dayName = DAYS_MAP[now.getDay()]
    const todaySchedule = openingHours[dayName]

    if (!todaySchedule) {
        return { isOpen: false, text: 'Fechado hoje' }
    }

    const currentTime = now.getHours() * 60 + now.getMinutes()

    const [openHour, openMinute] = todaySchedule.open.split(':').map(Number)
    const [closeHour, closeMinute] = todaySchedule.close.split(':').map(Number)

    const openTime = openHour * 60 + openMinute
    const closeTime = closeHour * 60 + closeMinute

    if (currentTime >= openTime && currentTime < closeTime) {
        // Optional: Check if closing soon (e.g. within 1 hour)
        const diff = closeTime - currentTime
        if (diff <= 60) {
            return { isOpen: true, text: `Fecha em ${diff}min`, isClosingSoon: true }
        }
        return { isOpen: true, text: `Aberto até ${todaySchedule.close}` }
    }

    if (currentTime < openTime) {
        return { isOpen: false, text: `Abre às ${todaySchedule.open}` }
    }

    return { isOpen: false, text: 'Fechado agora' }
}
