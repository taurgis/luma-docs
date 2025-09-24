import React from 'react';
import { Link } from 'react-router-dom';

import { createPath } from '@/utils/basePath';

export interface BaseLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  to: string; // logical absolute path starting with '/'
  children: React.ReactNode;
  className?: string;
  // Allow disabling base path merging if already processed
  raw?: boolean;
}

/**
 * BaseLink ensures internal links respect the resolved deployment base path.
 * Use inside MDX instead of hardcoding <a href="/foo">.
 */
const BaseLink: React.FC<BaseLinkProps> = ({ to, children, className = '', raw = false, ...rest }) => {
  const final = raw ? to : createPath(to);
  return (
    <Link to={final} className={className} {...rest}>
      {children}
    </Link>
  );
};

export default BaseLink;