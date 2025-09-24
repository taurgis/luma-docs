import { describe, it, expect } from 'vitest';

// Mock Head to a simple fragment wrapper to avoid needing full helmet context

import { sanitizeHeadText } from '../src/utils/sanitize';

describe('SEO sanitization', () => {

  it('sanitizeHeadText removes tags and trims', () => {
    expect(sanitizeHeadText('  Hello <b>World</b>  ')).toBe('Hello World');
    expect(sanitizeHeadText('<script>alert(1)</script>Test')).toBe('Test');
  });

  // Integration of meta injection is covered elsewhere; focus here on utility only to avoid helmet context issues.
});
