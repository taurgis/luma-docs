import { describe, it, expect } from 'vitest';

import { routeMeta } from '../src/generated-routes.meta';
import { GENERATED_SEARCH_INDEX } from '../src/generated-search-index';

// Build a set of acceptable canonical paths (with and without trailing slash)
const canonical = new Set<string>();
for (const r of routeMeta) {
  canonical.add(r.slug); // slug always /foo/.../ (trailing slash except root)
  canonical.add(r.path); // path no trailing slash (except root)
}

describe('search index integrity', () => {
  it('every search item path matches a known route path or slug', () => {
    const unknown = GENERATED_SEARCH_INDEX.filter(i => !canonical.has(i.path));
    if (unknown.length) {
      throw new Error(`Unknown search index paths: ${unknown.slice(0,5).map(u => u.path).join(', ')}${unknown.length>5 ? '…' : ''}`);
    }
  });

  it('has no duplicate (path + headingId) pairs', () => {
    const combo = new Set<string>();
    for (const item of GENERATED_SEARCH_INDEX) {
      const key = `${item.path}#${item.headingId || ''}`;
      if (combo.has(key)) {
        throw new Error(`Duplicate search entry: ${key}`);
      }
      combo.add(key);
    }
  });

  it('mandatory fields are non-empty', () => {
    for (const item of GENERATED_SEARCH_INDEX) {
      expect(item.pageTitle.trim().length).toBeGreaterThan(0);
      expect(item.heading.trim().length).toBeGreaterThan(0);
      expect(item.content.trim().length).toBeGreaterThan(0);
    }
  });
});
