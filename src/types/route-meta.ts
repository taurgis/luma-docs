// Shared route metadata & definition types for generated routing artifacts.
// Imported by the route generator output (src/generated-routes.tsx).
// Extend cautiously; adding fields is safe, renaming/removing requires regeneration & consumer updates.

export interface RouteMeta {
  title?: string;
  description?: string;
  order?: number;
  path: string; // path without trailing slash (except root)
  slug: string; // canonical navigation slug (with trailing slash except root)
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
  version?: string; // current label or archived version folder name
}

export interface RouteDefinition {
  path: string;
  element: unknown; // ReactNode at runtime; kept generic here to avoid React type dependency in plain .ts consumers.
  meta: RouteMeta;
}

export type RouteMetaList = RouteMeta[];
