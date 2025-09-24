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
}).strip();

export type Frontmatter = z.infer<typeof FrontmatterSchema>;

export function parseAndValidateFrontmatter(mdxSource: string) {
  const parsed = matter(mdxSource);
  const result = FrontmatterSchema.safeParse(parsed.data);
  return { result, data: parsed.data };
}
