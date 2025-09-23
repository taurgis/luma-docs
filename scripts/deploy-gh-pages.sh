#!/bin/bash

# Deploy to GitHub Pages script
# This script builds the site and pushes it to the gh-pages branch

set -e

echo "🚀 Building site for GitHub Pages deployment..."

# Set the correct base path for GitHub Pages
export PUBLIC_BASE_PATH="/luma-docs/"

# Update vite config for production
sed -i.bak 's|base: "/"|base: "/luma-docs/"|' vite.config.ts

# Clean and build
rm -rf dist/
npm run build

# Restore vite config
mv vite.config.ts.bak vite.config.ts

echo "✅ Build complete! The dist/ folder is ready for deployment."
echo ""
echo "To deploy to GitHub Pages:"
echo "1. Create a gh-pages branch if it doesn't exist"
echo "2. Copy the contents of dist/ to the gh-pages branch"
echo "3. Push the gh-pages branch to GitHub"
echo ""
echo "Or use GitHub Actions for automatic deployment."