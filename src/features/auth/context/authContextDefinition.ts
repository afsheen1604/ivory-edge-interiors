import { createContext } from "react";
import type { User } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

export type AdminProfile = Database["public"]["Tables"]["users"]["Row"];

export interface AuthState {
  /** The raw Supabase auth user, or null if not logged in. */
  user: User | null;
  /** The matching public.users profile row, or null if not logged in / not yet loaded. */
  profile: AdminProfile | null;
  /** True only once we've confirmed both an active session AND a matching active admin profile. */
  isAdmin: boolean;
  /** True while the initial session check (on page load/refresh) is still running. */
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthState | undefined>(undefined);
