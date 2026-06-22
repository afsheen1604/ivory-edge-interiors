import { Play } from "lucide-react";
import type { ProjectVideo } from "@/features/projects/types/project";

interface VideoGalleryProps {
  videos: ProjectVideo[];
}

/**
 * Extracts a YouTube/Vimeo embeddable URL from whatever format the admin
 * pasted (watch?v=, youtu.be/, vimeo.com/123456, etc). Returns null if the
 * URL doesn't match a recognizable pattern — in which case we fall back to
 * a plain link rather than a broken iframe.
 */
function getEmbedUrl(video: ProjectVideo): string | null {
  if (!video.external_url) return null;

  if (video.video_type === "youtube") {
    const match = video.external_url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/,
    );
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  }

  if (video.video_type === "vimeo") {
    const match = video.external_url.match(/vimeo\.com\/(\d+)/);
    return match ? `https://player.vimeo.com/video/${match[1]}` : null;
  }

  // Instagram doesn't offer a simple public iframe-embed-by-ID the way
  // YouTube/Vimeo do without their embed JS SDK, so reels link out instead
  // of attempting an iframe embed (see VideoCard below).
  return null;
}

function VideoCard({ video }: { video: ProjectVideo }) {
  if (video.video_type === "upload" && video.video_url) {
    return (
      <div className="overflow-hidden rounded-md bg-charcoal">
        <video
          src={video.video_url}
          poster={video.thumbnail_url ?? undefined}
          controls
          preload="metadata"
          className="aspect-video w-full"
        >
          Your browser does not support video playback.
        </video>
        {video.title && (
          <p className="px-1 py-2 font-body text-sm text-charcoal">{video.title}</p>
        )}
      </div>
    );
  }

  if (video.video_type === "instagram_reel" && video.external_url) {
    return (
      <a
        href={video.external_url}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex aspect-video items-center justify-center overflow-hidden rounded-md bg-charcoal"
      >
        {video.thumbnail_url ? (
          <img
            src={video.thumbnail_url}
            alt={video.title ?? "Instagram Reel"}
            className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
          />
        ) : (
          <p className="font-body text-sm text-ivory-200">View Reel on Instagram</p>
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-charcoal/30">
          <Play className="h-10 w-10 fill-ivory-100 text-ivory-100" aria-hidden="true" />
        </span>
      </a>
    );
  }

  const embedUrl = getEmbedUrl(video);

  if (embedUrl) {
    return (
      <div className="overflow-hidden rounded-md">
        <iframe
          src={embedUrl}
          title={video.title ?? "Project video"}
          className="aspect-video w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        {video.title && (
          <p className="px-1 py-2 font-body text-sm text-charcoal">{video.title}</p>
        )}
      </div>
    );
  }

  // Fallback: link couldn't be parsed into an embeddable form.
  return (
    <a
      href={video.external_url ?? undefined}
      target="_blank"
      rel="noopener noreferrer"
      className="flex aspect-video items-center justify-center rounded-md bg-ivory-200 font-body text-sm text-charcoal hover:bg-ivory-300"
    >
      Watch video ↗
    </a>
  );
}

export function VideoGallery({ videos }: VideoGalleryProps) {
  if (videos.length === 0) return null;

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}
