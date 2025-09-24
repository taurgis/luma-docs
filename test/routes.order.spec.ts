import { describe, it, expect } from 'vitest';

import config from '../config';
import { routeMeta } from '../src/generated-routes.meta';

// Helpers
const currentVersion = config.versions.current;

function isCurrent(metaVersion: string | undefined) {
  return metaVersion === currentVersion;
}

describe('route ordering & version invariants', () => {
  it('places all current version routes before any archived routes', () => {
    let seenArchived = false;
    for (const meta of routeMeta) {
      if (!isCurrent(meta.version)) {
        seenArchived = true;
      } else if (seenArchived) {
        throw new Error(`Current version route '${meta.slug}' appears after an archived version route.`);
      }
    }
  });

  it('every route has a version label defined', () => {
    const missing = routeMeta.filter(r => !r.version);
    expect(missing).toHaveLength(0);
  });

  it('no duplicate slugs', () => {
    const seen = new Set<string>();
    for (const r of routeMeta) {
      if (seen.has(r.slug)) {
        throw new Error(`Duplicate slug detected: ${r.slug}`);
      }
      seen.add(r.slug);
    }
  });

  it('slug/path shape constraints hold', () => {
    for (const r of routeMeta) {
      if (r.slug === '/') {
        expect(r.path).toBe('/');
      } else {
        expect(r.slug.endsWith('/')).toBe(true);
        expect(r.path.endsWith('/')).toBe(false);
        expect(r.slug.slice(0, -1)).toBe(r.path);
      }
    }
  });
});
