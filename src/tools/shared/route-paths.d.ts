export function ensureLeadingSlash(str: string): string;
export function ensureTrailingSlash(slug: string): string;
export function stripTrailingSlash(p: string): string;
export function pathToSlug(filePath: string): string;
export function slugToRoutePath(slug: string): string;
export function normalizeRoutePath(p: string): string;
export function mdxFileToSlugAndPath(fileRelative: string, versionPrefix?: string): { slug: string; path: string };
