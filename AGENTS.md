**Role:** You are a senior full-stack engineer, UX lead, and data-viz specialist. Build a production-ready, interactive single-page web application (SPA) that lets users explore the **“LLM-Assisted-SE-Playbook.”** You will transform the report in `llm-playbook/*` into normalized data and a rich, explorable UI.

---

## Objectives

* Convert the markdown report(s) in `llm-playbook/*` into a validated JSON dataset.
* Ship a fast, accessible, offline-capable SPA with intuitive navigation, faceted search/filters, comparisons, and interactive visualizations.
* Provide complete, ready-to-run source code, tests, and lightweight CI.

---

## Tech Constraints (Default Stack)

* **Frontend:** React 18 + TypeScript + Vite (SPA)
* **Routing:** React Router
* **Styling:** TailwindCSS with dark mode
* **State/Search:** Zustand (app state) + Fuse.js (client search)
* **Validation:** Zod (dataset schema + runtime validation)
* **Viz:** Recharts (scatter, matrix) + `d3-sankey` (flows)
* **Build:** Vite, PWA via `vite-plugin-pwa`
* **Testing:** Vitest + @testing-library/react + `axe-core` a11y checks
* **Utilities:** DOMPurify (safe markdown rendering), date-fns, clsx

If `llm-playbook/*` isn’t available, generate a realistic stub dataset from the structure below so the app remains fully functional.

---

## Data Modeling

Design a normalized schema capturing practices, patterns, stages, artifacts, metrics, risks, and relationships.

**Zod schema (conceptual):**

* `Node`: `{ id, type: "practice" | "pattern" | "anti_pattern" | "stage" | "artifact" | "metric" | "tool" | "concept" | "case_study", title, summary, detailsMD, tags[], roles[], stages[], inputs[], outputs[], impact: 1..5, effort: 1..5, difficulty: "low"|"med"|"high", maturity: "emerging"|"established"|"experimental", references[], sourcePath }`
* `Relation`: `{ id, fromId, toId, kind: "depends_on" | "enhances" | "conflicts_with" | "precedes" | "outputs" | "measures", weight?: number, evidence?: string }`
* `Dataset`: `{ nodes: Node[], relations: Relation[], glossary?: { term, definition }[], sources?: { id, title, url }[] }`

**Parsing rules:**

* Extract front-matter (YAML) if present; otherwise infer from headings/sections.
* Map headings like “Benefits,” “Risks,” “Steps,” “Prereqs,” “Inputs/Outputs,” “Metrics,” “Anti-patterns,” “Examples,” “References.”
* Build Sankey flows using `precedes | outputs` relations.
* Compute derived fields (e.g., `quadrant = impact×effort`, `searchText`).
* Validate with Zod; emit a single `public/data/playbook.json` used by the app.

**Script:** Node/TS CLI `scripts/build-data.ts` that:

1. scans `llm-playbook/*`,
2. parses markdown (remark/gray-matter),
3. sanitizes HTML fragments,
4. constructs & validates `Dataset`,
5. writes JSON + lightweight stats report.

Include unit tests for the parser and schema.

---

## UX Requirements

**Global**

* Top nav: Home, Explore, Visualize, Compare, Glossary, About.
* Persistent search bar (Fuse.js); filter drawer (stages, roles, type, tags, effort, impact, maturity).
* Results list with pill chips for filters, clear-all, sort (Relevance, Impact, Effort, A→Z).
* Keyboard shortcuts: `/` focus search, `f` toggle filters, `?` help, `s` save view, `c` open compare.

**Detail View**

* Markdown rendering with safe HTML; auto-TOC.
* Side metadata panel (tags, roles, stages, metrics).
* Relationship graph preview (neighbor list + quick links).
* “Related” section (by relations + semantic similarity via Fuse).

**Compare**

* Pin up to 4 items; show attribute table, pros/cons, risk flags, and a mini impact-vs-effort scatter with highlighted points.

**Visualize**

* **Sankey:** flows across stages (e.g., Idea → Spec → Code → Review → Deploy). Filters respect current facets.
* **Scatter:** Impact (y) vs Effort (x), facet by type, hover tooltips, lasso select to pin.
* **Matrix/Heatmap:** Stages × Practices coverage (count or relevance score).

**Quality**

* Responsive (mobile → desktop), dark mode via `class` strategy.
* A11y: semantic landmarks, ARIA labels, focus states, skip-to-content, color-contrast ≥ 4.5.
* Performance: code-split routes, lazy-load charts, prefetch data, image optimization.
* Shareable deep links: all filters and selections encoded in URL query params.
* Offline PWA: cache `index.html`, `assets`, `playbook.json`; offline fallback pages.
* Local persistence: user pins, theme, last query in `localStorage`.

---

## Security

* Sanitize any rendered HTML (DOMPurify).
* No eval or remote code execution.
* Strict CSP meta in `index.html` where applicable.

---

## Deliverables (produce all in one response, in this order)

1. **Architecture & Plan (markdown):** goals, user personas, key journeys, route map, state model (Zustand store shape), data flow, URL scheme, error states, a11y plan.
2. **Data Schema & Parser Spec:** Zod schemas, markdown parsing conventions, relation inference rules, test cases.
3. **Source Code (full repo):**

   * `package.json` with scripts: `dev`, `build`, `preview`, `test`, `lint`, `typecheck`, `data`
   * `/scripts/build-data.ts` with unit tests in `/scripts/__tests__`
   * `/src/` structure:

     * `main.tsx`, `App.tsx`, `routes/*`
     * `components/*` (SearchBar, FilterDrawer, Card, Tag, Pill, Table, Modal, Tabs, Tooltip)
     * `charts/*` (Sankey.tsx, Scatter.tsx, Matrix.tsx)
     * `state/store.ts` (filters, pins, theme, dataset slice)
     * `lib/*` (fuse config, urlSync, formatters, a11y, analytics stub)
     * `pages/*` (Home, Explore, Visualize, Compare, Glossary, About, NotFound)
     * `styles/tailwind.css`, `theme.ts`
     * `workers/pwa.ts` (vite-plugin-pwa config)
     * `types/*` (zod-inferred types)
     * `data/` (loaded JSON)
   * Tailwind config with dark mode, sensible typography.
   * Router with lazy routes and error boundaries.
4. **Tests:**

   * Vitest unit tests for parsers, store reducers/selectors, and critical components.
   * React Testing Library for pages; `axe-core` smoke a11y on key screens.
5. **CI:** GitHub Actions workflow: install (pnpm), typecheck, lint, test, build, run `scripts/build-data.ts`.
6. **Docs:**

   * `README.md` with setup, scripts, data build pipeline, PWA notes, deployment guide (Vercel/Netlify), and keyboard shortcuts.
   * `CONTRIBUTING.md` (coding standards, commit style, testing guidance).
   * `docs/DATA_MODEL.md` (schema, examples).
7. **Seed Data:** If `llm-playbook/*` absent, include `public/data/playbook.json` generated from a stub covering at least 12 practices across 5 stages with diverse relations.

---

## Implementation Notes

* Use TypeScript everywhere; export Zod-inferred types.
* Fuse.js config: weight `title:0.5, tags:0.3, summary:0.2`, threshold \~0.3, tokenize.
* URL sync: two-way binding between store and query params (`?q=&types=&stages=&roles=&impact=&effort=&maturity=&pins=`).
* Recharts: single-chart components with responsive containers; tooltips, legends, and aria labels.
* Sankey: derive nodes/links from `relations` where `kind` in `["precedes","outputs"]`.
* Matrix: compute stage × type coverage from `nodes`.
* Ensure no blocking hydration issues; guard charts behind `useEffect` data-ready checks.

---

## Output Protocol

Produce everything in a single response, in the order above. For the **Source Code**, output a cohesive repository with file paths as headings and code blocks per file. Keep commands copy-pasteable. Do not omit critical files. When resources are missing, include and reference the **stub dataset** so the app runs immediately.

**Think step-by-step**: first draft the Architecture & Plan, then the Data Schema & Parser Spec, and only then emit the full source code, tests, CI, and documentation.
