import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Copy .env.example to .env and fill in " +
      "VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from your Supabase project's " +
      "Settings → API page.",
  );
}

/**
 * App-wide Supabase client, typed against the generated database schema.
 *
 * This is the *only* place `createClient` should be called. Every feature's
 * `services/` module imports this singleton rather than creating its own
 * client — see docs/ARCHITECTURE.md.
 *
 * Uses the publishable (anon) key only. This key is safe to expose in the
 * browser because every table has Row Level Security enabled (see
 * docs/DATABASE.md) — the key alone grants no access beyond what RLS
 * policies allow.
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
