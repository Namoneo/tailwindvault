#!/usr/bin/env bash
set -euo pipefail

echo "[OpenClaw] Syncing drafted issues with GitHub..."

if [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "ERROR: GITHUB_TOKEN not set"
  exit 1
fi

OWNER="${GITHUB_OWNER:-}"
REPO="${GITHUB_REPO:-}"
TEMPLATE_DIR="${ISSUE_TEMPLATE_DIR:-.github/ISSUE_TEMPLATE}"

if [ -z "$OWNER" ] || [ -z "$REPO" ]; then
  echo "ERROR: GITHUB_OWNER and GITHUB_REPO must be set"
  exit 1
fi

echo "Owner: $OWNER"
echo "Repo: $REPO"

# Find draft issues (markdown files in .github/ISSUE_TEMPLATE that aren't prefixed with _)
DRAFT_DIR="${TEMPLATE_DIR}/drafts"
if [ ! -d "$DRAFT_DIR" ]; then
  echo "No drafts directory found: $DRAFT_DIR"
  echo "Create drafts as .md files in $DRAFT_DIR to sync them as issues."
  exit 0
fi

DRAFT_FILES=$(find "$DRAFT_DIR" -maxdepth 1 -name "*.md" 2>/dev/null || true)

if [ -z "$DRAFT_FILES" ]; then
  echo "No draft issues found in $DRAFT_DIR"
  exit 0
fi

for file in $DRAFT_FILES; do
  TITLE=$(basename "$file" .md)

  # Check if this title already exists as an open issue
  EXISTS=$(gh issue list --state open --search "$TITLE in:title" --json number,title --jq ".[] | select(.title == \"$TITLE\") | .number" 2>/dev/null || true)

  if [ -n "$EXISTS" ]; then
    echo "⏭️  Issue already exists: #$EXISTS - $TITLE"
    continue
  fi

  # Extract labels from frontmatter if present
  LABELS=$(grep -E "^labels:" "$file" 2>/dev/null | sed 's/labels://' | tr -d '[]' | tr ',' '\n' | tr -d ' ' | grep -v '^$' | tr '\n' ',' | sed 's/,$//' || true)

  # Create the issue
  if [ -n "$LABELS" ]; then
    gh issue create \
      --title "$TITLE" \
      --body-file "$file" \
      --label "$LABELS" \
      --repo "$OWNER/$REPO"
  else
    gh issue create \
      --title "$TITLE" \
      --body-file "$file" \
      --repo "$OWNER/$REPO"
  fi

  echo "✅ Created issue: $TITLE"
done

echo ""
echo "=== Sync complete ==="
