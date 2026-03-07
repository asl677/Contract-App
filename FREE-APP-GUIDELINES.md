# free-app Development Guidelines

**Critical Reference Document** — All animations, styling, and filter rules documented here.
**Last Updated**: 2026-03-07
**Status**: FROZEN — Do not modify without explicit user approval

---

## Table of Contents

1. [Animation Patterns (LOCKED)](#animation-patterns-locked)
2. [Filter System Rules](#filter-system-rules)
3. [Styling & Spacing Constraints](#styling--spacing-constraints)
4. [Component Patterns](#component-patterns)
5. [What NOT To Do](#what-not-to-do)

---

## Animation Patterns (LOCKED)

### Filter Panel Side Panel Animation

**LOCATION**: `/Users/alexlakas/free-app/components/FilterPanel.tsx`

**EXACT CODE** (do not modify):

```jsx
<motion.div
  initial={{ x: '100%' }}
  animate={{ x: 0 }}
  exit={{ x: '100%' }}
  transition={{ duration: 0.3, ease: 'easeInOut' }}
  className="fixed top-0 right-0 w-full md:w-96 h-screen bg-dark z-50 overflow-y-auto border-l border-cream/10 md:left-auto md:top-auto"
>
```

**Key Metrics** (DO NOT CHANGE):
- Panel entry: `x: '100%' → 0` (slide in from right)
- Panel exit: `x: '100%'` (slide out to right)
- Duration: `0.3` seconds
- Easing: `easeInOut`
- Width: Full screen mobile (`w-full`), 384px desktop (`md:w-96`)
- Z-index: `z-50` (above job listings)

**Content Shift Pattern** (Jobs.tsx):
```jsx
// Outer wrapper
<div style={{ marginRight: showFilters ? 384 : 0, transition: 'margin-right 0.3s ease-in-out' }}>

// Fixed header
<motion.div style={{ marginRight: showFilters ? 384 : 0, transition: 'margin-right 0.3s ease-in-out' }}>

// Main content
<motion.div style={{ marginRight: showFilters ? 384 : 0, transition: 'margin-right 0.3s ease-in-out' }}>
```

**Key Points**:
- Content shifts left by 384px when panel opens
- Smooth 0.3s transition matches panel animation
- ALL fixed elements must shift (header, main content, outer wrapper)
- Backdrop fades in/out with panel

---

### Jobs Page Container Animation

**LOCATION**: `/Users/alexlakas/free-app/components/pages/Jobs.tsx` (lines 9-27)

**EXACT CODE** (do not modify):

```typescript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
}
```

**Key Metrics** (DO NOT CHANGE):
- Container initial state: `opacity: 0`
- Container animate state: `opacity: 1`
- Stagger children: `0.08` seconds (80ms between each item)
- Initial delay before stagger: `0.3` seconds (300ms)
- Each item duration: `0.4` seconds (400ms)
- Item entry: `opacity: 0 → 1`, `y: 10 → 0` (slide up fade)

**Applied To**:
- All job items in the filtered list (lines 365-390)
- Divider lines above each job (line 369)
- Every element within the container gets this animation

**User Approval History**:
- ✅ LOCKED 2026-03-06 after multiple iterations
- ✅ User confirmed: "YEs please store in memory and leave it alone"
- ✅ If changed without request, user will switch AI models

---

### Filter Box Height Animation

**LOCATION**: `/Users/alexlakas/free-app/components/pages/Jobs.tsx` (lines 269-274)

**EXACT CODE** (do not modify):

**EXACT CODE**:
```jsx
<motion.div
  className="fixed top-24 left-0 right-0 md:left-20 z-50 bg-dark"
  initial={{ maxHeight: 0 }}
  animate={{ maxHeight: showSearch ? 500 : 0 }}
  transition={{ duration: 0.4, ease: 'easeInOut' }}
  style={{ overflow: 'hidden' }}
>
  {/* search + selectors here */}
</motion.div>
```

**Key Metrics** (DO NOT CHANGE):
- Z-Index: `z-50` (dropdowns render above job listings)
- maxHeight open: `500px` (large enough for dropdown menu expansion)
- maxHeight closed: `0px`
- overflow: `'hidden'` (required for collapse to work)
- Duration: `0.4` seconds
- Easing: `easeInOut`

**Why maxHeight: 500px**:
- Search input: 36px
- Gap: 6px
- Selector buttons: 36px
- Padding: 24px
- Dropdown menu expansion: ~350px (12 options × 32px each)
- Total needed: ~450px, so 500px is safe buffer
- If smaller than ~450px, dropdown menus get clipped by overflow: hidden

---

### Page Transition Animation

**LOCATION**: Applied to route changes in app structure

**PATTERN**:

```jsx
<motion.div
  key={currentPage}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.2 }}
>
```

**Key Metrics**:
- Duration: `0.2` seconds (fast, barely noticeable)
- No exit animation (prevents double flicker)
- Quick fade on navigation

---

### CustomDropdown Animation

**LOCATION**: `/Users/alexlakas/free-app/components/CustomDropdown.tsx` (lines 60-64)

**EXACT CODE** (do not modify):

```jsx
<motion.div
  initial={{ opacity: 0, y: -8 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -8 }}
  transition={{ duration: 0.15 }}
```

**Key Metrics**:
- Duration: `0.15` seconds
- Entry: `opacity: 0 → 1`, `y: -8 → 0` (slide down)
- Exit: `opacity: 0`, `y: -8`

---

## Filter System Rules

### Employment Type Filter

**Introduced**: 2026-03-07

**Filter Values**:
- `All` — Shows all jobs
- `Full-time` — Full-time employment only
- `Fractional` — Part-time, contract, temp, intern, vendor, short-term, 6-month, 3-month

**Data Mapping Function** (line 61-71 in Jobs.tsx):

```typescript
const getEmploymentType = (duration: string): string => {
  const lowerDuration = duration.toLowerCase()
  if (lowerDuration === 'full-time') return 'Full-time'
  if (lowerDuration.includes('part-time') ||
      lowerDuration.includes('contract') ||
      lowerDuration.includes('temp') ||
      lowerDuration.includes('intern') ||
      lowerDuration.includes('vendor') ||
      lowerDuration.includes('short term') ||
      lowerDuration.includes('6 month') ||
      lowerDuration.includes('3 month')) return 'Fractional'
  return 'Fractional' // Default
}
```

**Rules**:
- ✅ Maps job `duration` field to employment category
- ✅ Case-insensitive matching
- ✅ Defaults to "Fractional" for ambiguous cases
- ✅ Updated in filter logic (line 224 in Jobs.tsx)

### Type Filter

**Filter Values**: All, Frontend, Backend, Full Stack, Design, Product, DevOps, Data Science, Mobile, AI/ML, Security, Cloud

**Data Source**: `job.type` field (derived from job title in API)

### Location Filter

**Filter Values**: All, Remote, San Francisco CA, New York NY, Austin TX, Seattle WA, Los Angeles CA, Chicago IL, Boston MA

**Data Source**: `job.location` field from API

### Source Filter

**Filter Values**: Dynamically derived from `job.board` field

**Data Sources**:
- Y Combinator
- Figma (Greenhouse)
- Airbnb (Greenhouse)
- Dropbox (Greenhouse)
- Asana (Greenhouse)
- Stripe (Greenhouse)
- Notion (Greenhouse)
- GitLab (Greenhouse)
- Vercel (Greenhouse)
- Linear (Greenhouse)
- Retool (Greenhouse)
- Zapier (Greenhouse)
- Loom (Greenhouse)
- Intercom (Greenhouse)
- Datadog (Greenhouse)

---

## Styling & Spacing Constraints

### Filter Box Spacing

**Desktop Filter Layout** (lines 273-295):
```
Layout: Single row, 5-column grid
Columns: Search | Type | Location | Source | Employment Type
Spacing: gap-1.5 (6px between columns), py-3 (12px padding top/bottom)
Input padding: py-2 (8px top/bottom)
Employment filter: Positioned to the right of Source (column 5 of 5)
```

**Mobile Filter Layout** (lines 302-337):
```
Layout: Vertical stack (space-y-1.5 = 6px gap)
Row 1: Search input (full width)
Row 2: 2-column grid (Type, Location)
Row 3: Source filter (full width)
Row 4: Employment filter (full width)
Spacing: space-y-1.5 (6px between rows), py-3 (12px padding top/bottom)
Input padding: py-2 (8px top/bottom)
```

### Input/Dropdown Styling (LOCKED)

**Rules**:
- Border radius: `0` (NO rounded corners)
- Background: White (`white`)
- Border: Black, 1px (`border border-black`)
- Text color: Black (`text-black`)
- No box shadow
- No outline on focus

**Code Pattern**:
```jsx
className="w-full px-4 py-2 border border-black transition-colors focus:outline-none focus:border-black focus:ring-0"
style={{ backgroundColor: 'white', color: 'black', borderRadius: 0, outline: 'none', boxShadow: 'none' }}
```

---

## Component Patterns

### Divider Animation Pattern

**REQUIRED**: Every job item must have a divider line that animates with the stagger

**Code Pattern** (line 367-370):
```jsx
<motion.div key={`${job.id}-${job.url}`} className="relative" variants={itemVariants} layout>
  <motion.div
    className="absolute top-0 left-0 right-0 h-px bg-border"
    variants={itemVariants}  // ← CRITICAL: Must use itemVariants
  />
  {/* Job content */}
</motion.div>
```

**Key Points**:
- Divider has `variants={itemVariants}` so it animates with stagger
- Height: `h-px` (1px line)
- Color: `bg-border` (from design tokens)
- Position: Absolute at top of job item
- **DO NOT delete this divider animation**

### CustomDropdown Component Pattern

**Location**: `/Users/alexlakas/free-app/components/CustomDropdown.tsx`

**Key Design Decision**: NO CARET ICONS
- Removed SVG arrow/chevron from all dropdowns (2026-03-07)
- Dropdowns open/close on click without visual caret indicator
- Applies to ALL selector dropdowns: Filter panel, Create Contract, etc.
- Reason: Cleaner visual appearance, dropdown state indicated by content change

**Code Pattern**:
```jsx
<button
  onClick={() => setIsOpen(!isOpen)}
  className="w-full px-4 py-3 bg-white border border-black text-black text-left"
>
  <span>{displayFormat(value)}</span>
  {/* NO SVG CARET - removed 2026-03-07 */}
</button>
```

**Applied To**:
- FilterPanel (Jobs page, all filter dropdowns)
- CreateContractPanel (contract form dropdowns)
- Any future selector dropdowns must use CustomDropdown component
- NEVER add caret icons back to dropdowns

### Load More Button Pattern

**Location**: Lines 406-420

**Behavior**:
- Shows when more jobs available and not currently loading
- Clicking triggers `fetchJobs(offset)` to load next page
- Animate presence with `AnimatePresence mode="wait"`

### End of List Message

**Location**: Lines 421-425

**Behavior**:
- Shows "No more jobs" when `!hasMore && displayedJobs.length > 0`
- Toast notification shows "End of List" on first reach

---

## What NOT To Do

### Animation Anti-Patterns ❌

- ❌ **Change stagger timing** — Must stay at `0.08` seconds
- ❌ **Change animation duration** — Must stay at `0.4` seconds for items
- ❌ **Delete divider animations** — Dividers must have `variants={itemVariants}`
- ❌ **Modify container variants** — Do not add/remove states without approval
- ❌ **Use different easing** — Always use `easeInOut` for filter box, default for items
- ❌ **Change maxHeight values** — Filter box must be `280px` when open
- ❌ **Use `overflow: 'hidden'`** — Filter box needs `overflow: 'visible'` for dropdowns

### Spacing Anti-Patterns ❌

- ❌ **Reduce container `py` below `py-3`** — Clips dropdown menu
- ❌ **Use `gap` values < 6px** — Creates visual clutter (minimum `gap-1.5`)
- ❌ **Add `overflow: hidden` to filter container** — Clips dropdown menus
- ❌ **Change input padding without testing dropdowns** — Always test after spacing changes

### Filter Logic Anti-Patterns ❌

- ❌ **Forget to add filter to `filtered` useMemo** — Filter won't work
- ❌ **Forget to add filter state to dependency array** — Causes stale filter results
- ❌ **Hardcode employment mappings** — Always use `getEmploymentType()` function
- ❌ **Change employment categories without user approval** — Locked categories

### Styling Anti-Patterns ❌

- ❌ **Add border radius to inputs** — Must be `borderRadius: 0`
- ❌ **Use non-white backgrounds for dropdowns** — Must be white
- ❌ **Add custom styling without user design** — Keep minimal: white bg, black border

---

## Testing Checklist

Before committing ANY changes to Jobs.tsx:

- [ ] All jobs animate in with stagger (0.08s between items)
- [ ] Divider lines animate with each job
- [ ] Filter box opens/closes smoothly (0.4s)
- [ ] Dropdown menus fully visible (not clipped)
- [ ] Employment filter works (Full-time vs Fractional)
- [ ] All four filters work together (can combine Type + Location + Source + Employment)
- [ ] No console errors
- [ ] Smooth scroll works (scroll-behavior: smooth in globals.css)

---

## Emergency Revert Guide

If animations/styling break unexpectedly:

1. **Check this document first** — Compare current code to EXACT CODE sections
2. **Check MEMORY.md** — User feedback history and approval status
3. **Revert to last known good commit** — Ask user which commit worked
4. **DO NOT guess or rebuild** — Always ask for explicit guidance

**Never make assumptions about what "should" work. Always verify against this document.**

---

## Last Modified

- **2026-03-07**: Added employment type filter, locked animation patterns
- **2026-03-06**: Initial guidelines document created
