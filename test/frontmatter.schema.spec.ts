import { describe, it, expect } from 'vitest';

import { parseAndValidateFrontmatter } from '../scripts/frontmatter-schema';

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
    const messages = result.error.issues.map(i => i.message);
    expect(messages.some(m => m.toLowerCase().includes('required') || m.toLowerCase().includes('greater'))).toBe(true);
  });
});
