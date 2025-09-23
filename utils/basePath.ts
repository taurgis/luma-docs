// Utility to get the base path for the application
export function getBasePath(): string {
  // Check if we're in the browser
  if (typeof window !== 'undefined') {
    // Try to get base path from the document's base element or from the pathname
    const baseElement = document.querySelector('base');
    if (baseElement && baseElement.href) {
      const url = new URL(baseElement.href);
      return url.pathname;
    }
    
    // Fallback: check if we're running under a known base path
    if (window.location.pathname.startsWith('/luma-docs/')) {
      return '/luma-docs/';
    }
  }
  
  // Server-side or fallback
  return import.meta.env.VITE_BASE_PATH || import.meta.env.BASE_URL || '/';
}

// Helper to create paths with proper base path
export function createPath(path: string): string {
  const basePath = getBasePath();
  
  // Remove leading slash from path if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // If base path is just '/', return the path as-is
  if (basePath === '/') {
    return `/${  cleanPath}`;
  }
  
  // Remove trailing slash from base path and add the path
  const cleanBasePath = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
  
  return `${cleanBasePath  }/${  cleanPath}`;
}