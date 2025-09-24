// Minimal typing for jest-axe to satisfy TypeScript in Vitest context
declare module 'jest-axe' {
  import type { AxeResults } from 'axe-core';
  export function axe(container: Element | DocumentFragment, options?: Record<string, unknown>): Promise<AxeResults>;
  export const toHaveNoViolations: unknown; // matcher placeholder
}
