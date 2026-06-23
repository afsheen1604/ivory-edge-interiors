import { useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/services/supabase";
import { AuthContext, type AdminProfile, type AuthState } from "@/features/auth/context/authContextDefinition";

async function fetchProfile(userId: string): Promise<AdminProfile | null> {
  const { data, error } = await supabase.from("users").select("*").eq("id", userId).maybeSingle();

  if (error) {
    // A failed profile fetch should not be silently treated as "is admin" —
    // fail closed.
    console.error("Failed to fetch admin profile:", error.message);
    return null;
  }

  return data;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // On mount: restore whatever session Supabase has persisted (Phase 3's
    // client config has persistSession: true), then load the matching
    // admin profile so route guards have both pieces before rendering.
    async function initialize() {
      const { data } = await supabase.auth.getSession();
      if (!isMounted) return;

      setSession(data.session);

      if (data.session) {
        const userProfile = await fetchProfile(data.session.user.id);
        if (isMounted) setProfile(userProfile);
      }

      if (isMounted) setIsLoading(false);
    }

    void initialize();

    // Keep session in sync with login/logout/token refresh events fired
    // anywhere else in the app (e.g. the login page calling signIn).
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!isMounted) return;
      setSession(newSession);

      if (newSession) {
        void fetchProfile(newSession.user.id).then((userProfile) => {
          if (isMounted) setProfile(userProfile);
        });
      } else {
        setProfile(null);
      }
    });

    return () => {
      isMounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  async function signIn(email: string, password: string): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  }

  async function signOut(): Promise<void> {
    await supabase.auth.signOut();
  }

  const isAdmin = Boolean(profile && profile.role === "admin" && profile.is_active);

  const value: AuthState = {
    user: session?.user ?? null,
    profile,
    isAdmin,
    isLoading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
