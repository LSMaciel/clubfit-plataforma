import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabase = await createClient()

    const start = performance.now()
    // Query leve apenas para testar round-trip time (RTT) do banco
    const { error } = await supabase.from('academies').select('id').limit(1)
    const end = performance.now()

    if (error) {
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 })
    }

    return NextResponse.json({
        status: 'ok',
        db_latency: (end - start).toFixed(0) + 'ms',
        message: 'Se este valor for alto (> 500ms), o banco está longe ou lento.'
    })
}
