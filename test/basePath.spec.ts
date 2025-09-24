import { describe, it, expect } from 'vitest';

// utils moved to src/utils – use alias path
import { getBasePath } from '@/utils/basePath';

describe('basePath normalization', () => {
  it('returns / when unset', () => {
    expect(getBasePath()).toBe('/');
  });
  it('normalizes simple value', () => {
    const original = import.meta.env.VITE_BASE_PATH;
    // @ts-expect-error mutate for test
    import.meta.env.VITE_BASE_PATH = 'docs';
    expect(getBasePath()).toBe('/docs/');
    // restore
    // @ts-expect-error restore
    import.meta.env.VITE_BASE_PATH = original;
  });
});
