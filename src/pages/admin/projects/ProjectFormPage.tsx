import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { projectFormSchema, type ProjectFormValues } from "@/features/projects/types/projectSchema";
import useAdminProjects, { useAdminProjectWithMedia } from "@/features/projects/hooks/useAdminProjects";
import type { ProjectImageType, VideoSourceType } from "@/types/database.types";
import { Plus, Trash } from "lucide-react";

export function ProjectFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: project, isLoading: projectLoading } = useAdminProjectWithMedia(id);
  const {
    create,
    update,
    createImage,
    deleteImage,
    createVideo,
    deleteVideo,
  } = useAdminProjects();

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  const [imageType, setImageType] = useState<ProjectImageType>("gallery");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageCaption, setImageCaption] = useState("");
  const [pairGroup, setPairGroup] = useState("");
  const [imageDisplayOrder, setImageDisplayOrder] = useState(0);
  const imageFileInputRef = useRef<HTMLInputElement | null>(null);

  const [videoType, setVideoType] = useState<VideoSourceType>("upload");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoExternalUrl, setVideoExternalUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoThumbnailFile, setVideoThumbnailFile] = useState<File | null>(null);
  const [videoDisplayOrder, setVideoDisplayOrder] = useState(0);
  const videoFileInputRef = useRef<HTMLInputElement | null>(null);
  const videoThumbnailInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({ resolver: zodResolver(projectFormSchema) });

  useEffect(() => {
    if (project) {
      const values: Partial<ProjectFormValues> = {
        title: project.title,
        slug: project.slug,
        description: project.description,
        category: project.category,
        location: project.location ?? undefined,
        completion_date: project.completion_date ?? undefined,
        status: project.status,
        is_featured: project.is_featured,
      };

      reset(values);
    }
  }, [project, reset]);

  useEffect(() => {
    if (!coverFile) {
      setCoverPreviewUrl(null);
      return;
    }

    const previewUrl = URL.createObjectURL(coverFile);
    setCoverPreviewUrl(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [coverFile]);

  if (id && projectLoading) {
    return <div>Loading project…</div>;
  }

  if (id && !project && !projectLoading) {
    return <div className="text-destructive">Project not found.</div>;
  }

  const submitHandler = handleSubmit(async (values: ProjectFormValues) => {
    try {
      if (id) {
        await update.mutateAsync({ id, ...values, coverImageFile: coverFile });
      } else {
        await create.mutateAsync({ ...values, coverImageFile: coverFile });
      }
      await navigate("/admin/projects");
    } catch (error) {
      console.error(error);
    }
  });

  const handleAddImage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!id || !imageFile) {
      return;
    }

    try {
      await createImage.mutateAsync({
        project_id: id,
        imageFile,
        image_type: imageType,
        caption: imageCaption || null,
        pair_group: imageType === "gallery" ? null : pairGroup || undefined,
        display_order: imageDisplayOrder,
      });
      setImageFile(null);
      setImageCaption("");
      setPairGroup("");
      setImageDisplayOrder(0);
      setImageType("gallery");
      if (imageFileInputRef.current) {
        imageFileInputRef.current.value = "";
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddVideo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!id) {
      return;
    }

    try {
      await createVideo.mutateAsync({
        project_id: id,
        video_type: videoType,
        videoFile: videoType === "upload" ? videoFile : null,
        external_url: videoType === "upload" ? null : videoExternalUrl || null,
        thumbnailFile: videoType === "upload" ? videoThumbnailFile : null,
        title: videoTitle || null,
        display_order: videoDisplayOrder,
      });
      setVideoFile(null);
      setVideoExternalUrl("");
      setVideoTitle("");
      setVideoThumbnailFile(null);
      setVideoDisplayOrder(0);
      setVideoType("upload");
      if (videoFileInputRef.current) {
        videoFileInputRef.current.value = "";
      }
      if (videoThumbnailInputRef.current) {
        videoThumbnailInputRef.current.value = "";
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteImage = (imageId: string) => {
    if (!project) return;
    if (!confirm("Delete this image?")) return;
    void deleteImage.mutate({ id: imageId, projectId: project.id });
  };

  const handleDeleteVideo = (videoId: string) => {
    if (!project) return;
    if (!confirm("Delete this video?")) return;
    void deleteVideo.mutate({ id: videoId, projectId: project.id });
  };

  return (
    <div className="space-y-8">
      <header>
        <h2 className="font-display text-xl">{id ? "Edit Project" : "New Project"}</h2>
      </header>

      <form onSubmit={submitHandler} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...register("title")} />
          {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
        </div>

        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" {...register("slug")} />
          {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            {...register("description")}
            className="w-full rounded-md border border-border p-2"
          />
          {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            {...register("category")}
            className="w-full rounded-md border border-border p-2"
          >
            <option value="residential_interiors">Residential Interiors</option>
            <option value="commercial_interiors">Commercial Interiors</option>
            <option value="turnkey_solutions">Turnkey Solutions</option>
            <option value="space_planning">Space Planning</option>
            <option value="furniture_decor_styling">Furniture & Decor Styling</option>
          </select>
        </div>

        <div>
          <Label>Cover Image</Label>
          {coverPreviewUrl || project?.cover_image_url ? (
            <div className="mt-3 mb-3 max-w-sm overflow-hidden rounded-md border border-border">
              <img
                src={coverPreviewUrl ?? project?.cover_image_url ?? undefined}
                alt={project?.title ? `${project.title} cover image` : "Cover preview"}
                className="h-40 w-full object-cover"
              />
            </div>
          ) : (
            <div className="mt-3 mb-3 rounded-md border border-dashed border-border bg-muted px-4 py-8 text-center text-sm text-muted-foreground">
              No cover image selected.
            </div>
          )}
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" variant="gold" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save Project"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/admin/projects")}>Cancel</Button>
        </div>
      </form>

      {project && (
        <section className="space-y-6">
          <div>
            <h3 className="font-display text-lg">Project Images</h3>
            <div className="mt-4 space-y-3">
              {project.project_images.length === 0 ? (
                <p className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
                  No images added yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {project.project_images
                    .slice()
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((image) => (
                      <div
                        key={image.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3"
                      >
                        <div>
                          <div className="font-medium text-sm text-charcoal">{image.image_type}</div>
                          <div className="text-xs text-muted-foreground">
                            {image.caption ?? "No caption"} • order {image.display_order}
                          </div>
                          {image.pair_group && (
                            <div className="text-xs text-muted-foreground">pair group: {image.pair_group}</div>
                          )}
                        </div>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteImage(image.id)}>
                          <Trash className="mr-2 h-3.5 w-3.5" />Delete
                        </Button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleAddImage} className="space-y-4 rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <h4 className="font-display text-sm">Add New Image</h4>
              <Button type="submit" size="sm" variant="gold" disabled={createImage.isPending || !imageFile}>
                <Plus className="mr-2 h-4 w-4" /> Add Image
              </Button>
            </div>

            <div>
              <Label htmlFor="image_type">Type</Label>
              <select
                id="image_type"
                value={imageType}
                onChange={(event) => setImageType(event.target.value as ProjectImageType)}
                className="w-full rounded-md border border-border p-2"
              >
                <option value="gallery">Gallery</option>
                <option value="before">Before</option>
                <option value="after">After</option>
              </select>
            </div>

            {imageType !== "gallery" && (
              <div>
                <Label htmlFor="pair_group">Pair Group</Label>
                <Input
                  id="pair_group"
                  value={pairGroup}
                  onChange={(event) => setPairGroup(event.target.value)}
                  placeholder="Optional UUID to pair before/after images"
                />
                <p className="text-xs text-muted-foreground">
                  Leave blank to generate a new pairing id.
                </p>
              </div>
            )}

            <div>
              <Label htmlFor="image_caption">Caption</Label>
              <Input
                id="image_caption"
                value={imageCaption}
                onChange={(event) => setImageCaption(event.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="image_display_order">Display Order</Label>
              <Input
                id="image_display_order"
                type="number"
                min="0"
                value={imageDisplayOrder}
                onChange={(event) => setImageDisplayOrder(Number(event.target.value) || 0)}
              />
            </div>

            <div>
              <Label>Image File</Label>
              <input
                ref={imageFileInputRef}
                type="file"
                accept="image/*"
                onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
              />
            </div>
          </form>

          <div>
            <h3 className="font-display text-lg">Project Videos</h3>
            <div className="mt-4 space-y-3">
              {project.project_videos.length === 0 ? (
                <p className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
                  No videos added yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {project.project_videos
                    .slice()
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((video) => (
                      <div
                        key={video.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3"
                      >
                        <div>
                          <div className="font-medium text-sm text-charcoal">{video.video_type}</div>
                          <div className="text-xs text-muted-foreground">
                            {video.title ?? "No title"} • order {video.display_order}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {video.video_type === "upload" ? "Uploaded video" : video.external_url}
                          </div>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteVideo(video.id)}>
                          <Trash className="mr-2 h-3.5 w-3.5" />Delete
                        </Button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleAddVideo} className="space-y-4 rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <h4 className="font-display text-sm">Add New Video</h4>
              <Button
                type="submit"
                size="sm"
                variant="gold"
                disabled={
                  createVideo.isPending ||
                  (videoType === "upload" ? !videoFile : videoExternalUrl.trim().length === 0)
                }
              >
                <Plus className="mr-2 h-4 w-4" /> Add Video
              </Button>
            </div>

            <div>
              <Label htmlFor="video_type">Video Type</Label>
              <select
                id="video_type"
                value={videoType}
                onChange={(event) => setVideoType(event.target.value as VideoSourceType)}
                className="w-full rounded-md border border-border p-2"
              >
                <option value="upload">Upload</option>
                <option value="youtube">YouTube</option>
                <option value="vimeo">Vimeo</option>
                <option value="instagram_reel">Instagram Reel</option>
              </select>
            </div>

            {videoType === "upload" ? (
              <>
                <div>
                  <Label>Video File</Label>
                  <input
                    ref={videoFileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={(event) => setVideoFile(event.target.files?.[0] ?? null)}
                  />
                </div>
                <div>
                  <Label>Thumbnail Image</Label>
                  <input
                    ref={videoThumbnailInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(event) => setVideoThumbnailFile(event.target.files?.[0] ?? null)}
                  />
                </div>
              </>
            ) : (
              <div>
                <Label htmlFor="external_url">External URL</Label>
                <Input
                  id="external_url"
                  value={videoExternalUrl}
                  onChange={(event) => setVideoExternalUrl(event.target.value)}
                />
              </div>
            )}

            <div>
              <Label htmlFor="video_title">Title</Label>
              <Input
                id="video_title"
                value={videoTitle}
                onChange={(event) => setVideoTitle(event.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="video_display_order">Display Order</Label>
              <Input
                id="video_display_order"
                type="number"
                min="0"
                value={videoDisplayOrder}
                onChange={(event) => setVideoDisplayOrder(Number(event.target.value) || 0)}
              />
            </div>
          </form>
        </section>
      )}
    </div>
  );
}

export default ProjectFormPage;
