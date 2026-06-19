# Feedback & Spec: Bewertungslogik — Assistenzarzt-Ranking

> Stand: 2026-06-19 · verifiziert gegen Code + Testlauf (`npx vitest run`: 4/12 Tests rot)
> Bewertung: Grundidee gut, aber **noch nicht produktiv belastbar** für ein Ranking.

---

## Was aktuell gut ist

- Fünf verständliche Dimensionen mit expliziten Gewichten.
- Eine zentrale `overallScore()` wird von Ranking, Statistiken und Profilen verwendet.
- `dokumentationsaufwand` ist korrekt gepolt (Slider „1 = Extreme Admin-Last … 10 = Minimale Doku" → high = gut).
- Nachvollziehbare Gewichtung:

| Dimension | Gewicht |
|---|---|
| Weiterbildung | 30 % |
| Work-Life-Balance | 25 % |
| Ausbildungsstruktur | 20 % |
| Teamkultur | 15 % |
| Infrastruktur | 10 % |

---

## 🔴 Echte Bugs (verifiziert)

### 1. `schichtsystem` vs. `dienstsystem` — Dienstsystem ohne Wirkung
- Formular speichert Key `schichtsystem`, Werte `2-Schicht` / `3-Schicht` / `24h-Dienste`.
- Score liest `dienstsystem` und erwartet `12h` / `24h`.
- Folge: Dienstsystem ist bei **echten** Bewertungen immer neutral (5). `2-Schicht` und `24h-Dienste` ändern den Score nicht.
- Seed-Daten und Tests verwenden ebenfalls noch das alte Schema. Formular, Score, Seeds und Tests sind nicht synchron.
- Stellen: [criteria.js:8](../src/data/criteria.js#L8) vs. [calculations.js:17](../src/utils/calculations.js#L17).

### 2. Nachtdienst-Begleitung wird falsch ausgewertet
- Formular liefert einen Slider 1–10. Berechnung behandelt den Wert via `bool()` als Boolean.
- Eine Zahl ist weder `true` noch `false` → immer Default 5. Sliderwert 1 und 10 ergeben denselben Teilscore.
- Betrifft `overallScore` sowie mehrere Radarvarianten.

### 3. Score-Bänder widersprüchlich
- Farbe: Grün ab 7,5; Gelb ab 5,0.
- Label: „Gut" ab 6,5; „Ausgezeichnet" ab 8.
- Dokumentation (CLAUDE.md): Grün ab 7.
- Folge: 7,0 ist gleichzeitig gelb **und** „Gut". Grenzen müssen aus einer gemeinsamen zentralen Definition stammen.

### 4. Score nicht zuverlässig auf 0–10 begrenzt
- UI zeigt Min/Max, erzwingt sie in der Berechnung aber nicht.
- Manipulierte/fehlerhafte Daten erzeugen Scores wie **−32,1** oder **46,3**. Die dokumentierte Skala 0–10 ist nicht garantiert.

### 5. Speichern meldet immer Erfolg
- `addRating()` wird nicht abgewartet ([RatingForm.jsx:23](../src/components/RatingForm/RatingForm.jsx#L23)); `handleSubmit` ist nicht `async`.
- Bestätigungsseite erscheint sofort — auch wenn Supabase den Insert ablehnt / `null` zurückgibt.

### 6. Gemischte alte und neue Daten werden falsch aggregiert
- Alte Seed-Daten: `nachtdienstBegleitung` als Boolean; neue Bewertungen: als Zahl.
- Profilaggregation bestimmt den Typ anhand des **ersten** Datensatzes → bei Mischdaten falsche Prozent-/Mittelwerte.

---

## 🟡 Konzeptionelle Schwächen

### „Keine Angabe" = 5/10
- Fast alle fehlenden Werte fallen via `?? 5` / `bool()`-Default auf 5 zurück ([calculations.js:8](../src/utils/calculations.js#L8)).
- Eine komplett unbeantwortete Bewertung erzielt exakt **5,0**.
- Folgen: künstliche Mittelwertbildung, geringe Trennschärfe, „unbekannt" nicht von „durchschnittlich" unterscheidbar.
- Fix: fehlende Werte aus dem Dimensionsmittel ausschließen; Mindestzahl beantworteter Kernfragen verlangen.

### Kein Mindest-Count / keine Bayes-Glättung
- Eine Klinik mit einer einzigen 10/10 kann das Ranking anführen.
- Empfehlung: offizielles Ranking erst ab ≥ 3 Bewertungen; Anzahl prominent anzeigen; Bayes-Shrinkage zum Globalmittel mit Prior ~3–5.

### Mitarbeitergespräche zu hart
- `Anzahl × 2,5`: 0 → 0; 1 → 2,5; 2 → 5; 4 → 10.
- Formularstandard (1/Jahr) zieht die Ausbildungsstruktur systematisch runter. 1/Jahr sollte eher ~6–7 entsprechen.

### Weiterbildungsbefugnis fragwürdig skaliert
- `wbeJahre / 12`: 5 J → 4,2/10; 6 J → 5/10; erst 12 J → 10/10.
- Sinnvoller: Anteil der für die Fachrichtung benötigten Weiterbildung, oder Kategorie vollständig/teilweise/nicht vorhanden.

### Viele erhobene Felder beeinflussen den Score nicht
- Nicht gewertet: tatsächliche Arbeitszeiten, Überstundenausgleich, Abteilungsgröße, Personalschlüssel, OPs/Monat, Lehrtätigkeit & Freistellung, Schwangerschafts-Policy.
- Gerade Arbeitszeit und Personalschlüssel wären starke Belastungsindikatoren.
- Nicht gewertete Angaben entweder bewusst als „nur deskriptiv" markieren oder aus dem Pflichtfluss entfernen.

### Schwangerschaft redundant abgefragt
- Policy-Enum **und** Boolean zur Familienfreundlichkeit; nur der Boolean fließt ein. Zu einer klaren, nicht-redundanten Bewertung zusammenführen.

### Ranking und Radar gruppieren Kliniken unterschiedlich
- Ranking gruppiert exakt nach Name; Radar nutzt Fuzzy Matching.
- Schreibvarianten können im Ranking getrennt, im Vergleich aber zusammengefasst werden.

### Vierfach duplizierte Bewertungslogik
- `overallScore`, `radarData`, `radarDataUnified`, `radarDataBySpecialty` implementieren ähnliche Dimensionen separat — Achsen/Auswertung driften bereits.
- Dimensionsextraktoren einmal zentral definieren und von Gesamtscore, Radar, Profil und Ranking gemeinsam nutzen.

### Tests bilden das aktuelle Modell nicht ab
- 4/12 Tests rot; erwarten teils noch `dienstsystem`, ignorieren `CRITERIA_MEDICAL` (`ALL_CRITERIA_KEYS` erwartet 15 statt 29).
- Fehlende Eigenschaftstests:
  - Score immer in [0, 10].
  - Bessere Eingaben verschlechtern den Score nicht (Monotonie).
  - Fehlende Angaben erzeugen keinen künstlichen Mittelwert.
  - Alte und neue Daten werden identisch normalisiert.
  - Farbe und Label nutzen dieselben Schwellen.

---

## Empfohlene Reihenfolge

1. Datenmodell versionieren und Legacy-Daten beim Lesen normalisieren.
2. Feldnamen und Feldtypen reparieren (`schichtsystem`, `nachtdienstBegleitung`).
3. Fehlende Werte korrekt behandeln (`null` = unbeantwortet, aus Mittel ausschließen).
4. Gemeinsame Dimensionsfunktionen erstellen (Dedup von Score + Radar).
5. Eingaben zentral validieren und Score auf 0–10 begrenzen.
6. Gewichtung fachlich neu kalibrieren (Mitarbeitergespräche, `wbeJahre`).
7. Ranking mit Mindestanzahl / Bayes-Glättung absichern.
8. Speicherfehler korrekt anzeigen (`await` + Fehlerpfad in der UI).
9. Tests vollständig auf das neue Modell umstellen + Eigenschaftstests ergänzen.
