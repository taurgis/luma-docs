import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

vi.mock('../src/generated-routes', () => ({
  routeMeta: [
    { path: '/', slug: '/', title: 'Home', version: 'v1.0' },
    { path: '/section', slug: '/section/', title: 'Section', version: 'v1.0' },
    { path: '/section/topic', slug: '/section/topic/', title: 'Topic', version: 'v1.0' }
  ],
  routes: []
}));
vi.mock('../src/generated-versions', () => ({ archivedVersions: [] }));

// Capture injected JSON-LD scripts
const scripts: string[] = [];
vi.mock('../src/components/seo/SEO', () => ({
  default: (props: unknown) => {
  const p = props as { breadcrumbs?: import('../src/types').BreadcrumbItem[] };
    // Simulate what SEO would render (we only care breadcrumb script presence)
    if (p.breadcrumbs && p.breadcrumbs.length > 1) {
      scripts.push(JSON.stringify({ breadcrumbs: p.breadcrumbs }));
    }
    return <></>;
  }
}));

vi.mock('../src/components/navigation/Sidebar', () => ({ default: () => <div /> }));
vi.mock('../src/components/navigation/OnThisPage', () => ({ default: () => <div /> }));
vi.mock('../src/components/content/MDXWrapper', () => ({ default: ({ children }: { children?: React.ReactNode }) => <div>{children}</div> }));
vi.mock('../src/app/layout/ErrorBoundary', () => ({ default: ({ children }: { children?: React.ReactNode }) => <>{children}</> }));
vi.mock('../src/components/seo/Breadcrumbs', () => ({ default: () => <div>Crumbs</div> }));

import Layout from '../src/app/layout/Layout';

const renderAt = (path: string) => render(
  <MemoryRouter initialEntries={[path]}>
    <Routes>
      <Route path="/" element={<Layout />}> 
        <Route index element={<div>Home</div>} />
        <Route path="section">
          <Route index element={<div>Section</div>} />
          <Route path="topic" element={<div>Topic</div>} />
        </Route>
      </Route>
    </Routes>
  </MemoryRouter>
);

describe('Breadcrumb JSON-LD injection behavior', () => {
  it('captures breadcrumbs for deep path', () => {
    renderAt('/section/topic');
    expect(scripts.length).toBeGreaterThan(0);
  const last = scripts.pop();
  expect(last).toBeTruthy();
  const parsed = JSON.parse(last || '');
    expect(parsed.breadcrumbs.length).toBeGreaterThan(2); // root + section + topic
  });

  it('omits breadcrumbs JSON-LD on root path (only one level)', () => {
    scripts.length = 0;
    renderAt('/');
    expect(scripts.length).toBe(0);
  });
});
