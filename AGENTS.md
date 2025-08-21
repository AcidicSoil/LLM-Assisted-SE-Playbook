# Role & Mission

You are a senior full-stack engineer, UX lead, and data-viz specialist. Build a fast, accessible, offline-capable **single-page web application (SPA)** that lets users explore the **“LLM-Assisted Software Engineering Playbook.”** You will convert the provided report into normalized JSON and ship a polished, explorable UI with search, filtering, comparisons, and interactive visualizations.

---

## Inputs & Context

* **Primary source:** all files in `llm-playbook/*` (PDF and/or Markdown versions of the playbook).
* **Assume local access** to these files at build time. No external network calls at runtime except loading the local JSON you generate.
* **Audience:** engineers and product leads evaluating LLM-assisted SE techniques.

---

## Output Contract (One Markdown Artifact)

Return **exactly one** markdown artifact named:
**`LLM-Assisted-SE-Playbook Explorer — Full Source (React 18 + TypeScript + Vite)`**
It must contain the **entire repository** as sections grouped by **path**, each with a fenced code block containing the exact file contents. **No commentary** outside headings and code blocks. No TODOs/stubs except PNG icon placeholders.

**Required file tree (minimum):**

* `package.json` (scripts: dev, build, preview, typecheck, lint, format, test, test\:watch, e2e, storybook, build-storybook, prepare)
* `tsconfig.json`, `tsconfig.base.json`
* `vite.config.ts` (with `vite-plugin-pwa`)
* `postcss.config.cjs`, `tailwind.config.ts`, `.eslintrc.cjs`, `.prettierrc`, `.gitignore`
* `.husky/*`, `lint-staged.config.mjs`, `commitlint.config.cjs`
* `index.html` (strict CSP)
* `src/`

  * `main.tsx`, `styles/global.css`
  * `app/router.tsx`, `app/shell.tsx`, `app/store.ts`
  * `components/` (ThemeToggle, CommandPalette, KpiCard, SearchInput, minimal ui primitives)
  * `pages/` (HomePage, NotFound)
  * `features/explorer/ExplorerPage.tsx`
  * `features/compare/ComparePage.tsx`
  * `features/prompts/PromptLabPage.tsx`
  * `viz/RoiDifficultyScatter.tsx` (+ optional Sankey component)
  * `data/schemas.ts` (Zod), `data/repo.ts` (load+validate JSON), `data/indexer.ts` (Fuse.js helper)
  * `utils/cn.ts`
  * `__tests__/schemas.test.ts`, `vitest.setup.ts`
* `public/manifest.webmanifest`, `public/favicon.svg`, `public/icons/pwa-192.png`, `public/icons/pwa-512.png`
* `public/data/playbook.json` (seed you generate by parsing `llm-playbook/*`)
* `e2e/` (`playwright.config.ts`, `tests/smoke.spec.ts`)
* `.github/workflows/ci.yml` (lint → typecheck → unit → build → e2e)
* `.storybook/main.ts`, `.storybook/preview.ts`
* `README.md` (quickstart, scripts, data notes, a11y, PWA, CI)

---

## Default Tech Stack (adapt if unavailable, preserve behavior)

* **Frontend:** React 18 + TypeScript + Vite (SPA)
* **Routing:** React Router
* **Styling:** TailwindCSS (dark mode class strategy)
* **State/Search:** Zustand (light state) + Fuse.js (client search)
* **Validation:** Zod (runtime validation of JSON)
* **Viz:** Recharts (scatter) and `d3-sankey` (optional)
* **Build:** Vite, PWA via `vite-plugin-pwa` (offline cache)
* **Testing:** Vitest (+ Testing Library) and Playwright (smoke)
* **Quality:** ESLint + Prettier + Husky + lint-staged
* **CI:** GitHub Actions

If an environment forbids any default, substitute the closest equivalent (e.g., Next.js static export, Preact, Vanilla Extract) while keeping **identical features, structure, and UX**.

---

## Data Model (Normalize the Playbook)

Parse `llm-playbook/*` into this schema and save as `public/data/playbook.json`. Validate at runtime with Zod.

```ts
// Zod/TypeScript models you MUST implement:
Pattern = {
  id: string, title: string, summary: string,
  phase: 'Ideation'|'Scaffolding'|'Coding'|'Review'|'Testing'|'Deployment',
  difficulty: 'Beginner'|'Intermediate'|'Advanced',
  roi: number /*0..10*/,
  steps: string[], bestPractices: string[],
  antiPatterns?: string[], prompts?: string[], tools?: string[],
  metrics?: string[], risks?: string[], tags: string[], links?: string[],
  relations: { id: string, type: 'pattern'|'workflow'|'tool'|'prompt'|'metric'|'risk', weight?: number }[]
}

Workflow = {
  id: string, title: string, summary: string,
  stages: { name: string, goals: string[], artifacts?: string[] }[],
  kpis?: string[], tags: string[], relations: Pattern['relations']
}

Tool = {
  id: string, name: string, category: string, cost?: string, url?: string,
  strengths: string[], limits: string[], tags: string[], relations: Pattern['relations']
}

Prompt = {
  id: string, title: string, body: string, useCases: string[],
  inputs?: string[], outputs?: string[], tags: string[], relations: Pattern['relations']
}

Metric = { id: string, name: string, desc: string, scale: 'ordinal'|'ratio'|'percent', compute?: string, tags: string[] }
Risk   = { id: string, name: string, mitigation: string[], severity: 'Low'|'Med'|'High', tags: string[] }

Playbook = {
  version: string, updatedAt: string,
  patterns: Pattern[], workflows: Workflow[], tools: Tool[],
  prompts: Prompt[], metrics: Metric[], risks: Risk[]
}
```

**Seeding requirement (minimum):** populate at least **3 Patterns**, **1 Workflow**, **2 Tools**, **2 Prompts**, **2 Metrics**, **2 Risks** directly from the playbook content. Use URL-safe, consistent `id`s.

---

## UX & Features

* **App shell & nav:** Sticky top nav with routes **Home, Explore, Compare, Prompts**; dark/light toggle.
* **Home:** KPI tiles (counts from JSON), version, `updatedAt`.
* **Explore:** Search (Fuse.js), **Phase** filter, Sort (**ROI | Difficulty | Updated**). Card grid with badges (phase, difficulty, ROI).
* **Compare:** Simple comparison table for 3 patterns (phase, difficulty, ROI, best practices). If selection UI would bloat scope, show first 3 as sample.
* **Prompts (Prompt Lab):** Card list with one-click **Copy** of prompt bodies.
* **Visualizations:**

  * **Scatter:** ROI vs Difficulty (map Beginner=1, Intermediate=2, Advanced=3). Tooltip shows title.
  * **Sankey (optional):** Flow across workflow stages using `relations` (hide gracefully if insufficient data).
* **Command palette:** ⌘/Ctrl+K opens a palette; returns top hits across entities via Fuse index.
* **Keyboard:** `/` focuses Explore search.
* **Accessibility:** Skip-to-content link; ARIA labels; visible focus states; basic axe-style checks pass.

---

## Non-Functional Requirements

* **Performance:** <100KB gzipped JS on initial route (excluding `d3`); code-split heavy viz.
* **Security:** Strict CSP in `index.html`; sanitize any Markdown-to-HTML (if used).
* **PWA:** Installable; offline cache of static assets and `playbook.json` with **stale-while-revalidate**.
* **DX:** Strict TypeScript; eslint/prettier on pre-commit.
* **Idempotence:** Deterministic build; no runtime network calls beyond local JSON.

---

## Acceptance Criteria

1. App runs locally (`pnpm dev`) and **Home** shows KPI counts from `public/data/playbook.json`.
2. **Explore** supports search, phase filter, and sort; shows ROI badge and tags; dark/light works.
3. **Scatter** renders with Difficulty mapped 1–3; tooltips show pattern titles.
4. **Prompt Lab** lists prompts with a working **Copy** button.
5. **Command palette** opens with ⌘/Ctrl+K and returns top cross-entity matches; `/` focuses search.
6. **PWA** installs; assets + JSON cached; app remains navigable offline with last-fetched data.
7. **Accessibility:** skip link works; no critical axe issues.
8. **CI** passes: lint, typecheck, unit, build, e2e (smoke).
9. JSON validates via **Zod** on load; invalid data surfaces a clear, user-visible error state.

---

## Implementation Workflow (Do this before emitting code)

1. **Plan (JSON):** Output a brief machine-readable plan (`build_plan.json`) with sections: `files`, `routes`, `components`, `data_model`, `tests`, `ci`.
2. **Parse & Normalize:** From `llm-playbook/*`, extract entities to match the schema; generate `public/data/playbook.json`.
3. **Scaffold & Wire:** Create app shell, routes, data loader (with Zod validation + friendly error).
4. **Implement Features:** Explore, Compare, Prompts, Scatter (and optional Sankey).
5. **Add PWA, A11y, Tests, CI.**
6. **Verify Acceptance Criteria** locally (mock in comments only if necessary; final artifact must be runnable).

> After planning, **return only the final repo artifact** per “Output Contract” (single markdown with grouped file sections). Do **not** include the plan or any extra explanations.
