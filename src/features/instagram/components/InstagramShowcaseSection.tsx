import { NavLink } from "react-router-dom";
import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/feedback/Skeleton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { useActiveInstagramPosts } from "@/features/instagram/hooks/useActiveInstagramPosts";

export function InstagramShowcaseSection() {
  const { data: posts, isLoading, isError } = useActiveInstagramPosts(6);

  return (
    <section className="container py-20 sm:py-28">
      <div className="flex flex-col items-center text-center">
        <p className="font-body text-xs uppercase tracking-widest2 text-gold-400">
          Follow Along
        </p>
        <h2 className="mt-3 font-display text-3xl text-charcoal sm:text-4xl">
          Instagram Showcase
        </h2>
      </div>

      <div className="mt-12">
        {isLoading && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full" />
            ))}
          </div>
        )}

        {!isLoading && isError && (
          <EmptyState
            icon={Instagram}
            title="Couldn't load Instagram content right now"
            description="Please refresh the page, or check back shortly."
          />
        )}

        {!isLoading && !isError && posts && posts.length === 0 && (
          <EmptyState
            icon={Instagram}
            title="Instagram content coming soon"
            description="Recent posts and reels will appear here once published by the admin."
          />
        )}

        {!isLoading && !isError && posts && posts.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {posts.map((post) => (
              <a
                key={post.id}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden rounded-md bg-ivory-200"
              >
                {post.thumbnail_url ? (
                  <img
                    src={post.thumbnail_url}
                    alt={post.caption ?? "Instagram post"}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gold-300">
                    <Instagram className="h-6 w-6" aria-hidden="true" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-charcoal/0 transition-colors group-hover:bg-charcoal/40">
                  <Instagram
                    className="h-6 w-6 text-ivory-100 opacity-0 transition-opacity group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      <div className="mt-12 text-center">
        <Button variant="outline" size="lg" asChild>
          <NavLink to="/instagram">View Full Gallery</NavLink>
        </Button>
      </div>
    </section>
  );
}
