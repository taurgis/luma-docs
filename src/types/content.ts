// Content-related structural types (Table of Contents, page-level meta prior to full SEO enrichment)

export interface TocItem {
  id: string;
  label: string;
  level: 2 | 3 | 4;
}

// Legacy SEOMetadata/PageMeta kept for any remaining utilities; prefer RouteMeta + SEOBase going forward.
// (Deprecated) SEOMetadata/PageMeta removed in favor of unified RouteMeta + SEOBase.
