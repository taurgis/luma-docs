// MDX module declarations for TypeScript
// Generic MDX module declaration (kept minimal to avoid identifier collisions)
declare module '*.mdx' {
	import * as React from 'react';
	const MDXComponent: React.ComponentType<Record<string, unknown>>;
	export default MDXComponent;
}