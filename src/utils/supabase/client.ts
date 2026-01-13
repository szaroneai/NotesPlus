import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://placeholder-url.com'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const createClient = () => createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey)
