"use client";

import "slot-text/style.css";
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { SlotText } from "slot-text/react";
import { formatAmount } from "../../components/AmountRuler";
import Button from "../../components/Button";
import NavBar from "../../components/NavBar";
import { mock } from "../../data/mock";

// Same FICO band model as the score page (see score/page.js) — duplicated
// locally like the detail pages duplicate StatusMarker.
const SCORE_MIN = 300;
const SCORE_MAX = 850;
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

// 16 evenly spaced scale ticks under the gauge, same as the score page.
const SCORE_TICKS = Array.from({ length: 16 }, (_, i) => `tick-${i}`);

// Gauge runs low → high, same orientation as the score page.
function resolveScore(score) {
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

// Resolve the scenario and its delta from the query string.
//   ?scenario=<id>          — which scenario's copy to show
//   ?option=<id>            — select scenarios: which option was picked
//   ?amount=<rupees>        — amount scenarios: the figure set on the ruler
// Defaults to miss-payment, and still accepts that scenario's older ?days
// links, so a bare ?days=60 keeps resolving.
function resolveScenario(params) {
  const scenario =
    mock.predictor.scenarios[params.get("scenario")] ??
    mock.predictor.scenarios["miss-payment"];

  // A `select` scenario's delta comes from the option picked. The recap reads
  // "<prefix> <joiner> <option>", with the joiner absorbing the difference
  // between "…card bills for 60 days" and "If you apply for a home loan".
  if (scenario.kind === "select") {
    const picked = params.get("option") ?? params.get("days");
    const option =
      scenario.options.find((o) => o.id === picked) ?? scenario.options[0];
    return {
      scenario,
      delta: option.delta,
      summary: [
        scenario.resultPrefix,
        scenario.resultJoiner,
        option.summaryLabel ?? option.label,
      ]
        .filter(Boolean)
        .join(" "),
    };
  }

  // An `amount` scenario scales its delta by where the figure sits in the
  // range — a bigger commitment moves the score further.
  if (scenario.kind === "amount") {
    const raw = Number(params.get("amount"));
    const amount = Number.isFinite(raw)
      ? Math.min(Math.max(raw, scenario.min), scenario.max)
      : scenario.defaultAmount;
    const fraction = (amount - scenario.min) / (scenario.max - scenario.min);
    const delta = Math.round(
      scenario.deltaAtMin +
        fraction * (scenario.deltaAtMax - scenario.deltaAtMin),
    );
    return {
      scenario,
      delta,
      summary: `${scenario.resultPrefix} ${formatAmount(amount)}`,
    };
  }

  // A `direct` scenario takes no input, so its own delta applies as-is.
  return {
    scenario,
    delta: scenario.delta,
    summary: scenario.resultPrefix,
  };
}

function PredictResultContent() {
  const router = useRouter();
  const {
    scenario,
    delta: scenarioDelta,
    summary,
  } = resolveScenario(useSearchParams());
  const predicted = Math.min(
    Math.max(mock.currentScore + scenarioDelta, SCORE_MIN),
    SCORE_MAX,
  );

  // Roll from the current score to the predicted one on mount — slot-text
  // only animates on text *changes*, same trick as the score page.
  const [score, setScore] = useState(mock.currentScore);
  useEffect(() => {
    setScore(predicted);
  }, [predicted]);

  const { segments, band, activeTick } = resolveScore(score);
  const delta = predicted - mock.currentScore;

  return (
    <div className="flex flex-1 flex-col bg-background-secondary">
      <NavBar backHref="/predict" border={false} />

      {/* Predicted score module — light-mode take on the score page hero.
          Bottom tint follows the delta (green for gains, red for drops) and
          fades to white going up, same treatment as the onboarding gradient. */}
      <section
        className={`flex flex-col gap-8 bg-background-primary bg-gradient-to-t to-background-primary to-75% px-4 pt-2 pb-6 border-b border-border-primary ${
          delta >= 0
            ? "from-background-postive/10"
            : "from-background-negative/10"
        }`}
      >
        <div className="flex flex-col items-center gap-0.5 my-5 text-center">
          <p className="text-2xl leading-4 font-bold  text-content-primary ">
            Predicted score
          </p>
          <p className="mt-4 text-sm leading-6 text-content-secondary">
            {summary}
          </p>
          {/* Fixed height so the SSR-empty → built → rolling states of the
              slot-text number never change the row height. */}
          <p className=" mt-10 flex h-14 items-baseline justify-center gap-8">
            <SlotText
              text={String(score)}
              options={{ direction: delta >= 0 ? "up" : "down" }}
              className="text-3xl font-bold text-content-primary"
            />
          </p>
          {/* Delta on its own line under the score */}
          <span
            className={`flex items-center gap-0.5 rounded-full px-4 py-2 text-lg leading-4 font-bold text-content-inverse-primary ${
              delta >= 0 ? "bg-background-postive" : "bg-background-negative"
            }`}
          >
            {delta >= 0 ? (
              <IconArrowUp size={16} stroke={2.5} />
            ) : (
              <IconArrowDown size={16} stroke={2.5} />
            )}
            {Math.abs(delta)} pts
          </span>
        </div>

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
          {/* Score range — same tick scale as the main score page, light mode */}
          <div className="flex w-full items-center justify-between px-px">
            {SCORE_TICKS.map((tick, i) => {
              if (i === 0 || i === SCORE_TICKS.length - 1) {
                return (
                  <span
                    key={tick}
                    className="text-[13px] leading-4 font-medium text-content-primary"
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
                      ? "bg-content-primary"
                      : "bg-content-tertiary"
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Scenario recap */}
      </section>

      {/* Tips based on the chosen scenario */}
      <section className="flex flex-col gap-2 px-4 py-6">
        <h2 className="text-sm leading-6 font-semibold text-content-secondary">
          {scenario.tipsTitle}
        </h2>
        <div className="flex flex-col divide-y divide-border-primary rounded-2xl border border-border-primary bg-background-primary">
          {scenario.tips.map(({ id, icon: Icon, title, detail }) => (
            <div key={id} className="flex items-center gap-4 p-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-background-light-brand">
                <Icon size={24} stroke={2} className="text-content-brand" />
              </span>
              <div className="flex flex-col gap-0.5">
                <p className="text-[15px] leading-5 font-bold text-content-primary">
                  {title}
                </p>
                <p className="text-xs leading-5 text-content-secondary">
                  {detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA — pinned to the bottom of the screen */}
      <div className="sticky bottom-0 mt-auto flex flex-col border-t border-border-primary bg-background-primary px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <Button variant="secondary" onClick={() => router.push("/predict")}>
          Try another scenario
        </Button>
      </div>
    </div>
  );
}

export default function PredictResult() {
  return (
    <Suspense>
      <PredictResultContent />
    </Suspense>
  );
}
