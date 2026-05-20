# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- In Progress

## Current Goal

- Feature 11: Base canvas (complete)

## Completed

- Feature 01: Design System
  - shadcn/ui initialized (Tailwind v4 compatible, shadcn@4.7.0)
  - Components added: Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea
  - lucide-react installed (^1.16.0, pulled in by shadcn)
  - lib/utils.ts created with cn() helper (clsx + tailwind-merge)
  - globals.css updated: project color tokens + dark-only shadcn token overrides
  - html element has `dark` class enforced in layout.tsx

- Feature 02: Editor Chrome
  - `components/editor/editor-navbar.tsx` — fixed top navbar, sidebar toggle with PanelLeftOpen/PanelLeftClose, left/center/right sections
  - `components/editor/project-sidebar.tsx` — floating overlay sidebar, slides in from left, Projects header + close button, My Projects / Shared tabs with empty states, full-width New Project button
  - Dialog pattern: existing shadcn Dialog component + globals.css tokens (no new dialogs built)

- Feature 04: Project Dialogs & Editor Home
  - `lib/mock-projects.ts` — MockProject type + MOCK_PROJECTS array (3 owned, 2 shared)
  - `hooks/use-project-dialogs.ts` — useProjectDialogs hook managing dialog/form/loading state
  - `components/editor/project-dialogs.tsx` — CreateProjectDialog (live slug preview), RenameProjectDialog (prefilled, Enter submits), DeleteProjectDialog (destructive confirm)
  - `components/editor/project-sidebar.tsx` — project items with hover rename/delete actions (owned only), mobile backdrop scrim
  - `app/editor/page.tsx` — editor home (heading, description, New Project button), all dialogs wired

- Feature 03: Auth
  - `@clerk/ui` installed (v1.11.0) for dark theme support
  - `proxy.ts` at project root — replaces deprecated `middleware.ts` (Next.js 16+), uses `clerkMiddleware` + `createRouteMatcher` to protect all routes except sign-in/sign-up
  - `app/layout.tsx` — wrapped with `ClerkProvider`, dark theme from `@clerk/ui/themes`, appearance variables wired to CSS custom properties
  - `app/sign-in/[[...sign-in]]/page.tsx` — two-panel layout (logo/tagline left, Clerk `<SignIn />` right); form-only on small screens
  - `app/sign-up/[[...sign-up]]/page.tsx` — same two-panel layout with `<SignUp />`
  - `app/page.tsx` — server component: authenticated users → `/editor`, unauthenticated → `/sign-in`
  - `app/editor/page.tsx` — editor shell wiring `EditorNavbar` + `ProjectSidebar`
  - `components/editor/editor-navbar.tsx` — `UserButton` added to right section
  - `.env.local` — placeholder env vars for `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_SIGN_IN_URL`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL`

- Feature 06: Project APIs
  - `app/api/projects/route.ts` — GET (list owner's projects) + POST (create, defaults name to `Untitled Project`)
  - `app/api/projects/[projectId]/route.ts` — PATCH (rename) + DELETE (delete); both enforce owner check (401/403)
  - Fixed `lib/prisma.ts`: typed singleton as `PrismaClient` to resolve union-type callable error from Accelerate extension
  - All four routes verified via `npm run build`

- Feature 05: Prisma Schema & Data Layer
  - Installed `@prisma/client`, `@prisma/adapter-pg`, `pg`, `@prisma/extension-accelerate`
  - `prisma/models/project.prisma` — `Project` model (ownerId, name, description?, status enum DRAFT/ARCHIVED, canvasJsonPath?, timestamps, indexes on ownerId and createdAt) and `ProjectCollaborator` model (projectId with cascade delete, email, createdAt, unique on projectId/email, indexes on email and projectId/createdAt)
  - `lib/prisma.ts` — cached singleton; branches on DATABASE_URL prefix: `prisma+postgres://` → Accelerate extension, otherwise → `PrismaPg` adapter
  - Migration `20260517000422_init` applied; client generated to `lib/generated/prisma`
  - Fixed pre-existing type error in `app/layout.tsx`: removed `afterSignInUrl`/`afterSignUpUrl` props (now env-var-only in Clerk v7+)

- Feature 07: Wire editor home to real project API
  - `lib/data/projects.ts` — `ProjectSummary` type + `getOwnedProjects()` / `getSharedProjects()` server-side helpers (auth/currentUser from Clerk, Prisma queries)
  - `app/api/projects/route.ts` — POST now accepts optional `id` in body so client-generated room IDs propagate to DB
  - `hooks/use-project-actions.ts` — `useProjectActions` hook: create (generates slug+suffix room ID, POST, navigate), rename (PATCH, refresh), delete (DELETE, redirect if active workspace or refresh)
  - `components/editor/project-dialogs.tsx` — switched from `MockProject` to `ProjectSummary`; `CreateProjectDialog` now receives `roomId` prop and shows "room id:" preview
  - `components/editor/project-sidebar.tsx` — removed mock data; accepts `ownedProjects` and `sharedProjects` as props; `isOwned` boolean prop replaces `project.owned`
  - `components/editor/editor-home-client.tsx` — new client component containing interactive shell (sidebar state + dialogs), extracted from page
  - `app/editor/page.tsx` — converted to async server component; fetches owned + shared projects server-side via data helpers; renders `EditorHomeClient`

- Feature 08: Editor workspace shell
  - `lib/project-access.ts` — `getCurrentIdentity()` (userId + primary email from Clerk) and `getProjectAccess(roomId)` (checks owner or collaborator, returns project or null)
  - `components/editor/access-denied.tsx` — centered lock icon, short message, link back to `/editor`; used for both missing and unauthorized projects
  - `components/editor/project-sidebar.tsx` — added optional `activeRoomId` prop; active item gets `--bg-elevated` background, `--accent-primary` left accent bar and text colour
  - `components/editor/workspace-client.tsx` — full-viewport workspace shell: top navbar (project name, Share button, AI sidebar toggle, UserButton), overlay `ProjectSidebar` with current room highlighted, canvas placeholder, collapsible right AI sidebar placeholder
  - `app/editor/[roomId]/page.tsx` — async server component; unauthenticated → `/sign-in`, missing/unauthorized → `AccessDenied`, authorized → `WorkspaceClient` with server-fetched projects; `params` awaited as `Promise` (Next.js 16 convention)

- Feature 09: Share dialog
  - `app/api/projects/[projectId]/collaborators/route.ts` — GET (list collaborators, owner or collaborator access), POST (invite by email, owner only), DELETE (remove by email, owner only); Clerk Backend API enriches collaborator emails with display name + avatar; falls back to email-only if Clerk call fails
  - `components/editor/share-dialog.tsx` — Dialog with copy-link button (temporary "Copied!" feedback), invite-by-email input + Invite button (owners only), collaborator list with avatar/name/email rows and per-row Remove button (owners only); read-only list for collaborators
  - `components/editor/workspace-client.tsx` — added `isOwner` prop, `shareOpen` state, Share button opens ShareDialog
  - `app/editor/[roomId]/page.tsx` — passes `isOwner={project.ownerId === userId}` to WorkspaceClient

- Feature 10: Liveblocks setup
  - `liveblocks.config.ts` — Presence typed (cursor `{x,y}|null`, `isThinking`), UserMeta typed (id, name, avatar, color)
  - `lib/liveblocks.ts` — lazy-cached `Liveblocks` node client singleton (`getLiveblocks()`), `getUserColor(userId)` maps user ID to deterministic color from fixed palette
  - `app/api/liveblocks-auth/route.ts` — POST; requires Clerk auth (401 if missing), verifies project access via `getProjectAccess` (403 if denied), `getOrCreateRoom` ensures room exists, `prepareSession` attaches name/avatar/color and grants `FULL_ACCESS` for the room
  - Installed `@liveblocks/node@3.x` (was missing despite spec claiming all packages installed)

- Feature 11: Base canvas
  - `types/canvas.ts` — `CanvasNodeData` (label, color, shape), `CanvasNodeType` (`"canvasNode"`), `CanvasEdgeType` (`"canvasEdge"`)
  - `components/editor/canvas-wrapper.tsx` — `CanvasWrapper` client component: `LiveblocksProvider` (authEndpoint `/api/liveblocks-auth`), `RoomProvider` (roomId, initialPresence `cursor: null, isThinking: false`), inline class-based `LiveblocksErrorBoundary`, `ClientSideSuspense`; inner `CanvasFlow` uses `useLiveblocksFlow` (suspense, empty initial nodes/edges), `ReactFlow` with `ConnectionMode.Loose`, `fitView`, `MiniMap`, `Background` (dots), `Cursors`
  - `components/editor/workspace-client.tsx` — replaced canvas placeholder with `<CanvasWrapper roomId={project.id} />`

- Feature 12: Shape panel
  - `components/editor/shape-panel.tsx` — floating pill toolbar (bottom-center, `position: absolute`, `zIndex: 10`); 6 draggable shape buttons (rectangle 160×80, diamond 120×120, circle 80×80, pill 160×60, cylinder 100×80, hexagon 100×100); drag payload serialized as JSON under `application/ghost-shape` key with `{ shape, width, height }`
  - `components/editor/canvas-node.tsx` — `CanvasNode` custom node renderer; renders all shapes as a simple bordered rectangle with centered label; uses design-system tokens (`--border-default`, `--bg-elevated`, `--text-primary`)
  - `components/editor/canvas-wrapper.tsx` — restructured: `CanvasFlow` wraps `CanvasInner` in `ReactFlowProvider` so `useReactFlow` is accessible; `CanvasInner` adds `nodeTypes` (`canvasNode → CanvasNode`), `onDragOver`/`onDrop` handlers (reads shape payload, `screenToFlowPosition`, `addNodes` with `id = shape-timestamp-counter`); `ShapePanel` rendered as absolute overlay inside canvas container

## In Progress

- None.

## Next Up

- Feature 13 (TBD)

## Open Questions

- None yet.

## Architecture Decisions

- Using shadcn/ui on top of Tailwind v4 for UI primitives
- Components live in components/ui/ (generated by CLI, not modified manually)
- cn() helper in lib/utils.ts uses clsx + tailwind-merge
- Dark-only app: `dark` class hardcoded on `<html>`, both `:root` and `.dark` blocks set to project dark palette so no light flash regardless of class state
- Auth via Clerk: proxy.ts (Next.js 16 convention), ClerkProvider in root layout, public routes defined via NEXT_PUBLIC_CLERK_SIGN_IN/UP_URL env vars
- Prisma v7: multi-file schema (prisma/ dir), prisma.config.ts for datasource URL, driver adapter required; client generated to lib/generated/prisma

## Session Notes

- Tailwind v4 is in use — CSS-based config, no tailwind.config.js
- Next.js 16.2.6 — `middleware.ts` is deprecated; use `proxy.ts` with `export const proxy = ...` (not `middleware`)
- Path alias @/* maps to project root (./)
- shadcn uses @base-ui/react (not radix-ui) internally in this version
- Clerk appearance uses `theme` prop (not `baseTheme`) and `Variables` type from @clerk/ui
