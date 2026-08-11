"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { mock } from "../data/mock";
import BottomSheet from "./BottomSheet";
import Button from "./Button";
import { RadioCard, RadioGroup } from "./RadioField";
import ScenarioSheetHero from "./ScenarioSheetHero";

/**
 * Option-picker sheet — for scenarios whose single data point is one choice
 * from a fixed list (days past due, the kind of credit applied for). Copy,
 * options, and layout all come from `mock.predictor.scenarios[scenarioId]`.
 *
 * `layout: "chips"` puts short values in one row; anything else stacks them,
 * which is what longer labels need.
 *
 * `scenarioId` is null when closed.
 */
export default function SelectSheet({ scenarioId, onOpenChange }) {
  const scenario = scenarioId
    ? mock.predictor.scenarios[scenarioId]
    : undefined;
  const router = useRouter();
  const [selected, setSelected] = useState(scenario?.options[0].id ?? "");

  // Reopen on the first option rather than the last scenario's pick.
  useEffect(() => {
    if (scenario) setSelected(scenario.options[0].id);
  }, [scenario]);

  const chips = scenario?.layout === "chips";

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
              {scenario.optionsLabel}
            </p>
            <RadioGroup
              value={selected}
              onValueChange={setSelected}
              aria-label={scenario.optionsLabel}
              className={chips ? "" : "flex-col"}
            >
              {scenario.options.map(({ id, label }) => (
                <RadioCard key={id} value={id} compact={chips}>
                  {label}
                </RadioCard>
              ))}
            </RadioGroup>
          </div>

          <div className="pt-6">
            <Button
              variant="primary"
              onClick={() =>
                router.push(
                  `/predict/result?scenario=${scenario.id}&option=${selected}`,
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
