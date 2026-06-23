import { NavLink } from "react-router-dom";
import { ImageOff } from "lucide-react";
import { PROJECT_CATEGORY_LABELS, type ProjectWithCover } from "@/features/projects/types/project";
import { projectDetailsPath } from "@/routes/paths";

export function ProjectCard({ project }: { project: ProjectWithCover }) {
  return (
    <NavLink
      to={projectDetailsPath(project.slug)}
      className="group block overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md"
    >
      <div className="aspect-[4/3] overflow-hidden bg-ivory-200">
        {project.cover_image_url ? (
          <img
            src={project.cover_image_url}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gold-300">
            <ImageOff className="h-8 w-8" aria-hidden="true" />
          </div>
        )}
      </div>
      <div className="p-5">
        <p className="font-body text-xs uppercase tracking-widest2 text-gold-400">
          {PROJECT_CATEGORY_LABELS[project.category]}
        </p>
        <h3 className="mt-1.5 font-display text-lg text-charcoal">{project.title}</h3>
        {project.location && (
          <p className="mt-1 font-body text-sm text-muted-foreground">{project.location}</p>
        )}
      </div>
    </NavLink>
  );
}
