// Global test setup: cleanup, scrollTo stub, etc.
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
	cleanup();
});

// jsdom doesn't implement scrollTo; stub to silence not implemented warnings.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (!(window as any).scrollTo) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(window as any).scrollTo = vi.fn();
}
