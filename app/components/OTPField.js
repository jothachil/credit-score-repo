"use client";

import { OTPFieldPreview as OTPFieldPrimitive } from "@base-ui/react/otp-field";
import { IconInfoCircle } from "@tabler/icons-react";
import { useId } from "react";

/**
 * Segmented one-time-passcode input.
 *
 * Controlled: pass `value` and `onChange(nextValue)`.
 * `status` drives the border + message: null | "error" | "verified".
 * Pass `error` to show an inline message under the field when status is "error".
 */
export default function OTPField({
  value,
  onChange,
  length = 6,
  status = null,
  error = "",
  className = "",
}) {
  const id = useId();

  const inputBorder =
    status === "error"
      ? "border-border-negative focus:border-border-negative"
      : status === "verified"
        ? "border-border-postive focus:border-border-postive"
        : "border-border-primary focus:border-border-selected";

  return (
    <div className={className}>
      <OTPFieldPrimitive.Root
        id={id}
        length={length}
        validationType="numeric"
        value={value}
        onValueChange={onChange}
        className="flex gap-2.5"
      >
        {Array.from({ length }, (_, index) => (
          <OTPFieldPrimitive.Input
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length segmented input
            key={index}
            aria-label={`Digit ${index + 1} of ${length}`}
            className={`h-[60px] w-12 rounded-xl border-2 text-center text-sm font-semibold text-content-primary outline-none ${inputBorder}`}
          />
        ))}
      </OTPFieldPrimitive.Root>

      {status === "error" && error && (
        <p
          role="alert"
          className="mt-2 flex items-center gap-1.5 text-xs text-content-negative"
        >
          <IconInfoCircle size={18} stroke={2} />
          {error}
        </p>
      )}
    </div>
  );
}
