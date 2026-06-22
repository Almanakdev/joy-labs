import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * Browser-safe Supabase client (anon key, RLS-protected).
 * Used for realtime subscriptions (e.g. the live milestone feed).
 */
export const supabase = createClient(url || "http://localhost", anonKey || "anon", {
  auth: { persistSession: true },
});

/**
 * Server-only client with the service role key. NEVER import this in a
 * client component. Used by API routes / server actions that need to
 * bypass RLS (e.g. verifying a milestone after off-chain checks).
 */
export function createServiceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  return createClient(url || "http://localhost", serviceKey || "service", {
    auth: { persistSession: false },
  });
}
