import { createClient } from '@supabase/supabase-js'

// Your project URL based on your edge function address
const supabaseUrl = 'https://agadjdvhqguunowplbak.supabase.co'           // 'https://agadjdvhqguunowplbak.supabase.co'

// Replace this placeholder string with your actual Anon public API key from your Supabase settings dashboard
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnYWRqZHZocWd1dW5vd3BsYmFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxMTUxMDIsImV4cCI6MjA5MzY5MTEwMn0.8esmwbmr57_iHu0jZfOxbJqXY9b2kSyqXrJIvDd26Lo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)