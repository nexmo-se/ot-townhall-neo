#!/bin/bash
set -e

echo "=== Building frontend ==="
cd backend/public
yarn install --production=false
NODE_OPTIONS=--openssl-legacy-provider REACT_APP_API_URL="" yarn build
# Frontend dependencies are only needed for build-time; remove to keep image small.
rm -rf node_modules
cd ../..

echo "=== Building backend ==="
cd backend
yarn install --production=false
node_modules/.bin/rimraf ./build
node_modules/.bin/tsc
# Copy certs only if they exist
if [ -d "./src/certs" ]; then
  mkdir -p ./build/certs && cp -a ./src/certs/. ./build/certs/
fi
# Keep only production dependencies for runtime image.
npm prune --omit=dev
cd ..

echo "=== Build complete ==="
