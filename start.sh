#!/usr/bin/env bash
# Alkemia Capital — dev launcher
# Verifies env, pings external services (Supabase, Contentful), then starts `next dev`.
set -euo pipefail

cd "$(dirname "$0")"

GREEN=$'\033[0;32m'
YELLOW=$'\033[0;33m'
RED=$'\033[0;31m'
BLUE=$'\033[0;34m'
BOLD=$'\033[1m'
NC=$'\033[0m'

log()  { echo "${BLUE}▸${NC} $1"; }
ok()   { echo "${GREEN}✓${NC} $1"; }
warn() { echo "${YELLOW}⚠${NC} $1"; }
err()  { echo "${RED}✗${NC} $1"; }

echo "${BOLD}Alkemia Capital — dev launcher${NC}"
echo

# 1. .env.local check
if [[ ! -f .env.local ]]; then
  err ".env.local not found"
  echo "  Copy .env.example to .env.local and fill in the values."
  exit 1
fi
ok ".env.local found"

# Load env (only simple KEY=VALUE lines)
set -a
# shellcheck disable=SC1091
source .env.local
set +a

# 2. Required vars
REQUIRED=(
  CONTENTFUL_SPACE_ID
  CONTENTFUL_ACCESS_TOKEN
  CONTENTFUL_PREVIEW_TOKEN
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY
  SUPABASE_SERVICE_ROLE_KEY
)
MISSING=()
for v in "${REQUIRED[@]}"; do
  if [[ -z "${!v:-}" ]]; then MISSING+=("$v"); fi
done
if (( ${#MISSING[@]} > 0 )); then
  err "Missing env vars: ${MISSING[*]}"
  exit 1
fi
ok "Required env vars present"

# 3. node_modules
if [[ ! -d node_modules ]]; then
  warn "node_modules missing — running npm install"
  npm install
fi
ok "Dependencies installed"

# 4. Supabase reachability (free tier pauses after 7 days inactivity)
log "Checking Supabase..."
SB_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 8 \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/" || echo "000")
case "$SB_CODE" in
  200|401|404) ok "Supabase reachable (HTTP $SB_CODE)" ;;
  000)         warn "Supabase not reachable — may be paused or offline" ;;
               # https://supabase.com/dashboard/project/lyegqqrfjnatkrmuzmyk
  *)           warn "Supabase returned HTTP $SB_CODE — check dashboard" ;;
esac

# 5. Contentful reachability
log "Checking Contentful..."
CF_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 8 \
  -H "Authorization: Bearer $CONTENTFUL_ACCESS_TOKEN" \
  "https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE_ID}" || echo "000")
case "$CF_CODE" in
  200) ok "Contentful Delivery API reachable" ;;
  401) err "Contentful returned 401 — CONTENTFUL_ACCESS_TOKEN invalid"; exit 1 ;;
  *)   warn "Contentful returned HTTP $CF_CODE" ;;
esac

# 6. Port check
PORT="${PORT:-3000}"
if lsof -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  err "Port $PORT already in use"
  echo "  Free it with: lsof -ti:$PORT | xargs kill -9"
  exit 1
fi
ok "Port $PORT free"

echo
echo "${BOLD}${GREEN}All checks passed — starting next dev on port $PORT${NC}"
echo

exec npm run dev -- --port "$PORT"
