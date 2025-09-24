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

// Mock MDXPage to avoid its internal logic (it re-reads routeMeta etc.)
vi.mock('../components/MDXPage', () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }));
// Mock Breadcrumbs to a lightweight marker (we verify it appears)
vi.mock('../components/Breadcrumbs', () => ({ default: () => <nav data-testid="breadcrumbs">Breadcrumbs</nav> }));
// Mock OnThisPage to avoid timing/DOM scanning logic
vi.mock('../components/OnThisPage', () => ({ default: () => <aside data-testid="on-this-page" /> }));
// Mock Sidebar to a simple element exposing a toggle marker
vi.mock('../components/Sidebar', () => ({ default: () => <div data-testid="sidebar">SidebarNav</div> }));
// Mock ErrorBoundary to pass-through
vi.mock('../components/ErrorBoundary', () => ({ default: ({ children }: { children?: React.ReactNode }) => <>{children}</> }));
// Mock MDXWrapper trivial
vi.mock('../components/MDXWrapper', () => ({ default: ({ children }: { children?: React.ReactNode }) => <div data-testid="mdx-wrapper">{children}</div> }));
// Mock SEO to a lightweight component (no capture needed for now)
vi.mock('../components/SEO', () => ({ default: () => <></> }));

import Layout from '../components/Layout';

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
