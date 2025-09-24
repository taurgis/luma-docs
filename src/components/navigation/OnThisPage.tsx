import React, { useEffect, useState } from 'react';

import type { TocItem } from '@/types';

interface OnThisPageProps {
  items: TocItem[];
}

const OnThisPage: React.FC<OnThisPageProps> = ({ items }) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) { return; }
    if (typeof window === 'undefined') { return; }
    const observer = new IntersectionObserver(
      (entries) => {
        // Use the entry closest to top that's intersecting
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => (a.boundingClientRect.top - b.boundingClientRect.top));
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '0px 0px -70% 0px', threshold: [0, 0.1, 0.5, 1] }
    );
    items.forEach(item => {
      const el = document.getElementById(item.id);
      if (el) { observer.observe(el); }
    });
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Table of contents" className="sticky top-8" role="navigation">
      <h2 className="text-sm font-semibold text-slate-900 mb-4">On this page</h2>
      <ul className="space-y-2">
        {items.map((item) => {
          const indent = item.level === 2 ? '' : item.level === 3 ? 'ml-4' : 'ml-8';
          const isActive = activeId === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`block text-sm transition-colors ${indent} ${isActive ? 'text-blue-700 font-medium' : 'text-slate-600 hover:text-slate-900'}`}
                aria-current={isActive ? 'true' : undefined}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default OnThisPage;