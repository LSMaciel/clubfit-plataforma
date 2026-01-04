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

export async function getPartnerDashboardData(startDate?: string, endDate?: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const supabaseAdmin = createAdminClient()

    // 1. Get Partner ID
    const { data: partner } = await supabaseAdmin
        .from('partners')
        .select('id')
        .eq('owner_id', user.id)
        .single()

    if (!partner) return null

    // Date Range (Default: Last 30 days)
    const end = endDate ? new Date(endDate) : new Date()
    const start = startDate ? new Date(startDate) : new Date()
    if (!startDate) start.setDate(end.getDate() - 30)

    // Adjust for query (start of day, end of day)
    start.setHours(0, 0, 0, 0)
    end.setHours(23, 59, 59, 999)

    // 2. Query Tokens (Vouchers)
    // We fetch raw data for now (MVP). For scale, use RPC or .count()
    const { data: vouchers, error } = await supabaseAdmin
        .from('student_access_tokens')
        .select(`
            id,
            token,
            expires_at,
            status,
            created_at,
            benefits!inner (
                id,
                title,
                description,
                partner_id
            ),
            students (
                full_name
            )
        `)
        .eq('benefits.partner_id', partner.id)
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString())
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Partner Dashboard Error:', error)
        return null
    }

    // 3. Process Metrics
    const totalVouchers = vouchers.length

    // Group by Benefit to find Top Promotion
    const promoCounts: Record<string, number> = {}
    vouchers.forEach((v: any) => {
        const title = v.benefits?.title || 'Oferta'
        promoCounts[title] = (promoCounts[title] || 0) + 1
    })

    let topPromo = '-'
    let topPromoCount = 0
    Object.entries(promoCounts).forEach(([title, count]) => {
        if (count > topPromoCount) {
            topPromoCount = count
            topPromo = title
        }
    })

    return {
        metrics: {
            totalVouchers,
            topPromo,
            topPromoCount
        },
        history: vouchers.map((v: any) => ({
            id: v.id,
            token: v.token,
            studentName: v.students?.full_name || 'Aluno',
            benefitTitle: v.benefits?.title,
            status: v.status, // PENDING, USED, EXPIRED
            createdAt: v.created_at,
            expiresAt: v.expires_at
        }))
    }
}
