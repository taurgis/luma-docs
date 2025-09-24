import React from 'react';

import type { TocItem } from '@/types';

interface OnThisPageProps {
  items: TocItem[];
}

const OnThisPage: React.FC<OnThisPageProps> = ({ items }) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="sticky top-8">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">On this page</h3>
      <nav>
        <ul className="space-y-2">
          {items.map((item) => {
            const indent = item.level === 2 ? '' : item.level === 3 ? 'ml-4' : 'ml-8';
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`block text-sm text-slate-600 hover:text-slate-900 transition-colors ${indent}`}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default OnThisPage;