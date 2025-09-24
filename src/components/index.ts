// Enhanced component library exports (updated paths after folder re-org)
export { default as CodeBlock, InlineCode } from './content/CodeBlock';
export { default as Callout } from './feedback/Callout';
export { default as Collapsible } from './content/Collapsible';
export { default as CodeTabs } from './content/CodeTabs';

// Typography exports
export {
  H1, H2, H3, H4, H5, H6,
  PageTitle, PageSubtitle, Lead, Body, Small,
  Code, Kbd, Link, Blockquote, Pre,
  Ul, Ol, Li,
  Table, Thead, Tbody, Tr, Th, Td,
  Divider, Spacer
} from './layout/Typography';

// Icon exports
export {
  CopyIcon, CheckIcon, ChevronDownIcon, ChevronRightIcon,
  InfoIcon, WarningIcon, SuccessIcon, DangerIcon, LightBulbIcon, NoteIcon
} from './content/icons';

// Existing component exports
export { default as Layout } from '../app/layout/Layout';
export { default as MDXPage } from './content/MDXPage';
export { default as MDXWrapper } from './content/MDXWrapper';
export { default as OnThisPage } from './navigation/OnThisPage';
export { default as Search } from './search/Search';
export { default as SEO } from './seo/SEO';
export { default as Sidebar } from './navigation/Sidebar';
export { default as VersionBadge } from './layout/VersionBadge';
export { default as Breadcrumbs } from './seo/Breadcrumbs';
export { default as ErrorBoundary } from '../app/layout/ErrorBoundary';
export { default as NextLink } from './navigation/NextLink';