import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cpdgwwhnapzchnvtvjqu.supabase.co'
const supabaseAnonKey = 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)