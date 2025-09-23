/* eslint-disable import/order */
import React from 'react';
import { useLocation } from 'react-router-dom';
import config from '../config';
import { routeMeta, type RouteMeta } from '../src/generated-routes';
import { getBasePath } from '../utils/basePath';
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

  return (
    <>
      <SEO
        {...finalMeta}
        canonical={finalMeta.canonical || location.pathname}
        baseUrl={baseUrl}
        breadcrumbs={breadcrumbs}
      />
      {children}
    </>
  );
};

export default MDXPage;