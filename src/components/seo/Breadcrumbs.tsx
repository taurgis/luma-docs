import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import { config } from '@/config';
import { routeMeta } from '@/generated-routes';
import type { RouteMeta, BreadcrumbItem } from '@/types';

type Crumb = BreadcrumbItem;

// Utility to normalize a path (remove trailing slash except root)
function normalize(p: string): string {
  if (p === '/') { return '/'; }
  return p.replace(/\/$/, '');
}

function buildBreadcrumbs(pathname: string): Crumb[] {
  const crumbs: Crumb[] = [];
  const clean = pathname === '/' ? '/' : pathname.replace(/\/?$/, '/');
  // Skip if root only
  if (clean === '/') {return crumbs;}
  // Always include home link first
  crumbs.push({ name: config.site.name, path: '/' });
  const segments = clean.split('/').filter(Boolean); // remove empty
  const cumulative: string[] = [];
  segments.forEach((seg: string) => {
    cumulative.push(seg);
    const partial = `/${cumulative.join('/')}`;
  const route = routeMeta.find((r: RouteMeta) => normalize(r.path) === normalize(partial));
    const title = route?.title || seg.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    // Use route slug if available for consistent trailing slash style
    const navPath = route?.slug || `${partial}/`;
    crumbs.push({ name: title, path: navPath });
  });
  return crumbs;
}

interface BreadcrumbsProps {
  id?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ id }) => {
  const location = useLocation();
  const crumbs = buildBreadcrumbs(location.pathname);
  if (!crumbs.length) {return null;}

  return (
    <nav id={id} aria-label="Breadcrumbs" className="mb-6 text-sm text-slate-600">
      <ol className="flex flex-wrap items-center gap-1">
        {crumbs.map((c, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li key={c.path} className="flex items-center gap-1">
              {!isLast ? (
                <Link to={c.path} className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors">
                  {c.name}
                </Link>
              ) : (
                <span className="font-medium text-slate-800" aria-current="page">{c.name}</span>
              )}
              {!isLast && <span className="text-slate-400">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
