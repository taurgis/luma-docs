#!/usr/bin/env node
/* eslint-disable no-undef */
// Dynamic preview using unified base path resolution.
// Usage: npm run preview:resolved
import { spawn } from 'node:child_process';
import { resolveBasePath } from './resolve-base-path.mjs';

const base = resolveBasePath();
console.log(`▶ Starting preview with base: ${base}`);

const args = ['preview', '--base', base];
const child = spawn('vite', args, { stdio: 'inherit', env: { ...process.env, VITE_BASE_PATH: base } });
child.on('exit', code => process.exit(code ?? 0));