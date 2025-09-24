# Luma Docs

A modern, fast, and beautiful documentation platform built with React 19, MDX, Vite React SSG, and Tailwind CSS. Perfect for creating documentation websites that are both developer-friendly and user-friendly with automatic route generation, search functionality, and optimized deployment workflows.

## 🚀 Live Demo

**[View Live Demo](https://taurgis.github.io/luma-docs/)** - See Luma Docs in action with full SEO features, search functionality, and responsive design.

- 📱 **Fully responsive design** that works on all devices
- 🔍 **Live search functionality** - try searching for "SEO" or "deployment"
- 🏷️ **Comprehensive SEO** - view source to see Open Graph, Twitter Cards, and JSON-LD
- 📚 **Multiple content types** - guides, examples, and documentation
- 🚀 **GitHub Pages deployment** with automatic subfolder detection
- ⚡ **Fast loading** with static site generation and optimized assets

Explore the demo to see how your documentation site will look and feel!

### Available Scripts

  
Environment-based overrides:

```bash
# Force subfolder during dev
VITE_FORCE_BASE=/your-repo/ npm run dev

# Force subfolder during build
VITE_FORCE_BASE=/your-repo/ npm run build

# Root deployment (custom domain or username.github.io)
VITE_FORCE_BASE=/ npm run build
```

You can use standard Markdown syntax and React components.

#### Frontmatter Options

- `title`: The page title (used in navigation and SEO)
- `description`: Page description for SEO
- `order`: Sort order for navigation (lower numbers appear first)

#### SEO Frontmatter Options

Luma Docs includes comprehensive SEO support through frontmatter metadata:

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

**Available SEO Fields:**

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

#### Inline SEO Components

You can also override SEO metadata directly in your MDX content using the `<SEO>` component:

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

This allows for dynamic SEO adjustments within specific sections of your content.

#### SEO Features

- **Automatic Meta Tag Generation**: All SEO metadata is automatically converted to proper HTML meta tags
- **Open Graph Support**: Rich social media previews with customizable images and metadata
- **Twitter Cards**: Optimized Twitter sharing with summary and large image card support
- **JSON-LD Structured Data**: Automatic generation of structured data for search engines
- **Article Schema**: Pages with `ogType: "article"` get proper Article schema markup
- **Canonical URLs**: Automatic canonical URL generation with base path support
- **Sitemap Integration**: All pages are automatically included in the generated sitemap.xml

#### SEO Best Practices

- Keep titles under 60 characters
- Keep descriptions between 120-160 characters
- Use relevant, specific keywords (avoid keyword stuffing)
- Use Open Graph images sized at 1200x630 pixels
- Set appropriate `ogType` ("website" for landing pages, "article" for content)
- Include publication and modification dates for articles
- Use structured tags and sections for better content organization

### Automatic Navigation

Navigation is automatically generated based on your file structure and frontmatter:

- Files are grouped by their top-level directory
- Within groups, pages are sorted by `order` field, then alphabetically
- The `title` from frontmatter is used as the navigation label

## Enhanced Component Library

Luma Docs includes a rich set of React components designed specifically for documentation. Import any of these components in your MDX files:

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

### Code Components

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

### Content Components

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

### Typography Components

Enhanced typography with consistent styling:

```jsx
<PageTitle>Main Page Title</PageTitle>
<PageSubtitle>Descriptive subtitle</PageSubtitle>
<H2>Section Header</H2>
<H3>Subsection Header</H3>
<Lead>Lead paragraph text</Lead>
<Body>Regular body text</Body>
```

### Component Features

- **TypeScript Support**: All components are fully typed
- **Accessibility**: Built with ARIA attributes and keyboard navigation
- **Responsive Design**: Works perfectly on all device sizes
- **Consistent Styling**: Follows design system patterns
- **Performance Optimized**: Dynamic imports and code splitting
- **Dark Mode Ready**: Prepared for future dark mode support

For a complete showcase of all components with live examples, visit the [Component Showcase](/components/) page.

## Development

### Available Scripts

- `npm run dev` - Start development server (runs multi-step pipeline then launches SSG dev)
- `npm run build` - Full production build (multi-step pipeline + static generation)
- `npm run test` - Run Vitest test suite
- `npm run clean` - Remove build/cache artifacts
- `npm run lint` / `npm run lint:fix` - ESLint checks and autofix
- `npm run type-check` - TypeScript type checking (ensures generated artifacts in place)
- `npm run codemod:aliases` - Rewrite deep relative imports to `@/components`, `@/utils`, `@/tools` aliases
- `npm run snapshot:version` - Snapshot current root docs into an archived version (see versioning section)
- `npm run validate:frontmatter` - Validate MDX frontmatter against schema
- `npm run search-dev` - Interactive search dev utility (generate/validate via arguments)
- `npm run generate:versions` - Regenerate `src/generated-versions.ts` (normally auto via pipeline)
- `npm run generate:routes` - Regenerate `src/generated-routes.tsx` + meta (auto in pipeline)
- `npm run generate:search-index` - Rebuild local search index (auto in pipeline)
- `npm run generate:sitemap` - Regenerate sitemap (auto in pipeline)
- `npm run build:css` / `npm run build:css:watch` - Tailwind CSS one-off or watch build
- `npm run pipeline:dev` / `npm run pipeline:build` - Run the internal build pipeline without starting dev server / SSG (usually not needed directly)

Environment-based overrides:
- Subfolder dev: `VITE_FORCE_BASE=/your-repo/ npm run dev`
- Subfolder build: `VITE_FORCE_BASE=/your-repo/ npm run build`

### Unified Base Path Handling

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

Examples:
```bash
# Force a temporary docs path
VITE_FORCE_BASE=/docs/ npm run dev

# Build for a preview namespace
VITE_FORCE_BASE=/preview/ npm run build

# Standard GitHub Pages (auto-detect /<repo>/)
VITE_FORCE_BASE=/your-repo/ npm run build

# Root deployment (username.github.io repo or custom domain)
VITE_FORCE_BASE=/ npm run build

# Custom domain with subfolder
SITE_URL=https://example.com VITE_FORCE_BASE=/product-docs/ npm run build
```

Benefits:
- Single source of truth (no drift between scripts)
- Easy future migration (e.g. to Cloudflare Pages or Netlify)
- Deterministic behavior across dev, build, preview, and sitemap generation
- Works seamlessly with path aliases (`@`, `@/components`, `@/utils`, `@/tools`) for clean imports

### Path Aliases & Import Hygiene

Configured in `tsconfig.json` and `vite.config.ts`:

| Alias | Resolves To |
|-------|-------------|
| `@` | `src/` |
| `@/components/*` | `src/components/*` |
| `@/utils/*` | `src/utils/*` |
| `@/tools/*` | `src/tools/*` |

Enforced by ESLint:

- Deep relative traversals into these folders (e.g. `../../components/...`) are disallowed.
- MDX files are restricted from using relative imports (`./` or `../`) and must use aliases (ensures examples are copy‑paste stable after refactors).

Refactor assistance:

```bash
npm run codemod:aliases
```

The codemod scans `src/` and rewrites eligible deep relative imports to alias forms. It intentionally skips generated files and `node_modules`.

### Linting Strategy

Key enforced rules:

- `import/order` with grouping & alphabetization
- Alias preference: custom `no-restricted-imports` patterns
- MDX-specific relaxed rules (allow implicit component usage, disable unused var noise) + alias enforcement
- Accessibility (`jsx-a11y/*`) tuned for docs context

If you add a new top-level directory under `src/` that should have an alias, update:

1. `tsconfig.json` -> `compilerOptions.paths`
2. `vite.config.ts` -> `resolve.alias`
3. ESLint restrictions (if you want to forbid deep relative access)
4. This README + `COPILOT-INSTRUCTIONS.md` + `AGENTS.MD`

### Multi-Version Documentation

Luma Docs supports a folder‑based versioning strategy:

```
content/
  pages/              # Current (stable) documentation (label = config.versions.current)
  versions/
    v0.9/             # Archived version folder (example)
    v0.8/
```

Key behaviors:

- Root `content/pages/` content is labeled as the current stable version (`config.versions.current`).
- Archived versions live under `content/versions/<label>/` and are auto-detected.
- Sidebar shows only pages for the active version (no cross-version noise) and achieves **navigation parity** for archived versions (the `/vX.Y/` prefix is stripped so historical docs don’t sit inside an extra version bucket).
- Group headings link to their index page when an `index.mdx` exists; single‑page groups are flattened for cleaner UI.
- Version switcher hides automatically when there are no archived versions.
- Switching to a version where the current page path doesn’t exist **falls back automatically to that version’s root** (or `/` for current) to prevent 404 interruptions after restructures.
- Search can be scoped: Current vs All Versions (toggle inside search modal). Archived results display a neutral version pill.
- Archived pages receive an in-page banner and automatic `<meta name="robots" content="noindex">` (override with `noindex: false`).
- `config.versions.hidden` can hide specific archived labels from the switcher while keeping them routable.

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

Creating a new archived snapshot (automated recommended, manual alternative below):

Automated helper (preferred):

```bash
# Archive current content as v1.0
npm run snapshot:version -- v1.0

# Archive current as v1.0 and immediately bump current label to v1.1
npm run snapshot:version -- v1.0 --bump v1.1
```

Manual workflow (if you need custom filtering):

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

Search Behavior:
- Current scope: filters out any `version` metadata not matching `config.versions.current`.
- All Versions: shows every match (archived results display gray pills/pills with version label).

Restructuring & Resilience:
- Archived snapshots preserve their original folder layout; later restructures in `content/pages/` will not break archived imports.
- Version switching performs a path existence check and falls back to the version root when needed.

SEO Considerations:
- Archived pages are automatically set to `noindex` to avoid competing with current content.
- You may still expose key legacy pages by adding `noindex: false` in frontmatter (overrides default).
- Optionally add canonical links in archived pages pointing to current equivalents using frontmatter `canonical`.

Future Enhancements (ideas):
- Cross-version diff component
- Version comparison landing page

### Automated Snapshot Command

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

### Project Structure (Simplified / Current)

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
  components/                # Reusable React + MDX components
    SEO.tsx
    MDXWrapper.tsx
    Search.tsx
    Sidebar.tsx
    VersionSwitcher.tsx
    VersionBadge.tsx
    Breadcrumbs.tsx
    OnThisPage.tsx
    CodeBlock.tsx
    Callout.tsx
  utils/
    basePath.ts              # Base path helpers (consumes generated constant)
    search.ts                # Client search helpers
    generateRoutes.ts        # Runtime helpers used by tooling
  styles/
    input.css                # Tailwind input
  public/                    # Static assets copied to dist
    favicon.svg
    robots.txt
  generated-routes.tsx       # AUTO-GENERATED: routes w/ version metadata
  generated-routes.meta.ts   # AUTO-GENERATED: route meta export (frontmatter)
  generated-search-index.ts  # AUTO-GENERATED: search index data
  generated-versions.ts      # AUTO-GENERATED: list of archived versions
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

## Deployment

### GitHub Pages (Recommended)

The site is optimized for GitHub Pages deployment with intelligent subfolder support. Below is the **modern, native GitHub Pages workflow (recommended)** followed by legacy / manual options.

#### 1. Modern Native GitHub Pages Workflow (Recommended)

Create `.github/workflows/deploy.yml` using the built‑in Pages deployment actions (no third‑party action needed). The resolver now auto-detects the base path; we only add a tiny step to derive `SITE_URL` from a CNAME or owner:

```yaml
name: Docs CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
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

#### 2. Manual / Local Build (Optional)

```bash
# Build with automatic base path detection
VITE_FORCE_BASE=/your-repo/ npm run build

# Or specify repository name manually
VITE_FORCE_BASE=/your-repo/ npm run build
```

#### 3. Legacy Third‑Party Action (Deprecated Here)

Previously this project used `peaceiris/actions-gh-pages`. It still works, but the native workflow above is preferred. If you need the old snippet, view git history prior to the modernization commit.

**Live Example:** [taurgis.github.io/luma-docs](https://taurgis.github.io/luma-docs/)

### Other Platforms

The built site in the `dist` folder can be deployed to any static hosting service:

- **Vercel**: Connect your repository and deploy automatically
- **Netlify**: Drag and drop the `dist` folder or connect via Git
- **AWS S3**: Upload the `dist` folder contents to an S3 bucket
- **Firebase Hosting**: Use `firebase deploy` after building
- **Any web server**: Serve the `dist` folder as static files

### Environment Variables

The build process supports several environment variables:

- `VITE_BASE_PATH` or `BASE_PATH` – Override the base path (auto-detected for GitHub Pages if unset)
- `GITHUB_REPOSITORY` – Used for automatic base path detection in CI/CD
- `GEMINI_API_KEY` – Placeholder for optional future AI features (currently unused)

## How It Works

### Automatic Route Generation

The platform automatically scans `content/pages/` (current version) and `content/versions/<label>/` (archived) and generates static React Router routes:

1. **File Structure Mapping**: Each `.mdx` file becomes a route (with clean slug normalization)
2. **Nested Routing**: Folder structure creates nested routes
3. **Index Files**: `index.mdx` collapse to their parent path (e.g. `guides/index.mdx` -> `/guides/`)
4. **Dynamic Import**: MDX files are code-split and lazily imported for performance
5. **Version Metadata**: Each generated route gets a `version` field (current or archived label)

### Build Process

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

### Performance Optimizations

- **Code Splitting**: Automatic chunking by vendor, MDX, and Prism libraries
- **Static Generation**: Pre-rendered HTML for fast initial loads
- **Optimized Assets**: Hashed filenames for optimal caching
- **Tree Shaking**: Dead code elimination in production builds

## Customization

### Site Configuration & Feature Flags

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

### Components

You can customize or add new React components:

- Modify existing components in the `components/` directory
- Create custom MDX components in `components/MDXWrapper.tsx`
- Add new layout components for different page types
- Extend the search functionality in `components/Search.tsx`

### Configuration

- `vite.config.ts` - Vite configuration, base path handling, and build optimization
- `package.json` - Dependencies, scripts, and project metadata
- `tsconfig.json` - TypeScript configuration
- Base path is automatically handled for different deployment environments

### Content Customization

- **Frontmatter Options**: Extend frontmatter schema for additional metadata
- **Custom MDX Components**: Add reusable components for documentation
- **Search Configuration**: Modify search indexing behavior
- **Navigation Ordering**: Use `order` field in frontmatter to control navigation

## Architecture

### Technology Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite with React SSG plugin
- **Styling**: Tailwind CSS with Typography plugin
- **Routing**: React Router with static generation
- **Content**: MDX with frontmatter support
- **Code Highlighting**: Prism.js
- **Development**: Fast HMR and optimized builds

### Key Dependencies

```json
{
  "dependencies": {
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-router-dom": "^6.30.1",
    "@mdx-js/react": "^3.0.1",
    "gray-matter": "^4.0.3",
    "prismjs": "^1.30.0"
  },
  "devDependencies": {
    "vite": "^6.2.0",
    "vite-react-ssg": "^0.8.9",
    "tailwindcss": "^3.4.17",
    "@mdx-js/rollup": "^3.0.1"
  }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes and test thoroughly
4. Run type checking: `npm run type-check`
5. Submit a pull request with a clear description

### Development Guidelines

- Follow TypeScript best practices
- Use semantic commit messages
- Test your changes with both local and subfolder builds
- Update documentation when adding new features

## Troubleshooting

### Common Issues

1. **Routes not generating**: Ensure MDX files have proper frontmatter and run `npm run generate:routes`
2. **Styles not updating**: Run `npm run build:css` or use watch mode during development
3. **GitHub Pages 404**: Verify the base path is correctly set in the build process
4. **Search not working**: Check that `npm run generate:search-index` completed successfully

### Build Issues

- Clear cache: `npm run clean`
- Verify all dependencies: `npm ci`
- Check Node.js version (18+ required)

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you have questions or need help:

- Check the documentation in the `content/pages/` directory
- Open an issue on GitHub
- Contribute improvements back to the project

---

Built with ❤️ using React 19, MDX, Vite React SSG, and Tailwind CSS.
