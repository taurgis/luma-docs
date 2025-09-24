// Unified SEO-only type declarations (RouteMeta remains in route-meta.ts to avoid duplication)
// Extended with a runtime Zod schema so we can validate & safely coerce potentially malformed
// frontmatter-derived metadata prior to rendering <SEO />. This helps surface content errors early
// (during tests or at runtime in development) instead of producing broken meta tags.

import { z } from 'zod';

export type OGType = 'website' | 'article';
export type TwitterCardType = 'summary' | 'summary_large_image';

// Zod schema representing the strict shape of SEOBase (kept in sync with interface via inference).
export const SEOBaseSchema = z.object({
  title: z.string().max(160).optional(),
  description: z.string().max(300).optional(),
  keywords: z.string().max(400).optional(),
  canonical: z.string().url().max(260).optional(),
  ogImage: z.string().max(400).optional(),
  ogType: z.enum(['website','article']).optional(),
  twitterCard: z.enum(['summary','summary_large_image']).optional(),
  twitterCreator: z.string().max(100).optional(),
  twitterSite: z.string().max(100).optional(),
  author: z.string().max(140).optional(),
  publishedTime: z.string().optional(),
  modifiedTime: z.string().optional(),
  robots: z.string().max(160).optional(),
  noindex: z.boolean().optional(),
  section: z.string().max(120).optional(),
  tags: z.array(z.string().min(1).max(60)).max(50).optional(),
}).strict();

export type SEOBase = z.infer<typeof SEOBaseSchema>;

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface SEOProps extends SEOBase {
  baseUrl?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export function validateSEOBase(meta: unknown): { valid: true; value: SEOBase } | { valid: false; issues: string[]; value: Partial<SEOBase> } {
  const parsed = SEOBaseSchema.safeParse(meta);
  if (parsed.success) {
    return { valid: true, value: parsed.data };
  }
  const issues = parsed.error.issues.map(i => `${i.path.join('.') || '(root)'}: ${i.message}`);
  // Provide a permissive partial fallback so the app can still render.
  return { valid: false, issues, value: (meta && typeof meta === 'object' ? meta : {}) as Partial<SEOBase> };
}

