'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function updatePassword(formData: FormData) {
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirm_password') as string

    if (password !== confirmPassword) {
        return redirect('/admin/update-password?message=Senhas não conferem')
    }

    const supabase = await createClient()

    const { error } = await supabase.auth.updateUser({
        password: password
    })

    if (error) {
        return redirect(`/admin/update-password?message=${encodeURIComponent(error.message)}`)
    }

    return redirect('/admin/dashboard')
}
