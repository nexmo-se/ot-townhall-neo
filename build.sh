#!/bin/bash
set -e

echo "=== Building frontend ==="
cd frontend
yarn install --production=false
NODE_OPTIONS=--openssl-legacy-provider REACT_APP_API_URL="" PUBLIC_URL="" yarn build
# Copy built output to public folder for backend to serve
rm -rf public/static public/index.html public/asset-manifest.json public/service-worker.js public/precache-manifest* && \
cp -r build/* public/
cd ..

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
