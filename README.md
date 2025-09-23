# Luma Docs

A modern, fast, and beautiful documentation platform built with React 19, MDX, Vite React SSG, and Tailwind CSS. Perfect for creating documentation websites that are both developer-friendly and user-friendly with automatic route generation, search functionality, and optimized deployment workflows.

## Features

- **React 19** with TypeScript for modern development
- **MDX Support**: Write content in MDX format with the full power of React components
- **Comprehensive SEO**: Dynamic meta tags, Open Graph, Twitter Cards, JSON-LD structured data, and automatic sitemap generation
- **Automatic Routing**: Pages are automatically added to routes based on file structure using `vite-react-ssg`
- **Fast Static Generation**: Built with Vite React SSG for lightning-fast performance and SEO optimization
- **GitHub Pages Ready**: Optimized for deployment on GitHub Pages with intelligent subfolder support
- **Beautiful Design**: Clean, responsive design with excellent typography using Tailwind CSS
- **Search Functionality**: Built-in search index generation to help users find content quickly
- **Table of Contents**: Automatic table of contents generation from headings with smooth scrolling
- **Mobile Responsive**: Fully responsive design that works perfectly on all devices
- **Code Highlighting**: Prism.js integration for beautiful syntax highlighting
- **SEO Optimized**: Automatic sitemap.xml generation, meta tags, and structured data for better search rankings
- **Performance Optimized**: Code splitting, lazy loading, and optimized bundle sizes

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd luma-docs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Generate routes and start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to see your documentation site.

## Creating Content

### File Structure

Content is organized in the `pages` directory:

```
pages/
├── index.mdx           # Home page (/)
├── getting-started.mdx # /getting-started/
└── guides/
    ├── index.mdx       # /guides/
    └── advanced.mdx    # /guides/advanced/
```

### MDX Files

Each MDX file should include frontmatter to specify metadata:

```yaml
---
title: "Page Title"
description: "Page description for SEO"
order: 1
---

# Your Content Here

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
ogType: "article"  # or "website"
twitterCard: "summary_large_image"  # or "summary"
twitterCreator: "@yourusername"
twitterSite: "@yoursite"
author: "Author Name"
publishedTime: "2024-01-01T00:00:00Z"
modifiedTime: "2024-01-15T10:00:00Z"
section: "Your Section"
tags: ["tag1", "tag2", "tag3"]  # Array or comma-separated string
canonical: "/your-canonical-url/"
robots: "index, follow"  # or use noindex: true
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

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload (includes route generation and CSS build)
- `npm run dev:subfolder` - Start development server configured for subfolder deployment
- `npm run build` - Build for production (includes route generation, CSS build, search index, and sitemap)
- `npm run build:subfolder` - Build for subfolder deployment (GitHub Pages)
- `npm run preview` - Preview production build locally
- `npm run preview:subfolder` - Preview subfolder build locally
- `npm run generate:routes` - Generate routes from MDX files in pages directory
- `npm run build:css` - Build Tailwind CSS from source
- `npm run build:css:watch` - Watch mode for CSS development
- `npm run generate:search-index` - Generate search index from MDX content
- `npm run generate:sitemap` - Generate sitemap.xml for SEO
- `npm run deploy:gh-pages` - Deploy to GitHub Pages using the deployment script
- `npm run clean` - Clean build artifacts and cache
- `npm run type-check` - Run TypeScript type checking

### Project Structure

```
├── components/              # React components
│   ├── Layout.tsx          # Main layout component with navigation
│   ├── Sidebar.tsx         # Navigation sidebar with auto-generated menu
│   ├── MDXWrapper.tsx      # MDX provider wrapper with custom components
│   ├── MDXPage.tsx         # Page wrapper component for SEO integration
│   ├── SEO.tsx             # Dynamic SEO meta tags component
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
│   ├── build-subfolder.sh   # GitHub Pages subfolder build script
│   ├── dev-subfolder.sh     # Development server for subfolder testing
│   └── deploy-gh-pages.sh   # Deployment automation script
├── src/
│   ├── generated-routes.tsx    # Auto-generated route definitions
│   ├── generated-search-index.ts # Auto-generated search index
│   └── styles/
│       └── input.css          # Tailwind CSS entry point
├── utils/                     # Utility functions
│   ├── generateRoutes.ts      # Route generation logic
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

The site is optimized for GitHub Pages deployment with intelligent subfolder support:

1. **Automated Deployment**
   ```bash
   npm run deploy:gh-pages
   ```
   This script automatically builds and deploys to GitHub Pages.

2. **Manual Deployment**
   ```bash
   # Build with automatic base path detection
   npm run build:subfolder
   
   # Or specify repository name manually
   ./scripts/build-subfolder.sh your-repo-name
   ```

3. **GitHub Actions** (Recommended for production)
   Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - name: Setup Node.js
           uses: actions/setup-node@v4
           with:
             node-version: '18'
             cache: 'npm'
         - run: npm ci
         - run: npm run build:subfolder
         - name: Deploy to GitHub Pages
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

### Other Platforms

The built site in the `dist` folder can be deployed to any static hosting service:

- **Vercel**: Connect your repository and deploy automatically
- **Netlify**: Drag and drop the `dist` folder or connect via Git
- **AWS S3**: Upload the `dist` folder contents to an S3 bucket
- **Firebase Hosting**: Use `firebase deploy` after building
- **Any web server**: Serve the `dist` folder as static files

### Environment Variables

The build process supports several environment variables:

- `VITE_BASE_PATH` or `BASE_PATH`: Override the base path for deployment
- `GITHUB_REPOSITORY`: Used for automatic base path detection in CI/CD
- `GEMINI_API_KEY`: If using AI features (optional)

## How It Works

### Automatic Route Generation

The platform automatically scans the `pages` directory and generates routes:

1. **File Structure Mapping**: Each `.mdx` file becomes a route
2. **Nested Routing**: Folder structure creates nested routes
3. **Index Files**: `index.mdx` files map to the parent directory route
4. **Dynamic Import**: Routes are dynamically imported for optimal performance

### Build Process

The build system follows this sequence:

1. **Route Generation** (`generate:routes`): Scans `pages/` and creates `src/generated-routes.tsx` with SEO metadata extraction
2. **CSS Build** (`build:css`): Compiles Tailwind CSS from `src/styles/input.css`
3. **Search Index** (`generate:search-index`): Extracts content and creates searchable index
4. **Sitemap Generation** (`generate:sitemap`): Creates SEO-friendly sitemap.xml with all pages
5. **Vite SSG Build**: Generates static HTML files with React hydration and embedded SEO meta tags

### SEO Integration

The SEO system works through multiple integrated components:

- **Frontmatter Extraction**: The route generation script extracts all SEO metadata from MDX frontmatter
- **SEO Component**: A React component that renders meta tags using `vite-react-ssg`'s `<Head>` component
- **Static Generation**: During SSG build, all meta tags are included in the static HTML files
- **Dynamic Override**: Inline `<SEO>` components can override frontmatter values for specific content sections
- **Structured Data**: Automatic JSON-LD generation for both website and article content types
- **Canonical URLs**: Automatic canonical URL generation with proper base path handling for different deployment environments

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

### Site Configuration

The site configuration is centralized in `config.ts`. Update this file to customize your site:

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