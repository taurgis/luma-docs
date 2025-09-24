import matter from 'gray-matter';
import { z } from 'zod';

export const FrontmatterSchema = z.object({
  title: z.string().min(1).max(120).optional(),
  description: z.string().min(10).max(260).optional(),
  order: z.number().int().nonnegative().optional(),
  noindex: z.boolean().optional(),
  keywords: z.string().max(400).optional(),
  ogType: z.enum(['website','article']).optional(),
  twitterCard: z.enum(['summary','summary_large_image']).optional(),
  publishedTime: z.string().optional(),
  modifiedTime: z.string().optional(),
  // Additional optional SEO / metadata fields actually used in content
  author: z.string().max(120).optional(),
  canonical: z.string().max(260).optional(),
  twitterCreator: z.string().max(60).optional(),
  twitterSite: z.string().max(60).optional(),
  robots: z.string().max(120).optional(),
  section: z.string().max(80).optional(),
  tags: z.union([
    z.array(z.string().min(1).max(40)).max(25),
    z.string().max(400) // allow comma separated list fallback
  ]).optional(),
}).strip();

export type Frontmatter = z.infer<typeof FrontmatterSchema>;

export function parseAndValidateFrontmatter(mdxSource: string) {
  const parsed = matter(mdxSource);
  const result = FrontmatterSchema.safeParse(parsed.data);
  return { result, data: parsed.data };
}
