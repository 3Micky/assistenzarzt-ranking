# Design Handoff — Assistenzarzt-Ranking

This document gives you everything you need to continue design work on this project in a new session.
It covers: current build status, design system tokens, open-design skill setup, and the exact workflow
to use those skills to improve and prototype UI changes before applying them to the React codebase.

---

## 1. Project Overview

**What it is:** Anonymous rating platform for medical residency positions (Assistenzarztstellen) in Germany, Austria, and Switzerland.

**Live URL:** Runs locally via `npm run dev` (Vite 5, port 5173 by default).

**Key user flows:**
1. Submit a rating → 3-step form (hospital selection → criteria scoring → confirmation)
2. Browse rankings → dashboard with bar chart + radar comparison + DACH geo bubble-map
3. All data persists in LocalStorage — no backend, no auth.

---

## 2. Build Status

All 7 agent phases are **complete**. Every file in the target structure exists:

| Phase | Agent file | Status |
|---|---|---|
| 1 | `docs/agents/01-setup.md` | ✅ Done |
| 2 | `docs/agents/02-data-layer.md` | ✅ Done |
| 3 | `docs/agents/07-design-system.md` | ✅ Done |
| 4 | `docs/agents/04-dashboard.md` | ✅ Done |
| 5 | `docs/agents/03-rating-form.md` | ✅ Done |
| 6 | `docs/agents/05-geo-heatmap.md` | ✅ Done |
| 7 | `docs/agents/06-charts.md` | ✅ Done |

**Source tree (relevant files):**
```
src/
├── App.jsx
├── index.css
├── main.jsx
├── components/
│   ├── Charts/       BarRanking.jsx, RadarComparison.jsx, HospitalSelector.jsx
│   ├── Dashboard/    Dashboard.jsx, StatsBar.jsx
│   ├── GeoMap/       GeoMap.jsx, MapTooltip.jsx
│   ├── Layout/       Header.jsx
│   ├── RatingForm/   RatingForm.jsx, StepHospital.jsx, StepCriteria.jsx, StepDone.jsx
│   └── UI/           CountryFlag.jsx, EmptyState.jsx, ScoreBadge.jsx
├── data/             cities.js, criteria.js, hospitals.js, sampleData.js
├── hooks/            useRatings.js
├── store/            ratingsStore.js
└── utils/            calculations.js
```

---

## 3. Current Design System

These are the exact design tokens in use. Reference these when using open-design skills.

| Token | Value | Tailwind class |
|---|---|---|
| Primary / Accent | `#0EA5E9` | `sky-500` |
| Background (dark) | `#0F172A` | `slate-900` |
| Surface (cards) | `#1E293B` | `slate-800` |
| Border | `#334155` | `slate-700` |
| Text primary | `#F1F5F9` | `slate-100` |
| Text muted | `#94A3B8` | `slate-400` |
| Score — Bad | `#EF4444` | `red-500` |
| Score — Mid | `#F59E0B` | `amber-500` |
| Score — Good | `#22C55E` | `green-500` |

**Typography:** Inter (Google Fonts), loaded in `index.html`

**Component conventions:**
- Cards: `rounded-xl shadow-lg bg-slate-800`
- Buttons primary: `bg-sky-500 hover:bg-sky-400 text-white rounded-lg`
- All spacing via Tailwind — no inline `style={{}}` props
- Mobile-first breakpoints: `sm:` → `md:` → `lg:`

---

## 4. What is open-design?

`nexu-io/open-design` is an open-source local design engine that uses Claude Code to generate
UI artifacts (websites, dashboards, prototypes). It ships **61 composable skills** — each is a
standalone Markdown file + HTML seed template with zero runtime dependencies.

**Key insight:** The skills are pure Markdown + HTML/CSS. You do NOT need the open-design
web app running to use them. You just install the skill files and Claude reads them natively.

**Repository:** https://github.com/nexu-io/open-design

---

## 5. Installing open-design Skills

Run these commands once to clone the repo and copy the skills you need into this project:

```bash
# Clone open-design somewhere on your machine (not inside this project)
git clone https://github.com/nexu-io/open-design.git ~/open-design

# Create the skills directory in this project
mkdir -p .claude/skills

# Copy the skills most relevant to this project
cp -r ~/open-design/skills/design-brief        .claude/skills/
cp -r ~/open-design/skills/dashboard           .claude/skills/
cp -r ~/open-design/skills/web-prototype       .claude/skills/
cp -r ~/open-design/skills/wireframe-sketch    .claude/skills/
cp -r ~/open-design/skills/web-prototype-taste-soft .claude/skills/
```

After copying, Claude Code will auto-discover these skills. You can verify with `/skills` in the
Claude Code CLI.

---

## 6. Skill Reference — Which Skill Does What

| Skill | Use it when... |
|---|---|
| `design-brief` | Generating a `DESIGN.md` design-system spec from a natural-language brief. **Start here.** |
| `dashboard` | Prototyping the Dashboard / StatsBar / ranking view as a standalone HTML page |
| `web-prototype` | Prototyping the full app shell, landing page, or any full-page layout |
| `wireframe-sketch` | Low-fidelity wireframes with annotations — good for layout decisions before coding |
| `web-prototype-taste-soft` | Same as web-prototype but with warm, spacious, generous-padding aesthetic |

---

## 7. Recommended Workflow

Follow this sequence to design improvements and translate them back into React components.

### Step 1 — Generate a DESIGN.md

The `design-brief` skill reads a natural-language brief and produces a `DESIGN.md` file.
All other skills use this file to extract design tokens (colors, fonts, spacing).

Prompt example:
```
Use the design-brief skill to create a DESIGN.md for this project.

Brief:
- Medical rating platform for German/Austrian/Swiss hospitals
- Dark theme: background #0F172A (slate-900), surface #1E293B (slate-800)
- Accent: #0EA5E9 (sky-500, medical blue)
- Score colors: red #EF4444 → amber #F59E0B → green #22C55E
- Font: Inter
- Tone: professional, clinical, trustworthy — not playful
- Target users: resident doctors (Assistenzärzte), 25–35, mobile + desktop
```

Save the output as `DESIGN.md` in the project root.

### Step 2 — Prototype a screen with the dashboard skill

Once `DESIGN.md` exists, use the `dashboard` skill to generate a standalone HTML prototype
of the ranking dashboard. This lets you iterate visually without touching React.

Prompt example:
```
Use the dashboard skill to create a prototype of the ranking dashboard.
Read DESIGN.md for tokens. The dashboard shows:
- A StatsBar at the top (total ratings, average score, hospital count)
- A horizontal bar chart ranking hospitals by score (highest → lowest)
- A radar chart comparing up to 3 selected hospitals across 6 criteria
Output a single self-contained index.html file to docs/prototypes/dashboard.html
```

### Step 3 — Translate prototype → React component

Once the HTML prototype looks right, ask Claude to translate the relevant sections into the
existing React component files, replacing or updating them while keeping Tailwind classes
and the existing store/hooks API intact.

Prompt example:
```
The HTML prototype at docs/prototypes/dashboard.html has an updated StatsBar layout.
Translate only the StatsBar section into src/components/Dashboard/StatsBar.jsx.
Keep all existing Tailwind classes, props, and Zustand store usage unchanged.
Only update the visual structure/layout.
```

### Step 4 — Iterate

Repeat steps 2–3 for other screens: RatingForm, GeoMap, Header.

---

## 8. Known Design Gaps to Address

These are areas identified as likely needing design work in the next session:

- **TabNav** is referenced in CLAUDE.md but `src/components/Layout/TabNav.jsx` does not exist — needs to be created
- **Mobile layout** of the GeoMap needs review (bubble map on small screens)
- **Empty states** exist (`EmptyState.jsx`) but visual polish is unknown
- **RatingForm step transitions** — no animation currently
- **Header** may need a logo/branding pass

---

## 9. Stack Quick Reference

```
npm run dev       → start Vite dev server (http://localhost:5173)
npm run build     → production build to /dist
npm run preview   → preview production build
```

Dependencies:
- `react` + `react-dom` @ 18
- `vite` @ 5
- `tailwindcss` @ 3
- `react-router-dom` @ 6
- `zustand` @ 4
- `recharts` @ 2
- `react-simple-maps` @ 3
- `topojson-client`
- `d3-scale`

---

## 10. Session Startup Checklist

When you open this project in a new Claude Code session, do this:

1. Read this file (`docs/DESIGN-HANDOFF.md`) — you're reading it now ✓
2. Read `CLAUDE.md` in the project root for conventions
3. Run `npm run dev` to start the dev server and verify the app loads
4. Check if `DESIGN.md` exists in the project root — if not, run Step 1 above
5. Check if `.claude/skills/design-brief/` exists — if not, run the install commands in Section 5
6. Pick a design gap from Section 8 and start with the wireframe-sketch skill before coding

---

*Generated: 2026-05-04 | Project: assistenzdoc-react-final | Stack: React 18 + Vite 5 + Tailwind v3*
