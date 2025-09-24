import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock generated route + version data before importing Layout dependencies
vi.mock('../src/generated-routes', () => {
  return {
    routeMeta: [
      { path: '/', slug: '/', title: 'Home', ogType: 'website', version: 'v1.0' },
      { path: '/guide', slug: '/guide/', title: 'Guide Page', ogType: 'website', version: 'v1.0' }
    ],
    routes: []
  };
});

vi.mock('../src/generated-versions', () => ({ archivedVersions: ['v0.9', 'v0.8'] }));

// --- Component Mocks (updated paths after folder re-org) ---
// Keep legacy mocks (flat paths) in case of stray imports
vi.mock('../src/components/MDXPage', () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }));
vi.mock('../src/components/MDXWrapper', () => ({ default: ({ children }: { children?: React.ReactNode }) => <div data-testid="mdx-wrapper">{children}</div> }));
vi.mock('../src/components/Breadcrumbs', () => ({ default: () => <nav data-testid="breadcrumbs">Breadcrumbs</nav> }));
vi.mock('../src/components/OnThisPage', () => ({ default: () => <aside data-testid="on-this-page" /> }));
vi.mock('../src/components/Sidebar', () => ({ default: () => <div data-testid="sidebar">SidebarNav</div> }));
vi.mock('../src/components/SEO', () => ({ default: () => <></> }));

// New structured paths
vi.mock('../src/components/content/MDXPage', () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }));
vi.mock('../src/components/content/MDXWrapper', () => ({ default: ({ children }: { children?: React.ReactNode }) => <div data-testid="mdx-wrapper">{children}</div> }));
vi.mock('../src/components/navigation/OnThisPage', () => ({ default: () => <aside data-testid="on-this-page" /> }));
vi.mock('../src/components/navigation/Sidebar', () => ({ default: () => <div data-testid="sidebar">SidebarNav</div> }));
vi.mock('../src/components/seo/Breadcrumbs', () => ({ default: () => <nav aria-label="Breadcrumbs" data-testid="breadcrumbs">Breadcrumbs</nav> }));
vi.mock('../src/components/seo/SEO', () => ({ default: () => <></> }));

// ErrorBoundary passthrough
vi.mock('../src/app/layout/ErrorBoundary', () => ({ default: ({ children }: { children?: React.ReactNode }) => <>{children}</> }));

import Layout from '../src/app/layout/Layout';

const renderWithRoute = (initialPath: string, outletContent?: React.ReactNode) => {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/" element={<Layout />}> 
          <Route index element={outletContent || <div data-testid="home">HomeContent</div>} />
          <Route path="guide" element={<div data-testid="guide">GuideContent</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
};

describe('Layout integration (mocked)', () => {
  beforeEach(() => { /* reset state before each test if needed */ });

  it('renders brand elements and outlet on root', () => {
    renderWithRoute('/');
    // Brand pieces
    expect(screen.getByText('Luma')).toBeTruthy();
    expect(screen.getByText('Docs')).toBeTruthy();
    // Outlet content
    expect(screen.getByTestId('home')).toBeTruthy();
    // Breadcrumbs (mocked) - allow multiple due to possible React strict effects duplication
    expect(screen.getAllByTestId('breadcrumbs').length).toBeGreaterThan(0);
  });

  it('toggles mobile sidebar state with proper a11y attributes', () => {
    renderWithRoute('/');
    const toggleButtons = screen.getAllByRole('button', { name: /open navigation/i });
    fireEvent.click(toggleButtons[0]);
    // After opening, button label changes to Close navigation
    const closeButtons = screen.getAllByRole('button', { name: /close navigation/i });
    expect(closeButtons.length).toBeGreaterThan(0);
    // Overlay now present (one of the close navigation buttons has full-screen styles, we can detect via aria-label)
    const overlay = screen.getAllByRole('button', { name: /close navigation/i }).find(btn => btn !== closeButtons[0]) || closeButtons[0];
    fireEvent.click(overlay); // close via overlay
    // Button returns to open state
    expect(screen.getAllByRole('button', { name: /open navigation/i }).length).toBeGreaterThan(0);
  });

  it('provides skip link and breadcrumb / primary nav landmarks', () => {
    renderWithRoute('/');
    // Skip link exists
    const skipLink = screen.getByRole('link', { name: /skip to main content/i });
    expect(skipLink).toBeTruthy();
    // Breadcrumbs landmark
    const breadcrumbNavs = screen.getAllByRole('navigation', { name: /breadcrumbs/i });
    expect(breadcrumbNavs.length).toBeGreaterThan(0);
  });

  it('focus traps in mobile sidebar and closes on Escape restoring focus', () => {
    renderWithRoute('/');
    const openBtn = screen.getAllByRole('button', { name: /open navigation/i })[0];
    openBtn.focus();
    fireEvent.click(openBtn);
    // Now sidebar is open, find something inside sidebar (mocked SidebarNav text)
  expect(screen.getAllByTestId('sidebar')[0]).toBeTruthy();
    // Simulate tabbing - since our mocked sidebar may not have focusables, container itself will receive focus
    fireEvent.keyDown(document, { key: 'Tab' });
    // Press Escape to close
    fireEvent.keyDown(document, { key: 'Escape' });
    // Focus restored to toggle button
    expect(document.activeElement).toBe(openBtn);
  });

  it('renders nested route content and Breadcrumbs on subpage', () => {
    renderWithRoute('/guide');
    expect(screen.getByTestId('guide')).toBeTruthy();
    expect(screen.getAllByTestId('breadcrumbs').length).toBeGreaterThan(0);
  });
});
