"use client";

import { mock } from "../data/mock";
import { outcomeForDirect } from "../lib/predict";
import BottomSheet from "./BottomSheet";
import Button from "./Button";
import ScenarioSheetHero from "./ScenarioSheetHero";

/**
 * Card summary sheet — for a scenario that takes no input but acts on every
 * card carrying a balance, so it shows what that adds up to before predicting.
 * "Pay off my credit cards" means little until you can see how many cards and
 * how much money it stands for.
 *
 * `scenarioId` is null when closed. Confirming reports the outcome up via
 * `onConfirm`, same contract as the other predictor sheets.
 */
export default function CardsSheet({ scenarioId, onOpenChange, onConfirm }) {
  const scenario = scenarioId
    ? mock.predictor.scenarios[scenarioId]
    : undefined;
  const { count, totalLabel } = mock.outstandingCards;

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

          <div className="flex flex-col gap-3 pt-5">
            <p className="text-[15px] leading-6 font-medium text-content-primary">
              {scenario.cardsLabel}
            </p>

            {/* Summary only, never a row per card: the number of cards is
                unbounded, and a long list inside a sheet that already caps at
                80vh turns the CTA into a scroll hunt. */}
            <div className="grid grid-cols-2 divide-x divide-border-primary rounded-2xl border border-border-primary bg-background-secondary py-4">
              <div className="flex flex-col items-center gap-0.5">
                <p className="text-xl leading-7 font-bold text-content-primary">
                  {count}
                </p>
                <p className="text-xs leading-4 text-content-secondary">
                  {count === 1 ? "Credit card" : "Credit cards"}
                </p>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <p className="text-xl leading-7 font-bold text-content-primary">
                  {totalLabel}
                </p>
                <p className="text-xs leading-4 text-content-secondary">
                  Total outstanding
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <Button
              variant="primary"
              onClick={() => onConfirm(scenario, outcomeForDirect(scenario))}
            >
              {scenario.cta}
            </Button>
          </div>
        </>
      )}
    </BottomSheet>
  );
}
