#!/usr/bin/env node
/**
 * snapshot-version.js
 *
 * Automates creation of a version snapshot by copying the current `content/pages/` directory
 * into `content/versions/<label>/`, updating generated versions metadata, and (optionally)
 * bumping the `config.versions.current` label to a new value.
 *
 * Usage:
 *   node src/tools/snapshot-version.js v1.0
 *   node src/tools/snapshot-version.js v1.0 --bump v1.1
 *
 * Via npm script (after adding to package.json):
 *   npm run snapshot:version -- v1.0
 *   npm run snapshot:version -- v1.0 --bump v1.1
 *
 * Behavior:
 * 1. Validates target label (must start with 'v').
 * 2. Ensures `versions/<label>` does not already exist.
 * 3. Recursively copies all files from `content/pages/` into the new folder.
 * 4. Runs `generate:versions` to refresh `src/generated-versions.ts`.
 * 5. If `--bump <newLabel>` provided, updates `config.ts` current label and regenerates routes.
 */
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..', '..');

function log(msg) { console.log(`[snapshot-version] ${msg}`); }
function error(msg) { console.error(`\n❌ ${msg}`); }
function exitFail(msg, code = 1) { error(msg); process.exit(code); }

function parseArgs() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args[0].startsWith('-')) {
  exitFail('Missing version label. Usage: node src/tools/snapshot-version.js v1.0 [--bump v1.1]');
  }
  const target = args[0];
  let bump;
  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--bump') { bump = args[i + 1]; i++; }
  }
  return { target, bump };
}

function validateLabel(label, kind = 'target') {
  if (!/^v\d+(?:\.\d+){0,2}$/.test(label)) {
    exitFail(`Invalid ${kind} version label '${label}'. Expected pattern vMAJOR[.MINOR[.PATCH]] e.g. v1.0 or v2.1.3`);
  }
}

function readConfigCurrentVersion() {
  const configPath = path.join(rootDir, 'config.ts');
  const source = fs.readFileSync(configPath, 'utf8');
  const match = source.match(/versions\s*:\s*{[\s\S]*?current:\s*"([^"]+)"/);
  return match ? match[1] : undefined;
}

function bumpConfigCurrentVersion(newLabel) {
  const configPath = path.join(rootDir, 'config.ts');
  const source = fs.readFileSync(configPath, 'utf8');
  const replaced = source.replace(/(versions\s*:\s*{[\s\S]*?current:\s*")([^"]+)("\s*,)/, (_, p1, _old, p3) => `${p1}${newLabel}${p3}`);
  if (source === replaced) {
    exitFail('Could not locate current version in config.ts for bump operation.');
  }
  fs.writeFileSync(configPath, replaced, 'utf8');
  log(`Updated config.ts current version to ${newLabel}`);
}

function copyRecursive(src, dest) {
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) { fs.mkdirSync(dest, { recursive: true }); }
    for (const entry of fs.readdirSync(src)) {
  if (entry === '.DS_Store') { continue; }
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else if (stats.isFile()) {
    fs.copyFileSync(src, dest);
  }
}

function runScript(command, args, label) {
  log(`Running ${label}...`);
  const res = spawnSync(command, args, { stdio: 'inherit', cwd: rootDir, env: process.env });
  if (res.status !== 0) { exitFail(`${label} failed with code ${res.status}`); }
}

function main() {
  const { target, bump } = parseArgs();
  validateLabel(target, 'target');
  if (bump) { validateLabel(bump, 'bump'); }

  const current = readConfigCurrentVersion();
  log(`Current config.ts version label: ${current || 'unknown'}`);
  if (current && current !== target) {
    log(`Note: snapshot label (${target}) differs from current label (${current}). This is allowed.`);
  }

  const versionsDir = path.join(rootDir, 'content', 'versions');
  const targetDir = path.join(versionsDir, target);
  const pagesDir = path.join(rootDir, 'content', 'pages');

  if (!fs.existsSync(pagesDir)) { exitFail('content/pages/ directory not found; nothing to snapshot.'); }
  if (fs.existsSync(targetDir)) { exitFail(`content/versions/${target} already exists. Aborting to avoid overwrite.`); }

  if (!fs.existsSync(versionsDir)) { fs.mkdirSync(versionsDir, { recursive: true }); }

  log(`Creating snapshot directory content/versions/${target}`);
  fs.mkdirSync(targetDir);

  log(`Copying content/pages/ -> content/versions/${target}`);
  copyRecursive(pagesDir, targetDir);

  runScript('npm', ['run', '--silent', 'generate:versions'], 'generate:versions');

  if (bump) {
    bumpConfigCurrentVersion(bump);
    runScript('npm', ['run', '--silent', 'generate:routes'], 'generate:routes');
  }

  log('Snapshot complete ✅');
  if (bump) {
  log(`Next steps:\n  1. Update content in content/pages/ for new development of ${bump}.\n  2. Commit: git add . && git commit -m "chore: snapshot ${target} and bump current to ${bump}"`);
  } else {
    log(`Next steps:\n  1. (Optional) bump config.ts current label.\n  2. Commit: git add . && git commit -m "chore: snapshot ${target}"`);
  }
}

try { main(); } catch (e) { exitFail(e.stack || e.message || String(e)); }
