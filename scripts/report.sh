#!/usr/bin/env bash
set -euo pipefail

echo "[OpenClaw] Posting report to Telegram..."

if [ -z "${TELEGRAM_BOT_TOKEN:-}" ]; then
  echo "ERROR: TELEGRAM_BOT_TOKEN not set"
  exit 1
fi

if [ -z "${TELEGRAM_CHAT_ID:-}" ]; then
  echo "ERROR: TELEGRAM_CHAT_ID not set"
  exit 1
fi

TOPIC_ID="${3:-21}"
REPO_NAME="${OPENCLAW_REPO_NAME:-tailwindvault}"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M')

# Build the message
if [ $# -ge 1 ]; then
  MESSAGE="$1"
else
  MESSAGE="📊 Daily report for ${REPO_NAME}"
fi

# Escape special characters for JSON
ESCAPED_MESSAGE=$(echo "$MESSAGE" | sed 's/"/\\"/g' | sed 's/\n/\\n/g')

# Send to topic via Telegram Bot API
RESPONSE=$(curl -s -X POST \
  "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  -H "Content-Type: application/json" \
  -d "{
    \"chat_id\": \"${TELEGRAM_CHAT_ID}\",
    \"message_thread_id\": \"${TOPIC_ID}\",
    \"text\": \"🤖 *${REPO_NAME}* | ${TIMESTAMP}\n\n${ESCAPED_MESSAGE}\",
    \"parse_mode\": \"Markdown\"
  }")

if echo "$RESPONSE" | grep -q '"ok":true'; then
  echo "✅ Report sent successfully"
else
  echo "❌ Failed to send report:"
  echo "$RESPONSE"
  exit 1
fi
