import { useMemo } from "react";
import type { ProjectImage } from "@/features/projects/types/project";

interface BeforeAfterGalleryProps {
  images: ProjectImage[];
}

interface BeforeAfterPair {
  pairGroup: string;
  before: ProjectImage | undefined;
  after: ProjectImage | undefined;
}

/**
 * Groups before/after images by their shared pair_group (set in migration
 * 0005) and renders each pair side by side. Pairs missing either half
 * (e.g. admin uploaded "before" but hasn't added "after" yet) are skipped
 * rather than shown broken.
 */
export function BeforeAfterGallery({ images }: BeforeAfterGalleryProps) {
  const pairs = useMemo(() => {
    const groups = new Map<string, BeforeAfterPair>();

    for (const image of images) {
      if (!image.pair_group) continue;
      const existing = groups.get(image.pair_group) ?? {
        pairGroup: image.pair_group,
        before: undefined,
        after: undefined,
      };
      if (image.image_type === "before") existing.before = image;
      if (image.image_type === "after") existing.after = image;
      groups.set(image.pair_group, existing);
    }

    return Array.from(groups.values()).filter((pair) => pair.before && pair.after);
  }, [images]);

  if (pairs.length === 0) return null;

  return (
    <div className="space-y-8">
      {pairs.map((pair) => (
        <div key={pair.pairGroup} className="grid gap-3 sm:grid-cols-2">
          <figure className="overflow-hidden rounded-md">
            <div className="aspect-[4/3] overflow-hidden bg-ivory-200">
              <img
                src={pair.before?.image_url}
                alt={pair.before?.caption ?? "Before"}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <figcaption className="mt-2 font-body text-xs uppercase tracking-widest2 text-muted-foreground">
              Before
            </figcaption>
          </figure>
          <figure className="overflow-hidden rounded-md">
            <div className="aspect-[4/3] overflow-hidden bg-ivory-200">
              <img
                src={pair.after?.image_url}
                alt={pair.after?.caption ?? "After"}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <figcaption className="mt-2 font-body text-xs uppercase tracking-widest2 text-gold-500">
              After
            </figcaption>
          </figure>
        </div>
      ))}
    </div>
  );
}
