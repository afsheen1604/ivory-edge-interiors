import { useContext } from "react";
import { AuthContext, type AuthState } from "@/features/auth/context/authContextDefinition";

/**
 * Access the current auth session, admin profile, and isAdmin status from
 * anywhere in the app. Must be used within an <AuthProvider> (mounted once
 * near the root in App.tsx).
 */
export function useAuth(): AuthState {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
