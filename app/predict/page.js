"use client";

import "slot-text/style.css";
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { SlotText } from "slot-text/react";
import NavBar from "../components/NavBar";
import { mock } from "../data/mock";

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
const SCORE_TICKS = Array.from({ length: 16 }, (_, i) => `tick-${i}`);

function resolveScore(score) {
  const range = SCORE_MAX - SCORE_MIN;
  const segments = SCORE_BANDS.map((band, i) => {
    const max = SCORE_BANDS[i + 1]?.min ?? SCORE_MAX;
    return { ...band, span: max - band.min };
  }).reverse();
  const band =
    [...SCORE_BANDS].reverse().find((b) => score >= b.min) ?? SCORE_BANDS[0];
  const fraction = Math.min(Math.max((score - SCORE_MIN) / range, 0), 1);
  const activeTick = Math.round((1 - fraction) * (SCORE_TICKS.length - 1));
  return { segments, band, activeTick };
}

// Tone → the choice card's bottom glow, using the light semantic tokens so
// the cards stay on-brand in light mode.
const CHOICE_TONE = {
  negative: { glow: "from-background-light-negative" },
  positive: { glow: "from-background-light-postive" },
  warning: { glow: "from-background-light-warning" },
  brand: { glow: "from-background-light-brand" },
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
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t to-transparent ${tone.glow}`}
      />
      <span className="relative text-[15px] leading-5 font-semibold text-content-primary">
        {choice.label}
      </span>
      {/* Illustration named after the choice id in /public */}
      {/* biome-ignore lint/performance/noImgElement: prototype static asset */}
      <img
        src={`/${choice.id}.png`}
        alt=""
        className="relative w-32 object-contain"
      />
    </button>
  );
}

export default function PredictScore() {
  const baseScore = mock.currentScore;
  const [activeId, setActiveId] = useState(null);
  const [score, setScore] = useState(baseScore);
  const [direction, setDirection] = useState("up");
  const { segments, band, activeTick } = resolveScore(score);

  const activeChoice = mock.predictor.choices.find((c) => c.id === activeId);
  const delta = activeChoice ? score - baseScore : 0;

  // slot-text only rolls on text *changes*, not on mount — same entrance
  // trick as the score page: start at the floor, settle on the real value.
  useEffect(() => {
    setScore(mock.currentScore);
  }, []);

  // Tapping a choice previews its score; tapping it again clears the preview.
  function choose(choice) {
    const nextId = activeId === choice.id ? null : choice.id;
    const next = nextId
      ? Math.min(Math.max(baseScore + choice.delta, SCORE_MIN), SCORE_MAX)
      : baseScore;
    setDirection(next > score ? "up" : "down");
    setActiveId(nextId);
    setScore(next);
  }

  return (
    <div className="flex flex-1 flex-col bg-background-secondary">
      <NavBar backHref="/score" border={false} />

      {/* Predicted score + gauge — light-mode take on the score page hero */}
      <section className="flex flex-col gap-4 px-4 pt-2 pb-6 bg-white">
        <div className="flex flex-col gap-0.5">
          <p className="text-[10px] leading-4 font-medium tracking-[1px] text-content-secondary uppercase">
            Predicted score
          </p>
          {/* Fixed height so the SSR-empty → built → rolling states of the
              slot-text number never change the row height. */}
          <p className="flex h-14 items-baseline gap-2">
            <SlotText
              text={String(score)}
              options={{ direction }}
              className="text-3xl font-bold text-content-primary"
            />
            {activeChoice && (
              <span
                className={`flex items-center gap-0.5 self-baseline rounded-full px-2 py-0.5 text-[13px] leading-4 font-bold text-content-inverse-primary ${
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
        </div>

        <div className="flex flex-col gap-2">
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
          <div className="flex w-full items-center justify-between px-px">
            {SCORE_TICKS.map((tick, i) => {
              if (i === 0 || i === SCORE_TICKS.length - 1) {
                return (
                  <span
                    key={tick}
                    className="text-[13px] leading-4 font-medium text-content-primary"
                  >
                    {i === 0 ? 900 : 300}
                  </span>
                );
              }
              return (
                <span
                  key={tick}
                  className={`size-1.5 rounded-full transition-colors duration-500 ${
                    i === activeTick
                      ? "bg-content-primary"
                      : "bg-content-tertiary"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Choice grid */}
      <section className="flex flex-col gap-4 px-4 pt-4 pb-8 ">
        <h2 className="text-center text-[12px] leading-4 font-medium tracking-[1px] text-content-secondary uppercase">
          {mock.predictor.heading}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {mock.predictor.choices.map((choice) => (
            <ChoiceCard
              key={choice.id}
              choice={choice}
              active={activeId === choice.id}
              onClick={() => choose(choice)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
