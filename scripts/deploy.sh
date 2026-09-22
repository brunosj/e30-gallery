#!/bin/bash
# VPS deploy script — GitHub Actions SSHs in and runs: bash scripts/deploy.sh
#
# Docs: README.md, ldz-kit/infra/deploy.md

set -euo pipefail

echo "🚀 Starting E30 Gallery frontend deployment..."
echo "📅 $(date)"

if [ -s "$HOME/.nvm/nvm.sh" ]; then
  # shellcheck disable=SC1091
  . "$HOME/.nvm/nvm.sh"
fi

export PATH="$HOME/.local/share/pnpm/bin:$HOME/.local/share/pnpm:$HOME/.local/bin:$PATH"
export PNPM_NO_NOTIFY=true

# --- customize ---
BASE_DIR="/home/lando/frontend"
REPO_DIR="$BASE_DIR/repo"
ECOSYSTEM_CONFIG="$REPO_DIR/ecosystem.config.cjs"
PM2_NAME="e30-frontend"
PORT=5173
# --- end customize ---

echo "📂 Repository directory: $REPO_DIR"

if [ ! -d "$REPO_DIR/.git" ]; then
  echo "❌ Repository not found at $REPO_DIR"
  echo "   Move an existing checkout there (e.g. mv app-blue repo) before deploying."
  exit 1
fi

cd "$REPO_DIR"

if command -v nvm >/dev/null 2>&1; then
  nvm use --silent >/dev/null 2>&1 || nvm use --silent default >/dev/null 2>&1 || nvm use --silent node >/dev/null 2>&1 || true
fi

echo "📥 Pulling latest changes..."
git fetch origin --quiet
git reset --hard origin/main --quiet

if ! command -v pnpm >/dev/null 2>&1; then
  echo "❌ pnpm is unavailable in deploy shell PATH."
  echo "   PATH=$PATH"
  echo "   node: $(command -v node || echo missing)"
  echo "   pnpm: $(command -v pnpm || echo missing)"
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
  exit 1
fi
grep -vE "Ignored build scripts|approve-builds|Could not get locale from next-intl" "$BUILD_LOG" | grep -E "✓|Creating|Linting|Collecting|Generating static|Route \(app\)|First Load JS|Middleware|Error|Failed" || true
rm -f "$BUILD_LOG"

if [ ! -d "$REPO_DIR/.next" ] || [ ! -s "$REPO_DIR/.next/BUILD_ID" ]; then
  echo "❌ Build output missing: $REPO_DIR/.next/BUILD_ID"
  exit 1
fi

echo "🚀 Restarting PM2 process: $PM2_NAME on port $PORT"
pm2 delete "$PM2_NAME" 2>/dev/null || true
pm2 start "$ECOSYSTEM_CONFIG" --only "$PM2_NAME"
pm2 save

sleep 3
if ! pm2 list 2>/dev/null | grep -q "$PM2_NAME.*online"; then
  echo "❌ PM2 process failed to start!"
  pm2 show "$PM2_NAME" || true
  pm2 logs "$PM2_NAME" --lines 80 --nostream || true
  exit 1
fi

echo "🔍 Verifying HTTP endpoint on port $PORT..."
APP_READY=false

for i in {1..30}; do
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT" || true)
  if [[ "$HTTP_CODE" =~ ^[23] ]]; then
    echo "✅ App is responding (HTTP $HTTP_CODE)"
    APP_READY=true
    break
  fi

  if [ "$i" -eq 30 ]; then
    echo "❌ PM2 is running but the app is not responding on port $PORT"
    echo "   Last HTTP status: ${HTTP_CODE:-none}"
    pm2 logs "$PM2_NAME" --lines 80 --nostream || true
    exit 1
  fi

  if [ $((i % 5)) -eq 0 ]; then
    echo "   Waiting for HTTP response... ($i/30)"
  fi
  sleep 1
done

if [ "$APP_READY" = false ]; then
  echo "❌ App failed readiness checks"
  exit 1
fi

echo "=========================================="
echo "✅ Deployment completed successfully!"
echo "📅 $(date)"
echo "=========================================="
pm2 list --no-color | grep -E "id|$PM2_NAME|─" || pm2 list --no-color
