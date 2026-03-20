#!/usr/bin/env bash
set -euo pipefail

echo "[OpenClaw] Syncing drafted issues with GitHub..."

if [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "ERROR: GITHUB_TOKEN not set"
  exit 1
fi

if [ -z "${GITHUB_OWNER:-}" ] || [ -z "${GITHUB_REPO:-}" ]; then
  echo "ERROR: GITHUB_OWNER or GITHUB_REPO not set"
  exit 1
fi

echo "Owner: $GITHUB_OWNER"
echo "Repo: $GITHUB_REPO"
echo ""
echo "TODO: Implement issue sync logic"
echo "Example: gh issue create --title '...' --body-file templates/rendered/issue-1.md --label enhancement"
