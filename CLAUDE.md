# Assistenzarzt-Ranking – Claude Code Master Index

Anonyme Bewertungsplattform für Assistenzarztstellen in DE/AT/CH.
Nutzer können Stellen bewerten und Rankings über interaktive Charts einsehen.

## Stack
| Rolle | Paket |
|---|---|
| UI | React 18 + Vite 5 |
| Styling | Tailwind CSS v3 |
| Routing | React Router v6 |
| State | Zustand v4 |
| Charts | Recharts v2 |
| Geo-Map | react-simple-maps v3 + topojson-client + d3-scale |
| Persistenz | Supabase (PostgreSQL) |
| SEO Meta | react-helmet-async |
| Analytics | GoatCounter (cookie-free, DSGVO-konform) |
| Fonts | @fontsource/inter, @fontsource/archivo-black, @fontsource/jetbrains-mono (self-hosted) |

## Ordnerstruktur (Zielzustand)
```
assistenzdoc-react-final/
├── CLAUDE.md                    ← du bist hier
├── docs/
│   ├── ARCHITECTURE.md
│   └── agents/
│       ├── 01-setup.md
│       ├── 02-data-layer.md
│       ├── 03-rating-form.md
│       ├── 04-dashboard.md
│       ├── 05-geo-heatmap.md
│       ├── 06-charts.md
│       └── 07-design-system.md
├── public/
│   └── favicon.svg
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Header.jsx
│   │   │   └── TabNav.jsx
│   │   ├── RatingForm/
│   │   │   ├── RatingForm.jsx
│   │   │   ├── StepHospital.jsx
│   │   │   ├── StepCriteria.jsx
│   │   │   └── StepDone.jsx
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.jsx
│   │   │   └── StatsBar.jsx
│   │   ├── GeoMap/
│   │   │   ├── GeoMap.jsx
│   │   │   └── MapTooltip.jsx
│   │   └── Charts/
│   │       ├── BarRanking.jsx
│   │       ├── RadarComparison.jsx
│   │       └── HospitalSelector.jsx
│   ├── hooks/
│   │   └── useRatings.js
│   ├── store/
│   │   └── ratingsStore.js
│   ├── data/
│   │   ├── criteria.js
│   │   ├── cities.js
│   │   └── sampleData.js
│   └── utils/
│       └── calculations.js
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Konventionen
- Alle UI-Texte auf **Deutsch**
- Tailwind-Klassen only — kein `style={{}}`
- Komponentendateien: `PascalCase.jsx`
- Hooks: `useKleinschreibung.js`
- Mobile-first (`sm:` → `md:` → `lg:`)
- Keine TypeScript — reines JSX/JS mit JSDoc-Kommentaren für Typen

## Ausführungsreihenfolge der Agents
1. `docs/agents/01-setup.md` — Projekt bootstrappen, Abhängigkeiten installieren
2. `docs/agents/02-data-layer.md` — Datenmodell, Zustand Store, Utilities
3. `docs/agents/07-design-system.md` — Tailwind Config, CSS-Variablen, globales CSS
4. `docs/agents/04-dashboard.md` — Shell-Layout, Tab-Navigation, App.jsx routing
5. `docs/agents/03-rating-form.md` — Bewertungsformular (3 Schritte)
6. `docs/agents/05-geo-heatmap.md` — DACH Bubble-Map
7. `docs/agents/06-charts.md` — Bar-Ranking + Radar-Vergleich

## Wichtige Designprinzipien
- Primärfarbe: Medizinisches Blau `#0EA5E9` (sky-500)
- Score-Farbskala: Rot (`#EF4444`) → Gelb (`#F59E0B`) → Grün (`#22C55E`)
- Karten-Hintergrund: Dunkles Slate `#0F172A` (slate-900) für Kontrast
- Schrift: Inter (self-hosted via @fontsource, kein Google Fonts)
- Rounded corners: `rounded-xl` als Standard
- Shadows: `shadow-lg` auf Cards
- Sprache: Genderneutral mit `*innen`-Form (Ärzt*innen, Assistenzärzt*innen)

## Seed-Daten
`src/data/sampleData.js` enthält 20 realistische Beispiel-Bewertungen (keine echten Daten),
die beim ersten App-Start in den LocalStorage geladen werden, falls dieser leer ist.
Damit sind alle Charts sofort mit Daten befüllt.

---

## SEO-Status (Stand: 2026-05-11)

### Erledigt (deployed auf assistenz-ranking.de)

**Technisches SEO**
- `react-helmet-async` — alle 8 Pages mit eigenem Title, Description, Canonical, OG-Tags
- `BerichteDetailPage` — dynamischer Titel aus Klinikname + Score
- `index.html` — OG + Twitter Card Fallback, `meta robots: index, follow`
- `vercel.json` — 301-Redirect `assistenz-ranking.com` → `assistenz-ranking.de`
- `api/sitemap.js` — dynamische Sitemap aus Supabase + statische Routes, Rewrite `/sitemap.xml`
- `public/BingSiteAuth.xml` — Bing Webmaster Tools verifiziert

**Structured Data (JSON-LD)**
- `Organization` — Entity Recognition / Google Knowledge Panel
- `WebSite` + `SearchAction` — Sitelinks-Searchbox
- `FAQPage` — 5 Q&As für Google AI Overviews / AI-Zitierung

**AI SEO**
- `public/robots.txt` — alle AI-Bots erlaubt (GPTBot, PerplexityBot, ClaudeBot, Google-Extended, Bingbot); CCBot blockiert
- `public/llms.txt` — Machine-readable Context File für AI-Systeme (llmstxt.org Standard)
- `HomePage.jsx` — sichtbarer FAQ-Abschnitt (`<dl>/<dt>/<dd>`) für AI-Extraktion
- `<h1>` — `sr-only` Keyword-Span für SEO, sichtbarer Text bleibt genderneutral

**Fonts**
- Google Fonts entfernt → selbst gehostet via `@fontsource` (DSGVO: keine IP an Google)
- Imports in `src/main.jsx`: Inter 400/600/700, Archivo Black 400, JetBrains Mono 400/700

**Analytics**
- GoatCounter aktiv (`assistenz.goatcounter.com`) — cookie-free, kein Cookie-Banner nötig

### Offen
- Password-Gate entfernen wenn Launch bereit → danach sofort in Google Search Console anmelden + Sitemap einreichen
- `assistenz-ranking.com` in Vercel Domains hinzufügen (für den 301-Redirect zu aktivieren)
- Bilder mit `alt`-Text versehen (Header-Logo etc.)
- Google Search Console verifizieren (`public/google-site-verification-ERSETZEN.html` → echten Code eintragen)
