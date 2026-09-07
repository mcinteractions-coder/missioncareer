# Ganpati Festival Theme

Transform the entire public website into an elegant Ganesh Chaturthi experience, including the surfaces that previously hid festival backgrounds.

## What will change

- Add a premium Ganpati visual layer with a central Lord Ganesha artwork, marigold torans, diyas, rangoli details, modaks, petals, and subtle festive particles.
- Add a tasteful opening festival banner and recurring Ganpati dividers so the theme remains visible throughout the long page.
- Theme the actual foreground surfaces—not only the page background—including cards, section bands, forms, inputs, navigation, badges, buttons, the chatbot panel, WhatsApp button, and festival popup.
- Use warm saffron, vermilion, marigold-gold, leaf-green, and ivory through semantic site tokens while preserving contrast in light and dark modes.
- Add restrained animations: diya flicker, toran sway, drifting petals, shimmer, and a gentle Ganesha halo; all stop automatically for visitors who prefer reduced motion.
- Keep decorations click-through and layer-safe so forms, menus, popups, and floating controls remain fully usable.
- Remove any stale previous-festival markup/styles that could cause the current hydration mismatch.

## Technical details

- Create one reusable Ganpati theme component for ambient overlays, flow-safe banners, and repeated section ornaments.
- Generate and locally import cohesive Ganpati artwork rather than hotlinking images.
- Scope theme styling under a homepage theme wrapper so the admin area remains unchanged.
- Use CSS selectors within that wrapper to reach existing elevated cards and overlays without rewriting every section individually.
- Add explicit theme hooks to globally mounted foreground panels where wrapper-scoped styling cannot reach them.
- Verify the live homepage at desktop and mobile widths, including popup/chat/nav layering, readability, animations, and browser console hydration status.
