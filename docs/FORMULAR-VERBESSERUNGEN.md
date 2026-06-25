# Formular-Verbesserungen — Analyse & Priorisierung

> Übergabe-Dokument auf Basis von 12 externen Vorschlägen.
> Analyse gegen Ist-Code: StepCriteria.jsx, StepMedical.jsx, StepNiceToHave.jsx, calculations.js.
> Stand: 2026-06-25. In Produktion existieren mindestens zwei Bewertungen
> (Klinik Nauen und Auguste-Viktoria-Klinikum). Schema-Änderungen sind weiterhin
> gut machbar, benötigen aber einen Legacy-Adapter und eine neue Schema-Version.

> **Umsetzungsstatus 2026-06-25:** Schnellformular v3 ist lokal implementiert.
> Formular, Score, Legacy-Lesen, API-Validierung, Anzeigen und Tests sind angepasst.
> Vor dem Deploy muss `scripts/migrate-rating-v3.sql` einmal in Supabase ausgeführt
> werden.

---

## Fachliches Gesamturteil

Die Richtung stimmt. Der Fragebogen deckt die für Assistenzärzt*innen entscheidenden
Bereiche ab, mehrere Fragen vermischen aber objektive Fakten, subjektives Erleben und
Qualitätsbewertung. Dadurch entstehen scheinbar präzise Scores, die medizinisch nicht
immer belastbar sind.

**Empfehlung:** zweistufig umsetzen.

1. Zuerst offensichtliche Mess- und UX-Fehler ohne großen Formularausbau beheben.
2. Danach ein Kriterien-Schema v3 mit fachlich neu formulierten Fragen einführen.

Bei v3 dürfen alte Zahlenwerte nicht stillschweigend mit einer neuen Bedeutung versehen
werden. Besonders `autonomie`, `nachtdienstBegleitung`, `wbeJahre`, `schichtsystem` und
`diensteProMonat` brauchen entweder neue Feldnamen oder eine versionsabhängige Auswertung.

---

## Wichtige Code-Fakten (vor jeder Umsetzung lesen)

- Score-Quelle: `SCORE_FIELDS` in `src/utils/calculations.js:46-65`.
- Folgende Felder sind **nicht** im Score (nur Anzeige/Info): `arbeitszeiten*`, `opsProMonat`, `abteilungsgroesse`, `personalschluessel`, `schwangerschaft` (Enum, aber nicht Bool).
- Jede Slider→Enum- oder Bool→Enum-Änderung ist ein Schema-Bruch → `normalizeCriteria` + `SCORE_FIELDS` + Legacy-Adapter müssen mit.
- WBE-Score: `scoreWbe = jahre / 6 * 10`, Konstante hardkodiert auf 6 Jahre (`calculations.js:10`).
- Parkplatz-Gewicht: `boolScore(true=10, false=5)` → 50% der Infrastruktur-Dimension = 5% des Gesamtscores.
- Neue Kriterien müssen zusätzlich in `scripts/harden-db.sql` erlaubt und mit passenden
  DB-Constraints abgesichert werden. Sonst lehnt Supabase neue Bewertungen trotz
  funktionierendem Frontend ab.
- `api/_lib/validateRating.js` übernimmt Definitionen aus `criteria.js`, benötigt für
  neue Feldtypen wie Multi-Select aber zusätzliche Validierungslogik.
- Klinikprofile und Detailberichte aggregieren die Kriterien anhand ihres Typs. Enums
  werden derzeit nur als häufigster Wert angezeigt; Mehrfachauswahl und differenzierte
  Skalen benötigen eine eigene Darstellung.
- Texte auf Startseite und FAQ beschreiben die Score-Dimensionen und müssen bei einer
  Änderung der Score-Logik mit aktualisiert werden.

---

## Priorisierte Aufgabenliste

Die folgende Liste dokumentiert die ursprüngliche Feld-für-Feld-Analyse. Für die
tatsächliche Umsetzung gilt die weiter unten festgelegte **Produktentscheidung:
Schnellformular v3**. Wo sich beide Abschnitte widersprechen, hat das Schnellformular
Vorrang.

### Prio 1 — Jetzt (günstig, hoher Hebel)

| ID | Betroffene Dateien | Aufgabe |
|----|-------------------|---------|
| P1-1 | StepCriteria.jsx, StepMedical.jsx, StepNiceToHave.jsx | **Slider-Bug fixen (#4):** `value ?? 5` zeigt „5" an, speichert `null`. Nutzer glaubt, er hat geantwortet. Fix: unbeantworteten Zustand deutlich anzeigen und „Nicht beurteilbar" anbieten. Mittelfristig sind beschriftete 5-Punkt-Auswahlfelder zuverlässiger als ein nativer Slider, der technisch nie wirklich leer sein kann. |
| P1-2 | calculations.js (`SCORE_FIELDS`, `DIMENSION_DEFINITIONS`) | **Parkplatz aus Score entfernen (#12):** Als Info behalten, nicht scoren. Achtung: Danach würde `dokumentationsaufwand` allein die gesamte Infrastruktur-Dimension und damit 10% des Gesamtscores bestimmen. Deshalb Infrastruktur vorübergehend geringer gewichten/aussetzen oder zuerst durch IT-System, Stationsassistenz und administrative Entlastung ergänzen. |
| P1-3 | StepCriteria.jsx, criteria.js (`DEFAULT_CRITERIA`) | **Arbeitszeit-Defaults leeren (#2):** `DEFAULT_CRITERIA.arbeitszeitenVon/Bis` auf `null` setzen. Hint hinzufügen: „tatsächliche Arbeitszeit inkl. Doku an einem normalen Stationstag". |
| P1-4 | calculations.js (`scoreWbe`, `REQUIRED_WBE_YEARS_DEFAULT`), StepMedical.jsx | **WBE-Ermächtigung aus dem Score entfernen (#6):** Die formale Ermächtigungsdauer als Information behalten oder später aus offiziellen Quellen beziehen. Als getrennte Erfahrungsfrage ergänzen: „Ist die Weiterbildung in Regelzeit realistisch abschließbar?" (ja / überwiegend / nur mit externen Rotationen / eher nicht / nicht beurteilbar). Eine pauschale Fachrichtungstabelle reicht für DACH nicht zuverlässig aus. |
| P1-5 | calculations.js, StepCriteria.jsx | **Schichtsystem vorläufig aus dem Score entfernen:** 2-Schicht, 3-Schicht und 24h-Dienst sind keine vollständigen, gegenseitig ausschließenden Qualitätsstufen. Das Feld außerdem zusammen mit `diensteProMonat` und Work-Life zu scoren führt zu Mehrfachbestrafung derselben Belastung. Bis zur differenzierten Erfassung nur informativ anzeigen. |
| P1-6 | RatingForm.jsx, alle Formularschritte | **Pflichtstatus transparent machen:** Vor dem Absenden anzeigen, wie viele der fünf erforderlichen Kernfragen beantwortet sind. Pflicht-, optionale und „nicht beurteilbare" Fragen klar kennzeichnen. |

### Prio 2 — Geplanter Schema-v3-Umbau

| ID | Betroffene Dateien | Aufgabe |
|----|-------------------|---------|
| P2-1 | StepMedical.jsx, criteria.js, calculations.js | **Autonomie-Semantik (#1):** Neue Frage: „Wie gut passt deine Selbstständigkeit zu deinem Weiterbildungsstand?" 1=häufig überfordert/allein gelassen, 10=angemessene Eigenständigkeit mit zuverlässiger Supervision. Wegen der neuen Bedeutung als neues v3-Feld speichern; alte `autonomie`-Werte nicht direkt damit mitteln. |
| P2-2 | StepMedical.jsx, criteria.js, calculations.js | **Nachtdienst aufspalten (#5):** Kompakte Kernfragen: Hintergrund zuverlässig erreichbar, kommt bei Bedarf zeitnah und subjektiv sichere Betreuung entsprechend dem Weiterbildungsstand. Antwort: immer / meistens / selten / nie / kein Nachtdienst / nicht beurteilbar. „OA im Haus" separat nur als Strukturinformation behandeln, nicht automatisch als Qualitätsurteil. |
| P2-3 | StepCriteria.jsx, criteria.js, calculations.js | **Dienste differenzieren (#3):** Dienstart zunächst auswählen und nur passende Folgefragen zeigen: Nachtdienste, 24h-Dienste, Wochenendtage und Rufbereitschaften pro Monat sowie tatsächlicher Freizeitausgleich. Keine pauschale Addition ohne empirisch begründete Gewichtung; zunächst transparent getrennt anzeigen und Gesamt-Work-Life subjektiv scoren. |
| P2-4 | StepHospital.jsx, criteria.js | **Weiterbildungsstand ergänzen:** Weiterbildungsjahr zum Bewertungszeitpunkt als Pflicht-Kontextfeld erfassen. Ohne diesen Kontext sind Autonomie, Eingriffszahlen und Nachtbetreuung kaum fair interpretierbar. |
| P2-5 | StepNiceToHave.jsx, criteria.js, calculations.js | **Teamqualität präzisieren:** Statt nur „toxisch bis exzellent" drei kurze Aussagen zu gegenseitiger Unterstützung, Fehlerkultur und respektvoller Führung verwenden. Daraus einen Team-Subscore bilden. |

### Prio 3 — Optional / später (einzeln gegen Formular-Länge abwägen)

| ID | Vorschlag | Aufwand | Anmerkung |
|----|-----------|---------|-----------|
| P3-1 | Rotationsplan (#7): Ja/Nein → 5-Stufen-Enum (vorhanden+eingehalten / vorhanden+verzögert / informell / keiner / unklar) | Mittel | `boolScore(true=10,false=3)` belohnt Existenz unabhängig von Einhaltung |
| P3-2 | Einarbeitung in den ersten Wochen | Mittel | Hoher praktischer Nutzen; Skala zu strukturiertem Einarbeitungsplan, festen Ansprechpartnern und geschützter Einarbeitungszeit |
| P3-3 | OP-Zahlen (#8): opsProMonat-Differenzierung assistiert vs. selbst; Prozentbereiche für hauptoperateurAnteil | Mittel | `opsProMonat` ist nicht im Score; gate gegen Service-Job-Falle ist teilweise schon in calculations.js:368-384 |
| P3-4 | Schwer beantwortbare Fragen (#11): „Betten pro Arzt" → „Patienten pro typischem Tag" mit Bereichen (1-8/9-12/13-16/>16) | Gering | `personalschluessel` ist nicht im Score; reine Datenqualität |
| P3-5 | Schwangerschaft (#10): Enum+Bool → eine differenzierte Multi-Frage (Gefährdungsbeurteilung, Anpassung, kein Nachteil…) | Mittel | Enum wird nicht gescort; Bool (`schwangerschaftFamilienfreundlich`) ja |

### Zusatzfelder (Formular-Bloat-Check vor Umsetzung)

Grundsätzlich sinnvoll, aber jedes Feld senkt Abschlussquote. Reihenfolge nach Nutzen:

1. **WB-Jahr zum Bewertungszeitpunkt** — nötig für Interpretation von Autonomie und OP-Zahlen. Hoher Mehrwert.
2. **Beschäftigungsumfang** (Vollzeit/Teilzeit) — moderate Relevanz.
3. **Dauer in der Abteilung** — Kontext für Verlässlichkeit der Angaben.
4. **Einarbeitung erste Wochen** — fehlende Dimension, hoher Informationswert.
5. **Psychologische Unterstützung nach belastenden Ereignissen** — wichtig, aber sensibel.
6. **Diskriminierungserfahrungen** — freiwillig, besonders geschützt. **Nicht scoren.**

---

## Was NICHT umgesetzt werden sollte

- Alle 12 Vorschläge auf einmal → killt Formular-Abschlussquote und Vergleichbarkeit der Bestandsdaten.
- Die Ermächtigungsdauer je Fachrichtung/Land mit einer kleinen statischen Tabelle
  „korrigieren". Weiterbildungsordnungen und Teilbefugnisse sind dafür zu heterogen.
- Alte `autonomie`- oder `nachtdienstBegleitung`-Werte nachträglich so behandeln, als
  wären bereits die neuen Fragen gestellt worden.
- Dienstbelastung aus verschiedenen Dienstarten sofort zu einem vermeintlich exakten
  Score verrechnen. Zunächst getrennt ausweisen und echte Daten sammeln.
- Vorschlag #11 bzgl. Abteilungsgröße/Betten hat geringere Priorität, weil die Felder
  nicht im Score liegen. „Betten pro Arzt" sollte bei Gelegenheit trotzdem durch
  „typisch selbst betreute Patient*innen" mit Wertebereichen ersetzt werden.

---

## Skizze Slider-Bug-Fix (P1-1)

```jsx
// Vorher (buggy): zeigt 5, speichert null
value={value ?? 5}
// ...
{value ?? 5}/10

// Nachher: kein Default, klare Not-answered-State
value={value ?? 5}  // muss für input[type=range] bleiben (Browser-Pflicht)
// aber: Anzeige trennen
<span>{value != null ? `${value}/10` : '—'}</span>
// onChange setzt den gespeicherten Wert und markiert die Frage damit als beantwortet
```

Ein zusätzlicher lokaler `answered`-State ist nicht zwingend nötig: `value !== null`
ist bereits der gespeicherte Antwortstatus. Das eigentliche Problem ist, dass ein
nativer Range-Input optisch immer einen Thumb besitzt. Sauberste Lösung:

1. Vor der ersten Auswahl nur Skalenbeschreibung und Button „Wert auswählen" zeigen.
2. Danach Slider oder besser fünf beschriftete Auswahlstufen anzeigen.
3. Separaten Button „Nicht beurteilbar" anbieten, der den Wert auf `null` setzt.

Nur die Zahl durch „—" zu ersetzen reduziert das Problem, beseitigt die optisch
vorbelegte Mittelposition aber nicht vollständig.

---

## Offene Fragen vor Prio-2-Umsetzung

- [ ] Welche der mindestens zwei Prod-Bewertungen enthalten `autonomie`,
  `nachtdienstBegleitung`, `wbeJahre`, `schichtsystem` oder `diensteProMonat`?
- [ ] Sollen die zwei bestehenden Bewertungen als v2 erhalten bleiben oder nach
  Rücksprache mit den Verfassern neu erfasst werden?
- [ ] Nachtdienst-Scoring: wie gewichten, wenn Abteilung keinen Nachtdienst hat? (→ `null` = N/A, nicht 0)
- [ ] Soll Infrastruktur als eigene Score-Dimension bestehen bleiben? Falls ja:
  Welche mindestens drei klinikübergreifend fairen Kriterien sollen sie bilden?

---

## Schlank-Strategie: 90-Sekunden-Pfad

### Leitsatz

**Pflicht = was gescort wird und in <10 s ehrlich beantwortbar ist.** Alles andere optional.

Der Score braucht nur 5 beantwortete Kernfragen (`MIN_ANSWERED_CORE_CRITERIA = 5`) und nutzt ausschließlich `SCORE_FIELDS`. Trotzdem fragt das Formular aktuell ~35 Felder ab. Diese Lücke ist der Speck.

### Felder raus oder optional — weil sie nichts zum Score beitragen

| Feld | Status | Empfehlung |
|---|---|---|
| `arbeitszeitenVon/Bis` | nicht gescort, schwer korrekt | **optional** (oder ganz raus) |
| `abteilungsgroesse` | nicht gescort, schwer schätzbar | **raus** |
| `personalschluessel` | nicht gescort, schwankt stark | **raus** oder optional |
| `opsProMonat` | nicht gescort | optional |
| `ueberstundenAusgleich` | nicht gescort | optional |
| `lehreTaetig` / `lehreFreistellung` | nicht gescort | optional |
| `rotationsplaeneText` | Freitext | optional |
| `benefits` | nicht gescort | optional |
| `parkplatz` | (ohnehin raus per P1-2) | als Info optional |

Damit fällt das Pflichtteil von ~35 auf **~12 hochsignalige Felder** — alle 5 Score-Dimensionen bleiben abgedeckt.

### Vorgeschlagene Pflicht-Kern-Fragen (~10 Felder)

| Dimension | Felder |
|---|---|
| Weiterbildung 30% | Supervision · Logbuch-Erfüllbarkeit · Autonomie |
| Work-Life 25% | Work-Life-Balance · Dienste/Monat · Urlaubsgenehmigung |
| Struktur 20% | Rotationsplan · Fortbildung (Freistellung) |
| Teamkultur 15% | Team-Atmosphäre · Nachtdienst-Begleitung |

Das ergibt bereits einen **gültigen Score**. Absenden möglich ohne einen einzigen optionalen Block.

### Umsetzung ohne Score-Umbau

Nicht-Kern-Felder in den drei Step-Dateien in einen `<details>`/Toggle-Block verschieben. Kein Score-Umbau nötig, nur Layout. Günstigster Speck-Schnitt.

### Konsequenz für die 12 Vorschläge

- **#4, #12, #6, #2** — kosten keine Formularlänge, bleiben. ✅
- **#3 (Dienste 1→4 Felder) und #5 (Nachtdienst 1→4 Fragen)** — widersprechen dem Ziel frontal. Wenn schlank gewinnt: als optionale Folgefragen hinter dem Kern-Slider, nicht als Pflicht-Ersatz.
- **Zusatzfelder** — nur WB-Jahr in den Kern; der Rest optional.

---

## Produktentscheidung: Schnellformular v3

Die oben beschriebene Reduktion auf etwa zehn alte Score-Felder eignet sich als
kurzfristiger Zwischenschritt. Für das eigentliche v3-Formular ist sie aber nicht
konsequent genug: Nutzer*innen müssten weiterhin technische Einzelangaben beantworten,
obwohl sechs verständliche Gesamturteile für einen ersten belastbaren Vergleich genügen.

### Ziel

- regulärer Pfad in **90 bis 120 Sekunden**
- **3 Schritte** statt vier Eingabeschritte
- keine Anmeldung
- keine vorausgewählten Antworten
- sechs einheitliche 5-Punkt-Fragen
- Veröffentlichung möglich, sobald fünf der sechs Kernfragen beantwortet wurden
- Detailangaben vollständig optional

### Schritt 1 — Arbeitsplatz und Kontext

Pflicht:

1. Klinik per Suche; Stadt, Region und Land automatisch übernehmen
2. Fachrichtung
3. Weiterbildungsjahr zum Bewertungszeitpunkt
4. Zeitraum vereinfacht auswählen: aktuell / letztes Jahr / früher

Nur bei einer nicht eindeutig gefundenen Klinik werden Ort, Region und Land zusätzlich
abgefragt. `yearFrom` und `yearTo` können intern weiterhin aus der vereinfachten Auswahl
gebildet werden.

### Schritt 2 — sechs Kernfragen

Einheitliche Antworten:

`sehr schlecht` · `eher schlecht` · `mittel` · `eher gut` · `sehr gut` ·
`nicht beurteilbar`

1. **Weiterbildungsziele:** „Konntest du die vorgesehenen Weiterbildungsinhalte und
   Logbuchziele erreichen?"
2. **Supervision:** „Wie zuverlässig war fachärztliche oder oberärztliche Unterstützung
   verfügbar?"
3. **Passende Selbstständigkeit:** „Wie gut passte deine Selbstständigkeit zu deinem
   Weiterbildungsstand?"
4. **Arbeitsbelastung:** „Wie gut waren Arbeitszeit, Dienste und Erholung insgesamt
   vereinbar?"
5. **Team und Führung:** „Wie respektvoll und unterstützend waren Team und
   Vorgesetzte?"
6. **Ausbildungsstruktur:** „Wie zuverlässig wurden Einarbeitung, Rotationen und
   Fortbildung umgesetzt?"

Hinweis: Die Fragen 5 und 6 bündeln jeweils mehrere Aspekte. Das ist für den schnellen
Kernpfad bewusst akzeptiert. Bei genügend Bewertungen kann später geprüft werden, ob
Team und Führung beziehungsweise Einarbeitung und Rotation getrennt werden müssen.

### Schritt 3 — Empfehlung und Veröffentlichung

Pflicht:

- „Würdest du diese Abteilung für die Weiterbildung empfehlen?"
  (`ja` / `mit Einschränkungen` / `nein`)
- Bot-Schutz

Optional:

- Kommentar

Der Kommentar erhält den Hinweis: keine Namen, Patientendaten oder identifizierbaren
Einzelfälle nennen.

### Optionale Details — erst nach Nutzungsdaten

Nur bei Bedarf und möglichst konditional anzeigen:

- Dienstarten und Häufigkeit
- tatsächliche Arbeitszeit und Überstunden
- Überstundenausgleich
- OP-/Interventionsanteil bei prozeduralen Fachrichtungen
- Nachtbetreuung
- Familienfreundlichkeit
- IT und administrative Entlastung
- typische Zahl selbst betreuter Patient*innen

Diese Angaben sind bewusst nicht Teil des ersten v3-Releases. Falls sie später ergänzt
werden, dürfen sie weder die Veröffentlichung blockieren noch zur Erfüllung der fünf
Kernfragen zählen.

### Score v3

Die sechs Kernfragen bilden allein den öffentlichen Score. Zum Start werden sie
**gleich gewichtet**:

| Kernbereich | Gewicht |
|---|---:|
| Weiterbildungsziele | 1/6 |
| Supervision | 1/6 |
| passende Selbstständigkeit | 1/6 |
| Arbeitsbelastung | 1/6 |
| Team und Führung | 1/6 |
| Ausbildungsstruktur | 1/6 |

`nicht beurteilbar` wird als `null` behandelt. Der Mittelwert wird nur über
beantwortete Kernfragen gebildet. Mindestens fünf beantwortete Kernfragen bleiben
Voraussetzung für einen gültigen Score.

Die Antwortstufen werden intern als 1 bis 5 gespeichert. Für die bestehende
0-bis-10-Darstellung wird der Mittelwert transparent mit 2 multipliziert. Dadurch
entstehen keine künstlich komplizierten Einzelpunkt-Mappings.

Eine unterschiedliche Gewichtung wäre fachlich denkbar, ist ohne Nutzerdaten oder
validierte Befragungsmethodik aber zunächst willkürlich. Sie sollte erst nach genügend
v3-Bewertungen und einer dokumentierten Entscheidung eingeführt werden.

Die Empfehlungsfrage wird separat als Empfehlungsquote angezeigt und nicht in den Score
eingerechnet. Dadurch bleibt sie leicht verständlich und dient gleichzeitig als
Plausibilitätscheck für den berechneten Score.

Alte v2-Bewertungen behalten ihren damaligen Score. v2 und v3 dürfen in Detailansichten
angezeigt werden, sollten aber bis zu einer bewusst definierten Vergleichsregel nicht
unbemerkt zu einem gemeinsamen Klinikscore vermischt werden.

---

## Empfohlene Umsetzungsreihenfolge

### Phase 0 — Bestand sichern und Ziel festschreiben

1. Die zwei vorhandenen Bewertungen mit Schema-Version und Score dokumentieren.
2. Die sechs finalen Fragetexte und fünf Antwortstufen festschreiben.
3. Festlegen, dass nur der neue Kernscore gerankt wird; optionale Details sind
   ausschließlich Zusatzinformation.

**Ergebnis:** keine offene Produktentscheidung mehr während der Implementierung.

### Phase 1 — Datenmodell und Score v3

1. `CRITERIA_SCHEMA_VERSION` auf 3 erweitern; v2-Adapter erhalten.
2. Sechs neue, eindeutig benannte Kernfelder plus `weiterbildungsjahr` und
   `weiterempfehlung` definieren.
3. Score v3 ausschließlich aus den sechs Kernfeldern berechnen.
4. v2- und v3-Score explizit unterscheiden und nicht stillschweigend mischen.
5. Unit-Tests für Gewichtung, `null`, Mindestantwortzahl und Legacy-Daten schreiben.

**Ergebnis:** fachlich stabile Logik vor dem UI-Umbau.

### Phase 2 — Drei-Schritte-Formular

1. Klinik-Kontext auf vier kurze Angaben reduzieren.
2. Native Slider durch große 5-Punkt-Auswahlflächen plus „nicht beurteilbar" ersetzen.
3. Sechs Kernfragen auf einer gut scannbaren Seite oder in zwei kleinen Gruppen zeigen.
4. Empfehlung, optionalen Kommentar und Bot-Schutz in den Abschluss legen.
5. Fortschritt, „ca. 2 Minuten" und „anonym, keine Anmeldung" sichtbar machen.

**Ergebnis:** der vollständige Kernpfad ist mobil in höchstens zwei Minuten abschließbar.

### Phase 3 — Server, Datenbank und Darstellung

1. API-Validator und Allowlist für v3-Felder aktualisieren.
2. Supabase-Constraints in einer neuen Migration erweitern; das bestehende
   Hardening-Skript nicht als bereits ausgeführte Migration umschreiben.
3. Klinikprofil und Berichtdetails für 5-Punkt-Werte und Empfehlungsquote anpassen.
4. FAQ, Startseite und Score-Erklärung aktualisieren.
5. Bestehende v2-Bewertungen weiterhin lesbar anzeigen.

**Ergebnis:** sichere Speicherung und ehrliche öffentliche Darstellung.

### Phase 4 — Verifizieren und erst danach erweitern

1. Build, Unit-Tests und einen vollständigen Test-Submit prüfen.
2. Mobil prüfen: Klinik auswählen, sechs Antworten geben und veröffentlichen.
3. Optional datenschutzarm messen: Formular gestartet, Schritt erreicht, erfolgreich
   veröffentlicht; keine Antworten oder Kliniknamen in Analytics senden.
4. Erst nach realen Abbruchs- und Nutzungsdaten entscheiden, welche optionalen
   Detailfragen dauerhaft sinnvoll sind.

**Ergebnis:** weitere Felder werden durch beobachteten Nutzen begründet, nicht durch
Vollständigkeitsdrang.

### Bewusst nicht Teil des ersten v3-Releases

- vier verpflichtende Nachtdienstfragen
- vier verpflichtende Dienstart-Zähler
- detaillierte Schwangerschafts-Policy
- Parkplatz, Benefits und Abteilungsgröße
- exakter kombinierter Dienstbelastungs-Score
- neue Infrastruktur-Dimension ohne mindestens drei belastbare Kriterien
