import { render, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

vi.mock('../src/generated-routes', () => ({
  routeMeta: [
    { path: '/', slug: '/', title: 'Home', version: 'v1.0' },
    { path: '/guide', slug: '/guide/', title: 'Guide', version: 'v1.0' }
  ],
  routes: []
}));
vi.mock('../src/generated-versions', () => ({ archivedVersions: [] }));
vi.mock('../src/components/seo/SEO', () => ({ default: () => null }));
vi.mock('../src/components/seo/Breadcrumbs', () => ({ default: (props: { id?: string }) => <nav id={props.id} aria-label="Breadcrumbs" /> }));
vi.mock('../src/app/layout/ErrorBoundary', () => ({ default: ({ children }: { children?: React.ReactNode }) => <>{children}</> }));

import Layout from '../src/app/layout/Layout';

function renderLayout(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/" element={<Layout />}> 
          <Route index element={<><h1>Home</h1><p>Welcome.</p></>} />
          <Route path="guide" element={<><h1>Guide</h1><h2 id="section">Section</h2><p>Content</p></>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('Layout landmarks & skip link', () => {
  it('exposes banner, navigation, main landmarks and functioning skip link', async () => {
    const { container, getByText } = renderLayout('/guide');
    const banner = container.querySelector('header[role="banner"]');
    const main = container.querySelector('main#main-content');
    expect(banner).toBeTruthy();
    expect(main).toBeTruthy();

    // Skip link is visually hidden but becomes focusable
    const skip = getByText('Skip to main content');
    skip.focus();
    expect(document.activeElement).toBe(skip);

    // Activate skip link
  fireEvent.click(skip);
  // The focus shift may be async (timeout in Layout); wait for it
  await new Promise(r => setTimeout(r, 10));
  expect(document.activeElement).toBe(main);

    const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toHaveLength(0);
  });
});
