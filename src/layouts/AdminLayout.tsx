import { NavLink, Outlet } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function AdminLayout() {
  const { profile, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <aside className="w-64 border-r border-border bg-card p-4 hidden md:block">
          <div className="mb-6">
            <p className="font-display text-xs uppercase tracking-widest2 text-gold-400">
              Ivory Edge Interiors
            </p>
            <h2 className="font-display text-lg text-charcoal mt-1">Admin</h2>
          </div>

          <nav className="space-y-1">
            <NavLink to="/admin" end className={({ isActive }) => `block rounded-md px-3 py-2 ${isActive ? 'bg-accent' : 'hover:bg-accent/50'}`}>
              Dashboard
            </NavLink>
            <NavLink to="/admin/projects" className={({ isActive }) => `block rounded-md px-3 py-2 ${isActive ? 'bg-accent' : 'hover:bg-accent/50'}`}>
              Projects
            </NavLink>
            <NavLink to="/admin/services" className={({ isActive }) => `block rounded-md px-3 py-2 ${isActive ? 'bg-accent' : 'hover:bg-accent/50'}`}>
              Services
            </NavLink>
            <NavLink to="/admin/reviews" className={({ isActive }) => `block rounded-md px-3 py-2 ${isActive ? 'bg-accent' : 'hover:bg-accent/50'}`}>
              Reviews
            </NavLink>
            <NavLink to="/admin/inquiries" className={({ isActive }) => `block rounded-md px-3 py-2 ${isActive ? 'bg-accent' : 'hover:bg-accent/50'}`}>
              Inquiries
            </NavLink>
            <NavLink to="/admin/instagram" className={({ isActive }) => `block rounded-md px-3 py-2 ${isActive ? 'bg-accent' : 'hover:bg-accent/50'}`}>
              Instagram
            </NavLink>
            <NavLink to="/admin/content" className={({ isActive }) => `block rounded-md px-3 py-2 ${isActive ? 'bg-accent' : 'hover:bg-accent/50'}`}>
              Content
            </NavLink>
          </nav>

          <div className="mt-6 border-t border-border pt-4">
            <p className="text-sm text-muted-foreground">Signed in as</p>
            <p className="mt-1 font-display text-sm text-charcoal">{profile?.full_name}</p>
            <p className="text-xs text-muted-foreground">{profile?.email}</p>
            <div className="mt-3">
              <Button variant="outline" size="sm" onClick={() => void signOut()}>
                <LogOut className="h-4 w-4" aria-hidden />
                Sign out
              </Button>
            </div>
          </div>
        </aside>

        <div className="flex-1 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
