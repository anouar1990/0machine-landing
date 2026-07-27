import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kfydsuuelaxaffntdjxh.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmeWRzdXVlbGF4YWZmbnRkanhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NDM1NDQsImV4cCI6MjA4ODExOTU0NH0._hb_RTEmoUevs3fjlv3IaZksZo7Ho3AdIdprYA1OaGQ';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn('Supabase environment variables are missing from environment, using default configuration.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
