import React from 'react';
import { useLocation } from 'react-router-dom';
import SEO from './SEO';
import { routeMeta } from '../src/generated-routes';
import { getBasePath } from '../utils/basePath';

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
  const currentMeta = routeMeta.find(route => {
    const routePath = route.path;
    const currentPath = location.pathname;
    
    // Handle trailing slash variations
    const normalizedRoutePath = routePath === '/' ? '/' : routePath.replace(/\/$/, '');
    const normalizedCurrentPath = currentPath === '/' ? '/' : currentPath.replace(/\/$/, '');
    
    return normalizedRoutePath === normalizedCurrentPath;
  });

  // Merge explicit meta with route meta, with explicit meta taking precedence
  const finalMeta = {
    ...currentMeta,
    ...explicitMeta
  };

  // Build base URL for canonical URLs
  const basePath = getBasePath();
  const baseUrl = typeof window !== 'undefined' 
    ? `${window.location.protocol}//${window.location.host}${basePath}`
    : basePath;

  return (
    <>
      <SEO 
        {...finalMeta}
        canonical={finalMeta.canonical || location.pathname}
        baseUrl={baseUrl}
      />
      {children}
    </>
  );
};

export default MDXPage;