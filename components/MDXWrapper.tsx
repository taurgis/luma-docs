import { MDXProvider } from '@mdx-js/react';
import React from 'react';

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
  pre: (props: any) => (
    <pre className="overflow-x-auto" {...props} />
  ),
  code: (props: any) => {
    // If it's a code block (has className), render as-is
    if (props.className) {
      return <code {...props} />;
    }
    // Otherwise, it's inline code
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