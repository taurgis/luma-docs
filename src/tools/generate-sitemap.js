#!/usr/bin/env node

/**
 * Sitemap Generator for Luma Docs Template
 *
 * This script generates an XML sitemap for the documentation site.
 * It dynamically reads routes from the generated routes file and supports
 * both root and subfolder deployments.
 *
 * Usage: node src/tools/generate-sitemap.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { resolveBasePath, resolveSiteUrl } from './resolve-base-path.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve base path & site URL (custom domain aware)
const resolvedBasePath = resolveBasePath();
let siteUrl = resolveSiteUrl();
// If user mistakenly appended base path to siteUrl, de-dupe.
if (resolvedBasePath !== '/') {
  const withoutTrailing = resolvedBasePath.replace(/\/$/, '');
  if (siteUrl.endsWith(withoutTrailing)) {
    siteUrl = siteUrl.slice(0, -withoutTrailing.length).replace(/\/$/, '');
  }
}

// Configuration
const config = {
  baseUrl: siteUrl, // root domain (no subfolder)
  basePath: resolvedBasePath, // subfolder (possibly '/')
  defaultPriority: '0.8',
  defaultChangefreq: 'monthly',
  priorityOverrides: {
    '/': { priority: '1.0', changefreq: 'weekly' },
    '/getting-started/': { priority: '0.9', changefreq: 'monthly' },
    '/guides/': { priority: '0.8', changefreq: 'monthly' },
  }
};

const currentDate = new Date().toISOString().split('T')[0];

/**
 * Normalize URL path to ensure trailing slash for GitHub Pages compatibility
 * Exception: files (like sitemap.xml) should not have trailing slashes
 */
function normalizeUrlPath(path) {
  if (path === '/') {return path;}
  
  // Don't add trailing slash to files
  if (path.includes('.')) {
    return path.startsWith('/') ? path : `/${  path}`;
  }
  
  // Add trailing slash to directory paths
  return path.endsWith('/') ? path : `${path}/`;
}

/**
 * Build full URL with normalized path and base path
 */
function buildFullUrl(baseUrl, basePath, routePath) {
  const normalizedPath = normalizeUrlPath(routePath);
  
  // Handle base path
  let fullPath;
  if (basePath === '/') {
    fullPath = normalizedPath;
  } else {
    const cleanBasePath = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
    if (normalizedPath === '/') {
      fullPath = `${cleanBasePath  }/`;
    } else if (normalizedPath.startsWith('/')) {
      fullPath = cleanBasePath + normalizedPath;
    } else {
      fullPath = `${cleanBasePath  }/${  normalizedPath}`;
    }
  }
  
  return baseUrl + fullPath;
}

/**
 * Load routes from the generated routes file
 */
function loadRoutes() {
  try {
  const routesPath = path.join(__dirname, '..', 'generated-routes.tsx'); // generated file lives in src/
    const routesContent = fs.readFileSync(routesPath, 'utf8');
    
  // Extract routeMeta array using regex (allow optional type annotation e.g. ': RouteMeta[]')
  const routeMetaMatch = routesContent.match(/export const routeMeta(?:\s*:\s*[^=]+)?\s*=\s*(\[[\s\S]*?\]);/);
    if (!routeMetaMatch) {
      throw new Error('Could not find routeMeta in generated-routes.tsx');
    }
    
    // Parse the route metadata
    const routeMetaString = routeMetaMatch[1];
    const routeMeta = JSON.parse(routeMetaString);
    
    console.log(`📖 Found ${routeMeta.length} routes in generated-routes.tsx`);
    
    return routeMeta.map(route => ({
      path: route.slug || route.path,
      title: route.title,
      description: route.description,
      order: route.order || 0
    }));
    
  } catch (error) {
    console.error('❌ Error loading routes:', error.message);
    console.log('💡 Using fallback routes...');
    
    // Fallback routes if the generated file is not available
    return [
      {
        path: '/',
        title: 'Home',
        description: 'Welcome to Luma Docs',
        order: 1
      },
      {
        path: '/getting-started/',
        title: 'Getting Started',
        description: 'Learn how to get started',
        order: 2
      },
      {
        path: '/guides/',
        title: 'Guides',
        description: 'Comprehensive guides',
        order: 3
      }
    ];
  }
}

/**
 * Generate sitemap pages with priorities and frequencies
 */
function generatePages() {
  const routes = loadRoutes();
  
  return routes.map(route => {
    // Get priority and changefreq from overrides or use defaults
    const override = config.priorityOverrides[route.path] || {};
    
    // Calculate priority based on order and overrides
    let priority = override.priority || config.defaultPriority;
    if (!override.priority && route.order) {
      // Higher order (lower number) gets higher priority
      priority = Math.max(0.5, 1.0 - (route.order - 1) * 0.1).toFixed(1);
    }
    
    return {
      path: route.path,
      priority,
      changefreq: override.changefreq || config.defaultChangefreq,
      description: route.title || route.description || `${route.path} page`,
      title: route.title
    };
  });
}

function generateSitemap() {
  const pages = generatePages();
  
  const header = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`;

  const footer = `
</urlset>`;

  const urls = pages.map(page => {
    const url = buildFullUrl(config.baseUrl, config.basePath, page.path);
    return `    
    <!-- ${page.description} -->
    <url>
        <loc>${url}</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>${page.changefreq}</changefreq>
        <priority>${page.priority}</priority>
    </url>`;
  }).join('');

  return header + urls + footer;
}

function generateRobotsTxt() {
  const sitemapUrl = buildFullUrl(config.baseUrl, config.basePath, 'sitemap.xml');
  
  return `User-agent: *
Allow: /

# Sitemap
Sitemap: ${sitemapUrl}

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Allow all common search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

User-agent: DuckDuckBot
Allow: /

# Block certain paths if needed
# Disallow: /temp/
# Disallow: /private/`;
}

// Generate files
console.log('🚀 Generating sitemap and robots.txt...');
console.log(`🌐 Base URL: ${config.baseUrl}`);
console.log(`📁 Base Path: ${config.basePath}`);

const pages = generatePages();
const sitemap = generateSitemap();
const robots = generateRobotsTxt();

// Write files
// Public assets directory (moved under src/public for co-location with sources)
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots);

console.log('✅ Sitemap and robots.txt generated successfully!');
console.log(`📄 Generated ${pages.length} URLs in sitemap.xml`);
console.log('🤖 Updated robots.txt with sitemap reference');
console.log(`📅 Last modified: ${currentDate}`);

// Also log the pages for verification
console.log('\n📋 Pages included in sitemap:');
pages.forEach(page => {
  const url = buildFullUrl(config.baseUrl, config.basePath, page.path);
  console.log(`   ${url} (Priority: ${page.priority}, ${page.changefreq})`);
});

console.log('\n💡 Configuration tips:');
console.log('   - Set SITE_URL environment variable for production URL');
console.log('   - Set VITE_BASE_PATH for subfolder deployments (e.g., /luma-docs/)');
console.log('   - Customize priorityOverrides in the script for specific pages');