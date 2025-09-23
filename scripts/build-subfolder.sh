#!/bin/bash

# Build for subfolder deployment (like GitHub Pages)
# Usage: ./build-subfolder.sh [repo-name]
# If no repo-name is provided, it will try to detect from git remote or use current directory name

set -e

# Resolve base path centrally
BASE_PATH=$(node ./scripts/resolve-base-path.mjs)

# Derive repo/user for informational logging (best-effort, non-fatal)
if [ "$GITHUB_REPOSITORY" ]; then
    USERNAME=$(echo "$GITHUB_REPOSITORY" | cut -d'/' -f1)
    REPO_NAME=$(echo "$GITHUB_REPOSITORY" | cut -d'/' -f2)
else
    GIT_URL=$(git config --get remote.origin.url 2>/dev/null || echo "")
    if [ "$1" ]; then
        REPO_NAME="$1"
    elif [ "$GIT_URL" ]; then
        REPO_NAME=$(basename "$GIT_URL" .git)
        if [[ "$GIT_URL" == *"github.com"* ]]; then
            if [[ "$GIT_URL" == git@github.com:* ]]; then
                USERNAME=$(echo "$GIT_URL" | sed 's/git@github.com://' | sed 's/\/.*$//')
            else
                USERNAME=$(echo "$GIT_URL" | sed 's/.*github.com\///' | sed 's/\/.*$//')
            fi
        else
            USERNAME="your-username"
        fi
    else
        REPO_NAME=$(basename "$(pwd)")
        USERNAME="your-username"
    fi
fi

echo "🚀 Building site (base: $BASE_PATH)"
echo "📁 Repository: $USERNAME/$REPO_NAME"
if [[ "$BASE_PATH" == "/" ]]; then
    echo "🌐 Root Pages deployment expected (username.github.io)"
else
    echo "🌐 Subfolder deployment expected: https://$USERNAME.github.io$BASE_PATH"
fi

# Clean the dist directory
rm -rf dist/

# Generate routes, build CSS, and other assets
npm run generate:routes
npm run build:css
npm run generate:search-index
SITE_URL="https://$USERNAME.github.io/$REPO_NAME" npm run generate:sitemap

# Build the site (Vite config will resolve the same BASE_PATH)
VITE_BASE_PATH="$BASE_PATH" npx vite-react-ssg build

echo "✅ Build complete! Dist contents ready."
if [[ "$BASE_PATH" == "/" ]]; then
    echo "🌐 Site will work at: https://$USERNAME.github.io/"
else
    echo "🌐 Site will work at: https://$USERNAME.github.io$BASE_PATH"
fi