import { describe, it, expect } from 'vitest';

// utils moved to src/utils – use alias path
import { createPath } from '@/utils/basePath';

// NOTE: We assume getBasePath() returns '/' in test environment unless modified.

describe('createPath helper edge cases', () => {
  const cases: Array<[string,string]> = [
    ['', '/'],
    ['/', '/'],
    ['docs', '/docs'],
    ['/docs', '/docs'],
    ['docs/nested', '/docs/nested'],
    ['/docs/nested', '/docs/nested'],
  ];

  it('normalizes path joining with base /', () => {
    for (const [input, expected] of cases) {
      expect(createPath(input)).toBe(expected);
    }
  });

  it('preserves leading slash single root path', () => {
    expect(createPath('/')).toBe('/');
  });
});
