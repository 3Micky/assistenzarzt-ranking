#!/usr/bin/env bash
# Setzt alle fehlenden Vercel-Env-Variablen für das security-hardening-Deployment.
# Ausführen: bash scripts/setup-vercel-env.sh
# Werte werden per stummem Prompt abgefragt (erscheinen nicht im Terminal).

set -euo pipefail

echo ""
echo "=== Vercel Env Setup: Assistenzarzt-Ranking ==="
echo "Alle Eingaben sind stumm (kein Echo). Enter zum Bestätigen."
echo ""

read_secret() {
  local prompt="$1"
  local val
  printf "%s" "$prompt"
  read -rs val
  echo ""
  echo "$val"
}

# 1. SITE_PASSWORD
PW=$(read_secret "SITE_PASSWORD (Beta-Passwort, mind. 12 Zeichen): ")
if [ -z "$PW" ]; then echo "Abgebrochen: SITE_PASSWORD darf nicht leer sein." && exit 1; fi
vercel env add SITE_PASSWORD production --value "$PW" --yes
echo "  ✓ SITE_PASSWORD gesetzt"

# 2. VITE_TURNSTILE_SITE_KEY (öffentlich, aber trotzdem stumm eingeben)
TS_SITE=$(read_secret "VITE_TURNSTILE_SITE_KEY (Cloudflare Turnstile → Site Key): ")
if [ -z "$TS_SITE" ]; then echo "Abgebrochen: VITE_TURNSTILE_SITE_KEY darf nicht leer sein." && exit 1; fi
vercel env add VITE_TURNSTILE_SITE_KEY production --value "$TS_SITE" --yes
echo "  ✓ VITE_TURNSTILE_SITE_KEY gesetzt"

# 3. TURNSTILE_SECRET_KEY
TS_SECRET=$(read_secret "TURNSTILE_SECRET_KEY (Cloudflare Turnstile → Secret Key): ")
if [ -z "$TS_SECRET" ]; then echo "Abgebrochen: TURNSTILE_SECRET_KEY darf nicht leer sein." && exit 1; fi
vercel env add TURNSTILE_SECRET_KEY production --value "$TS_SECRET" --yes
echo "  ✓ TURNSTILE_SECRET_KEY gesetzt"

# 4. UPSTASH_REDIS_REST_URL
UPSTASH_URL=$(read_secret "UPSTASH_REDIS_REST_URL (Upstash-Dashboard → REST URL): ")
if [ -z "$UPSTASH_URL" ]; then echo "Abgebrochen: UPSTASH_REDIS_REST_URL darf nicht leer sein." && exit 1; fi
vercel env add UPSTASH_REDIS_REST_URL production --value "$UPSTASH_URL" --yes
echo "  ✓ UPSTASH_REDIS_REST_URL gesetzt"

# 5. UPSTASH_REDIS_REST_TOKEN
UPSTASH_TOKEN=$(read_secret "UPSTASH_REDIS_REST_TOKEN (Upstash-Dashboard → REST Token): ")
if [ -z "$UPSTASH_TOKEN" ]; then echo "Abgebrochen: UPSTASH_REDIS_REST_TOKEN darf nicht leer sein." && exit 1; fi
vercel env add UPSTASH_REDIS_REST_TOKEN production --value "$UPSTASH_TOKEN" --yes
echo "  ✓ UPSTASH_REDIS_REST_TOKEN gesetzt"

# 6. SUPABASE_SERVICE_ROLE_KEY
SB_KEY=$(read_secret "SUPABASE_SERVICE_ROLE_KEY (Supabase → Project Settings → API → service_role): ")
if [ -z "$SB_KEY" ]; then echo "Abgebrochen: SUPABASE_SERVICE_ROLE_KEY darf nicht leer sein." && exit 1; fi
vercel env add SUPABASE_SERVICE_ROLE_KEY production --value "$SB_KEY" --yes
echo "  ✓ SUPABASE_SERVICE_ROLE_KEY gesetzt"

echo ""
echo "=== Alle 6 Variablen gesetzt. ==="
echo ""
echo "Nächste Schritte:"
echo "  1. scripts/harden-db.sql im Supabase SQL-Editor ausführen"
echo "  2. security-hardening → main mergen"
echo "  3. git push origin main  (→ Vercel deployt automatisch)"
echo ""
