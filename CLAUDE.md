# Assistenzarzt-Ranking — Master-Kontext für LLMs

> **Letzte Aktualisierung:** 2026-05-14  
> Anonyme Bewertungsplattform für Assistenzarztstellen in DE/AT/CH.  
> Peer-to-peer, kostenlos, DSGVO-konform. Ziel: Transparenz über Weiterbildungsqualität.

---

## Stack

| Rolle | Paket |
|---|---|
| UI | React 18 + Vite 5 |
| Styling | Tailwind CSS v3 (brutalistisches Design-System) |
| Routing | React Router v6 |
| State | Zustand v4 |
| Charts | Recharts v2 |
| Geo-Map | react-simple-maps v3 + topojson-client + d3-scale |
| Persistenz | Supabase (PostgreSQL) via `src/store/ratingsStore.js` |
| SEO Meta | react-helmet-async |
| Analytics | GoatCounter (cookie-free, DSGVO-konform, `assistenz.goatcounter.com`) |
| Fonts | @fontsource/inter, @fontsource/archivo-black, @fontsource/jetbrains-mono (self-hosted, kein Google Fonts) |
| Deployment | Vercel (auto-deploy via GitHub `main` branch) |

---

## Konventionen

- Alle UI-Texte auf **Deutsch**, genderneutral mit `*innen`-Form
- **Tailwind-Klassen only** — kein `style={{}}` außer für dynamische Werte (z.B. `scoreColor()`)
- Komponentendateien: `PascalCase.jsx`, Hooks: `useKleinschreibung.js`
- Mobile-first (`sm:` → `md:` → `lg:`)
- Kein TypeScript — reines JSX/JS mit JSDoc für Typen
- **Keine Flaggen-Emojis** — stattdessen `DE`, `AT`, `CH` als Text

---

## Design-System (Brutalist)

| Token | Klasse / Wert | Bedeutung |
|---|---|---|
| Hintergrund | `bg-canvas` | Helles Beige/Off-White |
| Schrift | `text-ink` | Fast-Schwarz |
| Akzent | `text-hazard`, `btn-hazard` | Rot `#c81318` |
| Mono-Label | `mono-label` | 11.5px, uppercase, tracking-widest, JetBrains Mono |
| Kopfzeile | `register-strip` | Schmaler schwarzer Header-Streifen |
| Raster | `ink-grid` | CSS Grid mit 1px schwarzen Trennlinien |
| Score-Farben | `scoreColor(val)` in `calculations.js` | 0–4: Rot, 5–6: Gelb, 7–10: Grün |

---

## Vollständige Dateistruktur (aktuell)

```
assistenzdoc-react-final/
├── CLAUDE.md                     ← du bist hier
├── index.html                    ← Favicon: /Logo_assistenz_vector.svg
├── vercel.json                   ← SPA-Rewrite + 301 .com→.de Redirect
├── api/
│   ├── sitemap.js                ← Dynamische Sitemap (Supabase + statisch)
│   ├── sitemap-kliniken.js
│   └── melde.js                  ← Melde-Endpoint für Bewertungen
├── public/
│   ├── Logo_assistenz_vector.svg ← Haupt-Logo (auch Favicon)
│   ├── robots.txt
│   ├── llms.txt                  ← AI SEO Context File
│   ├── BingSiteAuth.xml
│   └── google-site-verification-ERSETZEN.html  ← Platzhalter, echten Code eintragen
├── src/
│   ├── main.jsx                  ← Fontsource-Imports
│   ├── App.jsx                   ← Alle Routes (siehe unten)
│   ├── index.css                 ← Tailwind + globale Klassen
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Header.jsx        ← Logo + Nav: BERICHTE RANKING VERGLEICH KARTE
│   │   │   └── Footer.jsx        ← Desktop 4-Spalten: PLATTFORM / STÄDTE / FACHRICHTUNGEN / RECHTLICHES; Mobile 2-Spalten (FACHRICHTUNGEN hidden)
│   │   ├── RatingForm/
│   │   │   ├── RatingForm.jsx
│   │   │   ├── StepHospital.jsx  ← Schnellsuche + Genaue Suche (Kaskaden-Dropdowns)
│   │   │   ├── StepCriteria.jsx
│   │   │   └── StepDone.jsx
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.jsx
│   │   │   └── StatsBar.jsx      ← BEWERTUNGEN / Ø-SCORE / TOP-KLINIK / DEUTSCHLAND / ÖSTERREICH / SCHWEIZ
│   │   ├── Berichte/
│   │   │   └── MeldeModal.jsx
│   │   ├── Charts/
│   │   │   ├── BarRanking.jsx
│   │   │   ├── RadarComparison.jsx  ← Unified slots: {hospital, specialty}
│   │   │   ├── MiniRadar.jsx
│   │   │   └── HospitalSelector.jsx
│   │   ├── GeoMap/
│   │   │   ├── GeoMap.jsx
│   │   │   └── MapTooltip.jsx
│   │   ├── Search/
│   │   │   ├── SearchWidget.jsx  ← Tabs: BERICHTE / BEWERTEN / SUCHE (Genaue Suche)
│   │   │   └── SearchDropdown.jsx ← Zeigt Stadt hinter Klinknamen
│   │   └── UI/
│   │       └── CountryFlag.jsx   ← Text-Badge (kein Emoji): DE / AT / CH
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── BerichtePage.jsx
│   │   ├── BerichteDetailPage.jsx  ← Route: /berichte/:hospitalSlug/:id ODER /berichte/:id
│   │   ├── KlinikProfilePage.jsx   ← Route: /klinik/:slug
│   │   ├── StadtPage.jsx           ← Route: /stadt/:slug (NEU)
│   │   ├── BundeslandPage.jsx      ← Route: /bundesland/:slug (NEU)
│   │   ├── FachrichtungPage.jsx    ← Route: /fachrichtung/:slug (NEU)
│   │   ├── UeberUnsPage.jsx        ← Route: /ueber-uns (NEU)
│   │   ├── RankingPage.jsx
│   │   ├── VergleichPage.jsx       ← Unified Slots: Klinik + optionale Fachrichtung
│   │   ├── KartePage.jsx
│   │   ├── BewertungPage.jsx
│   │   ├── DatenschutzPage.jsx
│   │   ├── AGBPage.jsx
│   │   └── FAQPage.jsx
│   ├── hooks/
│   │   └── useRatings.js
│   ├── store/
│   │   └── ratingsStore.js         ← Supabase-Hydration + Zustand
│   ├── data/
│   │   ├── criteria.js             ← CRITERIA_*, SPECIALTIES, REGIONS, COUNTRY_FLAGS (Text, kein Emoji)
│   │   ├── hospitals.js            ← ~3000 DE-Kliniken
│   │   ├── hospitalsAT.js          ← AT-Kliniken
│   │   ├── hospitalsCH.js          ← CH-Kliniken
│   │   └── sampleData.js           ← 20 Seed-Bewertungen für lokale Entwicklung
│   └── utils/
│       ├── calculations.js         ← overallScore, avgByHospital, scoreColor, radarDataUnified
│       ├── hospitalSearch.js       ← searchHospitals (Levenshtein Fuzzy + Synonym-Normalisierung)
│       ├── hospitalProfile.js      ← getHospitalBySlug, aggregateHospitalData, hospitalProfileSchema
│       ├── slugify.js              ← slugify(), matchSlug()
│       └── plzToBundesland.js
```

---

## Alle Routes (App.jsx)

| URL | Komponente | Beschreibung |
|---|---|---|
| `/` | `HomePage` | Hero + SearchWidget + StatsBar + Map |
| `/berichte` | `BerichtePage` | Bewertungs-Liste mit Filter |
| `/berichte/:hospitalSlug/:id` | `BerichteDetailPage` | Einzel-Bericht (neues URL-Schema) |
| `/berichte/:id` | `BerichteDetailPage` | Backward-Compat für alte Links |
| `/klinik/:slug` | `KlinikProfilePage` | Klinik-Profil mit Radar + alle Bewertungen |
| `/stadt/:slug` | `StadtPage` | City-Landingpage (SEO) |
| `/bundesland/:slug` | `BundeslandPage` | Bundesland/Kanton-Landingpage (SEO) |
| `/fachrichtung/:slug` | `FachrichtungPage` | Fachrichtungs-Landingpage (SEO) |
| `/ueber-uns` | `UeberUnsPage` | Über die Plattform |
| `/ranking` | `RankingPage` | Gesamt-Ranking aller Kliniken |
| `/vergleich` | `VergleichPage` | 3-Slot-Vergleich (Klinik + optionale Fachrichtung) |
| `/karte` | `KartePage` | DACH Geo-Heatmap |
| `/bewerten` | `BewertungPage` | 5-Schritt-Bewertungsformular |
| `/datenschutz` | `DatenschutzPage` | Datenschutzerklärung (noindex) |
| `/agb` | `AGBPage` | AGB (noindex) |
| `/faq` | `FAQPage` | FAQ mit FAQPage Schema |

---

## Wichtige Utilities

### `hospitalSearch.js`
- `searchHospitals(query, ratedSet, filters, limit)` — Sucht in ~3000+ DACH-Kliniken
  - **Synonym-Normalisierung**: "klinik" = "krankenhaus" = "klinikum" = "spital" = "hospital"
  - **Levenshtein Fuzzy**: Tippfehler-Toleranz per Token-Länge
  - **resolveDisplayName**: Generische Registernamen ("Hauptstandort") → echter Trägername
  - **Stadt-Trap**: Verhindert, dass "Berlin" als Klinik erscheint bei Stadtsuche
- `getCitiesForFilters(filters)` — Städteliste für Genaue Suche
- `getHospitalsForFilters(filters, ratedSet)` — Kliniklist für Kaskaden-Dropdown

### `calculations.js`
- `overallScore(criteria)` — Ø-Score für eine Bewertung (0–10)
- `avgByHospital(ratings)` — Rangliste aller Kliniken mit Ø-Score + Rang
- `scoreColor(val)` — Farbe nach Score (Rot/Gelb/Grün)
- `scoreLabel(val)` — Textlabel (Schlecht/Ok/Gut/Sehr gut/Ausgezeichnet)
- `radarDataUnified(slots, ratings)` — Radar-Daten für unified Vergleich

### `slugify.js`
- `slugify(name)` — "Charité Berlin" → "charite-berlin"
- `matchSlug(slug, name)` — Rückübersetzung mit Fuzzy-Match

---

## Deployment & DNS

| | |
|---|---|
| **GitHub** | `github.com/3Micky/assistenzarzt-ranking` (Branch: `main`) |
| **Vercel** | Auto-Deploy bei Push auf `main` |
| **Produktions-URL** | `https://assistenz-ranking.de` |
| **Redirect** | `assistenz-ranking.com` → `assistenz-ranking.de` (301, via vercel.json) |
| **DNS** | A-Record `@ → 76.76.21.21` bei united-domains (udag); Nameserver NICHT auf Vercel umgestellt |
| **SSL** | Automatisch via Vercel (Let's Encrypt), gültig |

**Push & Deploy (kompletter Workflow):**
```bash
# 1. Änderungen im HAUPTPROJEKT vornehmen (NICHT im Worktree):
cd "/Users/hermannbartels/Library/Mobile Documents/com~apple~CloudDocs/Documents/assistenzdoc-react-final Kopie"

# 2. Build prüfen (muss ✓ sein):
npm run build

# 3. Commit + Push → Vercel auto-deployed:
git add src/... api/... public/...
git commit -m "fix: ..."
git push
# → GitHub Repo: github.com/3Micky/assistenzarzt-ranking
# → Vercel deployed automatisch nach ~1 Min auf assistenz-ranking.de

# 4. Worktree syncen (für Preview-Server in Claude Code):
cd .claude/worktrees/kind-torvalds-3111a8
git merge main --no-edit
```

> **Achtung Worktree:** Dateien in `.claude/worktrees/kind-torvalds-3111a8/` sind KOPIEN.
> Claude Code editiert dort, aber `git push` muss vom Hauptverzeichnis erfolgen.
> Nach dem Push: Worktree mit `git merge main --no-edit` syncen.
> Commits im Worktree: Branch heißt `claude/kind-torvalds-3111a8`, nicht `main`.
> Merge-Befehl vom Hauptverzeichnis: `git merge --no-edit claude/kind-torvalds-3111a8`

---

## SEO-Status (Stand: 2026-05-13)

### Erledigt

**Technisches SEO**
- `react-helmet-async` — alle Pages mit Title, Description, Canonical, OG-Tags
- `BerichteDetailPage` — dynamischer Titel aus Klinikname + Score
- `index.html` — OG + Twitter Card Fallback
- `vercel.json` — 301-Redirect .com → .de + SPA-Rewrite `/index.html`
- `api/sitemap.js` — dynamische Sitemap: statische Routes + /klinik/:slug + /stadt/:slug + /bundesland/:slug + /fachrichtung/:slug aus Supabase
- `public/BingSiteAuth.xml` — Bing Webmaster Tools verifiziert
- Breadcrumb JSON-LD auf KlinikProfilePage, StadtPage, BundeslandPage, FachrichtungPage

**Structured Data (JSON-LD)**
- `Organization` — Entity Recognition / Google Knowledge Panel
- `WebSite` + `SearchAction` — Sitelinks-Searchbox
- `FAQPage` — 5 Q&As für Google AI Overviews
- `MedicalClinic` Schema auf KlinikProfilePage (via `hospitalProfileSchema()`)

**AI SEO**
- `public/robots.txt` — alle AI-Bots erlaubt (GPTBot, PerplexityBot, ClaudeBot, Google-Extended); CCBot blockiert
- `public/llms.txt` — Machine-readable Context File (llmstxt.org Standard)
- `HomePage.jsx` — sichtbarer FAQ-Abschnitt `<dl>/<dt>/<dd>` für AI-Extraktion

**Site-Architektur (SEO-Landingpages)**
- `/stadt/:slug` — City-Pages (z.B. `/stadt/berlin`, `/stadt/muenchen`)
- `/bundesland/:slug` — 51 Bundesländer/Kantone DACH
- `/fachrichtung/:slug` — 24 Fachrichtungen aus SPECIALTIES

**Fonts & Analytics**
- Self-hosted via `@fontsource` (keine IP an Google)
- GoatCounter: cookie-free, kein Cookie-Banner nötig

### Noch offen

- [ ] **Password-Gate entfernen** wenn Launch-bereit → danach Google Search Console anmelden + Sitemap einreichen
- [ ] **Google Search Console** verifizieren: `public/google-site-verification-ERSETZEN.html` → echten Code von GSC eintragen
- [ ] **Bilder** mit `alt`-Text versehen (Logo im Header)
- [ ] **Nameserver** optional auf Vercel umstellen (aktuell A-Record-Lösung, funktioniert)

---

## PasswordGate

- Aktiv bis Launch: Passwort `be100aware.now`
- Session-Storage Key: `ar_unlocked = '1'`
- Bypass für Tests: `sessionStorage.setItem('ar_unlocked', '1')` im Browser-Konsole
- In `src/components/PasswordGate.jsx`
- **WICHTIG:** Solange aktiv → `noindex` auf allen Seiten lassen

---

## Bekannte Fallstricke

| Problem | Lösung |
|---|---|
| `COUNTRY_FLAGS` gibt Text zurück ("DE"), kein Emoji | So gewollt — Emojis wurden entfernt |
| "Hauptstandort" als Klinikname | `resolveDisplayName()` in `hospitalSearch.js` ersetzt durch Trägername |
| "klinik" findet kein "Krankenhaus" | Synonym-Normalisierung in `normalize()` — beide → "klinik" |
| Stadt-Trap: "Berlin" als Klinik | `isCityTrap()` in `searchHospitals()` filtert das heraus |
| `/vergleich` Slot-State | `[{hospital:'', specialty:''}, ...]` — specialty='' → Aggregat aller Fachrichtungen |
| Berichte-URL | Neu: `/berichte/:hospitalSlug/:id` — alt: `/berichte/:id` (beide funktionieren) |
| DNS-Fehler im Browser | Lokaler Cache-Problem: `sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder` |
| Preview zeigt alte Version | Worktree nicht gesynct → `git merge main --no-edit` im Worktree ausführen |
| `ink-grid` mit `repeat(4,1fr)` auf Mobile | Stattdessen `className="ink-grid grid-cols-2 sm:grid-cols-4"` (kein inline style) |
| `ink-grid` mit `style` + Tailwind-Breakpoints | Inline `style` überschreibt Tailwind → `gridTemplateColumns` nur per className oder ohne style |
| BarRanking kein Balken auf Mobile | `margin.left(200) + YAxis.width(195) > Container` → `useWindowWidth()` Hook + responsive Werte |
| Text-Überlauf auf Mobile (Detail-Seiten) | `overflow-hidden` auf `max-w-3xl`-Container + `min-w-0` + `break-words` auf h1 |
| GeoMap weißer Balken unter Map | `minHeight: max(640px, calc(100vh - 12rem))` auf beiden Map-Divs |
| Vergleich-Slots überlappe auf Mobile | `grid-cols-1 sm:grid-cols-3` statt hardcoded `1fr 1fr 1fr` |

---

## Datenmodell (Supabase `ratings` Tabelle)

```js
{
  id: string,           // UUID
  hospital: string,     // Klinikname (Freitext oder aus DB)
  city: string,
  region: string,       // Bundesland / Kanton
  country: 'DE'|'AT'|'CH',
  specialty: string,    // aus SPECIALTIES-Array
  yearFrom: number,
  yearTo: number|'fortlaufend',
  comment: string,
  criteria: {           // Bewertungsfelder
    // ESSENTIAL: weiterbildung_qualitaet, dienst_haeufigkeit, ...
    // MEDICAL: op_zugang, weiterbildungsermaechtigung, ...
    // NICE: kantine, sport_angebote, ...
  },
  timestamp: string,    // ISO-Datum
  created_at: string,
}
```

---

## Projektkontext

- **Side-Project** von Hermann Bartels (hbartels22@gmail.com)
- Budget: ~20€/Monat
- Priorität: Sichtbarkeit und Nutzerwachstum vor Monetarisierung
- Sprache in der Kommunikation: Deutsch, knappe Antworten, Senior-Niveau
- Stack-Wechsel zu Next.js geplant, aber noch nicht — aktuell Vite-SPA mit Pre-Rendering-Überlegung
