export interface NavLink {
  label: string;
  path: string;
}

/**
 * Public site navigation, shared by the Header (full list) and Footer
 * (subset under "Quick Links"). Centralized here so adding/renaming a page
 * only requires one edit.
 */
export const PUBLIC_NAV_LINKS: NavLink[] = [
  { label: "Home", path: "/" },
  { label: "Projects", path: "/projects" },
  { label: "Services", path: "/services" },
  { label: "About Us", path: "/about" },
  { label: "Reviews", path: "/reviews" },
  { label: "Instagram", path: "/instagram" },
  { label: "Contact", path: "/contact" },
];
