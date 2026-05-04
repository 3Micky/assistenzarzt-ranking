# Spec: Supabase Backend + Fixes + Inklusion

**Date:** 2026-05-04  
**Scope:** Database integration (Supabase), radar chart color fix, GeoMap hover fix, inclusive language, security, deployment

---

## 1. Database Architecture (Supabase)

### Schema

**Table: `ratings`**
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
created_at      timestamptz DEFAULT now()
hospital        text NOT NULL
city            text NOT NULL
country         text NOT NULL        -- DE, AT, CH
region          text NOT NULL
specialty       text NOT NULL
year            int NOT NULL
criteria        jsonb NOT NULL       -- all fields from criteria.js
comment         text DEFAULT ''
```

### Row Level Security (RLS)

- **SELECT:** Public read (all rows visible to anyone)
- **INSERT:** Public insert (anyone can submit a rating)
- **UPDATE/DELETE:** Disabled (ratings are immutable)

RLS policy:
```sql
CREATE POLICY "ratings_read_all" ON ratings
  FOR SELECT USING (true);

CREATE POLICY "ratings_insert_all" ON ratings
  FOR INSERT WITH CHECK (true);
```

### Frontend Integration

- `ratingsStore.js` refactored: Remove localStorage persistence, add Supabase client
- New hook: `useSupabase.js` for database queries (hydrate, addRating)
- Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_KEY` in `.env.local`
- Initial load: Fetch all ratings from `ratings` table (no seed data — start fresh)
- On submit: Use `supabase.from('ratings').insert(rating)`

---

## 2. Bug Fixes

### Radar Chart Colors

**File:** `src/components/Charts/RadarComparison.jsx`

Current colors: `['#E61919', '#050505', '#F59E0B']` — the `#050505` is near-black, invisible on dark background.

New colors: `['#0EA5E9', '#E61919', '#22C55E']` (blue, red, green — all visible, matches design system)

Additional tweaks:
- Increase `fillOpacity` from `0.12` to `0.25` for better visibility
- Increase `strokeWidth` from `2` to `2.5` for line clarity

### GeoMap Hover (Red Borders Fix)

**File:** `src/components/GeoMap/GeoMap.jsx`

Problem: Hover style applies to all countries worldwide; causes red flashing on non-DACH borders.

Solution: Apply red hover only to DACH countries (ISO codes `276` = DE, `40` = AT, `756` = CH).

```jsx
// In Geography mapping:
const isDACH = DACH_CODES.has(geo.id);

<Geography
  // ...
  style={{
    default: { /* unchanged */ },
    hover: isDACH ? {
      fill: '#F4F4F0',
      stroke: '#E61919',
      strokeWidth: 1.5,
      outline: 'none',
    } : {
      fill: '#F4F4F0',
      stroke: '#050505',  // normal stroke, no change
      strokeWidth: 0.5,
      outline: 'none',
    },
  }}
/>
```

Result: Only Germany, Austria, Switzerland change color on hover; all other countries remain unchanged.

---

## 3. Inclusive Language

All UI text updated to use `*` forms:

**Affected files:**
- `src/components/Layout/Header.jsx` — page title, tagline
- `src/components/Layout/TabNav.jsx` — tab labels, descriptions
- `src/components/RatingForm/StepHospital.jsx`, `StepCriteria.jsx`, `StepDone.jsx`, `StepNiceToHave.jsx` — form labels, hints
- `src/components/Dashboard/Dashboard.jsx`, `StatsBar.jsx` — stat labels
- `src/pages/BerichtePage.jsx` — report headers, labels
- `src/components/Berichte/BerichteTabelle.jsx` — table headers
- `src/data/criteria.js` — form field labels

**Examples:**
- "Arzt / Ärzte" → "Ärzt\*in / Ärzt\*innen"
- "Assistenzarzt" → "Assistenzärzt\*in"
- "der Nutzer" → "Nutzer\*innen"
- Form headings: "Bewertung von [Hospital]" → "Bewertung von [Hospital]" (unchanged, neutral)

Data layer (`sampleData.js`) remains German-only (no label translation needed).

---

## 4. Security

### Implemented

✅ **Supabase RLS:** All data protection at DB level; no SQL injection, no unauthorized mutations  
✅ **Input Validation:** Frontend checks before submit (empty fields, numeric ranges, required dropdowns)  
✅ **XSS Protection:** React auto-escapes all user input in JSX  
✅ **HTTPS:** Enforced by Vercel/Netlify (all traffic encrypted)  
✅ **No Secrets in Frontend:** Supabase public API key is safe; RLS enforces permissions  
✅ **No PII in URLs:** All data via POST/queries, not URL params  

### Accepted Risks (by design)

⚠️ **Spam/Abuse:** Fully anonymous submissions allow duplicates & spam. Acceptable for small DACH medical community. Mitigation: Human moderation in Supabase dashboard if needed later.

### Optional Future Enhancements

- Duplicate detection (check if hospital/region/year already rated recently)
- IP-based rate limiting (Supabase Edge Functions)
- Moderation queue (admin review before public visibility)

---

## 5. Deployment

### Frontend (React/Vite)

**Recommended: Vercel**
- Connect GitHub repo
- Auto-deploy on every push to `main`
- Zero config, 0€/month

**Alternative:** Netlify (identical experience)

### Backend (Supabase)

- Create free account at supabase.com
- Create new project (free tier: 500 MB DB, 50 GB storage)
- Copy `Project URL` and `Anon Key` into `.env.local`:
  ```
  VITE_SUPABASE_URL=https://xxx.supabase.co
  VITE_SUPABASE_KEY=eyJxxx...
  ```
- Create `ratings` table via SQL (provided in implementation plan)

### CI/CD

1. Local: `npm run build` test
2. Push to GitHub
3. Vercel auto-deploys (~2 min)
4. Changes live

### Cost

- **Frontend:** €0 (Vercel free tier, unlimited requests)
- **Backend:** €0 (Supabase free tier covers typical usage for years)
- **Total:** €0/month

---

## 6. Files to Create / Modify

### New Files
- `src/hooks/useSupabase.js` — Supabase integration hook
- `.env.local` (user creates after Supabase setup)
- `docs/superpowers/specs/2026-05-04-backend-inklusion-fixes.md` (this file)

### Modified Files
- `src/store/ratingsStore.js` — remove localStorage, add Supabase client
- `src/App.jsx` — call `useSupabase.hydrate()` on mount
- `src/components/Charts/RadarComparison.jsx` — fix colors & opacity
- `src/components/GeoMap/GeoMap.jsx` — fix hover to DACH only
- `src/components/Layout/Header.jsx`, `TabNav.jsx`, all form/page files — inclusive language
- `src/data/criteria.js` — inclusive field labels
- `package.json` — add `@supabase/supabase-js` dependency

### No Changes Needed
- `src/data/sampleData.js` — delete or keep for reference (not loaded)
- `src/hooks/useRatings.js` — still used for chart calculations
- `src/utils/calculations.js` — still used

---

## 7. User Handoff Points

These require the user to do:

1. **Supabase Setup:** Create free account, new project, copy URL + Key
2. **Environment Variables:** Paste URL + Key into `.env.local` (template provided)
3. **GitHub Connection:** Link Vercel to GitHub repo
4. **Database Creation:** Run SQL schema migration (one-click in Supabase, or script)
5. **Final Verification:** Check that app loads, can submit ratings, and ratings appear in Supabase dashboard

Everything else is automated / provided by Claude.

---

## 8. Success Criteria

- ✅ App loads ratings from Supabase (not localStorage)
- ✅ Users can submit anonymous ratings; they persist in DB
- ✅ All ratings visible in Charts/Map (aggregated data)
- ✅ Radar chart shows 3 distinct colors (blue, red, green)
- ✅ GeoMap hover only affects Germany, Austria, Switzerland
- ✅ All UI text uses inclusive `*` forms
- ✅ No console errors (React, Supabase warnings are OK)
- ✅ App deployable to Vercel; live URL works
- ✅ Supabase RLS prevents unauthorized data mutations (tested in browser devtools)

