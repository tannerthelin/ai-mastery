# AI Mastery Landing Page — Editing Guide

## Quick Start
```bash
cd /tmp/ai-mastery-tanner
npm install
npm run dev        # local preview at http://localhost:5173/ai-mastery/
npm run build      # production build to dist/
```

## Deployment
- **Live URL:** https://tannerthelin.github.io/ai-mastery
- **Auto-deploys** on push to `master` via `.github/workflows/deploy.yml` (GitHub Pages)
- Always work on a branch and PR — merging to `master` triggers a deploy

## Architecture
Single-page React app (Vite). All page content lives in two files:

| File | What's in it |
|------|-------------|
| `src/App.jsx` | All content and components — courses, FAQs, testimonials, hero, nav, enterprise, etc. |
| `src/index.css` | All styles — CSS variables, layout, responsive breakpoints |
| `src/main.jsx` | React entry point (no need to edit) |
| `src/components/Squares.jsx` | Background grid animation (no need to edit) |
| `vite.config.js` | Vite config with `base: '/ai-mastery/'` for GitHub Pages |

## Content Quick Reference (App.jsx)

### Courses (~line 382)
The `courses` array holds all 5 course objects. Each has:
- `id` / `num` — section anchor and display number
- `title` / `tagline` — heading and description
- `tags` — schedule info shown as pills (e.g., `['Tuesdays and Fridays', '3 Weeks']`)
- `sessions` — array of `{ title, sub }` for the curriculum accordion
- `cohorts` — array of `{ month, day, date }` for enrollment dates
- `price` — displayed price string (e.g., `'$999'`)
- `levelIndex` — which workflow diagram to show (0-4)
- `reversed` — alternates layout direction

### FAQs (~line 489)
Array of `{ q, a }` objects. HTML allowed in answers.

### Testimonials (~line 516)
Array of `{ headline, quote, initials, name, role }`.

### Track Cards (~line 534)
Hero section course cards. Array of `{ num, name, tagline, href, seats }`. The `seats` field shows a green "X Seats Left!" tag — remove or set to `null` to hide.

### Hero Review (~line 668)
Single featured review hardcoded in JSX (not from the testimonials array).

### Enterprise Section (~line 686)
Team pricing section with email CTA to `teams@joinleland.com`.

### Certification Section (~line 710)
Currently hidden (`{false && ...}`). Change to `{true && ...}` to show.

## Design Tokens (index.css :root)
```
--bg: #000000              (page background)
--accent: #A5E446          (green — CTAs, highlights, prices)
--accent-hover: #95D03E
--text-primary: #ffffff
--text-secondary: rgba(255,255,255,0.60)
--text-tertiary: #808080
--border: #484848
--font-heading: 'Calibre'  (headings, body)
--font-meta: 'Departure Mono' (labels, prices, monospace elements)
```

## Common Edits

**Change a course price:** Edit the `price` field in the course object (~line 382-487).

**Change cohort dates:** Edit the `cohorts` array in each course object. Update `month`, `day`, and `date`.

**Add/remove a session:** Edit the `sessions` array in the relevant course object.

**Change hero text:** Search for `<h1>` (~line 591) and `hero-sub` (~line 593).

**Update "Seats Left" count:** Edit the `seats` field in `trackItems` (~line 534). Set to `null` to hide.

**Show/hide certification section:** Toggle `{false &&` to `{true &&` at ~line 711.

**Mobile breakpoint:** Responsive styles start at `@media (max-width: 768px)` in index.css.
