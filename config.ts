/**
 * Luma Docs Configuration
 * 
 * This file contains all the configurable values for your documentation site.
 * Update these values to customize your site's branding, links, and metadata.
 */

export const config = {
  // Site Information
  site: {
    name: "Luma Docs",
    title: "Luma Docs",
    description: "Modern documentation platform built with React and MDX",
    version: "1.0.0",
  },

  // Branding
  branding: {
    logo: {
      text: "Luma",
      accent: "Docs",
    },
  },

  // Links
  links: {
    github: "https://github.com/taurgis/luma-docs",
    // Add more links as needed
    // twitter: "https://twitter.com/yourusername",
    // discord: "https://discord.gg/yourinvite",
    // docs: "https://yourdocs.com",
  },

  // SEO and Metadata
  seo: {
    siteName: "Luma Docs",
    defaultTitle: "Luma Docs",
    defaultDescription: "Modern documentation platform built with React and MDX",
    author: "Your Name",
    keywords: ["documentation", "react", "mdx", "typescript", "vite"],
  },

  // Social Media (for future use)
  social: {
    // twitter: "@yourusername",
    // github: "yourusername",
  },

  // Features (active feature flags only)
  features: {
    search: true,
    breadcrumbs: true,
    structuredDataBreadcrumbs: true,
  },

  // Navigation
  navigation: {
    showVersionBadge: true,
    showGitHubLink: true,
  },
} as const;

export type Config = typeof config;
export default config;