"use client";

import { Radio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";

/**
 * Card-style radio group.
 *
 * Controlled:   <RadioGroup value={v} onValueChange={setV}>
 * Uncontrolled: <RadioGroup defaultValue="a">
 *
 *   <RadioCard value="a">Option A</RadioCard>
 *   <RadioCard value="b">Option B</RadioCard>
 *
 * Each card is the radio control itself (the whole card is clickable). The
 * border turns brand-colored when selected; pass `disabled` per card or on the
 * whole group. Cards lay out in a row and share width evenly; pass
 * `className="flex-col"` on RadioGroup to stack them vertically instead.
 *
 * `compact` drops the radio dot and centres the label, turning the card into a
 * segmented-control chip — selection reads from the brand border, tint, and
 * label colour instead. Use it for short values sitting 3-up in a row, where
 * the dot would push the label onto a second line.
 */
export function RadioGroup({ className = "", ...props }) {
  return <BaseRadioGroup className={`flex gap-3 ${className}`} {...props} />;
}

export function RadioCard({
  children,
  className = "",
  compact = false,
  ...props
}) {
  return (
    <Radio.Root
      className={(state) =>
        `group flex flex-1 items-center rounded-xl border-2 text-left transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-selected ${
          compact ? "justify-center px-3 py-3" : "gap-2 px-4 py-3"
        } ${
          state.checked
            ? compact
              ? "border-border-brand bg-background-light-brand"
              : "border-border-brand"
            : "border-border-primary hover:border-content-tertiary"
        } ${state.disabled ? "cursor-not-allowed border-border-primary" : "cursor-pointer"} ${className}`
      }
      {...props}
    >
      {!compact && (
        <span className="grid size-6 shrink-0 place-items-center rounded-full border-2 border-border-selected bg-background-primary transition-colors group-data-checked:border-border-brand group-data-checked:bg-background-brand group-data-disabled:border-border-primary">
          <Radio.Indicator className="size-2 rounded-full bg-background-primary" />
        </span>
      )}
      <span
        className={`text-xs font-semibold whitespace-nowrap text-content-primary group-data-disabled:text-content-tertiary ${
          compact ? "group-data-checked:text-content-brand" : ""
        }`}
      >
        {children}
      </span>
    </Radio.Root>
  );
}
