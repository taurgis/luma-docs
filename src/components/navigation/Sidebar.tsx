import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';


import VersionBadge from '@/components/layout/VersionBadge';
import VersionSwitcher from '@/components/layout/VersionSwitcher';
import Search from '@/components/search/Search';
import { config } from '@/config';
import { routeMeta } from '@/generated-routes';
import { archivedVersions } from '@/generated-versions';
import type { RouteMeta } from '@/types/route-meta';
import { stripTrailingSlash } from '@/utils/routePaths';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const isLinkActive = (path: string) => {
    const target = path === '/' ? '/' : stripTrailingSlash(path);
    const current = location.pathname === '/' ? '/' : stripTrailingSlash(location.pathname);
    return current === target;
  };

  // Determine active version from path
  const firstSeg = location.pathname.split('/').filter(Boolean)[0];
  const activeVersion = (firstSeg && (archivedVersions as readonly string[]).includes(firstSeg))
    ? firstSeg
    : config.versions.current;

  // Filter routes to only those in the active version
  const visibleRoutes = routeMeta.filter(r => r.version === activeVersion);

  // Group routes by their top-level path (within active version only)
  const homeGroupLabel = config.navigation.homeGroupLabel || 'Getting Started';

  // Track grouped routes and original (post-version-strip) segment for each group
  const groupSegments: Record<string, string> = {};
  const isArchivedActive = activeVersion !== config.versions.current;
  const groupedRoutes = visibleRoutes.reduce<Record<string, RouteMeta[]>>((groups, route: RouteMeta) => {
    const normalizedPath = route.path.replace(/\/$/, '');
    const archivedRootMatch = isArchivedActive && normalizedPath === `/${activeVersion}`;

    // Treat archived version root same as current root
    if (route.path === '/' || archivedRootMatch) {
      if (!groups[homeGroupLabel]) { groups[homeGroupLabel] = []; }
      groups[homeGroupLabel].push(route);
      return groups;
    }

    let pathParts = route.path.split('/').filter(Boolean);
    if (isArchivedActive && pathParts[0] === activeVersion) {
      pathParts = pathParts.slice(1); // strip version segment
    }
    if (pathParts.length === 0) { // safety
      if (!groups[homeGroupLabel]) { groups[homeGroupLabel] = []; }
      groups[homeGroupLabel].push(route);
      return groups;
    }
    const topLevel = pathParts[0];
    const groupName = topLevel
      .split('-')
      .map(seg => seg ? seg.charAt(0).toUpperCase() + seg.slice(1) : seg)
      .join(' ');
    if (!groups[groupName]) {
      groups[groupName] = [];
      groupSegments[groupName] = topLevel;
    }
    groups[groupName].push(route);
    return groups;
  }, {});

  // Sort routes within each group by order, then by title
  Object.keys(groupedRoutes).forEach(groupName => {
    groupedRoutes[groupName].sort((a, b) => {
      const orderA = a.order || 0;
      const orderB = b.order || 0;
      
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      
      return (a.title || '').localeCompare(b.title || '');
    });
  });

  return (
    <div className="h-full flex flex-col p-4 sm:p-6">
      {/* Desktop header - hidden on mobile since we have it in Layout */}
      <div className="hidden lg:block mb-8">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-slate-800">{config.branding.logo.text}</span>
          <span className="text-2xl font-light text-blue-500">{config.branding.logo.accent}</span>
        </div>
        {config.navigation.showVersionBadge && (
          <div className="flex justify-start">
            <VersionBadge />
          </div>
        )}
      </div>

      {/* Mobile header spacing */}
      <div className="lg:hidden mb-6" />

  <Search />
  <VersionSwitcher />

  <nav className="flex-1 overflow-y-auto mt-4 sm:mt-6" aria-label="Primary documentation navigation">
        {Object.entries(groupedRoutes).map(([groupName, routes]) => {
          const segment = groupSegments[groupName];
          // Compute expected index path (with version prefix if archived)
          const expectedIndexPath = segment
            ? (isArchivedActive ? `/${activeVersion}/${segment}` : `/${segment}`)
            : undefined;
          let indexRoute = routes.find(r => {
            if (!expectedIndexPath) { return false; }
            return r.path.replace(/\/$/, '') === expectedIndexPath.replace(/\/$/, '');
          });
          const single = routes.length === 1;

          // For single-page groups (not the home group), treat that page as the index route for heading-link styling
          if (!indexRoute && single && groupName !== homeGroupLabel) {
            indexRoute = routes[0];
          }

          const otherRoutes = indexRoute ? routes.filter(r => r !== indexRoute) : routes;

          const headingId = `nav-group-${segment || groupName.replace(/\s+/g, '-').toLowerCase()}`;
          return (
            <div key={groupName} className="mb-6" aria-labelledby={headingId}>
              {indexRoute ? (
                <NavLink
                  to={indexRoute.slug}
                    aria-current={isLinkActive(indexRoute.path) ? 'page' : undefined}
                  id={headingId}
                  className={`block text-xs font-bold uppercase tracking-wider mb-3 rounded-md px-2 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isLinkActive(indexRoute.path)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {groupName}
                </NavLink>
              ) : (
                <h2 id={headingId} className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  {groupName}
                </h2>
              )}
              {otherRoutes.length > 0 && (
                <ul>
                  {otherRoutes.map(route => (
                    <li key={route.path}>
                      <NavLink
                        to={route.slug}
                          aria-current={isLinkActive(route.path) ? 'page' : undefined}
                        className={`block py-2 px-3 text-sm rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isLinkActive(route.path)
                            ? 'text-blue-600 font-semibold bg-blue-50'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        {route.title}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </nav>
      
      {/* Links Section */}
      <div className="mt-4 pt-4 border-t border-slate-200">
        <div className="flex justify-center gap-4">
          {config.navigation.showGitHubLink && config.links.github && (
            <a
              href={config.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
              title="GitHub Repository"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
              <span>GitHub</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;