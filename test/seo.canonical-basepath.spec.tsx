import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi, beforeAll } from 'vitest';

vi.mock('../src/generated-routes', () => ({
  routeMeta: [
    { path: '/', slug: '/', title: 'Home', version: 'v1.0' },
    { path: '/guide', slug: '/guide/', title: 'Guide', version: 'v1.0' }
  ],
  routes: []
}));
vi.mock('../src/generated-versions', () => ({ archivedVersions: ['v0.9'] }));

// Minimal mocks
vi.mock('../src/components/navigation/Sidebar', () => ({ default: () => <div /> }));
vi.mock('../src/components/navigation/OnThisPage', () => ({ default: () => <div /> }));
vi.mock('../src/components/seo/Breadcrumbs', () => ({ default: () => <div /> }));
vi.mock('../src/components/content/MDXWrapper', () => ({ default: ({ children }: { children?: React.ReactNode }) => <div>{children}</div> }));
vi.mock('../src/app/layout/ErrorBoundary', () => ({ default: ({ children }: { children?: React.ReactNode }) => <>{children}</> }));

// Spy on Head insertion inside SEO - instead, mock SEO to capture canonical href passed
let capturedCanonical: string | undefined;
vi.mock('../src/components/seo/SEO', () => ({
  default: ({ canonical, baseUrl }: { canonical?: string; baseUrl?: string }) => {
    capturedCanonical = `${baseUrl || ''}${canonical?.startsWith('/') ? canonical.substring(1) : canonical}`;
    return <></>;
  }
}));

import Layout from '../src/app/layout/Layout';

const renderGuide = () => render(
  <MemoryRouter initialEntries={['/guide']}>
    <Routes>
      <Route path="/" element={<Layout />}> 
        <Route path="guide" element={<div>Guide</div>} />
      </Route>
    </Routes>
  </MemoryRouter>
);

describe('Canonical URL with base path', () => {
  beforeAll(() => {
    // @ts-expect-error test mutate env
    import.meta.env.VITE_BASE_PATH = '/docs/';
  });

  it('joins base origin + base path + route path', () => {
    renderGuide();
    expect(capturedCanonical).toMatch(/\/docs\/guide\/?$/);
  });
});
