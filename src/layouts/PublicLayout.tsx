import { Outlet } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

/**
 * Shared shell for every public-facing page (Home, Projects, Services,
 * About, Reviews, Contact, Instagram Gallery). Mounted once in App.tsx as
 * the parent route for all public routes; each page renders into <Outlet />.
 */
export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
