/* eslint-disable import/order */
import React from 'react';
import { useLocation } from 'react-router-dom';
import config from '../../config';
import { routeMeta } from '../generated-routes';
import type { RouteMeta } from '../../types/route-meta';
import { archivedVersions } from '../generated-versions';
import { getBasePath, createPath } from '../../utils/basePath';
import SEO from './SEO';
// Narrowed SEO meta shape
interface RouteMetaForSEO {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
  twitterCreator?: string;
  twitterSite?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  robots?: string;
  noindex?: boolean;
  section?: string;
  tags?: string[];
}
// (imports reordered above)

interface MDXPageProps {
  children: React.ReactNode;
  meta?: {
    title?: string;
    description?: string;
    keywords?: string;
    canonical?: string;
    ogImage?: string;
    ogType?: 'website' | 'article';
    twitterCard?: 'summary' | 'summary_large_image';
    twitterCreator?: string;
    twitterSite?: string;
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
    robots?: string;
    noindex?: boolean;
    section?: string;
    tags?: string[];
  };
}

const MDXPage: React.FC<MDXPageProps> = ({ children, meta: explicitMeta }) => {
  const location = useLocation();
  
  // Find the route metadata for the current path
  const currentMeta = routeMeta.find((route: RouteMeta) => {
    const routePath = route.path;
    const currentPath = location.pathname;
    
    // Handle trailing slash variations
    const normalizedRoutePath = routePath === '/' ? '/' : routePath.replace(/\/$/, '');
    const normalizedCurrentPath = currentPath === '/' ? '/' : currentPath.replace(/\/$/, '');
    
    return normalizedRoutePath === normalizedCurrentPath;
  });

  // Merge explicit meta with route meta, with explicit meta taking precedence
  const merged = { ...currentMeta, ...explicitMeta } as Record<string, unknown>;
  // Sanitize ogType to allowed union
  let ogType: 'website' | 'article' | undefined;
  if (merged.ogType === 'article') { ogType = 'article'; }
  else if (merged.ogType === 'website') { ogType = 'website'; }
  // Assemble final meta object with narrowed types
  const finalMeta: RouteMetaForSEO = {
    title: merged.title as string | undefined,
    description: merged.description as string | undefined,
    keywords: merged.keywords as string | undefined,
    canonical: merged.canonical as string | undefined,
    ogImage: merged.ogImage as string | undefined,
    ogType,
    twitterCard: merged.twitterCard as ('summary' | 'summary_large_image') | undefined,
    twitterCreator: merged.twitterCreator as string | undefined,
    twitterSite: merged.twitterSite as string | undefined,
    author: merged.author as string | undefined,
    publishedTime: merged.publishedTime as string | undefined,
    modifiedTime: merged.modifiedTime as string | undefined,
    robots: merged.robots as string | undefined,
    noindex: merged.noindex as boolean | undefined,
    section: merged.section as string | undefined,
    tags: merged.tags as string[] | undefined,
  };

  // Build base URL for canonical URLs
  const basePath = getBasePath();
  const baseUrl = typeof window !== 'undefined' 
    ? `${window.location.protocol}//${window.location.host}${basePath}`
    : basePath;

  // Build breadcrumbs (omit if feature disabled)
  let breadcrumbs: { name: string; path: string }[] | undefined;
  if (config.features.breadcrumbs && location.pathname !== '/') {
    const path = location.pathname.replace(/\/?$/, '/');
    const segments = path.split('/').filter(Boolean);
    breadcrumbs = [{ name: config.site.name, path: '/' }];
    const acc: string[] = [];
    segments.forEach(seg => {
      acc.push(seg);
      const partial = `/${acc.join('/')}`;
  const route = routeMeta.find((r: RouteMeta) => r.path.replace(/\/$/, '') === partial.replace(/\/$/, ''));
      const title = route?.title || seg.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      breadcrumbs?.push({ name: title, path: route?.slug || `${partial}/` });
    });
  }

  // Version awareness: detect archived version from first path segment
  const firstSeg = location.pathname.split('/').filter(Boolean)[0];
  const isArchived = firstSeg && (archivedVersions as readonly string[]).includes(firstSeg);
  const currentVersionLabel = config.versions.current;

  // Compute target URL for "Go to current version" when viewing an archived page.
  // Strategy: strip the archived version prefix and test if that route exists in current version.
  // If not found, fall back to the current version homepage (/).
  let goCurrentHref: string | undefined;
  if (isArchived) {
    const segments = location.pathname.split('/').filter(Boolean);
    // segments[0] is archived version label; remainder is the path within docs
    const rest = segments.slice(1); // may be empty -> homepage
    let targetSlug = '/';
    if (rest.length > 0) {
      // Build candidate path (no trailing slash) for routeMeta.path comparison
      const candidatePath = `/${rest.join('/')}`.replace(/\/$/, '');
      const match = routeMeta.find((r: RouteMeta) => r.path === candidatePath);
      if (match) {
        targetSlug = match.slug; // slug already normalized with trailing slash (except root)
      } else {
        targetSlug = '/';
      }
    }
    goCurrentHref = createPath(targetSlug); // base-path aware
  }

  // Auto-inject noindex if archived and not explicitly overridden
  const effectiveNoIndex: boolean = finalMeta.noindex === true || isArchived === true;

  return (
    <>
      <SEO
        {...finalMeta}
        noindex={effectiveNoIndex}
        canonical={finalMeta.canonical || location.pathname}
        baseUrl={baseUrl}
        breadcrumbs={breadcrumbs}
      />
      {isArchived && (
        <div className="mb-6 -mt-2 rounded-md border border-amber-300 bg-amber-50 p-4 text-amber-900 text-sm flex flex-col gap-2" role="status" aria-label="Archived version notice">
          <div className="font-semibold flex items-center gap-2">
            <svg className="w-4 h-4 text-amber-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M10 2a1 1 0 01.894.553l7 14A1 1 0 0117 18H3a1 1 0 01-.894-1.447l7-14A1 1 0 0110 2zm0 4a1 1 0 00-.993.883L9 7v4a1 1 0 001.993.117L11 11V7a1 1 0 00-1-1zm.002 8a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z" clipRule="evenodd" /></svg>
            Archived Documentation
          </div>
          <p className="leading-snug">You are viewing an older version of the documentation (version <strong>{firstSeg}</strong>). The current stable version is <strong>{currentVersionLabel}</strong>.</p>
          <div>
            <a
              href={goCurrentHref || createPath('/')}
              onClick={(e) => {
                // Use full page navigation to ensure proper static file load under base path
                e.preventDefault();
                window.location.href = goCurrentHref || createPath('/');
              }}
              className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:underline"
            >
              Go to current version
              <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M12.293 3.293a1 1 0 011.32-.083l.094.083 5.293 5.293a1 1 0 01.083 1.32l-.083.094-5.293 5.293a1 1 0 01-1.497-1.32l.083-.094L15.585 11H2a1 1 0 01-.117-1.993L2 9h13.585l-3.292-3.293a1 1 0 01-.083-1.32l.083-.094z" /></svg>
            </a>
          </div>
        </div>
      )}
      {children}
    </>
  );
};

export default MDXPage;