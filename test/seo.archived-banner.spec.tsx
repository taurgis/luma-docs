import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

// Mock generated data: include archived version and current route
vi.mock('../src/generated-routes', () => ({
  routeMeta: [
    { path: '/', slug: '/', title: 'Home', version: 'v1.0' },
    { path: '/v0.9', slug: '/v0.9/', title: 'v0.9 Home', version: 'v0.9' },
    { path: '/v0.9/guide', slug: '/v0.9/guide/', title: 'Old Guide', version: 'v0.9' },
    { path: '/guide', slug: '/guide/', title: 'Guide', version: 'v1.0' }
  ],
  routes: []
}));

vi.mock('../src/generated-versions', () => ({ archivedVersions: ['v0.9'] }));

// Shallow mocks for subordinate components used by Layout -> MDXPage chain
vi.mock('../src/components/content/MDXWrapper', () => ({ default: ({ children }: { children?: React.ReactNode }) => <div>{children}</div> }));
vi.mock('../src/components/navigation/OnThisPage', () => ({ default: () => <div /> }));
vi.mock('../src/components/navigation/Sidebar', () => ({ default: () => <div /> }));
vi.mock('../src/components/seo/Breadcrumbs', () => ({ default: () => <div /> }));
vi.mock('../src/components/seo/SEO', () => ({ default: () => <></> }));

// Keep ErrorBoundary pass-through
vi.mock('../src/app/layout/ErrorBoundary', () => ({ default: ({ children }: { children?: React.ReactNode }) => <>{children}</> }));

import Layout from '../src/app/layout/Layout';

const renderAt = (path: string) => render(
  <MemoryRouter initialEntries={[path]}>
    <Routes>
      <Route path="/" element={<Layout />}> 
        <Route index element={<div>Root</div>} />
        <Route path="guide" element={<div>Guide</div>} />
        <Route path="v0.9">
          <Route index element={<div>Old Root</div>} />
          <Route path="guide" element={<div>Old Guide</div>} />
        </Route>
      </Route>
    </Routes>
  </MemoryRouter>
);

describe('Archived banner', () => {
  it('renders banner on archived version route', () => {
    renderAt('/v0.9/guide');
    const banner = screen.getByRole('status', { name: /archived version notice/i });
    expect(banner).toBeTruthy();
    expect(banner.textContent).toMatch(/older version/i);
  });

  it('omits banner on current version route', () => {
    renderAt('/guide');
    const banners = screen.queryAllByRole('status', { name: /archived version notice/i });
    expect(banners.length).toBe(0);
  });
});
