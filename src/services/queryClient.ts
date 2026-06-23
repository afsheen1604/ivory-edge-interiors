import { QueryClient } from "@tanstack/react-query";

/**
 * App-wide TanStack Query client. Mounted once in App.tsx via
 * QueryClientProvider. Every feature's hooks/ use this same client.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Public site content (projects, services, reviews) doesn't change
      // every second — avoid refetching on every window focus.
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});
