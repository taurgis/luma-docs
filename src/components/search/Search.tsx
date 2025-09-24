import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';

import { config } from '@/config';
// utils relocated under src/utils – switch to alias
import { searchDocs, SearchResult } from '@/utils/search';

const Highlight: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  if (!query) {return <>{text}</>;}
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  // Create stable keys by incrementing a ref counter (avoids pure index usage rule)
  const keyed: React.ReactNode[] = [];
  let counter = 0; // resets each render, acceptable for highlight because list not persisted
  for (const part of parts) {
    const isMatch = part.toLowerCase() === query.toLowerCase();
    const keyBase = `${part}-${counter++}`;
    if (isMatch) {
      keyed.push(
        <mark key={keyBase} className="bg-blue-200 text-blue-800 font-semibold rounded px-0.5">
          {part}
        </mark>
      );
    } else {
      keyed.push(<React.Fragment key={keyBase}>{part}</React.Fragment>);
    }
  }
  return <>{keyed}</>;
};

const SearchIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [scopeAllVersions, setScopeAllVersions] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLUListElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const openSearch = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
    setActiveIndex(-1);
  }, []);

  const handleNavigation = useCallback((path: string, heading?: string, headingId?: string | null) => {
    const targetPath = path;
    let hashFragment = '';
    if (headingId) {
      hashFragment = headingId;
    } else if (heading && heading !== targetPath.split('/').pop()) {
      const generatedId = heading
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      if (generatedId) { hashFragment = generatedId; }
    }
    if (hashFragment) {
      navigate(`${targetPath}#${hashFragment}`);
    } else {
      navigate(targetPath);
    }
    closeSearch();
  }, [navigate, closeSearch]);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {return;}
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          closeSearch();
        } else {
          openSearch();
        }
      }

      if (isOpen) {
        if (e.key === 'Escape') {
          closeSearch();
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          setActiveIndex(prev => prev < results.length - 1 ? prev + 1 : prev);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setActiveIndex(prev => prev > 0 ? prev - 1 : prev);
        } else if (e.key === 'Enter' && activeIndex >= 0) {
          const result = results[activeIndex];
          handleNavigation(result.path, result.heading, result.headingId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, activeIndex, openSearch, closeSearch, handleNavigation]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    closeSearch();
  }, [location.pathname, closeSearch]);

  useEffect(() => {
    if (activeIndex >= 0 && resultsRef.current) {
      const activeElement = resultsRef.current.children[activeIndex] as HTMLLIElement;
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    if (newQuery.length > 1) {
      const raw = searchDocs(newQuery);
      if (scopeAllVersions) {
        setResults(raw);
      } else {
        setResults(raw.filter(r => !r.version || r.version === config.versions.current));
      }
    } else {
      setResults([]);
    }
    setActiveIndex(0);
  };

  // Re-filter when scope toggled
  useEffect(() => {
    if (query.length > 1) {
      const raw = searchDocs(query);
      setResults(scopeAllVersions ? raw : raw.filter(r => !r.version || r.version === config.versions.current));
    }
  }, [scopeAllVersions, query]);
  
  // handleNavigation now memoized above

  const modal = isOpen && typeof document !== 'undefined' ? createPortal(
    <div className="fixed inset-0 z-[1000] flex justify-center items-start pt-4 sm:pt-20 p-4" aria-modal="true" role="dialog" aria-label="Search dialog">
      <div
        className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm"
        role="button"
        tabIndex={0}
        aria-label="Close search"
        onClick={closeSearch}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { closeSearch(); } }}
      />
      <div className="relative z-[1001] bg-white w-full max-w-2xl rounded-lg shadow-xl max-h-[90vh] flex flex-col border border-slate-200">
        <div className="relative flex-shrink-0 border-b border-slate-200">
          <SearchIcon className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Search documentation..."
            className="w-full text-base sm:text-lg py-3 sm:py-4 pl-12 pr-4 focus:outline-none"
            aria-label="Search input"
          />
          <div className="flex items-center justify-between px-4 pb-2 pt-1 text-[11px] sm:text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="uppercase tracking-wide font-semibold text-slate-500">Scope:</span>
              <button
                type="button"
                onClick={() => setScopeAllVersions(false)}
                className={`px-2 py-0.5 rounded border text-xs font-medium ${!scopeAllVersions ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200'}`}
                aria-pressed={!scopeAllVersions}
              >Current</button>
              <button
                type="button"
                onClick={() => setScopeAllVersions(true)}
                className={`px-2 py-0.5 rounded border text-xs font-medium ${scopeAllVersions ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200'}`}
                aria-pressed={scopeAllVersions}
              >All Versions</button>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-slate-400">
              <span>Press</span>
              <kbd className="px-1 py-0.5 bg-slate-100 border border-slate-300 rounded text-[10px]">Esc</kbd>
              <span>to close</span>
            </div>
          </div>
        </div>
        {query.length > 1 && (
          <div className="flex-1 overflow-y-auto min-h-0" aria-live="polite" aria-atomic="false">
            {results.length > 0 ? (
              <>
              <p id="search-results-count" className="sr-only" role="status">{results.length} results found. Use up and down arrows to navigate, enter to open.</p>
              <ul
                ref={resultsRef}
                className="p-3 sm:p-4 space-y-2"
                aria-labelledby="search-results-count"
                role="listbox"
                tabIndex={0}
                aria-activedescendant={activeIndex >= 0 ? `search-result-${activeIndex}` : undefined}
              >
                {results.map((result, index) => (
                  <li key={`${result.path}-${result.heading}`} id={`search-result-${index}`} role="option" aria-selected={activeIndex === index}>
                    <button
                      onClick={() => handleNavigation(result.path, result.heading, result.headingId)}
                      className={`w-full text-left p-3 rounded-md transition-colors ${
                        activeIndex === index ? 'bg-blue-100' : 'hover:bg-slate-100'
                      }`}
                      // Provide an accessible name combining page title and heading
                      aria-label={[
                        result.pageTitle,
                        result.heading && result.heading !== result.pageTitle ? `– ${result.heading}` : null,
                        result.version ? `(${result.version})` : null
                      ].filter(Boolean).join(' ')}
                    >
                      <div className="flex items-center gap-2 font-semibold text-slate-800 text-sm sm:text-base">
                        <Highlight text={result.pageTitle} query={query} />
                        {result.version && result.version !== config.versions.current && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-200 text-[10px] font-medium uppercase tracking-wide text-slate-700">
                            {result.version}
                          </span>
                        )}
                        {!result.version && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-blue-100 text-[10px] font-medium uppercase tracking-wide text-blue-700">
                            {config.versions.current}
                          </span>
                        )}
                      </div>
                      <div className="text-xs sm:text-sm text-slate-600 mb-1">
                        <Highlight text={result.heading} query={query} />
                      </div>
                      <p className="text-xs sm:text-sm text-slate-500 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        <Highlight text={result.snippet} query={query} />
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
              </>
            ) : (
              <p className="p-6 sm:p-8 text-center text-slate-500 text-sm sm:text-base">
                No results found for &quot;{query}&quot;
              </p>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <div className="relative">
        <SearchIcon className="absolute top-1/2 left-3 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <button
          type="button"
          onClick={openSearch}
          className="w-full bg-slate-100 border border-slate-200 rounded-lg py-2 pl-9 pr-12 sm:pr-3 text-sm text-left text-slate-500 hover:border-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Open search (⌘K)"
        >
          Search...
        </button>
        <div className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-slate-400 border border-slate-300 rounded-md px-1.5 py-0.5 pointer-events-none hidden sm:block">
          ⌘K
        </div>
      </div>
      {modal}
    </>
  );
};

export default Search;