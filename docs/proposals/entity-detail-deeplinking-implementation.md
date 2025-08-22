Implement “Entity Detail Pages + Deep Linking + Command Palette Navigation”

Objective

- Add typed, deep-linkable detail views for entities (`pattern`, `workflow`, `tool`, `prompt`, `metric`, `risk`), link from existing views, upgrade command palette with keyboard navigation, and sync Explorer filters to URL for shareable state.

Deliverables

- New `EntityPage` with typed sections and relations, deep linkable at `/entity/:type/:id`.
- Router update to register the new route (lazy-loaded).
- Links from Explorer, Compare, Prompt Lab, and ROI Scatter to detail pages.
- Command Palette with memoized search index, keyboard navigation, and Enter-to-navigate.
- Explorer filters synchronized with URL params (`q`, `phase`, `sort`), with back/forward restore.
- Unit tests (Vitest), E2E tests (Playwright), accessibility checks.
- Documentation updates in `README.md`.

Architecture

- Routing:
  - Add route `GET /entity/:type/:id` handled by `EntityPage` in `src/app/router.tsx`.
  - Use `react-router-dom` `useParams` with `type: EntityType` and `id: string`.
  - Lazy-load `EntityPage` via `React.lazy` + `Suspense`.
- Data & Types (`src/data/entities.ts`):
  - Import zod-inferred types from `src/data/schemas.ts` (e.g., `Pattern`, `Workflow`, etc.).
  - Define `export type EntityType = 'pattern' | 'workflow' | 'tool' | 'prompt' | 'metric' | 'risk'`.
  - Define `export type AnyEntity = Pattern | Workflow | Tool | Prompt | Metric | Risk`.
  - Implement `export function getEntity(playbook: Playbook, type: EntityType, id: string): AnyEntity | undefined` using typed lookups.
  - Implement `export function buildEntityUrl(type: EntityType, id: string): string` returning `/entity/${type}/${id}`.
  - Add narrowing helpers `isPattern`, `isWorkflow`, `isTool`, `isPrompt`, `isMetric`, `isRisk`.
  - Add `isEntityType(x: unknown): x is EntityType`.
- UI Component (`src/features/entity/EntityPage.tsx`):
  - Read `type`, `id` from `useParams`; validate with `isEntityType`; fetch via `getEntity`.
  - Common header: title/name, tags, summary/description.
  - Type-specific sections:
    - `pattern`: `phase`, `difficulty`, `roi`, `steps`, `bestPractices`, optional `antiPatterns`, optional `links`.
    - `workflow`: `stages`, optional `kpis`.
    - `tool`: `category`, optional `cost`, optional `url`, `strengths`, `limits`.
    - `prompt`: `useCases`, optional `inputs`, optional `outputs`, `body` with Copy button.
    - `metric`: `scale`, `desc`, optional `compute`.
    - `risk`: `severity`, `mitigation`.
  - Relations: render chip list of related entities; each chip `Link` to `buildEntityUrl(rel.type, rel.id)`.
  - Copy-link button: `navigator.clipboard.writeText(location.href)` with try/catch; show non-blocking toast/status.
  - Accessibility: `role="main"`, semantic headings, section landmarks, focus first heading on mount.
  - Error states: invalid `type` or missing/unknown `id` → NotFound-like fallback with safe navigation back.
- Navigation Integration:
  - Explorer (`src/features/explorer/ExplorerPage.tsx`):
    - Card titles become `Link` to detail pages; preserve current `search` from `useLocation()` for back navigation.
    - URL sync for filters via `useSearchParams`:
      - On mount, seed component state from `q`, `phase`, `sort`.
      - On change, update `searchParams`; debounce `q` by ~200ms.
      - Default values: `q=''`, `phase='all'`, `sort='relevance'` (match existing behavior).
  - Compare (`src/features/compare/ComparePage.tsx`): Title column entries become `Link` to details.
  - Prompt Lab (`src/features/prompts/PromptLabPage.tsx`): `p.title` becomes `Link` to prompt detail; retain Copy button.
  - ROI Scatter (`src/viz/RoiDifficultyScatter.tsx`): Include `id` in datum; on point click, `useNavigate()` to `/entity/pattern/:id`.
- Command Palette (`src/components/CommandPalette.tsx`):
  - Search:
    - Build a memoized `Fuse` index per playbook via `useMemo` (stable deps).
    - Debounce `query` updates by ~150–200ms; only compute results when query changes.
  - Results:
    - Show top 10 items with `title/name`, `type`, and small metadata (e.g., pattern `phase`, `roi`).
    - Keyboard navigation: Up/Down to move active index; Enter navigates to `buildEntityUrl`.
    - Open with `Ctrl/Cmd+K`; ESC closes; focus trap while open.
  - Accessibility: `role="dialog"`, `aria-modal="true"`, labelled input, proper tab order, visible focus.
- State Management:
  - Continue Zustand for theme; no new global store for entities.
  - Router URL is source of truth for Explorer filters.

Standards

- SOLID: Keep `entities.ts` as the single data resolution utility; `EntityPage` delegates to small typed render helpers.
- Type Safety: Use zod-inferred types; strict `EntityType` union; type guards for rendering branches.
- Error Handling: Guard invalid params; not-found fallback; try/catch for clipboard; runtime checks for optional fields.
- Security: No `dangerouslySetInnerHTML`; external links use `rel="noopener noreferrer"` and `target="_blank"`; adhere to CSP.
- Accessibility: Landmarks, labelled controls, keyboard navigation, focus management, visible outlines.
- Performance: Memoize Fuse and derived lists; lazy-load `EntityPage`; avoid re-filtering when inputs unchanged; stable memo deps.

Files to Create/Modify

- Add `src/data/entities.ts` (types, guards, helpers).
- Add `src/features/entity/EntityPage.tsx` (typed rendering, relations, copy link).
- Update `src/app/router.tsx` (lazy route `/entity/:type/:id`).
- Update `src/features/explorer/ExplorerPage.tsx` (Links, URL param sync).
- Update `src/features/compare/ComparePage.tsx` (Links).
- Update `src/features/prompts/PromptLabPage.tsx` (Links).
- Update `src/viz/RoiDifficultyScatter.tsx` (navigate on point click).
- Update `src/components/CommandPalette.tsx` (Fuse memoization, debounce, keyboard nav).
- Add tests: `src/__tests__/entities.test.ts`.
- Add e2e tests: `e2e/tests/deeplink.spec.ts`, `e2e/tests/navigation.spec.ts`, `e2e/tests/scatter-nav.spec.ts`.
- Update `README.md` (routes, query params, shortcuts, copy-link).

Testing

- Unit (Vitest):
  - `getEntity` returns correct entity; returns `undefined` for invalid.
  - `buildEntityUrl('pattern','scaffold-project')` → `/entity/pattern/scaffold-project`.
  - Command Palette: debounce behavior; Enter triggers navigation callback with correct URL.
- E2E (Playwright):
  - Visit `/entity/pattern/scaffold-project` and assert title.
  - From Explorer card click → correct detail; Back restores filters.
  - Palette: open with `Ctrl/Cmd+K`, type, arrow keys + Enter → navigates; assert arrival.
  - ROI scatter: click a point → navigates to pattern detail.
- Accessibility:
  - Keyboard-only operation for palette and links; focus outline; tab order sanity.

Documentation

- `README.md`:
  - Add route `/entity/:type/:id`.
  - Document Explorer URL params `q`, `phase`, `sort` and shareable state.
  - List shortcuts: `/` focuses search, `Ctrl/Cmd+K` opens palette, arrows/Enter navigate palette.
  - Note copy-link feature on detail pages.

Implementation Steps

- Create `src/data/entities.ts`.
- Implement `src/features/entity/EntityPage.tsx`.
- Wire route in `src/app/router.tsx` with `React.lazy`.
- Add `Link`s in Explorer, Compare, Prompt Lab.
- Update ROI scatter to navigate on point click.
- Enhance Command Palette (memoized Fuse, debounce, keyboard nav, navigation).
- Sync Explorer filters with `useSearchParams`.
- Add unit and e2e tests; ensure types and lint pass.
- Update `README.md`.

Acceptance Criteria

- `/entity/pattern/scaffold-project` renders typed detail page with tags, metadata, relations; relation chips navigate correctly.
- Explorer filters persist to URL and restore on reload; Back restores prior filter state.
- Command Palette supports `Ctrl/Cmd+K`, arrow navigation, Enter-to-navigate; items show type + key metadata.
- Clicking ROI scatter point navigates to the correct pattern detail.
- All checks green: `npm run typecheck`, `npm run lint`, `npm run test`, `npm run e2e`, and production build succeeds.
- No regressions in PWA behavior; app remains installable; SPA fallback covers deep links.

Constraints / Non-Goals

- Do not change backend/data sources or schemas.
- No visual redesign beyond navigation affordances.
- Avoid introducing new global state; prefer router URL for Explorer filters.

Notes

- Preserve existing query string when linking from Explorer to detail to support easy Back.
- Implement `Copy` for prompt body and `Copy link` for page URL with graceful failure UI.
- Use small, pure helpers for type-specific rendering to keep `EntityPage` maintainable.
