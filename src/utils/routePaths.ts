// TypeScript-friendly re-exports of build shared helpers.
// The underlying implementation lives in src/tools/shared/route-paths.js so that
// Node build scripts (which are plain JS) and runtime (TS/React) share one source.
// Keep any logic changes in that file; this is a thin typed surface.

export {
  ensureLeadingSlash,
  ensureTrailingSlash,
  stripTrailingSlash,
  pathToSlug,
  slugToRoutePath,
  normalizeRoutePath,
  mdxFileToSlugAndPath
} from '../tools/shared/route-paths.js';

export type SlugAndPath = { slug: string; path: string };