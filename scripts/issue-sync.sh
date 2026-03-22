#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DRAFT_DIR="${1:-$ROOT_DIR/issues/drafts}"
ARCHIVE_DIR="$ROOT_DIR/issues/sent"
REPO="${GITHUB_OWNER:-Namoneo}/${GITHUB_REPO:-tailwindvault}"

if ! command -v gh >/dev/null 2>&1; then
  printf 'gh CLI is required.\n' >&2
  exit 1
fi

mkdir -p "$ARCHIVE_DIR"

shopt -s nullglob
drafts=("$DRAFT_DIR"/*.md)
shopt -u nullglob

if [[ ${#drafts[@]} -eq 0 ]]; then
  printf 'No draft issues found in %s\n' "$DRAFT_DIR"
  exit 0
fi

strip_front_matter() {
  awk '
    BEGIN { front=0 }
    NR == 1 && $0 == "---" { front=1; next }
    front && $0 == "---" { front=0; next }
    !front { print }
  ' "$1"
}

extract_front_field() {
  awk -F': *' -v key="$2" '
    BEGIN { front=0 }
    NR == 1 && $0 == "---" { front=1; next }
    front && $0 == "---" { exit }
    front && $1 == key {
      sub($1 ": *", "", $0)
      print $0
      exit
    }
  ' "$1"
}

for draft in "${drafts[@]}"; do
  body_file="$(mktemp)"
  strip_front_matter "$draft" >"$body_file"

  title="$(extract_front_field "$draft" "title")"
  labels="$(extract_front_field "$draft" "labels")"

  if [[ -z "$title" ]]; then
    title="$(awk '/^# / { sub(/^# /, ""); print; exit }' "$body_file")"
  fi

  if [[ -z "$title" ]]; then
    title="$(basename "$draft" .md)"
  fi

  args=(issue create --repo "$REPO" --title "$title" --body-file "$body_file")

  if [[ -n "$labels" ]]; then
    IFS=',' read -r -a label_array <<<"$labels"
    for label in "${label_array[@]}"; do
      trimmed_label="$(printf '%s' "$label" | xargs)"
      if [[ -n "$trimmed_label" ]]; then
        args+=(--label "$trimmed_label")
      fi
    done
  fi

  issue_url="$(gh "${args[@]}")"
  archive_name="$(basename "$draft" .md)-$(date '+%Y%m%d%H%M%S').md"
  mv "$draft" "$ARCHIVE_DIR/$archive_name"
  rm -f "$body_file"

  printf 'Created issue: %s\n' "$issue_url"
done
