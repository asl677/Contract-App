# free-app Development Guidelines

**Last Updated**: 2026-03-07

## Critical Documents

**READ THESE FIRST**:
1. **[UI_STANDARDS.md](./UI_STANDARDS.md)** — Global animation, layout, and interaction standards (1s transitions, stagger delays, Safari fixes)
2. **[FREE-APP-GUIDELINES.md](./FREE-APP-GUIDELINES.md)** — Master reference for ALL animation, styling, and filter rules
3. **[Project Memory](../../.claude/projects/-Users-alexlakas/memory/MEMORY.md#free-app-comprehensive-animation--filter-guidelines-2026-03-07)** — User preferences and locked rules

---

## Quick Reference

### Animation Rules (LOCKED - DO NOT CHANGE)

```typescript
// Jobs page animations - exact values, never modify
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.3 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 5 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
}
```

**Key Metrics**:
- Stagger: 0.08s (80ms between items)
- Initial delay: 0.3s (300ms before first item)
- Duration: 0.4s per item
- Entry: opacity 0→1, slide up (y: 10→0)

**Applied to**: ALL job items, dividers, container animations

### Side Panel Pattern (2026-03-07 - ALL PANELS FOLLOW THIS)

**ALL side panels (FilterPanel, CreateContractPanel, etc.) MUST use this exact pattern:**

**Panel Component** (e.g., `components/FilterPanel.tsx`):
```jsx
// Panel positioning - fills entire viewport on mobile, right side on desktop
className="fixed inset-0 md:inset-auto md:top-0 md:right-0 md:w-96 md:h-screen"

// Background - white on mobile, dark on desktop
className="bg-white md:bg-dark"

// Header background - matches panel
className="bg-white md:bg-dark"

// Header text - dark on mobile, cream on desktop
className="text-dark md:text-cream"
```

**Parent Page Component** (e.g., `components/pages/Jobs.tsx`):
```jsx
// 1. Add breakpoint detection
const [isMd, setIsMd] = useState(false)
useEffect(() => {
  const checkMd = () => setIsMd(window.innerWidth >= 768)
  checkMd()
  window.addEventListener('resize', checkMd)
  return () => window.removeEventListener('resize', checkMd)
}, [])

// 2. Only shift content on desktop (md and up)
style={{ marginRight: isMd && showFilters ? 384 : 0, transition: 'margin-right 0.3s ease-in-out' }}
```

**Behavior**:
- Mobile: Panel fills entire viewport (inset-0), white background, no content shift
- Desktop: Panel 384px wide on right, dark background, content shifts left by 384px
- Transition: 0.3s ease-in-out for margin shift

**Employment Type Mapping** (Jobs-specific):
- Full-time: Only "full-time" label
- Fractional: Part-time, contract, temp, intern, vendor, short-term, 6-month, 3-month

### Navigation Panel Pattern (Mobile-First - 2026-03-07)

**NavPanel Component** (`components/NavPanel.tsx`):

**Panel Animation**:
```jsx
// Panel slides down from TOP on mobile (not left/right)
initial={{ y: '-110%' }}
animate={{ y: 0 }}
exit={{ y: '-110%' }}
transition={{ duration: 0.3, ease: 'easeInOut' }}

// On mobile: full-width horizontal panel at top
// On desktop: 384px vertical panel on left
className="fixed left-0 right-0 top-0 w-full bg-white md:inset-y-0 md:w-80 md:left-0 md:right-auto md:bg-dark z-50 border-b md:border-b-0 md:border-r"
```

**Nav Items Animation**:
```jsx
// Items stagger DOWN from top (using y-axis, not x)
navItems.map(({ id, label, Icon }, idx) => (
  <motion.button
    initial={{ opacity: 0, y: -10 }}    // Enter from above
    animate={{ opacity: 1, y: 0 }}      // Drop down
    transition={{ duration: 0.3, delay: idx * 0.05 }}  // Stagger by index
  >
    ...
  </motion.button>
))
```

**Key Rules**:
- ✅ Panel slides DOWN from top (y: '-110%' → 0)
- ✅ Nav items stagger DOWN (y: -10 → 0)
- ✅ Stagger delay: `idx * 0.05` (50ms between items)
- ✅ NO left/right (x-axis) animations
- ✅ Mobile: full-width top panel
- ✅ Desktop: 384px left vertical panel
- ✅ Background: white on mobile, dark on desktop

### Spacing Rules (LOCKED)

**Safe values**:
- Panel width: 384px (w-96 in Tailwind)
- Content shift: marginRight: 384px when panel open
- Transition: 0.3s ease-in-out for smooth shift
- Input padding: px-4 py-2
- Dropdown styling: White bg, black border, borderRadius: 0

**DO NOT CHANGE**:
- Panel z-index (z-50, above job listings)
- Panel animation (x: '100%' → 0 on open)
- Content shifting pattern (all fixed/main elements must shift with panel)

### Styling Rules (LOCKED)

**Inputs & Dropdowns**:
- Border radius: 0 (no rounding)
- Background: white
- Border: black, 1px
- No box shadow, no outline
- **NO CARET ICONS** (removed 2026-03-07) — All dropdown selectors removed SVG arrow icons for cleaner appearance
- Dropdowns open/close on click without visual caret indicator

---

## Before Every Commit

**Checklist**:
- [ ] All job items animate (stagger 0.08s visible)
- [ ] Dividers animate with each job (use `variants={itemVariants}`)
- [ ] Filter box opens/closes smoothly (0.4s)
- [ ] Dropdowns fully visible (not clipped)
- [ ] All 5 filters work together
- [ ] Employment filter categorizes correctly (Full-time vs Fractional)
- [ ] No console errors

---

## What NOT To Do ❌

**Animation**:
- ❌ Change stagger (must be 0.08s)
- ❌ Change duration (must be 0.4s)
- ❌ Delete divider animations
- ❌ Modify containerVariants/itemVariants
- ❌ Use different easing values

**Spacing**:
- ❌ Reduce container padding below py-3
- ❌ Change `overflow: 'visible'` to `'hidden'`
- ❌ Use gap values < 6px

**Filters**:
- ❌ Forget to add filter state to dependency array
- ❌ Forget to add filter logic to `filtered` useMemo
- ❌ Hardcode employment categories (use getEmploymentType function)

---

## Emergency Protocol

**If animations/styling breaks**:

1. Check [FREE-APP-GUIDELINES.md](./FREE-APP-GUIDELINES.md) — compare current code to EXACT CODE sections
2. Check [Project Memory](../../.claude/projects/-Users-alexlakas/memory/MEMORY.md) — user feedback and approval history
3. **DO NOT guess or rebuild** — ask for explicit guidance
4. **DO NOT change animation values** — all are locked per user request

**User Quote (2026-03-06)**:
> "store this in memory, recall this eery time you build an animation, dont delete exsiting ones ever"

This is a CRITICAL rule. Animations are final. Do not modify without explicit user approval.

---

## Stack & Tech

- **Framework**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion (containerVariants + itemVariants pattern)
- **Scroll**: CSS `scroll-behavior: smooth` (in globals.css)
- **UI Components**: CustomDropdown, Toast system
- **Data**: Jobs API at `/api/jobs` with pagination

---

## Project Structure

```
free-app/
├── components/
│   ├── pages/
│   │   └── Jobs.tsx           ← Main jobs page (ALL animations here)
│   ├── CustomDropdown.tsx     ← Dropdown with slide animation
│   └── Toast.tsx
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css            ← scroll-behavior: smooth defined here
│   └── api/
│       └── jobs/
│           └── route.ts       ← Job fetching & filtering
├── FREE-APP-GUIDELINES.md     ← MASTER REFERENCE
└── CLAUDE.md                  ← This file
```

---

## References

- **Animation Patterns**: See FREE-APP-GUIDELINES.md sections 1-2
- **Filter System**: See FREE-APP-GUIDELINES.md section 3
- **Styling Constraints**: See FREE-APP-GUIDELINES.md section 4
- **Component Patterns**: See FREE-APP-GUIDELINES.md section 5
- **User Memory**: See project MEMORY.md for history & approvals
