import React from 'react';
import { Head } from 'vite-react-ssg';

import { config } from '@/config';
import type { SEOProps } from '@/types/seo';
import { sanitizeHeadText } from '@/utils/sanitize';

const SEO: React.FC<SEOProps> = ({
  title,
  description = config.site.description,
  keywords,
  canonical,
  ogImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  twitterCreator,
  twitterSite,
  author = config.seo.author,
  publishedTime,
  modifiedTime,
  robots,
  noindex = false,
  section,
  tags,
  baseUrl = '',
  breadcrumbs
}) => {
  // Build full title with site name
  const sanitizedTitle = sanitizeHeadText(title) || undefined;
  const fullTitle = sanitizedTitle
    ? `${sanitizedTitle} | ${config.site.name}`
    : `${config.site.title}`;

  // Determine canonical URL (normalize to avoid double slashes)
  const joinUrl = (base: string, p: string) => {
    if (!p) { return base; }
    if (/^https?:\/\//i.test(p)) { return p.replace(/([^:])\/+/g, '$1/'); }
    const cleanBase = base.replace(/\/+$|$/, '/');
    const combined = `${cleanBase}${p.startsWith('/') ? p.substring(1) : p}`;
    return combined.replace(/([^:])\/+/g, '$1/');
  };

  let fullCanonical = baseUrl ? baseUrl.replace(/\/+$/, '/') : '';
  if (canonical !== undefined) {
    fullCanonical = joinUrl(baseUrl, canonical);
  }

  // Default robots behavior
  const robotsContent = robots || (noindex
    ? 'noindex, nofollow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  );

  // Build structured keywords
  const allKeywords = [
    sanitizeHeadText(keywords),
    sanitizeHeadText(tags?.join(', ')),
    sanitizeHeadText(section),
    sanitizeHeadText(config.seo.keywords.join(', '))
  ].filter(Boolean).join(', ');

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
  <meta name="description" content={sanitizeHeadText(description) || config.site.description} />
      {allKeywords && <meta name="keywords" content={allKeywords} />}
      {fullCanonical && <link rel="canonical" href={fullCanonical} />}
      
      {/* SEO Meta Tags */}
      <meta name="robots" content={robotsContent} />
  {author && <meta name="author" content={sanitizeHeadText(author)} />}
      {publishedTime && <meta name="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta name="article:modified_time" content={modifiedTime} />}
  {section && <meta name="article:section" content={sanitizeHeadText(section)} />}
      {tags?.map(tag => {
        const safeTag = sanitizeHeadText(tag, 60);
        return safeTag ? <meta key={`tag-${safeTag}`} name="article:tag" content={safeTag} /> : null;
      })}

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
  <meta property="og:description" content={sanitizeHeadText(description) || config.site.description} />
      <meta property="og:site_name" content={config.site.name} />
      {fullCanonical && <meta property="og:url" content={fullCanonical} />}
      {ogImage && (
        <>
          <meta property="og:image" content={ogImage} />
          <meta property="og:image:alt" content={title || config.site.title} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
        </>
      )}
      <meta property="og:locale" content="en_US" />

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
  <meta name="twitter:description" content={sanitizeHeadText(description) || config.site.description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      {ogImage && <meta name="twitter:image:alt" content={title || config.site.title} />}
      {twitterCreator && <meta name="twitter:creator" content={twitterCreator} />}
      {twitterSite && <meta name="twitter:site" content={twitterSite} />}

      {/* Additional Meta Tags */}
      <meta name="application-name" content={config.site.name} />
      <meta name="apple-mobile-web-app-title" content={config.site.name} />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="theme-color" content="#ffffff" />
      
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": ogType === 'article' ? 'Article' : 'WebPage',
          "headline": fullTitle,
          description,
          "url": fullCanonical,
          ...(author && { "author": { "@type": "Person", "name": author } }),
          ...(publishedTime && { "datePublished": publishedTime }),
            ...(modifiedTime && { "dateModified": modifiedTime }),
          ...(ogImage && { 
            "image": {
              "@type": "ImageObject",
              "url": ogImage,
              "width": 1200,
              "height": 630
            }
          }),
          "publisher": {
            "@type": "Organization",
            "name": config.site.name
          }
        })}
      </script>
      {config.features?.structuredDataBreadcrumbs && breadcrumbs && breadcrumbs.length > 1 && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbs.map((c, idx) => ({
              "@type": "ListItem",
              "position": idx + 1,
              "name": c.name,
              "item": `${baseUrl}${c.path.startsWith('/') ? c.path.substring(1) : c.path}`
            }))
          })}
        </script>
      )}
    </Head>
  );
};

export default SEO;