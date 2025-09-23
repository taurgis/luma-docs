#!/bin/bash

# Development server for subfolder deployment (like GitHub Pages)
# Usage: ./dev-subfolder.sh [repo-name]

set -e

# Determine the repository name (same logic as build script)
if [ "$1" ]; then
    REPO_NAME="$1"
elif [ "$GITHUB_REPOSITORY" ]; then
    REPO_NAME=$(basename "$GITHUB_REPOSITORY")
    USERNAME=$(dirname "$GITHUB_REPOSITORY")
elif git rev-parse --git-dir > /dev/null 2>&1; then
    GIT_URL=$(git config --get remote.origin.url 2>/dev/null || echo "")
    if [ "$GIT_URL" ]; then
        REPO_NAME=$(basename "$GIT_URL" .git)
        # Extract username from git URL
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
else
    REPO_NAME=$(basename "$(pwd)")
    USERNAME="your-username"
fi

echo "🚀 Starting development server in subfolder mode..."
echo "📁 Repository name: $REPO_NAME"
echo "👤 Username: $USERNAME"

# Generate routes and build CSS
npm run generate:routes
npm run build:css

echo "Starting development server at http://localhost:5173/$REPO_NAME/"
echo "Note: Use the full URL including /$REPO_NAME/ to access the site"

# Start the dev server with dynamic base path
VITE_BASE_PATH="/$REPO_NAME/" npx vite-react-ssg dev --base="/$REPO_NAME/"