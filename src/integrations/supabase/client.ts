import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zeegjxopcbgnhpwxcovo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplZWdqeG9wY2Jnbmhwd3hjb3ZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0NzUwMzcsImV4cCI6MjA3NzA1MTAzN30.1vPovNvUMSmxKpMg3pgmSyaGqNfz1R70tyZUWsScrTg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);