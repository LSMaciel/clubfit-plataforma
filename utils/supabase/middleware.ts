
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  let supabase;
  try {
    supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            request.cookies.set({
              name,
              value,
              ...options,
            })
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: any) {
            request.cookies.set({
              name,
              value: '',
              ...options,
            })
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    )
  } catch (e) {
    // If Supabase keys are missing, just convert to next() to allow page load
    console.error('Supabase init failed:', e)
    return response
  }

  // Refresh session if expired
  const start = performance.now()
  const { data: { user } } = await supabase.auth.getUser()
  const end = performance.now()
  response.headers.set('x-middleware-auth-latency', (end - start).toFixed(0) + 'ms')

  // PROTEÇÃO DE ROTAS ADMIN
  // Se tentar acessar /admin e não estiver logado, manda pro login
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // Se estiver logado e tentar ir pro login, manda pro dashboard
  if (request.nextUrl.pathname === '/admin/login' && user) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return response
}
