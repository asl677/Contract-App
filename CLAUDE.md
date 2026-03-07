# free-app CLAUDE.md — Deployment & Development Rules

## Vercel Deployment Limits

**CRITICAL:** This project is on Vercel's free tier with a **100 deployment/day limit**.

### Deployment Rules
- **NEVER auto-deploy** — Always ask before deploying
- **Track deployments manually** — Count deployments in Vercel dashboard
- **Warn at 50% (50 deployments)** — Alert user when approaching limit
- **Stop deployments at 90%** — Do not deploy if close to limit

### How to Deploy (Manual Only)
```bash
# Check current deployment count in Vercel dashboard first
vercel deploy --prod
```

**If you hit the limit:**
- Error: `Resource is limited - try again in 15 hours`
- Code is committed and ready; just wait for the limit to reset

---

## Project Stack
- **Frontend:** Next.js 14 + React + TypeScript + Tailwind CSS
- **Animations:** Framer Motion
- **State:** Local useState/useRef
- **Deployment:** Vercel (free tier, 100 deployments/day limit)

## Quick Commands
```bash
npm run dev        # Local development
npm run build      # Verify build before deploying
git push origin main  # Push changes
vercel deploy --prod  # Manual deployment only
```

---

## Component Patterns

### Jobs Page (components/pages/Jobs.tsx)
- Initial fetch happens ONCE on mount (empty dependency array)
- Infinite scroll loads more when 500px from bottom
- Manual "Load More" button as fallback
- Filter: Excludes "Full-time" duration roles

### Navigation (components/Navigation.tsx)
- Active indicator fades in after 300ms to prevent jumping
- `showBorder` state prevents flashing on page load

### Dashboard (components/pages/Dashboard.tsx)
- Earnings display: top-right on desktop, stacked on mobile (pt-52)
- "This Week" label: left-aligned

### Contract Detail Panel (components/ContractDetailPanel.tsx)
- CSV export with summary row (total hours + earnings)
- Hours tracking calculated from entry durations

---

## Recent Fixes
1. **Jobs board double-fetch** — Removed `fetchJobs` from dependency array (line 119)
2. **Dashboard spacing** — Set to pt-52 on mobile for proper spacing below "This Week"
3. **Navigation line jumping** — Added 300ms fade-in delay with `showBorder` state
