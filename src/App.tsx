import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { queryClient } from "@/services/queryClient";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { ROUTES } from "@/routes/paths";
import { PublicLayout } from "@/layouts/PublicLayout";
import { HomePage } from "@/pages/public/HomePage";
import { ProjectsPage } from "@/pages/public/ProjectsPage";
import { ProjectDetailsPage } from "@/pages/public/ProjectDetailsPage";
import { ServicesPage } from "@/pages/public/ServicesPage";
import { AboutPage } from "@/pages/public/AboutPage";
import { ReviewsPage } from "@/pages/public/ReviewsPage";
import { ContactPage } from "@/pages/public/ContactPage";
import { InstagramGalleryPage } from "@/pages/public/InstagramGalleryPage";
import { LoginPage } from "@/pages/auth/LoginPage";
import { AdminDashboardPage } from "@/pages/admin/AdminDashboardPage";
import { AdminLayout } from "@/layouts/AdminLayout";
import { ProjectsListPage } from "@/pages/admin/projects/ProjectsListPage";
import { ProjectFormPage } from "@/pages/admin/projects/ProjectFormPage";
import { ReviewsPage as AdminReviewsPage } from "@/pages/admin/ReviewsPage";
import { ScrollToTop } from "@/components/common/ScrollToTop";

/**
 * Root application component.
 *
 * Phase 1–4: app shell, schema, Supabase wiring, admin authentication.
 * Phase 5 (complete): all 8 public pages — Home, Projects, Project
 * Details, Services, About Us, Reviews, Contact, Instagram Gallery — wrapped
 * in the shared PublicLayout (Header + Footer).
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path={ROUTES.home} element={<HomePage />} />
              <Route path={ROUTES.projects} element={<ProjectsPage />} />
              <Route path={ROUTES.projectDetails} element={<ProjectDetailsPage />} />
              <Route path={ROUTES.services} element={<ServicesPage />} />
              <Route path={ROUTES.about} element={<AboutPage />} />
              <Route path={ROUTES.reviews} element={<ReviewsPage />} />
              <Route path={ROUTES.contact} element={<ContactPage />} />
              <Route path={ROUTES.instagram} element={<InstagramGalleryPage />} />
            </Route>

            <Route path={ROUTES.adminLogin} element={<LoginPage />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboardPage />} />
              <Route path="projects">
                <Route index element={<ProjectsListPage />} />
                <Route path="new" element={<ProjectFormPage />} />
                <Route path=":id/edit" element={<ProjectFormPage />} />
              </Route>
              <Route path="reviews" element={<AdminReviewsPage />} />
            </Route>

            <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      <Toaster position="top-right" richColors closeButton />
    </QueryClientProvider>
  );
}

export default App;
