# free-app Development Guidelines

**Last Updated**: 2026-03-07

## Critical Documents

**READ THESE FIRST**:
1. **[UI_STANDARDS.md](./UI_STANDARDS.md)** — Global animation, layout, and interaction standards (1s transitions, stagger delays, Safari fixes)
2. **[FREE-APP-GUIDELINES.md](./FREE-APP-GUIDELINES.md)** — Master reference for ALL animation, styling, and filter rules
3. **[Project Memory](../../.claude/projects/-Users-alexlakas/memory/MEMORY.md#free-app-comprehensive-animation--filter-guidelines-2026-03-07)** — User preferences and locked rules

---

## 🚨 STRICT ANIMATION STANDARDS (MANDATORY - CHECK BEFORE EVERY CHANGE)

**RULE**: Before touching ANY animation code, read this section. These values are LOCKED. Violations break the entire app.

### Universal List Animation Pattern (ALL LISTS - Jobs, TimeTracking, Contracts, Dashboard, etc.)

**EXACT CODE - Copy this pattern everywhere:**

```typescript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.3 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 5 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}
```

**LOCKED VALUES (NEVER CHANGE):**
- `staggerChildren: 0.08` (80ms between items)
- `delayChildren: 0.3` (300ms before first item)
- `duration: 0.4` (item animation time)
- `y: 5` (slide up distance)
- `opacity: 0 → 1` (fade in)

**Where to use:**
- ✅ Jobs.tsx entries
- ✅ TimeTracking.tsx entries
- ✅ Contracts.tsx entries
- ✅ Dashboard.tsx lists
- ✅ Any paginated or scrolled list

**Implementation:**
```jsx
<motion.div variants={containerVariants} initial="hidden" animate="visible">
  {items.map((item) => (
    <motion.div key={item.id} variants={itemVariants}>
      {/* content */}
    </motion.div>
  ))}
</motion.div>
```

### Quick Reference

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

## Before Every Commit — STRICT CHECKLIST

**BEFORE touching animation code, verify:**
- [ ] Read the "STRICT ANIMATION STANDARDS" section above
- [ ] Check which page you're modifying
- [ ] Verify containerVariants match: staggerChildren: 0.08, delayChildren: 0.3
- [ ] Verify itemVariants match: y: 5, duration: 0.4
- [ ] If different, update to match EXACT standards above
- [ ] Run locally and test stagger timing visually
- [ ] No changes to animation values without explicit user approval

**Before deploying:**
- [ ] All list items animate in sync (0.08s stagger visible)
- [ ] No items appear out of order or "out of sync"
- [ ] Filter box opens/closes smoothly (0.4s)
- [ ] Dropdowns fully visible (not clipped)
- [ ] All filters work together correctly
- [ ] No console errors

---

## 🚫 ABSOLUTELY FORBIDDEN ANIMATION CHANGES

**NEVER do these things:**

| ❌ Don't | ✅ Do |
|---------|-------|
| Change `staggerChildren` from 0.08 | Keep it 0.08 exactly |
| Change `delayChildren` from 0.3 | Keep it 0.3 exactly |
| Change `duration` from 0.4 | Keep it 0.4 exactly |
| Change `y: 5` to any other value | Keep it `y: 5` |
| Add different easing per item | No easing, use default |
| Delete itemVariants from any list | Use itemVariants on every item |
| Modify containerVariants structure | Keep exact pattern |
| Add `delay: idx * something` manually | Let staggerChildren handle it |
| Remove or rename animation constants | Keep containerVariants/itemVariants |
| Use spring physics on lists | Fade only, no spring |
| Add extra transforms (scale, rotate) | Opacity + y-slide only |

**If you break these rules, the app animates incorrectly and must be reverted immediately.**

---

## What NOT To Do ❌

**Animation**:
- ❌ Change stagger (must be 0.08s) — SEE TABLE ABOVE
- ❌ Change duration (must be 0.4s) — SEE TABLE ABOVE
- ❌ Delete divider animations
- ❌ Modify containerVariants/itemVariants without matching EXACT pattern above
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

## 🔴 CRITICAL ANIMATION RULE (User Directive 2026-03-07)

**STRICT INSTRUCTION FROM USER:**
> "dont change any of the animations again store this in moemory to review and check to not change the standard nanimations inless told"

**This means:**
1. **EVERY time you work on TimeTracking, Jobs, Contracts, Dashboard** = CHECK CLAUDE.md first
2. **Animation values are LOCKED** — staggerChildren: 0.08, duration: 0.4, y: 5
3. **DO NOT experiment** with animation code
4. **DO NOT change values** unless user explicitly says "change animation on X"
5. **If unsure**, ask for approval before touching animation code

**History:** This rule was created because animations were broken 8+ times in a single session by experimenting with animation values. User explicitly stated this rule after each break had to be reverted.

---

## Emergency Protocol

**If animations break (out of sync, items missing, timing wrong)**:

1. **STOP immediately** — don't make more changes
2. Check [STRICT ANIMATION STANDARDS](#-strict-animation-standards-mandatory---check-before-every-change) above — compare to current code
3. Check [Project Memory](../../.claude/projects/-Users-alexlakas/memory/MEMORY.md) — what was the last working state?
4. **DO NOT guess or rebuild** — revert to last working version
5. Ask user for explicit approval before any animation changes

**Recovery steps:**
```
1. git diff — see what changed
2. git checkout — revert to working version
3. Test in browser — verify animations work
4. Ask user before making different changes
```

**User Quote (2026-03-07):**
> "please dont change any of the animations again store this in moemory to review and check to not change the standard nanimations inless told"

This is a **CRITICAL PERMANENT RULE**. Animations are locked. Do not modify without explicit user message saying "change animation on X".

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
