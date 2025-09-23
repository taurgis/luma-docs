import React from 'react';
import { Head } from 'vite-react-ssg';

import { config } from '../config';
import { SEOMetadata } from '../types';

interface SEOProps extends SEOMetadata {
  baseUrl?: string;
}

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
  baseUrl = ''
}) => {
  // Build full title with site name
  const fullTitle = title 
    ? `${title} | ${config.site.name}`
    : `${config.site.title}`;

  // Determine canonical URL
  let fullCanonical = baseUrl;
  if (canonical !== undefined) {
    if (canonical === '' || canonical === '/') {
      fullCanonical = baseUrl;
    } else {
      fullCanonical = `${baseUrl}${canonical.startsWith('/') ? canonical : `/${  canonical}`}`;
    }
  }

  // Default robots behavior
  const robotsContent = robots || (noindex 
    ? 'noindex, nofollow' 
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  );

  // Build structured keywords
  const allKeywords = [
    keywords,
    tags?.join(', '),
    section,
    config.seo.keywords.join(', ')
  ].filter(Boolean).join(', ');

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {allKeywords && <meta name="keywords" content={allKeywords} />}
      {fullCanonical && <link rel="canonical" href={fullCanonical} />}
      
      {/* SEO Meta Tags */}
      <meta name="robots" content={robotsContent} />
      {author && <meta name="author" content={author} />}
      {publishedTime && <meta name="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta name="article:modified_time" content={modifiedTime} />}
      {section && <meta name="article:section" content={section} />}
      {tags?.map((tag, index) => (
        <meta key={index} name="article:tag" content={tag} />
      ))}

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
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
      <meta name="twitter:description" content={description} />
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
    </Head>
  );
};

export default SEO;