'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'

export async function getAdminDashboardData() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // Fetch Profile to get Academy ID
    const { data: profile } = await supabase
        .from('users')
        .select('academy_id, role')
        .eq('id', user.id)
        .single()

    if (!profile || !profile.academy_id) return null

    // Call RPC using Admin Client to bypass any RLS complexity for Analytics
    // (Though RLS usually allows Academy Admin to see their own data, using AdminClient ensures we get the data if RLS is strict on aggregated tables)
    const adminSupabase = createAdminClient()

    const { data, error } = await adminSupabase.rpc('get_academy_dashboard_metrics', {
        p_academy_id: profile.academy_id
    })

    if (error) {
        console.error('getAdminDashboardData Error:', error)
        return null
    }

    return data
}

export async function getAcademyPartnersRanking(days = 30) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data: profile } = await supabase
        .from('users')
        .select('academy_id')
        .eq('id', user.id)
        .single()

    if (!profile || !profile.academy_id) return []

    const adminSupabase = createAdminClient()
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - days)

    const { data, error } = await adminSupabase.rpc('get_academy_partners_ranking', {
        p_academy_id: profile.academy_id,
        p_start_date: startDate.toISOString(),
        p_end_date: endDate.toISOString()
    })

    if (error) {
        console.error('getAcademyPartnersRanking Error:', error)
        return []
    }

    return data || []
}
