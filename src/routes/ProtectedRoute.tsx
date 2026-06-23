import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";

/**
 * Wraps any /admin/* route. Redirects to /admin/login if the visitor is not
 * an authenticated, active admin — checked against both the Supabase Auth
 * session AND the matching public.users profile (role + is_active), not
 * just "is there a session token."
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-gold-400" aria-hidden="true" />
        <span className="sr-only">Checking session…</span>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
