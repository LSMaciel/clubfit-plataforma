import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminRootPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    // Get role
    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role === 'PARTNER') {
        redirect('/admin/validate')
    } else {
        redirect('/admin/dashboard')
    }
}
