# GSC- und Sitemap-Checkliste

Stand: 2026-06-24

## 1. Aktueller Stand

Die Domain `https://assistenz-ranking.de` ist jetzt:

- öffentlich erreichbar
- prerendered
- indexierbar
- mit funktionierenden Sitemaps

## 2. Live-Check

Diese Befehle müssen danach positiv aussehen:

```bash
curl -I https://assistenz-ranking.de
curl -s https://assistenz-ranking.de | rg "Assistenzarzt-Ranking|TOP-KLINIK|BEWERTUNGEN"
curl -s https://assistenz-ranking.de/robots.txt
curl -s https://assistenz-ranking.de/sitemap-index.xml | sed -n '1,20p'
curl -s https://assistenz-ranking.de/sitemap.xml | sed -n '1,20p'
curl -s https://assistenz-ranking.de/sitemap-kliniken.xml | sed -n '1,20p'
```

Erwartung:

- kein `X-Robots-Tag: noindex`
- keine Private-Beta-Seite mehr
- Startseite liefert sichtbaren HTML-Inhalt
- Sitemap-Index und beide Sitemaps antworten mit XML

## 3. GSC vorbereiten

### Was schon da ist

- `robots.txt` vorhanden
- `sitemap-index.xml` vorhanden
- `sitemap.xml` vorhanden
- `sitemap-kliniken.xml` vorhanden
- `llms.txt` vorhanden
- prerenderte HTML-Seiten vorhanden

### Was noch fehlt

- Google Search Console Verifizierung

## 4. Schnellster GSC-Weg

Empfehlung: **HTML-Tag-Verifizierung**

In GSC:

1. Property `https://assistenz-ranking.de` anlegen
2. „HTML-Tag“ wählen
3. den `content`-Wert kopieren

Dann in [index.html](/Users/hermannbartels/Desktop/weiterbildung-ranking/index.html) in `<head>` einfügen:

```html
<meta name="google-site-verification" content="DEIN_TOKEN_HIER" />
```

Danach:

```bash
vercel --prod
```

## 5. Nach Verifizierung in GSC einreichen

Zuerst einreichen:

- `https://assistenz-ranking.de/sitemap-index.xml`

Optional zusätzlich:

- `https://assistenz-ranking.de/sitemap.xml`
- `https://assistenz-ranking.de/sitemap-kliniken.xml`

## 6. Was du in GSC in Woche 1 prüfen solltest

- Seitenindexierung
- „Gecrawlt – zurzeit nicht indexiert“
- Core Web Vitals
- Rich Results / strukturierte Daten
- einzelne Klinikseiten per URL-Prüfung

## 7. Gute Test-URLs für URL-Prüfung

- `https://assistenz-ranking.de/`
- `https://assistenz-ranking.de/berichte`
- `https://assistenz-ranking.de/klinik/klinik-nauen`
- `https://assistenz-ranking.de/klinik/auguste-viktoria-klinikum`
- `https://assistenz-ranking.de/stadt/berlin`
- `https://assistenz-ranking.de/fachrichtung/urologie`
