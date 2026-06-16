"use client";

import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { IconCheck } from "@tabler/icons-react";
import { useId } from "react";

/**
 * Checkbox — 20px box in a 24px touch target.
 *
 * Controlled:   <Checkbox checked={v} onCheckedChange={setV}>Label</Checkbox>
 * Uncontrolled: <Checkbox defaultChecked>Label</Checkbox>
 *
 * Omit children for a bare box. Pass `disabled` to fade it out. States match
 * Figma: unchecked has a dark (border/selected) ring, checked fills with brand,
 * disabled uses border/primary (unchecked) or content/inactive (checked).
 */

// Visual box. Border/fill switch via the Root's data-* state (group-data-*).
const boxClass =
  "flex size-5 items-center justify-center rounded-[4px] border-2 bg-background-primary text-content-inverse-primary transition-colors " +
  "border-border-selected " +
  "group-data-checked:border-content-brand group-data-checked:bg-content-brand " +
  "group-data-disabled:border-border-primary " +
  "group-data-disabled:group-data-checked:border-content-inactive group-data-disabled:group-data-checked:bg-content-inactive " +
  "group-data-focused:outline-2 group-data-focused:outline-offset-2 group-data-focused:outline-border-selected";

function CheckboxControl({ className = "", ...props }) {
  return (
    <BaseCheckbox.Root
      className={`group inline-flex size-6 shrink-0 cursor-pointer items-center justify-center outline-none data-disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      <span className={boxClass}>
        <BaseCheckbox.Indicator className="flex">
          <IconCheck size={14} stroke={3} />
        </BaseCheckbox.Indicator>
      </span>
    </BaseCheckbox.Root>
  );
}

export default function Checkbox({
  children,
  className = "",
  disabled,
  id,
  ...props
}) {
  const reactId = useId();
  const fieldId = id ?? reactId;

  if (!children) {
    return (
      <CheckboxControl
        id={fieldId}
        className={className}
        disabled={disabled}
        {...props}
      />
    );
  }

  return (
    <label
      htmlFor={fieldId}
      className={`inline-flex items-center gap-2 ${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
    >
      <CheckboxControl id={fieldId} disabled={disabled} {...props} />
      <span
        className={`text-xs font-semibold ${
          disabled ? "text-content-tertiary" : "text-content-primary"
        }`}
      >
        {children}
      </span>
    </label>
  );
}
