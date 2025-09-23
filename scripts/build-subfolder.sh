#!/bin/bash

# Build for subfolder deployment (like GitHub Pages)
# Usage: ./build-subfolder.sh [repo-name]
# If no repo-name is provided, it will try to detect from git remote or use current directory name

set -e

# Determine the repository name
if [ "$1" ]; then
    REPO_NAME="$1"
elif [ "$GITHUB_REPOSITORY" ]; then
    # Extract repo name from GITHUB_REPOSITORY (owner/repo-name -> repo-name)
    REPO_NAME=$(basename "$GITHUB_REPOSITORY")
    # Extract username from GITHUB_REPOSITORY (owner/repo-name -> owner)
    USERNAME=$(dirname "$GITHUB_REPOSITORY")
elif git rev-parse --git-dir > /dev/null 2>&1; then
    # Try to get from git remote
    GIT_URL=$(git config --get remote.origin.url 2>/dev/null || echo "")
    if [ "$GIT_URL" ]; then
        REPO_NAME=$(basename "$GIT_URL" .git)
        # Extract username from git URL
        if [[ "$GIT_URL" == *"github.com"* ]]; then
            # Handle both SSH and HTTPS URLs
            if [[ "$GIT_URL" == git@github.com:* ]]; then
                # SSH format: git@github.com:username/repo.git
                USERNAME=$(echo "$GIT_URL" | sed 's/git@github.com://' | sed 's/\/.*$//')
            else
                # HTTPS format: https://github.com/username/repo.git
                USERNAME=$(echo "$GIT_URL" | sed 's/.*github.com\///' | sed 's/\/.*$//')
            fi
        else
            USERNAME="your-username"
        fi
    else
        # Fallback to current directory name
        REPO_NAME=$(basename "$(pwd)")
        USERNAME="your-username"
    fi
else
    # Final fallback to current directory name
    REPO_NAME=$(basename "$(pwd)")
    USERNAME="your-username"
fi

echo "🚀 Building site for subfolder deployment..."
echo "📁 Repository name: $REPO_NAME"
echo "👤 Username: $USERNAME"
echo "🌐 Target URL: https://$USERNAME.github.io/$REPO_NAME/"

# Clean the dist directory
rm -rf dist/

# Generate routes, build CSS, and other assets
npm run generate:routes
npm run build:css
npm run generate:search-index
npm run generate:sitemap

# Build the site with dynamic subfolder base path
VITE_BASE_PATH="/$REPO_NAME/" npx vite-react-ssg build --base="/$REPO_NAME/"

echo "✅ Build complete! Site ready for deployment in dist/ folder"
echo "🌐 Site will work at: https://$USERNAME.github.io/$REPO_NAME/"