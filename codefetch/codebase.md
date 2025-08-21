AGENTS.md

```
1 | **Role:** You are a senior full-stack engineer, UX lead, and data-viz specialist. Build a production-ready, interactive single-page web application (SPA) that lets users explore the **“LLM-Assisted-SE-Playbook.”** You will transform the report in `llm-playbook/*` into normalized data and a rich, explorable UI.
2 |
3 | ---
4 |
5 | ## Objectives
6 |
7 | * Convert the markdown report(s) in `llm-playbook/*` into a validated JSON dataset.
8 | * Ship a fast, accessible, offline-capable SPA with intuitive navigation, faceted search/filters, comparisons, and interactive visualizations.
9 | * Provide complete, ready-to-run source code, tests, and lightweight CI.
10 |
11 | ---
12 |
13 | ## Tech Constraints (Default Stack)
14 |
15 | * **Frontend:** React 18 + TypeScript + Vite (SPA)
16 | * **Routing:** React Router
17 | * **Styling:** TailwindCSS with dark mode
18 | * **State/Search:** Zustand (app state) + Fuse.js (client search)
19 | * **Validation:** Zod (dataset schema + runtime validation)
20 | * **Viz:** Recharts (scatter, matrix) + `d3-sankey` (flows)
21 | * **Build:** Vite, PWA via `vite-plugin-pwa`
22 | * **Testing:** Vitest + @testing-library/react + `axe-core` a11y checks
23 | * **Utilities:** DOMPurify (safe markdown rendering), date-fns, clsx
24 |
25 | If `llm-playbook/*` isn’t available, generate a realistic stub dataset from the structure below so the app remains fully functional.
26 |
27 | ---
28 |
29 | ## Data Modeling
30 |
31 | Design a normalized schema capturing practices, patterns, stages, artifacts, metrics, risks, and relationships.
32 |
33 | **Zod schema (conceptual):**
34 |
35 | * `Node`: `{ id, type: "practice" | "pattern" | "anti_pattern" | "stage" | "artifact" | "metric" | "tool" | "concept" | "case_study", title, summary, detailsMD, tags[], roles[], stages[], inputs[], outputs[], impact: 1..5, effort: 1..5, difficulty: "low"|"med"|"high", maturity: "emerging"|"established"|"experimental", references[], sourcePath }`
36 | * `Relation`: `{ id, fromId, toId, kind: "depends_on" | "enhances" | "conflicts_with" | "precedes" | "outputs" | "measures", weight?: number, evidence?: string }`
37 | * `Dataset`: `{ nodes: Node[], relations: Relation[], glossary?: { term, definition }[], sources?: { id, title, url }[] }`
38 |
39 | **Parsing rules:**
40 |
41 | * Extract front-matter (YAML) if present; otherwise infer from headings/sections.
42 | * Map headings like “Benefits,” “Risks,” “Steps,” “Prereqs,” “Inputs/Outputs,” “Metrics,” “Anti-patterns,” “Examples,” “References.”
43 | * Build Sankey flows using `precedes | outputs` relations.
44 | * Compute derived fields (e.g., `quadrant = impact×effort`, `searchText`).
45 | * Validate with Zod; emit a single `public/data/playbook.json` used by the app.
46 |
47 | **Script:** Node/TS CLI `scripts/build-data.ts` that:
48 |
49 | 1. scans `llm-playbook/*`,
50 | 2. parses markdown (remark/gray-matter),
51 | 3. sanitizes HTML fragments,
52 | 4. constructs & validates `Dataset`,
53 | 5. writes JSON + lightweight stats report.
54 |
55 | Include unit tests for the parser and schema.
56 |
57 | ---
58 |
59 | ## UX Requirements
60 |
61 | **Global**
62 |
63 | * Top nav: Home, Explore, Visualize, Compare, Glossary, About.
64 | * Persistent search bar (Fuse.js); filter drawer (stages, roles, type, tags, effort, impact, maturity).
65 | * Results list with pill chips for filters, clear-all, sort (Relevance, Impact, Effort, A→Z).
66 | * Keyboard shortcuts: `/` focus search, `f` toggle filters, `?` help, `s` save view, `c` open compare.
67 |
68 | **Detail View**
69 |
70 | * Markdown rendering with safe HTML; auto-TOC.
71 | * Side metadata panel (tags, roles, stages, metrics).
72 | * Relationship graph preview (neighbor list + quick links).
73 | * “Related” section (by relations + semantic similarity via Fuse).
74 |
75 | **Compare**
76 |
77 | * Pin up to 4 items; show attribute table, pros/cons, risk flags, and a mini impact-vs-effort scatter with highlighted points.
78 |
79 | **Visualize**
80 |
81 | * **Sankey:** flows across stages (e.g., Idea → Spec → Code → Review → Deploy). Filters respect current facets.
82 | * **Scatter:** Impact (y) vs Effort (x), facet by type, hover tooltips, lasso select to pin.
83 | * **Matrix/Heatmap:** Stages × Practices coverage (count or relevance score).
84 |
85 | **Quality**
86 |
87 | * Responsive (mobile → desktop), dark mode via `class` strategy.
88 | * A11y: semantic landmarks, ARIA labels, focus states, skip-to-content, color-contrast ≥ 4.5.
89 | * Performance: code-split routes, lazy-load charts, prefetch data, image optimization.
90 | * Shareable deep links: all filters and selections encoded in URL query params.
91 | * Offline PWA: cache `index.html`, `assets`, `playbook.json`; offline fallback pages.
92 | * Local persistence: user pins, theme, last query in `localStorage`.
93 |
94 | ---
95 |
96 | ## Security
97 |
98 | * Sanitize any rendered HTML (DOMPurify).
99 | * No eval or remote code execution.
100 | * Strict CSP meta in `index.html` where applicable.
101 |
102 | ---
103 |
104 | ## Deliverables (produce all in one response, in this order)
105 |
106 | 1. **Architecture & Plan (markdown):** goals, user personas, key journeys, route map, state model (Zustand store shape), data flow, URL scheme, error states, a11y plan.
107 | 2. **Data Schema & Parser Spec:** Zod schemas, markdown parsing conventions, relation inference rules, test cases.
108 | 3. **Source Code (full repo):**
109 |
110 |    * `package.json` with scripts: `dev`, `build`, `preview`, `test`, `lint`, `typecheck`, `data`
111 |    * `/scripts/build-data.ts` with unit tests in `/scripts/__tests__`
112 |    * `/src/` structure:
113 |
114 |      * `main.tsx`, `App.tsx`, `routes/*`
115 |      * `components/*` (SearchBar, FilterDrawer, Card, Tag, Pill, Table, Modal, Tabs, Tooltip)
116 |      * `charts/*` (Sankey.tsx, Scatter.tsx, Matrix.tsx)
117 |      * `state/store.ts` (filters, pins, theme, dataset slice)
118 |      * `lib/*` (fuse config, urlSync, formatters, a11y, analytics stub)
119 |      * `pages/*` (Home, Explore, Visualize, Compare, Glossary, About, NotFound)
120 |      * `styles/tailwind.css`, `theme.ts`
121 |      * `workers/pwa.ts` (vite-plugin-pwa config)
122 |      * `types/*` (zod-inferred types)
123 |      * `data/` (loaded JSON)
124 |    * Tailwind config with dark mode, sensible typography.
125 |    * Router with lazy routes and error boundaries.
126 | 4. **Tests:**
127 |
128 |    * Vitest unit tests for parsers, store reducers/selectors, and critical components.
129 |    * React Testing Library for pages; `axe-core` smoke a11y on key screens.
130 | 5. **CI:** GitHub Actions workflow: install (pnpm), typecheck, lint, test, build, run `scripts/build-data.ts`.
131 | 6. **Docs:**
132 |
133 |    * `README.md` with setup, scripts, data build pipeline, PWA notes, deployment guide (Vercel/Netlify), and keyboard shortcuts.
134 |    * `CONTRIBUTING.md` (coding standards, commit style, testing guidance).
135 |    * `docs/DATA_MODEL.md` (schema, examples).
136 | 7. **Seed Data:** If `llm-playbook/*` absent, include `public/data/playbook.json` generated from a stub covering at least 12 practices across 5 stages with diverse relations.
137 |
138 | ---
139 |
140 | ## Implementation Notes
141 |
142 | * Use TypeScript everywhere; export Zod-inferred types.
143 | * Fuse.js config: weight `title:0.5, tags:0.3, summary:0.2`, threshold \~0.3, tokenize.
144 | * URL sync: two-way binding between store and query params (`?q=&types=&stages=&roles=&impact=&effort=&maturity=&pins=`).
145 | * Recharts: single-chart components with responsive containers; tooltips, legends, and aria labels.
146 | * Sankey: derive nodes/links from `relations` where `kind` in `["precedes","outputs"]`.
147 | * Matrix: compute stage × type coverage from `nodes`.
148 | * Ensure no blocking hydration issues; guard charts behind `useEffect` data-ready checks.
149 |
150 | ---
151 |
152 | ## Output Protocol
153 |
154 | Produce everything in a single response, in the order above. For the **Source Code**, output a cohesive repository with file paths as headings and code blocks per file. Keep commands copy-pasteable. Do not omit critical files. When resources are missing, include and reference the **stub dataset** so the app runs immediately.
155 |
156 | **Think step-by-step**: first draft the Architecture & Plan, then the Data Schema & Parser Spec, and only then emit the full source code, tests, CI, and documentation.
```

build_plan.json

```
1 | {
2 |   "files": [
3 |     "package.json",
4 |     "tsconfig.base.json",
5 |     "tsconfig.json",
6 |     "vite.config.ts",
7 |     "postcss.config.cjs",
8 |     "tailwind.config.ts",
9 |     ".eslintrc.cjs",
10 |     ".prettierrc",
11 |     ".gitignore",
12 |     "index.html",
13 |     "src/main.tsx",
14 |     "src/styles/global.css",
15 |     "src/app/router.tsx",
16 |     "src/app/shell.tsx",
17 |     "src/app/store.ts",
18 |     "src/components/ThemeToggle.tsx",
19 |     "src/components/CommandPalette.tsx",
20 |     "src/components/KpiCard.tsx",
21 |     "src/components/SearchInput.tsx",
22 |     "src/pages/HomePage.tsx",
23 |     "src/pages/NotFound.tsx",
24 |     "src/features/explorer/ExplorerPage.tsx",
25 |     "src/features/compare/ComparePage.tsx",
26 |     "src/features/prompts/PromptLabPage.tsx",
27 |     "src/viz/RoiDifficultyScatter.tsx",
28 |     "src/data/schemas.ts",
29 |     "src/data/repo.ts",
30 |     "src/data/indexer.ts",
31 |     "src/utils/cn.ts",
32 |     "src/__tests__/schemas.test.ts",
33 |     "src/vitest.setup.ts",
34 |     "public/manifest.webmanifest",
35 |     "public/favicon.svg",
36 |     "public/icons/pwa-192.png",
37 |     "public/icons/pwa-512.png",
38 |     "public/data/playbook.json",
39 |     "e2e/playwright.config.ts",
40 |     "e2e/tests/smoke.spec.ts",
41 |     ".github/workflows/ci.yml",
42 |     ".husky/pre-commit",
43 |     ".husky/commit-msg",
44 |     "lint-staged.config.mjs",
45 |     "commitlint.config.cjs",
46 |     "README.md",
47 |     ".storybook/main.ts",
48 |     ".storybook/preview.ts"
49 |   ],
50 |   "routes": [
51 |     { "path": "/", "component": "HomePage" },
52 |     { "path": "/explore", "component": "ExplorerPage" },
53 |     { "path": "/compare", "component": "ComparePage" },
54 |     { "path": "/prompts", "component": "PromptLabPage" },
55 |     { "path": "*", "component": "NotFound" }
56 |   ],
57 |   "components": [
58 |     "ThemeToggle",
59 |     "CommandPalette",
60 |     "KpiCard",
61 |     "SearchInput",
62 |     "RoiDifficultyScatter"
63 |   ],
64 |   "data_model": {
65 |     "entities": ["Pattern", "Workflow", "Tool", "Prompt", "Metric", "Risk"],
66 |     "file": "public/data/playbook.json",
67 |     "schemaFile": "src/data/schemas.ts"
68 |   },
69 |   "tests": {
70 |     "unit": "vitest",
71 |     "e2e": "playwright"
72 |   },
73 |   "ci": {
74 |     "workflow": ".github/workflows/ci.yml",
75 |     "steps": ["lint", "typecheck", "test", "build", "e2e"]
76 |   }
77 | }
```

commitlint.config.cjs

```
1 | module.exports = { extends: ['@commitlint/config-conventional'] };
```

git-apply-v2.sh

```
1 |  (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF'
2 | diff --git a/.eslintrc.cjs b/.eslintrc.cjs
3 | new file mode 100644
4 | index 0000000000000000000000000000000000000000..0518f11ef30245c43436b95f4af19c205224e903
5 | --- /dev/null
6 | +++ b/.eslintrc.cjs
7 | @@ -0,0 +1,6 @@
8 | +module.exports = {
9 | +  env: { browser: true, es2021: true },
10 | +  extends: ['eslint:recommended', 'plugin:react-hooks/recommended', 'prettier'],
11 | +  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
12 | +  settings: { react: { version: 'detect' } }
13 | +};
14 | diff --git a/.github/workflows/ci.yml b/.github/workflows/ci.yml
15 | new file mode 100644
16 | index 0000000000000000000000000000000000000000..8c4097aa06ec868036f3dd68d7097662f9ee64bd
17 | --- /dev/null
18 | +++ b/.github/workflows/ci.yml
19 | @@ -0,0 +1,17 @@
20 | +name: CI
21 | +on: [push]
22 | +jobs:
23 | +  build:
24 | +    runs-on: ubuntu-latest
25 | +    steps:
26 | +      - uses: actions/checkout@v3
27 | +      - uses: actions/setup-node@v3
28 | +        with:
29 | +          node-version: '18'
30 | +          cache: 'npm'
31 | +      - run: npm ci
32 | +      - run: npm run lint
33 | +      - run: npm run typecheck
34 | +      - run: npm test
35 | +      - run: npm run build
36 | +      - run: npm run e2e
37 | diff --git a/.gitignore b/.gitignore
38 | new file mode 100644
39 | index 0000000000000000000000000000000000000000..866f12432d5fb78cf72dcf08a9b8ed6926b4f8a9
40 | --- /dev/null
41 | +++ b/.gitignore
42 | @@ -0,0 +1,8 @@
43 | +node_modules
44 | +.dist
45 | +dist
46 | +.git
47 | +.env
48 | +coverage
49 | +.vscode
50 | +
51 | diff --git a/.husky/commit-msg b/.husky/commit-msg
52 | new file mode 100755
53 | index 0000000000000000000000000000000000000000..0bd658f49625bb80327470bbd59bc134fdc9d1e3
54 | --- /dev/null
55 | +++ b/.husky/commit-msg
56 | @@ -0,0 +1,4 @@
57 | +#!/bin/sh
58 | +. "$(dirname "$0")/_/husky.sh"
59 | +
60 | +npx --no-install commitlint --edit "$1"
61 | diff --git a/.husky/pre-commit b/.husky/pre-commit
62 | new file mode 100755
63 | index 0000000000000000000000000000000000000000..36af219892fda8ea669cd4b6725cd7b892231967
64 | --- /dev/null
65 | +++ b/.husky/pre-commit
66 | @@ -0,0 +1,4 @@
67 | +#!/bin/sh
68 | +. "$(dirname "$0")/_/husky.sh"
69 | +
70 | +npx lint-staged
71 | diff --git a/.prettierrc b/.prettierrc
72 | new file mode 100644
73 | index 0000000000000000000000000000000000000000..650cb880f6f5ab3fc82898bd91612f937443fa6e
74 | --- /dev/null
75 | +++ b/.prettierrc
76 | @@ -0,0 +1,4 @@
77 | +{
78 | +  "singleQuote": true,
79 | +  "semi": true
80 | +}
81 | diff --git a/.storybook/main.ts b/.storybook/main.ts
82 | new file mode 100644
83 | index 0000000000000000000000000000000000000000..3c6f36857ea5aa97de7b2368c5af20b4a39590db
84 | --- /dev/null
85 | +++ b/.storybook/main.ts
86 | @@ -0,0 +1,11 @@
87 | +import type { StorybookConfig } from '@storybook/react-vite';
88 | +
89 | +const config: StorybookConfig = {
90 | +  stories: ['../src/**/*.stories.@(ts|tsx)'],
91 | +  addons: ['@storybook/addon-essentials'],
92 | +  framework: {
93 | +    name: '@storybook/react-vite',
94 | +    options: {},
95 | +  },
96 | +};
97 | +export default config;
98 | diff --git a/.storybook/preview.ts b/.storybook/preview.ts
99 | new file mode 100644
100 | index 0000000000000000000000000000000000000000..7f99a3f7a7f7c16704aaaa0f414f3e052dcca1f9
101 | --- /dev/null
102 | +++ b/.storybook/preview.ts
103 | @@ -0,0 +1,2 @@
104 | +import '../src/styles/global.css';
105 | +export const parameters = { layout: 'fullscreen' };
106 | diff --git a/README.md b/README.md
107 | index 65718b492fa0e3993d6790f192fdd5d6f5641f57..af441845aebe4de9cab2417c7539f04a4ef17333 100644
108 | GIT binary patch
109 | literal 636
110 | zcmYjO%Wm8-47}?r2<)-@0D8>L*amHp1W2$2dX+45Yt^zPh?JB4`;zja?MW1ekKxP?
111 | zo}XV19Z?|00WOd58r`i=X@bX(98<w!%x(v7HTa3x6*k6N+dCS~l4l5uBx7uGsS6Ca
112 | zD&Bf7zJ$zV%mJ+AEgYat&>|o#tIQUtuOSW!=8}f$Iiv+zPQhGo4fwvnE&PYYu&@I9
113 | zYAxR~`Vsx4$sh9B2tdoV0;JYZm%zaCA<g1v)CRr#y@X%mf6(CADORu%0{s(;1fs|n
114 | ziH*6WT0AyDc&tdGh_J4G4F06$r+nA*_?yyV!7T#>g4M+!ut@G0L^uvJ9^2f`dlWnR
115 | z5Ch*-yUP@^-Z)A8gyM}W1JIZX`^xkH_GICjd?i^<=!zfrV9#9Q={yggo-Cw{3xQAb
116 | ztjn{D$b4V+`m-~p%ULPit#p0F#?m_xj<(aTsX)43g$05v+L)fd8}l{rx7tJ3Y$Lsd
117 | Wnjd@k>xP6X^?oyM-)4*ENAm|M`qWnd
118 |
119 | literal 58
120 | zcmezWPnki1!3PL^8FU#O8H#~06NpO~QW;W!BEbx<Kr(<Khar)nk|Bv99|*G<cp11D
121 | E0B*es-2eap
122 |
123 | diff --git a/build_plan.json b/build_plan.json
124 | new file mode 100644
125 | index 0000000000000000000000000000000000000000..6572d551fb0a1eda6bed6b4dde2cd24a6168e3ad
126 | --- /dev/null
127 | +++ b/build_plan.json
128 | @@ -0,0 +1,77 @@
129 | +{
130 | +  "files": [
131 | +    "package.json",
132 | +    "tsconfig.base.json",
133 | +    "tsconfig.json",
134 | +    "vite.config.ts",
135 | +    "postcss.config.cjs",
136 | +    "tailwind.config.ts",
137 | +    ".eslintrc.cjs",
138 | +    ".prettierrc",
139 | +    ".gitignore",
140 | +    "index.html",
141 | +    "src/main.tsx",
142 | +    "src/styles/global.css",
143 | +    "src/app/router.tsx",
144 | +    "src/app/shell.tsx",
145 | +    "src/app/store.ts",
146 | +    "src/components/ThemeToggle.tsx",
147 | +    "src/components/CommandPalette.tsx",
148 | +    "src/components/KpiCard.tsx",
149 | +    "src/components/SearchInput.tsx",
150 | +    "src/pages/HomePage.tsx",
151 | +    "src/pages/NotFound.tsx",
152 | +    "src/features/explorer/ExplorerPage.tsx",
153 | +    "src/features/compare/ComparePage.tsx",
154 | +    "src/features/prompts/PromptLabPage.tsx",
155 | +    "src/viz/RoiDifficultyScatter.tsx",
156 | +    "src/data/schemas.ts",
157 | +    "src/data/repo.ts",
158 | +    "src/data/indexer.ts",
159 | +    "src/utils/cn.ts",
160 | +    "src/__tests__/schemas.test.ts",
161 | +    "src/vitest.setup.ts",
162 | +    "public/manifest.webmanifest",
163 | +    "public/favicon.svg",
164 | +    "public/icons/pwa-192.png",
165 | +    "public/icons/pwa-512.png",
166 | +    "public/data/playbook.json",
167 | +    "e2e/playwright.config.ts",
168 | +    "e2e/tests/smoke.spec.ts",
169 | +    ".github/workflows/ci.yml",
170 | +    ".husky/pre-commit",
171 | +    ".husky/commit-msg",
172 | +    "lint-staged.config.mjs",
173 | +    "commitlint.config.cjs",
174 | +    "README.md",
175 | +    ".storybook/main.ts",
176 | +    ".storybook/preview.ts"
177 | +  ],
178 | +  "routes": [
179 | +    { "path": "/", "component": "HomePage" },
180 | +    { "path": "/explore", "component": "ExplorerPage" },
181 | +    { "path": "/compare", "component": "ComparePage" },
182 | +    { "path": "/prompts", "component": "PromptLabPage" },
183 | +    { "path": "*", "component": "NotFound" }
184 | +  ],
185 | +  "components": [
186 | +    "ThemeToggle",
187 | +    "CommandPalette",
188 | +    "KpiCard",
189 | +    "SearchInput",
190 | +    "RoiDifficultyScatter"
191 | +  ],
192 | +  "data_model": {
193 | +    "entities": ["Pattern", "Workflow", "Tool", "Prompt", "Metric", "Risk"],
194 | +    "file": "public/data/playbook.json",
195 | +    "schemaFile": "src/data/schemas.ts"
196 | +  },
197 | +  "tests": {
198 | +    "unit": "vitest",
199 | +    "e2e": "playwright"
200 | +  },
201 | +  "ci": {
202 | +    "workflow": ".github/workflows/ci.yml",
203 | +    "steps": ["lint", "typecheck", "test", "build", "e2e"]
204 | +  }
205 | +}
206 | diff --git a/commitlint.config.cjs b/commitlint.config.cjs
207 | new file mode 100644
208 | index 0000000000000000000000000000000000000000..422b19445bd83d06acea0d73d2a05410b7b94b44
209 | --- /dev/null
210 | +++ b/commitlint.config.cjs
211 | @@ -0,0 +1 @@
212 | +module.exports = { extends: ['@commitlint/config-conventional'] };
213 | diff --git a/e2e/playwright.config.ts b/e2e/playwright.config.ts
214 | new file mode 100644
215 | index 0000000000000000000000000000000000000000..4094c9ba14bf51f98573f825d064e2eb4cb586aa
216 | --- /dev/null
217 | +++ b/e2e/playwright.config.ts
218 | @@ -0,0 +1,10 @@
219 | +import { defineConfig } from '@playwright/test';
220 | +
221 | +export default defineConfig({
222 | +  webServer: {
223 | +    command: 'npm run dev',
224 | +    port: 5173,
225 | +    reuseExistingServer: !process.env.CI,
226 | +  },
227 | +  testDir: './tests',
228 | +});
229 | diff --git a/e2e/tests/smoke.spec.ts b/e2e/tests/smoke.spec.ts
230 | new file mode 100644
231 | index 0000000000000000000000000000000000000000..7f23cd6019b4212b867a396a758ef62366f147c2
232 | --- /dev/null
233 | +++ b/e2e/tests/smoke.spec.ts
234 | @@ -0,0 +1,6 @@
235 | +import { test, expect } from '@playwright/test';
236 | +
237 | +test('home loads', async ({ page }) => {
238 | +  await page.goto('http://localhost:5173/');
239 | +  await expect(page.locator('text=LLM Playbook')).toBeVisible();
240 | +});
241 | diff --git a/index.html b/index.html
242 | new file mode 100644
243 | index 0000000000000000000000000000000000000000..8f0e2bc58361b669592ab1c840d6ba91207d7eba
244 | --- /dev/null
245 | +++ b/index.html
246 | @@ -0,0 +1,14 @@
247 | +<!DOCTYPE html>
248 | +<html lang="en">
249 | +  <head>
250 | +    <meta charset="UTF-8" />
251 | +    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; script-src 'self';" />
252 | +    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
253 | +    <link rel="manifest" href="/manifest.webmanifest" />
254 | +    <title>LLM Playbook Explorer</title>
255 | +  </head>
256 | +  <body class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
257 | +    <div id="root"></div>
258 | +    <script type="module" src="/src/main.tsx"></script>
259 | +  </body>
260 | +</html>
261 | diff --git a/lint-staged.config.mjs b/lint-staged.config.mjs
262 | new file mode 100644
263 | index 0000000000000000000000000000000000000000..d3215ae61baa0b1b5862eb90090734429cd9f4e7
264 | --- /dev/null
265 | +++ b/lint-staged.config.mjs
266 | @@ -0,0 +1,3 @@
267 | +export default {
268 | +  '*.{ts,tsx,js,jsx,json,css,md}': ['prettier --write']
269 | +};
270 | diff --git a/package-lock.json b/package-lock.json
271 | new file mode 100644
272 | index 0000000000000000000000000000000000000000..090292575b7acd0f59fe2b8048e9b977b29d0f05
273 | --- /dev/null
274 | +++ b/package-lock.json
275 | @@ -0,0 +1,12547 @@
276 | +{
277 | +  "name": "playbook-explorer",
278 | +  "version": "1.0.0",
279 | +  "lockfileVersion": 3,
280 | +  "requires": true,
281 | +  "packages": {
282 | +    "": {
283 | +      "name": "playbook-explorer",
284 | +      "version": "1.0.0",
285 | +      "dependencies": {
286 | +        "@tanstack/react-router": "^1.0.0",
287 | +        "@tanstack/router-devtools": "^1.0.0",
288 | +        "clsx": "^2.0.0",
289 | +        "fuse.js": "^6.6.2",
290 | +        "react": "^18.2.0",
291 | +        "react-dom": "^18.2.0",
292 | +        "react-router-dom": "^6.22.3",
293 | +        "recharts": "^2.8.0",
294 | +        "zod": "^3.22.4",
295 | +        "zustand": "^4.4.0"
296 | +      },
297 | +      "devDependencies": {
298 | +        "@commitlint/cli": "^17.8.1",
299 | +        "@commitlint/config-conventional": "^17.8.1",
300 | +        "@testing-library/jest-dom": "^6.2.0",
301 | +        "@testing-library/react": "^14.1.2",
302 | +        "@types/node": "^20.10.6",
303 | +        "@types/react": "^18.2.25",
304 | +        "@types/react-dom": "^18.2.9",
305 | +        "@vitejs/plugin-react": "^4.2.1",
306 | +        "autoprefixer": "^10.4.14",
307 | +        "axe-core": "^4.7.2",
308 | +        "d3-sankey": "^0.12.3",
309 | +        "eslint": "^8.54.0",
310 | +        "eslint-config-prettier": "^9.0.0",
311 | +        "eslint-plugin-react-hooks": "^4.6.0",
312 | +        "eslint-plugin-react-refresh": "^0.4.5",
313 | +        "husky": "^9.0.10",
314 | +        "lint-staged": "^14.0.1",
315 | +        "playwright": "^1.41.2",
316 | +        "postcss": "^8.4.31",
317 | +        "prettier": "^3.1.1",
318 | +        "tailwindcss": "^3.3.5",
319 | +        "ts-node": "^10.9.2",
320 | +        "tsx": "^4.7.1",
321 | +        "typescript": "^5.3.3",
322 | +        "vite": "^5.0.0",
323 | +        "vite-plugin-pwa": "^0.17.4",
324 | +        "vitest": "^0.34.5"
325 | +      }
326 | +    },
327 | +    "node_modules/@adobe/css-tools": {
328 | +      "version": "4.4.4",
329 | +      "resolved": "https://registry.npmjs.org/@adobe/css-tools/-/css-tools-4.4.4.tgz",
330 | +      "integrity": "sha512-Elp+iwUx5rN5+Y8xLt5/GRoG20WGoDCQ/1Fb+1LiGtvwbDavuSk0jhD/eZdckHAuzcDzccnkv+rEjyWfRx18gg==",
331 | +      "dev": true,
332 | +      "license": "MIT"
333 | +    },
334 | +    "node_modules/@alloc/quick-lru": {
335 | +      "version": "5.2.0",
336 | +      "resolved": "https://registry.npmjs.org/@alloc/quick-lru/-/quick-lru-5.2.0.tgz",
337 | +      "integrity": "sha512-UrcABB+4bUrFABwbluTIBErXwvbsU/V7TZWfmbgJfbkwiBuziS9gxdODUyuiecfdGQ85jglMW6juS3+z5TsKLw==",
338 | +      "dev": true,
339 | +      "license": "MIT",
340 | +      "engines": {
341 | +        "node": ">=10"
342 | +      },
343 | +      "funding": {
344 | +        "url": "https://github.com/sponsors/sindresorhus"
345 | +      }
346 | +    },
347 | +    "node_modules/@ampproject/remapping": {
348 | +      "version": "2.3.0",
349 | +      "resolved": "https://registry.npmjs.org/@ampproject/remapping/-/remapping-2.3.0.tgz",
350 | +      "integrity": "sha512-30iZtAPgz+LTIYoeivqYo853f02jBYSd5uGnGpkFV0M3xOt9aN73erkgYAmZU43x4VfqcnLxW9Kpg3R5LC4YYw==",
351 | +      "dev": true,
352 | +      "license": "Apache-2.0",
353 | +      "dependencies": {
354 | +        "@jridgewell/gen-mapping": "^0.3.5",
355 | +        "@jridgewell/trace-mapping": "^0.3.24"
356 | +      },
357 | +      "engines": {
358 | +        "node": ">=6.0.0"
359 | +      }
360 | +    },
361 | +    "node_modules/@apideck/better-ajv-errors": {
362 | +      "version": "0.3.6",
363 | +      "resolved": "https://registry.npmjs.org/@apideck/better-ajv-errors/-/better-ajv-errors-0.3.6.tgz",
364 | +      "integrity": "sha512-P+ZygBLZtkp0qqOAJJVX4oX/sFo5JR3eBWwwuqHHhK0GIgQOKWrAfiAaWX0aArHkRWHMuggFEgAZNxVPwPZYaA==",
365 | +      "dev": true,
366 | +      "license": "MIT",
367 | +      "dependencies": {
368 | +        "json-schema": "^0.4.0",
369 | +        "jsonpointer": "^5.0.0",
370 | +        "leven": "^3.1.0"
371 | +      },
372 | +      "engines": {
373 | +        "node": ">=10"
374 | +      },
375 | +      "peerDependencies": {
376 | +        "ajv": ">=8"
377 | +      }
378 | +    },
379 | +    "node_modules/@babel/code-frame": {
380 | +      "version": "7.27.1",
381 | +      "resolved": "https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.27.1.tgz",
382 | +      "integrity": "sha512-cjQ7ZlQ0Mv3b47hABuTevyTuYN4i+loJKGeV9flcCgIK37cCXRh+L1bd3iBHlynerhQ7BhCkn2BPbQUL+rGqFg==",
383 | +      "dev": true,
384 | +      "license": "MIT",
385 | +      "dependencies": {
386 | +        "@babel/helper-validator-identifier": "^7.27.1",
387 | +        "js-tokens": "^4.0.0",
388 | +        "picocolors": "^1.1.1"
389 | +      },
390 | +      "engines": {
391 | +        "node": ">=6.9.0"
392 | +      }
393 | +    },
394 | +    "node_modules/@babel/compat-data": {
395 | +      "version": "7.28.0",
396 | +      "resolved": "https://registry.npmjs.org/@babel/compat-data/-/compat-data-7.28.0.tgz",
397 | +      "integrity": "sha512-60X7qkglvrap8mn1lh2ebxXdZYtUcpd7gsmy9kLaBJ4i/WdY8PqTSdxyA8qraikqKQK5C1KRBKXqznrVapyNaw==",
398 | +      "dev": true,
399 | +      "license": "MIT",
400 | +      "engines": {
401 | +        "node": ">=6.9.0"
402 | +      }
403 | +    },
404 | +    "node_modules/@babel/core": {
405 | +      "version": "7.28.3",
406 | +      "resolved": "https://registry.npmjs.org/@babel/core/-/core-7.28.3.tgz",
407 | +      "integrity": "sha512-yDBHV9kQNcr2/sUr9jghVyz9C3Y5G2zUM2H2lo+9mKv4sFgbA8s8Z9t8D1jiTkGoO/NoIfKMyKWr4s6CN23ZwQ==",
408 | +      "dev": true,
409 | +      "license": "MIT",
410 | +      "dependencies": {
411 | +        "@ampproject/remapping": "^2.2.0",
412 | +        "@babel/code-frame": "^7.27.1",
413 | +        "@babel/generator": "^7.28.3",
414 | +        "@babel/helper-compilation-targets": "^7.27.2",
415 | +        "@babel/helper-module-transforms": "^7.28.3",
416 | +        "@babel/helpers": "^7.28.3",
417 | +        "@babel/parser": "^7.28.3",
418 | +        "@babel/template": "^7.27.2",
419 | +        "@babel/traverse": "^7.28.3",
420 | +        "@babel/types": "^7.28.2",
421 | +        "convert-source-map": "^2.0.0",
422 | +        "debug": "^4.1.0",
423 | +        "gensync": "^1.0.0-beta.2",
424 | +        "json5": "^2.2.3",
425 | +        "semver": "^6.3.1"
426 | +      },
427 | +      "engines": {
428 | +        "node": ">=6.9.0"
429 | +      },
430 | +      "funding": {
431 | +        "type": "opencollective",
432 | +        "url": "https://opencollective.com/babel"
433 | +      }
434 | +    },
435 | +    "node_modules/@babel/core/node_modules/semver": {
436 | +      "version": "6.3.1",
437 | +      "resolved": "https://registry.npmjs.org/semver/-/semver-6.3.1.tgz",
438 | +      "integrity": "sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==",
439 | +      "dev": true,
440 | +      "license": "ISC",
441 | +      "bin": {
442 | +        "semver": "bin/semver.js"
443 | +      }
444 | +    },
445 | +    "node_modules/@babel/generator": {
446 | +      "version": "7.28.3",
447 | +      "resolved": "https://registry.npmjs.org/@babel/generator/-/generator-7.28.3.tgz",
448 | +      "integrity": "sha512-3lSpxGgvnmZznmBkCRnVREPUFJv2wrv9iAoFDvADJc0ypmdOxdUtcLeBgBJ6zE0PMeTKnxeQzyk0xTBq4Ep7zw==",
449 | +      "dev": true,
450 | +      "license": "MIT",
451 | +      "dependencies": {
452 | +        "@babel/parser": "^7.28.3",
453 | +        "@babel/types": "^7.28.2",
454 | +        "@jridgewell/gen-mapping": "^0.3.12",
455 | +        "@jridgewell/trace-mapping": "^0.3.28",
456 | +        "jsesc": "^3.0.2"
457 | +      },
458 | +      "engines": {
459 | +        "node": ">=6.9.0"
460 | +      }
461 | +    },
462 | +    "node_modules/@babel/helper-annotate-as-pure": {
463 | +      "version": "7.27.3",
464 | +      "resolved": "https://registry.npmjs.org/@babel/helper-annotate-as-pure/-/helper-annotate-as-pure-7.27.3.tgz",
465 | +      "integrity": "sha512-fXSwMQqitTGeHLBC08Eq5yXz2m37E4pJX1qAU1+2cNedz/ifv/bVXft90VeSav5nFO61EcNgwr0aJxbyPaWBPg==",
466 | +      "dev": true,
467 | +      "license": "MIT",
468 | +      "dependencies": {
469 | +        "@babel/types": "^7.27.3"
470 | +      },
471 | +      "engines": {
472 | +        "node": ">=6.9.0"
473 | +      }
474 | +    },
475 | +    "node_modules/@babel/helper-compilation-targets": {
476 | +      "version": "7.27.2",
477 | +      "resolved": "https://registry.npmjs.org/@babel/helper-compilation-targets/-/helper-compilation-targets-7.27.2.tgz",
478 | +      "integrity": "sha512-2+1thGUUWWjLTYTHZWK1n8Yga0ijBz1XAhUXcKy81rd5g6yh7hGqMp45v7cadSbEHc9G3OTv45SyneRN3ps4DQ==",
479 | +      "dev": true,
480 | +      "license": "MIT",
481 | +      "dependencies": {
482 | +        "@babel/compat-data": "^7.27.2",
483 | +        "@babel/helper-validator-option": "^7.27.1",
484 | +        "browserslist": "^4.24.0",
485 | +        "lru-cache": "^5.1.1",
486 | +        "semver": "^6.3.1"
487 | +      },
488 | +      "engines": {
489 | +        "node": ">=6.9.0"
490 | +      }
491 | +    },
492 | +    "node_modules/@babel/helper-compilation-targets/node_modules/semver": {
493 | +      "version": "6.3.1",
494 | +      "resolved": "https://registry.npmjs.org/semver/-/semver-6.3.1.tgz",
495 | +      "integrity": "sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==",
496 | +      "dev": true,
497 | +      "license": "ISC",
498 | +      "bin": {
499 | +        "semver": "bin/semver.js"
500 | +      }
501 | +    },
502 | +    "node_modules/@babel/helper-create-class-features-plugin": {
503 | +      "version": "7.28.3",
504 | +      "resolved": "https://registry.npmjs.org/@babel/helper-create-class-features-plugin/-/helper-create-class-features-plugin-7.28.3.tgz",
505 | +      "integrity": "sha512-V9f6ZFIYSLNEbuGA/92uOvYsGCJNsuA8ESZ4ldc09bWk/j8H8TKiPw8Mk1eG6olpnO0ALHJmYfZvF4MEE4gajg==",
506 | +      "dev": true,
507 | +      "license": "MIT",
508 | +      "dependencies": {
509 | +        "@babel/helper-annotate-as-pure": "^7.27.3",
510 | +        "@babel/helper-member-expression-to-functions": "^7.27.1",
511 | +        "@babel/helper-optimise-call-expression": "^7.27.1",
512 | +        "@babel/helper-replace-supers": "^7.27.1",
513 | +        "@babel/helper-skip-transparent-expression-wrappers": "^7.27.1",
514 | +        "@babel/traverse": "^7.28.3",
515 | +        "semver": "^6.3.1"
516 | +      },
517 | +      "engines": {
518 | +        "node": ">=6.9.0"
519 | +      },
520 | +      "peerDependencies": {
521 | +        "@babel/core": "^7.0.0"
522 | +      }
523 | +    },
524 | +    "node_modules/@babel/helper-create-class-features-plugin/node_modules/semver": {
525 | +      "version": "6.3.1",
526 | +      "resolved": "https://registry.npmjs.org/semver/-/semver-6.3.1.tgz",
527 | +      "integrity": "sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==",
528 | +      "dev": true,
529 | +      "license": "ISC",
530 | +      "bin": {
531 | +        "semver": "bin/semver.js"
532 | +      }
533 | +    },
534 | +    "node_modules/@babel/helper-create-regexp-features-plugin": {
535 | +      "version": "7.27.1",
536 | +      "resolved": "https://registry.npmjs.org/@babel/helper-create-regexp-features-plugin/-/helper-create-regexp-features-plugin-7.27.1.tgz",
537 | +      "integrity": "sha512-uVDC72XVf8UbrH5qQTc18Agb8emwjTiZrQE11Nv3CuBEZmVvTwwE9CBUEvHku06gQCAyYf8Nv6ja1IN+6LMbxQ==",
538 | +      "dev": true,
539 | +      "license": "MIT",
540 | +      "dependencies": {
541 | +        "@babel/helper-annotate-as-pure": "^7.27.1",
542 | +        "regexpu-core": "^6.2.0",
543 | +        "semver": "^6.3.1"
544 | +      },
545 | +      "engines": {
546 | +        "node": ">=6.9.0"
547 | +      },
548 | +      "peerDependencies": {
549 | +        "@babel/core": "^7.0.0"
550 | +      }
551 | +    },
552 | +    "node_modules/@babel/helper-create-regexp-features-plugin/node_modules/semver": {
553 | +      "version": "6.3.1",
554 | +      "resolved": "https://registry.npmjs.org/semver/-/semver-6.3.1.tgz",
555 | +      "integrity": "sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==",
556 | +      "dev": true,
557 | +      "license": "ISC",
558 | +      "bin": {
559 | +        "semver": "bin/semver.js"
560 | +      }
561 | +    },
562 | +    "node_modules/@babel/helper-define-polyfill-provider": {
563 | +      "version": "0.6.5",
564 | +      "resolved": "https://registry.npmjs.org/@babel/helper-define-polyfill-provider/-/helper-define-polyfill-provider-0.6.5.tgz",
565 | +      "integrity": "sha512-uJnGFcPsWQK8fvjgGP5LZUZZsYGIoPeRjSF5PGwrelYgq7Q15/Ft9NGFp1zglwgIv//W0uG4BevRuSJRyylZPg==",
566 | +      "dev": true,
567 | +      "license": "MIT",
568 | +      "dependencies": {
569 | +        "@babel/helper-compilation-targets": "^7.27.2",
570 | +        "@babel/helper-plugin-utils": "^7.27.1",
571 | +        "debug": "^4.4.1",
572 | +        "lodash.debounce": "^4.0.8",
573 | +        "resolve": "^1.22.10"
574 | +      },
575 | +      "peerDependencies": {
576 | +        "@babel/core": "^7.4.0 || ^8.0.0-0 <8.0.0"
577 | +      }
578 | +    },
579 | +    "node_modules/@babel/helper-globals": {
580 | +      "version": "7.28.0",
581 | +      "resolved": "https://registry.npmjs.org/@babel/helper-globals/-/helper-globals-7.28.0.tgz",
582 | +      "integrity": "sha512-+W6cISkXFa1jXsDEdYA8HeevQT/FULhxzR99pxphltZcVaugps53THCeiWA8SguxxpSp3gKPiuYfSWopkLQ4hw==",
583 | +      "dev": true,
584 | +      "license": "MIT",
585 | +      "engines": {
586 | +        "node": ">=6.9.0"
587 | +      }
588 | +    },
589 | +    "node_modules/@babel/helper-member-expression-to-functions": {
590 | +      "version": "7.27.1",
591 | +      "resolved": "https://registry.npmjs.org/@babel/helper-member-expression-to-functions/-/helper-member-expression-to-functions-7.27.1.tgz",
592 | +      "integrity": "sha512-E5chM8eWjTp/aNoVpcbfM7mLxu9XGLWYise2eBKGQomAk/Mb4XoxyqXTZbuTohbsl8EKqdlMhnDI2CCLfcs9wA==",
593 | +      "dev": true,
594 | +      "license": "MIT",
595 | +      "dependencies": {
596 | +        "@babel/traverse": "^7.27.1",
597 | +        "@babel/types": "^7.27.1"
598 | +      },
599 | +      "engines": {
600 | +        "node": ">=6.9.0"
601 | +      }
602 | +    },
603 | +    "node_modules/@babel/helper-module-imports": {
604 | +      "version": "7.27.1",
605 | +      "resolved": "https://registry.npmjs.org/@babel/helper-module-imports/-/helper-module-imports-7.27.1.tgz",
606 | +      "integrity": "sha512-0gSFWUPNXNopqtIPQvlD5WgXYI5GY2kP2cCvoT8kczjbfcfuIljTbcWrulD1CIPIX2gt1wghbDy08yE1p+/r3w==",
607 | +      "dev": true,
608 | +      "license": "MIT",
609 | +      "dependencies": {
610 | +        "@babel/traverse": "^7.27.1",
611 | +        "@babel/types": "^7.27.1"
612 | +      },
613 | +      "engines": {
614 | +        "node": ">=6.9.0"
615 | +      }
616 | +    },
617 | +    "node_modules/@babel/helper-module-transforms": {
618 | +      "version": "7.28.3",
619 | +      "resolved": "https://registry.npmjs.org/@babel/helper-module-transforms/-/helper-module-transforms-7.28.3.tgz",
620 | +      "integrity": "sha512-gytXUbs8k2sXS9PnQptz5o0QnpLL51SwASIORY6XaBKF88nsOT0Zw9szLqlSGQDP/4TljBAD5y98p2U1fqkdsw==",
621 | +      "dev": true,
622 | +      "license": "MIT",
623 | +      "dependencies": {
624 | +        "@babel/helper-module-imports": "^7.27.1",
625 | +        "@babel/helper-validator-identifier": "^7.27.1",
626 | +        "@babel/traverse": "^7.28.3"
627 | +      },
628 | +      "engines": {
629 | +        "node": ">=6.9.0"
630 | +      },
631 | +      "peerDependencies": {
632 | +        "@babel/core": "^7.0.0"
633 | +      }
634 | +    },
635 | +    "node_modules/@babel/helper-optimise-call-expression": {
636 | +      "version": "7.27.1",
637 | +      "resolved": "https://registry.npmjs.org/@babel/helper-optimise-call-expression/-/helper-optimise-call-expression-7.27.1.tgz",
638 | +      "integrity": "sha512-URMGH08NzYFhubNSGJrpUEphGKQwMQYBySzat5cAByY1/YgIRkULnIy3tAMeszlL/so2HbeilYloUmSpd7GdVw==",
639 | +      "dev": true,
640 | +      "license": "MIT",
641 | +      "dependencies": {
642 | +        "@babel/types": "^7.27.1"
643 | +      },
644 | +      "engines": {
645 | +        "node": ">=6.9.0"
646 | +      }
647 | +    },
648 | +    "node_modules/@babel/helper-plugin-utils": {
649 | +      "version": "7.27.1",
650 | +      "resolved": "https://registry.npmjs.org/@babel/helper-plugin-utils/-/helper-plugin-utils-7.27.1.tgz",
651 | +      "integrity": "sha512-1gn1Up5YXka3YYAHGKpbideQ5Yjf1tDa9qYcgysz+cNCXukyLl6DjPXhD3VRwSb8c0J9tA4b2+rHEZtc6R0tlw==",
652 | +      "dev": true,
653 | +      "license": "MIT",
654 | +      "engines": {
655 | +        "node": ">=6.9.0"
656 | +      }
657 | +    },
658 | +    "node_modules/@babel/helper-remap-async-to-generator": {
659 | +      "version": "7.27.1",
660 | +      "resolved": "https://registry.npmjs.org/@babel/helper-remap-async-to-generator/-/helper-remap-async-to-generator-7.27.1.tgz",
661 | +      "integrity": "sha512-7fiA521aVw8lSPeI4ZOD3vRFkoqkJcS+z4hFo82bFSH/2tNd6eJ5qCVMS5OzDmZh/kaHQeBaeyxK6wljcPtveA==",
662 | +      "dev": true,
663 | +      "license": "MIT",
664 | +      "dependencies": {
665 | +        "@babel/helper-annotate-as-pure": "^7.27.1",
666 | +        "@babel/helper-wrap-function": "^7.27.1",
667 | +        "@babel/traverse": "^7.27.1"
668 | +      },
669 | +      "engines": {
670 | +        "node": ">=6.9.0"
671 | +      },
672 | +      "peerDependencies": {
673 | +        "@babel/core": "^7.0.0"
674 | +      }
675 | +    },
676 | +    "node_modules/@babel/helper-replace-supers": {
677 | +      "version": "7.27.1",
678 | +      "resolved": "https://registry.npmjs.org/@babel/helper-replace-supers/-/helper-replace-supers-7.27.1.tgz",
679 | +      "integrity": "sha512-7EHz6qDZc8RYS5ElPoShMheWvEgERonFCs7IAonWLLUTXW59DP14bCZt89/GKyreYn8g3S83m21FelHKbeDCKA==",
680 | +      "dev": true,
681 | +      "license": "MIT",
682 | +      "dependencies": {
683 | +        "@babel/helper-member-expression-to-functions": "^7.27.1",
684 | +        "@babel/helper-optimise-call-expression": "^7.27.1",
685 | +        "@babel/traverse": "^7.27.1"
686 | +      },
687 | +      "engines": {
688 | +        "node": ">=6.9.0"
689 | +      },
690 | +      "peerDependencies": {
691 | +        "@babel/core": "^7.0.0"
692 | +      }
693 | +    },
694 | +    "node_modules/@babel/helper-skip-transparent-expression-wrappers": {
695 | +      "version": "7.27.1",
696 | +      "resolved": "https://registry.npmjs.org/@babel/helper-skip-transparent-expression-wrappers/-/helper-skip-transparent-expression-wrappers-7.27.1.tgz",
697 | +      "integrity": "sha512-Tub4ZKEXqbPjXgWLl2+3JpQAYBJ8+ikpQ2Ocj/q/r0LwE3UhENh7EUabyHjz2kCEsrRY83ew2DQdHluuiDQFzg==",
698 | +      "dev": true,
699 | +      "license": "MIT",
700 | +      "dependencies": {
701 | +        "@babel/traverse": "^7.27.1",
702 | +        "@babel/types": "^7.27.1"
703 | +      },
704 | +      "engines": {
705 | +        "node": ">=6.9.0"
706 | +      }
707 | +    },
708 | +    "node_modules/@babel/helper-string-parser": {
709 | +      "version": "7.27.1",
710 | +      "resolved": "https://registry.npmjs.org/@babel/helper-string-parser/-/helper-string-parser-7.27.1.tgz",
711 | +      "integrity": "sha512-qMlSxKbpRlAridDExk92nSobyDdpPijUq2DW6oDnUqd0iOGxmQjyqhMIihI9+zv4LPyZdRje2cavWPbCbWm3eA==",
712 | +      "dev": true,
713 | +      "license": "MIT",
714 | +      "engines": {
715 | +        "node": ">=6.9.0"
716 | +      }
717 | +    },
718 | +    "node_modules/@babel/helper-validator-identifier": {
719 | +      "version": "7.27.1",
720 | +      "resolved": "https://registry.npmjs.org/@babel/helper-validator-identifier/-/helper-validator-identifier-7.27.1.tgz",
721 | +      "integrity": "sha512-D2hP9eA+Sqx1kBZgzxZh0y1trbuU+JoDkiEwqhQ36nodYqJwyEIhPSdMNd7lOm/4io72luTPWH20Yda0xOuUow==",
722 | +      "dev": true,
723 | +      "license": "MIT",
724 | +      "engines": {
725 | +        "node": ">=6.9.0"
726 | +      }
727 | +    },
728 | +    "node_modules/@babel/helper-validator-option": {
729 | +      "version": "7.27.1",
730 | +      "resolved": "https://registry.npmjs.org/@babel/helper-validator-option/-/helper-validator-option-7.27.1.tgz",
731 | +      "integrity": "sha512-YvjJow9FxbhFFKDSuFnVCe2WxXk1zWc22fFePVNEaWJEu8IrZVlda6N0uHwzZrUM1il7NC9Mlp4MaJYbYd9JSg==",
732 | +      "dev": true,
733 | +      "license": "MIT",
734 | +      "engines": {
735 | +        "node": ">=6.9.0"
736 | +      }
737 | +    },
738 | +    "node_modules/@babel/helper-wrap-function": {
739 | +      "version": "7.28.3",
740 | +      "resolved": "https://registry.npmjs.org/@babel/helper-wrap-function/-/helper-wrap-function-7.28.3.tgz",
741 | +      "integrity": "sha512-zdf983tNfLZFletc0RRXYrHrucBEg95NIFMkn6K9dbeMYnsgHaSBGcQqdsCSStG2PYwRre0Qc2NNSCXbG+xc6g==",
742 | +      "dev": true,
743 | +      "license": "MIT",
744 | +      "dependencies": {
745 | +        "@babel/template": "^7.27.2",
746 | +        "@babel/traverse": "^7.28.3",
747 | +        "@babel/types": "^7.28.2"
748 | +      },
749 | +      "engines": {
750 | +        "node": ">=6.9.0"
751 | +      }
752 | +    },
753 | +    "node_modules/@babel/helpers": {
754 | +      "version": "7.28.3",
755 | +      "resolved": "https://registry.npmjs.org/@babel/helpers/-/helpers-7.28.3.tgz",
756 | +      "integrity": "sha512-PTNtvUQihsAsDHMOP5pfobP8C6CM4JWXmP8DrEIt46c3r2bf87Ua1zoqevsMo9g+tWDwgWrFP5EIxuBx5RudAw==",
757 | +      "dev": true,
758 | +      "license": "MIT",
759 | +      "dependencies": {
760 | +        "@babel/template": "^7.27.2",
761 | +        "@babel/types": "^7.28.2"
762 | +      },
763 | +      "engines": {
764 | +        "node": ">=6.9.0"
765 | +      }
766 | +    },
767 | +    "node_modules/@babel/parser": {
768 | +      "version": "7.28.3",
769 | +      "resolved": "https://registry.npmjs.org/@babel/parser/-/parser-7.28.3.tgz",
770 | +      "integrity": "sha512-7+Ey1mAgYqFAx2h0RuoxcQT5+MlG3GTV0TQrgr7/ZliKsm/MNDxVVutlWaziMq7wJNAz8MTqz55XLpWvva6StA==",
771 | +      "dev": true,
772 | +      "license": "MIT",
773 | +      "dependencies": {
774 | +        "@babel/types": "^7.28.2"
775 | +      },
776 | +      "bin": {
777 | +        "parser": "bin/babel-parser.js"
778 | +      },
779 | +      "engines": {
780 | +        "node": ">=6.0.0"
781 | +      }
782 | +    },
783 | +    "node_modules/@babel/plugin-bugfix-firefox-class-in-computed-class-key": {
784 | +      "version": "7.27.1",
785 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-bugfix-firefox-class-in-computed-class-key/-/plugin-bugfix-firefox-class-in-computed-class-key-7.27.1.tgz",
786 | +      "integrity": "sha512-QPG3C9cCVRQLxAVwmefEmwdTanECuUBMQZ/ym5kiw3XKCGA7qkuQLcjWWHcrD/GKbn/WmJwaezfuuAOcyKlRPA==",
787 | +      "dev": true,
788 | +      "license": "MIT",
789 | +      "dependencies": {
790 | +        "@babel/helper-plugin-utils": "^7.27.1",
791 | +        "@babel/traverse": "^7.27.1"
792 | +      },
793 | +      "engines": {
794 | +        "node": ">=6.9.0"
795 | +      },
796 | +      "peerDependencies": {
797 | +        "@babel/core": "^7.0.0"
798 | +      }
799 | +    },
800 | +    "node_modules/@babel/plugin-bugfix-safari-class-field-initializer-scope": {
801 | +      "version": "7.27.1",
802 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-bugfix-safari-class-field-initializer-scope/-/plugin-bugfix-safari-class-field-initializer-scope-7.27.1.tgz",
803 | +      "integrity": "sha512-qNeq3bCKnGgLkEXUuFry6dPlGfCdQNZbn7yUAPCInwAJHMU7THJfrBSozkcWq5sNM6RcF3S8XyQL2A52KNR9IA==",
804 | +      "dev": true,
805 | +      "license": "MIT",
806 | +      "dependencies": {
807 | +        "@babel/helper-plugin-utils": "^7.27.1"
808 | +      },
809 | +      "engines": {
810 | +        "node": ">=6.9.0"
811 | +      },
812 | +      "peerDependencies": {
813 | +        "@babel/core": "^7.0.0"
814 | +      }
815 | +    },
816 | +    "node_modules/@babel/plugin-bugfix-safari-id-destructuring-collision-in-function-expression": {
817 | +      "version": "7.27.1",
818 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-bugfix-safari-id-destructuring-collision-in-function-expression/-/plugin-bugfix-safari-id-destructuring-collision-in-function-expression-7.27.1.tgz",
819 | +      "integrity": "sha512-g4L7OYun04N1WyqMNjldFwlfPCLVkgB54A/YCXICZYBsvJJE3kByKv9c9+R/nAfmIfjl2rKYLNyMHboYbZaWaA==",
820 | +      "dev": true,
821 | +      "license": "MIT",
822 | +      "dependencies": {
823 | +        "@babel/helper-plugin-utils": "^7.27.1"
824 | +      },
825 | +      "engines": {
826 | +        "node": ">=6.9.0"
827 | +      },
828 | +      "peerDependencies": {
829 | +        "@babel/core": "^7.0.0"
830 | +      }
831 | +    },
832 | +    "node_modules/@babel/plugin-bugfix-v8-spread-parameters-in-optional-chaining": {
833 | +      "version": "7.27.1",
834 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-bugfix-v8-spread-parameters-in-optional-chaining/-/plugin-bugfix-v8-spread-parameters-in-optional-chaining-7.27.1.tgz",
835 | +      "integrity": "sha512-oO02gcONcD5O1iTLi/6frMJBIwWEHceWGSGqrpCmEL8nogiS6J9PBlE48CaK20/Jx1LuRml9aDftLgdjXT8+Cw==",
836 | +      "dev": true,
837 | +      "license": "MIT",
838 | +      "dependencies": {
839 | +        "@babel/helper-plugin-utils": "^7.27.1",
840 | +        "@babel/helper-skip-transparent-expression-wrappers": "^7.27.1",
841 | +        "@babel/plugin-transform-optional-chaining": "^7.27.1"
842 | +      },
843 | +      "engines": {
844 | +        "node": ">=6.9.0"
845 | +      },
846 | +      "peerDependencies": {
847 | +        "@babel/core": "^7.13.0"
848 | +      }
849 | +    },
850 | +    "node_modules/@babel/plugin-bugfix-v8-static-class-fields-redefine-readonly": {
851 | +      "version": "7.28.3",
852 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-bugfix-v8-static-class-fields-redefine-readonly/-/plugin-bugfix-v8-static-class-fields-redefine-readonly-7.28.3.tgz",
853 | +      "integrity": "sha512-b6YTX108evsvE4YgWyQ921ZAFFQm3Bn+CA3+ZXlNVnPhx+UfsVURoPjfGAPCjBgrqo30yX/C2nZGX96DxvR9Iw==",
854 | +      "dev": true,
855 | +      "license": "MIT",
856 | +      "dependencies": {
857 | +        "@babel/helper-plugin-utils": "^7.27.1",
858 | +        "@babel/traverse": "^7.28.3"
859 | +      },
860 | +      "engines": {
861 | +        "node": ">=6.9.0"
862 | +      },
863 | +      "peerDependencies": {
864 | +        "@babel/core": "^7.0.0"
865 | +      }
866 | +    },
867 | +    "node_modules/@babel/plugin-proposal-private-property-in-object": {
868 | +      "version": "7.21.0-placeholder-for-preset-env.2",
869 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-proposal-private-property-in-object/-/plugin-proposal-private-property-in-object-7.21.0-placeholder-for-preset-env.2.tgz",
870 | +      "integrity": "sha512-SOSkfJDddaM7mak6cPEpswyTRnuRltl429hMraQEglW+OkovnCzsiszTmsrlY//qLFjCpQDFRvjdm2wA5pPm9w==",
871 | +      "dev": true,
872 | +      "license": "MIT",
873 | +      "engines": {
874 | +        "node": ">=6.9.0"
875 | +      },
876 | +      "peerDependencies": {
877 | +        "@babel/core": "^7.0.0-0"
878 | +      }
879 | +    },
880 | +    "node_modules/@babel/plugin-syntax-import-assertions": {
881 | +      "version": "7.27.1",
882 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-import-assertions/-/plugin-syntax-import-assertions-7.27.1.tgz",
883 | +      "integrity": "sha512-UT/Jrhw57xg4ILHLFnzFpPDlMbcdEicaAtjPQpbj9wa8T4r5KVWCimHcL/460g8Ht0DMxDyjsLgiWSkVjnwPFg==",
884 | +      "dev": true,
885 | +      "license": "MIT",
886 | +      "dependencies": {
887 | +        "@babel/helper-plugin-utils": "^7.27.1"
888 | +      },
889 | +      "engines": {
890 | +        "node": ">=6.9.0"
891 | +      },
892 | +      "peerDependencies": {
893 | +        "@babel/core": "^7.0.0-0"
894 | +      }
895 | +    },
896 | +    "node_modules/@babel/plugin-syntax-import-attributes": {
897 | +      "version": "7.27.1",
898 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-import-attributes/-/plugin-syntax-import-attributes-7.27.1.tgz",
899 | +      "integrity": "sha512-oFT0FrKHgF53f4vOsZGi2Hh3I35PfSmVs4IBFLFj4dnafP+hIWDLg3VyKmUHfLoLHlyxY4C7DGtmHuJgn+IGww==",
900 | +      "dev": true,
901 | +      "license": "MIT",
902 | +      "dependencies": {
903 | +        "@babel/helper-plugin-utils": "^7.27.1"
904 | +      },
905 | +      "engines": {
906 | +        "node": ">=6.9.0"
907 | +      },
908 | +      "peerDependencies": {
909 | +        "@babel/core": "^7.0.0-0"
910 | +      }
911 | +    },
912 | +    "node_modules/@babel/plugin-syntax-unicode-sets-regex": {
913 | +      "version": "7.18.6",
914 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-unicode-sets-regex/-/plugin-syntax-unicode-sets-regex-7.18.6.tgz",
915 | +      "integrity": "sha512-727YkEAPwSIQTv5im8QHz3upqp92JTWhidIC81Tdx4VJYIte/VndKf1qKrfnnhPLiPghStWfvC/iFaMCQu7Nqg==",
916 | +      "dev": true,
917 | +      "license": "MIT",
918 | +      "dependencies": {
919 | +        "@babel/helper-create-regexp-features-plugin": "^7.18.6",
920 | +        "@babel/helper-plugin-utils": "^7.18.6"
921 | +      },
922 | +      "engines": {
923 | +        "node": ">=6.9.0"
924 | +      },
925 | +      "peerDependencies": {
926 | +        "@babel/core": "^7.0.0"
927 | +      }
928 | +    },
929 | +    "node_modules/@babel/plugin-transform-arrow-functions": {
930 | +      "version": "7.27.1",
931 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-arrow-functions/-/plugin-transform-arrow-functions-7.27.1.tgz",
932 | +      "integrity": "sha512-8Z4TGic6xW70FKThA5HYEKKyBpOOsucTOD1DjU3fZxDg+K3zBJcXMFnt/4yQiZnf5+MiOMSXQ9PaEK/Ilh1DeA==",
933 | +      "dev": true,
934 | +      "license": "MIT",
935 | +      "dependencies": {
936 | +        "@babel/helper-plugin-utils": "^7.27.1"
937 | +      },
938 | +      "engines": {
939 | +        "node": ">=6.9.0"
940 | +      },
941 | +      "peerDependencies": {
942 | +        "@babel/core": "^7.0.0-0"
943 | +      }
944 | +    },
945 | +    "node_modules/@babel/plugin-transform-async-generator-functions": {
946 | +      "version": "7.28.0",
947 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-async-generator-functions/-/plugin-transform-async-generator-functions-7.28.0.tgz",
948 | +      "integrity": "sha512-BEOdvX4+M765icNPZeidyADIvQ1m1gmunXufXxvRESy/jNNyfovIqUyE7MVgGBjWktCoJlzvFA1To2O4ymIO3Q==",
949 | +      "dev": true,
950 | +      "license": "MIT",
951 | +      "dependencies": {
952 | +        "@babel/helper-plugin-utils": "^7.27.1",
953 | +        "@babel/helper-remap-async-to-generator": "^7.27.1",
954 | +        "@babel/traverse": "^7.28.0"
955 | +      },
956 | +      "engines": {
957 | +        "node": ">=6.9.0"
958 | +      },
959 | +      "peerDependencies": {
960 | +        "@babel/core": "^7.0.0-0"
961 | +      }
962 | +    },
963 | +    "node_modules/@babel/plugin-transform-async-to-generator": {
964 | +      "version": "7.27.1",
965 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-async-to-generator/-/plugin-transform-async-to-generator-7.27.1.tgz",
966 | +      "integrity": "sha512-NREkZsZVJS4xmTr8qzE5y8AfIPqsdQfRuUiLRTEzb7Qii8iFWCyDKaUV2c0rCuh4ljDZ98ALHP/PetiBV2nddA==",
967 | +      "dev": true,
968 | +      "license": "MIT",
969 | +      "dependencies": {
970 | +        "@babel/helper-module-imports": "^7.27.1",
971 | +        "@babel/helper-plugin-utils": "^7.27.1",
972 | +        "@babel/helper-remap-async-to-generator": "^7.27.1"
973 | +      },
974 | +      "engines": {
975 | +        "node": ">=6.9.0"
976 | +      },
977 | +      "peerDependencies": {
978 | +        "@babel/core": "^7.0.0-0"
979 | +      }
980 | +    },
981 | +    "node_modules/@babel/plugin-transform-block-scoped-functions": {
982 | +      "version": "7.27.1",
983 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-block-scoped-functions/-/plugin-transform-block-scoped-functions-7.27.1.tgz",
984 | +      "integrity": "sha512-cnqkuOtZLapWYZUYM5rVIdv1nXYuFVIltZ6ZJ7nIj585QsjKM5dhL2Fu/lICXZ1OyIAFc7Qy+bvDAtTXqGrlhg==",
985 | +      "dev": true,
986 | +      "license": "MIT",
987 | +      "dependencies": {
988 | +        "@babel/helper-plugin-utils": "^7.27.1"
989 | +      },
990 | +      "engines": {
991 | +        "node": ">=6.9.0"
992 | +      },
993 | +      "peerDependencies": {
994 | +        "@babel/core": "^7.0.0-0"
995 | +      }
996 | +    },
997 | +    "node_modules/@babel/plugin-transform-block-scoping": {
998 | +      "version": "7.28.0",
999 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-block-scoping/-/plugin-transform-block-scoping-7.28.0.tgz",
1000 | +      "integrity": "sha512-gKKnwjpdx5sER/wl0WN0efUBFzF/56YZO0RJrSYP4CljXnP31ByY7fol89AzomdlLNzI36AvOTmYHsnZTCkq8Q==",
1001 | +      "dev": true,
1002 | +      "license": "MIT",
1003 | +      "dependencies": {
1004 | +        "@babel/helper-plugin-utils": "^7.27.1"
1005 | +      },
1006 | +      "engines": {
1007 | +        "node": ">=6.9.0"
1008 | +      },
1009 | +      "peerDependencies": {
1010 | +        "@babel/core": "^7.0.0-0"
1011 | +      }
1012 | +    },
1013 | +    "node_modules/@babel/plugin-transform-class-properties": {
1014 | +      "version": "7.27.1",
1015 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-class-properties/-/plugin-transform-class-properties-7.27.1.tgz",
1016 | +      "integrity": "sha512-D0VcalChDMtuRvJIu3U/fwWjf8ZMykz5iZsg77Nuj821vCKI3zCyRLwRdWbsuJ/uRwZhZ002QtCqIkwC/ZkvbA==",
1017 | +      "dev": true,
1018 | +      "license": "MIT",
1019 | +      "dependencies": {
1020 | +        "@babel/helper-create-class-features-plugin": "^7.27.1",
1021 | +        "@babel/helper-plugin-utils": "^7.27.1"
1022 | +      },
1023 | +      "engines": {
1024 | +        "node": ">=6.9.0"
1025 | +      },
1026 | +      "peerDependencies": {
1027 | +        "@babel/core": "^7.0.0-0"
1028 | +      }
1029 | +    },
1030 | +    "node_modules/@babel/plugin-transform-class-static-block": {
1031 | +      "version": "7.28.3",
1032 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-class-static-block/-/plugin-transform-class-static-block-7.28.3.tgz",
1033 | +      "integrity": "sha512-LtPXlBbRoc4Njl/oh1CeD/3jC+atytbnf/UqLoqTDcEYGUPj022+rvfkbDYieUrSj3CaV4yHDByPE+T2HwfsJg==",
1034 | +      "dev": true,
1035 | +      "license": "MIT",
1036 | +      "dependencies": {
1037 | +        "@babel/helper-create-class-features-plugin": "^7.28.3",
1038 | +        "@babel/helper-plugin-utils": "^7.27.1"
1039 | +      },
1040 | +      "engines": {
1041 | +        "node": ">=6.9.0"
1042 | +      },
1043 | +      "peerDependencies": {
1044 | +        "@babel/core": "^7.12.0"
1045 | +      }
1046 | +    },
1047 | +    "node_modules/@babel/plugin-transform-classes": {
1048 | +      "version": "7.28.3",
1049 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-classes/-/plugin-transform-classes-7.28.3.tgz",
1050 | +      "integrity": "sha512-DoEWC5SuxuARF2KdKmGUq3ghfPMO6ZzR12Dnp5gubwbeWJo4dbNWXJPVlwvh4Zlq6Z7YVvL8VFxeSOJgjsx4Sg==",
1051 | +      "dev": true,
1052 | +      "license": "MIT",
1053 | +      "dependencies": {
1054 | +        "@babel/helper-annotate-as-pure": "^7.27.3",
1055 | +        "@babel/helper-compilation-targets": "^7.27.2",
1056 | +        "@babel/helper-globals": "^7.28.0",
1057 | +        "@babel/helper-plugin-utils": "^7.27.1",
1058 | +        "@babel/helper-replace-supers": "^7.27.1",
1059 | +        "@babel/traverse": "^7.28.3"
1060 | +      },
1061 | +      "engines": {
1062 | +        "node": ">=6.9.0"
1063 | +      },
1064 | +      "peerDependencies": {
1065 | +        "@babel/core": "^7.0.0-0"
1066 | +      }
1067 | +    },
1068 | +    "node_modules/@babel/plugin-transform-computed-properties": {
1069 | +      "version": "7.27.1",
1070 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-computed-properties/-/plugin-transform-computed-properties-7.27.1.tgz",
1071 | +      "integrity": "sha512-lj9PGWvMTVksbWiDT2tW68zGS/cyo4AkZ/QTp0sQT0mjPopCmrSkzxeXkznjqBxzDI6TclZhOJbBmbBLjuOZUw==",
1072 | +      "dev": true,
1073 | +      "license": "MIT",
1074 | +      "dependencies": {
1075 | +        "@babel/helper-plugin-utils": "^7.27.1",
1076 | +        "@babel/template": "^7.27.1"
1077 | +      },
1078 | +      "engines": {
1079 | +        "node": ">=6.9.0"
1080 | +      },
1081 | +      "peerDependencies": {
1082 | +        "@babel/core": "^7.0.0-0"
1083 | +      }
1084 | +    },
1085 | +    "node_modules/@babel/plugin-transform-destructuring": {
1086 | +      "version": "7.28.0",
1087 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-destructuring/-/plugin-transform-destructuring-7.28.0.tgz",
1088 | +      "integrity": "sha512-v1nrSMBiKcodhsyJ4Gf+Z0U/yawmJDBOTpEB3mcQY52r9RIyPneGyAS/yM6seP/8I+mWI3elOMtT5dB8GJVs+A==",
1089 | +      "dev": true,
1090 | +      "license": "MIT",
1091 | +      "dependencies": {
1092 | +        "@babel/helper-plugin-utils": "^7.27.1",
1093 | +        "@babel/traverse": "^7.28.0"
1094 | +      },
1095 | +      "engines": {
1096 | +        "node": ">=6.9.0"
1097 | +      },
1098 | +      "peerDependencies": {
1099 | +        "@babel/core": "^7.0.0-0"
1100 | +      }
1101 | +    },
1102 | +    "node_modules/@babel/plugin-transform-dotall-regex": {
1103 | +      "version": "7.27.1",
1104 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-dotall-regex/-/plugin-transform-dotall-regex-7.27.1.tgz",
1105 | +      "integrity": "sha512-gEbkDVGRvjj7+T1ivxrfgygpT7GUd4vmODtYpbs0gZATdkX8/iSnOtZSxiZnsgm1YjTgjI6VKBGSJJevkrclzw==",
1106 | +      "dev": true,
1107 | +      "license": "MIT",
1108 | +      "dependencies": {
1109 | +        "@babel/helper-create-regexp-features-plugin": "^7.27.1",
1110 | +        "@babel/helper-plugin-utils": "^7.27.1"
1111 | +      },
1112 | +      "engines": {
1113 | +        "node": ">=6.9.0"
1114 | +      },
1115 | +      "peerDependencies": {
1116 | +        "@babel/core": "^7.0.0-0"
1117 | +      }
1118 | +    },
1119 | +    "node_modules/@babel/plugin-transform-duplicate-keys": {
1120 | +      "version": "7.27.1",
1121 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-duplicate-keys/-/plugin-transform-duplicate-keys-7.27.1.tgz",
1122 | +      "integrity": "sha512-MTyJk98sHvSs+cvZ4nOauwTTG1JeonDjSGvGGUNHreGQns+Mpt6WX/dVzWBHgg+dYZhkC4X+zTDfkTU+Vy9y7Q==",
1123 | +      "dev": true,
1124 | +      "license": "MIT",
1125 | +      "dependencies": {
1126 | +        "@babel/helper-plugin-utils": "^7.27.1"
1127 | +      },
1128 | +      "engines": {
1129 | +        "node": ">=6.9.0"
1130 | +      },
1131 | +      "peerDependencies": {
1132 | +        "@babel/core": "^7.0.0-0"
1133 | +      }
1134 | +    },
1135 | +    "node_modules/@babel/plugin-transform-duplicate-named-capturing-groups-regex": {
1136 | +      "version": "7.27.1",
1137 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-duplicate-named-capturing-groups-regex/-/plugin-transform-duplicate-named-capturing-groups-regex-7.27.1.tgz",
1138 | +      "integrity": "sha512-hkGcueTEzuhB30B3eJCbCYeCaaEQOmQR0AdvzpD4LoN0GXMWzzGSuRrxR2xTnCrvNbVwK9N6/jQ92GSLfiZWoQ==",
1139 | +      "dev": true,
1140 | +      "license": "MIT",
1141 | +      "dependencies": {
1142 | +        "@babel/helper-create-regexp-features-plugin": "^7.27.1",
1143 | +        "@babel/helper-plugin-utils": "^7.27.1"
1144 | +      },
1145 | +      "engines": {
1146 | +        "node": ">=6.9.0"
1147 | +      },
1148 | +      "peerDependencies": {
1149 | +        "@babel/core": "^7.0.0"
1150 | +      }
1151 | +    },
1152 | +    "node_modules/@babel/plugin-transform-dynamic-import": {
1153 | +      "version": "7.27.1",
1154 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-dynamic-import/-/plugin-transform-dynamic-import-7.27.1.tgz",
1155 | +      "integrity": "sha512-MHzkWQcEmjzzVW9j2q8LGjwGWpG2mjwaaB0BNQwst3FIjqsg8Ct/mIZlvSPJvfi9y2AC8mi/ktxbFVL9pZ1I4A==",
1156 | +      "dev": true,
1157 | +      "license": "MIT",
1158 | +      "dependencies": {
1159 | +        "@babel/helper-plugin-utils": "^7.27.1"
1160 | +      },
1161 | +      "engines": {
1162 | +        "node": ">=6.9.0"
1163 | +      },
1164 | +      "peerDependencies": {
1165 | +        "@babel/core": "^7.0.0-0"
1166 | +      }
1167 | +    },
1168 | +    "node_modules/@babel/plugin-transform-explicit-resource-management": {
1169 | +      "version": "7.28.0",
1170 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-explicit-resource-management/-/plugin-transform-explicit-resource-management-7.28.0.tgz",
1171 | +      "integrity": "sha512-K8nhUcn3f6iB+P3gwCv/no7OdzOZQcKchW6N389V6PD8NUWKZHzndOd9sPDVbMoBsbmjMqlB4L9fm+fEFNVlwQ==",
1172 | +      "dev": true,
1173 | +      "license": "MIT",
1174 | +      "dependencies": {
1175 | +        "@babel/helper-plugin-utils": "^7.27.1",
1176 | +        "@babel/plugin-transform-destructuring": "^7.28.0"
1177 | +      },
1178 | +      "engines": {
1179 | +        "node": ">=6.9.0"
1180 | +      },
1181 | +      "peerDependencies": {
1182 | +        "@babel/core": "^7.0.0-0"
1183 | +      }
1184 | +    },
1185 | +    "node_modules/@babel/plugin-transform-exponentiation-operator": {
1186 | +      "version": "7.27.1",
1187 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-exponentiation-operator/-/plugin-transform-exponentiation-operator-7.27.1.tgz",
1188 | +      "integrity": "sha512-uspvXnhHvGKf2r4VVtBpeFnuDWsJLQ6MF6lGJLC89jBR1uoVeqM416AZtTuhTezOfgHicpJQmoD5YUakO/YmXQ==",
1189 | +      "dev": true,
1190 | +      "license": "MIT",
1191 | +      "dependencies": {
1192 | +        "@babel/helper-plugin-utils": "^7.27.1"
1193 | +      },
1194 | +      "engines": {
1195 | +        "node": ">=6.9.0"
1196 | +      },
1197 | +      "peerDependencies": {
1198 | +        "@babel/core": "^7.0.0-0"
1199 | +      }
1200 | +    },
1201 | +    "node_modules/@babel/plugin-transform-export-namespace-from": {
1202 | +      "version": "7.27.1",
1203 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-export-namespace-from/-/plugin-transform-export-namespace-from-7.27.1.tgz",
1204 | +      "integrity": "sha512-tQvHWSZ3/jH2xuq/vZDy0jNn+ZdXJeM8gHvX4lnJmsc3+50yPlWdZXIc5ay+umX+2/tJIqHqiEqcJvxlmIvRvQ==",
1205 | +      "dev": true,
1206 | +      "license": "MIT",
1207 | +      "dependencies": {
1208 | +        "@babel/helper-plugin-utils": "^7.27.1"
1209 | +      },
1210 | +      "engines": {
1211 | +        "node": ">=6.9.0"
1212 | +      },
1213 | +      "peerDependencies": {
1214 | +        "@babel/core": "^7.0.0-0"
1215 | +      }
1216 | +    },
1217 | +    "node_modules/@babel/plugin-transform-for-of": {
1218 | +      "version": "7.27.1",
1219 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-for-of/-/plugin-transform-for-of-7.27.1.tgz",
1220 | +      "integrity": "sha512-BfbWFFEJFQzLCQ5N8VocnCtA8J1CLkNTe2Ms2wocj75dd6VpiqS5Z5quTYcUoo4Yq+DN0rtikODccuv7RU81sw==",
1221 | +      "dev": true,
1222 | +      "license": "MIT",
1223 | +      "dependencies": {
1224 | +        "@babel/helper-plugin-utils": "^7.27.1",
1225 | +        "@babel/helper-skip-transparent-expression-wrappers": "^7.27.1"
1226 | +      },
1227 | +      "engines": {
1228 | +        "node": ">=6.9.0"
1229 | +      },
1230 | +      "peerDependencies": {
1231 | +        "@babel/core": "^7.0.0-0"
1232 | +      }
1233 | +    },
1234 | +    "node_modules/@babel/plugin-transform-function-name": {
1235 | +      "version": "7.27.1",
1236 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-function-name/-/plugin-transform-function-name-7.27.1.tgz",
1237 | +      "integrity": "sha512-1bQeydJF9Nr1eBCMMbC+hdwmRlsv5XYOMu03YSWFwNs0HsAmtSxxF1fyuYPqemVldVyFmlCU7w8UE14LupUSZQ==",
1238 | +      "dev": true,
1239 | +      "license": "MIT",
1240 | +      "dependencies": {
1241 | +        "@babel/helper-compilation-targets": "^7.27.1",
1242 | +        "@babel/helper-plugin-utils": "^7.27.1",
1243 | +        "@babel/traverse": "^7.27.1"
1244 | +      },
1245 | +      "engines": {
1246 | +        "node": ">=6.9.0"
1247 | +      },
1248 | +      "peerDependencies": {
1249 | +        "@babel/core": "^7.0.0-0"
1250 | +      }
1251 | +    },
1252 | +    "node_modules/@babel/plugin-transform-json-strings": {
1253 | +      "version": "7.27.1",
1254 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-json-strings/-/plugin-transform-json-strings-7.27.1.tgz",
1255 | +      "integrity": "sha512-6WVLVJiTjqcQauBhn1LkICsR2H+zm62I3h9faTDKt1qP4jn2o72tSvqMwtGFKGTpojce0gJs+76eZ2uCHRZh0Q==",
1256 | +      "dev": true,
1257 | +      "license": "MIT",
1258 | +      "dependencies": {
1259 | +        "@babel/helper-plugin-utils": "^7.27.1"
1260 | +      },
1261 | +      "engines": {
1262 | +        "node": ">=6.9.0"
1263 | +      },
1264 | +      "peerDependencies": {
1265 | +        "@babel/core": "^7.0.0-0"
1266 | +      }
1267 | +    },
1268 | +    "node_modules/@babel/plugin-transform-literals": {
1269 | +      "version": "7.27.1",
1270 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-literals/-/plugin-transform-literals-7.27.1.tgz",
1271 | +      "integrity": "sha512-0HCFSepIpLTkLcsi86GG3mTUzxV5jpmbv97hTETW3yzrAij8aqlD36toB1D0daVFJM8NK6GvKO0gslVQmm+zZA==",
1272 | +      "dev": true,
1273 | +      "license": "MIT",
1274 | +      "dependencies": {
1275 | +        "@babel/helper-plugin-utils": "^7.27.1"
1276 | +      },
1277 | +      "engines": {
1278 | +        "node": ">=6.9.0"
1279 | +      },
1280 | +      "peerDependencies": {
1281 | +        "@babel/core": "^7.0.0-0"
1282 | +      }
1283 | +    },
1284 | +    "node_modules/@babel/plugin-transform-logical-assignment-operators": {
1285 | +      "version": "7.27.1",
1286 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-logical-assignment-operators/-/plugin-transform-logical-assignment-operators-7.27.1.tgz",
1287 | +      "integrity": "sha512-SJvDs5dXxiae4FbSL1aBJlG4wvl594N6YEVVn9e3JGulwioy6z3oPjx/sQBO3Y4NwUu5HNix6KJ3wBZoewcdbw==",
1288 | +      "dev": true,
1289 | +      "license": "MIT",
1290 | +      "dependencies": {
1291 | +        "@babel/helper-plugin-utils": "^7.27.1"
1292 | +      },
1293 | +      "engines": {
1294 | +        "node": ">=6.9.0"
1295 | +      },
1296 | +      "peerDependencies": {
1297 | +        "@babel/core": "^7.0.0-0"
1298 | +      }
1299 | +    },
1300 | +    "node_modules/@babel/plugin-transform-member-expression-literals": {
1301 | +      "version": "7.27.1",
1302 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-member-expression-literals/-/plugin-transform-member-expression-literals-7.27.1.tgz",
1303 | +      "integrity": "sha512-hqoBX4dcZ1I33jCSWcXrP+1Ku7kdqXf1oeah7ooKOIiAdKQ+uqftgCFNOSzA5AMS2XIHEYeGFg4cKRCdpxzVOQ==",
1304 | +      "dev": true,
1305 | +      "license": "MIT",
1306 | +      "dependencies": {
1307 | +        "@babel/helper-plugin-utils": "^7.27.1"
1308 | +      },
1309 | +      "engines": {
1310 | +        "node": ">=6.9.0"
1311 | +      },
1312 | +      "peerDependencies": {
1313 | +        "@babel/core": "^7.0.0-0"
1314 | +      }
1315 | +    },
1316 | +    "node_modules/@babel/plugin-transform-modules-amd": {
1317 | +      "version": "7.27.1",
1318 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-modules-amd/-/plugin-transform-modules-amd-7.27.1.tgz",
1319 | +      "integrity": "sha512-iCsytMg/N9/oFq6n+gFTvUYDZQOMK5kEdeYxmxt91fcJGycfxVP9CnrxoliM0oumFERba2i8ZtwRUCMhvP1LnA==",
1320 | +      "dev": true,
1321 | +      "license": "MIT",
1322 | +      "dependencies": {
1323 | +        "@babel/helper-module-transforms": "^7.27.1",
1324 | +        "@babel/helper-plugin-utils": "^7.27.1"
1325 | +      },
1326 | +      "engines": {
1327 | +        "node": ">=6.9.0"
1328 | +      },
1329 | +      "peerDependencies": {
1330 | +        "@babel/core": "^7.0.0-0"
1331 | +      }
1332 | +    },
1333 | +    "node_modules/@babel/plugin-transform-modules-commonjs": {
1334 | +      "version": "7.27.1",
1335 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-modules-commonjs/-/plugin-transform-modules-commonjs-7.27.1.tgz",
1336 | +      "integrity": "sha512-OJguuwlTYlN0gBZFRPqwOGNWssZjfIUdS7HMYtN8c1KmwpwHFBwTeFZrg9XZa+DFTitWOW5iTAG7tyCUPsCCyw==",
1337 | +      "dev": true,
1338 | +      "license": "MIT",
1339 | +      "dependencies": {
1340 | +        "@babel/helper-module-transforms": "^7.27.1",
1341 | +        "@babel/helper-plugin-utils": "^7.27.1"
1342 | +      },
1343 | +      "engines": {
1344 | +        "node": ">=6.9.0"
1345 | +      },
1346 | +      "peerDependencies": {
1347 | +        "@babel/core": "^7.0.0-0"
1348 | +      }
1349 | +    },
1350 | +    "node_modules/@babel/plugin-transform-modules-systemjs": {
1351 | +      "version": "7.27.1",
1352 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-modules-systemjs/-/plugin-transform-modules-systemjs-7.27.1.tgz",
1353 | +      "integrity": "sha512-w5N1XzsRbc0PQStASMksmUeqECuzKuTJer7kFagK8AXgpCMkeDMO5S+aaFb7A51ZYDF7XI34qsTX+fkHiIm5yA==",
1354 | +      "dev": true,
1355 | +      "license": "MIT",
1356 | +      "dependencies": {
1357 | +        "@babel/helper-module-transforms": "^7.27.1",
1358 | +        "@babel/helper-plugin-utils": "^7.27.1",
1359 | +        "@babel/helper-validator-identifier": "^7.27.1",
1360 | +        "@babel/traverse": "^7.27.1"
1361 | +      },
1362 | +      "engines": {
1363 | +        "node": ">=6.9.0"
1364 | +      },
1365 | +      "peerDependencies": {
1366 | +        "@babel/core": "^7.0.0-0"
1367 | +      }
1368 | +    },
1369 | +    "node_modules/@babel/plugin-transform-modules-umd": {
1370 | +      "version": "7.27.1",
1371 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-modules-umd/-/plugin-transform-modules-umd-7.27.1.tgz",
1372 | +      "integrity": "sha512-iQBE/xC5BV1OxJbp6WG7jq9IWiD+xxlZhLrdwpPkTX3ydmXdvoCpyfJN7acaIBZaOqTfr76pgzqBJflNbeRK+w==",
1373 | +      "dev": true,
1374 | +      "license": "MIT",
1375 | +      "dependencies": {
1376 | +        "@babel/helper-module-transforms": "^7.27.1",
1377 | +        "@babel/helper-plugin-utils": "^7.27.1"
1378 | +      },
1379 | +      "engines": {
1380 | +        "node": ">=6.9.0"
1381 | +      },
1382 | +      "peerDependencies": {
1383 | +        "@babel/core": "^7.0.0-0"
1384 | +      }
1385 | +    },
1386 | +    "node_modules/@babel/plugin-transform-named-capturing-groups-regex": {
1387 | +      "version": "7.27.1",
1388 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-named-capturing-groups-regex/-/plugin-transform-named-capturing-groups-regex-7.27.1.tgz",
1389 | +      "integrity": "sha512-SstR5JYy8ddZvD6MhV0tM/j16Qds4mIpJTOd1Yu9J9pJjH93bxHECF7pgtc28XvkzTD6Pxcm/0Z73Hvk7kb3Ng==",
1390 | +      "dev": true,
1391 | +      "license": "MIT",
1392 | +      "dependencies": {
1393 | +        "@babel/helper-create-regexp-features-plugin": "^7.27.1",
1394 | +        "@babel/helper-plugin-utils": "^7.27.1"
1395 | +      },
1396 | +      "engines": {
1397 | +        "node": ">=6.9.0"
1398 | +      },
1399 | +      "peerDependencies": {
1400 | +        "@babel/core": "^7.0.0"
1401 | +      }
1402 | +    },
1403 | +    "node_modules/@babel/plugin-transform-new-target": {
1404 | +      "version": "7.27.1",
1405 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-new-target/-/plugin-transform-new-target-7.27.1.tgz",
1406 | +      "integrity": "sha512-f6PiYeqXQ05lYq3TIfIDu/MtliKUbNwkGApPUvyo6+tc7uaR4cPjPe7DFPr15Uyycg2lZU6btZ575CuQoYh7MQ==",
1407 | +      "dev": true,
1408 | +      "license": "MIT",
1409 | +      "dependencies": {
1410 | +        "@babel/helper-plugin-utils": "^7.27.1"
1411 | +      },
1412 | +      "engines": {
1413 | +        "node": ">=6.9.0"
1414 | +      },
1415 | +      "peerDependencies": {
1416 | +        "@babel/core": "^7.0.0-0"
1417 | +      }
1418 | +    },
1419 | +    "node_modules/@babel/plugin-transform-nullish-coalescing-operator": {
1420 | +      "version": "7.27.1",
1421 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-nullish-coalescing-operator/-/plugin-transform-nullish-coalescing-operator-7.27.1.tgz",
1422 | +      "integrity": "sha512-aGZh6xMo6q9vq1JGcw58lZ1Z0+i0xB2x0XaauNIUXd6O1xXc3RwoWEBlsTQrY4KQ9Jf0s5rgD6SiNkaUdJegTA==",
1423 | +      "dev": true,
1424 | +      "license": "MIT",
1425 | +      "dependencies": {
1426 | +        "@babel/helper-plugin-utils": "^7.27.1"
1427 | +      },
1428 | +      "engines": {
1429 | +        "node": ">=6.9.0"
1430 | +      },
1431 | +      "peerDependencies": {
1432 | +        "@babel/core": "^7.0.0-0"
1433 | +      }
1434 | +    },
1435 | +    "node_modules/@babel/plugin-transform-numeric-separator": {
1436 | +      "version": "7.27.1",
1437 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-numeric-separator/-/plugin-transform-numeric-separator-7.27.1.tgz",
1438 | +      "integrity": "sha512-fdPKAcujuvEChxDBJ5c+0BTaS6revLV7CJL08e4m3de8qJfNIuCc2nc7XJYOjBoTMJeqSmwXJ0ypE14RCjLwaw==",
1439 | +      "dev": true,
1440 | +      "license": "MIT",
1441 | +      "dependencies": {
1442 | +        "@babel/helper-plugin-utils": "^7.27.1"
1443 | +      },
1444 | +      "engines": {
1445 | +        "node": ">=6.9.0"
1446 | +      },
1447 | +      "peerDependencies": {
1448 | +        "@babel/core": "^7.0.0-0"
1449 | +      }
1450 | +    },
1451 | +    "node_modules/@babel/plugin-transform-object-rest-spread": {
1452 | +      "version": "7.28.0",
1453 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-object-rest-spread/-/plugin-transform-object-rest-spread-7.28.0.tgz",
1454 | +      "integrity": "sha512-9VNGikXxzu5eCiQjdE4IZn8sb9q7Xsk5EXLDBKUYg1e/Tve8/05+KJEtcxGxAgCY5t/BpKQM+JEL/yT4tvgiUA==",
1455 | +      "dev": true,
1456 | +      "license": "MIT",
1457 | +      "dependencies": {
1458 | +        "@babel/helper-compilation-targets": "^7.27.2",
1459 | +        "@babel/helper-plugin-utils": "^7.27.1",
1460 | +        "@babel/plugin-transform-destructuring": "^7.28.0",
1461 | +        "@babel/plugin-transform-parameters": "^7.27.7",
1462 | +        "@babel/traverse": "^7.28.0"
1463 | +      },
1464 | +      "engines": {
1465 | +        "node": ">=6.9.0"
1466 | +      },
1467 | +      "peerDependencies": {
1468 | +        "@babel/core": "^7.0.0-0"
1469 | +      }
1470 | +    },
1471 | +    "node_modules/@babel/plugin-transform-object-super": {
1472 | +      "version": "7.27.1",
1473 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-object-super/-/plugin-transform-object-super-7.27.1.tgz",
1474 | +      "integrity": "sha512-SFy8S9plRPbIcxlJ8A6mT/CxFdJx/c04JEctz4jf8YZaVS2px34j7NXRrlGlHkN/M2gnpL37ZpGRGVFLd3l8Ng==",
1475 | +      "dev": true,
1476 | +      "license": "MIT",
1477 | +      "dependencies": {
1478 | +        "@babel/helper-plugin-utils": "^7.27.1",
1479 | +        "@babel/helper-replace-supers": "^7.27.1"
1480 | +      },
1481 | +      "engines": {
1482 | +        "node": ">=6.9.0"
1483 | +      },
1484 | +      "peerDependencies": {
1485 | +        "@babel/core": "^7.0.0-0"
1486 | +      }
1487 | +    },
1488 | +    "node_modules/@babel/plugin-transform-optional-catch-binding": {
1489 | +      "version": "7.27.1",
1490 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-optional-catch-binding/-/plugin-transform-optional-catch-binding-7.27.1.tgz",
1491 | +      "integrity": "sha512-txEAEKzYrHEX4xSZN4kJ+OfKXFVSWKB2ZxM9dpcE3wT7smwkNmXo5ORRlVzMVdJbD+Q8ILTgSD7959uj+3Dm3Q==",
1492 | +      "dev": true,
1493 | +      "license": "MIT",
1494 | +      "dependencies": {
1495 | +        "@babel/helper-plugin-utils": "^7.27.1"
1496 | +      },
1497 | +      "engines": {
1498 | +        "node": ">=6.9.0"
1499 | +      },
1500 | +      "peerDependencies": {
1501 | +        "@babel/core": "^7.0.0-0"
1502 | +      }
1503 | +    },
1504 | +    "node_modules/@babel/plugin-transform-optional-chaining": {
1505 | +      "version": "7.27.1",
1506 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-optional-chaining/-/plugin-transform-optional-chaining-7.27.1.tgz",
1507 | +      "integrity": "sha512-BQmKPPIuc8EkZgNKsv0X4bPmOoayeu4F1YCwx2/CfmDSXDbp7GnzlUH+/ul5VGfRg1AoFPsrIThlEBj2xb4CAg==",
1508 | +      "dev": true,
1509 | +      "license": "MIT",
1510 | +      "dependencies": {
1511 | +        "@babel/helper-plugin-utils": "^7.27.1",
1512 | +        "@babel/helper-skip-transparent-expression-wrappers": "^7.27.1"
1513 | +      },
1514 | +      "engines": {
1515 | +        "node": ">=6.9.0"
1516 | +      },
1517 | +      "peerDependencies": {
1518 | +        "@babel/core": "^7.0.0-0"
1519 | +      }
1520 | +    },
1521 | +    "node_modules/@babel/plugin-transform-parameters": {
1522 | +      "version": "7.27.7",
1523 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-parameters/-/plugin-transform-parameters-7.27.7.tgz",
1524 | +      "integrity": "sha512-qBkYTYCb76RRxUM6CcZA5KRu8K4SM8ajzVeUgVdMVO9NN9uI/GaVmBg/WKJJGnNokV9SY8FxNOVWGXzqzUidBg==",
1525 | +      "dev": true,
1526 | +      "license": "MIT",
1527 | +      "dependencies": {
1528 | +        "@babel/helper-plugin-utils": "^7.27.1"
1529 | +      },
1530 | +      "engines": {
1531 | +        "node": ">=6.9.0"
1532 | +      },
1533 | +      "peerDependencies": {
1534 | +        "@babel/core": "^7.0.0-0"
1535 | +      }
1536 | +    },
1537 | +    "node_modules/@babel/plugin-transform-private-methods": {
1538 | +      "version": "7.27.1",
1539 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-private-methods/-/plugin-transform-private-methods-7.27.1.tgz",
1540 | +      "integrity": "sha512-10FVt+X55AjRAYI9BrdISN9/AQWHqldOeZDUoLyif1Kn05a56xVBXb8ZouL8pZ9jem8QpXaOt8TS7RHUIS+GPA==",
1541 | +      "dev": true,
1542 | +      "license": "MIT",
1543 | +      "dependencies": {
1544 | +        "@babel/helper-create-class-features-plugin": "^7.27.1",
1545 | +        "@babel/helper-plugin-utils": "^7.27.1"
1546 | +      },
1547 | +      "engines": {
1548 | +        "node": ">=6.9.0"
1549 | +      },
1550 | +      "peerDependencies": {
1551 | +        "@babel/core": "^7.0.0-0"
1552 | +      }
1553 | +    },
1554 | +    "node_modules/@babel/plugin-transform-private-property-in-object": {
1555 | +      "version": "7.27.1",
1556 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-private-property-in-object/-/plugin-transform-private-property-in-object-7.27.1.tgz",
1557 | +      "integrity": "sha512-5J+IhqTi1XPa0DXF83jYOaARrX+41gOewWbkPyjMNRDqgOCqdffGh8L3f/Ek5utaEBZExjSAzcyjmV9SSAWObQ==",
1558 | +      "dev": true,
1559 | +      "license": "MIT",
1560 | +      "dependencies": {
1561 | +        "@babel/helper-annotate-as-pure": "^7.27.1",
1562 | +        "@babel/helper-create-class-features-plugin": "^7.27.1",
1563 | +        "@babel/helper-plugin-utils": "^7.27.1"
1564 | +      },
1565 | +      "engines": {
1566 | +        "node": ">=6.9.0"
1567 | +      },
1568 | +      "peerDependencies": {
1569 | +        "@babel/core": "^7.0.0-0"
1570 | +      }
1571 | +    },
1572 | +    "node_modules/@babel/plugin-transform-property-literals": {
1573 | +      "version": "7.27.1",
1574 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-property-literals/-/plugin-transform-property-literals-7.27.1.tgz",
1575 | +      "integrity": "sha512-oThy3BCuCha8kDZ8ZkgOg2exvPYUlprMukKQXI1r1pJ47NCvxfkEy8vK+r/hT9nF0Aa4H1WUPZZjHTFtAhGfmQ==",
1576 | +      "dev": true,
1577 | +      "license": "MIT",
1578 | +      "dependencies": {
1579 | +        "@babel/helper-plugin-utils": "^7.27.1"
1580 | +      },
1581 | +      "engines": {
1582 | +        "node": ">=6.9.0"
1583 | +      },
1584 | +      "peerDependencies": {
1585 | +        "@babel/core": "^7.0.0-0"
1586 | +      }
1587 | +    },
1588 | +    "node_modules/@babel/plugin-transform-react-jsx-self": {
1589 | +      "version": "7.27.1",
1590 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-react-jsx-self/-/plugin-transform-react-jsx-self-7.27.1.tgz",
1591 | +      "integrity": "sha512-6UzkCs+ejGdZ5mFFC/OCUrv028ab2fp1znZmCZjAOBKiBK2jXD1O+BPSfX8X2qjJ75fZBMSnQn3Rq2mrBJK2mw==",
1592 | +      "dev": true,
1593 | +      "license": "MIT",
1594 | +      "dependencies": {
1595 | +        "@babel/helper-plugin-utils": "^7.27.1"
1596 | +      },
1597 | +      "engines": {
1598 | +        "node": ">=6.9.0"
1599 | +      },
1600 | +      "peerDependencies": {
1601 | +        "@babel/core": "^7.0.0-0"
1602 | +      }
1603 | +    },
1604 | +    "node_modules/@babel/plugin-transform-react-jsx-source": {
1605 | +      "version": "7.27.1",
1606 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-react-jsx-source/-/plugin-transform-react-jsx-source-7.27.1.tgz",
1607 | +      "integrity": "sha512-zbwoTsBruTeKB9hSq73ha66iFeJHuaFkUbwvqElnygoNbj/jHRsSeokowZFN3CZ64IvEqcmmkVe89OPXc7ldAw==",
1608 | +      "dev": true,
1609 | +      "license": "MIT",
1610 | +      "dependencies": {
1611 | +        "@babel/helper-plugin-utils": "^7.27.1"
1612 | +      },
1613 | +      "engines": {
1614 | +        "node": ">=6.9.0"
1615 | +      },
1616 | +      "peerDependencies": {
1617 | +        "@babel/core": "^7.0.0-0"
1618 | +      }
1619 | +    },
1620 | +    "node_modules/@babel/plugin-transform-regenerator": {
1621 | +      "version": "7.28.3",
1622 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-regenerator/-/plugin-transform-regenerator-7.28.3.tgz",
1623 | +      "integrity": "sha512-K3/M/a4+ESb5LEldjQb+XSrpY0nF+ZBFlTCbSnKaYAMfD8v33O6PMs4uYnOk19HlcsI8WMu3McdFPTiQHF/1/A==",
1624 | +      "dev": true,
1625 | +      "license": "MIT",
1626 | +      "dependencies": {
1627 | +        "@babel/helper-plugin-utils": "^7.27.1"
1628 | +      },
1629 | +      "engines": {
1630 | +        "node": ">=6.9.0"
1631 | +      },
1632 | +      "peerDependencies": {
1633 | +        "@babel/core": "^7.0.0-0"
1634 | +      }
1635 | +    },
1636 | +    "node_modules/@babel/plugin-transform-regexp-modifiers": {
1637 | +      "version": "7.27.1",
1638 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-regexp-modifiers/-/plugin-transform-regexp-modifiers-7.27.1.tgz",
1639 | +      "integrity": "sha512-TtEciroaiODtXvLZv4rmfMhkCv8jx3wgKpL68PuiPh2M4fvz5jhsA7697N1gMvkvr/JTF13DrFYyEbY9U7cVPA==",
1640 | +      "dev": true,
1641 | +      "license": "MIT",
1642 | +      "dependencies": {
1643 | +        "@babel/helper-create-regexp-features-plugin": "^7.27.1",
1644 | +        "@babel/helper-plugin-utils": "^7.27.1"
1645 | +      },
1646 | +      "engines": {
1647 | +        "node": ">=6.9.0"
1648 | +      },
1649 | +      "peerDependencies": {
1650 | +        "@babel/core": "^7.0.0"
1651 | +      }
1652 | +    },
1653 | +    "node_modules/@babel/plugin-transform-reserved-words": {
1654 | +      "version": "7.27.1",
1655 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-reserved-words/-/plugin-transform-reserved-words-7.27.1.tgz",
1656 | +      "integrity": "sha512-V2ABPHIJX4kC7HegLkYoDpfg9PVmuWy/i6vUM5eGK22bx4YVFD3M5F0QQnWQoDs6AGsUWTVOopBiMFQgHaSkVw==",
1657 | +      "dev": true,
1658 | +      "license": "MIT",
1659 | +      "dependencies": {
1660 | +        "@babel/helper-plugin-utils": "^7.27.1"
1661 | +      },
1662 | +      "engines": {
1663 | +        "node": ">=6.9.0"
1664 | +      },
1665 | +      "peerDependencies": {
1666 | +        "@babel/core": "^7.0.0-0"
1667 | +      }
1668 | +    },
1669 | +    "node_modules/@babel/plugin-transform-shorthand-properties": {
1670 | +      "version": "7.27.1",
1671 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-shorthand-properties/-/plugin-transform-shorthand-properties-7.27.1.tgz",
1672 | +      "integrity": "sha512-N/wH1vcn4oYawbJ13Y/FxcQrWk63jhfNa7jef0ih7PHSIHX2LB7GWE1rkPrOnka9kwMxb6hMl19p7lidA+EHmQ==",
1673 | +      "dev": true,
1674 | +      "license": "MIT",
1675 | +      "dependencies": {
1676 | +        "@babel/helper-plugin-utils": "^7.27.1"
1677 | +      },
1678 | +      "engines": {
1679 | +        "node": ">=6.9.0"
1680 | +      },
1681 | +      "peerDependencies": {
1682 | +        "@babel/core": "^7.0.0-0"
1683 | +      }
1684 | +    },
1685 | +    "node_modules/@babel/plugin-transform-spread": {
1686 | +      "version": "7.27.1",
1687 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-spread/-/plugin-transform-spread-7.27.1.tgz",
1688 | +      "integrity": "sha512-kpb3HUqaILBJcRFVhFUs6Trdd4mkrzcGXss+6/mxUd273PfbWqSDHRzMT2234gIg2QYfAjvXLSquP1xECSg09Q==",
1689 | +      "dev": true,
1690 | +      "license": "MIT",
1691 | +      "dependencies": {
1692 | +        "@babel/helper-plugin-utils": "^7.27.1",
1693 | +        "@babel/helper-skip-transparent-expression-wrappers": "^7.27.1"
1694 | +      },
1695 | +      "engines": {
1696 | +        "node": ">=6.9.0"
1697 | +      },
1698 | +      "peerDependencies": {
1699 | +        "@babel/core": "^7.0.0-0"
1700 | +      }
1701 | +    },
1702 | +    "node_modules/@babel/plugin-transform-sticky-regex": {
1703 | +      "version": "7.27.1",
1704 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-sticky-regex/-/plugin-transform-sticky-regex-7.27.1.tgz",
1705 | +      "integrity": "sha512-lhInBO5bi/Kowe2/aLdBAawijx+q1pQzicSgnkB6dUPc1+RC8QmJHKf2OjvU+NZWitguJHEaEmbV6VWEouT58g==",
1706 | +      "dev": true,
1707 | +      "license": "MIT",
1708 | +      "dependencies": {
1709 | +        "@babel/helper-plugin-utils": "^7.27.1"
1710 | +      },
1711 | +      "engines": {
1712 | +        "node": ">=6.9.0"
1713 | +      },
1714 | +      "peerDependencies": {
1715 | +        "@babel/core": "^7.0.0-0"
1716 | +      }
1717 | +    },
1718 | +    "node_modules/@babel/plugin-transform-template-literals": {
1719 | +      "version": "7.27.1",
1720 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-template-literals/-/plugin-transform-template-literals-7.27.1.tgz",
1721 | +      "integrity": "sha512-fBJKiV7F2DxZUkg5EtHKXQdbsbURW3DZKQUWphDum0uRP6eHGGa/He9mc0mypL680pb+e/lDIthRohlv8NCHkg==",
1722 | +      "dev": true,
1723 | +      "license": "MIT",
1724 | +      "dependencies": {
1725 | +        "@babel/helper-plugin-utils": "^7.27.1"
1726 | +      },
1727 | +      "engines": {
1728 | +        "node": ">=6.9.0"
1729 | +      },
1730 | +      "peerDependencies": {
1731 | +        "@babel/core": "^7.0.0-0"
1732 | +      }
1733 | +    },
1734 | +    "node_modules/@babel/plugin-transform-typeof-symbol": {
1735 | +      "version": "7.27.1",
1736 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-typeof-symbol/-/plugin-transform-typeof-symbol-7.27.1.tgz",
1737 | +      "integrity": "sha512-RiSILC+nRJM7FY5srIyc4/fGIwUhyDuuBSdWn4y6yT6gm652DpCHZjIipgn6B7MQ1ITOUnAKWixEUjQRIBIcLw==",
1738 | +      "dev": true,
1739 | +      "license": "MIT",
1740 | +      "dependencies": {
1741 | +        "@babel/helper-plugin-utils": "^7.27.1"
1742 | +      },
1743 | +      "engines": {
1744 | +        "node": ">=6.9.0"
1745 | +      },
1746 | +      "peerDependencies": {
1747 | +        "@babel/core": "^7.0.0-0"
1748 | +      }
1749 | +    },
1750 | +    "node_modules/@babel/plugin-transform-unicode-escapes": {
1751 | +      "version": "7.27.1",
1752 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-unicode-escapes/-/plugin-transform-unicode-escapes-7.27.1.tgz",
1753 | +      "integrity": "sha512-Ysg4v6AmF26k9vpfFuTZg8HRfVWzsh1kVfowA23y9j/Gu6dOuahdUVhkLqpObp3JIv27MLSii6noRnuKN8H0Mg==",
1754 | +      "dev": true,
1755 | +      "license": "MIT",
1756 | +      "dependencies": {
1757 | +        "@babel/helper-plugin-utils": "^7.27.1"
1758 | +      },
1759 | +      "engines": {
1760 | +        "node": ">=6.9.0"
1761 | +      },
1762 | +      "peerDependencies": {
1763 | +        "@babel/core": "^7.0.0-0"
1764 | +      }
1765 | +    },
1766 | +    "node_modules/@babel/plugin-transform-unicode-property-regex": {
1767 | +      "version": "7.27.1",
1768 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-unicode-property-regex/-/plugin-transform-unicode-property-regex-7.27.1.tgz",
1769 | +      "integrity": "sha512-uW20S39PnaTImxp39O5qFlHLS9LJEmANjMG7SxIhap8rCHqu0Ik+tLEPX5DKmHn6CsWQ7j3lix2tFOa5YtL12Q==",
1770 | +      "dev": true,
1771 | +      "license": "MIT",
1772 | +      "dependencies": {
1773 | +        "@babel/helper-create-regexp-features-plugin": "^7.27.1",
1774 | +        "@babel/helper-plugin-utils": "^7.27.1"
1775 | +      },
1776 | +      "engines": {
1777 | +        "node": ">=6.9.0"
1778 | +      },
1779 | +      "peerDependencies": {
1780 | +        "@babel/core": "^7.0.0-0"
1781 | +      }
1782 | +    },
1783 | +    "node_modules/@babel/plugin-transform-unicode-regex": {
1784 | +      "version": "7.27.1",
1785 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-unicode-regex/-/plugin-transform-unicode-regex-7.27.1.tgz",
1786 | +      "integrity": "sha512-xvINq24TRojDuyt6JGtHmkVkrfVV3FPT16uytxImLeBZqW3/H52yN+kM1MGuyPkIQxrzKwPHs5U/MP3qKyzkGw==",
1787 | +      "dev": true,
1788 | +      "license": "MIT",
1789 | +      "dependencies": {
1790 | +        "@babel/helper-create-regexp-features-plugin": "^7.27.1",
1791 | +        "@babel/helper-plugin-utils": "^7.27.1"
1792 | +      },
1793 | +      "engines": {
1794 | +        "node": ">=6.9.0"
1795 | +      },
1796 | +      "peerDependencies": {
1797 | +        "@babel/core": "^7.0.0-0"
1798 | +      }
1799 | +    },
1800 | +    "node_modules/@babel/plugin-transform-unicode-sets-regex": {
1801 | +      "version": "7.27.1",
1802 | +      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-unicode-sets-regex/-/plugin-transform-unicode-sets-regex-7.27.1.tgz",
1803 | +      "integrity": "sha512-EtkOujbc4cgvb0mlpQefi4NTPBzhSIevblFevACNLUspmrALgmEBdL/XfnyyITfd8fKBZrZys92zOWcik7j9Tw==",
1804 | +      "dev": true,
1805 | +      "license": "MIT",
1806 | +      "dependencies": {
1807 | +        "@babel/helper-create-regexp-features-plugin": "^7.27.1",
1808 | +        "@babel/helper-plugin-utils": "^7.27.1"
1809 | +      },
1810 | +      "engines": {
1811 | +        "node": ">=6.9.0"
1812 | +      },
1813 | +      "peerDependencies": {
1814 | +        "@babel/core": "^7.0.0"
1815 | +      }
1816 | +    },
1817 | +    "node_modules/@babel/preset-env": {
1818 | +      "version": "7.28.3",
1819 | +      "resolved": "https://registry.npmjs.org/@babel/preset-env/-/preset-env-7.28.3.tgz",
1820 | +      "integrity": "sha512-ROiDcM+GbYVPYBOeCR6uBXKkQpBExLl8k9HO1ygXEyds39j+vCCsjmj7S8GOniZQlEs81QlkdJZe76IpLSiqpg==",
1821 | +      "dev": true,
1822 | +      "license": "MIT",
1823 | +      "dependencies": {
1824 | +        "@babel/compat-data": "^7.28.0",
1825 | +        "@babel/helper-compilation-targets": "^7.27.2",
1826 | +        "@babel/helper-plugin-utils": "^7.27.1",
1827 | +        "@babel/helper-validator-option": "^7.27.1",
1828 | +        "@babel/plugin-bugfix-firefox-class-in-computed-class-key": "^7.27.1",
1829 | +        "@babel/plugin-bugfix-safari-class-field-initializer-scope": "^7.27.1",
1830 | +        "@babel/plugin-bugfix-safari-id-destructuring-collision-in-function-expression": "^7.27.1",
1831 | +        "@babel/plugin-bugfix-v8-spread-parameters-in-optional-chaining": "^7.27.1",
1832 | +        "@babel/plugin-bugfix-v8-static-class-fields-redefine-readonly": "^7.28.3",
1833 | +        "@babel/plugin-proposal-private-property-in-object": "7.21.0-placeholder-for-preset-env.2",
1834 | +        "@babel/plugin-syntax-import-assertions": "^7.27.1",
1835 | +        "@babel/plugin-syntax-import-attributes": "^7.27.1",
1836 | +        "@babel/plugin-syntax-unicode-sets-regex": "^7.18.6",
1837 | +        "@babel/plugin-transform-arrow-functions": "^7.27.1",
1838 | +        "@babel/plugin-transform-async-generator-functions": "^7.28.0",
1839 | +        "@babel/plugin-transform-async-to-generator": "^7.27.1",
1840 | +        "@babel/plugin-transform-block-scoped-functions": "^7.27.1",
1841 | +        "@babel/plugin-transform-block-scoping": "^7.28.0",
1842 | +        "@babel/plugin-transform-class-properties": "^7.27.1",
1843 | +        "@babel/plugin-transform-class-static-block": "^7.28.3",
1844 | +        "@babel/plugin-transform-classes": "^7.28.3",
1845 | +        "@babel/plugin-transform-computed-properties": "^7.27.1",
1846 | +        "@babel/plugin-transform-destructuring": "^7.28.0",
1847 | +        "@babel/plugin-transform-dotall-regex": "^7.27.1",
1848 | +        "@babel/plugin-transform-duplicate-keys": "^7.27.1",
1849 | +        "@babel/plugin-transform-duplicate-named-capturing-groups-regex": "^7.27.1",
1850 | +        "@babel/plugin-transform-dynamic-import": "^7.27.1",
1851 | +        "@babel/plugin-transform-explicit-resource-management": "^7.28.0",
1852 | +        "@babel/plugin-transform-exponentiation-operator": "^7.27.1",
1853 | +        "@babel/plugin-transform-export-namespace-from": "^7.27.1",
1854 | +        "@babel/plugin-transform-for-of": "^7.27.1",
1855 | +        "@babel/plugin-transform-function-name": "^7.27.1",
1856 | +        "@babel/plugin-transform-json-strings": "^7.27.1",
1857 | +        "@babel/plugin-transform-literals": "^7.27.1",
1858 | +        "@babel/plugin-transform-logical-assignment-operators": "^7.27.1",
1859 | +        "@babel/plugin-transform-member-expression-literals": "^7.27.1",
1860 | +        "@babel/plugin-transform-modules-amd": "^7.27.1",
1861 | +        "@babel/plugin-transform-modules-commonjs": "^7.27.1",
1862 | +        "@babel/plugin-transform-modules-systemjs": "^7.27.1",
1863 | +        "@babel/plugin-transform-modules-umd": "^7.27.1",
1864 | +        "@babel/plugin-transform-named-capturing-groups-regex": "^7.27.1",
1865 | +        "@babel/plugin-transform-new-target": "^7.27.1",
1866 | +        "@babel/plugin-transform-nullish-coalescing-operator": "^7.27.1",
1867 | +        "@babel/plugin-transform-numeric-separator": "^7.27.1",
1868 | +        "@babel/plugin-transform-object-rest-spread": "^7.28.0",
1869 | +        "@babel/plugin-transform-object-super": "^7.27.1",
1870 | +        "@babel/plugin-transform-optional-catch-binding": "^7.27.1",
1871 | +        "@babel/plugin-transform-optional-chaining": "^7.27.1",
1872 | +        "@babel/plugin-transform-parameters": "^7.27.7",
1873 | +        "@babel/plugin-transform-private-methods": "^7.27.1",
1874 | +        "@babel/plugin-transform-private-property-in-object": "^7.27.1",
1875 | +        "@babel/plugin-transform-property-literals": "^7.27.1",
1876 | +        "@babel/plugin-transform-regenerator": "^7.28.3",
1877 | +        "@babel/plugin-transform-regexp-modifiers": "^7.27.1",
1878 | +        "@babel/plugin-transform-reserved-words": "^7.27.1",
1879 | +        "@babel/plugin-transform-shorthand-properties": "^7.27.1",
1880 | +        "@babel/plugin-transform-spread": "^7.27.1",
1881 | +        "@babel/plugin-transform-sticky-regex": "^7.27.1",
1882 | +        "@babel/plugin-transform-template-literals": "^7.27.1",
1883 | +        "@babel/plugin-transform-typeof-symbol": "^7.27.1",
1884 | +        "@babel/plugin-transform-unicode-escapes": "^7.27.1",
1885 | +        "@babel/plugin-transform-unicode-property-regex": "^7.27.1",
1886 | +        "@babel/plugin-transform-unicode-regex": "^7.27.1",
1887 | +        "@babel/plugin-transform-unicode-sets-regex": "^7.27.1",
1888 | +        "@babel/preset-modules": "0.1.6-no-external-plugins",
1889 | +        "babel-plugin-polyfill-corejs2": "^0.4.14",
1890 | +        "babel-plugin-polyfill-corejs3": "^0.13.0",
1891 | +        "babel-plugin-polyfill-regenerator": "^0.6.5",
1892 | +        "core-js-compat": "^3.43.0",
1893 | +        "semver": "^6.3.1"
1894 | +      },
1895 | +      "engines": {
1896 | +        "node": ">=6.9.0"
1897 | +      },
1898 | +      "peerDependencies": {
1899 | +        "@babel/core": "^7.0.0-0"
1900 | +      }
1901 | +    },
1902 | +    "node_modules/@babel/preset-env/node_modules/semver": {
1903 | +      "version": "6.3.1",
1904 | +      "resolved": "https://registry.npmjs.org/semver/-/semver-6.3.1.tgz",
1905 | +      "integrity": "sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==",
1906 | +      "dev": true,
1907 | +      "license": "ISC",
1908 | +      "bin": {
1909 | +        "semver": "bin/semver.js"
1910 | +      }
1911 | +    },
1912 | +    "node_modules/@babel/preset-modules": {
1913 | +      "version": "0.1.6-no-external-plugins",
1914 | +      "resolved": "https://registry.npmjs.org/@babel/preset-modules/-/preset-modules-0.1.6-no-external-plugins.tgz",
1915 | +      "integrity": "sha512-HrcgcIESLm9aIR842yhJ5RWan/gebQUJ6E/E5+rf0y9o6oj7w0Br+sWuL6kEQ/o/AdfvR1Je9jG18/gnpwjEyA==",
1916 | +      "dev": true,
1917 | +      "license": "MIT",
1918 | +      "dependencies": {
1919 | +        "@babel/helper-plugin-utils": "^7.0.0",
1920 | +        "@babel/types": "^7.4.4",
1921 | +        "esutils": "^2.0.2"
1922 | +      },
1923 | +      "peerDependencies": {
1924 | +        "@babel/core": "^7.0.0-0 || ^8.0.0-0 <8.0.0"
1925 | +      }
1926 | +    },
1927 | +    "node_modules/@babel/runtime": {
1928 | +      "version": "7.28.3",
1929 | +      "resolved": "https://registry.npmjs.org/@babel/runtime/-/runtime-7.28.3.tgz",
1930 | +      "integrity": "sha512-9uIQ10o0WGdpP6GDhXcdOJPJuDgFtIDtN/9+ArJQ2NAfAmiuhTQdzkaTGR33v43GYS2UrSA0eX2pPPHoFVvpxA==",
1931 | +      "license": "MIT",
1932 | +      "engines": {
1933 | +        "node": ">=6.9.0"
1934 | +      }
1935 | +    },
1936 | +    "node_modules/@babel/template": {
1937 | +      "version": "7.27.2",
1938 | +      "resolved": "https://registry.npmjs.org/@babel/template/-/template-7.27.2.tgz",
1939 | +      "integrity": "sha512-LPDZ85aEJyYSd18/DkjNh4/y1ntkE5KwUHWTiqgRxruuZL2F1yuHligVHLvcHY2vMHXttKFpJn6LwfI7cw7ODw==",
1940 | +      "dev": true,
1941 | +      "license": "MIT",
1942 | +      "dependencies": {
1943 | +        "@babel/code-frame": "^7.27.1",
1944 | +        "@babel/parser": "^7.27.2",
1945 | +        "@babel/types": "^7.27.1"
1946 | +      },
1947 | +      "engines": {
1948 | +        "node": ">=6.9.0"
1949 | +      }
1950 | +    },
1951 | +    "node_modules/@babel/traverse": {
1952 | +      "version": "7.28.3",
1953 | +      "resolved": "https://registry.npmjs.org/@babel/traverse/-/traverse-7.28.3.tgz",
1954 | +      "integrity": "sha512-7w4kZYHneL3A6NP2nxzHvT3HCZ7puDZZjFMqDpBPECub79sTtSO5CGXDkKrTQq8ksAwfD/XI2MRFX23njdDaIQ==",
1955 | +      "dev": true,
1956 | +      "license": "MIT",
1957 | +      "dependencies": {
1958 | +        "@babel/code-frame": "^7.27.1",
1959 | +        "@babel/generator": "^7.28.3",
1960 | +        "@babel/helper-globals": "^7.28.0",
1961 | +        "@babel/parser": "^7.28.3",
1962 | +        "@babel/template": "^7.27.2",
1963 | +        "@babel/types": "^7.28.2",
1964 | +        "debug": "^4.3.1"
1965 | +      },
1966 | +      "engines": {
1967 | +        "node": ">=6.9.0"
1968 | +      }
1969 | +    },
1970 | +    "node_modules/@babel/types": {
1971 | +      "version": "7.28.2",
1972 | +      "resolved": "https://registry.npmjs.org/@babel/types/-/types-7.28.2.tgz",
1973 | +      "integrity": "sha512-ruv7Ae4J5dUYULmeXw1gmb7rYRz57OWCPM57pHojnLq/3Z1CK2lNSLTCVjxVk1F/TZHwOZZrOWi0ur95BbLxNQ==",
1974 | +      "dev": true,
1975 | +      "license": "MIT",
1976 | +      "dependencies": {
1977 | +        "@babel/helper-string-parser": "^7.27.1",
1978 | +        "@babel/helper-validator-identifier": "^7.27.1"
1979 | +      },
1980 | +      "engines": {
1981 | +        "node": ">=6.9.0"
1982 | +      }
1983 | +    },
1984 | +    "node_modules/@commitlint/cli": {
1985 | +      "version": "17.8.1",
1986 | +      "resolved": "https://registry.npmjs.org/@commitlint/cli/-/cli-17.8.1.tgz",
1987 | +      "integrity": "sha512-ay+WbzQesE0Rv4EQKfNbSMiJJ12KdKTDzIt0tcK4k11FdsWmtwP0Kp1NWMOUswfIWo6Eb7p7Ln721Nx9FLNBjg==",
1988 | +      "dev": true,
1989 | +      "license": "MIT",
1990 | +      "dependencies": {
1991 | +        "@commitlint/format": "^17.8.1",
1992 | +        "@commitlint/lint": "^17.8.1",
1993 | +        "@commitlint/load": "^17.8.1",
1994 | +        "@commitlint/read": "^17.8.1",
1995 | +        "@commitlint/types": "^17.8.1",
1996 | +        "execa": "^5.0.0",
1997 | +        "lodash.isfunction": "^3.0.9",
1998 | +        "resolve-from": "5.0.0",
1999 | +        "resolve-global": "1.0.0",
2000 | +        "yargs": "^17.0.0"
2001 | +      },
2002 | +      "bin": {
2003 | +        "commitlint": "cli.js"
2004 | +      },
2005 | +      "engines": {
2006 | +        "node": ">=v14"
2007 | +      }
2008 | +    },
2009 | +    "node_modules/@commitlint/config-conventional": {
2010 | +      "version": "17.8.1",
2011 | +      "resolved": "https://registry.npmjs.org/@commitlint/config-conventional/-/config-conventional-17.8.1.tgz",
2012 | +      "integrity": "sha512-NxCOHx1kgneig3VLauWJcDWS40DVjg7nKOpBEEK9E5fjJpQqLCilcnKkIIjdBH98kEO1q3NpE5NSrZ2kl/QGJg==",
2013 | +      "dev": true,
2014 | +      "license": "MIT",
2015 | +      "dependencies": {
2016 | +        "conventional-changelog-conventionalcommits": "^6.1.0"
2017 | +      },
2018 | +      "engines": {
2019 | +        "node": ">=v14"
2020 | +      }
2021 | +    },
2022 | +    "node_modules/@commitlint/config-validator": {
2023 | +      "version": "17.8.1",
2024 | +      "resolved": "https://registry.npmjs.org/@commitlint/config-validator/-/config-validator-17.8.1.tgz",
2025 | +      "integrity": "sha512-UUgUC+sNiiMwkyiuIFR7JG2cfd9t/7MV8VB4TZ+q02ZFkHoduUS4tJGsCBWvBOGD9Btev6IecPMvlWUfJorkEA==",
2026 | +      "dev": true,
2027 | +      "license": "MIT",
2028 | +      "dependencies": {
2029 | +        "@commitlint/types": "^17.8.1",
2030 | +        "ajv": "^8.11.0"
2031 | +      },
2032 | +      "engines": {
2033 | +        "node": ">=v14"
2034 | +      }
2035 | +    },
2036 | +    "node_modules/@commitlint/ensure": {
2037 | +      "version": "17.8.1",
2038 | +      "resolved": "https://registry.npmjs.org/@commitlint/ensure/-/ensure-17.8.1.tgz",
2039 | +      "integrity": "sha512-xjafwKxid8s1K23NFpL8JNo6JnY/ysetKo8kegVM7c8vs+kWLP8VrQq+NbhgVlmCojhEDbzQKp4eRXSjVOGsow==",
2040 | +      "dev": true,
2041 | +      "license": "MIT",
2042 | +      "dependencies": {
2043 | +        "@commitlint/types": "^17.8.1",
2044 | +        "lodash.camelcase": "^4.3.0",
2045 | +        "lodash.kebabcase": "^4.1.1",
2046 | +        "lodash.snakecase": "^4.1.1",
2047 | +        "lodash.startcase": "^4.4.0",
2048 | +        "lodash.upperfirst": "^4.3.1"
2049 | +      },
2050 | +      "engines": {
2051 | +        "node": ">=v14"
2052 | +      }
2053 | +    },
2054 | +    "node_modules/@commitlint/execute-rule": {
2055 | +      "version": "17.8.1",
2056 | +      "resolved": "https://registry.npmjs.org/@commitlint/execute-rule/-/execute-rule-17.8.1.tgz",
2057 | +      "integrity": "sha512-JHVupQeSdNI6xzA9SqMF+p/JjrHTcrJdI02PwesQIDCIGUrv04hicJgCcws5nzaoZbROapPs0s6zeVHoxpMwFQ==",
2058 | +      "dev": true,
2059 | +      "license": "MIT",
2060 | +      "engines": {
2061 | +        "node": ">=v14"
2062 | +      }
2063 | +    },
2064 | +    "node_modules/@commitlint/format": {
2065 | +      "version": "17.8.1",
2066 | +      "resolved": "https://registry.npmjs.org/@commitlint/format/-/format-17.8.1.tgz",
2067 | +      "integrity": "sha512-f3oMTyZ84M9ht7fb93wbCKmWxO5/kKSbwuYvS867duVomoOsgrgljkGGIztmT/srZnaiGbaK8+Wf8Ik2tSr5eg==",
2068 | +      "dev": true,
2069 | +      "license": "MIT",
2070 | +      "dependencies": {
2071 | +        "@commitlint/types": "^17.8.1",
2072 | +        "chalk": "^4.1.0"
2073 | +      },
2074 | +      "engines": {
2075 | +        "node": ">=v14"
2076 | +      }
2077 | +    },
2078 | +    "node_modules/@commitlint/is-ignored": {
2079 | +      "version": "17.8.1",
2080 | +      "resolved": "https://registry.npmjs.org/@commitlint/is-ignored/-/is-ignored-17.8.1.tgz",
2081 | +      "integrity": "sha512-UshMi4Ltb4ZlNn4F7WtSEugFDZmctzFpmbqvpyxD3la510J+PLcnyhf9chs7EryaRFJMdAKwsEKfNK0jL/QM4g==",
2082 | +      "dev": true,
2083 | +      "license": "MIT",
2084 | +      "dependencies": {
2085 | +        "@commitlint/types": "^17.8.1",
2086 | +        "semver": "7.5.4"
2087 | +      },
2088 | +      "engines": {
2089 | +        "node": ">=v14"
2090 | +      }
2091 | +    },
2092 | +    "node_modules/@commitlint/lint": {
2093 | +      "version": "17.8.1",
2094 | +      "resolved": "https://registry.npmjs.org/@commitlint/lint/-/lint-17.8.1.tgz",
2095 | +      "integrity": "sha512-aQUlwIR1/VMv2D4GXSk7PfL5hIaFSfy6hSHV94O8Y27T5q+DlDEgd/cZ4KmVI+MWKzFfCTiTuWqjfRSfdRllCA==",
2096 | +      "dev": true,
2097 | +      "license": "MIT",
2098 | +      "dependencies": {
2099 | +        "@commitlint/is-ignored": "^17.8.1",
2100 | +        "@commitlint/parse": "^17.8.1",
2101 | +        "@commitlint/rules": "^17.8.1",
2102 | +        "@commitlint/types": "^17.8.1"
2103 | +      },
2104 | +      "engines": {
2105 | +        "node": ">=v14"
2106 | +      }
2107 | +    },
2108 | +    "node_modules/@commitlint/load": {
2109 | +      "version": "17.8.1",
2110 | +      "resolved": "https://registry.npmjs.org/@commitlint/load/-/load-17.8.1.tgz",
2111 | +      "integrity": "sha512-iF4CL7KDFstP1kpVUkT8K2Wl17h2yx9VaR1ztTc8vzByWWcbO/WaKwxsnCOqow9tVAlzPfo1ywk9m2oJ9ucMqA==",
2112 | +      "dev": true,
2113 | +      "license": "MIT",
2114 | +      "dependencies": {
2115 | +        "@commitlint/config-validator": "^17.8.1",
2116 | +        "@commitlint/execute-rule": "^17.8.1",
2117 | +        "@commitlint/resolve-extends": "^17.8.1",
2118 | +        "@commitlint/types": "^17.8.1",
2119 | +        "@types/node": "20.5.1",
2120 | +        "chalk": "^4.1.0",
2121 | +        "cosmiconfig": "^8.0.0",
2122 | +        "cosmiconfig-typescript-loader": "^4.0.0",
2123 | +        "lodash.isplainobject": "^4.0.6",
2124 | +        "lodash.merge": "^4.6.2",
2125 | +        "lodash.uniq": "^4.5.0",
2126 | +        "resolve-from": "^5.0.0",
2127 | +        "ts-node": "^10.8.1",
2128 | +        "typescript": "^4.6.4 || ^5.2.2"
2129 | +      },
2130 | +      "engines": {
2131 | +        "node": ">=v14"
2132 | +      }
2133 | +    },
2134 | +    "node_modules/@commitlint/load/node_modules/@types/node": {
2135 | +      "version": "20.5.1",
2136 | +      "resolved": "https://registry.npmjs.org/@types/node/-/node-20.5.1.tgz",
2137 | +      "integrity": "sha512-4tT2UrL5LBqDwoed9wZ6N3umC4Yhz3W3FloMmiiG4JwmUJWpie0c7lcnUNd4gtMKuDEO4wRVS8B6Xa0uMRsMKg==",
2138 | +      "dev": true,
2139 | +      "license": "MIT"
2140 | +    },
2141 | +    "node_modules/@commitlint/message": {
2142 | +      "version": "17.8.1",
2143 | +      "resolved": "https://registry.npmjs.org/@commitlint/message/-/message-17.8.1.tgz",
2144 | +      "integrity": "sha512-6bYL1GUQsD6bLhTH3QQty8pVFoETfFQlMn2Nzmz3AOLqRVfNNtXBaSY0dhZ0dM6A2MEq4+2d7L/2LP8TjqGRkA==",
2145 | +      "dev": true,
2146 | +      "license": "MIT",
2147 | +      "engines": {
2148 | +        "node": ">=v14"
2149 | +      }
2150 | +    },
2151 | +    "node_modules/@commitlint/parse": {
2152 | +      "version": "17.8.1",
2153 | +      "resolved": "https://registry.npmjs.org/@commitlint/parse/-/parse-17.8.1.tgz",
2154 | +      "integrity": "sha512-/wLUickTo0rNpQgWwLPavTm7WbwkZoBy3X8PpkUmlSmQJyWQTj0m6bDjiykMaDt41qcUbfeFfaCvXfiR4EGnfw==",
2155 | +      "dev": true,
2156 | +      "license": "MIT",
2157 | +      "dependencies": {
2158 | +        "@commitlint/types": "^17.8.1",
2159 | +        "conventional-changelog-angular": "^6.0.0",
2160 | +        "conventional-commits-parser": "^4.0.0"
2161 | +      },
2162 | +      "engines": {
2163 | +        "node": ">=v14"
2164 | +      }
2165 | +    },
2166 | +    "node_modules/@commitlint/read": {
2167 | +      "version": "17.8.1",
2168 | +      "resolved": "https://registry.npmjs.org/@commitlint/read/-/read-17.8.1.tgz",
2169 | +      "integrity": "sha512-Fd55Oaz9irzBESPCdMd8vWWgxsW3OWR99wOntBDHgf9h7Y6OOHjWEdS9Xzen1GFndqgyoaFplQS5y7KZe0kO2w==",
2170 | +      "dev": true,
2171 | +      "license": "MIT",
2172 | +      "dependencies": {
2173 | +        "@commitlint/top-level": "^17.8.1",
2174 | +        "@commitlint/types": "^17.8.1",
2175 | +        "fs-extra": "^11.0.0",
2176 | +        "git-raw-commits": "^2.0.11",
2177 | +        "minimist": "^1.2.6"
2178 | +      },
2179 | +      "engines": {
2180 | +        "node": ">=v14"
2181 | +      }
2182 | +    },
2183 | +    "node_modules/@commitlint/resolve-extends": {
2184 | +      "version": "17.8.1",
2185 | +      "resolved": "https://registry.npmjs.org/@commitlint/resolve-extends/-/resolve-extends-17.8.1.tgz",
2186 | +      "integrity": "sha512-W/ryRoQ0TSVXqJrx5SGkaYuAaE/BUontL1j1HsKckvM6e5ZaG0M9126zcwL6peKSuIetJi7E87PRQF8O86EW0Q==",
2187 | +      "dev": true,
2188 | +      "license": "MIT",
2189 | +      "dependencies": {
2190 | +        "@commitlint/config-validator": "^17.8.1",
2191 | +        "@commitlint/types": "^17.8.1",
2192 | +        "import-fresh": "^3.0.0",
2193 | +        "lodash.mergewith": "^4.6.2",
2194 | +        "resolve-from": "^5.0.0",
2195 | +        "resolve-global": "^1.0.0"
2196 | +      },
2197 | +      "engines": {
2198 | +        "node": ">=v14"
2199 | +      }
2200 | +    },
2201 | +    "node_modules/@commitlint/rules": {
2202 | +      "version": "17.8.1",
2203 | +      "resolved": "https://registry.npmjs.org/@commitlint/rules/-/rules-17.8.1.tgz",
2204 | +      "integrity": "sha512-2b7OdVbN7MTAt9U0vKOYKCDsOvESVXxQmrvuVUZ0rGFMCrCPJWWP1GJ7f0lAypbDAhaGb8zqtdOr47192LBrIA==",
2205 | +      "dev": true,
2206 | +      "license": "MIT",
2207 | +      "dependencies": {
2208 | +        "@commitlint/ensure": "^17.8.1",
2209 | +        "@commitlint/message": "^17.8.1",
2210 | +        "@commitlint/to-lines": "^17.8.1",
2211 | +        "@commitlint/types": "^17.8.1",
2212 | +        "execa": "^5.0.0"
2213 | +      },
2214 | +      "engines": {
2215 | +        "node": ">=v14"
2216 | +      }
2217 | +    },
2218 | +    "node_modules/@commitlint/to-lines": {
2219 | +      "version": "17.8.1",
2220 | +      "resolved": "https://registry.npmjs.org/@commitlint/to-lines/-/to-lines-17.8.1.tgz",
2221 | +      "integrity": "sha512-LE0jb8CuR/mj6xJyrIk8VLz03OEzXFgLdivBytoooKO5xLt5yalc8Ma5guTWobw998sbR3ogDd+2jed03CFmJA==",
2222 | +      "dev": true,
2223 | +      "license": "MIT",
2224 | +      "engines": {
2225 | +        "node": ">=v14"
2226 | +      }
2227 | +    },
2228 | +    "node_modules/@commitlint/top-level": {
2229 | +      "version": "17.8.1",
2230 | +      "resolved": "https://registry.npmjs.org/@commitlint/top-level/-/top-level-17.8.1.tgz",
2231 | +      "integrity": "sha512-l6+Z6rrNf5p333SHfEte6r+WkOxGlWK4bLuZKbtf/2TXRN+qhrvn1XE63VhD8Oe9oIHQ7F7W1nG2k/TJFhx2yA==",
2232 | +      "dev": true,
2233 | +      "license": "MIT",
2234 | +      "dependencies": {
2235 | +        "find-up": "^5.0.0"
2236 | +      },
2237 | +      "engines": {
2238 | +        "node": ">=v14"
2239 | +      }
2240 | +    },
2241 | +    "node_modules/@commitlint/types": {
2242 | +      "version": "17.8.1",
2243 | +      "resolved": "https://registry.npmjs.org/@commitlint/types/-/types-17.8.1.tgz",
2244 | +      "integrity": "sha512-PXDQXkAmiMEG162Bqdh9ChML/GJZo6vU+7F03ALKDK8zYc6SuAr47LjG7hGYRqUOz+WK0dU7bQ0xzuqFMdxzeQ==",
2245 | +      "dev": true,
2246 | +      "license": "MIT",
2247 | +      "dependencies": {
2248 | +        "chalk": "^4.1.0"
2249 | +      },
2250 | +      "engines": {
2251 | +        "node": ">=v14"
2252 | +      }
2253 | +    },
2254 | +    "node_modules/@cspotcode/source-map-support": {
2255 | +      "version": "0.8.1",
2256 | +      "resolved": "https://registry.npmjs.org/@cspotcode/source-map-support/-/source-map-support-0.8.1.tgz",
2257 | +      "integrity": "sha512-IchNf6dN4tHoMFIn/7OE8LWZ19Y6q/67Bmf6vnGREv8RSbBVb9LPJxEcnwrcwX6ixSvaiGoomAUvu4YSxXrVgw==",
2258 | +      "dev": true,
2259 | +      "license": "MIT",
2260 | +      "dependencies": {
2261 | +        "@jridgewell/trace-mapping": "0.3.9"
2262 | +      },
2263 | +      "engines": {
2264 | +        "node": ">=12"
2265 | +      }
2266 | +    },
2267 | +    "node_modules/@cspotcode/source-map-support/node_modules/@jridgewell/trace-mapping": {
2268 | +      "version": "0.3.9",
2269 | +      "resolved": "https://registry.npmjs.org/@jridgewell/trace-mapping/-/trace-mapping-0.3.9.tgz",
2270 | +      "integrity": "sha512-3Belt6tdc8bPgAtbcmdtNJlirVoTmEb5e2gC94PnkwEW9jI6CAHUeoG85tjWP5WquqfavoMtMwiG4P926ZKKuQ==",
2271 | +      "dev": true,
2272 | +      "license": "MIT",
2273 | +      "dependencies": {
[TRUNCATED]
```

index.html

```
1 | <!DOCTYPE html>
2 | <html lang="en">
3 |   <head>
4 |     <meta charset="UTF-8" />
5 |     <meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; script-src 'self';" />
6 |     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
7 |     <link rel="manifest" href="/manifest.webmanifest" />
8 |     <title>LLM Playbook Explorer</title>
9 |   </head>
10 |   <body class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
11 |     <div id="root"></div>
12 |     <script type="module" src="/src/main.tsx"></script>
13 |   </body>
14 | </html>
```

lint-staged.config.mjs

```
1 | export default {
2 |   '*.{ts,tsx,js,jsx,json,css,md}': ['prettier --write']
3 | };
```

package.json

```
1 | {
2 |   "name": "playbook-explorer",
3 |   "version": "1.0.0",
4 |   "type": "module",
5 |   "scripts": {
6 |     "dev": "vite",
7 |     "build": "vite build",
8 |     "preview": "vite preview",
9 |     "typecheck": "tsc --noEmit",
10 |     "lint": "eslint .",
11 |     "format": "prettier --write .",
12 |     "test": "vitest",
13 |     "test:watch": "vitest --watch",
14 |     "e2e": "playwright test",
15 |     "build-storybook": "storybook build",
16 |     "storybook": "storybook dev -p 6006",
17 |     "prepare": "husky install",
18 |     "data": "tsx scripts/build-data.ts"
19 |   },
20 |   "dependencies": {
21 |     "@tanstack/react-router": "^1.0.0",
22 |     "@tanstack/router-devtools": "^1.0.0",
23 |     "clsx": "^2.0.0",
24 |     "fuse.js": "^6.6.2",
25 |     "react": "^18.2.0",
26 |     "react-dom": "^18.2.0",
27 |     "react-router-dom": "^6.22.3",
28 |     "recharts": "^2.8.0",
29 |     "zustand": "^4.4.0",
30 |     "zod": "^3.22.4"
31 |   },
32 |   "devDependencies": {
33 |     "@commitlint/cli": "^17.8.1",
34 |     "@commitlint/config-conventional": "^17.8.1",
35 |     "@testing-library/jest-dom": "^6.2.0",
36 |     "@testing-library/react": "^14.1.2",
37 |     "@types/node": "^20.10.6",
38 |     "@types/react": "^18.2.25",
39 |     "@types/react-dom": "^18.2.9",
40 |     "@vitejs/plugin-react": "^4.2.1",
41 |     "autoprefixer": "^10.4.14",
42 |     "axe-core": "^4.7.2",
43 |     "d3-sankey": "^0.12.3",
44 |     "eslint": "^8.54.0",
45 |     "eslint-config-prettier": "^9.0.0",
46 |     "eslint-plugin-react-hooks": "^4.6.0",
47 |     "eslint-plugin-react-refresh": "^0.4.5",
48 |     "husky": "^9.0.10",
49 |     "lint-staged": "^14.0.1",
50 |     "playwright": "^1.41.2",
51 |     "postcss": "^8.4.31",
52 |     "prettier": "^3.1.1",
53 |     "tailwindcss": "^3.3.5",
54 |     "ts-node": "^10.9.2",
55 |     "tsx": "^4.7.1",
56 |     "typescript": "^5.3.3",
57 |     "vite": "^5.0.0",
58 |     "vite-plugin-pwa": "^0.17.4",
59 |     "vitest": "^0.34.5"
60 |   },
61 |   "vitest": {
62 |     "setupFiles": [
63 |       "src/vitest.setup.ts"
64 |     ]
65 |   }
66 | }
```

postcss.config.cjs

```
1 | module.exports = {
2 |   plugins: [require('tailwindcss'), require('autoprefixer')]
3 | };
```

tailwind.config.ts

```
1 | import type { Config } from 'tailwindcss';
2 |
3 | export default {
4 |   content: ['./index.html', './src/**/*.{ts,tsx}'],
5 |   darkMode: 'class',
6 |   theme: {
7 |     extend: {},
8 |   },
9 |   plugins: [],
10 | } satisfies Config;
```

tsconfig.base.json

```
1 | {
2 |   "compilerOptions": {
3 |     "target": "ES2020",
4 |     "module": "ESNext",
5 |     "moduleResolution": "Node",
6 |     "resolveJsonModule": true,
7 |     "esModuleInterop": true,
8 |     "jsx": "react-jsx",
9 |     "strict": true,
10 |     "skipLibCheck": true,
11 |     "types": ["vite/client"]
12 |   }
13 | }
```

tsconfig.json

```
1 | {
2 |   "$schema": "https://json.schemastore.org/tsconfig",
3 |   "extends": "./tsconfig.base.json",
4 |   "include": ["src", "scripts", "*.ts"],
5 |   "exclude": ["e2e"]
6 | }
```

vite.config.ts

```
1 | import { defineConfig } from 'vite';
2 | import react from '@vitejs/plugin-react';
3 | import { VitePWA } from 'vite-plugin-pwa';
4 |
5 | export default defineConfig({
6 |   plugins: [
7 |     react(),
8 |     VitePWA({
9 |       registerType: 'autoUpdate',
10 |       includeAssets: ['favicon.svg'],
11 |       manifest: {
12 |         name: 'LLM Playbook Explorer',
13 |         short_name: 'Playbook',
14 |         start_url: '/',
15 |         display: 'standalone',
16 |         background_color: '#ffffff',
17 |         icons: [
18 |           {
19 |             src: '/icons/pwa-192.png',
20 |             sizes: '192x192',
21 |             type: 'image/png',
22 |           },
23 |           {
24 |             src: '/icons/pwa-512.png',
25 |             sizes: '512x512',
26 |             type: 'image/png',
27 |           },
28 |         ],
29 |       },
30 |     }),
31 |   ],
32 | });
```

.husky/commit-msg

```
1 | #!/usr/bin/env sh
2 | npx --no-install commitlint --edit "$1"
```

.husky/pre-commit

```
1 | #!/bin/sh
2 | . "$(dirname "$0")/_/husky.sh"
3 |
4 | npx lint-staged
```

.storybook/main.ts

```
1 | import type { StorybookConfig } from '@storybook/react-vite';
2 |
3 | const config: StorybookConfig = {
4 |   stories: ['../src/**/*.stories.@(ts|tsx)'],
5 |   addons: ['@storybook/addon-essentials'],
6 |   framework: {
7 |     name: '@storybook/react-vite',
8 |     options: {},
9 |   },
10 | };
11 | export default config;
```

.storybook/preview.ts

```
1 | import '../src/styles/global.css';
2 | export const parameters = { layout: 'fullscreen' };
```

e2e/playwright.config.ts

```
1 | import { defineConfig } from '@playwright/test';
2 |
3 | export default defineConfig({
4 |   webServer: {
5 |     command: 'npm run dev',
6 |     port: 5173,
7 |     reuseExistingServer: !process.env.CI,
8 |   },
9 |   testDir: './tests',
10 | });
```

llm-playbook/LLM-Assisted Software Engineering Playbook(chat).md

````
1 | You asked:
2 | ----------
3 |
4 | LLM Agent Codebase Playbook.md
5 |
6 | File
7 |
8 | llm\_agent\_playbook\_explorer\_react\_ts\_app\_vite.md
9 |
10 | File
11 |
12 | \*\*Role:\*\* You are a senior full-stack engineer, UX lead, and data-viz specialist. Build a production-ready, interactive \*\*single-page web application\*\* that lets users explore the \*\*“LLM Coding Agent Playbook for Solo Developers.”\*\* You will transform a detailed report into structured data and rich, explorable UI. --- ## Objectives \* Convert the provided markdown report (\*\*input: “LLM Agent Codebase Playbook.md”\*\*) into a normalized JSON dataset. \* Ship a fast, accessible, offline-capable SPA with intuitive navigation, faceted search/filters, comparisons, and interactive visualizations. \* Provide complete, ready-to-run source code and light tests + CI. --- ## Technical Constraints (Default Stack) \* \*\*Frontend:\*\* React 18 + TypeScript + Vite (SPA) \* \*\*Routing:\*\* React Router \* \*\*Styling:\*\* TailwindCSS (dark mode supported) \* \*\*State/Search:\*\* Zustand (light state) + Fuse.js (client search) \* \*\*Data validation:\*\* Zod \* \*\*Viz:\*\* Recharts (scatter) and d3-sankey (flows) \* \*\*Build:\*\* Vite, PWA via `vite-plugin-pwa` \* \*\*Testing:\*\* Vitest (+ Testing Library) and Playwright (smoke) \* \*\*Quality:\*\* ESLint + Prettier + Husky + lint-staged \* \*\*CI:\*\* GitHub Actions (lint → typecheck → unit → build → e2e) If an environment forbids any default, choose the nearest equivalent but keep the same features, file structure, and behavior. --- ## Data Model (normalize the report) Parse the markdown into this JSON schema and save as `public/data/playbook.json`:
13 |
14 |     ts
15 |     // Zod types you MUST use in code:
16 |     Pattern = {
17 |       id: string, title: string, summary: string,
18 |       phase: 'Ideation'|'Scaffolding'|'Coding'|'Review'|'Testing'|'Deployment',
19 |       difficulty: 'Beginner'|'Intermediate'|'Advanced',
20 |       roi: number /*0..10*/,
21 |       steps: string[], bestPractices: string[],
22 |       antiPatterns?: string[], prompts?: string[], tools?: string[],
23 |       metrics?: string[], risks?: string[], tags: string[], links?: string[],
24 |       relations: { id: string, type: 'pattern'|'workflow'|'tool'|'prompt'|'metric'|'risk', weight?: number }[]
25 |     }
26 |
27 |     Workflow = {
28 |       id: string, title: string, summary: string,
29 |       stages: { name: string, goals: string[], artifacts?: string[] }[],
30 |       kpis?: string[], tags: string[], relations: Pattern['relations']
31 |     }
32 |
33 |     Tool = {
34 |       id: string, name: string, category: string, cost?: string, url?: string,
35 |       strengths: string[], limits: string[], tags: string[], relations: Pattern['relations']
36 |     }
37 |
38 |     Prompt = {
39 |       id: string, title: string, body: string, useCases: string[],
40 |       inputs?: string[], outputs?: string[], tags: string[], relations: Pattern['relations']
41 |     }
42 |
43 |     Metric = { id: string, name: string, desc: string, scale: 'ordinal'|'ratio'|'percent', compute?: string, tags: string[] }
44 |     Risk   = { id: string, name: string, mitigation: string[], severity: 'Low'|'Med'|'High', tags: string[] }
45 |
46 |     Playbook = {
47 |       version: string, updatedAt: string,
48 |       patterns: Pattern[], workflows: Workflow[], tools: Tool[],
49 |       prompts: Prompt[], metrics: Metric[], risks: Risk[]
50 |     }
51 |
52 | Populate at least 3 Patterns, 1 Workflow, 2 Tools, 2 Prompts, 2 Metrics, 2 Risks from the report content. Use consistent, URL-safe `id`s. --- ## UX Requirements \* \*\*App shell & navigation:\*\* Top nav with routes: Home, Explore, Compare, Prompts. Sticky header, dark/light toggle. \* \*\*Home:\*\* KPI tiles (#patterns, #workflows, #tools, #prompts). Version and “updatedAt”. \* \*\*Explore:\*\* Search box (Fuse.js), Phase filter, Sort (ROI | Difficulty | Updated). Card grid with badges (phase, difficulty, ROI). Pagination not required. \* \*\*Compare:\*\* Simple comparison table showing 3 selected patterns (phase, difficulty, ROI, best practices). If selection UI is complex, show first 3 as sample. \* \*\*Prompts (Prompt Lab):\*\* Card list of prompts with one-click “Copy”. \* \*\*Visualizations:\*\* \* \*\*Scatter:\*\* ROI vs Difficulty (Beginner=1, Intermediate=2, Advanced=3), tooltip with pattern title. \* \*\*Sankey (optional bonus):\*\* Flow across workflow stages using available relations (gracefully hide if no data). \* \*\*Command palette:\*\* ⌘/Ctrl+K opens a search dialog listing top hits across entities. \* \*\*Keyboard:\*\* `/` focuses search input. \* \*\*Accessibility:\*\* Skip-to-content, ARIA labels, focus states; passes basic axe checks. \* \*\*PWA:\*\* Installable, offline cache of static assets + JSON (stale-while-revalidate). --- ## Non-Functional Constraints \* \*\*Performance:\*\* <100KB JS after gzip for initial route (excluding d3); code-split viz if needed. \* \*\*Security:\*\* Strict CSP in `index.html`; sanitize any HTML (e.g., DOMPurify) if rendering markdown snippets. \* \*\*DX:\*\* Strict TypeScript, eslint/prettier on pre-commit. \* \*\*Idempotence:\*\* Deterministic build; no network fetches beyond local `public/data/playbook.json`. --- ## Deliverables (strict output format) Return a \*\*single markdown artifact\*\* named: `LLM Agent Playbook Explorer — Full Source (React 18 + TypeScript + Vite)` containing the entire repository as sections grouped by \*\*path\*\*, each with a fenced code block of the exact file contents. Use the structure below and provide complete, working code (no placeholders except icons): \* `package.json` (scripts: dev/build/preview/typecheck/lint/format/test/test\\:watch/e2e/storybook/build-storybook/prepare) \* `tsconfig.json`, `tsconfig.base.json` \* `vite.config.ts` (with `vite-plugin-pwa`) \* `postcss.config.cjs`, `tailwind.config.ts`, `.eslintrc.cjs`, `.prettierrc`, `.gitignore` \* `.husky/*`, `lint-staged.config.mjs`, `commitlint.config.cjs` \* `index.html` (tight CSP) \* `src/`: \* `main.tsx`, `styles/global.css` \* `app/router.tsx`, `app/shell.tsx` \* `components/` (ThemeToggle, CommandPalette, KpiCard, SearchInput, ui primitives) \* `pages/` (HomePage, NotFound) \* `features/explorer/ExplorerPage.tsx` \* `features/compare/ComparePage.tsx` \* `features/prompts/PromptLabPage.tsx` \* `viz/RoiDifficultyScatter.tsx` \* `data/schemas.ts` (Zod) and `data/repo.ts` (fetch+validate JSON) \* `data/indexer.ts` (Fuse index helper) \* `utils/cn.ts` \* `__tests__/schemas.test.ts`, `vitest.setup.ts` \* `public/manifest.webmanifest`, `public/favicon.svg`, `public/icons/pwa-192.png`, `public/icons/pwa-512.png` \* `public/data/playbook.json` (seed generated from the report; ensure it validates against Zod) \* `e2e/` Playwright minimal smoke (`smoke.spec.ts`) + `playwright.config.ts` \* `.github/workflows/ci.yml` (runs lint, typecheck, unit, build, e2e) \* `.storybook/main.ts`, `.storybook/preview.ts` \* `README.md` (quickstart, scripts, data notes, accessibility, PWA, CI) \*\*Important:\*\* Do not include commentary outside code blocks and headings. No TODOs or stubs except the icon PNG placeholders. --- ## Acceptance Criteria 1. App runs locally (`pnpm dev`) and loads Home with KPI counts derived from `public/data/playbook.json`. 2. Explore page supports search, phase filter, and sort; displays ROI badge and tags; works in dark and light modes. 3. Scatter chart renders correctly with Difficulty mapped to 1–3 and tooltips showing titles. 4. Prompt Lab shows prompts with a working “Copy” button. 5. Command palette opens with ⌘/Ctrl+K and returns top matches across entities; `/` focuses search. 6. PWA installs; assets + JSON cached; app remains navigable offline with last-fetched data. 7. Accessibility: skip link works; basic axe pass (no critical issues). 8. CI passes: lint, typecheck, unit, build, e2e (smoke). 9. Data validates via Zod on load; invalid JSON surfaces a user-visible error. --- ## Input You Have \* \*\*Primary content source:\*\* the provided markdown report (`LLM Agent Codebase Playbook.md`). Parse it to populate the JSON seed. --- ## Style & Quality Bar \* Clean, modern UI; rounded corners, soft shadows; responsive layout; no unused imports. \* Strong typing, defensive programming, and simple error states. \* Private reasoning only; output \*\*only\*\* the final repo artifact described above. --- ## Output Rules \* Return exactly one markdown artifact with all files inline (grouped by path as headings + fenced code). \* No extra explanations, no conversational text, no screenshots. \* Ensure the project is runnable as-is after copy-paste into a new repo.
53 |
54 | Thought for 2m 37s
55 |
56 | ---
57 |
58 | ChatGPT Replied:
59 | ----------------
60 |
61 | LLM Agent Playbook Explorer — Full Source (React 18 + TypeScript + Vite)
62 | ========================================================================
63 |
64 | > Copy this entire tree into a new repo. Then run the quickstart in **README.md**. All files are included below, grouped by path.
65 |
66 | * * *
67 |
68 | package.json
69 | ------------
70 |
71 |     {
72 |       "name": "llm-agent-playbook-explorer",
73 |       "version": "1.0.0",
74 |       "private": true,
75 |       "type": "module",
76 |       "scripts": {
77 |         "dev": "vite",
78 |         "build": "tsc -b && vite build",
79 |         "preview": "vite preview --port 5173",
80 |         "typecheck": "tsc -b --pretty",
81 |         "lint": "eslint . --ext .ts,.tsx",
82 |         "format": "prettier --write .",
83 |         "test": "vitest run",
84 |         "test:watch": "vitest",
85 |         "e2e": "playwright test",
86 |         "e2e:ui": "playwright test --ui",
87 |         "storybook": "storybook dev -p 6006",
88 |         "build-storybook": "storybook build",
89 |         "prepare": "husky install"
90 |       },
91 |       "dependencies": {
92 |         "@radix-ui/react-dialog": "^1.0.6",
93 |         "@radix-ui/react-dropdown-menu": "^2.0.6",
94 |         "@radix-ui/react-popover": "^1.0.7",
95 |         "@radix-ui/react-toast": "^1.1.5",
96 |         "@vitejs/plugin-react": "^4.3.1",
97 |         "clsx": "^2.1.1",
98 |         "d3-sankey": "^0.12.3",
99 |         "fuse.js": "^7.0.0",
100 |         "react": "^18.3.1",
101 |         "react-dom": "^18.3.1",
102 |         "react-router-dom": "^6.26.2",
103 |         "recharts": "^2.12.6",
104 |         "zustand": "^4.5.2",
105 |         "zod": "^3.23.8"
106 |       },
107 |       "devDependencies": {
108 |         "@commitlint/cli": "^19.3.0",
109 |         "@commitlint/config-conventional": "^19.2.2",
110 |         "@playwright/test": "^1.46.1",
111 |         "@storybook/addon-essentials": "^8.1.10",
112 |         "@storybook/addon-interactions": "^8.1.10",
113 |         "@storybook/addon-themes": "^8.1.10",
114 |         "@storybook/react": "^8.1.10",
115 |         "@storybook/react-vite": "^8.1.10",
116 |         "@testing-library/jest-dom": "^6.4.6",
117 |         "@testing-library/react": "^16.0.0",
118 |         "@testing-library/user-event": "^14.5.2",
119 |         "@types/jsdom": "^21.1.7",
120 |         "@types/node": "^20.12.12",
121 |         "@types/react": "^18.2.66",
122 |         "@types/react-dom": "^18.2.22",
123 |         "autoprefixer": "^10.4.19",
124 |         "commitlint": "^19.2.2",
125 |         "eslint": "^9.9.0",
126 |         "eslint-config-prettier": "^9.1.0",
127 |         "eslint-plugin-react": "^7.35.0",
128 |         "eslint-plugin-react-hooks": "^4.6.2",
129 |         "eslint-plugin-unused-imports": "^3.2.0",
130 |         "happy-dom": "^14.11.0",
131 |         "husky": "^9.1.5",
132 |         "jsdom": "^24.1.0",
133 |         "lint-staged": "^15.2.9",
134 |         "postcss": "^8.4.39",
135 |         "prettier": "^3.3.3",
136 |         "tailwindcss": "^3.4.10",
137 |         "typescript": "^5.5.4",
138 |         "vite": "^5.4.2",
139 |         "vite-plugin-pwa": "^0.20.1",
140 |         "vitest": "^2.0.5"
141 |       }
142 |     }
143 |
144 |
145 | * * *
146 |
147 | tsconfig.json
148 | -------------
149 |
150 |     {
151 |       "extends": "./tsconfig.base.json",
152 |       "compilerOptions": {
153 |         "types": ["vite/client", "node", "happy-dom"]
154 |       },
155 |       "include": ["src", "scripts", "vitest.setup.ts", ".storybook"],
156 |       "exclude": ["dist", "node_modules"]
157 |     }
158 |
159 |
160 | tsconfig.base.json
161 | ------------------
162 |
163 |     {
164 |       "compilerOptions": {
165 |         "target": "ES2020",
166 |         "useDefineForClassFields": true,
167 |         "lib": ["ES2020", "DOM", "DOM.Iterable"],
168 |         "module": "ESNext",
169 |         "skipLibCheck": true,
170 |         "moduleResolution": "bundler",
171 |         "resolveJsonModule": true,
172 |         "isolatedModules": true,
173 |         "noEmit": true,
174 |         "jsx": "react-jsx",
175 |         "strict": true,
176 |         "forceConsistentCasingInFileNames": true,
177 |         "esModuleInterop": true,
178 |         "noFallthroughCasesInSwitch": true,
179 |         "baseUrl": ".",
180 |         "paths": {
181 |           "@/app/*": ["src/app/*"],
182 |           "@/components/*": ["src/components/*"],
183 |           "@/features/*": ["src/features/*"],
184 |           "@/data/*": ["src/data/*"],
185 |           "@/pages/*": ["src/pages/*"],
186 |           "@/viz/*": ["src/viz/*"],
187 |           "@/styles/*": ["src/styles/*"],
188 |           "@/utils/*": ["src/utils/*"]
189 |         }
190 |       }
191 |     }
192 |
193 |
194 | * * *
195 |
196 | vite.config.ts
197 | --------------
198 |
199 |     import { defineConfig } from 'vite'
200 |     import react from '@vitejs/plugin-react'
201 |     import { VitePWA } from 'vite-plugin-pwa'
202 |
203 |     export default defineConfig({
204 |       plugins: [
205 |         react(),
206 |         VitePWA({
207 |           registerType: 'autoUpdate',
208 |           includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
209 |           workbox: {
210 |             runtimeCaching: [
211 |               {
212 |                 urlPattern: /\/data\/playbook\.json$/,
213 |                 handler: 'StaleWhileRevalidate',
214 |                 options: { cacheName: 'playbook-json' }
215 |               }
216 |             ]
217 |           },
218 |           manifest: {
219 |             name: 'LLM Agent Playbook Explorer',
220 |             short_name: 'Playbook',
221 |             description: 'Explore the LLM Coding Agent Playbook for Solo Developers',
222 |             theme_color: '#0ea5e9',
223 |             background_color: '#0b1220',
224 |             display: 'standalone',
225 |             start_url: '/',
226 |             icons: [
227 |               { src: '/icons/pwa-192.png', sizes: '192x192', type: 'image/png' },
228 |               { src: '/icons/pwa-512.png', sizes: '512x512', type: 'image/png' }
229 |             ]
230 |           }
231 |         })
232 |       ],
233 |       server: { port: 5173 },
234 |       build: { sourcemap: true },
235 |       define: {
236 |         __APP_VERSION__: JSON.stringify('1.0.0')
237 |       }
238 |     })
239 |
240 |
241 | * * *
242 |
243 | postcss.config.cjs
244 | ------------------
245 |
246 |     module.exports = {
247 |       plugins: {
248 |         tailwindcss: {},
249 |         autoprefixer: {},
250 |       },
251 |     }
252 |
253 |
254 | tailwind.config.ts
255 | ------------------
256 |
257 |     import type { Config } from 'tailwindcss'
258 |
259 |     export default {
260 |       darkMode: ['class'],
261 |       content: [
262 |         './index.html',
263 |         './src/**/*.{ts,tsx}',
264 |         './.storybook/**/*.{ts,tsx}'
265 |       ],
266 |       theme: {
267 |         extend: {
268 |           colors: {
269 |             brand: {
270 |               DEFAULT: '#0ea5e9',
271 |               50: '#e0f2fe', 100: '#bae6fd', 200: '#7dd3fc', 300: '#38bdf8', 400: '#0ea5e9', 500: '#0284c7'
272 |             }
273 |           },
274 |           container: { center: true, padding: '1rem' }
275 |         }
276 |       },
277 |       plugins: []
278 |     } satisfies Config
279 |
280 |
281 | * * *
282 |
283 | .eslintrc.cjs
284 | -------------
285 |
286 |     module.exports = {
287 |       root: true,
288 |       env: { browser: true, es2022: true },
289 |       parser: '@typescript-eslint/parser',
290 |       parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
291 |       plugins: ['react', 'react-hooks', '@typescript-eslint', 'unused-imports'],
292 |       extends: [
293 |         'eslint:recommended',
294 |         'plugin:react/recommended',
295 |         'plugin:react-hooks/recommended',
296 |         'plugin:@typescript-eslint/recommended',
297 |         'plugin:storybook/recommended',
298 |         'prettier'
299 |       ],
300 |       settings: { react: { version: 'detect' } },
301 |       rules: {
302 |         'react/react-in-jsx-scope': 'off',
303 |         'unused-imports/no-unused-imports': 'error'
304 |       }
305 |     }
306 |
307 |
308 | .prettierrc
309 | -----------
310 |
311 |     {
312 |       "semi": false,
313 |       "singleQuote": true,
314 |       "trailingComma": "es5",
315 |       "printWidth": 100
316 |     }
317 |
318 |
319 | .gitignore
320 | ----------
321 |
322 |     node_modules
323 |     .vscode
324 |     .DS_Store
325 |     coverage
326 |     playwright-report
327 |     storybook-static
328 |     /dist
329 |     /.vite
330 |     /.cache
331 |
332 |
333 | .husky/pre-commit
334 | -----------------
335 |
336 |     #!/usr/bin/env sh
337 |     . "$(dirname -- "$0")/_/husky.sh"
338 |
339 |     pnpm lint-staged || npx lint-staged
340 |
341 |
342 | .husky/commit-msg
343 | -----------------
344 |
345 |     #!/usr/bin/env sh
346 |     . "$(dirname -- "$0")/_/husky.sh"
347 |
348 |     npx --no-install commitlint --edit $1
349 |
350 |
351 | lint-staged.config.mjs
352 | ----------------------
353 |
354 |     export default {
355 |       '*.{ts,tsx,css,md,json}': ['prettier --write'],
356 |       '*.{ts,tsx}': ['eslint --fix']
357 |     }
358 |
359 |
360 | commitlint.config.cjs
361 | ---------------------
362 |
363 |     module.exports = { extends: ['@commitlint/config-conventional'] }
364 |
365 |
366 | * * *
367 |
368 | index.html
369 | ----------
370 |
371 |     <!doctype html>
372 |     <html lang="en">
373 |       <head>
374 |         <meta charset="UTF-8" />
375 |         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
376 |         <meta
377 |           http-equiv="Content-Security-Policy"
378 |           content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' ws:; font-src 'self';"
379 |         />
380 |         <link rel="manifest" href="/manifest.webmanifest" />
381 |         <link rel="icon" href="/favicon.svg" />
382 |         <title>LLM Agent Playbook Explorer</title>
383 |       </head>
384 |       <body class="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
385 |         <a href="#app" class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-brand-400 text-white px-3 py-1 rounded">Skip to content</a>
386 |         <div id="root"></div>
387 |         <script type="module" src="/src/main.tsx"></script>
388 |       </body>
389 |     </html>
390 |
391 |
392 | * * *
393 |
394 | src/main.tsx
395 | ------------
396 |
397 |     import React from 'react'
398 |     import ReactDOM from 'react-dom/client'
399 |     import { RouterProvider } from 'react-router-dom'
400 |     import { router } from '@/app/router'
401 |     import '@/styles/global.css'
402 |
403 |     ReactDOM.createRoot(document.getElementById('root')!).render(
404 |       <React.StrictMode>
405 |         <RouterProvider router={router} />
406 |       </React.StrictMode>
407 |     )
408 |
409 |
410 | src/styles/global.css
411 | ---------------------
412 |
413 |     @tailwind base;
414 |     @tailwind components;
415 |     @tailwind utilities;
416 |
417 |     :root { --radius: 0.75rem; }
418 |     * { box-sizing: border-box; }
419 |
420 |
421 | * * *
422 |
423 | src/app/router.tsx
424 | ------------------
425 |
426 |     import { createBrowserRouter, createHashRouter } from 'react-router-dom'
427 |     import { AppShell } from './shell'
428 |     import { HomePage } from '@/pages/HomePage'
429 |     import { ExplorerPage } from '@/features/explorer/ExplorerPage'
430 |     import { ComparePage } from '@/features/compare/ComparePage'
431 |     import { PromptLabPage } from '@/features/prompts/PromptLabPage'
432 |     import { NotFound } from '@/pages/NotFound'
433 |
434 |     const useHash = false
435 |     const base = import.meta.env.VITE_BASE_PATH || '/'
436 |
437 |     export const router = (useHash ? createHashRouter : createBrowserRouter)([
438 |       {
439 |         path: base,
440 |         element: <AppShell />,
441 |         errorElement: <NotFound />,
442 |         children: [
443 |           { index: true, element: <HomePage /> },
444 |           { path: 'explore', element: <ExplorerPage /> },
445 |           { path: 'compare', element: <ComparePage /> },
446 |           { path: 'prompts', element: <PromptLabPage /> }
447 |         ]
448 |       }
449 |     ])
450 |
451 |
452 | src/app/shell.tsx
453 | -----------------
454 |
455 |     import { Outlet, NavLink, useLocation } from 'react-router-dom'
456 |     import { ThemeToggle } from '@/components/ThemeToggle'
457 |     import { CommandPalette } from '@/components/CommandPalette'
458 |     import { useEffect } from 'react'
459 |
460 |     export function AppShell() {
461 |       const { pathname } = useLocation()
462 |       useEffect(() => { document.title = `Playbook${pathname === '/' ? '' : ' • ' + pathname}` }, [pathname])
463 |       return (
464 |         <div id="app" className="min-h-dvh grid grid-rows-[auto_1fr]">
465 |           <header className="sticky top-0 z-30 border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur">
466 |             <div className="container flex items-center gap-4 py-3">
467 |               <NavLink to="/" className="font-bold text-xl">LLM Playbook</NavLink>
468 |               <nav className="ml-auto flex items-center gap-4">
469 |                 <NavLink to="/explore" className={({isActive})=>isActive?'text-brand-500':''}>Explore</NavLink>
470 |                 <NavLink to="/compare" className={({isActive})=>isActive?'text-brand-500':''}>Compare</NavLink>
471 |                 <NavLink to="/prompts" className={({isActive})=>isActive?'text-brand-500':''}>Prompts</NavLink>
472 |                 <ThemeToggle />
473 |                 <CommandPalette />
474 |               </nav>
475 |             </div>
476 |           </header>
477 |           <main className="container py-6">
478 |             <Outlet />
479 |           </main>
480 |         </div>
481 |       )
482 |     }
483 |
484 |
485 | src/app/store.ts
486 | ----------------
487 |
488 |     import { create } from 'zustand'
489 |
490 |     type SortKey = 'roi' | 'difficulty' | 'updated'
491 |
492 |     type ExploreState = {
493 |       q: string
494 |       phase: 'All' | 'Ideation'|'Scaffolding'|'Coding'|'Review'|'Testing'|'Deployment'
495 |       sort: SortKey
496 |       setQ: (q: string) => void
497 |       setPhase: (p: ExploreState['phase']) => void
498 |       setSort: (s: SortKey) => void
499 |     }
500 |
501 |     export const useExploreStore = create<ExploreState>((set) => ({
502 |       q: '',
503 |       phase: 'All',
504 |       sort: 'roi',
505 |       setQ: (q) => set({ q }),
506 |       setPhase: (phase) => set({ phase }),
507 |       setSort: (sort) => set({ sort }),
508 |     }))
509 |
510 |
511 | * * *
512 |
513 | src/components/ui/card.tsx
514 | --------------------------
515 |
516 |     import { cn } from '@/utils/cn'
517 |     export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
518 |       return <div className={cn('rounded-2xl border shadow-sm p-4 bg-white dark:bg-slate-900', className)} {...props} />
519 |     }
520 |
521 |
522 | src/components/ui/badge.tsx
523 | ---------------------------
524 |
525 |     import { cn } from '@/utils/cn'
526 |     export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
527 |       return <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-xs', className)}>{children}</span>
528 |     }
529 |
530 |
531 | src/components/ThemeToggle.tsx
532 | ------------------------------
533 |
534 |     import { useEffect, useState } from 'react'
535 |
536 |     export function ThemeToggle() {
537 |       const [dark, setDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
538 |       useEffect(()=>{ document.documentElement.classList.toggle('dark', dark) },[dark])
539 |       return (
540 |         <button aria-label="Toggle theme" className="rounded-lg border px-2 py-1" onClick={()=>setDark(d=>!d)}>
541 |           {dark ? '🌙' : '☀️'}
542 |         </button>
543 |       )
544 |     }
545 |
546 |
547 | src/components/KpiCard.tsx
548 | --------------------------
549 |
550 |     import { Card } from './ui/card'
551 |
552 |     export function KpiCard({ label, value }: { label: string; value: number }) {
553 |       return (
554 |         <Card className="flex items-center justify-between">
555 |           <div className="text-sm text-slate-500">{label}</div>
556 |           <div className="text-2xl font-semibold">{value}</div>
557 |         </Card>
558 |       )
559 |     }
560 |
561 |
562 | src/components/SearchInput.tsx
563 | ------------------------------
564 |
565 |     import { useRef, useEffect } from 'react'
566 |
567 |     export function SearchInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
568 |       const ref = useRef<HTMLInputElement>(null)
569 |       useEffect(() => {
570 |         const onKey = (e: KeyboardEvent) => {
571 |           if (e.key === '/') {
572 |             const el = ref.current
573 |             if (el) {
574 |               e.preventDefault()
575 |               el.focus()
576 |             }
577 |           }
578 |         }
579 |         window.addEventListener('keydown', onKey)
580 |         return () => window.removeEventListener('keydown', onKey)
581 |       }, [])
582 |       return (
583 |         <div className="relative">
584 |           <input
585 |             ref={ref}
586 |             aria-label="Search"
587 |             className="w-full rounded-xl border px-3 py-2 pr-10"
588 |             placeholder="Search…"
589 |             value={value}
590 |             onChange={(e) => onChange(e.target.value)}
591 |           />
592 |           <kbd className="absolute right-2 top-2 text-xs text-slate-500">/</kbd>
593 |         </div>
594 |       )
595 |     }
596 |
597 |
598 | src/components/CommandPalette.tsx
599 | ---------------------------------
600 |
601 |     import { useEffect, useMemo, useState } from 'react'
602 |     import Fuse from 'fuse.js'
603 |     import { usePlaybook } from '@/data/repo'
604 |
605 |     export function CommandPalette() {
606 |       const [open, setOpen] = useState(false)
607 |       const { data } = usePlaybook()
608 |       const fuse = useMemo(()=> new Fuse([
609 |         ...data.patterns, ...data.workflows, ...data.tools, ...data.prompts
610 |       ].map(x=>({ id: 'title' in x ? x.id : (x as any).name, title: 'title' in x ? x.title : (x as any).name, type: (x as any).phase || (x as any).category || 'item'})), { keys: ['title'] }), [data])
611 |       const [q, setQ] = useState('')
612 |       const results = q ? fuse.search(q).slice(0,10) : []
613 |
614 |       useEffect(()=>{
615 |         const onKey=(e: KeyboardEvent)=>{
616 |           if((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==='k'){ e.preventDefault(); setOpen(o=>!o)}
617 |         }
618 |         window.addEventListener('keydown', onKey)
619 |         return ()=>window.removeEventListener('keydown', onKey)
620 |       },[])
621 |
622 |       return (
623 |         <>
624 |           <button className="rounded-xl border px-3 py-1" aria-haspopup="dialog" aria-expanded={open} onClick={()=>setOpen(true)}>⌘K</button>
625 |           {open && (
626 |             <div role="dialog" aria-modal className="fixed inset-0 bg-black/40 grid place-items-start pt-[10vh]">
627 |               <div className="mx-auto w-full max-w-xl rounded-2xl border bg-white p-3 dark:bg-slate-900">
628 |                 <input autoFocus className="w-full rounded-xl border px-3 py-2" placeholder="Type to search" value={q} onChange={e=>setQ(e.target.value)} />
629 |                 <ul className="max-h-80 overflow-auto mt-2 divide-y">
630 |                   {results.map(r=> (
631 |                     <li key={r.item.id} className="py-2 text-sm flex justify-between">
632 |                       <span>{r.item.title}</span>
633 |                       <span className="text-slate-500">{r.item.type}</span>
634 |                     </li>
635 |                   ))}
636 |                   {!results.length && q && <li className="py-6 text-center text-slate-500">No results</li>}
637 |                 </ul>
638 |                 <div className="flex justify-end gap-2 mt-2">
639 |                   <button className="rounded-xl border px-3 py-1" onClick={()=>setOpen(false)}>Close</button>
640 |                 </div>
641 |               </div>
642 |             </div>
643 |           )}
644 |         </>
645 |       )
646 |     }
647 |
648 |
649 | * * *
650 |
651 | src/data/schemas.ts
652 | -------------------
653 |
654 |     import { z } from 'zod'
655 |
656 |     export const zRef = z.object({ id: z.string(), type: z.enum(['pattern','workflow','tool','prompt','metric','risk']), weight: z.number().optional() })
657 |
658 |     export const zPattern = z.object({
659 |       id: z.string(), title: z.string(), summary: z.string(),
660 |       phase: z.enum(['Ideation','Scaffolding','Coding','Review','Testing','Deployment']),
661 |       difficulty: z.enum(['Beginner','Intermediate','Advanced']),
662 |       roi: z.number().min(0).max(10),
663 |       steps: z.array(z.string()),
664 |       bestPractices: z.array(z.string()),
665 |       antiPatterns: z.array(z.string()).optional(),
666 |       prompts: z.array(z.string()).optional(),
667 |       tools: z.array(z.string()).optional(),
668 |       metrics: z.array(z.string()).optional(),
669 |       risks: z.array(z.string()).optional(),
670 |       tags: z.array(z.string()).default([]),
671 |       links: z.array(z.string()).optional(),
672 |       relations: z.array(zRef).default([])
673 |     })
674 |
675 |     export const zWorkflow = z.object({
676 |       id: z.string(), title: z.string(), summary: z.string(),
677 |       stages: z.array(z.object({ name: z.string(), goals: z.array(z.string()), artifacts: z.array(z.string()).optional() })),
678 |       kpis: z.array(z.string()).optional(),
679 |       tags: z.array(z.string()).default([]),
680 |       relations: z.array(zRef).default([])
681 |     })
682 |
683 |     export const zTool = z.object({ id: z.string(), name: z.string(), category: z.string(), cost: z.string().optional(), url: z.string().url().optional(), strengths: z.array(z.string()), limits: z.array(z.string()), tags: z.array(z.string()).default([]), relations: z.array(zRef).default([]) })
684 |     export const zPrompt = z.object({ id: z.string(), title: z.string(), body: z.string(), useCases: z.array(z.string()), inputs: z.array(z.string()).optional(), outputs: z.array(z.string()).optional(), tags: z.array(z.string()).default([]), relations: z.array(zRef).default([]) })
685 |     export const zMetric = z.object({ id: z.string(), name: z.string(), desc: z.string(), scale: z.enum(['ordinal','ratio','percent']), compute: z.string().optional(), tags: z.array(z.string()).default([]) })
686 |     export const zRisk = z.object({ id: z.string(), name: z.string(), mitigation: z.array(z.string()), severity: z.enum(['Low','Med','High']), tags: z.array(z.string()).default([]) })
687 |
688 |     export const zPlaybook = z.object({
689 |       version: z.string(),
690 |       updatedAt: z.string(),
691 |       patterns: z.array(zPattern),
692 |       workflows: z.array(zWorkflow),
693 |       tools: z.array(zTool),
694 |       prompts: z.array(zPrompt),
695 |       metrics: z.array(zMetric),
696 |       risks: z.array(zRisk)
697 |     })
698 |
699 |     export type Playbook = z.infer<typeof zPlaybook>
700 |     export type Pattern = z.infer<typeof zPattern>
701 |     export type Workflow = z.infer<typeof zWorkflow>
702 |     export type Tool = z.infer<typeof zTool>
703 |     export type Prompt = z.infer<typeof zPrompt>
704 |     export type Metric = z.infer<typeof zMetric>
705 |     export type Risk = z.infer<typeof zRisk>
706 |
707 |
708 | src/data/repo.ts
709 | ----------------
710 |
711 |     import { useEffect, useState } from 'react'
712 |     import { zPlaybook, type Playbook } from './schemas'
713 |
714 |     export function usePlaybook() {
715 |       const [data, setData] = useState<Playbook>({
716 |         version: '0', updatedAt: new Date().toISOString(), patterns: [], workflows: [], tools: [], prompts: [], metrics: [], risks: []
717 |       })
718 |       const [loading, setLoading] = useState(true)
719 |       const [error, setError] = useState<string | null>(null)
720 |       useEffect(() => {
721 |         ;(async () => {
722 |           try {
723 |             const res = await fetch('/data/playbook.json')
724 |             const json = await res.json()
725 |             const parsed = zPlaybook.parse(json)
726 |             setData(parsed)
727 |           } catch (e: any) {
728 |             setError(e?.message || 'Failed to load playbook')
729 |           } finally {
730 |             setLoading(false)
731 |           }
732 |         })()
733 |       }, [])
734 |       return { data, loading, error }
735 |     }
736 |
737 |
738 | src/data/indexer.ts
739 | -------------------
740 |
741 |     import Fuse from 'fuse.js'
742 |     import type { Playbook } from './schemas'
743 |
744 |     export function buildIndex(pb: Playbook) {
745 |       const items = [
746 |         ...pb.patterns.map((p) => ({ id: p.id, title: p.title, tags: p.tags.join(' '), type: 'pattern' })),
747 |         ...pb.workflows.map((w) => ({ id: w.id, title: w.title, tags: w.tags.join(' '), type: 'workflow' })),
748 |         ...pb.tools.map((t) => ({ id: t.id, title: t.name, tags: t.tags.join(' '), type: 'tool' })),
749 |         ...pb.prompts.map((p) => ({ id: p.id, title: p.title, tags: p.tags.join(' '), type: 'prompt' })),
750 |       ]
751 |       const fuse = new Fuse(items, { keys: ['title', 'tags'], threshold: 0.35 })
752 |       return { fuse }
753 |     }
754 |
755 |
756 | * * *
757 |
758 | src/pages/HomePage.tsx
759 | ----------------------
760 |
761 |     import { usePlaybook } from '@/data/repo'
762 |     import { KpiCard } from '@/components/KpiCard'
763 |     import { Card } from '@/components/ui/card'
764 |
765 |     export function HomePage() {
766 |       const { data, loading, error } = usePlaybook()
767 |       if (loading) return <div>Loading…</div>
768 |       if (error) return <div role="alert" className="text-red-600">{error}</div>
769 |
770 |       return (
771 |         <div className="grid gap-6">
772 |           <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
773 |             <KpiCard label="Patterns" value={data.patterns.length} />
774 |             <KpiCard label="Workflows" value={data.workflows.length} />
775 |             <KpiCard label="Tools" value={data.tools.length} />
776 |             <KpiCard label="Prompts" value={data.prompts.length} />
777 |           </section>
778 |           <Card>
779 |             <h2 className="text-xl font-semibold">Welcome</h2>
780 |             <p className="mt-2 text-slate-600 dark:text-slate-300">Explore the playbook via the Explore tab, compare items, or open the command palette with <kbd>⌘/Ctrl</kbd>+<kbd>K</kbd>.</p>
781 |             <p className="text-sm mt-2">Version: {data.version} • Updated: {new Date(data.updatedAt).toLocaleDateString()}</p>
782 |           </Card>
783 |         </div>
784 |       )
785 |     }
786 |
787 |
788 | src/pages/NotFound.tsx
789 | ----------------------
790 |
791 |     export function NotFound(){
792 |       return <div className="prose dark:prose-invert">
793 |         <h1>Oops</h1>
794 |         <p>We couldn't find that page.</p>
795 |       </div>
796 |     }
797 |
798 |
799 | * * *
800 |
801 | src/features/explorer/ExplorerPage.tsx
802 | --------------------------------------
803 |
804 |     import { useMemo } from 'react'
805 |     import { usePlaybook } from '@/data/repo'
806 |     import { SearchInput } from '@/components/SearchInput'
807 |     import { Badge } from '@/components/ui/badge'
808 |     import { Card } from '@/components/ui/card'
809 |     import Fuse from 'fuse.js'
810 |     import { useExploreStore } from '@/app/store'
811 |     import { RoiDifficultyScatter } from '@/viz/RoiDifficultyScatter'
812 |
813 |     export function ExplorerPage() {
814 |       const { data } = usePlaybook()
815 |       const { q, phase, sort, setQ, setPhase, setSort } = useExploreStore()
816 |
817 |       const items = useMemo(() => {
818 |         const patterns = data.patterns
819 |         const filtered = phase==='All' ? patterns : patterns.filter(p=>p.phase===phase)
820 |         const scored = [...filtered]
821 |         if (sort==='roi') scored.sort((a,b)=> b.roi - a.roi)
822 |         if (sort==='difficulty') scored.sort((a,b)=> a.difficulty.localeCompare(b.difficulty))
823 |         if (sort==='updated') scored.sort(()=>0) // no per-item timestamps in seed; stable
824 |         if (!q) return scored
825 |         const fuse = new Fuse(scored, { keys:['title','summary','tags'], threshold:0.35 })
826 |         return fuse.search(q).map(r=>r.item)
827 |       }, [data, q, phase, sort])
828 |
829 |       return (
830 |         <div className="grid gap-6">
831 |           <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
832 |             <SearchInput value={q} onChange={setQ} />
833 |             <select aria-label="Phase filter" className="rounded-xl border px-3" value={phase} onChange={e=>setPhase(e.target.value as any)}>
834 |               {['All','Ideation','Scaffolding','Coding','Review','Testing','Deployment'].map(p=> <option key={p}>{p}</option>)}
835 |             </select>
836 |             <select aria-label="Sort" className="rounded-xl border px-3" value={sort} onChange={e=>setSort(e.target.value as any)}>
837 |               <option value="roi">Sort by ROI</option>
838 |               <option value="difficulty">Sort by Difficulty</option>
839 |               <option value="updated">Sort by Updated</option>
840 |             </select>
841 |           </div>
842 |
843 |           <Card>
844 |             <h3 className="font-semibold mb-2">ROI vs Difficulty</h3>
845 |             <RoiDifficultyScatter data={data.patterns} />
846 |           </Card>
847 |
848 |           <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
849 |             {items.map(p => (
850 |               <li key={p.id}>
851 |                 <Card>
852 |                   <div className="flex items-start justify-between gap-3">
853 |                     <div>
854 |                       <h3 className="font-semibold">{p.title}</h3>
855 |                       <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3">{p.summary}</p>
856 |                     </div>
857 |                     <Badge className="bg-brand-50 dark:bg-slate-800 border-brand-200">ROI {p.roi}</Badge>
858 |                   </div>
859 |                   <div className="mt-2 flex flex-wrap gap-2 text-xs">
860 |                     <Badge>{p.phase}</Badge>
861 |                     <Badge>{p.difficulty}</Badge>
862 |                     {p.tags.slice(0,3).map(t=> <Badge key={t}>{t}</Badge>)}
863 |                   </div>
864 |                 </Card>
865 |               </li>
866 |             ))}
867 |           </ul>
868 |         </div>
869 |       )
870 |     }
871 |
872 |
873 | * * *
874 |
875 | src/features/compare/ComparePage.tsx
876 | ------------------------------------
877 |
878 |     import { usePlaybook } from '@/data/repo'
879 |     import { Card } from '@/components/ui/card'
880 |
881 |     export function ComparePage(){
882 |       const { data } = usePlaybook()
883 |       const take = (arr:any[], n=3)=>arr.slice(0,n)
884 |       const rows = take(data.patterns, 3)
885 |       return (
886 |         <Card>
887 |           <h2 className="text-xl font-semibold mb-3">Quick Compare (sample)</h2>
888 |           <div className="overflow-auto">
889 |             <table className="min-w-[600px] text-sm">
890 |               <thead><tr>
891 |                 <th className="text-left p-2">Attribute</th>
892 |                 {rows.map(p=> <th key={p.id} className="text-left p-2">{p.title}</th>)}
893 |               </tr></thead>
894 |               <tbody>
895 |                 <tr><td className="p-2">Phase</td>{rows.map(p=> <td key={p.id} className="p-2">{p.phase}</td>)}</tr>
896 |                 <tr><td className="p-2">Difficulty</td>{rows.map(p=> <td key={p.id} className="p-2">{p.difficulty}</td>)}</tr>
897 |                 <tr><td className="p-2">ROI</td>{rows.map(p=> <td key={p.id} className="p-2">{p.roi}</td>)}</tr>
898 |                 <tr><td className="p-2">Best Practices</td>{rows.map(p=> <td key={p.id} className="p-2">{p.bestPractices.slice(0,3).join(', ')}</td>)}</tr>
899 |               </tbody>
900 |             </table>
901 |           </div>
902 |         </Card>
903 |       )
904 |     }
905 |
906 |
907 | * * *
908 |
909 | src/features/prompts/PromptLabPage.tsx
910 | --------------------------------------
911 |
912 |     import { usePlaybook } from '@/data/repo'
913 |     import { Card } from '@/components/ui/card'
914 |
915 |     export function PromptLabPage(){
916 |       const { data } = usePlaybook()
917 |       const copy = async (text: string)=> navigator.clipboard.writeText(text)
918 |       return (
919 |         <div className="grid gap-3 sm:grid-cols-2">
920 |           {data.prompts.map(p=> (
921 |             <Card key={p.id}>
922 |               <div className="flex items-start justify-between">
923 |                 <h3 className="font-semibold">{p.title}</h3>
924 |                 <button className="rounded-xl border px-2 py-1 text-xs" onClick={()=>copy(p.body)}>Copy</button>
925 |               </div>
926 |               <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">{p.body}</p>
927 |             </Card>
928 |           ))}
929 |         </div>
930 |       )
931 |     }
932 |
933 |
934 | * * *
935 |
936 | src/viz/RoiDifficultyScatter.tsx
937 | --------------------------------
938 |
939 |     import { ResponsiveContainer, ScatterChart, XAxis, YAxis, Tooltip, Scatter } from 'recharts'
940 |     import type { Pattern } from '@/data/schemas'
941 |
942 |     const diffMap: Record<Pattern['difficulty'], number> = { Beginner: 1, Intermediate: 2, Advanced: 3 }
943 |
944 |     export function RoiDifficultyScatter({ data }: { data: Pattern[] }){
945 |       const points = data.map(p=> ({ x: diffMap[p.difficulty], y: p.roi, name: p.title }))
946 |       return (
947 |         <div className="h-72">
948 |           <ResponsiveContainer width="100%" height="100%">
949 |             <ScatterChart>
950 |               <XAxis dataKey="x" name="Difficulty" tickFormatter={(v)=>({1:'Beginner',2:'Intermediate',3:'Advanced'} as any)[v]} domain={[1,3]} allowDecimals={false} />
951 |               <YAxis dataKey="y" name="ROI" domain={[0,10]} />
952 |               <Tooltip cursor={{ strokeDasharray: '3 3' }} />
953 |               <Scatter data={points} />
954 |             </ScatterChart>
955 |           </ResponsiveContainer>
956 |         </div>
957 |       )
958 |     }
959 |
960 |
961 | * * *
962 |
963 | src/utils/cn.ts
964 | ---------------
965 |
966 |     export function cn(...parts: (string | undefined | false | null)[]) {
967 |       return parts.filter(Boolean).join(' ')
968 |     }
969 |
970 |
971 | * * *
972 |
973 | vitest.setup.ts
974 | ---------------
975 |
976 |     import '@testing-library/jest-dom'
977 |
978 |
979 | src/**tests**/schemas.test.ts
980 | -----------------------------
981 |
982 |     import { describe, it, expect } from 'vitest'
983 |     import { zPlaybook } from '@/data/schemas'
984 |
985 |     const sample = {
986 |       version: '1.0.0',
987 |       updatedAt: '2025-08-01',
988 |       patterns: [], workflows: [], tools: [], prompts: [], metrics: [], risks: []
989 |     }
990 |
991 |     describe('schemas', () => {
992 |       it('parses playbook', () => {
993 |         const parsed = zPlaybook.parse(sample)
994 |         expect(parsed.version).toBe('1.0.0')
995 |       })
996 |     })
997 |
998 |
999 | * * *
1000 |
1001 | e2e/playwright.config.ts
1002 | ------------------------
1003 |
1004 |     import { defineConfig } from '@playwright/test'
1005 |     export default defineConfig({
1006 |       testDir: './tests',
1007 |       use: { baseURL: 'http://localhost:5173' },
1008 |       webServer: { command: 'pnpm preview', port: 5173, reuseExistingServer: !process.env.CI }
1009 |     })
1010 |
1011 |
1012 | e2e/tests/smoke.spec.ts
1013 | -----------------------
1014 |
1015 |     import { test, expect } from '@playwright/test'
1016 |
1017 |     test('home loads and shows KPIs', async ({ page }) => {
1018 |       await page.goto('/')
1019 |       await expect(page.getByText('Patterns')).toBeVisible()
1020 |     })
1021 |
1022 |
1023 | * * *
1024 |
1025 | .github/workflows/ci.yml
1026 | ------------------------
1027 |
1028 |     name: CI
1029 |     on: [push, pull_request]
1030 |     jobs:
1031 |       build:
1032 |         runs-on: ubuntu-latest
1033 |         steps:
1034 |           - uses: actions/checkout@v4
1035 |           - uses: actions/setup-node@v4
1036 |             with: { node-version: 20 }
1037 |           - name: Install
1038 |             run: |
1039 |               corepack enable
1040 |               pnpm install --frozen-lockfile || npm ci
1041 |           - name: Lint
1042 |             run: |
1043 |               pnpm lint || npm run lint
1044 |           - name: Typecheck
1045 |             run: |
1046 |               pnpm typecheck || npm run typecheck
1047 |           - name: Unit tests
1048 |             run: |
1049 |               pnpm test || npm test
1050 |           - name: Build
1051 |             run: |
1052 |               pnpm build || npm run build
1053 |           - name: E2E
1054 |             run: |
1055 |               pnpm e2e || npm run e2e
1056 |
1057 |
1058 | * * *
1059 |
1060 | .storybook/main.ts
1061 | ------------------
1062 |
1063 |     import type { StorybookConfig } from '@storybook/react-vite'
1064 |     const config: StorybookConfig = {
1065 |       stories: ['../src/**/*.stories.@(ts|tsx)'],
1066 |       addons: ['@storybook/addon-essentials', '@storybook/addon-interactions', '@storybook/addon-themes'],
1067 |       framework: { name: '@storybook/react-vite', options: {} },
1068 |     }
1069 |     export default config
1070 |
1071 |
1072 | .storybook/preview.ts
1073 | ---------------------
1074 |
1075 |     import '../src/styles/global.css'
1076 |     export const parameters = { controls: { expanded: true } }
1077 |
1078 |
1079 | src/components/KpiCard.stories.tsx
1080 | ----------------------------------
1081 |
1082 |     import type { Meta, StoryObj } from '@storybook/react'
1083 |     import { KpiCard } from './KpiCard'
1084 |
1085 |     const meta: Meta<typeof KpiCard> = { component: KpiCard, title: 'UI/KpiCard' }
1086 |     export default meta
1087 |     export const Basic: StoryObj<typeof KpiCard> = { args: { label: 'Patterns', value: 12 } }
1088 |
1089 |
1090 | * * *
1091 |
1092 | public/manifest.webmanifest
1093 | ---------------------------
1094 |
1095 |     {
1096 |       "name": "LLM Agent Playbook Explorer",
1097 |       "short_name": "Playbook",
1098 |       "start_url": "/",
1099 |       "display": "standalone",
1100 |       "background_color": "#0b1220",
1101 |       "theme_color": "#0ea5e9",
1102 |       "icons": [
1103 |         { "src": "/icons/pwa-192.png", "sizes": "192x192", "type": "image/png" },
1104 |         { "src": "/icons/pwa-512.png", "sizes": "512x512", "type": "image/png" }
1105 |       ]
1106 |     }
1107 |
1108 |
1109 | public/favicon.svg
1110 | ------------------
1111 |
1112 |
1113 |
1114 | public/icons/pwa-192.png
1115 | ------------------------
1116 |
1117 | _(placeholder; generate PNG 192x192)_
1118 |
1119 | public/icons/pwa-512.png
1120 | ------------------------
1121 |
1122 | _(placeholder; generate PNG 512x512)_
1123 |
1124 | * * *
1125 |
1126 | public/data/playbook.json
1127 | -------------------------
1128 |
1129 |     {
1130 |       "version": "1.0.0",
1131 |       "updatedAt": "2025-08-21",
1132 |       "patterns": [
1133 |         {
1134 |           "id": "spec-driven-development",
1135 |           "title": "Specification-Driven Development (Specs as Code)",
1136 |           "summary": "Treat specs, AC, and ADRs as the primary source programming the agent. Precise docs become executable constraints.",
1137 |           "phase": "Ideation",
1138 |           "difficulty": "Intermediate",
1139 |           "roi": 8,
1140 |           "steps": [
1141 |             "Draft machine-checkable spec and acceptance criteria",
1142 |             "Reference relevant ADRs and conventions",
1143 |             "Store in repo for retrieval by agents"
1144 |           ],
1145 |           "bestPractices": [
1146 |             "Use structured templates for specs and ADRs",
1147 |             "Keep acceptance criteria verifiable",
1148 |             "Version control prompts and system instructions"
1149 |           ],
1150 |           "antiPatterns": [
1151 |             "Vague requirements with unstated constraints",
1152 |             "Specs spread across chats and DMs"
1153 |           ],
1154 |           "prompts": ["planner-architect-agent"],
1155 |           "tools": ["cursor", "aider"],
1156 |           "metrics": ["task-success-rate"],
1157 |           "risks": ["specification-drift"],
1158 |           "tags": ["foundation", "spec-first", "adr", "acceptance-criteria"],
1159 |           "links": [],
1160 |           "relations": [
1161 |             { "id": "solo-dev-e2e-workflow", "type": "workflow", "weight": 0.9 },
1162 |             { "id": "typed-structured-output", "type": "pattern", "weight": 0.6 }
1163 |           ]
1164 |         },
1165 |         {
1166 |           "id": "patch-diff-workflow",
1167 |           "title": "Patch/Diff Workflow",
1168 |           "summary": "Agents propose unified diffs for auditable, reversible changes; humans apply after checks.",
1169 |           "phase": "Coding",
1170 |           "difficulty": "Beginner",
1171 |           "roi": 9,
1172 |           "steps": [
1173 |             "Agent outputs unified diff instead of writing files",
1174 |             "Run format, lint, typecheck, and tests",
1175 |             "Review and apply or iterate"
1176 |           ],
1177 |           "bestPractices": [
1178 |             "Small, focused diffs",
1179 |             "CI gates for lint/type/tests",
1180 |             "Guardrails with allowlisted paths"
1181 |           ],
1182 |           "prompts": ["reviewer-refactorer-agent"],
1183 |           "tools": ["aider"],
1184 |           "metrics": ["diff-churn"],
1185 |           "risks": ["file-thrashing"],
1186 |           "tags": ["safety", "audit", "git"],
1187 |           "relations": [
1188 |             { "id": "solo-dev-e2e-workflow", "type": "workflow", "weight": 0.8 },
1189 |             { "id": "spec-driven-development", "type": "pattern", "weight": 0.4 }
1190 |           ]
1191 |         },
1192 |         {
1193 |           "id": "typed-structured-output",
1194 |           "title": "Typed Structured Output & Function Calling",
1195 |           "summary": "Constrain agent replies to JSON schemas and tool calls to improve predictability.",
1196 |           "phase": "Review",
1197 |           "difficulty": "Intermediate",
1198 |           "roi": 7,
1199 |           "steps": [
1200 |             "Define JSON schema (Zod/Pydantic)",
1201 |             "Validate outputs and retry on failure",
1202 |             "Use native tool/function calling where possible"
1203 |           ],
1204 |           "bestPractices": [
1205 |             "Keep schemas minimal and explicit",
1206 |             "Fail fast on invalid output",
1207 |             "Validate in CI"
1208 |           ],
1209 |           "prompts": ["planner-architect-agent", "reviewer-refactorer-agent"],
1210 |           "tools": [],
1211 |           "metrics": ["task-success-rate"],
1212 |           "risks": ["specification-drift"],
1213 |           "tags": ["schema", "validation", "tool-calls"],
1214 |           "relations": [
1215 |             { "id": "spec-driven-development", "type": "pattern", "weight": 0.7 }
1216 |           ]
1217 |         }
1218 |       ],
1219 |       "workflows": [
1220 |         {
1221 |           "id": "solo-dev-e2e-workflow",
1222 |           "title": "Solo Developer Agentic Loop",
1223 |           "summary": "Idea → Spec → Scaffold → Iterative Coding (test-first) → Docs → Review & Release.",
1224 |           "stages": [
1225 |             { "name": "Idea → Spec", "goals": ["Formalize feature into machine-checkable spec", "Draft ADRs"], "artifacts": ["SPEC.md", "ADR/NNN.md", "AC checklist"] },
1226 |             { "name": "Scaffold", "goals": ["Create file/folder skeleton", "Set up tests/CI"], "artifacts": ["repo tree", "tests/"] },
1227 |             { "name": "Iterative Coding", "goals": ["Tiny tasks", "Failing test first", "Diff-based changes"], "artifacts": ["patches", "commits"] },
1228 |             { "name": "Docs", "goals": ["Generate comments, README updates"], "artifacts": ["docs"] },
1229 |             { "name": "Review & Release", "goals": ["PR with context", "CI gates", "Ship"], "artifacts": ["PR description", "changelog"] }
1230 |           ],
1231 |           "kpis": ["task-success-rate", "diff-churn"],
1232 |           "tags": ["workflow", "loop"],
1233 |           "relations": [
1234 |             { "id": "patch-diff-workflow", "type": "pattern", "weight": 0.7 },
1235 |             { "id": "spec-driven-development", "type": "pattern", "weight": 0.7 }
1236 |           ]
1237 |         }
1238 |       ],
1239 |       "tools": [
1240 |         {
1241 |           "id": "aider",
1242 |           "name": "Aider",
1243 |           "category": "CLI",
1244 |           "url": "https://aider.chat",
1245 |           "strengths": ["Diff-based edits", "Git-native workflow", "Repo map context"],
1246 |           "limits": ["Requires local git setup", "Terminal-centric UI"],
1247 |           "tags": ["tool", "assistant"],
1248 |           "relations": [
1249 |             { "id": "patch-diff-workflow", "type": "pattern", "weight": 0.8 }
1250 |           ]
1251 |         },
1252 |         {
1253 |           "id": "cursor",
1254 |           "name": "Cursor",
1255 |           "category": "IDE",
1256 |           "url": "https://cursor.com",
1257 |           "strengths": ["Codebase-aware chat", "Inline agentic edits", "PR/issue context"],
1258 |           "limits": ["Desktop app dependency"],
1259 |           "tags": ["tool", "ide"],
1260 |           "relations": [
1261 |             { "id": "spec-driven-development", "type": "pattern", "weight": 0.6 }
1262 |           ]
1263 |         }
1264 |       ],
1265 |       "prompts": [
1266 |         {
1267 |           "id": "planner-architect-agent",
1268 |           "title": "Planner/Architect Agent",
1269 |           "body": "You are an expert architect. Produce a JSON-only plan with affected files, step-by-step tasks, and (if needed) a draft ADR. Conform strictly to the provided schema. Do not include commentary.",
1270 |           "useCases": ["Planning", "Decomposition", "ADR drafting"],
1271 |           "inputs": ["Feature request", "Existing ADRs", "Conventions"],
1272 |           "outputs": ["plan.json", "adr draft"],
1273 |           "tags": ["prompt", "planning"],
1274 |           "relations": [
1275 |             { "id": "spec-driven-development", "type": "pattern", "weight": 0.8 }
1276 |           ]
1277 |         },
1278 |         {
1279 |           "id": "reviewer-refactorer-agent",
1280 |           "title": "Reviewer/Refactorer Agent",
1281 |           "body": "You are a Principal Engineer. Given a code diff, output JSON review comments with file, line, comment, and severity. Enforce conventions and flag security/performance issues.",
1282 |           "useCases": ["Code review", "Quality gating"],
1283 |           "inputs": ["Unified diff", "CONVENTIONS.md"],
1284 |           "outputs": ["review.json"],
1285 |           "tags": ["prompt", "review"],
1286 |           "relations": [
1287 |             { "id": "patch-diff-workflow", "type": "pattern", "weight": 0.8 }
1288 |           ]
1289 |         }
1290 |       ],
1291 |       "metrics": [
1292 |         {
1293 |           "id": "task-success-rate",
1294 |           "name": "Task Success Rate",
1295 |           "desc": "Percent of tasks where final generated code passes verification.",
1296 |           "scale": "percent",
1297 |           "compute": "passed_tasks / total_tasks * 100",
1298 |           "tags": ["metric", "quality"]
1299 |         },
1300 |         {
1301 |           "id": "diff-churn",
1302 |           "name": "Diff Size / Churn",
1303 |           "desc": "Lines added+removed per patch; lower indicates tighter edits.",
1304 |           "scale": "ratio",
1305 |           "compute": "sum(|added| + |removed|) per patch",
1306 |           "tags": ["metric", "efficiency"]
1307 |         }
1308 |       ],
1309 |       "risks": [
1310 |         {
1311 |           "id": "specification-drift",
1312 |           "name": "Specification Drift / Goal Misalignment",
1313 |           "mitigation": [
1314 |             "Require human approval of planner output before coding",
1315 |             "Use structured spec templates and explicit AC"
1316 |           ],
1317 |           "severity": "High",
1318 |           "tags": ["risk", "spec"]
1319 |         },
1320 |         {
1321 |           "id": "file-thrashing",
1322 |           "name": "File Thrashing / Hallucinated Paths",
1323 |           "mitigation": [
1324 |             "Use patch/diff workflow with allowlisted paths",
1325 |             "Provide listFiles tool; verify path existence"
1326 |           ],
1327 |           "severity": "Med",
1328 |           "tags": ["risk", "fs"]
1329 |         }
1330 |       ]
1331 |     }
1332 |
1333 |
1334 | * * *
1335 |
1336 | e2e/tests/README.md
1337 | -------------------
1338 |
1339 |     # E2E Notes
1340 |
1341 |     Minimal smoke test ensures the app renders. Extend as needed.
1342 |
1343 |
1344 | * * *
1345 |
1346 | README.md
1347 | ---------
1348 |
1349 |     # LLM Agent Playbook Explorer
1350 |
1351 |     An interactive single-page app to explore the **LLM Coding Agent Playbook for Solo Developers**.
1352 |
1353 |     ## Quickstart
1354 |
1355 |     ```bash
1356 |     # with pnpm (recommended)
1357 |     corepack enable
1358 |     pnpm install
1359 |     pnpm dev
1360 |     # open http://localhost:5173
1361 |
1362 |
1363 | Scripts
1364 | -------
1365 |
1366 | *   `pnpm dev` – start dev server
1367 |
1368 | *   `pnpm build` – typecheck + build
1369 |
1370 | *   `pnpm preview` – preview prod build
1371 |
1372 | *   `pnpm test` / `pnpm test:watch` – unit tests (Vitest)
1373 |
1374 | *   `pnpm e2e` – Playwright E2E
1375 |
1376 | *   `pnpm lint` – ESLint
1377 |
1378 | *   `pnpm format` – Prettier
1379 |
1380 | *   `pnpm storybook` / `pnpm build-storybook` – Storybook
1381 |
1382 |
1383 | Data
1384 | ----
1385 |
1386 | Seed JSON at `public/data/playbook.json`. Content was normalized from the provided markdown report and validated with Zod on load. Invalid JSON surfaces a user-visible error.
1387 |
1388 | Tech
1389 | ----
1390 |
1391 | React 18 + TypeScript + Vite • React Router • Tailwind (dark mode) • Zustand (state) • Fuse.js (search) • Recharts (scatter) • (Optional) d3-sankey • Vitest • Playwright • Storybook • PWA.
1392 |
1393 | UX
1394 | --
1395 |
1396 | *   Sticky top nav with **Home**, **Explore**, **Compare**, **Prompts**
1397 |
1398 | *   Command Palette: <kbd>⌘/Ctrl</kbd>+<kbd>K</kbd>
1399 |
1400 | *   Keyboard: <kbd>/</kbd> focuses search
1401 |
1402 | *   Accessibility: skip link, ARIA on dialogs/inputs, visible focus states
1403 |
1404 |
1405 | Visualizations
1406 | --------------
1407 |
1408 | *   **Scatter** chart (ROI vs Difficulty) on Explore page.
1409 |
1410 | *   Sankey placeholder optional; hide when no data.
1411 |
1412 |
1413 | PWA
1414 | ---
1415 |
1416 | Installable, offline-capable. Static assets + `playbook.json` cached with **Stale-While-Revalidate**.
1417 |
1418 | CI
1419 | --
1420 |
1421 | GitHub Actions runs lint → typecheck → unit → build → e2e.
1422 |
1423 | License
1424 | -------
1425 |
1426 | MIT
1427 |
1428 | ---
1429 |
````

llm-playbook/LLM-Assisted Software Engineering Playbook(chat-w-sourcecode).md

````
1 | ## You asked:
2 |
3 | LLM Agent Codebase Playbook.md
4 |
5 | File
6 |
7 | llm_agent_playbook_explorer_react_ts_app_vite.md
8 |
9 | File
10 |
11 | \*\*Role:\*\* You are a senior full-stack engineer, UX lead, and data-viz specialist. Build a production-ready, interactive \*\*single-page web application\*\* that lets users explore the \*\*“LLM Coding Agent Playbook for Solo Developers.”\*\* You will transform a detailed report into structured data and rich, explorable UI. --- ## Objectives \* Convert the provided markdown report (\*\*input: “LLM Agent Codebase Playbook.md”\*\*) into a normalized JSON dataset. \* Ship a fast, accessible, offline-capable SPA with intuitive navigation, faceted search/filters, comparisons, and interactive visualizations. \* Provide complete, ready-to-run source code and light tests + CI. --- ## Technical Constraints (Default Stack) \* \*\*Frontend:\*\* React 18 + TypeScript + Vite (SPA) \* \*\*Routing:\*\* React Router \* \*\*Styling:\*\* TailwindCSS (dark mode supported) \* \*\*State/Search:\*\* Zustand (light state) + Fuse.js (client search) \* \*\*Data validation:\*\* Zod \* \*\*Viz:\*\* Recharts (scatter) and d3-sankey (flows) \* \*\*Build:\*\* Vite, PWA via `vite-plugin-pwa` \* \*\*Testing:\*\* Vitest (+ Testing Library) and Playwright (smoke) \* \*\*Quality:\*\* ESLint + Prettier + Husky + lint-staged \* \*\*CI:\*\* GitHub Actions (lint → typecheck → unit → build → e2e) If an environment forbids any default, choose the nearest equivalent but keep the same features, file structure, and behavior. --- ## Data Model (normalize the report) Parse the markdown into this JSON schema and save as `public/data/playbook.json`:
12 |
13 |     ts
14 |     // Zod types you MUST use in code:
15 |     Pattern = {
16 |       id: string, title: string, summary: string,
17 |       phase: 'Ideation'|'Scaffolding'|'Coding'|'Review'|'Testing'|'Deployment',
18 |       difficulty: 'Beginner'|'Intermediate'|'Advanced',
19 |       roi: number /*0..10*/,
20 |       steps: string[], bestPractices: string[],
21 |       antiPatterns?: string[], prompts?: string[], tools?: string[],
22 |       metrics?: string[], risks?: string[], tags: string[], links?: string[],
23 |       relations: { id: string, type: 'pattern'|'workflow'|'tool'|'prompt'|'metric'|'risk', weight?: number }[]
24 |     }
25 |
26 |     Workflow = {
27 |       id: string, title: string, summary: string,
28 |       stages: { name: string, goals: string[], artifacts?: string[] }[],
29 |       kpis?: string[], tags: string[], relations: Pattern['relations']
30 |     }
31 |
32 |     Tool = {
33 |       id: string, name: string, category: string, cost?: string, url?: string,
34 |       strengths: string[], limits: string[], tags: string[], relations: Pattern['relations']
35 |     }
36 |
37 |     Prompt = {
38 |       id: string, title: string, body: string, useCases: string[],
39 |       inputs?: string[], outputs?: string[], tags: string[], relations: Pattern['relations']
40 |     }
41 |
42 |     Metric = { id: string, name: string, desc: string, scale: 'ordinal'|'ratio'|'percent', compute?: string, tags: string[] }
43 |     Risk   = { id: string, name: string, mitigation: string[], severity: 'Low'|'Med'|'High', tags: string[] }
44 |
45 |     Playbook = {
46 |       version: string, updatedAt: string,
47 |       patterns: Pattern[], workflows: Workflow[], tools: Tool[],
48 |       prompts: Prompt[], metrics: Metric[], risks: Risk[]
49 |     }
50 |
51 | Populate at least 3 Patterns, 1 Workflow, 2 Tools, 2 Prompts, 2 Metrics, 2 Risks from the report content. Use consistent, URL-safe `id`s. --- ## UX Requirements \* \*\*App shell & navigation:\*\* Top nav with routes: Home, Explore, Compare, Prompts. Sticky header, dark/light toggle. \* \*\*Home:\*\* KPI tiles (#patterns, #workflows, #tools, #prompts). Version and “updatedAt”. \* \*\*Explore:\*\* Search box (Fuse.js), Phase filter, Sort (ROI | Difficulty | Updated). Card grid with badges (phase, difficulty, ROI). Pagination not required. \* \*\*Compare:\*\* Simple comparison table showing 3 selected patterns (phase, difficulty, ROI, best practices). If selection UI is complex, show first 3 as sample. \* \*\*Prompts (Prompt Lab):\*\* Card list of prompts with one-click “Copy”. \* \*\*Visualizations:\*\* \* \*\*Scatter:\*\* ROI vs Difficulty (Beginner=1, Intermediate=2, Advanced=3), tooltip with pattern title. \* \*\*Sankey (optional bonus):\*\* Flow across workflow stages using available relations (gracefully hide if no data). \* \*\*Command palette:\*\* ⌘/Ctrl+K opens a search dialog listing top hits across entities. \* \*\*Keyboard:\*\* `/` focuses search input. \* \*\*Accessibility:\*\* Skip-to-content, ARIA labels, focus states; passes basic axe checks. \* \*\*PWA:\*\* Installable, offline cache of static assets + JSON (stale-while-revalidate). --- ## Non-Functional Constraints \* \*\*Performance:\*\* <100KB JS after gzip for initial route (excluding d3); code-split viz if needed. \* \*\*Security:\*\* Strict CSP in `index.html`; sanitize any HTML (e.g., DOMPurify) if rendering markdown snippets. \* \*\*DX:\*\* Strict TypeScript, eslint/prettier on pre-commit. \* \*\*Idempotence:\*\* Deterministic build; no network fetches beyond local `public/data/playbook.json`. --- ## Deliverables (strict output format) Return a \*\*single markdown artifact\*\* named: `LLM Agent Playbook Explorer — Full Source (React 18 + TypeScript + Vite)` containing the entire repository as sections grouped by \*\*path\*\*, each with a fenced code block of the exact file contents. Use the structure below and provide complete, working code (no placeholders except icons): \* `package.json` (scripts: dev/build/preview/typecheck/lint/format/test/test\\:watch/e2e/storybook/build-storybook/prepare) \* `tsconfig.json`, `tsconfig.base.json` \* `vite.config.ts` (with `vite-plugin-pwa`) \* `postcss.config.cjs`, `tailwind.config.ts`, `.eslintrc.cjs`, `.prettierrc`, `.gitignore` \* `.husky/*`, `lint-staged.config.mjs`, `commitlint.config.cjs` \* `index.html` (tight CSP) \* `src/`: \* `main.tsx`, `styles/global.css` \* `app/router.tsx`, `app/shell.tsx` \* `components/` (ThemeToggle, CommandPalette, KpiCard, SearchInput, ui primitives) \* `pages/` (HomePage, NotFound) \* `features/explorer/ExplorerPage.tsx` \* `features/compare/ComparePage.tsx` \* `features/prompts/PromptLabPage.tsx` \* `viz/RoiDifficultyScatter.tsx` \* `data/schemas.ts` (Zod) and `data/repo.ts` (fetch+validate JSON) \* `data/indexer.ts` (Fuse index helper) \* `utils/cn.ts` \* `__tests__/schemas.test.ts`, `vitest.setup.ts` \* `public/manifest.webmanifest`, `public/favicon.svg`, `public/icons/pwa-192.png`, `public/icons/pwa-512.png` \* `public/data/playbook.json` (seed generated from the report; ensure it validates against Zod) \* `e2e/` Playwright minimal smoke (`smoke.spec.ts`) + `playwright.config.ts` \* `.github/workflows/ci.yml` (runs lint, typecheck, unit, build, e2e) \* `.storybook/main.ts`, `.storybook/preview.ts` \* `README.md` (quickstart, scripts, data notes, accessibility, PWA, CI) \*\*Important:\*\* Do not include commentary outside code blocks and headings. No TODOs or stubs except the icon PNG placeholders. --- ## Acceptance Criteria 1. App runs locally (`pnpm dev`) and loads Home with KPI counts derived from `public/data/playbook.json`. 2. Explore page supports search, phase filter, and sort; displays ROI badge and tags; works in dark and light modes. 3. Scatter chart renders correctly with Difficulty mapped to 1–3 and tooltips showing titles. 4. Prompt Lab shows prompts with a working “Copy” button. 5. Command palette opens with ⌘/Ctrl+K and returns top matches across entities; `/` focuses search. 6. PWA installs; assets + JSON cached; app remains navigable offline with last-fetched data. 7. Accessibility: skip link works; basic axe pass (no critical issues). 8. CI passes: lint, typecheck, unit, build, e2e (smoke). 9. Data validates via Zod on load; invalid JSON surfaces a user-visible error. --- ## Input You Have \* \*\*Primary content source:\*\* the provided markdown report (`LLM Agent Codebase Playbook.md`). Parse it to populate the JSON seed. --- ## Style & Quality Bar \* Clean, modern UI; rounded corners, soft shadows; responsive layout; no unused imports. \* Strong typing, defensive programming, and simple error states. \* Private reasoning only; output \*\*only\*\* the final repo artifact described above. --- ## Output Rules \* Return exactly one markdown artifact with all files inline (grouped by path as headings + fenced code). \* No extra explanations, no conversational text, no screenshots. \* Ensure the project is runnable as-is after copy-paste into a new repo.
52 |
53 | Thought for 2m 37s
54 |
55 | ---
56 |
57 | ## ChatGPT Replied:
58 |
59 | # LLM Agent Playbook Explorer — Full Source (React 18 + TypeScript + Vite)
60 |
61 | > Copy this entire tree into a new repo. Then run the quickstart in **README.md**. All files are included below, grouped by path.
62 |
63 | ---
64 |
65 | ## package.json
66 |
67 |     {
68 |       "name": "llm-agent-playbook-explorer",
69 |       "version": "1.0.0",
70 |       "private": true,
71 |       "type": "module",
72 |       "scripts": {
73 |         "dev": "vite",
74 |         "build": "tsc -b && vite build",
75 |         "preview": "vite preview --port 5173",
76 |         "typecheck": "tsc -b --pretty",
77 |         "lint": "eslint . --ext .ts,.tsx",
78 |         "format": "prettier --write .",
79 |         "test": "vitest run",
80 |         "test:watch": "vitest",
81 |         "e2e": "playwright test",
82 |         "e2e:ui": "playwright test --ui",
83 |         "storybook": "storybook dev -p 6006",
84 |         "build-storybook": "storybook build",
85 |         "prepare": "husky install"
86 |       },
87 |       "dependencies": {
88 |         "@radix-ui/react-dialog": "^1.0.6",
89 |         "@radix-ui/react-dropdown-menu": "^2.0.6",
90 |         "@radix-ui/react-popover": "^1.0.7",
91 |         "@radix-ui/react-toast": "^1.1.5",
92 |         "@vitejs/plugin-react": "^4.3.1",
93 |         "clsx": "^2.1.1",
94 |         "d3-sankey": "^0.12.3",
95 |         "fuse.js": "^7.0.0",
96 |         "react": "^18.3.1",
97 |         "react-dom": "^18.3.1",
98 |         "react-router-dom": "^6.26.2",
99 |         "recharts": "^2.12.6",
100 |         "zustand": "^4.5.2",
101 |         "zod": "^3.23.8"
102 |       },
103 |       "devDependencies": {
104 |         "@commitlint/cli": "^19.3.0",
105 |         "@commitlint/config-conventional": "^19.2.2",
106 |         "@playwright/test": "^1.46.1",
107 |         "@storybook/addon-essentials": "^8.1.10",
108 |         "@storybook/addon-interactions": "^8.1.10",
109 |         "@storybook/addon-themes": "^8.1.10",
110 |         "@storybook/react": "^8.1.10",
111 |         "@storybook/react-vite": "^8.1.10",
112 |         "@testing-library/jest-dom": "^6.4.6",
113 |         "@testing-library/react": "^16.0.0",
114 |         "@testing-library/user-event": "^14.5.2",
115 |         "@types/jsdom": "^21.1.7",
116 |         "@types/node": "^20.12.12",
117 |         "@types/react": "^18.2.66",
118 |         "@types/react-dom": "^18.2.22",
119 |         "autoprefixer": "^10.4.19",
120 |         "commitlint": "^19.2.2",
121 |         "eslint": "^9.9.0",
122 |         "eslint-config-prettier": "^9.1.0",
123 |         "eslint-plugin-react": "^7.35.0",
124 |         "eslint-plugin-react-hooks": "^4.6.2",
125 |         "eslint-plugin-unused-imports": "^3.2.0",
126 |         "happy-dom": "^14.11.0",
127 |         "husky": "^9.1.5",
128 |         "jsdom": "^24.1.0",
129 |         "lint-staged": "^15.2.9",
130 |         "postcss": "^8.4.39",
131 |         "prettier": "^3.3.3",
132 |         "tailwindcss": "^3.4.10",
133 |         "typescript": "^5.5.4",
134 |         "vite": "^5.4.2",
135 |         "vite-plugin-pwa": "^0.20.1",
136 |         "vitest": "^2.0.5"
137 |       }
138 |     }
139 |
140 | ---
141 |
142 | ## tsconfig.json
143 |
144 |     {
145 |       "extends": "./tsconfig.base.json",
146 |       "compilerOptions": {
147 |         "types": ["vite/client", "node", "happy-dom"]
148 |       },
149 |       "include": ["src", "scripts", "vitest.setup.ts", ".storybook"],
150 |       "exclude": ["dist", "node_modules"]
151 |     }
152 |
153 | ## tsconfig.base.json
154 |
155 |     {
156 |       "compilerOptions": {
157 |         "target": "ES2020",
158 |         "useDefineForClassFields": true,
159 |         "lib": ["ES2020", "DOM", "DOM.Iterable"],
160 |         "module": "ESNext",
161 |         "skipLibCheck": true,
162 |         "moduleResolution": "bundler",
163 |         "resolveJsonModule": true,
164 |         "isolatedModules": true,
165 |         "noEmit": true,
166 |         "jsx": "react-jsx",
167 |         "strict": true,
168 |         "forceConsistentCasingInFileNames": true,
169 |         "esModuleInterop": true,
170 |         "noFallthroughCasesInSwitch": true,
171 |         "baseUrl": ".",
172 |         "paths": {
173 |           "@/app/*": ["src/app/*"],
174 |           "@/components/*": ["src/components/*"],
175 |           "@/features/*": ["src/features/*"],
176 |           "@/data/*": ["src/data/*"],
177 |           "@/pages/*": ["src/pages/*"],
178 |           "@/viz/*": ["src/viz/*"],
179 |           "@/styles/*": ["src/styles/*"],
180 |           "@/utils/*": ["src/utils/*"]
181 |         }
182 |       }
183 |     }
184 |
185 | ---
186 |
187 | ## vite.config.ts
188 |
189 |     import { defineConfig } from 'vite'
190 |     import react from '@vitejs/plugin-react'
191 |     import { VitePWA } from 'vite-plugin-pwa'
192 |
193 |     export default defineConfig({
194 |       plugins: [
195 |         react(),
196 |         VitePWA({
197 |           registerType: 'autoUpdate',
198 |           includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
199 |           workbox: {
200 |             runtimeCaching: [
201 |               {
202 |                 urlPattern: /\/data\/playbook\.json$/,
203 |                 handler: 'StaleWhileRevalidate',
204 |                 options: { cacheName: 'playbook-json' }
205 |               }
206 |             ]
207 |           },
208 |           manifest: {
209 |             name: 'LLM Agent Playbook Explorer',
210 |             short_name: 'Playbook',
211 |             description: 'Explore the LLM Coding Agent Playbook for Solo Developers',
212 |             theme_color: '#0ea5e9',
213 |             background_color: '#0b1220',
214 |             display: 'standalone',
215 |             start_url: '/',
216 |             icons: [
217 |               { src: '/icons/pwa-192.png', sizes: '192x192', type: 'image/png' },
218 |               { src: '/icons/pwa-512.png', sizes: '512x512', type: 'image/png' }
219 |             ]
220 |           }
221 |         })
222 |       ],
223 |       server: { port: 5173 },
224 |       build: { sourcemap: true },
225 |       define: {
226 |         __APP_VERSION__: JSON.stringify('1.0.0')
227 |       }
228 |     })
229 |
230 | ---
231 |
232 | ## postcss.config.cjs
233 |
234 |     module.exports = {
235 |       plugins: {
236 |         tailwindcss: {},
237 |         autoprefixer: {},
238 |       },
239 |     }
240 |
241 | ## tailwind.config.ts
242 |
243 |     import type { Config } from 'tailwindcss'
244 |
245 |     export default {
246 |       darkMode: ['class'],
247 |       content: [
248 |         './index.html',
249 |         './src/**/*.{ts,tsx}',
250 |         './.storybook/**/*.{ts,tsx}'
251 |       ],
252 |       theme: {
253 |         extend: {
254 |           colors: {
255 |             brand: {
256 |               DEFAULT: '#0ea5e9',
257 |               50: '#e0f2fe', 100: '#bae6fd', 200: '#7dd3fc', 300: '#38bdf8', 400: '#0ea5e9', 500: '#0284c7'
258 |             }
259 |           },
260 |           container: { center: true, padding: '1rem' }
261 |         }
262 |       },
263 |       plugins: []
264 |     } satisfies Config
265 |
266 | ---
267 |
268 | ## .eslintrc.cjs
269 |
270 |     module.exports = {
271 |       root: true,
272 |       env: { browser: true, es2022: true },
273 |       parser: '@typescript-eslint/parser',
274 |       parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
275 |       plugins: ['react', 'react-hooks', '@typescript-eslint', 'unused-imports'],
276 |       extends: [
277 |         'eslint:recommended',
278 |         'plugin:react/recommended',
279 |         'plugin:react-hooks/recommended',
280 |         'plugin:@typescript-eslint/recommended',
281 |         'plugin:storybook/recommended',
282 |         'prettier'
283 |       ],
284 |       settings: { react: { version: 'detect' } },
285 |       rules: {
286 |         'react/react-in-jsx-scope': 'off',
287 |         'unused-imports/no-unused-imports': 'error'
288 |       }
289 |     }
290 |
291 | ## .prettierrc
292 |
293 |     {
294 |       "semi": false,
295 |       "singleQuote": true,
296 |       "trailingComma": "es5",
297 |       "printWidth": 100
298 |     }
299 |
300 | ## .gitignore
301 |
302 |     node_modules
303 |     .vscode
304 |     .DS_Store
305 |     coverage
306 |     playwright-report
307 |     storybook-static
308 |     /dist
309 |     /.vite
310 |     /.cache
311 |
312 | ## .husky/pre-commit
313 |
314 |     #!/usr/bin/env sh
315 |     . "$(dirname -- "$0")/_/husky.sh"
316 |
317 |     pnpm lint-staged || npx lint-staged
318 |
319 | ## .husky/commit-msg
320 |
321 |     #!/usr/bin/env sh
322 |     . "$(dirname -- "$0")/_/husky.sh"
323 |
324 |     npx --no-install commitlint --edit $1
325 |
326 | ## lint-staged.config.mjs
327 |
328 |     export default {
329 |       '*.{ts,tsx,css,md,json}': ['prettier --write'],
330 |       '*.{ts,tsx}': ['eslint --fix']
331 |     }
332 |
333 | ## commitlint.config.cjs
334 |
335 |     module.exports = { extends: ['@commitlint/config-conventional'] }
336 |
337 | ---
338 |
339 | ## index.html
340 |
341 |     <!doctype html>
342 |     <html lang="en">
343 |       <head>
344 |         <meta charset="UTF-8" />
345 |         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
346 |         <meta
347 |           http-equiv="Content-Security-Policy"
348 |           content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' ws:; font-src 'self';"
349 |         />
350 |         <link rel="manifest" href="/manifest.webmanifest" />
351 |         <link rel="icon" href="/favicon.svg" />
352 |         <title>LLM Agent Playbook Explorer</title>
353 |       </head>
354 |       <body class="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
355 |         <a href="#app" class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-brand-400 text-white px-3 py-1 rounded">Skip to content</a>
356 |         <div id="root"></div>
357 |         <script type="module" src="/src/main.tsx"></script>
358 |       </body>
359 |     </html>
360 |
361 | ---
362 |
363 | ## src/main.tsx
364 |
365 |     import React from 'react'
366 |     import ReactDOM from 'react-dom/client'
367 |     import { RouterProvider } from 'react-router-dom'
368 |     import { router } from '@/app/router'
369 |     import '@/styles/global.css'
370 |
371 |     ReactDOM.createRoot(document.getElementById('root')!).render(
372 |       <React.StrictMode>
373 |         <RouterProvider router={router} />
374 |       </React.StrictMode>
375 |     )
376 |
377 | ## src/styles/global.css
378 |
379 |     @tailwind base;
380 |     @tailwind components;
381 |     @tailwind utilities;
382 |
383 |     :root { --radius: 0.75rem; }
384 |     * { box-sizing: border-box; }
385 |
386 | ---
387 |
388 | ## src/app/router.tsx
389 |
390 |     import { createBrowserRouter, createHashRouter } from 'react-router-dom'
391 |     import { AppShell } from './shell'
392 |     import { HomePage } from '@/pages/HomePage'
393 |     import { ExplorerPage } from '@/features/explorer/ExplorerPage'
394 |     import { ComparePage } from '@/features/compare/ComparePage'
395 |     import { PromptLabPage } from '@/features/prompts/PromptLabPage'
396 |     import { NotFound } from '@/pages/NotFound'
397 |
398 |     const useHash = false
399 |     const base = import.meta.env.VITE_BASE_PATH || '/'
400 |
401 |     export const router = (useHash ? createHashRouter : createBrowserRouter)([
402 |       {
403 |         path: base,
404 |         element: <AppShell />,
405 |         errorElement: <NotFound />,
406 |         children: [
407 |           { index: true, element: <HomePage /> },
408 |           { path: 'explore', element: <ExplorerPage /> },
409 |           { path: 'compare', element: <ComparePage /> },
410 |           { path: 'prompts', element: <PromptLabPage /> }
411 |         ]
412 |       }
413 |     ])
414 |
415 | ## src/app/shell.tsx
416 |
417 |     import { Outlet, NavLink, useLocation } from 'react-router-dom'
418 |     import { ThemeToggle } from '@/components/ThemeToggle'
419 |     import { CommandPalette } from '@/components/CommandPalette'
420 |     import { useEffect } from 'react'
421 |
422 |     export function AppShell() {
423 |       const { pathname } = useLocation()
424 |       useEffect(() => { document.title = `Playbook${pathname === '/' ? '' : ' • ' + pathname}` }, [pathname])
425 |       return (
426 |         <div id="app" className="min-h-dvh grid grid-rows-[auto_1fr]">
427 |           <header className="sticky top-0 z-30 border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur">
428 |             <div className="container flex items-center gap-4 py-3">
429 |               <NavLink to="/" className="font-bold text-xl">LLM Playbook</NavLink>
430 |               <nav className="ml-auto flex items-center gap-4">
431 |                 <NavLink to="/explore" className={({isActive})=>isActive?'text-brand-500':''}>Explore</NavLink>
432 |                 <NavLink to="/compare" className={({isActive})=>isActive?'text-brand-500':''}>Compare</NavLink>
433 |                 <NavLink to="/prompts" className={({isActive})=>isActive?'text-brand-500':''}>Prompts</NavLink>
434 |                 <ThemeToggle />
435 |                 <CommandPalette />
436 |               </nav>
437 |             </div>
438 |           </header>
439 |           <main className="container py-6">
440 |             <Outlet />
441 |           </main>
442 |         </div>
443 |       )
444 |     }
445 |
446 | ## src/app/store.ts
447 |
448 |     import { create } from 'zustand'
449 |
450 |     type SortKey = 'roi' | 'difficulty' | 'updated'
451 |
452 |     type ExploreState = {
453 |       q: string
454 |       phase: 'All' | 'Ideation'|'Scaffolding'|'Coding'|'Review'|'Testing'|'Deployment'
455 |       sort: SortKey
456 |       setQ: (q: string) => void
457 |       setPhase: (p: ExploreState['phase']) => void
458 |       setSort: (s: SortKey) => void
459 |     }
460 |
461 |     export const useExploreStore = create<ExploreState>((set) => ({
462 |       q: '',
463 |       phase: 'All',
464 |       sort: 'roi',
465 |       setQ: (q) => set({ q }),
466 |       setPhase: (phase) => set({ phase }),
467 |       setSort: (sort) => set({ sort }),
468 |     }))
469 |
470 | ---
471 |
472 | ## src/components/ui/card.tsx
473 |
474 |     import { cn } from '@/utils/cn'
475 |     export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
476 |       return <div className={cn('rounded-2xl border shadow-sm p-4 bg-white dark:bg-slate-900', className)} {...props} />
477 |     }
478 |
479 | ## src/components/ui/badge.tsx
480 |
481 |     import { cn } from '@/utils/cn'
482 |     export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
483 |       return <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-xs', className)}>{children}</span>
484 |     }
485 |
486 | ## src/components/ThemeToggle.tsx
487 |
488 |     import { useEffect, useState } from 'react'
489 |
490 |     export function ThemeToggle() {
491 |       const [dark, setDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
492 |       useEffect(()=>{ document.documentElement.classList.toggle('dark', dark) },[dark])
493 |       return (
494 |         <button aria-label="Toggle theme" className="rounded-lg border px-2 py-1" onClick={()=>setDark(d=>!d)}>
495 |           {dark ? '🌙' : '☀️'}
496 |         </button>
497 |       )
498 |     }
499 |
500 | ## src/components/KpiCard.tsx
501 |
502 |     import { Card } from './ui/card'
503 |
504 |     export function KpiCard({ label, value }: { label: string; value: number }) {
505 |       return (
506 |         <Card className="flex items-center justify-between">
507 |           <div className="text-sm text-slate-500">{label}</div>
508 |           <div className="text-2xl font-semibold">{value}</div>
509 |         </Card>
510 |       )
511 |     }
512 |
513 | ## src/components/SearchInput.tsx
514 |
515 |     import { useRef, useEffect } from 'react'
516 |
517 |     export function SearchInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
518 |       const ref = useRef<HTMLInputElement>(null)
519 |       useEffect(() => {
520 |         const onKey = (e: KeyboardEvent) => {
521 |           if (e.key === '/') {
522 |             const el = ref.current
523 |             if (el) {
524 |               e.preventDefault()
525 |               el.focus()
526 |             }
527 |           }
528 |         }
529 |         window.addEventListener('keydown', onKey)
530 |         return () => window.removeEventListener('keydown', onKey)
531 |       }, [])
532 |       return (
533 |         <div className="relative">
534 |           <input
535 |             ref={ref}
536 |             aria-label="Search"
537 |             className="w-full rounded-xl border px-3 py-2 pr-10"
538 |             placeholder="Search…"
539 |             value={value}
540 |             onChange={(e) => onChange(e.target.value)}
541 |           />
542 |           <kbd className="absolute right-2 top-2 text-xs text-slate-500">/</kbd>
543 |         </div>
544 |       )
545 |     }
546 |
547 | ## src/components/CommandPalette.tsx
548 |
549 |     import { useEffect, useMemo, useState } from 'react'
550 |     import Fuse from 'fuse.js'
551 |     import { usePlaybook } from '@/data/repo'
552 |
553 |     export function CommandPalette() {
554 |       const [open, setOpen] = useState(false)
555 |       const { data } = usePlaybook()
556 |       const fuse = useMemo(()=> new Fuse([
557 |         ...data.patterns, ...data.workflows, ...data.tools, ...data.prompts
558 |       ].map(x=>({ id: 'title' in x ? x.id : (x as any).name, title: 'title' in x ? x.title : (x as any).name, type: (x as any).phase || (x as any).category || 'item'})), { keys: ['title'] }), [data])
559 |       const [q, setQ] = useState('')
560 |       const results = q ? fuse.search(q).slice(0,10) : []
561 |
562 |       useEffect(()=>{
563 |         const onKey=(e: KeyboardEvent)=>{
564 |           if((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==='k'){ e.preventDefault(); setOpen(o=>!o)}
565 |         }
566 |         window.addEventListener('keydown', onKey)
567 |         return ()=>window.removeEventListener('keydown', onKey)
568 |       },[])
569 |
570 |       return (
571 |         <>
572 |           <button className="rounded-xl border px-3 py-1" aria-haspopup="dialog" aria-expanded={open} onClick={()=>setOpen(true)}>⌘K</button>
573 |           {open && (
574 |             <div role="dialog" aria-modal className="fixed inset-0 bg-black/40 grid place-items-start pt-[10vh]">
575 |               <div className="mx-auto w-full max-w-xl rounded-2xl border bg-white p-3 dark:bg-slate-900">
576 |                 <input autoFocus className="w-full rounded-xl border px-3 py-2" placeholder="Type to search" value={q} onChange={e=>setQ(e.target.value)} />
577 |                 <ul className="max-h-80 overflow-auto mt-2 divide-y">
578 |                   {results.map(r=> (
579 |                     <li key={r.item.id} className="py-2 text-sm flex justify-between">
580 |                       <span>{r.item.title}</span>
581 |                       <span className="text-slate-500">{r.item.type}</span>
582 |                     </li>
583 |                   ))}
584 |                   {!results.length && q && <li className="py-6 text-center text-slate-500">No results</li>}
585 |                 </ul>
586 |                 <div className="flex justify-end gap-2 mt-2">
587 |                   <button className="rounded-xl border px-3 py-1" onClick={()=>setOpen(false)}>Close</button>
588 |                 </div>
589 |               </div>
590 |             </div>
591 |           )}
592 |         </>
593 |       )
594 |     }
595 |
596 | ---
597 |
598 | ## src/data/schemas.ts
599 |
600 |     import { z } from 'zod'
601 |
602 |     export const zRef = z.object({ id: z.string(), type: z.enum(['pattern','workflow','tool','prompt','metric','risk']), weight: z.number().optional() })
603 |
604 |     export const zPattern = z.object({
605 |       id: z.string(), title: z.string(), summary: z.string(),
606 |       phase: z.enum(['Ideation','Scaffolding','Coding','Review','Testing','Deployment']),
607 |       difficulty: z.enum(['Beginner','Intermediate','Advanced']),
608 |       roi: z.number().min(0).max(10),
609 |       steps: z.array(z.string()),
610 |       bestPractices: z.array(z.string()),
611 |       antiPatterns: z.array(z.string()).optional(),
612 |       prompts: z.array(z.string()).optional(),
613 |       tools: z.array(z.string()).optional(),
614 |       metrics: z.array(z.string()).optional(),
615 |       risks: z.array(z.string()).optional(),
616 |       tags: z.array(z.string()).default([]),
617 |       links: z.array(z.string()).optional(),
618 |       relations: z.array(zRef).default([])
619 |     })
620 |
621 |     export const zWorkflow = z.object({
622 |       id: z.string(), title: z.string(), summary: z.string(),
623 |       stages: z.array(z.object({ name: z.string(), goals: z.array(z.string()), artifacts: z.array(z.string()).optional() })),
624 |       kpis: z.array(z.string()).optional(),
625 |       tags: z.array(z.string()).default([]),
626 |       relations: z.array(zRef).default([])
627 |     })
628 |
629 |     export const zTool = z.object({ id: z.string(), name: z.string(), category: z.string(), cost: z.string().optional(), url: z.string().url().optional(), strengths: z.array(z.string()), limits: z.array(z.string()), tags: z.array(z.string()).default([]), relations: z.array(zRef).default([]) })
630 |     export const zPrompt = z.object({ id: z.string(), title: z.string(), body: z.string(), useCases: z.array(z.string()), inputs: z.array(z.string()).optional(), outputs: z.array(z.string()).optional(), tags: z.array(z.string()).default([]), relations: z.array(zRef).default([]) })
631 |     export const zMetric = z.object({ id: z.string(), name: z.string(), desc: z.string(), scale: z.enum(['ordinal','ratio','percent']), compute: z.string().optional(), tags: z.array(z.string()).default([]) })
632 |     export const zRisk = z.object({ id: z.string(), name: z.string(), mitigation: z.array(z.string()), severity: z.enum(['Low','Med','High']), tags: z.array(z.string()).default([]) })
633 |
634 |     export const zPlaybook = z.object({
635 |       version: z.string(),
636 |       updatedAt: z.string(),
637 |       patterns: z.array(zPattern),
638 |       workflows: z.array(zWorkflow),
639 |       tools: z.array(zTool),
640 |       prompts: z.array(zPrompt),
641 |       metrics: z.array(zMetric),
642 |       risks: z.array(zRisk)
643 |     })
644 |
645 |     export type Playbook = z.infer<typeof zPlaybook>
646 |     export type Pattern = z.infer<typeof zPattern>
647 |     export type Workflow = z.infer<typeof zWorkflow>
648 |     export type Tool = z.infer<typeof zTool>
649 |     export type Prompt = z.infer<typeof zPrompt>
650 |     export type Metric = z.infer<typeof zMetric>
651 |     export type Risk = z.infer<typeof zRisk>
652 |
653 | ## src/data/repo.ts
654 |
655 |     import { useEffect, useState } from 'react'
656 |     import { zPlaybook, type Playbook } from './schemas'
657 |
658 |     export function usePlaybook() {
659 |       const [data, setData] = useState<Playbook>({
660 |         version: '0', updatedAt: new Date().toISOString(), patterns: [], workflows: [], tools: [], prompts: [], metrics: [], risks: []
661 |       })
662 |       const [loading, setLoading] = useState(true)
663 |       const [error, setError] = useState<string | null>(null)
664 |       useEffect(() => {
665 |         ;(async () => {
666 |           try {
667 |             const res = await fetch('/data/playbook.json')
668 |             const json = await res.json()
669 |             const parsed = zPlaybook.parse(json)
670 |             setData(parsed)
671 |           } catch (e: any) {
672 |             setError(e?.message || 'Failed to load playbook')
673 |           } finally {
674 |             setLoading(false)
675 |           }
676 |         })()
677 |       }, [])
678 |       return { data, loading, error }
679 |     }
680 |
681 | ## src/data/indexer.ts
682 |
683 |     import Fuse from 'fuse.js'
684 |     import type { Playbook } from './schemas'
685 |
686 |     export function buildIndex(pb: Playbook) {
687 |       const items = [
688 |         ...pb.patterns.map((p) => ({ id: p.id, title: p.title, tags: p.tags.join(' '), type: 'pattern' })),
689 |         ...pb.workflows.map((w) => ({ id: w.id, title: w.title, tags: w.tags.join(' '), type: 'workflow' })),
690 |         ...pb.tools.map((t) => ({ id: t.id, title: t.name, tags: t.tags.join(' '), type: 'tool' })),
691 |         ...pb.prompts.map((p) => ({ id: p.id, title: p.title, tags: p.tags.join(' '), type: 'prompt' })),
692 |       ]
693 |       const fuse = new Fuse(items, { keys: ['title', 'tags'], threshold: 0.35 })
694 |       return { fuse }
695 |     }
696 |
697 | ---
698 |
699 | ## src/pages/HomePage.tsx
700 |
701 |     import { usePlaybook } from '@/data/repo'
702 |     import { KpiCard } from '@/components/KpiCard'
703 |     import { Card } from '@/components/ui/card'
704 |
705 |     export function HomePage() {
706 |       const { data, loading, error } = usePlaybook()
707 |       if (loading) return <div>Loading…</div>
708 |       if (error) return <div role="alert" className="text-red-600">{error}</div>
709 |
710 |       return (
711 |         <div className="grid gap-6">
712 |           <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
713 |             <KpiCard label="Patterns" value={data.patterns.length} />
714 |             <KpiCard label="Workflows" value={data.workflows.length} />
715 |             <KpiCard label="Tools" value={data.tools.length} />
716 |             <KpiCard label="Prompts" value={data.prompts.length} />
717 |           </section>
718 |           <Card>
719 |             <h2 className="text-xl font-semibold">Welcome</h2>
720 |             <p className="mt-2 text-slate-600 dark:text-slate-300">Explore the playbook via the Explore tab, compare items, or open the command palette with <kbd>⌘/Ctrl</kbd>+<kbd>K</kbd>.</p>
721 |             <p className="text-sm mt-2">Version: {data.version} • Updated: {new Date(data.updatedAt).toLocaleDateString()}</p>
722 |           </Card>
723 |         </div>
724 |       )
725 |     }
726 |
727 | ## src/pages/NotFound.tsx
728 |
729 |     export function NotFound(){
730 |       return <div className="prose dark:prose-invert">
731 |         <h1>Oops</h1>
732 |         <p>We couldn't find that page.</p>
733 |       </div>
734 |     }
735 |
736 | ---
737 |
738 | ## src/features/explorer/ExplorerPage.tsx
739 |
740 |     import { useMemo } from 'react'
741 |     import { usePlaybook } from '@/data/repo'
742 |     import { SearchInput } from '@/components/SearchInput'
743 |     import { Badge } from '@/components/ui/badge'
744 |     import { Card } from '@/components/ui/card'
745 |     import Fuse from 'fuse.js'
746 |     import { useExploreStore } from '@/app/store'
747 |     import { RoiDifficultyScatter } from '@/viz/RoiDifficultyScatter'
748 |
749 |     export function ExplorerPage() {
750 |       const { data } = usePlaybook()
751 |       const { q, phase, sort, setQ, setPhase, setSort } = useExploreStore()
752 |
753 |       const items = useMemo(() => {
754 |         const patterns = data.patterns
755 |         const filtered = phase==='All' ? patterns : patterns.filter(p=>p.phase===phase)
756 |         const scored = [...filtered]
757 |         if (sort==='roi') scored.sort((a,b)=> b.roi - a.roi)
758 |         if (sort==='difficulty') scored.sort((a,b)=> a.difficulty.localeCompare(b.difficulty))
759 |         if (sort==='updated') scored.sort(()=>0) // no per-item timestamps in seed; stable
760 |         if (!q) return scored
761 |         const fuse = new Fuse(scored, { keys:['title','summary','tags'], threshold:0.35 })
762 |         return fuse.search(q).map(r=>r.item)
763 |       }, [data, q, phase, sort])
764 |
765 |       return (
766 |         <div className="grid gap-6">
767 |           <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
768 |             <SearchInput value={q} onChange={setQ} />
769 |             <select aria-label="Phase filter" className="rounded-xl border px-3" value={phase} onChange={e=>setPhase(e.target.value as any)}>
770 |               {['All','Ideation','Scaffolding','Coding','Review','Testing','Deployment'].map(p=> <option key={p}>{p}</option>)}
771 |             </select>
772 |             <select aria-label="Sort" className="rounded-xl border px-3" value={sort} onChange={e=>setSort(e.target.value as any)}>
773 |               <option value="roi">Sort by ROI</option>
774 |               <option value="difficulty">Sort by Difficulty</option>
775 |               <option value="updated">Sort by Updated</option>
776 |             </select>
777 |           </div>
778 |
779 |           <Card>
780 |             <h3 className="font-semibold mb-2">ROI vs Difficulty</h3>
781 |             <RoiDifficultyScatter data={data.patterns} />
782 |           </Card>
783 |
784 |           <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
785 |             {items.map(p => (
786 |               <li key={p.id}>
787 |                 <Card>
788 |                   <div className="flex items-start justify-between gap-3">
789 |                     <div>
790 |                       <h3 className="font-semibold">{p.title}</h3>
791 |                       <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3">{p.summary}</p>
792 |                     </div>
793 |                     <Badge className="bg-brand-50 dark:bg-slate-800 border-brand-200">ROI {p.roi}</Badge>
794 |                   </div>
795 |                   <div className="mt-2 flex flex-wrap gap-2 text-xs">
796 |                     <Badge>{p.phase}</Badge>
797 |                     <Badge>{p.difficulty}</Badge>
798 |                     {p.tags.slice(0,3).map(t=> <Badge key={t}>{t}</Badge>)}
799 |                   </div>
800 |                 </Card>
801 |               </li>
802 |             ))}
803 |           </ul>
804 |         </div>
805 |       )
806 |     }
807 |
808 | ---
809 |
810 | ## src/features/compare/ComparePage.tsx
811 |
812 |     import { usePlaybook } from '@/data/repo'
813 |     import { Card } from '@/components/ui/card'
814 |
815 |     export function ComparePage(){
816 |       const { data } = usePlaybook()
817 |       const take = (arr:any[], n=3)=>arr.slice(0,n)
818 |       const rows = take(data.patterns, 3)
819 |       return (
820 |         <Card>
821 |           <h2 className="text-xl font-semibold mb-3">Quick Compare (sample)</h2>
822 |           <div className="overflow-auto">
823 |             <table className="min-w-[600px] text-sm">
824 |               <thead><tr>
825 |                 <th className="text-left p-2">Attribute</th>
826 |                 {rows.map(p=> <th key={p.id} className="text-left p-2">{p.title}</th>)}
827 |               </tr></thead>
828 |               <tbody>
829 |                 <tr><td className="p-2">Phase</td>{rows.map(p=> <td key={p.id} className="p-2">{p.phase}</td>)}</tr>
830 |                 <tr><td className="p-2">Difficulty</td>{rows.map(p=> <td key={p.id} className="p-2">{p.difficulty}</td>)}</tr>
831 |                 <tr><td className="p-2">ROI</td>{rows.map(p=> <td key={p.id} className="p-2">{p.roi}</td>)}</tr>
832 |                 <tr><td className="p-2">Best Practices</td>{rows.map(p=> <td key={p.id} className="p-2">{p.bestPractices.slice(0,3).join(', ')}</td>)}</tr>
833 |               </tbody>
834 |             </table>
835 |           </div>
836 |         </Card>
837 |       )
838 |     }
839 |
840 | ---
841 |
842 | ## src/features/prompts/PromptLabPage.tsx
843 |
844 |     import { usePlaybook } from '@/data/repo'
845 |     import { Card } from '@/components/ui/card'
846 |
847 |     export function PromptLabPage(){
848 |       const { data } = usePlaybook()
849 |       const copy = async (text: string)=> navigator.clipboard.writeText(text)
850 |       return (
851 |         <div className="grid gap-3 sm:grid-cols-2">
852 |           {data.prompts.map(p=> (
853 |             <Card key={p.id}>
854 |               <div className="flex items-start justify-between">
855 |                 <h3 className="font-semibold">{p.title}</h3>
856 |                 <button className="rounded-xl border px-2 py-1 text-xs" onClick={()=>copy(p.body)}>Copy</button>
857 |               </div>
858 |               <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">{p.body}</p>
859 |             </Card>
860 |           ))}
861 |         </div>
862 |       )
863 |     }
864 |
865 | ---
866 |
867 | ## src/viz/RoiDifficultyScatter.tsx
868 |
869 |     import { ResponsiveContainer, ScatterChart, XAxis, YAxis, Tooltip, Scatter } from 'recharts'
870 |     import type { Pattern } from '@/data/schemas'
871 |
872 |     const diffMap: Record<Pattern['difficulty'], number> = { Beginner: 1, Intermediate: 2, Advanced: 3 }
873 |
874 |     export function RoiDifficultyScatter({ data }: { data: Pattern[] }){
875 |       const points = data.map(p=> ({ x: diffMap[p.difficulty], y: p.roi, name: p.title }))
876 |       return (
877 |         <div className="h-72">
878 |           <ResponsiveContainer width="100%" height="100%">
879 |             <ScatterChart>
880 |               <XAxis dataKey="x" name="Difficulty" tickFormatter={(v)=>({1:'Beginner',2:'Intermediate',3:'Advanced'} as any)[v]} domain={[1,3]} allowDecimals={false} />
881 |               <YAxis dataKey="y" name="ROI" domain={[0,10]} />
882 |               <Tooltip cursor={{ strokeDasharray: '3 3' }} />
883 |               <Scatter data={points} />
884 |             </ScatterChart>
885 |           </ResponsiveContainer>
886 |         </div>
887 |       )
888 |     }
889 |
890 | ---
891 |
892 | ## src/utils/cn.ts
893 |
894 |     export function cn(...parts: (string | undefined | false | null)[]) {
895 |       return parts.filter(Boolean).join(' ')
896 |     }
897 |
898 | ---
899 |
900 | ## vitest.setup.ts
901 |
902 |     import '@testing-library/jest-dom'
903 |
904 | ## src/**tests**/schemas.test.ts
905 |
906 |     import { describe, it, expect } from 'vitest'
907 |     import { zPlaybook } from '@/data/schemas'
908 |
909 |     const sample = {
910 |       version: '1.0.0',
911 |       updatedAt: '2025-08-01',
912 |       patterns: [], workflows: [], tools: [], prompts: [], metrics: [], risks: []
913 |     }
914 |
915 |     describe('schemas', () => {
916 |       it('parses playbook', () => {
917 |         const parsed = zPlaybook.parse(sample)
918 |         expect(parsed.version).toBe('1.0.0')
919 |       })
920 |     })
921 |
922 | ---
923 |
924 | ## e2e/playwright.config.ts
925 |
926 |     import { defineConfig } from '@playwright/test'
927 |     export default defineConfig({
928 |       testDir: './tests',
929 |       use: { baseURL: 'http://localhost:5173' },
930 |       webServer: { command: 'pnpm preview', port: 5173, reuseExistingServer: !process.env.CI }
931 |     })
932 |
933 | ## e2e/tests/smoke.spec.ts
934 |
935 |     import { test, expect } from '@playwright/test'
936 |
937 |     test('home loads and shows KPIs', async ({ page }) => {
938 |       await page.goto('/')
939 |       await expect(page.getByText('Patterns')).toBeVisible()
940 |     })
941 |
942 | ---
943 |
944 | ## .github/workflows/ci.yml
945 |
946 |     name: CI
947 |     on: [push, pull_request]
948 |     jobs:
949 |       build:
950 |         runs-on: ubuntu-latest
951 |         steps:
952 |           - uses: actions/checkout@v4
953 |           - uses: actions/setup-node@v4
954 |             with: { node-version: 20 }
955 |           - name: Install
956 |             run: |
957 |               corepack enable
958 |               pnpm install --frozen-lockfile || npm ci
959 |           - name: Lint
960 |             run: |
961 |               pnpm lint || npm run lint
962 |           - name: Typecheck
963 |             run: |
964 |               pnpm typecheck || npm run typecheck
965 |           - name: Unit tests
966 |             run: |
967 |               pnpm test || npm test
968 |           - name: Build
969 |             run: |
970 |               pnpm build || npm run build
971 |           - name: E2E
972 |             run: |
973 |               pnpm e2e || npm run e2e
974 |
975 | ---
976 |
977 | ## .storybook/main.ts
978 |
979 |     import type { StorybookConfig } from '@storybook/react-vite'
980 |     const config: StorybookConfig = {
981 |       stories: ['../src/**/*.stories.@(ts|tsx)'],
982 |       addons: ['@storybook/addon-essentials', '@storybook/addon-interactions', '@storybook/addon-themes'],
983 |       framework: { name: '@storybook/react-vite', options: {} },
984 |     }
985 |     export default config
986 |
987 | ## .storybook/preview.ts
988 |
989 |     import '../src/styles/global.css'
990 |     export const parameters = { controls: { expanded: true } }
991 |
992 | ## src/components/KpiCard.stories.tsx
993 |
994 |     import type { Meta, StoryObj } from '@storybook/react'
995 |     import { KpiCard } from './KpiCard'
996 |
997 |     const meta: Meta<typeof KpiCard> = { component: KpiCard, title: 'UI/KpiCard' }
998 |     export default meta
999 |     export const Basic: StoryObj<typeof KpiCard> = { args: { label: 'Patterns', value: 12 } }
1000 |
1001 | ---
1002 |
1003 | ## public/manifest.webmanifest
1004 |
1005 |     {
1006 |       "name": "LLM Agent Playbook Explorer",
1007 |       "short_name": "Playbook",
1008 |       "start_url": "/",
1009 |       "display": "standalone",
1010 |       "background_color": "#0b1220",
1011 |       "theme_color": "#0ea5e9",
1012 |       "icons": [
1013 |         { "src": "/icons/pwa-192.png", "sizes": "192x192", "type": "image/png" },
1014 |         { "src": "/icons/pwa-512.png", "sizes": "512x512", "type": "image/png" }
1015 |       ]
1016 |     }
1017 |
1018 | ## public/favicon.svg
1019 |
1020 | ## public/icons/pwa-192.png
1021 |
1022 | _(placeholder; generate PNG 192x192)_
1023 |
1024 | ## public/icons/pwa-512.png
1025 |
1026 | _(placeholder; generate PNG 512x512)_
1027 |
1028 | ---
1029 |
1030 | ## public/data/playbook.json
1031 |
1032 |     {
1033 |       "version": "1.0.0",
1034 |       "updatedAt": "2025-08-21",
1035 |       "patterns": [
1036 |         {
1037 |           "id": "spec-driven-development",
1038 |           "title": "Specification-Driven Development (Specs as Code)",
1039 |           "summary": "Treat specs, AC, and ADRs as the primary source programming the agent. Precise docs become executable constraints.",
1040 |           "phase": "Ideation",
1041 |           "difficulty": "Intermediate",
1042 |           "roi": 8,
1043 |           "steps": [
1044 |             "Draft machine-checkable spec and acceptance criteria",
1045 |             "Reference relevant ADRs and conventions",
1046 |             "Store in repo for retrieval by agents"
1047 |           ],
1048 |           "bestPractices": [
1049 |             "Use structured templates for specs and ADRs",
1050 |             "Keep acceptance criteria verifiable",
1051 |             "Version control prompts and system instructions"
1052 |           ],
1053 |           "antiPatterns": [
1054 |             "Vague requirements with unstated constraints",
1055 |             "Specs spread across chats and DMs"
1056 |           ],
1057 |           "prompts": ["planner-architect-agent"],
1058 |           "tools": ["cursor", "aider"],
1059 |           "metrics": ["task-success-rate"],
1060 |           "risks": ["specification-drift"],
1061 |           "tags": ["foundation", "spec-first", "adr", "acceptance-criteria"],
1062 |           "links": [],
1063 |           "relations": [
1064 |             { "id": "solo-dev-e2e-workflow", "type": "workflow", "weight": 0.9 },
1065 |             { "id": "typed-structured-output", "type": "pattern", "weight": 0.6 }
1066 |           ]
1067 |         },
1068 |         {
1069 |           "id": "patch-diff-workflow",
1070 |           "title": "Patch/Diff Workflow",
1071 |           "summary": "Agents propose unified diffs for auditable, reversible changes; humans apply after checks.",
1072 |           "phase": "Coding",
1073 |           "difficulty": "Beginner",
1074 |           "roi": 9,
1075 |           "steps": [
1076 |             "Agent outputs unified diff instead of writing files",
1077 |             "Run format, lint, typecheck, and tests",
1078 |             "Review and apply or iterate"
1079 |           ],
1080 |           "bestPractices": [
1081 |             "Small, focused diffs",
1082 |             "CI gates for lint/type/tests",
1083 |             "Guardrails with allowlisted paths"
1084 |           ],
1085 |           "prompts": ["reviewer-refactorer-agent"],
1086 |           "tools": ["aider"],
1087 |           "metrics": ["diff-churn"],
1088 |           "risks": ["file-thrashing"],
1089 |           "tags": ["safety", "audit", "git"],
1090 |           "relations": [
1091 |             { "id": "solo-dev-e2e-workflow", "type": "workflow", "weight": 0.8 },
1092 |             { "id": "spec-driven-development", "type": "pattern", "weight": 0.4 }
1093 |           ]
1094 |         },
1095 |         {
1096 |           "id": "typed-structured-output",
1097 |           "title": "Typed Structured Output & Function Calling",
1098 |           "summary": "Constrain agent replies to JSON schemas and tool calls to improve predictability.",
1099 |           "phase": "Review",
1100 |           "difficulty": "Intermediate",
1101 |           "roi": 7,
1102 |           "steps": [
1103 |             "Define JSON schema (Zod/Pydantic)",
1104 |             "Validate outputs and retry on failure",
1105 |             "Use native tool/function calling where possible"
1106 |           ],
1107 |           "bestPractices": [
1108 |             "Keep schemas minimal and explicit",
1109 |             "Fail fast on invalid output",
1110 |             "Validate in CI"
1111 |           ],
1112 |           "prompts": ["planner-architect-agent", "reviewer-refactorer-agent"],
1113 |           "tools": [],
1114 |           "metrics": ["task-success-rate"],
1115 |           "risks": ["specification-drift"],
1116 |           "tags": ["schema", "validation", "tool-calls"],
1117 |           "relations": [
1118 |             { "id": "spec-driven-development", "type": "pattern", "weight": 0.7 }
1119 |           ]
1120 |         }
1121 |       ],
1122 |       "workflows": [
1123 |         {
1124 |           "id": "solo-dev-e2e-workflow",
1125 |           "title": "Solo Developer Agentic Loop",
1126 |           "summary": "Idea → Spec → Scaffold → Iterative Coding (test-first) → Docs → Review & Release.",
1127 |           "stages": [
1128 |             { "name": "Idea → Spec", "goals": ["Formalize feature into machine-checkable spec", "Draft ADRs"], "artifacts": ["SPEC.md", "ADR/NNN.md", "AC checklist"] },
1129 |             { "name": "Scaffold", "goals": ["Create file/folder skeleton", "Set up tests/CI"], "artifacts": ["repo tree", "tests/"] },
1130 |             { "name": "Iterative Coding", "goals": ["Tiny tasks", "Failing test first", "Diff-based changes"], "artifacts": ["patches", "commits"] },
1131 |             { "name": "Docs", "goals": ["Generate comments, README updates"], "artifacts": ["docs"] },
1132 |             { "name": "Review & Release", "goals": ["PR with context", "CI gates", "Ship"], "artifacts": ["PR description", "changelog"] }
1133 |           ],
1134 |           "kpis": ["task-success-rate", "diff-churn"],
1135 |           "tags": ["workflow", "loop"],
1136 |           "relations": [
1137 |             { "id": "patch-diff-workflow", "type": "pattern", "weight": 0.7 },
1138 |             { "id": "spec-driven-development", "type": "pattern", "weight": 0.7 }
1139 |           ]
1140 |         }
1141 |       ],
1142 |       "tools": [
1143 |         {
1144 |           "id": "aider",
1145 |           "name": "Aider",
1146 |           "category": "CLI",
1147 |           "url": "https://aider.chat",
1148 |           "strengths": ["Diff-based edits", "Git-native workflow", "Repo map context"],
1149 |           "limits": ["Requires local git setup", "Terminal-centric UI"],
1150 |           "tags": ["tool", "assistant"],
1151 |           "relations": [
1152 |             { "id": "patch-diff-workflow", "type": "pattern", "weight": 0.8 }
1153 |           ]
1154 |         },
1155 |         {
1156 |           "id": "cursor",
1157 |           "name": "Cursor",
1158 |           "category": "IDE",
1159 |           "url": "https://cursor.com",
1160 |           "strengths": ["Codebase-aware chat", "Inline agentic edits", "PR/issue context"],
1161 |           "limits": ["Desktop app dependency"],
1162 |           "tags": ["tool", "ide"],
1163 |           "relations": [
1164 |             { "id": "spec-driven-development", "type": "pattern", "weight": 0.6 }
1165 |           ]
1166 |         }
1167 |       ],
1168 |       "prompts": [
1169 |         {
1170 |           "id": "planner-architect-agent",
1171 |           "title": "Planner/Architect Agent",
1172 |           "body": "You are an expert architect. Produce a JSON-only plan with affected files, step-by-step tasks, and (if needed) a draft ADR. Conform strictly to the provided schema. Do not include commentary.",
1173 |           "useCases": ["Planning", "Decomposition", "ADR drafting"],
1174 |           "inputs": ["Feature request", "Existing ADRs", "Conventions"],
1175 |           "outputs": ["plan.json", "adr draft"],
1176 |           "tags": ["prompt", "planning"],
1177 |           "relations": [
1178 |             { "id": "spec-driven-development", "type": "pattern", "weight": 0.8 }
1179 |           ]
1180 |         },
1181 |         {
1182 |           "id": "reviewer-refactorer-agent",
1183 |           "title": "Reviewer/Refactorer Agent",
1184 |           "body": "You are a Principal Engineer. Given a code diff, output JSON review comments with file, line, comment, and severity. Enforce conventions and flag security/performance issues.",
1185 |           "useCases": ["Code review", "Quality gating"],
1186 |           "inputs": ["Unified diff", "CONVENTIONS.md"],
1187 |           "outputs": ["review.json"],
1188 |           "tags": ["prompt", "review"],
1189 |           "relations": [
1190 |             { "id": "patch-diff-workflow", "type": "pattern", "weight": 0.8 }
1191 |           ]
1192 |         }
1193 |       ],
1194 |       "metrics": [
1195 |         {
1196 |           "id": "task-success-rate",
1197 |           "name": "Task Success Rate",
1198 |           "desc": "Percent of tasks where final generated code passes verification.",
1199 |           "scale": "percent",
1200 |           "compute": "passed_tasks / total_tasks * 100",
1201 |           "tags": ["metric", "quality"]
1202 |         },
1203 |         {
1204 |           "id": "diff-churn",
1205 |           "name": "Diff Size / Churn",
1206 |           "desc": "Lines added+removed per patch; lower indicates tighter edits.",
1207 |           "scale": "ratio",
1208 |           "compute": "sum(|added| + |removed|) per patch",
1209 |           "tags": ["metric", "efficiency"]
1210 |         }
1211 |       ],
1212 |       "risks": [
1213 |         {
1214 |           "id": "specification-drift",
1215 |           "name": "Specification Drift / Goal Misalignment",
1216 |           "mitigation": [
1217 |             "Require human approval of planner output before coding",
1218 |             "Use structured spec templates and explicit AC"
1219 |           ],
1220 |           "severity": "High",
1221 |           "tags": ["risk", "spec"]
1222 |         },
1223 |         {
1224 |           "id": "file-thrashing",
1225 |           "name": "File Thrashing / Hallucinated Paths",
1226 |           "mitigation": [
1227 |             "Use patch/diff workflow with allowlisted paths",
1228 |             "Provide listFiles tool; verify path existence"
1229 |           ],
1230 |           "severity": "Med",
1231 |           "tags": ["risk", "fs"]
1232 |         }
1233 |       ]
1234 |     }
1235 |
1236 | ---
1237 |
1238 | ## e2e/tests/README.md
1239 |
1240 |     # E2E Notes
1241 |
1242 |     Minimal smoke test ensures the app renders. Extend as needed.
1243 |
1244 | ---
1245 |
1246 | ## README.md
1247 |
1248 |     # LLM Agent Playbook Explorer
1249 |
1250 |     An interactive single-page app to explore the **LLM Coding Agent Playbook for Solo Developers**.
1251 |
1252 |     ## Quickstart
1253 |
1254 |     ```bash
1255 |     # with pnpm (recommended)
1256 |     corepack enable
1257 |     pnpm install
1258 |     pnpm dev
1259 |     # open http://localhost:5173
1260 |
1261 | ## Scripts
1262 |
1263 | - `pnpm dev` – start dev server
1264 | - `pnpm build` – typecheck + build
1265 | - `pnpm preview` – preview prod build
1266 | - `pnpm test` / `pnpm test:watch` – unit tests (Vitest)
1267 | - `pnpm e2e` – Playwright E2E
1268 | - `pnpm lint` – ESLint
1269 | - `pnpm format` – Prettier
1270 | - `pnpm storybook` / `pnpm build-storybook` – Storybook
1271 |
1272 | ## Data
1273 |
1274 | Seed JSON at `public/data/playbook.json`. Content was normalized from the provided markdown report and validated with Zod on load. Invalid JSON surfaces a user-visible error.
1275 |
1276 | ## Tech
1277 |
1278 | React 18 + TypeScript + Vite • React Router • Tailwind (dark mode) • Zustand (state) • Fuse.js (search) • Recharts (scatter) • (Optional) d3-sankey • Vitest • Playwright • Storybook • PWA.
1279 |
1280 | ## UX
1281 |
1282 | - Sticky top nav with **Home**, **Explore**, **Compare**, **Prompts**
1283 | - Command Palette: <kbd>⌘/Ctrl</kbd>+<kbd>K</kbd>
1284 | - Keyboard: <kbd>/</kbd> focuses search
1285 | - Accessibility: skip link, ARIA on dialogs/inputs, visible focus states
1286 |
1287 | ## Visualizations
1288 |
1289 | - **Scatter** chart (ROI vs Difficulty) on Explore page.
1290 | - Sankey placeholder optional; hide when no data.
1291 |
1292 | ## PWA
1293 |
1294 | Installable, offline-capable. Static assets + `playbook.json` cached with **Stale-While-Revalidate**.
1295 |
1296 | ## CI
1297 |
1298 | GitHub Actions runs lint → typecheck → unit → build → e2e.
1299 |
1300 | ## License
1301 |
1302 | MIT
1303 |
1304 | ---
````

llm-playbook/LLM-Assisted Software Engineering Playbook(pdf-md deep-research output).md

`````
1 | ![](_page_0_Picture_0.jpeg)
2 |
3 | # **LLM-Assisted Software Engineering Playbook**
4 |
5 | Developing software with the help of Large Language Model (LLM) coding agents or assistants requires careful planning and structure. This playbook compiles proven end-to-end strategies (circa 2023–2025) to keep LLM agents on task and producing correct code, files, and project structures. It is organized as a practical guide for a solo developer, including step-by-step workflows, prompt templates, repository templates, automation scripts, evaluation methods, a comparison of agent frameworks, and troubleshooting tips.
6 |
7 | **Contents:** - **1. Upfront Project Scaffolding** – Spec-first planning, docs-driven development, acceptance criteria, Definition of Done, ADRs, test-first prompts
8 |
9 | - **2. Repository Architecture Patterns** – Monorepo vs. polyrepo, layering and modular boundaries, naming conventions
10 |
11 | - **3. LLM-Specific Development Techniques** – Context management (repo maps, symbol graphs, code retrieval), structured outputs and schemas, tool use, iterative diff workflows, small PRs and reviews, task breakdown, loops with validation, guardrails (file allowlists, regex/AST checks, linters, type checking, CI gates)
12 |
13 | - **4. Workflow: Idea to Release** – Step-by-step checklist from project idea → spec → scaffold → code → tests → docs → release
14 |
15 | - **5. Prompt Templates for Each Phase** – System/user prompt patterns for planner, architect, scaffolder, implementer, tester, reviewer, refactorer (with example JSON schemas and notes on what not to do)
16 |
17 | - **6. Repository Templates (Python & TypeScript)** – File tree structures and sample files: README, CONTRIBUTING, CODEOWNERS, ADR template, prompts.md, pyproject.toml/package.json, lint/format configs, test configs (pytest/jest), coverage, pre-commit, Dockerfile/devcontainer, CI YAML
18 |
19 | - **7. Automation Snippets** – Scripts for scaffolding a project structure, generating a "repo map," indexing code embeddings, a GitHub Action enforcing structure & tests (rejecting invalid LLM output), and a guardrail script blocking disallowed file writes
20 |
21 | - **8. Evaluation and QA** – Guidance on evaluating agent output with a lightweight benchmark (SWE-bench style), success metrics (task success rate, tests passing, diff size, review feedback), and triage loops for failures
22 |
23 | - **9. Frameworks & IDE Workflow Comparison** – Matrix of agent frameworks (SWE-Agent, AutoGen, OpenDevin, Smol Developer, etc.) and IDE-based tools (Cursor, Copilot, Aider, Codeium), with use-case recommendations
24 |
25 | - **10. Troubleshooting Common Failure Modes** – Spec drift, context loss, file thrash, hallucinated paths, flaky tests, etc., with concrete mitigations
26 |
27 | Each section cites real projects, research papers, and engineering blogs (2023–2025) with brief annotations. The aim is to provide actionable guidance – **checklists, templates, and code snippets** you can readily apply – rather than theory.
28 |
29 | # **1. Upfront Project Scaffolding**
30 |
31 | Successful LLM-assisted projects start with a strong upfront plan. This means clearly defining **what to build and how to validate it before coding begins**. Key techniques include writing specifications first (docsdriven development), enumerating acceptance criteria and "Definition of Done," capturing design decisions in ADRs, and using test-first prompts to guide implementation.
32 |
33 | - **Spec-First / Docs-Driven Development:** Before prompting an LLM to write code, articulate the requirements and design in natural language or formal docs. For example, write a short Product Requirement Document (PRD) or technical spec describing features, APIs, data models, etc. _Rationale:_ The spec can be provided to the LLM as context, ensuring the model has a correct understanding of the goals. This reduces hallucinations and mid-course drift. If available, leverage existing documentation or user stories as part of the prompt. Major orgs often practice docs-driven dev to align teams; the same helps align your LLM assistant. •
34 | - **Acceptance Criteria & Definition of Done (DoD):** List concrete criteria that the output must meet to consider the task complete. This may include functional requirements ("able to handle 1000 requests/sec"), passing specific tests, code style guidelines, documentation completeness, etc. For instance, the **roocode SPARC** project's SWE-bench integration defines success criteria like all tasks automated via the agent (no manual steps), orchestrator delegation working, performance targets met, and full documentation . Such checklists can double as a "Definition of Done" for the LLM: the agent shouldn't stop until those boxes are ticked. _Include these criteria in your system prompt_ or as a final verification step. • [1](https://github.com/agenticsorg/sparc-bench/blob/fd813484f533ab118a963766475f8f3edacb64e1/README-swe-bench.md#L266-L274)
35 | - **Architecture Decision Records (ADRs):** Maintain a log of key design decisions in the repo (usually as markdown files in an /adr directory). ADRs are short docs explaining a choice (e.g. "Use PostgreSQL vs MySQL – Decision: PostgreSQL because X..."). While not specific to LLMs, writing an ADR for major decisions (or even prompting the LLM to draft one after a design discussion) can ensure rationale is captured. It's also a form of spec that can be fed back into the LLM context if needed (to remind it why a certain architecture was chosen). A template ADR might include sections: Context, Decision, Status, Consequences. This helps keep the LLM's outputs consistent with earlier decisions (reducing backtracking). •
36 | - **Test-First Prompts & TDD:** Adopting test-driven development with an LLM means writing tests or at least test _prompts_ before implementation. For example, you might prompt the LLM: "First, write a set of unit tests for the UserService (in pytest style), focusing on X behavior. Then implement UserService to make those tests pass." This approach keeps the LLM focused on satisfying the spec as encoded in tests. Many LLM coding frameworks encourage breaking the work into small, test-backed steps. _Field example:_ A Cursor IDE user devised a prompt sequence for **TDD project planning**, where the LLM (as a "Principal Engineer" persona) outputs an executable plan decomposed into incremental, test-first tasks . Each unit of work in the plan includes the test scaffolding or expectations and a small code task, ensuring that when implemented, it can be verified immediately. This method yields a series of self-contained prompts (often stored in a plans/ folder) that the developer or agent can then execute one by one. By planning with tests up front, you catch ambiguities early and give the LLM a clear target for each coding step. • [2](https://github.com/nmrs/sotd_pipeline/blob/62a50a30aa96378491dc6824f5a67a1d52af4cbc/.cursor/prompts/tdd-project-planning.mdc#L7-L15) [3](https://github.com/nmrs/sotd_pipeline/blob/62a50a30aa96378491dc6824f5a67a1d52af4cbc/.cursor/prompts/tdd-project-planning.mdc#L18-L26)
37 |
38 | **Upfront Planning Checklist:** 1. **Write a Project Brief:** a one-pager explaining the project's goal, key features, and constraints. Keep it for prompting. 2. **List Requirements & DoD:** bullet out what the solution _must_ do (functional requirements) and any quality criteria (performance, security, etc.). Also list "done when…" items. Share this list with the LLM . 3. **Outline Architecture:** decide high-level structure (tiered layers, main components, external services). Note any known design decisions (and record in ADR format if significant). 4. **Prepare Examples or API Schemas:** If building an API or module, provide examples of inputs/outputs or an interface spec. LLMs given a schema can fill in the implementation. 5. **Draft Tests or Use Cases:** Write a few critical user scenarios or unit tests (in plain language or actual test code). You might start with a simple test to guide the LLM ("Given this input, the output should be…") to anchor the development. 6. **Plan Iterations:** Break the work into small tasks (ideally each taking the LLM a single prompt-response to complete). For each task, define what will be implemented and how it will be validated (e.g. "Task 1: Implement data model classes – validated by running associated unit tests for models"). The Smol-Developer approach exemplifies this: it generates a plan outlining the app structure, then proceeds file by file . 7. **Review Feasibility:** Ensure the plan's steps are not too broad (risking many bugs) and not too granular (risking integration difficulties). _Insight:_ The GPT-Pilot team found that task size significantly affects code quality – overly broad tasks yield buggy output, while overly narrow ones can confuse the model's integration of changes . Aim for a middle ground. 8. **Finalize Prompts for Planning Phase:** Formulate a "Planning prompt" for the LLM (or chain-of-thought agent) that feeds it the above info and asks for a project plan. For example: _"You are a senior engineer. Here is the project brief... Please produce a step-bystep implementation plan with a file list, function signatures, and for each step, tests or criteria for completion."_ You may use a system message to enforce format (JSON or markdown checklist). [1](https://github.com/agenticsorg/sparc-bench/blob/fd813484f533ab118a963766475f8f3edacb64e1/README-swe-bench.md#L266-L274) [4](https://github.com/wasp-lang/wasp/blob/0c6b0be9b0f6b9b47e12595b6c4146e454bc2293/web/blog/2023-08-01-smol-ai-vs-wasp-ai.md#L72-L80) [5](https://github.com/Pythagora-io/gpt-pilot/blob/186f98e3a75cc0b5e33c266b0ceccce176dc43ee/README.md#L202-L205)
39 |
40 | By investing in upfront scaffolding, you greatly increase the changes that your LLM assistant builds the _right_ thing and knows when it's done.
41 |
42 | # **2. Repository Architecture Patterns**
43 |
44 | How you structure your repository and code modules can either help or hinder an LLM. Consistent, clear structure makes it easier for an agent to navigate the codebase and adhere to intended boundaries. Here we discuss monorepo vs. polyrepo, layering, modular boundaries, and naming conventions, with an emphasis on what works well for LLM-driven development.
45 |
46 | **Monorepo vs. Polyrepo:** In a **monorepo**, all code (multiple projects, services, packages) lives in one repository. In a **polyrepo**, you maintain multiple repos (e.g. one per service or package). For a solo developer or a single project, a monorepo is often simpler – everything in one place means the LLM has access to all context without needing cross-repo coordination. Monorepos encourage standardized tooling and shared conventions. As one engineer noted, a healthy _"monorepo culture"_ has unified dev tools, one release cycle, and collective code ownership (everyone responsible for keeping main branch green) . This culture can foster collaboration and agility – developers (or AI agents) can move between components easily since everything uses the same setups . On the other hand, large monorepos can become unwieldy if not managed, requiring robust tooling for build, test, and code search as the repo scales (common at big companies). Polyrepos modularize concerns and can simplify CI for each component, but they introduce **dependency hell** when many small repos depend on specific versions of each other . For an LLM agent, polyrepos pose additional challenges: the agent might need context from another repo (which may not be accessible in the prompt due to context length or auth). If you do use multiple repos (e.g. separate backend • [6](https://github.com/kadhirvelm/resync-games/blob/84d62d0a4face8225d5bbdfd96d14a91cd7758a6/packages/frontend/src/app/blog/engineering/monorepo-culture/page.tsx#L38-L46) [7](https://github.com/kadhirvelm/resync-games/blob/84d62d0a4face8225d5bbdfd96d14a91cd7758a6/packages/frontend/src/app/blog/engineering/monorepo-culture/page.tsx#L56-L64) [8](https://github.com/kadhirvelm/resync-games/blob/84d62d0a4face8225d5bbdfd96d14a91cd7758a6/packages/frontend/src/app/blog/engineering/monorepo-culture/page.tsx#L12-L20)
47 |
48 | and frontend), consider pulling relevant files from the other repo into the prompt as needed, or use a vector database to let the agent retrieve snippets across repos.
49 |
50 | _Guidance:_ For solo projects or tightly related components, prefer a monorepo. Use folder structure to separate concerns (e.g. backend/ vs frontend/ ). If using polyrepo (say, publishing a library separate from an app), you'll have to either run the agent separately per repo or give it tools to fetch from other repos. Many "AI junior developer" tools default to a single workspace directory (monorepo style) for simplicity . Even OpenAI's function-calling agent examples assume one working directory. So, unless you have a strong reason, start monorepo, perhaps splitting out later if needed (when an LLM can help with the refactor). [9](https://github.com/dxdyt/blog-web/blob/1b7415b94f50f69302ea0850019fdc12f56e61ca/content/posts/OpenDevin.md#L52-L60) [10](https://github.com/dxdyt/blog-web/blob/1b7415b94f50f69302ea0850019fdc12f56e61ca/content/posts/OpenDevin.md#L68-L76)
51 |
52 | - **Layered Architecture & Modular Boundaries:** Enforce logical boundaries within the code. This could mean adopting a known architecture pattern (MVC, Clean Architecture, Hexagonal, etc.) or simply separating by feature or tier. For example, in a web app, you might have distinct folders for api/ , services/ , data/ models, ui/ , etc. Clear separation helps the LLM keep context localized: if it's working on a database function, it should only need to consider the data/ layer, not everything. _Tip:_ Include brief README.md files in each major folder explaining that module's purpose and any conventions. An LLM can read those to understand your architecture. When generating new code, prompt it to put files in the correct layer. If it proposes putting business logic in a controller file, remind it of the designated service layer. A modular design also means you can run partial tests (e.g. test just the data layer) as validation for the LLM's output on that part, before moving on. •
53 | - **Naming Conventions:** Adopt consistent naming for files, folders, functions, and classes. LLMs are less likely to hallucinate or misplace code if your naming is descriptive and structured. For instance, if you suffix interface files with ...Interface.ts or prefix test files with test\_ , maintain that everywhere. When the LLM creates a new file, explicitly tell it the naming scheme: _"Create a new service class in user_service.py (all services use \_service.py suffix)."_ Consistent naming also aids vector search over code: if you later use embeddings to find where a function is defined, having a predictable name increases the chance of a hit. •
54 |
55 | One particularly helpful convention for LLM context is to include the purpose in the filename. E.g., UserRepository for data access vs. UserService for business logic, vs. UserRoutes for HTTP endpoints. Then if the LLM is tasked to add a new feature in user logic, it can guess which files to open. Projects like **Smol-Developer** explicitly plan out file names and their roles in advance , so that generation of each file is guided by the intended responsibility. Adopting a similar approach (maybe maintaining a ARCHITECTURE.md or MAP.md that lists each file's role) will assist any agent in navigating the repo. [11](https://github.com/wasp-lang/wasp/blob/0c6b0be9b0f6b9b47e12595b6c4146e454bc2293/web/blog/2023-08-01-smol-ai-vs-wasp-ai.md#L74-L81)
56 |
57 | **Monolith vs. Microservices:** Related to monorepo/polyrepo is whether your app is deployed as a single unit or multiple services. For an LLM building the project, a monolithic architecture (single deployable, even if logically layered) is simpler to handle initially. Microservices introduce network calls, separate configs, and more points of failure – if you go that route, be prepared to specify each service's API clearly to the LLM and maybe generate them one at a time. In general, **start simple (monolith)** and only break out services if absolutely needed. This reduces the cognitive load on the LLM and avoids cross-service context switching. •
58 |
59 | **Repo Structure & Architecture Checklist:** - Choose monorepo (single repo) unless strong reason otherwise. If multiple repos, ensure the agent has read-access to all or you provide stubs. - Create a clear directory structure reflecting layers or features. Document this structure in a top-level README.md (with a "Project Structure" section listing directories and their purpose). - Establish naming conventions (filenames, function names, etc.). Document any special patterns. - Provide the LLM with an **initial scaffold** of folders and empty files if possible. This "scaffolding" acts as a guide rail – the model will fill in the blanks rather than create files everywhere. (See Section 7 for an automatic scaffold script.) - For multi-language repos (say a Python backend and TypeScript frontend in one), separate them cleanly (different root folders) and clarify build/test processes for each. - Include configuration files from the start (even if empty placeholders): e.g., an empty pyproject.toml , a sample package.json , CI workflow file, etc. The LLM will then know these exist and can modify them as needed rather than creating new ones in the wrong place. - If using an agent that operates via commands, ensure it has tools for navigating the structure (e.g., a custom ls or search command). The SWE-Agent research from Princeton introduced a file viewer command that lists directory contents in 100-line chunks , which was critical to help the LLM browse without getting lost. A similar approach can be to maintain an updated file tree in the prompt or allow the agent to query it easily. [12](https://github.com/ozyyshr/RepoGraph/blob/6c3977d87845993bf2c0359b4ac752278d7f3c45/SWE-agent/README.md#L36-L43)
60 |
61 | **Layering Tip:** If your project has clearly defined API boundaries (e.g., "frontend calls backend via REST"), consider writing an **API contract first** (like an OpenAPI spec or TypeScript interface). Provide this to the LLM so it doesn't hallucinate endpoints. Keeping interface definitions in one place (and pinned in context) helps the model stay consistent while implementing different parts.
62 |
63 | # **3. LLM-Specific Development Techniques**
64 |
65 | Building software with LLMs isn't just "normal coding, but faster." It requires new techniques to steer the AI and manage its unique failure modes. Below are techniques that practitioners have found effective in the wild (with references to papers, OSS projects, and blogs):
66 |
67 | ## **3.1 Context Management: Repo Maps, Symbol Graphs, Retrieval**
68 |
69 | LLMs have limited memory (context window), so feeding an entire codebase is impractical. Successful agent strategies involve giving the model _just the relevant context_ for each task, often by using **repo maps or code summaries**:
70 |
71 | - **Repository Map / Tree Summary:** Provide an outline of the codebase e.g., a tree of files and a one-line description of each. This acts like a map so the LLM knows where things are. Some tools auto-generate this. For instance, _Smol-Developer's initial plan includes the structure of the entire app and file-level descriptions_ . Another approach is to maintain an updated "README-map.md" file in the repo that lists modules, or to have the LLM generate a summary of each file (docstrings or comments can help here). If you have such a map, include it in the prompt when the LLM is adding new features – it will ground the model in the existing structure. • [4](https://github.com/wasp-lang/wasp/blob/0c6b0be9b0f6b9b47e12595b6c4146e454bc2293/web/blog/2023-08-01-smol-ai-vs-wasp-ai.md#L72-L80)
72 | - **Symbol Graph or Index:** This is a more granular map of the code symbols (functions, classes, etc.) and their relations. Some research prototypes build a graph of code entities for the LLM to consult. In practice, you can approximate this by letting the LLM do a project-wide search for a symbol. For example, if the agent needs to find where Order.calculateTotal is defined, a tool can grep or search an index to show that snippet. Several IDE extensions (like Sourcegraph's Cody, or VSCode with Codeium) provide semantic search over the repo. In our context, you can simulate this by prebuilding an **embedding index** of the code (see Section 7 for a snippet) and then on each query, retrieving the top relevant code chunks to include in the prompt. _Ex:_ GPT Pilot uses mechanisms to •
73 |
74 | filter code context so that "in each LLM conversation, it doesn't need to store the entire codebase in context – only the relevant code for the current task" . This allowed GPT Pilot to scale to larger projects without running out of context. The bottom line: equip your workflow with the ability to retrieve code by relevance, not blindly stuff all code in. [13](https://github.com/Pythagora-io/gpt-pilot/blob/186f98e3a75cc0b5e33c266b0ceccce176dc43ee/README.md#L196-L200)
75 |
76 | - **External Documentation as Context:** If the project relies on frameworks or APIs, consider retrieving docs or examples for those and feeding them to the LLM when needed. LangChain and LlamaIndex provide patterns for retrieval-augmented generation (RAG). For example, if working on a React component and using a specific library, you might have a vector store of that library's usage examples and inject the most similar one when the LLM is coding. This reduces hallucination about library usage. •
77 | - **Interactive Browsing Tools:** Agents like SWE-Agent introduced specialized commands for browsing code: a file viewer that can scroll and search within files . If you're building a custom agent, giving it these abilities is crucial. In a simpler setup, you as the developer can do the navigation: when ChatGPT asks "Where is function X defined?", you can copy-paste it. But fully automated agents need search tools. For solo devs, a happy medium is using a CLI assistant (like aider or Github Copilot Chat ) that has inline search features or at least allows quick open of files. • [12](https://github.com/ozyyshr/RepoGraph/blob/6c3977d87845993bf2c0359b4ac752278d7f3c45/SWE-agent/README.md#L36-L43)
78 |
79 | **Tip:** Maintain _up-to-date documentation strings and comments_. LLMs strongly rely on in-code comments to understand intent. If every function has a docstring, the model can use that to decide how to modify or use the function. AutoDoc tools (like context-labs/autodoc which generates codebase documentation with GPT ) can help create these summaries. [14](https://github.com/underlines/awesome-ml/blob/81c7bdf6fd008bcc48308306194491a5748cf35d/llm-tools.md#L409-L413)
80 |
81 | ## **3.2 Structured Outputs: JSON Schemas, Typed Formats, and Function Calling**
82 |
83 | One way to control LLM outputs is to ask for **strictly structured responses**. For example, you might instruct the model to output a JSON object with specific fields (which you then parse), or to adhere to a Pydantic/TypeScript schema. This is especially useful for intermediate steps like planning or for tools that consume LLM output (like an automated CI check expecting a JSON test report).
84 |
85 | - **Plan/Spec in JSON:** You can prompt the LLM to produce a plan in JSON (e.g., an array of steps, each with a description and list of files to create). This makes it easier to parse and feed into automation. OpenAI's GPT-4 can be given a JSON schema via the system message or using function calling to enforce structure. Many agent frameworks use this for the planning phase. _However_, experience shows that when it comes to actual code, rigid formats can backfire. For instance, an attempt to have GPT output diffs or code embedded in JSON often fails because of escaping issues or context loss . Paul Gauthier (creator of aider ) noted that wrapping code in JSON leads to syntax errors and model confusion – _"GPT is worse at editing code if you use [structured formats like JSON]. ...Due to escaping issues, GPT's code is often syntactically incorrect when unpacked from JSON"_ . So use structured output where it makes sense (structured data, plans, test results) but be cautious about using it for large code blobs. • [15](https://github.com/Lesterpaintstheworld/aider/blob/61082ffd941ec0f26b735c50c42476c755d6be69/website/docs/unified-diffs.md#L125-L133) [16](https://github.com/Lesterpaintstheworld/aider/blob/61082ffd941ec0f26b735c50c42476c755d6be69/website/docs/unified-diffs.md#L134-L142)
86 | - **Function Calling API:** With GPT-4 and newer models, you can define "functions" that the model can call with JSON arguments. This is powerful for tools (e.g., a create_file function that takes {path, contents} as args). In an agent scenario, you might have functions like open_file(path) , run_tests() , etc. The model, if properly prompted, will output a JSON that •
87 |
88 | the API interprets as a function call. This guarantees structured input to your tools. Projects like LangChain, AutoGen, and others allow defining such tools easily. For example, _OpenAI's function calling was tested as a way to have GPT produce code edits_ (by calling an edit_code function with location and changes). The SWE-Agent paper also suggests that well-designed interfaces ("Agent-Computer Interface") improve reliability . They implemented commands instead of raw text for actions like browsing or editing, which made the agent more effective. If you implement function/ tools: keep them **simple and orthogonal** (each does one thing clearly). Also handle errors – e.g., if the model calls a function with invalid JSON (common if it slightly deviates), you need to catch that and perhaps remind the model to conform. [17](https://github.com/ozyyshr/RepoGraph/blob/6c3977d87845993bf2c0359b4ac752278d7f3c45/SWE-agent/README.md#L32-L40)
89 |
90 | **Schemas for Validation:** If not using the API-level function calling, you can still enforce output schema by post-processing the LLM output with a parser like Pydantic (for Python) or a JSON schema validator. A pattern is: "If the output is not valid according to this schema, ask the model to correct it." Some OSS libraries (like _GuardrailsAI_) provide a wrapper to do this automatic checking and correction loop. This is great for outputs like config files, JSON outputs for another service, etc. _Example:_ If generating a CI workflow YAML, you might run it through a linter or YAML parser to ensure validity; if broken, prompt the LLM with the error to fix it. •
91 |
92 | **Key Point:** There is a tension between structured output and code generation. Structured formats shine for non-code or meta-output, whereas for code, using the code's _native format_ (diff, full file text, etc.) tends to work better. In fact, aider's research found that asking GPT-4 to output unified diffs (a format it "knows" from training) drastically improved quality and reduced lazy errors . The diff format is structured, but in a way that is natural for code. The model treated it more rigorously, as if it knew a program (patch) would read it, leading to fewer omissions . So, "structured output" might also mean choosing a format the model is comfortable with. This leads to the next technique: [18](https://github.com/Lesterpaintstheworld/aider/blob/61082ffd941ec0f26b735c50c42476c755d6be69/website/docs/unified-diffs.md#L50-L59) [19](https://github.com/Lesterpaintstheworld/aider/blob/61082ffd941ec0f26b735c50c42476c755d6be69/website/docs/unified-diffs.md#L62-L70) [18](https://github.com/Lesterpaintstheworld/aider/blob/61082ffd941ec0f26b735c50c42476c755d6be69/website/docs/unified-diffs.md#L50-L59)
93 |
94 | ## **3.3 Incremental Development: Patch/Diff Workflow and Small Commits**
95 |
96 | Rather than having the LLM emit entire files or entire projects in one go, a proven strategy is an **iterative diff-based workflow**: - The agent or assistant makes changes in small increments (like a Git patch) which can be reviewed or tested, then more changes are made. This mimics how a developer might make a series of commits. - The unified diff format (the output of git diff -U ) is a handy way to represent changes. It's line-based, shows context, and the LLM likely has seen many diffs during training. As noted, switching GPT-4 to output unified diffs made it _3x less likely to produce incomplete "lazy" code_ compared to a previous format . It essentially forces the model to be precise about what to change. - Tools like aider now default to a diff-based editing: you prompt what you want, and it returns a diff of changes to apply to your code. This has the benefit of not regurgitating the entire file (avoiding model mistakes in parts of the file you didn't intend to change). It also integrates well with version control – you can apply the diff as a patch and commit. [20](https://github.com/Lesterpaintstheworld/aider/blob/61082ffd941ec0f26b735c50c42476c755d6be69/website/docs/unified-diffs.md#L34-L42)
97 |
98 | For example, if you want to add a feature to a function, an interactive agent can retrieve the file, then you instruct "Add feature X to function Y," and the agent produces a diff snippet adding those lines. You apply it, run tests, and iterate. This keeps the context window usage efficient (only the relevant file part and diff are in play).
99 |
100 | **Small PRs & Review Prompts:** Similar to diffs, think in terms of _Pull Requests_ of limited scope. When using an LLM, it's wise to aim for one feature or bugfix per PR. After each, you or the agent run tests and possibly do a review. Some workflows even include an LLM _reviewer_ agent that checks the diff for potential issues or ensures it meets the spec (acting like a second pair of eyes). You can prompt ChatGPT: "Review the following diff for any mistakes or deviations from the requirements," and it will highlight issues. This is a guardrail before code merges.
101 |
102 | Another trick: after the LLM generates code, ask it to explain the code. If the explanation doesn't match the intention, that's a red flag to fix. Some developers include an assistant prompt like "summarize how the new code works" as a way to verify understanding.
103 |
104 | ## **3.4 Task Decomposition and Checklisting**
105 |
106 | Even with a high-level plan (from Section 1), when coding starts it's easy for the LLM to get off track or for requirements to slip through the cracks. Using explicit **checklists and breakdowns in prompts** can mitigate this.
107 |
108 | - **Decompose Goals in Prompts:** Before generating code, have the LLM restate or list sub-tasks it's about to do. For instance, "First, I will create the database model for X, then update the API endpoint, then adjust tests." This ensures it has a plan for the current prompt. If it misses something in the list, you catch it early. You can instruct the LLM to always outline its approach before writing code (some refer to this as the "chain-of-thought" or self-reflection step). •
109 | - **Use To-Do Lists:** Some agents prompt the model to output a checklist [ ] Step 1, [ ] Step 2, ... and then iterate on each. Others use the model to verify each requirement is addressed. A simple manual method: after code generation, ask _"Did you cover all acceptance criteria? List any missing pieces."_ The model might then realize it forgot a case and you can prompt it to implement that. •
110 | - **One Change at a Time:** Encourage the model to focus. For example, if you need to implement two unrelated features, do them in separate interactions. This helps because the model's output won't become too large or mixed (which can confuse it and you). The **GPT Pilot** team explicitly notes that having the model code step-by-step, debugging as it goes, is more effective than "having it spit out the whole codebase at once" . By mirroring a human's iterative development process, the model can tackle issues incrementally. • [21](https://github.com/Pythagora-io/gpt-pilot/blob/186f98e3a75cc0b5e33c266b0ceccce176dc43ee/README.md#L194-L202)
111 |
112 | ## **3.5 Automated Execution Loops with Validation**
113 |
114 | A powerful pattern is the **execute -> validate -> feedback loop**. This means after the LLM writes some code, you run something (tests, type checker, linter, or even the program) and feed results back into the LLM for fixes.
115 |
116 | Several agent frameworks do this: - **Wasp GPT Web App Generator** (from Wasp-lang) generates the code for an app and then _"checks each file for expected errors or hallucinations and fixes them"_ . In practice, this could mean they compile the code or run a linter, see if there's a syntax error or an undefined variable, then prompt GPT to resolve it. By building this into the loop, the final output is more likely to run on first try. - **OpenAI's AutoGPT / BabyAGI** style agents often have a loop where they run tests. A refined example is **Crew** or **SWE-Agent** which run pytest after generating code and if tests fail, the assistant reads the traceback and fixes the code. - If you're not building a fully autonomous agent, you can still manually do this: whenever ChatGPT gives you code, paste any error messages or failing test outputs and say "Here's the error, please fix." The LLM will utilize that feedback effectively. [22](https://github.com/wasp-lang/wasp/blob/0c6b0be9b0f6b9b47e12595b6c4146e454bc2293/web/blog/2023-08-01-smol-ai-vs-wasp-ai.md#L160-L168)
117 |
118 | For solo dev automation, you can script this with a simple harness: 1. Have the LLM generate code for task N. 2. Run mypy (for Python) or tsc --noEmit (for TypeScript) to catch type errors. Run your test suite. 3. If any failures, feed the error text into the next prompt: _"The following test failed…"_ or _"Type checker error: …"_ and ask to fix. 4. Loop until clean or a certain number of iterations.
119 |
120 | This requires that you have at least some tests in place (even very basic ones). If no formal tests, you can still run the program with sample input and catch runtime errors.
121 |
122 | **Caution:** Not all errors are easily fixed by the model (some may need design changes). Monitor if the loop is thrashing (making one change, causing another issue, etc.). If so, step in and analyze or break the problem down further.
123 |
124 | ## **3.6 Guardrails and Safe-guards**
125 |
126 | LLMs sometimes produce outputs that violate project constraints or even common-sense boundaries (like deleting important files, writing to the wrong directory, introducing security flaws, etc.). Setting up **guardrails** can prevent or catch these issues:
127 |
128 | - **Allowed File Operations:** If using an agent that can write files, restrict its write access. For example, run it in a container or workspace folder (as OpenDevin does by running the agent in a Docker sandbox mapped to a specific directory) – this way even if it tries to modify something outside, it can't . Define which directories it should write to. Some agents maintain an allowlist of file patterns it's allowed to touch and will refuse others. If you roll your own, implement a simple check: if the agent tries to create/modify a file not under the project root or in a DONOTEDIT folder, ignore or override that action. • [10](https://github.com/dxdyt/blog-web/blob/1b7415b94f50f69302ea0850019fdc12f56e61ca/content/posts/OpenDevin.md#L68-L76)
129 | - **Regex/AST Checks on Outputs:** After the model gives an output (especially if it's supposed to be code), run some automatic checks. Regex can catch things like profanity (not likely in code) or usage of disallowed functions. AST-based linters can catch more: e.g., you might ban use of eval() or ensure all new code has type annotations. If a check fails, you can instruct the model to fix it: _"The code used eval which is not allowed. Please remove it."_ •
130 | - **Code Linters/Formatters:** Always have a formatter (black, Prettier, etc.) and linter (ESLint, flake8, etc.) configured. They not only keep style consistent (which helps the LLM not get confused by inconsistent patterns) but also catch simple errors. Remarkably, **SWE-Agent** integrated a linter in its Agent-Computer Interface – whenever the agent tried to make an edit, a linter ran and if the code wasn't syntactically correct, the edit was rejected . This forced the model to only commit changes that at least parse. You can do the same: run lint in CI or pre-commit and fail if syntax broken – then have the agent fix syntax before continuing. • [12](https://github.com/ozyyshr/RepoGraph/blob/6c3977d87845993bf2c0359b4ac752278d7f3c45/SWE-agent/README.md#L36-L43)
131 | - **Type Checking:** Especially in Python, lack of types can let subtle mistakes through. If you add type hints and run mypy, you catch many issues early. The agent will learn to satisfy the type checker (treat it like another form of test). For front-end or Node, use TypeScript to similar effect. Many agent developers have noted that encouraging the model to produce typed code reduces errors (because the model self-consistently fills types, and any mismatch is an error to fix). •
132 |
133 | - **CI Gates:** Treat the LLM's contributions like a human PR. Set up Continuous Integration to run tests on each change (GitHub Actions, etc.). You can even automate the loop: if CI fails, have an Action that comments on the PR with the failure. A GitHub App or simple script can pipe that back to your ChatGPT with a prompt "fix based on this CI output." This is cutting-edge and may require some glue code (see Section 7 for an example of a CI guardrail action). But it closes the loop for autonomous fixes. •
134 | - **Security and Dependency Checks:** If the project is going to production, use tools like npm audit or pip safety to catch vulnerable dependencies that the model might have added. Also consider scanning generated code with static analysis (e.g., Bandit for Python security issues). If the LLM introduces, say, a hardcoded secret or an SQL injection risk, these tools might catch it and you can then prompt a fix. •
135 |
136 | **Real-world note:** Many of these guardrails are being actively researched. The Princeton SWE-Agent team emphasize how their interface design (like limiting how much of a file the agent sees at once, and confirming tool outputs) made a big difference in reliability . OpenAI's own "Code Interpreter" (now ChatGPT Advanced Data Analysis) runs code in a sandbox with resource limits. Following that example, keep your agent environment sandboxed and limited in what it can impact. [17](https://github.com/ozyyshr/RepoGraph/blob/6c3977d87845993bf2c0359b4ac752278d7f3c45/SWE-agent/README.md#L32-L40)
137 |
138 | # **4. Workflow: Idea to Release**
139 |
140 | Putting it all together, this section presents a step-by-step **workflow** from project inception to release, optimized for an LLM-assisted development process. Think of it as a recipe you can follow for each new project or feature.
141 |
142 | **Step 1: Project Idea and Requirements** - **Capture the Idea:** Write down the project's elevator pitch. What problem does it solve? Who is the user? Keep it high-level; this is to ensure clarity of purpose. - **Define Scope for MVP:** List core features vs. nice-to-haves. (LLMs have a tendency to overbuild if not constrained.) Clearly state what's _out of scope_. - **Choose Tech Stack:** Decide language(s) and key frameworks/libraries. This will influence prompts (e.g., "We are using React and Node" or "a CLI tool in Python"). Ensure the LLM knows what stack – otherwise it might default to something else. - **Identify Constraints:** Any performance requirements, target platforms, or compliance needs? Note these.
143 |
144 | ### **Step 2: Specification and Planning**
145 |
146 | _(Upfront scaffolding as detailed in Section 1.)_ - **Write a Short PRD/Spec:** One or two pages describing how the system should work. Include example inputs/outputs, diagrams if helpful, etc. - **List Acceptance Criteria:** "User can do X", "System must Y", and non-functionals. This doubles as the test plan. - **Architecture Outline:** Decide roughly how to structure (monolith? layers? external services?). Choose repo pattern (likely monorepo for solo dev). Sketch out major components and how they interact. - **Plan Tasks:** Break the work into a sequence of tasks. Each task should deliver a testable piece. For example: "Task 1: Implement database models. Task 2: CRUD API endpoints. Task 3: CLI interface," etc. Within each, smaller sub-steps too. - **Prompt Generation of Plan (Optional):** If unsure, you can ask the LLM to draft a plan based on the spec. Provide the spec and ask for an ordered list of steps and files to create. _Review this plan carefully and adjust._ The LLM might suggest too much at once – feel free to split steps further or merge some.
147 |
148 | #### **Step 3: Repository Setup (Scaffolding)**
149 |
150 | _(Also see Section 6 for templates.)_ - **Initialize Repo:** Create a new Git repository (git init). - **Repo Structure:** Create the directory layout: e.g., src/ , tests/ , etc. Use cookiecutter or templates if you have them. (Or run the scaffold script from Section 7.) - **Essential Files:** Add basic files like README.md (with a project description and maybe a todo list of tasks), .gitignore , license if needed, and placeholder config files (pyproject.toml/package.json, etc. with minimal content just to have them in place). - **ADR Log:** Add an / adr folder with a template if you plan to use ADRs. Possibly record an ADR for "Repo structure and tech choices" as first entry. - **Pre-commit Hooks:** If using, set up a .pre-commit-config.yaml with linters/ formatters and enable it. (This will auto-fix some issues whenever you commit.) - **CI Pipeline:** Add a dummy GitHub Actions workflow (or other CI) that maybe just runs tests (which will initially be none or sample). The point is to have the plumbing ready so it's not a surprise later. - **Devcontainer/Docker (Optional):** If you want a reproducible dev environment, include a Dockerfile or .devcontainer now – at least a basic one – so that if the LLM later needs to adjust environment, it knows it exists.
151 |
152 | ### **Step 4: Iterative Implementation with LLM**
153 |
154 | Now the main loop of coding with the LLM assistant begins. For each task or feature: 1. **State the Intent:** Start a prompt for the LLM clearly stating what we're about to do. Provide context: relevant spec snippets, acceptance criteria, and relevant file names from scaffolding. _Example:_ "Implement the User model and repository. The acceptance criteria: must have fields X, Y; should hash passwords; add corresponding unit tests. Current project structure: we have a models/ folder. Please output the code for the user_model.py and user_repository.py ." Being this explicit focuses the model. 2. **Let LLM Propose Code:** The LLM will likely produce one or more files or code blocks. Ensure it names files correctly. If it mixes multiple files in one go, you might have to split them. It's often better to do one file at a time: you can say "Let's do the model class first…" to avoid confusion. 3. **Review and Apply Diff:** If using a diff workflow, the LLM might output changes. Apply them to your codebase and git add / commit (perhaps to a feature branch). 4. **Run Tests/Checks:** Immediately run pytest or relevant tests for this part. Also run linters/ type-checkers. If something fails, note the errors. 5. **Error Fix Loop:** Feed errors back to LLM: "I ran tests, got this assertion failure…" or "Type checker says type mismatch on line 10." The LLM should then give a fix. Apply the fix (often another diff). 6. **Rinse Repeat Until Green:** Continue until the tests for this task pass and no lint/type errors. If you get stuck or the LLM is hallucinating fixes that don't work, you might need to intervene (perhaps break the problem down more, or check if the test is correct). 7. **Refactor if Needed:** Sometimes after implementing a few pieces, patterns emerge that suggest refactoring. You can intentionally prompt the LLM to refactor something (e.g., "Now refactor user_repository.py to remove duplication with order_repository.py "). Keep refactor commits separate from feature commits for clarity. 8. **Document as You Go:** Whenever a feature is done, update docs: e.g., ensure the README usage example covers it, or write docstrings. You can ask the LLM to generate a docstring for a function after it's implemented if it didn't already.
155 |
156 | Proceed feature by feature. Commit often. If working with branches, you might create a PR at logical checkpoints and even have the LLM help write the PR description.
157 |
158 | ### **Step 5: Testing and Validation**
159 |
160 | After implementing the planned tasks: - **Full Test Suite Run:** Run all tests, ensure 100% passing. If not, fix (maybe write additional tests for uncovered scenarios). - **Additional QA:** Do some manual testing if it's an app (run it locally, try a quick scenario). This might reveal issues that the automated tests didn't catch. - **Performance Check (if relevant):** If you had performance criteria, do a basic benchmark or analysis. This might be manual unless you script it. If something is slow or memory-heavy, consider prompting the LLM for a performance fix or review.
161 |
162 | If any issues found, address them with the LLM's help. Remember you can always dig deeper: e.g., "Explain how the current caching works and why it might be slow." If the explanation surfaces a flaw, you can then prompt a correction.
163 |
164 | #### **Step 6: Documentation**
165 |
166 | - **User-Facing Docs:** Ensure README explains how to install/run the project. If it's a library, generate API docs or at least a usage example. You can have the LLM draft a section like "Usage" based on the code. - **Developer Docs:** If this is not a one-off throwaway, document the architecture (maybe update that ARCHITECTURE.md or the ADRs). The LLM can help summarize the final architecture. You might prompt: "Generate an architecture summary in Markdown: list main modules and their responsibilities." Verify and edit the output. - **Changelog/Release Notes:** Summarize what was built, perhaps for a release tag. LLMs are quite good at turning commit logs into coherent release notes if you feed them the commit messages.
167 |
168 | #### **Step 7: Final Review (Human in the Loop)**
169 |
170 | Even if the LLM got you here, do a final self-review: - skim through critical sections of code (securitysensitive logic, complex algorithms) to ensure they make sense, - run a security scan or use a tool like GitHub's CodeQL if available, - double-check that all acceptance criteria from Step 1 are indeed met.
171 |
172 | This is where your expertise complements the AI: maybe the code works but isn't idiomatic – you might refactor a bit for clarity.
173 |
174 | #### **Step 8: Release**
175 |
176 | - Bump version numbers (if any), commit release. - Create a release tag, build artifacts if needed (the CI or a build script can do that). - If publishing (to PyPI, npm, Docker Hub, etc.), use your standard process. LLM could assist in writing a publish script or Dockerfile if you prompt it.
177 |
178 | Celebrate! :tada: You built something with your AI pair programmer. •
179 |
180 | This workflow emphasizes iterative development, validation at each step, and constant alignment with the spec. It's essentially agile methodology but with an AI assistant doing a lot of the heavy lifting under your guidance. The exact flow might be adjusted based on the project, but the core idea is the same: **small cycles of plan -> code -> test -> review**.
181 |
182 | # **5. Prompt Templates for Each Phase**
183 |
184 | Crafting effective prompts is critical for guiding LLM behavior. Here we provide example **prompt templates** (in **bold** for system or role instructions, and regular text for user prompts) for different phases/roles in the development workflow. We also highlight expected output format schemas and give _"anti-prompts"_ (common prompt mistakes or model failure modes to avoid).
185 |
186 | **General Prompting Tips:** Always remind the model of its role (e.g. "You are an expert Python developer…") and the project context at the start of each session or major prompt. If the model's output strays, you may need to reiterate constraints.
187 |
188 | ## **5.1 Planner / Architect Prompt**
189 |
190 | Role: _Plan the project or a new feature before coding._ This prompt aims to get a high-level plan, list of tasks or files, or an architecture decision.
191 |
192 | #### **System Prompt (Planner):**
193 |
194 | ```
195 | You are a Solution Architect AI assisting in software design.
196 | Follow the requirements strictly and do not assume unspecified needs.
197 | Output an organized plan only, without writing any code.
198 | If you list files or components, briefly describe each.
199 | Use a markdown list or JSON as specified.
200 | ```
201 |
202 | #### **User Prompt:**
203 |
204 | Project: "Todo App with user login and task management" Description: A web app where users can sign up, create todo tasks, mark them done. Requirements: - Users have username/password login. - Can create/read/update/delete tasks. - Tasks have due dates and a done status. - Use a REST API + simple HTML frontend. Tech: Python Flask for API, SQLite DB, Vanilla JS for frontend. >>> Provide a step-by-step plan to implement this. Include key modules/files you'll create (with names) and which features go in each. Also note any important design decisions (e.g., auth method). Output as a markdown numbered list of steps, each step can have sub-bullets for files.
205 |
206 | ## _Expected Output (excerpt):_
207 |
208 | 1. **Design Database and Models** – Define data schema for User and Task.
209 |
210 | - _models.py_: User with fields (id, username, password_hash), Task with fields (id, user_id, description, due_date, is_done). Use SQLite via SQLAlchemy.
211 |
212 | - Decision: use PBKDF2 for password hashing (security).
213 | - 2. **Set Up Flask App Structure** Create Flask app and config.
214 | - _app.py_: initialize Flask, DB, register blueprints.
215 | - _config.py_: configuration (database URI, secret key).
216 | - 3. **User Authentication** endpoints for register, login, and auth management…
217 |
218 | _(and so on)_
219 |
220 | Each item likely has sub-items. The model might also output JSON like:
221 |
222 | ```
223 | {
224 |   "steps": [
225 |     {"name": "Design Database and Models",
226 |      "files": {"models.py": "contains User and Task models using SQLAlchemy"},
227 |      "decision": "use SQLite and store passwords hashed"},
228 |     ...
229 |   ]
230 | }
231 | ```
232 |
233 | Either is fine as long as it's structured. The system prompt asked for organized plan, so a list format is expected.
234 |
235 | ## **Anti-Prompt Pitfalls (Planner):**
236 |
237 | - Do not ask the model to start coding immediately in the planning phase. If you accidentally say "and provide code," you'll derail the planning. - Avoid vague prompts like "How should I build this?" without context – always include the project details or it will guess incorrectly. - If the model output is too verbose or narrative ("First, we will do X. This is important because…"), remind it to be succinct and structured. - If it misses parts (e.g., no mention of frontend in plan when you needed one), that means the prompt wasn't clear enough about that requirement. Tweak and re-ask.
238 |
239 | ## **5.2 Scaffolder Prompt**
240 |
241 | Role: _Generate initial scaffolding or boilerplate._ This is where we want the LLM to produce the skeleton of files (perhaps empty functions, class definitions, or basic project structure code).
242 |
243 | Often, you might skip this because you manually scaffold or use a script. But if you do use LLM: - You should have the plan from above as context. - You may ask it to output a tree or multiple files at once (be cautious; sometimes better to do one file at a time).
244 |
245 | ## **System Prompt (Scaffolder):**
246 |
247 | You are a code generation assistant specialized in project scaffolding. Produce only the code required, no extra explanations. If multiple files are needed, clearly separate them (e.g., file name in a comment or markdown heading).
248 |
249 | ## **User Prompt (could be continuation from planning):**
250 |
251 | Using the plan above, generate the initial project structure for step 1 and 2: - models.py with the User and Task model classes (empty methods if any). - app.py with a basic Flask app setup (just the skeleton). Include necessary import statements.
252 |
253 | Format: Provide each file in a separate fenced code block, prefix with the file name as a comment.
254 |
255 | #### _Expected Output:_
256 |
257 | It should ideally produce something like:
258 |
259 | ````
260 | ```python
261 | # models.py
262 | from flask_sqlalchemy import SQLAlchemy
263 | db = SQLAlchemy()
264 | class User(db.Model):
265 |     id = db.Column(db.Integer, primary_key=True)
266 |     username = db.Column(db.String(80), unique=True, nullable=False)
267 |     password_hash = db.Column(db.String(128), nullable=False)
268 |     # relationships, __repr__ omitted for now
269 | class Task(db.Model):
270 |     id = db.Column(db.Integer, primary_key=True)
271 |     user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
272 |     description = db.Column(db.String(255), nullable=False)
273 |     due_date = db.Column(db.DateTime, nullable=True)
274 |     is_done = db.Column(db.Boolean, default=False)
275 |     # __repr__ omitted
276 | ````
277 |
278 | ```python
279 | # app.py
280 | from flask import Flask
281 | from models import db
282 | app = Flask(__name__)
283 | app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todo.db'
284 | app.config['SECRET_KEY'] = 'dev' # to be changed in production
285 | db.init_app(app)
286 | # (No routes yet)
287 | if __name__ == "__main__":
288 |     app.run(debug=True)
289 | ```
290 |
291 | ```
292 |
293 | It separated files with comments as requested. This is just scaffold: minimal content.
294 |
295 | #### **Anti-Prompt Pitfalls (Scaffolding):**
296 |
297 | - If you ask for too many files at once, the model might merge them or truncate. It's safer to ask one or two at a time. - Ensure you specify *how* to separate files (some models use a special syntax like <<filename>> or just mention it in text). - Don't let the model get carried away filling in logic that should come later. If it starts writing complete functions with business logic during scaffolding, intervene and clarify "Only structure, no full logic yet." - Ambiguity in file names can cause issues. If two files have similar names, maybe provide them explicitly.
298 |
299 | ### **5.3 Implementer (Coder) Prompt**
300 |
301 | Role: *Implement a specific feature or function.* This is the most common prompt where you ask the model to write or modify code.
302 |
303 | By this stage, you have context: maybe existing code, tests, etc. Always include relevant pieces in the prompt (or have them open in context if using an IDE integration).
304 |
305 | #### **System Prompt (Implementer/Coder):**
306 |
307 | You are a senior software engineer coding in [LANGUAGE]. Follow best practices and ensure the implementation meets the requirements and passes tests. Provide only the code changes asked for, and nothing else. If modifying existing code, output a unified diff. If creating new code, output the full file content.
308 |
309 | (The diff vs full content instruction is if you want to use the diff workflow.)
310 |
311 | ### **User Prompt examples:**
312 |
313 | *New Feature Implementation:* •
314 |
315 | ```
316 |
317 | Implement the register and login routes in Flask for the Todo app.
318 | Requirements:
319 |
320 | - POST /register: create a new user (hash password, store in DB), return
321 |   success or errors.
322 | - POST /login: verify credentials, start a session (you can simulate
323 |   session with a simple token or session cookie using Flask login).
324 |   Use Flask's conventions, and ensure to handle duplicate username
325 |   gracefully.
326 |   Below is the current app.py and models.py for context.
327 |
328 | ```
329 |
330 | *(Here you'd paste or include app.py content if needed.)*
331 |
332 | *Bug Fix:* •
333 |
334 | ```
335 |
336 | The task due_date is not saving correctly (always null). Fix the bug.
337 | Code context:
338 | models.py (Task model) and wherever the Task is being created/updated.
339 | Potential issue: maybe forgot to parse date from input.
340 | Please correct it.
341 | Output a diff of changes.
342 |
343 | ```
344 |
345 | *Refactor:* •
346 |
347 | > Refactor the Task model and related logic to separate the "is\_done" into a method rather than direct field access in multiple places. E.g., create a method mark\_done() in Task that sets is\_done True and maybe logs time. Update any code that toggles is\_done to use this method. Provide a diff for models.py and any other file changed.
348 |
349 | *Expected Outputs:*
350 |
351 | For the new feature, it might output full new code blocks for the routes, or diffs showing additions to app.py:
352 |
353 | ```
354 |
355 | # app.py (showing additions)
356 |
357 | - from flask import request, jsonify, session
358 | - from werkzeug.security import generate_password_hash, check_password_hash
359 |   app = Flask(**name**)
360 |   ...
361 | - @app.route('/register', methods=['POST'])
362 | - def register():
363 | - data = request.get_json()
364 | - username = data.get('username')
365 | - password = data.get('password')
366 | - if username is None or password is None:
367 | - return jsonify({"error": "Missing username or password"}), 400
368 | - # check if user exists
369 | - if User.query.filter_by(username=username).first():
370 | - return jsonify({"error": "User already exists"}), 400
371 | - # create new user
372 | - user = User(username=username,
373 |   password_hash=generate_password_hash(password))
374 | - db.session.add(user)
375 | - db.session.commit()
376 | - return jsonify({"message": "User registered successfully"}), 201
377 | -
378 |
379 | ```
380 |
381 | ```
382 |
383 | - @app.route('/login', methods=['POST'])
384 | - def login():
385 | - data = request.get_json()
386 | - username = data.get('username')
387 | - password = data.get('password')
388 | - user = User.query.filter_by(username=username).first()
389 | - if user is None or not check_password_hash(user.password_hash, password):
390 | - return jsonify({"error": "Invalid credentials"}), 401
391 | - # simple session
392 | - session['user_id'] = user.id
393 | - return jsonify({"message": "Login successful"}), 200
394 |
395 | ```
396 |
397 | This diff adds the needed routes.
398 |
399 | For the bug fix, maybe:
400 |
401 | ```
402 |
403 | class Task(db.Model):
404 | ...
405 |
406 | - due_date = db.Column(db.DateTime, nullable=True)
407 |
408 | * due_date = db.Column(db.DateTime, nullable=True)
409 |
410 | # In the route where task is created (assuming /tasks create endpoint)
411 |
412 | - due_date = request.json.get('due_date')
413 | - new_task = Task(user_id=user.id, description=desc, due_date=due_date)
414 |
415 | * due_date_str = request.json.get('due_date')
416 | * due_date = datetime.fromisoformat(due_date_str) if due_date_str else None
417 | * new_task = Task(user_id=user.id, description=desc, due_date=due_date)
418 |
419 | ```
420 |
421 | This fixes parsing of date string to datetime.
422 |
423 | ## **Anti-Prompt Pitfalls (Implementer):**
424 |
425 | - Not providing enough context: If you say "implement X" but don't show relevant code, the model might redeclare classes or call undefined functions. Always supply what it needs (the relevant file content or at least function signatures). - Overly large asks: "Implement the entire UI and backend for tasks" in one go is too much. Split into smaller prompts. - Forgetting to specify output mode: The model might output the whole file when you only wanted a diff, or vice versa. Be explicit: "provide a diff" or "provide full code" as needed. - Accepting code blindly: even if it looks good, run tests. Sometimes the logic is subtly wrong. If it compiles but logic is off, write a test and then let the model fix. - Hallucinated APIs: If the model starts using functions that don't exist (e.g., it thinks there is a User.create() method but you didn't have one), you have to correct it. Either define such function (maybe it's a good idea) or tell the model "We don't have that function, use this instead." This often happens if the prompt doesn't share enough of the code context.
426 |
427 | ## **5.4 Tester Prompt**
428 |
429 | Role: *Generate tests or verify behavior.* You might use this after implementing features to have the LLM create more tests, or even beforehand in a TDD style.
430 |
431 | #### **System Prompt (Tester):**
432 |
433 | You are an expert test engineer. Write tests that are thorough and directly related to the requirements. Use [testing framework] conventions. Output only the test code.
434 |
435 | #### **User Prompt:**
436 |
437 | Write unit tests for the Task model and the /tasks API endpoints. Scenarios to cover: - Creating a task (POST /tasks) returns 201 and the task has correct fields. - Cannot create task without auth (if applicable). - Marking a task done changes its status. Use pytest style for the API (maybe using Flask test client). The current code for app.py and models.py is below for reference.
438 |
439 | *(Then include the relevant code or at least function signatures of endpoints.)*
440 |
441 | *Expected Output:* It may produce something like:
442 |
443 | ```
444 |
445 | # test_tasks.py
446 |
447 | import pytest
448 | from app import app, db, User, Task
449 | @pytest.fixture
450 | def client():
451 | app.config['TESTING'] = True
452 | app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
453 | with app.test_client() as client:
454 | with app.app_context():
455 | db.create_all() # setup a default user
456 | user = User(username="testuser", password_hash="hashedpw")
457 | db.session.add(user); db.session.commit()
458 | yield client
459 | with app.app_context():
460 | db.drop_all()
461 | def test_create_task(client): # Assuming we need to login or include user; if session required, skip for
462 | now
463 | response = client.post('/tasks', json={"description": "Buy milk",
464 | "due_date": "2025-01-01T10:00:00"})
465 |
466 | ```
467 |
468 | ```
469 |
470 | assert response.status_code == 201
471 | data = response.get_json()
472 | assert data["description"] == "Buy milk"
473 | assert data["is_done"] is False # Task should be in database
474 | with app.app_context():
475 | task = Task.query.filter_by(description="Buy milk").first()
476 | assert task is not None
477 | assert task.is_done is False
478 | def test_mark_task_done(client): # create a task first
479 | client.post('/tasks', json={"description": "Do laundry"}) # mark done (assuming endpoint /tasks/<id>/done or similar)
480 | response = client.put('/tasks/1/done')
481 | assert response.status_code == 200
482 | data = response.get_json()
483 | assert data["is_done"] is True
484 | with app.app_context():
485 | task = Task.query.get(1)
486 | assert task.is_done is True
487 |
488 | ```
489 |
490 | *(This is just an illustrative guess; the actual tests depend on implementation details.)*
491 |
492 | #### **Anti-Prompt Pitfalls (Tester):**
493 |
494 | - The model might not know how to properly use the testing framework if the context isn't given. If it's getting pytest wrong, you may need to correct it or give an example test. - It might assume an endpoint exists ( PUT /tasks/1/done ) that you haven't implemented. That's fine if you plan to implement it; it reveals a missing piece. Otherwise, constrain it: "only test the endpoints implemented (GET /tasks, POST / tasks)." - Ensure the tests don't rely on global state from other tests (if so, instruct to use fresh database per test or use fixtures). - If it writes too few tests or misses edge cases, you can prompt "add tests for X scenario as well."
495 |
496 | ### **5.5 Reviewer Prompt**
497 |
498 | Role: *Review code or diff for issues.* This could be you asking the LLM to act as a code reviewer on a pull request, pointing out potential bugs, style issues, or requirement mismatches.
499 |
500 | #### **System Prompt (Reviewer):**
501 |
502 | You are a code reviewer. You will be given a code change (diff or snippet) and the original requirements. Provide a concise review: list any bugs, logic issues, or unmet requirements. Also suggest improvements if any. Do not approve the code if there are issues.
503 |
504 | #### **User Prompt:**
505 |
506 | Code change:
507 |
508 | *(then include the diff or code snippet that was changed)*
509 |
510 | Requirements:
511 |
512 | - Task due\_date should be stored in UTC.
513 | - Passwords must be hashed using PBKDF2.
514 |
515 | *(for example, provide relevant requirements or acceptance criteria)*
516 |
517 | Review the above code change for correctness and completeness.
518 |
519 | *Expected Output:* (As a review in natural language or bullet points)
520 |
521 | - It might say:
522 |
523 | - " The due\_date is parsed but not timezone-normalized – requirement says store in UTC, but the code doesn't ensure timezone-aware conversion. " - " Passwords are hashed using Werkzeug's generate\_password\_hash , which by default uses PBKDF2: meets the requirement." [16](https://github.com/Lesterpaintstheworld/aider/blob/61082ffd941ec0f26b735c50c42476c755d6be69/website/docs/unified-diffs.md#L134-L142)
524 |
525 | - " Potential issue: In login , session is used but Flask's session is not configured for security (SECRET\_KEY is default 'dev' ). Consider using a stronger secret and perhaps Flask-Login for session management."
526 |
527 | - " Improvement: After user registration, perhaps return a JWT or automatically log the user in, to improve UX (optional)."
528 |
529 | It should catch things related to given requirements or obvious bugs. It might cite line numbers of diff in its explanation (if diff was given).
530 |
531 | ## **Anti-Prompt Pitfalls (Reviewer):**
532 |
533 | - If the diff is too large, the model might miss context or truncate. Don't feed hundreds of lines at once. Break up or focus the review on critical sections. - The model could hallucinate issues; double-check any claim it makes. If it says "this could fail on null input" verify if that path is possible. - Don't let it rewrite code in the review prompt – the goal is to get feedback. If you ask "fix it," that becomes an implementer prompt again. Keep roles separate for clarity (though in practice, you might go straight to fix).
534 |
535 | ## **5.6 Refactorer Prompt**
536 |
537 | Role: *Perform a refactoring or optimization.* Use when you have working code but want it improved (cleaner, faster, etc.) without changing external behavior.
538 |
539 | ## **System Prompt (Refactorer):**
540 |
541 | ```
542 |
543 | You are a senior engineer performing a refactoring.
544 | Preserve the original functionality and public interfaces.
545 | Improve code readability/maintainability (and performance if specified).
546 | Explain briefly what you changed if non-obvious.
547 |
548 | ```
549 |
550 | **User Prompt:**
551 |
552 | Refactor the `Task` model and related functions for better clarity: - Move the mark done logic into Task.mark\_done() method as discussed. - Simplify any complex conditionals in task routes. Here's the current code:
553 |
554 | *(include models.py Task class and the route functions that deal with tasks)*
555 |
556 | Make sure all tests still pass after refactoring. Provide the diff of changes.
557 |
558 | *Expected Output:* (a diff showing changes across files, possibly with a short note if explanation was asked for)
559 |
560 | ```
561 |
562 | class Task(db.Model):
563 | ...
564 |
565 | - is_done = db.Column(db.Boolean, default=False)
566 |
567 | * is_done = db.Column(db.Boolean, default=False)
568 | * def mark_done(self):
569 | * """Mark the task as done."""
570 | * self.is_done = True
571 | * # potentially could add timestamp or other side effects here in future
572 |
573 | # In routes (assuming /tasks/<id>/done endpoint exists or we add it):
574 |
575 | -@app.route('/tasks/<int:task_id>/done', methods=['PUT'])
576 | -def mark_done(task_id):
577 |
578 | - task = Task.query.get_or_404(task_id)
579 | - task.is_done = True
580 | - db.session.commit()
581 | - return jsonify({"message": "Task marked done", "is_done": True})
582 |   +@app.route('/tasks/<int:task_id>/done', methods=['PUT'])
583 |   +def mark_done_endpoint(task_id):
584 |
585 | * task = Task.query.get_or_404(task_id)
586 | * task.mark_done()
587 | * db.session.commit()
588 | * return jsonify({"message": "Task marked done", "is_done": True})
589 |
590 | ```
591 |
592 | *(It refactored to use mark\_done method.)*
593 |
594 | Perhaps also any conditional simplifications:
595 |
596 | ```
597 |
598 | - if not user:
599 | - return jsonify({"error": "Not logged in"}), 401
600 | - # else continue
601 |
602 | * if user is None:
603 | * return jsonify({"error": "Not logged in"}), 401
604 |
605 | ```
606 |
607 | (This is minor, but just an example of cleaning.)
608 |
609 | #### **Anti-Prompt Pitfalls (Refactorer):**
610 |
611 | - Danger is that the model accidentally changes behavior. Emphasize in prompt to keep functionality identical. After refactor, run tests to ensure nothing broke. - If model output is too large (it might output entire file), ensure you provided diff instruction or it might rewrite big chunks unnecessarily. - Sometimes model may not fully grasp context and remove something important – double-check the diff manually. - If optimizing for performance, ensure it doesn't micro-optimize at cost of readability unless that was the goal. Provide specific goals ("reduce time complexity of function X from O(n^2) to O(n) if possible").
612 |
613 | #### **Schema Enforcement in Prompts:**
614 |
615 | Notice that in these templates, we sometimes asked for JSON or a list, etc. This is to structure outputs. If you absolutely require a JSON, you could provide a JSON schema. For instance, for a plan:
616 |
617 | ```
618 |
619 | Provide output in JSON with keys: "files": list of filenames, each with
620 | "purpose": string.
621 |
622 | ```
623 |
624 | Then parse accordingly. Use this sparingly for code content as discussed.
625 |
626 | ## **Summary of Anti-Patterns:**
627 |
628 | - **Prompting for multiple disparate tasks at once:** e.g. "Do X and Y and Z" can confuse the focus. Split into sequential prompts. - **Yes/No questions to the code model:** If you ask "Is this code good?" the model might just say "Yes, looks good" instead of improving it. Better to directly ask for improvement or issues as shown. - **Ignoring token limits:** If you feed too much code, model might truncate output or ignore some context. Trim unnecessary parts from context (you can say "… other functions omitted …" if they're not relevant). - **Noisy system prompts:** Keep system role instructions concise and consistent. If you change style mid-way it might throw it off. - **Forgetting to set temperature (if using API):** For coding, use a relatively low temperature (0-0.3) for deterministic output. High temperature may produce creative but inconsistent code.
629 |
630 | These templates are starting points. You should iterate on them and adjust wording based on model's responses. Building a **prompt library** (like a prompts.md in your repo) can be useful, where you keep successful prompts for reuse. Some projects include such prompt collections as part of documentation.
631 |
632 | # **6. Repository Templates (Python & TypeScript)**
633 |
634 | This section provides **repository templates** for two common scenarios: a Python project and a TypeScript (Node + front-end) project. These include suggested file/folder trees and sample placeholder files. You can copy-paste these as a starting scaffold for your own projects, modifying names as needed. Each template includes: - A base file structure tree. - Key config files (with minimal content). - Example README and contributor docs. - An ADR template. - Example prompt design markdown.
635 |
636 | ## **6.1 Python Project Template**
637 |
638 | Let's assume a Python web service or CLI tool repository. We will use a structure suitable for a Python package with tests, and use common tools (pytest, flake8, black, etc.).
639 |
640 | ### **File/Directory Tree:**
641 |
642 | ![](_page_23_Figure_5.jpeg)
643 |
644 | ```
645 |
646 | ├── Dockerfile
647 | └── .devcontainer/
648 | └── devcontainer.json
649 |
650 | ```
651 |
652 | #### **Top-Level Files:**
653 |
654 | **README.md:** Front and center documentation. Should include an overview, how to install/run, basic usage, and current status. For example: •
655 |
656 | ```
657 |
658 | # My Python Project
659 |
660 | A brief description of what this project does and who it's for.
661 |
662 | ## Features
663 |
664 | - Feature 1: ...
665 | - Feature 2: ...
666 |
667 | ## Installation
668 |
669 | ```bash
670 | pip install -r requirements.txt
671 | python -m my_package.main
672 | ```
673 |
674 | (If it's a CLI, how to run it. If web service, how to start server.)
675 |
676 | ## Usage Examples of how to use the project or API.
677 |
678 | ## Project Structure
679 |
680 | (insert the directory tree or a summary)
681 |
682 | See [docs/architecture.md](file:///home/api/assets/docs/architecture.md) for more details on the code structure.
683 |
684 | ## Contributing See [CONTRIBUTING.md](file:///home/api/assets/CONTRIBUTING.md) for guidelines.
685 |
686 | ## License (MIT/Apache 2.0 etc.)
687 |
688 | ```
689 |
690 | **CONTRIBUTING.md:** Guidelines for contributors (even if you're solo, good to have). Could mention coding style, how to run tests, how to submit PR (in your case, how you use the AI assistant too). For example: •
691 |
692 | ```
693 |
694 | # Contributing
695 |
696 | Thanks for your interest in contributing!
697 |
698 | ## Development Setup
699 |
700 | - Clone the repo.
701 | - Create a virtual env and `pip install -r requirements.txt`.
702 | - Install pre-commit: `pre-commit install` to set up git hooks for linting.
703 |
704 | ## Coding Guidelines
705 |
706 | - Follow PEP8 style. We use flake8 and black to enforce this.
707 | - Write type hints for new functions.
708 | - Include docstrings for modules, classes, and functions.
709 | - Write tests for new features or bug fixes.
710 |
711 | ## Commit Messages
712 |
713 | - Use Conventional Commits (e.g., `feat: ...`, `fix: ...`).
714 | - Use present tense, e.g., "Add feature X", not "Added".
715 |
716 | ## Pull Requests
717 |
718 | - Ensure CI passes (tests, lint).
719 | - Fill out the PR template (if we have one) including what and why.
720 | - Link any relevant issues.
721 |
722 | ```
723 |
724 | - **CODE\_OF\_CONDUCT.md:** (Optional but common in OSS) standard template about respectful communication. •
725 | - **CODEOWNERS:** A file to specify default reviewers or responsible people for certain paths. Example content: •
726 |
727 | ```
728 |
729 | # Codeowners file
730 |
731 | # Syntax: path pattern @githubusername or @org/team
732 |
733 | - @myusername # you as owner for all files
734 |   docs/\* @myusername @collaborator # docs can have multiple owners
735 |
736 | ```
737 |
738 | If you're solo, this might just list you. But it's useful if you have multiple maintainers to auto-request reviews on PRs.
739 |
740 | - **LICENSE:** OSS license text if applicable (MIT, Apache, etc.). •
741 | - **pyproject.toml:** Modern Python projects use this for builds, dependencies, tools config. Example: •
742 |
743 | ```
744 |
745 | [project]
746 | name = "my-python-project"
747 |
748 | ```
749 |
750 | ```
751 |
752 | version = "0.1.0"
753 | description = "A short description."
754 | authors = [
755 | { name="Your Name", email="you@example.com" }
756 | ]
757 | requires-python = ">=3.9"
758 | dependencies = [
759 | "flask",
760 | "sqlalchemy",
761 |
762 | # ...other deps
763 |
764 | ]
765 | [tool.black]
766 | line-length = 88
767 | target-version = ["py39"]
768 | [tool.flake8]
769 | max-line-length = 88
770 | extend-ignore = ["E203"] # example ignore rule
771 |
772 | ```
773 |
774 | This defines package metadata and config for black/flake8 if you like. Alternatively, you can keep tool configs in separate files (.flake8 etc.).
775 |
776 | **requirements.txt:** If not using pyproject's section or for pinning exact versions. Could be initially empty or have base libs: •
777 |
778 | flask==2.2.2 sqlalchemy==1.4.46
779 |
780 | etc. If using Poetry or pipenv, you'd have those files instead.
781 |
782 | **.flake8:** If not in pyproject, configure linter: •
783 |
784 | ```
785 |
786 | [flake8]
787 | max-line-length = 88
788 | exclude = .git,**pycache**,.venv,build,dist
789 |
790 | ```
791 |
792 | **.pre-commit-config.yaml:** Define hooks: •
793 |
794 | ```
795 |
796 | repos:
797 |
798 | - repo: https://github.com/psf/black
799 |   rev: 23.1.0
800 |   hooks:
801 |
802 | ```
803 |
804 | ```
805 |
806 | - id: black
807 | - repo: https://github.com/pycqa/flake8
808 |   rev: 6.0.0
809 |   hooks:
810 |   - id: flake8
811 | - repo: https://github.com/pre-commit/mirrors-mypy
812 |   rev: v0.971
813 |   hooks:
814 |   - id: mypy
815 |     args: ["--ignore-missing-imports"]
816 |
817 | ```
818 |
819 | With this, on commit black/flake8/mypy run. Adjust versions as needed. Run pre-commit install to activate.
820 |
821 | **.gitignore:** Standard Python gitignore (pycache, venv, etc.): •
822 |
823 | ```
824 |
825 | **pycache**/
826 | .venv/
827 | .env
828 | \*.pyc
829 | .DS_Store
830 | .pytest_cache/
831 | .env # if you use env files
832 |
833 | ```
834 |
835 | **docs/architecture.md:** Explain the design. For example: •
836 |
837 | ```
838 |
839 | # Architecture Overview
840 |
841 | This document describes the high-level architecture of My Python Project.
842 | The project follows a layered design:
843 |
844 | - **my_package/**: The main package containing the application code.
845 |   - `main.py` is the entry point (if run as script).
846 |   - `module1.py`, `module2.py` implement core functionality X and Y
847 |     respectively.
848 | - **tests/**: Unit tests for the application.
849 | - **docs/**: Documentation and design notes.
850 | - **docs/adr/**: Architecture Decision Records (see below).
851 |
852 | ## Key Components
853 |
854 | - _Module1_: handles ...
855 | - _Module2_: responsible for ...
856 | - We use Flask to expose an API (if applicable)...
857 |
858 | ```
859 |
860 | ```
861 |
862 | ## Data Model
863 |
864 | Outline models or data structures.
865 |
866 | ## Error Handling
867 |
868 | Explain how errors are managed (custom exceptions? HTTP error codes? etc).
869 |
870 | ## Security
871 |
872 | Any important security considerations (e.g., how passwords are stored,
873 | roles, etc).
874 |
875 | ## ADRs
876 |
877 | We use Architecture Decision Records in `docs/adr/` to log major decisions.
878 | See ADR 0001 for initial framework choice.
879 |
880 | ```
881 |
882 | - **docs/adr/README.md:** An index of ADRs. Often contains a numbered list of ADR titles linking to files. •
883 | - **docs/adr/0001-record-architecture-decision.md:** ADR template example: •
884 |
885 | **# ADR 0001: Decision to use Flask for Web Framework \*\*Date:\*\*** 2025-08-20 **\*\*Context:\*\*** We need a web framework for building REST APIs. Options considered: Flask, FastAPI, Django... **\*\*Decision:\*\*** We chose Flask because it's lightweight, suitable for our simple API, and we want fine-grained control. FastAPI was considered for automatic docs and better performance, but Flask is more familiar.
886 |
887 | **\*\*Consequences:\*\*** We'll need to manually document APIs (consider Swagger later). Flask's global app could be an issue for scaling, but acceptable for now.
888 |
889 | This format (Context, Decision, Consequences) is classic. ADRs are numbered sequentially.
890 |
891 | **docs/prompts.md:** A place to keep prompt examples or guidelines, if you want to document how you interact with LLM. For instance: •
892 |
893 | **# Prompt Engineering Notes ## Planning Prompt Template** (We include the template we use for planning as in Section 5.1)
894 |
895 | ```
896 |
897 | ## Common Fix Prompts
898 |
899 | - "Given this error log, fix the code: ..."
900 |
901 | ## Recurring Issues
902 |
903 | Noting patterns (e.g., "the model often forgets to close DB session, remind
904 | it").
905 |
906 | ```
907 |
908 | This is optional, but could be useful for future reference or if others work with you using AI.
909 |
910 | **src/my\_package/init.py:** (Empty or just setting up package namespace). •
911 |
912 | **src/my\_package/main.py:** If the project is an app or CLI, this might run the application. Example: •
913 |
914 | ```
915 |
916 | import click # if using click for CLI
917 | from my_package.module1 import run_server
918 | if **name** == "**main**":
919 | run_server()
920 |
921 | ```
922 |
923 | Or for CLI using click/argparse. For a library, this might not exist.
924 |
925 | **src/my\_package/module1.py, module2.py:** These are placeholders for actual code modules. Initially can have simple stub functions/classes: •
926 |
927 | ```
928 |
929 | # module1.py
930 |
931 | def run_server():
932 | """Start the web server."""
933 | print("Server running (stub).")
934 |
935 | ```
936 |
937 | Or if using Flask:
938 |
939 | ```
940 |
941 | from flask import Flask
942 | app = Flask(**name**)
943 | @app.route("/")
944 | def hello():
945 | return "Hello"
946 |
947 | ```
948 |
949 | (Though larger apps might not put routes in module1 but in a routes.py, etc.)
950 |
951 | **tests/**: For each module, a test file. •
952 |
953 | ```
954 |
955 | # test_module1.py
956 |
957 | import pytest
958 | from my_package import module1
959 | def test_run_server(capsys):
960 | module1.run_server()
961 | captured = capsys.readouterr()
962 | assert "Server running" in captured.out
963 |
964 | ```
965 |
966 | This is a trivial test to ensure the stub prints. Later tests evolve with features.
967 |
968 | **.github/workflows/ci.yml:** CI pipeline config, e.g., GitHub Actions: •
969 |
970 | ```
971 |
972 | name: CI
973 | on: [push, pull_request]
974 | jobs:
975 | build:
976 | runs-on: ubuntu-latest
977 | steps: - uses: actions/checkout@v3 - uses: actions/setup-python@v4
978 | with:
979 | python-version: '3.10' - name: Install deps
980 | run: pip install -r requirements.txt - name: Run linters
981 | run: pre-commit run --all-files - name: Run tests
982 | run: pytest
983 |
984 | ```
985 |
986 | This ensures on each push/pr, the code style and tests are checked. If the LLM produces output not matching schema or failing tests, the CI fails – an automated guardrail for you to then fix or prompt the AI to fix.
987 |
988 | **Dockerfile:** If containerizing (for deployment or dev consistency): •
989 |
990 | ```
991 |
992 | FROM python:3.10-slim
993 | WORKDIR /app
994 | COPY pyproject.toml requirements.txt /app/
995 | RUN pip install -r requirements.txt
996 | COPY src/ /app/src/
997 | EXPOSE 8000
998 | CMD ["python", "-m", "my_package.main"]
999 |
1000 | ```
1001 |
1002 | This is a basic pattern. Adjust for your app (maybe gunicorn if web, etc.). Ensure to rebuild as needed.
1003 |
1004 | **.devcontainer/devcontainer.json:** If using VS Code devcontainers or GitHub Codespaces: •
1005 |
1006 | ```
1007 |
1008 | {
1009 | "name": "MyPythonProject Dev",
1010 | "dockerFile": "../Dockerfile",
1011 | "context": "..",
1012 | "settings": {
1013 | "terminal.integrated.shell.linux": "/bin/bash"
1014 | },
1015 | "postCreateCommand": "pip install -r requirements.txt && pre-commit
1016 | install",
1017 | "extensions": ["ms-python.python"]
1018 | }
1019 |
1020 | ```
1021 |
1022 | This leverages the Dockerfile to set up the environment.
1023 |
1024 | This Python template gives a lot of scaffolding that helps keep the LLM on track. For example, with the structure in place: - The LLM knows where tests go, where code goes. - It sees the flake8 and black configs, so it might adhere to style (some models internalize PEP8). - The existence of architecture.md might remind it to check design decisions. - The CI config explicitly will run pre-commit and pytest , reinforcing that code must be linted and tests passing.
1025 |
1026 | ## **6.2 TypeScript Project Template**
1027 |
1028 | For TypeScript, let's assume a Node.js backend and/or a React frontend. Possibly a monorepo style with both. We'll illustrate a structure that could accommodate both (like a full-stack project) to see monorepo usage.
1029 |
1030 | ### **File/Directory Tree:**
1031 |
1032 | ```
1033 |
1034 | my_ts_project/
1035 | ├── README.md
1036 | ├── CONTRIBUTING.md
1037 | ├── CODEOWNERS
1038 | ├── package.json
1039 | ├── tsconfig.json
1040 | ├── .eslintrc.json
1041 | ├── .prettierrc
1042 | ├── .gitignore
1043 | ├── docs/
1044 | │ ├── architecture.md
1045 | │ ├── adr/
1046 |
1047 | ```
1048 |
1049 | ![](_page_32_Figure_0.jpeg)
1050 |
1051 | This is a bit large, but let's break it down:
1052 |
1053 | **README.md, CONTRIBUTING.md, CODEOWNERS, docs/** similar to Python, just tailored to TS context (e.g., mention coding style like AirBnB styleguide in contributing). **package.json:** At root if a single package or workspace: • •
1054 |
1055 | ```
1056 |
1057 | {
1058 | "name": "my-ts-project",
1059 | "version": "0.1.0",
1060 | "private": true,
1061 | "workspaces": ["src/client"],
1062 | "scripts": {
1063 | "build": "tsc && (cd src/client && npm run build)",
1064 | "lint": "eslint . --ext .ts,.tsx",
1065 | "test": "jest",
1066 | "start": "node dist/server/index.js"
1067 | },
1068 |
1069 | ```
1070 |
1071 | ```
1072 |
1073 | "devDependencies": {
1074 | "typescript": "^4.9.5",
1075 | "ts-node": "^10.9.1",
1076 | "eslint": "^8.37.0",
1077 | "eslint-config-airbnb-base": "^15.0.0",
1078 | "eslint-plugin-import": "^2.27.5",
1079 | "prettier": "^2.8.4",
1080 | "eslint-config-prettier": "^8.6.0",
1081 | "jest": "^29.5.0",
1082 | "@types/jest": "^29.5.0",
1083 | // etc.
1084 | },
1085 | "dependencies": {
1086 | "express": "^4.18.2",
1087 | "cors": "^2.8.5"
1088 | // etc.
1089 | }
1090 | }
1091 |
1092 | ```
1093 |
1094 | This indicates:
1095 |
1096 | - using Yarn/NPM workspaces if the client is separate. •
1097 | - Linting with ESLint & Prettier. •
1098 | - Jest for tests. •
1099 | - Express as an example backend framework. •
1100 | - **tsconfig.json (root):** For backend: •
1101 |
1102 | ```
1103 |
1104 | {
1105 | "compilerOptions": {
1106 | "target": "ES2020",
1107 | "module": "commonjs",
1108 | "outDir": "dist",
1109 | "rootDir": "src/server",
1110 | "strict": true,
1111 | "esModuleInterop": true
1112 | },
1113 | "include": ["src/server"]
1114 | }
1115 |
1116 | ```
1117 |
1118 | And maybe a separate one in client if needed (React might use its own config or create-react-app).
1119 |
1120 | **.eslintrc.json:** Config for lint: •
1121 |
1122 | ```
1123 |
1124 | {
1125 | "extends": ["airbnb-base", "prettier"],
1126 | "env": {
1127 | "node": true,
1128 | "jest": true
1129 | },
1130 | "parserOptions": {
1131 | "ecmaVersion": 2020,
1132 | "sourceType": "module"
1133 | },
1134 | "rules": {
1135 | // custom overrides
1136 | }
1137 | }
1138 |
1139 | ```
1140 |
1141 | **.prettierrc:** maybe just: •
1142 |
1143 | ```
1144 |
1145 | {
1146 | "singleQuote": true,
1147 | "trailingComma": "all"
1148 | }
1149 |
1150 | ```
1151 |
1152 | **src/server/index.ts:** Entry to backend server: •
1153 |
1154 | ```
1155 |
1156 | import express from 'express';
1157 | import cors from 'cors';
1158 | import { json } from 'body-parser';
1159 | import taskRouter from './controllers/taskController';
1160 | const app = express();
1161 | app.use(cors());
1162 | app.use(json());
1163 | app.use('/tasks', taskRouter);
1164 | const PORT = process.env.PORT || 3000;
1165 | app.listen(PORT, () => {
1166 | console.log(`Server running on port ${PORT}`);
1167 | });
1168 |
1169 | ````
1170 |
1171 | This sets up Express and uses a router for tasks.
1172 |
1173 | **src/server/controllers/taskController.ts:** Example Express router: ```typescript import { Router } from 'express'; import Task from '../models/task'; import \* as TaskService from '../services/ taskService'; const router = Router(); •
1174 |
1175 | router.get('/', async (req, res) => { const tasks = await TaskService.getTasks(); res.json(tasks); });
1176 |
1177 | router.post('/', async (req, res) => { try { const task = await TaskService.createTask(req.body); res.status(201).json(task); } catch (e: any) { res.status(400).json({ error: e.message }); } });
1178 |
1179 | // ... put/delete routes etc.
1180 |
1181 | export default router; ```
1182 |
1183 | **src/server/models/task.ts:** Data model (could be a DB model or simple class): •
1184 |
1185 | ````
1186 |
1187 | interface Task {
1188 | id: number;
1189 | title: string;
1190 | dueDate?: string;
1191 | completed: boolean;
1192 | }
1193 | export default Task;
1194 |
1195 | ```
1196 |
1197 | (Maybe using a database library you'd have a model class, but for simplicity using in-memory concept or an interface.)
1198 |
1199 | **src/server/services/taskService.ts:** Business logic: •
1200 |
1201 | ```
1202 |
1203 | import Task from '../models/task';
1204 | let tasks: Task[] = []; // in-memory array for example
1205 | export async function getTasks(): Promise<Task[]> {
1206 | return tasks;
1207 | }
1208 | export async function createTask(data: { title: string; dueDate?:
1209 | string }): Promise<Task> {
1210 | if (!data.title) {
1211 | throw new Error('Title is required');
1212 | }
1213 | const newTask: Task = {
1214 | id: tasks.length + 1,
1215 | title: data.title,
1216 | dueDate: data.dueDate,
1217 | completed: false,
1218 | };
1219 | tasks.push(newTask);
1220 | return newTask;
1221 | }
1222 |
1223 | ```
1224 |
[TRUNCATED]
`````

llm-playbook/LLM-Assisted Software Engineering Playbookmeta.json

```
1 | {
2 |   "table_of_contents": [
3 |     {
4 |       "title": "LLM-Assisted Software Engineering Playbook",
5 |       "heading_level": null,
6 |       "page_id": 0,
7 |       "polygon": [
8 |         [77.41534352302551, 117.47306656837463],
9 |         [485.5499572753906, 117.47306656837463],
10 |         [485.5499572753906, 138.1960129737854],
11 |         [77.41534352302551, 138.1960129737854]
12 |       ]
13 |     },
14 |     {
15 |       "title": "1. Upfront Project Scaffolding",
16 |       "heading_level": null,
17 |       "page_id": 1,
18 |       "polygon": [
19 |         [77.7966211438179, 73.3000618815422],
20 |         [278.9880065917969, 73.3000618815422],
21 |         [278.9880065917969, 90.37339729070663],
22 |         [76.6013086438179, 90.37339729070663]
23 |       ]
24 |     },
25 |     {
26 |       "title": "2. Repository Architecture Patterns",
27 |       "heading_level": null,
28 |       "page_id": 2,
29 |       "polygon": [
30 |         [77.30489712953568, 414.77932119369507],
31 |         [317.7632567882538, 414.77932119369507],
32 |         [317.7632567882538, 430.80237436294556],
33 |         [77.30489712953568, 430.80237436294556]
34 |       ]
35 |     },
36 |     {
37 |       "title": "3. LLM-Specific Development Techniques",
38 |       "heading_level": null,
39 |       "page_id": 4,
40 |       "polygon": [
41 |         [77.95653176307678, 334.65593576431274],
42 |         [352.072509765625, 334.65593576431274],
43 |         [352.072509765625, 351.40219831466675],
44 |         [76.76121926307678, 351.40219831466675]
45 |       ]
46 |     },
47 |     {
48 |       "title": "3.1 Context Management: Repo Maps, Symbol Graphs, Retrieval",
49 |       "heading_level": null,
50 |       "page_id": 4,
51 |       "polygon": [
52 |         [77.72619116306305, 421.2605895996094],
53 |         [412.11798191070557, 421.2605895996094],
54 |         [411.9120178222656, 434.81037998199463],
55 |         [76.53087866306305, 434.81037998199463]
56 |       ]
57 |     },
58 |     {
59 |       "title": "3.2 Structured Outputs: JSON Schemas, Typed Formats, and Function Calling",
60 |       "heading_level": null,
61 |       "page_id": 5,
62 |       "polygon": [
63 |         [77.05816876888275, 404.8363723754883],
64 |         [478.6836247444153, 404.8363723754883],
65 |         [478.6836247444153, 418.05958557128906],
66 |         [77.05816876888275, 418.05958557128906]
67 |       ]
68 |     },
69 |     {
70 |       "title": "3.3 Incremental Development: Patch/Diff Workflow and Small Commits",
71 |       "heading_level": null,
72 |       "page_id": 6,
73 |       "polygon": [
74 |         [77.48240840435028, 430.3297390937805],
75 |         [451.8180847167969, 428.7828640937805],
76 |         [451.8180847167969, 442.1640930175781],
77 |         [77.48240840435028, 443.16528940200806]
78 |       ]
79 |     },
80 |     {
81 |       "title": "3.4 Task Decomposition and Checklisting",
82 |       "heading_level": null,
83 |       "page_id": 7,
84 |       "polygon": [
85 |         [78.0, 197.95769083499908],
86 |         [293.4820861816406, 197.95769083499908],
87 |         [293.4820861816406, 210.92989325523376],
88 |         [76.85092788934708, 210.92989325523376]
89 |       ]
90 |     },
91 |     {
92 |       "title": "3.5 Automated Execution Loops with Validation",
93 |       "heading_level": null,
94 |       "page_id": 7,
95 |       "polygon": [
96 |         [77.20570421218872, 507.01415061950684],
97 |         [328.26031494140625, 507.01415061950684],
98 |         [328.26031494140625, 520.0947046279907],
99 |         [77.20570421218872, 520.0947046279907]
100 |       ]
101 |     },
102 |     {
103 |       "title": "3.6 Guardrails and Safe-guards",
104 |       "heading_level": null,
105 |       "page_id": 8,
106 |       "polygon": [
107 |         [78.0, 240.72328734397888],
108 |         [240.1800595521927, 240.72328734397888],
109 |         [239.92654418945312, 253.49789357185364],
110 |         [77.06517255306244, 253.49789357185364]
111 |       ]
112 |     },
113 |     {
114 |       "title": "4. Workflow: Idea to Release",
115 |       "heading_level": null,
116 |       "page_id": 9,
117 |       "polygon": [
118 |         [77.12627327442169, 336.4801275730133],
119 |         [270.71246337890625, 336.4801275730133],
120 |         [270.71246337890625, 352.35598969459534],
121 |         [77.12627327442169, 352.35598969459534]
122 |       ]
123 |     },
124 |     {
125 |       "title": "Step 2: Specification and Planning",
126 |       "heading_level": null,
127 |       "page_id": 9,
128 |       "polygon": [
129 |         [77.3505402803421, 531.1318144798279],
130 |         [231.6840057373047, 531.1318144798279],
131 |         [231.6840057373047, 543.2870192527771],
132 |         [77.3505402803421, 543.2870192527771]
133 |       ]
134 |     },
135 |     {
136 |       "title": "Step 3: Repository Setup (Scaffolding)",
137 |       "heading_level": null,
138 |       "page_id": 10,
139 |       "polygon": [
140 |         [78.0, 73.51527214050293],
141 |         [247.9657688140869, 73.51527214050293],
142 |         [246.7704563140869, 84.54440402984619],
143 |         [76.93059593439102, 84.54440402984619]
144 |       ]
145 |     },
146 |     {
147 |       "title": "Step 4: Iterative Implementation with LLM",
148 |       "heading_level": null,
149 |       "page_id": 10,
150 |       "polygon": [
151 |         [78.0, 266.63587474823],
152 |         [271.8630065917969, 266.63587474823],
153 |         [271.8630065917969, 278.2351713180542],
154 |         [76.91707170009613, 278.2351713180542]
155 |       ]
156 |     },
157 |     {
158 |       "title": "Step 5: Testing and Validation",
159 |       "heading_level": null,
160 |       "page_id": 10,
161 |       "polygon": [
162 |         [77.40559476613998, 636.8759307861328],
163 |         [212.47801208496094, 636.8759307861328],
164 |         [212.47801208496094, 648.2165336608887],
165 |         [77.40559476613998, 648.2165336608887]
166 |       ]
167 |     },
168 |     {
169 |       "title": "Step 6: Documentation",
170 |       "heading_level": null,
171 |       "page_id": 11,
172 |       "polygon": [
173 |         [77.42681586742401, 171.0490972995758],
174 |         [182.65894675254822, 171.0490972995758],
175 |         [182.65894675254822, 182.15845727920532],
176 |         [77.42681586742401, 182.15845727920532]
177 |       ]
178 |     },
179 |     {
180 |       "title": "Step 7: Final Review (Human in the Loop)",
181 |       "heading_level": null,
182 |       "page_id": 11,
183 |       "polygon": [
184 |         [78.0, 293.9949281215668],
185 |         [262.84425044059753, 293.9949281215668],
186 |         [261.64893794059753, 305.1394808292389],
187 |         [76.89138203859329, 305.1394808292389]
188 |       ]
189 |     },
190 |     {
191 |       "title": "Step 8: Release",
192 |       "heading_level": null,
193 |       "page_id": 11,
194 |       "polygon": [
195 |         [78.0, 404.9757270812988],
196 |         [146.59799194335938, 404.9757270812988],
197 |         [146.59799194335938, 416.14157009124756],
198 |         [77.2004787325859, 416.14157009124756]
199 |       ]
200 |     },
201 |     {
202 |       "title": "5. Prompt Templates for Each Phase",
203 |       "heading_level": null,
204 |       "page_id": 11,
205 |       "polygon": [
206 |         [77.9388490319252, 568.3418340682983],
207 |         [321.04046630859375, 566.7949590682983],
208 |         [321.04046630859375, 582.6831207275391],
209 |         [76.7435365319252, 583.4404821395874]
210 |       ]
211 |     },
212 |     {
213 |       "title": "5.1 Planner / Architect Prompt",
214 |       "heading_level": null,
215 |       "page_id": 12,
216 |       "polygon": [
217 |         [77.59221643209457, 74.06619411706924],
218 |         [238.71946048736572, 74.06619411706924],
219 |         [238.71946048736572, 86.71476978063583],
220 |         [77.59221643209457, 86.71476978063583]
221 |       ]
222 |     },
223 |     {
224 |       "title": "System Prompt (Planner):",
225 |       "heading_level": null,
226 |       "page_id": 12,
227 |       "polygon": [
228 |         [77.97077643871307, 141.59372806549072],
229 |         [195.44603276252747, 141.59372806549072],
230 |         [195.44603276252747, 152.85193133354187],
231 |         [77.97077643871307, 152.85193133354187]
232 |       ]
233 |     },
234 |     {
235 |       "title": "User Prompt:",
236 |       "heading_level": null,
237 |       "page_id": 12,
238 |       "polygon": [
239 |         [78.0, 272.3181667327881],
240 |         [140.88481217622757, 272.3181667327881],
241 |         [139.68949967622757, 283.2926330566406],
242 |         [77.25913542509079, 283.2926330566406]
243 |       ]
244 |     },
245 |     {
246 |       "title": "Expected Output (excerpt):",
247 |       "heading_level": null,
248 |       "page_id": 12,
249 |       "polygon": [
250 |         [78.0, 552.4772071838379],
251 |         [185.34768855571747, 550.9303321838379],
252 |         [184.15237605571747, 562.0032653808594],
253 |         [76.83063697814941, 563.3571653366089]
254 |       ]
255 |     },
256 |     {
257 |       "title": "Anti-Prompt Pitfalls (Planner):",
258 |       "heading_level": null,
259 |       "page_id": 13,
260 |       "polygon": [
261 |         [78.0, 252.98272490501404],
262 |         [214.28878390789032, 251.43584990501404],
263 |         [213.70201110839844, 262.67828369140625],
264 |         [77.29217541217804, 263.9540283679962]
265 |       ]
266 |     },
267 |     {
268 |       "title": "5.2 Scaffolder Prompt",
269 |       "heading_level": null,
270 |       "page_id": 13,
271 |       "polygon": [
272 |         [78.0, 363.3091893196106],
273 |         [192.43939208984375, 361.7623143196106],
274 |         [192.43939208984375, 374.248046875],
275 |         [77.1961196064949, 375.58854818344116]
276 |       ]
277 |     },
278 |     {
279 |       "title": "System Prompt (Scaffolder):",
280 |       "heading_level": null,
281 |       "page_id": 13,
282 |       "polygon": [
283 |         [78.0, 486.3255944252014],
284 |         [204.01368534564972, 484.7787194252014],
285 |         [203.80198669433594, 496.3185353279114],
286 |         [77.34087359905243, 497.8654103279114]
287 |       ]
288 |     },
289 |     {
290 |       "title": "User Prompt (could be continuation from planning):",
291 |       "heading_level": null,
292 |       "page_id": 13,
293 |       "polygon": [
294 |         [78.0, 603.6665997505188],
295 |         [311.5724952220917, 602.1197247505188],
296 |         [311.5724952220917, 613.4424834251404],
297 |         [78.0, 614.9893584251404]
298 |       ]
299 |     },
300 |     {
301 |       "title": "Expected Output:",
302 |       "heading_level": null,
303 |       "page_id": 14,
304 |       "polygon": [
305 |         [77.87105458974838, 126.03831803798676],
306 |         [148.1060602068901, 126.03831803798676],
307 |         [148.1060602068901, 136.5099366903305],
308 |         [77.87105458974838, 136.5099366903305]
309 |       ]
310 |     },
311 |     {
312 |       "title": "Anti-Prompt Pitfalls (Scaffolding):",
313 |       "heading_level": null,
314 |       "page_id": 15,
315 |       "polygon": [
316 |         [77.27329802513123, 73.85270100831985],
317 |         [229.27358078956604, 73.85270100831985],
318 |         [229.27358078956604, 84.4562628865242],
319 |         [77.27329802513123, 84.4562628865242]
320 |       ]
321 |     },
322 |     {
323 |       "title": "5.3 Implementer (Coder) Prompt",
324 |       "heading_level": null,
325 |       "page_id": 15,
326 |       "polygon": [
327 |         [77.55209058523178, 184.83640909194946],
328 |         [249.6766815185547, 184.83640909194946],
329 |         [249.6766815185547, 196.50795578956604],
330 |         [77.55209058523178, 196.50795578956604]
331 |       ]
332 |     },
333 |     {
334 |       "title": "System Prompt (Implementer/Coder):",
335 |       "heading_level": null,
336 |       "page_id": 15,
337 |       "polygon": [
338 |         [77.46707850694656, 293.9244954586029],
339 |         [248.46613812446594, 293.9244954586029],
340 |         [248.46613812446594, 304.4193115234375],
341 |         [77.46707850694656, 304.4193115234375]
342 |       ]
343 |     },
344 |     {
345 |       "title": "User Prompt examples:",
346 |       "heading_level": null,
347 |       "page_id": 15,
348 |       "polygon": [
349 |         [77.99866390228271, 461.9193115234375],
350 |         [184.0710117816925, 460.55120515823364],
351 |         [184.0710117816925, 470.9193115234375],
352 |         [77.99866390228271, 471.97659158706665]
353 |       ]
354 |     },
355 |     {
356 |       "title": "Anti-Prompt Pitfalls (Implementer):",
357 |       "heading_level": null,
358 |       "page_id": 17,
359 |       "polygon": [
360 |         [78.0, 503.8104085922241],
361 |         [238.99731373786926, 502.2635335922241],
362 |         [238.11898803710938, 514.1763782501221],
363 |         [77.32406634092331, 515.7232532501221]
364 |       ]
365 |     },
366 |     {
367 |       "title": "5.4 Tester Prompt",
368 |       "heading_level": null,
369 |       "page_id": 17,
370 |       "polygon": [
371 |         [77.85207688808441, 668.343327999115],
372 |         [171.85548198223114, 666.796452999115],
373 |         [171.71774291992188, 680.2364401817322],
374 |         [76.65676438808441, 681.7833151817322]
375 |       ]
376 |     },
377 |     {
378 |       "title": "System Prompt (Tester):",
379 |       "heading_level": null,
380 |       "page_id": 18,
381 |       "polygon": [
382 |         [78.0, 74.21563339233398],
383 |         [187.287682056427, 74.21563339233398],
384 |         [186.092369556427, 84.63500583171844],
385 |         [77.63393819332123, 84.63500583171844]
386 |       ]
387 |     },
388 |     {
389 |       "title": "User Prompt:",
390 |       "heading_level": null,
391 |       "page_id": 18,
392 |       "polygon": [
393 |         [78.0, 178.07769405841827],
394 |         [138.02099609375, 178.07769405841827],
395 |         [138.02099609375, 187.94480502605438],
396 |         [78.0, 187.94480502605438]
397 |       ]
398 |     },
399 |     {
400 |       "title": "Anti-Prompt Pitfalls (Tester):",
401 |       "heading_level": null,
402 |       "page_id": 19,
403 |       "polygon": [
404 |         [77.18564128875732, 404.6709122657776],
405 |         [206.33099365234375, 404.6709122657776],
406 |         [206.33099365234375, 415.681444644928],
407 |         [77.18564128875732, 415.681444644928]
408 |       ]
409 |     },
410 |     {
411 |       "title": "5.5 Reviewer Prompt",
412 |       "heading_level": null,
413 |       "page_id": 19,
414 |       "polygon": [
415 |         [77.56133776903152, 528.8060259819031],
416 |         [187.51168823242188, 528.8060259819031],
417 |         [187.51168823242188, 540.666754245758],
418 |         [77.56133776903152, 540.666754245758]
419 |       ]
420 |     },
421 |     {
422 |       "title": "System Prompt (Reviewer):",
423 |       "heading_level": null,
424 |       "page_id": 19,
425 |       "polygon": [
426 |         [77.81798815727234, 596.4149622917175],
427 |         [200.54146814346313, 596.4149622917175],
428 |         [200.54146814346313, 607.3842358589172],
429 |         [77.81798815727234, 607.3842358589172]
430 |       ]
431 |     },
432 |     {
433 |       "title": "User Prompt:",
434 |       "heading_level": null,
435 |       "page_id": 20,
436 |       "polygon": [
437 |         [78.0, 73.52381068468094],
438 |         [139.30039751529694, 73.52381068468094],
439 |         [138.10508501529694, 84.46114879846573],
440 |         [77.91195559501648, 84.46114879846573]
441 |       ]
442 |     },
443 |     {
444 |       "title": "Anti-Prompt Pitfalls (Reviewer):",
445 |       "heading_level": null,
446 |       "page_id": 20,
447 |       "polygon": [
448 |         [78.0, 492.441198348999],
449 |         [222.08997809886932, 490.894323348999],
450 |         [220.89466559886932, 502.8887414932251],
451 |         [77.03039073944092, 504.4356164932251]
452 |       ]
453 |     },
454 |     {
455 |       "title": "5.6 Refactorer Prompt",
456 |       "heading_level": null,
457 |       "page_id": 20,
458 |       "polygon": [
459 |         [78.0, 589.3509249687195],
460 |         [196.10637652873993, 587.8040499687195],
461 |         [194.99801635742188, 600.9120788574219],
462 |         [77.1248871088028, 602.0276713371277]
463 |       ]
464 |     },
465 |     {
466 |       "title": "System Prompt (Refactorer):",
467 |       "heading_level": null,
468 |       "page_id": 20,
469 |       "polygon": [
470 |         [77.79675793647766, 656.8115372657776],
471 |         [208.8448555469513, 655.2646622657776],
472 |         [207.6495430469513, 667.1673889160156],
473 |         [76.60144543647766, 668.6564040184021]
474 |       ]
475 |     },
476 |     {
477 |       "title": "Anti-Prompt Pitfalls (Refactorer):",
478 |       "heading_level": null,
479 |       "page_id": 22,
480 |       "polygon": [
481 |         [77.57681357860565, 255.3053741455078],
482 |         [227.49102652072906, 255.3053741455078],
483 |         [227.49102652072906, 266.14327096939087],
484 |         [77.57681357860565, 266.14327096939087]
485 |       ]
486 |     },
487 |     {
488 |       "title": "Schema Enforcement in Prompts:",
489 |       "heading_level": null,
490 |       "page_id": 22,
491 |       "polygon": [
492 |         [77.87713730335236, 364.7548291683197],
493 |         [229.52982079982758, 364.7548291683197],
494 |         [228.33450829982758, 375.80293822288513],
495 |         [76.68182480335236, 375.80293822288513]
496 |       ]
497 |     },
498 |     {
499 |       "title": "Summary of Anti-Patterns:",
500 |       "heading_level": null,
501 |       "page_id": 22,
502 |       "polygon": [
503 |         [77.89878702163696, 505.0533185005188],
504 |         [199.0610797405243, 503.5064435005188],
505 |         [198.70799255371094, 514.7151503562927],
506 |         [76.70347452163696, 516.2620253562927]
507 |       ]
508 |     },
509 |     {
510 |       "title": "6. Repository Templates (Python & TypeScript)",
511 |       "heading_level": null,
512 |       "page_id": 23,
513 |       "polygon": [
514 |         [76.89573204517365, 73.37092530727386],
515 |         [389.542742729187, 73.37092530727386],
516 |         [389.542742729187, 90.52058243751526],
517 |         [76.89573204517365, 90.52058243751526]
518 |       ]
519 |     },
520 |     {
521 |       "title": "6.1 Python Project Template",
522 |       "heading_level": null,
523 |       "page_id": 23,
524 |       "polygon": [
525 |         [77.48011028766632, 187.42564737796783],
526 |         [227.2934067249298, 187.42564737796783],
527 |         [227.2934067249298, 200.96534729003906],
528 |         [77.48011028766632, 200.96534729003906]
529 |       ]
530 |     },
531 |     {
532 |       "title": "File/Directory Tree:",
533 |       "heading_level": null,
534 |       "page_id": 23,
535 |       "polygon": [
536 |         [78.0, 255.06676697731018],
537 |         [166.27009177207947, 255.06676697731018],
538 |         [166.27009177207947, 267.1942141056061],
539 |         [78.0, 267.1942141056061]
540 |       ]
541 |     },
542 |     {
543 |       "title": "Top-Level Files:",
544 |       "heading_level": null,
545 |       "page_id": 24,
546 |       "polygon": [
547 |         [78.0, 139.51915097236633],
548 |         [147.04091048240662, 139.51915097236633],
549 |         [146.1479949951172, 150.67633056640625],
550 |         [77.16760289669037, 150.67633056640625]
551 |       ]
552 |     },
553 |     {
554 |       "title": "6.2 TypeScript Project Template",
555 |       "heading_level": null,
556 |       "page_id": 31,
557 |       "polygon": [
558 |         [78.0, 433.07708501815796],
559 |         [244.6156005859375, 433.07708501815796],
560 |         [244.6156005859375, 445.9187722206116],
561 |         [76.85484927892685, 445.9187722206116]
562 |       ]
563 |     },
564 |     {
565 |       "title": "File/Directory Tree:",
566 |       "heading_level": null,
567 |       "page_id": 31,
568 |       "polygon": [
569 |         [77.64124292135239, 514.6661968231201],
570 |         [164.75399136543274, 514.6661968231201],
571 |         [164.75399136543274, 526.4090967178345],
572 |         [77.64124292135239, 526.4090967178345]
573 |       ]
574 |     },
575 |     {
576 |       "title": "Using the TS Template:",
577 |       "heading_level": null,
578 |       "page_id": 37,
579 |       "polygon": [
580 |         [78.0, 611.8618083000183],
581 |         [182.72697830200195, 610.3149333000183],
582 |         [181.53166580200195, 621.1782531738281],
583 |         [77.53438049554825, 622.6320576667786]
584 |       ]
585 |     },
586 |     {
587 |       "title": "7. Automation Snippets",
588 |       "heading_level": null,
589 |       "page_id": 38,
590 |       "polygon": [
591 |         [77.19440513849258, 283.039981842041],
592 |         [237.90298461914062, 283.039981842041],
593 |         [237.90298461914062, 299.23128032684326],
594 |         [77.19440513849258, 299.23128032684326]
595 |       ]
596 |     },
597 |     {
598 |       "title": "7.1 Project Scaffold Script (Python & TS)",
599 |       "heading_level": null,
600 |       "page_id": 38,
601 |       "polygon": [
602 |         [77.38660794496536, 425.4069113731384],
603 |         [285.3335838317871, 425.4069113731384],
604 |         [285.3335838317871, 437.77454710006714],
605 |         [77.38660794496536, 437.77454710006714]
606 |       ]
607 |     },
608 |     {
609 |       "title": "7.2 Repository Map Generator",
610 |       "heading_level": null,
611 |       "page_id": 40,
612 |       "polygon": [
613 |         [77.75030314922333, 543.9726519584656],
614 |         [236.24832153320312, 543.9726519584656],
615 |         [236.24832153320312, 556.2710824012756],
616 |         [77.75030314922333, 556.2710824012756]
617 |       ]
618 |     },
619 |     {
620 |       "title": "7.3 Embedding Indexer for Code (Retrieval)",
621 |       "heading_level": null,
622 |       "page_id": 42,
623 |       "polygon": [
624 |         [77.90061092376709, 73.77787220478058],
625 |         [304.12459087371826, 73.77787220478058],
626 |         [304.12459087371826, 86.44831645488739],
627 |         [77.90061092376709, 86.44831645488739]
628 |       ]
629 |     },
630 |     {
631 |       "title": "7.4 GitHub Action for Structure & Schema Enforcement",
632 |       "heading_level": null,
633 |       "page_id": 43,
634 |       "polygon": [
635 |         [77.32908207178116, 266.13375878334045],
636 |         [366.4149475097656, 266.13375878334045],
637 |         [366.4149475097656, 277.5964858531952],
638 |         [77.32908207178116, 277.5964858531952]
639 |       ]
640 |     },
641 |     {
642 |       "title": "Example Action Step:",
643 |       "heading_level": null,
644 |       "page_id": 43,
645 |       "polygon": [
646 |         [77.58815824985504, 375.0262906551361],
647 |         [173.22900390625, 375.0262906551361],
648 |         [173.22900390625, 385.2797191143036],
649 |         [77.58815824985504, 385.2797191143036]
650 |       ]
651 |     },
652 |     {
653 |       "title": "7.5 File Write Guardrail Script",
654 |       "heading_level": null,
655 |       "page_id": 44,
656 |       "polygon": [
657 |         [78.0, 430.83438062667847],
658 |         [232.74557495117188, 429.28750562667847],
659 |         [232.74557495117188, 441.8301086425781],
660 |         [77.34991103410721, 442.76724100112915]
661 |       ]
662 |     },
663 |     {
664 |       "title": "builtins.open = guarded_open",
665 |       "heading_level": null,
666 |       "page_id": 45,
667 |       "polygon": [
668 |         [86.25992828607559, 85.67055362462997],
669 |         [243.92681050300598, 85.67055362462997],
670 |         [242.73149800300598, 97.27265900373459],
671 |         [85.06461578607559, 97.27265900373459]
672 |       ]
673 |     },
674 |     {
675 |       "title": "8. Evaluation and QA",
676 |       "heading_level": null,
677 |       "page_id": 45,
678 |       "polygon": [
679 |         [78.0, 406.5810914039612],
680 |         [221.11512064933777, 406.5810914039612],
681 |         [220.30349731445312, 422.2475438117981],
682 |         [76.91841226816177, 422.2475438117981]
683 |       ]
684 |     },
685 |     {
686 |       "title": "8.1 Lightweight SWE-bench Style Harness",
687 |       "heading_level": null,
688 |       "page_id": 45,
689 |       "polygon": [
690 |         [77.69688105583191, 505.7672281265259],
691 |         [295.6581115722656, 505.7672281265259],
692 |         [295.6581115722656, 518.2851257324219],
693 |         [77.69688105583191, 518.2851257324219]
694 |       ]
695 |     },
696 |     {
697 |       "title": "8.2 Metrics for Success",
698 |       "heading_level": null,
699 |       "page_id": 46,
700 |       "polygon": [
701 |         [78.0, 157.43570744991302],
702 |         [198.87091970443726, 157.43570744991302],
703 |         [197.96728515625, 170.36257946491241],
704 |         [76.83055490255356, 170.36257946491241]
705 |       ]
706 |     },
707 |     {
708 |       "title": "8.3 Triage and Feedback Loops",
709 |       "heading_level": null,
710 |       "page_id": 46,
711 |       "polygon": [
712 |         [77.97300159931183, 527.7825336456299],
713 |         [239.6659015417099, 526.2356586456299],
714 |         [239.2421417236328, 540.0730895996094],
715 |         [76.77768909931183, 541.2097749710083]
716 |       ]
717 |     },
718 |     {
719 |       "title": "9. Frameworks & IDE Workflow Comparison",
720 |       "heading_level": null,
721 |       "page_id": 47,
722 |       "polygon": [
723 |         [77.63527876138687, 446.45065212249756],
724 |         [372.23248291015625, 446.45065212249756],
725 |         [372.23248291015625, 463.02423191070557],
726 |         [77.63527876138687, 463.02423191070557]
727 |       ]
728 |     },
729 |     {
730 |       "title": "10. Troubleshooting Common Failure Modes",
731 |       "heading_level": null,
732 |       "page_id": 50,
733 |       "polygon": [
734 |         [78.0, 321.72396540641785],
735 |         [375.86059498786926, 321.72396540641785],
736 |         [375.6434631347656, 337.94632601737976],
737 |         [77.13573932647705, 337.94632601737976]
738 |       ]
739 |     },
740 |     {
741 |       "title": "README-swe-bench.md\n1 24",
742 |       "heading_level": null,
743 |       "page_id": 53,
744 |       "polygon": [
745 |         [78.3050885796547, 326.8382878303528],
746 |         [210.84279441833496, 326.8382878303528],
747 |         [210.78916931152344, 337.6783447265625],
748 |         [77.1097760796547, 337.6783447265625]
749 |       ]
750 |     },
751 |     {
752 |       "title": "tdd-project-planning.mdc\n2 3",
753 |       "heading_level": null,
754 |       "page_id": 53,
755 |       "polygon": [
756 |         [78.31954300403595, 360.88905787467957],
757 |         [217.35015869140625, 360.88905787467957],
758 |         [217.35015869140625, 371.36223435401917],
759 |         [77.12423050403595, 371.36223435401917]
760 |       ]
761 |     },
762 |     {
763 |       "title": "2023-08-01-smol-ai-vs-wasp-ai.md\n4 11 22 26",
764 |       "heading_level": null,
765 |       "page_id": 53,
766 |       "polygon": [
767 |         [78.47373569011688, 406.02532482147217],
768 |         [284.1243591308594, 406.02532482147217],
769 |         [284.1243591308594, 416.6045751571655],
770 |         [77.27842319011688, 416.6045751571655]
771 |       ]
772 |     },
773 |     {
774 |       "title": "README.md\n5 13 21 27",
775 |       "heading_level": null,
776 |       "page_id": 53,
777 |       "polygon": [
778 |         [79.18239462375641, 450.8643536567688],
779 |         [192.65736389160156, 450.8643536567688],
780 |         [192.65736389160156, 461.9673767089844],
781 |         [77.98708212375641, 461.9673767089844]
782 |       ]
783 |     },
784 |     {
785 |       "title": "page.tsx\n6 7 8",
786 |       "heading_level": null,
787 |       "page_id": 53,
788 |       "polygon": [
789 |         [78.41745007038116, 485.40657091140747],
790 |         [160.78526306152344, 483.85969591140747],
791 |         [160.78526306152344, 495.2251892089844],
792 |         [78.41745007038116, 495.9791178703308]
793 |       ]
794 |     },
795 |     {
796 |       "title": "OpenDevin.md\n9 10",
797 |       "heading_level": null,
798 |       "page_id": 53,
799 |       "polygon": [
800 |         [79.1146913766861, 531.0331993103027],
801 |         [173.51116943359375, 529.4863243103027],
802 |         [173.51116943359375, 540.7408142089844],
803 |         [77.9193788766861, 541.4431657791138]
804 |       ]
805 |     },
806 |     {
807 |       "title": "README.md\n12 17 23",
808 |       "heading_level": null,
809 |       "page_id": 53,
810 |       "polygon": [
811 |         [78.72959268093109, 564.4743633270264],
812 |         [177.56727600097656, 562.9274883270264],
813 |         [177.56727600097656, 573.9986267089844],
814 |         [77.53428018093109, 575.1520872116089]
815 |       ]
816 |     },
817 |     {
818 |       "title": "llm-tools.md\n14 25",
819 |       "heading_level": null,
820 |       "page_id": 53,
821 |       "polygon": [
822 |         [78.81203305721283, 597.8423566818237],
823 |         [163.15959084033966, 596.2954816818237],
824 |         [163.11618041992188, 607.2564392089844],
825 |         [77.61672055721283, 608.4842977523804]
826 |       ]
827 |     },
828 |     {
829 |       "title": "unified-diffs.md\n15 16 18 19 20",
830 |       "heading_level": null,
831 |       "page_id": 53,
832 |       "polygon": [
833 |         [78.0788791179657, 630.5564875602722],
834 |         [222.39044189453125, 629.0096125602722],
835 |         [222.39044189453125, 640.5143127441406],
836 |         [78.0788791179657, 641.4817643165588]
837 |       ]
838 |     }
839 |   ],
840 |   "page_stats": [
841 |     {
842 |       "page_id": 0,
843 |       "text_extraction_method": "pdftext",
844 |       "block_counts": [
845 |         ["Span", 107],
846 |         ["Line", 37],
847 |         ["Text", 12],
848 |         ["Picture", 1],
849 |         ["SectionHeader", 1],
850 |         ["PageFooter", 1]
851 |       ],
852 |       "block_metadata": {
853 |         "llm_request_count": 0,
854 |         "llm_error_count": 0,
855 |         "llm_tokens_used": 0,
856 |         "previous_text": "",
857 |         "previous_type": "",
858 |         "previous_order": 0
859 |       }
860 |     },
861 |     {
862 |       "page_id": 1,
863 |       "text_extraction_method": "pdftext",
864 |       "block_counts": [
865 |         ["Span", 121],
866 |         ["Line", 47],
867 |         ["ListItem", 4],
868 |         ["SectionHeader", 1],
869 |         ["Text", 1],
870 |         ["PageFooter", 1],
871 |         ["ListGroup", 1]
872 |       ],
873 |       "block_metadata": {
874 |         "llm_request_count": 0,
875 |         "llm_error_count": 0,
876 |         "llm_tokens_used": 0,
877 |         "previous_text": "",
878 |         "previous_type": "",
879 |         "previous_order": 0
880 |       }
881 |     },
882 |     {
883 |       "page_id": 2,
884 |       "text_extraction_method": "pdftext",
885 |       "block_counts": [
886 |         ["Span", 139],
887 |         ["Line", 50],
888 |         ["Text", 4],
889 |         ["SectionHeader", 1],
890 |         ["ListItem", 1],
891 |         ["PageFooter", 1]
892 |       ],
893 |       "block_metadata": {
894 |         "llm_request_count": 0,
895 |         "llm_error_count": 0,
896 |         "llm_tokens_used": 0,
897 |         "previous_text": "",
898 |         "previous_type": "",
899 |         "previous_order": 0
900 |       }
901 |     },
902 |     {
903 |       "page_id": 3,
904 |       "text_extraction_method": "pdftext",
905 |       "block_counts": [
906 |         ["Span", 149],
907 |         ["Line", 48],
908 |         ["Text", 5],
909 |         ["ListItem", 3],
910 |         ["PageFooter", 1],
911 |         ["ListGroup", 1]
912 |       ],
913 |       "block_metadata": {
914 |         "llm_request_count": 0,
915 |         "llm_error_count": 0,
916 |         "llm_tokens_used": 0,
917 |         "previous_text": "",
918 |         "previous_type": "",
919 |         "previous_order": 0
920 |       }
921 |     },
922 |     {
923 |       "page_id": 4,
924 |       "text_extraction_method": "pdftext",
925 |       "block_counts": [
926 |         ["Span", 120],
927 |         ["Line", 45],
928 |         ["Text", 4],
929 |         ["SectionHeader", 2],
930 |         ["ListItem", 2],
931 |         ["PageFooter", 1],
932 |         ["ListGroup", 1]
933 |       ],
934 |       "block_metadata": {
935 |         "llm_request_count": 0,
936 |         "llm_error_count": 0,
937 |         "llm_tokens_used": 0,
938 |         "previous_text": "",
939 |         "previous_type": "",
940 |         "previous_order": 0
941 |       }
942 |     },
943 |     {
944 |       "page_id": 5,
945 |       "text_extraction_method": "pdftext",
946 |       "block_counts": [
947 |         ["Span", 137],
948 |         ["Line", 50],
949 |         ["ListItem", 4],
950 |         ["Text", 3],
951 |         ["ListGroup", 2],
952 |         ["SectionHeader", 1],
953 |         ["PageFooter", 1]
954 |       ],
955 |       "block_metadata": {
956 |         "llm_request_count": 0,
957 |         "llm_error_count": 0,
958 |         "llm_tokens_used": 0,
959 |         "previous_text": "",
960 |         "previous_type": "",
961 |         "previous_order": 0
962 |       }
963 |     },
964 |     {
965 |       "page_id": 6,
966 |       "text_extraction_method": "pdftext",
967 |       "block_counts": [
968 |         ["Span", 127],
969 |         ["Line", 47],
970 |         ["Text", 6],
971 |         ["ListItem", 1],
972 |         ["SectionHeader", 1],
973 |         ["PageFooter", 1]
974 |       ],
975 |       "block_metadata": {
976 |         "llm_request_count": 0,
977 |         "llm_error_count": 0,
978 |         "llm_tokens_used": 0,
979 |         "previous_text": "",
980 |         "previous_type": "",
981 |         "previous_order": 0
982 |       }
983 |     },
984 |     {
985 |       "page_id": 7,
986 |       "text_extraction_method": "pdftext",
987 |       "block_counts": [
988 |         ["Span", 119],
989 |         ["Line", 46],
990 |         ["Text", 5],
991 |         ["ListItem", 3],
992 |         ["SectionHeader", 2],
993 |         ["PageFooter", 1],
994 |         ["ListGroup", 1]
995 |       ],
996 |       "block_metadata": {
997 |         "llm_request_count": 0,
998 |         "llm_error_count": 0,
999 |         "llm_tokens_used": 0,
1000 |         "previous_text": "",
1001 |         "previous_type": "",
1002 |         "previous_order": 0
1003 |       }
1004 |     },
1005 |     {
1006 |       "page_id": 8,
1007 |       "text_extraction_method": "pdftext",
1008 |       "block_counts": [
1009 |         ["Span", 111],
1010 |         ["Line", 44],
1011 |         ["Text", 4],
1012 |         ["ListItem", 4],
1013 |         ["SectionHeader", 1],
1014 |         ["PageFooter", 1],
1015 |         ["ListGroup", 1]
1016 |       ],
1017 |       "block_metadata": {
1018 |         "llm_request_count": 0,
1019 |         "llm_error_count": 0,
1020 |         "llm_tokens_used": 0,
1021 |         "previous_text": "",
1022 |         "previous_type": "",
1023 |         "previous_order": 0
1024 |       }
1025 |     },
1026 |     {
1027 |       "page_id": 9,
1028 |       "text_extraction_method": "pdftext",
1029 |       "block_counts": [
1030 |         ["Span", 115],
1031 |         ["Line", 42],
1032 |         ["Text", 4],
1033 |         ["ListItem", 2],
1034 |         ["SectionHeader", 2],
1035 |         ["PageFooter", 1],
1036 |         ["ListGroup", 1]
1037 |       ],
1038 |       "block_metadata": {
1039 |         "llm_request_count": 0,
1040 |         "llm_error_count": 0,
1041 |         "llm_tokens_used": 0,
1042 |         "previous_text": "",
1043 |         "previous_type": "",
1044 |         "previous_order": 0
1045 |       }
1046 |     },
1047 |     {
1048 |       "page_id": 10,
1049 |       "text_extraction_method": "pdftext",
1050 |       "block_counts": [
1051 |         ["Span", 162],
1052 |         ["Line", 44],
1053 |         ["SectionHeader", 3],
1054 |         ["Text", 3],
1055 |         ["TextInlineMath", 1],
1056 |         ["PageFooter", 1]
1057 |       ],
1058 |       "block_metadata": {
1059 |         "llm_request_count": 0,
1060 |         "llm_error_count": 0,
1061 |         "llm_tokens_used": 0,
1062 |         "previous_text": "",
1063 |         "previous_type": "",
1064 |         "previous_order": 0
1065 |       }
1066 |     },
1067 |     {
1068 |       "page_id": 11,
1069 |       "text_extraction_method": "pdftext",
1070 |       "block_counts": [
1071 |         ["Span", 87],
1072 |         ["Line", 38],
1073 |         ["Text", 10],
1074 |         ["SectionHeader", 4],
1075 |         ["ListItem", 1],
1076 |         ["PageFooter", 1]
1077 |       ],
1078 |       "block_metadata": {
1079 |         "llm_request_count": 0,
1080 |         "llm_error_count": 0,
1081 |         "llm_tokens_used": 0,
1082 |         "previous_text": "",
1083 |         "previous_type": "",
1084 |         "previous_order": 0
1085 |       }
1086 |     },
1087 |     {
1088 |       "page_id": 12,
1089 |       "text_extraction_method": "pdftext",
1090 |       "block_counts": [
1091 |         ["Span", 91],
1092 |         ["Line", 37],
1093 |         ["Text", 6],
1094 |         ["ListItem", 5],
1095 |         ["SectionHeader", 4],
1096 |         ["Code", 1],
1097 |         ["PageFooter", 1],
1098 |         ["ListGroup", 1]
1099 |       ],
1100 |       "block_metadata": {
1101 |         "llm_request_count": 0,
1102 |         "llm_error_count": 0,
1103 |         "llm_tokens_used": 0,
1104 |         "previous_text": "",
1105 |         "previous_type": "",
1106 |         "previous_order": 0
1107 |       }
1108 |     },
1109 |     {
1110 |       "page_id": 13,
1111 |       "text_extraction_method": "pdftext",
1112 |       "block_counts": [
1113 |         ["Span", 79],
1114 |         ["Line", 34],
1115 |         ["Text", 6],
1116 |         ["SectionHeader", 4],
1117 |         ["Code", 1],
1118 |         ["PageFooter", 1]
1119 |       ],
1120 |       "block_metadata": {
1121 |         "llm_request_count": 0,
1122 |         "llm_error_count": 0,
1123 |         "llm_tokens_used": 0,
1124 |         "previous_text": "",
1125 |         "previous_type": "",
1126 |         "previous_order": 0
1127 |       }
1128 |     },
1129 |     {
1130 |       "page_id": 14,
1131 |       "text_extraction_method": "pdftext",
1132 |       "block_counts": [
1133 |         ["Span", 167],
1134 |         ["Line", 35],
1135 |         ["Text", 3],
1136 |         ["SectionHeader", 1],
1137 |         ["Code", 1],
1138 |         ["PageFooter", 1]
1139 |       ],
1140 |       "block_metadata": {
1141 |         "llm_request_count": 0,
1142 |         "llm_error_count": 0,
1143 |         "llm_tokens_used": 0,
1144 |         "previous_text": "",
1145 |         "previous_type": "",
1146 |         "previous_order": 0
1147 |       }
1148 |     },
1149 |     {
1150 |       "page_id": 15,
1151 |       "text_extraction_method": "pdftext",
1152 |       "block_counts": [
1153 |         ["Span", 76],
1154 |         ["Line", 36],
1155 |         ["Text", 8],
1156 |         ["SectionHeader", 4],
1157 |         ["Code", 1],
1158 |         ["PageFooter", 1]
1159 |       ],
1160 |       "block_metadata": {
1161 |         "llm_request_count": 0,
1162 |         "llm_error_count": 0,
1163 |         "llm_tokens_used": 0,
1164 |         "previous_text": "",
1165 |         "previous_type": "",
1166 |         "previous_order": 0
1167 |       }
1168 |     },
1169 |     {
1170 |       "page_id": 16,
1171 |       "text_extraction_method": "pdftext",
1172 |       "block_counts": [
1173 |         ["Span", 79],
1174 |         ["Line", 40],
1175 |         ["Text", 4],
1176 |         ["Code", 2],
1177 |         ["PageFooter", 1]
1178 |       ],
1179 |       "block_metadata": {
1180 |         "llm_request_count": 0,
1181 |         "llm_error_count": 0,
1182 |         "llm_tokens_used": 0,
1183 |         "previous_text": "",
1184 |         "previous_type": "",
1185 |         "previous_order": 0
1186 |       }
1187 |     },
1188 |     {
1189 |       "page_id": 17,
1190 |       "text_extraction_method": "pdftext",
1191 |       "block_counts": [
1192 |         ["Span", 80],
1193 |         ["Line", 39],
1194 |         ["Text", 5],
1195 |         ["Code", 2],
1196 |         ["SectionHeader", 2],
1197 |         ["PageFooter", 1]
1198 |       ],
1199 |       "block_metadata": {
1200 |         "llm_request_count": 0,
1201 |         "llm_error_count": 0,
1202 |         "llm_tokens_used": 0,
1203 |         "previous_text": "",
1204 |         "previous_type": "",
1205 |         "previous_order": 0
1206 |       }
1207 |     },
1208 |     {
1209 |       "page_id": 18,
1210 |       "text_extraction_method": "pdftext",
1211 |       "block_counts": [
1212 |         ["Span", 129],
1213 |         ["Line", 37],
1214 |         ["Text", 4],
1215 |         ["SectionHeader", 2],
1216 |         ["Code", 1],
1217 |         ["PageFooter", 1]
1218 |       ],
1219 |       "block_metadata": {
1220 |         "llm_request_count": 0,
1221 |         "llm_error_count": 0,
1222 |         "llm_tokens_used": 0,
1223 |         "previous_text": "",
1224 |         "previous_type": "",
1225 |         "previous_order": 0
1226 |       }
1227 |     },
1228 |     {
1229 |       "page_id": 19,
1230 |       "text_extraction_method": "pdftext",
1231 |       "block_counts": [
1232 |         ["Span", 163],
1233 |         ["Line", 39],
1234 |         ["SectionHeader", 3],
1235 |         ["Text", 3],
1236 |         ["Code", 1],
1237 |         ["Caption", 1],
1238 |         ["PageFooter", 1]
1239 |       ],
1240 |       "block_metadata": {
1241 |         "llm_request_count": 0,
1242 |         "llm_error_count": 0,
1243 |         "llm_tokens_used": 0,
1244 |         "previous_text": "",
1245 |         "previous_type": "",
1246 |         "previous_order": 0
1247 |       }
1248 |     },
1249 |     {
1250 |       "page_id": 20,
1251 |       "text_extraction_method": "pdftext",
1252 |       "block_counts": [
1253 |         ["Span", 76],
1254 |         ["Line", 31],
1255 |         ["Text", 13],
1256 |         ["SectionHeader", 4],
1257 |         ["ListItem", 2],
1258 |         ["PageFooter", 1],
1259 |         ["ListGroup", 1]
1260 |       ],
1261 |       "block_metadata": {
1262 |         "llm_request_count": 0,
1263 |         "llm_error_count": 0,
1264 |         "llm_tokens_used": 0,
1265 |         "previous_text": "",
1266 |         "previous_type": "",
1267 |         "previous_order": 0
1268 |       }
1269 |     },
1270 |     {
1271 |       "page_id": 21,
1272 |       "text_extraction_method": "pdftext",
1273 |       "block_counts": [
1274 |         ["Span", 70],
1275 |         ["Line", 35],
1276 |         ["Text", 5],
1277 |         ["Code", 2],
1278 |         ["PageFooter", 1]
1279 |       ],
1280 |       "block_metadata": {
1281 |         "llm_request_count": 0,
1282 |         "llm_error_count": 0,
1283 |         "llm_tokens_used": 0,
1284 |         "previous_text": "",
1285 |         "previous_type": "",
1286 |         "previous_order": 0
1287 |       }
1288 |     },
1289 |     {
1290 |       "page_id": 22,
1291 |       "text_extraction_method": "pdftext",
1292 |       "block_counts": [
1293 |         ["Span", 83],
1294 |         ["Line", 35],
1295 |         ["Text", 8],
1296 |         ["SectionHeader", 3],
1297 |         ["Code", 2],
1298 |         ["PageFooter", 1]
1299 |       ],
1300 |       "block_metadata": {
1301 |         "llm_request_count": 0,
1302 |         "llm_error_count": 0,
1303 |         "llm_tokens_used": 0,
1304 |         "previous_text": "",
1305 |         "previous_type": "",
1306 |         "previous_order": 0
1307 |       }
1308 |     },
1309 |     {
1310 |       "page_id": 23,
1311 |       "text_extraction_method": "pdftext",
1312 |       "block_counts": [
1313 |         ["Span", 112],
1314 |         ["Line", 41],
1315 |         ["SectionHeader", 3],
1316 |         ["Text", 2],
1317 |         ["Figure", 1],
1318 |         ["PageFooter", 1]
1319 |       ],
1320 |       "block_metadata": {
1321 |         "llm_request_count": 0,
1322 |         "llm_error_count": 0,
1323 |         "llm_tokens_used": 0,
1324 |         "previous_text": "",
1325 |         "previous_type": "",
1326 |         "previous_order": 0
1327 |       }
1328 |     },
1329 |     {
1330 |       "page_id": 24,
1331 |       "text_extraction_method": "pdftext",
1332 |       "block_counts": [
1333 |         ["Span", 70],
1334 |         ["Line", 29],
1335 |         ["Text", 10],
1336 |         ["Code", 2],
1337 |         ["ListItem", 2],
1338 |         ["SectionHeader", 1],
1339 |         ["PageFooter", 1]
1340 |       ],
1341 |       "block_metadata": {
1342 |         "llm_request_count": 0,
1343 |         "llm_error_count": 0,
1344 |         "llm_tokens_used": 0,
1345 |         "previous_text": "",
1346 |         "previous_type": "",
1347 |         "previous_order": 0
1348 |       }
1349 |     },
1350 |     {
1351 |       "page_id": 25,
1352 |       "text_extraction_method": "pdftext",
1353 |       "block_counts": [
1354 |         ["Span", 105],
1355 |         ["Line", 37],
1356 |         ["ListItem", 4],
1357 |         ["Code", 3],
1358 |         ["ListGroup", 2],
1359 |         ["Text", 1],
1360 |         ["PageFooter", 1]
1361 |       ],
1362 |       "block_metadata": {
1363 |         "llm_request_count": 0,
1364 |         "llm_error_count": 0,
1365 |         "llm_tokens_used": 0,
1366 |         "previous_text": "",
1367 |         "previous_type": "",
1368 |         "previous_order": 0
1369 |       }
1370 |     },
1371 |     {
1372 |       "page_id": 26,
1373 |       "text_extraction_method": "pdftext",
1374 |       "block_counts": [
1375 |         ["Span", 126],
1376 |         ["Line", 37],
1377 |         ["Text", 5],
1378 |         ["Code", 3],
1379 |         ["ListItem", 1],
1380 |         ["TextInlineMath", 1],
1381 |         ["PageFooter", 1]
1382 |       ],
1383 |       "block_metadata": {
1384 |         "llm_request_count": 0,
1385 |         "llm_error_count": 0,
1386 |         "llm_tokens_used": 0,
1387 |         "previous_text": "",
1388 |         "previous_type": "",
1389 |         "previous_order": 0
1390 |       }
1391 |     },
1392 |     {
1393 |       "page_id": 27,
1394 |       "text_extraction_method": "pdftext",
1395 |       "block_counts": [
1396 |         ["Span", 128],
1397 |         ["Line", 38],
1398 |         ["Code", 3],
1399 |         ["Text", 3],
1400 |         ["PageFooter", 1]
1401 |       ],
1402 |       "block_metadata": {
1403 |         "llm_request_count": 0,
1404 |         "llm_error_count": 0,
1405 |         "llm_tokens_used": 0,
1406 |         "previous_text": "",
1407 |         "previous_type": "",
1408 |         "previous_order": 0
1409 |       }
1410 |     },
1411 |     {
1412 |       "page_id": 28,
1413 |       "text_extraction_method": "pdftext",
1414 |       "block_counts": [
1415 |         ["Span", 72],
1416 |         ["Line", 33],
1417 |         ["Text", 5],
1418 |         ["ListItem", 2],
1419 |         ["Code", 1],
1420 |         ["PageFooter", 1],
1421 |         ["ListGroup", 1]
1422 |       ],
1423 |       "block_metadata": {
1424 |         "llm_request_count": 0,
1425 |         "llm_error_count": 0,
1426 |         "llm_tokens_used": 0,
1427 |         "previous_text": "",
1428 |         "previous_type": "",
1429 |         "previous_order": 0
1430 |       }
1431 |     },
1432 |     {
1433 |       "page_id": 29,
1434 |       "text_extraction_method": "pdftext",
1435 |       "block_counts": [
1436 |         ["Span", 101],
1437 |         ["Line", 32],
1438 |         ["Text", 8],
1439 |         ["Code", 4],
1440 |         ["ListItem", 1],
1441 |         ["PageFooter", 1]
1442 |       ],
1443 |       "block_metadata": {
1444 |         "llm_request_count": 0,
1445 |         "llm_error_count": 0,
1446 |         "llm_tokens_used": 0,
1447 |         "previous_text": "",
1448 |         "previous_type": "",
1449 |         "previous_order": 0
1450 |       }
1451 |     },
1452 |     {
1453 |       "page_id": 30,
1454 |       "text_extraction_method": "pdftext",
1455 |       "block_counts": [
1456 |         ["Span", 165],
1457 |         ["Line", 39],
1458 |         ["Text", 4],
1459 |         ["Code", 3],
1460 |         ["ListItem", 2],
1461 |         ["PageFooter", 1]
1462 |       ],
1463 |       "block_metadata": {
1464 |         "llm_request_count": 0,
1465 |         "llm_error_count": 0,
1466 |         "llm_tokens_used": 0,
1467 |         "previous_text": "",
1468 |         "previous_type": "",
1469 |         "previous_order": 0
1470 |       }
1471 |     },
1472 |     {
1473 |       "page_id": 31,
1474 |       "text_extraction_method": "pdftext",
1475 |       "block_counts": [
1476 |         ["Span", 110],
1477 |         ["Line", 39],
1478 |         ["Text", 5],
1479 |         ["Code", 2],
1480 |         ["SectionHeader", 2],
1481 |         ["ListItem", 1],
1482 |         ["PageFooter", 1]
1483 |       ],
1484 |       "block_metadata": {
1485 |         "llm_request_count": 0,
1486 |         "llm_error_count": 0,
1487 |         "llm_tokens_used": 0,
1488 |         "previous_text": "",
1489 |         "previous_type": "",
1490 |         "previous_order": 0
1491 |       }
1492 |     },
1493 |     {
1494 |       "page_id": 32,
1495 |       "text_extraction_method": "pdftext",
1496 |       "block_counts": [
1497 |         ["Span", 136],
1498 |         ["Line", 45],
1499 |         ["Text", 2],
1500 |         ["Figure", 1],
1501 |         ["ListItem", 1],
1502 |         ["Code", 1],
1503 |         ["PageFooter", 1]
1504 |       ],
1505 |       "block_metadata": {
1506 |         "llm_request_count": 0,
1507 |         "llm_error_count": 0,
1508 |         "llm_tokens_used": 0,
1509 |         "previous_text": "",
1510 |         "previous_type": "",
1511 |         "previous_order": 0
1512 |       }
1513 |     },
1514 |     {
1515 |       "page_id": 33,
1516 |       "text_extraction_method": "pdftext",
1517 |       "block_counts": [
1518 |         ["Span", 131],
1519 |         ["Line", 44],
1520 |         ["ListItem", 6],
1521 |         ["Text", 3],
1522 |         ["Code", 2],
1523 |         ["PageFooter", 1],
1524 |         ["ListGroup", 1]
1525 |       ],
1526 |       "block_metadata": {
1527 |         "llm_request_count": 0,
1528 |         "llm_error_count": 0,
1529 |         "llm_tokens_used": 0,
1530 |         "previous_text": "",
1531 |         "previous_type": "",
1532 |         "previous_order": 0
1533 |       }
1534 |     },
1535 |     {
1536 |       "page_id": 34,
1537 |       "text_extraction_method": "pdftext",
1538 |       "block_counts": [
1539 |         ["Span", 156],
1540 |         ["Line", 40],
1541 |         ["Text", 4],
1542 |         ["Code", 3],
1543 |         ["ListItem", 1],
1544 |         ["PageFooter", 1]
1545 |       ],
1546 |       "block_metadata": {
1547 |         "llm_request_count": 0,
1548 |         "llm_error_count": 0,
1549 |         "llm_tokens_used": 0,
1550 |         "previous_text": "",
1551 |         "previous_type": "",
1552 |         "previous_order": 0
1553 |       }
1554 |     },
1555 |     {
1556 |       "page_id": 35,
1557 |       "text_extraction_method": "pdftext",
1558 |       "block_counts": [
1559 |         ["Span", 171],
1560 |         ["Line", 38],
1561 |         ["Text", 7],
1562 |         ["ListItem", 2],
1563 |         ["Code", 2],
1564 |         ["PageFooter", 1]
1565 |       ],
1566 |       "block_metadata": {
1567 |         "llm_request_count": 0,
1568 |         "llm_error_count": 0,
1569 |         "llm_tokens_used": 0,
1570 |         "previous_text": "",
1571 |         "previous_type": "",
1572 |         "previous_order": 0
1573 |       }
1574 |     },
1575 |     {
1576 |       "page_id": 36,
1577 |       "text_extraction_method": "pdftext",
1578 |       "block_counts": [
1579 |         ["Span", 155],
1580 |         ["Line", 41],
1581 |         ["Text", 6],
1582 |         ["Code", 3],
1583 |         ["ListItem", 2],
1584 |         ["PageFooter", 1],
1585 |         ["ListGroup", 1]
1586 |       ],
1587 |       "block_metadata": {
1588 |         "llm_request_count": 0,
1589 |         "llm_error_count": 0,
1590 |         "llm_tokens_used": 0,
1591 |         "previous_text": "",
1592 |         "previous_type": "",
1593 |         "previous_order": 0
1594 |       }
1595 |     },
1596 |     {
1597 |       "page_id": 37,
1598 |       "text_extraction_method": "pdftext",
1599 |       "block_counts": [
1600 |         ["Span", 126],
1601 |         ["Line", 39],
1602 |         ["Text", 6],
1603 |         ["ListItem", 2],
1604 |         ["Code", 2],
1605 |         ["SectionHeader", 1],
1606 |         ["PageFooter", 1]
1607 |       ],
1608 |       "block_metadata": {
1609 |         "llm_request_count": 0,
1610 |         "llm_error_count": 0,
1611 |         "llm_tokens_used": 0,
1612 |         "previous_text": "",
1613 |         "previous_type": "",
1614 |         "previous_order": 0
1615 |       }
1616 |     },
1617 |     {
1618 |       "page_id": 38,
1619 |       "text_extraction_method": "pdftext",
1620 |       "block_counts": [
1621 |         ["Span", 96],
1622 |         ["Line", 37],
1623 |         ["Text", 7],
1624 |         ["SectionHeader", 2],
1625 |         ["Code", 1],
1626 |         ["PageFooter", 1]
1627 |       ],
1628 |       "block_metadata": {
1629 |         "llm_request_count": 0,
1630 |         "llm_error_count": 0,
1631 |         "llm_tokens_used": 0,
1632 |         "previous_text": "",
1633 |         "previous_type": "",
1634 |         "previous_order": 0
1635 |       }
1636 |     },
1637 |     {
1638 |       "page_id": 39,
1639 |       "text_extraction_method": "pdftext",
1640 |       "block_counts": [
1641 |         ["Span", 127],
1642 |         ["Line", 45],
1643 |         ["Code", 1],
1644 |         ["PageFooter", 1]
1645 |       ],
1646 |       "block_metadata": {
1647 |         "llm_request_count": 0,
1648 |         "llm_error_count": 0,
1649 |         "llm_tokens_used": 0,
1650 |         "previous_text": "",
1651 |         "previous_type": "",
1652 |         "previous_order": 0
1653 |       }
1654 |     },
1655 |     {
1656 |       "page_id": 40,
1657 |       "text_extraction_method": "pdftext",
1658 |       "block_counts": [
1659 |         ["Span", 198],
1660 |         ["Line", 40],
1661 |         ["Text", 4],
1662 |         ["Code", 2],
1663 |         ["SectionHeader", 1],
1664 |         ["PageFooter", 1]
1665 |       ],
1666 |       "block_metadata": {
1667 |         "llm_request_count": 0,
1668 |         "llm_error_count": 0,
1669 |         "llm_tokens_used": 0,
1670 |         "previous_text": "",
1671 |         "previous_type": "",
1672 |         "previous_order": 0
1673 |       }
1674 |     },
1675 |     {
1676 |       "page_id": 41,
1677 |       "text_extraction_method": "pdftext",
1678 |       "block_counts": [
1679 |         ["Span", 192],
1680 |         ["Line", 37],
1681 |         ["Text", 4],
1682 |         ["Code", 2],
1683 |         ["PageFooter", 1]
1684 |       ],
1685 |       "block_metadata": {
1686 |         "llm_request_count": 0,
1687 |         "llm_error_count": 0,
1688 |         "llm_tokens_used": 0,
1689 |         "previous_text": "",
1690 |         "previous_type": "",
1691 |         "previous_order": 0
1692 |       }
1693 |     },
1694 |     {
1695 |       "page_id": 42,
1696 |       "text_extraction_method": "pdftext",
1697 |       "block_counts": [
1698 |         ["Span", 200],
1699 |         ["Line", 37],
1700 |         ["Text", 2],
1701 |         ["Code", 2],
1702 |         ["SectionHeader", 1],
1703 |         ["PageFooter", 1]
1704 |       ],
1705 |       "block_metadata": {
1706 |         "llm_request_count": 0,
1707 |         "llm_error_count": 0,
1708 |         "llm_tokens_used": 0,
1709 |         "previous_text": "",
1710 |         "previous_type": "",
1711 |         "previous_order": 0
1712 |       }
1713 |     },
1714 |     {
1715 |       "page_id": 43,
1716 |       "text_extraction_method": "pdftext",
1717 |       "block_counts": [
1718 |         ["Span", 185],
1719 |         ["Line", 35],
1720 |         ["Text", 6],
1721 |         ["Code", 3],
1722 |         ["SectionHeader", 2],
1723 |         ["ListItem", 1],
1724 |         ["PageFooter", 1]
1725 |       ],
1726 |       "block_metadata": {
1727 |         "llm_request_count": 0,
1728 |         "llm_error_count": 0,
1729 |         "llm_tokens_used": 0,
1730 |         "previous_text": "",
1731 |         "previous_type": "",
1732 |         "previous_order": 0
1733 |       }
1734 |     },
1735 |     {
1736 |       "page_id": 44,
1737 |       "text_extraction_method": "pdftext",
1738 |       "block_counts": [
1739 |         ["Span", 139],
1740 |         ["Line", 33],
1741 |         ["Text", 7],
1742 |         ["Code", 2],
1743 |         ["SectionHeader", 1],
1744 |         ["PageFooter", 1]
1745 |       ],
1746 |       "block_metadata": {
1747 |         "llm_request_count": 0,
1748 |         "llm_error_count": 0,
1749 |         "llm_tokens_used": 0,
1750 |         "previous_text": "",
1751 |         "previous_type": "",
1752 |         "previous_order": 0
1753 |       }
1754 |     },
1755 |     {
1756 |       "page_id": 45,
1757 |       "text_extraction_method": "pdftext",
1758 |       "block_counts": [
1759 |         ["Span", 85],
1760 |         ["Line", 34],
1761 |         ["Text", 10],
1762 |         ["SectionHeader", 3],
1763 |         ["PageFooter", 1]
1764 |       ],
1765 |       "block_metadata": {
1766 |         "llm_request_count": 0,
1767 |         "llm_error_count": 0,
1768 |         "llm_tokens_used": 0,
1769 |         "previous_text": "",
1770 |         "previous_type": "",
1771 |         "previous_order": 0
1772 |       }
1773 |     },
1774 |     {
1775 |       "page_id": 46,
1776 |       "text_extraction_method": "pdftext",
1777 |       "block_counts": [
1778 |         ["Span", 113],
1779 |         ["Line", 42],
1780 |         ["Text", 7],
1781 |         ["SectionHeader", 2],
1782 |         ["PageFooter", 1]
1783 |       ],
1784 |       "block_metadata": {
1785 |         "llm_request_count": 0,
1786 |         "llm_error_count": 0,
1787 |         "llm_tokens_used": 0,
1788 |         "previous_text": "",
1789 |         "previous_type": "",
1790 |         "previous_order": 0
1791 |       }
1792 |     },
1793 |     {
1794 |       "page_id": 47,
1795 |       "text_extraction_method": "pdftext",
1796 |       "block_counts": [
1797 |         ["Span", 155],
1798 |         ["Line", 70],
1799 |         ["TableCell", 15],
1800 |         ["Text", 4],
1801 |         ["ListItem", 2],
1802 |         ["SectionHeader", 1],
1803 |         ["Table", 1],
1804 |         ["PageFooter", 1],
1805 |         ["ListGroup", 1]
1806 |       ],
1807 |       "block_metadata": {
1808 |         "llm_request_count": 0,
1809 |         "llm_error_count": 0,
1810 |         "llm_tokens_used": 0,
1811 |         "previous_text": "",
1812 |         "previous_type": "",
1813 |         "previous_order": 0
1814 |       }
1815 |     },
1816 |     {
1817 |       "page_id": 48,
1818 |       "text_extraction_method": "surya",
1819 |       "block_counts": [
1820 |         ["TableCell", 35],
1821 |         ["Line", 12],
1822 |         ["Table", 1],
1823 |         ["PageFooter", 1],
1824 |         ["Span", 1]
1825 |       ],
1826 |       "block_metadata": {
1827 |         "llm_request_count": 0,
1828 |         "llm_error_count": 0,
1829 |         "llm_tokens_used": 0,
1830 |         "previous_text": "",
1831 |         "previous_type": "",
1832 |         "previous_order": 0
1833 |       }
1834 |     },
1835 |     {
1836 |       "page_id": 49,
1837 |       "text_extraction_method": "pdftext",
1838 |       "block_counts": [
1839 |         ["Span", 285],
1840 |         ["Line", 140],
1841 |         ["TableCell", 40],
1842 |         ["Table", 1],
1843 |         ["Text", 1],
1844 |         ["PageFooter", 1]
1845 |       ],
1846 |       "block_metadata": {
1847 |         "llm_request_count": 0,
1848 |         "llm_error_count": 0,
1849 |         "llm_tokens_used": 0,
1850 |         "previous_text": "",
1851 |         "previous_type": "",
1852 |         "previous_order": 0
1853 |       }
1854 |     },
1855 |     {
1856 |       "page_id": 50,
1857 |       "text_extraction_method": "pdftext",
1858 |       "block_counts": [
1859 |         ["Span", 132],
1860 |         ["Line", 50],
1861 |         ["ListItem", 10],
1862 |         ["Text", 4],
1863 |         ["SectionHeader", 1],
1864 |         ["PageFooter", 1],
1865 |         ["ListGroup", 1]
1866 |       ],
1867 |       "block_metadata": {
1868 |         "llm_request_count": 0,
1869 |         "llm_error_count": 0,
1870 |         "llm_tokens_used": 0,
1871 |         "previous_text": "",
1872 |         "previous_type": "",
1873 |         "previous_order": 0
1874 |       }
1875 |     },
1876 |     {
1877 |       "page_id": 51,
1878 |       "text_extraction_method": "pdftext",
1879 |       "block_counts": [
1880 |         ["Span", 131],
1881 |         ["Line", 57],
1882 |         ["ListItem", 18],
1883 |         ["PageFooter", 1],
1884 |         ["ListGroup", 1]
1885 |       ],
1886 |       "block_metadata": {
1887 |         "llm_request_count": 0,
1888 |         "llm_error_count": 0,
1889 |         "llm_tokens_used": 0,
1890 |         "previous_text": "",
1891 |         "previous_type": "",
1892 |         "previous_order": 0
1893 |       }
1894 |     },
1895 |     {
1896 |       "page_id": 52,
1897 |       "text_extraction_method": "pdftext",
1898 |       "block_counts": [
1899 |         ["Span", 128],
1900 |         ["Line", 59],
1901 |         ["ListItem", 21],
1902 |         ["PageFooter", 1],
1903 |         ["ListGroup", 1]
1904 |       ],
1905 |       "block_metadata": {
1906 |         "llm_request_count": 0,
1907 |         "llm_error_count": 0,
1908 |         "llm_tokens_used": 0,
1909 |         "previous_text": "",
1910 |         "previous_type": "",
1911 |         "previous_order": 0
1912 |       }
1913 |     },
1914 |     {
1915 |       "page_id": 53,
1916 |       "text_extraction_method": "pdftext",
1917 |       "block_counts": [
1918 |         ["Span", 121],
1919 |         ["Line", 44],
1920 |         ["Text", 13],
1921 |         ["SectionHeader", 9],
1922 |         ["PageFooter", 1]
1923 |       ],
1924 |       "block_metadata": {
1925 |         "llm_request_count": 0,
1926 |         "llm_error_count": 0,
1927 |         "llm_tokens_used": 0,
1928 |         "previous_text": "",
1929 |         "previous_type": "",
1930 |         "previous_order": 0
1931 |       }
1932 |     }
1933 |   ],
1934 |   "debug_data_path": "debug_data\\LLM-Assisted Software Engineering Playbook - Copy (2)"
1935 | }
```

public/manifest.webmanifest

```
1 | {
2 |   "name": "LLM Playbook Explorer",
3 |   "short_name": "Playbook",
4 |   "start_url": "/",
5 |   "display": "standalone",
6 |   "background_color": "#ffffff",
7 |   "icons": [
8 |     { "src": "/icons/pwa-192.png", "sizes": "192x192", "type": "image/png" },
9 |     { "src": "/icons/pwa-512.png", "sizes": "512x512", "type": "image/png" }
10 |   ]
11 | }
```

scripts/build-data.ts

```
1 | import { readFileSync, writeFileSync } from 'fs';
2 | import { join } from 'path';
3 |
4 | const source = join(process.cwd(), 'public/data/playbook.json');
5 | const data = JSON.parse(readFileSync(source, 'utf-8'));
6 | writeFileSync(source, JSON.stringify(data, null, 2));
7 | console.log('playbook.json written');
```

src/main.tsx

```
1 | import React from 'react';
2 | import ReactDOM from 'react-dom/client';
3 | import { BrowserRouter } from 'react-router-dom';
4 | import AppRouter from './app/router';
5 | import './styles/global.css';
6 |
7 | ReactDOM.createRoot(document.getElementById('root')!).render(
8 |   <React.StrictMode>
9 |     <BrowserRouter>
10 |       <AppRouter />
11 |     </BrowserRouter>
12 |   </React.StrictMode>,
13 | );
```

src/vitest.setup.ts

```
1 | import '@testing-library/jest-dom';
```

.github/workflows/ci.yml

```
1 | name: CI
2 | on: [push]
3 | jobs:
4 |   build:
5 |     runs-on: ubuntu-latest
6 |     steps:
7 |       - uses: actions/checkout@v3
8 |       - uses: actions/setup-node@v3
9 |         with:
10 |           node-version: '18'
11 |           cache: 'npm'
12 |       - run: npm ci
13 |       - run: npm run lint
14 |       - run: npm run typecheck
15 |       - run: npm test
16 |       - run: npm run build
17 |       - run: npm run e2e
```

.husky/\_/applypatch-msg

```
1 | #!/usr/bin/env sh
2 | . "$(dirname "$0")/h"
```

.husky/\_/commit-msg

```
1 | #!/usr/bin/env sh
2 | . "$(dirname "$0")/h"
```

.husky/\_/h

```
1 | #!/usr/bin/env sh
2 | [ "$HUSKY" = "2" ] && set -x
3 | n=$(basename "$0")
4 | s=$(dirname "$(dirname "$0")")/$n
5 |
6 | [ ! -f "$s" ] && exit 0
7 |
8 | if [ -f "$HOME/.huskyrc" ]; then
9 | 	echo "husky - '~/.huskyrc' is DEPRECATED, please move your code to ~/.config/husky/init.sh"
10 | fi
11 | i="${XDG_CONFIG_HOME:-$HOME/.config}/husky/init.sh"
12 | [ -f "$i" ] && . "$i"
13 |
14 | [ "${HUSKY-}" = "0" ] && exit 0
15 |
16 | export PATH="node_modules/.bin:$PATH"
17 | sh -e "$s" "$@"
18 | c=$?
19 |
20 | [ $c != 0 ] && echo "husky - $n script failed (code $c)"
21 | [ $c = 127 ] && echo "husky - command not found in PATH=$PATH"
22 | exit $c
```

.husky/\_/husky.sh

```
1 | echo "husky - DEPRECATED
2 |
3 | Please remove the following two lines from $0:
4 |
5 | #!/usr/bin/env sh
6 | . \"\$(dirname -- \"\$0\")/_/husky.sh\"
7 |
8 | They WILL FAIL in v10.0.0
9 | "
```

.husky/\_/post-applypatch

```
1 | #!/usr/bin/env sh
2 | . "$(dirname "$0")/h"
```

.husky/\_/post-checkout

```
1 | #!/usr/bin/env sh
2 | . "$(dirname "$0")/h"
```

.husky/\_/post-commit

```
1 | #!/usr/bin/env sh
2 | . "$(dirname "$0")/h"
```

.husky/\_/post-merge

```
1 | #!/usr/bin/env sh
2 | . "$(dirname "$0")/h"
```

.husky/\_/post-rewrite

```
1 | #!/usr/bin/env sh
2 | . "$(dirname "$0")/h"
```

.husky/\_/pre-applypatch

```
1 | #!/usr/bin/env sh
2 | . "$(dirname "$0")/h"
```

.husky/\_/pre-auto-gc

```
1 | #!/usr/bin/env sh
2 | . "$(dirname "$0")/h"
```

.husky/\_/pre-commit

```
1 | #!/usr/bin/env sh
2 | . "$(dirname "$0")/h"
```

.husky/\_/pre-merge-commit

```
1 | #!/usr/bin/env sh
2 | . "$(dirname "$0")/h"
```

.husky/\_/pre-push

```
1 | #!/usr/bin/env sh
2 | . "$(dirname "$0")/h"
```

.husky/\_/pre-rebase

```
1 | #!/usr/bin/env sh
2 | . "$(dirname "$0")/h"
```

.husky/\_/prepare-commit-msg

```
1 | #!/usr/bin/env sh
2 | . "$(dirname "$0")/h"
```

public/data/playbook.json

```
1 | {
2 |   "version": "0.1.0",
3 |   "updatedAt": "2024-01-01",
4 |   "patterns": [
5 |     {
6 |       "id": "ideation-requirements",
7 |       "title": "LLM for Requirements Ideation",
8 |       "summary": "Use LLMs to brainstorm and refine requirements.",
9 |       "phase": "Ideation",
10 |       "difficulty": "Beginner",
11 |       "roi": 8,
12 |       "steps": ["Outline goals", "Ask LLM for user stories"],
13 |       "bestPractices": ["Review outputs", "Iterate with stakeholders"],
14 |       "tags": ["requirements"],
15 |       "relations": []
16 |     },
17 |     {
18 |       "id": "scaffold-project",
19 |       "title": "Project Scaffolding",
20 |       "summary": "Generate starter code and configuration.",
21 |       "phase": "Scaffolding",
22 |       "difficulty": "Intermediate",
23 |       "roi": 7,
24 |       "steps": ["Describe project", "Generate scaffolds"],
25 |       "bestPractices": ["Verify structure", "Add tests"],
26 |       "tags": ["scaffold"],
27 |       "relations": []
28 |     },
29 |     {
30 |       "id": "code-review",
31 |       "title": "LLM Code Review",
32 |       "summary": "Use LLM to review code patches.",
33 |       "phase": "Review",
34 |       "difficulty": "Advanced",
35 |       "roi": 6,
36 |       "steps": ["Provide diff", "Ask for issues"],
37 |       "bestPractices": ["Validate suggestions", "Enforce standards"],
38 |       "tags": ["review"],
39 |       "relations": []
40 |     }
41 |   ],
42 |   "workflows": [
43 |     {
44 |       "id": "basic-cycle",
45 |       "title": "Basic Development Cycle",
46 |       "summary": "Simple workflow from idea to deploy.",
47 |       "stages": [
48 |         {
49 |           "name": "Ideation",
50 |           "goals": ["Capture ideas"]
51 |         },
52 |         {
53 |           "name": "Coding",
54 |           "goals": ["Implement features"]
55 |         },
56 |         {
57 |           "name": "Deployment",
58 |           "goals": ["Release to users"]
59 |         }
60 |       ],
61 |       "tags": ["workflow"],
62 |       "relations": []
63 |     }
64 |   ],
65 |   "tools": [
66 |     {
67 |       "id": "chatgpt",
68 |       "name": "ChatGPT",
69 |       "category": "LLM",
70 |       "strengths": ["Conversational", "General purpose"],
71 |       "limits": ["May hallucinate"],
72 |       "tags": ["openai"],
73 |       "relations": []
74 |     },
75 |     {
76 |       "id": "copilot",
77 |       "name": "GitHub Copilot",
78 |       "category": "Coding Assistant",
79 |       "strengths": ["Code completion"],
80 |       "limits": ["Requires subscription"],
81 |       "tags": ["github"],
82 |       "relations": []
83 |     }
84 |   ],
85 |   "prompts": [
86 |     {
87 |       "id": "bug-fix",
88 |       "title": "Debugging Assistant",
89 |       "body": "I have this bug: ... How can I fix it?",
90 |       "useCases": ["Debugging"],
91 |       "tags": ["debug"],
92 |       "relations": []
93 |     },
94 |     {
95 |       "id": "test-writer",
96 |       "title": "Test Case Generator",
97 |       "body": "Generate unit tests for the following function: ...",
98 |       "useCases": ["Testing"],
99 |       "tags": ["tests"],
100 |       "relations": []
101 |     }
102 |   ],
103 |   "metrics": [
104 |     {
105 |       "id": "cycle-time",
106 |       "name": "Cycle Time",
107 |       "desc": "Time from start to finish",
108 |       "scale": "ratio",
109 |       "tags": ["speed"]
110 |     },
111 |     {
112 |       "id": "defect-rate",
113 |       "name": "Defect Rate",
114 |       "desc": "Bugs per release",
115 |       "scale": "ratio",
116 |       "tags": ["quality"]
117 |     }
118 |   ],
119 |   "risks": [
120 |     {
121 |       "id": "privacy-leak",
122 |       "name": "Privacy Leak",
123 |       "mitigation": ["Sanitize data"],
124 |       "severity": "High",
125 |       "tags": ["security"]
126 |     },
127 |     {
128 |       "id": "overreliance",
129 |       "name": "Overreliance on AI",
130 |       "mitigation": ["Keep human in loop"],
131 |       "severity": "Med",
132 |       "tags": ["process"]
133 |     }
134 |   ]
135 | }
```

e2e/tests/smoke.spec.ts

```
1 | import { test, expect } from '@playwright/test';
2 |
3 | test('home loads', async ({ page }) => {
4 |   await page.goto('http://localhost:5173/');
5 |   await expect(page.locator('text=LLM Playbook')).toBeVisible();
6 | });
```

scripts/**tests**/build-data.test.ts

```
1 | import { describe, it, expect } from 'vitest';
2 | import { readFileSync } from 'fs';
3 | import { execSync } from 'child_process';
4 |
5 | describe('build-data script', () => {
6 |   it('writes playbook.json', () => {
7 |     execSync('npx tsx scripts/build-data.ts');
8 |     const content = readFileSync('public/data/playbook.json', 'utf-8');
9 |     expect(JSON.parse(content).version).toBeDefined();
10 |   });
11 | });
```

src/components/CommandPalette.tsx

```
1 | import { useEffect, useState } from 'react';
2 | import { useStore } from '../app/store';
3 | import { createIndexer } from '../data/indexer';
4 |
5 | export default function CommandPalette() {
6 |   const playbook = useStore((s) => s.playbook);
7 |   const [open, setOpen] = useState(false);
8 |   const [query, setQuery] = useState('');
9 |   const [results, setResults] = useState<any[]>([]);
10 |
11 |   useEffect(() => {
12 |     const onKey = (e: KeyboardEvent) => {
13 |       if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
14 |         e.preventDefault();
15 |         setOpen((o) => !o);
16 |       }
17 |     };
18 |     window.addEventListener('keydown', onKey);
19 |     return () => window.removeEventListener('keydown', onKey);
20 |   }, []);
21 |
22 |   useEffect(() => {
23 |     if (!playbook) return;
24 |     const indexer = createIndexer(playbook);
25 |     setResults(query ? indexer.search(query).slice(0, 5) : []);
26 |   }, [playbook, query]);
27 |
28 |   if (!open) return null;
29 |
30 |   return (
31 |     <div
32 |       className="fixed inset-0 bg-black/50 flex items-start justify-center p-4"
33 |       onClick={() => setOpen(false)}
34 |     >
35 |       <div
36 |         className="bg-white dark:bg-gray-700 p-4 w-full max-w-md"
37 |         onClick={(e) => e.stopPropagation()}
38 |       >
39 |         <input
40 |           autoFocus
41 |           value={query}
42 |           onChange={(e) => setQuery(e.target.value)}
43 |           placeholder="Search..."
44 |           className="w-full p-2 mb-2 text-black"
45 |         />
46 |         <ul>
47 |           {results.map((r) => (
48 |             <li key={r.item.id} className="p-1">
49 |               {r.item.title || r.item.name}
50 |             </li>
51 |           ))}
52 |         </ul>
53 |       </div>
54 |     </div>
55 |   );
56 | }
```

src/components/KpiCard.tsx

```
1 | import { ReactNode } from 'react';
2 |
3 | export default function KpiCard({
4 |   title,
5 |   value,
6 | }: {
7 |   title: string;
8 |   value: ReactNode;
9 | }) {
10 |   return (
11 |     <div className="p-4 border rounded shadow-sm">
12 |       <div className="text-sm text-gray-500">{title}</div>
13 |       <div className="text-2xl font-bold">{value}</div>
14 |     </div>
15 |   );
16 | }
```

src/components/SearchInput.tsx

```
1 | import { forwardRef, InputHTMLAttributes } from 'react';
2 |
3 | const SearchInput = forwardRef<
4 |   HTMLInputElement,
5 |   InputHTMLAttributes<HTMLInputElement>
6 | >((props, ref) => {
7 |   return (
8 |     <input
9 |       ref={ref}
10 |       {...props}
11 |       className={`p-2 border rounded w-full ${props.className || ''}`}
12 |     />
13 |   );
14 | });
15 |
16 | export default SearchInput;
```

src/components/ThemeToggle.tsx

```
1 | import { useEffect } from 'react';
2 | import { useStore } from '../app/store';
3 |
4 | export default function ThemeToggle() {
5 |   const theme = useStore((s) => s.theme);
6 |   const toggle = useStore((s) => s.toggleTheme);
7 |
8 |   useEffect(() => {
9 |     document.documentElement.classList.toggle('dark', theme === 'dark');
10 |   }, [theme]);
11 |
12 |   return (
13 |     <button onClick={toggle} aria-label="Toggle theme">
14 |       {theme === 'dark' ? '🌙' : '☀️'}
15 |     </button>
16 |   );
17 | }
```

src/app/router.tsx

```
1 | import { Routes, Route } from 'react-router-dom';
2 | import Shell from './shell';
3 | import HomePage from '../pages/HomePage';
4 | import ExplorerPage from '../features/explorer/ExplorerPage';
5 | import ComparePage from '../features/compare/ComparePage';
6 | import PromptLabPage from '../features/prompts/PromptLabPage';
7 | import NotFound from '../pages/NotFound';
8 |
9 | export default function AppRouter() {
10 |   return (
11 |     <Shell>
12 |       <Routes>
13 |         <Route path="/" element={<HomePage />} />
14 |         <Route path="/explore" element={<ExplorerPage />} />
15 |         <Route path="/compare" element={<ComparePage />} />
16 |         <Route path="/prompts" element={<PromptLabPage />} />
17 |         <Route path="*" element={<NotFound />} />
18 |       </Routes>
19 |     </Shell>
20 |   );
21 | }
```

src/app/shell.tsx

```
1 | import { Link } from 'react-router-dom';
2 | import ThemeToggle from '../components/ThemeToggle';
3 | import CommandPalette from '../components/CommandPalette';
4 | import { ReactNode, useEffect } from 'react';
5 | import { useStore } from './store';
6 | import { loadPlaybook } from '../data/repo';
7 |
8 | export default function Shell({ children }: { children: ReactNode }) {
9 |   const setPlaybook = useStore((s) => s.setPlaybook);
10 |
11 |   useEffect(() => {
12 |     loadPlaybook().then(setPlaybook).catch(console.error);
13 |   }, [setPlaybook]);
14 |
15 |   return (
16 |     <div className="min-h-full flex flex-col">
17 |       <a href="#main" className="sr-only focus:not-sr-only">
18 |         Skip to content
19 |       </a>
20 |       <nav className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800">
21 |         <div className="flex gap-4">
22 |           <Link to="/">Home</Link>
23 |           <Link to="/explore">Explore</Link>
24 |           <Link to="/compare">Compare</Link>
25 |           <Link to="/prompts">Prompts</Link>
26 |         </div>
27 |         <ThemeToggle />
28 |       </nav>
29 |       <main id="main" className="flex-1 p-4">
30 |         {children}
31 |       </main>
32 |       <CommandPalette />
33 |     </div>
34 |   );
35 | }
```

src/app/store.ts

```
1 | import create from 'zustand';
2 | import { Playbook } from '../data/schemas';
3 |
4 | interface StoreState {
5 |   playbook?: Playbook;
6 |   setPlaybook: (pb: Playbook) => void;
7 |   theme: 'light' | 'dark';
8 |   toggleTheme: () => void;
9 | }
10 |
11 | export const useStore = create<StoreState>((set) => ({
12 |   playbook: undefined,
13 |   setPlaybook: (pb) => set({ playbook: pb }),
14 |   theme: 'light',
15 |   toggleTheme: () =>
16 |     set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
17 | }));
```

src/data/indexer.ts

```
1 | import Fuse from 'fuse.js';
2 | import { Playbook } from './schemas';
3 |
4 | export function createIndexer(playbook: Playbook) {
5 |   const list: any[] = [
6 |     ...playbook.patterns,
7 |     ...playbook.workflows,
8 |     ...playbook.tools,
9 |     ...playbook.prompts,
10 |     ...playbook.metrics,
11 |     ...playbook.risks,
12 |   ];
13 |   return new Fuse(list, {
14 |     keys: [
15 |       { name: 'title', weight: 0.5 },
16 |       { name: 'name', weight: 0.5 },
17 |       { name: 'tags', weight: 0.3 },
18 |       { name: 'summary', weight: 0.2 },
19 |     ],
20 |     threshold: 0.3,
21 |   });
22 | }
```

src/data/repo.ts

```
1 | import { PlaybookSchema, Playbook } from './schemas';
2 |
3 | export async function loadPlaybook(): Promise<Playbook> {
4 |   const res = await fetch('/data/playbook.json');
5 |   const json = await res.json();
6 |   const parsed = PlaybookSchema.safeParse(json);
7 |   if (!parsed.success) {
8 |     throw new Error('Invalid playbook data');
9 |   }
10 |   return parsed.data;
11 | }
```

src/data/schemas.ts

```
1 | import { z } from 'zod';
2 |
3 | export const RelationSchema = z.object({
4 |   id: z.string(),
5 |   type: z.enum(['pattern', 'workflow', 'tool', 'prompt', 'metric', 'risk']),
6 |   weight: z.number().optional(),
7 | });
8 |
9 | export const PatternSchema = z.object({
10 |   id: z.string(),
11 |   title: z.string(),
12 |   summary: z.string(),
13 |   phase: z.enum([
14 |     'Ideation',
15 |     'Scaffolding',
16 |     'Coding',
17 |     'Review',
18 |     'Testing',
19 |     'Deployment',
20 |   ]),
21 |   difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
22 |   roi: z.number().min(0).max(10),
23 |   steps: z.array(z.string()),
24 |   bestPractices: z.array(z.string()),
25 |   antiPatterns: z.array(z.string()).optional(),
26 |   prompts: z.array(z.string()).optional(),
27 |   tools: z.array(z.string()).optional(),
28 |   metrics: z.array(z.string()).optional(),
29 |   risks: z.array(z.string()).optional(),
30 |   tags: z.array(z.string()),
31 |   links: z.array(z.string()).optional(),
32 |   relations: z.array(RelationSchema),
33 | });
34 |
35 | export const WorkflowSchema = z.object({
36 |   id: z.string(),
37 |   title: z.string(),
38 |   summary: z.string(),
39 |   stages: z.array(
40 |     z.object({
41 |       name: z.string(),
42 |       goals: z.array(z.string()),
43 |       artifacts: z.array(z.string()).optional(),
44 |     }),
45 |   ),
46 |   kpis: z.array(z.string()).optional(),
47 |   tags: z.array(z.string()),
48 |   relations: z.array(RelationSchema),
49 | });
50 |
51 | export const ToolSchema = z.object({
52 |   id: z.string(),
53 |   name: z.string(),
54 |   category: z.string(),
55 |   cost: z.string().optional(),
56 |   url: z.string().optional(),
57 |   strengths: z.array(z.string()),
58 |   limits: z.array(z.string()),
59 |   tags: z.array(z.string()),
60 |   relations: z.array(RelationSchema),
61 | });
62 |
63 | export const PromptSchema = z.object({
64 |   id: z.string(),
65 |   title: z.string(),
66 |   body: z.string(),
67 |   useCases: z.array(z.string()),
68 |   inputs: z.array(z.string()).optional(),
69 |   outputs: z.array(z.string()).optional(),
70 |   tags: z.array(z.string()),
71 |   relations: z.array(RelationSchema),
72 | });
73 |
74 | export const MetricSchema = z.object({
75 |   id: z.string(),
76 |   name: z.string(),
77 |   desc: z.string(),
78 |   scale: z.enum(['ordinal', 'ratio', 'percent']),
79 |   compute: z.string().optional(),
80 |   tags: z.array(z.string()),
81 | });
82 |
83 | export const RiskSchema = z.object({
84 |   id: z.string(),
85 |   name: z.string(),
86 |   mitigation: z.array(z.string()),
87 |   severity: z.enum(['Low', 'Med', 'High']),
88 |   tags: z.array(z.string()),
89 | });
90 |
91 | export const PlaybookSchema = z.object({
92 |   version: z.string(),
93 |   updatedAt: z.string(),
94 |   patterns: z.array(PatternSchema),
95 |   workflows: z.array(WorkflowSchema),
96 |   tools: z.array(ToolSchema),
97 |   prompts: z.array(PromptSchema),
98 |   metrics: z.array(MetricSchema),
99 |   risks: z.array(RiskSchema),
100 | });
101 |
102 | export type Relation = z.infer<typeof RelationSchema>;
103 | export type Pattern = z.infer<typeof PatternSchema>;
104 | export type Workflow = z.infer<typeof WorkflowSchema>;
105 | export type Tool = z.infer<typeof ToolSchema>;
106 | export type Prompt = z.infer<typeof PromptSchema>;
107 | export type Metric = z.infer<typeof MetricSchema>;
108 | export type Risk = z.infer<typeof RiskSchema>;
109 | export type Playbook = z.infer<typeof PlaybookSchema>;
```

src/pages/HomePage.tsx

```
1 | import { useStore } from '../app/store';
2 | import KpiCard from '../components/KpiCard';
3 | import RoiDifficultyScatter from '../viz/RoiDifficultyScatter';
4 |
5 | export default function HomePage() {
6 |   const playbook = useStore((s) => s.playbook);
7 |
8 |   if (!playbook) return <div>Loading...</div>;
9 |
10 |   return (
11 |     <div className="space-y-4">
12 |       <h1 className="text-2xl font-bold">LLM Playbook</h1>
13 |       <div>Version: {playbook.version}</div>
14 |       <div>Updated: {playbook.updatedAt}</div>
15 |       <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
16 |         <KpiCard title="Patterns" value={playbook.patterns.length} />
17 |         <KpiCard title="Workflows" value={playbook.workflows.length} />
18 |         <KpiCard title="Tools" value={playbook.tools.length} />
19 |         <KpiCard title="Prompts" value={playbook.prompts.length} />
20 |         <KpiCard title="Metrics" value={playbook.metrics.length} />
21 |         <KpiCard title="Risks" value={playbook.risks.length} />
22 |       </div>
23 |       <RoiDifficultyScatter patterns={playbook.patterns} />
24 |     </div>
25 |   );
26 | }
```

src/pages/NotFound.tsx

```
1 | export default function NotFound() {
2 |   return <div>Page not found</div>;
3 | }
```

src/styles/global.css

```
1 | @tailwind base;
2 | @tailwind components;
3 | @tailwind utilities;
4 |
5 | html,
6 | body,
7 | #root {
8 |   height: 100%;
9 | }
```

src/utils/cn.ts

```
1 | import clsx, { ClassValue } from 'clsx';
2 | export function cn(...values: ClassValue[]) {
3 |   return clsx(values);
4 | }
```

src/viz/RoiDifficultyScatter.tsx

```
1 | import {
2 |   ScatterChart,
3 |   Scatter,
4 |   XAxis,
5 |   YAxis,
6 |   Tooltip,
7 |   ResponsiveContainer,
8 | } from 'recharts';
9 | import { Pattern } from '../data/schemas';
10 |
11 | function diffToNumber(d: string) {
12 |   return d === 'Beginner' ? 1 : d === 'Intermediate' ? 2 : 3;
13 | }
14 |
15 | export default function RoiDifficultyScatter({
16 |   patterns,
17 | }: {
18 |   patterns: Pattern[];
19 | }) {
20 |   const data = patterns.map((p) => ({
21 |     x: diffToNumber(p.difficulty),
22 |     y: p.roi,
23 |     name: p.title,
24 |   }));
25 |   return (
26 |     <ResponsiveContainer width="100%" height={300}>
27 |       <ScatterChart>
28 |         <XAxis type="number" dataKey="x" name="Difficulty" domain={[1, 3]} />
29 |         <YAxis type="number" dataKey="y" name="ROI" domain={[0, 10]} />
30 |         <Tooltip
31 |           cursor={{ strokeDasharray: '3 3' }}
32 |           formatter={(v, n, props) => props.payload.name}
33 |         />
34 |         <Scatter data={data} fill="#8884d8" />
35 |       </ScatterChart>
36 |     </ResponsiveContainer>
37 |   );
38 | }
```

src/**tests**/schemas.test.ts

```
1 | import { describe, it, expect } from 'vitest';
2 | import { PlaybookSchema } from '../data/schemas';
3 |
4 | describe('Playbook schema', () => {
5 |   it('parses minimal valid data', () => {
6 |     const data = {
7 |       version: '1',
8 |       updatedAt: '2024-01-01',
9 |       patterns: [],
10 |       workflows: [],
11 |       tools: [],
12 |       prompts: [],
13 |       metrics: [],
14 |       risks: [],
15 |     };
16 |     expect(PlaybookSchema.parse(data).version).toBe('1');
17 |   });
18 | });
```

src/features/prompts/PromptLabPage.tsx

```
1 | import { useStore } from '../../app/store';
2 |
3 | export default function PromptLabPage() {
4 |   const playbook = useStore((s) => s.playbook);
5 |   if (!playbook) return <div>Loading...</div>;
6 |   return (
7 |     <div className="grid gap-4">
8 |       {playbook.prompts.map((p) => (
9 |         <div key={p.id} className="p-4 border rounded">
10 |           <h3 className="font-bold">{p.title}</h3>
11 |           <pre className="whitespace-pre-wrap bg-gray-100 p-2 mt-2">
12 |             {p.body}
13 |           </pre>
14 |           <button
15 |             className="mt-2 px-2 py-1 border rounded"
16 |             onClick={() => navigator.clipboard.writeText(p.body)}
17 |           >
18 |             Copy
19 |           </button>
20 |         </div>
21 |       ))}
22 |     </div>
23 |   );
24 | }
```

src/features/explorer/ExplorerPage.tsx

```
1 | import { useEffect, useRef, useState } from 'react';
2 | import { useStore } from '../../app/store';
3 | import SearchInput from '../../components/SearchInput';
4 | import { Pattern } from '../../data/schemas';
5 | import { createIndexer } from '../../data/indexer';
6 |
7 | export default function ExplorerPage() {
8 |   const playbook = useStore((s) => s.playbook);
9 |   const [query, setQuery] = useState('');
10 |   const [phase, setPhase] = useState('');
11 |   const [sort, setSort] = useState('roi');
12 |   const [results, setResults] = useState<Pattern[]>([]);
13 |   const inputRef = useRef<HTMLInputElement>(null);
14 |
15 |   useEffect(() => {
16 |     const handler = (e: KeyboardEvent) => {
17 |       if (e.key === '/') {
18 |         e.preventDefault();
19 |         inputRef.current?.focus();
20 |       }
21 |     };
22 |     window.addEventListener('keydown', handler);
23 |     return () => window.removeEventListener('keydown', handler);
24 |   }, []);
25 |
26 |   useEffect(() => {
27 |     if (!playbook) return;
28 |     let items = playbook.patterns;
29 |     if (phase) items = items.filter((p) => p.phase === phase);
30 |     if (query) {
31 |       const index = createIndexer({ patterns: items } as any);
32 |       items = index.search(query).map((r: any) => r.item);
33 |     }
34 |     if (sort === 'roi') items = [...items].sort((a, b) => b.roi - a.roi);
35 |     if (sort === 'difficulty')
36 |       items = [...items].sort((a, b) =>
37 |         a.difficulty.localeCompare(b.difficulty),
38 |       );
39 |     setResults(items);
40 |   }, [playbook, query, phase, sort]);
41 |
42 |   if (!playbook) return <div>Loading...</div>;
43 |
44 |   return (
45 |     <div>
46 |       <div className="flex gap-2 mb-4">
47 |         <SearchInput
48 |           ref={inputRef}
49 |           value={query}
50 |           onChange={(e) => setQuery(e.target.value)}
51 |           placeholder="Search patterns"
52 |         />
53 |         <select
54 |           value={phase}
55 |           onChange={(e) => setPhase(e.target.value)}
56 |           className="p-2 border rounded"
57 |         >
58 |           <option value="">All Phases</option>
59 |           {[...new Set(playbook.patterns.map((p) => p.phase))].map((ph) => (
60 |             <option key={ph} value={ph}>
61 |               {ph}
62 |             </option>
63 |           ))}
64 |         </select>
65 |         <select
66 |           value={sort}
67 |           onChange={(e) => setSort(e.target.value)}
68 |           className="p-2 border rounded"
69 |         >
70 |           <option value="roi">ROI</option>
71 |           <option value="difficulty">Difficulty</option>
72 |         </select>
73 |       </div>
74 |       <div className="grid gap-4 md:grid-cols-2">
75 |         {results.map((p) => (
76 |           <div key={p.id} className="p-4 border rounded">
77 |             <h3 className="font-bold">{p.title}</h3>
78 |             <div className="text-sm">{p.summary}</div>
79 |             <div className="text-xs mt-2 flex gap-2">
80 |               <span className="px-2 py-1 bg-gray-200 rounded">{p.phase}</span>
81 |               <span className="px-2 py-1 bg-gray-200 rounded">
82 |                 {p.difficulty}
83 |               </span>
84 |               <span className="px-2 py-1 bg-gray-200 rounded">ROI {p.roi}</span>
85 |             </div>
86 |           </div>
87 |         ))}
88 |       </div>
89 |     </div>
90 |   );
91 | }
```

src/features/compare/ComparePage.tsx

```
1 | import { useStore } from '../../app/store';
2 |
3 | export default function ComparePage() {
4 |   const playbook = useStore((s) => s.playbook);
5 |   if (!playbook) return <div>Loading...</div>;
6 |   const items = playbook.patterns.slice(0, 3);
7 |   return (
8 |     <table className="w-full text-left border-collapse">
9 |       <thead>
10 |         <tr>
11 |           <th className="border p-2">Title</th>
12 |           <th className="border p-2">Phase</th>
13 |           <th className="border p-2">Difficulty</th>
14 |           <th className="border p-2">ROI</th>
15 |           <th className="border p-2">Best Practices</th>
16 |         </tr>
17 |       </thead>
18 |       <tbody>
19 |         {items.map((p) => (
20 |           <tr key={p.id}>
21 |             <td className="border p-2">{p.title}</td>
22 |             <td className="border p-2">{p.phase}</td>
23 |             <td className="border p-2">{p.difficulty}</td>
24 |             <td className="border p-2">{p.roi}</td>
25 |             <td className="border p-2">{p.bestPractices.join(', ')}</td>
26 |           </tr>
27 |         ))}
28 |       </tbody>
29 |     </table>
30 |   );
31 | }
```
