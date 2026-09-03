"use client";

import "slot-text/style.css";
import {
  IconAlertTriangle,
  IconArrowDown,
  IconArrowUp,
  IconLoader2,
} from "@tabler/icons-react";
import { useAtomValue } from "jotai";
import { useEffect, useRef, useState } from "react";
import { SlotText } from "slot-text/react";
import AccountSheet from "../components/AccountSheet";
import AmountSheet from "../components/AmountSheet";
import CardsSheet from "../components/CardsSheet";
import NavBar from "../components/NavBar";
import ScoreGauge, { clampScore } from "../components/ScoreGauge";
import SelectSheet from "../components/SelectSheet";
import { toast } from "../components/Toast";
import { mock } from "../data/mock";
import { outcomeForDirect } from "../lib/predict";
import { debugFlagAtoms } from "../state/debugFlags";

// A tapped tile shows a loading snackbar for a beat before its sheet or result
// appears, so the tap is acknowledged immediately.
const PREDICT_DELAY_MS = 900;
const PREDICT_LOADING = "Predicting your score…";
const PREDICT_ERROR = "Couldn't predict your score";
// The error clears itself quickly rather than sitting on screen — long enough
// to read and reach Retry, short enough not to linger over the gauge.
const PREDICT_ERROR_MS = 1500;

// Spinning loader for the snackbar. Merges the className the toast passes in
// rather than replacing it, so the toast's own layout classes survive.
function SpinnerIcon({ className = "", ...props }) {
  return <IconLoader2 {...props} className={`animate-spin ${className}`} />;
}

// Cancel an in-flight tap: drop its timer and its snackbar. Module-level so it
// is referentially stable — as a component-scoped closure it would be a new
// function each render, and listing it as an effect dependency would re-run
// the cleanup on every render and dismiss the snackbar immediately.
function dismissPending(ref) {
  if (!ref.current) return;
  clearTimeout(ref.current.timer);
  toast.close(ref.current.toastId);
  ref.current = null;
}

// Tone → the choice card's bottom glow, using the light semantic tokens so
// the cards stay on-brand in light mode.
//
// Each glow fades to the card's own surface colour, not to `transparent`.
// CSS `transparent` is rgba(0,0,0,0) — transparent *black* — and Safari
// renders the midpoints of a colour→transparent ramp as grey, which showed up
// as a dirty shadow across the bottom of every card on iOS. Tailwind's `/0`
// modifier is no better: it compiles to color-mix(…, transparent), landing on
// the same transparent black. Ending on an opaque colour keeps alpha out of
// the interpolation altogether, and since the glow sits on top of a
// `background-primary` card the result is visually identical.
const CHOICE_TONE = {
  negative: { glow: "from-background-light-negative to-background-primary" },
  positive: { glow: "from-background-light-postive to-background-primary" },
  warning: { glow: "from-background-light-warning to-background-primary" },
  brand: { glow: "from-background-light-brand to-background-primary" },
};

function ChoiceCard({ choice, active, onClick }) {
  const tone = CHOICE_TONE[choice.tone] ?? CHOICE_TONE.brand;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`relative flex aspect-square cursor-pointer flex-col items-center justify-between overflow-hidden rounded-2xl border bg-background-primary p-4 pt-5 text-center transition-all duration-300 ${
        active
          ? "border-border-selected ring-1 ring-border-selected"
          : "border-border-primary"
      }`}
    >
      {/* Ambient glow behind the icon — tinted to the choice's tone */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t ${tone.glow}`}
      />
      <span className="relative text-[15px] leading-5 font-semibold text-content-primary">
        {choice.label}
      </span>
      {/* Illustration named by the choice's `image` in /public */}
      {/* biome-ignore lint/performance/noImgElement: prototype static asset */}
      <img
        src={`/${choice.image}.png`}
        alt=""
        className="relative w-32 object-contain"
      />
    </button>
  );
}

export default function PredictScore() {
  // Debug flag "Predict API fails" — every scenario errors instead of resolving.
  const predictFails = useAtomValue(debugFlagAtoms.predictFails);
  const [activeId, setActiveId] = useState(null);
  const [selectScenarioId, setSelectScenarioId] = useState(null);
  const [amountScenarioId, setAmountScenarioId] = useState(null);
  const [accountScenarioId, setAccountScenarioId] = useState(null);
  const [cardsScenarioId, setCardsScenarioId] = useState(null);
  // The simulation currently on the gauge: { scenarioId, delta, summary }.
  // Null until the first choice is made, when the gauge shows today's score.
  const [result, setResult] = useState(null);

  const predicted = clampScore(mock.currentScore + (result?.delta ?? 0));

  // Roll to the predicted score — slot-text only animates on text *changes*,
  // so the gauge and number transition whenever a new scenario is confirmed.
  const [score, setScore] = useState(mock.currentScore);
  useEffect(() => {
    setScore(predicted);
  }, [predicted]);

  const delta = predicted - mock.currentScore;

  // The prediction currently loading. Held in a ref so a second prediction
  // supersedes the first rather than stacking snackbars.
  const pending = useRef(null);

  // Leaving the page mid-prediction must not leave a snackbar stranded.
  useEffect(() => () => dismissPending(pending), []);

  // Hold a loading snackbar for a beat, then commit. The timeout is a backstop
  // rather than the intended dismissal: we close it explicitly when the commit
  // lands, but if that path is ever interrupted the snackbar still clears
  // itself instead of pinning to the screen (`timeout: 0` would never expire).
  function predictWithLoading(commit) {
    dismissPending(pending);
    const toastId = toast.add({
      title: PREDICT_LOADING,
      timeout: PREDICT_DELAY_MS + 2000,
      data: { icon: SpinnerIcon },
    });
    const timer = setTimeout(() => {
      pending.current = null;

      // Simulated API failure: leave the gauge exactly as it was, so a failed
      // call never half-applies a result. Retry re-runs the same commit, so the
      // scenario's inputs are preserved.
      //
      // Re-adding under the loading toast's own id updates it in place and
      // refreshes its dismiss timer. Closing it and adding a second toast
      // instead put an exiting and an entering toast in the viewport at once,
      // which animated over each other and reflowed the stack — the loader
      // now morphs into the error in the same DOM node.
      if (predictFails) {
        toast.add({
          id: toastId,
          title: PREDICT_ERROR,
          timeout: PREDICT_ERROR_MS,
          data: {
            icon: IconAlertTriangle,
            action: {
              label: "Retry",
              onClick: () => predictWithLoading(commit),
            },
          },
        });
        return;
      }

      toast.close(toastId);
      commit();
    }, PREDICT_DELAY_MS);
    pending.current = { timer, toastId };
  }

  // Confirmed from a sheet, or straight from the card for `direct` scenarios.
  // The sheets close first so the snackbar reads as the prediction being
  // computed, not as something happening behind an open sheet.
  function apply(scenario, outcome) {
    setSelectScenarioId(null);
    setAmountScenarioId(null);
    setAccountScenarioId(null);
    setCardsScenarioId(null);
    predictWithLoading(() => {
      setResult({ scenarioId: scenario.id, ...outcome });
      setActiveId(scenario.id);
    });
  }

  // The scenario's `kind` decides where a tap lands: `select` and `amount`
  // collect a data point in a sheet first, `account` shows which account it
  // acts on, `cards` sums up the cards it would clear, and `direct` predicts
  // straight away. Sheets open immediately — the loading snackbar comes after
  // they're confirmed and dismissed, by way of `apply`.
  function choose(choice) {
    const scenario = mock.predictor.scenarios[choice.id];
    if (!scenario) {
      setActiveId(activeId === choice.id ? null : choice.id);
      return;
    }
    if (scenario.kind === "select") return setSelectScenarioId(scenario.id);
    if (scenario.kind === "amount") return setAmountScenarioId(scenario.id);
    if (scenario.kind === "account") return setAccountScenarioId(scenario.id);
    if (scenario.kind === "cards") return setCardsScenarioId(scenario.id);
    return apply(scenario, outcomeForDirect(scenario));
  }

  return (
    <div className="flex flex-1 flex-col bg-background-secondary">
      {/* Nav + score stay pinned while the scenarios scroll underneath, so the
          gauge is always visible as you try different options. Both live in one
          sticky wrapper to keep the back button reachable. */}
      <div className="sticky top-0 z-20 bg-background-primary">
        {/* No scroll divider — the score section below draws the only one
            this sticky header should have. */}
        <NavBar backHref="/score" border={false} scrollBorder={false} />

        {/* Predicted score — the gauge lives here rather than on its own
            screen, so picking a scenario updates it in place. Bottom tint
            follows the delta (green for gains, red for drops) and fades to
            white going up. */}
        <section
          className={`flex flex-col gap-4 border-b border-border-primary bg-background-primary bg-gradient-to-t to-background-primary to-75% px-4 pt-1 pb-5 ${
            !result
              ? "from-background-primary"
              : delta >= 0
                ? "from-background-postive/10"
                : "from-background-negative/10"
          }`}
        >
          {/* Score block — same left-aligned kicker → number reading order as
              the score page hero, in light-mode colours. */}
          <div className="flex flex-col mt-6">
            <p className="text-[10px] leading-4 font-medium tracking-[1px] text-content-secondary uppercase">
              {result ? "Predicted score" : "CIBIL Score"}
            </p>
            {/* Fixed height so the SSR-empty → built → rolling states of the
                slot-text number never change the row height. */}
            <p className="flex h-14 items-baseline gap-2">
              <SlotText
                text={String(score)}
                options={{ direction: delta >= 0 ? "up" : "down" }}
                className="text-3xl font-bold text-content-primary"
              />
              {/* Delta sits where the score page shows its band label — only
                  once something has been simulated. */}
              {result && (
                <span
                  className={`flex items-center gap-0.5 rounded-full px-3 py-1.5 text-sm leading-4 font-bold text-content-inverse-primary ${
                    delta >= 0
                      ? "bg-background-postive"
                      : "bg-background-negative"
                  }`}
                >
                  {delta >= 0 ? (
                    <IconArrowUp size={14} stroke={2.5} />
                  ) : (
                    <IconArrowDown size={14} stroke={2.5} />
                  )}
                  {Math.abs(delta)} pts
                </span>
              )}
            </p>
            {/* Height-locked so the sticky header can't resize as this line
                changes and shove the page around. Once a scenario is running
                this anchors the prediction against the real score. */}
            <p className="line-clamp-2 mt-2 h-10 text-sm leading-5 text-content-secondary">
              {result
                ? `Current CIBIL Score is ${mock.currentScore}`
                : "Pick a scenario below to see its effect"}
            </p>
          </div>

          <ScoreGauge score={score} />
        </section>

        {/* Soft edge below the header. Hangs off the bottom of the sticky
            wrapper (`top-full`) and blurs whatever scrolls behind it, with
            both the blur and the white tint masked away downwards — so
            scenarios sharpen up as they clear the score section instead of
            appearing all at once at its edge. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-full h-8 bg-gradient-to-b from-background-primary to-transparent backdrop-blur-[3px] mask-[linear-gradient(to_bottom,#000,transparent)]"
        />
      </div>

      {/* Choice grid */}
      <section className="flex flex-col gap-2 p-4 pb-8">
        <h2 className="text-sm leading-6 font-semibold text-content-secondary">
          {result ? "Try another scenario" : "Scenarios"}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {mock.predictor.choices
            .filter((choice) => !choice.hidden)
            .map((choice) => (
              <ChoiceCard
                key={choice.id}
                choice={choice}
                active={activeId === choice.id}
                onClick={() => choose(choice)}
              />
            ))}
        </div>
      </section>

      <SelectSheet
        scenarioId={selectScenarioId}
        onOpenChange={(open) => !open && setSelectScenarioId(null)}
        onConfirm={apply}
      />

      <AmountSheet
        scenarioId={amountScenarioId}
        onOpenChange={(open) => !open && setAmountScenarioId(null)}
        onConfirm={apply}
      />

      <AccountSheet
        scenarioId={accountScenarioId}
        onOpenChange={(open) => !open && setAccountScenarioId(null)}
        onConfirm={apply}
      />

      <CardsSheet
        scenarioId={cardsScenarioId}
        onOpenChange={(open) => !open && setCardsScenarioId(null)}
        onConfirm={apply}
      />
    </div>
  );
}
