# LLM-Assisted SE Playbook Explorer

## Quickstart

```bash
npm install
npm run dev
```

## Scripts

- `dev` - start dev server
- `build` - production build
- `preview` - preview build
- `lint` - lint
- `typecheck` - TypeScript check
- `test` - unit tests
- `e2e` - Playwright tests
- `data` - rebuild dataset from markdown

## Data

Playbook content in `llm-playbook/*.md` is converted into `public/data/playbook.json` by running:

```bash
npm run data
```

The resulting JSON is validated at runtime.

## Accessibility

- Skip link
- Keyboard shortcuts: `/` focuses search, `Ctrl/Cmd+K` opens command palette.

## PWA

App is installable and caches data for offline use.

## CI

GitHub Actions runs lint, typecheck, tests, build, and e2e.
