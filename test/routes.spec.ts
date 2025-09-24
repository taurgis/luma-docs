import { describe, it, expect } from 'vitest';

import { routeMeta } from '../src/generated-routes.meta';

// Basic invariants ensuring generator output remains stable for key assumptions

describe('generated routes metadata', () => {
  it('contains root route', () => {
    const root = routeMeta.find(r => r.slug === '/');
    expect(root).toBeTruthy();
  });

  it('all slugs (except root) have trailing slash', () => {
    const bad = routeMeta.filter(r => r.slug !== '/' && !r.slug.endsWith('/'));
    expect(bad).toHaveLength(0);
  });

  it('all paths (except root) have no trailing slash', () => {
    const bad = routeMeta.filter(r => r.path !== '/' && r.path.endsWith('/'));
    expect(bad).toHaveLength(0);
  });

  it('version field is present for every route', () => {
    const missing = routeMeta.filter(r => !r.version);
    expect(missing).toHaveLength(0);
  });
});
