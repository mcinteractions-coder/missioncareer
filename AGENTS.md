# Architecture rules
- Scope temporary public festival tokens to a route-aware shared wrapper, with decorative content in a dedicated component; this includes floating panels while leaving admin tools unchanged.
- Keep the static university logo catalogue as CDN asset pointers with original source URLs; avoid runtime logo services and preserve trademark artwork unchanged.
- Keep sourced study-cost figures (each with its source link or an explicit estimate marker) in src/lib/study-cost-data.ts and the budget formula in src/lib/study-budget.ts, both used by the comparison and calculator pages, with tests next to them; why: both tools must show the same, traceable numbers.
