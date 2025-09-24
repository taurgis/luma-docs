import React, { useState, useEffect, useRef } from 'react';

import { CopyIcon, CheckIcon } from '@/components/content/icons';

// Dynamic Prism import to prevent SSR issues
// Define a minimal shape for Prism we rely on to avoid 'any'.
interface PrismStatic {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  highlight: (code: string, grammar: any, language: string) => string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  languages: Record<string, any>;
}
// Use a broader type union to allow deferred assignment.
let Prism: PrismStatic | null = null;

interface CodeBlockProps {
  code: string;
  language: string;
  title?: string;
  showLineNumbers?: boolean;
  className?: string;
  withinTabs?: boolean; // when inside CodeTabs, suppress top rounding even if no title
}

const CodeBlock: React.FC<CodeBlockProps> = ({ 
  code, 
  language, 
  title,
  showLineNumbers = false,
  className = '',
  withinTabs = false
}) => {
  const [copied, setCopied] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  const handleCopy = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Map common language aliases to Prism language identifiers
  const getPrismLanguage = (lang: string): string => {
    const langMap: { [key: string]: string } = {
      'js': 'javascript',
      'ts': 'typescript',
      'jsx': 'jsx',
      'tsx': 'tsx',
      'json': 'json',
      'yml': 'yaml',
      'yaml': 'yaml',
      'sh': 'bash',
      'shell': 'bash',
      'bash': 'bash',
      'zsh': 'bash',
      'md': 'markdown',
      'markdown': 'markdown',
      'css': 'css',
      'scss': 'scss',
      'sass': 'scss',
      'html': 'html',
      'xml': 'xml',
      'sql': 'sql',
      'python': 'python',
      'py': 'python',
      'java': 'java',
      'go': 'go',
      'rust': 'rust',
      'php': 'php',
      'c': 'c',
      'cpp': 'cpp',
      'csharp': 'csharp',
      'swift': 'swift',
      'kotlin': 'kotlin',
      'dart': 'dart',
    };
    return langMap[lang.toLowerCase()] || lang.toLowerCase();
  };

  const prismLanguage = getPrismLanguage(language);

  // Client-side effect for Prism highlighting
  useEffect(() => {
    setIsMounted(true);
    
    const loadPrismAndHighlight = async () => {
      if (typeof window !== 'undefined' && !Prism) {
        try {
          // Dynamically import Prism and language components
          const prismModule = await import('prismjs');
          await import('prismjs/components/prism-javascript');
          await import('prismjs/components/prism-typescript');
          await import('prismjs/components/prism-jsx');
          await import('prismjs/components/prism-tsx');
          await import('prismjs/components/prism-json');
          await import('prismjs/components/prism-yaml');
          await import('prismjs/components/prism-bash');
          await import('prismjs/components/prism-shell-session');
          await import('prismjs/components/prism-markdown');
          await import('prismjs/components/prism-css');
          await import('prismjs/components/prism-scss');
          
          Prism = prismModule.default;
          
          // Try to load the specific language if it's not already loaded
          try {
            if (prismLanguage !== 'javascript' && prismLanguage !== 'typescript') {
              await import(/* @vite-ignore */ `prismjs/components/prism-${prismLanguage}`);
            }
          } catch {
            // Silently continue if specific language fails to load
          }
        } catch (error) {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.warn('Failed to load Prism:', error);
          }
          return;
        }
      }
      
      // Apply highlighting immediately, then with a small delay as fallback
      const applyHighlighting = () => {
        if (Prism && codeRef.current && Prism.languages[prismLanguage]) {
          const highlighted = Prism.highlight(code.trim(), Prism.languages[prismLanguage], prismLanguage);
          codeRef.current.innerHTML = highlighted;
        } else if (codeRef.current) {
          // Fallback to plain text if language not supported
          codeRef.current.textContent = code.trim();
        }
      };
      
      // Try immediate highlighting
      applyHighlighting();
      
      // Fallback with delay for hydration issues
      setTimeout(applyHighlighting, 100);
    };

    loadPrismAndHighlight();
  }, [code, prismLanguage, isMounted]);

  // Get display language name
  const getDisplayLanguage = (): string => {
    const displayNames: { [key: string]: string } = {
      'javascript': 'JavaScript',
      'typescript': 'TypeScript',
      'jsx': 'JSX',
      'tsx': 'TSX',
      'json': 'JSON',
      'yaml': 'YAML',
      'bash': 'Bash',
      'markdown': 'Markdown',
      'css': 'CSS',
      'scss': 'SCSS',
      'html': 'HTML',
      'xml': 'XML',
      'sql': 'SQL',
      'python': 'Python',
      'java': 'Java',
      'go': 'Go',
      'rust': 'Rust',
      'php': 'PHP',
      'c': 'C',
      'cpp': 'C++',
      'csharp': 'C#',
      'swift': 'Swift',
      'kotlin': 'Kotlin',
      'dart': 'Dart',
    };
    return displayNames[prismLanguage] || language.toUpperCase();
  };

  return (
    <div className={`group relative ${className}`}>
      {/* Header with title and language */}
      {(title) && (
        <div className="flex items-center justify-between bg-slate-100 text-slate-800 px-4 py-2 text-sm font-medium rounded-t-lg border border-slate-200 border-b-0">
          <div className="flex items-center space-x-2">
            {title && <span>{title}</span>}
            {title && language && <span className="text-slate-600">•</span>}
            {language && (
              <span className="text-slate-600 text-xs uppercase tracking-wide">
                {getDisplayLanguage()}
              </span>
            )}
          </div>
          
          {/* Copy button */}
          <button
            onClick={handleCopy}
            className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200 p-1 rounded hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Copy code to clipboard"
          >
            {copied ? (
              <CheckIcon className="w-4 h-4 text-green-600" />
            ) : (
              <CopyIcon className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>
      )}
      
  {/* Code container */}
  <div>
        <pre className={`
          overflow-x-auto p-4 text-sm leading-relaxed
          bg-slate-50 text-slate-800 border border-slate-200
          ${(title || withinTabs)
            ? 'rounded-tl-none rounded-tr-none rounded-bl-lg rounded-br-lg border-t-0'
            : 'rounded-lg'
          }
          ${showLineNumbers ? 'pl-12' : ''}
        `}>
          <code
            ref={codeRef}
            className={`language-${prismLanguage} block`}
            style={{ 
              fontFamily: '"Fira Code", "JetBrains Mono", Consolas, "Liberation Mono", Menlo, Courier, monospace'
            }}
          >
            {/* Always show code as fallback - Prism will replace with highlighted version */}
            {code.trim()}
          </code>
        </pre>
        
        {/* Line numbers */}
        {showLineNumbers && (
          <div className="absolute top-0 left-0 p-4 text-sm leading-relaxed text-slate-400 select-none pointer-events-none">
            {code.trim().split('\n').map((_, index) => {
              const key = `${index + 1}`; // line numbers are stable
              return (
                <div key={key} className="text-right pr-4">
                  {index + 1}
                </div>
              );
            })}
          </div>
        )}
        
        {/* Copy button for code-only blocks */}
        {/* Show copy button for any non-titled standalone block (language or not) */}
        {!title && !withinTabs && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200 p-1 rounded bg-slate-200 hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Copy code to clipboard"
          >
            {copied ? (
              <CheckIcon className="w-4 h-4 text-green-600" />
            ) : (
              <CopyIcon className="w-4 h-4 text-slate-600" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

// Inline code component
export const InlineCode: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <code className={`
    px-1.5 py-0.5 rounded-md text-sm font-mono
    bg-slate-100 text-slate-800
    border border-slate-200
    ${className}
  `}>
    {children}
  </code>
);

export default CodeBlock;