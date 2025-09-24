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
  // Versioning (multi-version documentation support)
  versions: {
  // The label of the version currently represented by root-level `content/pages/` content
    current: "v1.0", // label for root-level content (current stable)
    // If true, expose a version switcher UI component
    enableSwitcher: true,
    // Strategy: 'folder' means historical versions live under /versions/<version>/
    strategy: 'folder' as const,
    // Optional: list of retired versions to hide from switcher (still directly reachable)
    hidden: [] as string[],
    // Display ordering override (otherwise sorted descending semver with 'next' first)
    order: [] as string[],
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
    // Label used for grouping the root ("/" index) page in the sidebar
    // Change to something like "Introduction" or "Overview" to customize
    homeGroupLabel: 'Getting Started'
  },
} as const;

export type Config = typeof config;
export default config;