# Supabase Setup-Anleitung

Diese Datei führt dich durch die Einrichtung der Datenbank, damit die App funktioniert.

## Schritt 1: Supabase Account erstellen

1. Gehe zu https://supabase.com
2. Klicke auf "Sign Up"
3. Registriere dich mit Email/GitHub/Google
4. Verifiziere deine Email

## Schritt 2: Neues Projekt erstellen

1. Nach dem Login: **"New Project"** klicken
2. Wähle einen **Project Name** (z.B. "assistenzarzt-ranking")
3. Wähle eine **Region** (am nächsten zu Deutschland: `eu-central-1`)
4. Setze ein **Database Password** (sicher!)
5. Klicke **"Create new project"**
6. Warte ~2 Minuten auf Projekt-Setup

## Schritt 3: Database Schema ausführen

1. Im Supabase Dashboard: Linkes Menü → **"SQL Editor"**
2. Klicke **"New Query"**
3. Öffne die Datei `scripts/setup-db.sql` in deinem Editor
4. Kopiere den gesamten Inhalt
5. Füge es in das Supabase SQL Editor Fenster ein
6. Klicke **"Run"** (oder Ctrl+Enter)
7. Bestätigung: "Executed successfully"

**Hinweis:** Wenn eine Fehlermeldung "relation 'ratings' already exists" erscheint, ist alles OK — die Tabelle wurde bereits erstellt.

## Schritt 4: API Keys kopieren

1. Im Supabase Dashboard: Linkes Menü → **"Settings"**
2. Gehe zu **"API"**
3. Du siehst zwei Keys:
   - **Project URL** (z.B. `https://xxxxx.supabase.co`)
   - **Anon Key** (lange Zeichenkette, beginnt mit `eyJ...`)

⚠️ **WICHTIG:** Kopiere die **Anon Key**, NICHT die "Service Role Key"!

## Schritt 5: `.env.local` erstellen

1. Öffne dein Projekt im Editor
2. Kopiere die Datei `.env.local.example` und nenne sie `.env.local`
3. Öffne `.env.local` und fülle die Werte ein:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_KEY=eyJ...
```

**Hinweis:** Die URL endet mit `.supabase.co` — füge keine `/` am Ende hinzu.

## Schritt 6: Dev Server starten

```bash
npm run dev
```

Öffne http://localhost:5173 im Browser.

## Schritt 7: Testen

1. Gehe zum **"Bewertung"** Tab
2. Wähle eine Klinik (z.B. "Charité – Universitätsmedizin Berlin")
3. Wähle ein Land (DE, AT oder CH)
4. Fülle mindestens die Pflicht-Felder aus
5. Klicke **"Absenden"**
6. Du solltest eine "Vielen Dank" Seite sehen
7. Gehe zu **"Ranking"** oder **"Karte"** — deine Bewertung sollte dort erscheinen!

## Schritt 8: In Supabase Dashboard prüfen

1. Gehe zu Supabase → **"Table Editor"**
2. Klicke auf die **"ratings"** Tabelle
3. Du solltest deine Einträge sehen!

## Häufige Fehler

| Fehler | Lösung |
|--------|--------|
| `Missing VITE_SUPABASE_URL` | `.env.local` Datei erstellen und Keys einfügen |
| `401 Unauthorized` | Anon Key ist falsch/leer — in Supabase Settings überprüfen |
| `relation 'ratings' does not exist` | SQL Schema noch nicht ausgeführt — siehe Schritt 3 |
| Leere Charts/Karte | Noch keine Bewertungen eingegeben — mindestens eine eintragen |

## Fertig!

Wenn alles funktioniert, kannst du:
- Weitere Bewertungen einreichen
- Rankings in Charts ansehen
- Kliniken vergleichen (Radar-Chart)
- DACH-Karte erkunden (mit Red Hover auf DE/AT/CH)

Fragen? Check die Browser-Console auf Errors (F12 / DevTools).
