import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, Outlet } from 'react-router-dom';

// Relative
import ErrorBoundary from './ErrorBoundary';

// Internal aliases
import MDXPage from '@/components/content/MDXPage';
import MDXWrapper from '@/components/content/MDXWrapper';
import OnThisPage from '@/components/navigation/OnThisPage';
import Sidebar from '@/components/navigation/Sidebar';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import { config } from '@/config';
import type { TocItem } from '@/types';


const Layout: React.FC = () => {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);
  const mobileSidebarRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  // Track initial render so we can skip auto-focusing main on first paint (option 2)
  const firstRenderRef = useRef(true);
  const location = useLocation();

  const closeSidebar = useCallback((opts?: { restoreFocus?: boolean }) => {
    setSidebarOpen(false);
    if (opts?.restoreFocus !== false && toggleButtonRef.current) {
      toggleButtonRef.current.focus();
    }
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!sidebarOpen) { return; }
    if (e.key === 'Escape') {
      e.preventDefault();
      closeSidebar();
      return;
    }
    if (e.key === 'Tab') {
      // Focus trap inside mobile sidebar
      const container = mobileSidebarRef.current;
  if (!container) { return; }
      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
      ).filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
      // If none focusable, keep focus on container
      if (focusable.length === 0) {
        container.focus();
        e.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, [sidebarOpen, closeSidebar]);

  // Close sidebar on route change (mobile)
  // Close mobile sidebar and move focus to main content on route change
  useEffect(() => {
    setSidebarOpen(false);
    // After paint, shift focus to main content for screen reader & keyboard continuity
    const t = setTimeout(() => {
      const main = document.getElementById('main-content');
      if (main) {
        // Make programmatically focusable if not naturally
        if (!main.hasAttribute('tabindex')) {
          main.setAttribute('tabindex', '-1');
        }
        if (firstRenderRef.current) {
          // Skip focusing on very first load to avoid visible outline flash;
          // still mark that we've passed initial render so subsequent route changes restore focus.
          firstRenderRef.current = false;
        } else {
          (main as HTMLElement).focus();
        }
      }
    }, 0);
    return () => clearTimeout(t);
  }, [location.pathname]);

  // Scroll restoration - scroll to top on route change or to specific element if hash is present
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {return;}
    
    const scrollToTarget = () => {
      let targetId = '';
      
      // Check for hash fragment in location.hash
      if (location.hash) {
        targetId = location.hash.substring(1); // Remove the # symbol
      } 
      // Check for URL-encoded hash (%23) in the pathname
      else if (location.pathname.includes('%23')) {
        const parts = location.pathname.split('%23');
        if (parts.length > 1) {
          targetId = decodeURIComponent(parts[1]);
        }
      }
      
      // Determine user motion preference
      const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (targetId) {
        // If there's a target ID, try to scroll to that element
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          // Use multiple attempts with increasing delays to ensure DOM is ready
          const attemptScroll = (attempt = 0) => {
            const element = document.getElementById(targetId);
            if (element) {
              element.scrollIntoView({ 
                behavior: prefersReducedMotion ? 'auto' : 'smooth', 
                block: 'start',
                inline: 'nearest'
              });
            } else if (attempt < 5) {
              // Retry up to 5 times with increasing delay
              setTimeout(() => attemptScroll(attempt + 1), (attempt + 1) * 100);
            }
          };
          
          // Initial attempt with small delay
          setTimeout(() => attemptScroll(), 100);
        } else {
          // Element not found immediately, try again after content loads
          setTimeout(() => {
            const retryElement = document.getElementById(targetId);
            if (retryElement) {
              retryElement.scrollIntoView({ 
                behavior: prefersReducedMotion ? 'auto' : 'smooth', 
                block: 'start',
                inline: 'nearest'
              });
            }
          }, 500);
        }
      } else {
        // No hash, scroll to top
        window.scrollTo({ top: 0, left: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    };

    scrollToTarget();
  }, [location.pathname, location.hash]);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {return;}
    
    // Use a small timeout to ensure the DOM has been updated with new content
    const timeoutId = setTimeout(() => {
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        const headings = mainContent.querySelectorAll('h2, h3, h4');
        const newToc: TocItem[] = Array.from(headings).map(heading => ({
          id: heading.id,
          label: heading.textContent || '',
          level: parseInt(heading.tagName.substring(1)) as 2 | 3 | 4,
        }));
        setToc(newToc);
      }
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [location.pathname]);

  // Manage focus when sidebar opens
  useEffect(() => {
    if (sidebarOpen) {
      // store last focused element
      lastFocusedRef.current = document.activeElement as HTMLElement | null;
      // Attempt to focus first focusable inside sidebar
      const container = mobileSidebarRef.current;
      if (container) {
        // Make sure container is programmatically focusable
        if (!container.hasAttribute('tabindex')) {
          container.setAttribute('tabindex', '-1');
        }
        const focusable = container.querySelector<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        (focusable || container).focus();
      }
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen, handleKeyDown]);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Skip links */}
      <div className="sr-only" id="skip-links">
        <a href="#main-content" className="focus:not-sr-only focus:absolute left-4 top-2 z-50 px-3 py-2 bg-blue-600 text-white rounded shadow">
          Skip to main content
        </a>
        <a href="#primary-nav" className="focus:not-sr-only focus:absolute left-4 top-12 z-50 px-3 py-2 bg-blue-600 text-white rounded shadow">
          Skip to primary navigation
        </a>
      </div>
      {/* Mobile Header */}
  <header className="lg:hidden bg-white border-b border-slate-200 sticky top-0 z-50" role="banner">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2 min-w-0">
            {/* Branding (avoid additional page-level h1; real page h1 comes from MDX content) */}
            <div className="flex items-baseline gap-1" aria-label={`${config.branding.logo.text} ${config.branding.logo.accent} documentation home`}>
              <span className="text-xl font-bold text-slate-800">{config.branding.logo.text}</span>
              <span className="text-xl font-light text-blue-500">{config.branding.logo.accent}</span>
              <span className="sr-only">homepage</span>
            </div>
            <span className="text-xs text-slate-500 self-start mt-1" aria-label={`Version ${config.site.version}`}>v{config.site.version}</span>
          </div>
          <button
            ref={toggleButtonRef}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md flex-shrink-0"
            aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={sidebarOpen}
            aria-controls="mobile-sidebar"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {sidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <button
          type="button"
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          aria-label="Close navigation"
          onClick={() => closeSidebar()}
        >
          <span className="sr-only">Close navigation</span>
        </button>
      )}

      <div className="relative flex min-h-screen overflow-x-hidden">
        {/* Desktop Sidebar */}
        <div className="fixed top-0 left-0 h-full w-64 hidden lg:block bg-slate-50 border-r border-slate-200">
          <nav id="primary-nav" aria-label="Primary" className="h-full overflow-y-auto">
            <Sidebar />
          </nav>
        </div>

        {/* Mobile Sidebar */}
        <div id="mobile-sidebar" ref={mobileSidebarRef} aria-hidden={!sidebarOpen} className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-slate-50 border-r border-slate-200 transform transition-transform duration-200 ease-in-out z-50 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>          
          <nav aria-label="Primary" className="h-full overflow-y-auto">
            <Sidebar />
          </nav>
        </div>

        <div className="lg:pl-64 flex-1 min-w-0 max-w-full">
          <div className="flex min-w-0 max-w-full">
            {/* Added base mobile padding (p-4) so content isn't flush on very small screens */}
            <main id="main-content" role="main" className="flex-1 max-w-4xl mx-auto p-4 sm:p-4 lg:p-12 min-w-0 overflow-hidden" aria-describedby={config.features.breadcrumbs ? 'breadcrumbs' : undefined}>
              <div className="prose prose-slate max-w-none min-w-0 break-words">
                {config.features.breadcrumbs && <Breadcrumbs id="breadcrumbs" />}
                <ErrorBoundary>
                  <MDXPage>
                    <MDXWrapper>
                      <Outlet />
                    </MDXWrapper>
                  </MDXPage>
                </ErrorBoundary>
              </div>
            </main>
            <aside className="hidden xl:block w-64 flex-shrink-0" aria-label="Table of contents">
              <div className="fixed top-0 right-0 h-full w-64 p-8">
                <OnThisPage items={toc} />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;