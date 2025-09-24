import { GENERATED_SEARCH_INDEX, SearchableItem as BaseSearchableItem } from '@/generated-search-index';

interface SearchableItem extends BaseSearchableItem {
  version?: string | null;
}

export interface SearchResult {
  path: string;
  pageTitle: string;
  heading: string;
  headingId: string | null;
  snippet: string;
  score?: number;
  version?: string | null;
}

// Fallback search index (manually maintained for development/emergency use)
const FALLBACK_SEARCH_INDEX: SearchableItem[] = [
  {
    path: '/',
    pageTitle: 'Welcome to Luma Docs',
    heading: 'Welcome to Luma Docs',
    headingId: 'welcome-to-luma-docs',
    content: 'Luma Docs is a modern, fast, and beautiful documentation platform built with React, MDX, and Vite.',
    description: 'A modern documentation platform built with React and MDX'
  },
  {
    path: '/getting-started/',
    pageTitle: 'Getting Started',
    heading: 'Getting Started',
    headingId: 'getting-started',
    content: 'This guide will help you get up and running with Luma Docs quickly.',
    description: 'Learn how to get started with Luma Docs'
  },
  {
    path: '/guides/',
    pageTitle: 'Guides',
    heading: 'Guides',
    headingId: 'guides',
    content: 'Learn how to use Luma Docs effectively with our comprehensive guides.',
    description: 'Comprehensive guides for using Luma Docs'
  }
];

// Use generated index if available, otherwise fall back to manual index
const getSearchIndex = (): SearchableItem[] => {
  try {
    // Check if the generated index has meaningful content
    if (GENERATED_SEARCH_INDEX.length > 1) {
      return GENERATED_SEARCH_INDEX;
    }
  } catch (error) {
    // eslint-disable-next-line no-console -- non-fatal fallback notice
    console.warn('Failed to load generated search index, using fallback:', error);
  }
  
  return FALLBACK_SEARCH_INDEX;
};

// Create a snippet of text around the search query
const createSnippet = (text: string, query: string): string => {
  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();
  const index = textLower.indexOf(queryLower);
  
  if (index === -1) {
    return text.length > 150 ? `${text.substring(0, 150)  }...` : text;
  }

  const start = Math.max(0, index - 50);
  const end = Math.min(text.length, index + query.length + 50);

  let snippet = text.substring(start, end);
  if (start > 0) {snippet = `...${  snippet}`;}
  if (end < text.length) {snippet = `${snippet  }...`;}

  return snippet;
};

export function searchDocs(query: string): SearchResult[] {
  if (!query || query.length < 2) {return [];}
  
  const queryLower = query.toLowerCase();
  const searchIndex = getSearchIndex();
  const results: SearchResult[] = [];

  searchIndex.forEach(item => {
    const contentLower = item.content.toLowerCase();
    const headingLower = item.heading.toLowerCase();
    const titleLower = item.pageTitle.toLowerCase();
    const descriptionLower = item.description?.toLowerCase() || '';

    let score = 0;
    
    // Higher score for exact matches in titles and headings
    if (titleLower === queryLower) {score += 10;}
    else if (titleLower.includes(queryLower)) {score += 5;}
    
    if (headingLower === queryLower) {score += 8;}
    else if (headingLower.includes(queryLower)) {score += 3;}
    
    if (descriptionLower.includes(queryLower)) {score += 2;}
    if (contentLower.includes(queryLower)) {score += 1;}

    if (score > 0) {
      // derive version if present (path starts with /vX.Y/ pattern)
      let version: string | null = (item).version || null;
      if (!version) {
        const match = item.path.match(/^\/(v\d[^/]+)\//); // e.g., /v0.9/getting-started/
        if (match) { version = match[1]; }
      }
      results.push({
        path: item.path,
        pageTitle: item.pageTitle,
        heading: item.heading,
        headingId: item.headingId,
        snippet: createSnippet(item.content, query),
        score,
        version,
      });
    }
  });

  // Remove duplicates by path and heading, keeping the one with the highest score
  const uniqueResults = Array.from(
    results.reduce((map, item) => {
      const key = `${item.path}-${item.heading}`;
      if (!map.has(key) || (map.get(key)?.score ?? 0) < (item.score ?? 0)) {
        map.set(key, item);
      }
      return map;
    }, new Map<string, SearchResult>()).values()
  );

  return uniqueResults
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, 20);
}