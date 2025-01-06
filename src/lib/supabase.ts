import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cpdgwwhnapzchnvtvjqu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwZGd3d2huYXB6Y2hudnR2anF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxMjEwOTcsImV4cCI6MjA1MTY5NzA5N30.XRfZAD7AZBXEFs0xuwnvp1toqER25VMFHSE26bxYlhg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)