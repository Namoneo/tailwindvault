#!/usr/bin/env bash
set -euo pipefail

REPO_NAME="${1:-$(basename "$(pwd)")}"

echo "[OpenClaw] Bootstrap for $REPO_NAME..."

# Create .env from example if it doesn't exist
if [ ! -f .env ] && [ -f .env.example ]; then
  cp .env.example .env
  echo "✅ Created .env from .env.example"
elif [ ! -f .env ]; then
  echo "⚠️  No .env or .env.example found"
fi

# Create drafts directory for issue-sync
if [ ! -d ".github/ISSUE_TEMPLATE/drafts" ]; then
  mkdir -p .github/ISSUE_TEMPLATE/drafts
  echo "✅ Created .github/ISSUE_TEMPLATE/drafts/"
fi

# Make scripts executable
chmod +x scripts/*.sh 2>/dev/null || true
echo "✅ Scripts made executable"

# Validate required env vars
MISSING=""
for var in TELEGRAM_BOT_TOKEN TELEGRAM_CHAT_ID GITHUB_TOKEN GITHUB_OWNER GITHUB_REPO; do
  if [ -z "${!var:-}" ]; then
    MISSING="$MISSING $var"
  fi
done

echo ""
echo "=== Bootstrap complete for $REPO_NAME ==="
if [ -n "$MISSING" ]; then
  echo "⚠️  Missing env vars:$MISSING"
  echo "Set them in .env or your shell environment"
else
  echo "✅ All required env vars present"
fi
echo ""
echo "Next steps:"
echo "1. Edit .env and fill in your values" 
echo "2. Run ./scripts/analyze.sh to test"
echo "3. Run ./scripts/issue-sync.sh to sync draft issues"
echo "4. Run ./scripts/report.sh to test Telegram reporting"
