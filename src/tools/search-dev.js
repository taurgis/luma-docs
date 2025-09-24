#!/usr/bin/env node

/**
 * Search Development Utility
 * 
 * Helps with search functionality development and debugging.
 * Provides commands for generating and validating search indexes.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..', '..');

const commands = {
  generate: generateSearchIndex,
  validate: validateSearchIndex,
  help: showHelp
};

function main() {
  const command = process.argv[2] || 'help';
  
  if (commands[command]) {
    commands[command]();
  } else {
    console.error(`Unknown command: ${command}`);
    showHelp();
    process.exit(1);
  }
}

function generateSearchIndex() {
  console.log('🔍 Generating search index...');
  
  try {
    // Import and run the existing search index generator
    import('./generate-search-index.js').then(() => {
      console.log('✅ Search index generated successfully');
    });
  } catch (error) {
    console.error('❌ Failed to generate search index:', error);
    process.exit(1);
  }
}

function validateSearchIndex() {
  console.log('🔍 Validating search index...');
  
  const searchIndexPath = path.join(rootDir, 'src', 'generated-search-index.ts');
  
  if (!fs.existsSync(searchIndexPath)) {
    console.error('❌ Search index file not found. Run "npm run generate:search-index" first.');
    process.exit(1);
  }
  
  try {
    const content = fs.readFileSync(searchIndexPath, 'utf-8');
    
    // Basic validation - check for the actual export names used
    if (!content.includes('export const GENERATED_SEARCH_INDEX')) {
      throw new Error('GENERATED_SEARCH_INDEX export not found');
    }
    
    if (!content.includes('export interface SearchableItem')) {
      throw new Error('SearchableItem interface not found');
    }
    
    // Count entries by looking for objects with pageTitle and content properties
    const lines = content.split('\n');
    const entryLines = lines.filter(line => 
      line.trim().includes('"pageTitle":') || line.trim().includes('pageTitle:')
    );
    
    console.log(`✅ Search index is valid`);
    console.log(`   📄 ${entryLines.length} searchable entries found`);
    console.log(`   📁 File size: ${(content.length / 1024).toFixed(2)} KB`);
    
    // Check for common issues
    const warnings = [];
    
    if (entryLines.length === 0) {
      warnings.push('No searchable entries found - check if pages have content');
    }
    
    if (content.length > 500 * 1024) { // 500KB
      warnings.push('Search index is large (>500KB) - consider optimizing content');
    }
    
    // Check for proper TypeScript syntax
    if (!content.includes(': SearchableItem[]')) {
      warnings.push('TypeScript typing may be incorrect');
    }
    
    if (warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      warnings.forEach(warning => console.log(`   • ${warning}`));
    }
    
  } catch (error) {
    console.error('❌ Search index validation failed:', error.message);
    process.exit(1);
  }
}

function showHelp() {
  console.log(`
🔍 Luma Docs Search Development Utility

Usage: npm run search-dev [command]

Commands:
  generate    Generate the search index
  validate    Validate the existing search index  
  help        Show this help message

Examples:
  npm run search-dev generate
  npm run search-dev validate
  npm run search:generate    (alias for generate)
  npm run search:validate    (alias for validate)

The search development utility helps you work with the search functionality
during development. Use 'generate' to create a new search index and 'validate'
to check that the existing index is properly formatted and contains data.
`);
}

// Run if called directly
if (process.argv[1] === __filename) {
  main();
}