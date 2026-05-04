# Agent 07 – Design System

## Ziel
Tailwind-Konfiguration finalisieren, globale CSS-Utilities ergänzen,
wiederverwendbare Micro-Komponenten für Scores, Badges und Flags anlegen.

Dieser Agent wird VOR den anderen Komponenten-Agents ausgeführt
(nach 01-setup und 02-data-layer).

---

## tailwind.config.js (vollständig)

Ersetze die Datei aus Agent 01 mit dieser erweiterten Version:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        score: {
          high:   '#22c55e',
          medium: '#f59e0b',
          low:    '#ef4444',
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
        'gradient-dark':  'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
      },
      animation: {
        'fade-in':   'fadeIn 0.3s ease-out',
        'slide-up':  'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
```

---

## src/index.css (vollständig, ersetzt Version aus Agent 01)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --color-score-low:      #EF4444;
    --color-score-mid:      #F59E0B;
    --color-score-high:     #22C55E;
    --color-map-bg:         #0F172A;
    --color-map-land:       #1e293b;
    --color-map-border:     #334155;
    --color-map-dach:       #1e3a5f;
    --color-map-dach-hover: #1d4ed8;
  }

  html { scroll-behavior: smooth; }

  body {
    @apply bg-slate-950 text-slate-100 font-sans antialiased;
    background-image: radial-gradient(ellipse at 20% 50%, rgba(14,165,233,0.05) 0%, transparent 60%),
                      radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.04) 0%, transparent 60%);
  }

  * { @apply box-border; }

  ::-webkit-scrollbar       { @apply w-1.5 h-1.5; }
  ::-webkit-scrollbar-track { @apply bg-slate-900; }
  ::-webkit-scrollbar-thumb { @apply bg-slate-600 rounded-full; }
}

@layer components {
  /* ── Cards ─────────────────────────────── */
  .card {
    @apply bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg;
  }
  .card-sm {
    @apply bg-slate-900 border border-slate-800 rounded-lg p-4;
  }
  .card-hover {
    @apply card transition-all duration-200 hover:border-slate-600 hover:shadow-xl;
  }

  /* ── Buttons ────────────────────────────── */
  .btn-primary {
    @apply inline-flex items-center justify-center gap-2
           bg-sky-500 hover:bg-sky-400 active:bg-sky-600
           text-white font-semibold px-5 py-2.5 rounded-lg
           transition-all duration-150 shadow-md hover:shadow-sky-500/25
           focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2
           focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed;
  }
  .btn-secondary {
    @apply inline-flex items-center justify-center gap-2
           bg-slate-800 hover:bg-slate-700 active:bg-slate-600
           text-slate-200 font-medium px-5 py-2.5 rounded-lg
           transition-colors duration-150
           focus:outline-none focus:ring-2 focus:ring-slate-500;
  }
  .btn-ghost {
    @apply inline-flex items-center justify-center gap-2
           text-slate-400 hover:text-slate-200 hover:bg-slate-800
           font-medium px-3 py-2 rounded-lg transition-colors duration-150;
  }

  /* ── Form Elements ──────────────────────── */
  .input-field {
    @apply w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg
           px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500
           focus:border-transparent placeholder-slate-500 transition-colors
           hover:border-slate-600;
  }
  .select-field {
    @apply input-field appearance-none cursor-pointer;
  }
  .label {
    @apply block text-sm font-medium text-slate-300 mb-1.5;
  }

  /* ── Score Display ──────────────────────── */
  .score-ring {
    @apply inline-flex items-center justify-center rounded-full font-bold tabular-nums;
  }
  .score-badge {
    @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold;
  }
  .score-high   { @apply bg-green-500/20 text-green-400; }
  .score-medium { @apply bg-amber-500/20  text-amber-400; }
  .score-low    { @apply bg-red-500/20    text-red-400; }

  /* ── Country Flags (emoji shorthand) ─────── */
  .flag-DE::before { content: '🇩🇪'; }
  .flag-AT::before { content: '🇦🇹'; }
  .flag-CH::before { content: '🇨🇭'; }

  /* ── Tabs ───────────────────────────────── */
  .tab-item {
    @apply flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg
           transition-all duration-150 cursor-pointer whitespace-nowrap;
  }
  .tab-item-active {
    @apply tab-item bg-sky-500/15 text-sky-400 border border-sky-500/30;
  }
  .tab-item-inactive {
    @apply tab-item text-slate-400 hover:text-slate-200 hover:bg-slate-800;
  }

  /* ── Slider (Range Input) ───────────────── */
  .slider {
    @apply w-full h-2 appearance-none cursor-pointer rounded-full bg-slate-700 outline-none;
  }
  .slider::-webkit-slider-thumb {
    @apply appearance-none w-5 h-5 rounded-full bg-sky-500 shadow-lg
           border-2 border-slate-900 cursor-pointer transition-transform hover:scale-110;
  }
  .slider::-moz-range-thumb {
    @apply w-5 h-5 rounded-full bg-sky-500 border-2 border-slate-900 cursor-pointer;
  }

  /* ── Progress Bar ───────────────────────── */
  .progress-bar {
    @apply w-full h-2 bg-slate-800 rounded-full overflow-hidden;
  }
  .progress-fill {
    @apply h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full
           transition-all duration-500 ease-out;
  }

  /* ── Dividers ───────────────────────────── */
  .divider {
    @apply border-t border-slate-800;
  }

  /* ── Section Title ──────────────────────── */
  .section-title {
    @apply text-lg font-semibold text-slate-100 flex items-center gap-2;
  }
  .section-subtitle {
    @apply text-sm text-slate-400 mt-0.5;
  }
}

@layer utilities {
  .text-gradient {
    @apply bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent;
  }
  .glow-sky {
    box-shadow: 0 0 20px -5px rgba(14,165,233,0.4);
  }
  .glow-green {
    box-shadow: 0 0 20px -5px rgba(34,197,94,0.4);
  }
}
```

---

## src/components/UI (Micro-Komponenten)

Erstelle `src/components/UI/ScoreBadge.jsx`:

```jsx
import { scoreColor, scoreLabel } from '../../utils/calculations.js'

/**
 * Zeigt einen farbigen Score-Badge
 * @param {{ score: number, size?: 'sm'|'md'|'lg', showLabel?: boolean }} props
 */
export default function ScoreBadge({ score, size = 'md', showLabel = false }) {
  const color = scoreColor(score)
  const cls = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  }[size]

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold tabular-nums ${cls}`}
      style={{ color, backgroundColor: color + '20', border: `1px solid ${color}40` }}
    >
      {score.toFixed(1)}
      {showLabel && <span className="font-normal opacity-80">{scoreLabel(score)}</span>}
    </span>
  )
}
```

Erstelle `src/components/UI/CountryFlag.jsx`:

```jsx
const FLAGS = { DE: '🇩🇪', AT: '🇦🇹', CH: '🇨🇭' }

export default function CountryFlag({ country, showLabel = false }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm">
      <span>{FLAGS[country] ?? '🏳️'}</span>
      {showLabel && <span className="text-slate-400">{country}</span>}
    </span>
  )
}
```

Erstelle `src/components/UI/EmptyState.jsx`:

```jsx
export default function EmptyState({ icon = '📊', title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-4 opacity-40">{icon}</div>
      <h3 className="text-lg font-semibold text-slate-300 mb-2">{title}</h3>
      {description && <p className="text-slate-500 text-sm max-w-xs mb-6">{description}</p>}
      {action}
    </div>
  )
}
```

---

## Design-Tokens Referenz (für andere Agents)

| Token | Wert | Verwendung |
|---|---|---|
| Primär | `sky-500` (#0ea5e9) | Buttons, Links, Akzente |
| Hintergrund | `slate-950` (#020617) | Body |
| Card-BG | `slate-900` (#0f172a) | Cards, Panels |
| Card-Border | `slate-800` (#1e293b) | Rahmen |
| Text primary | `slate-100` | Überschriften |
| Text secondary | `slate-400` | Labels, Subtext |
| Score Hoch | `green-500` (#22c55e) | Score ≥ 7.5 |
| Score Mittel | `amber-500` (#f59e0b) | Score 5–7.4 |
| Score Niedrig | `red-500` (#ef4444) | Score < 5 |
| Karte BG | `#0F172A` | GeoMap Canvas |
| DACH Highlight | `#1e3a5f` | Länderfüllung |

## Verifizierung
- Importiere `ScoreBadge` in einer Test-Komponente → Score erscheint farbig
- `overallScore` von 8.5 → grüner Badge
- Slider in Form sieht poliert aus (blauer Thumb)
