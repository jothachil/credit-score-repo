<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Always build components on Base UI

Every interactive component in `app/components/` MUST be built on a Base UI
primitive (`@base-ui/react/*`) when one exists. Do not hand-roll inputs, menus,
dialogs, etc. with raw DOM elements — Base UI gives us accessibility, keyboard
handling, and focus management for free. Our job is styling + design tokens on
top of it.

Before building any component:
1. Check the list below for a matching Base UI primitive.
2. Read its docs at `https://base-ui.com/react/components/<slug>.md` (the `.md`
   variant is the LLM-friendly version — e.g. `.../components/select.md`).
   Full index: `https://base-ui.com/llms.txt`.
3. Verify the installed API: `node -e "console.log(Object.keys(require('@base-ui/react/<slug>')))"`
   — the installed version (`@base-ui/react` in package.json) is the source of
   truth; data-attribute and prop names can differ from the public docs.
   **Not every exported part is a renderable component.** Some are imperative
   helpers/classes (e.g. `Drawer.Handle` is a class used with
   `Drawer.createHandle`, NOT JSX — rendering `<Drawer.Handle>` throws "Class
   constructor … cannot be invoked without 'new'"). When a part looks unusual,
   check its type:
   `node -e "const {X}=require('@base-ui/react/<slug>'); console.log(typeof X.Part, X.Part?.\$\$typeof)"`
   — a real component is a function/object with `Symbol(react.forward_ref)`.
4. Compose the primitive's parts, apply our semantic color tokens (see
   `app/globals.css`), and match the Figma design.

Only drop to a plain element when no Base UI primitive fits (e.g. a pure layout
wrapper). Note the import slug differs from the part name: e.g.
`import { RadioGroup } from "@base-ui/react/radio-group"`.

## Available Base UI components

Accordion · Alert Dialog · Autocomplete · Avatar · Button · Checkbox ·
Checkbox Group · Collapsible · Combobox · Context Menu · Dialog · Drawer ·
Field · Fieldset · Form · Input · Menu · Menubar · Meter · Navigation Menu ·
Number Field · OTP Field · Popover · Preview Card · Progress · Radio ·
Scroll Area · Select · Separator · Slider · Switch · Tabs · Toast · Toggle ·
Toggle Group · Toolbar · Tooltip

Already wired up in `app/components/`:

| File                       | Base UI primitive(s)        |
| -------------------------- | --------------------------- |
| `Button.js`                | Button                      |
| `Checkbox.js`              | Checkbox                    |
| `TextField.js`             | Input (+ framer-motion)     |
| `OTPField.js`              | OTP Field                   |
| `RadioField.js`            | Radio + Radio Group         |
| `TabsField.js`             | Tabs                        |
| `Toast.js`                 | Toast (createToastManager)  |
| `BottomSheet.js`           | Drawer (swipeDirection down) |
| `DebugNavigationSidebar.js`| Tabs + Switch               |
| `NavBar.js`                | none — plain layout bar (uses `next/navigation`) |

# Styling conventions

- **Use semantic color tokens only.** Product UI must use the Figma-mirrored
  tokens from `app/globals.css` (`content/*`, `background/*`, `border/*` →
  `text-content-primary`, `bg-background-brand`, `border-border-primary`, …) —
  never raw `zinc-*` or hex. Primitive ramps (`--grey-*`, `--cerise-pink-*`, …)
  are referenced by tokens, not used directly. **Exception:** dev-only
  scaffolding (`DebugNavigationSidebar.js`, the frame backdrop in `layout.js`)
  intentionally uses `zinc-*` since it isn't product UI.
- **State styling comes from Base UI `data-*` attributes**, not JS props: e.g.
  `data-active:` (Tabs), `group-data-checked:` / `group-data-disabled:` /
  `group-data-focused:` (Checkbox/Radio), `data-starting-style:` /
  `data-ending-style:` (Toast/Drawer transitions). Put `group` on the Base UI
  Root and read it with `group-data-*` on a styled child.
- **Variant styling:** for a single axis (like Button's `variant`), use a plain
  object map of class strings — no dependency. Only reach for
  `class-variance-authority` (+ `tailwind-merge`) once a component needs **2+
  variant axes or compound variants** (e.g. `size` × `variant`). Keep the
  starter dependency-light.
- **`cursor-pointer` on every interactive element** (buttons, tabs, switches,
  the checkbox/radio controls), plus `disabled:cursor-not-allowed` where it can
  be disabled. Links get the pointer cursor for free.
- **Accessibility:** label every field. For OTP, Base UI uses the *first* input
  as the field's labelable control, so attach a (sr-only) `<label htmlFor>` to
  it rather than per-input `aria-label`. Keep focus-visible rings.

# Design-system catalog

Every component gets a showcase page under `app/design-system/<slug>/page.js`,
wrapped in `SectionShell` (which renders `NavBar`). Register the section in
`app/design-system/sections.js` so it appears on the index. The index is
reachable from the debug panel's "Design system" button. When you add a new
component, add its catalog page + section entry.

# Before finishing

Run `bun run lint` and `bun run build` — both must pass. `bun run format` fixes
Biome formatting. Tailwind directives (`@theme`, etc.) require
`css.parser.tailwindDirectives: true` in `biome.json` (already set).
