# Feldauswahl für das Bewertungsformular

> Setze `[x]` bei allem, was im neuen Formular enthalten sein soll.
> Die Vorauswahl ist meine Empfehlung: mehr quantitative Aussagekraft, ohne wieder
> beim alten 30-Felder-Formular zu landen.

## 1. Klinik und Kontext

- [x] Klinik
- [x] Fachrichtung
- [x] Weiterbildungsjahr zum Bewertungszeitpunkt
- [x] Beginn der Tätigkeit (Jahr)
- [x] Aktuell dort beschäftigt: Ja/Nein
- [x] Ende der Tätigkeit (Jahr, nur wenn nicht mehr dort beschäftigt)
- [ ] Land manuell auswählen (nur als Fallback, Klinik soll es automatisch setzen)
- [ ] Bundesland/Kanton manuell auswählen (nur als Fallback)
- [ ] Stadt manuell eingeben (nur als Fallback)

## 2. Arbeitszeit und Dienste

- [x] Tatsächlicher Arbeitsbeginn an einem typischen Arbeitstag
- [x] Tatsächliches Arbeitsende an einem typischen Arbeitstag
- [x] Dienste pro Monat
- [x] Überstunden werden vollständig erfasst: Ja/Teilweise/Nein
- [x] Überstundenausgleich: bezahlt/Freizeit/kein Ausgleich
- [ ] Schichtsystem: 2-Schicht/3-Schicht/24-Stunden-Dienste
- [x] Nachtdienste pro Monat
- [ ] 24-Stunden-Dienste pro Monat
- [ ] Wochenendtage pro Monat
- [ ] Rufbereitschaften pro Monat
- [ ] Freizeitausgleich nach Dienst
- [x] Abteilungsgröße in Ärzt*innen
- [ ] Betten pro Arzt
- [ ] Selbst betreute Patient*innen an einem typischen Arbeitstag

## 3. Weiterbildung und klinischer Alltag

- [x] Weiterbildungsziele/Logbuch erreichbar (5 Stufen)
- [x] Qualität der Supervision (5 Stufen)
- [x] Selbstständigkeit passend zum Weiterbildungsstand (5 Stufen)
- [x] Ausbildungsstruktur: Einarbeitung, Rotationen und Fortbildung (5 Stufen)
- [ ] Rotationsplan vorhanden und praktisch eingehalten
- [x] Hintergrund nachts zuverlässig erreichbar
- [ ] Hintergrund kommt bei Bedarf zeitnah ins Haus
- [ ] Fach-/Oberarzt nachts im Haus
- [ ] Subjektiv sichere Betreuung im Nachtdienst
- [ ] Formale Weiterbildungsermächtigung in Jahren
- [ ] Mitarbeitergespräche pro Jahr
- [x] Fortbildungsfreistellung
- [x] Fortbildungskosten werden übernommen
- [x] Lehrtätigkeit vorhanden
- [x] Freistellung für Lehrtätigkeit
- [ ] Freitext zu Rotationen

## 4. Operative und interventionelle Fächer

> Nur anzeigen, wenn die gewählte Fachrichtung dazu passt.

- [x] Eigene oder assistierte Eingriffe/Interventionen pro Monat
- [x] Anteil selbst durchgeführter Eingriffe: unter 10 % / 10–25 % / 26–50 % / über 50 %
- [ ] Exakte Zahl selbst durchgeführter Eingriffe pro Monat
- [ ] Exakte Zahl nur assistierter Eingriffe pro Monat

## 5. Team, Belastung und Alltag

- [x] Arbeitsbelastung und Erholung insgesamt (5 Stufen)
- [x] Team und Führung (5 Stufen)
- [x] Urlaubsgenehmigung (5 Stufen)
- [x] Dokumentationsaufwand (5 Stufen)
- [ ] Work-Life-Balance zusätzlich als eigene Frage
- [ ] Teamatmosphäre zusätzlich als eigene Frage
- [x] Fehlerkultur als eigene Frage
- [x] Respektvolle Führung als eigene Frage
- [x] Zusammenarbeit mit der Pflege
- [x] Strukturierte Einarbeitung als eigene Frage

## 6. Familie, Infrastruktur und Extras

- [x] Schwangerschafts-Policy
- [x] Familienfreundlichkeit/Elternzeit
- [x] Parkplatz
- [x] Benefits
- [ ] IT-System/Arbeitsplatzqualität
- [ ] Stationsassistenz oder administrative Entlastung
- [ ] Psychologische Unterstützung nach belastenden Ereignissen
- [x] Diskriminierungserfahrungen

## 7. Abschluss

- [x] Würdest du die Abteilung empfehlen? Ja/Mit Einschränkungen/Nein
- [x] Kommentar (optional)
- [x] Bot-Schutz

## Zeitraum auswählen

Bitte genau eine Variante auswählen:

- [ ] Startjahr + „aktuell dort“ + Endjahr nur bei ehemaliger Tätigkeit
- [x] Zwei Felder „von Jahr“ und „bis Jahr/fortlaufend“ wie im alten Formular
- [ ] „Aktuell / letztes Jahr / früher“ wie im derzeitigen Formular

## Formularaufbau

Bitte genau eine Variante auswählen:

- [x] Vier kurze Schritte: Klinik → Zahlen/Fakten → Qualitätsfragen → Abschluss
- [ ] Drei Schritte mit Zahlen und Qualitätsfragen gemeinsam
- [ ] Kurzer Pflichtpfad und danach freiwillige Detailfragen

## Feste Designkorrekturen

Diese Punkte würde ich unabhängig von der Feldauswahl umsetzen:

- sichtbare `<legend>`-Titel entfernen; Überschriften sauber innerhalb der Box anzeigen
- keine schwebenden oder angeschnittenen Box-Titel
- einheitliche eckige Karten statt Mischung aus runden Karten und hartem Außenrahmen
- mindestens 44 px hohe Klickflächen
- mobile Antwortauswahl nicht mit fünf langen Texten in einer gequetschten Zeile
- klare Zahlen-/Einheitenanzeige direkt am Eingabefeld
- Pflicht und optional sichtbar unterscheiden
- einheitliche Abstände, Innenränder und Boxhöhen
- Zurück/Weiter-Leiste auf Mobilgeräten gleichmäßig und ohne doppelte Rahmen
- Fokuszustände nicht nur farblich, sondern auch durch Rahmen/Markierung zeigen
- Zusammenfassung der bereits gewählten Klinik und Fachrichtung auf späteren Schritten
