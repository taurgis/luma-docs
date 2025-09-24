import React from 'react';
import { Link } from 'react-router-dom';

interface NextLinkProps {
  href: string;
  label: string;
  className?: string;
}

/**
 * Small forward navigation link shown at the bottom of a page to encourage linear onboarding flow.
 */
const NextLink: React.FC<NextLinkProps> = ({ href, label, className = '' }) => {
  return (
    <div className={`mt-12 pt-6 border-t border-slate-200 flex justify-end ${className}`}>
      <Link
        to={href}
        className="group inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
      >
        <span>Next: {label}</span>
        <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
      </Link>
    </div>
  );
};

export default NextLink;