
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing env vars')
    process.exit(1)
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function check() {
    console.log('--- DB CHECK ---')

    // 1. Check Table Exists and Count
    const { count, error: countError } = await supabase
        .from('user_favorites')
        .select('*', { count: 'exact', head: true })

    if (countError) {
        console.error('ERROR Accessing Table:', countError.message)
        return
    }
    console.log('Total Favorites in DB:', count)

    // 2. List last 5 entries
    const { data: rows, error: listError } = await supabase
        .from('user_favorites')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

    if (listError) console.error('List Error:', listError.message)
    else console.log('Last 5 rows:', rows)

    console.log('--- END ---')
}

check()
