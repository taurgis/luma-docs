// Shared route/slug normalization helpers
// Design goals:
//  - Single source of truth for slug (always trailing slash except root) vs path (never trailing slash except root)
//  - Reusable by both Node build scripts (JS) and runtime (TS/React)
//  - Avoid TypeScript compilation requirement for build scripts

/** Ensure value starts with single leading slash */
function ensureLeadingSlash(str) {
  if (!str.startsWith('/')) {
    return `/${str}`;
  }
  return str;
}

/** Ensure a slug has trailing slash unless it is root '/' */
function ensureTrailingSlash(slug) {
  if (slug === '/') {
    return '/';
  }
  return slug.endsWith('/') ? slug : `${slug}/`;
}

/** Remove trailing slash from a path (except if it is root '/') */
function stripTrailingSlash(p) {
  if (p === '/') {
    return '/';
  }
  return p.endsWith('/') ? p.slice(0, -1) : p;
}

/** Convert an MDX file relative path to a canonical slug (trailing slash) */
function pathToSlug(filePath) {
  const withoutExt = filePath.replace(/\.mdx$/i, '');
  const parts = withoutExt.split(/[/\\]/).filter(Boolean);
  if (parts.length === 0) {
    return '/';
  }
  const last = parts[parts.length - 1];
  if (last === 'index') {
    parts.pop();
  }
  if (parts.length === 0) {
    return '/';
  }
  return ensureTrailingSlash(`/${parts.join('/')}`);
}

/** Convert a slug back to its route path form (no trailing slash) */
function slugToRoutePath(slug) {
  if (slug === '/') {
    return '/';
  }
  return stripTrailingSlash(slug);
}

/** Normalize an arbitrary input path into route path form (no trailing slash except root) */
function normalizeRoutePath(p) {
  if (!p) {
    return '/';
  }
  const withSlash = ensureLeadingSlash(p.trim());
  if (withSlash === '/' || withSlash === '//') {
    return '/';
  }
  return stripTrailingSlash(withSlash.replace(/\/+/, '/'));
}

/** Determine slug + route path for an MDX file plus optional version prefix */
function mdxFileToSlugAndPath(fileRelative, versionPrefix = '') {
  const baseSlug = pathToSlug(fileRelative);
  const basePath = slugToRoutePath(baseSlug);
  if (!versionPrefix) {
    return { slug: baseSlug, path: basePath };
  }
  // versionPrefix is expected like '/v0.9/' or '/v0.9/' - we normalize
  const vp = ensureLeadingSlash(versionPrefix).replace(/\/$/, '');
  if (baseSlug === '/') {
    return { slug: `${vp}/`, path: vp }; // version root
  }
  const slug = `${vp}${baseSlug}`.replace(/\/+/, '/');
  const routePath = `${vp}${basePath}`.replace(/\/+/, '/');
  return { slug: ensureTrailingSlash(slug), path: stripTrailingSlash(routePath) };
}

export {
  ensureLeadingSlash,
  ensureTrailingSlash,
  stripTrailingSlash,
  pathToSlug,
  slugToRoutePath,
  normalizeRoutePath,
  mdxFileToSlugAndPath
};
