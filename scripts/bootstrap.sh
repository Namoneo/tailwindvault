#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

copy_or_seed() {
  local template_path="$1"
  local target_path="$2"
  local fallback_content="$3"

  if [[ -f "$target_path" ]]; then
    printf 'skipped %s (already exists)\n' "$target_path"
    return
  fi

  mkdir -p "$(dirname "$target_path")"

  if [[ -f "$template_path" ]]; then
    cp "$template_path" "$target_path"
  else
    printf '%s\n' "$fallback_content" >"$target_path"
  fi

  printf 'created %s\n' "$target_path"
}

printf '[OpenClaw] Bootstrapping TailwindVault...\n'

chmod +x "$ROOT_DIR"/scripts/*.sh
mkdir -p "$ROOT_DIR/issues/drafts" "$ROOT_DIR/issues/sent"

copy_or_seed "$ROOT_DIR/.env.example" "$ROOT_DIR/.env" "OPENCLAW_REPO_NAME=tailwindvault
OPENCLAW_REPO_PATH=.
GITHUB_OWNER=Namoneo
GITHUB_REPO=tailwindvault
REPORT_ISSUE_NUMBER=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
TELEGRAM_TOPIC_ID=21"

copy_or_seed "$ROOT_DIR/packages/api/.env.example" "$ROOT_DIR/packages/api/.env" "DATABASE_URL=\"file:./dev.db\"
JWT_SECRET=\"tailwindvault-dev-secret\"
STOREFRONT_URL=\"http://localhost:4200\"
PORT=3000"

copy_or_seed "$ROOT_DIR/packages/storefront/.env.example" "$ROOT_DIR/packages/storefront/.env" "NG_APP_API_URL=\"http://localhost:3000/api\""

printf '\nBootstrap complete.\n'
printf 'Next steps:\n'
printf '1. pnpm install\n'
printf '2. pnpm db:push && pnpm db:seed\n'
printf '3. pnpm --filter @tailwindvault/api start:dev\n'
printf '4. pnpm --filter @tailwindvault/storefront start\n'
