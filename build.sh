#!/bin/bash
set -e

echo "=== Building frontend ==="
cd frontend
yarn install
NODE_OPTIONS=--openssl-legacy-provider REACT_APP_API_URL="" yarn build
cd ..

echo "=== Building backend ==="
cd backend
yarn install
node_modules/.bin/rimraf ./build
node_modules/.bin/tsc
# Copy certs only if they exist
if [ -d "./src/certs" ]; then
  mkdir -p ./build/certs && cp -a ./src/certs/. ./build/certs/
fi
cd ..

echo "=== Build complete ==="
