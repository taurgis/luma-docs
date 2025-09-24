#!/usr/bin/env node
/**
 * Centralized build pipeline orchestrator.
 * Usage:
 *   node src/tools/run-build-pipeline.mjs dev
 *   node src/tools/run-build-pipeline.mjs build
 *
 * Goals:
 *  - Single source of truth for ordered generation steps
 *  - Easy timing/diagnostics
 *  - Clear separation between dev (minimal) and build (full) stages
 *  - Future extensibility (e.g. frontmatter validation, lint hooks)
 */
import { execSync } from 'node:child_process';
import process from 'node:process';

// Provide a monotonic timer fallback if performance is not defined (older Node versions)
const now = () => (globalThis.performance ? globalThis.performance.now() : Date.now());

const mode = process.argv[2] || 'dev';
if (!['dev', 'build'].includes(mode)) {
  globalThis.console.error(`Unknown mode '${mode}'. Expected 'dev' or 'build'.`);
  process.exit(1);
}

const STAGES_COMMON = [
  { name: 'generate:versions', cmd: 'npm run generate:versions' },
  { name: 'generate:routes', cmd: 'npm run generate:routes' },
  { name: 'build:css', cmd: 'npm run build:css' }
];

const STAGES_BUILD_ONLY = [
  { name: 'validate:frontmatter', cmd: 'npm run validate:frontmatter' },
  { name: 'generate:search-index', cmd: 'npm run generate:search-index' },
  { name: 'generate:sitemap', cmd: 'npm run generate:sitemap' }
];

const stages = mode === 'build' ? [...STAGES_COMMON, ...STAGES_BUILD_ONLY] : STAGES_COMMON;

function runStage(stage) {
  const start = now();
  process.stdout.write(`\n➡️  [${stage.name}] starting...`);
  try {
    execSync(stage.cmd, { stdio: 'inherit' });
    const ms = (now() - start).toFixed(0);
  globalThis.console.log(`✅  [${stage.name}] done in ${ms}ms`);
    return { name: stage.name, ms: Number(ms), success: true };
  } catch (err) {
    const ms = (now() - start).toFixed(0);
  globalThis.console.error(`❌  [${stage.name}] failed after ${ms}ms`);
    return { name: stage.name, ms: Number(ms), success: false, error: err };
  }
}

globalThis.console.log(`\n📦 Running Luma Docs pipeline in '${mode}' mode`);
const pipelineStart = now();

const results = [];
for (const stage of stages) {
  const res = runStage(stage);
  results.push(res);
  if (!res.success) {
  globalThis.console.error('\nPipeline aborted due to failure.');
    break;
  }
}

const totalMs = (now() - pipelineStart).toFixed(0);
const success = results.every(r => r.success);

globalThis.console.log('\n── Pipeline Summary ──');
for (const r of results) {
  const status = r.success ? 'OK' : 'FAIL';
  globalThis.console.log(`${status.padEnd(4)} ${r.name.padEnd(24)} ${r.ms}ms`);
}
globalThis.console.log(`Total: ${totalMs}ms (${mode})`);

if (!success) {
  process.exit(1);
}
