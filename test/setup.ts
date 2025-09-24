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

// Basic IntersectionObserver polyfill for tests (sufficient for a11y nav highlighting logic)
class TestIntersectionObserver implements IntersectionObserver {
	readonly root: Element | null = null;
	readonly rootMargin: string = '0px';
	readonly thresholds: ReadonlyArray<number> = [0];
	private _callback: IntersectionObserverCallback;
	constructor(callback: IntersectionObserverCallback) { this._callback = callback; }
	observe(target: Element) {
		// Immediately invoke callback with an intersecting entry to mark active heading deterministically
		const entry = [{
			isIntersecting: true,
			target,
			intersectionRatio: 1,
			boundingClientRect: target.getBoundingClientRect(),
			intersectionRect: target.getBoundingClientRect(),
			rootBounds: null,
			time: Date.now()
		} as IntersectionObserverEntry];
		this._callback(entry, this as unknown as IntersectionObserver);
	}
	unobserve() {/* noop */}
	disconnect() {/* noop */}
	takeRecords(): IntersectionObserverEntry[] { return []; }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).IntersectionObserver = TestIntersectionObserver;
