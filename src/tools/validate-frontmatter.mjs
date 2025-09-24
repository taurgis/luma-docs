#!/usr/bin/env node
/**
 * Validates MDX frontmatter across content/pages/ and content/versions/ folders.
 * Exits non-zero on first validation failure (aggregating is possible but slower).
 */
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
// Import JS runtime version of the schema (Node cannot execute .ts without a loader)
import { FrontmatterSchema } from './frontmatter-schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


let hasError = false;

function validateFile(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const parsed = matter(raw);
  const res = FrontmatterSchema.safeParse(parsed.data);
  if (!res.success) {
    hasError = true;
  globalThis.console.error(`\n❌ Frontmatter error in: ${file}`);
    for (const issue of res.error.issues) {
  globalThis.console.error(` - ${issue.path.join('.') || '(root)'}: ${issue.message}`);
    }
  }
}

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full);
    else if (entry.endsWith('.mdx')) validateFile(full);
  }
}

walk(path.join(__dirname, '../../', 'content', 'pages'));
walk(path.join(__dirname, '../../', 'content', 'versions'));

if (hasError) {
  globalThis.console.error('\nFrontmatter validation failed.');
  process.exit(1);
} else {
  globalThis.console.log('✅ Frontmatter validation passed');
}
