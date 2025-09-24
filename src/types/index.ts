// Barrel export for commonly used public types across the codebase.
// Import from '@/types' to access these without deep relative paths.

export * from './seo';
export * from './route-meta';
export * from './content';

// Re-export individual named types for clarity (IDE friendly autocompletion)
export { type SEOBase, type SEOProps, type BreadcrumbItem } from './seo';
export { type RouteMeta, type RouteDefinition, type RouteMetaList } from './route-meta';
export { type TocItem } from './content';
