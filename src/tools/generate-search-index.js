#!/usr/bin/env node

/**
 * Search Index Generator for Luma Docs
 *
 * This script automatically generates a search index by parsing MDX files
 * and extracting searchable content including frontmatter metadata,
 * headings, and text content.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
// Adjusted for new content/ root (content/pages & content/versions)
const PAGES_DIR = path.join(__dirname, '../../content/pages');
const VERSIONS_DIR = path.join(__dirname, '../../content/versions');
const OUTPUT_FILE = path.join(__dirname, '../generated-search-index.ts');

/**
 * Convert file path to URL path relative to a given content root directory.
 * Handles index file collapsing and guarantees leading + trailing slash (except for root).
 */
function filePathToRoute(filePath, rootDir = PAGES_DIR) {
  const relativePath = path.relative(rootDir, filePath);
  let route = relativePath.replace(/\.mdx$/, '');

  if (route === 'index') {
    route = '/';
  } else if (route.endsWith('/index')) {
    route = route.slice(0, -('/index'.length)) || '/';
  }

  if (!route.startsWith('/')) {
    route = `/${route}`;
  }
  if (route !== '/' && !route.endsWith('/')) {
    route += '/';
  }
  return route;
}

function detectVersion(filePath) {
  // If file resides under versions/<folder>/..., prefix path with that folder
  if (filePath.includes('/versions/')) {
    const parts = filePath.split(/\/|\//); // cross-platform
    const idx = parts.lastIndexOf('versions');
    if (idx >= 0 && parts[idx + 1]) {
      return parts[idx + 1];
    }
  }
  return null;
}

/**
 * Extract headings from markdown content
 */
function extractHeadings(content) {
  const headings = [];
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  let match;
  
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    headings.push({
      level,
      text,
      id,
      position: match.index
    });
  }
  
  return headings;
}

/**
 * Extract text content from markdown, removing formatting
 */
function extractTextContent(content) {
  return content
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]+`/g, ' ')
    // Remove images
    .replace(/!\[.*?\]\(.*?\)/g, ' ')
    // Remove links but keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove headings markers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove emphasis markers
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove list markers
    .replace(/^[\s]*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Parse an MDX file and extract searchable content
 */
function parseMDXFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content } = matter(fileContent);

  // Determine if versioned and compute route relative to correct root
  const version = detectVersion(filePath);
  const contentRoot = version ? path.join(VERSIONS_DIR, version) : PAGES_DIR;
  let route = filePathToRoute(filePath, contentRoot);
  if (version) {
    route = `/${version}${route}`; // ensure prefix
  }
  // Normalize any accidental path traversals (defensive)
  route = route.replace(/\/\.\.+/g, '/');
  // Remove duplicate slashes (except keep single leading)
  route = route.replace(/\/+/g, '/');
  // Ensure trailing slash (except root)
  if (route !== '/' && !route.endsWith('/')) { route += '/'; }

  const pageTitle = frontmatter.title || 'Untitled';
  const description = frontmatter.description || '';
  
  const headings = extractHeadings(content);
  const results = [];
  
  if (headings.length === 0) {
    // If no headings, create a single entry for the whole page
    const textContent = extractTextContent(content);
      results.push({
        path: route,
      pageTitle,
      heading: pageTitle,
      headingId: null,
      content: `${description} ${textContent.substring(0, 500)}`,
      description,
      version: version || null
    });
    return results;
  }
  
  // Create search entries for each section
  headings.forEach((heading, index) => {
    const nextHeading = headings[index + 1];
    const sectionStart = heading.position;
    const sectionEnd = nextHeading ? nextHeading.position : content.length;
    
    const sectionContent = content.substring(sectionStart, sectionEnd);
    const textContent = extractTextContent(sectionContent);
    
    if (textContent.trim().length > 10) {
      results.push({
        path: route,
        pageTitle,
        heading: heading.text,
        headingId: heading.id,
        content: textContent.substring(0, 300),
        description: heading.level === 1 ? description : '',
        version: version || null
      });
    }
  });
  
  return results;
}

/**
 * Recursively find all MDX files
 */
function findMDXFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

/**
 * Generate the search index
 */
function generateSearchIndex() {
  console.log('🔍 Generating search index...');
  
  if (!fs.existsSync(PAGES_DIR)) {
    console.error(`❌ Pages directory not found: ${PAGES_DIR}`);
    process.exit(1);
  }
  
  const mdxFiles = [
    ...findMDXFiles(PAGES_DIR),
    ...(fs.existsSync(VERSIONS_DIR) ? findMDXFiles(VERSIONS_DIR) : [])
  ];
  const searchIndex = [];
  
  console.log(`Found ${mdxFiles.length} MDX files to process`);
  
  for (const filePath of mdxFiles) {
    try {
      const entries = parseMDXFile(filePath);
      searchIndex.push(...entries);
      
      console.log(`  ✓ Processed ${path.relative(PAGES_DIR, filePath)} (${entries.length} entries)`);
    } catch (error) {
      console.error(`  ✗ Failed to process ${filePath}:`, error.message);
    }
  }
  
  // Sort by path and then by heading level for consistent ordering
  searchIndex.sort((a, b) => {
    if (a.path !== b.path) {
      return a.path.localeCompare(b.path);
    }
    // Put page titles (headingId === null) first
    if (a.headingId === null && b.headingId !== null) {return -1;}
    if (a.headingId !== null && b.headingId === null) {return 1;}
    return 0;
  });
  
  console.log(`Generated ${searchIndex.length} search entries`);
  
  return searchIndex;
}

/**
 * Write the generated index to a TypeScript file
 */
function writeSearchIndex(searchIndex) {
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const tsContent = `// This file is auto-generated by tools/generate-search-index.js
// Do not edit manually - changes will be overwritten during build

export interface SearchableItem {
  path: string;
  pageTitle: string;
  heading: string;
  headingId: string | null;
  content: string;
  description?: string;
  version?: string | null;
}

export const GENERATED_SEARCH_INDEX: SearchableItem[] = ${JSON.stringify(searchIndex, null, 2)};
`;
  
  fs.writeFileSync(OUTPUT_FILE, tsContent, 'utf-8');
  console.log(`✅ Search index written to ${path.relative(process.cwd(), OUTPUT_FILE)}`);
}

/**
 * Main execution
 */
function main() {
  try {
    const searchIndex = generateSearchIndex();
    writeSearchIndex(searchIndex);
    console.log('🎉 Search index generation complete!');
  } catch (error) {
    console.error('❌ Failed to generate search index:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { generateSearchIndex, writeSearchIndex };