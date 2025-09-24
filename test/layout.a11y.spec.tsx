import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

// Extend expect with jest-axe matcher

// Mock generated data
vi.mock('../src/generated-routes', () => ({
  routeMeta: [
    { path: '/', slug: '/', title: 'Home', version: 'v1.0' },
    { path: '/guide', slug: '/guide/', title: 'Guide', version: 'v1.0' }
  ],
  routes: []
}));
vi.mock('../src/generated-versions', () => ({ archivedVersions: ['v0.9'] }));

// Keep real Sidebar & Search etc. for authentic landmarks; mock only heavy / irrelevant SEO pieces
vi.mock('../src/components/seo/SEO', () => ({ default: () => null }));
vi.mock('../src/components/seo/Breadcrumbs', () => ({ default: () => <nav aria-label="Breadcrumbs" /> }));

// Error boundary pass-through
vi.mock('../src/app/layout/ErrorBoundary', () => ({ default: ({ children }: { children?: React.ReactNode }) => <>{children}</> }));

import Layout from '../src/app/layout/Layout';

function renderLayout(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/" element={<Layout />}> 
          <Route index element={<><h1>Home</h1><p>Welcome.</p></>} />
          <Route path="guide" element={<><h1>Guide</h1><p>Content</p></>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('Layout accessibility', () => {
  it('has no basic a11y violations on home route', async () => {
    const { container } = renderLayout('/');
    const results = await axe(container, {
      rules: {
        // Example: disable color-contrast if Tailwind dev colors not final; keep others
        'color-contrast': { enabled: false }
      }
    });
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toHaveLength(0);
  });

  it('has no basic a11y violations on guide route', async () => {
    const { container } = renderLayout('/guide');
    const results = await axe(container, {
      rules: { 'color-contrast': { enabled: false } }
    });
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toHaveLength(0);
  });
});
