# Authentication

Phase 4 deliverable. Covers admin login, session persistence, route
protection, and how to provision additional admin accounts later.

## How it works

- **Supabase Auth** (`auth.users`) owns credentials and sessions — email +
  password only, no public sign-up anywhere in the app.
- **`public.users`** (created in Phase 2) holds the application-level profile
  (`full_name`, `role`, `is_active`) linked 1:1 to `auth.users.id`.
- **"Is this person an admin?"** is answered by two checks together: (1) an
  active Supabase Auth session exists, AND (2) that session's user has a
  `public.users` row with `role = 'admin'` and `is_active = true`. Having
  just a session is not enough — a row in `public.users` is required, and
  deactivating that row (`is_active = false`) instantly revokes admin access
  even if their login session is still technically valid.

## Architecture

```
src/features/auth/
  context/
    authContextDefinition.ts   — the React context object + AuthState type
    AuthContext.tsx              — <AuthProvider> component (session + profile state)
  hooks/
    useAuth.ts                   — useAuth() hook, the only way other code reads auth state
  types/
    loginSchema.ts                — Zod schema for the login form

src/routes/
  ProtectedRoute.tsx              — guard component wrapping /admin/* routes
  paths.ts                         — centralized route path constants

src/pages/auth/LoginPage.tsx       — the login form
src/pages/admin/AdminDashboardPage.tsx — placeholder dashboard (full version lands later)
```

`AuthContext` and `AuthProvider` are deliberately split into separate files
(and split again from the `useAuth` hook) — combining a React Context
definition with components/hooks that consume it breaks Vite's Fast Refresh
during development, surfaced by `react-refresh/only-export-components`.

## Using `useAuth()`

```tsx
import { useAuth } from "@/features/auth/hooks/useAuth";

function SomeAdminComponent() {
  const { profile, isAdmin, isLoading, signOut } = useAuth();

  if (isLoading) return <Spinner />;
  if (!isAdmin) return null; // ProtectedRoute already handles this at the route level

  return <p>Signed in as {profile?.full_name}</p>;
}
```

## Route protection

Any route that should require admin login is wrapped in `<ProtectedRoute>`:

```tsx
<Route
  path={ROUTES.adminDashboard}
  element={
    <ProtectedRoute>
      <AdminDashboardPage />
    </ProtectedRoute>
  }
/>
```

If the visitor isn't an authenticated active admin, they're redirected to
`/admin/login` with the originally-requested path stashed in router state,
so logging in sends them back to where they meant to go rather than always
landing on the dashboard.

## Session persistence

The Supabase client (`src/services/supabase.ts`, Phase 3) is configured with
`persistSession: true` and `autoRefreshToken: true`. `AuthProvider` calls
`supabase.auth.getSession()` once on mount to restore whatever session was
persisted, then subscribes to `onAuthStateChange` to stay in sync with
logins/logouts/token refreshes for the lifetime of the tab. This means a
page refresh on `/admin` does not log the admin out.

## Provisioning admin accounts

There is no in-app "create admin" UI — this is intentional, since the brief
defines exactly one admin role. To add an admin (e.g. a second team member):

1. Supabase Dashboard → Authentication → Users → **Add user** → **Create new
   user**. Set email + password, toggle **Auto Confirm User** on.
2. Copy the new user's **UID**.
3. Run in the SQL Editor:
   ```sql
   insert into public.users (id, email, full_name, role)
   values ('<uid>', '<their-email>', '<their-name>', 'admin');
   ```

To revoke access without deleting history (e.g. someone leaves the company):

```sql
update public.users set is_active = false where email = '<their-email>';
```

This takes effect immediately — `is_admin()` (used by every RLS policy) and
`useAuth()`'s `isAdmin` flag both check `is_active`, so a deactivated account
loses all admin access on its very next request, without needing to also
delete or disable the underlying Supabase Auth user.

## What was verified

- ✅ Login with correct credentials succeeds, redirects to `/admin`.
- ✅ Login with incorrect credentials shows a clear inline error, no crash.
- ✅ Visiting `/admin` while logged out redirects to `/admin/login`.
- ✅ After logging in from a redirect, landing back on the originally
  requested path (not always `/admin`).
- ✅ Refreshing the page while on `/admin` keeps the session (no forced
  re-login).
- ✅ Logout clears the session and returns to the login page; revisiting
  `/admin` afterward redirects to login again.
