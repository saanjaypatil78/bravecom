/**
 * Supabase Server Clients — BRAVECOM Sunray Ecosystem
 * - createSupabaseServerClient()  → respects Row-Level Security (anon key)
 * - createSupabaseAdminClient()   → bypasses RLS (service-role key)
 *
 * NEVER import the admin client in Client Components.
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

/** Anon client — respects RLS. Use for data the logged-in user owns. */
export function createSupabaseServerClient(): SupabaseClient {
    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('[Supabase] Anon key or URL missing — using placeholder');
    }
    return createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false },
    });
}

/**
 * Service-role admin client — bypasses ALL Row-Level Security.
 * Only use inside trusted server-side code (API routes, cron jobs).
 */
export function createSupabaseAdminClient(): SupabaseClient {
    if (!supabaseUrl || !supabaseServiceKey) {
        console.warn('[Supabase] Service role key or URL missing — using placeholder');
    }
    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
    });
}
