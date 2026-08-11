"use client";

import "slot-text/style.css";
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { SlotText } from "slot-text/react";
import Button from "../../components/Button";
import NavBar from "../../components/NavBar";
import ScoreGauge, { clampScore } from "../../components/ScoreGauge";
import { mock } from "../../data/mock";
import { outcomeFor } from "../../lib/predict";

// Standalone, link-addressable version of the predict page's inline result —
// the predict flow itself no longer navigates here, but a URL still resolves.
//
//   ?scenario=<id>          — which scenario's copy to show
//   ?option=<id>            — select scenarios: which option was picked
//   ?amount=<rupees>        — amount scenarios: the figure set on the ruler
// Defaults to miss-payment, and still accepts that scenario's older ?days
// links, so a bare ?days=60 keeps resolving.
function resolveScenario(params) {
  const scenario =
    mock.predictor.scenarios[params.get("scenario")] ??
    mock.predictor.scenarios["miss-payment"];

  const input =
    scenario.kind === "amount"
      ? Number(params.get("amount"))
      : (params.get("option") ?? params.get("days"));

  return { scenario, ...outcomeFor(scenario, input) };
}

function PredictResultContent() {
  const router = useRouter();
  const {
    scenario,
    delta: scenarioDelta,
    summary,
  } = resolveScenario(useSearchParams());
  const predicted = clampScore(mock.currentScore + scenarioDelta);

  // Roll from the current score to the predicted one on mount — slot-text
  // only animates on text *changes*, same trick as the score page.
  const [score, setScore] = useState(mock.currentScore);
  useEffect(() => {
    setScore(predicted);
  }, [predicted]);

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

        <ScoreGauge score={score} />
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
