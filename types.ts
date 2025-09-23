export interface TocItem {
  id: string;
  label: string;
  level: 2 | 3 | 4;
}

export interface SEOMetadata {
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

export interface PageMeta extends SEOMetadata {
  order?: number;
  path: string;
  slug: string;
}