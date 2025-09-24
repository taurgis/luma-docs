import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import config from '../../../config.ts';
import { routeMeta } from '../../generated-routes.tsx';
import { archivedVersions } from '../../generated-versions.ts';

// Utility to collect available versions (next + archived)
// Utility to collect available versions: current (root) + archived
function getAllVersions() {
  const current = config.versions.current;
  const others = (archivedVersions as readonly string[]).filter(v => v !== `v${current}` && v !== current);
  // Sort archived descending semver
  const parse = (v:string) => v.replace(/^v/, '').split('.').map(n => parseInt(n,10));
  others.sort((a,b) => {
    const pa = parse(a); const pb = parse(b);
    for (let i=0;i<Math.max(pa.length,pb.length);i++) {
      if ((pb[i]||0)!==(pa[i]||0)) { return (pb[i]||0)-(pa[i]||0); }
    }
    return 0;
  });
  const list = [current, ...others];
  return list.filter(v => !config.versions.hidden.includes(v));
}

// Attempt to replace the version segment in a path
function switchPath(pathname: string, targetVersion: string): string {
  const parts = pathname.split('/').filter(Boolean);
  // If path already begins with an archived version folder, replace it
  if (parts.length && (archivedVersions as readonly string[]).includes(parts[0])) {
    if (targetVersion === config.versions.current) {
      parts.shift();
      return `/${parts.join('/')}${pathname.endsWith('/') ? '/' : ''}`;
    }
    parts[0] = targetVersion;
    return `/${parts.join('/')}${pathname.endsWith('/') ? '/' : ''}`;
  }
  return targetVersion !== config.versions.current ? `/${targetVersion}${pathname}` : pathname;
}

const VersionSwitcher: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const versions = getAllVersions();

  // Determine current version from path
  const configuredCurrent = config.versions.current;
  // Determine current version from path: if path starts with archived folder use that, else configured current
  let current: string = configuredCurrent;
  const firstSeg = location.pathname.split('/').filter(Boolean)[0];
  if (firstSeg && (archivedVersions as readonly string[]).includes(firstSeg)) { current = firstSeg; }
  const [open, setOpen] = useState(false);

  // Hide if disabled or if there are no archived versions (only current present)
  const hasArchived = (archivedVersions as readonly string[]).length > 0;
  if (!config.versions.enableSwitcher || !hasArchived) { return null; }

  function onSelect(v: string) {
    if (v === current) { setOpen(false); return; }
    const candidate = switchPath(location.pathname, v);

    // Normalized candidate path (strip trailing slash for comparison like routeMeta.path)
    const normalized = candidate.replace(/\/$/, '') || '/';
    const exists = routeMeta.some(r => r.path.replace(/\/$/, '') === normalized && r.version === v);

    let destination = candidate;
    if (!exists) {
      // Fallback: if switching to archived version, use its root (e.g., /v0.9/). If switching to current, use '/'
      destination = v === config.versions.current ? '/' : `/${v}/`;
    }
    navigate(destination);
    setOpen(false);
  }

  return (
    <div className="relative inline-block text-left w-full mt-4">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full inline-flex justify-between items-center gap-2 px-3 py-2 text-sm font-medium bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 focus:outline-none"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>Version: {current}</span>
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" stroke="currentColor"><path d="M6 8l4 4 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      {open && (
        <ul className="absolute z-20 mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-auto focus:outline-none" role="listbox">
          {versions.map(v => (
            <li key={v}>
              <button
                onClick={() => onSelect(v)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-slate-100 ${v === current ? 'font-semibold text-blue-600' : 'text-slate-700'}`}
                role="option"
                aria-selected={v === current}
              >
                <span>{v}</span>
                {v === current && <span className="text-xs">(current)</span>}
              </button>
            </li>
          ))}
          {versions.length === 0 && (
            <li className="px-3 py-2 text-sm text-slate-500">No versions</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default VersionSwitcher;
