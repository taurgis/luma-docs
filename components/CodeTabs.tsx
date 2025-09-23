import React, { useEffect, useState, useMemo } from 'react';

import CodeBlock from './CodeBlock';

// Minimal classnames combiner (avoids external dependency)
function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export interface CodeTabsTab {
  id?: string;
  label: string;
  language: string;
  code: string;
  title?: string;
}

interface CodeTabsProps {
  tabs: CodeTabsTab[];
  initial?: string; // id or label
  groupId?: string; // optional grouping for future persistence
  className?: string;
  dense?: boolean;
}

// Lightweight accessible tabs for switching between code variants (e.g., YAML / JavaScript)
const STORAGE_KEY = 'luma-docs.codetabs.selection';

// Simple in-memory event hub to broadcast tab changes across mounted groups (no external deps)
type Listener = (group: string, label: string) => void;
const listeners = new Set<Listener>();
function broadcast(group: string, label: string) {
  listeners.forEach(l => l(group, label));
}

const CodeTabs: React.FC<CodeTabsProps> = ({ tabs, initial, groupId, className, dense: _dense }) => {
  const [isClient, setIsClient] = useState(false);
  
  // Generate consistent IDs that work for both SSR and client
  const normalized = useMemo(() => {
    return tabs.map((t, idx) => ({ 
      ...t, 
      id: t.id || `tab-${idx}` // Use index-based ID instead of useId for consistency
    }));
  }, [tabs]);
  
  const initialIndex = Math.max(0, normalized.findIndex(t => t.id === initial || t.label === initial));
  
  // Always start with the initialIndex to ensure SSR/client consistency
  const [activeIndex, setActiveIndex] = useState(initialIndex >= 0 ? initialIndex : 0);
  const [hasRestoredFromStorage, setHasRestoredFromStorage] = useState(false);

  // Client-side hydration effect
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Restore from localStorage on client mount, if groupId provided
  useEffect(() => {
    if (!isClient || !groupId || hasRestoredFromStorage) {return;}
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const selection = parsed[groupId];
        if (selection) {
          const foundIndex = normalized.findIndex(t => t.label === selection);
          if (foundIndex >= 0) {
            setActiveIndex(foundIndex);
          }
        }
      }
    } catch {
      // Silently ignore localStorage errors
    }
    
    setHasRestoredFromStorage(true);
  }, [isClient, groupId, normalized, hasRestoredFromStorage]);

  // Listen for broadcasts from other CodeTabs instances
  useEffect(() => {
    if (!groupId) {return;}
    
    const listener: Listener = (group, label) => {
      if (group === groupId) {
        const foundIndex = normalized.findIndex(t => t.label === label);
        if (foundIndex >= 0) {
          setActiveIndex(foundIndex);
        }
      }
    };
    
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, [groupId, normalized]);

  const handleTabClick = (index: number) => {
    setActiveIndex(index);
    const tab = normalized[index];
    
    if (groupId && isClient) {
      // Store in localStorage
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const parsed = stored ? JSON.parse(stored) : {};
        parsed[groupId] = tab.label;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      } catch {
        // Silently ignore localStorage errors
      }
      
      // Broadcast to other instances
      broadcast(groupId, tab.label);
    }
  };

  const activeTab = normalized[activeIndex];

  return (
    <div className={cx('not-prose mb-6', className)}>
      {/* Tab Navigation */}
      <div className="bg-slate-100 rounded-t-lg border-b border-slate-200">
        <div className="flex space-x-1 p-1">
          {normalized.map((tab, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(index)}
                className={cx(
                  'px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
                  isActive
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                )}
                aria-selected={isActive}
                role="tab"
                tabIndex={isActive ? 0 : -1}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div role="tabpanel" className="focus:outline-none">
        {activeTab && (
          <CodeBlock
            key={`${activeTab.id}-${activeIndex}`} // Force re-render when tab changes
            code={activeTab.code}
            language={activeTab.language}
            title={activeTab.title}
            className="rounded-t-none"
            withinTabs
          />
        )}
      </div>
    </div>
  );
};

export default CodeTabs;