"use client";

import { Input } from "@base-ui/react/input";
import { motion } from "framer-motion";
import { useId, useRef, useState } from "react";

/**
 * Floating-label text input with focus + error animation.
 *
 * Controlled: pass `value` and `onChange(nextValue)`.
 * Pass `error` (a string) to switch into the invalid state.
 *
 * The label floats up when the field is focused or has a value. Extra props
 * (type, inputMode, maxLength, placeholder, transform, …) pass through to the
 * underlying Base UI <Input>.
 */
export default function TextField({
  id,
  label,
  value,
  onChange,
  error = "",
  className = "",
  ...inputProps
}) {
  const reactId = useId();
  const fieldId = id ?? reactId;
  const inputRef = useRef(null);
  const [focused, setFocused] = useState(false);
  const active = focused || String(value ?? "").length > 0;
  const invalid = Boolean(error);

  return (
    <div className={className}>
      <motion.div
        animate={{
          borderColor: invalid
            ? "var(--border-negative)"
            : focused
              ? "var(--border-selected)"
              : "var(--border-primary)",
          borderWidth: focused || invalid ? 2 : 1,
        }}
        transition={{ duration: 0.16, ease: "easeOut" }}
        onMouseDown={(event) => {
          // The input collapses to 0px when inactive, so a tap on the rest of
          // the card would miss it — redirect focus to the input.
          if (event.target !== inputRef.current) {
            event.preventDefault();
            inputRef.current?.focus();
          }
        }}
        className="flex h-14 cursor-text flex-col justify-center rounded-xl border border-solid bg-background-primary px-4 py-2"
      >
        <motion.label
          htmlFor={fieldId}
          animate={{
            fontSize: active ? 12 : 14,
            lineHeight: active ? "16px" : "20px",
            fontWeight: active ? 600 : 400,
          }}
          transition={{ duration: 0.16, ease: "easeOut" }}
          className={
            invalid ? "text-content-negative" : "text-content-secondary"
          }
        >
          {label}
        </motion.label>
        <Input
          ref={inputRef}
          id={fieldId}
          value={value}
          onValueChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-label={label}
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? `${fieldId}-error` : undefined}
          className={`w-full bg-transparent text-[16px] leading-6 text-content-primary outline-none transition-opacity duration-150 ${
            active ? "h-6 opacity-100" : "h-0 opacity-0"
          }`}
          {...inputProps}
        />
      </motion.div>
      {invalid && (
        <motion.p
          id={`${fieldId}-error`}
          initial={{ opacity: 0, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 px-4 text-[12px] leading-4 text-content-negative"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
