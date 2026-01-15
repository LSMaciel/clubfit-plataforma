import { cache } from 'react'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

/**
 * Returns the authenticated user, cached for the duration of the request.
 * This prevents redundancy when multiple components need the user.
 */
export const getCachedUser = cache(async () => {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
})

/**
 * Returns the full admin profile with context (academy_id, role, etc).
 * Handles Super Admin context switching automatically.
 * Cached for the request duration.
 */
export const getCachedAdminProfile = cache(async () => {
    const user = await getCachedUser()

    if (!user) return null

    const supabase = await createClient()

    // 1. Fetch persistent profile
    const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

    if (!profile) return null

    // 2. Decorate with Context (if Super Admin)
    let effectiveAcademyId = profile.academy_id

    if (profile.role === 'SUPER_ADMIN') {
        const cookieStore = await cookies()
        const contextId = cookieStore.get('admin-context-academy-id')?.value
        if (contextId) {
            effectiveAcademyId = contextId
        }
    }

    // Return a synthesized object with the "effective" academy_id
    return {
        ...profile,
        effective_academy_id: effectiveAcademyId,
        is_global_context: profile.role === 'SUPER_ADMIN' && !effectiveAcademyId
    }
})
