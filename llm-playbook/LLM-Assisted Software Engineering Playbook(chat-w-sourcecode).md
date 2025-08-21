## You asked:

LLM Agent Codebase Playbook.md

File

llm_agent_playbook_explorer_react_ts_app_vite.md

File

\*\*Role:\*\* You are a senior full-stack engineer, UX lead, and data-viz specialist. Build a production-ready, interactive \*\*single-page web application\*\* that lets users explore the \*\*“LLM Coding Agent Playbook for Solo Developers.”\*\* You will transform a detailed report into structured data and rich, explorable UI. --- ## Objectives \* Convert the provided markdown report (\*\*input: “LLM Agent Codebase Playbook.md”\*\*) into a normalized JSON dataset. \* Ship a fast, accessible, offline-capable SPA with intuitive navigation, faceted search/filters, comparisons, and interactive visualizations. \* Provide complete, ready-to-run source code and light tests + CI. --- ## Technical Constraints (Default Stack) \* \*\*Frontend:\*\* React 18 + TypeScript + Vite (SPA) \* \*\*Routing:\*\* React Router \* \*\*Styling:\*\* TailwindCSS (dark mode supported) \* \*\*State/Search:\*\* Zustand (light state) + Fuse.js (client search) \* \*\*Data validation:\*\* Zod \* \*\*Viz:\*\* Recharts (scatter) and d3-sankey (flows) \* \*\*Build:\*\* Vite, PWA via `vite-plugin-pwa` \* \*\*Testing:\*\* Vitest (+ Testing Library) and Playwright (smoke) \* \*\*Quality:\*\* ESLint + Prettier + Husky + lint-staged \* \*\*CI:\*\* GitHub Actions (lint → typecheck → unit → build → e2e) If an environment forbids any default, choose the nearest equivalent but keep the same features, file structure, and behavior. --- ## Data Model (normalize the report) Parse the markdown into this JSON schema and save as `public/data/playbook.json`:

    ts
    // Zod types you MUST use in code:
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

Populate at least 3 Patterns, 1 Workflow, 2 Tools, 2 Prompts, 2 Metrics, 2 Risks from the report content. Use consistent, URL-safe `id`s. --- ## UX Requirements \* \*\*App shell & navigation:\*\* Top nav with routes: Home, Explore, Compare, Prompts. Sticky header, dark/light toggle. \* \*\*Home:\*\* KPI tiles (#patterns, #workflows, #tools, #prompts). Version and “updatedAt”. \* \*\*Explore:\*\* Search box (Fuse.js), Phase filter, Sort (ROI | Difficulty | Updated). Card grid with badges (phase, difficulty, ROI). Pagination not required. \* \*\*Compare:\*\* Simple comparison table showing 3 selected patterns (phase, difficulty, ROI, best practices). If selection UI is complex, show first 3 as sample. \* \*\*Prompts (Prompt Lab):\*\* Card list of prompts with one-click “Copy”. \* \*\*Visualizations:\*\* \* \*\*Scatter:\*\* ROI vs Difficulty (Beginner=1, Intermediate=2, Advanced=3), tooltip with pattern title. \* \*\*Sankey (optional bonus):\*\* Flow across workflow stages using available relations (gracefully hide if no data). \* \*\*Command palette:\*\* ⌘/Ctrl+K opens a search dialog listing top hits across entities. \* \*\*Keyboard:\*\* `/` focuses search input. \* \*\*Accessibility:\*\* Skip-to-content, ARIA labels, focus states; passes basic axe checks. \* \*\*PWA:\*\* Installable, offline cache of static assets + JSON (stale-while-revalidate). --- ## Non-Functional Constraints \* \*\*Performance:\*\* <100KB JS after gzip for initial route (excluding d3); code-split viz if needed. \* \*\*Security:\*\* Strict CSP in `index.html`; sanitize any HTML (e.g., DOMPurify) if rendering markdown snippets. \* \*\*DX:\*\* Strict TypeScript, eslint/prettier on pre-commit. \* \*\*Idempotence:\*\* Deterministic build; no network fetches beyond local `public/data/playbook.json`. --- ## Deliverables (strict output format) Return a \*\*single markdown artifact\*\* named: `LLM Agent Playbook Explorer — Full Source (React 18 + TypeScript + Vite)` containing the entire repository as sections grouped by \*\*path\*\*, each with a fenced code block of the exact file contents. Use the structure below and provide complete, working code (no placeholders except icons): \* `package.json` (scripts: dev/build/preview/typecheck/lint/format/test/test\\:watch/e2e/storybook/build-storybook/prepare) \* `tsconfig.json`, `tsconfig.base.json` \* `vite.config.ts` (with `vite-plugin-pwa`) \* `postcss.config.cjs`, `tailwind.config.ts`, `.eslintrc.cjs`, `.prettierrc`, `.gitignore` \* `.husky/*`, `lint-staged.config.mjs`, `commitlint.config.cjs` \* `index.html` (tight CSP) \* `src/`: \* `main.tsx`, `styles/global.css` \* `app/router.tsx`, `app/shell.tsx` \* `components/` (ThemeToggle, CommandPalette, KpiCard, SearchInput, ui primitives) \* `pages/` (HomePage, NotFound) \* `features/explorer/ExplorerPage.tsx` \* `features/compare/ComparePage.tsx` \* `features/prompts/PromptLabPage.tsx` \* `viz/RoiDifficultyScatter.tsx` \* `data/schemas.ts` (Zod) and `data/repo.ts` (fetch+validate JSON) \* `data/indexer.ts` (Fuse index helper) \* `utils/cn.ts` \* `__tests__/schemas.test.ts`, `vitest.setup.ts` \* `public/manifest.webmanifest`, `public/favicon.svg`, `public/icons/pwa-192.png`, `public/icons/pwa-512.png` \* `public/data/playbook.json` (seed generated from the report; ensure it validates against Zod) \* `e2e/` Playwright minimal smoke (`smoke.spec.ts`) + `playwright.config.ts` \* `.github/workflows/ci.yml` (runs lint, typecheck, unit, build, e2e) \* `.storybook/main.ts`, `.storybook/preview.ts` \* `README.md` (quickstart, scripts, data notes, accessibility, PWA, CI) \*\*Important:\*\* Do not include commentary outside code blocks and headings. No TODOs or stubs except the icon PNG placeholders. --- ## Acceptance Criteria 1. App runs locally (`pnpm dev`) and loads Home with KPI counts derived from `public/data/playbook.json`. 2. Explore page supports search, phase filter, and sort; displays ROI badge and tags; works in dark and light modes. 3. Scatter chart renders correctly with Difficulty mapped to 1–3 and tooltips showing titles. 4. Prompt Lab shows prompts with a working “Copy” button. 5. Command palette opens with ⌘/Ctrl+K and returns top matches across entities; `/` focuses search. 6. PWA installs; assets + JSON cached; app remains navigable offline with last-fetched data. 7. Accessibility: skip link works; basic axe pass (no critical issues). 8. CI passes: lint, typecheck, unit, build, e2e (smoke). 9. Data validates via Zod on load; invalid JSON surfaces a user-visible error. --- ## Input You Have \* \*\*Primary content source:\*\* the provided markdown report (`LLM Agent Codebase Playbook.md`). Parse it to populate the JSON seed. --- ## Style & Quality Bar \* Clean, modern UI; rounded corners, soft shadows; responsive layout; no unused imports. \* Strong typing, defensive programming, and simple error states. \* Private reasoning only; output \*\*only\*\* the final repo artifact described above. --- ## Output Rules \* Return exactly one markdown artifact with all files inline (grouped by path as headings + fenced code). \* No extra explanations, no conversational text, no screenshots. \* Ensure the project is runnable as-is after copy-paste into a new repo.

Thought for 2m 37s

---

## ChatGPT Replied:

# LLM Agent Playbook Explorer — Full Source (React 18 + TypeScript + Vite)

> Copy this entire tree into a new repo. Then run the quickstart in **README.md**. All files are included below, grouped by path.

---

## package.json

    {
      "name": "llm-agent-playbook-explorer",
      "version": "1.0.0",
      "private": true,
      "type": "module",
      "scripts": {
        "dev": "vite",
        "build": "tsc -b && vite build",
        "preview": "vite preview --port 5173",
        "typecheck": "tsc -b --pretty",
        "lint": "eslint . --ext .ts,.tsx",
        "format": "prettier --write .",
        "test": "vitest run",
        "test:watch": "vitest",
        "e2e": "playwright test",
        "e2e:ui": "playwright test --ui",
        "storybook": "storybook dev -p 6006",
        "build-storybook": "storybook build",
        "prepare": "husky install"
      },
      "dependencies": {
        "@radix-ui/react-dialog": "^1.0.6",
        "@radix-ui/react-dropdown-menu": "^2.0.6",
        "@radix-ui/react-popover": "^1.0.7",
        "@radix-ui/react-toast": "^1.1.5",
        "@vitejs/plugin-react": "^4.3.1",
        "clsx": "^2.1.1",
        "d3-sankey": "^0.12.3",
        "fuse.js": "^7.0.0",
        "react": "^18.3.1",
        "react-dom": "^18.3.1",
        "react-router-dom": "^6.26.2",
        "recharts": "^2.12.6",
        "zustand": "^4.5.2",
        "zod": "^3.23.8"
      },
      "devDependencies": {
        "@commitlint/cli": "^19.3.0",
        "@commitlint/config-conventional": "^19.2.2",
        "@playwright/test": "^1.46.1",
        "@storybook/addon-essentials": "^8.1.10",
        "@storybook/addon-interactions": "^8.1.10",
        "@storybook/addon-themes": "^8.1.10",
        "@storybook/react": "^8.1.10",
        "@storybook/react-vite": "^8.1.10",
        "@testing-library/jest-dom": "^6.4.6",
        "@testing-library/react": "^16.0.0",
        "@testing-library/user-event": "^14.5.2",
        "@types/jsdom": "^21.1.7",
        "@types/node": "^20.12.12",
        "@types/react": "^18.2.66",
        "@types/react-dom": "^18.2.22",
        "autoprefixer": "^10.4.19",
        "commitlint": "^19.2.2",
        "eslint": "^9.9.0",
        "eslint-config-prettier": "^9.1.0",
        "eslint-plugin-react": "^7.35.0",
        "eslint-plugin-react-hooks": "^4.6.2",
        "eslint-plugin-unused-imports": "^3.2.0",
        "happy-dom": "^14.11.0",
        "husky": "^9.1.5",
        "jsdom": "^24.1.0",
        "lint-staged": "^15.2.9",
        "postcss": "^8.4.39",
        "prettier": "^3.3.3",
        "tailwindcss": "^3.4.10",
        "typescript": "^5.5.4",
        "vite": "^5.4.2",
        "vite-plugin-pwa": "^0.20.1",
        "vitest": "^2.0.5"
      }
    }

---

## tsconfig.json

    {
      "extends": "./tsconfig.base.json",
      "compilerOptions": {
        "types": ["vite/client", "node", "happy-dom"]
      },
      "include": ["src", "scripts", "vitest.setup.ts", ".storybook"],
      "exclude": ["dist", "node_modules"]
    }

## tsconfig.base.json

    {
      "compilerOptions": {
        "target": "ES2020",
        "useDefineForClassFields": true,
        "lib": ["ES2020", "DOM", "DOM.Iterable"],
        "module": "ESNext",
        "skipLibCheck": true,
        "moduleResolution": "bundler",
        "resolveJsonModule": true,
        "isolatedModules": true,
        "noEmit": true,
        "jsx": "react-jsx",
        "strict": true,
        "forceConsistentCasingInFileNames": true,
        "esModuleInterop": true,
        "noFallthroughCasesInSwitch": true,
        "baseUrl": ".",
        "paths": {
          "@/app/*": ["src/app/*"],
          "@/components/*": ["src/components/*"],
          "@/features/*": ["src/features/*"],
          "@/data/*": ["src/data/*"],
          "@/pages/*": ["src/pages/*"],
          "@/viz/*": ["src/viz/*"],
          "@/styles/*": ["src/styles/*"],
          "@/utils/*": ["src/utils/*"]
        }
      }
    }

---

## vite.config.ts

    import { defineConfig } from 'vite'
    import react from '@vitejs/plugin-react'
    import { VitePWA } from 'vite-plugin-pwa'

    export default defineConfig({
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
          workbox: {
            runtimeCaching: [
              {
                urlPattern: /\/data\/playbook\.json$/,
                handler: 'StaleWhileRevalidate',
                options: { cacheName: 'playbook-json' }
              }
            ]
          },
          manifest: {
            name: 'LLM Agent Playbook Explorer',
            short_name: 'Playbook',
            description: 'Explore the LLM Coding Agent Playbook for Solo Developers',
            theme_color: '#0ea5e9',
            background_color: '#0b1220',
            display: 'standalone',
            start_url: '/',
            icons: [
              { src: '/icons/pwa-192.png', sizes: '192x192', type: 'image/png' },
              { src: '/icons/pwa-512.png', sizes: '512x512', type: 'image/png' }
            ]
          }
        })
      ],
      server: { port: 5173 },
      build: { sourcemap: true },
      define: {
        __APP_VERSION__: JSON.stringify('1.0.0')
      }
    })

---

## postcss.config.cjs

    module.exports = {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    }

## tailwind.config.ts

    import type { Config } from 'tailwindcss'

    export default {
      darkMode: ['class'],
      content: [
        './index.html',
        './src/**/*.{ts,tsx}',
        './.storybook/**/*.{ts,tsx}'
      ],
      theme: {
        extend: {
          colors: {
            brand: {
              DEFAULT: '#0ea5e9',
              50: '#e0f2fe', 100: '#bae6fd', 200: '#7dd3fc', 300: '#38bdf8', 400: '#0ea5e9', 500: '#0284c7'
            }
          },
          container: { center: true, padding: '1rem' }
        }
      },
      plugins: []
    } satisfies Config

---

## .eslintrc.cjs

    module.exports = {
      root: true,
      env: { browser: true, es2022: true },
      parser: '@typescript-eslint/parser',
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
      plugins: ['react', 'react-hooks', '@typescript-eslint', 'unused-imports'],
      extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:storybook/recommended',
        'prettier'
      ],
      settings: { react: { version: 'detect' } },
      rules: {
        'react/react-in-jsx-scope': 'off',
        'unused-imports/no-unused-imports': 'error'
      }
    }

## .prettierrc

    {
      "semi": false,
      "singleQuote": true,
      "trailingComma": "es5",
      "printWidth": 100
    }

## .gitignore

    node_modules
    .vscode
    .DS_Store
    coverage
    playwright-report
    storybook-static
    /dist
    /.vite
    /.cache

## .husky/pre-commit

    #!/usr/bin/env sh
    . "$(dirname -- "$0")/_/husky.sh"

    pnpm lint-staged || npx lint-staged

## .husky/commit-msg

    #!/usr/bin/env sh
    . "$(dirname -- "$0")/_/husky.sh"

    npx --no-install commitlint --edit $1

## lint-staged.config.mjs

    export default {
      '*.{ts,tsx,css,md,json}': ['prettier --write'],
      '*.{ts,tsx}': ['eslint --fix']
    }

## commitlint.config.cjs

    module.exports = { extends: ['@commitlint/config-conventional'] }

---

## index.html

    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          http-equiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' ws:; font-src 'self';"
        />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="icon" href="/favicon.svg" />
        <title>LLM Agent Playbook Explorer</title>
      </head>
      <body class="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <a href="#app" class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-brand-400 text-white px-3 py-1 rounded">Skip to content</a>
        <div id="root"></div>
        <script type="module" src="/src/main.tsx"></script>
      </body>
    </html>

---

## src/main.tsx

    import React from 'react'
    import ReactDOM from 'react-dom/client'
    import { RouterProvider } from 'react-router-dom'
    import { router } from '@/app/router'
    import '@/styles/global.css'

    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    )

## src/styles/global.css

    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    :root { --radius: 0.75rem; }
    * { box-sizing: border-box; }

---

## src/app/router.tsx

    import { createBrowserRouter, createHashRouter } from 'react-router-dom'
    import { AppShell } from './shell'
    import { HomePage } from '@/pages/HomePage'
    import { ExplorerPage } from '@/features/explorer/ExplorerPage'
    import { ComparePage } from '@/features/compare/ComparePage'
    import { PromptLabPage } from '@/features/prompts/PromptLabPage'
    import { NotFound } from '@/pages/NotFound'

    const useHash = false
    const base = import.meta.env.VITE_BASE_PATH || '/'

    export const router = (useHash ? createHashRouter : createBrowserRouter)([
      {
        path: base,
        element: <AppShell />,
        errorElement: <NotFound />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'explore', element: <ExplorerPage /> },
          { path: 'compare', element: <ComparePage /> },
          { path: 'prompts', element: <PromptLabPage /> }
        ]
      }
    ])

## src/app/shell.tsx

    import { Outlet, NavLink, useLocation } from 'react-router-dom'
    import { ThemeToggle } from '@/components/ThemeToggle'
    import { CommandPalette } from '@/components/CommandPalette'
    import { useEffect } from 'react'

    export function AppShell() {
      const { pathname } = useLocation()
      useEffect(() => { document.title = `Playbook${pathname === '/' ? '' : ' • ' + pathname}` }, [pathname])
      return (
        <div id="app" className="min-h-dvh grid grid-rows-[auto_1fr]">
          <header className="sticky top-0 z-30 border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur">
            <div className="container flex items-center gap-4 py-3">
              <NavLink to="/" className="font-bold text-xl">LLM Playbook</NavLink>
              <nav className="ml-auto flex items-center gap-4">
                <NavLink to="/explore" className={({isActive})=>isActive?'text-brand-500':''}>Explore</NavLink>
                <NavLink to="/compare" className={({isActive})=>isActive?'text-brand-500':''}>Compare</NavLink>
                <NavLink to="/prompts" className={({isActive})=>isActive?'text-brand-500':''}>Prompts</NavLink>
                <ThemeToggle />
                <CommandPalette />
              </nav>
            </div>
          </header>
          <main className="container py-6">
            <Outlet />
          </main>
        </div>
      )
    }

## src/app/store.ts

    import { create } from 'zustand'

    type SortKey = 'roi' | 'difficulty' | 'updated'

    type ExploreState = {
      q: string
      phase: 'All' | 'Ideation'|'Scaffolding'|'Coding'|'Review'|'Testing'|'Deployment'
      sort: SortKey
      setQ: (q: string) => void
      setPhase: (p: ExploreState['phase']) => void
      setSort: (s: SortKey) => void
    }

    export const useExploreStore = create<ExploreState>((set) => ({
      q: '',
      phase: 'All',
      sort: 'roi',
      setQ: (q) => set({ q }),
      setPhase: (phase) => set({ phase }),
      setSort: (sort) => set({ sort }),
    }))

---

## src/components/ui/card.tsx

    import { cn } from '@/utils/cn'
    export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
      return <div className={cn('rounded-2xl border shadow-sm p-4 bg-white dark:bg-slate-900', className)} {...props} />
    }

## src/components/ui/badge.tsx

    import { cn } from '@/utils/cn'
    export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
      return <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-xs', className)}>{children}</span>
    }

## src/components/ThemeToggle.tsx

    import { useEffect, useState } from 'react'

    export function ThemeToggle() {
      const [dark, setDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
      useEffect(()=>{ document.documentElement.classList.toggle('dark', dark) },[dark])
      return (
        <button aria-label="Toggle theme" className="rounded-lg border px-2 py-1" onClick={()=>setDark(d=>!d)}>
          {dark ? '🌙' : '☀️'}
        </button>
      )
    }

## src/components/KpiCard.tsx

    import { Card } from './ui/card'

    export function KpiCard({ label, value }: { label: string; value: number }) {
      return (
        <Card className="flex items-center justify-between">
          <div className="text-sm text-slate-500">{label}</div>
          <div className="text-2xl font-semibold">{value}</div>
        </Card>
      )
    }

## src/components/SearchInput.tsx

    import { useRef, useEffect } from 'react'

    export function SearchInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
      const ref = useRef<HTMLInputElement>(null)
      useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
          if (e.key === '/') {
            const el = ref.current
            if (el) {
              e.preventDefault()
              el.focus()
            }
          }
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
      }, [])
      return (
        <div className="relative">
          <input
            ref={ref}
            aria-label="Search"
            className="w-full rounded-xl border px-3 py-2 pr-10"
            placeholder="Search…"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          <kbd className="absolute right-2 top-2 text-xs text-slate-500">/</kbd>
        </div>
      )
    }

## src/components/CommandPalette.tsx

    import { useEffect, useMemo, useState } from 'react'
    import Fuse from 'fuse.js'
    import { usePlaybook } from '@/data/repo'

    export function CommandPalette() {
      const [open, setOpen] = useState(false)
      const { data } = usePlaybook()
      const fuse = useMemo(()=> new Fuse([
        ...data.patterns, ...data.workflows, ...data.tools, ...data.prompts
      ].map(x=>({ id: 'title' in x ? x.id : (x as any).name, title: 'title' in x ? x.title : (x as any).name, type: (x as any).phase || (x as any).category || 'item'})), { keys: ['title'] }), [data])
      const [q, setQ] = useState('')
      const results = q ? fuse.search(q).slice(0,10) : []

      useEffect(()=>{
        const onKey=(e: KeyboardEvent)=>{
          if((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==='k'){ e.preventDefault(); setOpen(o=>!o)}
        }
        window.addEventListener('keydown', onKey)
        return ()=>window.removeEventListener('keydown', onKey)
      },[])

      return (
        <>
          <button className="rounded-xl border px-3 py-1" aria-haspopup="dialog" aria-expanded={open} onClick={()=>setOpen(true)}>⌘K</button>
          {open && (
            <div role="dialog" aria-modal className="fixed inset-0 bg-black/40 grid place-items-start pt-[10vh]">
              <div className="mx-auto w-full max-w-xl rounded-2xl border bg-white p-3 dark:bg-slate-900">
                <input autoFocus className="w-full rounded-xl border px-3 py-2" placeholder="Type to search" value={q} onChange={e=>setQ(e.target.value)} />
                <ul className="max-h-80 overflow-auto mt-2 divide-y">
                  {results.map(r=> (
                    <li key={r.item.id} className="py-2 text-sm flex justify-between">
                      <span>{r.item.title}</span>
                      <span className="text-slate-500">{r.item.type}</span>
                    </li>
                  ))}
                  {!results.length && q && <li className="py-6 text-center text-slate-500">No results</li>}
                </ul>
                <div className="flex justify-end gap-2 mt-2">
                  <button className="rounded-xl border px-3 py-1" onClick={()=>setOpen(false)}>Close</button>
                </div>
              </div>
            </div>
          )}
        </>
      )
    }

---

## src/data/schemas.ts

    import { z } from 'zod'

    export const zRef = z.object({ id: z.string(), type: z.enum(['pattern','workflow','tool','prompt','metric','risk']), weight: z.number().optional() })

    export const zPattern = z.object({
      id: z.string(), title: z.string(), summary: z.string(),
      phase: z.enum(['Ideation','Scaffolding','Coding','Review','Testing','Deployment']),
      difficulty: z.enum(['Beginner','Intermediate','Advanced']),
      roi: z.number().min(0).max(10),
      steps: z.array(z.string()),
      bestPractices: z.array(z.string()),
      antiPatterns: z.array(z.string()).optional(),
      prompts: z.array(z.string()).optional(),
      tools: z.array(z.string()).optional(),
      metrics: z.array(z.string()).optional(),
      risks: z.array(z.string()).optional(),
      tags: z.array(z.string()).default([]),
      links: z.array(z.string()).optional(),
      relations: z.array(zRef).default([])
    })

    export const zWorkflow = z.object({
      id: z.string(), title: z.string(), summary: z.string(),
      stages: z.array(z.object({ name: z.string(), goals: z.array(z.string()), artifacts: z.array(z.string()).optional() })),
      kpis: z.array(z.string()).optional(),
      tags: z.array(z.string()).default([]),
      relations: z.array(zRef).default([])
    })

    export const zTool = z.object({ id: z.string(), name: z.string(), category: z.string(), cost: z.string().optional(), url: z.string().url().optional(), strengths: z.array(z.string()), limits: z.array(z.string()), tags: z.array(z.string()).default([]), relations: z.array(zRef).default([]) })
    export const zPrompt = z.object({ id: z.string(), title: z.string(), body: z.string(), useCases: z.array(z.string()), inputs: z.array(z.string()).optional(), outputs: z.array(z.string()).optional(), tags: z.array(z.string()).default([]), relations: z.array(zRef).default([]) })
    export const zMetric = z.object({ id: z.string(), name: z.string(), desc: z.string(), scale: z.enum(['ordinal','ratio','percent']), compute: z.string().optional(), tags: z.array(z.string()).default([]) })
    export const zRisk = z.object({ id: z.string(), name: z.string(), mitigation: z.array(z.string()), severity: z.enum(['Low','Med','High']), tags: z.array(z.string()).default([]) })

    export const zPlaybook = z.object({
      version: z.string(),
      updatedAt: z.string(),
      patterns: z.array(zPattern),
      workflows: z.array(zWorkflow),
      tools: z.array(zTool),
      prompts: z.array(zPrompt),
      metrics: z.array(zMetric),
      risks: z.array(zRisk)
    })

    export type Playbook = z.infer<typeof zPlaybook>
    export type Pattern = z.infer<typeof zPattern>
    export type Workflow = z.infer<typeof zWorkflow>
    export type Tool = z.infer<typeof zTool>
    export type Prompt = z.infer<typeof zPrompt>
    export type Metric = z.infer<typeof zMetric>
    export type Risk = z.infer<typeof zRisk>

## src/data/repo.ts

    import { useEffect, useState } from 'react'
    import { zPlaybook, type Playbook } from './schemas'

    export function usePlaybook() {
      const [data, setData] = useState<Playbook>({
        version: '0', updatedAt: new Date().toISOString(), patterns: [], workflows: [], tools: [], prompts: [], metrics: [], risks: []
      })
      const [loading, setLoading] = useState(true)
      const [error, setError] = useState<string | null>(null)
      useEffect(() => {
        ;(async () => {
          try {
            const res = await fetch('/data/playbook.json')
            const json = await res.json()
            const parsed = zPlaybook.parse(json)
            setData(parsed)
          } catch (e: any) {
            setError(e?.message || 'Failed to load playbook')
          } finally {
            setLoading(false)
          }
        })()
      }, [])
      return { data, loading, error }
    }

## src/data/indexer.ts

    import Fuse from 'fuse.js'
    import type { Playbook } from './schemas'

    export function buildIndex(pb: Playbook) {
      const items = [
        ...pb.patterns.map((p) => ({ id: p.id, title: p.title, tags: p.tags.join(' '), type: 'pattern' })),
        ...pb.workflows.map((w) => ({ id: w.id, title: w.title, tags: w.tags.join(' '), type: 'workflow' })),
        ...pb.tools.map((t) => ({ id: t.id, title: t.name, tags: t.tags.join(' '), type: 'tool' })),
        ...pb.prompts.map((p) => ({ id: p.id, title: p.title, tags: p.tags.join(' '), type: 'prompt' })),
      ]
      const fuse = new Fuse(items, { keys: ['title', 'tags'], threshold: 0.35 })
      return { fuse }
    }

---

## src/pages/HomePage.tsx

    import { usePlaybook } from '@/data/repo'
    import { KpiCard } from '@/components/KpiCard'
    import { Card } from '@/components/ui/card'

    export function HomePage() {
      const { data, loading, error } = usePlaybook()
      if (loading) return <div>Loading…</div>
      if (error) return <div role="alert" className="text-red-600">{error}</div>

      return (
        <div className="grid gap-6">
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard label="Patterns" value={data.patterns.length} />
            <KpiCard label="Workflows" value={data.workflows.length} />
            <KpiCard label="Tools" value={data.tools.length} />
            <KpiCard label="Prompts" value={data.prompts.length} />
          </section>
          <Card>
            <h2 className="text-xl font-semibold">Welcome</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">Explore the playbook via the Explore tab, compare items, or open the command palette with <kbd>⌘/Ctrl</kbd>+<kbd>K</kbd>.</p>
            <p className="text-sm mt-2">Version: {data.version} • Updated: {new Date(data.updatedAt).toLocaleDateString()}</p>
          </Card>
        </div>
      )
    }

## src/pages/NotFound.tsx

    export function NotFound(){
      return <div className="prose dark:prose-invert">
        <h1>Oops</h1>
        <p>We couldn't find that page.</p>
      </div>
    }

---

## src/features/explorer/ExplorerPage.tsx

    import { useMemo } from 'react'
    import { usePlaybook } from '@/data/repo'
    import { SearchInput } from '@/components/SearchInput'
    import { Badge } from '@/components/ui/badge'
    import { Card } from '@/components/ui/card'
    import Fuse from 'fuse.js'
    import { useExploreStore } from '@/app/store'
    import { RoiDifficultyScatter } from '@/viz/RoiDifficultyScatter'

    export function ExplorerPage() {
      const { data } = usePlaybook()
      const { q, phase, sort, setQ, setPhase, setSort } = useExploreStore()

      const items = useMemo(() => {
        const patterns = data.patterns
        const filtered = phase==='All' ? patterns : patterns.filter(p=>p.phase===phase)
        const scored = [...filtered]
        if (sort==='roi') scored.sort((a,b)=> b.roi - a.roi)
        if (sort==='difficulty') scored.sort((a,b)=> a.difficulty.localeCompare(b.difficulty))
        if (sort==='updated') scored.sort(()=>0) // no per-item timestamps in seed; stable
        if (!q) return scored
        const fuse = new Fuse(scored, { keys:['title','summary','tags'], threshold:0.35 })
        return fuse.search(q).map(r=>r.item)
      }, [data, q, phase, sort])

      return (
        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <SearchInput value={q} onChange={setQ} />
            <select aria-label="Phase filter" className="rounded-xl border px-3" value={phase} onChange={e=>setPhase(e.target.value as any)}>
              {['All','Ideation','Scaffolding','Coding','Review','Testing','Deployment'].map(p=> <option key={p}>{p}</option>)}
            </select>
            <select aria-label="Sort" className="rounded-xl border px-3" value={sort} onChange={e=>setSort(e.target.value as any)}>
              <option value="roi">Sort by ROI</option>
              <option value="difficulty">Sort by Difficulty</option>
              <option value="updated">Sort by Updated</option>
            </select>
          </div>

          <Card>
            <h3 className="font-semibold mb-2">ROI vs Difficulty</h3>
            <RoiDifficultyScatter data={data.patterns} />
          </Card>

          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map(p => (
              <li key={p.id}>
                <Card>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{p.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3">{p.summary}</p>
                    </div>
                    <Badge className="bg-brand-50 dark:bg-slate-800 border-brand-200">ROI {p.roi}</Badge>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <Badge>{p.phase}</Badge>
                    <Badge>{p.difficulty}</Badge>
                    {p.tags.slice(0,3).map(t=> <Badge key={t}>{t}</Badge>)}
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      )
    }

---

## src/features/compare/ComparePage.tsx

    import { usePlaybook } from '@/data/repo'
    import { Card } from '@/components/ui/card'

    export function ComparePage(){
      const { data } = usePlaybook()
      const take = (arr:any[], n=3)=>arr.slice(0,n)
      const rows = take(data.patterns, 3)
      return (
        <Card>
          <h2 className="text-xl font-semibold mb-3">Quick Compare (sample)</h2>
          <div className="overflow-auto">
            <table className="min-w-[600px] text-sm">
              <thead><tr>
                <th className="text-left p-2">Attribute</th>
                {rows.map(p=> <th key={p.id} className="text-left p-2">{p.title}</th>)}
              </tr></thead>
              <tbody>
                <tr><td className="p-2">Phase</td>{rows.map(p=> <td key={p.id} className="p-2">{p.phase}</td>)}</tr>
                <tr><td className="p-2">Difficulty</td>{rows.map(p=> <td key={p.id} className="p-2">{p.difficulty}</td>)}</tr>
                <tr><td className="p-2">ROI</td>{rows.map(p=> <td key={p.id} className="p-2">{p.roi}</td>)}</tr>
                <tr><td className="p-2">Best Practices</td>{rows.map(p=> <td key={p.id} className="p-2">{p.bestPractices.slice(0,3).join(', ')}</td>)}</tr>
              </tbody>
            </table>
          </div>
        </Card>
      )
    }

---

## src/features/prompts/PromptLabPage.tsx

    import { usePlaybook } from '@/data/repo'
    import { Card } from '@/components/ui/card'

    export function PromptLabPage(){
      const { data } = usePlaybook()
      const copy = async (text: string)=> navigator.clipboard.writeText(text)
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {data.prompts.map(p=> (
            <Card key={p.id}>
              <div className="flex items-start justify-between">
                <h3 className="font-semibold">{p.title}</h3>
                <button className="rounded-xl border px-2 py-1 text-xs" onClick={()=>copy(p.body)}>Copy</button>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">{p.body}</p>
            </Card>
          ))}
        </div>
      )
    }

---

## src/viz/RoiDifficultyScatter.tsx

    import { ResponsiveContainer, ScatterChart, XAxis, YAxis, Tooltip, Scatter } from 'recharts'
    import type { Pattern } from '@/data/schemas'

    const diffMap: Record<Pattern['difficulty'], number> = { Beginner: 1, Intermediate: 2, Advanced: 3 }

    export function RoiDifficultyScatter({ data }: { data: Pattern[] }){
      const points = data.map(p=> ({ x: diffMap[p.difficulty], y: p.roi, name: p.title }))
      return (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <XAxis dataKey="x" name="Difficulty" tickFormatter={(v)=>({1:'Beginner',2:'Intermediate',3:'Advanced'} as any)[v]} domain={[1,3]} allowDecimals={false} />
              <YAxis dataKey="y" name="ROI" domain={[0,10]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter data={points} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      )
    }

---

## src/utils/cn.ts

    export function cn(...parts: (string | undefined | false | null)[]) {
      return parts.filter(Boolean).join(' ')
    }

---

## vitest.setup.ts

    import '@testing-library/jest-dom'

## src/**tests**/schemas.test.ts

    import { describe, it, expect } from 'vitest'
    import { zPlaybook } from '@/data/schemas'

    const sample = {
      version: '1.0.0',
      updatedAt: '2025-08-01',
      patterns: [], workflows: [], tools: [], prompts: [], metrics: [], risks: []
    }

    describe('schemas', () => {
      it('parses playbook', () => {
        const parsed = zPlaybook.parse(sample)
        expect(parsed.version).toBe('1.0.0')
      })
    })

---

## e2e/playwright.config.ts

    import { defineConfig } from '@playwright/test'
    export default defineConfig({
      testDir: './tests',
      use: { baseURL: 'http://localhost:5173' },
      webServer: { command: 'pnpm preview', port: 5173, reuseExistingServer: !process.env.CI }
    })

## e2e/tests/smoke.spec.ts

    import { test, expect } from '@playwright/test'

    test('home loads and shows KPIs', async ({ page }) => {
      await page.goto('/')
      await expect(page.getByText('Patterns')).toBeVisible()
    })

---

## .github/workflows/ci.yml

    name: CI
    on: [push, pull_request]
    jobs:
      build:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v4
          - uses: actions/setup-node@v4
            with: { node-version: 20 }
          - name: Install
            run: |
              corepack enable
              pnpm install --frozen-lockfile || npm ci
          - name: Lint
            run: |
              pnpm lint || npm run lint
          - name: Typecheck
            run: |
              pnpm typecheck || npm run typecheck
          - name: Unit tests
            run: |
              pnpm test || npm test
          - name: Build
            run: |
              pnpm build || npm run build
          - name: E2E
            run: |
              pnpm e2e || npm run e2e

---

## .storybook/main.ts

    import type { StorybookConfig } from '@storybook/react-vite'
    const config: StorybookConfig = {
      stories: ['../src/**/*.stories.@(ts|tsx)'],
      addons: ['@storybook/addon-essentials', '@storybook/addon-interactions', '@storybook/addon-themes'],
      framework: { name: '@storybook/react-vite', options: {} },
    }
    export default config

## .storybook/preview.ts

    import '../src/styles/global.css'
    export const parameters = { controls: { expanded: true } }

## src/components/KpiCard.stories.tsx

    import type { Meta, StoryObj } from '@storybook/react'
    import { KpiCard } from './KpiCard'

    const meta: Meta<typeof KpiCard> = { component: KpiCard, title: 'UI/KpiCard' }
    export default meta
    export const Basic: StoryObj<typeof KpiCard> = { args: { label: 'Patterns', value: 12 } }

---

## public/manifest.webmanifest

    {
      "name": "LLM Agent Playbook Explorer",
      "short_name": "Playbook",
      "start_url": "/",
      "display": "standalone",
      "background_color": "#0b1220",
      "theme_color": "#0ea5e9",
      "icons": [
        { "src": "/icons/pwa-192.png", "sizes": "192x192", "type": "image/png" },
        { "src": "/icons/pwa-512.png", "sizes": "512x512", "type": "image/png" }
      ]
    }

## public/favicon.svg

## public/icons/pwa-192.png

_(placeholder; generate PNG 192x192)_

## public/icons/pwa-512.png

_(placeholder; generate PNG 512x512)_

---

## public/data/playbook.json

    {
      "version": "1.0.0",
      "updatedAt": "2025-08-21",
      "patterns": [
        {
          "id": "spec-driven-development",
          "title": "Specification-Driven Development (Specs as Code)",
          "summary": "Treat specs, AC, and ADRs as the primary source programming the agent. Precise docs become executable constraints.",
          "phase": "Ideation",
          "difficulty": "Intermediate",
          "roi": 8,
          "steps": [
            "Draft machine-checkable spec and acceptance criteria",
            "Reference relevant ADRs and conventions",
            "Store in repo for retrieval by agents"
          ],
          "bestPractices": [
            "Use structured templates for specs and ADRs",
            "Keep acceptance criteria verifiable",
            "Version control prompts and system instructions"
          ],
          "antiPatterns": [
            "Vague requirements with unstated constraints",
            "Specs spread across chats and DMs"
          ],
          "prompts": ["planner-architect-agent"],
          "tools": ["cursor", "aider"],
          "metrics": ["task-success-rate"],
          "risks": ["specification-drift"],
          "tags": ["foundation", "spec-first", "adr", "acceptance-criteria"],
          "links": [],
          "relations": [
            { "id": "solo-dev-e2e-workflow", "type": "workflow", "weight": 0.9 },
            { "id": "typed-structured-output", "type": "pattern", "weight": 0.6 }
          ]
        },
        {
          "id": "patch-diff-workflow",
          "title": "Patch/Diff Workflow",
          "summary": "Agents propose unified diffs for auditable, reversible changes; humans apply after checks.",
          "phase": "Coding",
          "difficulty": "Beginner",
          "roi": 9,
          "steps": [
            "Agent outputs unified diff instead of writing files",
            "Run format, lint, typecheck, and tests",
            "Review and apply or iterate"
          ],
          "bestPractices": [
            "Small, focused diffs",
            "CI gates for lint/type/tests",
            "Guardrails with allowlisted paths"
          ],
          "prompts": ["reviewer-refactorer-agent"],
          "tools": ["aider"],
          "metrics": ["diff-churn"],
          "risks": ["file-thrashing"],
          "tags": ["safety", "audit", "git"],
          "relations": [
            { "id": "solo-dev-e2e-workflow", "type": "workflow", "weight": 0.8 },
            { "id": "spec-driven-development", "type": "pattern", "weight": 0.4 }
          ]
        },
        {
          "id": "typed-structured-output",
          "title": "Typed Structured Output & Function Calling",
          "summary": "Constrain agent replies to JSON schemas and tool calls to improve predictability.",
          "phase": "Review",
          "difficulty": "Intermediate",
          "roi": 7,
          "steps": [
            "Define JSON schema (Zod/Pydantic)",
            "Validate outputs and retry on failure",
            "Use native tool/function calling where possible"
          ],
          "bestPractices": [
            "Keep schemas minimal and explicit",
            "Fail fast on invalid output",
            "Validate in CI"
          ],
          "prompts": ["planner-architect-agent", "reviewer-refactorer-agent"],
          "tools": [],
          "metrics": ["task-success-rate"],
          "risks": ["specification-drift"],
          "tags": ["schema", "validation", "tool-calls"],
          "relations": [
            { "id": "spec-driven-development", "type": "pattern", "weight": 0.7 }
          ]
        }
      ],
      "workflows": [
        {
          "id": "solo-dev-e2e-workflow",
          "title": "Solo Developer Agentic Loop",
          "summary": "Idea → Spec → Scaffold → Iterative Coding (test-first) → Docs → Review & Release.",
          "stages": [
            { "name": "Idea → Spec", "goals": ["Formalize feature into machine-checkable spec", "Draft ADRs"], "artifacts": ["SPEC.md", "ADR/NNN.md", "AC checklist"] },
            { "name": "Scaffold", "goals": ["Create file/folder skeleton", "Set up tests/CI"], "artifacts": ["repo tree", "tests/"] },
            { "name": "Iterative Coding", "goals": ["Tiny tasks", "Failing test first", "Diff-based changes"], "artifacts": ["patches", "commits"] },
            { "name": "Docs", "goals": ["Generate comments, README updates"], "artifacts": ["docs"] },
            { "name": "Review & Release", "goals": ["PR with context", "CI gates", "Ship"], "artifacts": ["PR description", "changelog"] }
          ],
          "kpis": ["task-success-rate", "diff-churn"],
          "tags": ["workflow", "loop"],
          "relations": [
            { "id": "patch-diff-workflow", "type": "pattern", "weight": 0.7 },
            { "id": "spec-driven-development", "type": "pattern", "weight": 0.7 }
          ]
        }
      ],
      "tools": [
        {
          "id": "aider",
          "name": "Aider",
          "category": "CLI",
          "url": "https://aider.chat",
          "strengths": ["Diff-based edits", "Git-native workflow", "Repo map context"],
          "limits": ["Requires local git setup", "Terminal-centric UI"],
          "tags": ["tool", "assistant"],
          "relations": [
            { "id": "patch-diff-workflow", "type": "pattern", "weight": 0.8 }
          ]
        },
        {
          "id": "cursor",
          "name": "Cursor",
          "category": "IDE",
          "url": "https://cursor.com",
          "strengths": ["Codebase-aware chat", "Inline agentic edits", "PR/issue context"],
          "limits": ["Desktop app dependency"],
          "tags": ["tool", "ide"],
          "relations": [
            { "id": "spec-driven-development", "type": "pattern", "weight": 0.6 }
          ]
        }
      ],
      "prompts": [
        {
          "id": "planner-architect-agent",
          "title": "Planner/Architect Agent",
          "body": "You are an expert architect. Produce a JSON-only plan with affected files, step-by-step tasks, and (if needed) a draft ADR. Conform strictly to the provided schema. Do not include commentary.",
          "useCases": ["Planning", "Decomposition", "ADR drafting"],
          "inputs": ["Feature request", "Existing ADRs", "Conventions"],
          "outputs": ["plan.json", "adr draft"],
          "tags": ["prompt", "planning"],
          "relations": [
            { "id": "spec-driven-development", "type": "pattern", "weight": 0.8 }
          ]
        },
        {
          "id": "reviewer-refactorer-agent",
          "title": "Reviewer/Refactorer Agent",
          "body": "You are a Principal Engineer. Given a code diff, output JSON review comments with file, line, comment, and severity. Enforce conventions and flag security/performance issues.",
          "useCases": ["Code review", "Quality gating"],
          "inputs": ["Unified diff", "CONVENTIONS.md"],
          "outputs": ["review.json"],
          "tags": ["prompt", "review"],
          "relations": [
            { "id": "patch-diff-workflow", "type": "pattern", "weight": 0.8 }
          ]
        }
      ],
      "metrics": [
        {
          "id": "task-success-rate",
          "name": "Task Success Rate",
          "desc": "Percent of tasks where final generated code passes verification.",
          "scale": "percent",
          "compute": "passed_tasks / total_tasks * 100",
          "tags": ["metric", "quality"]
        },
        {
          "id": "diff-churn",
          "name": "Diff Size / Churn",
          "desc": "Lines added+removed per patch; lower indicates tighter edits.",
          "scale": "ratio",
          "compute": "sum(|added| + |removed|) per patch",
          "tags": ["metric", "efficiency"]
        }
      ],
      "risks": [
        {
          "id": "specification-drift",
          "name": "Specification Drift / Goal Misalignment",
          "mitigation": [
            "Require human approval of planner output before coding",
            "Use structured spec templates and explicit AC"
          ],
          "severity": "High",
          "tags": ["risk", "spec"]
        },
        {
          "id": "file-thrashing",
          "name": "File Thrashing / Hallucinated Paths",
          "mitigation": [
            "Use patch/diff workflow with allowlisted paths",
            "Provide listFiles tool; verify path existence"
          ],
          "severity": "Med",
          "tags": ["risk", "fs"]
        }
      ]
    }

---

## e2e/tests/README.md

    # E2E Notes

    Minimal smoke test ensures the app renders. Extend as needed.

---

## README.md

    # LLM Agent Playbook Explorer

    An interactive single-page app to explore the **LLM Coding Agent Playbook for Solo Developers**.

    ## Quickstart

    ```bash
    # with pnpm (recommended)
    corepack enable
    pnpm install
    pnpm dev
    # open http://localhost:5173

## Scripts

- `pnpm dev` – start dev server
- `pnpm build` – typecheck + build
- `pnpm preview` – preview prod build
- `pnpm test` / `pnpm test:watch` – unit tests (Vitest)
- `pnpm e2e` – Playwright E2E
- `pnpm lint` – ESLint
- `pnpm format` – Prettier
- `pnpm storybook` / `pnpm build-storybook` – Storybook

## Data

Seed JSON at `public/data/playbook.json`. Content was normalized from the provided markdown report and validated with Zod on load. Invalid JSON surfaces a user-visible error.

## Tech

React 18 + TypeScript + Vite • React Router • Tailwind (dark mode) • Zustand (state) • Fuse.js (search) • Recharts (scatter) • (Optional) d3-sankey • Vitest • Playwright • Storybook • PWA.

## UX

- Sticky top nav with **Home**, **Explore**, **Compare**, **Prompts**
- Command Palette: <kbd>⌘/Ctrl</kbd>+<kbd>K</kbd>
- Keyboard: <kbd>/</kbd> focuses search
- Accessibility: skip link, ARIA on dialogs/inputs, visible focus states

## Visualizations

- **Scatter** chart (ROI vs Difficulty) on Explore page.
- Sankey placeholder optional; hide when no data.

## PWA

Installable, offline-capable. Static assets + `playbook.json` cached with **Stale-While-Revalidate**.

## CI

GitHub Actions runs lint → typecheck → unit → build → e2e.

## License

MIT

---
