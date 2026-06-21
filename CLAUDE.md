# Assistenzarzt-Ranking — LLM-Kontext

> Anonyme Bewertungsplattform für Assistenzarztstellen in DE/AT/CH. Peer-to-peer, kostenlos, DSGVO-konform.
> Ziel: Transparenz über Weiterbildungsqualität. Side-Project von Hermann Bartels (hbartels22@gmail.com).
> **Aktueller Stand & Session-Log:** siehe [HANDOVER.md](HANDOVER.md). **Marketing/SEO:** [docs/MARKETING-SEO-AKTIONSPLAN.md](docs/MARKETING-SEO-AKTIONSPLAN.md).

## Stack
React 18 + Vite 5 · Tailwind v3 (brutalistisches Design) · React Router v6 · Zustand v4 · Recharts v2 ·
react-simple-maps v3 (+ topojson-client, d3-scale) · Supabase (PostgreSQL) via `src/store/ratingsStore.js` ·
react-helmet-async · GoatCounter (cookie-free) · @fontsource (self-hosted) · Deployment: Vercel (auto-deploy `main`).

## Konventionen
- UI-Texte **Deutsch**, genderneutral mit `*innen`.
- **Tailwind-Klassen only** — kein `style={{}}` außer dynamische Werte (z. B. `scoreColor()`).
- Dateien: Komponenten `PascalCase.jsx`, Hooks `useKleinschreibung.js`. Kein TypeScript (JSX/JS + JSDoc).
- Mobile-first (`sm:`→`md:`→`lg:`). Keine Flaggen-Emojis — `DE`/`AT`/`CH` als Text.

## Design-System (Brutalist)
`bg-canvas` (beige) · `text-ink` (fast-schwarz) · `text-hazard`/`btn-hazard` (rot #c81318) ·
`mono-label` (11.5px, uppercase, tracking-widest, JetBrains Mono) · `register-strip` (schwarzer Header-Streifen) ·
`ink-grid` (CSS-Grid mit 1px schwarzen Linien). Score-Farben/Label über `SCORE_BANDS` in `calculations.js`.

## Struktur (Auszug)
```
src/
├── App.jsx                 ← Routes + ScrollToTop
├── components/             ← Layout/ RatingForm/ Dashboard/ Charts/ GeoMap/ Search/ Berichte/ UI/
├── pages/                  ← HomePage, BerichtePage, BerichteDetailPage, KlinikProfilePage,
│                              StadtPage, BundeslandPage, FachrichtungPage, Ranking/Vergleich/Karte/Bewertung…
├── store/ratingsStore.js   ← Supabase-Hydration + Zustand (normalisiert via normalizeRating)
├── data/criteria.js        ← CRITERIA_*, DEFAULT_CRITERIA, SPECIALTIES, SPECIALTY_PROCEDURE_TYPE, REGIONS
├── data/hospitals*.js      ← ~3000 DE + AT + CH Kliniken; sampleData.js (Seed)
└── utils/                  ← calculations.js, hospitalSearch.js, hospitalProfile.js, slugify.js
middleware.js               ← serverseitiger Beta-Passwortschutz (Vercel Edge)
api/                        ← sitemap.js, sitemap-kliniken.js, melde.js
public/                     ← Logo_assistenz_vector.svg, robots.txt, llms.txt, BingSiteAuth.xml
```

## Routes
`/` Home · `/berichte` Liste · `/berichte/:hospitalSlug?/:id` Detail · `/klinik/:slug` Profil ·
`/stadt/:slug` · `/bundesland/:slug` · `/fachrichtung/:slug` (SEO-Landingpages) ·
`/ranking` · `/vergleich` · `/karte` · `/bewerten` (5-Schritt-Formular) · `/ueber-uns` · `/faq` · `/datenschutz` · `/agb` (noindex).

## Bewertungslogik (v2 — `calculations.js`)
- `overallScore(criteria)` → 0–10 aus 5 gewichteten Dimensionen: Weiterbildung 30 % · WLB 25 % · Struktur 20 % · Teamkultur 15 % · Infrastruktur 10 %.
- **null-aware:** fehlende Werte = `null` = unbeantwortet → aus dem Mittel ausgeschlossen (kein künstliches 5,0). Ungültig (Score 0) bei < 5 beantworteten Kernfragen.
- Alles auf [0,10] geclamped. Farbe **und** Label aus `SCORE_BANDS` (eine Quelle).
- `normalizeCriteria()` = Legacy-Adapter: liest alte (`dienstsystem`, Boolean-Felder) **und** neue Rows; Prod-Daten werden nie migriert, nur beim Lesen normalisiert.
- `avgByHospital()`: offizielles Ranking erst ab 3 Bewertungen + Bayesian Average (Prior 4).
- `operativeTrainingScore(criteria, specialty)`: separater OP-/Interventions-Sub-Score, **nur prozedurale Fächer** (`SPECIALTY_PROCEDURE_TYPE`), sonst `null`. Fließt NICHT in `overallScore`.

## Datenmodell (Supabase `ratings`)
`{ id, hospital, city, region, country: 'DE'|'AT'|'CH', specialty, yearFrom, yearTo, comment, criteria{…}, timestamp }`.
Kriterien-Keys in `criteria.js` (CRITERIA_ESSENTIAL/MEDICAL/NICE, 30 Keys). `overallScore` nutzt explizite Feldlisten — ein neues Kriterium fließt nur dann ein, wenn es dort ergänzt wird.

## Beta-Schutz & Deployment
- **Production ist passwortgeschützt** via `middleware.js` (Cookie-Login, kein Basic Auth — Vercel strippt `WWW-Authenticate`). Passwort: env `SITE_PASSWORD` (Fallback `be100aware.now`). Privat solange `SITE_PRIVATE !== 'false'`.
- **Launch:** `SITE_PRIVATE=false` in Vercel + Redeploy.
- **Deploy:** Änderungen committen + `git push origin main` → Vercel auto-deployt Production. Build muss grün sein (`npm run build`), Tests via `npx vitest run`. Repo: `github.com/3Micky/assistenzarzt-ranking`. Domain via A-Record bei united-domains.
- Es gibt auch ein client-seitiges `PasswordGate.jsx` (env `VITE_PUBLIC_LAUNCH`) — durch die Middleware faktisch redundant.

## Bekannte Fallstricke
| Problem | Lösung |
|---|---|
| neues Kriterium wirkt nicht im Score | muss in `SCORE_FIELDS`/Dimension **und** in `normalizeCriteria` ergänzt werden |
| „Hauptstandort"/„klinik" findet kein „Krankenhaus" | `resolveDisplayName()` + Synonym-Normalisierung in `hospitalSearch.js` |
| „Berlin" erscheint als Klinik | `isCityTrap()` in `searchHospitals()` |
| `mono-label` zwingt Großschreibung | `!normal-case` ergänzen, wenn Kleinschreibung gewünscht |
| `ink-grid` + inline `style` überschreibt Tailwind-Breakpoints | Spalten per className (`grid-cols-2 sm:grid-cols-4`) |
| Live zeigt nichts für Crawler | SPA ohne Prerendering — bekannter Befund, siehe Aktionsplan |

## Session-Handover (Pflicht)
Am Ende jeder Session [HANDOVER.md](HANDOVER.md) aktualisieren: erreichte Ziele, offene Punkte, geänderte Dateien, Architektur-Entscheidungen, nächste Schritte, letzter Commit.

## Kommunikation
Deutsch, knapp, Senior-Niveau. Priorität: Sichtbarkeit/Nutzerwachstum vor Monetarisierung. Budget ~20 €/Monat.
