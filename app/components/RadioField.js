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
 */
export function RadioGroup({ className = "", ...props }) {
  return <BaseRadioGroup className={`flex gap-3 ${className}`} {...props} />;
}

export function RadioCard({ children, className = "", ...props }) {
  return (
    <Radio.Root
      className={(state) =>
        `group flex flex-1 items-center gap-2 rounded-xl border-2 px-4 py-3 text-left transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-selected ${
          state.checked
            ? "border-border-brand"
            : "border-border-primary hover:border-content-tertiary"
        } ${state.disabled ? "cursor-not-allowed border-border-primary" : "cursor-pointer"} ${className}`
      }
      {...props}
    >
      <span className="grid size-6 shrink-0 place-items-center rounded-full border-2 border-border-selected bg-background-primary transition-colors group-data-checked:border-border-brand group-data-checked:bg-background-brand group-data-disabled:border-border-primary">
        <Radio.Indicator className="size-2 rounded-full bg-background-primary" />
      </span>
      <span className="text-xs font-semibold text-content-primary group-data-disabled:text-content-tertiary">
        {children}
      </span>
    </Radio.Root>
  );
}
