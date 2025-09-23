import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface PageMeta {
  title?: string;
  description?: string;
  order?: number;
  path: string;
  slug: string;
}

export interface RouteInfo {
  path: string;
  slug: string;
  component: string;
  meta: PageMeta;
}

function getMdxFiles(dir: string, baseDir: string = ''): string[] {
  const files: string[] = [];
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

function pathToSlug(filePath: string): string {
  const pathWithoutExt = filePath.replace(/\.mdx$/, '');
  const parts = pathWithoutExt.split(path.sep);
  
  // Convert index files to parent directory name
  if (parts[parts.length - 1] === 'index') {
    parts.pop();
  }
  
  // If no parts left, it's the root index
  if (parts.length === 0) {
    return '/';
  }
  
  return '/' + parts.join('/') + '/';
}

function slugToRoutePath(slug: string): string {
  if (slug === '/') return slug;
  return slug.endsWith('/') ? slug.slice(0, -1) : slug;
}

export function generateRoutes(pagesDir: string): RouteInfo[] {
  if (!fs.existsSync(pagesDir)) {
    console.warn(`Pages directory ${pagesDir} does not exist`);
    return [];
  }

  const mdxFiles = getMdxFiles(pagesDir);
  const routes: RouteInfo[] = [];

  for (const file of mdxFiles) {
    const fullPath = path.join(pagesDir, file);
    const content = fs.readFileSync(fullPath, 'utf-8');
    const { data: frontmatter } = matter(content);
    
    const slug = pathToSlug(file);
    const routePath = slugToRoutePath(slug);
    
    // Convert file path to component import path
    const componentPath = file.replace(/\.mdx$/, '.mdx').replace(/\\/g, '/');
    
    const meta: PageMeta = {
      title: frontmatter.title || path.basename(file, '.mdx'),
      description: frontmatter.description,
      order: frontmatter.order || 0,
      path: routePath,
      slug
    };

    routes.push({
      path: routePath,
      slug,
      component: componentPath,
      meta
    });
  }

  // Sort routes by order, then by path
  routes.sort((a, b) => {
    const orderA = a.meta.order || 0;
    const orderB = b.meta.order || 0;
    
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    
    return a.path.localeCompare(b.path);
  });

  return routes;
}

export function generateRouteFile(routes: RouteInfo[], outputPath: string): void {
  const imports = routes.map((route, index) => 
    `import Page${index} from '../pages/${route.component}';`
  ).join('\n');

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
    element: <Navigate to="${route.path}/" replace />
  }`).join(',\n');

  const fileContent = `// This file is auto-generated. Do not edit manually.
import React from 'react';
import { Navigate } from 'react-router-dom';
${imports}

export const routes = [
${routeObjects}${redirects ? ',\n' + redirects : ''}
];

export const routeMeta = [
${routes.map(route => `  ${JSON.stringify(route.meta)}`).join(',\n')}
];
`;

  fs.writeFileSync(outputPath, fileContent, 'utf-8');
  console.log(`Generated routes file: ${outputPath}`);
}