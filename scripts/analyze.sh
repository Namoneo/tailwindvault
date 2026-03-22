#!/usr/bin/env bash
set -u -o pipefail

OUTPUT_FILE=""
REPO_PATH="${OPENCLAW_REPO_PATH:-$(pwd)}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --output)
      OUTPUT_FILE="${2:-}"
      shift 2
      ;;
    *)
      REPO_PATH="$1"
      shift
      ;;
  esac
done

if [[ ! -d "$REPO_PATH/.git" ]]; then
  printf '# Repository Analysis\n\nRepository path `%s` is not a git repository.\n' "$REPO_PATH"
  exit 0
fi

cd "$REPO_PATH" || exit 0

has_previous_commit=true
if ! git rev-parse --verify HEAD~1 >/dev/null 2>&1; then
  has_previous_commit=false
fi

run_rg() {
  if command -v rg >/dev/null 2>&1; then
    rg "$@" || true
  else
    grep -E -R "$@" 2>/dev/null || true
  fi
}

report_file="$(mktemp)"

{
  printf '# Repository Analysis\n\n'
  printf -- '- Generated: %s\n' "$(date -u '+%Y-%m-%d %H:%M:%S UTC')"
  printf -- '- Repository: %s\n' "$(basename "$REPO_PATH")"
  printf -- '- Branch: %s\n' "$(git branch --show-current 2>/dev/null || printf 'detached')"
  printf -- '- HEAD: %s\n\n' "$(git rev-parse --short HEAD 2>/dev/null || printf 'unknown')"

  printf '## Working Tree\n\n'
  if [[ -n "$(git status --short 2>/dev/null)" ]]; then
    printf '```text\n'
    git status --short || true
    printf '```\n\n'
  else
    printf 'Working tree is clean.\n\n'
  fi

  printf '## Recent Commits\n\n'
  printf '```text\n'
  git log --oneline -7 || true
  printf '```\n\n'

  printf '## Last Commit Delta\n\n'
  if [[ "$has_previous_commit" == true ]]; then
    printf '```diff\n'
    git diff --stat HEAD~1..HEAD || true
    printf '```\n\n'
  else
    printf 'Initial commit detected, no previous delta available.\n\n'
  fi

  printf '## Dependency Changes\n\n'
  if [[ "$has_previous_commit" == true ]]; then
    dep_changes="$(git diff HEAD~1..HEAD -- '*package.json' 'pnpm-lock.yaml' | grep -E '^[+-]\s*\"' || true)"
    if [[ -n "$dep_changes" ]]; then
      printf '```diff\n%s\n```\n\n' "$dep_changes"
    else
      printf 'No dependency manifest changes found in the last commit.\n\n'
    fi
  else
    printf 'Dependency diff unavailable on the initial commit.\n\n'
  fi

  printf '## TODO And FIXME Scan\n\n'
  todo_hits="$(run_rg -n 'TODO|FIXME' packages scripts .github README.md CONTRIBUTING.md docs 2>/dev/null)"
  if [[ -n "$todo_hits" ]]; then
    printf '```text\n%s\n```\n\n' "$todo_hits"
  else
    printf 'No TODO or FIXME markers found in tracked project paths.\n\n'
  fi

  printf '## Potential Breaking Change Heuristics\n\n'
  if [[ "$has_previous_commit" == true ]]; then
    changed_files="$(git diff --name-only HEAD~1..HEAD || true)"
    breaking_notes=()

    if printf '%s\n' "$changed_files" | grep -qE '(^|/)(package.json|pnpm-lock.yaml|schema\.prisma|routes\.ts)$'; then
      breaking_notes+=("Config or API surface files changed.")
    fi

    removed_exports="$(git diff -U0 HEAD~1..HEAD -- packages 2>/dev/null | grep -E '^-.*(@Get|@Post|@Patch|@Delete|export class|export interface)' || true)"
    if [[ -n "$removed_exports" ]]; then
      breaking_notes+=("Removed decorators or exported types detected in the last diff.")
    fi

    if [[ "${#breaking_notes[@]}" -gt 0 ]]; then
      for note in "${breaking_notes[@]}"; do
        printf -- '- %s\n' "$note"
      done
      printf '\n'
    else
      printf 'No obvious breaking-change indicators detected.\n\n'
    fi
  else
    printf 'Breaking-change heuristics skipped on the initial commit.\n\n'
  fi
} >"$report_file"

if [[ -n "$OUTPUT_FILE" ]]; then
  mkdir -p "$(dirname "$OUTPUT_FILE")"
  cp "$report_file" "$OUTPUT_FILE"
fi

cat "$report_file"
rm -f "$report_file"
exit 0
