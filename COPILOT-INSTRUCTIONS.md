## GitHub Copilot Project Instructions

This file keeps AI assistants in sync with the actual project structure and conventions. Update it whenever scripts, directories, or generation flows change.

### Core Purpose

Luma Docs is a React 19 + MDX + Vite React SSG documentation platform featuring:

- Automatic route + version metadata generation
- Versioned content (current in `content/pages/`, archived in `content/versions/<label>/`)
- Search index generation (version aware)
- Sitemap generation (base-path aware)
- Unified base path resolver for root vs subfolder deployments (GitHub Pages friendly)

### High-Level Build Pipeline

Implemented in `src/tools/run-build-pipeline.mjs` and invoked by:

- `npm run pipeline:dev` (used inside `npm run dev`)
- `npm run pipeline:build` (used inside `npm run build`)

Ordered steps:

1. Versions (`generate:versions`) -> `src/generated-versions.ts`
2. Routes (`generate:routes`) -> `src/generated-routes.tsx` + `src/generated-routes.meta.ts`
3. CSS (`build:css`) -> `src/public/index.css`
4. Search (`generate:search-index`) -> `src/generated-search-index.ts`
5. Sitemap (`generate:sitemap`) -> `src/public/sitemap.xml`
6. Vite React SSG build / dev startup

### Key Generated Artifacts

- `src/generated-versions.ts` – list of archived versions
- `src/generated-routes.tsx` – static route definitions with version info
- `src/generated-routes.meta.ts` – flattened meta/frontmatter export
- `src/generated-search-index.ts` – in-memory search index (JSON-like export)

### Important Source Directories

- `content/pages/` – current docs (label = `config.versions.current`)
- `content/versions/<label>/` – archived snapshots
- `src/components/` – UI + MDX components (`SEO.tsx`, `Sidebar.tsx`, etc.)
- `src/utils/` – runtime utilities (base path helpers, search helpers)
- `src/tools/` – build/generation scripts (all npm scripts reference this path)

### Base Path Resolution

File: `src/tools/resolve-base-path.mjs`
Resolution priority:

1. `VITE_FORCE_BASE`
2. `VITE_BASE_PATH`
3. `GITHUB_REPOSITORY` heuristic (.github.io root vs repo subfolder)
4. Git remote origin url (same heuristic) for local convenience
5. Fallback `/`
   All normalized to leading `/` and trailing `/` unless root.

Runtime helper: `src/utils/basePath.ts` exports `getBasePath()` and `createPath()` which rely on the injected build constant.

### Version Switching Behavior

- UI hides switcher if no archived versions
- Switching attempts same relative path in target version; falls back to target version root if path missing (avoid 404 loops)
- Archived pages get banner + `noindex` by default (override `noindex: false`)

### Frontmatter Validation

Command: `npm run validate:frontmatter`
Schema: `src/tools/frontmatter-schema.(ts|js)` (Zod). Run before committing new MDX to catch issues.

### Common Assistant Tasks (Do / Don't)

Do:

- Regenerate only affected artifacts when editing MDX (usually re-run `generate:routes` + `generate:search-index`)
- Keep README, this file, and `AGENTS.MD` aligned when pipeline or script names change
- Use existing utilities (don't duplicate base path logic)

Don't:

- Hardcode `/luma-docs/` or any base path in components or links
- Edit generated files directly (they are overwritten)
- Introduce separate HTML mutation step (SEO handled via `SEO.tsx` during SSG)

### NPM Scripts Reference (Source of Truth)

See `package.json` for the authoritative list. Key ones:

- `dev`, `build` – user entry points
- `pipeline:dev`, `pipeline:build` – internal orchestration
- `generate:*` – individual generation steps
- `snapshot:version` – archive current docs into `content/versions/<label>/`
- `validate:frontmatter` – schema validation

### Testing

Test files live under `test/`. When modifying build or generation logic add/adjust tests accordingly:

- `basePath.*.spec.ts` – base path resolver
- `routes*.spec.ts` – route generation order & metadata
- `search-index.spec.ts` – search index integrity

### When Updating This File

If you add a new generation stage or rename a script:

1. Update `package.json`
2. Update this file
3. Update README build process section
4. Update `AGENTS.MD` personas if it impacts responsibilities

---

Last verified: 2025-09-24
Maintainer action: Update the date above when materially changing build/deployment behavior.
