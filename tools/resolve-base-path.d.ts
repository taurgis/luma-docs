export function resolveBasePath(options?: { env?: NodeJS.ProcessEnv; cwd?: string }): string;
export function resolveSiteUrl(options?: { env?: NodeJS.ProcessEnv; cwd?: string }): string;
export function resolveDeploymentMeta(options?: { env?: NodeJS.ProcessEnv; cwd?: string }): { basePath: string; siteUrl: string; owner: string; repo: string };
export default resolveBasePath;
