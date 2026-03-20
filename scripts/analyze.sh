#!/usr/bin/env bash
set -euo pipefail

echo "[OpenClaw] Starting repository analysis..."
echo "Repo: ${OPENCLAW_REPO_NAME:-tailwindvault}"
echo "Path: ${OPENCLAW_REPO_PATH:-$(pwd)}"

REPO_PATH="${OPENCLAW_REPO_PATH:-$(pwd)}"

if [ ! -d "$REPO_PATH" ]; then
  echo "Repository path not found: $REPO_PATH"
  exit 1
fi

cd "$REPO_PATH"

echo "--- git status ---"
git status --short || true

echo "--- root files ---"
ls -la

echo "--- manifests ---"
find . -maxdepth 2 \( -name "package.json" -o -name "pyproject.toml" -o -name "*.csproj" -o -name "go.mod" -o -name "Cargo.toml" \) | sort || true

echo "--- ci files ---"
find . -maxdepth 3 \( -path "*/.github/workflows/*" -o -name "Dockerfile" -o -name "docker-compose.yml" -o -name ".gitlab-ci.yml" \) | sort || true

echo "--- source structure ---"
find . -maxdepth 3 -type d \( -name "src" -o -name "lib" -o -name "app" -o -name "components" -o -name "pages" \) 2>/dev/null | sort || true

echo "[OpenClaw] Analysis bootstrap complete"
