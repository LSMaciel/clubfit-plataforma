import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

interface LoginRedirectorProps {
    slug: string
}

export async function LoginRedirector({ slug }: LoginRedirectorProps) {
    const supabase = await createClient()

    // Background Auth Check
    // This runs in parallel with the UI rendering
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        // Check role to ensure correct redirection context
        const { data: profile } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single()

        if (profile?.role === 'STUDENT') {
            redirect(`/${slug}/benefits`)
        }
        // If Admin, legitimate access to login page is allowed, 
        // or we could redirect to admin dashboard, but usually admins have separate login
    }

    return null // Render nothing visually
}
