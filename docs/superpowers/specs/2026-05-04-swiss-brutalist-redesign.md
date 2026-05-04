# Design Spec — Swiss Brutalist Redesign
*2026-05-04 | assistenzdoc-react-final*

---

## 1. Ziel

Vollständige Neugestaltung der Assistenzarzt-Ranking-Plattform im open-design Swiss Brutalist Theme. Alle bestehenden Funktionen bleiben erhalten; Design, Routing und Datenmodell werden grundlegend überarbeitet.

---

## 2. Design System

### Farben
| Token | Wert | Verwendung |
|---|---|---|
| Canvas | `#F4F4F0` | Seitenhintergrund, Karten-Hintergrund |
| Canvas-Alt | `#EAE8E3` | Abwechselnde Tabellenzeilen, subtile Flächen |
| Carbon Ink | `#050505` | Text, Borders, Divider, Grid-Hintergrund |
| Hazard Red | `#E61919` | Einziger UI-Akzent: aktiver Tab, CTA, Map-Hover-Grenze |
| Score Low | `#EF4444` | Datenpunkte: schlechte Scores |
| Score Mid | `#F59E0B` | Datenpunkte: mittlere Scores |
| Score High | `#22C55E` | Datenpunkte: gute Scores |

### Typografie
- **Display:** `Archivo Black` (900) oder `Inter` ExtraBold/Black — fluid `clamp(2rem, 5vw, 4rem)`, `letter-spacing: -0.04em`, `line-height: 0.9`, `text-transform: uppercase`
- **Body:** `Inter` Regular 400 — `font-size: 13–14px`, `line-height: 1.5`
- **Meta / Nav / Labels:** `JetBrains Mono` oder `monospace` — `font-size: 8–11px`, `letter-spacing: 0.1em`, `text-transform: uppercase`

### Geometrie
- `border-radius: 0` überall — keine Rundungen
- Divider: `display: grid; gap: 1px; background: #050505` erzeugt mathematisch exakte 1px-Ink-Linien
- ASCII-Ornamente: `///`, `[ ]`, `>>>` in Navigation, Section-Headings, Register-Strip
- Keine Shadows, keine Gradients, keine Glassmorphism-Effekte

### Fonts laden (index.html)
```html
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
```

---

## 3. Routing — 6 Seiten

| Route | Komponente | Inhalt |
|---|---|---|
| `/` | `HomePage` | DACH-Heatmap + Suchwidget (Berichte lesen / Bewerten) |
| `/berichte` | `BerichtePage` | Gefilterte Tabelle aller Bewertungen |
| `/karte` | `KartePage` | DACH-Heatmap Vollansicht |
| `/ranking` | `RankingPage` | Bar-Chart Top-Kliniken |
| `/vergleich` | `VergleichPage` | Radar-Vergleich (bis zu 3 Kliniken) |
| `/bewerten` | `BewertungPage` | 4-Schritt-Formular |

---

## 4. Layout-Shell

### Header (alle Seiten)
```
[ schwarzer Register-Strip: "ASSISTENZARZT-RANKING /// DE · AT · CH" ]
[ Logo-Block | border-right ] [ Nav: BERICHTE KARTE RANKING VERGLEICH ] [ [ + BEWERTUNG ] rot ]
```
- Register-Strip: `bg-#050505`, weiße Mono-Schrift links, gedimmte rechts
- Logo: schwarzes Quadrat mit 🏥, daneben "AssistenzDoc" in Display-Schrift
- Nav-Links: Mono, uppercase, grau — aktive Seite bekommt rote Unterstreichung (`border-bottom: 2px solid #E61919`)
- CTA `[ + BEWERTUNG ]`: volle rote Fläche rechts, immer sichtbar, führt zu `/bewerten`
- Mobile: Nav-Links werden ausgeblendet (out-of-scope); CTA `[ + BEWERTUNG ]` bleibt sichtbar; Seiten erreichbar über direkten Link

---

## 5. Startseite (`/`)

- **Hero-Zeile:** Display-Schrift "ASSISTENZARZTSTELLEN IM VERGLEICH", Eyebrow `[ ÜBERSICHT ]` in Hazard Red Mono
- **Suchwidget** direkt unter Hero:
  - Toggle: `>>> BERICHTE LESEN` / `[ BEWERTEN ]` — roter Hintergrund = aktiv
  - Freitext-Input (kein Label drüber): Placeholder `"Klinik, Stadt, Bundesland, Deutschland…"`
  - Land ist per Freitext suchbar: "Deutschland", "DE", "Österreich", "AT", "Schweiz", "CH"
  - Live-Dropdown mit Typ-Kennzeichnung: `KLINIK` (rot) / `STADT` / `BUNDESLAND` — je mit Flagge + Anzahl rechts
  - `SUCHEN >>>` Button rot rechts
- **DACH-Heatmap** darunter (volle Breite), Bubbles zeigen Score pro Region
- **StatsBar** (6 Zellen, `grid-gap:1px` auf Ink): Bewertungen · ⌀ Score · Top-Klinik · 🇩🇪 · 🇦🇹 · 🇨🇭

---

## 6. Berichte-Seite (`/berichte`)

- **Filter-Leiste** (sticky): Land · Bundesland · Stadt · Klinik (Freitext) · Fachrichtung — alles als Selects/Input mit `border: 1px solid #050505`, Mono-Labels
- **Tabelle** mit `grid-gap:1px` auf Ink-Hintergrund:
  - Spalten: Klinik | Land | Fachrichtung | Arbeitszeiten | Dienste/Mo | Überstunden (✓/✗) | WLB | Team
  - Scores in Score-Farben (grün/amber/rot), Mono-Ziffern
  - Zeilenwechsel: Canvas / Canvas-Alt
- **Pagination:** Mono-Nummerierung, aktive Seite Hazard Red
- Zeilen sind nicht klickbar (kein Detail-View in diesem Scope)

---

## 7. GeoMap (`/karte` + Startseite)

- Hintergrund: Canvas `#F4F4F0` (kein dunkler Hintergrund)
- Ländergrenzen: `stroke: #050505`, `stroke-width: 0.5`
- Länder-Fill: `#F4F4F0` (floating — Karte wirkt wie eingebettet in die Seite)
- Hover: `stroke: #E61919`, `stroke-width: 1.5`
- Bubble-Farbe nach Score: Score-Farbskala (rot→amber→grün)
- Tooltip: Mono-Stil, schwarzer Hintergrund, weiße Schrift

---

## 8. Datenmodell — Kriterien (neu)

### Pflicht-Kriterien (`criteria.js` komplett neu)
| Key | Label | Input-Typ |
|---|---|---|
| `arbeitszeitenVon` | Arbeitszeiten von | time |
| `arbeitszeitenBis` | Arbeitszeiten bis | time |
| `diensteProMonat` | Dienste / Monat | number (0–15) |
| `opsProMonat` | OPs / Monat | number (0–50) |
| `rotationsplaene` | Rotationspläne | boolean |
| `rotationsplaeneText` | Rotationspläne (Detail) | text |
| `ueberstundenAufschreiben` | Überstunden aufschreiben | boolean |
| `dienstsystem` | Dienstsystem | enum: `12h` \| `24h` |
| `fortbildungFreistellung` | Fortbildung — Freistellung | boolean |
| `fortbildungBezahlt` | Fortbildung — Bezahlt | boolean |
| `abteilungsgroesse` | Abteilungsgröße (Ärzte) | number |
| `mitarbeitergespraeche` | Mitarbeitergespräche / Jahr | number (0–12) |

### Nice-to-have-Kriterien
| Key | Label | Input-Typ |
|---|---|---|
| `parkplatz` | Parkplatz | boolean |
| `workLifeBalance` | Work-Life-Balance | slider 1–10 |
| `teamAtmosphaere` | Team-Atmosphäre | slider 1–10 |
| `benefits` | Benefits | text |

### Hospital-Daten (erweitert)
```js
{
  id, name, city, bundesland, country, // country: 'DE'|'AT'|'CH'
  specialty, year,
  criteria: { ...pflicht, ...niceToHave },
  comment,
  timestamp
}
```

---

## 9. RatingForm — 4 Schritte (`/bewerten`)

### Schritt 1 — Klinik wählen
- **Toggle:** Schnellsuche / Genaue Suche
- **Schnellsuche:** Freitext-Input → Live-Dropdown (Klinik / Stadt / Bundesland, Land als Freitext suchbar)
- **Genaue Suche:** Kaskadierendes Select: Region → Stadt → Klinik (Label: "Bundesland / Kanton" für DE/AT/CH; je `grid-gap:1px`)
- Fortschrittsanzeige: schwarzer Register-Strip `SCHRITT 1 VON 4 /// KLINIK WÄHLEN`

### Schritt 2 — Pflicht-Kriterien
- 2-spaltiges Grid (`grid-gap:1px` auf Ink)
- Ja/Nein-Felder: nebeneinander als Ink-Gap-Buttons, aktiv = Hazard Red (Ja) oder Ink (Nein)
- Dienstsystem: 12H / 24H Radio-Buttons (gleiches Muster)
- Navigation: `<<< ZURÜCK` | `WEITER >>>` (Mono, Ink-Gap)

### Schritt 3 — Nice-to-have + Kommentar
- 3-spaltiges Grid, Slider mit `accent-color: #E61919`
- Kommentar: Textarea ohne border-radius

### Schritt 4 — Bestätigung
- Große Display-Schrift: "DANKE. /// BEWERTUNG GESPEICHERT."
- CTA: `>>> WEITERE BEWERTUNG` | `[ ZUR STARTSEITE ]`

---

## 10. Tailwind Config — Anpassungen

```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      canvas: '#F4F4F0',
      'canvas-alt': '#EAE8E3',
      ink: '#050505',
      hazard: '#E61919',
    },
    fontFamily: {
      display: ['"Archivo Black"', 'Inter', 'sans-serif'],
      mono: ['"JetBrains Mono"', 'monospace'],
    },
    borderRadius: { DEFAULT: '0', none: '0' },
  }
}
```

---

## 11. index.css — Neue Utility-Klassen

- `.ink-grid`: `display:grid; gap:1px; background:#050505` — für StatsBar, Tabellen, Button-Gruppen
- `.btn-hazard`: Hazard-Red CTA Button (Mono, uppercase, kein border-radius)
- `.btn-ink`: Ink-farbener Ghost-Button
- `.mono-label`: `font-family:mono; font-size:8px; letter-spacing:0.1em; text-transform:uppercase; color:#888`
- `.tab-active`: `background:#E61919; color:#fff`
- `.tab-inactive`: `background:#F4F4F0; color:#888`

---

## 12. Dateien die neu erstellt werden

- `src/pages/HomePage.jsx`
- `src/pages/BerichtePage.jsx`
- `src/pages/KartePage.jsx`
- `src/pages/RankingPage.jsx`
- `src/pages/VergleichPage.jsx`
- `src/pages/BewertungPage.jsx`
- `src/components/Layout/TabNav.jsx` (extrahiert aus Dashboard)
- `src/components/Search/SearchWidget.jsx`
- `src/components/Search/SearchDropdown.jsx`
- `src/components/Berichte/BerichteTabelle.jsx`
- `src/components/Berichte/FilterBar.jsx`

## 13. Dateien die überarbeitet werden

- `src/App.jsx` — neues Routing
- `src/index.css` — neue Utility-Klassen, Font-Import
- `src/index.html` — Google Fonts
- `tailwind.config.js` — neue Tokens
- `src/components/Layout/Header.jsx` — Brutalist Header
- `src/components/Dashboard/StatsBar.jsx` — ink-grid
- `src/components/GeoMap/GeoMap.jsx` — Canvas-Hintergrund, Ink-Grenzen, Hazard-Red Hover
- `src/components/Charts/BarRanking.jsx` — Brutalist Styling
- `src/components/Charts/RadarComparison.jsx` — Brutalist Styling
- `src/components/RatingForm/*` — neues 4-Schritt-Formular
- `src/data/criteria.js` — komplett neues Datenmodell
- `src/data/sampleData.js` — neue Seed-Daten passend zum neuen Modell
- `src/utils/calculations.js` — Score-Berechnung an neues Modell anpassen
