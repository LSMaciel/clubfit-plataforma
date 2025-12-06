import { cookies } from 'next/headers'

/**
 * Returns the effective Academy ID for the current user.
 * - If user is ACADEMY_ADMIN or PARTNER: returns their fixed academy_id.
 * - If user is SUPER_ADMIN: returns the academy_id from 'admin-context-academy-id' cookie, or null if in "Global View".
 */
export async function getEffectiveAcademyId(user: any): Promise<string | null> {
    if (!user) return null

    // Users bound to an academy (Normal Admins, Partners)
    if (user.role === 'ACADEMY_ADMIN' || user.role === 'PARTNER') {
        return user.academy_id
    }

    // Super Admin: Check for context cookie
    if (user.role === 'SUPER_ADMIN') {
        const cookieStore = await cookies()
        const contextId = cookieStore.get('admin-context-academy-id')?.value
        return contextId || null
    }

    return null
}
