"use client";

// FICO band model. Bands run low → high; each gauge segment is sized to its
// share of the 300–850 range. The orange/light-green steps have no semantic
// token (Figma uses literals too), so they stay documented one-off literals.
export const SCORE_MIN = 300;
export const SCORE_MAX = 850;

const SCORE_BANDS = [
  { id: "poor", label: "Poor", min: 300, color: "bg-background-negative" },
  { id: "fair", label: "Fair", min: 580, color: "bg-[#f47b0b]" },
  { id: "good", label: "Good", min: 670, color: "bg-background-warning" },
  {
    id: "very-good",
    label: "Very Good",
    min: 740,
    color: "bg-[var(--mountain-green-04)]",
  },
  {
    id: "exceptional",
    label: "Excellent",
    min: 800,
    color: "bg-background-postive",
  },
];

// 16 evenly spaced scale ticks under the gauge.
const SCORE_TICKS = Array.from({ length: 16 }, (_, i) => `tick-${i}`);

/** Clamp a raw number into the scoreable range. */
export function clampScore(score) {
  return Math.min(Math.max(score, SCORE_MIN), SCORE_MAX);
}

// Resolve a score into its band, gauge segments, and tick position. The gauge
// runs low → high (Poor on the left, Exceptional on the right), so segments
// and the tick marker are both measured from the low end.
export function resolveScore(score) {
  const range = SCORE_MAX - SCORE_MIN;
  const segments = SCORE_BANDS.map((band, i) => {
    const max = SCORE_BANDS[i + 1]?.min ?? SCORE_MAX;
    return { ...band, span: max - band.min };
  });
  const band =
    [...SCORE_BANDS].reverse().find((b) => score >= b.min) ?? SCORE_BANDS[0];
  const fraction = Math.min(Math.max((score - SCORE_MIN) / range, 0), 1);
  const activeTick = Math.round(fraction * (SCORE_TICKS.length - 1));
  return { segments, band, activeTick };
}

/**
 * The banded score gauge with its 300 → 900 tick scale.
 *
 *   <ScoreGauge score={784} />          // light surfaces
 *   <ScoreGauge score={784} tone="dark" />  // the score page's dark hero
 *
 * Segments and the marker animate, so passing a new `score` transitions
 * rather than jumping.
 */
export default function ScoreGauge({ score, tone = "light" }) {
  const { segments, band, activeTick } = resolveScore(score);
  const dark = tone === "dark";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex h-8 w-full items-end gap-0.5">
        {segments.map((segment) => (
          <span
            key={segment.id}
            style={{ flexGrow: segment.span }}
            className={`basis-0 transition-all duration-500 ease-out ${segment.color} ${
              segment.id === band.id ? "h-full" : "h-3/4"
            }`}
          />
        ))}
      </div>
      {/* Endpoints show the score range (low end left, high end right); the
          rest stay as dots, with the active one highlighted. */}
      <div className="flex w-full items-center justify-between px-px">
        {SCORE_TICKS.map((tick, i) => {
          if (i === 0 || i === SCORE_TICKS.length - 1) {
            return (
              <span
                key={tick}
                className={`text-[13px] leading-4 font-medium ${
                  dark ? "text-content-inverse-primary" : "text-content-primary"
                }`}
              >
                {i === 0 ? 300 : 900}
              </span>
            );
          }
          return (
            <span
              key={tick}
              className={`size-1.5 rounded-full transition-colors duration-500 ${
                i === activeTick
                  ? dark
                    ? "bg-content-inverse-primary"
                    : "bg-content-primary"
                  : dark
                    ? "bg-content-secondary"
                    : "bg-content-tertiary"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
