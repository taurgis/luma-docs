import React from 'react';

import { InfoIcon, WarningIcon, SuccessIcon, DangerIcon, LightBulbIcon, NoteIcon } from '@/components/content/icons';

export type CalloutType = 'info' | 'warning' | 'success' | 'note' | 'danger' | 'tip';

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
  className?: string;
  compact?: boolean; // reduces vertical padding when true
}

const typeStyles: Record<CalloutType, string> = {
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  warning: 'bg-amber-50 border-amber-300 text-amber-900',
  success: 'bg-green-50 border-green-200 text-green-800',
  note: 'bg-slate-50 border-slate-200 text-slate-700',
  danger: 'bg-rose-50 border-rose-200 text-rose-800',
  tip: 'bg-indigo-50 border-indigo-200 text-indigo-800'
};

const typeLabel: Partial<Record<CalloutType, string>> = {
  info: 'Info',
  warning: 'Warning',
  success: 'Success',
  note: 'Note',
  danger: 'Important',
  tip: 'Tip'
};

const typeIcon: Record<CalloutType, React.ComponentType<{ className?: string }>> = {
  info: InfoIcon,
  warning: WarningIcon,
  success: SuccessIcon,
  note: NoteIcon,
  danger: DangerIcon,
  tip: LightBulbIcon,
};

export const Callout: React.FC<CalloutProps> = ({
  type = 'info',
  title,
  children,
  className = '',
  compact = false
}) => {
  const IconComponent = typeIcon[type];
  const displayTitle = title || typeLabel[type] || '';

  return (
    <div
      className={`
        border rounded-lg mb-6
        ${typeStyles[type]}
        ${compact ? 'p-3' : 'p-4'}
        ${className}
      `}
      role="alert"
    >
      {displayTitle && (
        <div className="flex items-center gap-2 mb-2">
          <IconComponent className="w-4 h-4 flex-shrink-0" />
          <div className="font-semibold text-sm">
            {displayTitle}
          </div>
        </div>
      )}
      
      <div className={`
        prose prose-sm max-w-none
        ${type === 'info' ? 'prose-blue' : ''}
        ${type === 'warning' ? 'prose-amber' : ''}
        ${type === 'success' ? 'prose-green' : ''}
        ${type === 'note' ? 'prose-slate' : ''}
        ${type === 'danger' ? 'prose-rose' : ''}
        ${type === 'tip' ? 'prose-indigo' : ''}
        ${!displayTitle ? 'flex items-start gap-2' : ''}
      `}>
        {!displayTitle && <IconComponent className="w-4 h-4 flex-shrink-0 mt-0.5" />}
        <div className={!displayTitle ? 'flex-1' : ''}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Callout;