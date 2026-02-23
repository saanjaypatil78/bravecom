import { createClient } from '@supabase/supabase-js';

// Retrieve environment variables
// Note: In a production environment, ensure these are set in your build configuration.
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase URL or Key is missing. Authentication features may not work correctly.');
}

// Mock client to prevent crash if keys are missing
const mockSupabase = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithOAuth: async () => {
      console.error("Supabase not configured");
      alert("Supabase not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY.");
      return { error: { message: "Supabase not configured" } };
    },
    signOut: async () => ({ error: null }),
    setSession: async () => ({ error: null }),
    exchangeCodeForSession: async () => ({ error: null }),
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: null }),
      }),
    }),
  }),
} as any;

export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : mockSupabase;
