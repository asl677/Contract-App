# Free App — Repository Summary & Architecture

**Last Updated**: 2026-03-08

## Project Overview
Freelance job board with contract tracking, time logging, and invoice generation. Dark-themed, responsive, Vercel-hosted.

- **Live**: https://be-free.vercel.app
- **Type**: Next.js 14 fullstack app
- **Hosting**: Vercel (production deployment)

---

## Folder Structure

```
free-app/
├── app/                          # Next.js app directory
│   ├── layout.tsx               # Root layout (metadata, LenisProvider)
│   ├── page.tsx                 # Dashboard page (main entry)
│   ├── globals.css              # Global styles
│   └── api/
│       └── jobs/
│           └── route.ts         # Job fetching & classification API
├── components/
│   ├── pages/
│   │   ├── Jobs.tsx             # Jobs listing with filters & infinite scroll
│   │   ├── Contracts.tsx        # Contract management (CRUD)
│   │   ├── TimeTracking.tsx     # Time entry logging with timer
│   │   ├── Dashboard.tsx        # Overview (contracts + entries)
│   │   └── Notes.tsx            # Notes page with trash delete
│   ├── FilterPanel.tsx          # Side panel filters (mobile/desktop)
│   ├── NavPanel.tsx             # Navigation drawer (top on mobile, left on desktop)
│   ├── Navigation.tsx           # Tab navigation bar
│   ├── CreateContractPanel.tsx  # Contract creation form
│   ├── CustomDropdown.tsx       # Dropdown with slide animation
│   ├── LenisProvider.tsx        # Smooth scroll wrapper
│   ├── Toast.tsx                # Toast notifications
│   └── AnimatedNumber.tsx       # Number transition animation
├── public/
│   ├── favicon.png              # Square icon (36KB)
│   ├── og-image.png             # Social sharing (1120x560)
│   ├── apple-touch-icon.png     # iOS icon
│   └── manifest.json            # PWA manifest
├── CLAUDE.md                     # Animation & layout standards (LOCKED)
├── UI_STANDARDS.md              # Design system & spacing rules
├── FREE-APP-GUIDELINES.md       # Master animation/filter reference
└── REPO_SUMMARY.md              # This file

```

---

## Key Files & Responsibilities

| File | Purpose | Key Logic |
|------|---------|-----------|
| `page.tsx` | Dashboard home | State: contracts/entries, tab routing, localStorage load/save |
| `Jobs.tsx` | Job board | Filters, infinite scroll, pagination (offset 0→40→80...) |
| `jobs/route.ts` | Job API | Fetches jobs, classifies type, returns pagination metadata |
| `Contracts.tsx` | Contract mgmt | CRUD, date formatting, CSV export, invoice link copy |
| `TimeTracking.tsx` | Time logger | Timer (start/stop), entry creation, delete with collapse animation |
| `Dashboard.tsx` | Overview | Stats: total hours, earnings, contract count |
| `FilterPanel.tsx` | Filter drawer | Type, location, source, employment, salary filters |
| `NavPanel.tsx` | Navigation | Top drawer (mobile), left panel (desktop), tab selection |
| `CustomDropdown.tsx` | Dropdown UI | Click to open/close, slide animation, no caret icon |

---

## Data Flow Architecture

### State Management
- **localStorage**: Contracts array, time entries array (persisted)
- **React state**: Filter values, UI toggles (showFilters, showNav), modal open/close
- **URL params**: Not used (state-based routing only)

### Page Navigation
```
Dashboard (default)
  ↓
NavPanel buttons → onNavigate('contracts'|'jobs'|'time'|'notes'|'settings'|'dashboard')
  ↓
Parent (page.tsx) updates currentPage state
  ↓
Conditional render: <Contracts /> | <Jobs /> | <TimeTracking /> etc.
```

### Job Flow
```
Jobs.tsx (frontend)
  ↓ fetch(`/api/jobs?offset=0&limit=40`)
jobs/route.ts (API)
  ↓ (fetch from external source, classify type, return)
Response: { jobs: Job[], total: number, hasMore: boolean }
  ↓
setDisplayedJobs([...prev, ...newJobs])
  ↓
filtered = displayedJobs.filter(job => matchSearch && matchType && ...)
  ↓
Render <motion.a> for each filtered job
```

### Contract/Entry Flow
```
TimeTracking.tsx or Contracts.tsx (user creates)
  ↓
setContracts([...contracts, newContract])
  ↓
useEffect: localStorage.setItem('contracts', JSON.stringify(contracts))
  ↓
On next load: useEffect reads localStorage, setContracts(saved)
```

---

## Animation Standards (LOCKED)

**All list items use:**
```typescript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.3 } }
}
const itemVariants = {
  hidden: { opacity: 0, y: 5 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
}
```

**Applied to**: Jobs items, contract entries, time entries, dashboard lists
**DO NOT CHANGE** without explicit user approval

---

## Responsive Design Pattern

### Mobile (< 768px)
- Full-width content
- Panels overlay (FilterPanel, NavPanel slide in)
- Nav buttons trigger panel slide
- No margin shifts for content

### Desktop (≥ 768px)
- Fixed left nav (80px wide)
- Panels on right (384px wide)
- Content shifts LEFT by 384px when panel opens (marginRight: 384px)
- Side-by-side layout

**Key Files**: Jobs.tsx, Contracts.tsx (both have `isMd` state + responsive styles)

---

## Styling System

### Colors (Tailwind CSS)
- `bg-dark`: Dark background (#0f0d0a)
- `text-cream`: Light text (#faf7f2)
- `bg-coral`: Button color (#ff6b6b)
- `text-mint`: Highlight (#6cd57a)
- `border-border`: Divider (#2a2420)

### Typography
- **Body/Messages**: EB Garamond serif, 15px, font-light (300)
- **Headings**: EB Garamond serif, 28px, font-light (300)
- **Mono/Data**: DM Mono monospace, 12-14px
- **Tags/Labels**: Space Grotesk sans, 10-12px

### Spacing
- Containers: `px-4 md:px-8 py-4`
- Lists: `border-t border-border py-3`
- Panels: 384px width (w-96 in Tailwind)

---

## API Endpoints

### `/api/jobs`
**Method**: GET
**Query params**: `offset` (default 0), `limit` (default 40)
**Response**:
```typescript
{
  jobs: Job[],          // Array of job objects
  total: number,        // Total jobs available
  hasMore: boolean      // More jobs available beyond this batch
}
```

**Job classification**: `getJobType(title)` maps keywords to: Frontend, Backend, Full Stack, Design, Product, DevOps, Data Science, Mobile, AI/ML, Security, Cloud

---

## Build & Deployment

**Framework**: Next.js 14 (Turbopack)
**Build command**: `npm run build`
**Deploy**: `vercel deploy --prod` (requires approval before running)
**Environment**: None required (public jobs API)

---

## Known Constraints & Rules

1. **localStorage only** — no backend DB, data lost on browser clear
2. **No emojis** — use Phosphor/Radix icons only
3. **Animation values locked** — stagger 0.08, duration 0.4, y: 5
4. **Deploy requires approval** — always ask before `vercel deploy --prod`
5. **No full file rewrites** — use minimal Edit diffs only
6. **Responsive first** — mobile design, enhance on desktop
7. **Smooth scroll** — `scroll-behavior: smooth` in globals.css

---

## Common Tasks Reference

| Task | File | Key Code |
|------|------|----------|
| Add new list item animation | Any `**/pages/*.tsx` | Use containerVariants + itemVariants (copy exact) |
| Change button color | Any component | Replace Tailwind class (bg-coral → bg-mint) |
| Fix responsive layout | Jobs.tsx, Contracts.tsx | Check `isMd` state + marginRight/width styles |
| Add API filter | jobs/route.ts | Add to query logic, return in response |
| Export contract data | Contracts.tsx | handleDownloadCSV function (CSV blob creation) |
| Change filter dropdown | FilterPanel.tsx | Update CustomDropdown options prop |

---

## Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14, React 18, TypeScript |
| **Styling** | Tailwind CSS + inline styles (rare) |
| **Animation** | Framer Motion (containerVariants pattern) |
| **Icons** | Radix UI Icons (@radix-ui/react-icons) |
| **Scroll** | Lenis (smooth scroll lib) |
| **Notifications** | Custom Toast component |
| **Build** | Turbopack (Next.js default) |
| **Hosting** | Vercel (preview + production) |

---

## References

- **Animation rules**: See CLAUDE.md "STRICT ANIMATION STANDARDS"
- **Design system**: See UI_STANDARDS.md
- **Filter logic**: See FREE-APP-GUIDELINES.md section 3
- **Component patterns**: See FREE-APP-GUIDELINES.md section 5
