import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cpdgwwhnapzchnvtvjqu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwZGd3d2huYXB6Y2hudnR2anF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY4NzI2NDgsImV4cCI6MjAyMjQ0ODY0OH0.hoQqyHvZJbHxjvhRjKYXYkNxRFnNBVVeYeWgGNvfp8k'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)