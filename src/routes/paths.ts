/**
 * Centralized route paths. Pages, links, and redirects should reference
 * these constants rather than hardcoding strings, so a path change only
 * needs an edit here.
 */
export const ROUTES = {
  home: "/",
  projects: "/projects",
  projectDetails: "/projects/:slug",
  services: "/services",
  about: "/about",
  reviews: "/reviews",
  contact: "/contact",
  instagram: "/instagram",
  adminLogin: "/admin/login",
  adminDashboard: "/admin",
} as const;

/** Builds a real /projects/:slug path from an actual slug value. */
export function projectDetailsPath(slug: string): string {
  return `/projects/${slug}`;
}
