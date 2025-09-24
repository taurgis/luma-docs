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

// Suppress React Router noisy future-flag warnings during tests to keep output signal high.
// eslint-disable-next-line no-console -- intentional interception for test noise reduction
const originalWarn = console.warn;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(console as any).warn = (...args: unknown[]) => {
	if (typeof args[0] === 'string' && args[0].includes('React Router Future Flag Warning')) {
		return; // swallow
	}
	originalWarn(...args);
};
