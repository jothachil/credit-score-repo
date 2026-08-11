"use client";

// Scenario tone → the hero's tint, matching the choice card's glow on the
// predict grid so the sheet reads as a continuation of the card tapped.
const TONE_TINT = {
  negative: "from-background-light-negative",
  positive: "from-background-light-postive",
  warning: "from-background-light-warning",
  brand: "from-background-light-brand",
};

/**
 * Shared header for the predictor's input sheets — tinted panel with the
 * choice illustration, an uppercase kicker, and the scenario title.
 *
 * The negative margins cancel BottomSheet's body padding so the tint bleeds to
 * the sheet edges, then fades into the surface going down.
 */
export default function ScenarioSheetHero({ scenario }) {
  const tint = TONE_TINT[scenario.tone] ?? TONE_TINT.brand;
  return (
    <div
      className={`-mx-5 -mt-px flex flex-col items-center gap-3 bg-gradient-to-b to-background-primary px-5 pt-6 pb-2 text-center ${tint}`}
    >
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
  );
}
