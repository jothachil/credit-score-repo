# Prototype starter

A ready-to-fork boilerplate for quickly building mobile-first prototypes. Fork
this folder, rename it, and start building — fonts, colors, and a debug panel
are already wired up.

## Stack

- **Next.js 16** (App Router) + **React 19**
- **Tailwind CSS v4** (configured in `app/globals.css`, no `tailwind.config`)
- **Base UI** (`@base-ui/react`) for accessible primitives (drawers, tabs, switches…)
- **Framer Motion** for animation
- **Jotai** for state (used by debug flags)
- **Tabler Icons** + **dotLottie** for icons/animations
- **Bun** as the package manager, **Biome** for lint + format

## Getting started

```bash
bun install
bun run dev        # http://localhost:3000
```

`.claude/launch.json` runs dev on port 3001 for the Claude Code preview.

## What's set up

### Fonts
**Lufga** (weights 400–900 + italic) is self-hosted in `public/fonts` and loaded
via `next/font/local` in `app/layout.js`. It's the default `font-sans`.

### Colors
The token system in `app/globals.css` **mirrors the Figma variable collection**,
in two layers:

1. **Primitives** — the raw palette ramps (`Grey`, `Cerise Pink`, `Fire Red`,
   `Mountain Green`, `Sunrise Yellow`, `Electric Purple`, `Cobalt Blue`). Defined
   as `--grey-01 … --cerise-pink-10` etc. Not exposed as utilities — only
   referenced by the semantic tokens.
2. **Semantic** — Figma's `content/*`, `background/*`, `border/*` tokens. Figma's
   `/` becomes `-` in code, so the utility for a token is its Figma path with
   slashes swapped:

   | Figma variable                       | Utility                              |
   | ------------------------------------ | ------------------------------------ |
   | `content/primary`                    | `text-content-primary`               |
   | `content/secondary`                  | `text-content-secondary`             |
   | `content/tertiary`                   | `text-content-tertiary`              |
   | `content/brand`                      | `text-content-brand`                 |
   | `content/negative`                   | `text-content-negative`              |
   | `content/inverse-primary`            | `text-content-inverse-primary`       |
   | `background/primary`                 | `bg-background-primary`              |
   | `background/secondary`               | `bg-background-secondary`            |
   | `background/brand`                   | `bg-background-brand`               |
   | `background/pressed/primary-button`  | `bg-background-pressed-primary-button` |
   | `background/pressed/secondary-button`| `bg-background-pressed-secondary-button` |
   | `border/primary`                     | `border-border-primary`             |
   | `border/selected`                    | `border-border-selected`            |
   | `border/brand`                       | `border-border-brand`               |
   | `border/negative`                    | `border-border-negative`            |

   (Plus the `light/*`, `warning`, `postive`, `inverse`, `inactive`, `overlay`
   variants — see `globals.css` for the full list.)

Every semantic token works across `bg-*`, `text-*`, and `border-*`. **Components
use only these tokens** — no raw `zinc-*` or hex. To re-skin, repoint a semantic
token to a different primitive (or edit a primitive ramp). The mobile-frame
backdrop in `app/layout.js` and the dev-only debug panel still use Tailwind's
`zinc` scale, since they're scaffolding rather than product UI.

> Note: `postive` (missing the second “i”) matches the spelling in the Figma
> file, kept intentionally so code and design tokens line up 1:1.

### Typography scale
A custom scale (`text-xss` → `text-display-1`) with paired line-heights lives in
the `@theme` block of `app/globals.css`.

### Layout
`app/layout.js` centers a `max-w-[400px]` mobile frame on a neutral backdrop —
the standard canvas for these prototypes.

### Debug panel
`app/components/DebugNavigationSidebar.js` renders a floating panel (desktop
only) with two tabs:
- **pages** — jump between screens. Register routes in the `debugPages` array.
- **flags** — toggle scenarios. Define them in `app/state/debugFlags.js`; each
  flag persists to `localStorage`. Read one anywhere with
  `useAtomValue(debugFlagAtoms.yourFlag)`.

## Reference page
`app/page.js` ships as a living style guide (type scale, color swatches, button).
Replace it with your first screen.

## Conventions
- `@/*` path alias points at the project root (see `jsconfig.json`).
- This Next.js version has breaking changes vs. older releases — see `AGENTS.md`.
