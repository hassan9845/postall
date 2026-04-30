# Design Brief

## Tone & Purpose
Editorial + Professional. Content creators need speed, consistency, and confidence. Every visual choice removes cognitive friction.

## Color Palette

| Token | OKLCH Values | Purpose |
| --- | --- | --- |
| Primary | 0.55 0.12 165 | Publish action, forward motion (emerald teal) |
| Accent | 0.65 0.15 165 | Highlights, active platform selector (bright teal) |
| Secondary | 0.4 0.02 200 | Neutral, supporting text |
| Destructive | 0.55 0.22 25 | Revoke/delete only (red) |
| Success | 0.60 0.14 150 | Post published, confirmation (green) |
| Background Light | 0.976 0.002 247.839 | Cream off-white |
| Background Dark | 0.11 0.005 250 | Charcoal |
| Border | 0.92 0.004 270 | Subtle dividers, crisp edges |

## Typography
- **Display**: General Sans (bold, geometric, friendly confidence for headings)
- **Body**: DM Sans (clean, high x-height legibility for captions, character counts)
- **Mono**: Geist Mono (hashtags, code snippets, platform-specific formatting)

## Shape Language
- Border radius: 0.375rem (crisp, minimal, not rounded)
- Edges: Favor sharp lines, elevation through borders not shadows
- Composition: Card-based, grid-aligned, generous whitespace

## Structural Zones

| Zone | Background | Border | Details |
| --- | --- | --- | --- |
| Header | bg-card | border-b | Sticky, logo + user menu, elevated |
| Main Content | bg-background | — | Post creation card (white, centered, prominent) |
| Platform Panel | bg-muted/30 | border-l | Platform checkboxes with icons |
| Optimization Panel | bg-muted/40 | border-l | AI suggestions, hashtag list, Optimize button |
| Footer | bg-muted/20 | border-t | Publish history link, settings |

## Component Patterns
- **Buttons**: Primary emerald for publish/optimize, secondary slate for cancel, destructive red for revoke
- **Text Fields**: Light gray background (bg-input), border-border, focus: ring outline in emerald
- **Checkboxes/Radios**: Platform icons + label, accent color on select
- **Cards**: White (light mode), border-border, shadow-subtle, hover: shadow-elevated
- **Status Indicators**: Per-platform badges with platform color accent

## Motion & Transitions
- Default transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)
- Publish button: Micro-animation on click (scale 0.98 → 1.0, opacity pulse)
- Optimization suggestions: Fade-in 0.2s staggered
- Platform icons: Subtle pulse on hover

## Spacing & Rhythm
- Base unit: 0.5rem
- Content padding: 1.5rem (cards), 1rem (inline elements)
- Gaps between sections: 1.5rem–2rem
- Dense information (hashtags, platform list): 0.75rem gaps

## Signature Detail
Platform-aware design throughout: Instagram's pink accent on selection, Facebook's blue, TikTok's magenta. Each platform choice visually reinforces the multi-platform narrative. No generic checkboxes—platform icons are the primary selection mechanism.

## Constraints
- High contrast text (L-diff ≥ 0.7) for accessibility
- No rainbow palettes or gradient backgrounds
- Card elevation through borders + shadow-subtle, not blur
- Platform-specific accent colors override primary for platform-selected states
- Dark mode palette: Charcoal background, elevated card background, reduced contrast for secondary elements to prevent eye strain

## Responsive
- Mobile-first: Single column post creation, platform selector becomes pill list horizontally scrollable
- Tablet: Post card + side panels side-by-side with max-width container
- Desktop: Full layout with sticky header, left sidebar navigation (if needed future), main content, right optimization panel

