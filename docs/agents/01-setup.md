# Agent 01 – Projekt-Setup

## Ziel
Komplettes Vite/React Projekt aufsetzen, alle Abhängigkeiten installieren,
Tailwind konfigurieren, grundlegende Dateistruktur anlegen.

## Schritt 1: package.json erstellen

Erstelle `/package.json`:

```json
{
  "name": "assistenzarzt-ranking",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.0",
    "zustand": "^4.5.4",
    "recharts": "^2.12.7",
    "react-simple-maps": "^3.0.0",
    "topojson-client": "^3.1.0",
    "d3-scale": "^4.0.2",
    "d3-interpolate": "^3.0.1",
    "uuid": "^10.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.3.4",
    "tailwindcss": "^3.4.7",
    "postcss": "^8.4.40",
    "autoprefixer": "^10.4.19"
  }
}
```

Dann ausführen:
```bash
npm install
```

## Schritt 2: vite.config.js

```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
```

## Schritt 3: PostCSS + Tailwind Config

`postcss.config.js`:
```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

`tailwind.config.js`:
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
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          900: '#0c4a6e',
        },
      },
    },
  },
  plugins: [],
}
```

## Schritt 4: index.html

```html
<!doctype html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Assistenzarzt-Ranking | DACH</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

## Schritt 5: Verzeichnisse anlegen

Erstelle folgende leere Verzeichnisse (lege je eine `.gitkeep` Datei an):
```
src/components/Layout/
src/components/RatingForm/
src/components/Dashboard/
src/components/GeoMap/
src/components/Charts/
src/hooks/
src/store/
src/data/
src/utils/
public/
```

## Schritt 6: src/main.jsx

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
```

## Schritt 7: src/index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --color-score-low:    #EF4444;
    --color-score-mid:    #F59E0B;
    --color-score-high:   #22C55E;
    --color-map-bg:       #0F172A;
    --color-map-land:     #1E293B;
    --color-map-border:   #334155;
    --color-map-highlight:#1E40AF;
  }

  body {
    @apply bg-slate-950 text-slate-100 font-sans antialiased;
  }

  * {
    @apply box-border;
  }

  ::-webkit-scrollbar {
    @apply w-1.5;
  }
  ::-webkit-scrollbar-track {
    @apply bg-slate-900;
  }
  ::-webkit-scrollbar-thumb {
    @apply bg-slate-600 rounded-full;
  }
}

@layer components {
  .card {
    @apply bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg;
  }

  .btn-primary {
    @apply bg-sky-500 hover:bg-sky-400 text-white font-semibold px-5 py-2.5
           rounded-lg transition-colors duration-150 focus:outline-none
           focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-950;
  }

  .btn-secondary {
    @apply bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-5 py-2.5
           rounded-lg transition-colors duration-150;
  }

  .input-field {
    @apply w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg
           px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500
           focus:border-transparent placeholder-slate-500 transition-colors;
  }

  .score-badge {
    @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold;
  }
}
```

## Schritt 8: Minimales src/App.jsx (Shell)

```jsx
import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/Layout/Header.jsx'
import Dashboard from './components/Dashboard/Dashboard.jsx'
import RatingForm from './components/RatingForm/RatingForm.jsx'
import { useRatingsStore } from './store/ratingsStore.js'

export default function App() {
  const hydrate = useRatingsStore((s) => s.hydrate)
  useEffect(() => { hydrate() }, [hydrate])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/bewerten" element={<RatingForm />} />
        </Routes>
      </main>
    </div>
  )
}
```

## Verifizierung
Nach Abschluss dieses Agents:
- `npm run dev` sollte ohne Fehler starten (leere weiße Seite ist ok)
- Tailwind-Klassen werden aufgelöst
- Keine Konsolenfehler außer fehlenden Modulen (kommen in späteren Agents)
