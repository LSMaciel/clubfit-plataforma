import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const SECRET_KEY = process.env.SUPABASE_JWT_SECRET || 'fallback-secret-key-change-me'
const key = new TextEncoder().encode(SECRET_KEY)

export async function encryptStudentSession(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('30d') // Longa duração para "App" feel
        .sign(key)
}

export async function decryptStudentSession(input: string): Promise<any> {
    try {
        const { payload } = await jwtVerify(input, key, {
            algorithms: ['HS256'],
        })
        return payload
    } catch (error) {
        return null
    }
}

export async function getStudentSession() {
    const cookieStore = await cookies()
    const token = cookieStore.get('clubfit-student-token')?.value
    if (!token) return null
    return await decryptStudentSession(token)
}

export async function createStudentSession(studentId: string, academyId: string) {
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 dias
    const session = await encryptStudentSession({ studentId, academyId, expires })

    const cookieStore = await cookies()
    cookieStore.set('clubfit-student-token', session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires,
        sameSite: 'lax',
        path: '/',
    })
}

export async function deleteStudentSession() {
    const cookieStore = await cookies()
    cookieStore.delete('clubfit-student-token')
}
