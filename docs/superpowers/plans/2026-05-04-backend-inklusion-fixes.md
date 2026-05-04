# Backend + Fixes + Inklusion — Implementierungsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate from LocalStorage to Supabase database, fix radar/map visuals, update UI to inclusive language.

**Architecture:** Supabase (PostgreSQL + RLS) replaces LocalStorage. Frontend uses `@supabase/supabase-js` client; Zustand store delegates to Supabase API. RLS policy allows public reads & inserts, blocks mutations. Async hydration pattern: app starts, fetches ratings from DB, populates store.

**Tech Stack:** Supabase (PostgreSQL), `@supabase/supabase-js` SDK, Zustand (already in project), React 18

---

## File Structure

**New files:**
- `src/hooks/useSupabase.js` — Supabase client initialization and query methods
- `scripts/setup-db.sql` — Database schema (user executes this in Supabase dashboard)
- `.env.local.example` — Template for user environment variables

**Modified files:**
- `src/store/ratingsStore.js` — Replace localStorage with Supabase backend
- `src/App.jsx` — Add Supabase hydration on mount
- `src/components/Charts/RadarComparison.jsx` — Fix color palette
- `src/components/GeoMap/GeoMap.jsx` — Fix hover to DACH only
- `src/components/Layout/Header.jsx` — Inclusive language
- `src/components/Layout/TabNav.jsx` — Inclusive language
- `src/components/RatingForm/StepHospital.jsx`, `StepCriteria.jsx`, `StepNiceToHave.jsx`, `StepDone.jsx` — Inclusive language
- `src/components/Dashboard/Dashboard.jsx`, `StatsBar.jsx` — Inclusive language
- `src/pages/HomePage.jsx`, `KartePage.jsx`, `RankingPage.jsx`, `VergleichPage.jsx`, `BerichtePage.jsx`, `BewertungPage.jsx` — Inclusive language
- `src/data/criteria.js` — Inclusive field labels
- `package.json` — Add `@supabase/supabase-js` dependency

---

## Tasks

### Task 1: Install Supabase SDK

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add Supabase SDK to dependencies**

```bash
npm install @supabase/supabase-js
```

Expected output: `added 1 package`

- [ ] **Step 2: Verify installation**

```bash
npm list @supabase/supabase-js
```

Expected: Shows `@supabase/supabase-js@X.X.X`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add @supabase/supabase-js dependency"
```

---

### Task 2: Create useSupabase Hook

**Files:**
- Create: `src/hooks/useSupabase.js`

- [ ] **Step 1: Create hook file with Supabase client**

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_KEY in .env.local')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * Fetch all ratings from Supabase
 * @returns {Promise<Array>} Array of rating objects
 */
export async function fetchAllRatings() {
  const { data, error } = await supabase
    .from('ratings')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch ratings:', error)
    return []
  }
  return data || []
}

/**
 * Insert a new rating into Supabase
 * @param {Object} rating - Rating object (all fields required)
 * @returns {Promise<Object|null>} Inserted rating or null on error
 */
export async function insertRating(rating) {
  const { data, error } = await supabase
    .from('ratings')
    .insert([rating])
    .select()

  if (error) {
    console.error('Failed to insert rating:', error)
    return null
  }
  return data?.[0] || null
}
```

- [ ] **Step 2: Verify file was created**

```bash
ls -la src/hooks/useSupabase.js
```

Expected: File exists

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useSupabase.js
git commit -m "feat: create useSupabase hook for Supabase integration"
```

---

### Task 3: Update ratingsStore.js

**Files:**
- Modify: `src/store/ratingsStore.js`

- [ ] **Step 1: Replace file content**

```javascript
import { create } from 'zustand'
import { fetchAllRatings, insertRating } from '../hooks/useSupabase.js'

export const useRatingsStore = create((set, get) => ({
  ratings: [],
  isLoading: false,

  /** Fetch all ratings from Supabase on app start */
  async hydrate() {
    set({ isLoading: true })
    try {
      const ratings = await fetchAllRatings()
      set({ ratings })
    } catch (error) {
      console.error('Hydration failed:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  /** Add a new rating to Supabase */
  async addRating(rating) {
    const result = await insertRating(rating)
    if (result) {
      set((state) => ({ ratings: [result, ...state.ratings] }))
      return result
    }
    return null
  },

  /** Clear local state (not used in normal flow) */
  clearAll() {
    set({ ratings: [] })
  },
}))
```

- [ ] **Step 2: Verify syntax**

```bash
node -c src/store/ratingsStore.js
```

Expected: No output (syntax OK)

- [ ] **Step 3: Commit**

```bash
git add src/store/ratingsStore.js
git commit -m "refactor: replace localStorage with Supabase in ratingsStore"
```

---

### Task 4: Update App.jsx to Hydrate on Mount

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Find the App component and add useEffect**

Open `src/App.jsx` and locate the `export default function App()` or `const App = () => {}` line.

Add this import at the top:

```javascript
import { useEffect } from 'react'
import { useRatingsStore } from './store/ratingsStore.js'
```

- [ ] **Step 2: Add hydration effect inside App component**

Inside the App component (before the return statement), add:

```javascript
useEffect(() => {
  useRatingsStore.getState().hydrate()
}, [])
```

Complete example (the rest of App.jsx stays the same):

```javascript
import { useEffect } from 'react'
import { useRatingsStore } from './store/ratingsStore.js'
// ... other imports

export default function App() {
  useEffect(() => {
    useRatingsStore.getState().hydrate()
  }, [])

  // ... rest of component unchanged
  return (
    // ... existing JSX
  )
}
```

- [ ] **Step 3: Verify the file**

```bash
grep -n "hydrate()" src/App.jsx
```

Expected: Shows the line with `hydrate()`

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "feat: add Supabase hydration on app mount"
```

---

### Task 5: Fix RadarComparison Chart Colors

**Files:**
- Modify: `src/components/Charts/RadarComparison.jsx`

- [ ] **Step 1: Update colors**

Find the line with `const COLORS = [...]` (line 4) and replace it:

```javascript
const COLORS = ['#0EA5E9', '#E61919', '#22C55E']
```

- [ ] **Step 2: Update fillOpacity**

Find the line `fillOpacity={0.12}` in the Radar component (around line 31) and change it to:

```javascript
fillOpacity={0.25}
```

- [ ] **Step 3: Update strokeWidth**

Find the line `strokeWidth={2}` in the Radar component (around line 30) and change it to:

```javascript
strokeWidth={2.5}
```

Complete updated Radar element should look like:

```javascript
<Radar key={name} name={name} dataKey={name}
  stroke={COLORS[i % COLORS.length]}
  fill={COLORS[i % COLORS.length]}
  fillOpacity={0.25}
  strokeWidth={2.5} />
```

- [ ] **Step 4: Verify changes**

```bash
grep -A 2 "const COLORS" src/components/Charts/RadarComparison.jsx
```

Expected: Shows `['#0EA5E9', '#E61919', '#22C55E']`

- [ ] **Step 5: Commit**

```bash
git add src/components/Charts/RadarComparison.jsx
git commit -m "fix: update radar chart colors for visibility"
```

---

### Task 6: Fix GeoMap Hover (DACH Only)

**Files:**
- Modify: `src/components/GeoMap/GeoMap.jsx`

- [ ] **Step 1: Add DACH check in Geography mapping**

Find the section where `geographies.map((geo) => (` and the `<Geography` component is rendered (around line 70-94).

Replace the entire Geography component with this updated version:

```javascript
geographies.map((geo) => {
  const isDACH = DACH_CODES.has(geo.id)
  
  return (
    <Geography
      key={geo.rsmKey}
      geography={geo}
      style={{
        default: {
          fill:        '#F4F4F0',
          stroke:      '#050505',
          strokeWidth: 0.5,
          outline:     'none',
        },
        hover: isDACH ? {
          fill:        '#F4F4F0',
          stroke:      '#E61919',
          strokeWidth: 1.5,
          outline:     'none',
        } : {
          fill:        '#F4F4F0',
          stroke:      '#050505',
          strokeWidth: 0.5,
          outline:     'none',
        },
        pressed: {
          fill:        '#EAE8E3',
          stroke:      '#E61919',
          strokeWidth: 1.5,
          outline:     'none',
        },
      }}
    />
  )
})
```

- [ ] **Step 2: Verify syntax**

```bash
node -c src/components/GeoMap/GeoMap.jsx
```

Expected: No output (syntax OK)

- [ ] **Step 3: Commit**

```bash
git add src/components/GeoMap/GeoMap.jsx
git commit -m "fix: apply red hover only to DACH countries"
```

---

### Task 7: Update Header.jsx for Inclusive Language

**Files:**
- Modify: `src/components/Layout/Header.jsx`

- [ ] **Step 1: Find all text containing "Arzt/ärzt/arzt" and replace**

Open the file and update:
- "Assistenzarzt" → "Assistenzärzt*in"
- "Arzt" → "Ärzt*in" (where singular)
- "Ärzte" → "Ärzt*innen" (where plural)
- Any mention of "Nutzer" → "Nutzer*innen"

- [ ] **Step 2: Verify changes**

```bash
grep -i "arzt\|nutzer" src/components/Layout/Header.jsx
```

Expected: All instances use `*` form (Ärzt*in, Ärzt*innen, Nutzer*innen)

- [ ] **Step 3: Commit**

```bash
git add src/components/Layout/Header.jsx
git commit -m "refactor: use inclusive language in Header"
```

---

### Task 8: Update TabNav.jsx for Inclusive Language

**Files:**
- Modify: `src/components/Layout/TabNav.jsx`

- [ ] **Step 1: Update tab labels and descriptions**

Apply same replacements as Task 7:
- "Assistenzarzt" → "Assistenzärzt*in"
- "Arzt" → "Ärzt*in"
- "Nutzer" → "Nutzer*innen"

- [ ] **Step 2: Verify**

```bash
grep -i "arzt\|nutzer" src/components/Layout/TabNav.jsx | head -20
```

Expected: Shows updates with `*` forms

- [ ] **Step 3: Commit**

```bash
git add src/components/Layout/TabNav.jsx
git commit -m "refactor: use inclusive language in TabNav"
```

---

### Task 9: Update RatingForm Components for Inclusive Language

**Files:**
- Modify: `src/components/RatingForm/StepHospital.jsx`
- Modify: `src/components/RatingForm/StepCriteria.jsx`
- Modify: `src/components/RatingForm/StepNiceToHave.jsx`
- Modify: `src/components/RatingForm/StepDone.jsx`

- [ ] **Step 1-4: Update all form step files**

Apply same replacements to all files:
- "Arzt" → "Ärzt*in"
- "Assistenzarzt" → "Assistenzärzt*in"
- "Nutzer" → "Nutzer*innen"

- [ ] **Step 5: Commit all form files at once**

```bash
git add src/components/RatingForm/
git commit -m "refactor: use inclusive language in RatingForm steps"
```

---

### Task 10: Update Dashboard Components for Inclusive Language

**Files:**
- Modify: `src/components/Dashboard/Dashboard.jsx`
- Modify: `src/components/Dashboard/StatsBar.jsx`

- [ ] **Step 1-2: Update both files**

Apply same replacements:
- "Arzt" → "Ärzt*in"
- "Assistenzarzt" → "Assistenzärzt*in"
- "Nutzer" → "Nutzer*innen"

- [ ] **Step 3: Commit**

```bash
git add src/components/Dashboard/
git commit -m "refactor: use inclusive language in Dashboard components"
```

---

### Task 11: Update Page Files for Inclusive Language

**Files:**
- Modify: `src/pages/HomePage.jsx`
- Modify: `src/pages/KartePage.jsx`
- Modify: `src/pages/RankingPage.jsx`
- Modify: `src/pages/VergleichPage.jsx`
- Modify: `src/pages/BerichtePage.jsx`
- Modify: `src/pages/BewertungPage.jsx`

- [ ] **Step 1-6: Update all page files**

Apply same replacements to all files.

- [ ] **Step 7: Commit**

```bash
git add src/pages/
git commit -m "refactor: use inclusive language in all page files"
```

---

### Task 12: Update criteria.js Labels for Inclusive Language

**Files:**
- Modify: `src/data/criteria.js`

- [ ] **Step 1: Update label in CRITERIA_ESSENTIAL**

Find the line:
```javascript
{ key: 'abteilungsgroesse',        label: 'Abteilungsgröße (Ärzte)',   type: 'number', min: 1, max: 500 },
```

Change to:
```javascript
{ key: 'abteilungsgroesse',        label: 'Abteilungsgröße (Ärzt*innen)',   type: 'number', min: 1, max: 500 },
```

- [ ] **Step 2: Verify change**

```bash
grep "Abteilungsgröße" src/data/criteria.js
```

Expected: Shows `Ärzt*innen`

- [ ] **Step 3: Commit**

```bash
git add src/data/criteria.js
git commit -m "refactor: use inclusive language in criteria labels"
```

---

### Task 13: Create Database Schema SQL File

**Files:**
- Create: `scripts/setup-db.sql`

- [ ] **Step 1: Create scripts directory and SQL file**

```bash
mkdir -p scripts && cat > scripts/setup-db.sql << 'EOF'
-- Assistenzarzt Ranking Database Schema
-- Run this in Supabase SQL Editor (SQL)

CREATE TABLE IF NOT EXISTS ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  hospital text NOT NULL,
  city text NOT NULL,
  country text NOT NULL,
  region text NOT NULL,
  specialty text NOT NULL,
  year int NOT NULL,
  criteria jsonb NOT NULL,
  comment text DEFAULT ''
);

-- Enable Row Level Security
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Allow public reads
CREATE POLICY "ratings_read_all" ON ratings
  FOR SELECT USING (true);

-- Allow public inserts
CREATE POLICY "ratings_insert_all" ON ratings
  FOR INSERT WITH CHECK (true);

-- Create indexes for common queries
CREATE INDEX idx_ratings_created_at ON ratings (created_at DESC);
CREATE INDEX idx_ratings_country_city ON ratings (country, city);

-- Grant access
GRANT SELECT, INSERT ON ratings TO anon;
EOF
```

- [ ] **Step 2: Verify file was created**

```bash
ls -la scripts/setup-db.sql && wc -l scripts/setup-db.sql
```

Expected: File exists, ~30 lines

- [ ] **Step 3: Commit**

```bash
git add scripts/setup-db.sql
git commit -m "docs: add database schema SQL for Supabase setup"
```

---

### Task 14: Create .env.local Template

**Files:**
- Create: `.env.local.example`

- [ ] **Step 1: Create environment template**

```bash
cat > .env.local.example << 'EOF'
# Supabase Configuration
# Copy this file to .env.local and fill in your values

VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your-anon-public-key-here
EOF
```

- [ ] **Step 2: Verify file**

```bash
cat .env.local.example
```

Expected: Shows template with placeholders

- [ ] **Step 3: Commit**

```bash
git add .env.local.example
git commit -m "docs: add .env.local template for Supabase setup"
```

---

### Task 15: Test End-to-End

**Files:**
- Test: Full app flow in browser

- [ ] **Step 1: User sets up Supabase**

**User actions:**
1. Create free Supabase account at https://supabase.com
2. Create new project (free tier)
3. Go to Project Settings → API → Copy "Project URL"
4. Copy "Anon Key" (not the secret key)
5. Create `.env.local` file in project root
6. Run database schema in Supabase SQL Editor

- [ ] **Step 2: Start dev server**

```bash
npm run dev
```

- [ ] **Step 3-8: Manual testing in browser**

Test loads, submits ratings, GeoMap hover, radar colors, language.

---

## Spec Coverage Checklist

✅ Database (Supabase schema, hydration, addRating)
✅ Radar Chart (colors fixed)
✅ GeoMap Hover (DACH-only)
✅ Inclusive Language (all files)
✅ Security (RLS policy)
✅ Deployment (ready for Vercel)
