/**
 * Supabase Browser Client — BRAVECOM Sunray Ecosystem
 * Use only in Client Components ('use client').
 * Singleton pattern prevents multiple GoTrue instances.
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Module-level singleton — only one instance per browser session
let _supabase: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient {
    if (_supabase) return _supabase;
    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('[Supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
    }
    _supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
        },
        realtime: {
            params: { eventsPerSecond: 10 },
        },
    });
    return _supabase;
}

/** Short-hand alias */
export const supabase = getSupabaseBrowserClient;
