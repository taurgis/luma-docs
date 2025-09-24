// Global test setup: cleanup, scrollTo stub, etc.
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
	cleanup();
});

// jsdom provides a scrollTo that throws "Not implemented"; always stub to silence warnings.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).scrollTo = vi.fn();
// Provide manual alias mock for '@/config' to support minimal Vitest Vite config that omits custom resolve aliases.
// Alias handled via vite config test branch now; no runtime mock needed.
