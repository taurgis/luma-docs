// Unified base path helper – now relies solely on build-time resolution
// via tools/resolve-base-path.mjs wired into Vite config (VITE_BASE_PATH)

function normalize(base: string | undefined): string {
  if (!base || base === '.' || base === './') { return '/'; }
  let b = base.trim();
  if (!b.startsWith('/')) { b = `/${b}`; }
  if (b !== '/' && !b.endsWith('/')) { b = `${b}/`; }
  return b.replace(/\\+/g, '/');
}

export function getBasePath(): string {
  return normalize(import.meta.env.VITE_BASE_PATH || import.meta.env.BASE_URL || '/');
}

// Helper to create paths with proper base path
export function createPath(path: string): string {
  const basePath = getBasePath();
  const clean = path.startsWith('/') ? path.slice(1) : path;
  if (basePath === '/') { return `/${clean}`; }
  return `${basePath}${clean}`;
}