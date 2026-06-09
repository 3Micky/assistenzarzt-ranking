# Handover: Assistenzarzt-Ranking

> Letzte Session: 2026-06-09
> Branch: `main` | Commit: siehe unten
> Deploy: Vercel auto-deploy aktiv (assistenz-ranking.de)

---

## Was diese Session erreicht wurde

### iOS App (Capacitor) — vollständig integriert

1. **Capacitor installiert** — `@capacitor/core`, `@capacitor/ios`, `@capacitor/status-bar`, `@capacitor/splash-screen`, `@capacitor/cli` (dev)
2. **`capacitor.config.ts`** — erstellt mit App-ID `de.assistenzranking.app`, StatusBar dark (#0a0a0a), SplashScreen beige (#f5f0e8)
3. **`ios/` Xcode-Projekt** — vollständig via `npx cap add ios` generiert, iOS 15.0 Deployment Target
4. **`index.html`** — `viewport-fit=cover` + Apple-Meta-Tags (web-app-capable, status-bar-style, format-detection)
5. **`src/index.css`** — iOS safe-area CSS-Variablen (`--sat/--sar/--sab/--sal`), `body` padding-top/bottom, `-webkit-tap-highlight-color: transparent`
6. **`src/main.jsx`** — Capacitor StatusBar-Init bei `isNativePlatform()` (dark style, #0a0a0a Hintergrund)
7. **`src/components/PasswordGate.jsx`** — `VITE_PUBLIC_LAUNCH=true` bypassed Gate komplett (für Production Build)
8. **`.env.production`** — `VITE_PUBLIC_LAUNCH=true` (App Store / TestFlight: Gate deaktiviert)
9. **`.env.development`** — `VITE_PUBLIC_LAUNCH=false` (lokale Dev: Gate aktiv)
10. **App-Icon + Splash** — `AppIcon-512@2x.png` (1024×1024) + 3× `splash-2732x2732.png` aus Logo SVG generiert (beige Hintergrund, kein Alpha-Kanal)
11. **Build + Sync** — `npm run build` ✓ + `npx cap sync ios` ✓

### Xcode-Workflow (ab jetzt)

```bash
# Nach jeder Code-Änderung:
npm run build && npx cap sync ios

# Xcode öffnen:
npx cap open ios
# → Simulator: ▶ Run
# → TestFlight: Product → Archive → Distribute App
```

---

## Offene Punkte / Bekannte Probleme

| Problem | Priorität | Status |
|---|---|---|
| **Apple Developer Account** ($99/Jahr) registrieren | **KRITISCH** | Muss vor TestFlight/App Store. → developer.apple.com |
| **App Store Connect** — neue App anlegen mit Bundle ID `de.assistenzranking.app` | **KRITISCH** | Nach Developer Account |
| **PasswordGate** noch aktiv auf Website | **KRITISCH** | Blockiert Google Indexierung. Passwort: `be100aware.now` |
| **Google Search Console** nicht verifiziert | **KRITISCH** | `public/google-site-verification-ERSETZEN.html` → echten GSC-Code eintragen |
| **App Store Screenshots** erstellen | hoch | 6.7" + 6.1" aus iOS Simulator exportieren |
| **App Store Review Vorbereitung** | hoch | Privacy Policy URL = `assistenz-ranking.de/datenschutz` ✓, Moderation = Melde-Button ✓ |
| **1.7MB JS Bundle** — Code-Splitting | niedrig | Dynamic imports für `hospitals.js`, `hospitalCoords.js` |
| **Map-Bubble-Überlappung** bei hohem Zoom | mittel | Berlin: Collision-Detection in `GeoMap.jsx` |
| **Bilder ohne `alt`-Texte** | niedrig | Logo im Header |

---

## Dateien, die in dieser Session geändert wurden

```
capacitor.config.ts                                    — NEU: Capacitor App-Konfiguration
index.html                                             — viewport-fit=cover + Apple-Meta-Tags
src/index.css                                          — iOS safe-area CSS-Block
src/components/PasswordGate.jsx                        — VITE_PUBLIC_LAUNCH bypass
src/main.jsx                                           — Capacitor StatusBar-Init
.env.production                                        — NEU: VITE_PUBLIC_LAUNCH=true
.env.development                                       — NEU: VITE_PUBLIC_LAUNCH=false
ios/                                                   — NEU: vollständiges Xcode-Projekt
ios/App/App/Assets.xcassets/AppIcon.appiconset/        — App-Icon 1024×1024 (kein Alpha)
ios/App/App/Assets.xcassets/Splash.imageset/           — Splash 2732×2732 × 3 Varianten
package.json                                           — @capacitor/* Abhängigkeiten hinzugefügt
```

---

## Architektur-Entscheidungen dieser Session

- **Capacitor statt React Native** — 80% Code-Reuse, schnellster Weg zum App Store, gleiche WebView-Engine wie Safari
- **Bundle ID `de.assistenzranking.app`** — spiegelt Domain, unveränderlich nach App-Store-Submission
- **VITE_PUBLIC_LAUNCH env-Flag** — saubere Trennung: Dev bleibt passwortgeschützt, Production-Build ist offen. Kein Code-Delete nötig.
- **`isNativePlatform()` Guard** — StatusBar-Init läuft nur nativ, nie im Browser. Kein Crash-Risiko.
- **Pillow für Icon-Generierung** — sips kann SVG→PNG, PIL für Background-Compositing (kein Alpha-Kanal für App Store)
- **iOS 15.0 Deployment Target** — Capacitor 6.x erfordert 14+; 15.0 gibt Buffer und deckt >95% aktiver Geräte ab

---

## Nächste Schritte (empfohlen)

1. **Apple Developer Account** → [developer.apple.com/programs](https://developer.apple.com/programs) ($99/Jahr, 1-2 Tage Bearbeitung)
2. **Xcode öffnen + Simulator testen** → `npx cap open ios` → iPhone 15 Simulator → alle Flows testen
3. **App Store Connect** → neue App mit Bundle ID `de.assistenzranking.app`, Kategorie: Medical
4. **App Store Screenshots** → Simulator 6.7" (iPhone 15 Pro Max) + 6.1" (iPhone 15) im Simulator
5. **TestFlight** → Product → Archive → TestFlight einreichen, eigene Geräte testen
6. **PasswordGate auf Website entfernen** → GSC verifizieren → Sitemap einreichen

---

## Wichtige Commands

```bash
# Workflow nach Code-Änderungen:
npm run build && npx cap sync ios

# Xcode öffnen:
npx cap open ios

# Lokale Dev (Gate aktiv):
npm run dev

# Deploy Website (Vercel auto-deploy):
git add . && git commit -m "..." && git push

# Worktree sync (Preview-Server):
cd .claude/worktrees/kind-torvalds-3111a8 && git merge main --no-edit

# PasswordGate bypass im Browser:
sessionStorage.setItem('ar_unlocked', '1')

# PasswordGate bypass für Production-Build (automatisch via .env.production):
VITE_PUBLIC_LAUNCH=true npm run build
```

---

## Kontakt / Stakeholder

- **Projekt**: assistenz-ranking.de (anonyme Assistenzarzt-Bewertungen DACH)
- **Dev**: Hermann Bartels (hbartels22@gmail.com)
- **Repo**: github.com/3Micky/assistenzarzt-ranking
- **Deploy**: Vercel (auto-deploy main branch)
- **DNS**: A-Record @ → 76.76.21.21 (united-domains)
- **iOS Bundle ID**: de.assistenzranking.app
- **iOS App Name**: Assistenz-Ranking
