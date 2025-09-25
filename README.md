# Luma Docs

[![Demo](https://img.shields.io/badge/demo-live-1db954?logo=vercel&logoColor=white)](https://taurgis.github.io/luma-docs/) [![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE) [![Version](https://img.shields.io/badge/version-1.0.0-indigo)](#) [![Made for GitHub Pages](https://img.shields.io/badge/optimized-GitHub%20Pages-24292e?logo=github)](https://pages.github.com/)

Lightning‑fast, versioned documentation for your project – powered by React 19, MDX, Vite SSG, Tailwind, and automatic GitHub Pages subfolder detection. Drop in MDX → get routes, search, version switcher, SEO, and pre-rendered HTML. Zero yak shaving.

## 🚀 Why Luma?

| Need | You Get |
|------|---------|
| Instant setup | Auto route + search + sitemap generation |
| GitHub Pages quirks | Smart base path resolver (forks, custom domains) |
| Versioned docs | Folder snapshots + version switcher + archived `noindex` |
| Production SEO | Canonicals, OG/Twitter, JSON‑LD, pre-rendered HTML |
| Great DX | Type‑safe config, enforced aliases, strict frontmatter schema |
| Speed | Vite SSG, code‑splitting, tiny runtime hydration |

Peek at the live docs: https://taurgis.github.io/luma-docs/
Deep internals live in `ADVANCED.md` or the MDX guide pages.

### 🔄 Comparison (At a Glance)

Friendly, high‑level defaults comparison (generalized—projects can tune any of these):

| Capability / Concern | Luma Docs (this) | Docusaurus | MkDocs (Material) |
|----------------------|------------------|------------|-------------------|
| Stack Core | React 19 + Vite SSG + MDX 3 | React + Webpack (CRA/Vite migration WIP in ecosystem) | Python + Jinja + Markdown |
| Setup Time (fresh repo) | < 2 min (clone + content) | 5–15 min (init + config + theme tweaks) | 5–15 min (pip + theme + plugins) |
| Base Path (GH Pages) | Auto detection (repo / custom domain) | Manual `baseUrl` config | Manual `site_url` + path config |
| Versioning Model | Folder snapshots + zero extra config | Built‑in versioning (CLI + JSON metadata) | Plugin-based / manual copies |
| MDX Support | First-class (every page is MDX) | First-class (MDX plugin) | Limited (Markdown core; MDX via extra tooling) |
| Theming / Styling | Tailwind + small component layer | Swizzled React components + CSS | Theme config + custom CSS/JS |
| Search | Local index generated (no external service) | Local search (Lunr/Algolia integration) | Usually plugin (Lunr/Algolia) |
| SEO Meta & JSON‑LD | Built‑in, per-page + structured data | Basic tags + community plugins | Depends on theme/plugins |
| Canonical + Subfolder Safety | Automatic | Needs manual config | Manual / plugin |
| Build Speed (cold) | Very fast (Vite graph + small footprint) | Moderate (Webpack bundling) | Fast (pure static generation) |
| Runtime JS Footprint | Minimal (hydrated islands) | Larger (theme scripts + client routing) | Minimal (mostly static HTML) |
| A11y Tests Included | Yes (jest-axe in repo) | Not by default | Not by default |
| Content Authoring | MDX (React components inline) | MDX or Markdown | Markdown (Jinja macros) |
| Extensibility | Direct TS/React code edits | Plugin & swizzle layer | Python plugins / theme overrides |
| Config Surface Area | Single `config.ts` + scripts | `docusaurus.config.js` + sidebars/version files | `mkdocs.yml` + theme/plugin config |
| Learning Curve | Low (file-based, minimal config) | Medium (concepts: swizzling, presets) | Medium (YAML + plugin ecosystem) |
| GitHub Pages Friendly | First-class (detector baked in) | Works (needs baseUrl) | Works (manual path tweaks) |
| Offline Dev Parity | Full (same SSG pipeline) | Full | Full |
| License | MIT | MIT | BSD (MkDocs core) / MIT (Material theme) |

When to pick something else:
- Use Docusaurus if you want a large ecosystem of pre-built plugins & community themes.
- Use MkDocs (Material) if you prefer Python tooling, ultra-lean output, and no React runtime.
- Use Luma Docs if you want React + MDX + speed + painless GitHub Pages versioning with minimal ceremony.


## ⚡ Quick Start (90 seconds)

```bash
npx degit taurgis/luma-docs my-docs
cd my-docs
npm install
npm run dev
```

Add a page (routes appear automatically):

```
content/pages/getting-started/overview.mdx
```

Create `.github/workflows/deploy.yml` (native GitHub Pages):

```yaml
name: Docs
on: { push: { branches: [main] } }
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Derive SITE_URL
        id: site
        run: |
          if [ -f CNAME ]; then echo "site_url=https://$(head -n1 CNAME)" >> $GITHUB_OUTPUT; \
          else echo "site_url=https://${GITHUB_REPOSITORY_OWNER}.github.io" >> $GITHUB_OUTPUT; fi
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci --prefer-offline --no-audit
      - run: npm run build
        env:
          SITE_URL: ${{ steps.site.outputs.site_url }}
          GITHUB_REPOSITORY: ${{ github.repository }}
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
  deploy:
    if: github.ref == 'refs/heads/main'
    needs: build
    runs-on: ubuntu-latest
    environment: { name: github-pages, url: ${{ steps.deployment.outputs.page_url }} }
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Visit: `https://<user>.github.io/<repo>/` (auto base path). Custom domain? Add `CNAME` → done.

### Core Scripts

| Script | Purpose |
|--------|---------|
| `dev` | Local dev (runs generation once) |
| `build` | Production static build |
| `snapshot:version` | Archive current docs → `content/versions/<label>` |
| `validate:frontmatter` | Frontmatter schema check |
| `search-dev` / `search:generate` | Inspect / rebuild search index |
| `generate:*` | Manual regeneration (normally not needed) |
| `test` | Vitest (unit + a11y + SEO) |

Force a subfolder (rarely needed):

```bash
# Force subfolder during dev
VITE_FORCE_BASE=/your-repo/ npm run dev

# Force subfolder during build
VITE_FORCE_BASE=/your-repo/ npm run build

# Root deployment (custom domain or username.github.io)
VITE_FORCE_BASE=/ npm run build
```

You can use standard Markdown syntax and React components.

### ✍️ Minimal Frontmatter

```yaml
---
title: Getting Started
description: How to integrate Luma Docs
order: 1
---
```

### 🔍 SEO (Optional)
Set only what you need—meta + structured data are auto‑rendered.

```yaml
---
title: "Your Page Title"
description: "Your page description for search engines"
keywords: "keyword1, keyword2, keyword3"
ogType: "article" # or "website"
twitterCard: "summary_large_image" # or "summary"
twitterCreator: "@yourusername"
twitterSite: "@yoursite"
author: "Author Name"
publishedTime: "2024-01-01T00:00:00Z"
modifiedTime: "2024-01-15T10:00:00Z"
section: "Your Section"
tags: ["tag1", "tag2", "tag3"] # Array or comma-separated string
canonical: "/your-canonical-url/"
robots: "index, follow" # or use noindex: true
order: 1
---
```

> More in `content/pages/seo-examples.mdx`.

- **Basic Meta Tags**:

  - `title` - Page title (used in `<title>` and Open Graph)
  - `description` - Meta description for search engines
  - `keywords` - Comma-separated keywords
  - `author` - Content author
  - `canonical` - Canonical URL for the page
  - `robots` - Robots directive (or use `noindex: true`)

- **Open Graph Meta Tags**:

  - `ogType` - "website" or "article"
  - `ogImage` - URL to Open Graph image (1200x630px recommended)

- **Twitter Card Meta Tags**:

  - `twitterCard` - "summary" or "summary_large_image"
  - `twitterCreator` - Twitter handle of content creator
  - `twitterSite` - Twitter handle of website

- **Article-Specific Meta Tags**:
  - `publishedTime` - ISO 8601 publication date
  - `modifiedTime` - ISO 8601 modification date
  - `section` - Article section/category
  - `tags` - Array of tags (can also be comma-separated string)

### Inline Overrides
Drop an `<SEO />` component inside an MDX file to override frontmatter per section:

```mdx
# Your Page Content

<SEO
  title="Custom Page Title Override"
  description="This description will override the frontmatter description"
  keywords="custom, override, seo"
  ogType="article"
  twitterCard="summary"
/>

More content here...
```

Great for dynamic sections or demos.

### SEO Highlights
Meta tags, OG/Twitter, JSON‑LD (Article + Breadcrumbs), canonical URLs, sitemap inclusion, archived pages auto `noindex`.

### 🧭 Automatic Navigation

Folder + file naming drives sidebar. `index.mdx` files become the folder landing page. Single‑page groups are flattened. Versioned snapshots preserve historical structure.

## 🧩 Components
Import from the single barrel:

```jsx
import {
  Callout,
  CodeBlock,
  Collapsible,
  CodeTabs,
  PageTitle,
  PageSubtitle,
} from "@/components"; // Uses the @ -> src alias
```

### Code Examples

#### CodeBlock

Advanced syntax highlighting with copy functionality:

```jsx
<CodeBlock
  code={`function hello() { console.log("Hello World!"); }`}
  language="javascript"
  title="Hello World Example"
  showLineNumbers={true}
/>
```

#### CodeTabs

Display code examples in multiple languages:

```jsx
<CodeTabs
  tabs={[
    { label: "JavaScript", language: "js", code: "const x = 1;" },
    { label: "TypeScript", language: "ts", code: "const x: number = 1;" },
  ]}
  groupId="example"
/>
```

#### Inline Code

Use `<Code>text</Code>` for inline code or `<Kbd>Ctrl</Kbd>` for keyboard shortcuts.

### Content / Layout Goodies

#### Callouts

Highlight important information with semantic styling:

```jsx
<Callout type="info" title="Information">
  This is an informational callout.
</Callout>

<Callout type="warning" title="Warning">
  This alerts users to potential issues.
</Callout>

<Callout type="success" title="Success">
  Confirms successful operations.
</Callout>

<Callout type="danger" title="Important">
  Critical information that must not be ignored.
</Callout>

<Callout type="tip" title="Pro Tip">
  Helpful advice and best practices.
</Callout>
```

#### Collapsibles

Organize content in expandable sections:

```jsx
<Collapsible title="Advanced Configuration" intent="info" defaultOpen>
  Content that can be collapsed to save space.
</Collapsible>
```

### Typography

Enhanced typography with consistent styling:

```jsx
<PageTitle>Main Page Title</PageTitle>
<PageSubtitle>Descriptive subtitle</PageSubtitle>
<H2>Section Header</H2>
<H3>Subsection Header</H3>
<Lead>Lead paragraph text</Lead>
<Body>Regular body text</Body>
```

### Features

- **TypeScript Support**: All components are fully typed
- **Accessibility**: Built with ARIA attributes and keyboard navigation
- **Responsive Design**: Works perfectly on all device sizes
- **Consistent Styling**: Follows design system patterns
- **Performance Optimized**: Dynamic imports and code splitting
- **Dark Mode Ready**: Prepared for future dark mode support

For a complete showcase of all components with live examples, visit the [Component Showcase](/components/) page.

## 🛠 Development

### Available Scripts

- `npm run dev` – Start development server (runs pipeline once, then launches SSG dev)
- `npm run dev:subfolder` – Convenience dev with forced base path (uses `VITE_FORCE_BASE=/luma-docs/`)
- `npm run build` – Full production build (multi-step pipeline + static generation)
- `npm run test` – Run Vitest test suite (unit, integration, a11y, SEO tests)
- `npm run clean` – Remove build/cache artifacts
- `npm run lint` / `npm run lint:fix` – ESLint checks and autofix
- `npm run type-check` – TypeScript type checking (runs a minimal pipeline first to ensure generated artifacts exist)
- `npm run snapshot:version` – Snapshot current root docs into an archived version (see versioning section)
- `npm run validate:frontmatter` – Validate MDX frontmatter against schema
- `npm run search-dev` – Interactive search dev utility
  - `npm run search:generate` (script alias) – Force regeneration of search index
  - `npm run search:validate` (script alias) – Validate existing index
- `npm run generate:versions` – Regenerate `src/generated-versions.ts` (normally auto via pipeline)
- `npm run generate:routes` – Regenerate `src/generated-routes.tsx` + meta (auto in pipeline)
- `npm run generate:search-index` – Rebuild local search index (auto in pipeline)
- `npm run generate:sitemap` – Regenerate sitemap (auto in pipeline)
- `npm run build:css` / `npm run build:css:watch` – Tailwind CSS one-off or watch build
- `npm run pipeline:dev` / `npm run pipeline:build` – Run internal build pipeline only (rarely needed directly)

Environment-based overrides:

- Subfolder dev: `VITE_FORCE_BASE=/your-repo/ npm run dev`
- Subfolder build: `VITE_FORCE_BASE=/your-repo/ npm run build`

### Base Path

Base path detection (root vs subfolder like `/luma-docs/`) is centralized in `src/tools/resolve-base-path.mjs` and consumed directly by `vite.config.ts`, build tooling, runtime helpers, and the sitemap generator.

Resolution priority (first match wins):

1. `VITE_FORCE_BASE` – explicit override (e.g. `/docs/` or `/preview/`)
2. `VITE_BASE_PATH` – externally provided resolved base
3. `GITHUB_REPOSITORY` – if repository ends with `.github.io` => root `/`; else `/<repo>/`
4. Git remote `origin` – same logic as above (local dev convenience)
5. Fallback `/`

All returned values are normalized to begin with `/` and (if not root) end with `/`.

Runtime: `getBasePath()` (in `src/utils/basePath.ts`) simply returns the build-time value; `createPath()` prefixes internal links safely.

Sitemap: `generate-sitemap.js` uses the same resolver and expects `SITE_URL` to be the domain only (without the subfolder). If you mistakenly include the subfolder, it will de‑duplicate.

Resolver picks the right base automatically (repo name, custom domain, or forced override). Rarely think about it again.

### Aliases

Configured in `tsconfig.json` and `vite.config.ts`:

| Alias            | Resolves To          |
| ---------------- | -------------------- |
| `@`              | `src/`               |
| `@/components/*` | `src/components/*`   |
| `@/utils/*`      | `src/utils/*`        |
| `@/tools/*`      | `src/tools/*`        |
| `@/types`        | `src/types/index.ts` |
| `@/types/*`      | `src/types/*`        |
| `@/config`       | `config.ts`          |

Additional (Vite-only) helper alias: `@tools` → `src/tools`.

Enforced by ESLint:

- Deep relative traversals into these folders (e.g. `../../components/...`) are disallowed.
- MDX files are restricted from using relative imports (`./` or `../`) and must use aliases (ensures examples are copy‑paste stable after refactors).

Generated files under `src/generated-*.ts*` should never be manually edited—always regenerate via the relevant `generate:*` script.

### Linting & Import Hygiene

Key enforced rules:

- `import/order` with grouping & alphabetization
- Alias preference: custom `no-restricted-imports` patterns
- MDX-specific relaxed rules (allow implicit component usage, disable unused var noise) + alias enforcement
- Accessibility (`jsx-a11y/*`) tuned for docs context

If you add a new top-level directory under `src/` that should have an alias, update:

1. `tsconfig.json` -> `compilerOptions.paths`
2. `vite.config.ts` -> `resolve.alias`
3. ESLint restrictions (if you want to forbid deep relative access)
4. This README + `AGENTS.MD`

### Versions

Luma Docs supports a folder‑based versioning strategy:

```
content/
  pages/              # Current (stable) documentation (label = config.versions.current)
  versions/
    v0.9/             # Archived version folder (example)
    v0.8/
```

Current docs live in `content/pages/`. Snapshot with `npm run snapshot:version -- v1.2` → archived under `content/versions/v1.2/` (auto noindex + version switcher). Missing path on switch? We fall back gracefully. Search can scope current vs all.

Configuration (`config.ts`):

```ts
versions: {
  current: "v1.0",           // Label applied to root pages
  enableSwitcher: true,       // Show version switcher when archived exist
  strategy: 'folder',         // Folder strategy (default / only option currently)
  hidden: [],                 // Versions to exclude from UI switcher
  order: [],                  // Explicit ordering (otherwise semver desc)
}
```

Create snapshot:

Automated helper (preferred):

```bash
# Archive current content as v1.0
npm run snapshot:version -- v1.0

# Archive current as v1.0 and immediately bump current label to v1.1
npm run snapshot:version -- v1.0 --bump v1.1
```

Manual (custom filtering):

```bash
# 1. Decide new version label (e.g. v1.0 -> archive, start v1.1 in root)
NEW_VER=v1.0
mkdir -p content/versions/$NEW_VER
rsync -a content/pages/ content/versions/$NEW_VER/

# 2. (Optional) Prepend titles to make context explicit in archived MDX
sed -i '' '1s/^/---\ntitle: "Legacy Home ('"$NEW_VER"')"\n---\n/' content/versions/$NEW_VER/index.mdx

# 3. Update config.ts current label if bumping current
vim config.ts

# 4. Regenerate artifacts
npm run generate:routes && npm run generate:search-index
```

Archived pages: automatic `noindex` (override with `noindex: false`). Add `canonical` if pointing to newer doc.

### Snapshot Helper

An automated helper script is included to streamline the snapshot workflow above.

Usage examples:

```bash
# Snapshot current root content into versions/v1.0
npm run snapshot:version -- v1.0

# Snapshot and simultaneously bump the current version label to v1.1
npm run snapshot:version -- v1.0 --bump v1.1
```

What it does:

1. Validates the target label (must match vMAJOR[.MINOR[.PATCH]])
2. Copies all content from `content/pages/` into `content/versions/<label>/`
3. Regenerates `src/generated-versions.ts`
4. If `--bump <nextLabel>` provided: updates `config.ts` `versions.current` and regenerates routes

Typical release flow:

```bash
# Finish work for v1.0 in content/pages/
npm run snapshot:version -- v1.0 --bump v1.1

# Now content/pages/ represents v1.1 (current) — edit content freely
git add .
git commit -m "chore: snapshot v1.0 and bump current to v1.1"
```

If you only snapshot (no bump), you can update `config.ts` later when you begin the next version.

### Project Structure (Essentials)

```
content/
  pages/                     # Current docs (scanned for routes; labeled as current version)
  versions/                  # Archived snapshots (auto-detected)
    v0.9/
    v0.8/
src/
  app/                       # App shell & layout glue
    layout/
      Layout.tsx
      ErrorBoundary.tsx
  components/                # Reusable React + MDX / layout / SEO components
    content/
      CodeBlock.tsx
      CodeTabs.tsx
      Collapsible.tsx
      MDXPage.tsx
      MDXWrapper.tsx
      icons.tsx
    feedback/
      Callout.tsx
    layout/
      Typography.tsx
      VersionBadge.tsx
      VersionSwitcher.tsx
    navigation/
      Sidebar.tsx
      OnThisPage.tsx
      NextLink.tsx
    search/
      Search.tsx
    seo/
      SEO.tsx
      Breadcrumbs.tsx
  utils/
    basePath.ts              # Base path helpers
    search.ts                # Client search helpers
  styles/
    input.css                # Tailwind entry
  public/                    # Static assets copied to dist (configured via Vite publicDir)
    favicon.svg
    robots.txt
    sitemap.xml
  generated-routes.tsx       # AUTO-GENERATED: routes w/ version metadata
  generated-routes.meta.ts   # AUTO-GENERATED: route meta export (frontmatter)
  generated-search-index.ts  # AUTO-GENERATED: search index data
  generated-versions.ts      # AUTO-GENERATED: list of archived versions
  types/                     # Type declarations & ambient defs
src/tools/                   # Build & generation scripts (invoked via npm scripts)
  generate-routes.js
  generate-search-index.js
  generate-sitemap.js
  generate-versions.js
  snapshot-version.js
  resolve-base-path.mjs
  validate-frontmatter.mjs
  run-build-pipeline.mjs
  search-dev.js
config.ts                    # Central site configuration
tailwind.config.js
vite.config.ts
index.html                   # Vite entry HTML
package.json
dist/                        # Build output (ignored in VCS)
```

## 🚀 Deployment

### GitHub Pages

The site is optimized for GitHub Pages deployment with intelligent subfolder support. Below is the **modern, native GitHub Pages workflow (recommended)** followed by legacy / manual options.

#### Native Workflow

Create `.github/workflows/deploy.yml` using the built‑in Pages deployment actions (no third‑party action needed). The resolver now auto-detects the base path; we only add a tiny step to derive `SITE_URL` from a CNAME or owner:

```yaml
name: Docs CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages-${{ github.ref }}
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Derive SITE_URL (owner.github.io or CNAME)
        id: site
        run: |
          if [ -f CNAME ]; then
            DOMAIN=$(head -n1 CNAME | tr -d '\r')
            echo "site_url=https://$DOMAIN" >> "$GITHUB_OUTPUT"
          else
            echo "site_url=https://${GITHUB_REPOSITORY_OWNER}.github.io" >> "$GITHUB_OUTPUT"
          fi

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci --prefer-offline --no-audit

      - name: Lint & Typecheck
        run: |
          npm run lint
          npm run type-check

      - name: Build (auto base detection)
        env:
          SITE_URL: ${{ steps.site.outputs.site_url }}
          GITHUB_REPOSITORY: ${{ github.repository }}
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    if: github.ref == 'refs/heads/main'
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v4
```

Key benefits:

- Native Pages flow (fewer permissions, clearer audit trail)
- Automatic cancellation of superseded builds (faster feedback)
- Zero duplication of base path logic (handled centrally in resolver & Vite config)
- Supports custom domains automatically via optional CNAME

#### Local Build

```bash
# Auto-detect base path (preferred)
npm run build

# Force a specific subfolder (overrides detection)
VITE_FORCE_BASE=/your-repo/ npm run build

# Force root deployment (custom domain or username.github.io)
VITE_FORCE_BASE=/ npm run build
```

#### 3. Legacy Third‑Party Action (Deprecated Here)

Previously this project used `peaceiris/actions-gh-pages`. It still works, but the native workflow above is preferred. If you need the old snippet, view git history prior to the modernization commit.

**Live Example:** [taurgis.github.io/luma-docs](https://taurgis.github.io/luma-docs/)

### Other Hosts

The built site in the `dist` folder can be deployed to any static hosting service:

- **Vercel**: Connect your repository and deploy automatically
- **Netlify**: Drag and drop the `dist` folder or connect via Git
- **AWS S3**: Upload the `dist` folder contents to an S3 bucket
- **Firebase Hosting**: Use `firebase deploy` after building
- **Any web server**: Serve the `dist` folder as static files

### Environment Variables

Base path & sitemap behavior is primarily controlled by the resolver logic. Supported variables (resolution priority shown earlier under "Unified Base Path Handling"):

- `VITE_FORCE_BASE` – Highest precedence explicit override (e.g. `/preview/`)
- `VITE_BASE_PATH` – Pre-resolved base path (used if `VITE_FORCE_BASE` absent)
- `GITHUB_REPOSITORY` – Enables automatic GitHub Pages base detection in CI
- `SITE_URL` – Domain only (no trailing slash, no subfolder); used for sitemap & canonical assembly
- (Optional/Future) `GEMINI_API_KEY` – Reserved for future AI features (currently unused)

Notes:

- Do NOT include the subfolder in `SITE_URL`; the generator appends it.
- `BASE_PATH` legacy variable is not used—remove it from any external automation.

## 🧠 How It Works

### Route Generation

The platform automatically scans `content/pages/` (current version) and `content/versions/<label>/` (archived) and generates static React Router routes:

1. **File Structure Mapping**: Each `.mdx` file becomes a route (with clean slug normalization)
2. **Nested Routing**: Folder structure creates nested routes
3. **Index Files**: `index.mdx` collapse to their parent path (e.g. `guides/index.mdx` -> `/guides/`)
4. **Dynamic Import**: MDX files are code-split and lazily imported for performance
5. **Version Metadata**: Each generated route gets a `version` field (current or archived label)

### Build Pipeline

The multi-step pipeline (implemented in `src/tools/run-build-pipeline.mjs`) orchestrates all generation steps before Vite SSG runs. Sequence (`npm run build`):

1. **Versions Generation** (`generate:versions`) – Detect archived folders and emit `src/generated-versions.ts`
2. **Route Generation** (`generate:routes`) – Scan current + archived MDX and emit `src/generated-routes.tsx` & meta (extract frontmatter + SEO)
3. **CSS Build** (`build:css`) – Compile Tailwind from `src/styles/input.css` into `src/public/index.css`
4. **Search Index** (`generate:search-index`) – Build version-aware search index (`src/generated-search-index.ts`)
5. **Sitemap Generation** (`generate:sitemap`) – Produce `src/public/sitemap.xml` (base path aware)
6. **Static Site Generation** (Vite React SSG) – Emit pre-rendered HTML with meta tags via `components/SEO.tsx`

Dev mode (`npm run dev`) runs the pipeline once, then launches the SSG dev server; individual scripts can be re-run ad hoc if you change raw MDX or config without restarting.

### SEO Integration

The SEO system works through integrated runtime & build steps:

- **Frontmatter Extraction** – Route generation script extracts SEO metadata from MDX frontmatter
- **`components/SEO.tsx`** – Renders meta tags using the SSG `<Head>` API (no separate HTML template mutation step)
- **Static Generation** – Meta tags & JSON-LD emitted during SSG for fully crawable static HTML
- **Dynamic Override** – Inline `<SEO>` usage in MDX can override frontmatter values for specific pages/sections
- **Structured Data** – Website + Article schema; optional breadcrumb schema via `config.features.structuredDataBreadcrumbs`
- **Canonical URLs** – Automatic canonical generation with base path awareness (GitHub Pages subfolder safe)

### Content Management

- **Frontmatter Support**: Each MDX file can include YAML frontmatter for metadata
- **Component Integration**: Use React components directly in MDX files
- **Automatic Navigation**: Sidebar navigation is generated from file structure and frontmatter
- **Search Integration**: All content is automatically indexed for search functionality

### Performance

- **Code Splitting**: Automatic chunking by vendor, MDX, and Prism libraries
- **Static Generation**: Pre-rendered HTML for fast initial loads
- **Optimized Assets**: Hashed filenames for optimal caching
- **Tree Shaking**: Dead code elimination in production builds

## 🎨 Customization

### Site Configuration

The site configuration is centralized in `config.ts`. Update this file to customize branding, links, SEO defaults and feature flags:

```typescript
export const config = {
  // Site Information
  site: {
    name: "Your Site Name",
    title: "Your Site Title",
    description: "Your site description",
    version: "1.0.0",
  },

  // Branding
  branding: {
    logo: {
      text: "Your",
      accent: "Site",
    },
  },

  // Links
  links: {
    github: "https://github.com/your-username/your-repo",
    // Add more links as needed
  },

  // SEO and Metadata Defaults
  seo: {
    siteName: "Your Site Title",
    defaultTitle: "Your Site Title",
    defaultDescription: "Your site description",
    author: "Your Name",
    keywords: ["documentation", "react", "mdx", "typescript", "vite"],
  },

  // Feature Flags
  features: {
    search: true,
    breadcrumbs: true,
    structuredDataBreadcrumbs: true,
  },

  // Navigation
  navigation: {
    showVersionBadge: true,
    showGitHubLink: true,
  },
};
```

### Styling

The site uses Tailwind CSS for styling. You can customize:

- `tailwind.config.js` - Tailwind configuration and theme customization
- `src/styles/input.css` - Custom CSS styles and Tailwind imports
- Typography styles using the `@tailwindcss/typography` plugin
- Component-specific styles within individual components

### Extending Components

You can customize or add new React components:

- Modify existing components in the `components/` directory
- Create custom MDX components in `components/MDXWrapper.tsx`
- Add new layout components for different page types
- Extend the search functionality in `components/Search.tsx`

### Tooling Config

- `vite.config.ts` - Vite configuration, base path handling, and build optimization
- `package.json` - Dependencies, scripts, and project metadata
- `tsconfig.json` - TypeScript configuration
- Base path is automatically handled for different deployment environments

### Content Features

- **Frontmatter Options**: Extend frontmatter schema for additional metadata
- **Custom MDX Components**: Add reusable components for documentation
- **Search Configuration**: Modify search indexing behavior
- **Navigation Ordering**: Use `order` field in frontmatter to control navigation

## 🧱 Architecture Snapshot

### Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite with React SSG plugin
- **Styling**: Tailwind CSS with Typography plugin
- **Routing**: React Router with static generation
- **Content**: MDX with frontmatter support
- **Code Highlighting**: Prism.js
- **Development**: Fast HMR and optimized builds

### Key Dependencies

Core runtime technologies (see `package.json` for full, exact versions):

- React 19 + React Router 6
- MDX 3 (`@mdx-js/react` + rollup integration)
- Vite 7 + `vite-react-ssg` for static generation
- Tailwind CSS 3 (+ Typography plugin)
- Prism.js for syntax highlighting
- gray-matter for frontmatter parsing

Dev & quality stack includes: Vitest (unit/integration/a11y), ESLint (custom rules for MDX + import hygiene), TypeScript strict mode, jest-axe for accessibility assertions, and zod for schema validation.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes and test thoroughly
4. Run type checking: `npm run type-check`
5. Submit a pull request with a clear description

### Guidelines

- Follow TypeScript best practices
- Use semantic commit messages
- Test your changes with both local and subfolder builds
- Update documentation when adding new features

### Testing

The project ships with a comprehensive Vitest-based test suite:

- Unit & helper tests (e.g. base path utilities, route path helpers)
- Generated artifact validation (routes order, search index shape)
- Accessibility tests using `jest-axe` (landmarks, layout, semantics)
- SEO meta & canonical behavior tests

Run all tests:

```bash
npm test
```

Authoring guidelines:

- Prefer colocated test naming patterns already used in `test/`
- Avoid importing heavy SSG/Vite plugins in tests (config auto-simplifies with `process.env.VITEST`)
- If adding new generated artifacts, add a smoke test that fails loudly when shape changes unexpectedly.

## 🧪 Troubleshooting

### Common Issues

1. **Routes not generating**: Ensure MDX files have proper frontmatter and run `npm run generate:routes`
2. **Styles not updating**: Run `npm run build:css` or use watch mode during development
3. **GitHub Pages 404**: Verify the base path is correctly set in the build process
4. **Search not working**: Check that `npm run generate:search-index` completed successfully
5. **Edited generated file overwritten**: Regenerate instead of manual edits (`generate:*` scripts)
6. **Alias import errors in MDX**: MDX files must use aliases (`@/components/...`) not relative paths

### Build Issues

- Clear cache: `npm run clean`
- Verify all dependencies: `npm ci`
- Check Node.js version (18+ required)

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙋 Support & Next Steps

Need deeper internals? See `ADVANCED.md` or browse the live demo guides. Found a gap? Open an issue or PR.

If you have questions or need help:

- Check the documentation in the `content/pages/` directory
- Open an issue on GitHub
- Contribute improvements back to the project

---

Built with ❤️ using React 19, MDX, Vite SSG, and Tailwind CSS. Dive deeper in `ADVANCED.md`.
