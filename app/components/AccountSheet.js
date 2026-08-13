"use client";

import { mock } from "../data/mock";
import { outcomeForDirect } from "../lib/predict";
import BottomSheet from "./BottomSheet";
import Button from "./Button";
import ScenarioSheetHero from "./ScenarioSheetHero";

// The rows of the account summary, pulled straight off the tradeline record.
function detailRows(account) {
  return [
    { id: "opened", label: "Opened", value: account.openedLabel },
    { id: "limit", label: "Credit limit", value: account.creditLimit },
    {
      id: "used",
      label: "Currently used",
      value: `${account.limitUsedAmount} · ${account.limitUsedPct}%`,
    },
  ];
}

/**
 * Account confirmation sheet — for a scenario that takes no input but acts on
 * a specific account, so it shows which one before predicting. "Close my
 * oldest card" is meaningless until you can see the card it means.
 *
 * `scenarioId` is null when closed. Confirming reports the outcome up via
 * `onConfirm`, same contract as the other predictor sheets.
 */
export default function AccountSheet({ scenarioId, onOpenChange, onConfirm }) {
  const scenario = scenarioId
    ? mock.predictor.scenarios[scenarioId]
    : undefined;
  const account = mock.oldestCard;

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
              {scenario.accountLabel}
            </p>

            <div className="flex flex-col rounded-2xl border border-border-primary bg-background-primary">
              {/* Identity row — issuer, then how long it's been open, which is
                  the reason this account matters to the score. */}
              <div className="flex items-center gap-3 p-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-background-secondary">
                  <account.icon
                    size={20}
                    stroke={2}
                    className="text-content-primary"
                  />
                </span>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[15px] leading-5 font-bold text-content-primary">
                    {account.name}
                  </p>
                  <p className="text-xs leading-4 text-content-secondary">
                    {account.ageLabel} · {account.status}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 border-t border-border-primary p-4">
                {detailRows(account).map(({ id, label, value }) => (
                  <div key={id} className="flex items-baseline justify-between">
                    <span className="text-sm leading-5 text-content-secondary">
                      {label}
                    </span>
                    <span className="text-sm leading-5 font-semibold text-content-primary">
                      {value}
                    </span>
                  </div>
                ))}
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
