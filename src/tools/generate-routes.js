import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import matter from 'gray-matter';

import { mdxFileToSlugAndPath } from './shared/route-paths.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getMdxFiles(dir, baseDir = '') {
  const files = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const relativePath = path.join(baseDir, item);
    
    if (fs.statSync(fullPath).isDirectory()) {
      files.push(...getMdxFiles(fullPath, relativePath));
    } else if (item.endsWith('.mdx')) {
      files.push(relativePath);
    }
  }

  return files;
}

function processDir(contentDir, versionPrefix = '', versionLabel, importRoot) {
  if (!fs.existsSync(contentDir)) { return []; }
  const mdxFiles = getMdxFiles(contentDir);
  const routes = [];

  for (const file of mdxFiles) {
    const fullPath = path.join(contentDir, file);
    const content = fs.readFileSync(fullPath, 'utf-8');
    const { data: frontmatter } = matter(content);

    const { slug, path: routePath } = mdxFileToSlugAndPath(file, versionPrefix);

  // Preserve original relative structure under either content/pages/ or content/versions/<version>/
    const componentPath = `${importRoot}/${file}`.replace(/\\/g, '/');

    const meta = {
      title: frontmatter.title || path.basename(file, '.mdx'),
      description: frontmatter.description,
      order: frontmatter.order || 0,
      path: routePath,
      slug,
      keywords: frontmatter.keywords,
      canonical: frontmatter.canonical,
      ogImage: frontmatter.ogImage,
      ogType: frontmatter.ogType || 'website',
      twitterCard: frontmatter.twitterCard || 'summary_large_image',
      twitterCreator: frontmatter.twitterCreator,
      twitterSite: frontmatter.twitterSite,
      author: frontmatter.author,
      publishedTime: frontmatter.publishedTime || frontmatter.published || frontmatter.date,
      modifiedTime: frontmatter.modifiedTime || frontmatter.modified || frontmatter.updated,
      robots: frontmatter.robots,
      noindex: frontmatter.noindex === true || frontmatter.noindex === 'true',
      section: frontmatter.section || frontmatter.category,
      tags: Array.isArray(frontmatter.tags)
        ? frontmatter.tags
        : (typeof frontmatter.tags === 'string' ? frontmatter.tags.split(',').map(t => t.trim()) : undefined)
    };

    routes.push({
      path: routePath,
      slug,
      component: componentPath.replace(/\.mdx$/, '.mdx'),
      meta: { ...meta, version: versionLabel }
    });
  }
  return routes;
}

function extractCurrentVersionLabel(baseDir) {
  try {
    const source = fs.readFileSync(path.join(baseDir, '../../config.ts'), 'utf8');
    const match = source.match(/versions\s*:\s*{[\s\S]*?current:\s*"([^"]+)"/);
    return match ? match[1] : 'next';
  } catch {
    return 'next';
  }
}

function generateRoutes(baseDir) {
  // Updated for new content/ folder structure.
  const currentDir = path.join(baseDir, '../../content/pages');
  const versionsDir = path.join(baseDir, '../../content/versions');
  const allRoutes = [];
  const currentVersionLabel = extractCurrentVersionLabel(baseDir);

  // Root pages use configured current version label
  allRoutes.push(...processDir(currentDir, '', currentVersionLabel, 'content/pages'));

  if (fs.existsSync(versionsDir)) {
    const versionFolders = fs.readdirSync(versionsDir).filter(f => fs.statSync(path.join(versionsDir, f)).isDirectory());
    for (const folder of versionFolders) {
    const dir = path.join(versionsDir, folder);
    allRoutes.push(...processDir(dir, `/${folder}/`, folder, `content/versions/${folder}`));
    }
  }

  // Sort: current version first, then descending semantic version for archived
  const semver = (v) => {
    const n = (v || '').replace(/^v/, '').split('.').map(x => parseInt(x, 10) || 0);
    while (n.length < 3) { n.push(0); }
    return n;
  };
  allRoutes.sort((a, b) => {
    if (a.meta.version !== b.meta.version) {
      if (a.meta.version === currentVersionLabel) { return -1; }
      if (b.meta.version === currentVersionLabel) { return 1; }
      const sa = semver(a.meta.version);
      const sb = semver(b.meta.version);
      // descending
      for (let i = 0; i < 3; i++) {
        if (sa[i] !== sb[i]) { return sb[i] - sa[i]; }
      }
    }
    const orderA = a.meta.order || 0;
    const orderB = b.meta.order || 0;
    if (orderA !== orderB) { return orderA - orderB; }
    return a.path.localeCompare(b.path);
  });

  return allRoutes;
}

function generateRouteFile(routes, outputPath) {
  const imports = routes.map((route, index) => `import Page${index} from '../${route.component}';`).join('\n');

  const routeObjects = routes.map((route, index) => {
    const hasTrailingSlash = route.slug !== '/' && route.slug.endsWith('/');
    
    return `  {
    path: '${route.path}${hasTrailingSlash ? '/' : ''}',
    element: <Page${index} />,
    meta: ${JSON.stringify(route.meta, null, 6).replace(/\n/g, '\n    ')}
  }`;
  }).join(',\n');

  // Add redirects for trailing slash consistency
  const redirects = routes
    .filter(route => route.slug !== '/' && route.slug.endsWith('/'))
    .map(route => `  {
    path: '${route.path}',
    element: <Navigate to="${route.path}/" replace />,
    meta: { path: '${route.path}', slug: '${route.slug}', title: ${JSON.stringify(route.meta.title || route.slug)}, ogType: 'website' }
  }`).join(',\n');

  const fileContent = [
    '// This file is auto-generated. Do not edit manually.',
    '// Regenerate via: npm run generate:routes',
    '// NOTE: types directory lives at src/types relative to this generated file (src/).',
    "import { Navigate } from 'react-router-dom';",
    "import type { ReactNode } from 'react';",
    "import type { RouteMeta } from './types/route-meta';",
    imports,
    '',
    'export interface RouteDefinition { path: string; element: ReactNode; meta: RouteMeta; }',
    '',
    'export const routes: RouteDefinition[] = [',
  `${routeObjects}${redirects ? `,\n${redirects}` : ''}`,
    '];',
    '',
    'export const routeMeta: RouteMeta[] = [',
  routes.map(route => `  ${JSON.stringify(route.meta)}`).join(',\n'),
    '];',
    ''
  ].join('\n');

  fs.writeFileSync(outputPath, fileContent, 'utf-8');
  // Also emit a lightweight meta-only module for tests (no MDX imports).
  const metaOnlyPath = outputPath.replace(/\.tsx$/, '.meta.ts');
  const metaModule = `// Auto-generated meta-only route data (no component imports)\n` +
    `import type { RouteMeta } from './types/route-meta';\n` +
    `export const routeMeta: RouteMeta[] = ${JSON.stringify(routes.map(r => r.meta), null, 2)};\n`;
  fs.writeFileSync(metaOnlyPath, metaModule, 'utf-8');
  console.log(`Generated routes file: ${outputPath}`);
}

const baseDir = __dirname; 
// tools relocated under src/tools so generated artifacts reside one directory up
const outputPath = path.join(__dirname, '../generated-routes.tsx');

try {
  const routes = generateRoutes(baseDir);
  generateRouteFile(routes, outputPath);
  console.log(`✅ Generated ${routes.length} routes`);
} catch (error) {
  console.error('❌ Error generating routes:', error);
  process.exit(1);
}