# Architecture

Feature-based architecture. Each business domain owns its own folder under
`src/features/`, containing everything specific to that domain. Cross-cutting
concerns live at the top level of `src/`.

## Layering rules

1. **`pages/`** — One file per route. A page composes layout + feature
   components and wires up route params. Pages must not contain data-fetching
   logic, validation schemas, or business rules directly — those belong in
   `features/*/hooks` and `features/*/services`.

2. **`features/<name>/`** — Self-contained domain module:
   - `components/` — UI specific to this feature (e.g. `ProjectCard`,
     `ReviewForm`). Not reused outside the feature.
   - `hooks/` — TanStack Query hooks (`useProjects`, `useCreateProject`) and
     any feature-local state hooks.
   - `services/` — Functions that talk to Supabase (`getProjects`,
     `createProject`). These are the *only* place that import the Supabase
     client for that domain. Hooks call services; services never call hooks.
   - `types/` — Domain types and Zod schemas (`Project`, `projectSchema`).

   Planned features: `projects`, `services`, `reviews`, `inquiries`,
   `instagram`, `content` (website content management), `auth`, `dashboard`
   (admin stats), `storage` (upload helpers shared across features).

3. **`components/`** — Reusable, feature-agnostic UI:
   - `ui/` — shadcn/ui primitives (Button, Input, Dialog, etc.) — generated,
     rarely hand-edited.
   - `layout/` — Header, Footer, Navbar, Sidebar.
   - `forms/` — Generic form building blocks (FormField wrappers, etc.).
   - `feedback/` — Spinners, Skeletons, EmptyState, ErrorBoundary, Toaster
     wiring.
   - `common/` — Everything else shared (SEO head component, ImageGallery,
     ConfirmDialog).

4. **`layouts/`** — Route shells: `PublicLayout` (header/footer for the
   marketing site), `AdminLayout` (sidebar + topbar for the dashboard),
   `AuthLayout` (centered card for the login page).

5. **`services/`** (top-level) — App-wide clients: the Supabase client
   singleton, the TanStack Query client instance. Feature-level
   `features/*/services` build on top of this client.

6. **`lib/`** — Small, dependency-light utilities: the `cn()` class-merging
   helper, currency/date formatters, slug generators.

7. **`types/`** — Shared/global types and the Supabase-generated
   `database.types.ts` (generated in Phase 3, never hand-edited).

8. **`routes/`** — Centralized route path constants and route guard
   components (`ProtectedRoute`, `AdminRoute`), consumed by `App.tsx`'s
   router configuration.

## Naming conventions

- Components: `PascalCase.tsx` (`ProjectCard.tsx`).
- Hooks: `camelCase.ts` prefixed with `use` (`useProjects.ts`).
- Services: `camelCase.ts`, verb-first functions (`getProjectById`,
  `updateProject`).
- Types/schemas: `camelCase.ts`, named exports (`export type Project`,
  `export const projectSchema`).
- Route paths: kebab-case (`/projects/:slug`, `/admin/inquiries`).

## Import boundaries

- `pages/` may import from `features/*`, `layouts/`, `components/`.
- `features/<name>/` may import from `components/`, `lib/`, `services/`
  (top-level), `types/` — **not** from other `features/*` (cross-feature
  composition happens at the page level).
- `components/ui/` has no dependency on `features/*` or `pages/`.

## Why this shape

Visitors and admins share the same data model but very different UI. Keeping
domain logic in `features/*/services` and `features/*/hooks` means the public
`ProjectsPage` and the admin `ProjectManagementPage` can both consume
`useProjects()` without duplicating Supabase queries, while each owns its own
presentation layer.
