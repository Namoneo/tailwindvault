#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

OUTPUT_FILE=""
SEND_TELEGRAM=true
REPO="${GITHUB_OWNER:-Namoneo}/${GITHUB_REPO:-tailwindvault}"
SINCE_DATE="$(date -u -v-7d '+%Y-%m-%d' 2>/dev/null || python3 - <<'PY'
from datetime import datetime, timedelta, timezone
print((datetime.now(timezone.utc) - timedelta(days=7)).strftime("%Y-%m-%d"))
PY
)"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --output)
      OUTPUT_FILE="${2:-}"
      shift 2
      ;;
    --no-telegram)
      SEND_TELEGRAM=false
      shift
      ;;
    *)
      shift
      ;;
  esac
done

if ! command -v gh >/dev/null 2>&1; then
  printf 'gh CLI is required to build the weekly report.\n' >&2
  exit 1
fi

merged_pr_count="$(gh pr list --repo "$REPO" --state merged --search "merged:>=$SINCE_DATE" --limit 50 --json number --jq 'length' 2>/dev/null || printf '0')"
merged_pr_lines="$(gh pr list --repo "$REPO" --state merged --search "merged:>=$SINCE_DATE" --limit 10 --json number,title,url --template '{{range .}}- PR #{{.number}} {{.title}} ({{.url}})
{{end}}' 2>/dev/null || true)"
opened_issue_count="$(gh issue list --repo "$REPO" --state all --search "created:>=$SINCE_DATE" --limit 100 --json number --jq 'length' 2>/dev/null || printf '0')"
closed_issue_count="$(gh issue list --repo "$REPO" --state closed --search "closed:>=$SINCE_DATE" --limit 100 --json number --jq 'length' 2>/dev/null || printf '0')"
run_lines="$(gh run list --repo "$REPO" --limit 5 --json workflowName,status,conclusion --template '{{range .}}- {{.workflowName}}: {{.status}}/{{.conclusion}}
{{end}}' 2>/dev/null || true)"

report_file="$(mktemp)"
{
  printf '# TailwindVault Weekly Report\n\n'
  printf -- '- Generated: %s\n' "$(date -u '+%Y-%m-%d %H:%M:%S UTC')"
  printf -- '- Repository: %s\n' "$REPO"
  printf -- '- Window start: %s\n\n' "$SINCE_DATE"

  printf '## Summary\n\n'
  printf -- '- PRs merged: %s\n' "$merged_pr_count"
  printf -- '- Issues opened: %s\n' "$opened_issue_count"
  printf -- '- Issues closed: %s\n\n' "$closed_issue_count"

  printf '## Recently Merged PRs\n\n'
  if [[ -n "$merged_pr_lines" ]]; then
    printf '%s\n' "$merged_pr_lines"
  else
    printf 'No merged PRs in the last 7 days.\n'
  fi
  printf '\n'

  printf '## Recent Workflow Runs\n\n'
  if [[ -n "$run_lines" ]]; then
    printf '%s\n' "$run_lines"
  else
    printf 'No workflow run data available.\n'
  fi
} >"$report_file"

if [[ -n "$OUTPUT_FILE" ]]; then
  mkdir -p "$(dirname "$OUTPUT_FILE")"
  cp "$report_file" "$OUTPUT_FILE"
fi

cat "$report_file"

if [[ "$SEND_TELEGRAM" == true ]] && [[ -n "${TELEGRAM_BOT_TOKEN:-}" ]] && [[ -n "${TELEGRAM_CHAT_ID:-}" ]]; then
  curl -sS -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
    -d "chat_id=${TELEGRAM_CHAT_ID}" \
    -d "message_thread_id=${TELEGRAM_TOPIC_ID:-21}" \
    --data-urlencode "text@$report_file" >/dev/null || true
fi

rm -f "$report_file"
