'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'
import { unstable_noStore as noStore } from 'next/cache'

export async function updateAcademyStatus(academyId: string, newStatus: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    // Verify Super Admin Role
    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'SUPER_ADMIN') {
        return { error: 'Forbidden: Only Super Admins can perform this action' }
    }

    // Update Status
    const { error } = await supabase
        .from('academies')
        .update({ status: newStatus })
        .eq('id', academyId)

    if (error) {
        console.error('Error updating academy status:', error)
        return { error: 'Failed to update status' }
    }

    revalidatePath('/admin/super/academies')
    return { success: true }
}

export async function renewAcademySubscription(academyId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    // Verify Super Admin
    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'SUPER_ADMIN') {
        return { error: 'Forbidden' }
    }

    // Update last_payment_date to today
    const { error, count } = await supabase
        .from('academies')
        .update({ last_payment_date: new Date().toISOString() }, { count: 'exact' })
        .eq('id', academyId)

    if (error || count === 0) {
        console.error('Error renewing subscription:', error || 'No rows updated (RLS?)')
        return { error: 'Failed to renew subscription. Check permissions.' }
    }

    revalidatePath('/admin/super/academies')
    revalidatePath('/admin/dashboard')
    return { success: true }
}

export async function getAcademyAdmins(academyId: string) {
    noStore()
    const supabase = await createClient()
    const adminClient = createAdminClient()

    // 1. Check permissions
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'SUPER_ADMIN') return { error: 'Forbidden' }

    // 2. Fetch User Profiles for this Academy
    const { data: profiles, error: profileError } = await adminClient
        .from('users')
        .select('id, name')
        .eq('academy_id', academyId)
        .eq('role', 'ACADEMY_ADMIN')

    if (profileError) {
        console.error('Error fetching admins:', profileError)
        return { error: 'Failed to fetch admins' }
    }

    // 3. Enrich with Emails from Auth (Need Admin API)
    const enrichedUsers = await Promise.all(
        profiles.map(async (p) => {
            const { data: { user: authUser }, error: authError } = await adminClient.auth.admin.getUserById(p.id)
            return {
                id: p.id,
                name: p.name,
                email: authUser?.email || 'N/A'
            }
        })
    )

    return { success: true, admins: enrichedUsers }
}

export async function generateMagicLink(userId: string) {
    const supabase = await createClient()
    const adminClient = createAdminClient()

    // 1. Check permissions (Always double check)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'SUPER_ADMIN') return { error: 'Forbidden' }

    // 2. Get User Email
    const { data: { user: targetUser }, error: userError } = await adminClient.auth.admin.getUserById(userId)

    if (userError || !targetUser?.email) {
        return { error: 'User not found or no email' }
    }

    // 3. Generate Link
    const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
        type: 'magiclink',
        email: targetUser.email
    })

    if (linkError) {
        console.error('Error generating link:', linkError)
        return { error: 'Failed to generate link' }
    }

    return { success: true, url: linkData.properties?.action_link }
}
