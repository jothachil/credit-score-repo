"use client";

import { useEffect, useState } from "react";
import { mock } from "../data/mock";
import { outcomeForAmount } from "../lib/predict";
import AmountRuler, { formatAmount } from "./AmountRuler";
import BottomSheet from "./BottomSheet";
import Button from "./Button";
import ScenarioSheetHero from "./ScenarioSheetHero";

/**
 * Amount input sheet — the four "obtain new credit" scenarios all collect a
 * single rupee figure, so they share this sheet and differ only in the copy
 * and range pulled from `mock.predictor.scenarios[scenarioId]`.
 *
 * Layout matches SelectSheet: tinted hero, then the input, then the CTA.
 *
 * `scenarioId` is null when closed. The ruler is keyed by it so switching
 * scenarios remounts the scroller at the new range's default. Confirming
 * reports the outcome up via `onConfirm` rather than navigating.
 */
export default function AmountSheet({ scenarioId, onOpenChange, onConfirm }) {
  const scenario = scenarioId
    ? mock.predictor.scenarios[scenarioId]
    : undefined;
  const [amount, setAmount] = useState(scenario?.defaultAmount ?? 0);

  // Reset to this scenario's default whenever a different one opens.
  useEffect(() => {
    if (scenario) setAmount(scenario.defaultAmount);
  }, [scenario]);

  return (
    <BottomSheet
      open={Boolean(scenario)}
      onOpenChange={onOpenChange}
      title={scenario?.title ?? ""}
      titleHidden
    >
      {scenario && (
        <>
          <ScenarioSheetHero scenario={scenario} />

          {/* Amount — the running value sits above the ruler that sets it */}
          <div className="flex flex-col gap-4 pt-6">
            <div className="flex flex-col items-center gap-0.5">
              <p className="text-[13px] leading-4 font-medium text-content-secondary">
                {scenario.amountLabel}
              </p>
              <p className="text-2xl leading-9 font-bold text-content-primary">
                {formatAmount(amount)}
              </p>
            </div>

            <AmountRuler
              key={scenario.id}
              min={scenario.min}
              max={scenario.max}
              step={scenario.step}
              value={amount}
              onChange={setAmount}
              label={scenario.amountLabel}
            />

            <div className="flex items-center justify-between text-[11px] leading-4 text-content-tertiary">
              <span>{formatAmount(scenario.min)}</span>
              <span>{formatAmount(scenario.max)}</span>
            </div>
          </div>

          <div className="pt-6">
            <Button
              variant="primary"
              onClick={() =>
                onConfirm(scenario, outcomeForAmount(scenario, amount))
              }
            >
              {scenario.cta}
            </Button>
          </div>
        </>
      )}
    </BottomSheet>
  );
}
