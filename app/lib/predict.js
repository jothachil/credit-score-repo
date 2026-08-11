import { formatAmount } from "../components/AmountRuler";

/**
 * Turns a scenario plus whatever its input collected into the two things every
 * surface needs: the score `delta` to apply, and the `summary` sentence that
 * recaps what was simulated.
 *
 * Shared so the predict page's inline result and the standalone result page
 * can't drift apart.
 */

/** `select` — the delta belongs to the option picked. */
export function outcomeForSelect(scenario, optionId) {
  const option =
    scenario.options.find((o) => o.id === optionId) ?? scenario.options[0];
  return {
    delta: option.delta,
    // "<prefix> <joiner> <option>" — the joiner absorbs the difference between
    // "…card bills for 60 days" and "If you apply for a home loan".
    summary: [
      scenario.resultPrefix,
      scenario.resultJoiner,
      option.summaryLabel ?? option.label,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

/** `amount` — the delta scales with where the figure sits in the range. */
export function outcomeForAmount(scenario, rawAmount) {
  const amount = Number.isFinite(rawAmount)
    ? Math.min(Math.max(rawAmount, scenario.min), scenario.max)
    : scenario.defaultAmount;
  const fraction = (amount - scenario.min) / (scenario.max - scenario.min);
  return {
    delta: Math.round(
      scenario.deltaAtMin +
        fraction * (scenario.deltaAtMax - scenario.deltaAtMin),
    ),
    summary: `${scenario.resultPrefix} ${formatAmount(amount)}`,
  };
}

/** `direct` — no input, so the scenario's own delta applies as-is. */
export function outcomeForDirect(scenario) {
  return { delta: scenario.delta, summary: scenario.resultPrefix };
}

/** Dispatch on the scenario's kind. */
export function outcomeFor(scenario, input) {
  if (scenario.kind === "select") return outcomeForSelect(scenario, input);
  if (scenario.kind === "amount") return outcomeForAmount(scenario, input);
  return outcomeForDirect(scenario);
}
