
import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from './utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const isStudentRoute = requestUrl.pathname.startsWith('/student')

  if (isStudentRoute) {
    // Lógica Específica para Área do Aluno (Token Customizado)
    const token = request.cookies.get('clubfit-student-token')?.value
    const isLoginPage = requestUrl.pathname === '/student/login'

    if (!token && !isLoginPage) {
      return NextResponse.redirect(new URL('/student/login', request.url))
    }

    if (token && isLoginPage) {
      return NextResponse.redirect(new URL('/student/dashboard', request.url))
    }

    return NextResponse.next()
  }

  // Lógica Padrão (Admin/Supabase)
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}