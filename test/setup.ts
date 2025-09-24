// Global test setup: cleanup, scrollTo stub, etc.
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
	cleanup();
});

// jsdom provides a scrollTo that throws "Not implemented"; always stub to silence warnings.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).scrollTo = vi.fn();
