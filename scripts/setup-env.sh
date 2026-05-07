#!/bin/bash
# Supabase .env.local Setup Script

echo ""
echo "╔═══════════════════════════════════════════════╗"
echo "║       Supabase Setup — Schritt 1 von 2        ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""
echo "Öffne jetzt: https://supabase.com/dashboard"
echo ""
echo "Gehe zu: Dein Projekt → Settings → API"
echo ""

read -p "Project URL (z.B. https://abcxyz.supabase.co): " SUPABASE_URL

if [[ ! "$SUPABASE_URL" == https://*.supabase.co ]]; then
  echo "❌ URL sieht nicht richtig aus. Bitte nochmal prüfen."
  exit 1
fi

echo ""
read -p "Anon Public Key (beginnt mit eyJ...): " SUPABASE_KEY

if [[ ! "$SUPABASE_KEY" == eyJ* ]]; then
  echo "❌ Key sieht nicht richtig aus. Bitte den 'anon public' Key verwenden."
  exit 1
fi

# Write .env.local
cat > "$(dirname "$0")/../.env.local" << EOF
VITE_SUPABASE_URL=${SUPABASE_URL}
VITE_SUPABASE_KEY=${SUPABASE_KEY}
EOF

echo ""
echo "✅ .env.local wurde gespeichert!"
echo ""

# Test connection
echo "🔄 Verbindung wird getestet..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" \
  "${SUPABASE_URL}/rest/v1/ratings?select=id&limit=1")

if [ "$HTTP_STATUS" = "200" ]; then
  echo "✅ Verbindung erfolgreich! Tabelle 'ratings' erreichbar."
  echo ""
  echo "👉 Starte jetzt: npm run dev"
elif [ "$HTTP_STATUS" = "404" ]; then
  echo "⚠️  Verbindung ok, aber Tabelle 'ratings' fehlt."
  echo "   → Führe scripts/setup-db.sql im Supabase SQL Editor aus."
elif [ "$HTTP_STATUS" = "401" ]; then
  echo "❌ Key ungültig. Bitte den 'anon public' Key prüfen."
else
  echo "❌ HTTP Status: $HTTP_STATUS — URL oder Key prüfen."
fi
echo ""
