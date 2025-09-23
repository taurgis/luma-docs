import React, { useState } from 'react';

import { ChevronDownIcon, ChevronRightIcon } from './icons';

interface CollapsibleProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  intent?: 'info' | 'warn' | 'danger' | 'plain';
  id?: string;
  className?: string;
  showIcon?: boolean;
}

const intentStyles: Record<string, string> = {
  info: 'border-blue-200 bg-blue-50',
  warn: 'border-yellow-200 bg-yellow-50',
  danger: 'border-red-200 bg-red-50',
  plain: 'border-gray-200 bg-white'
};

const intentTextStyles: Record<string, string> = {
  info: 'text-blue-900',
  warn: 'text-yellow-900',
  danger: 'text-red-900',
  plain: 'text-gray-800'
};

const intentContentStyles: Record<string, string> = {
  info: 'text-blue-800',
  warn: 'text-yellow-800',
  danger: 'text-red-800',
  plain: 'text-gray-700'
};

export const Collapsible: React.FC<CollapsibleProps> = ({ 
  title, 
  defaultOpen = false, 
  children, 
  intent = 'plain', 
  id, 
  className = '',
  showIcon = true 
}) => {
  const [open, setOpen] = useState(defaultOpen);
  
  return (
    <div 
      id={id} 
      className={`rounded-xl border overflow-hidden transition-colors duration-200 mb-6 ${intentStyles[intent]} ${className}`}
    > 
      <button
        onClick={() => setOpen(o => !o)}
        className={`
          w-full flex items-center justify-between px-5 py-3 text-left text-sm font-semibold
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset
          transition-colors duration-200 hover:bg-opacity-70
          ${intentTextStyles[intent]}
        `}
        aria-expanded={open}
        aria-controls={id ? `${id}-content` : undefined}
      >
        <span className="flex items-center gap-2">
          {showIcon && (
            open ? (
              <ChevronDownIcon className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRightIcon className="w-4 h-4 text-gray-500" />
            )
          )}
          {title}
        </span>
        {!showIcon && (
          <span className="ml-4 text-gray-500 font-mono text-lg leading-none">
            {open ? '−' : '+'}
          </span>
        )}
      </button>
      
      {open && (
        <div 
          id={id ? `${id}-content` : undefined}
          className={`
            px-5 pb-5 pt-1 text-sm space-y-4
            animate-fade-in
            ${intentContentStyles[intent]}
          `}
        >
          <div className="prose prose-sm max-w-none">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default Collapsible;