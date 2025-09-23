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

  
Environment-based alternatives (legacy scripts removed):
- Subfolder dev: `VITE_FORCE_BASE=/your-repo/ npm run dev`
- Subfolder build: `VITE_FORCE_BASE=/your-repo/ npm run build`
- (Use env) Subfolder dev: `VITE_FORCE_BASE=/your-repo/ npm run dev`
- (Use env) Subfolder build: `VITE_FORCE_BASE=/your-repo/ npm run build`
│   ├── resolve-base-path.mjs # Base path + site URL resolver
      - name: Build (subfolder aware)
        env:
          VITE_FORCE_BASE: ${{ steps.base.outputs.base }}
          GITHUB_REPOSITORY: ${{ github.repository }}
        run: npm run build
```bash
# Build with automatic detection (CI) or force locally
VITE_FORCE_BASE=/your-repo/ npm run build

# Root deployment (custom domain or *.github.io repo)
VITE_FORCE_BASE=/ npm run build
```
You can use standard Markdown syntax and React components.
```

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
} from "../components";
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

- `npm run dev` - Start development server with hot reload (includes route generation and CSS build)
- `npm run build` - Build for production (includes route generation, CSS build, search index, and sitemap)
- `npm run preview` - Preview production build locally
  
Environment-based alternatives (legacy scripts removed):
- Subfolder dev: `VITE_FORCE_BASE=/your-repo/ npm run dev`
- Subfolder build: `VITE_FORCE_BASE=/your-repo/ npm run build`
- `npm run preview:resolved` - Preview using dynamically resolved base path (preferred)
- `npm run generate:routes` - Generate routes from MDX files in pages directory
- `npm run build:css` - Build Tailwind CSS from source
- `npm run build:css:watch` - Watch mode for CSS development
- `npm run generate:search-index` - Generate search index from MDX content
- `npm run generate:sitemap` - Generate sitemap.xml for SEO
- `npm run clean` - Clean build artifacts and cache
- `npm run lint` - Run ESLint code quality checks
- `npm run lint:fix` - Run ESLint with automatic fixing
- `npm run type-check` - Run TypeScript type checking

### Unified Base Path Handling

Base path detection (root vs subfolder like `/luma-docs/`) is now centralized in `scripts/resolve-base-path.mjs` and consumed directly by `vite.config.ts`, build scripts, runtime helpers, and the sitemap generator.

Resolution priority (first match wins):
1. `VITE_FORCE_BASE` – explicit override (e.g. `/docs/` or `/preview/`)
2. `VITE_BASE_PATH` – externally provided resolved base
3. `GITHUB_REPOSITORY` – if repository ends with `.github.io` => root `/`; else `/<repo>/`
4. Git remote `origin` – same logic as above (local dev convenience)
5. Fallback `/`

All returned values are normalized to begin with `/` and (if not root) end with `/`.

Runtime: `getBasePath()` (in `utils/basePath.ts`) simply returns the build-time value; `createPath()` prefixes internal links safely.

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

### Project Structure (Simplified)

```
├── components/              # React components
│   ├── Layout.tsx          # Main layout component with navigation
│   ├── Sidebar.tsx         # Navigation sidebar with auto-generated menu
│   ├── MDXWrapper.tsx      # MDX provider wrapper with custom components
│   ├── MDXPage.tsx         # Page wrapper component for SEO integration
│   ├── SEO.tsx             # Dynamic SEO meta tags & JSON-LD component
│   ├── Breadcrumbs.tsx     # Breadcrumb navigation & schema support
│   ├── Search.tsx          # Search functionality component
│   ├── OnThisPage.tsx      # Table of contents component
│   └── VersionBadge.tsx    # Version display component
├── pages/                  # MDX content files (auto-scanned for routes)
│   ├── index.mdx          # Home page (/)
│   ├── getting-started.mdx # /getting-started
│   └── guides/            # Nested pages (/guides/*)
│       ├── index.mdx      # /guides
│       └── advanced.mdx   # /guides/advanced
├── scripts/               # Build and utility scripts
│   ├── generate-routes.js    # Auto-generates routes from pages directory
│   ├── generate-search-index.js # Creates search index from MDX content
│   ├── generate-sitemap.js   # Creates sitemap.xml
│   ├── resolve-base-path.mjs # Base path + site URL resolver
├── src/
│   ├── generated-routes.tsx    # Auto-generated route definitions
│   ├── generated-search-index.ts # Auto-generated search index
│   └── styles/
│       └── input.css          # Tailwind CSS entry point
├── utils/                     # Utility functions
│   ├── search.ts             # Search functionality
│   └── basePath.ts           # Base path utilities for deployment
├── config.ts                  # Site configuration file
├── public/                   # Static assets
│   ├── index.css            # Generated Tailwind CSS
│   ├── sitemap.xml          # Generated sitemap
│   └── robots.txt           # SEO robots file
└── dist/                    # Build output (generated)
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

The platform automatically scans the `pages` directory and generates routes:

1. **File Structure Mapping**: Each `.mdx` file becomes a route
2. **Nested Routing**: Folder structure creates nested routes
3. **Index Files**: `index.mdx` files map to the parent directory route
4. **Dynamic Import**: Routes are dynamically imported for optimal performance

### Build Process

The build system follows this sequence (as executed by `npm run build`):

1. **Route Generation** (`generate:routes`) – Scans `pages/` and creates `src/generated-routes.tsx` (frontmatter + SEO metadata extracted)
2. **CSS Build** (`build:css`) – Compiles Tailwind CSS from `src/styles/input.css`
3. **Search Index** (`generate:search-index`) – Extracts content and creates the search index
4. **Sitemap Generation** (`generate:sitemap`) – Creates SEO-friendly `sitemap.xml`
5. **Vite SSG Build** – Generates static HTML with React hydration & embedded meta tags via the `SEO` component

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

- Check the documentation in the `pages/` directory
- Open an issue on GitHub
- Contribute improvements back to the project

---

Built with ❤️ using React 19, MDX, Vite React SSG, and Tailwind CSS.
