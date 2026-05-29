## Mobile UI Optimization Plan

Abhi har section desktop ke liye banaya gaya hai (py-20/28, text-5xl/6xl/7xl, bade gaps). Phone pe ye sab bohot bada aur "messy" lagta hai. Niche surgical changes har section me karenge — sirf mobile breakpoint (default classes) chhote karenge, `md:` aur upar wale sizes intact rahenge taaki desktop na bigde.

### 1. Hero (`src/components/sections/Hero.tsx`)
- Padding: `pt-28 pb-20` → `pt-24 pb-12 md:pt-32 md:pb-20`
- Heading: `text-5xl md:text-6xl lg:text-7xl` → `text-4xl md:text-6xl lg:text-7xl`
- Subtext: `text-lg` → `text-base md:text-lg`
- Feature pills grid: gap `gap-3` → `gap-2 md:gap-3`, padding `px-4 py-2.5` → `px-3 py-2`
- Stats row: `gap-8` → `gap-5 md:gap-8`, counter `text-3xl md:text-4xl` → `text-2xl md:text-4xl`
- Trust badge text smaller on mobile
- Team grid: `gap-4` → `gap-3 md:gap-4`, TeamCard padding `p-5` → `p-3 md:p-5`, name/role text smaller on mobile

### 2. Section wrappers (About, Services, Destinations, Process, Success, Blog, Contact)
Standard pattern across all:
- `py-20 md:py-28` → `py-12 md:py-24`
- Section headings `text-4xl md:text-5xl` → `text-3xl md:text-5xl`
- Header margin `mb-14` → `mb-10 md:mb-14`
- Card grids: gap `gap-6` → `gap-4 md:gap-6`
- Card padding `p-6` → `p-5 md:p-6`

### 3. Destinations stats banner
- Big stats box padding `p-8` → `p-6 md:p-8`, mt-16 → `mt-12 md:mt-16`
- Counter `text-4xl` → `text-3xl md:text-4xl`

### 4. Process steps
- Step number `text-5xl` → `text-4xl md:text-5xl`
- Icon box `h-12 w-12` → `h-10 w-10 md:h-12 md:w-12`

### 5. Services / Blog / Success / Contact / Footer
- Same compactness: smaller titles, tighter gaps, reduced vertical padding on mobile.
- Footer: padding-top reduction on mobile.

### 6. Navbar
- Logo box already responsive, but tighten `py-4` (un-scrolled) → `py-3 md:py-4` to free up vertical space when hero loads.

### 7. FestivalPopup
- Already max-w-md and responsive — minor: image height `h-56` → `h-44 md:h-56`, padding `p-6` → `p-5 md:p-6`.

### What stays the same
- All content, copy, animations, counter logic, and desktop layout unchanged.
- No business logic / route / data changes.
- Color tokens, gradients, design system — untouched.

### Verification
After edits: open preview at mobile viewport (375–414px) via the device toggle and visually confirm each section is compact and readable. Adjust any section that still feels too tall.

Total: ~7-8 component files ko mobile-responsive utilities ke saath touch karna hai. Koi naya component nahi banega.