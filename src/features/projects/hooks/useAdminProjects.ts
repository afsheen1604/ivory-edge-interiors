import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminProjects,
  getAdminProject,
  getAdminProjectWithMedia,
  createAdminProject,
  updateAdminProject,
  deleteAdminProject,
  createAdminProjectImage,
  deleteAdminProjectImage,
  createAdminProjectVideo,
  deleteAdminProjectVideo,
  type ProjectRow,
  type ProjectWithMedia,
  type ProjectImageRow,
  type ProjectVideoRow,
  type CreateProjectInput,
  type UpdateProjectInput,
  type CreateProjectImageInput,
  type CreateProjectVideoInput,
} from "@/features/projects/services/projectsAdminService";

export function useAdminProjects() {
  const qc = useQueryClient();

  const q = useQuery<ProjectRow[]>({
    queryKey: ["admin", "projects"],
    queryFn: getAdminProjects,
    staleTime: 1000 * 30,
  });

  const create = useMutation<ProjectRow, unknown, CreateProjectInput>({
    mutationFn: createAdminProject,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "projects"] }),
  });

  const update = useMutation<ProjectRow, unknown, UpdateProjectInput>({
    mutationFn: updateAdminProject,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "projects"] }),
  });

  const remove = useMutation<void, unknown, string>({
    mutationFn: deleteAdminProject,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "projects"] }),
  });

  const createImage = useMutation<ProjectImageRow, unknown, CreateProjectImageInput>({
    mutationFn: createAdminProjectImage,
    onSuccess: (_, variables) => qc.invalidateQueries({ queryKey: ["admin", "project-with-media", variables.project_id] }),
  });

  const deleteImage = useMutation<void, unknown, { id: string; projectId: string }>({
    mutationFn: async (input) => deleteAdminProjectImage(input.id),
    onSuccess: (_, variables) => qc.invalidateQueries({ queryKey: ["admin", "project-with-media", variables.projectId] }),
  });

  const createVideo = useMutation<ProjectVideoRow, unknown, CreateProjectVideoInput>({
    mutationFn: createAdminProjectVideo,
    onSuccess: (_, variables) => qc.invalidateQueries({ queryKey: ["admin", "project-with-media", variables.project_id] }),
  });

  const deleteVideo = useMutation<void, unknown, { id: string; projectId: string }>({
    mutationFn: async (input) => deleteAdminProjectVideo(input.id),
    onSuccess: (_, variables) => qc.invalidateQueries({ queryKey: ["admin", "project-with-media", variables.projectId] }),
  });

  return {
    ...q,
    create,
    update,
    remove,
    createImage,
    deleteImage,
    createVideo,
    deleteVideo,
  };
}

export function useAdminProject(id?: string) {
  return useQuery<ProjectRow | null>({
    queryKey: ["admin", "project", id],
    queryFn: () => getAdminProject(id as string),
    enabled: Boolean(id),
  });
}

export function useAdminProjectWithMedia(id?: string) {
  return useQuery<ProjectWithMedia | null>({
    queryKey: ["admin", "project-with-media", id],
    queryFn: () => getAdminProjectWithMedia(id as string),
    enabled: Boolean(id),
    staleTime: 1000 * 30,
  });
}

export default useAdminProjects;
