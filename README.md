# Ivory Edge Interiors

> Art of Living Stylish

Interior Design portfolio and client engagement platform for **Ivory Edge Interiors**, founded by **Shaik Riyaz Ahmed**.

---

## Overview

This application is a modern web presence for an interior design studio, combining a public-facing showcase with an authenticated admin experience for managing projects, media, reviews, and contact inquiries.

The app includes:

- Public portfolio pages for projects, services, reviews, and Instagram gallery content
- Admin project management with cover images, gallery images, and video support
- Supabase backend for authentication, database storage, and media uploads
- Responsive UI built with React, TypeScript, Tailwind CSS, and Radix primitives

---

## Tech stack

| Layer         | Choice                                     |
| ------------- | ------------------------------------------ |
| Frontend      | React 18 + TypeScript + Vite               |
| UI            | Tailwind CSS + shadcn/ui (Radix primitives) |
| Routing       | React Router v7                            |
| Forms         | React Hook Form + Zod                      |
| Data fetching | TanStack Query v5                          |
| Notifications | Sonner                                     |
| Backend       | Supabase (Postgres, Auth, Storage)         |
| Deployment    | Vercel                                     |

---

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173 after the development server starts.

### Useful commands

```bash
npm run typecheck
npm run lint
npm run build
npm run preview
```

---

## Environment variables

Copy `.env.example` to `.env` and provide your Supabase project values plus site metadata.

Required variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SITE_NAME`
- `VITE_SITE_URL`
- `VITE_CONTACT_PHONE`
- `VITE_CONTACT_WHATSAPP`
- `VITE_CONTACT_EMAIL`

---

## Project structure

```
src/
  components/   # Shared UI primitives, layout components, form fields, feedback UI
  features/     # Domain features with components, hooks, services, types
  layouts/      # Page shells and route layouts
  pages/        # Route-level pages for public and admin views
  services/     # App-wide service clients (Supabase, query client)
  types/        # Shared types and generated Supabase database types
  styles/       # Global CSS and Tailwind imports
  utils/        # Small reusable helpers
supabase/
  migrations/   # SQL migrations for schema evolution
  seed/         # Seed data for local development
docs/           # Architecture, database, auth, and storage documentation
```

---

## Docs

- `docs/ARCHITECTURE.md` — folder conventions and application architecture
- `docs/DATABASE.md` — Supabase schema and table definitions
- `docs/STORAGE.md` — storage bucket setup and upload helper behavior
- `docs/AUTHENTICATION.md` — authentication flow and admin provisioning
