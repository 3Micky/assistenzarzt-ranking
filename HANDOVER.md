# Handover: Assistenzarzt-Ranking

> Letzte Session: 2026-05-28  
> Branch: `main` | Commit: `3d00879`  
> Deploy: Vercel auto-deploy aktiv (assistenz-ranking.de)

---

## Was diese Session erreicht wurde

1. **Map-Dots unterteilen sich beim Zoomen** — ab Zoom ≥ 2.5 werden echte Klinik-Dots (2.747 Koordinaten aus InEK-Daten) statt Stadt-Aggregate angezeigt
2. **Zoom-to-Cursor** — Mausrad-Zoom folgt der Mausposition via `d3-geo` Projektions-Math
3. **20 Referenz-Städte** auf der Map — klickbar, mit Hover-Labels (schwarze Schrift auf weißem Grund)
4. **Mobile Viewport fix** — `overflow-x: hidden` + `max-width: 100vw` entfernt, die iOS Safari zum Zoomen zwangen
5. **Klinik-Profile mobile** — Kriterien-Labels umbrechen jetzt (`break-words`), Grid auf `sm:grid-cols-2`
6. **Bewertungsformular mobile** — `EnumField` Buttons kompakter (`px-2` statt `px-5` auf Mobile)
7. **MapTooltip redesign** — alte `card-sm`/`text-slate-100`-Klassen (nicht im Design-System) ersetzt durch brutalistische Klassen; kein Riesentext mehr
8. **Heatmap-Header Full-Bleed** — negative Margins (`mx-[-0.75rem]...`) damit `/// DACH-HEATMAP`-Strip die volle Breite spannt
9. **Koordinaten ausgelagert** — `hospitalCoords.js` (140KB) statt `hospitals.js` (802KB) um Dateigröße zu halten
10. **Google AI-SEO** — Strategie besprochen; `llms.txt` gelöscht (verstößt gegen Google Richtlinien)

---

## Offene Punkte / Bekannte Probleme

| Problem | Priorität | Status |
|---|---|---|
| **PasswordGate** noch aktiv | **KRITISCH** | Blockiert Google Indexierung. Passwort: `be100aware.now`. Muss vor Launch entfernt werden. |
| **Google Search Console** nicht verifiziert | **KRITISCH** | `public/google-site-verification-ERSETZEN.html` ist Platzhalter. Echten GSC-Code eintragen. |
| **Map-Bubble-Überlappung** bei hohem Zoom | mittel | Berliner Raum: Charité + UKB + weitere Kliniken liegen nah beieinander. Lösung: Collision-Detection oder offset-Logik in `GeoMap.jsx` Marker-Rendering. |
| **Bilder ohne `alt`-Texte** | niedrig | Logo im Header, Map-Flags etc. |
| **Chunk-Größe** 1.7MB JS | niedrig | Build-Warning. Code-Splitting via dynamic imports möglich. |
| **hospitals.js** vs `hospitalCoords.js` Sync | niedrig | Wenn neue Kliniken hinzukommen, muss `hospitalCoords.js` neu generiert werden aus InEK-Standortdaten. |

---

## Dateien, die in dieser Session geändert wurden

```
src/components/GeoMap/GeoMap.jsx          — Zoom-to-Cursor, Hospital-Dots, Ref-Cities
src/components/GeoMap/MapTooltip.jsx      — Brutalist redesign, fix riesiger Text
src/components/RatingForm/StepCriteria.jsx — Mobile-kompakte Enum-Buttons
src/data/hospitalCoords.js                — NEU: 2.747 Koordinaten-Mapping
src/data/cities.js                        — REFERENCE_CITIES hinzugefügt
src/hooks/useRatings.js                   — hospitalData exportiert
src/pages/HomePage.jsx                    — Full-bleed Heatmap-Section
src/pages/KartePage.jsx                   — Full-bleed Heatmap-Section
src/pages/KlinikProfilePage.jsx           — Mobile break-words für Kriterien
src/App.jsx                               — Main-Padding erhöht (px-3 sm:px-4...)
src/index.css                             — overflow-x:hidden entfernt
```

---

## Wichtige Commands

```bash
# Build prüfen
npm run build

# Deploy (Vercel auto-deployed bei Push auf main)
git add src/... && git commit -m "..." && git push

# Worktree sync (wenn Preview-Server in Claude Code genutzt wird)
cd .claude/worktrees/kind-torvalds-3111a8 && git merge main --no-edit

# PasswordGate bypass (Browser-Console)
sessionStorage.setItem('ar_unlocked', '1')
```

---

## Architektur-Entscheidungen dieser Session

- **Koordinaten separat**: `HOSPITAL_COORDS` in eigener Datei, nicht in `hospitals.js` eingebettet, um Ladezeit zu sparen
- **Kein `overflow-x: hidden`**: Bewusst entfernt — iOS Safari interpretiert das als "Seite ist breiter als Viewport" und zoomt automatisch rein
- **Kein `llms.txt`**: Google AI Optimization Guide empfiehlt ausdrücklich keine versteckten/optimierten Textdateien für AI-Bots
- **SVG-Hover-Labels statt HTML-Tooltip**: Für Stadt-/Klinik-Namen direkt im SVG, skaliert mit Zoom (`fontSize: ${Math.max(7, 9/zoom)}px`)

---

## Nächste Schritte (empfohlen)

1. **PasswordGate entfernen** → `src/components/PasswordGate.jsx` aus `App.jsx` entfernen oder per Env-Flag abschaltbar machen
2. **GSC verifizieren** → Echten Google-Code in `public/google-site-verification-ERSETZEN.html` eintragen
3. **Sitemap einreichen** → Nach PasswordGate-Entfernung: `assistenz-ranking.de/sitemap.xml` in GSC einreichen
4. **Bing** → Bereits verifiziert (`BingSiteAuth.xml`), aber Sitemap auch dort einreichen
5. **Map-Collision** → Berlin/München/Hamburg Clustering bei hohem Zoom verbessern
6. **Analytics prüfen** → GoatCounter-Dashboard (`assistenz.goatcounter.com`) auf korrekte Tracking-Codes prüfen

---

## Kontakt / Stakeholder

- **Projekt**: assistenz-ranking.de (anonyme Assistenzarzt-Bewertungen DACH)
- **Dev**: Hermann Bartels (hbartels22@gmail.com)
- **Repo**: github.com/3Micky/assistenzarzt-ranking
- **Deploy**: Vercel (auto-deploy main branch)
- **DNS**: A-Record @ → 76.76.21.21 (united-domains)
