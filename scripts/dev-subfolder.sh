#!/bin/bash

# Development server for subfolder deployment (like GitHub Pages)
# Usage: ./dev-subfolder.sh [repo-name]

set -e

# Resolve base path centrally (matches build & runtime)
BASE_PATH=$(node ./tools/resolve-base-path.mjs)

echo "🚀 Starting development server (base: $BASE_PATH)"
if [[ "$BASE_PATH" == "/" ]]; then
  echo "📍 Root mode (no subfolder)."
else
  echo "� Subfolder mode: $BASE_PATH"
fi

# Generate routes and build CSS
npm run generate:routes
npm run build:css

echo "Starting dev server at: http://localhost:5173$BASE_PATH"
echo "Note: Always include the base path in the URL above. Override with VITE_FORCE_BASE to test other paths."

# Start the dev server with dynamic base path
VITE_BASE_PATH="$BASE_PATH" npx vite-react-ssg dev