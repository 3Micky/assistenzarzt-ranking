# Handover: Assistenzarzt-Ranking

> Letzte Session: 2026-06-21
> Branch: `main` | Commit: `b6531d5`
> Deploy: Vercel auto-deploy (assistenz-ranking.de) — **aktuell passwortgeschützt (Private Beta)**

---

## Aktueller Zustand (Kurzfassung)

- Die **komplette fertige App** ist auf `main` und in Produktion deployt.
- Die Production-Domain ist **serverseitig passwortgeschützt** (siehe „Beta-Schutz"). Passwort: `be100aware.now`.
- Zum öffentlichen Launch: `SITE_PRIVATE=false` in Vercel setzen + Redeploy (dann ist auch der Zeitpunkt für Prerendering/SEO, siehe [docs/MARKETING-SEO-AKTIONSPLAN.md](docs/MARKETING-SEO-AKTIONSPLAN.md)).

---

## Was diese Session erreicht wurde

### 1. Bewertungslogik v2 (großer Refactor — [src/utils/calculations.js](src/utils/calculations.js))
Behobene echte Bugs:
- `schichtsystem` wirkt jetzt im Score (alter Key `dienstsystem` war tot → immer 5).
- `nachtdienstBegleitung` als Slider statt Boolean ausgewertet.
- Score auf [0,10] geclamped (vorher waren Werte wie −32/46 möglich).
- Farbe + Label aus **einer** zentralen Quelle (`SCORE_BANDS`).
- Speichern (`RatingForm`) wartet `addRating()` ab + zeigt Fehler statt immer „Erfolg".
Strukturell:
- `normalizeCriteria()` als Legacy-Adapter: liest alte (`dienstsystem`, Boolean-Felder) **und** neue Rows verlustfrei; Prod-Daten werden nicht migriert, nur beim Lesen normalisiert.
- Fehlende Werte = `null` = unbeantwortet → aus dem Dimensionsmittel ausgeschlossen (kein künstliches 5,0). Ungültig bei < 5 beantworteten Kernfragen.
- Dimensions-Extraktoren einmal definiert, von Score + Radar gemeinsam genutzt.
- Neukalibrierung: Mitarbeitergespräche 1/Jahr → 6,5; `wbeJahre` gegen 6 Soll-Jahre.
- Ranking: Mindestens 3 Bewertungen für offizielle Platzierung + Bayesian Average (Prior 4).

### 2. OP-/Interventions-Ausbildungs-Score (neu)
- `operativeTrainingScore(criteria, specialty)` — eigener Sub-Score (0–10), **nur für prozedurale Fächer** (`SPECIALTY_PROCEDURE_TYPE` in criteria.js: operativ/interventionell/mixed), sonst `null` (N/A).
- Effizient: 1 neues Feld `hauptoperateurAnteil` (Slider), Rest aus Bestand (`logbuchErfuellbarkeit`, `autonomie`, `supervisionQualitaet`). Multiplikatives Gate + Cap-Regel gegen die „Service-Job-Falle".
- Fließt **nicht** in `overallScore` (separater Anzeige-Score, Badge auf KlinikProfilePage).

### 3. Formular-UX
- Fachrichtung in Schritt 1 ist jetzt **Pflicht**.
- Fortbildung/Lehre-Felder in Schritt 3 gruppiert („FORTBILDUNG & LEHRE").
- „OPs / MONAT" nur bei prozeduralen Fächern, kleines „s", mit erklärendem Hint.

### 4. Scroll-Restoration (gesamte Website)
- `ScrollToTop` in App.jsx (bei jedem Routenwechsel nach oben) + `useEffect` auf `step` in RatingForm (Formular-Schritte).

### 5. Marketing/SEO
- [docs/MARKETING-SEO-AKTIONSPLAN.md](docs/MARKETING-SEO-AKTIONSPLAN.md) erstellt (SEO-Audit, AI-SEO, Programmatic SEO, Launch, Cold-Start).
- `public/llms.txt` erstellt (fehlte trotz CLAUDE.md-Behauptung).
- **Befund:** Site ist Client-Side-SPA ohne Prerendering → Crawler/AI-Bots sehen leere Lade-Seite. Prerendering ist *der* SEO-Hebel für den Launch.

### 6. Beta-Schutz (serverseitig — [middleware.js](middleware.js))
- Vercel Edge Middleware mit **Cookie-Login** (kein Basic Auth — Vercel strippt `WWW-Authenticate`, dann zeigt der Browser keinen Dialog).
- Blockt jeden Request (HTML, Assets, /api, Sitemaps) am Edge, bevor Inhalt ausgeliefert wird. Auf Hobby-Plan der einzige kostenlose Weg, die Production-Domain zu schützen (Vercel Password Protection = Pro+ / 150 €/Mon).
- Cookie speichert SHA-256(Passwort), nicht das Passwort. Env: `SITE_PASSWORD`, `SITE_PRIVATE`.
- **Live verifiziert:** ohne Login kein App-Inhalt, falsches PW abgewiesen, mit PW Zugang.

---

## Offene Punkte / Nächste Schritte

| Punkt | Prio | Status |
|---|---|---|
| Eigenes `SITE_PASSWORD` in Vercel setzen (Fallback `be100aware.now` steht im Repo) | mittel | offen (Dashboard-Aktion) |
| **Prerendering** (vite-react-ssg) — Voraussetzung für SEO/AI-Sichtbarkeit | hoch | offen, vor Launch |
| Google Search Console verifizieren + Sitemaps einreichen | hoch | offen |
| 50–100 echte Seed-Bewertungen (Cold-Start) | hoch | offen |
| `AggregateRating`/`Review`-Schema je Klinikseite | mittel | offen |
| 1,78 MB JS-Bundle → Code-Splitting | niedrig | offen |
| iOS-App (Capacitor) | — | **pausiert** (Code liegt im Repo) |

---

## Wichtige Commands

```bash
npm run dev                 # lokaler Dev-Server (Gate via VITE_PUBLIC_LAUNCH)
npm run build               # Production-Build
npx vitest run              # Tests (zuletzt 23/23 grün)
git push origin main        # → Vercel auto-deploy (Production)

# Live-Check Beta-Schutz:
curl -s -o /dev/null -w "%{http_code}\n" https://assistenz-ranking.de/   # → Login-Seite
```

## Launch (ein Schritt)
`SITE_PRIVATE=false` in Vercel (Production) + Redeploy → Schloss auf.
