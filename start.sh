#!/bin/sh
set -e

echo "Running DB migrations..."
npx drizzle-kit push

echo "Running seed..."
node dist/seed.cjs || echo "Seed skipped (already seeded or failed)"

echo "Starting server on port ${PORT:-3000}..."
exec node server.js