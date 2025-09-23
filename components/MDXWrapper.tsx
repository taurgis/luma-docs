import { MDXProvider } from '@mdx-js/react';
import React from 'react';

import CodeBlock from './CodeBlock';
import MDXPage from './MDXPage';

// Custom components for MDX
const components = {
  h1: (props: any) => (
    <h1 
      id={props.children?.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}
      {...props} 
    />
  ),
  h2: (props: any) => (
    <h2 
      id={props.children?.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}
      {...props} 
    />
  ),
  h3: (props: any) => (
    <h3 
      id={props.children?.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}
      {...props} 
    />
  ),
  h4: (props: any) => (
    <h4 
      id={props.children?.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}
      {...props} 
    />
  ),
  // Handle fenced code blocks at the <pre> level to avoid nested <pre> tags
  pre: (props: any) => {
    const child = props.children;
    // Typical MDX structure: <pre><code class="language-xyz">code...</code></pre>
    if (child && typeof child === 'object' && 'props' in child) {
      const codeEl: any = child;
      const raw = codeEl.props.children;
      const className: string = codeEl.props.className || '';
      const isCodeBlock = /language-/.test(className);
      if (isCodeBlock) {
        const match = className.match(/language-([\w-]+)/);
        const language = match ? match[1] : 'text';
        const code = typeof raw === 'string' ? raw : String(raw);
        return <CodeBlock code={code} language={language} />;
      }
      // Multi-line without language -> still use CodeBlock for consistency
      if (typeof raw === 'string' && raw.includes('\n')) {
        return <CodeBlock code={raw} language="text" />;
      }
    }
    // Fallback (unlikely) - raw pre
    return <pre className="overflow-x-auto" {...props} />;
  },
  // Inline code only (no language-* class & single-line)
  code: (props: any) => {
    const { children, className = '' } = props;
    if (/language-/.test(className)) {
      // Should have been handled by pre; fallback safety
      return children;
    }
    return (
      <code
        className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded text-sm font-mono"
        {...props}
      />
    );
  },
  blockquote: (props: any) => (
    <blockquote 
      className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 italic" 
      {...props} 
    />
  ),
  // SEO component for embedding in MDX
  SEO: (props: any) => <MDXPage meta={props}>{null}</MDXPage>
};

interface MDXWrapperProps {
  children: React.ReactNode;
}

const MDXWrapper: React.FC<MDXWrapperProps> = ({ children }) => {
  return (
    <MDXProvider components={components}>
      {children}
    </MDXProvider>
  );
};

export default MDXWrapper;