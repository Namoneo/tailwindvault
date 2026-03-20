#!/usr/bin/env bash
set -euo pipefail

echo "[OpenClaw] Bootstrap for tailwindvault..."

# Create .env from example if it doesn't exist
if [ ! -f .env ] && [ -f .env.example ]; then
  cp .env.example .env
  echo "Created .env from .env.example"
else
  echo ".env already exists or .env.example not found"
fi

# Make scripts executable
chmod +x scripts/*.sh 2>/dev/null || true

echo ""
echo "=== Bootstrap complete ==="
echo "Next steps:"
echo "1. Edit .env and fill in your values"
echo "2. Run ./scripts/analyze.sh to test"
echo "3. Configure GitHub webhooks for automation"
