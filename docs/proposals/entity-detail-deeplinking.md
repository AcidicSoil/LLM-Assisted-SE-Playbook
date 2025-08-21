# Implement “Entity Detail Pages + Deep Linking + Command Palette Navigation”

## Objective

- Add typed, deep-linkable detail views for all entities (pattern, workflow, tool, prompt, metric, risk), enable navigation from existing views, and upgrade the command palette to keyboard-navigable quick open. Synchronize Explorer filters with URL for shareable state.

## Scope

- In-scope: New `EntityPage`, router update, navigation from Explorer/Compare/Prompts/Scatter, Command Palette keyboard UX + navigation, Explorer URL params sync, tests, docs.
- Out-of-scope: Backend/data changes, visual redesign, new data sources.

## Architecture

- Routing:
  - Add route `GET /entity/:type/:id` rendered by `EntityPage`.
  - Use `react-router-dom` `useParams` with union `EntityType` and `id:string`.
- Data access:
  - Add `src/data/entities.ts` with:
    - `export type EntityType = 'pattern' | 'workflow' | 'tool' | 'prompt' | 'metric' | 'risk'`
    - `export type AnyEntity = Pattern | Workflow | Tool | Prompt | Metric | Risk`
    - `export function getEntity(playbook: Playbook, type: EntityType, id: string): AnyEntity | undefined`
    - `export function buildEntityUrl(type: EntityType, id: string): string` -> `/entity/${type}/${id}`
    - Narrowing helpers: `isPattern`, `isWorkflow`, etc.
  - Ensure all access is typed via zod-inferred types from `src/data/schemas.ts`.
- UI components:
  - `src/features/entity/EntityPage.tsx`
    - Reads `type`, `id`; fetches entity via `getEntity`.
    - Renders a common header (title/name, tags, summary/desc).
    - Type-specific sections:
      - Pattern: `phase`, `difficulty`, `roi`, `steps`, `bestPractices`, `antiPatterns?`, `links?`
      - Workflow: `stages`, `kpis?`
      - Tool: `category`, `cost?`, `url?`, `strengths`, `limits`
      - Prompt: `useCases`, `inputs?`, `outputs?`, `body` with copy button
      - Metric: `scale`, `desc`, `compute?`
      - Risk: `severity`, `mitigation`
    - Relations section: list of chips linking to related entities via `buildEntityUrl(rel.type, rel.id)`.
    - “Copy link” button to copy current URL; use `navigator.clipboard.writeText(location.href)`.
    - Accessibility: `role="main"`, semantic headings, section landmarks, focus first heading on mount.
    - Error states: invalid `type` or missing `id` -> fallback to NotFound-like view.
- Navigation integration:
  - Explorer (`src/features/explorer/ExplorerPage.tsx`)
    - Make each card title a `Link` to its detail page (preserve current `search` query string for back navigation).
    - Synchronize filters with URL:
      - Read initial `q`, `phase`, `sort` from `useSearchParams` on mount to seed state.
      - Update `searchParams` on change (debounced for `q` by ~200ms).
  - Compare (`src/features/compare/ComparePage.tsx`)
    - Make the Title column entries `Link` to entity details.
  - Prompt Lab (`src/features/prompts/PromptLabPage.tsx`)
    - Make `p.title` a `Link` to its prompt detail page; keep Copy button.
  - ROI Scatter (`src/viz/RoiDifficultyScatter.tsx`)
    - Include `id` in the plotted data points and on point click navigate to the pattern detail page (`/entity/pattern/:id`). Use `useNavigate`.
- Command Palette (`src/components/CommandPalette.tsx`)
  - Improve search:
    - Memoize a Fuse index per playbook via `useMemo`; do not re-create on each keystroke.
    - Debounce `query` updates by ~150–200ms for performance.
  - Result UI:
    - Show top 10 matches; render `title/name`, entity `type`, and small metadata (e.g., pattern `phase`, `roi`).
    - Keyboard navigation: up/down to move active index, Enter to navigate to active result via `buildEntityUrl`.
    - Accessibility: `role="dialog"`, `aria-modal="true"`, focus trap within the palette, ESC to close, proper labelling for input.

## State management

- Keep using Zustand for theme; URL (router) is the source of truth for Explorer filters.
- No global store changes required for entities.

## Standards and Safety

- SOLID: Isolate entity resolution in `entities.ts`; keep `EntityPage` lean with type-specific render helpers.
- Type safety: Use zod-inferred types; strict `EntityType` union; type guards for render branches.
- Error handling: Graceful “Not found” for missing entities; try/catch around clipboard actions; runtime guards for optional fields.
- Security: No `dangerouslySetInnerHTML`; render links with `rel="noopener noreferrer"` and `target="_blank"` where applicable; adhere to existing CSP (script-src 'self').

## Performance

- Memoize Fuse index and derived results to avoid unnecessary work.
- Lazy-load `EntityPage` via React lazy + Suspense to reduce initial bundle.
- Avoid re-filtering when inputs unchanged; stabilize dependencies with `useMemo`.

## Testing

- Unit (Vitest):
  - `src/__tests__/entities.test.ts`:
    - `getEntity` returns the expected entity by type/id; returns `undefined` for invalid.
    - `buildEntityUrl('pattern','scaffold-project')` -> `/entity/pattern/scaffold-project`.
  - Command Palette logic:
    - Debounce hook works; Enter triggers navigation callback with correct URL.
- E2E (Playwright):
  - `e2e/tests/deeplink.spec.ts`:
    - Directly visit `/entity/pattern/scaffold-project` and assert title renders.
  - `e2e/tests/navigation.spec.ts`:
    - From Explorer card click -> correct detail page; browser Back returns with filters preserved.
    - Open Command Palette (Ctrl/Cmd+K), type pattern title, use arrow keys + Enter to navigate; assert arrival.
  - `e2e/tests/scatter-nav.spec.ts`:
    - Click a point in ROI scatter -> navigates to correct pattern detail.
- Accessibility checks:
  - Verify keyboard-only operation for palette and links; ensure focus outline and tab order.

## Documentation

- Update `README.md`:
  - Add new route pattern `/entity/:type/:id`.
  - Document Explorer query params `q`, `phase`, `sort` and deep-linkability.
  - List keyboard shortcuts: `/` focus search, `Ctrl/Cmd+K` open palette, arrows/Enter in palette.
  - Note copy-link feature on detail pages.

## Implementation Steps

1. Add `src/data/entities.ts` (types, helpers).
2. Create `src/features/entity/EntityPage.tsx` with type-specific rendering and relations list.
3. Wire route in `src/app/router.tsx`.
4. Update Explorer cards, Compare table titles, and PromptLab titles to `Link` to details.
5. Update ROI scatter to include `id` and navigate on point click.
6. Enhance Command Palette with keyboard navigation and navigation on Enter.
7. Synchronize Explorer filters with URL params via `useSearchParams`.
8. Add unit + e2e tests described above.
9. Update docs.

## Acceptance Criteria

- Visiting a valid deep link like `/entity/pattern/scaffold-project` renders a typed detail page with tags, metadata, and relations; clicking a relation navigates to that entity.
- Explorer filters persist to URL and restore on reload; Back returns to prior filter state.
- Command Palette supports Ctrl/Cmd+K to open, arrow navigation, and Enter to navigate; items display type + key metadata.
- Clicking a point in the ROI scatter navigates to the corresponding pattern detail.
- All tests pass: `npm run test` and `npm run e2e` green; typecheck and lint pass; build succeeds.
- No regressions in PWA behavior; app still installable and works offline for visited routes (assumes SPA fallback on host).
