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
4. Compose the primitive's parts, apply our semantic color tokens (see
   `app/globals.css`), and match the Figma design.

Only drop to a plain element when no Base UI primitive fits (e.g. a static
`<button>` styled as a link). Note the import slug differs from the part name:
e.g. `import { RadioGroup } from "@base-ui/react/radio-group"`.

## Available Base UI components

Accordion · Alert Dialog · Autocomplete · Avatar · Button · Checkbox ·
Checkbox Group · Collapsible · Combobox · Context Menu · Dialog · Drawer ·
Field · Fieldset · Form · Input · Menu · Menubar · Meter · Navigation Menu ·
Number Field · OTP Field · Popover · Preview Card · Progress · Radio ·
Scroll Area · Select · Separator · Slider · Switch · Tabs · Toast · Toggle ·
Toggle Group · Toolbar · Tooltip

Already wired up in this starter: **Input** (TextField), **OTP Field**
(OTPField), **Radio** + **Radio Group** (RadioField), **Tabs** (TabsField),
**Toast** (Toast), **Switch** + **Tabs** (DebugNavigationSidebar). Button is a
plain styled `<button>` — swap to Base UI **Button** if you need its features.
