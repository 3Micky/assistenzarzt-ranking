# Marketing- & SEO-Aktionsplan — assistenz-ranking.de

> Stand: 2026-06-21 · evidenzbasiert (Live-Site + Code geprüft)
> Deckt ab: SEO-Audit · AI-SEO · Programmatic SEO · Launch · Cold-Start/Community

---

## 🔴 Befund Nr. 1 (überlagert alles): Die Site ist für Crawler praktisch leer

**Evidenz:** Ein Abruf von `https://assistenz-ranking.de/` ohne JavaScript liefert nur
„Loading Assistenz-Ranking…" — **kein** Klinikname, keine Überschrift, keine FAQ, keine Navigation.
Die Site ist eine reine Client-Side-SPA (Vite/React) **ohne SSR/Prerendering** (`grep` nach
prerender/ssg/ssr in package.json + vite.config = nichts).

**Warum das fatal ist:**
- Die ganze gute Arbeit (per-Page `<title>`/`canonical`/`robots`/JSON-LD via react-helmet, Sitemap mit 150 URLs, offene robots.txt) entsteht **erst nachdem JS gerendert hat**.
- Google *kann* JS rendern — verzögert und unzuverlässig, v. a. für Long-Tail.
- **Bing und alle AI-Crawler (GPTBot, PerplexityBot, ClaudeBot) rendern in der Regel KEIN JS** → sie sehen die leere Lade-Seite → **0 Indexierung, 0 Zitierung**. Das macht den gesamten AI-SEO-Aufwand (robots.txt erlaubt alle AI-Bots) wirkungslos.

**Das ist DER Hebel.** Alles andere unten ist sekundär, bis das gelöst ist.

**Fix-Optionen (aufsteigender Aufwand):**
1. **Prerendering der statischen + datengetriebenen Routen** mit `vite-react-ssg` oder `vite-plugin-prerender` → echte HTML-Snapshots im `dist/`. Schnellster Weg, bleibt im aktuellen Stack. **Empfehlung für sofort.**
2. **Migration zu Next.js (App Router)** — der ohnehin in CLAUDE.md geplante Schritt. SSR/ISR löst es sauber und ist Voraussetzung für Programmatic SEO at scale (siehe unten). **Mittelfristig die richtige Antwort.**

---

## 1 · SEO-Audit (technisch + on-page)

### Was bereits gut ist ✅
- **PasswordGate ist in Produktion AUS** (`.env.production` → `VITE_PUBLIC_LAUNCH=true`, Gate-Bypass). Die Site ist live & crawlbar — der „kritische Blocker" aus HANDOVER.md/CLAUDE.md ist **veraltet**.
- robots.txt offen (`Disallow:` leer), AI-Bots explizit erlaubt, CCBot geblockt, 2 Sitemaps referenziert.
- Sitemap valide (~150 URLs: static + 24 Fachrichtungen + 51 Regionen).
- Per-Page-Meta via react-helmet-async (Title/Description/Canonical/OG), index.html mit JSON-LD `@graph` (Organization + WebSite + FAQPage).
- Empty-State-Logik: leere Stadt-/Bundesland-/Fachrichtungsseiten setzen `noindex` (gut gegen Thin Content).

### Findings

| # | Issue | Impact | Evidenz | Fix | Prio |
|---|---|---|---|---|---|
| 1 | Kein Prerendering/SSR (s. o.) | **Hoch** | Live-Fetch = leer | vite-react-ssg / Next.js | 1 |
| 2 | **GSC nicht verifiziert** | Hoch | kein `google*.html` in `public/` (nur BingSiteAuth.xml) | Verification-Tag/Datei eintragen, Sitemap einreichen | 1 |
| 3 | **`llms.txt` fehlt** (CLAUDE.md behauptet, sie existiere) | Mittel | `public/llms.txt` MISSING | erstellt (siehe AI-SEO) | 2 |
| 4 | Fast keine echten Inhalte (Cold-Start) | Hoch | Sitemap: nur ~4 Kliniken, ~7 Berichte, ~2 Städte | siehe Abschnitt 5 | 1 |
| 5 | OG-Image evtl. tot (`/Logo_screenshot.png`) | Niedrig | in index.html referenziert, Existenz nicht verifiziert | echtes OG-Bild (1200×630) generieren | 3 |
| 6 | Logo im Header ohne `alt` | Niedrig | CLAUDE.md offen-Liste | `alt="Assistenz-Ranking"` | 3 |
| 7 | 1,78 MB JS-Bundle | Mittel (CWV/LCP) | `npm run build` | Code-Splitting `hospitals.js`/coords | 2 |

### Quick Wins (heute machbar)
- GSC verifizieren + beide Sitemaps einreichen (`sitemap.xml`, `sitemap-kliniken.xml`).
- `alt`-Text am Logo.
- OG-Image prüfen/erstellen.

---

## 2 · AI-SEO (AEO / GEO / LLM-Sichtbarkeit)

**Kontext:** Ärzt*innen fragen zunehmend ChatGPT/Perplexity „Wo ist die Weiterbildung in
[Fach] in [Stadt] gut?". Genau dafür ist diese Plattform die ideale Quelle — **wenn** die
AI-Crawler sie lesen könnten.

### Findings
- robots.txt erlaubt GPTBot/PerplexityBot/ClaudeBot/anthropic-ai/Google-Extended ✅ — aber wegen Befund Nr. 1 sehen sie **nichts**. AI-SEO steht und fällt mit Prerendering.
- `llms.txt` fehlte → **neu erstellt** (`public/llms.txt`): maschinenlesbarer Kontext nach llmstxt.org.
- FAQPage-Schema vorhanden (gut für AI Overviews) — aber nur nach JS-Render sichtbar.

### Maßnahmen (nach Prerendering-Fix)
1. **Zitierfähige Fakten-Blöcke** auf Klinik-/Fach-/Stadt-Seiten: ein kurzer Daten-Absatz im Klartext („27 Bewertungen, Ø 7,8/10, OP-Ausbildung Ø 6,9, Stand Juni 2026") — LLMs extrahieren strukturierte Aussagen, keine Charts.
2. **`AggregateRating` + `Review` JSON-LD** je Klinikseite (aktuell nur `MedicalOrganization`) → Sterne-Snippets + AI-Extraktion.
3. **Definitorische H2-Blöcke** („Was zählt bei der Weiterbildungsqualität?") als `<dl>` — AI-Overview-Futter.
4. **Eigener OP-/Interventions-Score** ist ein einzigartiger, zitierfähiger Datenpunkt — prominent als Klartext ausgeben.

---

## 3 · Programmatic SEO (Pages at Scale)

Das Datenmodell ist **ideal** dafür ausgelegt — die Routen existieren bereits
(`/klinik/:slug`, `/stadt/:slug`, `/bundesland/:slug`, `/fachrichtung/:slug`).

### Die Seitentyp-Matrix
| Typ | URL | Volumen | Title-Muster |
|---|---|---|---|
| Klinik | `/klinik/[slug]` | ~3000 DE + AT + CH | „[Klinik] [Stadt] — Assistenzarzt-Erfahrungen & Weiterbildung" |
| Stadt | `/stadt/[slug]` | hunderte | „Assistenzarzt-Stellen [Stadt] — Bewertungen 2026" |
| Fachrichtung | `/fachrichtung/[slug]` | 24 | „[Fach] Weiterbildung — Top-Kliniken DACH" |
| Bundesland | `/bundesland/[slug]` | 51 | „Assistenzarzt [Bundesland] — alle Kliniken" |
| **Fach × Stadt** (neu) | `/[fach]/[stadt]` | **tausende** | „Innere Medizin München — Klinik-Ranking" |
| **Fach × OP-Score** (neu, USP) | `/op-ausbildung/[fach]` | 13 prozedurale | „Beste OP-Ausbildung [Fach] — Kliniken-Ranking" |

### Voraussetzungen (Reihenfolge)
1. **Prerendering/SSR** (Befund 1) — sonst sind alle diese Seiten leer für Crawler.
2. **Thin-Content-Gate beibehalten:** Seiten ohne Daten → `noindex` (ist schon so). Erst bei ≥1–3 Bewertungen indexierbar machen → wächst organisch mit den Daten mit.
3. **Interne Verlinkung** Klinik ↔ Stadt ↔ Fach ↔ Bundesland (Breadcrumbs existieren bereits).
4. **Fach × Stadt** als nächste Expansionsstufe — höchstes Long-Tail-Volumen, erst sinnvoll ab ~200+ Bewertungen.

> ⚠️ Nicht 1000e leere Seiten gleichzeitig live nehmen (Google „Helpful Content"-Risiko). Datengetrieben skalieren: Seite wird indexierbar, sobald sie echten Inhalt hat.

---

## 4 · Launch-Strategie (Go-Live)

**Überraschung: Du bist technisch schon live.** Gate ist in Prod aus, Site indexierbar.
Was zum „echten" Launch fehlt, ist weniger technisch als inhaltlich.

### Checkliste
- [x] PasswordGate in Prod deaktiviert (env-Flag)
- [ ] **GSC verifizieren + Sitemaps einreichen** (Prio 1, blockiert Monitoring)
- [ ] **Prerendering** (Prio 1, sonst kein Crawling-Wert)
- [ ] **50–100 echte Bewertungen** sammeln *vor* dem lauten Launch (Abschnitt 5)
- [ ] OG-Image + `alt`-Texte
- [ ] Dann erst: Product-Hunt/Reddit/Uni-Launch (sonst landen Besucher auf leerer Plattform)

**Reihenfolge:** Prerendering + GSC → 50 Seed-Bewertungen → dann öffentlicher Launch.
Ein lauter Launch auf eine inhaltsleere Plattform verbrennt die einmalige Aufmerksamkeit.

---

## 5 · Cold-Start lösen (das eigentliche Wachstumsproblem)

**Ohne Inhalte kein SEO, kein AI, kein Wachstum.** Ziel: **50–100 Bewertungen** vor dem lauten Launch.
Das ist das klassische Henne-Ei-Problem von Bewertungsplattformen.

### Mechanik (Wert-Loop)
- **„1 Bewertung abgeben = alle Bewertungen freischalten"** — der bewährteste UGC-Hebel (Glassdoor-Modell). Macht jede Abgabe wertvoll und viral.
- Formular muss < 90 Sek mobil bleiben (passt zur niedrigschwelligen Positionierung) — Pflichtfelder minimal halten.

### Kanäle (DACH-Medizin, Eigenleistung)
1. **Uni-Gruppen / Fachschaften** (DE ~38, AT 4, CH 5): WhatsApp-Broadcast + IG-Story-Template. Deine bestehenden Gruppen zuerst.
2. **Reddit**: r/medizinstudium, r/Medizin, r/Assistenzarzt — als ehrliches Tool teilen, nicht spammen.
3. **Fachverbände**: Marburger Bund (Landesverbände), Hartmannbund — 1 Mail-Vorlage, ~30 Kontakte → realistisch 3–5 Backlinks.
4. **Content-Hooks aus eigenen Daten**: „Top 5 OP-Ausbildungen [Fach] in Bayern" als IG/TikTok-Insight — nutzt den neuen OP-Score als einzigartigen Aufhänger.

### Community-Aufbau (nach erstem Traction)
- Kleiner Discord/Telegram für Beta-Bewerter*innen → Feedback-Loop + Wiederkehr.
- Botschafter*innen je Uni (Fachschafts-Kontakte) als Multiplikatoren.

### Seed-Strategie (Tag 1)
Selbst 20–30 ehrliche Bewertungen aus dem eigenen Netzwerk (Kommiliton*innen, ehemalige Stationen)
durchbrechen die „leere Plattform"-Wahrnehmung. Qualität vor Quantität — echte, detaillierte Berichte.

---

## Priorisierte Gesamt-Roadmap

**Sofort (diese Woche)**
1. Prerendering (`vite-react-ssg`) ODER Next.js-Migration starten — *der* Hebel.
2. GSC verifizieren + Sitemaps einreichen.
3. `llms.txt` deployen (erstellt), OG-Image + `alt`-Texte.

**Kurzfristig (2–6 Wochen)**
4. 50–100 Seed-Bewertungen via Uni-Gruppen (Wert-Loop „1 abgeben = alle sehen").
5. `AggregateRating`/`Review`-Schema + Klartext-Faktenblöcke je Klinikseite.

**Mittelfristig (Monat 2–3)**
6. Programmatic: Fach × Stadt + OP-Ausbildungs-Seiten (datengetrieben indexieren).
7. Lauter Launch (Reddit/Uni/PH) — erst wenn Inhalte da sind.
8. 1 Long-Form-Artikel/Monat (Gehalt, Bewerbung, TV-Ärzte) + Backlink-Outreach.

---

## KPIs (3 / 6 / 12 Monate nach echtem Launch)
| Metrik | 3 M | 6 M | 12 M |
|---|---|---|---|
| Indexierte Seiten (GSC) | 50 | 500 | 2.000 |
| Organische Klicks/Monat | 50 | 500 | 3.000 |
| Bewertungen total | 100 | 500 | 2.000 |
| AI-Zitierungen (Perplexity/ChatGPT) | erste | regelmäßig | etabliert |
| Backlinks | 5 | 20 | 50 |
