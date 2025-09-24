import { describe, it, expect } from 'vitest';

import { parseAndValidateFrontmatter } from '../src/tools/frontmatter-schema';

const validMDX = `---\ntitle: Good Page\ndescription: A valid description meeting length reqs\norder: 2\nnoindex: false\nogType: website\ntwitterCard: summary_large_image\n---\n\n# Heading\nContent here.`;

const invalidMDX = `---\ntitle: \ndescription: short\norder: -1\nnoindex: maybe\n---\n\n# Bad Heading`;

describe('Frontmatter schema regression', () => {
  it('accepts valid frontmatter', () => {
    const { result } = parseAndValidateFrontmatter(validMDX);
    expect(result.success).toBe(true);
  });

  it('rejects invalid frontmatter', () => {
    const { result } = parseAndValidateFrontmatter(invalidMDX);
    expect(result.success).toBe(false);
  if (result.success) { return; } // type guard
  const messages = result.error.issues.map(i => i.message.toLowerCase());
  // Accept any of the indicative substrings from Zod v4 error messages
  const indicative = ['invalid input', 'too small', 'expected'];
  expect(messages.some(m => indicative.some(ind => m.includes(ind)))).toBe(true);
  });
});
