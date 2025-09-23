/**
 * Unified base path resolution for the project.
 *
 * Priority order (first hit wins):
 * 1. VITE_FORCE_BASE (explicit override) – e.g. "/docs/"
 * 2. VITE_BASE_PATH (already computed/provided by external system)
 * 3. GITHUB_REPOSITORY (CI env) – username/repo
 *    - If repo ends with .github.io -> root deployment => '/'
 *    - Else => '/repo/'
 * 4. Git remote origin URL (local dev) – derive repo name
 *    - Same .github.io check as above
 * 5. Fallback '/'
 *
 * All returned values are normalised:
 *  - Always starts with '/'
 *  - Always ends with '/' (except the root path which is just '/')
 */
import { execSync } from 'node:child_process';
/* eslint-disable no-undef */ // process is available in Node runtime

function sanitizeBase(base) {
  if (!base || base === '.' || base === './') return '/';
  let b = base.trim();
  // Accept accidental quotes
  if ((b.startsWith('"') && b.endsWith('"')) || (b.startsWith("'") && b.endsWith("'"))) {
    b = b.slice(1, -1);
  }
  if (!b.startsWith('/')) b = `/${b}`;
  if (b !== '/' && !b.endsWith('/')) b = `${b}/`;
  // Collapse duplicate slashes (but preserve protocol-like patterns just in case)
  b = b.replace(/\/+/g, '/');
  return b === '//' ? '/' : b;
}

function repoNameFromGitUrl(url) {
  if (!url) return null;
  // Remove trailing .git
  const cleaned = url.replace(/\.git$/, '');
  // SSH: git@github.com:user/repo
  // HTTPS: https://github.com/user/repo
  const match = cleaned.match(/github\.com[:/][^/]+\/([^/]+)$/);
  if (match) return match[1];
  // Fallback: last path segment
  const parts = cleaned.split(/[/:]/).filter(Boolean);
  return parts.length ? parts[parts.length - 1] : null;
}

export function resolveBasePath(options = {}) {
  const env = options.env || process.env;

  // 1. Explicit override
  if (env.VITE_FORCE_BASE) {
    return sanitizeBase(env.VITE_FORCE_BASE);
  }

  // 2. Precomputed base path
  if (env.VITE_BASE_PATH) {
    return sanitizeBase(env.VITE_BASE_PATH);
  }

  // 3. GitHub Actions / general GH env
  if (env.GITHUB_REPOSITORY) {
    const repo = env.GITHUB_REPOSITORY.split('/')[1] || '';
    if (repo.endsWith('.github.io')) return '/';
    return sanitizeBase(`/${repo}/`);
  }

  // 4. Local git remote detection
  try {
    const remoteUrl = execSync('git config --get remote.origin.url', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString().trim();
    const repo = repoNameFromGitUrl(remoteUrl);
    if (repo) {
      if (repo.endsWith('.github.io')) return '/';
      return sanitizeBase(`/${repo}/`);
    }
  } catch {
    // ignore
  }

  // 5. Fallback root
  return '/';
}

// If executed directly, print the base path
if (import.meta.url === `file://${process.argv[1]}`) {
  process.stdout.write(resolveBasePath());
}

export default resolveBasePath;
