"use client";

import "slot-text/style.css";
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { SlotText } from "slot-text/react";
import Button from "../../components/Button";
import NavBar from "../../components/NavBar";
import { mock } from "../../data/mock";

const COPY = mock.predictor.missPayment;

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

function resolveScore(score) {
  const segments = SCORE_BANDS.map((band, i) => {
    const max = SCORE_BANDS[i + 1]?.min ?? SCORE_MAX;
    return { ...band, span: max - band.min };
  }).reverse();
  const band =
    [...SCORE_BANDS].reverse().find((b) => score >= b.min) ?? SCORE_BANDS[0];
  return { segments, band };
}

function PredictResultContent() {
  const router = useRouter();
  const days = useSearchParams().get("days");
  const option = COPY.options.find((o) => o.id === days) ?? COPY.options[0];
  const predicted = Math.min(
    Math.max(mock.currentScore + option.delta, SCORE_MIN),
    SCORE_MAX,
  );

  // Roll from the current score to the predicted one on mount — slot-text
  // only animates on text *changes*, same trick as the score page.
  const [score, setScore] = useState(mock.currentScore);
  useEffect(() => {
    setScore(predicted);
  }, [predicted]);

  const { segments, band } = resolveScore(score);
  const delta = predicted - mock.currentScore;

  return (
    <div className="flex flex-1 flex-col bg-background-secondary">
      <NavBar backHref="/predict/miss-payment" border={false} />

      {/* Predicted score module — light-mode take on the score page hero */}
      <section className="flex flex-col gap-4 bg-background-primary px-4 pt-2 pb-6">
        <div className="flex flex-col items-center gap-0.5 text-center">
          <p className="text-[10px] leading-4 font-medium tracking-[1px] text-content-secondary uppercase">
            Predicted score
          </p>
          {/* Fixed height so the SSR-empty → built → rolling states of the
              slot-text number never change the row height. */}
          <p className="flex h-14 items-baseline justify-center gap-2">
            <SlotText
              text={String(score)}
              options={{ direction: delta >= 0 ? "up" : "down" }}
              className="text-3xl font-bold text-content-primary"
            />
            <span
              className={`flex items-center gap-0.5 self-baseline rounded-full px-2 py-0.5 text-[13px] leading-4 font-bold text-content-inverse-primary ${
                delta >= 0 ? "bg-background-postive" : "bg-background-negative"
              }`}
            >
              {delta >= 0 ? (
                <IconArrowUp size={14} stroke={2.5} />
              ) : (
                <IconArrowDown size={14} stroke={2.5} />
              )}
              {Math.abs(delta)} pts
            </span>
          </p>
        </div>

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

        {/* Scenario recap */}
        <p className="text-sm leading-6 text-content-secondary">
          If you miss loan EMI or credit card bills for{" "}
          <span className="font-bold text-content-primary">{option.label}</span>
          , your score could drop from{" "}
          <span className="font-bold text-content-primary">
            {mock.currentScore}
          </span>{" "}
          to <span className="font-bold text-content-primary">{predicted}</span>
          .
        </p>
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
