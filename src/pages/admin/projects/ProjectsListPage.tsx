import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import useAdminProjects from "@/features/projects/hooks/useAdminProjects";

export function ProjectsListPage() {
  const navigate = useNavigate();
  const { data: projects, isLoading, isError, remove } = useAdminProjects();

  return (
    <div>
      <header className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl">Projects</h2>
        <Button variant="gold" onClick={() => navigate("/admin/projects/new") }>
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </header>

      {isLoading ? (
        <div>Loading projects…</div>
      ) : isError ? (
        <div className="text-destructive">Failed to load projects.</div>
      ) : projects && projects.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">No projects yet.</div>
      ) : (
        <div className="space-y-3">
          {projects?.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
              <div>
                <div className="font-medium text-sm text-charcoal">{p.title}</div>
                <div className="text-xs text-muted-foreground">{p.category} • {p.status}</div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => navigate(`/admin/projects/${p.id}/edit`)}>Edit</Button>
                <Button variant="outline" size="sm" onClick={() => { if (confirm('Delete this project?')) void remove.mutate(p.id); }}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectsListPage;
