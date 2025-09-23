import React from 'react';

interface HeadingProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
}

export const H1: React.FC<HeadingProps> = ({ id, children, className = '' }) => (
  <h1 
    id={id} 
    className={`text-4xl font-extrabold tracking-tight text-slate-900 ${className}`}
  >
    {children}
  </h1>
);

export const PageTitle: React.FC<HeadingProps> = ({ id, children, className = '' }) => (
  <h1 
    id={id} 
    className={`text-4xl font-extrabold tracking-tight text-slate-900 mb-4 ${className}`}
  >
    {children}
  </h1>
);

export const PageSubtitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`mt-4 text-xl text-slate-600 mb-10 ${className}`}>
    {children}
  </div>
);

export const H2: React.FC<HeadingProps> = ({ id, children, className = '' }) => (
  <h2 
    id={id} 
    className={`mt-12 mb-4 text-3xl font-bold tracking-tight text-slate-900 ${className}`}
  >
    {children}
  </h2>
);

export const H3: React.FC<HeadingProps> = ({ id, children, className = '' }) => (
  <h3 
    id={id} 
    className={`mt-8 mb-3 text-xl font-bold tracking-tight text-slate-900 ${className}`}
  >
    {children}
  </h3>
);

export const H4: React.FC<HeadingProps> = ({ id, children, className = '' }) => (
  <h4 
    id={id} 
    className={`mt-6 mb-2 text-lg font-semibold tracking-tight text-slate-900 ${className}`}
  >
    {children}
  </h4>
);

export const H5: React.FC<HeadingProps> = ({ id, children, className = '' }) => (
  <h5 
    id={id} 
    className={`mt-4 mb-2 text-base font-semibold tracking-tight text-slate-900 ${className}`}
  >
    {children}
  </h5>
);

export const H6: React.FC<HeadingProps> = ({ id, children, className = '' }) => (
  <h6 
    id={id} 
    className={`mt-4 mb-2 text-sm font-semibold tracking-tight text-slate-900 uppercase ${className}`}
  >
    {children}
  </h6>
);

export const Lead: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <p className={`text-lg text-slate-600 leading-relaxed ${className}`}>
    {children}
  </p>
);

export const Body: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <p className={`text-base text-slate-700 leading-relaxed ${className}`}>
    {children}
  </p>
);

export const Small: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <p className={`text-sm text-slate-600 ${className}`}>
    {children}
  </p>
);

export const Code: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <code className={`
    px-1.5 py-0.5 rounded-md text-sm font-mono
    bg-slate-100 text-slate-800 border border-slate-200
    ${className}
  `}>
    {children}
  </code>
);

export const Kbd: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <kbd className={`
    px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 
    border border-gray-200 rounded-md shadow-sm
    ${className}
  `}>
    {children}
  </kbd>
);

export const Link: React.FC<{ 
  href: string; 
  children: React.ReactNode; 
  className?: string;
  external?: boolean;
}> = ({ href, children, className = '', external = false }) => (
  <a 
    href={href} 
    className={`
      text-blue-600 hover:text-blue-800 underline underline-offset-2 
      hover:underline-offset-4 transition-all duration-200
      ${className}
    `}
    {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
  >
    {children}
  </a>
);

export const Blockquote: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <blockquote className={`
    border-l-4 border-blue-200 pl-4 py-2 my-4 
    bg-blue-50 text-slate-700 italic
    ${className}
  `}>
    {children}
  </blockquote>
);

export const Pre: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <pre className={`
    bg-slate-50 text-slate-800 p-4 rounded-lg overflow-x-auto
    text-sm font-mono leading-relaxed border border-slate-200
    ${className}
  `}>
    {children}
  </pre>
);

// List components
export const Ul: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <ul className={`list-disc list-inside space-y-1 text-slate-700 ${className}`}>
    {children}
  </ul>
);

export const Ol: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <ol className={`list-decimal list-inside space-y-1 text-slate-700 ${className}`}>
    {children}
  </ol>
);

export const Li: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <li className={`text-slate-700 ${className}`}>
    {children}
  </li>
);

// Table components
export const Table: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className="overflow-x-auto my-6">
    <table className={`min-w-full divide-y divide-gray-200 ${className}`}>
      {children}
    </table>
  </div>
);

export const Thead: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <thead className={`bg-gray-50 ${className}`}>
    {children}
  </thead>
);

export const Tbody: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <tbody className={`bg-white divide-y divide-gray-200 ${className}`}>
    {children}
  </tbody>
);

export const Tr: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <tr className={className}>
    {children}
  </tr>
);

export const Th: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <th className={`
    px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
    ${className}
  `}>
    {children}
  </th>
);

export const Td: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${className}`}>
    {children}
  </td>
);

// Utility components
export const Divider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <hr className={`border-gray-200 my-8 ${className}`} />
);

export const Spacer: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'xl' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-4',
    md: 'h-8',
    lg: 'h-16',
    xl: 'h-24'
  };
  
  return <div className={sizeClasses[size]} />;
};