/**
 * Supabase-generated database types.
 *
 * This file mirrors the schema applied via supabase/migrations/0001 through
 * 0011. It is hand-authored to exactly match those migrations because this
 * project connects to a hosted Supabase project rather than a local CLI
 * instance, but the shape (including the Relationships arrays required by
 * @supabase/postgrest-js's GenericTable constraint) matches what
 * `supabase gen types typescript` would produce.
 *
 * To regenerate from the live project instead of trusting this file:
 *
 *   npx supabase login
 *   npx supabase gen types typescript --project-id <your-project-ref> --schema public > src/types/database.types.ts
 *
 * Your project ref is the subdomain in your Supabase URL, e.g. for
 * https://abcdefghijklmnop.supabase.co the ref is `abcdefghijklmnop`.
 *
 * DO NOT hand-edit this file once regenerated from the CLI — re-run the
 * command above after every future migration instead.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type UserRole = "admin";

export type ProjectCategory =
  | "residential_interiors"
  | "commercial_interiors"
  | "turnkey_solutions"
  | "space_planning"
  | "furniture_decor_styling";

export type ProjectStatus = "draft" | "published" | "archived";

export type ProjectImageType = "gallery" | "before" | "after";

export type VideoSourceType = "upload" | "youtube" | "vimeo" | "instagram_reel";

export type ReviewStatus = "pending" | "approved" | "rejected";

export type InquiryStatus = "new" | "in_progress" | "resolved" | "archived";

export type InquirySource = "contact_page" | "project_cta" | "service_cta" | "home_cta";

export type InstagramContentType = "post" | "reel";

export type ContentSection = "homepage" | "about_us" | "contact_info" | "footer";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: UserRole;
          avatar_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          role?: UserRole;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          role?: UserRole;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          category: ProjectCategory;
          location: string | null;
          completion_date: string | null;
          cover_image_url: string | null;
          status: ProjectStatus;
          is_featured: boolean;
          display_order: number;
          created_by: string | null;
          created_at: string;
          updated_at: string;
          search_vector: unknown;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description: string;
          category: ProjectCategory;
          location?: string | null;
          completion_date?: string | null;
          cover_image_url?: string | null;
          status?: ProjectStatus;
          is_featured?: boolean;
          display_order?: number;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string;
          category?: ProjectCategory;
          location?: string | null;
          completion_date?: string | null;
          cover_image_url?: string | null;
          status?: ProjectStatus;
          is_featured?: boolean;
          display_order?: number;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "projects_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      project_images: {
        Row: {
          id: string;
          project_id: string;
          image_url: string;
          image_type: ProjectImageType;
          pair_group: string | null;
          caption: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          image_url: string;
          image_type?: ProjectImageType;
          pair_group?: string | null;
          caption?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          image_url?: string;
          image_type?: ProjectImageType;
          pair_group?: string | null;
          caption?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_images_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      project_videos: {
        Row: {
          id: string;
          project_id: string;
          video_type: VideoSourceType;
          video_url: string | null;
          external_url: string | null;
          thumbnail_url: string | null;
          title: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          video_type: VideoSourceType;
          video_url?: string | null;
          external_url?: string | null;
          thumbnail_url?: string | null;
          title?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          video_type?: VideoSourceType;
          video_url?: string | null;
          external_url?: string | null;
          thumbnail_url?: string | null;
          title?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_videos_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      services: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          image_url: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description: string;
          image_url?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string;
          image_url?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          project_id: string | null;
          reviewer_name: string;
          rating: number;
          review_text: string;
          status: ReviewStatus;
          admin_reply: string | null;
          replied_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id?: string | null;
          reviewer_name: string;
          rating: number;
          review_text: string;
          status?: ReviewStatus;
          admin_reply?: string | null;
          replied_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string | null;
          reviewer_name?: string;
          rating?: number;
          review_text?: string;
          status?: ReviewStatus;
          admin_reply?: string | null;
          replied_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reviews_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      inquiries: {
        Row: {
          id: string;
          name: string;
          phone: string | null;
          email: string;
          message: string;
          source: InquirySource;
          project_id: string | null;
          service_id: string | null;
          status: InquiryStatus;
          admin_notes: string | null;
          created_at: string;
          updated_at: string;
          search_vector: unknown;
        };
        Insert: {
          id?: string;
          name: string;
          phone?: string | null;
          email: string;
          message: string;
          source?: InquirySource;
          project_id?: string | null;
          service_id?: string | null;
          status?: InquiryStatus;
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string | null;
          email?: string;
          message?: string;
          source?: InquirySource;
          project_id?: string | null;
          service_id?: string | null;
          status?: InquiryStatus;
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "inquiries_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inquiries_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
        ];
      };
      instagram_posts: {
        Row: {
          id: string;
          type: InstagramContentType;
          url: string;
          thumbnail_url: string | null;
          caption: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          type: InstagramContentType;
          url: string;
          thumbnail_url?: string | null;
          caption?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          type?: InstagramContentType;
          url?: string;
          thumbnail_url?: string | null;
          caption?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      website_content: {
        Row: {
          id: string;
          section: ContentSection;
          content: Json;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section: ContentSection;
          content?: Json;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          section?: ContentSection;
          content?: Json;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "website_content_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      user_role: UserRole;
      project_category: ProjectCategory;
      project_status: ProjectStatus;
      project_image_type: ProjectImageType;
      video_source_type: VideoSourceType;
      review_status: ReviewStatus;
      inquiry_status: InquiryStatus;
      inquiry_source: InquirySource;
      instagram_content_type: InstagramContentType;
      content_section: ContentSection;
    };
    CompositeTypes: Record<string, never>;
  };
}
