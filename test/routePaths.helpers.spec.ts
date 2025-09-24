import { describe, it, expect } from 'vitest';

import {
  ensureLeadingSlash,
  ensureTrailingSlash,
  stripTrailingSlash,
  pathToSlug,
  slugToRoutePath,
  mdxFileToSlugAndPath
} from '../src/utils/routePaths';

describe('route path helpers', () => {
  it('ensureLeadingSlash adds slash only when missing', () => {
    expect(ensureLeadingSlash('docs')).toBe('/docs');
    expect(ensureLeadingSlash('/docs')).toBe('/docs');
  });

  it('ensureTrailingSlash enforces trailing slash except root', () => {
    expect(ensureTrailingSlash('/')).toBe('/');
    expect(ensureTrailingSlash('/docs')).toBe('/docs/');
    expect(ensureTrailingSlash('/docs/')).toBe('/docs/');
  });

  it('stripTrailingSlash removes only non-root trailing slash', () => {
    expect(stripTrailingSlash('/docs/')).toBe('/docs');
    expect(stripTrailingSlash('/')).toBe('/');
  });

  it('pathToSlug converts file paths (including index) to slug', () => {
    expect(pathToSlug('index.mdx')).toBe('/');
    expect(pathToSlug('getting-started/index.mdx')).toBe('/getting-started/');
    expect(pathToSlug('guide/intro.mdx')).toBe('/guide/intro/');
  });

  it('slugToRoutePath removes trailing slash except root', () => {
    expect(slugToRoutePath('/')).toBe('/');
    expect(slugToRoutePath('/guide/intro/')).toBe('/guide/intro');
  });

  it('mdxFileToSlugAndPath applies version prefix correctly', () => {
    const current = mdxFileToSlugAndPath('guide/intro.mdx');
    expect(current).toEqual({ slug: '/guide/intro/', path: '/guide/intro' });
    const versioned = mdxFileToSlugAndPath('guide/intro.mdx', '/v1.2/');
    expect(versioned).toEqual({ slug: '/v1.2/guide/intro/', path: '/v1.2/guide/intro' });
    const versionRoot = mdxFileToSlugAndPath('index.mdx', '/v1.2/');
    expect(versionRoot).toEqual({ slug: '/v1.2/', path: '/v1.2' });
  });
});
