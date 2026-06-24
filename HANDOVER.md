# Handover: Assistenzarzt-Ranking

> Letzte Session: 2026-06-24
> Branch: `main` | Commit: `19a3a50`
> Deploy: Vercel auto-deploy (assistenz-ranking.de) — **aktuell passwortgeschützt (Private Beta)**

---

## Aktueller Zustand (Kurzfassung)

- Die **komplette fertige App** ist auf `main` und in Produktion deployt.
- Die Production-Domain ist **serverseitig passwortgeschützt** (Cookie-Login). Passwort: in Vercel als `SITE_PASSWORD` hinterlegt — bitte in Passwortmanager sichern.
- Zum öffentlichen Launch: `SITE_PRIVATE=false` in Vercel setzen + Redeploy.
- **Security Hardening ist live** (seit 2026-06-24): Turnstile CAPTCHA, Upstash Rate-Limiting, sichere Write-Route, DB-Constraints, Security-Headers.

---

## Was in den letzten Sessions erreicht wurde

### 1. Bewertungslogik v2 ([src/utils/calculations.js](src/utils/calculations.js))
- `schichtsystem`/`nachtdienstBegleitung` Bugs behoben, Score auf [0,10] geclamped
- `normalizeCriteria()` als Legacy-Adapter, `SCORE_BANDS` als einzige Quelle für Farbe + Label
- Null-aware: fehlende Werte aus Dimensionsmittel ausgeschlossen, ungültig bei < 5 Kernfragen
- Bayesian Average, min. 3 Bewertungen für offizielles Ranking

### 2. OP-/Interventions-Score
- `operativeTrainingScore(criteria, specialty)` — nur prozedurale Fächer, fließt nicht in `overallScore`
- Neues Feld `hauptoperateurAnteil` (Slider), multiplikatives Gate gegen Service-Job-Falle

### 3. Formular-UX
- Fachrichtung in Schritt 1 Pflicht, Fortbildung/Lehre gruppiert, OPs/MONAT nur bei prozeduralen Fächern

### 4. Scroll-Restoration
- `ScrollToTop` in App.jsx + `useEffect` auf `step` in RatingForm

### 5. Marketing/SEO
- [docs/MARKETING-SEO-AKTIONSPLAN.md](docs/MARKETING-SEO-AKTIONSPLAN.md) erstellt
- `public/llms.txt` erstellt
- **Kritischer Befund:** SPA ohne Prerendering → Crawler sehen leere Seite

### 6. Beta-Schutz ([middleware.js](middleware.js))
- Vercel Edge Middleware, Cookie-Login (kein Basic Auth), SHA-256-Token
- Fail-closed: kein Fallback-Passwort — ohne `SITE_PASSWORD` immer gesperrt

### 7. Security Hardening (2026-06-24)
- **middleware.js**: Timing-safe Vergleich, 7d Cookie, Upstash Login-Rate-Limit, Upstash-Init in try/catch (Fallback: Login funktioniert auch ohne Redis)
- **api/ratings.js**: neue server-only Write-Route — Turnstile-Verify, Upstash Rate-Limit, Service-Role-Insert
- **api/_lib/validateRating.js**: geteilter Server-Validator (gespiegelt in DB-Constraints)
- **api/melde.js**: Allowlist-CORS, HTML-Escape, Turnstile + Rate-Limit
- **src/store/ratingsStore.js**: `addRating` POST an `/api/ratings` (kein direkter Anon-Insert mehr)
- **src/components/TurnstileWidget.jsx**: Cloudflare Turnstile Widget
- **vercel.json**: Security-Headers (X-Frame-Options, CSP-Report-Only, COOP etc.)
- **scripts/harden-db.sql**: REVOKE INSERT anon, CHECK Constraints NOT VALID — **bereits in Supabase ausgeführt**
- 28/28 Tests grün, Build ✓

---

## Env-Variablen (alle in Vercel Production gesetzt)

| Variable | Typ | Zweck |
|---|---|---|
| `SITE_PASSWORD` | Secret | Beta-Passwort |
| `SITE_PRIVATE` | — | nicht gesetzt = geschützt; `false` = Launch |
| `VITE_TURNSTILE_SITE_KEY` | Public (VITE_) | Cloudflare Turnstile Widget |
| `TURNSTILE_SECRET_KEY` | Secret | Turnstile Server-Verify |
| `UPSTASH_REDIS_REST_URL` | Secret | Rate-Limiting |
| `UPSTASH_REDIS_REST_TOKEN` | Secret | Rate-Limiting |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret | Server-only Write-Zugriff |
| `VITE_SUPABASE_URL` | Public | Supabase Projekt-URL |
| `VITE_SUPABASE_KEY` | Public | Supabase Anon-Key (Reads) |
| `RESEND_API_KEY` | Secret | E-Mail (Melde-Funktion) |
| `MELDE_EMPFAENGER` | Secret | Melde-E-Mail-Adresse |

---

## Offene Punkte / Nächste Schritte

| Punkt | Prio | Status |
|---|---|---|
| **SITE_PASSWORD** in eigenes Passwort ändern | hoch | offen — aktuell temporäres PW |
| **Upstash-URL prüfen** (Format: `https://xxxxx.upstash.io`) | mittel | UrlError im Log gesehen — Fallback aktiv, aber Redis evtl. nicht verbunden |
| **Prerendering** (vite-react-ssg) — Voraussetzung für SEO | hoch | offen, vor Launch |
| Google Search Console verifizieren + Sitemaps einreichen | hoch | offen |
| 50–100 echte Seed-Bewertungen (Cold-Start) | hoch | offen |
| `AggregateRating`/`Review`-Schema je Klinikseite | mittel | offen |
| 1,78 MB JS-Bundle → Code-Splitting | niedrig | offen |
| iOS-App (Capacitor) | — | **pausiert** |

---

## Wichtige Commands

```bash
npm run dev                 # lokaler Dev-Server
npm run build               # Production-Build
npx vitest run              # Tests (28/28 grün)
git push origin main        # → Vercel auto-deploy

# Passwort zurücksetzen:
vercel env rm SITE_PASSWORD production --yes
vercel env add SITE_PASSWORD production --value "neues-passwort" --yes
git commit --allow-empty -m "chore: redeploy" && git push origin main

# Live-Check:
curl -sI https://assistenz-ranking.de/ | grep -iE "(x-frame|x-content|referrer)"
```

## Launch (ein Schritt)
`SITE_PRIVATE=false` in Vercel (Production) + Redeploy → Schloss auf.

---

## Agent-Guardrails
- Lokale SkillSpector-Install-Guardrails für Codex und Claude aktiv.
- Claude-Skill: `.claude/skills/skillspector-install-guard/`
- Codex-Skill: `skills/codex/skillspector-install-guard/`
- Projektweite Regeln: `AGENTS.md` (Codex), `CLAUDE.md` (Claude)
- Vor Install von Skills/MCP/Plugins: SkillSpector-Scan, `HIGH`/`CRITICAL` blockieren, `MEDIUM` braucht Freigabe.
