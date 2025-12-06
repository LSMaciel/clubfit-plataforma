
import { createClient } from '@supabase/supabase-js'

// Nota: Este cliente deve ser usado APENAS no servidor (Server Actions/API Routes)
// Ele usa a Service Role Key para ignorar RLS e gerenciar Auth users.
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY não definida no .env.local')
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
