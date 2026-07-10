"use client";

import BottomSheet from "./BottomSheet";
import Button from "./Button";

// Score bands with their ranges, ordered high → low to match the gauge.
// Colours mirror the gauge segments on the score screen.
const SCORE_RANGES = [
  {
    id: "exceptional",
    label: "Excellent",
    range: "800 – 900",
    color: "bg-background-postive",
  },
  {
    id: "very-good",
    label: "Very Good",
    range: "740 – 799",
    color: "bg-[var(--mountain-green-04)]",
  },
  {
    id: "good",
    label: "Good",
    range: "670 – 739",
    color: "bg-background-warning",
  },
  {
    id: "fair",
    label: "Fair",
    range: "580 – 669",
    color: "bg-[#f47b0b]",
  },
  {
    id: "poor",
    label: "Poor",
    range: "≤ 579",
    color: "bg-background-negative",
  },
];

/**
 * Score breakdown sheet — explains how the 300–900 range splits into bands.
 * `currentBandId` highlights the band the user currently falls in.
 */
export default function ScoreBreakdownSheet({
  open,
  onOpenChange,
  currentBandId,
}) {
  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Understanding your score"
    >
      <div className="flex flex-col gap-4">
        <p className="text-xs  text-content-secondary mt-2">
          Your CIBIL Score ranges from 300 to 900. Here's how the range breaks
          down.
        </p>

        <div className="flex flex-col gap-1">
          {SCORE_RANGES.map(({ id, label, range, color }) => {
            const active = id === currentBandId;
            return (
              <div
                key={id}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 ${
                  active ? "bg-background-secondary" : ""
                }`}
              >
                <span className={`size-2.5 shrink-0 rounded-full ${color}`} />
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
    </BottomSheet>
  );
}
