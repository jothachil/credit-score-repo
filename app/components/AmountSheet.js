"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { mock } from "../data/mock";
import AmountRuler, { formatAmount } from "./AmountRuler";
import BottomSheet from "./BottomSheet";
import Button from "./Button";

/**
 * Amount input sheet — the four "obtain new credit" scenarios all collect a
 * single rupee figure, so they share this sheet and differ only in the copy
 * and range pulled from `mock.predictor.scenarios[scenarioId]`.
 *
 * Layout matches MissPaymentSheet: tinted hero, then the input, then the CTA.
 *
 * `scenarioId` is null when closed. The ruler is keyed by it so switching
 * scenarios remounts the scroller at the new range's default.
 */
export default function AmountSheet({ scenarioId, onOpenChange }) {
  const scenario = scenarioId
    ? mock.predictor.scenarios[scenarioId]
    : undefined;
  const router = useRouter();
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
          {/* Tinted hero, bled to the sheet's edges by cancelling the
              BottomSheet body padding. */}
          <div className="-mx-5 -mt-px flex flex-col items-center gap-3 bg-gradient-to-b from-background-light-brand to-background-primary px-5 pt-6 pb-2 text-center">
            {/* biome-ignore lint/performance/noImgElement: prototype static asset */}
            <img
              src={`/${scenario.image}.png`}
              alt=""
              className="size-28 shrink-0 object-contain"
            />
            <div className="flex flex-col gap-1">
              <p className="text-xs leading-4 font-medium tracking-[0.6px] text-content-secondary uppercase">
                {scenario.kicker}
              </p>
              <h2 className="text-xl leading-7 font-bold text-content-primary">
                {scenario.title}
              </h2>
            </div>
          </div>

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
                router.push(
                  `/predict/result?scenario=${scenario.id}&amount=${amount}`,
                )
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
