#!/bin/bash
# VPS deploy script — GitHub Actions SSHs in and runs: bash scripts/deploy.sh
#
# Docs: README.md, ldz-kit/infra/deploy.md
#
# Rollback: git reset --hard "$(cat ../last-good-sha)" && SKIP_GIT_SYNC=1 bash scripts/deploy.sh

set -euo pipefail

echo "🚀 Starting E30 Gallery frontend deployment..."
echo "📅 $(date)"

export PATH="$HOME/.local/share/pnpm/bin:$HOME/.local/share/pnpm:$HOME/.local/bin:$PATH"
export PNPM_NO_NOTIFY=true

# --- customize ---
BASE_DIR="/home/lando/frontend"
REPO_DIR="$BASE_DIR/repo"
BRANCH="main"
ECOSYSTEM_CONFIG="$REPO_DIR/ecosystem.config.cjs"
PM2_NAME="e30-frontend"
PORT=5173
HEALTH_URL="http://127.0.0.1:$PORT/api/health"
HEALTH_ATTEMPTS="${HEALTH_ATTEMPTS:-30}"
LAST_GOOD_SHA_FILE="$BASE_DIR/last-good-sha"
# --- end customize ---

echo "📂 Repository directory: $REPO_DIR"

if [ ! -d "$REPO_DIR/.git" ]; then
  echo "❌ Repository not found at $REPO_DIR"
  echo "   Move an existing checkout there (e.g. mv app-blue repo) before deploying."
  exit 1
fi

cd "$REPO_DIR"

PREV=$(git rev-parse HEAD)
if [ "${SKIP_GIT_SYNC:-0}" = "1" ]; then
  echo "⏭️  SKIP_GIT_SYNC=1 — deploying current checkout"
else
  echo "📥 Pulling latest changes..."
  git fetch origin --quiet
  git reset --hard "origin/$BRANCH" --quiet
fi
echo "🔖 $PREV → $(git rev-parse HEAD)"

if [ ! -f "$REPO_DIR/.nvmrc" ]; then
  echo "❌ Missing $REPO_DIR/.nvmrc"
  exit 1
fi
if [ ! -s "$HOME/.nvm/nvm.sh" ]; then
  echo "❌ nvm not found at $HOME/.nvm/nvm.sh"
  exit 1
fi
# nvm is not compatible with `set -u`.
set +u
# shellcheck disable=SC1091
. "$HOME/.nvm/nvm.sh"
if ! nvm use --silent >/dev/null 2>&1; then
  echo "📦 Installing Node $(cat .nvmrc) from .nvmrc..."
  nvm install
  nvm use --silent
fi
set -u
echo "🟢 Node $(node -v)"

# Each nvm Node version has its own global pnpm, which shadows ~/.local/share/pnpm on PATH.
PNPM_VERSION=$(node -p "const pm = require('./package.json').packageManager || ''; pm.startsWith('pnpm@') ? pm.slice(5).split('+')[0] : ''")
if [ -n "$PNPM_VERSION" ] && [ "$(pnpm -v 2>/dev/null || true)" != "$PNPM_VERSION" ]; then
  echo "📦 Installing pnpm $PNPM_VERSION for Node $(node -v) (from packageManager)..."
  npm install -g "pnpm@$PNPM_VERSION" --silent
  hash -r
fi

if ! command -v pnpm >/dev/null 2>&1; then
  echo "❌ pnpm is unavailable in deploy shell PATH."
  echo "   PATH=$PATH"
  echo "   node: $(command -v node || echo missing)"
  echo "   pnpm: $(command -v pnpm || echo missing)"
  exit 127
fi

if ! command -v pm2 >/dev/null 2>&1; then
  echo "❌ pm2 is unavailable for Node $(node -v)."
  echo "   Install once on the server: nvm use $(cat .nvmrc) && npm install -g pm2 && pm2 update"
  exit 127
fi

if [ ! -f "$ECOSYSTEM_CONFIG" ]; then
  echo "❌ PM2 ecosystem config missing: $ECOSYSTEM_CONFIG"
  exit 1
fi

if [ ! -f "$REPO_DIR/.env" ] && [ ! -f "$REPO_DIR/.env.production" ]; then
  echo "❌ Missing $REPO_DIR/.env or .env.production"
  echo "   Create it on the server before deploying."
  exit 1
fi

if [ -f "$REPO_DIR/.env" ]; then
  set -a
  # shellcheck disable=SC1091
  source "$REPO_DIR/.env"
  set +a
fi
if [ -f "$REPO_DIR/.env.production" ]; then
  set -a
  # shellcheck disable=SC1091
  source "$REPO_DIR/.env.production"
  set +a
fi

for env_var in NEXT_PUBLIC_SITE_URL NEXT_PUBLIC_FRONTEND_URL NEXT_PUBLIC_PAYLOAD_URL; do
  env_value="${!env_var:-}"
  if [[ "$env_value" == *":5173"* ]] || [[ "$env_value" == *":5174"* ]]; then
    echo "ERROR: $env_var must not include internal ports ($env_value)"
    exit 1
  fi
done

echo "📦 Installing dependencies..."
pnpm install --silent 2>/dev/null || pnpm install

echo "🏗️  Building application..."
BUILD_LOG=$(mktemp)
if ! pnpm build >"$BUILD_LOG" 2>&1; then
  grep -vE "Ignored build scripts|approve-builds|Could not get locale from next-intl" "$BUILD_LOG" | tail -120 || true
  echo "❌ Build failed. Full log: $BUILD_LOG"
  echo "   PM2 left untouched — previous build still serving."
  exit 1
fi
grep -vE "Ignored build scripts|approve-builds|Could not get locale from next-intl" "$BUILD_LOG" | grep -E "✓|Creating|Linting|Collecting|Generating static|Route \(app\)|First Load JS|Middleware|Error|Failed" || true
rm -f "$BUILD_LOG"

if [ ! -d "$REPO_DIR/.next" ] || [ ! -s "$REPO_DIR/.next/BUILD_ID" ]; then
  echo "❌ Build output missing: $REPO_DIR/.next/BUILD_ID"
  echo "   PM2 left untouched."
  exit 1
fi

# Reload keeps the process up but does not switch interpreter, so a Node change needs delete + start.
# If the ecosystem `script`/`cwd` changes, run once by hand:
#   pm2 delete e30-frontend && pm2 start ecosystem.config.cjs --only e30-frontend && pm2 save
NODE_BIN=$(node -p process.execPath)
if pm2 describe "$PM2_NAME" >/dev/null 2>&1; then
  CURRENT_INTERPRETER=$(pm2 describe "$PM2_NAME" | awk -F'│' '$2 ~ /^ *interpreter *$/ { gsub(/ /, "", $3); print $3; exit }')
  if [ -n "$CURRENT_INTERPRETER" ] && [ "$CURRENT_INTERPRETER" != "$NODE_BIN" ]; then
    echo "♻️  Node changed ($CURRENT_INTERPRETER → $NODE_BIN): restarting $PM2_NAME (brief downtime)"
    pm2 delete "$PM2_NAME"
    pm2 start "$ECOSYSTEM_CONFIG" --only "$PM2_NAME"
  else
    echo "🔄 Reloading PM2 process: $PM2_NAME on port $PORT"
    pm2 reload "$ECOSYSTEM_CONFIG" --only "$PM2_NAME" --update-env
  fi
else
  echo "🚀 Starting PM2 process: $PM2_NAME on port $PORT"
  pm2 start "$ECOSYSTEM_CONFIG" --only "$PM2_NAME"
fi
pm2 save

sleep 3
if ! pm2 describe "$PM2_NAME" 2>/dev/null | grep -qE "status.*online"; then
  echo "❌ PM2 process is not online!"
  pm2 show "$PM2_NAME" || true
  pm2 logs "$PM2_NAME" --lines 80 --nostream || true
  exit 1
fi

echo "🔍 Checking $HEALTH_URL..."
HTTP_CODE=""
for i in $(seq 1 "$HEALTH_ATTEMPTS"); do
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL" || true)
  if [[ "$HTTP_CODE" =~ ^[23] ]]; then
    echo "✅ Health check passed (HTTP $HTTP_CODE)"
    break
  fi

  if [ "$i" -eq "$HEALTH_ATTEMPTS" ]; then
    echo "❌ Health check failed: $HEALTH_URL"
    echo "   Last HTTP status: ${HTTP_CODE:-none} (503 = frontend up but CMS unreachable)"
    pm2 logs "$PM2_NAME" --lines 80 --nostream || true
    if [ -s "$LAST_GOOD_SHA_FILE" ]; then
      echo "💡 Roll back: git reset --hard $(cat "$LAST_GOOD_SHA_FILE") && SKIP_GIT_SYNC=1 bash scripts/deploy.sh"
    fi
    exit 1
  fi

  if [ $((i % 5)) -eq 0 ]; then
    echo "   Waiting for health... ($i/$HEALTH_ATTEMPTS, last HTTP ${HTTP_CODE:-none})"
  fi
  sleep 1
done

git rev-parse HEAD >"$LAST_GOOD_SHA_FILE"

echo "=========================================="
echo "✅ Deployment completed successfully!"
echo "🔖 last-good-sha: $(cat "$LAST_GOOD_SHA_FILE")"
echo "📅 $(date)"
echo "=========================================="
pm2 list --no-color | grep -E "id|$PM2_NAME|─" || pm2 list --no-color
