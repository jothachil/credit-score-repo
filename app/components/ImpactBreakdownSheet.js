"use client";

import BottomSheet from "./BottomSheet";
import Button from "./Button";

// Rating tones → gauge-matching colours (design-system tokens only).
const TONE_COLOR = {
  excellent: "bg-background-postive",
  "very-good": "bg-[var(--mountain-green-04)]",
  good: "bg-background-warning",
  fair: "bg-[#f47b0b]",
  poor: "bg-background-negative",
};

/**
 * Impact breakdown sheet — explains one score factor's Excellent→Poor ranges.
 * Driven by an `impact` object (from IMPACTS); null means closed. The band
 * matching `impact.rating` is highlighted.
 */
export default function ImpactBreakdownSheet({ impact, onOpenChange }) {
  return (
    <BottomSheet
      open={Boolean(impact)}
      onOpenChange={onOpenChange}
      title={impact?.title ?? ""}
    >
      {impact && (
        <div className="flex flex-col gap-4">
          <p className="mt-2 text-xs text-content-secondary">
            {impact.description}
          </p>

          <div className="flex flex-col gap-1">
            {impact.ranges.map(({ tone, label, range }) => {
              const active = label === impact.rating;
              return (
                <div
                  key={label}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 ${
                    active ? "bg-background-secondary" : ""
                  }`}
                >
                  <span
                    className={`size-2.5 shrink-0 rounded-full ${TONE_COLOR[tone]}`}
                  />
                  <span className="flex-1 text-[15px] leading-5 font-semibold text-content-primary">
                    {label}
                  </span>
                  <span className="text-sm leading-5 text-content-secondary">
                    {range}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-xss leading-4 text-content-inactive">
            Above classification is PayUFin's educational opinion and does not
            ensure or imply any guarantee of credit approval from partner or
            non-partner financial institutions.
          </p>

          <Button variant="primary" onClick={() => onOpenChange(false)}>
            I understood
          </Button>
        </div>
      )}
    </BottomSheet>
  );
}
