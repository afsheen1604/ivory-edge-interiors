import { Instagram } from "lucide-react";
import { SeoHead } from "@/components/common/SeoHead";
import { Skeleton } from "@/components/feedback/Skeleton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { useActiveInstagramPosts } from "@/features/instagram/hooks/useActiveInstagramPosts";

/**
 * Instagram Gallery page — full grid of every active post/reel, per the
 * brief. Distinct from the Home page's "Instagram Showcase" section, which
 * shows a 6-item preview linking back here.
 */
export function InstagramGalleryPage() {
  const { data: posts, isLoading, isError } = useActiveInstagramPosts();

  return (
    <>
      <SeoHead
        title="Instagram"
        description="See the latest posts and reels from Ivory Edge Interiors on Instagram."
      />

      <div className="bg-ivory-50 py-16 sm:py-20">
        <div className="container text-center">
          <p className="font-body text-xs uppercase tracking-widest2 text-gold-400">
            Follow Along
          </p>
          <h1 className="mt-3 font-display text-3xl text-charcoal sm:text-4xl">
            Instagram Gallery
          </h1>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-auto mt-4 inline-flex items-center gap-2 font-body text-sm text-gold-500 hover:text-gold-600"
          >
            <Instagram className="h-4 w-4" aria-hidden="true" />
            @ivoryedgeinteriors
          </a>
        </div>
      </div>

      <div className="container py-12 sm:py-16">
        {isLoading && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
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
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
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
                    <Instagram className="h-7 w-7" aria-hidden="true" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-charcoal/0 transition-colors group-hover:bg-charcoal/40">
                  <Instagram
                    className="h-7 w-7 text-ivory-100 opacity-0 transition-opacity group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </div>
                {post.type === "reel" && (
                  <span className="absolute right-2 top-2 rounded-full bg-charcoal/70 px-2 py-0.5 font-body text-[10px] uppercase tracking-wide text-ivory-100">
                    Reel
                  </span>
                )}
              </a>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
