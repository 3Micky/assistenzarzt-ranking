# SEO & Sichtbarkeits-Strategie — assistenz-ranking.de

> Stand: 2026-05-10
> Projekt: Side-Project, Ziel = Sichtbarkeit (nicht Monetarisierung)
> Budget: ~20 €/Monat
> Zielregion: DACH
> USP: niedrigschwellige + intelligente Bewertung

---

## 1. Diagnose des Ist-Zustands (Stand 2026-05-10)

### Tech-Stack
- Vite-SPA (React 18, Tailwind v3, Zustand, Recharts)
- Supabase als Backend (DB schon vorhanden — gut!)
- Resend für E-Mails
- Hosting: Vercel
- Routing: React Router v6 (Client-Side)

### SEO-Blocker (kritisch)
1. **Password-Gate aktiv** ([src/components/PasswordGate.jsx](../src/components/PasswordGate.jsx)) — Passwort `be100aware.now`. Komplette Site nicht crawlbar. Bleibt bis Launch.
2. **0 echte Bewertungen** — ohne Inhalte ranken keine Seiten (Cold-Start-Problem).
3. **Vite-SPA ohne SSR** — Google bekommt leeres `<div id="root">`. JS-Rendering bei Google ist langsam/unzuverlässig, besonders für Long-Tail.
4. **Keine `robots.txt`, keine `sitemap.xml`** in [public/](../public/).
5. **Keine Klinik-/Stadt-Landingpages** — nur `/berichte/:id` mit UUIDs (kein SEO-Wert).
6. **Keine Open Graph / Twitter Card Meta-Tags** pro Route.
7. **Keine strukturierten Daten** (Schema.org `Review` / `AggregateRating` fehlen → keine Stern-Snippets).

### Was bereits gut ist
- Domain registriert + live ([assistenz-ranking.de](https://assistenz-ranking.de))
- Solider Tech-Stack mit Supabase (echte DB statt LocalStorage)
- Vercel-Hosting (perfekt für spätere Next.js-Migration)
- Saubere Routen-Struktur ([src/App.jsx](../src/App.jsx))
- GoatCounter-Snippet schon im HTML vorbereitet

---

## 2. Strategie in 4 Phasen

### Phase 1 — Indexierbarkeit vorbereiten (Woche 1–2, vor Launch)

| Task | Aufwand | Effekt |
|---|---|---|
| `<meta name="robots" content="noindex, nofollow">` solange Password-Gate aktiv | 5 min | Schutz: kein versehentliches Indexieren der Wand |
| `robots.txt` schreiben (vorerst `Disallow: /`, beim Launch öffnen) | 10 min | Pflicht-Datei |
| `sitemap.xml` dynamisch generieren (Vercel Function liest Supabase) | 1 h | Pflicht-Datei |
| Pre-Rendering statischer Routen (`vite-plugin-prerender` oder `vite-react-ssg`) | 2 h | Riesig — echte HTML-Inhalte für Crawler |
| `react-helmet-async` einbauen — pro Page eigene Title + Description + OG-Tags | 1 h | CTR + Social Sharing |
| JSON-LD `Organization` + `WebSite` im `<head>` | 20 min | Knowledge Panel + Sitelinks-Search-Box |
| Google Search Console + Bing Webmaster einrichten | 30 min | Monitoring |
| Plausible oder GoatCounter aktivieren | 15 min | Traffic-Daten |

### Phase 2 — Cold-Start lösen (Woche 2–6, parallel)

**Wichtigster Punkt überhaupt: ohne Inhalte kein SEO.** Ziel: 50–100 Bewertungen vor dem Launch.

- Unigruppen-Outreach: WhatsApp-Broadcast + IG-Story-Templates vorbereiten
- Mechanik prüfen: „1 Bewertung freischalten = Zugang zu allen Bewertungen" (UGC-Loop)
- Bewertungsformular weiter entschlacken — Versprechen „niedrigschwellig" muss messbar werden (Mobile <90 Sek)
- Beta-Tester einladen, Feedback einarbeiten

### Phase 3 — Programmatic SEO (Monat 2–3, nach Launch)

Sobald Daten + Migration zu **Next.js (App Router)** stehen:

| Page-Typ | URL-Schema | Beispiel-Title |
|---|---|---|
| Klinik | `/klinik/[slug]` | „Charité Berlin — Erfahrungen Assistenzärzt:innen" |
| Stadt | `/stadt/[slug]` | „Assistenzarzt-Stellen Berlin — Bewertungen 2026" |
| Fachrichtung | `/fachrichtung/[slug]` | „Anästhesie Weiterbildung — Top-Kliniken" |
| Fachrichtung × Stadt | `/[fach]/[stadt]` | „Innere Medizin München — Klinik-Ranking" |
| Bundesland | `/bundesland/[slug]` | „Assistenzarzt Bayern — alle Kliniken" |

Pflicht für jede dieser Pages:
- Schema.org `LocalBusiness` + `AggregateRating` JSON-LD → **Sterne-Snippets in Google**
- `<h1>`, semantische Struktur
- Interne Verlinkung: Klinik ↔ Stadt ↔ Fachrichtung
- Breadcrumbs mit Schema.org
- Aussagekräftige Description aus realen Daten („27 Bewertungen, ⌀ 7,8/10, Stand Mai 2026")

### Phase 4 — Content & Backlinks (laufend)

**Content (1 Artikel/Monat reicht):**
- Volumen-Themen: „Assistenzarzt-Gehalt 2026 (DE/AT/CH)", „Bewerbung Assistenzarzt — Vorlage + Tipps", „PJ Schweiz vs. Deutschland", „TV-Ärzte erklärt", „Weiterbildungsordnung — was zählt?", „Niederlassung vs. Klinik"
- Format: Long-Form (1500+ Wörter), echte Daten aus dem Ranking integriert
- Auf jeder Klinik-Page: kurzer redaktioneller Block + Verlinkung zu passendem Guide

**Backlinks (Outreach in Eigenleistung):**
- Marburger Bund (Landesverbände)
- Hartmannbund
- Fachschaften Medizin (DE: ~38 Unis, AT: 4, CH: 5)
- Operation-Karriere, via medici, Thieme Studium
- Reddit r/medizinstudium, r/Medizin, Studifutter, Mediscript-Forum
- Strategie: 1 Mail-Vorlage, ~30 Kontakte → realistisch 3–5 Backlinks im ersten Schwung

**Social:**
- IG/TikTok-Insights aus den Daten („Top 5 Anästhesie-Weiterbildungen Bayern")
- Reichweite via Unigruppen, die du eh hast

---

## 3. Konkurrenz & Positionierung

### Direkte Konkurrenten (zu prüfen)
- **klinikradar.de** — Klinik-Bewertungen für Patienten (nicht Ärzte → andere Intent)
- **operation-karriere.de** — etablierter Player, Stellen + Content
- **jameda Klinik-Bereich** — Patienten-Sicht
- **viamedici.thieme.de** — Studi-Community, kein Ranking

### Lücke / USP von assistenz-ranking.de
- **Assistenzarzt-spezifisch** (nicht Patienten-Sicht)
- **Niedrigschwellig** + intelligent — schneller als Konkurrenz
- **DACH** statt nur DE
- Anonym + transparent

→ In Title/Description konsequent „Assistenzarzt", „Weiterbildung", „Erfahrungsberichte" — nicht Patienten-Vokabular.

---

## 4. Keyword-Buckets (zu validieren mit Ahrefs Webmaster Tools / Google Suggest)

### Transactional (höchste Priorität — Bewertung lesen wollen)
- `[Klinikname] Erfahrungen Assistenzarzt`
- `[Klinikname] Weiterbildung Bewertung`
- `Assistenzarzt [Stadt]`
- `Beste Klinik Weiterbildung [Fachrichtung]`

### Informational (Content-Marketing-Blog)
- `Assistenzarzt Gehalt [Jahr]`
- `Bewerbung Assistenzarzt Muster`
- `Weiterbildung Innere Medizin Dauer`
- `Arbeitszeit Assistenzarzt`
- `PJ Schweiz Voraussetzungen`
- `TV-Ärzte einfach erklärt`

### Brand
- `assistenz ranking`
- `assistenzarzt ranking`
- `assistenzdoc`

---

## 5. Tooling & Budget (20 €/Monat)

| Tool | Kosten | Zweck |
|---|---|---|
| Vercel Hobby | 0 € | Hosting |
| Supabase Free | 0 € | DB |
| Plausible (alt: GoatCounter) | 9 € / 0 € | Privacy-konforme Analytics |
| Google Search Console | 0 € | Indexierung + Klick-Daten |
| Bing Webmaster Tools | 0 € | Bing/ChatGPT-Search |
| Ahrefs Webmaster Tools | 0 € | Backlinks + Keyword-Tracking (eigene Domain gratis) |
| Ubersuggest / Sistrix Smart | 0 € | Konkurrenz-Recherche (gratis-Tier) |
| Mailchimp Free / Buttondown Free | 0 € | Newsletter |
| **Reserve (Domain, Tools)** | ~10 € | Puffer |

**Empfehlung:** Plausible weglassen, GoatCounter-Snippet aktivieren (steht schon im HTML). Damit hast du quasi alles gratis und 20 € Reserve für später (z. B. eigenes E-Mail-Marketing oder bezahlte Outreach).

---

## 6. Konkrete Reihenfolge der nächsten Sessions

### Session 1 (sofort möglich, Password-Gate bleibt)
1. `<meta name="robots" content="noindex, nofollow">` setzen
2. `robots.txt` mit `Disallow: /` schreiben
3. `react-helmet-async` einbauen, pro Page sinnvolle Title/Description
4. JSON-LD `Organization` + `WebSite`
5. Open Graph Bild generieren ([assistenz-ranking.de] Logo + Claim)
6. GoatCounter aktivieren

### Session 2 (vor Launch)
1. Pre-Rendering konfigurieren (`vite-plugin-prerender` oder `vite-react-ssg`)
2. `sitemap.xml` als Vercel Function aus Supabase
3. Search Console + Bing Webmaster anlegen, Domain verifizieren

### Session 3 (Launch-Tag)
1. PasswordGate raus (oder nur `/bewerten` schützen, falls Editor-Bereich)
2. `robots.txt` öffnen, `noindex` entfernen
3. Sitemap in Search Console einreichen
4. Erste 50 Bewertungen aus Unigruppen sammeln

### Session 4 (Monat 2+)
1. Migration zu Next.js App Router (Vercel-nativ)
2. Programmatic Pages: `/klinik/[slug]`, `/stadt/[slug]`, `/fachrichtung/[slug]`
3. Schema.org `Review` + `AggregateRating` JSON-LD
4. Erster Blog-Artikel

---

## 7. Erfolgs-KPIs (3 / 6 / 12 Monate nach Launch)

| Metrik | 3 Mon | 6 Mon | 12 Mon |
|---|---|---|---|
| Indexierte Seiten (GSC) | 50 | 500 | 2.000 |
| Organische Klicks/Monat | 50 | 500 | 3.000 |
| Bewertungen total | 100 | 500 | 2.000 |
| Backlinks (Ahrefs) | 5 | 20 | 50 |
| Brand-Suchen/Monat | 30 | 200 | 1.000 |

Realistisch + ehrgeizig für Side-Project. Anpassen, sobald erste Daten da sind.

---

## 8. Wichtige Notizen für künftige Sessions

- **PasswordGate-Status prüfen** vor jeder SEO-Änderung. Solange aktiv: `noindex`.
- **Schema.org JSON-LD ist kritisch** — ohne `AggregateRating` gibt es keine Sterne-Snippets, das ist der größte CTR-Hebel in Bewertungs-Nischen.
- **Vite vs. Next.js**: Pre-Rendering reicht für Phase 1+2. Erst für Phase 3 (programmatic SEO mit dynamischen Slugs) ist Next.js nötig.
- **YMYL-Faktor**: Medizin-Nähe → E-E-A-T (Expertise, Authoritativeness, Trust) zählt. Impressum, Datenschutz, AGB existieren bereits ✓. Über-mich/Über-uns mit echten Verantwortlichen ergänzen.
- **Anonymität vs. Trust**: Bewertungen sind anonym (gut für Bewerter), aber Plattform muss Trust signalisieren (Impressum, Kontakt, Moderationsregeln transparent).
