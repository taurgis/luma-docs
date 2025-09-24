import React from 'react';

import { config } from '@/config';

const VersionBadge: React.FC = () => {
  return (
    <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
      v{config.site.version}
    </span>
  );
};

export default VersionBadge;