import React from 'react';

import { TocItem } from '../types';

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
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`block text-sm text-slate-600 hover:text-slate-900 transition-colors ${
                  item.level === 3 ? 'ml-4' : ''
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default OnThisPage;