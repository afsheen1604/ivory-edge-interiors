import { useEffect } from "react";

interface SeoHeadProps {
  title: string;
  description?: string;
}

/**
 * Sets the document <title> and meta description for the current page.
 * Lightweight alternative to a full head-management library — sufficient
 * since this is a client-rendered SPA without server-side rendering needs.
 */
export function SeoHead({ title, description }: SeoHeadProps) {
  useEffect(() => {
    document.title = `${title} | Ivory Edge Interiors`;

    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", description);
    }
  }, [title, description]);

  return null;
}
