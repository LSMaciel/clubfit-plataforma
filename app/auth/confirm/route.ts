import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    consttoken_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null
    const next = searchParams.get('next') ?? '/admin/dashboard'

    if (token_hash && type) {
        const supabase = await createClient()

        const { error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        })

        if (!error) {
            // transform "next" param to absolute URL
            const nextUrl = new URL(next, request.url)

            // If invitation, force password update
            if (type === 'invite' || type === 'recovery') {
                nextUrl.pathname = '/admin/update-password'
            }

            return NextResponse.redirect(nextUrl)
        }
    }

    // return the user to an error page with some instructions
    return NextResponse.redirect(new URL('/admin/login?message=Link inválido ou expirado', request.url))
}
